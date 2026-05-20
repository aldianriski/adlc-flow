---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
update_trigger: Sprint promote / close / task add
status: current
---

# TODO.md — adlc-flow

> Active Sprint pointer at top. Closed-sprint detail lives in [`CHANGELOG.md`](CHANGELOG.md).

---

## Active Sprint

`— none — (v2.10.0 closed; v3.0.0 commit pending)`

---

## Backlog

### P0 — Pending user action
- ~~TASK-011 — First commit + push to `aldianriski/adlc-flow` remote~~ ✓ shipped 2026-05-20 (initial commit 7d19820 · v2.7.0 · 98 files · master tracks origin/master)
- TASK-103 — Marketplace publish (GitHub repo now public + non-empty · marketplace.json validated by Claude Code marketplace)

### P1 — v2.10.0 (SHIPPED 2026-05-20 · v3.0 Tier A readiness sprint)
- ~~Phase A — plugin completeness audit (1 violation fixed + 6 orphan references linked + Trial 5 closing addendum)~~ ✓
- ~~Phase B — eval rigor (SoW 10→50 samples · clause-risk NEW 50 samples · mock-mode pipeline validated end-to-end: SoW 45/50 · CR 36/50)~~ ✓
- ~~Phase C — Tier 3 ADLC arc exercise (7 post-VG skills against temidev F3b · 10 debt items surfaced for v3.1+)~~ ✓
- ~~ADR-009 — two-tier v3.0 readiness criterion (Tier A internal · Tier B external)~~ ✓
- ~~Bump 2.9.0 → 2.10.0 · CHANGELOG entry · README banner update~~ ✓

### P1 — v2.9.0 (SHIPPED 2026-05-20 · Marketplace readiness)
- ~~F4.8 — Server Action + RLS template (Supabase pattern · deferred since Trial 2 v2.3)~~ ✓ `templates/SERVER-ACTION-RLS.md.template`
- ~~F4.9 — i18n bilingual content-object template (deferred since Trial 2)~~ ✓ `templates/I18N-BILINGUAL.md.template`
- ~~F4.10 — Deploy-plan template (Vercel + Supabase · deferred since Trial 2)~~ ✓ `templates/DEPLOY-PLAN.md.template`
- ~~F4.11 — Scenario → skill chain cheatsheet (adopter onboarding cliff · deferred since Trial 2)~~ ✓ `README.md` "Scenario → skill chain cheatsheet" section · 18 scenarios
- ~~F4.13 — `/adlc-orchestrator` "existing-project" path explicit in description~~ ✓ SKILL.md v1.1.0 → v1.2.0 · NEW "Adopter scenarios" 9-row matrix
- ~~README polish for marketplace listing~~ ✓ Complete rewrite · adopter-facing first-impression-ready

### P0 — Marketplace
- TASK-103 — Submit marketplace.json to Claude Code marketplace (single `gh` API call OR manual submission · all blockers cleared in v2.9.0)

### P1 — v2.8.0 (SHIPPED 2026-05-20 · Trial 5)
- ~~F8.1 — `init.js` detects existing `docs/DECISIONS.md` (single-file ADR) or `docs/adr/` with content; writes POINTER.md not .gitkeep~~ ✓
- ~~F8.2 — `docs/MIGRATION-FROM-DEV-FLOW.md` for dev-flow → adlc-flow migration guide~~ ✓
- ~~F8.3 — `init.js` inspects `.claude/settings.json` plugin-enabled state · `--enable` flag patches automatically~~ ✓
- ~~F8.4 — `init.js` detects TODO.md / CHANGELOG · compat note + `docs/SPRINT-CONVENTION-COMPAT.md`~~ ✓
- ~~F8.5 — `init.js` conditional next-steps message (skip "customize CLAUDE.md" when file SKIPPED)~~ ✓
- ~~F8.6 — `init.js` post-run commit-policy guidance for adopter artifacts~~ ✓
- ~~F8.10 — `templates/SETUP-supabase.md.template` for Docker dependency + Vault provisioning~~ ✓
- ~~F8.12 — `skills/adr-writer/references/adr-amendment-pattern.md` (ADR § Amendment shape)~~ ✓
- ~~F8.13 — `skills/responsibility-map/references/form-action-wrappers.md` (inline SA wrapper pattern)~~ ✓
- ~~F8.15 — `skills/lean-doc-generator/references/recon-first-discipline.md` (4-trial-validated rule)~~ ✓

