---
name: ui-ux
description: Design and critique user interfaces — layout, hierarchy, typography, color, spacing, states, motion, accessibility, and whole flows. Use this whenever the work touches how something looks or feels to use, including "design a landing page", "this page looks off / cheap / generic", "make it feel more premium", "review my UI", "pick a palette or type pairing", "improve this onboarding flow", "why does this feel cluttered", redesigns, design systems, empty and error states, mobile layouts, dark mode, and any request to build a screen where the visual result actually matters. Reach for it *before* writing UI code, not after — these decisions are far cheaper to make up front, and a screen built without them usually has to be rebuilt. Also use it when a user is dissatisfied with a UI but can't articulate why. Pairs with frontend-pro-max, which implements what this skill specifies.
---

# UI/UX

This skill is for making interface decisions that hold up: what goes on the
screen, what it looks like, what it does when things go wrong, and why each of
those is the right call.

The failure mode it exists to prevent is the interface that is technically
complete and visually dead — even margins, even weights, a card grid, a blue
button, nothing wrong and nothing right. That happens when design decisions get
made implicitly, one component at a time, while attention is on the code.
Deciding structure and hierarchy *first*, as a distinct pass, is what avoids it.

## Before designing anything: read the room

Spend a few minutes learning what already exists. Designing against an existing
system is a different job from designing from zero, and guessing wrong wastes
the whole pass.

Look for, in roughly this order:

- **Design tokens** — `globals.css`, `tailwind.config.*`, `theme.*`, a
  `tokens/` directory, CSS custom properties. These are the existing vocabulary.
- **The most finished screen in the project.** Whatever is most complete is the
  de facto standard; match it or consciously supersede it.
- **Component library** — shadcn/ui, Radix, MUI, or hand-rolled primitives.
  Reusing a primitive beats inventing a sibling of it.
- **Brand assets** — logo, marketing site, README, existing color choices.
- **Constraints** — RTL, i18n, dark mode, dense data, mobile-first, an existing
  a11y commitment.

When there is a real system in place, your job is to extend its logic, not to
import your own taste. When there is nothing, say so and propose a direction.

## The order of operations

Design in this order. Each layer constrains the next, and working out of order
means redoing the earlier ones.

**1. Structure.** What is this screen *for*? Name the one job. List the content
in priority order — what must be understood first, second, third. Cut anything
that serves no one. Most cluttered interfaces are a priority problem wearing a
visual-design costume.

**2. Hierarchy.** Make the priority order visible without reading. Rank comes
from contrast — size, weight, color, and above all *space*. One clear focal
point per view. If three things are shouting, nothing is.

**3. Layout.** Choose a grid and hold it. Align to a small number of edges;
scattered alignments read as sloppiness even when nobody can point at why.
Group by proximity — related things sit close, unrelated things get a gap that
means something.

**4. Type.** Set the scale before setting any individual text. Two families is
plenty (often one, with weights doing the work). See `references/type-and-space.md`.

**5. Color.** Neutrals carry the page; one accent does real work. Assign roles
before picking hex values. See `references/color-and-contrast.md`.

**6. States.** Hover, focus, active, disabled, loading, empty, error, first-run,
and too-much-data. These are not edge cases — for most users, some of them *are*
the product. See `references/states-and-motion.md`.

**7. Motion.** Last, and sparingly. Motion should explain a change, not announce
itself. Same reference file.

## Decide, don't survey

Present a recommendation and its reasoning, not a menu of three directions with
the choice punted back. Offering options reads as thoroughness but usually means
the hard call went unmade — and the person asking generally has less context to
make it than you do.

When two directions genuinely serve different goals, name both in one sentence
each, say which you'd ship and why, and proceed with it. That is a decision with
its work shown; a menu is not.

## What makes an interface look designed

These are the levers that reliably separate deliberate work from default work:

- **One idea, committed to.** A single strong organizing device — an oversized
  display face, an aggressive grid, a hard edge, a restrained monochrome — beats
  four mild ones. Mild plus mild reads as no opinion.
- **Space as a material.** Generous, *uneven* space. Real hierarchy needs
  different-sized gaps; uniform padding everywhere flattens meaning.
