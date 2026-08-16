# CSS Architecture

Contents:
- [Tokens first](#tokens-first)
- [Tailwind v4](#tailwind-v4)
- [Tailwind v3](#tailwind-v3)
- [Conditional classes and variants](#conditional-classes-and-variants)
- [Dark mode](#dark-mode)
- [Responsive strategy](#responsive-strategy)
- [Container queries](#container-queries)
- [Modern CSS worth using](#modern-css-worth-using)
- [Specificity and the cascade](#specificity-and-the-cascade)
- [Common failures](#common-failures)

## Tokens first

Whatever the styling system, define the design decisions once as CSS custom
properties and reference them everywhere. This is what makes theming, dark mode,
and rebrands a one-file change rather than an archaeology project.

```css
:root {
  --bg: #f5f0e8;
  --surface: #fff;
  --border: #e2ddd2;
  --text: #111;
  --text-muted: #5c5c5c;
  --accent: #c6ff4a;
  --accent-fg: #111;
  --focus: #2949ff;

  --space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem;
  --space-4: 1rem;     --space-6: 1.5rem;  --space-8: 2rem;
  --space-12: 3rem;    --space-16: 4rem;

  --radius: 8px;
  --radius-lg: 16px;
}
```

Custom properties inherit and can be overridden per-scope, which makes them
better than preprocessor variables for anything themeable. They're also
readable in devtools, which matters more than it sounds.

A hardcoded `#3b82f6` in a component is a token that didn't get created. Every
one of them is a future find-and-replace.

## Tailwind v4

v4 moved configuration into CSS. There is no `tailwind.config.js` by default:

```css
@import "tailwindcss";

@theme {
  --color-bg: #f5f0e8;
  --color-accent: #c6ff4a;
  --font-display: "Instrument Serif", ui-serif, Georgia, serif;
  --text-display: 4.75rem;
  --text-display--line-height: 0.95;
  --text-display--letter-spacing: -0.04em;
  --spacing: 0.25rem;          /* base unit; the numeric scale multiplies it */
  --radius-card: 16px;
}
```

Names in `@theme` generate utilities: `--color-accent` yields `bg-accent`,
`text-accent`, `border-accent`. Type entries can carry paired line-height and
tracking, so `text-display` applies all three.

Other v4 changes worth knowing:

- Detects content automatically — no `content` array.
- Uses the native cascade layers, so overriding utilities behaves predictably.
- `@utility` defines custom utilities that respect variants.
- Colors default to OKLCH.
- Composable variants: `group-has-focus:`, `not-hover:`, `@md:` for containers.

The most common v4 mistake is importing a v3 config or reaching for
`tailwind.config.js` when the project is on v4. Check `package.json` first.

## Tailwind v3

Config lives in `tailwind.config.js`, and the `content` globs must cover every
file that contains class names or those classes get purged from the build.

The purge is why **class names cannot be constructed dynamically**:

```jsx
// Broken — Tailwind never sees "text-red-500" as a literal string.
<div className={`text-${color}-500`} />

// Works — full class names appear in the source.
const TONE = { danger: "text-red-500", ok: "text-green-600" };
<div className={TONE[tone]} />
```

This trips people in both v3 and v4; the scanner is a static text scan in both.

## Conditional classes and variants

For anything with more than two states, a variant map beats nested ternaries.
`cva` (class-variance-authority) is the common choice, but a plain object is
often enough:

```jsx
const button = cva("inline-flex items-center justify-center rounded-md " +
                   "font-medium transition-colors focus-visible:outline-2 " +
                   "focus-visible:outline-offset-2 disabled:opacity-50", {
  variants: {
    variant: {
      primary: "bg-accent text-accent-fg hover:bg-accent/90",
      ghost: "hover:bg-surface-alt",
      danger: "bg-danger text-white hover:bg-danger/90",
    },
    size: { sm: "h-8 px-3 text-sm", md: "h-10 px-4", lg: "h-12 px-6 text-lg" },
  },
  defaultVariants: { variant: "primary", size: "md" },
});
```

Use `tailwind-merge` (usually wrapped as `cn()`) when merging an incoming
`className`. Plain string concatenation leaves both `p-2` and `p-4` in the
class list, and which wins depends on stylesheet order rather than intent.

## Dark mode

Support three states, because "system" is the default and stamps no attribute:

```css
:root {                              /* light — always define the full palette */
  --bg: #faf9f7;
  --text: #18181b;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {  /* system dark, unless explicitly light */
    --bg: #0f0f12;
    --text: #e8e8ea;
  }
}

:root[data-theme="dark"] {           /* explicit dark wins in both directions */
  --bg: #0f0f12;
  --text: #e8e8ea;
}
```

Defining a color *only* inside a media query means it has no value in the other
mode. Define the full light palette on bare `:root` and override only what
changes.

Set `color-scheme: light dark` on `:root` so form controls, scrollbars, and the
default canvas follow. And set an explicit background on `body` — a transparent
body borrows whatever is behind it.

Re-check contrast in dark mode. The ratios are not preserved by inversion.

## Responsive strategy

Mobile-first: base styles are the small layout, breakpoints add complexity.
That's not just convention — it produces less CSS and degrades better on
unanticipated sizes.

Reduce breakpoint count by making layouts intrinsically flexible:

```css
/* No breakpoints, adapts continuously */
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
padding-inline: clamp(1rem, 5vw, 6rem);
font-size: clamp(2.5rem, 8vw, 7rem);
```

Reach for explicit breakpoints when the *composition* changes — a two-column
hero becoming stacked, a sidebar becoming a drawer — since `auto-fit` will
happily leave one lonely card on a row.

Test 320px (small phones are still in use), 768px, 1280px, and 1920px. The body
should never scroll horizontally; wide content — tables, code blocks, diagrams
— scrolls inside its own `overflow-x: auto` container.

## Container queries

A reusable component should respond to the space it's in, not to the viewport. A
card in a narrow sidebar and the same card in a wide main column want different
layouts at the same viewport width — which media queries cannot express.

```css
.card-grid { container-type: inline-size; }

@container (min-width: 480px) {
  .card { grid-template-columns: 200px 1fr; }
}
```

Tailwind v4: `@container` on the parent, `@md:grid-cols-2` on children.
Baseline in all modern browsers.

## Modern CSS worth using

- `:has()` — style a parent from its children. `.field:has(:invalid)` styles a
  wrapper when the input inside is invalid, which previously needed JS.
- `text-wrap: balance` on headings (even line lengths), `pretty` on body
  (prevents orphans).
- `aspect-ratio` instead of the padding-top hack.
- `gap` in flexbox — no more negative-margin gutters.
- `inset: 0` instead of four properties.
- Logical properties — `padding-inline`, `margin-block`, `border-inline-start`
  — which handle RTL automatically.
- `scroll-margin-top` on anchor targets so a sticky header doesn't cover them.
- `@supports` for genuinely new features.
- `accent-color` to theme native checkboxes and radios in one line.
- `field-sizing: content` for auto-growing textareas.
- `color-mix(in oklch, var(--accent) 20%, transparent)` for derived tints
  without a second token.

## Specificity and the cascade

Keep specificity low and flat. High-specificity selectors force higher-
specificity overrides, and the ratchet only turns one way.

- One class per rule where possible; avoid descendant chains and IDs.
- `@layer` to control ordering explicitly rather than by source position.
- `:where()` has zero specificity — useful for resets and defaults that should
  be trivially overridable.
- `!important` is a signal that the architecture lost. The exceptions are
  utility classes designed to win and the `prefers-reduced-motion` reset.

## Common failures

**Dynamic class name construction.** The scanner is static text matching. Map
full class names.

**Both `border` and `box-shadow` and a background tint on the same card.** Three
mechanisms for one job; pick one.

**Uniform radius regardless of element size.** A 16px radius on a 28px chip
looks like a mistake. Scale radius with the element, and when nesting, inner
radius = outer radius − padding.

**`outline: none` with no replacement.** Removes keyboard navigation entirely.
Style `:focus-visible` instead.

**Fixed heights on text containers.** Translations run 30% longer; content
overflows or clips. Use `min-height`.

**`100vh` on mobile.** Mobile browser chrome makes `vh` unreliable. Use `100dvh`
(dynamic viewport height), with `100vh` as a fallback for old browsers.

**z-index escalation.** Define a small scale as tokens (`--z-dropdown: 10`,
`--z-modal: 100`) and use it. `z-index: 9999` means the stacking contexts were
never mapped.
