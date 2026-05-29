---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
purpose: When and how to invoke non-ADLC skills during the ADLC lifecycle
status: validated (umkm-indo Trial 4b)
---

# Non-ADLC skill integration during the lifecycle

## TL;DR

ADLC handles the **phase-gated discipline** (HG → SG → AG → VG → RG → MG). It does NOT handle every craft sub-discipline inside those phases. For visual polish · vendor-specific integrations · code-review quality · auth scaffolding etc., adopters should invoke specialized skills mid-flow. This doc lists recommended hand-off points so adopters don't miss the integration moment.

## When to invoke during the lifecycle

### P0 / P1 (discover · HG · SG)

ADLC-native skills handle the artifact production (`/hypothesis-register` · `/responsibility-map`). External skills rarely fit here — the work is pure thinking + writing.

Exception: **`/task-decomposer`** if intake came from a PRD or ticket dump and needs structured decomposition before hypothesis work.

### P2 (design · AG)

This is where most non-ADLC skill integration happens, because design choices span domains:

- **`/agent-architect`** (ADLC-native) — pattern choice + cost model
- **`/eval-suite-planner`** (ADLC-native) — eval design
- **`/adr-writer`** (ADLC-native) — decision documentation

Plus optional craft skills mid-design:
- **Specialized infrastructure skills** (`/supabase` if Postgres+RLS · `/aws-cdk` if AWS · etc.) — invoke when the AG decision needs vendor-specific schema or capability research. Don't try to ADR vendor specifics without consulting the vendor skill's reference.
- **`/security-auditor`** — if the architecture decision touches auth, secrets, or cross-tenant data isolation. Better to invoke at AG when the design is still malleable than at RG when you've already shipped insecure scaffolding.
- **`/skill-creator`** — if you discover your project needs its OWN custom skill (e.g. domain-specific validator). Build it during AG so subsequent phases benefit.

### P3 (prove · VG prep)

- **`/golden-dataset`** (ADLC-native) — sample curation
- **`/pov-gate`** (ADLC-native) — verdict
- **Eval-runner scripts** — see `docs/references/script-from-nextjs.md` for the standalone-script + server-only recipe

### P4 (build)

- **ADLC-native**: `/context-engineer` · `/cost-budget`
- **`/tdd`** for the deterministic surrounding code (non-LLM logic)
- **`/diagnose`** for any defect you hit in the build
- **`/refactor-advisor`** when AI-pipeline glue code grows unwieldy
- **`/pr-reviewer`** + `/security-auditor` at PR-review time (NOT at first-write)
- **Visual polish skills** (`/frontend-design` for distinctive frontend aesthetic · domain-specific UI skills). **This is where umkm-indo Trial 4b invoked `/frontend-design`** to polish 3 themes from minor variations into distinct aesthetic worlds. Worked great. Recommended hand-off point.

### P5 / RG (validate / release-readiness)

- **`/release-readiness`** (ADLC-native) — sign-off doc
- **`/security-auditor`** — separate `/security-review` session per ADR-029-style RG gate
- **`/red-team-analyst`** — adversarial PoC review

### P6 / P7 (activate · operate · MG)

- **ADLC-native**: `/canary-plan` · `/ai-observe` · `/drift-audit` · `/model-upgrade`
- **`/cost-analyst`** for billing-API integration audits

## Discoverability hand-off pattern

When invoking a non-ADLC skill mid-flow, the assistant should:

1. Surface to the user **which phase you're in** (e.g. "we're at AG, finalizing pattern choice")
2. Surface **why** the non-ADLC skill is being invoked (e.g. "the storefront generation has visual polish needs that warrant /frontend-design")
3. Resume the ADLC procedure at the right step afterwards (don't lose the gate context)

## Anti-patterns

- **Skipping ADLC discipline to "just ship faster"** — adopters who bypass HG to call straight into `/frontend-design` lose the kill-criteria pre-commitment. The polish lives INSIDE the ADLC arc.
- **Hand-rolling work that a specialized skill does well** — `/supabase` knows RLS patterns better than ad-hoc code. Use the skill.
- **Loading every available skill into the context window**: spawn skills on-demand. The skill system handles dispatch.

## Cross-trial validation

- Trial 4b (F7.4) — `/frontend-design` invoked mid-AG polish of umkm-indo themes. Worked smoothly · produced dramatically better visual differentiation than my prior CSS heuristics. Confirms the hand-off pattern as a recommended P4-polish step.

## See also

- [`docs/audit/trial-friction-log.md` § Trial 4b · F7.4](../../../docs/audit/trial-friction-log.md)
- The skill's own SKILL.md for invocation details
