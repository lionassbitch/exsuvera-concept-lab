# Aesthetic Presets

Starting points for projects with no existing system. Each is a coherent set of
decisions, not a theme to apply verbatim — take the logic, swap the values for
the project's brand.

Two things to get right when using one: **commit fully** (half of an editorial
direction plus half of a neutral one reads as neither), and **check the fit** —
a data-dense admin tool in Editorial Brutalist is unusable, and a fashion drop
page in Quiet Product is forgettable.

---

## Editorial Brutalist

Print-derived. Enormous display type, hairline rules, hard-edged blocks of flat
color, monospace micro-labels. High drama, low ornament. Suits manifestos,
portfolios, concept sites, brand launches, anything meant to be *read* and
remembered.

```
Type      Display: high-contrast serif (Playfair, GT Sectra, Instrument Serif)
          Body: neutral sans
          Labels: mono, 9–11px, uppercase, 0.15em tracking
Scale     Extreme — clamp(5rem, 12vw, 14rem) display against 10px labels
Leading   0.8–0.85 on display, 1.65 on body
Color     Off-white or near-black field, one saturated accent used at scale
Surfaces  1px lines only. No shadows, no radius, or radius on one element type
Layout    Asymmetric grids (1.2fr .8fr), full-bleed sections, negative margins
          to collapse borders between cells
Motion    Almost none. Position and weight carry the energy
```

Example token set:

```css
--bg: #f5f0e8;  --text: #111;  --accent: #c6ff4a;
--serif: "Instrument Serif", ui-serif, Georgia, serif;
--mono: ui-monospace, "SF Mono", Menlo, monospace;
```

What makes it work: the size ratio between display and label. Compress that and
it collapses into an ordinary page. What breaks it: rounded corners, drop
shadows, and a second accent.

*(This is the direction the `exsuvera-concept-lab` app itself uses — see
`app/globals.css` for a worked example of the full system.)*

---

## Quiet Product

The default for software people use daily. Gets out of the way. Suits
dashboards, settings, admin, B2B tools — anywhere the content is the point and
the chrome should be invisible.

```
Type      One sans family, 3 weights (400/500/600)
Scale     1.2 ratio, 13/16/19/23/28. No display sizes
Leading   1.5 body, 1.25 headings
Color     Tinted neutral ramp (9–11 steps), one accent for primary action only
Surfaces  Pick one: hairline borders (crisper) or a 3-step shadow scale (softer)
Radius    6–8px, consistent
Density   Comfortable by default, with a compact option for power users
Motion    120–200ms, transform/opacity only
```

What makes it work: relentless consistency and no decoration. What breaks it:
gradients, an accent used decoratively, and per-component spacing.

---

## Warm Editorial

Long-form reading. Serif body, warm paper background, generous measure. Suits
blogs, documentation, essays, product marketing that leans on writing.

```
Type      Body: readable serif (Charter, Source Serif, Literata) at 19–21px
          Headings: same family, or a contrasting sans
Measure   60–68ch, hard limit
Leading   1.65–1.75 body
Color     Warm off-white (#faf8f4) or warm dark (#1a1815). Text at #2a2622
          Accent: muted, desaturated — used for links only
Surfaces  Rules, not boxes. Wide margins instead of containers
Motion    None beyond smooth scroll
```

What makes it work: the measure and the leading. What breaks it: cards, sidebars
competing with the column, and a saturated accent.

---

## Neon Dark

High-contrast dark field with luminous accents. Suits developer tools, music and
gaming, crypto, anything that wants to read as technical and alive. Easy to get
wrong — the difference between striking and garish is restraint in how much of
the accent appears.

```
Type      Sans UI, mono for data and labels. Mono carries a lot of the character
Color     Field: #0d0d12 – #16161d (never pure black)
          Text: #e8e8ea primary, #9a9aa5 muted
          Accent: one high-chroma hue, OKLCH lightness ~0.75+
          Second accent only if structurally distinct (e.g. state vs. brand)
Surfaces  Elevation via surface lightness, not shadow. +3–5% per level
Glow      Sparingly — a soft outer glow on the single focal element, nowhere else
Motion    150–250ms. Glow pulses read as decorative fast; avoid on repeat actions
```

What makes it work: 95% dark neutral, 5% accent. What breaks it: accent on every
border, glow on everything, and saturated colors at body-text size.

---

## Soft Depth

Layered, tactile, generous radii and diffuse shadows. Suits consumer apps,
onboarding, mobile-first products, anything that wants to feel approachable.

```
Type      Rounded or humanist sans, 400/600
Scale     1.2 ratio, comfortable sizes — 16px body minimum, often 17
Color     Light tinted neutrals, mid-saturation accent, generous white space
Radius    12–16px on cards, 8px on controls, full-round on pills
Shadows   3-step scale, each two layers:
          0 1px 2px rgb(0 0 0 / .06), 0 8px 24px rgb(0 0 0 / .08)
Motion    200–300ms ease-out, subtle scale on press (0.97)
```

What makes it work: consistent depth logic — one shadow step per elevation
level, never mixed. What breaks it: borders *and* shadows on the same element,
and radius applied uniformly regardless of element size (a 16px radius on a
28px-tall chip is a pill wearing a mistake).

---

## Choosing

| If the product is… | Start with |
|---|---|
| Used all day, information-dense | Quiet Product |
| Read start to finish | Warm Editorial |
| A statement — brand, launch, concept | Editorial Brutalist |
| Technical, dark-first, for developers | Neon Dark |
| Consumer-facing, mobile-first | Soft Depth |

When the brand already has a strong voice, let it override the table. When it
doesn't, the table is a better starting point than assembling one from scratch,
because every row above is internally consistent — and internal consistency is
most of what "looks designed" means.
