---
name: adlc-orchestrator
description: Use when starting, resuming, or completing any development task. Works for ANY project shape — greenfield (start fresh) OR mature existing codebase (preserves existing TODO.md · CHANGELOG · ADRs · sprint conventions per F4.2/F4.4/F8.1 detection · validated against 100-sprint+ mature adopters at Trial 5). Orchestrates two flows: (a) ADLC phase-gated workflow for agentic products (LLM-core agents, RAG, multi-agent) across discover/design/prove/build/validate/activate/operate modes with HG/SG/AG/VG/RG/MG gates; (b) traditional dev workflow for non-agentic features via universal skills (lean-doc-generator, adr-writer, tdd, pr-reviewer, etc.) with no ADLC gates. Both flows share sprint protocols and coexist with existing project conventions.
user-invocable: true
argument-hint: "[mode] [task-or-description]"
version: "1.2.0"
last-validated: "2026-05-20"
type: rigid
---

# adlc-orchestrator

Phase-gated workflow for agentic products + traditional dev. Read `CONTEXT.md` before acting.

## Adopter scenarios (this plugin serves all of these)

| Scenario | Best mode to start | Adapter behavior |
|---|---|---|
| **Greenfield agentic product** (LLM-core feature from scratch) | `init` → `discover` | Scaffolds 6 canonical artifacts + walks HG → SG → AG before code |
| **Greenfield traditional product** (landing · API · ops tooling) | `init` → `traditional` | Scaffolds bare artifacts · universal-surface skills (lean-doc · adr · tdd · pr-reviewer) |
| **Mature existing project · NO existing dev-flow installed** | `init` (idempotent) → `traditional` OR `discover` | Detects existing TODO.md / CHANGELOG / ADRs · preserves them · emits compat notes |
| **Mature existing project · dev-flow installed** | `init --enable` (additive) | Coexists with dev-flow · universal-surface skills carry over verbatim · see `docs/MIGRATION-FROM-DEV-FLOW.md` |
| **Multi-track sprint (concurrent work streams)** | `traditional` mode per stream | Parallel tracks allowed when file-overlap = ∅ per ADR-007 |
| **Existing ADR convention** (e.g. single-file `docs/DECISIONS.md`) | any mode | `/adr-writer` detects convention at write-time per ADR-006 F4.4 fix · appends rather than scaffolds |
| **Existing sprint protocol** (e.g. 83KB TODO.md with custom format) | any mode | Universal-surface skills detect at write-time · adapt to existing shape · see `docs/SPRINT-CONVENTION-COMPAT.md` |
| **Supabase-backed app needing AI feature** | `discover` (for the AI wedge) | Uses Vault-encryption + RLS dual-layer patterns · see `templates/SETUP-supabase.md.template` + `templates/SERVER-ACTION-RLS.md.template` |
| **Bilingual / multi-locale app** | any mode | i18n parity discipline + LocaleToggle pattern · see `templates/I18N-BILINGUAL.md.template` |
| **Production-ready deploy** | `validate` → `activate` | RG sign-off + canary plan + observability stand-up · see `templates/DEPLOY-PLAN.md.template` |

> Adopter scenarios validated across 5 dogfood trials. Full evidence base in `docs/audit/trial-friction-log.md`. The plugin's `init` script v2.8.0+ adapts to existing project conventions rather than forcing migration — `node bin/adlc-flow-init.js` against a mature codebase scaffolds only MISSING artifacts + emits compat notes for detected existing conventions.

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
- No `HYPOTHESIS.md` AND adopter-project not initialized → `init`
- Task involves an LLM-core / agentic behavior → `discover` (or later mode if hypothesis exists)
- Task is non-agentic (landing · API · refactor · ops) → `traditional`

## Phases

