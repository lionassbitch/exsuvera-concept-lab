# LAB Academy

Exsuvera presents **LAB Academy** — a full-stack founder curriculum from uncertainty to execution.

Tagline: **[ sharpen my vision ]**

## Product surface

| Route | Purpose |
|-------|---------|
| `/academy` | Curriculum hub + resume CTA |
| `/academy/[phase]` | Phase overview |
| `/academy/[phase]/[lesson]` | Lesson + exercise workspace |
| `/academy/deliverables` | Deliverables library + Markdown export |

## API

| Endpoint | Methods | Notes |
|----------|---------|-------|
| `/api/academy/health` | GET | Liveness + backend mode |
| `/api/academy/session` | GET | Identity, progress summary, next lesson |
| `/api/academy/progress` | GET, POST | Lesson completion |
| `/api/academy/deliverables` | GET, POST | Exercise text |

Identity: `X-Academy-Learner-Id: guest:<id>` or ChatGPT workspace headers when signed in.

## Persistence

Write-through store:

1. Always writes to Worker memory (fast, always available)
2. Also writes to Cloudflare D1 when `DB` binding is healthy
3. Client mirrors deliverables to `localStorage` for offline/draft resilience

D1 is declared in `.openai/hosting.json` (`"d1": "DB"`). Schema migration: `drizzle/0000_academy_progress.sql`.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000/academy
```

```bash
npm run typecheck
npm test
```

## Production checklist

- [x] Full 9-phase / 27-lesson curriculum
- [x] Progress + deliverable APIs
- [x] Resume / start CTA
- [x] Deliverables library + export
- [x] Guest + ChatGPT identity
- [x] Health endpoint
- [x] Autosave on exercises
- [x] Local draft cache
- [ ] Deploy to hosting with D1 migrations applied
- [ ] Verify ChatGPT Sign-In on the target host
