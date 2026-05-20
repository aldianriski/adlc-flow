---
name: model-upgrade
description: Use when an LLM provider releases a new model version (or you're considering switching models) at P7 operate. Runs the MG gate — regression eval suite + cost delta + behavioral diff against pinned baseline; produces ADOPT/DEFER/REJECT verdict. Updates MODEL-UPGRADE-LOG.md. Do not use for prompt tweaks — that's FEEDBACK-LOG.md territory.
user-invocable: true
argument-hint: "[--feature name | --from model-vX --to model-vY]"
version: "0.1.0"
last-validated: "2026-05-19"
type: rigid
---

# model-upgrade

Run the MG gate when a new LLM model version is in consideration. Most silent failures in agentic systems come from model upgrades — this skill makes those upgrades explicit.

## When this fires

- LLM provider announces a new model version
- Provider signals a quality-impacting change to an existing model
- Adopter considers switching providers (Anthropic ↔ OpenAI ↔ open-source)
- Quarterly review per EVAL-SUITE owner cadence

## Procedure

1. **Identify scope** — which features use the model being upgraded? Pull from `MODEL-UPGRADE-LOG.md` and any `pinned-model:` fields in prompts.
2. **Confirm regression suite** — verify EVAL-SUITE plan section 6 (regression contract) is current. If not, halt and refresh first.
3. **Run regression** — execute the full eval suite at production-tuned thresholds, against the new model. Capture distribution stats per metric.
4. **Compute deltas** —
   - Per-metric: new - baseline; flag any metric where delta exceeds regression-contract tolerance
   - Cost-per-run delta; flag if exceeds budget tolerance
   - Latency p95 delta
5. **Behavioral diff sampling** — on a curated 20-50 sample subset of the golden dataset, run both models side-by-side; surface qualitatively different outputs. This catches changes the metrics miss.
6. **Cost projection** — at expected production volume, what's the monthly delta? Inform the verdict.
7. **Verdict synthesis**:
   - All metric deltas within tolerance AND cost delta within budget AND no qualitative red-flags → `ADOPT`
   - Mixed — some metric improves, some regresses → `DEFER` with explicit conditions to revisit
   - Any hard regression OR cost blow-up OR qualitative safety regression → `REJECT`
8. **Update MODEL-UPGRADE-LOG.md** — append row with all data + verdict + rollback path.
9. **If ADOPT** — update pinned-model references; schedule observation window (often 7-14 days) with elevated alert thresholds.

## Hard Rules

- Single-pass results NOT admissible — full N-run from EVAL-SUITE required.
- Behavioral diff sampling MANDATORY — metrics don't catch every surprise; qualitative side-by-side does.
- Cost delta MUST be projected at production volume, not measured at eval volume.
- Rollback path MUST be documented before `ADOPT` is finalized.
- `DEFER` MUST have explicit revisit conditions (not "we'll get back to it").

## Red Flags

❌ **"Provider claims it's better, let's adopt"** — provider quality claims are marketing; demand your golden-dataset evidence
❌ **Behavioral sampling skipped** — metrics miss persona shifts, refusal-rate changes, tone drift; sampling catches them
❌ **No rollback path for `ADOPT`** — model upgrades are deploys; deploys without rollback are gambles
❌ **`DEFER` without revisit conditions** — drifts into permanent deferral; either set conditions or REJECT honestly
❌ **Observation window skipped post-`ADOPT`** — first 1-2 weeks on new model is where production surprises surface

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
