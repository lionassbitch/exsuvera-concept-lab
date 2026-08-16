# Type and Space

Contents:
- [The type scale](#the-type-scale)
- [Choosing faces](#choosing-faces)
- [Line-height, measure, tracking](#line-height-measure-tracking)
- [Fluid type](#fluid-type)
- [The spacing scale](#the-spacing-scale)
- [Spacing as grammar](#spacing-as-grammar)
- [Grids](#grids)
- [Common failures](#common-failures)

## The type scale

Pick a base size and a ratio, generate the steps, and use only those. The
constraint is the point: an interface where every size is one of six values
looks composed, and one where sizes were chosen per-component looks accidental.

Ratios and what they're for:

| Ratio | Name | Character |
|---|---|---|
| 1.125 | Major second | Dense UI, dashboards, tables. Steps are subtle. |
| 1.200 | Minor third | Safe default for product UI. |
| 1.250 | Major third | Marketing pages, comfortable contrast. |
| 1.333 | Perfect fourth | Editorial. Strong jumps. |
| 1.500 | Perfect fifth | Dramatic. Needs few steps or it runs away. |

`scripts/scale.py --base 16 --ratio 1.25` prints the values as rem, px, and CSS
custom properties.

Two practical adjustments to the pure math:

**Break the ratio at the top.** A display heading often wants to be much larger
than the next step up gives you. Jumping from a 40px H1 to a 96px display is a
deliberate move, not a violation — editorial layouts get their energy from
exactly that gap. Keep the ratio strict in the body range where consistency
reads as quality, and take one big leap at the top where drama reads as
confidence.

**Round to whole pixels below ~24px.** 18.75px renders worse than 19px and no
one can tell you rounded.

A workable default set for product UI, base 16, ratio 1.2:

```
11px  micro     labels, legal, table meta (use sparingly, needs high contrast)
13px  small     secondary text, captions, form hints
16px  body      the default; never smaller for sustained reading
19px  lead      intro paragraphs, large-format body
23px  h3
28px  h2
40px  h1
64px+ display   marketing only
```

## Choosing faces

One family with a real weight range covers almost everything. Reach for a second
only when it earns its keep by carrying a distinct role — a serif for long-form
reading against a sans UI, or a monospace for labels, code, and data.

Three families is nearly always one too many. If a third seems necessary, the
usual actual problem is that two of the roles are the same role.

Pairing that works: high-contrast serif display + neutral sans body + mono for
micro-labels. The mono labels are what make it look intentional — small,
uppercase, tracked out, they read as a system.

When self-hosting isn't set up, the system stack is genuinely fine and costs
nothing:

```css
font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
font-family: ui-serif, Georgia, "Times New Roman", serif;
font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
```

If you do load webfonts: `font-display: swap`, preload the one face that appears
above the fold, subset to the characters you need, and stick to variable fonts
when available — one file instead of six.

## Line-height, measure, tracking

**Line-height moves inversely to size.** Large text needs tighter leading;
small text needs looser. Uniform `leading-relaxed` across a page makes headings
look untethered and body text look cramped.

```
Display (48px+)   0.85 – 1.0
Headings (24–40)  1.1  – 1.25
Body (16–19)      1.5  – 1.7
Small (11–13)     1.4  – 1.5
```

**Measure** — the line length of body text — belongs between 45 and 75
characters. Beyond ~80 the eye loses the return sweep. `max-width: 65ch` solves
this in one declaration and is one of the highest-value single lines in CSS.

**Tracking.** Tighten large type (`-0.02em` to `-0.05em` on display sizes;
optical sizing means large text looks loose at default spacing). Open up small
uppercase text (`0.08em` to `0.18em`) — caps set at normal tracking look jammed.
Leave body text alone.

**Never use faux styles.** `font-weight: bold` on a family without a bold weight
produces a synthesized smear. Same for oblique. Load the real weight or pick a
different one.

## Fluid type

`clamp()` handles responsive type without breakpoints:

```css
font-size: clamp(2.5rem, 8vw, 7rem);
```

Read as: never below 2.5rem, never above 7rem, 8vw in between. Use it for
display sizes where the range is dramatic. Body text rarely benefits — it should
be ~16px everywhere, and shrinking it on mobile is a common and harmful reflex.

Keep the minimum genuinely readable. A `clamp()` whose floor is 12px fails at
320px wide regardless of how good it looks on a laptop.

## The spacing scale

Use one scale, derived from a base unit of 4px or 8px. Tailwind's default scale
is exactly this and is a reasonable thing to inherit.

```
4  8  12  16  24  32  48  64  96  128  192
```

The gaps widen as values grow, which matters: the difference between 4 and 8 is
meaningful, the difference between 100 and 104 is not.

Every margin, padding, and gap comes from this list. When something needs 30px,
the answer is 32 — and if 32 genuinely doesn't work, the problem is usually
elsewhere in the layout.

## Spacing as grammar

Space is how an interface says what belongs to what. Proximity outranks borders,
backgrounds, and headings in how strongly it groups things.

The rule that fixes most "cluttered" complaints: **space between groups must
clearly exceed space within a group.** A label 8px above its input, and 32px
between one field and the next, reads instantly. Both at 16px reads as a wall.

```
Within a component      4 – 12
Between components      16 – 32
Between sections        64 – 128
Page margins            24 (mobile) – 96 (desktop), or a vw-based value
```

Related, and frequently missed: space above a heading should be larger than
space below it. A heading belongs to the content that follows, and equal spacing
makes it float ambiguously between two blocks.

## Grids

Most interfaces need one 12-column grid with a consistent gutter, or a handful
of hard-coded asymmetric splits. Both are fine; mixing many ad-hoc splits is
not.

Asymmetry is a design tool: a `1.2fr .8fr` hero is more interesting than
`1fr 1fr` and costs nothing. What matters is that you reuse the same few ratios
so they read as a system.

For content-driven grids, `repeat(auto-fit, minmax(280px, 1fr))` adapts without
breakpoints. For layouts where the composition matters, name the breakpoints and
control them explicitly — auto-fit will happily produce a lonely third card.

Two things worth deciding early: whether the page has a max width (and what
happens on ultrawide displays), and whether anything bleeds full-width. Full-
bleed sections against a constrained body is a strong, cheap editorial move.

## Common failures

**Everything is 16px semibold.** No entry point. Fix hierarchy before anything
else — it usually resolves several other complaints at once.

**Uniform padding everywhere.** `p-4` on every surface flattens all grouping.
Vary it by role.

**Type scale with no dynamics.** 16/18/20/24 is a scale in name only. Stretch
the top end.

**Centered body copy.** Fine for one short hero line, hard to read for anything
longer — every line starts at a different x-position.

**Text over an unprepared image.** Add a scrim, a solid panel, or a duotone
treatment. A bright photo will eventually appear and the text will vanish.

**Shrinking body text on mobile.** Mobile needs *more* legibility, not less.

**Justified text on the web.** Without hyphenation control it produces rivers of
whitespace. Set ragged-right.
