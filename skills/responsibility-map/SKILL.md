---
name: responsibility-map
description: Use when scoping an agentic feature at SG gate — produces a human–agent decision/approval grid that names which decisions the agent makes autonomously, which require human approval, and what authority each level has. ADLC Phase 1 (P1) artifact — the deliverable the source article calls out as having "no equivalent in SDLC." Do not use for tactical task decomposition — use dev-flow:task-decomposer.
user-invocable: true
argument-hint: "[--feature name | --hypothesis H-NNN]"
version: "0.1.0"
last-validated: "2026-05-19"
type: rigid
---

# responsibility-map

Build the human–agent responsibility grid for an agentic feature. Output: row(s) appended to `RESPONSIBILITY-MAP.md`, one per feature.

## Why this exists

ADLC source (P1) explicitly names human–agent responsibility mapping as the deliverable with no SDLC equivalent. Without it, compliance/risk/accountability surfaces in production where fixes are costly. This skill produces that artifact.

## Grid Schema

Each feature row contains a table of *decision points*:

| Decision | Who decides | Approval needed | Authority | Escalation trigger |
|---|---|---|---|---|
| <named decision> | `human` / `agent` / `agent-with-confirm` | `none` / `human-pre` / `human-post` | full / scoped / advisory | <condition> |

Rows are not generic ("user input validation") — they name *specific* decision points the agent will encounter in production.

## Procedure

1. **Read context** — hypothesis row + KPI thresholds (from SG inputs). If neither exists, halt and prompt to run `hypothesis-register` first.
2. **Enumerate decision points** — walk the agent's expected trajectory and list every place where the agent makes a non-trivial choice. Typical decision categories:
   - **Action authority** — does agent execute or propose? (e.g., "send email", "issue refund", "modify database row")
   - **Quality gates** — at what confidence does the agent proceed vs. ask?
   - **Cost ceilings** — when does cost trigger escalation?
   - **Unsafe-zone detection** — what topics/actions hard-stop and route to human?
   - **Conflict resolution** — when agent and human disagree, who wins?
3. **Per decision** — answer four questions (one at a time, never batched):
   - Who decides (default: human if user-impacting; agent if internal-only)
   - Is approval needed BEFORE action (`human-pre`), AFTER (`human-post`), or none
   - What's the authority scope (full / scoped to category / advisory only)
   - What condition escalates back to human (cost > X / confidence < Y / category match / time elapsed)
4. **Compliance / risk-tolerance pass** — for each row marked `agent` with `none` approval, check against the constraints declared at HG. Flag conflicts.
5. **Unsafe-autonomy zones** — list categories where agent MUST defer to human regardless of confidence (e.g., refunds > $1000, legal-advice, medical, irreversible actions).
6. **Confirm + write** — emit draft; user types `approve`; append row block to `RESPONSIBILITY-MAP.md` under feature name.

## RESPONSIBILITY-MAP.md schema

```markdown
---
owner: <user>
last_updated: <date>
status: current
---

# RESPONSIBILITY-MAP.md — Human–Agent Decision/Approval Grid

## Feature: <name> (H-NNN)

### Decision points
| Decision | Who | Approval | Authority | Escalation |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

### Unsafe-autonomy zones
- <category>: <rule>

### Compliance check
- Constraint: <constraint from HG> → mapping: <which row(s) enforce>
```

## Hard Rules

- Never approve a `agent` / `none` row without explicit compliance check against HG constraints.
- Authority `full` requires a documented kill-switch (how does a human stop a runaway agent).
- Every irreversible action MUST be `human-pre` regardless of confidence.
- Confidence thresholds for `agent-with-confirm` must be measurable — vague "high confidence" rejected.
- Decision points must be named with verbs that match the agent's actual trajectory — not abstractions.

## Red Flags

❌ **"Agent decides everything, escalate on error"** — abdicates SG gate; map specific decision points
❌ **No kill-switch for `full` authority decisions** — runaway risk; reject the grid
❌ **Compliance constraints declared at HG vanish from the grid** — surface and resolve before write
❌ **Authority `scoped` without naming the scope** — vague scopes leak; force explicit category list
❌ **Irreversible action set to `human-post`** — retroactive approval can't undo deletes/sends; promote to `human-pre`

## References

- `references/preview-gate-ux.md` — preview-gate + cost-banner UX pattern (Trial 4b F7.8)
- `references/form-action-wrappers.md` — inline server-action wrapper pattern for SSR forms (Trial 5 F8.13)

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
