#!/usr/bin/env python3
"""WCAG contrast checker. No dependencies.

Perceived contrast and computed contrast diverge badly for saturated colors,
so checking by eye is unreliable. This computes it.

Usage:
    contrast.py "#111111" "#c6ff4a"          one pair
    contrast.py --palette tokens.json        check declared pairs
    contrast.py --palette tokens.json --grid full fg/bg matrix
    contrast.py --palette tokens.json --fix  suggest a passing adjustment

Palette file: flat JSON of name -> color.
    {"bg": "#f5f0e8", "text": "#111", "accent": "#c6ff4a", "muted": "#6b6b6b"}

Colors accepted: #rgb, #rrggbb, rgb(r g b), rgb(r, g, b), or named CSS basics.
Exits non-zero if any checked pair fails AA, so it can gate CI.
"""

from __future__ import annotations

import argparse
import itertools
import json
import re
import sys

NAMED = {
    "black": "#000000", "white": "#ffffff", "red": "#ff0000",
    "green": "#008000", "blue": "#0000ff", "gray": "#808080",
    "grey": "#808080", "silver": "#c0c0c0", "transparent": None,
}

# Pairs whose role we can infer from conventional token names.
LIKELY_BG = ("bg", "background", "surface", "canvas", "paper", "card", "field")
LIKELY_FG = ("text", "fg", "foreground", "ink", "content", "label", "muted",
             "subtle", "placeholder", "icon")


def parse_color(value: str) -> tuple[int, int, int]:
    """Parse a CSS-ish color into an (r, g, b) tuple of 0-255 ints."""
    s = value.strip().lower()
    if s in NAMED:
        if NAMED[s] is None:
            raise ValueError("transparent has no contrast value")
        s = NAMED[s]

    if s.startswith("#"):
        h = s[1:]
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        if len(h) == 8:  # #rrggbbaa — alpha ignored, see note in check()
            h = h[:6]
        if len(h) != 6 or not re.fullmatch(r"[0-9a-f]{6}", h):
            raise ValueError(f"bad hex color: {value!r}")
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))  # type: ignore

    m = re.fullmatch(r"rgba?\(([^)]+)\)", s)
    if m:
        parts = re.split(r"[,\s/]+", m.group(1).strip())
        nums = []
        for p in parts[:3]:
            if p.endswith("%"):
                nums.append(round(float(p[:-1]) * 255 / 100))
            else:
                nums.append(round(float(p)))
        if len(nums) != 3:
            raise ValueError(f"bad rgb color: {value!r}")
        return tuple(max(0, min(255, n)) for n in nums)  # type: ignore

    raise ValueError(
        f"unrecognized color: {value!r} (use hex, rgb(), or a basic CSS name)"
    )


