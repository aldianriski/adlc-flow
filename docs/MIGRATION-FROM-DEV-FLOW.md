---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
status: current
audience: Adopters of `dev-flow` (the predecessor plugin) considering migration to `adlc-flow`.
---

# Migrating from dev-flow to adlc-flow

`adlc-flow` is the successor to `dev-flow` per [ADR-004](adr/ADR-004-absorb-dev-flow.md).
The universal-surface skills (sprint protocols · ADR writing · code review · debugging) were
absorbed wholesale — they continue to work identically. The plugin adds ADLC-specific
skills (`/hypothesis-register` · `/responsibility-map` · `/agent-architect` · `/pov-gate`
etc.) for agentic feature work, plus an `/orchestrator` that coordinates the lifecycle.

This guide is for projects with existing `.claude/CLAUDE.md` referencing dev-flow slash
commands. Per Trial 5 finding F8.2 (mature-adopter dogfood 2026-05-20), the migration
deserves explicit guidance.

## Skill name compatibility — what carries over verbatim

These slash commands behave identically in adlc-flow (no edits needed in your
`.claude/CLAUDE.md` or workflow):

| Skill | Behavior |
|---|---|
| `/prime` | Loads ordered context (CLAUDE.md → CONTEXT.md → TODO.md → sprint file). Identical. |
| `/lean-doc-generator` | Sprint plan generator. Identical. |
| `/adr-writer` | ADR writing skill. **v2.3+ enhancement**: now detects existing single-file conventions (e.g. `docs/DECISIONS.md`) and appends rather than scaffolding loose files (F4.4 fix). |
| `/pr-reviewer` | 7-lens code review. Identical. |
| `/security-auditor` | OWASP audit in separate session. Identical. |
| `/refactor-advisor` | Code-smell + deep-module candidates. Identical. |
| `/diagnose` | 6-phase systematic debugging. Identical. |
| `/tdd` | Red-green-refactor for deterministic code. Identical. |
| `/test-planner` | Group test planning. Identical. |
| `/release-patch` | Patch release coordination. Identical. |
| `/release-manager` | Major/minor release coordination. Identical. |
| `/codemap-refresh` | (Retired in v2.1.0 — replaced by `/zoom-out` with graphify backend.) |

## Skill name changes — update your CLAUDE.md

| dev-flow | adlc-flow | What to change |
|---|---|---|
| `/orchestrator` | `/orchestrator` | Different command name. `/orchestrator` may still resolve but the canonical name in v2.x is `/orchestrator`. Update your `.claude/CLAUDE.md` Session Workflow section. |

## NEW skills (no dev-flow analog)

For agentic feature work, these skills are NEW in adlc-flow:

| Skill | Purpose | Gate |
|---|---|---|
| `/hypothesis-register` | Falsifiable claim + kill-criteria artifact | HG |
| `/responsibility-map` | Human-agent decision/approval grid | SG |
| `/agent-architect` | ReAct vs Plan-Execute vs multi-agent decision + ADR | AG |
| `/eval-suite-planner` | Methodology + thresholds + cadence + regression contract | AG support |
| `/golden-dataset` | Versioned ground-truth corpus | P3 prep |
| `/pov-gate` | PoV go/no-go report against golden dataset | VG |
| `/context-engineer` | Memory · history · RAG · injection surface review | P4 |
| `/release-readiness` | RG sign-off doc generator | RG |
| `/canary-plan` | Controlled-rollout designer | RG/MG |
| `/ai-observe` | Observability schema generator | RG |
| `/model-upgrade` | MG gate runner on LLM version bump | MG |
| `/drift-audit` | Periodic behavior-alignment audit | MG |
| `/cost-budget` | Token-economics planner | AG/P7 |

You don't have to use these. If your project doesn't ship agentic features, just keep
using the universal-surface skills as before.

## Recommended migration sequence

1. **Install adlc-flow** alongside dev-flow (both can be enabled at once · they share
   universal-surface skills which won't conflict).
   ```
   claude plugin add adlc-flow
   ```
   OR edit `.claude/settings.json` to add `"adlc-flow": true` under `enabledPlugins`.

2. **Run `init`** from your adopter project root:
   ```
   node ~/.claude/plugins/adlc-flow/bin/adlc-flow-init.js
   ```
   v2.8.0+: this detects existing TODO.md / CHANGELOG / ADR conventions and adapts
   (F8.1 · F8.3 · F8.4). Idempotent — re-running skips existing files.

3. **Edit `.claude/CLAUDE.md` Session Workflow** to reference `/orchestrator`
   alongside any dev-flow vocabulary you keep. Many projects keep dev-flow's
   `/prime` + `/lean-doc-generator` + `/orchestrator` as their daily-driver and only
   invoke ADLC-specific skills when agentic features land.

4. **Keep dev-flow installed** as long as you want, OR remove from
   `enabledPlugins`. Universal-surface skills resolve through adlc-flow regardless.

5. **First agentic feature**: run `/orchestrator discover "<pain point>"` to walk
   HG → SG → AG before writing code. See the Trial 4 (umkm-indo) + Trial 5 (temidev)
   examples in `docs/audit/trial-friction-log.md` for canonical applications.

## What if I have an existing `docs/DECISIONS.md`?

adlc-flow's `init` v2.8.0+ detects the convention and writes
`docs/adr/POINTER.md` (a sentinel · NOT a `.gitkeep`) redirecting `/adr-writer` to
your existing file. Per Trial 5 finding F4.4 (validated in F8.18), the single-file
convention scales to 49+ ADRs without issues.

## What if I have an existing TODO.md / CHANGELOG.md?

adlc-flow's `init` v2.8.0+ detects them and emits a compatibility note pointing to
[`docs/SPRINT-CONVENTION-COMPAT.md`](SPRINT-CONVENTION-COMPAT.md). Short version:
your existing sprint protocol coexists with adlc-flow's universal protocol; no
migration required.

## Trial 5 cross-references

- `docs/audit/trial-friction-log.md` § Trial 5 — mature-adopter dogfood on temidev
  (an existing dev-flow user) · 31 findings captured · 11 commits validated this
  migration shape end-to-end.
- ADR-004 — original absorb-dev-flow decision.
- ADR-006 — eval artifact standardization (Trial 1 F4.4 fix · refined in this migration's F8.1).
