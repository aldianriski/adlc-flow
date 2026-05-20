---
name: ai-observe
description: Use when designing the observability schema for an agentic feature at P6 activate or P7 operate — behavioral metrics (hallucination, drift, toxicity), operational metrics (latency, cost, escalation), drift signals, alert routing. Emits config, not telemetry. Outputs OBSERVABILITY.md updates. Do not use for system-health monitoring — that's adopter-project infra.
user-invocable: true
argument-hint: "[--feature name | --refresh existing]"
version: "0.1.0"
last-validated: "2026-05-19"
type: rigid
---

# ai-observe

Generate / update the observability schema for an agentic feature. The schema is **what the adopter project measures**; this skill does not implement the telemetry stack (Helicone, OpenLLMetry, custom collectors are the adopter's choice).

## Schema Components

| Component | Lives in OBSERVABILITY.md section | What goes in it |
|---|---|---|
| Behavioral metrics | `## Metrics § Behavioral` | hallucination · drift · toxicity · tool-call success · others domain-specific |
| Operational metrics | `## Metrics § Operational` | latency p50/p95/p99 · cost/task · escalation rate · confidence-on-low-quality |
| Drift signals | `## Drift signals` | input-distribution shift · eval delta · model-provider notification |
| Alert routing | `## Alert routing` | severity → channel → on-call flag |
| Rollback / containment hooks | `## Rollback / containment` | conditions → action (auto-disable, canary-shrink, route to fallback) |

## Procedure

1. **Read** EVAL-SUITE plan + RESPONSIBILITY-MAP + CANARY-PLAN (if present). The OBSERVABILITY schema must be consistent with these.
2. **Behavioral metrics** — for each metric in EVAL-SUITE, decide:
   - Sample rate (every call · 10% · daily batch)
   - Measurement source (eval-judge call · scoring model · domain heuristic)
   - Alert threshold (typically tighter than VG threshold; production-tuned)
3. **Operational metrics** — propose defaults; user accepts/edits:
   - Latency p50/p95/p99 with budget per percentile
   - Cost per task with budget + spike threshold
   - Escalation rate (from RESPONSIBILITY-MAP escalation triggers)
4. **Drift signals** — set up the triggers that schedule `/drift-audit`:
   - Statistical test for input distribution (KS-test, embedding-space shift, etc.)
   - Eval-delta tolerance from regression contract
   - External signals (provider blog, model changelog feeds — if any)
5. **Alert routing** — severity matrix; on-call yes/no; channel per severity.
6. **Rollback hooks** — auto-disable conditions; manual-disable channel; verification steps.
7. **Write** — update OBSERVABILITY.md (overwrites the section being refreshed; appends new feature subsection).

## Hard Rules

- Every alert threshold MUST have a numeric value. "When it looks weird" is not a threshold.
- Every metric MUST have a measurement source. Unmeasured metrics are wishes.
- Auto-disable conditions MUST be conservative — accidental auto-disables are easier to recover from than a runaway agent.
- Sample rates that are too cheap to be useful (1% on a 10-rps endpoint = 6/min, won't catch rare failures) MUST be flagged.
- This skill emits SCHEMA only. Adopter implements collection. Plugin claims this scope in `docs/USER-OUTCOMES.md`.

## Red Flags

❌ **"Monitor latency and cost"** — those are operational only; require ≥3 behavioral metrics
❌ **Alert threshold = "investigate when on-call has time"** — defines noise, not an alert; either page or drop the metric
❌ **No drift signals defined** — drift detection is A5 outcome; absent = uncoverable failure mode
❌ **Auto-disable threshold same as alert threshold** — auto-disable should be 2-3x noisier than page-on-call
❌ **No rollback verification step** — "we triggered the disable" ≠ "agent stopped"; verify

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
