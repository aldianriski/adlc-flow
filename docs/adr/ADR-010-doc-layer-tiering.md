---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-29
update_trigger: doc-ownership model OR usage-tier model revised
status: decided
---

# ADR-010: Unified doc registry + 3-tier usage model

**Date**: 2026-05-29
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Daily-usage signal (session 2026-05-29): in mixed agentic/traditional projects, the practical loop is `/prime` → work → `/lean-doc-generator`; the orchestrator, sprint protocols, and the ADLC gate skills are routinely skipped. Two root problems surfaced:

1. **Fragmented doc layer.** `lean-doc-generator` owns only *general* docs (ADRs, sprint, README, AI-context). The ADLC lifecycle artifacts (`HYPOTHESIS.md`, `RESPONSIBILITY-MAP.md`, `GOLDEN-DATASET/`, `EVAL-SUITE/`, `OBSERVABILITY.md`, `FEEDBACK-LOG.md`, `COST-BUDGET.md`, `MODEL-UPGRADE-LOG.md`) are each owned by a separate skill and only ever created by going through the orchestrator. `session-start.js` independently hardcodes the artifact list. **No single source of truth** for "what docs this project needs · who owns each · their status," so a daily `lean-doc` run cannot surface what's missing — it "doesn't generate all needed."
2. **Front door mismatched to daily reality.** The orchestrator presents the full ADLC ceremony as the default entry, making the lightweight daily subset feel like "skipping" rather than "the correct tier."

The plugin fuses two surfaces (heavyweight ADLC lifecycle + universal dev toolkit). Skills are lazy-loaded — "too many skills" is a discoverability cost, not a runtime one — so deletion is the wrong fix.

## Decision

**1. Single required-doc registry.** `doc-registry.json` (plugin root) is the canonical list: each doc/artifact's `path`, `owner` skill, `tier` (`always` | `agentic`), `kind` (`file` | `dir`), `purpose`. All consumers read it; none re-hardcode the list.

**2. `lean-doc-generator` becomes doc-completeness-aware — but does NOT generate artifacts it doesn't own.** It generates the `always`-tier docs it owns, then reads the registry and reports every other entry as present / stale / missing, **handing off** `agentic`-tier artifacts to their owner skill (e.g. `✗ RESPONSIBILITY-MAP.md → /responsibility-map`). Specialized artifacts (golden-dataset, eval-suite) keep their domain-specific generators — lean-doc never improvises them.

**3. `session-start.js` reads the registry** (fallback to a built-in list if unreadable) and warns only on `agentic`-tier artifacts, framed as agentic-only — not as a universal nag.

**4. 3-tier usage model (orchestrator on-ramp).** Daily core (`/prime` → `/lean-doc-generator`, no gates) · Per-feature (`traditional` mode + tdd/adr/review/release) · Agentic opt-in (`discover`→`operate` + HG/SG/AG/VG/RG/MG + artifacts). The orchestrator routes freeform input to the right tier and does NOT engage gates for daily/non-agentic work.

## Alternatives Considered

- **A — Delete the ADLC skills to "lean" the plugin.** Rejected: skills are lazy-loaded (no runtime cost); deletion destroys agentic capability needed in the mixed case.
- **B — Make lean-doc generate every artifact too.** Rejected: duplicates/conflicts with specialized owners; a golden-dataset is a dataset, not prose.
- **C — Leave fragmentation; document the daily path only.** Rejected: doesn't fix "doesn't generate all needed" — the completeness gap persists.

## Consequences

**Positive**
- One source of truth; daily `lean-doc` surfaces the full doc gap with handoffs. Fixes the "missing link."
- Daily 90% case is 2 commands; ceremony is opt-in, not skipped-by-default.
- session-start nag reframed as agentic-only — less noise for traditional work.

**Negative**
- New plugin-root file (`doc-registry.json`) all three consumers must stay in sync with. Mitigated: single file; adding a doc = one entry.

**Neutral**
- Additive to ADR-005/006/007. No gate semantics change. MINOR bump (new registry + skill behavior; orchestrator on-ramp).

## References
- `doc-registry.json` — the registry
- `skills/lean-doc-generator/references/DOC_COMPLETENESS.md` — completeness-check procedure
- [ADR-006](ADR-006-eval-artifact-standardization.md) — artifact standardization (owners of agentic-tier docs)
- Session 2026-05-29 — daily-usage signal + AskUserQuestion "mix → tier + fix on-ramp"
