// Cloudflare Workers runtime globals (Fetcher, D1Database, the `cloudflare:workers`
// module, ...) used by worker/index.ts and db/index.ts.
//
// Referenced here rather than through tsconfig "types" so it augments the existing
// lib.dom globals the React app relies on instead of replacing them.
/// <reference types="@cloudflare/workers-types" />

// `cloudflare:workers` exports `env` as `Cloudflare.Env`, an empty interface each
// project is meant to redeclare. Bindings here come from vite.config.ts and the
// hosting control plane rather than a wrangler config, so declare them by hand.
//
// `DB` is optional because .openai/hosting.json may leave `d1` null — which is
// exactly the case getDb() guards against at runtime.
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
  }
}