def relative_luminance(rgb: tuple[int, int, int]) -> float:
    """WCAG 2.x relative luminance."""
    def channel(c: int) -> float:
        srgb = c / 255
        return srgb / 12.92 if srgb <= 0.04045 else ((srgb + 0.055) / 1.055) ** 2.4
    r, g, b = (channel(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(a: str, b: str) -> float:
    la, lb = relative_luminance(parse_color(a)), relative_luminance(parse_color(b))
    lighter, darker = max(la, lb), min(la, lb)
    return (lighter + 0.05) / (darker + 0.05)


def verdicts(ratio: float) -> dict[str, bool]:
    return {
        "AA body (4.5:1)": ratio >= 4.5,
        "AA large (3:1)": ratio >= 3.0,
        "AAA body (7:1)": ratio >= 7.0,
        "UI / border (3:1)": ratio >= 3.0,
    }


def mark(ok: bool) -> str:
    return "PASS" if ok else "FAIL"


def report_pair(fg: str, bg: str, label: str = "") -> bool:
    ratio = contrast_ratio(fg, bg)
    v = verdicts(ratio)
    head = f"{label}  " if label else ""
    print(f"{head}{fg} on {bg}  ->  {ratio:.2f}:1")
    for name, ok in v.items():
        print(f"    {mark(ok):4}  {name}")
    print()
    return v["AA body (4.5:1)"]


def lighten(rgb: tuple[int, int, int], amount: float) -> tuple[int, int, int]:
    return tuple(round(c + (255 - c) * amount) for c in rgb)  # type: ignore


def darken(rgb: tuple[int, int, int], amount: float) -> tuple[int, int, int]:
    return tuple(round(c * (1 - amount)) for c in rgb)  # type: ignore


def to_hex(rgb: tuple[int, int, int]) -> str:
    return "#%02x%02x%02x" % rgb


def suggest(fg: str, bg: str, target: float = 4.5) -> str | None:
    """Nudge the foreground toward black or white until it clears `target`.

    Adjusting the foreground rather than the background is almost always the
    right move — backgrounds are usually the brand surface and shared by many
    elements, while a single text token can move without consequence.
    """
    fg_rgb, bg_rgb = parse_color(fg), parse_color(bg)
    bg_lum = relative_luminance(bg_rgb)
    # Push away from the background: darken on light backgrounds, lighten on dark.
    transform = darken if bg_lum > 0.5 else lighten
    for step in range(1, 21):
        candidate = transform(fg_rgb, step * 0.05)
        if contrast_ratio(to_hex(candidate), bg) >= target:
            return to_hex(candidate)
    return None


def infer_pairs(palette: dict[str, str]) -> list[tuple[str, str]]:
    """Guess fg/bg pairs from conventional token names."""
    bgs = [k for k in palette if any(t in k.lower() for t in LIKELY_BG)]
    fgs = [k for k in palette if any(t in k.lower() for t in LIKELY_FG)]
    return [(f, b) for b in bgs for f in fgs]


def grid(palette: dict[str, str]) -> bool:
    names = list(palette)
    width = max(len(n) for n in names) + 2
    print("Full matrix (AA body 4.5:1 unless noted)\n")
    print(" " * width + "".join(n[:7].ljust(9) for n in names))
    all_ok = True
    for a in names:
        row = a.ljust(width)
        for b in names:
            if a == b:
                row += "—".ljust(9)
                continue
            r = contrast_ratio(palette[a], palette[b])
            flag = "" if r >= 4.5 else ("^" if r >= 3.0 else "!")
            row += f"{r:.1f}{flag}".ljust(9)
        print(row)
    print("\n  ^ = clears 3:1 (large text / UI only)   ! = below 3:1")
    return all_ok


def main() -> int:
    ap = argparse.ArgumentParser(
        description="WCAG contrast checker",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__.split("Usage:", 1)[1] if "Usage:" in __doc__ else None,
    )
    ap.add_argument("colors", nargs="*", help="two colors: FOREGROUND BACKGROUND")
    ap.add_argument("--palette", help="JSON file of name -> color")
    ap.add_argument("--grid", action="store_true", help="full matrix of all pairs")
    ap.add_argument("--fix", action="store_true",
                    help="suggest an adjusted foreground for failing pairs")
    ap.add_argument("--target", type=float, default=4.5,
                    help="target ratio for --fix (default 4.5)")
    args = ap.parse_args()

    failures = 0

    try:
        if args.palette:
            with open(args.palette) as f:
                raw = json.load(f)
            palette = {k: v for k, v in raw.items() if isinstance(v, str)}
            if not palette:
                print("No string color values found in palette file.", file=sys.stderr)
                return 2

            if args.grid:
                grid(palette)
                return 0

            pairs = infer_pairs(palette)
            if not pairs:
                print("Could not infer fg/bg roles from token names; "
                      "showing all combinations instead.\n")
                pairs = list(itertools.permutations(palette, 2))

            for fg_name, bg_name in pairs:
                ok = report_pair(palette[fg_name], palette[bg_name],
                                 label=f"[{fg_name} / {bg_name}]")
                if not ok:
                    failures += 1
                    if args.fix:
                        s = suggest(palette[fg_name], palette[bg_name], args.target)
                        if s:
                            print(f"    try {fg_name} = {s} "
                                  f"({contrast_ratio(s, palette[bg_name]):.2f}:1)\n")
                        else:
                            print(f"    no adjustment of {fg_name} alone reaches "
                                  f"{args.target}:1 — change the background\n")

        elif len(args.colors) == 2:
            fg, bg = args.colors
            if not report_pair(fg, bg):
                failures += 1
                if args.fix:
                    s = suggest(fg, bg, args.target)
                    print(f"    try {s} ({contrast_ratio(s, bg):.2f}:1)\n" if s
                          else "    change the background instead\n")
        else:
            ap.print_help()
            return 2

    except (ValueError, OSError, json.JSONDecodeError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 2

    if failures:
        print(f"{failures} pair(s) below AA body contrast (4.5:1).")
        return 1
    print("All checked pairs clear AA body contrast.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
