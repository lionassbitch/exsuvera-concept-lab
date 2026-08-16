#!/usr/bin/env python3
"""Generate a modular type scale and a matching spacing scale. No dependencies.

Deciding the scale once and using only its steps is what makes an interface
read as composed. This prints the steps in a form you can paste.

Usage:
    scale.py                                  defaults: base 16, ratio 1.25
    scale.py --base 16 --ratio 1.333
    scale.py --ratio golden --format css
    scale.py --format tailwind
    scale.py --format json

Formats: table (default), css (custom properties), tailwind (@theme block), json.
"""

from __future__ import annotations

import argparse
import json
import sys

RATIOS = {
    "minor-second": 1.067,
    "major-second": 1.125,
    "minor-third": 1.200,
    "major-third": 1.250,
    "perfect-fourth": 1.333,
    "augmented-fourth": 1.414,
    "perfect-fifth": 1.500,
    "golden": 1.618,
}

# Steps below the base are negative; the base is step 0.
DEFAULT_STEPS = list(range(-2, 8))

STEP_NAMES = {
    -2: "2xs", -1: "xs", 0: "base", 1: "sm-heading", 2: "h3",
    3: "h2", 4: "h1", 5: "display", 6: "display-lg", 7: "display-xl",
}

# Recommended line-height by rendered size. Leading tightens as size grows —
# uniform leading makes headings look untethered and body text look cramped.
def line_height(px: float) -> float:
    if px >= 48:
        return 0.95
    if px >= 32:
        return 1.15
    if px >= 24:
        return 1.25
    if px >= 19:
        return 1.45
    if px >= 15:
        return 1.6
    return 1.45


# Tracking: tighten large type, open up small type.
def tracking(px: float) -> str:
    if px >= 48:
        return "-0.04em"
    if px >= 28:
        return "-0.02em"
    if px <= 12:
        return "0.02em"
    return "0"


SPACING = [2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192]
SPACING_NAMES = ["0.5", "1", "2", "3", "4", "6", "8", "12", "16", "24", "32", "48"]


def round_size(px: float) -> float:
    """Whole pixels below 24px — subpixel sizes render worse and read the same."""
    return round(px) if px < 24 else round(px * 2) / 2


def build(base: float, ratio: float, steps: list[int]) -> list[dict]:
    out = []
    for s in steps:
        px = round_size(base * (ratio ** s))
        out.append({
            "step": s,
            "name": STEP_NAMES.get(s, f"step{s}"),
            "px": px,
            "rem": round(px / 16, 4),
            "line_height": line_height(px),
            "tracking": tracking(px),
        })
    return out


def fmt_table(scale: list[dict], ratio: float, base: float) -> str:
    lines = [f"Type scale — base {base:g}px, ratio {ratio:g}", ""]
    lines.append(f"{'step':>5}  {'name':<12} {'px':>7}  {'rem':>8}  "
                 f"{'leading':>8}  {'tracking':>9}")
    lines.append("-" * 58)
    for s in scale:
        lines.append(
            f"{s['step']:>5}  {s['name']:<12} {s['px']:>6g}p  "
            f"{s['rem']:>7}r  {s['line_height']:>8}  {s['tracking']:>9}"
        )
    lines += ["", "Spacing scale (4px base)", ""]
    lines.append("  " + "  ".join(f"{v}" for v in SPACING))
    lines += [
        "",
        "Notes:",
        "  Every margin, padding, and gap comes from the spacing row above.",
        "  Space between groups must clearly exceed space within a group —",
        "  that single rule resolves most 'this feels cluttered' reports.",
        "  Break the ratio at the top if you want editorial drama: a big jump",
        "  from h1 to display reads as confidence, not as inconsistency.",
    ]
    return "\n".join(lines)


def fmt_css(scale: list[dict]) -> str:
    lines = [":root {", "  /* type */"]
    for s in scale:
        lines.append(f"  --text-{s['name']}: {s['rem']}rem;")
    lines.append("")
    lines.append("  /* leading */")
    for s in scale:
        lines.append(f"  --leading-{s['name']}: {s['line_height']};")
    lines.append("")
    lines.append("  /* spacing */")
    for name, v in zip(SPACING_NAMES, SPACING):
        lines.append(f"  --space-{name}: {v / 16:g}rem;")
    lines.append("}")
    return "\n".join(lines)


def fmt_tailwind(scale: list[dict]) -> str:
    """Tailwind v4 @theme block. For v3, move these into theme.extend in JS."""
    lines = ["@theme {"]
    for s in scale:
        lines.append(
            f"  --text-{s['name']}: {s['rem']}rem;"
            f"\n  --text-{s['name']}--line-height: {s['line_height']};"
            f"\n  --text-{s['name']}--letter-spacing: {s['tracking']};"
        )
    lines.append("}")
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description="Modular type and spacing scale generator")
    ap.add_argument("--base", type=float, default=16, help="base font size in px")
    ap.add_argument("--ratio", default="major-third",
                    help="a number, or one of: " + ", ".join(RATIOS))
    ap.add_argument("--min-step", type=int, default=DEFAULT_STEPS[0])
    ap.add_argument("--max-step", type=int, default=DEFAULT_STEPS[-1])
    ap.add_argument("--format", choices=["table", "css", "tailwind", "json"],
                    default="table")
    args = ap.parse_args()

    try:
        ratio = RATIOS[args.ratio] if args.ratio in RATIOS else float(args.ratio)
    except ValueError:
        print(f"error: unknown ratio {args.ratio!r}. Use a number or one of: "
              + ", ".join(RATIOS), file=sys.stderr)
        return 2

    if args.min_step > args.max_step:
        print("error: --min-step must not exceed --max-step", file=sys.stderr)
        return 2

    scale = build(args.base, ratio, list(range(args.min_step, args.max_step + 1)))

    if args.format == "table":
        print(fmt_table(scale, ratio, args.base))
    elif args.format == "css":
        print(fmt_css(scale))
    elif args.format == "tailwind":
        print(fmt_tailwind(scale))
    else:
        print(json.dumps({
            "base": args.base, "ratio": ratio,
            "type": scale,
            "spacing": dict(zip(SPACING_NAMES, SPACING)),
        }, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
