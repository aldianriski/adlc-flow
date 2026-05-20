---
name: drift-audit
description: Use when running a periodic behavior-alignment audit at P7 operate — checks whether the agent's output distribution has shifted vs. baseline despite no model/prompt change. Detects silent drift from input-distribution shift, RAG-corpus updates, or judge-model drift. Outputs DRIFT-AUDIT-<date>.md. Do not use to investigate a known regression — use dev-flow:diagnose.
user-invocable: true
argument-hint: "[--feature name | --window 7d|30d|quarterly]"
version: "0.1.0"
last-validated: "2026-05-19"
type: rigid
---

# drift-audit

Periodic check that the agent's behavior is still aligned with baseline. Agentic systems are non-stationary post-deployment — drift is the default state if you don't measure.

## What drifts (and why)

| Drift type | Cause | Detection signal |
|---|---|---|
| **Input-distribution drift** | Users find new use-cases the agent wasn't designed for | KS-test on input embedding distribution |
| **RAG-corpus drift** | Indexed documents updated; ranking shifts | Top-K retrieval set diff vs. baseline on canonical queries |
| **Eval-judge drift** | LLM-as-judge model itself changed; scoring shifts | Same outputs scored against frozen baseline judge vs. current judge |
| **Behavioral drift** | Cumulative micro-changes (prompt tweaks, context updates) | Periodic re-run of GOLDEN-DATASET against current system, delta vs. BASELINE |
| **Threshold drift** | Pass/fail thresholds softened over time | History audit of EVAL-SUITE threshold registry |

## Procedure

1. **Identify scope** — which feature(s) covered in this audit? Pull from `--feature` or audit all.
2. **For each feature**:
   - **Behavioral diff** — re-run GOLDEN-DATASET against current production; delta vs. BASELINE.md
   - **Input-distribution check** — sample production inputs (last `--window` days); statistical test vs. historical input distribution; report shift magnitude
   - **RAG retrieval diff** — for canonical queries, compare current top-K vs. baseline top-K; report overlap %
   - **Judge audit** — if LLM-as-judge is in eval suite, re-score a frozen sample with both pinned-baseline judge and current judge; report scoring delta
   - **Threshold history** — scan EVAL-SUITE threshold-registry "when-revised" entries; flag any quiet softening
3. **Synthesis** — per-feature drift score (HEALTHY / WATCHING / DRIFTED / REGRESSED).
4. **Recommendations** — for each DRIFTED or REGRESSED feature:
   - Golden-dataset refresh? (input-distribution drift)
   - RAG index re-build? (corpus drift)
   - Judge model re-pin? (judge drift)
   - MG gate run? (suspected upstream model change)
   - Add to FEEDBACK-LOG with prompt/context update plan? (behavioral drift)
5. **Write** — `DRIFT-AUDIT-<date>.md` in `docs/audits/`; cross-reference any actions opened.

## Cadence

- Default: quarterly per feature
- Accelerated: monthly if feature is high-impact / high-risk
- Triggered: on any OBSERVABILITY drift-signal alert

## Hard Rules

- Audit MUST include both quantitative (eval re-run) AND qualitative (sample inspection) passes.
- Threshold history audit MUST flag silent softening (revisions with no rationale) as REGRESSED.
- Recommendations MUST be actionable (specific skill/gate/refresh) — vague "investigate further" rejected.
- Audit reports archived in `docs/audits/` — history of drift over time is its own signal.

## Red Flags

❌ **Audit = re-run eval suite, no input-distribution check** — misses the dominant drift cause for live agents
❌ **No judge-drift check when LLM-as-judge is in eval** — judge models update silently; your "stable" metric is a moving target
❌ **Threshold softening explained as "we calibrated"** — calibration without explicit baseline shift is rationalization; demand ADR
❌ **Audit cadence quietly slipped past 6 months** — drift compounds; surface the slip and either accelerate or document accepted risk
❌ **`HEALTHY` verdict with no input-distribution data** — can't claim healthy without measuring all 5 drift types

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
