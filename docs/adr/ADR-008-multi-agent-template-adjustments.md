---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
update_trigger: ADR status change OR multi-agent template framing revised
status: decided
---

# ADR-008: Multi-agent template + kill-criteria adjustments

**Date**: 2026-05-20
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

The 2026-05-20 customer-support escalation trial (`docs/audit/trial-friction-log.md` § Trial 3) was the first dogfood exercise with a true multi-agent topology — orchestrator-worker pattern with a classifier + 3 specialists + coordinator. The verdict came back `NO_GO` because the kill-criterion on inter-agent prompt-injection resistance fired (88% measured vs. 90% fail-threshold; 12% success rate vs. 5% kill threshold).

That outcome was a *validation* of the kill-criterion path — the first time across three trials that a pre-committed kill-criterion fired on actual data. But the walkthrough also surfaced 5 MEDIUM friction items in the v2.3.0 surfaces that all share a single root cause: **the templates and skills were single-agent-shaped**. They worked, but produced friction whenever the topology had ≥2 agents handing off to each other:

- `agent-architect` Q3-vs-Q1 tie produced no guidance when domains were ≥2 but trajectory was short (F5.1)
- `eval-suite-planner` PLAN.md ran past readable length once per-agent metrics for ≥3 agents stacked into one file (F5.2)
- RESPONSIBILITY-MAP had no way to express that classifier → specialist → coordinator is a *chain* with inherited authority (F5.3)
- `hypothesis-register` agentic prompts never asked "is this multi-agent?" and so never surfaced the three multi-agent-specific kill-criteria classes (F5.4)
- RESPONSIBILITY-MAP had no policy slot for how context passes *between* agents — the exact attack surface that fired the kill-criterion (F5.7)

These are not five independent fixes; they are five surfaces of one missing concept (multi-agent topology as a first-class shape).

## Decision

Adopt the multi-agent topology as a first-class concept across four canonical surfaces, with each surface contributing one defensive layer:

1. **`/agent-architect` (Step 3 tie-break)** — when ≥2 domains + short trajectory, route between multi-agent (non-overlapping domain knowledge) and hybrid ReAct-with-tool-subsets (overlapping knowledge, different tools). Closes the cargo-cult-multi-agent gap.
2. **`/eval-suite-planner` (optional per-agent subfiles)** — at ≥3 agents, allow `EVAL-SUITE/<feature>/per-agent/<agent>.md` split. PLAN.md retains cross-surface concerns; per-agent files retain agent-specific metric tables. Below 3 agents, inline tables stay.
3. **RESPONSIBILITY-MAP template (Chain column + named-agent `Who` rows)** — multi-agent grids gain a `Chain` column with sequence numbers and use specific agent names instead of generic `agent`. Downstream rows inherit upstream authority explicitly.
4. **`/hypothesis-register` (multi-agent kill-criteria prompt)** — Step 4 explicitly asks "is this multi-agent?" and, if yes, requires at least one kill-criterion from each of three classes: inter-agent injection-resistance, role-confusion attack rate, authority-escalation success rate.
5. **RESPONSIBILITY-MAP template (cross-agent context-handoff policy section)** — required section when grid has ≥2 distinct `Who` agents. Declares envelope format (structured JSON only), what CAN/CANNOT pass, pre-filter at boundary, role-stability prompt, and audit hook. This is the v2.4 *mitigation pattern* for the exact attack class that fired Trial 3's kill-criterion.

## Rationale

**Why fold into existing surfaces instead of creating a new "multi-agent skill"**: the [[feedback_plugin_principle_pattern]] rule says ≥3 components affected = fold into canonical surfaces + one ADR pointer. Five surfaces × multi-agent = textbook case. A separate `/multi-agent-architect` would duplicate `/agent-architect` and force users to choose at intake — friction we should not import.

**Why three kill-criterion classes, not one**: Trial 3's kill-criterion fired on injection-resistance specifically, but role-confusion and authority-escalation are *adjacent* failure modes from the same attack family. Pre-committing all three at HG closes the "we only thought to measure what we already feared" gap.

**Why the handoff-policy section is mandatory at ≥2 agents**: the structured-JSON envelope + regex pre-filter + role-stability prompt + audit-log triad is what Trial 3's mitigation plan recommended for the verdict. Making it template-required ensures every multi-agent adopter encounters the mitigation pattern *before* baseline runs, not after a `NO_GO` verdict.

**Why ≥3 agents threshold for per-agent eval subfiles (not ≥2)**: at 2 agents, PLAN.md tables stay under the 100-line readability threshold. The friction emerges specifically when 3-4 agents stack their per-agent metrics into one file. Threshold matches observed friction rather than picking an arbitrary number.

## Consequences

**Positive**:

- Multi-agent topology is *visible* in template structure, not hidden in user diligence
- The exact attack class that fired Trial 3's kill-criterion has a template-enforced mitigation pattern
- Three kill-criterion classes pre-commit users against the full multi-agent attack family, not just the most-feared subset
- `agent-architect` no longer silently recommends multi-agent for short-trajectory multi-domain features
- Per-agent eval files keep PLAN.md readable at the topologies where it otherwise wouldn't be

**Negative**:

- Multi-agent features now carry one extra required section (handoff policy) — small markup tax for a concrete attack surface; single-agent features unaffected
- ADR-008 must be cited from four surfaces — slight cross-reference burden
- `hypothesis-register` agentic procedure gains one prompt — adds ~30s to the HG walkthrough but only when multi-agent confirmed

**Neutral**:

- ADR-008 supersedes nothing — it extends ADR-006 (eval-artifact standardization) and ADR-007 (traditional-adopter support) along the multi-agent axis. No previous decisions reversed.
- Sub-variants of multi-agent (orchestrator-worker · peer-network · hierarchical) are deferred to v2.5 (TASK-503). v2.4 treats multi-agent as a single first-class shape; sub-variant differentiation is the next layer of refinement after external-adopter signal.

## Affected surfaces

| Surface | Change | Version bump |
|---|---|---|
| `skills/agent-architect/SKILL.md` | Step 3 tie-break rule | 1.1.0 → 1.2.0 |
| `skills/eval-suite-planner/SKILL.md` | Optional per-agent subfiles section 1a | 1.1.0 → 1.2.0 |
| `skills/hypothesis-register/SKILL.md` | Multi-agent prompt in Step 4 | 1.2.0 → 1.3.0 |
| `templates/RESPONSIBILITY-MAP.md.template` | Chain column + handoff-policy section | (templates unversioned; tracked in plugin bump) |
| Plugin manifest | Version bump | 2.3.0 → 2.4.0 |

## Open issues (deferred)

- **Sub-variant differentiation** (orchestrator-worker · peer-network · hierarchical): TASK-503 (v2.5+). Waiting for external-adopter signal on whether topology-specific guidance materially helps or just adds surface area.
- **Per-agent kill-switch as canonical pattern** (currently template-suggested, not template-required): TASK-504 (v2.5+).
