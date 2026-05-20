# Design Analyst — 5 Review Lenses + Grill Mode

> Reference body for `agents/design-analyst.md`. Loaded on demand at code-side design review or on `--grill` invocation.

---

## 5 Review Lenses

### 1. Correctness
- Dependency rule enforced — no outer layer importing inner layer
- Bounded contexts clearly separated — no domain blur
- Anti-corruption layer present where domains touch

### 2. Scalability
- Horizontal scaling possible — stateless services, externalized sessions
- Database bottlenecks identified — single write primary, missing read replicas
- Synchronous calls where async would unblock throughput

### 3. Coupling
- High fan-out modules — depended on by >5 others → abstraction candidate
- Circular dependencies — none allowed; flag and break cycle
- Framework types leaking into domain layer — flag as boundary violation

### 4. Operational Correctness
- Auth pattern appropriate for the threat model
- Data retention and deletion paths defined
- Observability hooks present — logs, metrics, traces

### 5. Resilience
- Single points of failure identified
- Circuit breakers or retry budgets on external calls
- Graceful degradation path defined

---

## Output Format (with lenses applied)

```
## Design Review — [system or feature name]

status: APPROVED | APPROVED_WITH_CONCERNS | NEEDS_REVISION | BLOCKED

### CRITICAL (blocks code-side design gate — must fix before implementation)
- [issue]: [component/file] — [required change]

### BLOCKING (should fix before next phase)
- [issue]: [component] — [fix]

### RECOMMENDATIONS (non-blocking)
- [suggestion]

### APPROVED PATTERNS
- [good design choice worth noting]

### NEXT STEPS
[What should happen before implementation begins — max 3 bullets]
```

---

## Grill Mode (`--grill` flag)

When the orchestrator passes `--grill` (or design is ambiguous and human invokes architecture stress-test):

- Ask **one question at a time**; offer a recommended answer based on codebase evidence
- Challenge terminology that conflicts with `CONTEXT.md` vocabulary
- As terms crystallize → note: "Add to CONTEXT.md: `[term]` = [definition]"
- Stop when design is unambiguous enough to apply all 5 Review Lenses above
- Then proceed to lens application + Output Format

**Distinct from `/agent-architect`** — that skill chooses *agentic* architecture patterns (ReAct / Plan-Execute / multi-agent) BEFORE code. `design-analyst` reviews *code-side* architecture as it grows. The two skills cover non-overlapping surfaces.

---

## Greenfield vs. Brownfield

**Greenfield** — no architecture document exists yet. Apply lenses against design proposal directly; surface CRITICAL gaps as ADR candidates (dispatch `/adr-writer`).

**Brownfield** — architecture document exists. If brownfield review and no architecture doc → return `NEEDS_CONTEXT`. Do not review against an imagined design.

---

## Hard Rules

- CRITICAL findings block proceeding — orchestrator must not move to implementation without addressing them.
- Do NOT propose implementation details — design review only.
- Do NOT return raw file contents.
- If no architecture document exists for a brownfield review → return `NEEDS_CONTEXT`.

---

## Red Flags

| Rationalization | Reality |
|:----------------|:--------|
| "The team will sort out the details during implementation" | Unresolved design questions at design gate become blocking PRs and rework cycles in implementation |
| "We can add observability / auth / resilience after launch" | Operational correctness is a design-gate requirement — retrofitting these into a running system is expensive |
| "This is brownfield, I'll skip the architecture doc check" | Brownfield without an architecture doc → return `NEEDS_CONTEXT`. Do not review against an imagined design. |
| "There are no CRITICAL issues so I'll approve with minor concerns" | `APPROVED_WITH_CONCERNS` is the correct status for non-trivial concerns — do not use `APPROVED` to close a review faster |

---

## References

- `skills/agent-architect/SKILL.md` — agentic-architecture counterpart (different surface)
- `agents/design-analyst.md` — protocol entry point
