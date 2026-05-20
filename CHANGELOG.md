# Changelog

All notable changes to `adlc-flow` are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning: [SemVer](https://semver.org/).

---

## [2.8.0] — 2026-05-20

**Trial 5 (temidev mature-adopter dogfood) fixes + pattern promotion.** Closes 6 MEDIUM/LOW friction items surfaced during the first end-to-end ADLC walkthrough on a mature pre-existing codebase (temidev · 31 closed sprints · 49 ADRs in single-file convention · 83KB TODO.md · 247KB CHANGELOG). Promotes 3 positive patterns (ADR amendment shape · inline form-action wrappers · recon-first discipline). Full trial signal in [`docs/audit/trial-friction-log.md` § Trial 5](docs/audit/trial-friction-log.md). Trial produced 31 distinct items across 14 commits over 5 phases (Phase 0 adoption · F2 ID-default i18n · F3a workflow agreement · F3b SoW drafter ADLC arc 5/6 gates · F3c clause risk flagger ADLC arc 5/6 gates · F4+F5 sidebar polish).

### Changed

- **`bin/adlc-flow-init.js` v2.7.0 → v2.8.0** — five fixes for mature-adopter scenarios:
  - **F8.1**: detects existing `docs/DECISIONS.md` (single-file ADR convention) or `docs/adr/` with content; writes `docs/adr/POINTER.md` (redirect sentinel) instead of `.gitkeep`. Prevents dual-convention silent collisions.
  - **F8.3**: inspects `.claude/settings.json` post-run · emits ✓/⚠ status. New `--enable` flag patches `enabledPlugins.adlc-flow: true` automatically (creates settings.json if missing).
  - **F8.4**: detects existing `TODO.md` + `CHANGELOG.md` + `docs/CHANGELOG.md` · emits compatibility note pointing to NEW `docs/SPRINT-CONVENTION-COMPAT.md` (this commit).
  - **F8.5**: conditional next-steps message · only suggests customizing `.claude/CLAUDE.md` if it was actually WRITTEN (not SKIPPED).
  - **F8.6**: post-run "commit policy" guidance · explicit `git add` example listing the 6 root adopter artifacts + dirs · prevents accidental gitignore of project records.

### Added

- **`docs/MIGRATION-FROM-DEV-FLOW.md`** — explicit migration guide for dev-flow adopters. Closes F8.2. Documents the universal-surface skill compatibility (12 skills carry over verbatim · 1 renamed · 13 new ADLC-specific skills). Recommended migration sequence + ADR convention handling + TODO/CHANGELOG handling. Cross-references Trial 5 as the validation evidence.

- **`docs/SPRINT-CONVENTION-COMPAT.md`** — Sprint convention compatibility notes for adopters with existing TODO.md / CHANGELOG / sprint-file shapes. Closes F8.4 (paired with the init.js detection). TL;DR: keep your existing protocol · adlc-flow coexists. Documents 3 validated adopter shapes (temidev · naraly · standard).

- **`templates/SETUP-supabase.md.template`** — Supabase tooling setup template for adopters using Supabase as BaaS. Closes F8.10. Covers Docker requirement · supabase CLI workflow · pre-push checklist · Vault secret provisioning · common pitfalls (PostgREST array-shape · service-role bypass discipline). Surfaced during Trial 5 F3a where Docker dependency blocked idempotent re-run smoke test.

- **`skills/adr-writer/references/adr-amendment-pattern.md`** — Codifies the `## ADR-NNN § Amendment YYYY-MM-DD` pattern (F8.12 promotion · 2-adopter precedent at ADR-046 + ADR-049 §3). When to use vs when to write a new ADR · shape · cross-reference convention · trigger to promote at 3+ amendments.

- **`skills/responsibility-map/references/form-action-wrappers.md`** — Codifies the inline-Server-Action form-action wrapper pattern (F8.13 promotion). Bridges typed structured SAs (testable in isolation) with Next.js form-action surface (browser submit + redirect). Documents the trade-off · when to use vs when to lift to client island · 3 temidev adopter precedents.

- **`skills/lean-doc-generator/references/recon-first-discipline.md`** — Codifies the recon-first rule (F8.15 promotion · 4 cross-trial validations · Sprint 050 + 051a + Trial 5 F3a + Trial 5 F4+F5). Cuts sprint scope 50-85% on mature codebases. When to apply · when NOT to apply · 6-step procedure · trade-off explanation.

### Trial 5 evidence base

- 11 commits on temidev master across 5 trial phases · ~4500 insertions
- 3 commits on adlc-flow master capturing friction signal
- Both AI wedges (F3b SoW drafter · F3c clause risk flagger) shipped to 5/6 ADLC gates · 9 numeric pass-thresholds locked in writing BEFORE production code reached VG
- Trial findings: 8 friction · 3 validations · ~14 positive patterns = 25-31 distinct items (vs Trial 4's 5 + Trial 4b's 8 — Trial 5 is the deepest single-trial signal yet)

### Validated v2.x fixes still working

- F4.2 (Sprint 022 · init.js .claude/CLAUDE.md SKIP) — confirmed at Trial 5 Phase 0 Re-run.
- F4.4 (v2.3 · /adr-writer detects existing convention) — refined further at init layer via F8.1.
- F7.5 (Trial 4b · mock-first PoV) — 5th cross-trial validation at Trial 5 F3b P3 prep + F3c P3 prep.
- F7.6 (Trial 4b · 3-cache-blocks) — applied at temidev F3b ADR-050 §3 (3 blocks) and F3c ADR-051 §3 (2 blocks — taxonomy-only variant).
- F7.7 (Trial 4b · single-call planner with tool_use) — applied at both F3b ADR-050 §1 and F3c ADR-051 §1.

---

## [2.7.0] — 2026-05-20

**Trial 4b (umkm-indo PoV build) fixes + pattern promotion.** Closes 2 MEDIUM workflow gaps and 2 LOW doc-additions surfaced while building the umkm-indo landing-page MVP through tasks 1-6 of its ADR-002 plan. Promotes 4 positive patterns from the dogfood loop to canonical references. Full trial signal in [`docs/audit/trial-friction-log.md` § Trial 4b](docs/audit/trial-friction-log.md).

### Changed
- **`/hypothesis-register` v1.4.0 → v1.5.0** — new `--amend H-NNN` mode for refining an existing hypothesis mid-flight. Modified procedure walks the cascade across 6 dependent artifact types (RESPONSIBILITY-MAP · ADRs · EVAL-SUITE STRATEGY+PLAN · COST-BUDGET · feature-directory rename suggestion). Emits amended row + detail block + Amendment history line. Hard rule: never silently soften kill-criteria. Closes F7.1 (TASK-701).
- **`templates/CLAUDE.md.template`** — Stack section gains a one-line hint: *"verify exact versions via `npm view <pkg> version` / `pip index versions <pkg>` before committing — assistant knowledge cutoffs can lag stable releases by months."* Closes F7.3. Surfaced when umkm-indo scaffold initially assumed Next.js 15 + React 18 vs reality Next.js 16 + React 19 + Tailwind 4.

### Added
- **`docs/references/script-from-nextjs.md`** — Recipe for running standalone Node scripts that import server-only modules (server-only npm install + cross-env + NODE_OPTIONS=--conditions=react-server). Closes F7.2 (TASK-702). Surfaced when wiring umkm-indo's eval-landing.ts against the server-only-marked Anthropic generator. Adopters who hit this would otherwise burn an hour debugging "This module cannot be imported from a Client Component module."

- **`skills/golden-dataset/references/mock-first-pov.md`** — Promotes the mock-first PoV scaffold pattern (third cross-trial validation in Trial 4b · F7.5). Build deterministic mock pipeline · run cheap eval against golden dataset · catch latent bugs at $0 before live LLM wire-up. Documents when to use · when not to · what mock should/shouldn't do · cost economics. Pairs with `script-from-nextjs.md`.

- **`skills/agent-architect/references/prompt-caching-pattern.md`** — Promotes the 3-cache-blocks architecture (system prompt + reference data + style guide as separate ephemeral-cached blocks; user prompt outside cache). Closes F7.6. Worked example from umkm-indo's landing-page generator showing ~40-60% input-cost reduction after warmup. Provider-agnostic (works for Anthropic + OpenAI).

- **`skills/agent-architect/references/single-call-planner.md`** — Promotes single-call planner with `tool_use` structured output over orchestrated multi-call approaches. Closes F7.7. Documents the cost-vs-coherence trade-off with the umkm-indo worked example (~Rp 1.200 single-call vs ~Rp 157.000 hybrid multi-agent for the same coherence quality at AG cost-kill-criterion fire).

- **`skills/responsibility-map/references/preview-gate-ux.md`** — Promotes the preview-gate + sticky cost banner UX pattern. Closes F7.8. The P3-quality UX expression of RESPONSIBILITY-MAP `human-pre` rows + COST-BUDGET per-call ceiling. Shows compliance flags · cost · regenerate link above generated content. Anti-pattern is rendering AI output as fait-accompli with tiny Publish button.

- **`skills/adlc-orchestrator/references/non-adlc-skill-integration.md`** — Documents recommended hand-off points between ADLC-native skills and specialized non-ADLC skills (`/frontend-design` · `/supabase` · `/security-auditor` · `/skill-creator`) across each phase. Closes F7.4. Validated by Trial 4b's mid-AG `/frontend-design` invocation that polished umkm-indo themes from minor variations into distinct aesthetic worlds.

### Trial validation
- 2026-05-20 umkm-indo PoV build (Trial 4b · landing-page MVP). 8 findings surfaced (2 MEDIUM closed in v2.7.0 · 2 LOW closed in v2.7.0 · 4 POSITIVE patterns promoted to references in v2.7.0). 4 ADR-002 tasks completed (1: JSON schema · 2: 3 cache blocks · 3: generateLandingLive · 4: 7 theme components · 5: preview route · 6: 30-sample golden dataset + eval-runner). Mock-mode eval produced honest signal (theme 73% exact · sections-include 0/30 · compliance 19/30) confirming the eval surface works; live baseline deferred to user consent per cost-safety contract (~Rp 30-50k spend).
- **First trial where positive-pattern promotion outnumbered friction closure** (4 promoted vs 4 closed). Trial maturity signal: the plugin is past "fix the bugs" stage into "document the working patterns" stage.

### Trial 4b produced (preserved at `D:\Project\umkm-indo\`)
- `apps/web/` — Next.js 16 + React 19 + Tailwind 4 scaffold · production build clean
- `apps/web/src/lib/ai/` — 3 cache blocks + tool_use planner + mock/live paths · server-only enforced
- `apps/web/src/components/themes/` — ThemeRoot + 7 shape-neutral section components
- `apps/web/src/app/globals.css` — dramatic per-theme overrides (Editorial Swiss · French luxury · Neo-brutalist)
- `GOLDEN-DATASET/landing-page-mvp/v1/` — 30 samples · 60/20/13/7 composition · generator script
- `apps/web/scripts/eval-landing.ts` — runner with mock + live modes · 5 metrics aggregated

### Stability
- v2.7.0 MINOR bump (additive: 1 new skill mode · 5 new reference docs · 1 template hint · 1 references-dir creation). No surface removed; no breaking change. Existing adopters unaffected; new adopters benefit from clearer integration patterns.

---

## [2.6.0] — 2026-05-20

**Trial 4 (umkm-indo TASK-101 dogfood) fixes.** First non-synthetic trial closed. Walked a real LLM-core product (Indonesian SME marketplace-to-storefront migration) through `init → discover → design → prove-prep`. Closes the **chicken-and-egg problem** in the v2.4 multi-agent kill-criteria flow and fixes a v2.3 template-update miss. Cost-kill-criterion fired at AG on the user's initial hybrid multi-agent choice — second cross-trial validation of the kill-criterion-pre-commitment discipline (Trial 3 was first). Full trial signal in [`docs/audit/trial-friction-log.md` § Trial 4](docs/audit/trial-friction-log.md).

### Changed
- **`/hypothesis-register` v1.3.0 → v1.4.0** — Step 4 multi-agent prompt now accepts three answers: `yes` (full three-class kill-criteria) · `no` (skip) · **`not sure / decide at AG`** (writes a `[DEFER-TO-AG]` placeholder block). Closes the chicken-and-egg problem F6.1 surfaced in Trial 4: multi-agent vs single-agent is an AG decision, but the v2.4 prompt forced users to commit at HG. Deferral preserves the pre-commitment discipline while letting users defer the specific class of kill-criteria to when the architecture decision actually happens. Closes TASK-602.
- **`/agent-architect` v1.3.0 → v1.4.0** — Step 6 ADR dispatch gains a multi-agent amendment trigger: when picking any multi-agent sub-variant (orchestrator-worker · peer-network · hierarchical) or hybrid, the skill checks HYPOTHESIS.md for `[DEFER-TO-AG]` placeholder and HALTS ADR write until the user runs `/hypothesis-register` in amend mode against the existing H-NNN row to add the three multi-agent kill-criteria classes. This closes the loop opened by hypothesis-register's deferral path — the kill-criteria pre-commitment still happens, just at the right gate.
- **`templates/HYPOTHESIS.md.template`** — adds the `Type` column to the summary table that v2.3 (ADR-007) introduced but missed in the template update. Adopters scaffolding new HYPOTHESIS.md files now get the 7-column format (ID · Date · Type · Pain · Hypothesis · Outcome · Status) matching the live spec. Plus a Type-values reference line and the `**Type**: agentic` field in the detail-block placeholder. Closes F6.2 (TASK-601). Surfaced during Trial 4 scaffolding of umkm-indo.

### Trial validation
- 2026-05-20 umkm-indo trial (real Indonesian SME marketplace-to-storefront migration · TASK-101 first non-synthetic dogfood) walked init → discover → design → prove-prep end-to-end. All four ADLC gates (HG · SG · AG · P3-prep) closed.
- **Cost-kill-criterion fired at AG**: user's initial hybrid multi-agent choice estimated at Rp 157k per 100-product storefront, fired H-001's Rp 150k kill ceiling. User pivoted to Plan-and-Execute (Rp 37k · ~50% headroom). No code written; no LLM tokens spent on the wrong path.
- PoV TypeScript scaffold compiles clean and runs against 4 golden-dataset samples at $0 cost (mock pipeline) — surfaced 3 latent bugs in the mock heuristics that would have been more expensive to find with live LLM.

### Trial 4 produced (preserved at `D:\Project\umkm-indo\`)
- HYPOTHESIS.md (H-001 with 7 kill-criteria) · RESPONSIBILITY-MAP.md (14 decision rows · 5 unsafe-autonomy zones)
- docs/adr/ADR-001-storefront-architecture.md (~150 lines · Plan-and-Execute decided · multi-agent + hybrid both rejected with cost reasoning)
- EVAL-SUITE/storefront-from-csv/{STRATEGY.md · PLAN.md} · COST-BUDGET.md
- GOLDEN-DATASET/storefront-from-csv/v1/ (schema + 4 representative samples)
- poc/ (TypeScript scaffold · 11 files · compiles clean · runs eval)

### Positive patterns surfaced (not friction · noted for v2.7+ formalization)
- **F6.3** Cost-kill-criterion firing at AG saved 1-2 weeks of engineering work. Second cross-trial validation of the kill-criterion discipline. Worth documenting in external-adopter recruitment materials.
- **F6.4** `AskUserQuestion` one-focused-question + multiple-choice + recommendation pattern proved excellent for HG/SG clarification (10 rounds across the trial). Worth promoting to a shared `references/clarification-flow.md` across rigid skills.
- **F6.5** Mock-first PoV scaffold pattern (deterministic mock LLM before live wire-up) caught 3 real bugs at $0 cost. Worth documenting as a P3 best practice in `/golden-dataset` or `/adlc-orchestrator`.

### Stability
- v2.6.0 MINOR bump (additive: hypothesis-register accepts new "defer" answer · agent-architect adds new HALT condition · template adds missing column). Single-agent users unaffected; multi-agent users gain a cleaner workflow without breaking changes to existing v2.4/v2.5 multi-agent grids.

---

## [2.5.0] — 2026-05-20

**Multi-agent refinements** — closes the four Trial 3 LOW findings that were deferred from v2.4 (F5.5 · F5.6 · F5.8 · F5.9). These were marked LOW because the v2.4 MEDIUM fixes already made multi-agent topology a first-class shape; this round adds the polish that turns the multi-agent path from "works" into "auditable end-to-end." Resolves the "Open issues (deferred)" block from [ADR-008](docs/adr/ADR-008-multi-agent-template-adjustments.md).

### Changed
- **`/pov-gate` v1.1.0 → v1.2.0** — Step 8 verdict template now requires structured per-finding mitigation when verdict is `GO_WITH_CONCERNS` or `NO_GO`. Each finding emits three lines (finding · proposed fix · re-eval acceptance criterion); vague plans are rejected. Verdict template also emits a "Headroom callout" for any metric within 10% of its kill threshold — the Trial 3 verdict had cost at 7% headroom and hallucination at 6% headroom, both buried in the metric table. The callout surfaces them above the recommendation line where on-call eyes actually land. Closes F5.5 (TASK-501) + F5.6 (TASK-502).
- **`/agent-architect` v1.2.0 → v1.3.0** — Pattern Choices section now distinguishes the three multi-agent sub-variants: orchestrator-worker (Trial 3's actual shape) · peer-network · hierarchical/supervisor. Each row carries its fit conditions + coordination cost. ADR MUST name the sub-variant chosen, not just "multi-agent." Closes F5.8 (TASK-503).
- **`templates/RESPONSIBILITY-MAP.md.template`** — Kill-switch section adds a `Per-agent (multi-agent only)` row: operator disables any single agent within <30s; disabled traffic falls back to human queue or peer agent. Promotes Trial 3's ad-hoc pattern to canonical template. Closes F5.9 (TASK-504).

### Affected surface
- 3 skill files (pov-gate 1.2.0 · agent-architect 1.3.0) + 1 template (RESPONSIBILITY-MAP)
- 0 ADRs (ADR-008's deferred-items block is now closed without needing ADR-009 — these are skill-quality refinements, not architectural reversals)
- pov-gate now 89/100 lines · agent-architect now 74/100 lines · both well under cap

### Bundled with v2.5.0 — docs + tooling polish round (TASK-202/203/204/205)

Between the v2.4 ship and the v2.5 multi-agent refinements, the four P1 polish tasks shipped together:

**Docs (TASK-204)**
- **README "Graphify install" section** — replaces stale `pip install graphifyy` hint with verified `uv tool install "graphifyy[mcp]"` recipe; adds backend-choice table (Anthropic / Gemini / Ollama) with corresponding API-key env vars + `--with anthropic` Windows uv-tool gotcha; distinguishes full-cost `extract` from $0 `update`/`cluster-only`; honest per-query reduction table (3–5× small markdown / 50–100× large mixed) replacing the unqualified upstream 71.5× marketing figure.
- **README Status section** — bumped stale v2.1.0 line to v2.5.0; updated roadmap.
- Validated end-to-end against live `graphify-out/graph.json` for adlc-flow itself: 194 nodes · 316 edges · 16 communities · `graphify query`/`explain`/`path` all return expected results.

**Tooling (TASK-202 + TASK-203 + TASK-205)**
- **`scripts/eval-acceptance.js`** (TASK-202) — behavioral skill-triggering harness. Mirrors dev-flow's `eval-acceptance.js` with one safety inversion: DRY RUN is the default ($0); `--live` opts into spawning the `claude` CLI for real verification. For each `tests/skill-triggering/prompts/<skill>.txt`, runs 3× and checks stream-json for `"name":"Skill"` AND `"skill":"<expected>"`; ≥2/3 quorum = pass. 8 initial prompts cover `prime` · `adlc-orchestrator` · `hypothesis-register` · `agent-architect` · `responsibility-map` · `pov-gate` · `adr-writer` · `zoom-out`.
- **`scripts/audit-baseline.js`** (TASK-203) — Node port of dev-flow's repo-metrics snapshot. Writes `docs/audit/baseline-metrics.{md,json}`. Extends dev-flow's version with skill type (rigid/flexible) breakdown + version column + ADR/template tables. Exits 1 on cap violations for CI use.
- **`scripts/session-start.js`** (TASK-205) — opt-in auto-update for stale graphify graphs via `ADLC_GRAPHIFY_AUTO_UPDATE=1`. Runs `graphify update .` (AST-only, no LLM cost) when graph >`ADLC_GRAPHIFY_STALE_DAYS` (default 7). Explicitly does NOT auto-run the full-cost `graphify extract`.
- **`.gitignore` cleanup**: prior blanket `docs/audit/*` ignore would have excluded `trial-friction-log.md` (canonical source of truth) from the first commit. Now ignores only regenerable outputs; keeps trial logs + curated audits tracked. Added `graphify-out/` + `tests/skill-triggering/logs/`.

### Stability
- v2.5.0 MINOR bump (additive: verdict template now stricter, but mitigation plans were already implicit; sub-variant rows extend the table without removing the parent row; per-agent kill-switch is opt-in based on grid shape; docs/tooling changes are pure additions). No surface removed; no breaking change to single-agent users.

---

## [2.4.0] — 2026-05-20

**Trial 3 — Multi-agent template + kill-criteria adjustments.** Closes the multi-agent topology gap surfaced by the customer-support escalation dogfood (`docs/audit/trial-friction-log.md` § Trial 3). Per [ADR-008](docs/adr/ADR-008-multi-agent-template-adjustments.md), multi-agent topology is now a first-class shape across four canonical surfaces (`agent-architect`, `eval-suite-planner`, `hypothesis-register`, RESPONSIBILITY-MAP template).

Trial 3 was the first dogfood to fire a kill-criterion path: inter-agent injection-resistance measured 88% vs. 90% fail-threshold, producing a `NO_GO` verdict. v2.2's verdict persistence + sample-count enforcement + v2.3's traditional/agentic split all worked end-to-end. The five MEDIUM findings below were latent in v2.3 surfaces that worked for single-agent but produced friction at ≥2 agents.

### Added
- **ADR-008** `docs/adr/ADR-008-multi-agent-template-adjustments.md` — anchors the five-surface multi-agent fix cluster. Single root cause (single-agent-shaped templates), five surfaces (architecture choice · eval planning · responsibility-map shape · hypothesis kill-criteria · cross-agent context-handoff).
- **Cross-agent context-handoff policy section** in `templates/RESPONSIBILITY-MAP.md.template` — required when grid has ≥2 distinct `Who` agents. Declares envelope format (structured JSON only), pre-filter at boundary (regex strip of injection patterns), role-stability prompt, audit-log hook. Direct mitigation for the attack class that fired Trial 3's kill-criterion. Closes F5.7.
- **`Chain` column + named-agent rows** in `templates/RESPONSIBILITY-MAP.md.template` — multi-agent grids gain sequence numbers (`1 → 2 → 3 …`) and specific agent names (`classifier-agent` not generic `agent`). Peer-network uses `1a · 1b · 1c`; hierarchical uses `1.1 · 1.2`. Single-agent grids omit the column. Closes F5.3.
- **Optional per-agent eval subfiles** at `EVAL-SUITE/<feature>/per-agent/<agent>.md` — `/eval-suite-planner` PLAN.md MAY split per-agent metrics into subfiles when agent count ≥3. Below 3 agents, inline tables stay readable. Closes F5.2.

### Changed
- **`/agent-architect` v1.1.0 → v1.2.0** — Step 3 tie-break rule when Q3 = yes (≥2 domains) AND Q1 median trajectory <5 steps: route to multi-agent only if specialist domain knowledge is non-overlapping; otherwise hybrid ReAct-with-per-domain-tool-subsets. Closes F5.1.
- **`/eval-suite-planner` v1.1.0 → v1.2.0** — new section 1a "Per-agent eval subfiles" describes when (≥3 agents) and what (agent-specific metrics + thresholds + cost ceiling) goes in per-agent subfiles vs. what stays in PLAN.md (cross-surface concerns). Closes F5.2.
- **`/hypothesis-register` v1.2.0 → v1.3.0** — Step 4 explicitly asks "is this multi-agent?" for `--type=agentic` and, if yes, requires at least one kill-criterion from each of three classes: inter-agent injection-resistance · role-confusion attack rate · authority-escalation success rate. Trial 3 surfaced the first kill-criterion to fire on data; this prompt ensures the full multi-agent attack family is pre-committed at HG, not just the most-feared subset. Closes F5.4.

### Trial validation
- 2026-05-20 customer-support escalation trial (`D:\Project\adlc-flow-trial-3-multiagent\`) — orchestrator-worker pattern (classifier + 3 specialists + coordinator). Walked discover → design → prove → validate end-to-end. VG verdict: **NO_GO** (inter-agent injection-resistance 88% triggered kill-criterion). First trial to fire the kill-criterion path.
- 10 findings (5 MEDIUM closed in v2.4 · 4 LOW deferred to v2.5+ · 1 validation). Diminishing returns curve confirmed: Trial 1 surfaced 5 MEDIUM, Trial 2 surfaced 13 findings (3 HIGH + 5 MEDIUM + 5 LOW), Trial 3 surfaced 4 MEDIUM (plus the new one F5.7) — synthetic-trial methodology near exhausted. Next signal: external adopter (TASK-101).
- v2.2 verdict persistence + sample-count enforcement validated end-to-end against a real `NO_GO` verdict for the first time.

### Trial 3 produced (preserved at)
- `D:\Project\adlc-flow-trial-3-multiagent\` — HYPOTHESIS.md (H-001 multi-agent, NO_GO) · RESPONSIBILITY-MAP.md (10 chained-authority decision rows) · ADR-001-multiagent-pattern.md · EVAL-SUITE/escalation/{STRATEGY,BASELINE,VG-VERDICTS}.md · GOLDEN-DATASET/escalation/v1/{README,schema.json}.

### Deferred to v2.5+ (Trial 3 LOW findings)
- F5.5 — `/pov-gate` mitigation-plan structure in NO_GO/GO_WITH_CONCERNS verdict template (TASK-501)
- F5.6 — `/pov-gate` headroom callout when any metric within 10% of kill threshold (TASK-502)
- F5.8 — `/agent-architect` multi-agent sub-variants (orchestrator-worker · peer-network · hierarchical) (TASK-503)
- F5.9 — RESPONSIBILITY-MAP per-agent kill-switch as canonical template pattern (TASK-504)

### Stability
- v2.4.0 MINOR bump (additive: one new ADR · one optional eval subfile pattern · one new template section · three skill prompts extended along multi-agent axis). No surface removed; no breaking change to single-agent users.

---

## [2.3.0] — 2026-05-20

**Trial 2 — Traditional-adopter fixes.** Closes the structural framing gap surfaced by the Naraly landing-page dogfood (`docs/audit/trial-friction-log.md` § Trial 2). Per [ADR-007](docs/adr/ADR-007-traditional-adopter-support.md), adlc-flow now serves traditional dev + agentic dev with one orchestrator, supports existing-project adoption, and allows parallel tracks when file-disjoint.

### Added
- **`traditional` mode in `adlc-orchestrator`** — non-agentic work (landing pages · APIs · ops tooling · refactors) gets a dedicated mode with no ADLC gates. Dispatches universal skills (`/lean-doc-generator`, `/adr-writer`, `/tdd`, `/pr-reviewer`, `/refactor-advisor`, `/diagnose`, `/release-patch`, `/release-manager`). Closes F4.1.
- **`/hypothesis-register --type=` flag** — accepts `agentic` (default · 8-step full procedure) · `conversion` · `latency` · `reliability` · `other` (5-step lighter procedure). Marketing/SLO/reliability hypotheses now have a proper home with kill-criteria pre-commitment. HYPOTHESIS.md gains a `Type` column. Closes F4.6.
- **ADR-007** `docs/adr/ADR-007-traditional-adopter-support.md` — documents the existing-project + multi-track + traditional-dev support cluster decision.

### Changed
- **`adlc-orchestrator` v1.0.0 → v1.1.0** — description names both audiences (agentic + traditional); Mode Dispatch table adds `traditional` row; `init` phase rewritten to handle existing-project gracefully (scaffold missing; skip existing; warn on competing conventions); new `### traditional` phase block; freeform dispatch updated. Closes F4.1 + F4.2.
- **`SPRINT_PROTOCOLS.md`** — new "Parallel Tracks" section permits concurrent active sprints when `files_affected ∩ ∅` (mirrors orchestrator `sprint-bulk` overlap gate). Anti-pattern of "Concurrent Active Sprints touching the SAME files" persists. Closes F4.3.
- **`/adr-writer` v1.0.0 → v1.1.0** — auto-detects existing ADR convention: `docs/adr/` (modern; preferred) vs `docs/DECISIONS.md` (legacy). Warns + defaults to modern when both present. Procedure.md updated with 7 explicit steps including legacy-mode append protocol. Closes F4.4.
- **`/hypothesis-register` v1.1.0 → v1.2.0** — `--type` flag support; description no longer excludes traditional work; non-agentic variants skip workflow-step mapping and use type-specific hypothesis templates. Closes F4.6.

### Trial validation
- 2026-05-20 Naraly landing trial (existing mature pnpm-turborepo monorepo · traditional dev · parallel-track) surfaced 13 findings (3 HIGH · 5 MEDIUM · 5 LOW). Trial 1 (greenfield agentic) missed all of these.
- 5 closed in v2.3 (3 HIGH + F4.4 + F4.6). 8 remaining in v2.4+ backlog (F4.5 sprint-shape · F4.7 design-token canonical · F4.8 server-action template · F4.9 i18n-plan · F4.10 deploy-plan · F4.11 scenario→skill cheatsheet · F4.12 design-tokens guidance · F4.13 orchestrator description polish).

### Trial 2 produced (preserved at)
- `D:\Project\naraly\apps\landing\` — 18 files (Next.js 15 + bilingual + Supabase waitlist)
- `D:\Project\naraly\docs\sprint\SPRINT-LANDING-V1.md` + `docs/adr/ADR-001-landing-app.md`

### Stability
- v2.3.0 MINOR bump (additive: new mode + new type flag + protocol amendment). No published adopters to break.

---

## [2.2.0] — 2026-05-20

**Trial-driven fixes.** Resolves 5 MEDIUM + 2 LOW friction findings surfaced by the 2026-05-19 ticket-triage dogfood trial (`docs/audit/trial-friction-log.md`). Per [ADR-006](docs/adr/ADR-006-eval-artifact-standardization.md), standardizes EVAL artifact location + division of labor between `agent-architect` and `eval-suite-planner`.

### Added
- **`templates/CLAUDE.md.template`** — adopter-project CLAUDE.md scaffold. `bin/adlc-flow-init.js` writes it to `.claude/CLAUDE.md` so SessionStart hook doesn't fail Day 1. (Closes F0.2)
- **`templates/BASELINE.md.template`** — golden-dataset BASELINE.md scaffold; `/golden-dataset` step 7 reads it. (Closes F3.3)
- **ADR-006** `docs/adr/ADR-006-eval-artifact-standardization.md` — single ADR documents (a) artifact locations, (b) division of labor, (c) verdict persistence, (d) sample-count floor.

### Changed
- **EVAL artifact paths standardized** to `EVAL-SUITE/<feature>/{STRATEGY,PLAN,BASELINE,VG-VERDICTS}.md`. Old flat-file paths (`EVAL-STRATEGY-<f>.md`, `EVAL-SUITE-<f>.md`) and golden-dataset-nested BASELINE retired. (Closes F2.1)
- **`/agent-architect` v0.1.0 → v1.1.0** — step 4 produces ONLY methodology + thresholds (AG commitments); dataset/cadence/cost/regression deferred to `/eval-suite-planner`. Step 7 writes `EVAL-SUITE/<feature>/STRATEGY.md`. (Closes F2.2)
- **`/eval-suite-planner` v0.1.0 → v1.1.0** — sections renumbered (1-6 from 1-7); no longer re-states methodology/thresholds (cross-references STRATEGY.md). Writes `EVAL-SUITE/<feature>/PLAN.md`. (Closes F2.2)
- **`/golden-dataset` v0.1.0 → v1.1.0** — BASELINE.md moved out of `GOLDEN-DATASET/<f>/v1/` to `EVAL-SUITE/<f>/BASELINE.md`. Cross-platform `current` txt file replaces symlink. Step 7 scaffolds from BASELINE.md.template. (Closes F2.1, F3.2, F3.3)
- **`/pov-gate` v0.1.0 → v1.1.0** — step 1 enforces sample-count floor against `PLAN.md § 2` (halts with `INSUFFICIENT_SAMPLES` if dataset short). Step 8 persists verdict to `EVAL-SUITE/<f>/VG-VERDICTS.md` (append-only). Step 9 writes one-liner to HYPOTHESIS.md row instead of full block. (Closes F3.1, F3.4)
- **`/hypothesis-register` v0.1.0 → v1.1.0** — step 3 allows structured-form hypothesis alternative to one-line template; step 8 writes BOTH summary table row + per-ID detail block per restructured `templates/HYPOTHESIS.md.template`. (Closes F1.1, F1.2)
- **`templates/HYPOTHESIS.md.template`** restructured to two-tier format (summary table + per-ID detail blocks). (Closes F1.1)
- **`templates/RESPONSIBILITY-MAP.md.template`** — placeholder now shows 4 example decision-point rows (was 1); adds `### Open questions (defer to AG)` section. (Closes F1.3, F1.4)
- **`bin/adlc-flow-init.js`** — FILES list adds CLAUDE.md.template entry (scaffolds to `.claude/CLAUDE.md`). "Next steps" message expanded with 3 ordered steps including graphify install hint.

### Trial validation
- 2026-05-19 trial walked init → discover → design → prove with a ticket-triage agent against `D:\Project\adlc-flow-trial`. No blockers. All 6 produced artifacts (HYPOTHESIS · RESPONSIBILITY-MAP · ADR · STRATEGY · PLAN · GOLDEN-DATASET + BASELINE) work end-to-end. Full report: `docs/audit/trial-friction-log.md`.
- 11 LOW findings deferred to v2.3+ (mostly doc wording + optional flags).

### Migration (zero-impact for v2.1 adopters — none published)
- Pre-v2.2 adopters with `EVAL-STRATEGY-<f>.md` or `EVAL-SUITE-<f>.md` at root: move to `EVAL-SUITE/<feature>/STRATEGY.md` and `.../PLAN.md` respectively.
- Pre-v2.2 BASELINE.md inside GOLDEN-DATASET/<f>/v1/: move to `EVAL-SUITE/<feature>/BASELINE.md`.
- Pre-v2.2 `current` symlink: replace with `current` txt file containing version string.

### Stability
- v2.2.0 MINOR bump (additive templates + path standardization with no published adopters to break). v1.0+ stability contract scope expands to 28 skills + 11 agents + 4 templates including the 2 new ones.

---

## [2.1.0] — 2026-05-19

**Graphify integration.** Retires placeholder `codemap-refresh` in favor of [graphify](https://graphify.net) (MIT, 49k★) as the canonical knowledge-graph backend. Per [ADR-005](docs/adr/ADR-005-graphify-adoption.md), knowledge-heavy skills hard-depend on graphify; bootstrap skill `/prime` stays soft-dep.

### Added
- **`graph-query` skill** — natural-language query interface against graphify's `graph.json` + `GRAPH_REPORT.md`; prefers graphify MCP stdio server when configured.
- **ADR-005** `docs/adr/ADR-005-graphify-adoption.md` — adoption rationale + tradeoffs.

### Changed
- **`zoom-out` v1.0.0 → v2.0.0** — now queries graphify `graph.json` for module map (modules · connections · entry points · seams · load-next). HARD dep: halts with install message if `graphify-out/graph.json` is missing.
- **`context-engineer` v1.0.0 → v2.0.0** — queries graphify graph (and optional MCP) to trace context-assembly code path; cites graph nodes for every finding. HARD dep on graphify.
- **`prime` v1.0.0 → v1.1.0** — adds optional `graphify-out/GRAPH_REPORT.md` read step. Soft dep: `[OK]` / `[MISSING]` reporting; session bootstrap still works without graphify.
- **`scripts/session-start.js`** — reports graphify presence + graph age; warns when graph is stale (>7d).
- **CLAUDE.md** — stack line adds Python ≥3.10 as soft dep (hard for /zoom-out · /context-engineer · /graph-query).
- **CONTEXT.md** — adds "Knowledge-graph backend" section; skill roster reflects retirement of codemap-refresh + addition of graph-query.

### Retired
- **`codemap-refresh` skill** — `skills/codemap-refresh/SKILL.md` deleted. Replaced by graphify integration.
- **`scripts/codemap-refresh.js`** — Node script deleted. Graphify produces a superior multi-modal graph with 71.5× token reduction on queries (per graphify's published benchmark).

### Migration
- Adopters who used `/codemap-refresh`: install graphify (`pip install graphifyy && graphify install && graphify .`); use `/zoom-out` or `/graph-query` instead. Output format is different (richer; full graph) but use-cases all map cleanly.
- Adopters who only used `/prime`, `/pr-reviewer`, `/tdd`, etc. (no knowledge-graph skills): no migration needed; graphify is optional for your usage.

### Stability
- v2.1.0 MINOR bump (additive: new skill; one retirement of pre-adoption skill). Stability contract from v1.0.0 expands to cover graph-query.

---

## [2.0.0] — 2026-05-19

**Great Consolidation.** adlc-flow absorbs dev-flow universals into a single unified plugin. Per [ADR-004](docs/adr/ADR-004-absorb-dev-flow.md), the sister-plugin design from v1.0.0 (ADR-001) is retired the same day it shipped — most projects are hybrid (agentic features inside traditional apps), so two plugins for one repo was the wrong architecture. ADR-001 is now Superseded.

### Added (14 skills absorbed from dev-flow)
- `/prime` — Deterministic context load on session start (CLAUDE / CONTEXT / MEMORY / sprint / canonical artifacts).
- `/zoom-out` — Read-only module map before cross-cutting change.
- `/pr-reviewer` — 7-lens code review (Stage 1 spec compliance → Stage 2 architecture/SOLID/DDD/security/tests/docs).
- `/security-auditor` — OWASP Top 10 audit; invoked by `security-analyst` agent in separate `/security-review` session.
- `/refactor-advisor` — Code-smell sweep + 5 analysis lenses + deep-module candidates.
- `/diagnose` — 6-phase systematic debugging (feedback loop → reproduce → hypothesize → instrument → fix+regression → post-mortem).
- `/tdd` — Tracer-bullet → red-green-refactor for deterministic code (tool wrappers, business logic, API surfaces).
- `/test-planner` — Group test planning (unit / integration / e2e / regression) BEFORE writing.
- `/lean-doc-generator` — Doc discipline + sprint promote/execute/close protocols.
- `/adr-writer` — Hard-to-reverse decision records (one file per ADR in `docs/adr/`).
- `/release-manager` — MINOR/MAJOR semver + CHANGELOG.
- `/release-patch` — PATCH bump with multi-manifest auto-detection (plugin · npm · python · cargo · go · flat).
- `/codemap-refresh` — Regen `docs/codemap/CODEMAP.md` + `handoff.json` (Node port, cross-platform).
- `/write-a-skill` — Meta-skill for authoring new adlc-flow skills.

### Added (6 specialist agents absorbed from dev-flow)
- `design-analyst` — Code-side architecture + 5 review lenses; supports `--grill`.
- `code-reviewer` — Post-implementation review wrapper (preloads pr-reviewer).
- `scope-analyst` — Blast-radius assessment when feature spans modules.
- `security-analyst` — Separate `/security-review` session.
- `performance-analyst` — Hot-path / DB / API risk assessment.
- `migration-analyst` — DB schema change safety + rollback feasibility.

### Changed
- **PowerShell hook scripts ported to Node.** `scripts/session-start.js` + `scripts/artifact-integrity.js` replace the v1.0.0 PowerShell originals. Cross-platform parity (Linux/macOS no longer second-class). `hooks/hooks.json` updated.
- **Cross-plugin namespace dropped.** All `dev-flow:<skill>` references in adlc-flow rewrite to local `/<skill>`. Same skill names, same procedures.
- `adlc-orchestrator` v0.2.0 → v1.0.0 — updated to dispatch local skills/agents (no more `dev-flow:` prefix); validate phase now includes security/performance/migration analyst dispatch.
- `agent-architect` frontmatter — `spawns: dev-flow:adr-writer` → `spawns: adr-writer`.
- README, CONTEXT.md, USER-OUTCOMES.md — fully refreshed for unified plugin (28 skills · 11 agents · 6 hooks/scripts).

### Skipped (no port)
- `dev-flow:orchestrator` — true duplicate of `adlc-orchestrator`. Replaced.
- `dev-flow:task-decomposer` — overlap with `hypothesis-register` for agentic features; for code-side tasks, write TODO entries directly. Avoids three-skill ambiguity.

### Superseded
- [ADR-001](docs/adr/ADR-001-sister-plugin-relationship.md) — sister-plugin design retired. See [ADR-004](docs/adr/ADR-004-absorb-dev-flow.md).

### dev-flow status
- Frozen at v4.x. CHANGELOG receives a DEPRECATED notice pointing here. Existing adopters keep working indefinitely; migrate at their own pace via simple find/replace (drop `dev-flow:` prefix).

### v1.0 stability contract — adjusted
- v1.0 (this morning) declared "stability contract begins" for adlc-flow's 14 skills + 5 agents. v2.0 expands scope to 28 skills + 11 agents. Stability contract now covers the full unified surface.

---

## [1.0.0] — 2026-05-19

**Feature-complete v1.0.** First stable release. Surface-level vocabulary, gates, modes, skill names, and agent names are now committed; breaking changes require a major bump.

### Added
- **LICENSE** — MIT.
- **.gitignore** — local-machine state + adopter-artifact pattern (the canonical artifact files live in the *adopter* repo, not in this plugin repo).
- **CONTEXT.md skill + agent roster** updated to full v1.0 listing (no more "v0.2 planned" markers).
- **USER-OUTCOMES.md** updated with full A1-A8 coverage across all 14 skills · 5 agents · 6 gates · 2 hooks · 2 scripts. Every component has a non-tautological skip-when.
- **README.md** updated for v1.0 framing — full skill table, agent table, hook list, init quick-start, sister-plugin co-install pattern.

### Stability contract begins
- Skill names locked: 14 skills as listed in `docs/USER-OUTCOMES.md § Skills`.
- Agent names locked: 5 specialists as listed.
- Gate codes locked: HG/SG/AG/VG/RG/MG per ADR-003.
- Mode names locked: init / discover / design / prove / build / validate / activate / operate.
- ADR registry: ADR-001 (sister-plugin) · ADR-002 (ADLC-source) · ADR-003 (gate-naming).

### Plugin tally
- 14 skills shipped
- 5 specialist agents shipped
- 2 hooks active (SessionStart + PostToolUse artifact-integrity)
- 6 canonical artifact templates
- 3 foundational ADRs
- 1 vendored source extract
- 2 Node scripts (init + eval-skills)
- 2 PowerShell scripts (session-start + artifact-integrity)

### Not yet shipped (v1.1+ roadmap)
- External adopter dogfood (the v1.0 contract assumes internal consistency; live validation lands in v1.1).
- Marketplace publish (GitHub repo public + marketplace.json validated by Claude Code marketplace).
- Codemap integration (3-tier `docs/codemap/` mirroring dev-flow ADR-016 — deferred; v1.1).
- Hooks portability test on macOS/Linux (current PS scripts are Windows-tested; bash equivalents needed for cross-platform).
- Acceptance harness (behavioral skill-triggering eval; structural eval already shipped).

---

## [0.5.0] — 2026-05-19

**Cost economics + hooks.** Skills + agents now feature-complete (14 skills, 5 specialist agents). Hooks bootstrap matches dev-flow pattern.

### Added
- **`cost-budget` skill** — cross-phase token-economics planner. 5 sections (per-call ceiling · aggregate budgets · cost drivers · optimization levers · alert routing). Hard-enforces three-level threshold separation (alert / outlier / hard-cap).
- **`cost-analyst` agent** — independent cost-model review; surfaces optimization levers with bounded savings estimates.
- **`hooks/hooks.json`** — 2 hooks:
  - SessionStart (PowerShell) — verifies CLAUDE.md (fail if missing) + scans for canonical artifacts (warn if missing).
  - PostToolUse Edit/Write — artifact-integrity check on canonical files (HYPOTHESIS, RESPONSIBILITY-MAP, FEEDBACK-LOG, MODEL-UPGRADE-LOG, OBSERVABILITY, COST-BUDGET) — warns if `last_updated` frontmatter isn't current.
- **`scripts/session-start.ps1`** — adlc-flow session-start handler (mirrors dev-flow pattern; warns on missing artifacts).
- **`scripts/artifact-integrity.ps1`** — frontmatter-freshness check on canonical artifacts.
- **`templates/COST-BUDGET.md.template`** — adopter-project scaffold; init script updated to include it.

### Plugin status
- 14 of 14 planned skills shipped.
- 5 of 5 planned specialist agents shipped.
- 2 of 2 planned hooks active.
- 6 canonical artifact templates scaffolded by init.
- All lifecycle phases (P0–P7) have skill + agent coverage.

### Next
- Sprint 006 — v1.0 polish (LICENSE, .gitignore, README pass for v1.0 framing, CHANGELOG + TODO consolidation, structural validation).

---

## [0.4.0] — 2026-05-19

**P6/P7 surface complete.** Adds canary-plan, ai-observe, model-upgrade, drift-audit skills + red-team-analyst, drift-analyst agents. Lifecycle now covered end-to-end (discover → operate).

### Added
- **`canary-plan` skill** — P6 controlled-rollout designer. 6 plan sections (cohort · ramp · success · abort triggers · rollback · communication). Hard-stops if abort triggers / rollback not wired before launch.
- **`ai-observe` skill** — P6/P7 observability schema generator. Updates OBSERVABILITY.md with behavioral + operational metrics, drift signals, alert routing, rollback hooks. Emits schema only — adopter owns telemetry implementation.
- **`model-upgrade` skill** — P7 MG gate runner. Full regression suite + cost-delta + behavioral-sampling + verdict (ADOPT/DEFER/REJECT). Updates MODEL-UPGRADE-LOG.md.
- **`drift-audit` skill** — P7 periodic behavior-alignment audit across 5 drift types (input · RAG · judge · behavioral · threshold). Outputs `DRIFT-AUDIT-<date>.md`. Default quarterly.
- **`red-team-analyst` agent** — RG-gate adversarial review (prompt injection · goal hijacking · sensitive-data extraction · tool-call manipulation · role-boundary attacks · refusal-bypass). Read-only PoC reproduction.
- **`drift-analyst` agent** — root-cause analysis of suspected drift; ranks candidates by evidence strength.

### Notes
- 4 of 5 planned specialist agents shipped (cost-analyst lands in v0.5).
- 12 of 14 planned skills shipped (cost-budget lands in v0.5).
- Lifecycle is now end-to-end traversable from `/adlc-orchestrator init` through `operate`.

---

## [0.3.0] — 2026-05-19

**P4/P5 surface + first specialist agents.** Adds context-engineer, release-readiness skills + eval-analyst, prompt-reviewer agents.

### Added
- **`context-engineer` skill** — P4 review of memory, conversation history, RAG retrieval shape, dynamic assembly, prompt-injection surfaces. Outputs `CONTEXT-REVIEW-<feature>.md` with severity-ordered recommendations.
- **`release-readiness` skill** — RG-gate sign-off document generator. 8 required sections (eval-suite results · UAT · bias/fairness · red-team · performance · compliance · rollback · sign-offs). Hard-stops on FAIL/CRITICAL.
- **`eval-analyst` agent** — read-only review at AG/VG of methodology, thresholds, golden-dataset adequacy, regression contract, cost realism.
- **`prompt-reviewer` agent** — read-only review of prompts-as-artifacts (clarity · injection-resistance · drift-risk · role-boundary discipline · few-shot audit).

### Notes
- Agents directory bootstrapped; `agents/` now populated with 2 of 5 planned specialists.
- `adlc-orchestrator` phase narrative continues to reference v0.3+ skills as live.

---

## [0.2.0] — 2026-05-19

**P0/P1 surface expansion.** Adds responsibility-map, eval-suite-planner, golden-dataset skills + init-mode scaffolding script + structural eval harness.

### Added
- **`responsibility-map` skill** — SG-gate artifact builder; human–agent decision/approval grid per feature (ADLC P1's "no SDLC equivalent" deliverable).
- **`eval-suite-planner` skill** — expands `agent-architect`'s strategy outline into runnable eval-suite plan (methodology mix · golden-dataset shape · threshold registry · run cadence · cost budget · regression contract).
- **`golden-dataset` skill** — versioned ground-truth corpus builder under `GOLDEN-DATASET/<feature>/v<N>/`. Enforces composition minimums (≥30/category, ≥10% adversarial, ≥15% imperfect inputs).
- **`bin/adlc-flow-init.js`** — adopter-project scaffold script. Scaffolds 5 artifact files + 3 empty dirs. Idempotent.
- **`scripts/eval-skills.js`** — structural eval harness for SKILL.md + agent files (frontmatter · line caps · description rules · red-flags section). Mirrors dev-flow pattern.
- **5 artifact templates** in `templates/` — HYPOTHESIS, RESPONSIBILITY-MAP, FEEDBACK-LOG, MODEL-UPGRADE-LOG, OBSERVABILITY.
- **`init` mode** in `adlc-orchestrator` — runs the bin script + confirms scaffold; mirror of dev-flow's init pattern.

### Changed
- `adlc-orchestrator` v0.1.0 → v0.2.0 — added `init` mode + restructured cross-plugin dispatch to fit line cap; phases reference v0.2 skills as live (no longer "v0.2 planned").

---

## [0.1.0] — 2026-05-19

**Initial bootstrap.** Sister-plugin to `dev-flow`; phase-gated scaffold for teams building agentic products. Implements EPAM's Agentic Development Lifecycle (ADLC).

### Added
- **Plugin manifests** — `.claude-plugin/plugin.json` + `marketplace.json` (v0.1.0).
- **Project context files** — `.claude/CLAUDE.md` (project overview · anti-patterns · DoD) + `.claude/CONTEXT.md` (vocab · 7 modes · 6 gates · 8 outcomes · principles).
- **User-Project Outcomes registry** — `docs/USER-OUTCOMES.md` with A1-A8 outcomes (`hypothesis-quality` · `architecture-clarity` · `eval-coverage` · `cost-discipline` · `drift-detection` · `responsibility-clarity` · `release-confidence` · `operational-loop`) and explicit anti-outcomes.
- **3 foundational ADRs**:
  - ADR-001 sister-plugin relationship with dev-flow
  - ADR-002 EPAM ADLC article as authoritative source framework
  - ADR-003 gate naming (HG/SG/AG/VG/RG/MG) rationale
- **Vendored ADLC source extract** — `docs/research/ADLC-source.md` (~800-word faithful paraphrase with attribution, survives URL rot).
- **4 v0.1 skills**:
  - `adlc-orchestrator` — phase-aware dispatcher
  - `hypothesis-register` — P0 hypothesis + kill-criteria artifact (HG gate)
  - `agent-architect` — P2 ReAct/Plan-Execute/multi-agent decision + ADR (AG gate)
  - `pov-gate` — P3 golden-dataset PoV go/no-go (VG gate)
- **README** — outcome-first framing + co-install pattern with dev-flow.

### Design decisions
- 7 modes (P0+P1 merged into `discover`) instead of EPAM's 8 phases — see ADLC-source.md adapter notes.
- ADLC-native 2-letter gate codes (not dev-flow's G1/G2) to avoid namespace collision when co-installed.
- Selective skill reuse from dev-flow via `dev-flow:` prefix; no forking of universal skills (adr-writer, lean-doc-generator, pr-reviewer, etc.).
- Anti-outcome boundary from dev-flow explicitly retired here — adlc-flow plans evals, scaffolds golden datasets, emits observability schemas. See ADR-001.

### Not yet shipped (v0.2+ roadmap)
- 10 additional skills: `responsibility-map`, `eval-suite-planner`, `golden-dataset`, `context-engineer`, `release-readiness`, `canary-plan`, `ai-observe`, `model-upgrade`, `drift-audit`, `cost-budget`.
- 5 specialist agents: `eval-analyst`, `prompt-reviewer`, `red-team-analyst`, `cost-analyst`, `drift-analyst`.
- Hooks (session-start banner adapted for adlc-flow; PostToolUse artifacts integrity check).
- Marketplace publishing.
- Acceptance harness / structural eval (mirrors dev-flow's `scripts/eval-skills.js` pattern).

---

[0.1.0]: https://github.com/aldianriski/adlc-flow/releases/tag/v0.1.0
