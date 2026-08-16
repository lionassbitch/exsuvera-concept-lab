# Performance

Contents:
- [Measure first](#measure-first)
- [Core Web Vitals](#core-web-vitals)
- [Bundle size](#bundle-size)
- [Images and media](#images-and-media)
- [Fonts](#fonts)
- [Rendering cost](#rendering-cost)
- [Long lists](#long-lists)
- [Network](#network)
- [Animation](#animation)
- [Common failures](#common-failures)

## Measure first

Optimization without measurement adds complexity against an imagined problem.
The bottleneck is almost never where intuition puts it — and the code you make
harder to read stays harder to read whether or not it helped.

Tools, roughly in order of usefulness:

- **React DevTools Profiler** — which components re-render, how often, and why.
  Enable "Record why each component rendered" in settings; that setting answers
  most re-render questions immediately.
- **Chrome Performance panel** — record an interaction, look for long tasks
  (>50ms) and layout thrash.
- **Lighthouse** — Core Web Vitals with specific diagnostics. Run it in an
  incognito window; extensions distort the numbers badly.
- **Network panel, throttled to Slow 4G** — the condition most of your users are
  actually in.
- **Bundle analyzer** — `@next/bundle-analyzer`, `vite-bundle-visualizer`, or
  `source-map-explorer`.

State the number before and after. "Reduced initial JS from 340KB to 180KB by
dynamically importing the chart library" is a result; "optimized performance"
isn't.

## Core Web Vitals

| Metric | Good | What it measures |
|---|---|---|
| LCP | < 2.5s | When the largest element renders |
| INP | < 200ms | Responsiveness to interaction |
| CLS | < 0.1 | Visual stability |

**LCP** is usually a hero image or heading. Fixes: preload the LCP image, don't
lazy-load it (a common own-goal — `loading="lazy"` on the hero delays the very
thing being measured), serve it in a modern format at the right size, and remove
render-blocking resources ahead of it. Server-render the content rather than
fetching it client-side.

**INP** replaced FID and is stricter — it measures every interaction, not just
the first. Fixes: break long tasks up, move heavy work off the main thread
(`requestIdleCallback`, a worker, or `startTransition`), debounce expensive
handlers, and cut the JS that runs during hydration.

**CLS** comes from content arriving without reserved space. Fixes: explicit
dimensions or `aspect-ratio` on images and embeds, `min-height` on async
containers, never inserting content above existing content, and `font-display:
optional` or matched fallback metrics to avoid layout shift on font swap.

## Bundle size

Every kilobyte is parsed and executed on the main thread, and on mid-range
Android that cost dominates download time.

**Split what isn't needed immediately:**

```jsx
const Chart = dynamic(() => import("./Chart"), {
  loading: () => <ChartSkeleton />,
  ssr: false,          // for anything touching window/document
});
```

Good candidates: charting libraries, rich text editors, date pickers, modals,
anything below the fold, anything behind a route or a tab.

**Check what you're importing.** `import _ from "lodash"` pulls the whole
library; `import debounce from "lodash/debounce"` pulls one function — or write
the four-line debounce yourself. Moment.js is ~70KB with locales; `date-fns` or
the native `Intl.DateTimeFormat` usually replaces it entirely.

**Watch for accidental client bundles.** In the App Router, a `"use client"`
high in the tree drags everything beneath it into the browser bundle. Check the
build output's per-route JS figures — a sudden jump usually traces to one
misplaced directive.

**Don't ship dev-only code.** Verify tree-shaking actually removed what you think
it did; the analyzer will show you.

## Images and media

The highest-leverage performance work on most sites, because images dominate
byte weight.

- Use the framework's image component (`next/image`) — it handles sizing,
  format negotiation, lazy loading, and placeholders.
- Without one: set `width` and `height` (prevents CLS), `loading="lazy"` on
  below-the-fold images, `decoding="async"`, and provide `srcset`/`sizes` so
  phones don't download desktop-sized files.
- Serve AVIF or WebP with a JPEG fallback. AVIF is typically 50% smaller than
  JPEG at equivalent quality.
- The LCP image gets `loading="eager"` and `fetchpriority="high"`, and a
  `<link rel="preload">`. Never lazy-load it.
- Video: `preload="metadata"`, a `poster` image, and never autoplay with audio.

## Fonts

- Subset to the characters actually used — often a 70% reduction.
- `font-display: swap` shows text immediately in a fallback. `optional` avoids
  the swap-induced shift entirely at the cost of sometimes not using your font.
- Preload the one face that appears above the fold, and only that one.
- Self-host. Third-party font CDNs add a DNS lookup, a connection, and a privacy
  question, and are no longer cached across sites.
- Variable fonts: one file covering the whole weight range beats six static
  files.
- `size-adjust` and `ascent-override` on the fallback face can make the swap
  nearly shift-free.

## Rendering cost

Most React performance problems are unnecessary re-renders. In order of leverage:

**1. Move state down.** State in a leaf re-renders a leaf. State at the page
level re-renders the page. This structural fix beats any amount of memoization.

**2. Pass subtrees as `children`.** Children are created by the parent's parent,
so they don't recreate when the wrapper's state changes.

**3. Split contexts.** A context holding `{user, theme, cart}` re-renders every
consumer when any of the three changes. Separate contexts, or a store with
selector subscriptions (Zustand, Jotai), scope updates to what actually changed.

**4. Then memoize.** `React.memo` on the child plus stable props from the parent.
Note that `React.memo` alone does nothing if the parent passes a new inline
object or arrow function each render — both halves are required.

If the project has the React Compiler enabled, most of step 4 is automatic;
check before hand-memoizing.

**Avoid layout thrash.** Reading a layout property (`offsetHeight`,
`getBoundingClientRect`) after writing one forces a synchronous reflow. In a
loop, that's O(n) reflows. Batch all reads, then all writes — or use
`ResizeObserver`/`IntersectionObserver`, which report asynchronously and don't
force layout at all.

## Long lists

Past a few hundred rows, DOM node count itself becomes the bottleneck.
Virtualize — `@tanstack/react-virtual` or `react-window` — so only visible rows
exist.

Before virtualizing, consider whether pagination or infinite scroll suits the
task better. Users rarely want 10,000 rows; they want the right 20.

`content-visibility: auto` with `contain-intrinsic-size` is a one-line CSS
alternative that lets the browser skip rendering offscreen content. Less control
than virtualization, far less code.

## Network

- **Parallelize independent requests.** Sequential `await`s that don't depend on
  each other double the latency for nothing. `Promise.all`.
- **Cache.** A query library gives you deduplication and revalidation for free.
- **Prefetch on intent** — hovering a link, focusing it. `next/link` does this
  automatically for viewport links.
- **Debounce user-driven requests** (300ms is a reasonable default for search),
  and cancel superseded ones.
- **Compress.** Brotli over gzip where the host supports it.
- **Watch payload size.** An API returning 200 fields when the UI shows 6 is
  bandwidth and parse time spent on nothing.

## Animation

Only `transform` and `opacity` run on the compositor. Everything else triggers
layout or paint on every frame.

```css
/* Janks: layout on every frame */
transition: width 300ms, top 300ms, margin-left 300ms;

/* Smooth: compositor only */
transition: transform 300ms, opacity 300ms;
```

`will-change` promotes an element to its own layer, but each layer costs memory
— apply it just before the animation and remove it after, never as a blanket
rule.

For genuine layout transitions, use the FLIP technique or the View Transitions
API rather than animating layout properties.

## Common failures

**Memoizing everything.** Real cost, imagined benefit, worse readability.

**Optimizing without measuring.** The bottleneck is rarely where you'd guess.

**`loading="lazy"` on the hero image.** Directly harms LCP.

**No dimensions on images.** The primary source of CLS.

**Whole-library imports.** Check what actually ships.

**Client-fetching what the server could render.** Costs a full waterfall.

**Testing only on a fast laptop on fast wifi.** Throttle to Slow 4G and 4× CPU
slowdown; that's a realistic mid-range phone.
