---
name: refactor-advisor
description: Use when existing code has become harder to change — increasing complexity, test brittleness from adjacent edits, or team uncertainty about where logic belongs. Do not use for debugging failures; use diagnose instead.
user-invocable: true
version: "1.0.0"
last-validated: "2026-05-19"
type: flexible
---

# Refactor Advisor

Analyze code for quality issues and produce targeted refactor proposals with before/after examples and risk assessments. Proposals only — does not implement.

## Analysis Lenses

1. **Code smells** — long methods (>20 lines), feature envy, primitive obsession, data clumps, shotgun surgery, divergent change
2. **SOLID violations** — SRP (too many reasons to change), OCP (modification not extension), LSP (subtypes break contract), ISP (fat interfaces), DIP (depends on concretions)
3. **Clean Architecture drift** — outer layers importing inner layers, business logic in controllers, infrastructure in domain
4. **DDD anti-patterns** — anemic domain model (no behavior), missing aggregates, leaking domain events, repositories in domain layer
5. **Deep Module Opportunities** — modules whose interface is more complex than their implementation (inverted leverage); apply deletion test: *if this module were removed, would its complexity scatter across callers?* If yes → module earns its keep. If no → flatten it.

## Output Format per Finding

```
### [Code smell | SOLID | CA | DDD] — [file:line-range]

**Problem**: [one sentence]

**Before**:
[minimal code excerpt — ≤8 lines]

**After**:
[refactored version — ≤8 lines]

**Risk**: low | medium | high
**Why risky**: [what could break if refactored carelessly]
**Recommended timing**: now | next-sprint | technical-debt-backlog
```

## Risk Assessment
- **low**: self-contained, no behavior change, covered by tests
- **medium**: touches shared code, requires regression tests, adjacent features may need updating
- **high**: cross-layer change, auth/payment/data-integrity path, requires design review first

## Hard Rules
- Never propose a refactor that changes observable behavior — structure only.
- Every `medium` or `high` risk proposal must name specific tests that need updating.
- Do NOT write implementation code — proposals only.
- If no clear improvement can be identified → say so rather than inventing issues.

## Red Flags

| Rationalization | Reality |
|:----------------|:--------|
| "It's only in one place, it's fine" | Duplication is never "one place" — search for all usages before deciding |
| "Refactoring will slow us down now" | Deferred refactoring compounds — schedule it explicitly or it never happens |
| "Tests will catch any regressions" | Tests only catch what they cover — verify coverage before marking low-risk |
| "We'll do it all in one big refactor" | Big-bang refactors fail — split by layer and ship incrementally |

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
