---
name: diagnose
description: Use when debugging a defect, unexpected behavior, or failing test. Runs a 6-phase systematic debugging workflow — reproduce, hypothesize, instrument, fix, regression test, post-mortem. Do not use for architectural analysis; use design-analyst --grill instead.
user-invocable: true
argument-hint: "[bug description | failing test | unexpected behavior]"
version: "1.0.0"
last-validated: "2026-05-19"
type: flexible
---

# Diagnose

Systematic 6-phase debugging. Rate of feedback is your speed limit — build the loop first.

---

## Phase 1 — Build Feedback Loop

Goal: make the bug observable in ≤30 seconds.
- Prefer: automated test that fails on the bug
- Fallback: script, curl command, or REPL session
- **BLOCK if no feedback loop** — do not proceed to Phase 2 without one

## Phase 2 — Reproduce

- Run feedback loop → confirm failure is consistent and deterministic
- If flaky → characterize flakiness conditions before hypothesizing
- Document exact reproduction steps (inputs, environment, sequence)

## Phase 3 — Hypothesize

Generate 3–5 ranked, falsifiable hypotheses:
```
H1: [most likely] — [why] — falsified by: [test]
H2: [second likely] — [why] — falsified by: [test]
...
```
Each hypothesis must name a specific falsification test. Vague hypotheses ("something in auth") are not hypotheses.

## Phase 4 — Instrument

- Test ONE hypothesis at a time — never change two variables simultaneously
- Add targeted instrumentation (logs, assertions, breakpoints) for H1 only
- Run feedback loop → observe result → update ranked list
- Repeat until one hypothesis survives falsification

## Phase 5 — Fix + Regression Test

**Write regression test BEFORE applying fix:**
1. Write test that fails due to the bug
2. Confirm test fails (RED)
3. Apply minimal fix
4. Confirm test passes (GREEN)
5. Run full suite — all prior tests must still pass (REGRESS)

## Phase 6 — Post-mortem

Answer in 3 bullets:
- Why did this bug exist?
- Why was it not caught earlier?
- What would prevent recurrence?

Surface the regression test as a candidate for the permanent test suite.

---

## Red Flags

❌ **Fix before reproducing** — guessing at fixes without a feedback loop compounds bugs
❌ **Multiple simultaneous changes** — violates one-variable-per-test; invalidates diagnosis
❌ **No regression test** — fix without test = bug returns silently
❌ **Skipping post-mortem** — same class of bug will recur within one sprint

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
