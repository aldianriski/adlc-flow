---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: Gate added/removed or renamed
status: decided
---

# ADR-003: Gate naming — HG/SG/AG/VG/RG/MG

**Date**: 2026-05-19
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

adlc-flow defines six human checkpoints between ADLC phases. They needed short stable names usable in:

- skill output (`HG → SG` is denser than `Hypothesis Gate → Scope Gate`)
- CONTEXT.md cross-references
- ADR text and CHANGELOG entries
- mental model when running both dev-flow and adlc-flow

Three naming schemes were considered (session AskUserQuestion 2026-05-19):

1. **ADLC-native 2-letter codes** — HG (Hypothesis), SG (Scope), AG (Architecture), VG (Validation), RG (Release-Readiness), MG (Model-Upgrade)
2. **Extend dev-flow's G-number scheme** — G1=Hypothesis, G2=Scope, G3=Architecture, G4=Validation, G5=Release, G6=Model-Upgrade
3. **Phase-transition naming** — `P0→P1`, `P2→P3`, etc.

## Decision

**1. ADLC-native 2-letter codes adopted.** HG, SG, AG, VG, RG, MG.

**2. Codes map 1:1 to skill names** (selected for v0.1):
- HG ↔ `hypothesis-register`
- AG ↔ `agent-architect`
- VG ↔ `pov-gate`
- SG, RG, MG ↔ v0.2 skills

**3. Codes appear in CONTEXT.md gates section as headings.** Mode table lists gates fired per mode using these codes.

**4. `adlc-orchestrator` output prefixes gate verdicts with the code.** Examples: `HG — pass`, `VG — NO-GO`, `MG — regression delta within tolerance`.

## Alternatives Considered

- **G1…G6 (dev-flow style).** Rejected because `G2` would mean Design in dev-flow and Scope in adlc-flow. Users co-installing both plugins would mentally conflict. The whole point of ADR-001 was to avoid this collision.

- **Phase-transition names (`P0→P1` etc.).** Rejected — verbose in protocol output, no mnemonic value, doesn't tie gates to skill names. Survives in `docs/research/ADLC-source.md` adapter-notes table as audit-trail back to EPAM phase numbers but is not the user-facing handle.

- **Long names spelled out (`HypothesisGate`).** Rejected — Output Discipline (mirrored from dev-flow ADR-033) wants compact protocol output; 2-letter codes do that without sacrificing clarity once the user has read CONTEXT.md once.

## Consequences

**Positive**
- No naming collision with dev-flow when both plugins are installed.
- Skill-name ↔ gate-code mapping is 1:1 and easy to remember.
- Protocol output stays compact.
- Audit trail back to EPAM phase numbers preserved in source extract.

**Negative**
- First-time users must learn 6 new acronyms. Mitigated by CONTEXT.md gates section being the canonical reference + each acronym expanded once per skill output.
- If ADLC framework gets a 7th canonical phase in future, adding a 7th gate code requires picking another 2-letter combination — possible namespace pressure.

**Neutral**
- Convention may be revised if a 2-letter code becomes ambiguous in some adapter project's context. Revision goes through new ADR.

## References

- Session 2026-05-19 AskUserQuestion (Naming Q) — user selected ADLC-native option
- dev-flow ADR-014 (skill-name disambiguation precedent) — `dev-flow/docs/adr/`
- CONTEXT.md § Gates — `adlc-flow/.claude/CONTEXT.md`