### P1 — v2.6.0 (SHIPPED 2026-05-20)
- ~~TASK-601 — `templates/HYPOTHESIS.md.template` missing `Type` column~~ ✓ Type column added to summary table header + placeholder row + reference line of Type values + detail-block field
- ~~TASK-602 — `/hypothesis-register` multi-agent kill-criteria prompt chicken-and-egg fix~~ ✓ hypothesis-register v1.4.0 accepts `defer to AG` answer with placeholder · agent-architect v1.4.0 HALTs ADR write on `[DEFER-TO-AG]` until amendment

### P1 — v2.7.0 (SHIPPED 2026-05-20 · Trial 4b)
- ~~TASK-701 — `/hypothesis-register --amend H-NNN` mode for hypothesis-amendment cascade (F7.1)~~ ✓ v1.5.0 · 6-artifact cascade-scan · amendment-history line · no-silent-soften rule
- ~~TASK-702 — `docs/references/script-from-nextjs.md` reference doc (F7.2)~~ ✓ Recipe for server-only + cross-env + NODE_OPTIONS=--conditions=react-server when running CLI scripts from a Next.js project
- ~~F7.3 — CLAUDE.md.template stack-freshness hint~~ ✓ one-line note added to Stack section
- ~~F7.4 — non-ADLC skill integration points~~ ✓ `skills/adlc-orchestrator/references/non-adlc-skill-integration.md` documents recommended hand-off points per phase
- ~~F7.5 — mock-first PoV scaffold pattern~~ ✓ promoted to `skills/golden-dataset/references/mock-first-pov.md` (third cross-trial validation)
- ~~F7.6 — 3-cache-blocks prompt-caching pattern~~ ✓ `skills/agent-architect/references/prompt-caching-pattern.md`
- ~~F7.7 — single-call planner with tool_use~~ ✓ `skills/agent-architect/references/single-call-planner.md` with worked example from umkm-indo
- ~~F7.8 — preview-gate + cost-banner UX~~ ✓ `skills/responsibility-map/references/preview-gate-ux.md`

### P0 — v2.4.0 (SHIPPED 2026-05-20)
- ~~TASK-401 — F5.1: `/agent-architect` tie-break rule when short trajectory + multi-domain~~ ✓ v1.2.0
- ~~TASK-402 — F5.2: optional per-agent eval subfiles when ≥3 agents~~ ✓ `/eval-suite-planner` v1.2.0
- ~~TASK-403 — F5.3: RESPONSIBILITY-MAP Chain column / sequence-numbered rows~~ ✓ template updated
- ~~TASK-404 — F5.4: `/hypothesis-register --type=agentic` prompts for multi-agent kill-criteria~~ ✓ v1.3.0
- ~~TASK-405 — F5.7: RESPONSIBILITY-MAP cross-agent context-handoff policy section~~ ✓ template updated
- ~~TASK-406 — ADR-008 anchors multi-agent template adjustments cluster~~ ✓ written
- ~~TASK-407 — Bump v2.4.0 · CHANGELOG entry · structural eval pass~~ ✓ 28 skills · 11 agents · 0 violations

