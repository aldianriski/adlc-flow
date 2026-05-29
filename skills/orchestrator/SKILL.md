---
name: orchestrator
description: Use when starting, resuming, or completing any development task. Works for ANY project shape — greenfield (start fresh) OR mature existing codebase (preserves existing TODO.md · CHANGELOG · ADRs · sprint conventions per F4.2/F4.4/F8.1 detection · validated against 100-sprint+ mature adopters at Trial 5). Orchestrates two flows: (a) ADLC phase-gated workflow for agentic products (LLM-core agents, RAG, multi-agent) across discover/design/prove/build/validate/activate/operate modes with HG/SG/AG/VG/RG/MG gates; (b) traditional dev workflow for non-agentic features via universal skills (lean-doc-generator, adr-writer, tdd, pr-reviewer, etc.) with no ADLC gates. Both flows share sprint protocols and coexist with existing project conventions.
user-invocable: true
argument-hint: "[mode] [task-or-description]"
version: "1.2.0"
last-validated: "2026-05-20"
type: rigid
---

# orchestrator

Phase-gated workflow for agentic products + traditional dev. Read `CONTEXT.md` before acting.

## Usage tiers (ADR-010) — full chains: `references/optimal-flow.md`

- **Daily core** (most days) — `/prime` → work → `/lean-doc-generator`. No gates; this dispatcher optional.
- **Per-feature** — `traditional` + `/tdd` · `/test-planner` · `/adr-writer` · `code-reviewer` · release.
- **Agentic (opt-in)** — `discover`→`operate` + HG/SG/AG/VG/RG/MG + agentic-tier artifacts (`doc-registry.json`).

## Adopter scenarios

| Scenario | Start mode | Adapter behavior |
|---|---|---|
| Greenfield agentic product | `init` → `discover` | Scaffolds 6 artifacts + HG/SG/AG before code |
| Greenfield traditional (landing · API · ops) | `init` → `traditional` | Universal-surface skills · no ADLC gates |
| Mature project (no dev-flow) | `init` idempotent | Detects existing TODO/CHANGELOG/ADRs · preserves · compat notes |
| Mature project (dev-flow installed) | `init --enable` | Coexists · see `docs/MIGRATION-FROM-DEV-FLOW.md` |
| Multi-track concurrent streams | `traditional` per stream | Parallel allowed when file-overlap = ∅ (ADR-007) |
| Supabase + AI wedge | `discover` | Vault + RLS dual-layer · `templates/SETUP-supabase.md.template` + `SERVER-ACTION-RLS.md.template` |
| Bilingual / multi-locale | any | i18n parity · `templates/I18N-BILINGUAL.md.template` |
| Production-ready deploy | `validate` → `activate` | RG + canary + observability · `templates/DEPLOY-PLAN.md.template` |

> Validated across 5 dogfood trials; evidence in `docs/audit/trial-friction-log.md`. Existing ADR/sprint conventions are auto-detected at write-time (ADR-006 F4.4 · `docs/SPRINT-CONVENTION-COMPAT.md`).

## Mode Dispatch

| Mode | ADLC Phase | Gates | Use when |
|---|---|---|---|
| `init` | — | none | scaffold artifact files (new or existing adopter project) |
| `traditional` | — | none | non-agentic work (landing pages · APIs · ops tooling · refactors) |
| `discover` | P0+P1 | HG → SG | agentic feature starting from a business pain point |
| `design` | P2 | AG | hypothesis ratified, choosing agent pattern |
| `prove` | P3 | VG | architecture set, before production code |
| `build` | P4 | none (continuous eval loop) | PoV passed, building production system |
| `validate` | P5 | RG | release-readiness sign-off |
| `activate` | P6 | none | canary / observability stand-up |
| `operate` | P7 | MG per upgrade | feedback, drift, model upgrades |

Freeform input dispatch:
- Pure daily doc/dev work (no new feature, no agentic behavior) → skip gates; route to Daily core (`/prime` + `/lean-doc-generator`)
- No `HYPOTHESIS.md` AND adopter-project not initialized → `init`
- Task involves an LLM-core / agentic behavior → `discover` (or later mode if hypothesis exists)
- Task is non-agentic (landing · API · refactor · ops) → `traditional`

## Phases

### init *(scaffold; fresh OR existing)*
1. Run `node ${CLAUDE_PLUGIN_ROOT}/bin/adlc-flow-init.js` — idempotent scaffold of `.claude/CLAUDE.md` + 6 artifacts + 3 dirs. Warn on competing conventions (ADR-007).
2. Confirm with human. Next: `traditional` (non-agentic) or `discover` (agentic).

### traditional *(non-agentic; no ADLC gates)*
1. Sprint plan via `/lean-doc-generator` (parallel tracks if file-overlap = ∅ per ADR-007).
2. Hard-to-reverse decisions → `/adr-writer` (auto-detects existing convention).
3. Implement: `/tdd` + `/test-planner` · `/refactor-advisor` · `/diagnose` · `/zoom-out`.
4. Pre-merge: `code-reviewer` agent. DB → `migration-analyst`. Hot path → `performance-analyst`. Security → `security-analyst` via `/security-review`.
5. Falsifiable non-agentic claims → `/hypothesis-register --type=<class>` (ADR-007).
6. Release → `/release-patch` (PATCH) or `/release-manager` (MINOR/MAJOR).

### discover *(P0+P1)* — HG `/hypothesis-register` (kill-criteria before prototype) · SG `/responsibility-map` (human-agent grid + KPI thresholds)
### design *(P2)* — `/agent-architect` (ReAct / Plan-Execute / multi-agent) + ADR · `/eval-suite-planner` → `EVAL-SUITE/<feature>/PLAN.md` · **AG BLOCKS on missing eval strategy**
### prove *(P3)* — `/golden-dataset` (`GOLDEN-DATASET/<feature>/v1/`) · PoV on highest-risk assumption (NOT UI) · `/pov-gate` GO/CONCERNS/NO_GO vs STRATEGY thresholds
### build *(P4)* — change→eval→confirm loop; continuous fast eval. `/context-engineer` (memory/RAG/injection). `code-reviewer` + `prompt-reviewer` agents.
### validate *(P5)* — `/release-readiness` + `red-team-analyst`. Code-side: `security-analyst` · `performance-analyst` · `migration-analyst`. **RG multi-metric sign-off.**
### activate *(P6)* — `/canary-plan` · `/ai-observe` schema · rollback plan
### operate *(P7)* — `FEEDBACK-LOG.md` · `/drift-audit` quarterly · `/model-upgrade` per LLM bump (MG) · `/cost-budget` audit

---

## Dispatcher Role

This skill IS the dispatcher. Coordinate; never self-implement. Restate task as verifiable goal + name mode → run gates → dispatch skill → gate human approval.

## Red Flags

❌ Eval strategy skipped at AG (ADLC signature failure)
❌ `/pov-gate` `NO_GO` overridden silently (requires human ADR accepting risk)
❌ Model upgrade without regression run
❌ Single-pass eval results as pass/fail (agentic behavior is distributional; report N-run thresholds)
❌ `traditional` mode used for agentic work (bypasses HG/AG/VG; switch to `discover`)

## References

- `references/non-adlc-skill-integration.md` — handoff points for non-ADLC skills per phase (Trial 4b F7.4)
- `references/optimal-flow.md` — tier model + daily/feature/agentic skill chains (ADR-010)

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
