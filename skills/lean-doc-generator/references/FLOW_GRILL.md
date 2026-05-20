---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: Q&A discipline rules change
status: current
---

# Flow Grill — batched Q&A planning convergence

> Loaded by `lean-doc-generator` Sprint Promote (and any skill that needs structured planning convergence). Canonical reference for the iterative Q&A loop that gathers planning fields before a sprint document is written.

---

## Overview

A terminal-first iterative loop that gathers structured planning fields via batched Q&A. Replaces ad-hoc free-form planning. Open Questions live in conversation as a session-scoped ledger; sprint file is written ONLY after `lock` keyword consumed.

---

## Q&A Discipline

**Batched + follow-up pattern:**

- **Batch independent questions** — ≤5 per terminal turn, grouped by concern (scope / risk / acceptance / handoff / anti-slip).
- **Solo dependent questions** — Q whose framing depends on a prior answer goes in next turn after that answer lands.
- **Solo open-ended questions** — "what should X be?" produces summary glosses if batched. Always 1-per-turn.
- **Follow-up trigger** — answer matching `<8 chars` OR `/maybe|sort of|kinda|whatever|i guess|probably/i` fires a clarification turn before next batch.

**Distinct from `design-analyst --grill` mode** — that keeps strict 1-per-turn for high-stakes architecture stress-test where question dependence is the norm. Flow Grill batched form is for routine planning convergence.

---

## Open Questions Ledger Schema

Session-scoped JSON-shaped block (NOT persisted until `lock`):

```
{
  "sprint": "NNN",
  "iteration": N,
  "tasks": [{ "id": "T1", "title": "...", "size": "S|M|L", "risk": "low|medium|high", "layers": [...], "acceptance": "..." }],
  "assumptions": [{ "id": "A1", "statement": "...", "confirmed": bool, "source": "..." }],
  "open_questions": [{ "id": "Q1", "concern": "scope|risk|acceptance|handoff|anti-slip", "text": "...", "answer": "..." | null, "follow_up_fired": bool }],
  "anti_slip": { "focus": "...", "context_budget": "~25k | no-limit", "explicit_gaps": [...], "done_confirmation": "[X] WHEN [Y]" },
  "decisions_pre_locked": [{ "id": "D-A", "statement": "..." }],
  "status": "iterating | reviewing | locked"
}
```

---

## Iteration Loop

```
Step 1 — Hydrate
  cold-start: empty ledger

Step 2 — Surface batch
  emit ≤5 independent Qs per Q&A Discipline rules; one terminal turn → wait for batch answer

Step 3 — Ingest answers
  for each answer:
    if matches follow-up trigger → fire clarification turn (solo Q)
    else → write to ledger.open_questions[id].answer
  advance ledger.iteration

Step 4 — Detect convergence
  all required fields populated (tasks · assumptions · risk · layers · anti_slip 4 · decisions_pre_locked)?
    yes → Step 5 (Review)
    no  → Step 2 (next batch)

Step 5 — Review (see Review-Before-Lock)
```

---

## Review-Before-Lock Step

Non-skippable. Between iteration and `lock`:

1. **Emit converged ledger summary** — tasks (id+title+size+risk) · assumptions confirmed count · risk score · anti-slip 4 fields · decisions pre-locked · open uncertainty.
2. **Prompt** — three keywords accepted:
   ```
   confirm        — acknowledge review (no-op pass; lets you read once more before lock)
   revise <field> — re-enter loop at named field
   lock           — freeze ledger and write sprint file
   ```
3. **`confirm`** — re-emit summary; re-prompt. Acknowledgment without write.
4. **`revise <field>`** — re-enter Step 2 at named field; preserve unrelated state.
5. **`lock`** — irreversible. Ledger frozen.

---

## Lock Semantics

- **Pre-lock:** ledger session-scoped, NOT on disk. Abandoning session loses ledger (intentional convergence pressure).
- **Post-lock:** ledger consumed by Sprint Promote Step 6 → sprint file written → frontmatter `status: planning`.
- **Plan-locked commit** (`sprint(NNN): plan locked` convention) follows write; `status: planning → active` on SHA fill.
- **Post-lock edits** go to § Execution Log § Surprise per existing protocol; ledger itself not edited post-lock.

---

## Handoff Envelope (to Sprint Promote Step 6)

On `lock`, ledger consumed with these mappings:

| Ledger field | Sprint file destination |
|---|---|
| `tasks[]` | § Plan task list |
| `assumptions[].confirmed=true` | § Decisions pre-locked |
| `anti_slip.{focus, context_budget, explicit_gaps, done_confirmation}` | § Plan / G1 rows (4 anti-slip fields) |
| `decisions_pre_locked[]` | § Decisions pre-locked block |
| `open_questions[].answer=null` | § Open Questions for Review — emitted ONLY if ≥1 unresolved; otherwise OMIT section entirely |

---

## Hard Rules

- **Never write sprint file before `lock`** — pre-lock ledger session-scoped only.
- **Never batch dependent or open-ended questions** — solo only.
- **Never skip review-before-lock** — even if all Qs resolved cleanly, emit summary + prompt.
- **Never persist pre-lock ledger to disk** — no "draft" file.
- **Anti-slip 4 fields ALL required at lock** — partial fill blocks lock.

---

## Red Flags

| Rationalization | Reality |
|:---|:---|
| "User said 'sure' to all 5 — done" | Vague answers slip; follow-up trigger MUST fire on `<8 chars` OR vague-tokens regex |
| "I'll write sprint file now, review later" | Pre-lock disk write violates contract |
| "Anti-slip not gathered, tasks clear — lock" | All 4 required at lock; re-enter loop |
| "Batched Q3 dependent on Q1 — fine" | Forces premature commitment; solo dependent Qs always |
| "Skip review — user saw answers in batches" | Non-skippable; review surfaces accumulated state |
