---
name: pr-reviewer
description: Use when a pull request or changed file set is ready for structured code review — typically at P4 commit boundaries or before RG release. Invoked automatically by the code-reviewer agent. Do not use for informal ad-hoc review; the systematic 7-lens process is required for all PRs. Not for prompt review — use prompt-reviewer agent instead.
user-invocable: true
agent: code-reviewer
version: "1.0.0"
last-validated: "2026-05-19"
type: rigid
---

# PR Reviewer

Perform a structured 7-lens code review on a diff or set of changed files. Loaded by the `code-reviewer` agent, or invoked directly.

Flow: diff → **Stage 1** Lens 1 only → `BLOCKED` on any fail → **Stage 2** Lenses 2–7 → tiered report.

## 7-Lens Review Checklist

### Lens 1 — Spec Compliance [S1]
- All acceptance criteria from the task met?
- All planned micro-tasks implemented?
- Unexpected files changed that were not in scope?

### Lens 2 — Architecture [S2]
- Dependency rule from CLAUDE.md respected? (no outer layer in inner layer imports)
- New module placed in the correct architectural layer?
- No framework types leaking into domain layer?

### Lens 3 — SOLID [S2]
- SRP: each class/function has one reason to change?
- OCP: extended via abstraction, not modified?
- LSP: subtypes are substitutable for base types?
- ISP: interfaces are focused, not fat?
- DIP: depends on abstractions, not concretions?

### Lens 4 — DDD [S2]
- Domain logic in domain layer (not controllers, not repositories)?
- Aggregates protect their invariants?
- Domain events named in past tense?

### Lens 5 — Security [S2]
- No hardcoded secrets or credentials?
- User input validated before use?
- Authorization checks present on all mutating operations?

### Lens 6 — Tests [S2]
- Happy path covered?
- Key edge cases and error paths tested?
- No test-only scaffolding in production files?

### Lens 7 — Documentation [S2]
- ADR needed for any architectural decision? (flag for `/adr-writer` if yes)
- Non-obvious logic has a brief inline comment explaining WHY?
- Ownership headers updated on any docs touched?

## Output Format

```
## PR Review — [TASK-NNN | PR#]: [Title]

status: DONE | DONE_WITH_CONCERNS | BLOCKED

### CRITICAL [S1|S2] (no truncation — show all)
- [Lens N]: [file:line] — [fix required]

### BLOCKING [S1|S2] (max 5)
- [Lens N]: [file:line] — [fix]

### NON-BLOCKING [S2]
- [Lens N]: [brief note]

### APPROVED PATTERNS
- [good choice worth noting]

### RECOMMENDATION
[One clear next step — max 2 sentences]
```

## Red Flags

| Rationalization | Reality |
|:----------------|:--------|
| "It's a tiny change — full 7-lens is overkill" | Small changes introduce security vulnerabilities and break APIs — there is no small PR |
| "I'll downgrade this to NON-BLOCKING to keep the review moving" | Downgrading a CRITICAL finding is a gate bypass — every CRITICAL must block merge |
| "I already reviewed this informally" | Systematic lens-by-lens review is non-negotiable — ad-hoc review misses cross-cutting issues |
| "Lens 1 only has minor gaps — I'll flag and continue" | Any Lens 1 (spec compliance) failure → `BLOCKED`. Do not proceed to S2 lenses. |

*Severity examples + hard rules → `references/review-standards.md`*

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
