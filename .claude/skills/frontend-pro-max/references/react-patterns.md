# React Patterns

Contents:
- [State: derive, don't duplicate](#state-derive-dont-duplicate)
- [useEffect](#useeffect)
- [Memoization](#memoization)
- [Server Components](#server-components)
- [Data fetching](#data-fetching)
- [Forms](#forms)
- [Refs and imperative code](#refs-and-imperative-code)
- [Lists and keys](#lists-and-keys)
- [Error boundaries](#error-boundaries)
- [React 19 specifics](#react-19-specifics)
- [Custom hooks](#custom-hooks)

## State: derive, don't duplicate

The most common state bug is storing something that could have been computed.
Duplicated state drifts the moment one copy updates and the other doesn't.

```jsx
// Drifts: fullName is stale until the effect runs, and re-renders twice.
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [fullName, setFullName] = useState("");
useEffect(() => { setFullName(`${firstName} ${lastName}`); }, [firstName, lastName]);

// Correct: compute during render. Always consistent, one render.
const fullName = `${firstName} ${lastName}`;
```

The same applies to filtered lists, totals, validity flags, and "is anything
selected". If it's a pure function of props and state, compute it.

**Keep state minimal and flat.** Store IDs rather than whole objects when the
objects live elsewhere — otherwise you have two copies of the same record.

**Group state that changes together.** Four `useState` calls that always update
in the same handler want to be one object or a `useReducer`. Reducers are worth
reaching for once transitions have rules ("can't submit while validating"),
because they put those rules in one readable place instead of spreading them
across handlers.

**Reset state with `key`, not effects.** When a component should start fresh for
a different entity, `<Profile key={userId} />` remounts it cleanly. Watching the
prop in an effect and resetting produces a flash of the previous user's data.

**Lift only as far as needed.** State lifted above its consumers re-renders
everything in between. If a modal's open/closed state lives in the page
component, every keystroke in that modal can re-render the page.

## useEffect

Effects are for synchronizing with systems outside React — the DOM, the network,
timers, subscriptions, third-party widgets. They are not the general mechanism
for "run this when something changes."

**You don't need an effect to:**

| Instead of an effect | Do this |
|---|---|
| Compute derived data | Calculate during render |
| Respond to a user event | Put the logic in the handler |
| Reset state when a prop changes | Change the `key` |
| Cache an expensive calculation | `useMemo` |
| Notify a parent of a change | Call the callback in the handler |

Data fetching in an effect is legitimate but rarely what you want in 2024+ — a
framework loader, a Server Component, or a query library handles caching, race
conditions, deduplication, and refetching that a hand-rolled effect won't.

**When you do write one, clean up.** Every subscription, timer, listener, and
observer needs teardown; every fetch needs cancellation. Effects run twice in
development StrictMode specifically to expose missing cleanup — that's the
mechanism working, not a bug to suppress.

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((e) => { if (e.name !== "AbortError") setError(e); });
  return () => controller.abort();
}, [url]);
```

Without the abort, a fast-then-slow sequence of requests can land out of order
and show the wrong data — a race that only appears on slow connections, which is
to say, in production.

**Dependencies are not negotiable.** An incomplete dependency array means stale
closures — the effect captures old values and silently uses them. If the linter
complains, the fix is restructuring (move the function inside, use a functional
update, wrap in `useCallback`), never suppression.

## Memoization

`useMemo`, `useCallback`, and `React.memo` all trade memory and complexity for
skipped work. Applied indiscriminately, the trade is negative.

Reach for them when:

- The computation is genuinely expensive — thousands of items, not a `.map` over
  ten rows.
- A value is a dependency of an effect that would otherwise re-run every render.
- A memoized child re-renders on every parent render because of an inline object
  or function prop. Note that `React.memo` on the child is what makes
  `useCallback` on the parent matter — `useCallback` alone accomplishes nothing.
- You measured it in the Profiler.

Skip them when the component is small and the render is cheap. And note that the
React Compiler (React 19+, opt-in) automates most of this — check whether the
project has it enabled before hand-memoizing anything, since doing both is
redundant work and extra code to maintain.

The higher-leverage optimization is usually structural: move state down so fewer
components re-render, or pass expensive subtrees as `children` so they aren't
recreated when the wrapper's state changes.

```jsx
// Every ExpensiveTree render is avoided: children is a stable prop.
function Wrapper({ children }) {
  const [open, setOpen] = useState(false);
  return <div>{children}</div>;
}
<Wrapper><ExpensiveTree /></Wrapper>
```

## Server Components

In the App Router, everything is a Server Component unless marked otherwise.
That's the right default: no JavaScript shipped, data fetched next to where it's
used, secrets safe.

**`"use client"` marks a boundary, not a file.** Everything imported by a client
component becomes client code too. Putting it at the top of a layout pulls the
whole tree into the bundle. Push it to the leaves — the button that needs
`onClick`, not the page that contains it.

**Pass server content through as children.** This is the pattern that keeps
interactive shells from clientizing their contents:

```jsx
// Layout (server)
<ClientTabs>
  <ServerRenderedPanel />   {/* stays on the server */}
</ClientTabs>
```

**Props crossing the boundary must be serializable.** Functions, class
instances, Dates in some configurations, and Symbols won't cross. Server Actions
are the exception — they're designed to be passed down and invoked from the
client.

**Don't fetch in a client component what the server could fetch.** It costs a
waterfall: HTML, then JS, then hydration, then the request.

## Data fetching

Whatever the layer, three things must be handled or the UI will misbehave:

- **Race conditions.** Cancel or ignore stale responses. Fast-then-slow ordering
  is the classic failure.
- **Errors.** Network failure, non-2xx, malformed body, and timeout are four
  different cases and at least two need distinct messaging.
- **Loading, distinguished.** First load (nothing on screen) and refetch
  (content present) look different. Showing a full-page skeleton on every
  background refresh is jarring.

Prefer a query library (TanStack Query, SWR) or the framework's own loading
mechanism over hand-rolled effects. They solve caching, deduplication,
revalidation, and retry — all of which you will otherwise reimplement, worse.

**Avoid waterfalls.** Independent requests should start together:

```jsx
const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);
```

Sequential `await`s that don't depend on each other silently double latency.

## Forms

- Controlled inputs need `value` *and* `onChange`. `value` without `onChange`
  produces a read-only field and a console warning.
- Uncontrolled with `defaultValue` plus `FormData` on submit is simpler and
  faster for large forms — fewer renders, less state.
- Validate on blur; re-validate on change once a field is already in error, so
  the message clears as soon as it's fixed.
- Disable submit while in flight and show it ("Saving…"). Otherwise double-click
  creates two records.
- On failure, preserve every value and move focus to the first error.
- `type`, `inputMode`, and `autoComplete` on every field. On mobile this changes
  the keyboard and enables autofill — the highest-value three attributes in form
  markup.

React 19 adds `useActionState`, `useFormStatus`, and `useOptimistic`, which
cover pending state, error return, and optimistic UI without hand-rolled state.
Prefer them in React 19 projects; they're less code and handle the transitions
correctly.

## Refs and imperative code

- Refs for DOM access and mutable values that shouldn't trigger renders.
- Mutating a ref never re-renders — if the UI must reflect it, it's state.
- Don't read or write `ref.current` during render; it breaks concurrent
  rendering assumptions. Effects and handlers are the safe places.
- In React 19, `ref` is an ordinary prop on function components —
  `forwardRef` is no longer required. Older code will still use it; match the
  codebase.
- Ref callbacks can return a cleanup function in React 19.

## Lists and keys

Keys must be stable, unique among siblings, and tied to the item's identity.

Array index as key is correct only for lists that are never reordered, filtered,
or inserted into. Otherwise React reuses the wrong DOM nodes and component state
attaches to the wrong item — the classic symptom is checkbox state or input
focus jumping to a different row after a delete.

`key={JSON.stringify(item)}` is worse: it changes whenever anything changes,
forcing a full remount and destroying focus and animation state.

## Error boundaries

An unhandled render error unmounts the whole tree — a blank page. Wrap each
independently-failing region so one broken widget doesn't take out the app.

Boundaries catch errors in rendering, lifecycle, and constructors below them.
They do **not** catch errors in event handlers, async code, or the server —
those need `try/catch`. In Next.js App Router, `error.tsx` provides a route-level
boundary and `global-error.tsx` the root fallback.

A useful boundary offers a retry, preserves surrounding context, and reports to
your error tracker. A bare "Something went wrong" is only marginally better than
the blank page.

## React 19 specifics

- `use(promise)` and `use(context)` — reads a promise or context, and unlike
  hooks may be called conditionally.
- `useActionState(fn, initial)` — pending state, result, and errors for form
  actions.
- `useFormStatus()` — pending state of the nearest parent form, readable from a
  child without prop drilling.
- `useOptimistic(state, reducer)` — optimistic UI with automatic reconciliation.
- `ref` as a plain prop; `forwardRef` no longer needed.
- `<Context>` renders directly as a provider — `<Context.Provider>` is optional.
- Document metadata (`<title>`, `<meta>`, `<link>`) hoists from anywhere in the
  tree.
- Ref cleanup functions.

Verify the installed version before using these. `"react": "19.x"` in
package.json is the check; assuming and being wrong produces confusing errors.

## Custom hooks

Extract a hook when stateful logic is genuinely reused, or when a component's
logic has grown past comfortable reading. Not before — a hook used once is
usually indirection without benefit.

A good hook has a clear single responsibility, returns a stable shape, cleans up
after itself, and doesn't secretly depend on where it's called. If it takes six
arguments and returns nine values, it's a component that hasn't accepted its
role yet.