### P1 — Next-session candidates (non-trial)
- ~~TASK-202 — Behavioral acceptance harness~~ ✓ shipped 2026-05-20 (`scripts/eval-acceptance.js` + 8 representative prompts at `tests/skill-triggering/prompts/`. DRY RUN is default ($0); `--live` opts into spawning claude CLI per dev-flow ADR-021 Mode A. Pass rule: ≥2/3 quorum on `"name":"Skill"` AND target match. Bonus: surfaced + fixed gitignore over-reach that would have excluded trial-friction-log + graphify-out from first commit)
- ~~TASK-203 — `scripts/audit-baseline.js` Node port~~ ✓ shipped 2026-05-20 (28 skills · 11 agents · 8 ADRs · 8 templates · 4 scripts measured; outputs `docs/audit/baseline-metrics.{md,json}`; tracks rigid/flexible split + version + ADR table + template table beyond dev-flow's port; exits 1 on cap violations for CI use)
- ~~TASK-204 — Document graphify MCP server setup recipe in README/CLAUDE.md~~ ✓ shipped 2026-05-20 (README "Graphify install" section: uv-tool install + backend choice table + extract/update/cluster-only cost distinction + small-corpus reduction honesty · validated end-to-end against live graph: query · explain · path)
- ~~TASK-205 — Wire SessionStart hook to optionally auto-run graphify update when stale~~ ✓ shipped 2026-05-20 (`ADLC_GRAPHIFY_AUTO_UPDATE=1` triggers AST-only `graphify update .` when graph older than `ADLC_GRAPHIFY_STALE_DAYS` (default 7); explicitly does NOT auto-run full-cost `graphify extract` per cost-safety. PATH detection + 120s timeout + graceful failure)

### P2 — v2.5.0 (SHIPPED 2026-05-20)
- ~~TASK-501 — F5.5: `/pov-gate` mitigation-plan structure~~ ✓ pov-gate v1.2.0 verdict template requires per-finding triplet (finding · proposed fix · re-eval acceptance criterion)
- ~~TASK-502 — F5.6: `/pov-gate` headroom callout~~ ✓ emits warning line for any metric within 10% of kill threshold, above the recommendation
- ~~TASK-503 — F5.8: `/agent-architect` multi-agent sub-variants~~ ✓ agent-architect v1.3.0 distinguishes orchestrator-worker / peer-network / hierarchical with fit + coordination cost; ADR must name sub-variant
- ~~TASK-504 — F5.9: RESPONSIBILITY-MAP per-agent kill-switch~~ ✓ template Kill-switch section adds Per-agent row (multi-agent only, <30s operator disable, fallback to human/peer)

### P1 — External validation
- TASK-101 — Real LLM-core feature dogfood. **Pre-code phases COMPLETE 2026-05-20** via umkm-indo trial (init → discover → design → prove-prep) — 5 findings captured, 2 closed in v2.6.0, 3 positive patterns flagged for v2.7+ formalization. **Remaining**: full lifecycle from PoV-build onward (P4 build · P5 validate/RG · P6 activate · P7 operate/MG). Continues at `D:\Project\umkm-indo\`. Gates v2.x → v3.0 still pending the build-through-operate arc. Could be umkm-indo itself, OR could be a separate third-party-adopter recruitment.

### P2 — v2.1+ improvements
- TASK-301 — Multi-language adopter templates (Python project structure, Go project structure)
- TASK-302 — `prompt-reviewer` upgrade: structured PoC scoring against a frozen attack corpus
- TASK-303 — `cost-analyst` integration with provider billing APIs (read-only; OpenLLMetry/Helicone adapter)
- TASK-304 — `agent-architect`: framework-agnostic pattern catalog reference (LangChain / LangGraph / CrewAI / Autogen as adapter targets)
- TASK-305 — Verify Node hooks on macOS/Linux in practice (current Node implementation is portable; just needs platform-test)

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
- **v3.0.0** *(target — next release)* — **v3.0 stability checkpoint (Tier A · internal-evidence validated)** per ADR-009. Tier B external-adopter evidence becomes the v3.1.0 gate.
- **v3.1.0** *(future)* — Tier B external-adopter validation: ≥1 external adopter through full P0-P7 arc · live billing reconciliation · 1 quarterly /drift-audit on live data.
- **v3.x+** *(future)* — F6.3 cost-kill marketing · F6.4 clarification-flow reference · multi-language adopter templates · prompt-reviewer attack-corpus · cost-analyst billing-API.

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
