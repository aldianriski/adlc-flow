---
name: test-planner
description: Use when planning deterministic tests for a new feature or behavior change BEFORE writing them — surfaces which test groups (unit / integration / e2e / regression) cover which scenarios; complements `tdd` (writes tests) and `eval-suite-planner` (plans behavioral evals for agent outputs). Do not use to write tests; use `/tdd`. Do not use for agentic behavior; use `/eval-suite-planner`.
argument-hint: "[feature name | task ID | freeform intent]"
allowed-tools: Read, Grep, Glob
user-invocable: true
type: rigid
version: "1.0.0"
last-validated: "2026-05-19"
---

# test-planner

Plan the deterministic test set for a feature BEFORE writing any tests. Outputs a grouped test plan (unit · integration · e2e · regression). `/tdd` consumes the plan and writes the actual tests.

For probabilistic agent outputs (hallucination rate, refusal correctness, etc.) use `/eval-suite-planner` instead — different surface (distributions, not assertions).

## When to invoke

- Pre-implementation: at AG or before P4 build, when "what tests do we need?" is open.
- Pre-`/tdd`: when you want the test SET decided before red-green-refactor cycles.
- After audit/refactor: when test coverage feels uneven and you need to surface what's missing per group.

## Q&A Planning Protocol

Batched — ≤5 independent questions per turn:

1. **What's the observable behavior?** — one-sentence acceptance criterion the user/system sees.
2. **What unit boundaries are touched?** — class / function / pure-logic units.
3. **What integration seams cross?** — HTTP · DB · queue · external API · cross-module.
4. **What user-visible flows must work end-to-end?** — happy path + 1-2 critical error paths.
5. **What past bugs or edge cases must NOT regress?** — link prior incidents / surprise log entries.

Follow-up turn fires on ambiguous answers (`<8 chars` OR vague tokens). Stop when each of the 4 groups has either (a) ≥1 planned test OR (b) explicit "N/A — <reason>".

## 4-Group Convention

| Group | Covers | Speed | Isolation |
|:------|:-------|:------|:----------|
| **unit** | Pure functions · single class · no I/O | <100ms | Full (no external) |
| **integration** | Module seams · DB · HTTP client · queue producer | <2s | Partial (real deps · isolated env) |
| **e2e** | User-facing flow start to finish · UI + API + DB | <30s | Real stack (staging or local-full) |
| **regression** | Past-bug scenarios · explicit replay tests | varies | Group of any above + asserts the bug stays fixed |

Full per-group definitions + decision tree + skip-when → `references/TEST_GROUPING.md`.

## Output Format

```
## Test Plan — [feature name]

status: PLANNED | NEEDS_CONTEXT | BLOCKED

### Unit (N tests)
- [scenario] — [unit boundary] — [assertion]

### Integration (N tests)
- [scenario] — [seam] — [assertion]

### E2E (N tests)
- [user flow] — [happy/error] — [assertion]

### Regression (N tests)
- [past bug ref] — [scenario] — [assertion that fix holds]

### Hand-off to /tdd
- [Group · scenario] → write next via /tdd
```

## Red Flags

❌ **Skipping a group without explicit N/A reason** — silent skips are how integration coverage rots; force `N/A — <reason>` per group
❌ **Listing "test it works" without a group** — every test plan row names its group + assertion shape; vague rows produce vague tests
❌ **Mixing planning with writing** — this skill PLANS only; if you start drafting test bodies, stop and dispatch `/tdd`
❌ **Coverage-percentage thinking** — anti-outcome; plan covers SCENARIOS, not percentage targets
❌ **Planning agent-behavior tests here** — wrong surface; use `/eval-suite-planner`

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
