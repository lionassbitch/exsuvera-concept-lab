# States and Motion

Contents:
- [The state inventory](#the-state-inventory)
- [Empty states](#empty-states)
- [Loading](#loading)
- [Errors](#errors)
- [Interactive states](#interactive-states)
- [Forms](#forms)
- [Motion](#motion)
- [Reduced motion](#reduced-motion)
- [Common failures](#common-failures)

## The state inventory

The happy path is the smallest part of the job. Every surface that holds data or
accepts input needs a decision for each of these, and the ones that get skipped
are exactly the ones users hit on their first and worst days.

For each screen or component, work through:

| State | Question |
|---|---|
| Empty | Never had data. What does a new user see? |
| Emptied | Had data, now has none — cleared filters, deleted last item. |
| Loading (first) | Nothing on screen yet. |
| Loading (more) | Content present, more arriving. |
| Partial | Some data loaded, some failed. |
| Error | Request failed. Recoverable or not? |
| Offline | No connection. |
| Permission | Signed in, not allowed. |
| Success | Action completed — how do they know? |
| Overflow | 500 items, a 90-character name, a 12MB image. |
| Stale | Data is old and being revalidated. |

Not every one applies to every component. Deciding "not applicable" is a
decision; not considering it is a bug waiting.

## Empty states

An empty state is the highest-leverage screen in most products — it's the first
thing a new user sees, and shipping a centered gray "No data" wastes it.

A good one does three things: says what belongs here, says why it's empty, and
offers the single action that fills it.

```
Nothing scheduled yet
Runs you schedule will appear here with their history and next fire time.
[ Schedule a run ]
```

Distinguish the two empty cases — they need different copy. "No results for
'quarterly'" with a clear-filters action is a different screen from "You haven't
created anything yet" with a create action. Showing the new-user onboarding
prompt to someone who just over-filtered a search is disorienting.

Keep illustrations optional and small. Copy carries the state; a large graphic
with vague text does not.

## Loading

**Under ~300ms: show nothing.** A spinner that flashes for 100ms is worse than
no spinner — it registers as a glitch.

**300ms to ~2s: skeletons.** Skeletons beat spinners because they hold layout,
which prevents the content jump that makes an interface feel cheap. Match the
real content's shape and size; a skeleton that doesn't match causes the reflow
it was meant to prevent.

**Over ~2s: progress and reassurance.** Determinate progress if you can compute
it, staged messages if you can't ("Uploading… Processing… Almost done"). Silence
past a few seconds reads as broken.

Two rules that matter more than the choice of indicator:

- **Reserve the space before the content arrives.** Set explicit dimensions on
  images and media containers. Layout shift is the single most damaging thing
  for perceived quality, and it's cheap to prevent.
- **Disable the trigger while in flight,** and say so on it ("Saving…"). An
  enabled submit button during submission produces duplicate records.

Optimistic updates — showing the result immediately and reconciling after —
make an interface feel instant. Only use them where failure is rare and rollback
is safe, and always show a clear, non-destructive correction if the write fails.

## Errors

An error message needs to answer: what happened, whether it's the user's fault,
and what to do next. Most shipped errors answer none of these.

```
Bad:   Error: Request failed with status code 422
Bad:   Something went wrong!
Good:  That file is 24MB — the limit is 10MB. Try a smaller file or a link.
```

- Put the error where the problem is. Field errors go under the field; page
  errors go at the top of the page with focus moved to them.
- Never blame the user. "That email is already registered" not "Invalid input".
- Preserve their work. Wiping a form on validation failure is the cruelest
  common pattern in web software.
- Offer the recovery action inline — retry, contact, undo.
- Log the technical detail; show the human one. A correlation ID in small text
  is a reasonable bridge for support.

Prefer undo over confirmation dialogs. A confirm prompt interrupts every user to
protect against a rare mistake; undo interrupts no one and fixes it after. Save
modal confirmation for the genuinely irreversible.

## Interactive states

Every interactive element needs: default, hover, focus-visible, active,
disabled, and — if it toggles — selected.

**Focus is not optional.** It's the only wayfinding a keyboard or switch user
has. `outline: none` without a replacement is one of the most damaging single
lines in frontend code.

```css
:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
```

`:focus-visible` rather than `:focus` gives keyboard users a ring without
putting one on every mouse click. `outline-offset` keeps it legible against
adjacent fills. Because `outline` follows border-radius in modern browsers, it
beats a `box-shadow` ring — and unlike box-shadow, it survives forced-colors
mode.

**Hover is a bonus, not a channel.** Touch devices have no hover, so nothing
essential can live there. Hover-only affordances make features invisible on
mobile.

**Active state should be visible.** A 1px translate or a slight darkening
confirms the press landed. Its absence is a common reason interfaces feel
unresponsive even when they're fast.

**Disabled needs a reason.** A grayed-out button with no explanation is a dead
end. Either explain nearby why it's disabled, or leave it enabled and explain on
attempt — often the better choice, since disabled elements aren't reachable by
keyboard or announced usefully by screen readers.

## Forms

- Labels above fields, always visible. Placeholder-as-label disappears on focus,
  fails contrast, and breaks autofill.
- Validate on blur, not on every keystroke — errors appearing while typing the
  third character of an email are hostile. Re-validate on change once a field is
  already in an error state, so the message clears as soon as it's fixed.
- Show requirements before submission, not after. Password rules belong next to
  the field from the start.
- Use the right `type`, `inputmode`, and `autocomplete`. On mobile this changes
  the keyboard, and `autocomplete` is the difference between a 10-second
  checkout and a 90-second one.
- Mark optional fields rather than required ones when most are required.
- Never disable paste. People use password managers.
- On submit failure, move focus to the first error and announce a summary.

## Motion

Motion earns its place when it explains a change — where something came from,
what it turned into, what is now different. Motion that only decorates costs
time on every single interaction.

**Duration**

```
Micro (hover, focus, toggle)     80 – 150ms
Standard (dropdown, tooltip)    150 – 250ms
Large (modal, page, drawer)     250 – 400ms
```

Anything over ~400ms feels sluggish on repeat. Exit animations should run
faster than entrances — users have already decided to dismiss.

**Easing**

- Entering: `ease-out` (`cubic-bezier(0, 0, 0.2, 1)`) — fast start, gentle
  settle.
- Exiting: `ease-in` — gets out of the way.
- Moving between two on-screen positions: `ease-in-out`.
- Never `linear` for anything spatial; it reads as mechanical.
- Spring physics suit drag-and-release interactions where the user imparted
  momentum.

**Animate transform and opacity only.** They run on the compositor. Animating
`width`, `height`, `top`, `left`, or `margin` triggers layout on every frame and
janks on mid-range hardware. When a layout change is genuinely needed, look at
the FLIP technique or `view-transition-name`.

**Stagger sparingly.** 30–50ms between items in a short list adds life; the same
across twenty rows makes the last one arrive a second late.

Two things worth animating that often go unanimated: layout position changes
(so items appear to move rather than teleport) and value changes on numbers
(so a count visibly increments). Two things not worth animating: page-load
entrance effects on content the user came to read, and anything that delays a
response to a click.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This global reset is the right default. Reduce means reduce, not remove —
where motion carries meaning (a panel sliding in from the side it belongs to),
replace it with a fast cross-fade rather than an instant swap, so the
relationship still reads.

Parallax, autoplaying loops, and large-scale movement are the actual triggers
for vestibular symptoms. Treat those as opt-in regardless of the media query.

## Common failures

**Only the happy path exists.** Walk the inventory table above.

**Spinner for everything.** Skeletons hold layout; spinners don't.

**Layout shift on load.** Reserve dimensions for images and async content.

**`outline: none` with nothing in its place.** Keyboard navigation becomes
invisible.

**Error text that surfaces the HTTP status.** Translate to something actionable.

**Form clears on validation failure.** Preserve input.

**Animating width/height/top/left.** Use transforms.

**Motion on repeat-use interactions.** Delightful once, tedious the hundredth
time. The higher the frequency, the shorter the animation.
