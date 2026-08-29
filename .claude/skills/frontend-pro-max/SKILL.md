---
name: frontend-pro-max
description: Build production-grade frontend code — React/Next components, CSS and Tailwind architecture, state management, forms, data fetching, animation, responsive layout, accessibility wiring, and performance. Use this for any real UI implementation work, including "build this page", "make this component", "add a modal/table/form/dashboard", "convert this design to code", "why is this re-rendering", "this feels slow", "fix the layout on mobile", "make this accessible", refactoring UI code, or setting up a component system. Reach for it whenever UI code is about to be written or changed and the result needs to actually hold up — not a sketch. It assumes the design questions are settled; when they aren't, run the ui-ux skill first and implement what it specifies.
---

# Frontend Pro Max

This skill is for writing UI code that survives contact with real users, real
data, and real devices — as opposed to code that renders correctly once, in the
happy path, at 1440px, with three rows of seed data.

The gap between those two is almost never framework knowledge. It's the states
that were never wired, the list that was never virtualized, the focus that was
never trapped, the 90-character name that was never tried, and the thing that
was never actually loaded in a browser.

## Recon before writing

Match the codebase. A technically better pattern that nothing else in the repo
uses makes the codebase worse, because now there are two patterns.

```bash
cat package.json                      # framework, versions, scripts
ls app/ src/ components/ 2>/dev/null  # structure and conventions
```

Establish, quickly:

- **Framework and version.** React 19 vs 18 changes a lot (Actions, `use`, the
  ref-as-prop change, no more `forwardRef` requirement). Next App Router vs Pages
  Router changes almost everything. Check the actual version rather than assuming.
- **Styling system.** Tailwind (v3 config vs v4 `@theme`), CSS Modules, vanilla
  CSS, CSS-in-JS. Find the design tokens and use them instead of literals.
- **Component primitives.** shadcn/ui, Radix, Headless UI, or hand-rolled. Reuse
  before you build — and if you build, build in the same shape as the neighbors.
- **The scripts.** `build`, `test`, `lint`, `typecheck`. You'll need them at the
  end, and knowing they exist changes how you verify.
- **The most recently-written similar component.** It's the strongest available
  signal for how this team writes code.

## The bar

These are the things that separate shipped from demoed. Most are cheap when done
during, and expensive when retrofitted.

**Every async surface has four states wired, not one.** Loading, empty, error,
and success. If you find yourself writing only the success branch, the component
is unfinished — and the missing branches are the ones users hit first.

**No layout shift.** Explicit `width`/`height` (or `aspect-ratio`) on images and
media. Skeletons that match the real content's dimensions. Reserved space for
anything that arrives late. Content jumping under a user's cursor is the single
most damaging thing for perceived quality.

**Keyboard works end to end.** Tab reaches everything interactive, in visual
order. `:focus-visible` is styled. Escape closes overlays. Enter and Space
activate. Nothing is reachable only by hover or only by pointer.

**Real semantics.** `<button>` for actions, `<a>` for navigation, `<ul>` for
lists, one `<h1>` with headings in order. A `<div onClick>` is missing keyboard
handling, focusability, role, and the browser's own behavior — the native
element gives you all four for free.

**The worst case renders.** Long strings, empty strings, missing images, 500
rows, 0 rows, RTL if the project supports it. Test with the ugliest data you can
construct, not the seed data.

**Errors are contained.** An error boundary around each independently-failing
region. One failed widget should not blank the page.

**Cleanup on unmount.** Every subscription, timer, listener, and observer gets
torn down. Every fetch tied to a component gets an `AbortController`. Async work
that resolves after unmount and calls `setState` is a leak and a warning.

**No secrets in client code.** Anything reaching the browser is public. API keys
belong in server routes, server components, or server actions.

## Component architecture

**Server-first, in frameworks that have it.** In the App Router, components are
Server Components by default and that's the right default — no JS shipped, data
fetched at the source. Add `"use client"` at the leaf that actually needs
interactivity, not at the top of the tree. A `"use client"` on a layout drags
everything below it into the client bundle.

The practical pattern: server component fetches and composes, small client
components handle interaction, and server components get passed *through* as
`children` where a client wrapper is needed.

**Props describe intent, not appearance.** `variant="danger"` survives a
redesign; `color="red"` doesn't.

**Compose over configure.** A component with eleven boolean props is several
components wearing a trenchcoat. Compound components (`<Card>`, `<Card.Header>`)
scale better than `showHeader`, `headerAlign`, `headerBordered`.

**Uncontrolled by default, controlled when asked.** Let a component own its own
state unless the parent needs it. Lifting state that nobody else reads is the
most common source of unnecessary re-renders across a page.

