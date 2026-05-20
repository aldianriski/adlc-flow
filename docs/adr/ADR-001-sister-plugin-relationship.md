---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: ADR status change OR boundary with dev-flow redrawn
status: superseded
superseded_by: ADR-004
---

> **SUPERSEDED 2026-05-19** by [ADR-004](ADR-004-absorb-dev-flow.md). The sister-plugin framing was retired the same day. adlc-flow v2.0.0 absorbs dev-flow universals; dev-flow v4.x is frozen. This ADR is preserved for historical context — do not act on its decisions.

# ADR-001: Sister-plugin relationship with dev-flow

**Date**: 2026-05-19
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

`dev-flow` is a mature Claude Code plugin (16 skills, 6 agents, 21 ADRs, v4.1.0) that scaffolds gate-driven agentic-assisted SDLC for *any* software project. Its `docs/USER-OUTCOMES.md` explicitly anti-claims: app-code generation, CI/CD, automated test coverage, telemetry — boundaries appropriate for an SDLC meta-workflow.

EPAM's Agentic Development Lifecycle (ADLC) framework targets a different problem: teams whose **product itself is an LLM-core agent**. Probabilistic behavior, eval-as-development, post-deployment monitoring as first-class — concepts that violate dev-flow's anti-outcome boundary.

Four strategic options were considered (full pivot · extend in-place dual-track · selective modernize · sister plugin). Decision matrix:

| Option | Brand risk | Reuse | Effort | Cleanliness |
|---|---|---|---|---|
| A pivot | high | low (discards SDLC scope) | 6-10 sprints | medium |
| B extend | high (mode confusion) | high | 4-6 sprints | low |
| C modernize | low | high | 2 sprints | medium (dishonest about ADLC fit) |
| **D sister plugin** | **low** | **selective** | **6-8 sprints** | **high** |

## Decision

**1. `adlc-flow` is a NEW plugin in a separate repo (`aldianriski/adlc-flow`).** Independent versioning, independent marketplace listing, independent CHANGELOG and ADR series. v0.1.0 today; no semver coupling to dev-flow.

**2. dev-flow is unchanged by this decision.** No skills retired, no outcomes revised, no anti-outcomes loosened. Users building traditional software with AI assistance keep using dev-flow as before.

**3. adlc-flow's scope is the ADLC lifecycle for teams building agentic products.** 7 modes (`discover` / `design` / `prove` / `build` / `validate` / `activate` / `operate`) mapping to ADLC phases P0–P7. 6 gates (HG/SG/AG/VG/RG/MG). Anti-outcome boundary from dev-flow is **explicitly retired** here — adlc-flow plans evals, scaffolds golden datasets, emits observability schemas, tracks cost budgets, runs model-upgrade regression. See `docs/USER-OUTCOMES.md` § Anti-outcomes for what adlc-flow still does not claim.

**4. Selective skill reuse via dev-flow namespace prefix, NOT forking.** When an adlc-flow user needs an ADR written, they invoke `dev-flow:adr-writer`. Same for `dev-flow:lean-doc-generator`, `dev-flow:prime`, `dev-flow:pr-reviewer`, `dev-flow:codemap-refresh`, `dev-flow:release-patch`, `dev-flow:diagnose`. These skills are universal; duplicating them in adlc-flow would create a maintenance bifurcation.

**5. Co-install pattern documented in adlc-flow README.** Recommended setup: install both plugins. adlc-flow handles the agentic-product lifecycle; dev-flow handles surrounding traditional code (UI, APIs, infra). README will state this explicitly.

**6. Vocabulary may diverge.** adlc-flow uses ADLC-native gate codes (HG/SG/AG/VG/RG/MG) rather than dev-flow's G1/G2. This avoids the collision where "G2" means Design in dev-flow but Scope (SG) in adlc-flow context. See ADR-003.

## Alternatives Considered

- **A — Full pivot of dev-flow to ADLC.** Rejected: discards 4 major versions of dev-flow's working capital; SDLC meta-workflow remains a real and useful problem; alienates current adopters who don't ship agentic products.
- **B — Extend dev-flow with `adlc-*` modes.** Rejected: doubles plugin surface; mode-name collision risk; brand becomes "everything plugin" with no clear identity for either audience.
- **C — Selective modernization (inject ADLC insights into dev-flow gates).** Rejected: dishonest framing — would claim ADLC support without actually delivering golden-dataset / eval-suite / drift discipline. Marketing without product.
- **D-alt — Monorepo, two plugins.** Rejected (Q3 in session 2026-05-19): tight coupling risks dev-flow refactors breaking adlc-flow; separate repos give cleanest independent release cadence.

## Consequences

**Positive**
- dev-flow's stable anti-outcome boundary remains honest.
- adlc-flow can adopt ADLC discipline without compromise.
- Users pick the right plugin per project type; co-install pattern handles hybrid projects.
- ADR registries stay independent (adlc-flow starts at ADR-001 cleanly).

**Negative**
- Two repos to maintain; release-patch must be run per plugin.
- Skill cross-references must use full `dev-flow:` prefix — slightly more typing for users.
- New marketplace listing requires the same publishing flow dev-flow uses.
- Initial discovery friction — users may not know they need adlc-flow until they hit dev-flow's anti-outcomes.

**Neutral**
- Co-install pattern depends on Claude Code's marketplace supporting multiple plugins (already true).
- v0.1 ships skeleton + 3 most-distinctive skills (hypothesis-register, agent-architect, pov-gate); fuller skill set lands in subsequent versions.

## References

- EPAM ADLC source — `docs/research/ADLC-source.md`
- dev-flow USER-OUTCOMES § Anti-outcomes — `dev-flow/docs/USER-OUTCOMES.md:90-98`
- dev-flow ADR-026 (outcome-lens precedent) — `dev-flow/docs/adr/ADR-026-user-project-outcome-lens.md`
