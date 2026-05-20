---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: Severity calibration changes
status: current
---

# PR Reviewer — Standards Reference

## Finding Severity Examples

**Correct — CRITICAL (exact location, exact fix required):**
> [Lens 5]: auth/jwt.js:31 — `alg: none` accepted by verifier; any unsigned token passes auth. Fix: add explicit algorithm allowlist to verifier options.

**Incorrect — downgraded to avoid friction:**
> [Lens 5]: auth/jwt.js:31 — JWT algorithm handling could be tightened (NON-BLOCKING)

**Correct — NON-BLOCKING (observation, no merge block):**
> [Lens 7]: README.md — Ownership header `last_updated` not updated after today's changes.

## Hard Rules

- Stage 1 (Lens 1) failure → status `BLOCKED`. Do not proceed to S2 lenses.
- Do NOT return raw file contents — line references and brief excerpts only.
- CRITICAL findings are never truncated — spill into follow-up response if needed.
- Return token budget: ≤250 tokens (CRITICAL findings have no cap).
- If ADR is recommended → list it as NON-BLOCKING with: "Flag for `/adr-writer`: [topic]"

## Cross-skill handoffs

- Security findings (A01-A10) discovered during review → recommend `/security-review` separate session
- Performance concerns on hot paths → flag for `performance-analyst` agent
- DB schema changes touched → flag for `migration-analyst` agent
- Architectural concerns → flag for `/agent-architect` (if agentic) or `design-analyst` agent (if code-side)
