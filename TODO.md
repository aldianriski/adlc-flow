---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-24
update_trigger: Sprint promote / close / task add
status: current
---

# TODO.md — adlc-flow

> Active Sprint pointer at top. **Backlog = open items only** — shipped work lives in [`CHANGELOG.md`](CHANGELOG.md) + the Roadmap below.

---

## Active Sprint

`— none — (v3.0.0 SHIPPED + PUSHED + TAGGED + RELEASED @ 43ce903 · Tier A. Next milestone = v3.1 Tier B external-adopter evidence — see TASK-101.)`

---

## Backlog

### P0 — Marketplace
- TASK-103 — Submit `marketplace.json` to the Claude Code marketplace (single `gh` API call OR manual submission · all blockers cleared in v2.9.0 · outward-facing, needs user go-ahead).

### P1 — External validation (the v3.1 Tier B gate)
- TASK-101 — Real LLM-core feature dogfood through the **full P0–P7 arc**. Pre-code phases COMPLETE 2026-05-20 via umkm-indo trial (init → discover → design → prove-prep · 5 findings captured · 2 closed in v2.6.0 · 3 patterns promoted v2.7+). **Remaining**: PoV-build onward — P4 build · P5 validate/RG · P6 activate · P7 operate/MG. Continues at `D:\Project\umkm-indo\`, OR via a separate third-party-adopter recruitment. This is the single gate between v3.0 (Tier A) and v3.1 (Tier B). **BLOCKED (2026-05-24)**: eval triad (golden-dataset · EVAL-SUITE · `poc/`) is stale vs the amended H-001 (landing-page-from-description) — must realign before VG. Resume briefing at `umkm-indo/RESUME-HERE.md`; dogfood finding = Trial 6 / F9.1–F9.3.

### P2 — v3.1+ candidates
- TASK-301 — Multi-language adopter templates (Python project structure · Go project structure).
- TASK-302 — `prompt-reviewer` upgrade: structured PoC scoring against a frozen attack corpus.
- TASK-303 — `cost-analyst` integration with provider billing APIs (read-only · OpenLLMetry/Helicone adapter).
- TASK-304 — `agent-architect`: framework-agnostic pattern catalog reference (LangChain / LangGraph / CrewAI / Autogen as adapter targets).
- TASK-305 — Verify Node hooks on macOS/Linux in practice (current impl is portable · needs platform-test).
- TASK-306 — Guided-tour / onboarding-walkthrough emitter built on the graphify graph (god-nodes = entry points · communities = chapters). Idea lifted from the 2026-05-24 Understand-Anything evaluation (see memory `understand-anything-eval`). v1 navigational-only (zero-cost) · opt-in `--enrich` for LLM prose. **Build only when recruiting an external adopter (TASK-101) — adopter-onboarding de-risk, not speculative feature work.**
- TASK-307 — `/hypothesis-register --amend` should emit a **tracked blocking item** for stale downstream artifacts (classify each as `compatible`/`needs-reshape`; refuse clean exit while any `needs-reshape` is open) instead of a prose note. From Trial 6 / F9.1 (umkm-indo amendment-drift — eval triad stranded by a hypothesis pivot, nothing tracked it).
- TASK-308 — `/pov-gate` pre-flight **hypothesis↔golden-dataset shape guard**: halt with `HYPOTHESIS_DATASET_MISMATCH` when the hypothesis's input/output/metric vocabulary diverges from the dataset schema (parallel to the existing `INSUFFICIENT_SAMPLES` halt). From Trial 6 / F9.2.

---

## Closed sprints

Detail in [`CHANGELOG.md`](CHANGELOG.md). One-line ribbon, most recent first:

- **Sprint 011** *(2026-05-20, v2.4.0)* — Trial 3 fixes: multi-agent customer-support escalation dogfood surfaced 10 findings (5 MEDIUM closed · 4 LOW deferred · 1 validation). VG verdict: **NO_GO** (inter-agent injection-resistance 88% fired kill-criterion — first trial to exercise the kill path). 5 MEDIUM closed (F5.1 tie-break · F5.2 per-agent eval subfiles · F5.3 chained-authority table · F5.4 multi-agent kill-criteria prompts · F5.7 cross-agent handoff policy). ADR-008 anchors. [→ CHANGELOG](CHANGELOG.md#240--2026-05-20)
- **Sprint 010** *(2026-05-20, v2.3.0)* — Trial 2 fixes: Naraly landing dogfood surfaced 13 findings; 5 closed (3 HIGH + 2 MEDIUM): `traditional` mode in orchestrator · `init` handles existing-project · parallel tracks allowed when file-disjoint · `/adr-writer` detects existing convention · `/hypothesis-register --type` flag for non-agentic claims. ADR-007 anchors. [→ CHANGELOG](CHANGELOG.md#230--2026-05-20)
- **Sprint 009** *(2026-05-20, v2.2.0)* — Trial-driven fixes: 5 MEDIUM + 2 LOW friction items resolved (CLAUDE.md.template scaffolded by init; HYPOTHESIS two-tier format; EVAL-SUITE/<feature>/ standardization; pov-gate verdict persistence + sample-count floor; BASELINE.md.template; ADR-006). Closes trial dogfood loop. [→ CHANGELOG](CHANGELOG.md#220--2026-05-20)
- **Sprint 008** *(2026-05-19, v2.1.0)* — Graphify integration: retired `codemap-refresh`; rewired `/zoom-out` + `/context-engineer` to hard-depend on graphify; added `/graph-query`; ADR-005 documents the adoption. [→ CHANGELOG](CHANGELOG.md#210--2026-05-19)
- **Sprint 007** *(2026-05-19, v2.0.0)* — Great Consolidation: absorbed 14 dev-flow universal skills + 6 specialist agents + ported PS hooks to Node + rewired refs + ADR-004 (supersedes ADR-001). [→ CHANGELOG](CHANGELOG.md#200--2026-05-19)
- **Sprint 006** *(2026-05-19, v1.0.0)* — LICENSE · .gitignore · README/CONTEXT/USER-OUTCOMES v1.0 polish · stability contract begins. [→ CHANGELOG](CHANGELOG.md#100--2026-05-19)
- **Sprint 005** *(2026-05-19, v0.5.0)* — cost-budget skill + cost-analyst agent + 2 hooks. [→ CHANGELOG](CHANGELOG.md#050--2026-05-19)
- **Sprint 004** *(2026-05-19, v0.4.0)* — canary-plan + ai-observe + model-upgrade + drift-audit skills + red-team-analyst + drift-analyst agents. [→ CHANGELOG](CHANGELOG.md#040--2026-05-19)
- **Sprint 003** *(2026-05-19, v0.3.0)* — context-engineer + release-readiness skills + eval-analyst + prompt-reviewer agents. [→ CHANGELOG](CHANGELOG.md#030--2026-05-19)
- **Sprint 002** *(2026-05-19, v0.2.0)* — responsibility-map + eval-suite-planner + golden-dataset + init script + structural eval harness. [→ CHANGELOG](CHANGELOG.md#020--2026-05-19)
- **Sprint 001** *(2026-05-19, v0.1.0)* — bootstrap (manifest · context · USER-OUTCOMES · 3 ADRs · ADLC source extract · 4 v0.1 skills). [→ CHANGELOG](CHANGELOG.md#010--2026-05-19)

---

## Roadmap

- **v0.1.0 → v1.0.0** *(shipped 2026-05-19)* — ADLC-native skeleton through feature-complete agentic lifecycle (14 skills · 5 agents · 2 hooks).
- **v2.0.0** *(shipped 2026-05-19)* — Great Consolidation: absorbs dev-flow universals into unified plugin (28 skills · 11 agents · Node hooks · cross-platform).
- **v2.1.0** *(shipped 2026-05-19)* — Graphify integration: `/zoom-out` + `/context-engineer` hard-depend on graphify; new `/graph-query`; `codemap-refresh` retired.
- **v2.2.0** *(shipped 2026-05-20)* — Trial 1 fixes: ticket-triage dogfood surfaced 5 MEDIUM + 2 LOW; resolved via ADR-006 (artifact-location standardization + division of labor + verdict persistence + sample-count floor).
- **v2.3.0** *(shipped 2026-05-20)* — Trial 2 fixes: Naraly landing dogfood surfaced 13 findings; 5 closed (3 HIGH + 2 MEDIUM) via ADR-007 (`traditional` mode + existing-project init + parallel tracks + ADR convention detect + non-agentic hypotheses).
- **v2.4.0** *(shipped 2026-05-20)* — Trial 3 fixes: 5 MEDIUM findings closed (F5.1 tie-break · F5.2 per-agent eval subfiles · F5.3 chained-authority table · F5.4 multi-agent kill-criteria prompts · F5.7 cross-agent handoff section) via ADR-008. Multi-agent topology now first-class across `/agent-architect` v1.2.0 · `/eval-suite-planner` v1.2.0 · `/hypothesis-register` v1.3.0 · RESPONSIBILITY-MAP template.
- **v2.5.0** *(shipped 2026-05-20)* — Multi-agent refinements: 4 Trial 3 LOW findings closed (F5.5 mitigation structure · F5.6 headroom callout · F5.8 sub-variants · F5.9 per-agent kill-switch). Bundles the v2.4-era polish round: TASK-202 behavioral acceptance harness · TASK-203 audit-baseline Node port · TASK-204 graphify install + cost recipe · TASK-205 SessionStart opt-in auto-update. Closes ADR-008's "Open issues (deferred)" block.
- **v2.6.0** *(shipped 2026-05-20)* — Trial 4 (umkm-indo pre-code) fixes: hypothesis-register accepts `defer to AG` for multi-agent kill-criteria (chicken-and-egg fix · F6.1) · agent-architect HALTs ADR write on `[DEFER-TO-AG]` placeholder · HYPOTHESIS.md.template gains the `Type` column. First non-synthetic trial closed.
- **v2.7.0** *(shipped 2026-05-20)* — Trial 4b (umkm-indo PoV build) fixes + pattern promotion: `/hypothesis-register --amend H-NNN` mode (F7.1) · server-only-from-script reference doc (F7.2) · stack-freshness hint in CLAUDE.md.template (F7.3) · non-ADLC skill integration reference (F7.4) · promoted 4 positive patterns to references (F7.5 mock-first PoV · F7.6 3-cache-blocks · F7.7 single-call planner · F7.8 preview-gate UX). **First trial where promoted patterns outnumbered closed friction (4 vs 4)** — maturity signal.
- **v2.8.0** *(shipped 2026-05-20)* — Trial 5 mature-adopter fixes (10 items · `init.js` rewrite · MIGRATION + SPRINT-CONVENTION-COMPAT docs · 3 promoted references).
- **v2.9.0** *(shipped 2026-05-20)* — Marketplace-readiness sprint. Trial 2 LOW backlog closed (F4.8-F4.13 · 3 high-impact templates + scenario cheatsheet). Adopter-onboarding cliff fixed.
- **v2.10.0** *(shipped 2026-05-20)* — **v3.0 Tier A readiness sprint** per ADR-009. 1 structural violation fixed · 6 orphan-reference links added · Trial 5 closing addendum · golden datasets expanded to 50 samples · mock-mode eval validated end-to-end · 7 Tier 3 skills exercised against real adopter data. Tier A criteria all signed.
- **v3.0.0** *(shipped 2026-05-20)* — **v3.0 stability checkpoint (Tier A · internal-evidence validated)** per ADR-009. Cumulative result of v0.1 → v3.0 arc: 28 skills · 11 agents · 12 templates · 9 ADRs · 5 dogfood trials · 0 structural violations. Tier B external-adopter evidence becomes the v3.1.0 gate. Tagged + GitHub Release published 2026-05-24.
- **v3.1.0** *(future)* — Tier B external-adopter validation: ≥1 external adopter through full P0-P7 arc · live billing reconciliation · 1 quarterly /drift-audit on live data.
- **v3.x+** *(future)* — F6.3 cost-kill marketing · F6.4 clarification-flow reference · multi-language adopter templates · prompt-reviewer attack-corpus · cost-analyst billing-API · TASK-306 guided-tour emitter.

---

## References

- [ADR-009](docs/adr/ADR-009-v3-readiness-criteria.md) — two-tier v3.0 readiness criterion (Tier A internal · Tier B external)
- [ADR-008](docs/adr/ADR-008-multi-agent-template-adjustments.md) — multi-agent template + kill-criteria adjustments (Trial 3)
- [ADR-007](docs/adr/ADR-007-traditional-adopter-support.md) — traditional-adopter + multi-track + existing-project (Trial 2)
- [ADR-006](docs/adr/ADR-006-eval-artifact-standardization.md) — EVAL artifact paths + division of labor + verdict persistence (Trial 1)
- [ADR-005](docs/adr/ADR-005-graphify-adoption.md) — graphify adopted as canonical knowledge-graph backend
- [ADR-004](docs/adr/ADR-004-absorb-dev-flow.md) — absorption of dev-flow universals
- [ADR-001](docs/adr/ADR-001-sister-plugin-relationship.md) — original sister-plugin framing (superseded by ADR-004)
- [ADR-002](docs/adr/ADR-002-adlc-source.md) — EPAM ADLC article as authoritative source
- [ADR-003](docs/adr/ADR-003-gate-naming-rationale.md) — gate naming HG/SG/AG/VG/RG/MG
- [USER-OUTCOMES.md](docs/USER-OUTCOMES.md) — A1-A8 registry with skip-when counter-evidence
- [docs/research/ADLC-source.md](docs/research/ADLC-source.md) — vendored EPAM source extract
- https://graphify.net + https://github.com/safishamsi/graphify — knowledge-graph backend
