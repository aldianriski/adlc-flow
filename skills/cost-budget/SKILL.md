---
name: cost-budget
description: Use when planning, reviewing, or revising the token-economics budget for an agentic feature — sets per-call cost ceilings, daily/monthly aggregate budgets, and alert thresholds. Cross-phase skill (AG draft → P4 ongoing → P7 audit). Updates COST-BUDGET.md. Do not use for cost accounting; this plans budgets, adopter's billing tools measure spend.
user-invocable: true
argument-hint: "[--feature name | --review existing | --refresh]"
version: "0.1.0"
last-validated: "2026-05-19"
type: rigid
---

# cost-budget

Plan the token-economics budget for an agentic feature. Output: per-feature section in `COST-BUDGET.md` with budgets, alert thresholds, and review cadence. Adopter's billing infra measures actual spend; this skill plans the targets.

## Budget Components

### 1. Per-call cost ceiling
- Average expected cost per task (prompt tokens · completion tokens · tool-call overhead · embedding lookups)
- Outlier threshold (cost > X * average → log + investigate)
- Hard cap (cost > Y → abort task, route to fallback)

### 2. Aggregate budgets
- Daily budget (with alert at 80% · auto-disable at 100% optional)
- Weekly budget
- Monthly budget aligned with finance approval
- Per-cohort breakdown (free tier vs. paid vs. internal)

### 3. Cost drivers (per feature)
- Prompt size (system + user + context blocks)
- Completion length (typical · p95 · max)
- Tool calls per task (count · average per-call cost)
- Embedding lookups per task
- Eval-run overhead (dev-loop + pre-merge + pre-release frequency)
- RAG retrieval cost (vector DB query + re-ranker if present)

### 4. Optimization levers (pre-budgeted)
- Cache eligibility (which prompt blocks are stable, eligible for prompt caching)
- Model-size routing (route low-stakes calls to smaller cheaper model)
- Context-pruning rules (drop low-relevance blocks under token pressure)
- Tool-call batching (combine N small calls into 1)
- Eval sampling (audit-rate eval vs. per-call eval where appropriate)

### 5. Alert routing
- 80% daily → warning channel
- 100% daily → page on-call + consider auto-disable
- Outlier spike (sudden 3x baseline) → immediate page

## Procedure

1. **Read** EVAL-SUITE (for eval-run overhead) + agent-architect cost model + OBSERVABILITY.md (for current alert thresholds, if any).
2. **Per-component pass** — fill in sections 1-4 one component at a time.
3. **Realism check** — does the per-call ceiling support the expected volume within the monthly budget? If not, surface conflict and propose options (lower expected quality, smaller model on cold path, reduce eval frequency).
4. **Alert wiring confirmation** — verify thresholds map to OBSERVABILITY.md alert routing; if missing, propose update there.
5. **Write** — append `## Feature: <name>` block to `COST-BUDGET.md`.

## Hard Rules

- Per-call ceiling MUST be numeric. "Reasonable" is not a ceiling.
- Daily/monthly budget MUST have an owner who can approve revisions.
- Outlier threshold MUST be looser than alert threshold but tighter than hard cap — three levels, not two.
- Eval-run overhead MUST be included; ignoring eval cost makes "cheap" PoVs into expensive features.
- Auto-disable at 100% daily MUST be an explicit yes/no decision — not silent default.

## Red Flags

❌ **No per-call ceiling, "we'll watch the bill"** — reactive cost discipline = expensive surprise
❌ **Budget excludes eval runs** — eval is part of operating cost, not free
❌ **Cache eligibility "not considered"** — prompt caching often cuts 30-70% of cost; force the decision
❌ **Outlier threshold same as alert threshold** — collapses two signals into one; you'll page on noise
❌ **No model-routing plan** — sending all calls to flagship model when 60% could go to a smaller one is wasted spend

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
