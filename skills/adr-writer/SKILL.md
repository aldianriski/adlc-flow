---
name: adr-writer
description: Use when a significant technical decision has been made or is being debated — choosing between frameworks, adopting a new pattern, reversing a previous decision, or making an architectural trade-off that future contributors need to understand. Spawned by agent-architect at AG. Do not use for reversible or low-impact decisions.
user-invocable: true
argument-hint: "[decision title or description]"
version: "1.1.0"
last-validated: "2026-05-20"
type: rigid
---

# ADR Writer

Write an Architecture Decision Record (ADR). Auto-detects existing convention per ADR-007:
- **Modern (preferred)**: one file per ADR in `docs/adr/ADR-NNN-<slug>.md`
- **Legacy**: single `docs/DECISIONS.md` with append-only ADR blocks
- **Both present**: warn user once; default to `docs/adr/` for new ADRs (DECISIONS.md read-only henceforth)

## When to invoke

- A technology, framework, or library choice is made
- A pattern is adopted or rejected
- A previous decision is reversed or superseded
- An architectural trade-off future contributors need to understand
- `agent-architect` step 6 dispatches this skill for agent-pattern decisions

## ADR Format

```markdown
---
owner: [role — not personal name]
last_updated: YYYY-MM-DD
update_trigger: ADR status change
status: decided
---

# ADR-NNN: [Title]

**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-NNN
**Deciders**: [role names — not personal names]

## Context
[Why is this decision needed? What problem does it solve? What constraints are in play?]

## Decision
[What was decided? State it clearly and without hedging.]

## Alternatives Considered
- **[Option]** — rejected: [why]
- **[Option]** — rejected: [why]

## Consequences

**Positive**
- [benefit]

**Negative** (trade-offs accepted)
- [cost or risk accepted]

**Neutral**
- [side-effect that is neither positive nor negative]

## References
- [related ADR, doc, sprint, or source]
```

Execution procedure: `references/procedure.md`.

## Red Flags

| Rationalization | Reality |
|:----------------|:--------|
| "This decision is obvious — no ADR needed" | Obvious-to-you decisions are exactly the ones future contributors reverse without context |
| "I'll write the ADR after we've committed to the direction" | Decisions recorded after commitment lose the rejected alternatives — write while the tradeoffs are live |
| "The code documents the decision" | Code shows what was chosen, not why it was chosen or what was rejected |
| "Just add one line — it doesn't need a full ADR" | If it has a context, a decision, and consequences, it needs an ADR — length is irrelevant |

## Hard Rules

- Never invent a decision — only record what the user has explicitly confirmed.
- Status must be exactly one of: `Proposed`, `Accepted`, `Deprecated`, `Superseded by ADR-NNN`.
- Context explains WHY — never HOW. Code comments explain HOW.
- Consequences must have at least one Negative entry — no decision is cost-free.
- ADR files are append-only — never edit past ADRs in place; supersede with a new ADR.
- Detect convention before writing: scan `docs/adr/` AND `docs/DECISIONS.md`. Choose per the rule in the header. Create `docs/adr/` if neither exists.

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
