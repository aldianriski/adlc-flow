---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
update_trigger: ADR status change OR EVAL-SUITE layout revised
status: decided
---

# ADR-006: EVAL artifact location + division of labor standardization

**Date**: 2026-05-20
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

The 2026-05-19 trial dogfood (`docs/audit/trial-friction-log.md`) surfaced 5 MEDIUM friction findings in v2.1.0. Two are intertwined:

- **F2.1**: EVAL artifact naming inconsistency. Three conventions existed for closely-related artifacts:
  - `/agent-architect` wrote `EVAL-STRATEGY-<feature>.md` at repo root
  - `/eval-suite-planner` wrote `EVAL-SUITE-<feature>.md` at repo root
  - `bin/adlc-flow-init.js` scaffolded an empty `EVAL-SUITE/` DIRECTORY (used by nothing)
  - `/golden-dataset` wrote `BASELINE.md` inside `GOLDEN-DATASET/<feature>/v1/` (dataset folder, not eval folder)
- **F2.2**: `agent-architect` step 4 (eval strategy outline) overlapped with `eval-suite-planner` sections 1-5. Adopters wrote near-identical content in BOTH artifacts; the trial reproduced this duplication.

Other related findings from the trial:
- **F3.1**: `/pov-gate` didn't persist its verdict; only emitted to chat. No audit trail.
- **F3.4**: `/pov-gate` didn't enforce sample-count floor (only N-runs-per-sample).

Single ADR captures the resolution because the fixes are interdependent (artifact paths · division of labor · verdict persistence · sample-count check all touch the same skill graph).

## Decision

**1. Standardize on per-feature directory under `EVAL-SUITE/`.**

```
EVAL-SUITE/<feature>/
├── STRATEGY.md       # methodology + thresholds + cost-model (from /agent-architect step 7)
├── PLAN.md           # dataset shape + cadence + cost budget + regression contract + owner (from /eval-suite-planner)
├── BASELINE.md       # anchored PoV results + history (from /golden-dataset step 7)
└── VG-VERDICTS.md    # append-only verdict log (from /pov-gate step 8)

GOLDEN-DATASET/<feature>/
├── v1/
│   ├── README.md           # version notes, composition, provenance
│   ├── schema.json         # JSON Schema for samples
│   └── samples/{happy,edge,imperfect,adversarial}/*.json
└── current                 # txt file containing version string (cross-platform; no symlinks)
```

GOLDEN-DATASET holds **data** (versioned samples). EVAL-SUITE holds **eval-process artifacts** (strategy, plan, baseline, verdicts). Clean separation; no more BASELINE.md living inside a data folder.

**2. Division of labor between agent-architect and eval-suite-planner.**

| Skill | Owns | Writes |
|---|---|---|
| `/agent-architect` | AG-required commitments: pattern choice · methodology · thresholds · cost-model | `EVAL-SUITE/<feature>/STRATEGY.md` |
| `/eval-suite-planner` | Operational details: dataset shape · cadence · cost-budget · regression contract · owner | `EVAL-SUITE/<feature>/PLAN.md` (cross-refs STRATEGY, doesn't duplicate) |

PLAN.md cross-references STRATEGY § Methodology and § Thresholds at the top. Single source of truth per concept.

**3. `/pov-gate` persists verdicts to `VG-VERDICTS.md`** (append-only audit log). HYPOTHESIS.md row gets a one-liner pointer; full verdict (per-metric distribution table, kill-criteria check, cost projection, mitigation plan) lives in VG-VERDICTS.md.

**4. `/pov-gate` enforces sample-count floor.** Step 1 verifies dataset sample count meets or exceeds the N-floor declared in `PLAN.md § 2 Golden dataset shape`. Halt with `INSUFFICIENT_SAMPLES` if short. Closes the "tested on 3 cherry-picked samples" anti-pattern that trial F3.4 surfaced.

**5. Cross-platform: drop golden-dataset's `current → v1` symlink in favor of a flat txt file** containing the current version string. Windows symlinks require admin or developer mode; the txt-file pattern works everywhere.

**6. Ship `templates/BASELINE.md.template`** so adopters don't author baselines ad-hoc. `/golden-dataset` step 7 reads the template + populates the run-metadata block.

## Alternatives Considered

- **Keep root-level flat files (`EVAL-STRATEGY-<feature>.md`, `EVAL-SUITE-<feature>.md`)** — rejected. Doesn't scale past 2-3 features (root clutter); breaks the per-feature-directory pattern already established by GOLDEN-DATASET.
- **Merge agent-architect + eval-suite-planner into one skill** — rejected. AG-gate commitments (methodology + thresholds) genuinely need to be decided before the operational plan; merging would lose the gate granularity.
- **Put BASELINE.md inside GOLDEN-DATASET/<feature>/v1/** (status quo of v2.1) — rejected. Baseline is a function of (dataset, agent code, eval suite), not a property of the dataset alone. EVAL-SUITE/ is the right home.
- **Make pov-gate emit verdict to stdout only (no file)** — rejected. Audit trail required for compliance + drift attribution at MG.

## Consequences

**Positive**
- Single canonical location for every eval artifact; adopters know where to look.
- No more duplicate content between STRATEGY and PLAN.
- Audit trail for VG verdicts survives session boundaries.
- Sample-count floor enforcement catches a real anti-pattern (caught in trial).
- Cross-platform symlink replacement; Windows adopters not second-class.

**Negative**
- Existing adopters of v2.1 (zero published; trial-only) need to migrate file paths. Mitigation: trial repo is the only consumer; refresh it post-merge.
- One more required file in the EVAL-SUITE folder (VG-VERDICTS.md) — small surface increase.
- Cross-references between STRATEGY and PLAN must stay current; if STRATEGY thresholds change, PLAN remains correct only via the cross-reference (not duplicated). Acceptable trade-off vs duplication drift.

**Neutral**
- v2.2.0 MINOR bump (additive + path standardization; no published adopters to break).
- ADR adds one row to the registry (ADR-001 superseded · 002/003/004/005/006 active).

## References

- `docs/audit/trial-friction-log.md` — source findings (F2.1 · F2.2 · F3.1 · F3.3 · F3.4)
- ADR-005 (graphify adoption) — adjacent decision; shares the "trial-driven cleanup" theme
- v2.2.0 CHANGELOG entry — implementation summary
