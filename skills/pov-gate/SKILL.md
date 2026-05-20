---
name: pov-gate
description: Use when an agentic feature's PoV prototype is ready to be judged against its golden dataset. ADLC Phase 3 (P3) hard go/no-go gate — emits GO / GO_WITH_CONCERNS / NO_GO verdict against pre-committed thresholds from the hypothesis. Writes verdict to EVAL-SUITE/<feature>/VG-VERDICTS.md (append-only audit log) AND updates HYPOTHESIS.md row status. Do not use for production validation — use /release-readiness at RG gate.
user-invocable: true
argument-hint: "[--hypothesis H-NNN | --feature name] [--results path/to/eval-output]"
version: "1.2.0"
last-validated: "2026-05-20"
type: rigid
---

# pov-gate

Hard go/no-go evaluation of a PoV prototype against pre-committed thresholds. ADLC's most distinctive gate — the explicit pre-production stop that kills bad ideas at minimum cost.

## Inputs Required

1. **Hypothesis row** — `HYPOTHESIS.md` with kill-criteria written at HG.
2. **Eval strategy** — `EVAL-SUITE/<feature>/STRATEGY.md` (methodology + thresholds; from `/agent-architect`).
3. **Eval plan** — `EVAL-SUITE/<feature>/PLAN.md` (sample-count floor · cadence; from `/eval-suite-planner`).
4. **Golden dataset** — `GOLDEN-DATASET/<feature>/v<N>/` with samples populated; `current` pointer present.
5. **Eval results** — output of running eval suite against PoV prototype. User points to file or pastes summary.

If any input missing, halt and prompt user to supply or skip the gate (skipping requires explicit ADR documenting accepted risk).

## Procedure

1. **Verify inputs** — all 5 above present. Verify **sample count** in `GOLDEN-DATASET/<feature>/v<N>/samples/` meets or exceeds the N-floor from `PLAN.md` § 2. If short, halt with `INSUFFICIENT_SAMPLES: dataset has N=<actual>, PLAN.md § 2 requires ≥<floor>`.
2. **Load** hypothesis row + STRATEGY thresholds + PLAN sample-count + eval results.
3. **Per-metric verdict** — for each threshold in STRATEGY:
   - Compute distribution stats from N-run results (mean · p50 · p95 · stdev)
   - Compare against pass-threshold and fail-threshold
   - Mark metric: `PASS` / `MARGINAL` / `FAIL`
4. **Kill-criteria check** — re-read HYPOTHESIS.md row kill-criteria. Independently check whether any kill-criterion is triggered.
5. **Cost check** — actual cost-per-run vs budget envelope from STRATEGY § Cost model. Mark: `WITHIN_BUDGET` / `OVER_BUDGET`.
6. **Hallucination check** — for any feature where factual correctness matters, surface the hallucination-rate metric explicitly; if not measured, flag as a blocker.
7. **Verdict synthesis**:
   - All metrics `PASS` AND no kill-criteria triggered AND `WITHIN_BUDGET` → `GO`
   - Mixed: ≥1 `MARGINAL`, no `FAIL`, no kill-criterion triggered → `GO_WITH_CONCERNS` (concerns + mitigation plan required)
   - Any `FAIL` OR kill-criterion triggered OR `OVER_BUDGET` → `NO_GO`
8. **Persist verdict** — append entry to `EVAL-SUITE/<feature>/VG-VERDICTS.md` (create from template if missing):
   ```
   ### YYYY-MM-DD | Run pov-NNN | <GO | GO_WITH_CONCERNS | NO_GO>
   Hypothesis: H-NNN @ <hypothesis-version-or-row-date>
   Per-metric: <full distribution table>
   Kill-criteria: <triggered? which?>
   Cost: <within/over budget · projected monthly $X>
   Sample-count: <N actual / N floor>

   Headroom callout (F5.6 · v2.5): for each metric within 10% of its kill threshold,
   emit one warning line BEFORE recommendation, e.g.
     ⚠ cost/ticket headroom: 7% (next budget cycle could push past kill threshold)
     ⚠ hallucination headroom: 6% (small prompt regression could trigger kill)
   No callout if all metrics have >10% headroom.

   Mitigation plan (REQUIRED if GO_WITH_CONCERNS or NO_GO · F5.5 · v2.5) — one block per finding:
     Finding 1: <specific metric / kill-criterion that fired or sits in MARGINAL band>
       Proposed fix: <concrete action — prompt change · dataset patch · architecture revision>
       Re-eval acceptance criterion: <measurable threshold the fix must clear to clear this finding>
     Finding 2: …
   Without per-finding structure, mitigation is wishful thinking; reject vague plans.

   Recommendation: <proceed to P4 | mitigation iteration with re-eval gate | abort / revisit P0>
   ```
9. **Update HYPOTHESIS.md row** — ONE-LINER only (full audit lives in VG-VERDICTS.md):
   - `GO` → `PROVED (VG: GO @ YYYY-MM-DD)`
   - `GO_WITH_CONCERNS` → `OPEN (VG: GO_WITH_CONCERNS @ YYYY-MM-DD — see EVAL-SUITE/<feature>/VG-VERDICTS.md)`
   - `NO_GO` → `KILLED (VG: NO_GO @ YYYY-MM-DD — <which kill-criterion>)` OR `DEFERRED`
10. **HALT on `NO_GO`** — do NOT proceed to P4 without explicit human override. Override requires ADR via `/adr-writer` documenting accepted risk + updated hypothesis row with revised kill-criteria (don't silently soften).

## Hard Rules

- Single-pass results are noise — eval results MUST be N-run; if N=1, halt and demand more runs (typical N ≥ 30 per sample; total samples ≥ floor in PLAN § 2).
- **Sample-count floor enforced** — dataset under the PLAN.md N-floor halts with `INSUFFICIENT_SAMPLES`. Tested on 3 cherry-picked samples is the anti-pattern this catches.
- Thresholds compared MUST be the ones in STRATEGY.md; if changed post-hoc, surface this and require justification ADR.
- Cost overrun is a `NO_GO` trigger — uneconomic agents are killed early, not "optimized later."
- Verdict MUST persist to VG-VERDICTS.md before HYPOTHESIS.md row update — verdict log is the audit trail.
- `NO_GO` is the *success* of this gate; don't frame as failure.

## Red Flags

❌ **Thresholds softened to make a `FAIL` into a `PASS`** — defeats the gate; require ADR
❌ **N=1 eval results** — single-pass measurement of probabilistic system; reject
❌ **Dataset N below PLAN.md floor** — INSUFFICIENT_SAMPLES halt; don't pass a sparse-sample PoV
❌ **Hallucination rate unmeasured for factual feature** — silent blocker; halt until measured
❌ **`GO` declared while a kill-criterion is technically triggered** — kill-criteria are pre-commitments; respect them
❌ **`NO_GO` override without ADR** — bypassing reverts to pre-ADLC discipline
❌ **Verdict only in chat, never to VG-VERDICTS.md** — audit trail gap; PERSIST the verdict

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