### init *(scaffold; works on fresh OR existing projects)*
1. Scan for canonical artifacts. Scaffold MISSING ones; SKIP existing (idempotent). Warn if adopter has competing conventions (e.g., `docs/DECISIONS.md` AND `docs/adr/` both present per ADR-007).
2. Run `node ${CLAUDE_PLUGIN_ROOT}/bin/adlc-flow-init.js`. Scaffolds `.claude/CLAUDE.md` + 6 artifact files + 3 empty dirs.
3. Confirm with human. Next: `traditional` for non-agentic work, `discover` for agentic features.

### traditional *(non-agentic work; no ADLC gates)*
1. Pick or write a sprint plan via `/lean-doc-generator` Sprint Promote (parallel-tracks allowed per ADR-007 when file-overlap == ∅).
2. Hard-to-reverse decisions → `/adr-writer` (auto-detects existing ADR convention).
3. Implement with `/tdd` + `/test-planner` for code logic; `/refactor-advisor` for code-smell sweeps; `/diagnose` for defects; `/zoom-out` for orientation.
4. Pre-merge: dispatch `code-reviewer` agent (wraps `/pr-reviewer`). DB changes → `migration-analyst`. Hot paths → `performance-analyst`. Security surface → `security-analyst` (separate `/security-review`).
5. Falsifiable non-agentic claims (conversion · latency · reliability) → `/hypothesis-register --type=<class>` (per ADR-007).
6. Release → `/release-patch` for PATCH, `/release-manager` for MINOR/MAJOR.

### discover *(P0+P1)*
1. **HG Hypothesis Gate** — dispatch `/hypothesis-register` (default `--type=agentic`); kill-criteria written *before* prototyping
2. **SG Scope Gate** — dispatch `/responsibility-map` for human-agent grid; KPI thresholds ratified

### design *(P2)*
1. Dispatch `/agent-architect` — pattern (ReAct / Plan-Execute / multi-agent) + ADR via `/adr-writer`
2. Dispatch `/eval-suite-planner` — runnable eval plan at `EVAL-SUITE/<feature>/PLAN.md`
3. **AG Architecture Gate** — BLOCK on missing eval strategy

### prove *(P3)* — **hard go/no-go**
1. Dispatch `/golden-dataset` — versioned corpus under `GOLDEN-DATASET/<feature>/v1/`
2. PoV prototype aimed at highest-risk assumption, NOT UI polish
3. Dispatch `/pov-gate` — `GO` / `GO_WITH_CONCERNS` / `NO_GO` against `EVAL-SUITE/<feature>/STRATEGY.md` thresholds

### build *(P4)* · change → eval → confirm → proceed loop
1. Continuous fast eval after every meaningful change; no batch testing
2. `/context-engineer` for memory · history · RAG · injection-surface review (graphify-backed)
3. `code-reviewer` agent on commits; `prompt-reviewer` agent on prompts-as-artifacts

### validate *(P5)*
1. `/release-readiness` + `red-team-analyst` agent
2. Code-side: `security-analyst` · `performance-analyst` (if hot-paths) · `migration-analyst` (if DB schema)
3. **RG Release-Readiness Gate** — multi-metric sign-off

### activate *(P6)*
1. `/canary-plan` · `/ai-observe` schema · rollback/containment plan

### operate *(P7)*
1. Feedback loop via `FEEDBACK-LOG.md` · `/drift-audit` quarterly · `/model-upgrade` on LLM bump (MG gate) · `/cost-budget` audit

---

## Dispatcher Role

This skill IS the dispatcher role. Coordinate; never self-implement. Restate task as verifiable goal AND name its mode → run applicable gates → dispatch skill → gate human approval (never self-approve).

## Red Flags

❌ **Eval strategy skipped at AG** — ADLC's signature failure mode; rejects the gate
❌ **`NO_GO` from `/pov-gate` overridden silently** — requires explicit human ADR documenting accepted risk
❌ **Model upgraded without regression run** — silent failures dominate agentic post-deployment incidents
❌ **Single-pass eval results presented as pass/fail** — agentic behavior is distributional; report N-run thresholds
❌ **`traditional` mode used for agentic work** — bypasses HG kill-criteria + AG eval-strategy + VG go/no-go; surface the agentic surface and switch to `discover`

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
