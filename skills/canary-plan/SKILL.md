---
name: canary-plan
description: Use when designing controlled rollout of an agentic feature at P6 activate — canary cohort definition, ramp schedule, success criteria, abort triggers, rollback/containment plan. Outputs CANARY-PLAN-<feature>.md. Do not use for simple PATCH-level deploys with no behavior risk.
user-invocable: true
argument-hint: "[--feature name]"
version: "0.1.0"
last-validated: "2026-05-19"
type: rigid
---

# canary-plan

Design the rollout for an agentic feature that has passed RG. Outputs `CANARY-PLAN-<feature>.md`. Activation is the start of monitoring, not the end of development — this plan is the bridge.

## Plan Sections

### 1. Cohort definition
- Cohort selection criteria (random %? specific user segment? geographic? internal first?)
- Sample size justification (statistical power for behavioral metrics, not just code-deploy smoke test)
- Exclusion list (high-risk user segments held back until full ramp)

### 2. Ramp schedule
- Stages with % traffic per stage
- Minimum dwell time per stage (long enough to surface behavioral signal, not just latency)
- Promotion criteria per stage (which observability metrics must hold)

### 3. Success criteria
- Per-stage: which OBSERVABILITY.md metrics must stay within threshold
- Baseline source — pre-canary baseline must exist
- Statistical floor — minimum traffic before promotion decision is admissible

### 4. Abort triggers
- Hard-abort metrics (escalation rate > X, cost spike > Y, hallucination > Z) — auto-disable
- Soft-abort signals (drift trending wrong) — page on-call but don't auto-disable
- Time-bound abort — auto-rollback if no promotion decision in T hours

### 5. Rollback / containment
- Disable mechanism (feature flag · routing override · canary-shrink to 0%)
- Recovery procedure (state cleanup · in-flight task draining · user notification)
- Verification — how to confirm rollback succeeded (not just deploy succeeded)

### 6. Communication
- Stakeholder notification at each ramp stage
- Incident channel if abort triggers fire
- Adopter-side: end-user messaging if user-visible regression occurs

## Procedure

1. **Read** RELEASE-READINESS doc + OBSERVABILITY schema + RESPONSIBILITY-MAP (for unsafe-autonomy escalations).
2. **Stage design** — propose 3-5 stages (e.g., 1% internal → 5% beta → 25% → 50% → 100%). Justify dwell times.
3. **Trigger thresholds** — pull from OBSERVABILITY.md alert thresholds; if absent, halt.
4. **Rollback dry-run protocol** — document the steps to test rollback before canary starts. Untested rollbacks are theatrical.
5. **Final doc** — `CANARY-PLAN-<feature>.md` with all sections + sign-off from canary lead.

## Hard Rules

- Dwell time per stage MUST be calibrated to detect behavioral drift, not just system health. Code deploys can promote in minutes; agentic canaries typically need hours-to-days per stage.
- Abort triggers MUST be wired BEFORE canary starts. Wiring abort logic during incident is incident.
- Rollback procedure MUST be tested (or at minimum dry-run) before canary launches.
- Statistical floor per stage MUST be defined — auto-promotion on n=10 user traffic is taste, not data.

## Red Flags

❌ **"Promote each stage in 30 minutes"** — fine for code; deceptive for agent behavior; specify per-metric dwell
❌ **Abort triggers tied only to error rates** — agentic failures often have 0% errors and 30% wrong answers; behavior metrics required
❌ **Rollback = `git revert`** — for prompt/context changes that altered persistent memory or vector indices, deploy-revert ≠ rollback
❌ **No internal-first stage** — sending an unvalidated agent to real users for first contact is anti-ADLC
❌ **Communication plan = "we'll Slack if something goes wrong"** — define cadence and channels up front

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
