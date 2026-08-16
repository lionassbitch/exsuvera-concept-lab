# Verification

Contents:
- [Why this step](#why-this-step)
- [The command sequence](#the-command-sequence)
- [Driving a browser](#driving-a-browser)
- [Forcing the states you didn't test](#forcing-the-states-you-didnt-test)
- [The manual sweep](#the-manual-sweep)
- [Debugging](#debugging)
- [The pre-handoff checklist](#the-pre-handoff-checklist)
- [Reporting](#reporting)

## Why this step

Type-checking proves the types line up. Building proves it compiles. Neither
proves the page renders, the button works, the layout holds at 320px, or that
the empty state exists.

The failure this prevents is specific and common: work that is reported as
complete, looks complete in the diff, and breaks the moment someone loads it.
Running it takes a couple of minutes and is the difference between a claim and a
fact.

## The command sequence

Use whatever the project provides — check `package.json` scripts first.

```bash
npx tsc --noEmit          # or npm run typecheck
npm run lint
npm test
npm run build             # last, and non-optional
```

`build` matters more than it looks. Dev mode is permissive: it tolerates things
that break in production builds — Server/Client Component boundary violations,
`window` accessed during SSR, imports that only resolve in dev, and static
analysis failures. A change that passes dev and fails build is a normal
occurrence, not an edge case.

If a command doesn't exist, say so rather than silently skipping it. "No test
script in this project" is useful information.

## Driving a browser

Playwright with Chromium is preinstalled in this environment at
`/opt/pw-browsers` — don't run `playwright install`, and don't let an npm
postinstall re-fetch it (`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` is already set).

The bundled `scripts/check-page.mjs` runs the mechanical checks that are tedious
by hand:

```bash
npm run dev &                                     # or however the project starts
node .claude/skills/frontend-pro-max/scripts/check-page.mjs http://localhost:3000
node .../check-page.mjs http://localhost:3000/pricing --widths 320,768,1440 --dark
```

It reports console errors, uncaught exceptions, failed requests, horizontal
overflow (naming the widest offending element), images missing dimensions or
alt text, unlabeled form controls, buttons with no accessible name, heading
order problems, small touch targets, positive tabindex, and focusable elements
with no visible focus ring — and writes a full-page screenshot per breakpoint.

Then **look at the screenshots**. The script catches mechanical faults; it can't
tell you the hierarchy is flat or the spacing is arbitrary.

For interaction flows, write a short ad-hoc Playwright script — click through
the actual path a user takes, and assert on what should be true after each step.

## Forcing the states you didn't test

The happy path renders itself. The others need to be provoked, and they're the
ones that ship broken.

**Slow network.** Chrome devtools → Network → Slow 4G, plus 4× CPU throttling.
This is a realistic mid-range phone, and it makes loading states visible long
enough to evaluate.

**Failed requests.** Devtools → Network → right-click a request → Block request
URL. Or set the offline checkbox. Does the error state appear? Does it say what
to do?

**Empty data.** Temporarily return `[]` from the data source. Is there an empty
state, or a blank region?

**Too much data.** Return 500 rows, a 200-character name, a 12MB image. Does the
layout hold or does something overflow?

**In Playwright**, all of this is scriptable:

```js
await page.route("**/api/**", (route) => route.abort());              // failure
await page.route("**/api/items", (r) => r.fulfill({ json: [] }));     // empty
await page.route("**/api/**", async (route) => {                      // slow
  await new Promise((r) => setTimeout(r, 3000));
  route.continue();
});
```

## The manual sweep

Two minutes per screen, and it catches what automation can't.

1. **Load it.** Console clean? Anything jump as it loads?
2. **Keyboard only.** Tab through the whole flow. Everything reachable, focus
   always visible, Escape closes overlays, focus returns to the trigger, nothing
   traps you.
3. **320px and 1920px.** No horizontal scroll on the body. Composition still
   reads at both ends.
4. **200% zoom.** Nothing clipped or overlapping.
5. **Dark mode**, if the project has one.
6. **The four states**, forced as above.
7. **Real content** — the longest name, the missing avatar, the empty list.

## Debugging

**Find the layer before you change anything.** Is the data wrong (log it at the
source), the state wrong (React DevTools Components panel), the render wrong
(inspect the output), or the styles wrong (inspect computed styles)? Fixing at
the wrong layer produces a patch that hides the bug.

Useful specifics:

- **"Cannot read property of undefined"** — data arrived later than the render.
  Handle the loading state; optional chaining alone just delays the crash.
- **Hydration mismatch** — server and client rendered different HTML. Usual
  causes: `Date.now()`, `Math.random()`, `localStorage`, `window`, or locale
  formatting during render. Move it into an effect, or gate on a mounted flag.
- **Stale value in a callback** — a closure captured an old render's variables.
  Check the dependency array; use a functional state update.
- **Infinite render loop** — an effect sets state that's in its own dependency
  array, or an object/array dependency is recreated each render.
- **Style not applying** — check specificity in devtools (the crossed-out rule
  tells you what won), and for Tailwind, whether the class name was constructed
  dynamically and therefore never generated.
- **Works in dev, breaks in build** — SSR/RSC boundary, or a dev-only import.
  The build error message usually names the file.

React DevTools' "Record why each component rendered" setting answers most
re-render questions in one profiling pass.

## The pre-handoff checklist

```
Build
  [ ] typecheck clean
  [ ] lint clean
  [ ] tests pass
  [ ] production build succeeds

Render
  [ ] page loads, console clean
  [ ] no layout shift on load
  [ ] loading, empty, error, and success states all wired and seen
  [ ] worst-case content doesn't break layout

Interaction
  [ ] keyboard reaches and operates everything
  [ ] focus visible throughout, returns correctly after overlays close
  [ ] no double-submit; controls disable while in flight
  [ ] errors say what to do next

Responsive
  [ ] 320 / 768 / 1440 checked
  [ ] no horizontal scroll on the body
  [ ] wide content scrolls in its own container
  [ ] touch targets ≥ 44px

Quality
  [ ] tokens used, no stray hardcoded values
  [ ] no leftover console.log or commented-out code
  [ ] cleanup on unmount for every subscription/timer/listener/fetch
  [ ] no secrets in client code
  [ ] matches the surrounding codebase's conventions
```

## Reporting

Say what you ran and what it said. Distinguish verified from assumed, and name
what you skipped and why:

> Typecheck, lint, and build all clean. Rendered at 320/768/1440 — no overflow.
> Tabbed the full form path; focus returns to the trigger on modal close. Forced
> the empty and error states via route interception, both render. I did not test
> dark mode — the project has no dark theme defined.

If something failed, report it with the output rather than describing the change
as done. A known failure is workable information; a false completion claim costs
someone else the time to discover it.
