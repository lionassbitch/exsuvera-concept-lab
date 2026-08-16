# Skills

Project-local skills for Claude Code. Each directory is a skill; Claude loads
`SKILL.md` when the description matches the task, and reads the files under
`references/` only as needed.

## ui-ux

Design decisions — layout, hierarchy, type, color, spacing, states, motion,
accessibility. Runs *before* UI code gets written, because those decisions are
far cheaper to make up front than to retrofit.

```
ui-ux/
├── SKILL.md
├── references/
│   ├── type-and-space.md          scales, measure, leading, spacing grammar
│   ├── color-and-contrast.md      palettes by role, dark mode, WCAG
│   ├── states-and-motion.md       the full state inventory, motion timing
│   ├── critique.md                ordered review rubric
│   └── presets.md                 five coherent aesthetic directions
└── scripts/
    ├── contrast.py                WCAG ratios; pairs, palettes, full matrix
    └── scale.py                   modular type + spacing scale generator
```

```bash
python3 ui-ux/scripts/contrast.py "#111" "#c6ff4a"
python3 ui-ux/scripts/contrast.py --palette tokens.json --grid
python3 ui-ux/scripts/scale.py --base 16 --ratio perfect-fourth --format css
```

Both scripts are dependency-free Python 3 and exit non-zero on failure, so
`contrast.py` can gate CI.

## frontend-pro-max

Implementation — React/Next, CSS architecture, state, data fetching, forms,
performance, accessibility wiring, and verifying the result in a real browser.

```
frontend-pro-max/
├── SKILL.md
├── references/
│   ├── react-patterns.md          effects, state, memoization, RSC, React 19
│   ├── css-architecture.md        Tailwind v4/v3, dark mode, container queries
│   ├── performance.md             Core Web Vitals, bundles, render cost
│   ├── accessibility.md           keyboard contracts per component, ARIA
│   └── verification.md            browser checks, pre-handoff checklist
└── scripts/
    └── check-page.mjs             renders a page and reports what's wrong
```

```bash
npm run dev &
node frontend-pro-max/scripts/check-page.mjs http://localhost:3000
node frontend-pro-max/scripts/check-page.mjs http://localhost:3000 --widths 320,768,1440 --dark
```

`check-page.mjs` screenshots each breakpoint and reports console errors,
horizontal overflow (naming the offending element), images missing dimensions or
alt text, unlabeled controls, buttons with no accessible name, heading-order
problems, small touch targets, positive tabindex, and focusable elements with no
visible focus ring. It resolves Playwright from the project or a global install.

## How they fit together

`ui-ux` decides, `frontend-pro-max` builds. Each skill points at the other at the
handoff, so a request that starts as "make this page look better" lands in the
design pass first and arrives at implementation with the system values already
settled — rather than accumulating a fourth spacing scale somewhere in a JSX
file.

Either can be used alone. A pure critique needs only `ui-ux`; a bug fix in an
existing component needs only `frontend-pro-max`.
