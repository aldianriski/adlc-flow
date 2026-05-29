# Unit tests (zero-dep · `node:test`)

Behavioral + integrity tests for the executable surface. No dependencies — uses the Node ≥18 built-in test runner.

```bash
node --test tests/unit          # run all
node --test tests/unit/init.test.js   # run one file
```

| File | Covers |
|---|---|
| `doc-registry.test.js` | `doc-registry.json` integrity — shape, required fields, enum tiers/kinds, unique ids/paths, every `owner` maps to a real skill (the drift guard from ADR-010). |
| `session-start.test.js` | SessionStart hook — CLAUDE.md gate (exit 0/1), registry-driven agentic warning, tier filter (always-tier docs never nagged). |
| `init.test.js` | `bin/adlc-flow-init.js` — scaffolds canonical artifacts, idempotent on re-run, never writes into the plugin repo. |

Subprocess tests scaffold into an OS temp dir and clean up after themselves. The structural skill/agent gate lives separately at `scripts/eval-skills.js`.
