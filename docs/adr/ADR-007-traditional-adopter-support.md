---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
update_trigger: ADR status change OR traditional-adopter framing revised
status: decided
---

# ADR-007: Traditional-adopter, multi-track, and existing-project support

**Date**: 2026-05-20
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

The 2026-05-20 Naraly landing trial (`docs/audit/trial-friction-log.md` § Trial 2) surfaced a structural framing gap: adlc-flow's `/orchestrator` is implicitly designed for fresh adopters building agentic products start-to-finish. Real adopters often have:

1. **Existing mature projects** with established conventions (CLAUDE.md, TODO.md, ADRs, sprint shape)
2. **Multiple concurrent tracks** (e.g., product backend wiring + parallel marketing landing)
3. **Mixed feature types** — most features are traditional dev; only some are LLM-core agentic

The plugin's universal surface (absorbed from dev-flow per ADR-004) is fully capable — but the orchestrator's mode taxonomy (`init` → `discover` → ... → `operate`) is ADLC-only, the SPRINT_PROTOCOLS.md anti-pattern table forbids "Concurrent Active Sprints", and the `init` phase halts if canonical artifacts exist. Three constraints fight reality.

Three HIGH findings cluster here (F4.1 · F4.2 · F4.3). Same root cause; single ADR captures the cohesive response.

## Decision

**1. Add a `traditional` mode to `orchestrator`.**
- New entry in the Mode Dispatch table: `traditional` — no ADLC gates fire; dispatches universal skills (`/lean-doc-generator`, `/adr-writer`, `/pr-reviewer`, `/tdd`, `/test-planner`, `/refactor-advisor`, `/diagnose`, `/release-manager`, `/release-patch`) for non-agentic work
- Triggered by: explicit `traditional` argument, OR freeform input + no `HYPOTHESIS.md` ratified entry + no agentic-indicator keywords (LLM · agent · RAG · prompt)
- Orchestrator description updated to name both audiences (agentic product builders + traditional-dev-with-AI-assistance)

**2. `init` mode gracefully handles existing projects.**
- Current step 1: "Check `.claude/` doesn't exist — if it does, stop and ask." Updated to: "Scaffold missing canonical artifacts; SKIP any that exist; emit a one-line warning when an existing convention may conflict (e.g., adopter already has `docs/DECISIONS.md` AND we'd write to `docs/adr/`)."
- `bin/adlc-flow-init.js` is already idempotent (skips existing files). This decision aligns the orchestrator's step 1 prose with the script's actual behavior + adds the convention-conflict warning.
- Adopters with rich existing context (CLAUDE.md, ADRs, sprint conventions) can run `init` safely; only missing artifacts are scaffolded.

**3. SPRINT_PROTOCOLS.md permits concurrent parallel tracks when file-disjoint.**
- "Concurrent Active Sprints" stays an anti-pattern when sprints overlap on the same files (real conflict risk + reviewer confusion). But it's not the same as "concurrent tracks" — separate code surfaces (e.g., `apps/web` backend wiring + `apps/landing` marketing) can run in parallel without conflict.
- Protocol amendment: Active Sprint may be PRIMARY; additional "Parallel Tracks" allowed when file-overlap == ∅. Each track has its own sprint file. Reviewer guidance: parallel tracks merge through the same PR review process; no separate "parallel-only" lane.

**4. `/adr-writer` detects existing ADR convention.**
- Step 1 scans for `docs/adr/ADR-NNN-*.md` files AND `docs/DECISIONS.md`. If only DECISIONS.md exists → append to it (legacy mode). If `docs/adr/` exists → use that (modern mode). If both exist → warn user once + use docs/adr/ as canonical; prompt for migration plan.
- Adopters with the legacy single-file convention can keep it; new adopters land on per-file modern convention.

**5. `/hypothesis-register` accepts non-agentic hypotheses.**
- New `--type` flag: `agentic` (default; existing 8-step procedure) · `conversion` · `latency` · `reliability` · `other`.
- Non-agentic types get a 5-step lighter procedure (pain · falsifiable claim · kill-criteria · skip-when · outcome). Skips agentic-specific steps (workflow-step mapping, no `HYPOTHESIS.md status update via /pov-gate`).
- HYPOTHESIS.md template gains a `Type` column. Existing rows default to `agentic`.

## Alternatives Considered

- **Status quo — document workarounds in README only.** Rejected: pushes friction onto every adopter; framing gap stays in the orchestrator itself.
- **Split orchestrator into two skills (`/adlc-agentic` + `/adlc-traditional`).** Rejected: two slash commands for one mental concept; adopters with hybrid projects would need to remember which command per feature. Single skill with mode dispatch is the proven pattern.
- **Deprecate the "one active sprint" rule entirely.** Rejected: still useful for single-track focus; the right fix is "parallel tracks when file-disjoint", not unlimited concurrency.
- **Force adopters to migrate `docs/DECISIONS.md` → `docs/adr/` at install time.** Rejected: hostile migration; respect existing conventions.
- **Defer to v2.4+.** Considered. Rejected because Trial 2 caught these in the SECOND ever real-world exercise; deferring means every subsequent adopter hits them. v2.3.0 is the right release.

## Consequences

**Positive**
- adlc-flow now serves traditional dev + agentic dev with one orchestrator, not just agentic.
- Existing-project adoption is friction-free; `init` no longer halts on rich-context adopters.
- Multi-track reality (parallel concerns within one repo) gets first-class protocol support.
- Marketing/landing/ops-tooling features can be planned with proper kill-criteria via the non-agentic `/hypothesis-register` variant.
- ADR-writer respects existing conventions; no surprise file collisions.

**Negative**
- `orchestrator` SKILL.md grows ~10 lines to add `traditional` mode + new Phase block. May approach line cap; offset by trimming dispatcher-role paragraph.
- `/hypothesis-register` becomes more complex (5 type variants vs 1). Counter: most adopters use defaults; the `--type` flag only fires when explicitly chosen.
- Two ADR conventions (legacy DECISIONS.md + modern docs/adr/) coexist; adopters might be uncertain which to extend. Mitigation: SKILL.md prefers `docs/adr/` for new ADRs; legacy file is read but not auto-extended unless it's the only convention.

**Neutral**
- v2.3.0 MINOR bump (additive: new mode + new type flag + amended protocol). No published adopters to break.
- ADR-001 (sister plugin · superseded) + ADR-007 cluster as the "trial-driven cleanup" decisions; future maintainers see the dogfood loop in action.

## References

- `docs/audit/trial-friction-log.md` § Trial 2 — source findings (F4.1 · F4.2 · F4.3 · F4.4 · F4.6)
- ADR-006 — prior trial-driven cleanup (Trial 1 → v2.2.0)
- ADR-004 — dev-flow absorption decision (made the universal surface available; this ADR makes it accessible)
- v2.3.0 CHANGELOG entry — implementation summary
- Naraly landing trial — first real-world existing-project adopter, surfaced the framing gap
