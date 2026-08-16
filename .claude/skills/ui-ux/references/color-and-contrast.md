# Color and Contrast

Contents:
- [Start with roles, not hexes](#start-with-roles-not-hexes)
- [Neutrals do the work](#neutrals-do-the-work)
- [The accent](#the-accent)
- [Semantic color](#semantic-color)
- [Contrast requirements](#contrast-requirements)
- [Dark mode](#dark-mode)
- [Surfaces: lines or elevation](#surfaces-lines-or-elevation)
- [Color spaces and gradients](#color-spaces-and-gradients)
- [Common failures](#common-failures)

## Start with roles, not hexes

Choosing "a nice blue" first and finding jobs for it later produces palettes
that fall apart the moment a disabled state or an error banner shows up. Name
the roles, then fill them:

```
--bg              page background
--surface         raised panels, cards
--surface-alt     secondary panels, hover fills
--border          hairlines, dividers
--text            primary text
--text-muted      secondary text
--text-subtle     tertiary — timestamps, meta
--accent          the one color that means "act here"
--accent-fg       text/icons on accent
--success --warning --danger  with matching -fg and -bg-subtle
--focus           focus ring (often accent, sometimes not)
```

Fifteen or so tokens covers a real product. When a new color is needed, first
check whether an existing role fits — palettes rot by accretion.

Ship them as CSS custom properties, defined once, referenced everywhere. That is
what makes theming, dark mode, and later rebrands a one-file change instead of a
find-and-replace across the codebase.

## Neutrals do the work

In almost every good interface, 90% of the surface is neutral and the color is a
punctuation mark. Getting the neutral ramp right matters more than the accent.

Build 9–11 steps from near-white to near-black. **Give them a slight hue cast**
rather than pure gray — neutrals tinted a few degrees toward the accent (or
toward warm, for editorial work) look considered, while `#808080` looks like
nothing was decided. Keep the cast consistent across the ramp.

Pure `#000` on `#fff` is harsher than it needs to be. `#111` on `#faf9f7` reads
better and still clears AAA comfortably. Cranked to pure black on pure white,
long-form text produces noticeable halation.

Spacing of the ramp is not linear — steps should be closer together at the
light end where perceptual differences are smaller. Generating the ramp in OKLCH
with even lightness steps handles this automatically.

## The accent

One accent, doing one job: marking the primary action and the current state. The
fastest way to make an interface feel unresolved is to also use it for headings,
icons, links, borders, and decorative fills. At that point it signals nothing.

If a second color is needed, make it structural (a dark brand color for large
fields) rather than a competing accent.

Accents work hardest when the surrounding page is quiet. A neon accent on a
near-monochrome page is striking; the same accent on a colorful page is noise.
Test the accent at its actual size — a color that sings as a 200px block can be
illegible as 11px label text.

## Semantic color

Success/warning/danger need three variants each to be usable: a solid fill, a
foreground that passes contrast on that fill, and a subtle background for
banners and rows.

Red and green as the sole differentiator fails for the ~4% of people with
deuteranopia or protanopia. Always pair semantic color with an icon, a label, or
a position. This is not a niche accommodation — it also covers grayscale
printing, bright sunlight, and low-quality displays.

Danger red and brand red should not be the same value if the brand is red. Users
learn that red means "stop" from your destructive actions.

## Contrast requirements

WCAG 2.1 AA, which is the practical floor:

| Content | Minimum |
|---|---|
| Body text (< 18.66px, or < 24px bold) | 4.5:1 |
| Large text (≥ 18.66px bold, or ≥ 24px) | 3:1 |
| UI component boundaries, icons, form borders | 3:1 |
| Focus indicators | 3:1 against adjacent colors |
| Decorative, disabled, or logo | exempt |

AAA is 7:1 for body text — worth targeting for long-form reading surfaces.

Verify rather than estimate. Perceived contrast and computed contrast diverge
badly for saturated colors: yellow-on-white looks like it might be fine and is
about 1.4:1. Run `scripts/contrast.py --palette tokens.json --grid` to get every
pairing checked at once.

Two spots that fail routinely and are easy to miss: placeholder text (often
inherits a muted token that only clears 3:1) and disabled controls (exempt from
WCAG, but if users need to *read* a disabled label, exemption doesn't help
them).

## Dark mode

Dark mode is not an inversion. Inverting produces glare and destroys depth.

- **Don't use pure black.** `#0d0d0f` – `#16161a` for the page. Pure black
  against bright text maximizes halation, and on OLED, scroll smearing.
- **Elevation runs the other way.** In light mode, raised surfaces cast shadows;
  in dark mode, raised surfaces get *lighter*. Shadows are nearly invisible on
  dark backgrounds, so surface lightness carries depth instead.
- **Desaturate.** Saturated colors vibrate against dark backgrounds. Pull
  saturation down 10–20% and raise lightness for accents.
- **Soften text.** `#e8e8ea` rather than `#fff` for body.
- **Re-check every contrast pair.** A palette that passes in light mode
  frequently fails in dark; the ratios are not preserved.

Implement with `prefers-color-scheme` plus a `[data-theme]` override so an
explicit user choice wins in both directions. Define the full light palette on
bare `:root` so nothing has its only definition inside a media query.

## Surfaces: lines or elevation

Pick one system for separating surfaces and hold it.

**Line-based** — hairline borders, flat fills, no shadows. Reads as precise,
editorial, technical. Needs the border color to clear 3:1 or the structure
disappears.

**Elevation-based** — shadows and layered surfaces, few or no borders. Reads as
soft, tactile, app-like. Needs a real shadow scale (2–4 steps), each a
combination of a tight dark shadow and a wide soft one; a single `0 4px 6px
rgba(0,0,0,.1)` on everything is the flat look with extra blur.

Mixing them — cards with both a 1px border and a drop shadow and a background
tint — is the most common cause of an interface reading as unresolved. Three
mechanisms are doing one job, so none of them looks deliberate.

## Color spaces and gradients

Work in OKLCH when the tooling allows. Its lightness axis is perceptually
uniform, which means a ramp with even lightness steps actually looks even, and
two hues at the same lightness actually look equally bright. In HSL, `hsl(60 100%
50%)` (yellow) and `hsl(240 100% 50%)` (blue) claim identical lightness and
differ by roughly 8:1 in perceived brightness.

```css
--accent: oklch(0.72 0.19 145);
--accent-hover: oklch(0.66 0.19 145);  /* one lightness step down */
```

Gradients interpolated in sRGB pass through a desaturated gray zone between
distant hues. `linear-gradient(in oklch, ...)` avoids it. Better still, keep
gradients between neighboring hues, or between two lightnesses of one hue.

Use gradients as atmosphere — a barely-perceptible wash across a large field —
rather than as a decoration on small elements. A gradient on every button and
card is the single loudest "generic AI output" signal there is.

## Common failures

**Six grays doing six unrelated jobs.** Consolidate to a ramp with named roles.

**The accent on everything.** Reserve it for action and state.

**Contrast checked by eye.** Run the script. Saturated colors are where
intuition fails hardest.

**Dark mode as an inversion.** Rebuild the ramp; re-verify every pair.

**Meaning carried by color alone.** Add an icon or a label.

**Hardcoded hexes scattered through components.** Every one is a token that
didn't get created, and the first theming request turns into an archaeology
project.
