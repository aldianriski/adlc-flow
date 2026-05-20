---
name: release-readiness
description: Use when producing the formal release-readiness sign-off document for an agentic feature at P5 validate. ADLC RG gate artifact — multi-metric sign-off across eval thresholds, UAT, bias/fairness, red-team findings, performance, and incident-response plan. Do not use for trivial patches — use dev-flow:release-patch for PATCH-only releases.
user-invocable: true
argument-hint: "[--feature name]"
version: "0.1.0"
last-validated: "2026-05-19"
type: rigid
---

# release-readiness

Produce the RG-gate sign-off document. Output: `RELEASE-READINESS-<feature>-v<N>.md` with all required sections populated and signed.

## Required Sections

### 1. Eval suite results
- Full eval-suite run at production-tuned thresholds (not dev-loop subset)
- Per-metric: distribution stats + threshold + verdict (PASS / MARGINAL / FAIL)
- Cross-reference: BASELINE.md from golden-dataset v<N>
- Delta vs. baseline must be within regression-contract tolerance

### 2. UAT sign-off
- Stakeholder list + sign-off dates
- Scenarios tested
- Open issues + decision (block / accept / defer)

### 3. Bias / fairness audit
- Sub-population analysis where applicable (demographic / geographic / linguistic)
- Disparity metrics with thresholds
- Mitigation actions if disparity detected

### 4. Red-team findings
- Adversarial test categories run (prompt injection · goal hijacking · sensitive-data extraction · tool-call manipulation)
- Findings + severity + mitigation status
- CRITICAL findings block release; HIGH findings require documented residual-risk acceptance

### 5. Performance + scalability
- Latency p50/p95/p99 at expected load
- Cost per task at expected volume
- Failure-mode behavior (rate-limit / timeout / partial response)

### 6. Compliance + safety
- Regulatory requirements mapped to enforcement points (e.g., GDPR data-handling, HIPAA, sector-specific)
- Safety guardrails verified active

### 7. Rollback / containment plan
- Disable mechanism (feature flag · canary-shrink · routing override)
- Trigger criteria (which observability alert triggers auto-disable)
- Recovery procedure

### 8. Sign-offs
- Eval owner
- Feature lead
- Security/compliance reviewer
- Product owner

## Procedure

1. **Verify inputs** — eval-suite results exist + golden-dataset BASELINE current + responsibility-map current + observability schema drafted.
2. **Section-by-section** — work through sections 1-7 sequentially; halt at any FAIL or CRITICAL finding.
3. **Synthesize verdict** — overall: READY / READY_WITH_CONCERNS / NOT_READY.
4. **Sign-offs** — names and dates only after all blocking items resolved. Skill does NOT auto-sign.
5. **Write** — final doc lands in `docs/releases/RELEASE-READINESS-<feature>-v<N>.md`. ADR if any concerns required acceptance.

## Hard Rules

- Single-source-of-truth metrics — every number in the doc traces to a specific eval-suite run ID.
- NO sign-off block populated until all sections complete + no `FAIL` or `CRITICAL` remains.
- Bias / fairness section CANNOT be marked "N/A" without explicit rationale (most agentic features have demographic surfaces).
- Red-team section CANNOT be skipped — at minimum, prompt-injection + goal-hijacking categories MUST be tested.
- Rollback plan MUST be executable today — not "we'll figure out rollback if needed."

## Red Flags

❌ **`READY` declared while `MARGINAL` metric is in the list** — promote MARGINAL to a documented residual-risk ADR or downgrade to `READY_WITH_CONCERNS`
❌ **Sign-offs collected before audits complete** — order matters; reject the doc
❌ **Red-team = "we'll do it post-launch"** — defeats RG gate; ADLC anti-pattern
❌ **Rollback plan = "revert the deploy"** — for stateful agents, deploy-revert ≠ rollback; specify state-recovery
❌ **Performance numbers from dev-loop, not production-tuned config** — replace with realistic load-test numbers

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
