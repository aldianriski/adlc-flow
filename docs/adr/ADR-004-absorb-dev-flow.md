---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: ADR status change OR consolidation scope revised
status: decided
supersedes: ADR-001
---

# ADR-004: Absorb dev-flow universals into adlc-flow (v2.0.0 consolidation)

**Date**: 2026-05-19
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)
**Supersedes**: [ADR-001](ADR-001-sister-plugin-relationship.md)

## Context

ADR-001 (2026-05-19, same day) established adlc-flow as a **sister plugin** to dev-flow — adlc-flow handles agentic-product lifecycle; dev-flow handles traditional SDLC; users co-install both.

Within hours of v1.0.0 shipping, the sister-plugin design surfaced its actual cost:

1. **Most projects are hybrid.** Real adopters ship agentic features INSIDE otherwise-traditional apps. Two plugins for one repo creates friction (cognitive overhead · namespace ambiguity · which-skill-where confusion).
2. **`dev-flow:` prefix is awkward.** Skills routinely cross-reference each other; the prefix bloats every cross-reference and surfaces the split even when the user doesn't care.
3. **Cross-plugin dispatch is implicit dependency.** ADR-001 framed dev-flow as "recommended"; in practice, adlc-flow's orchestrator + agent-architect *required* `dev-flow:adr-writer` for ADR work. "Recommended" was understating actual coupling.
4. **Maintenance bifurcation risk.** Two separate plugins evolving independently means dev-flow improvements may not flow to adlc-flow and vice versa. Long-term debt.
5. **Brand split.** Marketplace listing two plugins, both for "AI dev workflow," confuses adopters. Single offering is cleaner positioning.

User decision (session 2026-05-19): consolidate dev-flow's universal surface INTO adlc-flow; freeze dev-flow at v4.x; new projects install adlc-flow exclusively.

## Decision

**1. adlc-flow absorbs 14 of 16 dev-flow skills + all 6 dev-flow specialist agents.** Selective port — skip true duplicates (`orchestrator`, replaced by `adlc-orchestrator`) and out-of-scope overlap (`task-decomposer`, replaced by `hypothesis-register` for agentic features; code-side tasks go directly into TODO.md).

**2. dev-flow is frozen at v4.x.** No new features. CHANGELOG receives a DEPRECATED notice pointing to adlc-flow. Existing dev-flow adopters keep working indefinitely; they migrate at their own pace.

**3. Cross-plugin prefix is dropped.** All references to `dev-flow:<skill>` in adlc-flow rewrite to local `/<skill>`. Same skill names, same procedures, same outputs — only the namespace changes.

**4. PowerShell hook scripts ported to Node** as part of v2.0.0 (cross-platform parity; eliminates Windows-only constraint that dev-flow carried per its ADR-016).

**5. ADR-001 is Superseded.** The sister-plugin framing is retired. Future contributors read ADR-004 first.

**6. Migration is mechanical for current dev-flow adopters.** Skill names unchanged; sprint protocols unchanged; only the namespace prefix differs. A simple find/replace handles existing usage.

**7. v2.0.0 is a MAJOR bump** because the plugin's identity expanded from "ADLC scaffold" to "unified dev workflow." Breaking nothing in user's project — but the plugin's scope changed significantly, justifying a major.

## Alternatives Considered

- **Path 1 — Standalone but separate (Q2+Q3 session 2026-05-19).** Bring core 7 universals into adlc-flow, keep both plugins alive. Rejected: still maintenance bifurcation; "which plugin for X?" cognitive load persists.
- **Path 1-lite — Docs cleanup only.** Make optional nature crystal-clear, no porting. Rejected: doesn't address actual coupling; user must still install + maintain two plugins.
- **Path 3 — Rebrand adlc-flow as dev-flow v5.0.** Considered. Rejected because (a) adlc-flow has its own ADR registry starting at ADR-001 cleanly; (b) the rebranding signal would dilute ADLC as the differentiator; (c) marketplace adopters of dev-flow v4.x shouldn't see an unannounced major-jump v5.
- **Full absorption + dev-flow archived.** Considered. Deferred to v2.1+ — dev-flow v4.x still in active use by team; freezing at v4.x with deprecation notice is sufficient for v2.0.0. Archival when ecosystem migration is confirmed.

## Consequences

**Positive**
- Single plugin install for adopters.
- No namespace ambiguity. Skill names are global within adlc-flow.
- Maintenance unified — every improvement lands once.
- Cross-platform hooks (Node) extend reach beyond Windows-only.
- Identity is clear: "unified dev workflow for the AI era."

**Negative**
- 14 skills + 6 agents to maintain that previously lived in dev-flow. Larger surface area in one repo.
- ADR-001 is now superseded after only one day — surfaces that initial strategic call was wrong. Honesty cost; documented openly.
- dev-flow adopters need to know about the migration path; deprecation notice is required.
- v2.0.0 immediately after v1.0.0 same-day breaks "v1.0 = stability contract begins" expectation; CHANGELOG must justify the bump explicitly.

**Neutral**
- adlc-flow ADR registry continues at ADR-004 (no renumbering).
- USER-OUTCOMES registry expands to cover all 28 skills + 11 agents.
- Sprint protocols are unchanged — `lean-doc-generator` works identically.

## Migration playbook (for dev-flow adopters)

1. Install `adlc-flow` (when published).
2. Uninstall `dev-flow` OR keep both — adlc-flow doesn't conflict with dev-flow at runtime; only naming overlap on skill names.
3. Update any documentation or scripts referencing `dev-flow:<skill>` to drop the prefix.
4. Existing dev-flow sprint files / ADRs / TODO conventions remain valid — adlc-flow inherits the same conventions.
5. New features can opt-in to the agentic lifecycle modes (`discover`/`design`/`prove`) when they involve LLM-core behavior; traditional features bypass them.

## References

- [ADR-001](ADR-001-sister-plugin-relationship.md) — superseded by this ADR
- [ADR-002](ADR-002-adlc-source.md) — ADLC source framework (unchanged)
- [ADR-003](ADR-003-gate-naming-rationale.md) — gate naming (unchanged)
- Session 2026-05-19 AskUserQuestion: "Path 2 — Consolidate dev-flow INTO adlc-flow"
- dev-flow CHANGELOG v4.x — deprecation notice landing here