- **Extremes in the type scale.** Editorial work gets its charge from the jump
  between very large and very small. A scale that runs 16/18/20/24 has no
  dynamics.
- **Alignment you could draw a line through.** Fewer alignment edges, strictly
  held.
- **One accent, used for one thing.** An accent that appears on headings, icons,
  borders, and buttons has stopped signaling anything.
- **Real content.** Design with actual strings, actual names, actual worst-case
  lengths. Lorem ipsum hides every layout problem you have.
- **A consistent surface system.** Either lines define your boxes or elevation
  does. Both at once looks unresolved.

And the tells that read as generic — worth checking your own output against:
violet-to-blue gradients on everything, `rounded-2xl` applied uniformly,
glassmorphism as a default, a three-up feature grid with generic icons,
everything centered, emoji as bullets, six weights of gray doing six unrelated
jobs, and copy that says "Seamlessly" or "Elevate your". None of these are
forbidden; all of them are what you get when nothing was chosen.

## Accessibility is part of the design pass

Treated as a later audit, accessibility turns into a list of retrofits. Treated
as a design constraint, it mostly costs nothing:

- Body text at 4.5:1 contrast, large text and UI boundaries at 3:1. Verify
  rather than eyeball — run `scripts/contrast.py`.
- Never encode meaning in color alone; pair it with text, icon, or position.
- Design the focus state deliberately. It is the only navigation aid keyboard
  users have, and `outline: none` with no replacement removes it entirely.
- Interactive targets at least 44×44px on touch.
- Respect `prefers-reduced-motion` — vestibular disorders are common and the
  cost of honoring it is a media query.
- Check the design at 200% zoom and at 320px wide.

## Critique

When asked to review an interface — or before handing over your own — work
through `references/critique.md`. It's an ordered rubric that catches structural
problems before cosmetic ones, which matters because a hierarchy fix usually
dissolves five surface complaints at once.

Be specific and be kind. "The hierarchy is unclear" helps no one; "the section
heading and the body copy are both 16px semibold, so the eye has no entry point
— take the heading to 32px and drop the body to regular" is actionable. Lead
with what's working, keep the list ranked by impact, and cap it at the five
things that actually change the outcome.

## Deliverable

For a design pass, hand back something implementable — prose, not a mockup:

```
## Direction
One paragraph: the organizing idea and why it fits this product.

## Structure
The screen's job, and content in priority order.

## System
Type scale, spacing scale, palette with roles, radius/border/elevation rules.
Concrete values, and where they map onto existing tokens.

## Screens / sections
Per view: layout, what dominates, what recedes, behavior at each breakpoint.

## States
Empty, loading, error, and any state that is really a screen of its own.

## Notes
Accessibility calls, motion, and anything deliberately left out.
```

Skip sections that don't apply. A three-line answer to a three-line question is
the right size — this template is for a full pass, not a tax on every reply.

## Tools

- `scripts/contrast.py` — WCAG contrast ratios. Check one pair, or pass a
  palette to get a full foreground/background matrix with AA/AAA verdicts.
  Faster and more reliable than reasoning about luminance.
- `scripts/scale.py` — generate a modular type scale and a matching spacing
  scale, emitted as CSS custom properties or a Tailwind theme block.

Both are dependency-free Python 3. Run with `--help` for usage.

## References

Read these as needed rather than up front:

- `references/type-and-space.md` — scales, measure, line-height, vertical
  rhythm, and how spacing conveys grouping.
- `references/color-and-contrast.md` — building a palette from roles, neutrals,
  dark mode, semantic color.
- `references/states-and-motion.md` — the full state inventory, plus motion
  timing, easing, and what to animate.
- `references/critique.md` — the ordered review rubric.
- `references/presets.md` — named aesthetic directions with concrete values, for
  when a project has no system and needs a starting point fast.

## Handing off

Once the design is settled, implementation belongs to **frontend-pro-max**. Pass
it the system values and the state inventory rather than re-deriving them there
— that skill assumes the design questions are already answered, and will build
what you specify instead of inventing a parallel set of decisions.
