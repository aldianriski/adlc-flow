---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-29
update_trigger: ADR status change OR v3.0 release criteria revised
status: decided
---

# ADR-009: v3.0 stability checkpoint — readiness criteria + evidence basis

**Date**: 2026-05-20
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

The TODO.md roadmap defines v3.0 as "externally validated stability checkpoint (≥1 adopter shipped an agentic feature through full lifecycle using adlc-flow)." That criterion is *external-evidence-shaped* — by definition, it cannot be unilaterally declared from inside the plugin's repo.

Across 5 dogfood trials (v2.1 → v2.9), the plugin has accumulated significant internal validation:
- 28 skills · 11 agents · 12 templates · 8 ADRs · 0 structural violations
- 64 friction findings captured · 49 closed (76.5%)
- 19 positive patterns promoted to references / templates
- Trial 5 validated the plugin against a mature 47-ADR · 83KB-TODO · 959-test production codebase

But the plugin has **never been exercised across all 7 post-VG skills against real adopter data** — `/release-readiness`, `/canary-plan`, `/ai-observe`, `/model-upgrade`, `/drift-audit`, `/context-engineer`, `/cost-budget`. Until those skills produce coherent artifacts grounded in actual adopter implementation, the v3.0 claim is unproven.

The chicken-and-egg: external adopters won't reach P5-P7 fast enough to gate v3.0, but the plugin shouldn't ship to marketplace as v2.x indefinitely either.

## Decision

Adopt a **two-tier v3.0 readiness criterion**:

### Tier A — Internal-evidence v3.0 (this release)

Issued when ALL of:
- ALL 28 skills under structural caps · 0 violations · ALL referenced files exist
- ALL promoted-pattern references linked from their parent SKILL.md (no orphans)
- ≥5 dogfood trials documented in `docs/audit/trial-friction-log.md`
- ALL 7 post-VG skills exercised against ≥1 real adopter implementation, artifacts persisted
- ≥1 mature adopter (≥30 sprints + ≥40 ADRs + ≥50 KLOC) successfully adopted at `init` and shipped through P4 build
- Eval pipeline validated end-to-end at 50-sample scale in mock mode for ≥1 adopter feature

> **Amendment (2026-05-29):** v4.0.0 shipped a breaking skill rename (`/adlc-orchestrator` → `/orchestrator`, see ADR-010), which consumed the major version. The Tier-B external-adopter gate below is therefore **v4.1.0**, not the originally-planned v3.1.0 — the criteria are unchanged, only the version number moved.

### Tier B — External-evidence v4.1+ (post-marketplace)

Issued when ALL of:
- ≥1 EXTERNAL adopter (not the maintainer's project) ships through full P0-P7 arc using adlc-flow
- VG-RG-MG gates produce real numerical evidence (not projections)
- Live billing API reconciliation matches projected cost-budget within 15%
- 1 quarterly /drift-audit produces actionable findings on live production data

Tier A is achievable internally; Tier B requires the marketplace adoption cycle.

## Evidence basis (Tier A · this release)

| Criterion | Evidence |
|---|---|
| 28 skills under caps | `docs/audit/skill-eval-report.md` 0 violations |
| All references linked | `skills/{adr-writer,orchestrator,agent-architect,golden-dataset,lean-doc-generator,responsibility-map}/SKILL.md` Reference sections added in v2.10.0 |
| 5 trials documented | `docs/audit/trial-friction-log.md` Trial 1-5 + Trial 5 closing addendum |
| 7 post-VG skills exercised | `temidev/docs/tier3-exercise/` 7 artifacts produced against F3b SoW drafter |
| Mature adopter through P4 | temidev: 47 ADRs · 32 closed sprints · ~959 tests · F3b at P4 build · 11 commits this cycle |
| 50-sample eval validated | `temidev/EVAL-SUITE/{sow-drafter,clause-risk-flagger}/runs/2026-05-20T08-*-mock` |

## Tier B unblockers (when do we promote to v4.1?)

Each item below would substantively contribute to Tier B evidence — collected as a checklist for marketplace launch:

- [ ] External adopter joins via `aldianriski/adlc-flow` marketplace
- [ ] External adopter completes `init` against their existing codebase + reports friction or NO friction
- [ ] External adopter reaches P3 prove gate on their first AI feature
- [ ] External adopter reaches P4 build with PoV
- [ ] External adopter reaches P5 validate with reviewer rubric scoring
- [ ] External adopter reaches P6 activate with canary rollout
- [ ] External adopter reaches P7 operate with first /drift-audit run
- [ ] External adopter runs /model-upgrade on first model bump
- [ ] Live billing reconciliation within ±15% of cost-budget projection (any adopter)

When ≥3 unblockers are met, plugin promotes to v4.1.0 with the evidence basis cited.

## Consequences

### Positive

- v3.0 is achievable in the current release cycle without speculative claims
- Tier A criterion is verifiable: every line item has a file path or audit report
- Tier B framing makes the marketplace launch visible as the next phase, not a blocking dependency
- Honest signal to adopters: "v3.0 = ready for adoption · v4.1 = adoption evidence shipped"

### Negative

- "v3.0" semantics differ from the original TODO.md framing (was strictly external)
- Adopters may expect Tier B evidence at v3.0 and find it deferred to v4.1
- The two-tier framing adds documentation surface (this ADR + README + CHANGELOG must agree)

### Mitigation

- README banner at v3.0 release explicitly says "Tier A internal-evidence validated · Tier B external adopter cycle begins now"
- TODO.md "External validation" section keeps tracking Tier B unblockers
- v4.1.0 release earns its number by meeting ≥3 Tier B unblockers

## Alternatives considered

1. **Strict-original v3.0** — wait for external adopter through full lifecycle. Rejected: timeline indeterminate · plugin sits at v2.x for months without semantic refresh.
2. **Skip to v3.0.0 from v2.9.0 with no criteria** — just bump. Rejected: undermines the "evidence-shaped versioning" the plugin advocates.
3. **Internal-only v3.0 without explicit criteria** — bump silently. Rejected: same anti-pattern as 2; just less obvious.
4. **Bump to v2.10.0 only and indefinitely defer v3.0** — keeps original criterion intact. Rejected: same as 1.

The two-tier approach was selected because it accomplishes both (a) a meaningful release-criterion checkpoint internally, AND (b) preserves the external-adopter criterion as a v4.1 gate.

## Related

- TODO.md "v3.0" line item (roadmap)
- `docs/audit/trial-friction-log.md` (5-trial evidence base)
- `temidev/docs/tier3-exercise/` (post-VG skill exercise artifacts)
- ADR-006 (Trial 1 anchor) · ADR-007 (Trial 2) · ADR-008 (Trial 3)