**One source of truth.** State duplicated into a second `useState` and synced
with `useEffect` will drift. Derive during render instead — if it can be
computed from props and state, compute it, don't store it.

Deeper patterns — effects, memoization, data fetching, forms — are in
`references/react-patterns.md`. Read it when doing non-trivial state work; the
`useEffect` section in particular covers the mistake that causes most
re-rendering and stale-data bugs.

## Styling

Use the project's system and its tokens. Concretely:

- Values come from tokens — `var(--space-4)`, `text-muted`, `gap-6` — not from
  literals. A hardcoded `#3b82f6` is a token that didn't get created, and it's
  what makes theming a find-and-replace project later.
- Spacing from the scale. If something needs 30px, it needs 32.
- Layout with grid and flex; `position: absolute` for genuine overlays only.
- Container queries (`@container`) when a component's layout should respond to
  its own space rather than the viewport — which is usually what you actually
  want for a reusable component.
- Logical properties (`padding-inline`, `margin-block`) if RTL is in scope.
- `text-wrap: balance` on headings, `pretty` on body — one line, meaningfully
  better ragging.

See `references/css-architecture.md` for Tailwind v4 setup, variant handling,
dark mode, and the specificity strategies that keep a stylesheet from rotting.

## Performance

Do these by default, since they cost nothing at write time:

- Don't ship what isn't needed. `next/dynamic` or `React.lazy` for heavy,
  below-the-fold, or conditionally-rendered subtrees.
- Use the framework's image component, or set `width`, `height`, `loading`, and
  `decoding` by hand.
- Virtualize lists past a few hundred rows.
- Debounce input-driven network calls; throttle scroll and resize handlers.
- Animate `transform` and `opacity` only.

Beyond that, **measure before optimizing**. Wrapping everything in `useMemo` is
a real cost paid against an imagined benefit, and it makes the code harder to
change. `references/performance.md` covers profiling, Core Web Vitals, bundle
analysis, and when memoization actually pays.

## Accessibility

Most of it is free if the markup is right — semantic elements, labeled inputs,
alt text, logical heading order, visible focus. The work concentrates in custom
interactive components:

- Modals, menus, comboboxes, and tabs each have a specified keyboard contract.
  Follow the WAI-ARIA Authoring Practices pattern rather than improvising, and
  strongly prefer an existing accessible primitive (Radix, React Aria) over
  hand-rolling — focus trapping and roving tabindex are subtle enough that
  hand-rolled versions are usually subtly wrong.
- Dynamic updates need `aria-live` or a focus move, or a screen reader user
  never learns the thing happened.
- `aria-*` attributes must reflect live state, which means they're derived from
  the same state that drives the rendering, not set once.

`references/accessibility.md` has the per-component contracts and the testing
approach.

## Verify — actually run it

This is the step that most separates work that holds up from work that looks
finished. A component that has never been rendered has not been written; it's
been drafted.

In order, using whatever the project provides:

```bash
npm run typecheck   # or: npx tsc --noEmit
npm run lint
npm test
npm run build       # catches SSR/RSC errors that dev mode hides
```

Then load it. `npm run dev`, open the page, and check:

- It renders, with no console errors or warnings.
- The four async states, forced — throttle the network, kill it, empty the data.
- Keyboard only: tab through, activate, escape out. Focus is always visible and
  never lost.
- 320px wide and 1920px wide. Nothing scrolls horizontally at the body level.
- Dark mode if the project has it.

When a browser is available (Playwright is preinstalled in this environment),
drive it rather than guessing — navigate, screenshot, and read the console.
`references/verification.md` has a ready-to-run script for that, plus the full
pre-handoff checklist.

Report what you actually ran and what it said. "Builds clean, renders at both
breakpoints, keyboard path verified; I did not test dark mode because the
project has no dark theme" is worth more than a claim of completion — and if
something failed, say so with the output rather than describing the change as
done.

## References

- `references/react-patterns.md` — effects, state, memoization, data fetching,
  forms, Server Components, React 19 specifics.
- `references/css-architecture.md` — Tailwind v4, variants, dark mode,
  responsive strategy, keeping specificity sane.
- `references/performance.md` — Core Web Vitals, profiling, bundle size,
  rendering cost, when to memoize.
- `references/accessibility.md` — per-component keyboard contracts, ARIA,
  testing.
- `references/verification.md` — browser automation script, the pre-handoff
  checklist, debugging approach.

## Working with ui-ux

This skill implements; **ui-ux** decides. If you're partway into building and
find yourself choosing a type scale, inventing a palette, or guessing at what
the empty state should say, those are design decisions — run the ui-ux skill,
settle them, then come back. Deciding them incidentally while writing JSX is how
a codebase ends up with four spacing systems.
