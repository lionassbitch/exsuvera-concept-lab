# Accessibility Implementation

Contents:
- [Semantics carry most of it](#semantics-carry-most-of-it)
- [Focus management](#focus-management)
- [Component keyboard contracts](#component-keyboard-contracts)
- [ARIA](#aria)
- [Announcing dynamic changes](#announcing-dynamic-changes)
- [Forms](#forms)
- [Images and icons](#images-and-icons)
- [Testing](#testing)
- [Common failures](#common-failures)

## Semantics carry most of it

Correct HTML gives you keyboard support, focus behavior, screen reader roles,
and platform conventions for free. Most accessibility work is not adding ARIA —
it's not throwing away what the browser already does.

| Instead of | Use | What you get back |
|---|---|---|
| `<div onClick>` | `<button>` | Focusable, Enter/Space, role, disabled |
| `<div>` styled as a link | `<a href>` | Focusable, Enter, context menu, middle-click |
| `<div>` list | `<ul>/<li>` | Count announced, list navigation |
| `<div>` heading | `<h1>`–`<h6>` | Heading navigation (a primary SR nav mode) |
| custom checkbox div | `<input type="checkbox">` | State, keyboard, forced-colors support |
| `<div>` table | `<table>` | Row/column announcement, cell navigation |

Beyond elements: one `<h1>` per page, heading levels in order without skipping,
landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`), and `lang` on
`<html>` so the screen reader picks the right voice.

A skip link as the first focusable element saves keyboard users from tabbing
through the nav on every page:

```html
<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>
```

Note it must become visible on focus — an always-hidden skip link is useless.

## Focus management

Focus is the keyboard user's cursor. Losing track of it strands them.

**Always visible.**

```css
:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
```

`:focus-visible` shows the ring for keyboard focus but not for mouse clicks —
which is the actual reason people reach for `outline: none`, now solved
properly. Use `outline` rather than `box-shadow`: it follows `border-radius` in
modern browsers and survives Windows High Contrast / forced-colors mode.

**Move it deliberately.** When a dialog opens, focus moves inside it — to the
first interactive element, or the dialog itself if there's content to read
first. When it closes, focus returns to the element that opened it. Skipping the
return is the most common focus bug, and it drops the user back at the top of
the document.

**Trap it in modals.** Tab from the last element wraps to the first, Shift+Tab
from the first wraps to the last, and Tab never escapes to the page behind.
Native `<dialog showModal>` does this for you and is the right default.

**Never make focus invisible or unreachable.** `tabindex` above 0 breaks
document order and creates a confusing trap; the only values you should use are
`0` (focusable in order) and `-1` (programmatically focusable only).

## Component keyboard contracts

Each custom widget has a specified keyboard behavior. Implement the pattern from
the WAI-ARIA Authoring Practices rather than improvising — the conventions are
what users have learned.

**Modal / dialog** — Escape closes. Focus trapped inside. Focus returns to the
trigger on close. Background inert (`inert` attribute or `aria-hidden`) and page
scroll locked. `role="dialog" aria-modal="true"` with `aria-labelledby`.

**Menu / dropdown** — Arrow keys move between items, Home/End jump to
first/last, Escape closes and returns focus, Enter/Space activates. Typing a
letter jumps to the next item starting with it. `role="menu"` / `role="menuitem"`.

**Tabs** — Arrow keys move between tabs, Home/End jump, Tab moves *out* of the
tab list to the panel. Only the active tab is in the tab order (roving
tabindex). `role="tablist"`, `aria-selected`, `aria-controls`.

**Combobox / autocomplete** — Down arrow opens and moves into the list, Escape
closes and restores the typed value, Enter selects. The input keeps DOM focus
throughout; `aria-activedescendant` tracks the virtual highlight.

**Accordion** — Enter/Space toggles. Headings are real `<button>`s inside real
heading elements. `aria-expanded` and `aria-controls`.

**Tooltip** — Appears on hover *and* focus. Escape dismisses. Never contains
interactive content (there's no way to reach it). Not the only place important
information lives.

**Strongly prefer an existing accessible primitive.** Radix UI and React Aria
implement these contracts correctly, including edge cases — nested focus traps,
portal focus order, screen reader quirks — that hand-rolled versions almost
always get subtly wrong. Building your own is worth it only when you have a
requirement none of them meet.

## ARIA

The first rule of ARIA is not to use it. A native element is better than a div
with a role, every time.

When you do:

- **Don't override native roles.** `<button role="link">` breaks expectations
  both ways.
- **Every ARIA state must be live.** `aria-expanded`, `aria-selected`,
  `aria-checked`, and `aria-current` are derived from the same state that drives
  the render — set once at mount, they lie.
- **`aria-label` replaces content**, `aria-labelledby` points at an existing
  element (prefer it — it stays translated and in sync), `aria-describedby` adds
  supplementary detail like a hint or error message.
- **`aria-hidden="true"` on decorative elements only**, and never on anything
  focusable — a focusable element hidden from the accessibility tree is a
  "phantom stop" that focuses with nothing announced.
- **`role="presentation"`** strips semantics, useful for layout tables.

## Announcing dynamic changes

A screen reader user doesn't see a toast appear. Either move focus to the change
or announce it via a live region.

```jsx
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {message}
</div>
```

- `aria-live="polite"` waits for a pause — right for almost everything.
- `aria-live="assertive"` interrupts — reserve for genuine urgency (session
  expiring, data loss).
- The live region must be **in the DOM before** the content changes. Inserting
  a live region and its content together often announces nothing.
- `role="status"` implies polite, `role="alert"` implies assertive.

Announce: form submission results, async load completion, validation errors,
items added or removed, and search result counts.

For client-side route changes, move focus to the new page's `<h1>` (with
`tabIndex={-1}`) or announce the new title — otherwise navigation is silent and
focus stays wherever the old link was.

## Forms

```jsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  autoComplete="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : "email-hint"}
/>
<p id="email-hint">We'll only use this for receipts.</p>
{error && <p id="email-error" role="alert">{error}</p>}
```

- Every input has a real `<label>` with a matching `htmlFor`/`id`. Placeholder
  is not a label — it disappears on focus, usually fails contrast, and breaks
  autofill.
- Group related controls in `<fieldset>` with a `<legend>` — required for radio
  groups, where the question itself is otherwise never announced.
- `aria-describedby` links hints and errors so they're read with the field.
- Errors need `role="alert"` (or a live region) to be announced when they
  appear.
- On submit failure, move focus to the first invalid field.
- Required fields: use the `required` attribute, and mark them visually with
  more than a color.

## Images and icons

- Meaningful image: `alt` describing its function, not its appearance. A logo
  linking home is `alt="Home"`, not `alt="company logo"`.
- Decorative image: `alt=""` — empty, not missing. A missing `alt` makes screen
  readers read the filename.
- Icon-only button: `aria-label` on the button, `aria-hidden="true"` on the SVG.
- Icon beside text: `aria-hidden="true"` on the icon, since the text already
  says it.
- Complex chart or diagram: short `alt` plus a longer description nearby, or a
  data table alternative.

## Testing

**Automated** catches roughly 30–40% of issues, which is a real 30–40%:

```bash
npx @axe-core/cli http://localhost:3000
npm i -D eslint-plugin-jsx-a11y      # catches many issues at write time
```

`jest-axe` or `@axe-core/playwright` puts it in CI. Lighthouse's accessibility
audit is a quick sanity check.

**Manual** catches the rest, and takes about two minutes per screen:

1. **Unplug the mouse.** Tab through the whole flow. Can you reach and operate
   everything? Is focus always visible? Does it ever get stuck or jump somewhere
   unexpected?
2. **Zoom to 200%.** Anything cut off, overlapping, or requiring horizontal
   scroll?
3. **Run a screen reader** on the primary flow. VoiceOver (Cmd+F5) on macOS,
   NVDA on Windows — both free. Ten minutes with one teaches more than any
   checklist.
4. **Check contrast** with the ui-ux skill's checker — `ui-ux/scripts/contrast.py`,
   a sibling of this skill.
5. **Force dark mode and forced-colors mode** — Chrome devtools can emulate
   both.

## Common failures

**`outline: none` with no replacement.** Removes keyboard navigation.

**Click handler on a div.** Not focusable, no keyboard, no role.

**Placeholder as label.** Disappears exactly when needed.

**Static ARIA state.** `aria-expanded="false"` that never updates is worse than
absent — it actively misinforms.

**Focus lost on close.** Dialog closes, focus returns to `<body>`, user is
stranded at the top of the document.

**Errors shown only in color.** Add an icon and text.

**`tabindex="5"`.** Breaks document order. Use `0` or `-1`.

**Toast with no live region.** Sighted users see it; nobody else knows.

**Hover-only affordances.** Invisible on touch devices and to keyboard users.
