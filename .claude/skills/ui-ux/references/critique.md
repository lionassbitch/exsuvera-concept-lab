# Critique Rubric

Review in this order. It runs from structural to cosmetic on purpose: a
hierarchy problem generates a dozen surface symptoms, and fixing the root
usually dissolves most of them. Working the other direction means polishing
things that shouldn't exist.

Stop when you have found the five issues that most change the outcome. A
30-item list gets skimmed and nothing gets fixed.

## 1. Purpose

- What is this screen for? Can you state it in one sentence?
- Is the primary action obvious within two seconds of landing?
- Is anything here that serves no user — added because a stakeholder asked, or
  because the component library had a slot for it?
- Is the most important content above the fold on a laptop *and* on a phone?

Most "it feels cluttered" reports are a purpose problem. The screen is doing
three jobs and none of them well.

## 2. Hierarchy

- Squint until the text is unreadable. What still stands out? Is it the right
  thing?
- How many elements compete for first attention? More than one is a problem.
- Does visual weight match actual importance, or did the destructive action end
  up as the loudest button on the page?
- Is there a clear reading path — a first, second, and third stop?

## 3. Structure and alignment

- How many distinct alignment edges are in use? Fewer, held strictly, reads as
  precision.
- Does grouping match meaning? Are related things closer to each other than to
  unrelated things?
- Is the grid consistent, or do sections each have their own margins?
- Is spacing coming from a scale, or are there 14px, 18px, and 22px gaps that
  each got eyeballed?

## 4. Type

- How many families, and does each earn its role?
- How many sizes? Are they from a scale?
- Does line-height vary with size, or is one value applied everywhere?
- Is body text between 45 and 75 characters per line?
- Are there faux-bold or faux-italic renderings from missing weights?
- Is anything below 12px carrying real information?

## 5. Color

- Count the distinct colors. Can any be consolidated?
- Does the accent mean one thing, or has it spread across headings, borders,
  icons, and fills?
- Run `scripts/contrast.py` on the actual pairs. Check body text, muted text,
  placeholders, disabled labels, icons, borders, and the focus ring.
- Is any meaning carried by color alone?
- If dark mode exists, has every pair been re-verified there?

## 6. Surfaces

- Lines or elevation — is one system in play, or both at once?
- Are radii consistent? Is nesting handled (inner radius should be outer radius
  minus the padding, or the corners look wrong)?
- Are borders visible enough to structure the page (3:1) without being loud?
- Is there a real shadow scale, or one shadow reused at every depth?

## 7. States

Walk the inventory in `states-and-motion.md`. In particular:

- Does the empty state say what belongs here and offer the action that fills it?
- Do loading states hold layout, or does content jump in?
- Do error messages say what to do next?
- Is `:focus-visible` styled everywhere, including custom controls and links?
- Are disabled elements explained?
- Does a 90-character name break the layout? A 500-row list? A missing avatar?

## 8. Responsive

- Check 320px, 768px, 1280px, and 1920px.
- Does anything scroll horizontally? (The page body never should.)
- Do tables, code blocks, and diagrams scroll inside their own container?
- Are touch targets at least 44×44px?
- Does the mobile layout reflow the composition, or just squeeze it?
- At 200% zoom, is anything cut off or overlapping?

## 9. Motion

- Does each animation explain something, or just decorate?
- Anything over 400ms? Anything on a high-frequency interaction?
- Is `prefers-reduced-motion` honored?
- Is anything animating layout properties instead of transform/opacity?

## 10. Craft signals

The details that separate finished from nearly-finished:

- Real content, including the worst-case lengths — not lorem, not "John Doe".
- Copy that's specific. "Seamlessly elevate your workflow" is a placeholder that
  survived to production.
- Numbers formatted for their locale; dates in an unambiguous format.
- Correct typography: real em dashes, curly quotes, `×` not `x`, non-breaking
  spaces where a number shouldn't wrap away from its unit.
- Consistent capitalization in labels and buttons — sentence case throughout, or
  title case throughout.
- Icons from one family at one optical size and weight.
- A `<title>`, a favicon, and OG tags if it's public.

## Delivering the critique

Rank by impact, not by the order you found things. Lead with what's working —
not as a pleasantry, but because it tells the person which parts to protect
while changing the rest.

For each issue, name the specific element, say what's wrong, and give the
concrete fix:

> **Hero heading and body are competing.** Both are 20px semibold, so the eye
> has no entry point. Take the heading to 40px/1.1 and drop the body to
> 16px/1.6 regular — that alone should resolve the "feels flat" note.

Avoid diagnosis without prescription ("the hierarchy is unclear"), and avoid
taste assertions dressed as findings ("I'd use a different blue"). If a change
is genuinely preference rather than craft, label it as such so it can be
weighed accordingly.
