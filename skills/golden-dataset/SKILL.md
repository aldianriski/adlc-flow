---
name: golden-dataset
description: Use when building or refreshing the golden dataset (ground-truth corpus) for an agentic feature. ADLC Phase 3 (P3) most distinctive artifact — versioned reference set used at VG, in P4 dev loop, at RG, and in MG regression. Defines schema, edge-case coverage, imperfect-input strategy, and refresh cadence. Do not use for test fixture management — fixtures verify code; golden dataset benchmarks agent quality.
user-invocable: true
argument-hint: "[--feature name | --refresh existing]"
version: "1.1.0"
last-validated: "2026-05-20"
type: rigid
---

# golden-dataset

Build a versioned golden dataset for an agentic feature. Output: structured folder under `GOLDEN-DATASET/<feature>/v<N>/`. BASELINE.md lives at `EVAL-SUITE/<feature>/BASELINE.md` per ADR-006 (eval artifacts in EVAL-SUITE/; data in GOLDEN-DATASET/).

## Folder Structure

```
GOLDEN-DATASET/<feature>/
├── v1/
│   ├── README.md           # version notes, composition stats
│   ├── schema.json         # input + expected-output schema (JSON Schema)
│   └── samples/
│       ├── happy/          # representative typical cases
│       ├── edge/           # boundary cases, rare-but-real
│       ├── imperfect/      # malformed / partial / noisy inputs
│       └── adversarial/    # red-team / injection / jailbreak attempts
└── current                 # txt file containing the current version string (e.g. "v1"); cross-platform (no symlinks)

EVAL-SUITE/<feature>/BASELINE.md  # PoV results anchoring regression deltas; appended on baseline shifts
```

## Procedure

1. **Read** `EVAL-SUITE/<feature>/PLAN.md` § 2 ("Golden dataset shape") — pulls target N, composition %, provenance, versioning policy.
2. **Schema design** — write JSON Schema for input + expected-output:
   - Input fields (typed; named per the agent's actual interface)
   - Expected-output fields (which can be exact-match vs. semantic vs. tolerance-bounded)
   - Metadata (sample category, source, annotator if human-curated)
3. **Sample plan** — calculate per-category counts from composition %. Halt if numbers don't make statistical sense (e.g., 2 adversarial samples in a 1000-sample set won't catch anything).
4. **Provenance protocol** — for each sample category, document:
   - Source (synthetic by LLM? scraped from logs? hand-written? anonymized real data?)
   - Annotation process (who labels? inter-rater agreement target?)
   - PII / sensitive-data handling
5. **Imperfect-input strategy** — explicitly include samples that:
   - Are malformed (missing fields, wrong types, encoding issues)
   - Contain noise (typos, OCR artifacts, partial inputs)
   - Are adversarial-but-benign (long inputs, repeated tokens, prompt-injection patterns)
6. **Adversarial samples** — coordinate with `red-team-analyst` agent for category-specific attacks (prompt injection · goal hijacking · sensitive-data extraction · tool-call manipulation).
7. **Baseline run** — run the PoV against the dataset; record results at `EVAL-SUITE/<feature>/BASELINE.md` (scaffolded from `templates/BASELINE.md.template` if missing). This is the anchor for regression deltas at MG.
8. **Versioning** — initial dataset is `v1`. Refresh creates `v2`; old version retained. Update `current` txt file with new version string (cross-platform; no symlinks).

## Refresh triggers

- Drift detected (output distribution shift > tolerance)
- New unsafe-autonomy category added to responsibility map
- Model upgrade reveals previously-hidden failure modes
- Quarterly review per EVAL-SUITE owner cadence
- Adopter project sees production sample category not represented in golden set

## Hard Rules

- Minimum N per category MUST be statistically meaningful — flag if <30 per category for distribution metrics.
- Adversarial category MUST exist (≥10% of total) even if feature seems benign — prompt injection is universal.
- Imperfect inputs MUST be ≥15% of dataset — testing only curated examples is anti-ADLC.
- `EVAL-SUITE/<feature>/BASELINE.md` MUST exist before VG gate; without it `/pov-gate` cannot compute regression delta.
- Real samples (when used) MUST be PII-cleaned; document anonymization process.

## Red Flags

❌ **Dataset = 100% happy path** — guarantees production surprise; reject
❌ **Synthetic-only when real data exists** — distribution shift hidden; require real-sample blend
❌ **Adversarial samples added after launch** — kill-criteria can't fire on samples that don't exist
❌ **No version pointer** — silent rebases make regression deltas meaningless
❌ **PII in samples** — compliance landmine; halt and remediate before any commit

## References

- `references/mock-first-pov.md` — mock-first PoV scaffold pattern; validates eval pipeline at $0 before live LLM (3 cross-trial validations: Trial 1 · Trial 4b · Trial 5)

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
