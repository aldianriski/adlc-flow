---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
purpose: Recipe for running standalone Node scripts that import Next.js server-only modules (CLI eval-runners, batch processors, migration scripts)
status: current
applies_to: Adopter projects using Next.js App Router + server-only markers
---

# Standalone scripts from a Next.js project

## The problem

You wrote an AI-integration module in `src/lib/ai/` with `import "server-only"` at the top — correct discipline; prevents client components from accidentally importing it. Now you want to test it from a CLI script (eval-runner · batch processor · migration · smoke test) outside the Next.js dev server. You run `npx tsx scripts/my-script.ts` and get:

```
Error: This module cannot be imported from a Client Component module.
It should only be used from a Server Component.
    at Object.<anonymous> (node_modules/server-only/index.js:1:7)
```

The `server-only` npm package's default entry literally throws. Node has no Server-Component awareness, so it hits the throwing default export.

## The recipe (3 patches)

### Patch 1 — install `server-only` as a regular dependency

Even though Next.js inlines it at build time, the standalone script needs the module resolvable at runtime:

```bash
npm install server-only
```

### Patch 2 — install `cross-env` for cross-platform env-var setting

Windows + Unix differ on env-var syntax. `cross-env` normalizes:

```bash
npm install --save-dev cross-env
```

### Patch 3 — invoke with `NODE_OPTIONS=--conditions=react-server`

The `server-only` package's `package.json` exports field has a `"react-server"` condition that maps to a no-op no-throw module. Node respects this when invoked with the `--conditions=react-server` flag. Wrap your npm script:

```json
{
  "scripts": {
    "my-script": "cross-env NODE_OPTIONS=--conditions=react-server tsx scripts/my-script.ts"
  }
}
```

## Verifying

After all three patches, `npm run my-script` should import your `server-only`-marked modules cleanly. The Next.js build (`npm run build`) still enforces the client-import protection — `server-only` is dual-purpose: throws for client at build, no-ops for `react-server`-conditions at runtime.

## Alternative: extract non-server modules

If you'd rather avoid the runtime gymnastics, extract any logic that doesn't strictly need server-only into a separate module (no `import "server-only"`) and import THAT from your script. Keep the server-only marker on the file that actually touches server resources (Anthropic API client · service-role-keyed Supabase client · filesystem access · etc.).

This is cleaner architecturally but means dual modules where one used to do.

## Why we ship this as adlc-flow reference

Surfaced during umkm-indo Trial 4b (2026-05-20) when wiring `apps/web/scripts/eval-landing.ts` against the H-001 (amended) landing-page generator. The eval-runner pattern is a **P3 best-practice** for AI features: build a deterministic mock pipeline · run it cheaply against the golden dataset · find latent bugs at $0 before paying for live LLM measurement. Without this recipe, every adopter discovers this Next.js gotcha independently — which we'd rather they spend on actual product work.

## See also

- [`docs/audit/trial-friction-log.md` § Trial 4b · F7.2](../audit/trial-friction-log.md) — surfacing context + decision to formalize
- [`skills/golden-dataset/references/mock-first-pov.md`](../../skills/golden-dataset/references/mock-first-pov.md) — the broader pattern this recipe enables
- [Anthropic prompt caching docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — for the cache-block architecture this scripting recipe complements
