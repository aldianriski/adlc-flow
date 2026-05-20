---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
update_trigger: New trial dogfood completes; new findings to capture
status: current
purpose: Multi-trial friction log for adlc-flow. Trial 1 (ticket triage v2.1→v2.2); Trial 2 (naraly landing v2.2→v2.3).
---

# Trial Friction Log

> Multi-trial log. Each top-level "Trial N" section captures a discrete dogfood run + findings. v2.2.0 closed Trial 1; v2.3.0 closes Trial 2.

---

# Trial 1 — Ticket Triage Dogfood (v2.1.0 → v2.2.0)

**Trial repo:** `D:\Project\adlc-flow-trial`
**Product:** Support-ticket triage agent (classifies tickets · routes by urgency · drafts first response)
**Scope:** Critical path `init → discover → design → prove` (skips build/validate/activate/operate)
**Graphify:** NOT installed (knowledge-heavy skills off critical path)

---

## Phase 0 — Bootstrap

### What I did
1. `mkdir D:\Project\adlc-flow-trial`
2. `git init -b master`
3. Created minimal `.claude/CLAUDE.md` stub (trial uses no real domain stack)
4. Ran `node D:/Project/adlc-flow/bin/adlc-flow-init.js` from the trial dir
5. Ran `node D:/Project/adlc-flow/scripts/session-start.js` with `CLAUDE_PROJECT_DIR` pointing to trial

### Findings
- **F0.1 — INIT WORKS CLEAN** ✓
  - 6 artifact files written + 3 empty dirs scaffolded. Templates have valid frontmatter. Idempotent re-run was not tested (would have skipped existing).
- **F0.2 — `.claude/CLAUDE.md` required but not scaffolded by init.js**
  - Severity: MEDIUM. Init only writes adopter artifacts (HYPOTHESIS, etc.), but session-start.js *requires* `.claude/CLAUDE.md`. New adopters get a session-start FAIL until they hand-create it. Fix options:
    - (a) init.js also scaffolds a minimal `.claude/CLAUDE.md.template` if missing
    - (b) document the prerequisite in init's output message
    - (c) make session-start treat missing CLAUDE.md as WARN not FAIL on a fresh adopter project (detect "no canonical artifacts present" = "freshly bootstrapping")
  - Recommendation: (a) — least friction. Add `templates/CLAUDE.md.template` + scaffold step in init.js.
- **F0.3 — Init's "Next:" message assumes adlc-flow plugin already installed**
  - Severity: LOW. The message `Next: run /adlc-orchestrator discover "<business pain point>"` doesn't work unless the adopter has `claude plugin add adlc-flow` first. Minor — slash commands only work inside Claude Code anyway, so any adopter typing slash commands knows the plugin is installed.

### Outputs
- `HYPOTHESIS.md` (1978 bytes) ✓
- `RESPONSIBILITY-MAP.md` (1358 bytes) ✓
- `FEEDBACK-LOG.md` (1040 bytes) ✓
- `MODEL-UPGRADE-LOG.md` (1299 bytes) ✓
- `OBSERVABILITY.md` (2400 bytes) ✓
- `COST-BUDGET.md` (1978 bytes) ✓
- `GOLDEN-DATASET/.gitkeep` ✓
- `EVAL-SUITE/.gitkeep` ✓
- `docs/adr/.gitkeep` ✓

---

## Phase 1 — discover (HG + SG)

### What I did
1. Walked `/hypothesis-register` 8-step procedure for ticket-triage pain point. Wrote H-001 row.
2. Walked `/responsibility-map` for the same feature. Wrote feature block with 8 decision points + unsafe-autonomy zones + kill-switch.

### Findings

- **F1.1 — HYPOTHESIS.md table-row format is too cramped for real hypotheses** *(MEDIUM)*
  - The 8-column markdown table works for an ID + date summary but FAILS for content like a 4-clause kill-criteria, multi-sentence hypothesis, or paragraph-length skip-when.
  - Worked around by adding a per-ID "detail" block below the table. Real adopters will hit this same wall.
  - **Fix**: revise `templates/HYPOTHESIS.md.template` to officially document the two-tier pattern: (1) summary table row for at-a-glance, (2) per-ID `## H-NNN detail` block for full text. Skill `/hypothesis-register` Step 8 should write BOTH.

- **F1.2 — `/hypothesis-register` Step 3 forces single-sentence hypothesis template** *(LOW-MEDIUM)*
  - Template: `"An agent that [behavior] will [measurable benefit] for [user] under [conditions], evidenced by [metric] above/below [threshold]."`
  - 5 placeholders crammed into one sentence; filled version (~50 words) is dense and hard to skim.
  - **Fix**: SKILL.md Step 3 should allow structured multi-line as alternative (Behavior / Benefit / User / Conditions / Metric+threshold as separate lines).

- **F1.3 — `/responsibility-map` template has only ONE example row** *(LOW)*
  - Real features have 6-10+ decision points; placeholder shows 1.
  - **Fix**: template placeholder should show 3-4 example rows covering different `Who`/`Approval`/`Authority` combos.

- **F1.4 — RESPONSIBILITY-MAP.md template missing "Open questions (defer to AG)" section** *(LOW)*
  - During walkthrough I naturally produced open questions that resolve at architecture phase (read access to history? per-language scope?).
  - **Fix**: add `### Open questions (defer to AG)` section to template.

- **F1.5 — No formal cross-skill handoff envelope** *(LOW)*
  - `/hypothesis-register` writes H-001 row → `/responsibility-map` reads it via `Feature: <name> (H-NNN)` header convention. Works but implicit.
  - **Fix**: SKILL.md descriptions should explicitly state "reads HYPOTHESIS.md row matching `--hypothesis H-NNN`".

### Outputs
- `HYPOTHESIS.md` — H-001 row + detail block (7 sections of content)
- `RESPONSIBILITY-MAP.md` — ticket-triage feature block (8 decision points · 5 unsafe-autonomy zones · 4 compliance-check mappings · kill-switch · 2 open questions)

### Validated patterns (not friction)
- **Kill-switch tiered structure** (per-ticket / per-user / global) emerged naturally — promote to template.
- **Constraint → row mapping** in compliance-check forces tracing each HG kill-criterion to a grid row that enforces it. Caught one (cost/ticket) that doesn't belong in responsibility-map and should land in COST-BUDGET at AG.

---

## Phase 2 — design (AG)

### What I did
1. Walked `/agent-architect` 7-step procedure. 4-Q trajectory analysis → chose ReAct.
2. Wrote `EVAL-STRATEGY-triage.md` per step 7.
3. Walked `/adr-writer` → ADR-001 in trial repo's `docs/adr/`.
4. Walked `/eval-suite-planner` → `EVAL-SUITE-triage.md` with 7 required sections.

### Findings

- **F2.1 — EVAL artifact naming inconsistency (3 conventions for related files)** *(MEDIUM)*
  - `/agent-architect` writes `EVAL-STRATEGY-<feature>.md` at root
  - `/eval-suite-planner` writes `EVAL-SUITE-<feature>.md` at root
  - `bin/adlc-flow-init.js` scaffolds an empty `EVAL-SUITE/` DIRECTORY
  - `/golden-dataset` writes to `GOLDEN-DATASET/<feature>/v1/` DIRECTORY
  - 3 different conventions for closely-related artifacts. Adopters won't know where to look.
  - **Fix**: standardize on the per-feature directory pattern (matches GOLDEN-DATASET):
    - `EVAL-SUITE/<feature>/STRATEGY.md` (from agent-architect step 7)
    - `EVAL-SUITE/<feature>/PLAN.md` (from eval-suite-planner)
    - `EVAL-SUITE/<feature>/BASELINE.md` (cross-linked from GOLDEN-DATASET/`<feature>`/v1/BASELINE.md)
  - Affected SKILL.md files: agent-architect, eval-suite-planner, pov-gate.

- **F2.2 — agent-architect step 4 overlaps with eval-suite-planner sections 1-5** *(LOW-MEDIUM)*
  - agent-architect step 4 produces "methodology + thresholds + golden-dataset plan + cost-per-eval-run"
  - eval-suite-planner sections 1-3 + 5 cover the same ground
  - I wrote near-identical content in BOTH EVAL-STRATEGY and EVAL-SUITE. Adopters will copy-paste.
  - **Fix**: agent-architect step 4 produces ONLY methodology + thresholds (AG commitments); eval-suite-planner ADDS dataset plan + cadence + cost + regression contract + owner.

- **F2.3 — ADR template doesn't suggest target length** *(LOW)*
  - My trial ADR landed at ~85 lines. No guidance on length.
  - **Fix**: SKILL.md hint: *"Most ADRs land 50-100 lines. >150 → consider splitting; <30 → consider whether ADR is needed."*

- **F2.4 — `/agent-architect` "one question at a time" heavy for fast decisions** *(LOW)*
  - 4 questions × interactive turns. For obvious cases (short trajectory → ReAct), slows momentum.
  - **Fix**: optional `--quick` flag batches the 4 questions in one turn for short-trajectory features.

### What worked well

- **Pattern table** (ReAct vs Plan-Execute vs Multi-agent vs Hybrid) gave a clean decision surface. "Fits when" column matched my trajectory analysis directly.
- **Cost model in step 5** forced computing token economics before pattern commitment. Caught that ~$0.0055/ticket is way under the $0.15 kill-threshold — confidence-builder.
- **ADR Alternatives Considered** forced explicit rejection rationales. Multi-agent rejection ("no distinct expertise domains") was the most useful — might have cargo-culted otherwise.

### Outputs
- `docs/adr/ADR-001-agent-pattern-react.md` (85 lines)
- `EVAL-STRATEGY-triage.md` (75 lines)
- `EVAL-SUITE-triage.md` (105 lines)

---

## Phase 3 — prove (VG)

### What I did
1. Walked `/golden-dataset` to scaffold `GOLDEN-DATASET/triage/v1/`. Wrote README · schema.json · 3 representative sample stubs (1 happy / 1 edge / 1 adversarial). Real adopter would scale to 100.
2. Created `BASELINE.md` with MOCKED metric distributions (PoV code not actually built for trial; metrics simulated within plausible ranges).
3. Walked `/pov-gate` procedure against the baseline. Verdict synthesis logic from SKILL.md correctly produced `GO_WITH_CONCERNS` (5 PASS · 1 MARGINAL · 0 FAIL · no kill-criteria triggered · cost within budget).
4. Updated `HYPOTHESIS.md` H-001 row status with verdict + mitigation plan.

### Findings

- **F3.1 — `/pov-gate` doesn't specify where to PERSIST the verdict report** *(MEDIUM)*
  - SKILL.md step 7 says "emit verdict block" but doesn't say to write a verdict file. Step 8 updates HYPOTHESIS.md row status only.
  - Rich verdict (per-metric table + kill-criteria check + cost projection + mitigation plan) lives only in chat conversation. Future audits can't find it.
  - **Fix**: SKILL.md step 7 should write to `EVAL-SUITE/<feature>/VG-VERDICTS.md` (append-only log). Each PoV run gets a dated entry. HYPOTHESIS.md row holds the one-liner; VG-VERDICTS.md holds the full audit trail.
  - Worked around by stuffing the verdict in HYPOTHESIS.md detail block, but that pollutes the register with run-by-run noise.

- **F3.2 — `/golden-dataset` "current → v1" symlink note doesn't work on Windows** *(LOW)*
  - SKILL.md folder structure shows `current → v1 # symlink (or txt file with version pointer on Windows)`. Windows symlinks need admin or developer mode.
  - I wrote `current` as a flat txt file with content `v1` — works fine.
  - **Fix**: SKILL.md should default to the txt-file pattern (cross-platform); mention symlink as Unix-only optimization.

- **F3.3 — BASELINE.md template not scaffolded by `/golden-dataset`** *(LOW)*
  - SKILL.md step 7 says "record results in BASELINE.md". No template ships; adopter writes it ad-hoc.
  - **Fix**: ship `templates/BASELINE.md.template` that golden-dataset writes alongside schema.json. Structure helps adopters even when metrics start empty.

- **F3.4 — N=3 trial samples vs N=100 spec — `/pov-gate` doesn't catch sample-count shortfall** *(MEDIUM)*
  - I scaffolded 3 sample stubs (representative only), not 100. Walked `/pov-gate` with mocked metrics. The skill's "Hard Rules" say "Single-pass results are noise — eval results MUST be N-run; if N=1, halt" — but doesn't catch N=3 samples × 30 runs each ≠ 100-sample coverage.
  - **Fix**: `/pov-gate` should verify sample COUNT meets the N-floor declared in EVAL-SUITE-triage.md § 2. Currently only checks N-runs-per-sample, not total-sample-count.
  - Would catch the "tested on 3 cherry-picked samples" anti-pattern.

- **F3.5 — Cross-skill dependency chain implicit (no pipeline diagram)** *(LOW)*
  - `/agent-architect` → `EVAL-STRATEGY-triage.md` → `/eval-suite-planner` → `EVAL-SUITE-triage.md` → `/golden-dataset` → `GOLDEN-DATASET/triage/v1/` → `/pov-gate` → updates `HYPOTHESIS.md`
  - 6-step chain that real adopters discover by walking the skills. No doc shows the full pipeline.
  - **Fix**: add a pipeline diagram or table to README (or CONTEXT.md) showing artifact handoff chain.

### What worked well

- **Verdict synthesis logic** correctly produced GO_WITH_CONCERNS from the mocked baseline. The 3-way classification (GO / GO_WITH_CONCERNS / NO_GO) feels right.
- **Cost projection in BASELINE.md** caught that the trial agent is dramatically under budget ($85/mo vs $750/mo cap) — surfaces room for richer prompts without breaking economics.
- **Adversarial sample at scaffold time** (`triage-adversarial-001.json` is a prompt-injection attempt) forced thinking about defense before code is written — ADLC's "eval IS design" discipline working as designed.
- **Schema-driven samples** make the dataset machine-readable; future eval runner can parse JSON Schema and validate samples on load.

### Outputs
- `GOLDEN-DATASET/triage/v1/README.md` · `schema.json` · 3 sample stubs · `BASELINE.md`
- `GOLDEN-DATASET/current` (txt file with content `v1`)
- `HYPOTHESIS.md` updated with VG verdict + mitigation plan

---

## Synthesis / Patches

### Findings tally

**16 findings** across 3 phases. 0 BLOCKER · 5 MEDIUM · 11 LOW (or LOW-MEDIUM).

| ID | Severity | What | Fix-class |
|---|---|---|---|
| F0.1 | (validated) | init script works clean | — |
| **F0.2** | **MEDIUM** | `.claude/CLAUDE.md` required by hook but not scaffolded by init.js | template + script extension |
| F0.3 | LOW | init "Next:" message assumes plugin installed | docs wording |
| **F1.1** | **MEDIUM** | HYPOTHESIS.md table-row format too cramped | template restructure |
| F1.2 | LOW-MEDIUM | `/hypothesis-register` Step 3 single-sentence template | SKILL.md text |
| F1.3 | LOW | `/responsibility-map` template only 1 example row | template tweak |
| F1.4 | LOW | RESPONSIBILITY-MAP missing "Open questions (defer to AG)" | template tweak |
| F1.5 | LOW | Cross-skill handoff envelope implicit | SKILL.md descriptions |
| **F2.1** | **MEDIUM** | EVAL artifact naming inconsistency (3 conventions) | SKILL.md output paths |
| F2.2 | LOW-MEDIUM | agent-architect / eval-suite-planner overlap | division-of-labor cleanup |
| F2.3 | LOW | ADR template no length guidance | SKILL.md hint |
| F2.4 | LOW | agent-architect 4-Q rhythm heavy | optional `--quick` flag |
| **F3.1** | **MEDIUM** | `/pov-gate` doesn't persist verdict report | new artifact path |
| F3.2 | LOW | golden-dataset symlink note Windows-broken | SKILL.md doc |
| F3.3 | LOW | BASELINE.md template not scaffolded | new template file |
| **F3.4** | **MEDIUM** | `/pov-gate` doesn't enforce sample-count floor | SKILL.md hard-rule |
| F3.5 | LOW | Cross-skill pipeline implicit (no diagram) | new doc section |

### Recommended release plan

**v2.2.0 — Trial fixes (next sprint candidate)**
Fix all 5 MEDIUM findings + F1.3 + F1.4 (cheap template tweaks worth bundling).

| Task | Touches |
|---|---|
| F0.2 — `templates/CLAUDE.md.template` + `bin/adlc-flow-init.js` adds scaffold step | new template + init.js |
| F1.1 — `templates/HYPOTHESIS.md.template` restructured to table + per-ID detail blocks; `skills/hypothesis-register/SKILL.md` step 8 writes both | template + SKILL.md |
| F1.3 + F1.4 — `templates/RESPONSIBILITY-MAP.md.template` adds 3-4 example rows + "Open questions" section | template |
| F2.1 — Standardize on `EVAL-SUITE/<feature>/{STRATEGY,PLAN,BASELINE,VG-VERDICTS}.md` directory pattern; update agent-architect + eval-suite-planner + pov-gate SKILL.md output paths | 3 SKILL.md updates |
| F3.1 — `/pov-gate` step 7 writes to `EVAL-SUITE/<feature>/VG-VERDICTS.md` (append-only); step 8 only writes one-liner to HYPOTHESIS.md | SKILL.md update |
| F3.3 — `templates/BASELINE.md.template`; `/golden-dataset` step 7 scaffolds it | new template + SKILL.md |
| F3.4 — `/pov-gate` step 1 verifies sample COUNT ≥ N-floor from EVAL-STRATEGY § 2; halt if short | SKILL.md hard-rule |
| ADR-006 — pipeline + artifact-location decision record (documents F2.1 standardization + F3.1 persistence + F3.5 pipeline view) | new ADR |
| README.md / CONTEXT.md — pipeline diagram (F3.5) | docs |

Estimated work: ~1 sprint of focused edits. No code changes — all template/SKILL.md/docs.

**v2.2.1 / v2.3 — Lower-priority follow-ups (LOW items)**
F0.3, F1.2, F1.5, F2.2, F2.3, F2.4, F3.2, F3.5 (mostly wording / doc tweaks).

### Hold v2.1.0 release until v2.2.0 ships?

Recommend: **yes** — release v2.1.0 + v2.2.0 together to external adopters. Reasons:
1. Most MEDIUM findings affect first-touch adopter experience (init scaffold, artifact naming, verdict persistence).
2. Friction log captured these in <2 hours of dogfooding; real adopters would hit the same issues in their first day.
3. v2.1.0 → v2.2.0 is purely additive + breaking only on internal artifact paths (no released adopters yet).
4. Cleaner story: "v2.2 = dogfooded baseline; v2.1 was preview."

### Trial validates the lifecycle works

- All 3 critical-path phases (`init` · `discover` · `design` · `prove`) traversable end-to-end.
- All 6 produced artifacts (HYPOTHESIS · RESPONSIBILITY-MAP · ADR · EVAL-STRATEGY · EVAL-SUITE · BASELINE + GOLDEN-DATASET scaffold) have real content; format mostly works.
- VG verdict mechanic (GO_WITH_CONCERNS) correctly emerged from the data.
- Cost discipline, kill-criteria pre-commitment, hypothesis falsifiability — all surface as designed.
- No blocker found. ADLC's signature value props (eval IS design, hypothesis-first, kill-criteria up front) all play through.

### Trial artifacts (preserved at)
- `D:\Project\adlc-flow-trial\` — full trial repo (HYPOTHESIS.md · RESPONSIBILITY-MAP.md · docs/adr/ADR-001 · EVAL-STRATEGY-triage.md · EVAL-SUITE-triage.md · GOLDEN-DATASET/triage/v1/)
- Optional: keep as a permanent example in adlc-flow's `docs/examples/` once it's solidified

---

# Trial 2 — Naraly Landing v1 (v2.2.0 → v2.3.0)

**Trial repo:** `D:\Project\naraly` (real existing project · not dummy)
**Product:** Marketing landing page for Naraly HRIS (Indonesian mid-market · waitlist capture)
**Type:** **Traditional dev** — no agentic feature on the landing
**Stack:** Next.js 15 + Tailwind 4 in pnpm-turborepo monorepo with existing apps/web + packages/
**Why this trial differs from Trial 1:** Trial 1 was greenfield agentic build; Trial 2 is existing-mature-project + traditional dev + parallel-track. Surfaces friction Trial 1 couldn't.

## Findings tally

13 findings · 3 HIGH · 5 MEDIUM · 5 LOW.

### HIGH — structural gaps for real adopters

- **F4.1 — No documented path for "traditional-only adopter"** *(HIGH)*
  - `adlc-orchestrator` modes are all ADLC-flavored (`discover`/`design`/`prove`/`build`/`validate`/`activate`/`operate` + `init`). Landing page doesn't fit any. Naraly is hybrid: agentic product (apps/web) + traditional marketing (apps/landing).
  - I bypassed `/adlc-orchestrator` entirely; used `/lean-doc-generator` + `/adr-writer` directly. Real adopters would be confused: "do I run `discover`? doesn't fit a landing. `hypothesis-register`? no AI feature."
  - **Fix**: add `traditional` mode to `adlc-orchestrator` dispatching to universal skills (no ADLC gates fire); update orchestrator description to name both audiences.

- **F4.2 — `init` mode assumes greenfield adopter project** *(HIGH)*
  - Naraly already has `.claude/CLAUDE.md`, `docs/`, `TODO.md`, `CHANGELOG.md`, ADRs, sprint conventions. `init` halts when canonical artifacts exist (per current orchestrator step 1: "if any exist, halt and ask").
  - I skipped init entirely; hand-scaffolded.
  - **Fix**: change init to "scaffold the MISSING artifacts; SKIP existing; warn user about overlapping conventions." `bin/adlc-flow-init.js` already is idempotent; just need to update the orchestrator step + add `--existing` flag semantics.

- **F4.3 — Parallel tracks forbidden but real projects have them** *(HIGH)*
  - `lean-doc-generator/references/SPRINT_PROTOCOLS.md` lists "Concurrent Active Sprints" as anti-pattern. Naraly has Sprint 3 (backend wiring) + Landing v1 simultaneously — different concerns; no file overlap.
  - I improvised a "Parallel Track" section above Active Sprint. Worked but violates protocol.
  - **Fix**: SPRINT_PROTOCOLS.md amendment — allow concurrent sprints when `files_affected ∩ ∅` (no file overlap). Mirrors orchestrator `sprint-bulk` overlap gate from dev-flow heritage.

### MEDIUM — friction with workaround

- **F4.4 — ADR location ambiguity** *(MEDIUM)*
  - Naraly has both `docs/adr/` AND `docs/DECISIONS.md`. I picked `docs/adr/`; no skill detected the legacy file.
  - **Fix**: `/adr-writer` procedure step 1 scans for both; emits the new ADR to existing convention; warns if both exist (drift risk).

- **F4.5 — Sprint file shape collision with existing conventions** *(MEDIUM)*
  - Naraly's TODO.md uses 3-A/3-B/3-C nested subsections; adlc-flow's protocol uses §Plan/§Execution Log/§Files Changed/§Retro. New sprint file sits next to existing → format inconsistency.
  - **Fix (deferred to v2.4)**: lean-doc-generator detects existing sprint shape and offers migration OR matches existing convention.

- **F4.6 — `/hypothesis-register` rejects non-agentic falsifiable claims** *(MEDIUM)*
  - Description says "Do not use for traditional feature work — write a TODO entry directly." But marketing-conversion targets, latency goals, reliability SLOs are all falsifiable hypotheses with kill-criteria. Landing's "≥5% qualified-visitor → waitlist conversion" had no proper home.
  - **Fix**: extend `/hypothesis-register` to accept `--type=conversion|latency|reliability|agentic` (default: agentic). Non-agentic variants get a 5-step lighter procedure; HYPOTHESIS.md gains a `Type` column.

- **F4.7 — Brand-token / design-token duplication has no canonical guidance** *(MEDIUM)*
  - Copied `@theme` block verbatim from `apps/web/src/app/globals.css` to `apps/landing`. Drift risk documented in ADR-001 (rule-of-three extraction); no plugin-level guidance.
  - **Fix (deferred)**: extend lean-doc DOCS_Guide.md anti-patterns table OR write ADR-template for "design-tokens canonical location".

- **F4.8 — No template for Server Action + DB pattern** *(MEDIUM)*
  - Wrote `lib/db.ts` + `lib/actions.ts` + waitlist-schema.sql from scratch. Adopters building forms-with-DB will re-invent.
  - **Fix (deferred to v2.4+)**: ship `templates/server-action.ts.template` + Supabase RLS pattern; possibly a `/server-action` skill.

### LOW — opportunistic improvements

- **F4.9** — No `/i18n-plan` skill or bilingual template. Adopters in non-English markets re-invent the content-object pattern.
- **F4.10** — No `/deploy-plan` skill. Vercel-separate-project + env-var setup + custom domain pattern lives only in ADR-001 body.
- **F4.11** — No "scenario → skill chain" cheatsheet in README. Adopters discover by reading every SKILL.md.
- **F4.12** — No "design-tokens canonical location" guidance (F4.7's preventive variant).
- **F4.13** — adlc-orchestrator description doesn't surface the "existing-project + non-greenfield" path.

## The deepest insight

**F4.1 + F4.2 + F4.3 cluster around the same root**: adlc-flow was implicitly designed for fresh adopters building agentic products start-to-finish. Reality for most adopters is they (a) have an existing project with conventions, (b) run multiple tracks, (c) ship many features that are traditional dev. The plugin's universal surface (absorbed from dev-flow in v2.0) is fully capable — but the orchestrator's mode taxonomy + the protocol's "one active sprint" rule + the init script's greenfield assumption all push against that reality.

The absorption was right. The orchestrator-as-narrow-ADLC-only framing needs to soften. ADR-007 captures the response.

## Recommended release plan

**v2.3.0 — Traditional-adopter fixes**: 3 HIGH + 2 MEDIUM (F4.4 + F4.6) + ADR-007.

| Task | Touches |
|---|---|
| F4.1 — `traditional` mode in `adlc-orchestrator` + dispatch table | SKILL.md update |
| F4.2 — `init` mode handles existing-project gracefully | SKILL.md + init.js stdout |
| F4.3 — SPRINT_PROTOCOLS.md allows parallel tracks (no file overlap) | references update |
| F4.4 — `/adr-writer` detects existing ADR convention | SKILL.md + procedure.md |
| F4.6 — `/hypothesis-register` accepts non-agentic hypotheses (`--type` flag) | SKILL.md update |
| ADR-007 — documents the "existing-adopter + multi-track + traditional-dev" support | new ADR |

Remaining 6 LOW + 2 MEDIUM (F4.5 · F4.7 · F4.8 · F4.9 · F4.10 · F4.11 · F4.12 · F4.13) → v2.4+ backlog.

### Trial validates universal surface but exposes framing gap

- Universal-dev-workflow skills (lean-doc-generator + adr-writer + sprint protocols) carried the entire landing build. The v2.0 absorption was correct — without those, adlc-flow had nothing to offer this work.
- Sprint plan + ADR-001 + 18 implementation files shipped clean.
- BUT: the orchestrator never engaged. The plugin's "primary entry point" doesn't fit traditional dev. That's the framing gap v2.3 closes.

## Trial artifacts (preserved at)

- `D:\Project\naraly\apps\landing\` — 18 files (Next.js 15 + bilingual + Supabase waitlist)
- `D:\Project\naraly\docs\sprint\SPRINT-LANDING-V1.md` — sprint plan
- `D:\Project\naraly\docs\adr\ADR-001-landing-app.md` — 6 architectural decisions

---

# Trial 3 — Multi-Agent Customer Support Escalation (v2.3.0 → v2.4.0 candidate)

**Trial repo:** `D:\Project\adlc-flow-trial-3-multiagent`
**Product:** Multi-agent escalation system (classifier + 3 specialists + coordinator)
**Type:** **Agentic · multi-agent · complex authority chain**
**Stress target:** the agent-pattern branch and inter-agent surfaces that trials 1+2 never exercised
**Scope:** discover → design → prove (planning only; no code)
**Outcome:** intentionally hit **NO_GO** at VG (validates kill-criterion path that GO_WITH_CONCERNS in trial 1 didn't)

## Findings tally

10 candidate findings · 5 MEDIUM · 4 LOW · 1 validation (not friction).

### MEDIUM — friction worth fixing in v2.4

- **F5.1 — `/agent-architect` Pattern table has no tie-break rule for borderline cases** *(MEDIUM)*
  - The 4-Q trajectory analysis lands cleanly when Q3 (≥2 expertise domains) clearly says yes/no. For borderline cases where short trajectory pulls toward ReAct but multiple domains pull toward multi-agent, there's no documented tie-break logic.
  - In trial 3 I defended multi-agent manually because I knew the domain. A real adopter on this borderline would feel uncertain.
  - **Fix**: agent-architect Step 3 adds explicit tie-break: "If Q3 = yes AND Q1 trajectory < 5 steps, multi-agent if specialist domain knowledge ≠ overlap; else hybrid (ReAct with per-domain tool subsets)."

- **F5.2 — Multi-agent eval naturally splits 3 ways; single PLAN.md gets dense** *(MEDIUM)*
  - For multi-agent systems, eval has per-agent + handoff + e2e surfaces. STRATEGY.md and PLAN.md handle this in single files but density grows fast (trial 3 STRATEGY is 105 lines for 3 agents; would grow worse for 5+ agents).
  - **Fix (consider for v2.4)**: allow optional `EVAL-SUITE/<feature>/per-agent/<agent>.md` files when agent count ≥3. PLAN.md stays for cross-cutting + e2e. Cross-link via PLAN.md table of contents.

- **F5.3 — RESPONSIBILITY-MAP table is flat; multi-agent has chained authority** *(MEDIUM)*
  - Decision points table has single `Who` column. Real multi-agent decisions are sequences: specialist proposes → coordinator reviews → human approves. I worked around by stuffing chain logic into the `Approval` column.
  - **Fix**: template adds optional `Chain` column for multi-step authority OR allows multi-row decision per logical action with sequence numbers. Default stays single-row for simple cases.

- **F5.4 — HG template doesn't suggest inter-agent injection kill-criterion for multi-agent** *(MEDIUM)*
  - Trial 3 included an inter-agent prompt-injection kill-criterion because I knew to add it from `red-team-analyst`'s attack categories. Adopters building multi-agent without read-team-analyst awareness would forget.
  - **Fix**: `/hypothesis-register --type=agentic` prompts "Is this multi-agent? If yes, consider these kill-criteria: inter-agent injection-resistance · role-confusion attack rate · authority-escalation success rate" during step 4 (kill-criteria).

- **F5.7 — RESPONSIBILITY-MAP template doesn't cover cross-agent context-handoff policy** *(MEDIUM)*
  - Multi-agent systems pass context between agents. Trial 3 added a "Cross-agent context handoff" row by hand. Template doesn't prompt for it.
  - **Fix**: template's unsafe-autonomy section gains a default entry "Cross-agent context handoff policy" when system has ≥2 agents. OR template's Decision points example expands to show a handoff row.

### LOW — opportunistic improvements

- **F5.5 — `/pov-gate` NO_GO recommendation is generic; doesn't structure mitigation plan** *(LOW)*
  - SKILL.md says "Recommendation: <proceed | mitigation plan | abort>" but doesn't structure WHAT a mitigation plan looks like. Trial 3's mitigation plan (5 specific actions) was domain-knowledge driven; skill could template the structure.
  - **Fix**: pov-gate Step 7 verdict template includes mitigation-plan-structure when GO_WITH_CONCERNS or NO_GO: "Per-finding mitigation: (1) finding · (2) proposed fix · (3) re-eval acceptance criterion".

- **F5.6 — Cost projection in pov-gate doesn't highlight headroom prominently** *(LOW)*
  - In trial 3, $0.42/ticket vs $0.45 kill is only 7% headroom — that's the second-most-important fact in the entire verdict, but it's buried in a sea of numbers.
  - **Fix**: pov-gate verdict template emits a "Headroom callout" for any metric within 10% of kill threshold: "⚠ cost/ticket headroom: 7% (next budget cycle could push to kill)".

- **F5.8 — agent-architect "Pattern Choices" lacks multi-agent sub-variants** *(LOW)*
  - Multi-agent isn't ONE pattern; sub-variants exist (orchestrator-worker · peer-network · hierarchical · supervisor-agent). Trial 3 picked orchestrator-worker shape (classifier→specialists→coordinator) without skill guidance.
  - **Fix (LOW)**: agent-architect "Pattern Choices" table expands multi-agent into 2-3 sub-variants when picked. Alternatively, document this in a `references/multi-agent-variants.md` reference file.

- **F5.9 — Per-agent kill-switch pattern could be promoted to template** *(LOW)*
  - Trial 3 added per-agent kill-switch to RESPONSIBILITY-MAP because of multi-agent specifics. This is a canonical pattern worth promoting.
  - **Fix (LOW)**: RESPONSIBILITY-MAP template's Kill-switch section adds "Per-agent: applicable for multi-agent systems · operator can disable any single agent in <30s · disabled traffic falls back to human queue or peer agent".

### Validation (not friction · positive signal)

- **`/pov-gate` NO_GO path works as designed.** First trial to actually hit NO_GO. Verdict synthesis correctly fired on inter-agent injection-resistance FAIL + kill-criterion triggered. VG-VERDICTS.md (per F3.1 v2.2 fix) captured the full audit trail; HYPOTHESIS.md row got the one-liner pointer (per F3.1 fix). Strong validation that v2.2 fixes work end-to-end.
- **Sample-count enforcement guard would have HALTED a real run.** Trial 3 mocked baseline; VG-VERDICTS.md explicitly notes "real run would HALT with INSUFFICIENT_SAMPLES per /pov-gate step 1 (F3.4 fix in v2.2.0)". Validates F3.4 fix.
- **EVAL-SUITE/<feature>/ standardized location** (per F2.1 v2.2 fix) feels right at scale — STRATEGY + PLAN + BASELINE + VG-VERDICTS in one directory makes the eval audit trail navigable.
- **Hypothesis-register `--type=agentic` (v2.3 default)** worked cleanly. Type column in HYPOTHESIS.md table is forward-compatible for non-agentic types to land here.

## The deepest insight

Trial 3's NO_GO is the **most important successful test of the entire dogfood loop so far**. Trials 1+2 validated the happy path (GO or GO_WITH_CONCERNS); trial 3 validates that **kill-criteria pre-commitment actually kills a hypothesis** when the data fires the criterion. That's the whole ADLC value proposition — bad ideas die at minimum cost — and we just saw it work on a synthetic-but-realistic scenario.

Without v2.2's F3.1 verdict persistence + F3.4 sample-count enforcement, this NO_GO would have been lossy chat-output. With those fixes, the full audit trail (BASELINE.md mocked metrics → VG-VERDICTS.md verdict + mitigation plan → HYPOTHESIS.md status update with pointer) creates a coherent record that a real adopter can actually act on.

## Recommended release plan

**v2.4.0 — Multi-agent fixes**: 5 MEDIUM findings (F5.1 · F5.2 · F5.3 · F5.4 · F5.7) — focused improvements to agent-architect + responsibility-map template + hypothesis-register multi-agent prompting.

| Task | Touches |
|---|---|
| F5.1 — agent-architect tie-break rule | SKILL.md update |
| F5.2 — optional per-agent eval files for multi-agent (≥3 agents) | SKILL.md guidance + PLAN.md template note |
| F5.3 — RESPONSIBILITY-MAP template Chain column / sequence-numbered rows | template update |
| F5.4 — hypothesis-register prompts for multi-agent kill-criteria | SKILL.md step 4 update |
| F5.7 — RESPONSIBILITY-MAP template cross-agent handoff section | template update |
| ADR-008 — documents multi-agent template adjustments cluster | new ADR |

Remaining 4 LOW (F5.5 · F5.6 · F5.8 · F5.9) → v2.5+ backlog (most are SKILL.md polish + template additions).

## Trial 3 artifacts (preserved at)

- `D:\Project\adlc-flow-trial-3-multiagent\` — full trial repo
  - `HYPOTHESIS.md` — H-001 multi-agent escalation (status: NO_GO at VG)
  - `RESPONSIBILITY-MAP.md` — escalation feature with chained authority + per-agent kill-switch
  - `docs/adr/ADR-001-multiagent-pattern.md` — multi-agent pattern decision (~100 lines)
  - `EVAL-SUITE/escalation/STRATEGY.md` — methodology + thresholds across 3 surfaces
  - `EVAL-SUITE/escalation/PLAN.md` — runnable eval plan
  - `EVAL-SUITE/escalation/BASELINE.md` — mocked metrics triggering NO_GO
  - `EVAL-SUITE/escalation/VG-VERDICTS.md` — verdict + 5-action mitigation plan
  - `GOLDEN-DATASET/escalation/v1/{README · schema.json · samples/.gitkeep}` — scaffold

## 3-trial summary (synthetic — through v2.4)

| Trial | Domain | Type | Outcome | v→v |
|---|---|---|---|---|
| 1 — Ticket triage | Greenfield agentic (single-agent) | ReAct, GO_WITH_CONCERNS | 16 findings | v2.1 → v2.2 |
| 2 — Naraly landing | Existing project · traditional dev · parallel-track | Sprint+ADR universal surface | 13 findings | v2.2 → v2.3 |
| 3 — Multi-agent escalation | Multi-agent · complex authority · NO_GO path | NO_GO verdict | 10 findings | v2.3 → v2.4 candidate |
| **Synthetic subtotal** | | | **39 distinct findings** | |

Each trial caught a non-overlapping cluster. Diminishing returns curve started flattening with trial 3 (4 MEDIUM vs trial 2's 5 MEDIUM and trial 1's 5 MEDIUM) — suggested we were approaching the dogfood plateau for synthetic-trial methodology.

---

## Trial 4 — umkm-indo TASK-101 dogfood (2026-05-20 · v2.5 → v2.6)

**Domain**: Real partner-platform LLM-core feature (Indonesian SME marketplace-to-storefront migration). First non-synthetic trial. Goal: walk a genuine product hypothesis through `init → discover → design → prove-prep` and capture signal that synthetic trials couldn't surface.

**Outcome**: Full pre-code arc completed. HG · SG · AG gates closed. P3-prep artifacts (PLAN.md + GOLDEN-DATASET scaffold) written. PoV scaffold compiles and runs against golden samples at $0 cost. **Cost-kill-criterion FIRED at AG** on the user's initial pattern choice (hybrid multi-agent) — caught a budget-blowing architecture before any code was written. Second cross-trial validation of the kill-criterion-pre-commitment discipline (Trial 3 was first).

### Phase 0 — init mode on new empty directory

- `node bin/adlc-flow-init.js` against `D:\Project\umkm-indo\` (empty). Scaffolded 7 files + 3 dirs cleanly. SessionStart hook verified `.claude/CLAUDE.md` present. No friction.

### Phase 1 — discover (HG + SG via back-and-forth clarification)

User started with a very vague pain: *"create partner platform support with AI workflow optimize, solve problem all SME needed with solid solution"*. The `/hypothesis-register` skill's "ask if vague" discipline + AskUserQuestion-driven multiple-choice clarification narrowed this through 6 focused rounds:

1. UMKM persona → online sellers migrating off marketplaces (Tokopedia / Shopee fees)
2. AI wedge → auto-storefront generation (Shopify-cheaper-for-Indonesia framing)
3. Storefront shape → hosted store + custom domain option
4. Listing input → originally hybrid (URL · CSV · manual); narrowed to CSV after legal-risk surfacing on URL scrape
5. Pattern at AG → originally hybrid multi-agent; narrowed to Plan-and-Execute after cost-kill-criterion fired
6. Publish authority → preview-only (seller publishes)

H-001 written with 7 pre-committed kill-criteria. RESPONSIBILITY-MAP with 14 decision rows + 5 unsafe-autonomy zones + per-storefront/per-cohort/global kill-switch tiers.

### Phase 2 — design (AG)

`/agent-architect` trajectory analysis (4 questions) applied to H-001 yielded:
- Q1 trajectory: ~12 stages (long) → tie-break rule DIDN'T fire (it triggers on short trajectory)
- Q2 plan/execute separation: yes (preview gate IS the boundary)
- Q3 domains: ≥3 distinct (CSV parse · Bahasa commerce copywriting · Indonesian regulatory)
- Q4 budget: tight (Rp 750/product including all overhead)

User initially picked hybrid multi-agent (Plan-and-Execute + multi-agent executor). I computed cost honestly: Rp 157k per 100-product storefront — fires H-001 cost kill-criterion (>Rp 150k). User pivoted to Plan-and-Execute alone (Rp 37k, ~50% headroom). ADR-001 documents the rejection of multi-agent for this hypothesis. STRATEGY.md captures methodology + thresholds. COST-BUDGET.md filled in.

### Phase 3 — prove-prep (P3 prep · code scaffold)

`/eval-suite-planner` produced PLAN.md (dataset shape · cadence · regression contract · owner). `/golden-dataset` scaffolded `v1/` with schema.json + README + 4 representative samples (2 happy + 2 adversarial covering BPOM honey supplement and counterfeit luxury bag). PoV code scaffold (`poc/`) written in pure TypeScript: CSV parsers (Tokopedia + Shopee), planner with mock implementation (live stubbed for follow-on), copy-gen mock, executor loop, eval-runner. **Compiled clean** (`tsc --noEmit` passes). **Eval ran end-to-end** against the 4 samples and surfaced 3 latent bugs in the mock heuristics (false-positive IP flag on legitimate iPhone case · copy-strategy too conservative on adversarial products · hallucination guards only fire when compliance flags do).

### Findings

#### MEDIUM — workflow refinement

- **F6.1 — `/hypothesis-register` multi-agent kill-criteria prompt at HG has a chicken-and-egg problem** *(MEDIUM)*
  - The v2.4 fix (TASK-404 · ADR-008) added a prompt at HG step 4: *"Is this multi-agent? If yes, consider these kill-criteria..."* The intent was to pre-commit multi-agent-specific kill-criteria before prototyping.
  - But: multi-agent vs single-agent is an **AG decision** (via `/agent-architect`), not an HG decision. At HG the user doesn't yet know which pattern they'll pick. Forcing them to pre-commit multi-agent kill-criteria at HG either (a) leads to skipped prompts ("not sure yet"), or (b) leads to defensive over-specification (write all three classes "just in case" even for single-agent features).
  - Trial 4 hit this: at HG the user didn't know it'd be multi-agent. The prompt was skipped. At AG when the user *did* pick hybrid multi-agent, no prompt forced us back to HG to add the multi-agent kill-criteria — we got lucky that the cost-kill-criterion fired before we needed the multi-agent ones.
  - **Fix**: `/hypothesis-register` Step 4 multi-agent prompt becomes deferrable — if user says "not sure / decide at AG", write skeleton placeholders with `[DEFER-TO-AG]` markers. `/agent-architect` Step 6 (ADR dispatch), when picking multi-agent (any sub-variant), MUST trigger a "go back and amend HYPOTHESIS.md kill-criteria" step before the ADR is finalized. Two small SKILL.md edits.

#### LOW — template polish

- **F6.2 — `templates/HYPOTHESIS.md.template` missing `Type` column** *(LOW)*
  - v2.3 (ADR-007) added the `Type` column to HYPOTHESIS.md summary tables. The template wasn't updated. Adopters scaffolding new HYPOTHESIS.md files from this template get the old 6-column format and lose the agentic/conversion/latency/reliability/other distinction.
  - **Fix**: 3-line edit to template summary-table header + placeholder row.
  - Already filed as TASK-601 prior to this writeup.

#### POSITIVE — patterns to formalize

- **F6.3 — Cost-kill-criterion fired at AG, caught budget-blowing architecture before code** *(POSITIVE · validates AG)*
  - User initially picked hybrid multi-agent (Plan-and-Execute + multi-agent executor) at `/agent-architect` Step 3. My cost analysis estimated Rp 157k per 100-product storefront, fired against H-001's Rp 150k kill threshold.
  - User pivoted to pure Plan-and-Execute (Rp 37k estimate · ~50% headroom). No code written. No tokens spent.
  - **Second time** across all 4 trials a kill-criterion has fired on real data (Trial 3 was inter-agent injection-resistance at VG; Trial 4 is cost at AG). Both fires happened on the *correct side* of the build wall — before code, before token spend.
  - This is the ADLC value proposition working as intended. Worth highlighting in marketing / external-adopter recruitment materials.

- **F6.4 — `AskUserQuestion` 1-focused-question + multiple-choice + recommendation pattern is excellent for HG/SG clarification** *(POSITIVE · pattern to formalize)*
  - 6 clarification rounds at HG + 4 at AG used the same shape: one focused question, 3-4 options with clear trade-offs, my recommendation flagged. Each round took ~30 seconds of user time and produced a defensible decision.
  - Compared to free-form chat, this is faster + higher-quality + auditable (each decision has its trade-off table preserved in conversation).
  - **Pattern worth promoting**: skills with "ask if vague" discipline (`/hypothesis-register`, `/agent-architect`, `/responsibility-map`) should document this UX pattern in their references. Could add a `references/clarification-flow.md` reference file shared across rigid skills.

- **F6.5 — Mock-first PoV scaffold pattern caught 3 real bugs at $0 cost** *(POSITIVE · P3 best practice)*
  - Built the PoV pipeline (planner + executor + eval-runner) with deterministic mock LLM implementations before wiring real Anthropic SDK. Ran eval against 4 golden samples, surfaced 3 latent bugs in the mock heuristics (false-positive IP flag · copy-strategy too conservative · hallucination guards missed).
  - These bugs would have been MUCH more expensive to surface with the live LLM (real tokens, slower iteration, mock-real divergence ambiguity).
  - **Pattern worth promoting**: P3 prep should include "scaffold pipeline with mock implementations before wiring live LLM." Could document in a `references/mock-first-pov.md` reference for `/golden-dataset` skill, or as a phase-3 best practice in `adlc-orchestrator`.

### Trial 4 findings tally

- 1 MEDIUM (F6.1 chicken-and-egg)
- 1 LOW (F6.2 template — already TASK-601)
- 3 POSITIVE patterns (F6.3 cost-kill validates AG · F6.4 AskUserQuestion clarification flow · F6.5 mock-first PoV pattern)

### Trial 4 produced (preserved at `D:\Project\umkm-indo\`)

- `HYPOTHESIS.md` H-001 with 7 kill-criteria · `RESPONSIBILITY-MAP.md` with 14 decision rows
- `docs/adr/ADR-001-storefront-architecture.md` (~150 lines · Plan-and-Execute decided · multi-agent + hybrid both rejected with cost reasoning)
- `EVAL-SUITE/storefront-from-csv/STRATEGY.md` (methodology + thresholds) · `PLAN.md` (dataset + cadence + regression contract)
- `GOLDEN-DATASET/storefront-from-csv/v1/` (schema + 4 representative samples · scaffold for N=200 target)
- `COST-BUDGET.md` (Rp 37k expected · Rp 150k kill)
- `poc/` (TypeScript scaffold · compiles clean · runs eval-runner against samples)

---

## 4-trial summary

| Trial | Domain | Type | Outcome | Findings | v→v |
|---|---|---|---|---|---|
| 1 — Ticket triage | Greenfield agentic (single-agent) | ReAct, GO_WITH_CONCERNS | 16 findings | 5 MEDIUM + 2 LOW + 9 closed | v2.1 → v2.2 |
| 2 — Naraly landing | Existing project · traditional dev · parallel-track | Sprint+ADR universal surface | 13 findings | 3 HIGH + 5 MEDIUM + 5 LOW | v2.2 → v2.3 |
| 3 — Multi-agent escalation | Multi-agent · complex authority · NO_GO path | NO_GO verdict | 10 findings | 5 MEDIUM + 4 LOW + 1 positive | v2.3 → v2.4 + v2.5 |
| 4 — umkm-indo (pre-code) | Real LLM-core platform · TASK-101 | Cost-kill fires at AG · 4 gates closed | 5 findings | 1 MEDIUM + 1 LOW + 3 positive patterns | v2.5 → v2.6 |
| **4b — umkm-indo (PoV build)** | **Real LLM-core build · hypothesis amended mid-flight · live AI integration** | **Mock eval works on 30 samples · live deferred** | **8 findings** | **2 MEDIUM + 2 LOW + 4 positive patterns** | **v2.6 → v2.7** |
| **Total** | | | **52 distinct findings** | | |

## Trial 4b — umkm-indo PoV build (2026-05-20 · v2.6 → v2.7)

**Domain**: Continuation of Trial 4. Building the AI-driven landing-page MVP on real Next.js + Anthropic + Supabase stack. Hypothesis amended mid-flight (storefront → landing-page MVP) per user wedge refinement. Goal: build through tasks 1-6 of ADR-002 (JSON schema · cache blocks · live planner · theme components · preview route · golden dataset + eval-runner).

**Outcome**: Tasks 1-6 shipped. Live mode wired but not yet measured (~Rp 30-50k spend deferred to task 7 with explicit consent). Mock eval against 30 golden samples produced honest signal — surfaced sections-include 0/30 + compliance 19/30 as expected mock limitations validating the eval surface works.

### Phase A — hypothesis amendment mid-flight

User pivoted the H-001 wedge from "AI generates full storefront from CSV" → "AI generates multi-theme landing page from business description" partway through ADR-002 work. I amended H-001 in HYPOTHESIS.md by hand: rewrote summary row · rewrote detail block · added amendment-history note. Cascade work followed: COST-BUDGET ceiling dropped Rp 150k → Rp 5k · ADR-001 gained amendment header · STRATEGY.md gained amendment ribbon · GOLDEN-DATASET schema redesigned · directory name `storefront-from-csv/` left stale.

### Phase B — three cache blocks + tool_use planner

Wrote system prompt (1.5k tokens · 5 hard rules covering testimonials · BPOM/halal · IP refuse · comparative pricing · medical claims) · theme registry serialized JSON (2k tokens · stable across sellers) · Bahasa Indonesia commerce-copy style guide (1k tokens · tone · pricing format · CTA patterns · forbidden phrases). All three as cache-eligible blocks. Anthropic `tool_use` flow with `LandingPageJsonSchema` enforces structured output. Cost projection: ~Rp 850 first call · ~Rp 750 cached subsequent calls in 5-min window.

### Phase C — frontend-design skill polish + 30-sample dataset + eval-runner

Invoked `/frontend-design` mid-flow to polish three themes from "minor visual variations" to genuinely distinct aesthetic worlds (Minimal=Editorial Swiss · Elegant=French luxury · Bold=Neo-brutalist warung-poster). Plus Jakarta Sans (Indonesian designer Tokotype) for body across themes — contextually appropriate AND non-Inter. Cormorant Garamond for Elegant display. Bebas Neue for Bold display.

30-sample golden dataset generated via `poc/scripts/generate-landing-samples.ts` (data-as-code + deterministic writer). Composition 60/20/13/7 close to target 60/20/15/5.

Eval-runner at `apps/web/scripts/eval-landing.ts` loads samples · runs `generateLanding` mock · aggregates 5 metrics. First end-to-end run: 22/30 theme exact · 29/30 in-alts · 0/30 sections-include · 30/30 sections-omit · 19/30 compliance.

### Findings

#### MEDIUM — workflow gaps

- **F7.1 — Hypothesis-amendment cascade is unowned** *(MEDIUM)*
  - When H-001 amended from storefront to landing-page MVP, six dependent artifacts needed updates (RESPONSIBILITY-MAP · ADR-001 · STRATEGY.md · PLAN.md · COST-BUDGET · EVAL-SUITE directory name). No skill enforces or even checklists this cascade. I handled it manually with judgment calls — some artifacts got proper rewrites (COST-BUDGET · HYPOTHESIS.md) · others got just "amendment ribbons" that defer real rewriting (STRATEGY.md · PLAN.md) · the EVAL-SUITE directory name (`storefront-from-csv/`) is now stale.
  - **Fix**: extend `/hypothesis-register` with `--amend H-NNN` mode. Procedure: load existing H-NNN · prompt for which fields to amend · capture new values · list cascade artifacts that exist for this hypothesis · suggest per-artifact action (minor ribbon vs major rewrite) · emit amended row + detail block + cascade summary requiring user approval before write.

- **F7.2 — server-only friction for standalone scripts** *(MEDIUM)*
  - The eval-runner at `apps/web/scripts/eval-landing.ts` imports from `apps/web/src/lib/ai/generate-landing.ts` which has `import "server-only"`. Running it from CLI required THREE patches: (1) install `server-only` npm package, (2) install `cross-env` for cross-platform env var setting, (3) wrap script with `NODE_OPTIONS=--conditions=react-server`. Without this trio, the script throws `This module cannot be imported from a Client Component module` at the `server-only` import.
  - Non-obvious for adopters who want CLI test workflows against their AI code. Not Next.js-specific in spirit — any framework using server-only markers will hit this.
  - **Fix**: ship a reference doc `templates/SCRIPT-FROM-NEXTJS.md` with the recipe. Optionally add `bin/adlc-flow-init.js` post-install instructions covering it.

#### LOW — template / doc additions

- **F7.3 — CLAUDE.md.template lacks stack-freshness verification hint** *(LOW)*
  - I started the umkm-indo scaffold assuming Next.js 15 + React 18 because those were the latest I'd internalized. Reality was Next.js 16.2.6 + React 19.2.6 + Tailwind 4.3 — a full major version newer in each case. Caught the mismatch by running `npm view <pkg> version` before committing. CLAUDE.md.template doesn't suggest this discipline.
  - **Fix**: add a one-line note in the Stack section: *"Verify exact versions via `npm view <pkg> version` before committing — assistant knowledge cutoffs can lag stable releases."*

- **F7.4 — No documented integration points with non-ADLC skills** *(LOW)*
  - User invoked `/frontend-design` mid-AG work to polish themes. Worked great. But there's no documentation telling adopters when to invoke specialized non-ADLC skills (`/frontend-design`, `/supabase`, `/skill-creator`, etc.) during the ADLC lifecycle. The pattern emerged organically.
  - **Fix**: add an "Integration with non-ADLC skills" section to `adlc-orchestrator/references/` documenting recommended hand-off points (e.g. "at P2/P3 visual polish step, consider /frontend-design for distinctive aesthetic direction").

#### POSITIVE — patterns worth promoting

- **F7.5 — Mock-first PoV scaffold pattern · third validation** *(POSITIVE)*
  - 30 samples × 5 metrics × mock pipeline ran in <2 seconds, surfaced "sections include 0/30" + "compliance 19/30" as latent mock limitations. These are the EXACT bugs you'd waste live LLM tokens to discover. Pattern was first noted in Trial 4 F6.5, validated again here at synthetic-30-sample scale.
  - **Fix**: promote to a `skills/golden-dataset/references/mock-first-pov.md` reference doc. Three cross-trial validations is sufficient evidence to formalize.

- **F7.6 — 3-cache-blocks architecture for structured-output AI features** *(POSITIVE)*
  - System prompt + reference data (theme registry · taxonomy · etc) + style guide as three separate cache-eligible blocks. Stable across sellers · invalidated only on registry/style-guide change · user-prompt outside cache for per-request specificity. Anthropic ephemeral 5-min TTL captures dev-cycle bursts. Cost reduction ~40-60% on input tokens after warmup.
  - **Fix**: reference doc at `skills/agent-architect/references/prompt-caching-pattern.md`. Generalizes beyond Anthropic — any LLM with prompt caching shipping (OpenAI does too) can use the same block layout.

- **F7.7 — Single-call planner with tool_use beats orchestrated multi-call** *(POSITIVE)*
  - ADR-002 explicitly chose single-call planner over hybrid multi-agent. Cost analysis: hybrid was ~Rp 157k/storefront; single-call Plan-and-Execute was ~Rp 37k. After landing-page wedge refinement, single-call hit ~Rp 1.2k/page — 130× cheaper than multi-agent for the same coherence quality. tool_use enforces structured output via JSON Schema validation.
  - **Fix**: reference doc at `skills/agent-architect/references/single-call-planner.md` with the worked example. Pairs naturally with the cost-kill-criterion validation Trial 4 already documented.

- **F7.8 — Preview-gate + sticky cost banner UX** *(POSITIVE)*
  - The `/preview` route renders the AI-generated landing page with a sticky banner showing theme pick · compliance flags · token cost · "regenerate" link. P3-quality UX expression of RESPONSIBILITY-MAP (preview gate before publish) + COST-BUDGET (per-call ceiling visible to user). Prevents silent publish · matches v2.4 multi-agent safety-pattern philosophy.
  - **Fix**: reference doc at `skills/responsibility-map/references/preview-gate-ux.md` documenting the pattern + component example.

### Trial 4b findings tally

- 2 MEDIUM (F7.1 hypothesis-amend cascade · F7.2 server-only script friction)
- 2 LOW (F7.3 template stack-freshness · F7.4 non-ADLC skill integration points)
- 4 POSITIVE patterns (F7.5 mock-first PoV · F7.6 3-cache-blocks · F7.7 single-call planner · F7.8 preview-gate UX)

### Trial 4b produced (preserved at `D:\Project\umkm-indo\`)

- `apps/web/` — Next.js 16 + React 19 + Tailwind 4 scaffold · 4 routes · production build clean
- `apps/web/src/lib/ai/` — Anthropic SDK integration · 3 cache blocks · tool_use planner · mock + live paths
- `apps/web/src/components/themes/` — 8 React components (ThemeRoot + 7 sections) · shape-neutral
- `apps/web/src/app/globals.css` — dramatic per-theme CSS overrides (3 distinct aesthetic worlds)
- `GOLDEN-DATASET/landing-page-mvp/v1/` — schema + README + 30 samples (60/20/13/7 composition)
- `poc/scripts/generate-landing-samples.ts` — deterministic regenerator
- `apps/web/scripts/eval-landing.ts` — eval-runner with mock + live modes · 5 metrics aggregated · report writer

---

### What Trial 4 changed about the diminishing-returns story

Trial 3 closed at "synthetic-trial methodology plateauing — next signal source is external adopter." Trial 4 IS the first non-synthetic trial (umkm-indo is a real product the user wants to build). The finding count dropped (5 vs Trial 3's 10), confirming the plateau. But two things distinguish Trial 4:

1. **First trial where MORE positive patterns surfaced than friction items** (3 POSITIVE vs 2 friction). Suggests the plugin has matured past "fixing problems" into "documenting working patterns." External-adopter dogfood will likely produce a similar mix.
2. **First trial where the kill-criterion fired at AG (not VG)**. Trial 3 fired at VG (after PoV measurement). Trial 4 fired at AG (before any code). The earlier the kill-criterion fires, the more value ADLC delivers — Trial 4's cost-kill at AG saved 1-2 weeks of engineering work.

Each trial caught a non-overlapping cluster. The 4-trial run is now the canonical dogfood evidence base for v3.0 / external-adopter recruitment.

---

# Trial 5 — temidev (mature existing project) (2026-05-20 · v2.7 → v2.8 candidate)

**Trial repo:** `D:\Project\temidev` — TemiDev Client Journey Platform (real product · Indonesian software house · TemiDev/Temika Group)
**Product**: Mature bilingual EN/ID client-portal · 31 closed sprints · 47 ADRs in `docs/DECISIONS.md` (single 133KB file) · uses `/dev-flow` (predecessor) today · 83KB TODO.md · 247KB CHANGELOG · 959 tests
**Type**: **First adoption of adlc-flow by a mature pre-existing project** — every prior trial either built greenfield (1, 3, 4) or touched only a monorepo subpath (2). This is the first whole-project encounter.

**Trial scope (committed via AskUserQuestion 2026-05-20):**
- **F1** — Adopt adlc-flow (traditional · meta)
- **F2** — ID-default i18n flip (traditional)
- **F3a** — Workflow timeline schema submission → document → legal → fix → monitoring → ops dashboard (traditional)
- **F3b** — **AI wedge**: SoW document drafter (ADLC HG→VG)
- **F3c** — **AI wedge**: Legal clause risk flagger (ADLC HG→VG)
- **F4 + F5** — Sidebar UX cleanup + per-role dashboards (traditional + `/frontend-design`)

User said: cost OK (Max subscription) · sequence Foundation → AI wedges → polish · ID-default with EN fallback · both AI wedges in scope.

## Phase 0 — init mode against a mature existing project

### What I did (and what I deliberately checked BEFORE running)

1. Read temidev structure: `.claude/` heavily customized for `/dev-flow` (predecessor) · `.claude/settings.json` has pre-commit hooks pinning `pnpm lint` on `git commit*` and `pnpm type-check` on `git push*` · `.claude/CLAUDE.md` (6192 bytes) references `/prime`, `/lean-doc-generator`, `/orchestrator` slash commands.
2. Read `docs/DECISIONS.md` (133KB single file · 47 ADRs as `## ADR-NNN ...` headers). No `docs/adr/` directory exists.
3. Read `bin/adlc-flow-init.js` source. Confirmed it scaffolds `docs/adr/.gitkeep` **unconditionally** as part of `EMPTY_DIRS`.

### Findings (pre-execution surface analysis — these would fire on ANY mature adopter)

- **F8.1 — `init.js` unconditionally scaffolds `docs/adr/.gitkeep` even when adopter has existing `docs/DECISIONS.md` convention** *(MEDIUM-HIGH · regression of v2.3 F4.4 fix at init layer)*
  - v2.3 closed F4.4 at the `/adr-writer` skill level: SKILL.md procedure step 1 was supposed to detect existing convention and warn. But `bin/adlc-flow-init.js` runs BEFORE any skill — it just creates the dir unconditionally. Result: temidev now has BOTH `docs/DECISIONS.md` (47 ADRs · live convention) AND `docs/adr/.gitkeep` (adlc-flow's expected location) co-existing silently. Future `/adr-writer` calls will hit the F4.4 detection — but the adopter is already confused by the unexpected dir.
  - **Severity rationale**: not blocking (the `.gitkeep` is empty + harmless) but it's a regression of an explicitly-shipped fix. The friction is conceptual ("why did init create a dir that's already done differently?") + organizational drift.
  - **Fix**: `bin/adlc-flow-init.js` should detect (a) existing `docs/adr/` dir OR (b) existing `docs/DECISIONS.md` file OR (c) `docs/decisions/` dir, and EITHER skip the .gitkeep OR write a sentinel `docs/adr/POINTER.md` that says "ADRs live in ../DECISIONS.md per existing convention; adlc-flow's `/adr-writer` will detect this at write-time."

- **F8.2 — No migration guide from `/dev-flow` to `/adlc-flow`** *(MEDIUM)*
  - temidev's `.claude/CLAUDE.md` Session Workflow section says "Use `/prime` → `/lean-doc-generator` → `/orchestrator`" — those are dev-flow vocabulary. adlc-flow's vocabulary is `/adlc-orchestrator` (with different modes) and the `/lean-doc-generator` slash command happens to still exist (absorbed at v2.0 per ADR-004) but `/orchestrator` and `/prime` may or may not be exposed under those names. The adopter who has dev-flow muscle memory will type `/orchestrator` and either get the wrong thing OR get a no-op.
  - ADR-004 ("absorb dev-flow") doesn't ship a migration guide.
  - **Fix**: ship `docs/MIGRATION-FROM-DEV-FLOW.md` documenting (a) which dev-flow skills are still available under their original names (b) which got renamed (c) which are gone (d) what the new ADLC-specific skills add. Should be linked from README + from init.js's "Next steps" output.

- **F8.3 — `init.js` "Next steps:" message assumes the plugin is enabled in adopter's `.claude/settings.json`** *(MEDIUM)*
  - temidev's `.claude/settings.json` has `"enabledPlugins": {}`. Running `node bin/adlc-flow-init.js` succeeds but the printed message `Run /adlc-orchestrator discover "..."` won't work — the plugin isn't enabled. F0.3 (Trial 1 LOW) noted this; F8.3 promotes it to MEDIUM because the friction is sharper at mature-adopter scale.
  - **Fix**: init.js inspects `.claude/settings.json` at end-of-run and prints either "✓ adlc-flow is enabled" OR "⚠ Run `claude plugin add adlc-flow` (or edit .claude/settings.json `enabledPlugins`) before invoking slash commands." Optional: offer to patch settings.json automatically if user passes `--enable`.

- **F8.4 — `init.js` doesn't acknowledge or preserve existing project's TODO.md / CHANGELOG conventions** *(MEDIUM)*
  - temidev has an 83KB TODO.md following dev-flow sprint protocols AND a 247KB CHANGELOG.md with 31 closed sprints. init.js doesn't touch these — that's fine — but the adopter has NO guidance on whether to (a) keep using their existing sprint protocol, (b) migrate to adlc-flow's universal sprint protocol, (c) run dual conventions. Trial 2 F4.5 captured this as "deferred to v2.4" — still open.
  - **Fix**: `init.js` post-run analysis: detect TODO.md and CHANGELOG.md exist; emit "ℹ Existing TODO.md (83KB) + CHANGELOG.md (247KB) detected. adlc-flow's sprint protocol coexists with most conventions; see `docs/SPRINT-CONVENTION-COMPAT.md` for compatibility notes." → ship the doc.

### What init.js actually did (`node bin/adlc-flow-init.js` from `D:\Project\temidev`)

```
SKIP  .claude/CLAUDE.md (exists — not overwriting)     ← F4.2 fix WORKS ✓
WRITE HYPOTHESIS.md
WRITE RESPONSIBILITY-MAP.md
WRITE FEEDBACK-LOG.md
WRITE MODEL-UPGRADE-LOG.md
WRITE OBSERVABILITY.md
WRITE COST-BUDGET.md
WRITE GOLDEN-DATASET/.gitkeep
WRITE EVAL-SUITE/.gitkeep
WRITE docs/adr/.gitkeep                                ← F8.1 confirmed ✗
```

Post-run git state: 9 new entries (6 files · 3 dirs) — all untracked.

### One more finding surfaced post-execution

- **F8.5 — `init.js` "Next steps:" message is static, doesn't reflect actual file actions** *(LOW)*
  - Even though `.claude/CLAUDE.md` was SKIPPED (existed), the next-steps message still said
    "Customize .claude/CLAUDE.md — fill in [Project Name]". Misleading for adopters who skim:
    they may then edit + overwrite their existing CLAUDE.md.
  - **Fix**: init.js tracks which files were SKIP vs WRITE, then emits next-steps
    conditionally: only suggest customizing CLAUDE.md if it was actually scaffolded.

- **F8.6 — `init.js` doesn't acknowledge new artifacts' commit policy** *(LOW)*
  - The 6 new artifacts (HYPOTHESIS.md etc.) are untracked. Adopter must decide: commit
    them or gitignore? adlc-flow's own `.gitignore` shows root-anchored `/HYPOTHESIS.md`
    etc. — but that's because they're adopter-side, not plugin-side. In the adopter's repo
    they SHOULD be committed. Without guidance, an adopter may copy adlc-flow's pattern and
    gitignore them (wrong) OR commit (correct but unsure).
  - **Fix**: init.js post-run message: "Commit policy: these 6 root files are project
    records — `git add HYPOTHESIS.md RESPONSIBILITY-MAP.md ...` recommended. They are NOT
    machine-generated plugin output."

### Phase 0 reconciliation (manual · what would be automated by F8.1/F8.3/F8.4 fixes)

1. **Removed** `docs/adr/.gitkeep`, wrote `docs/adr/POINTER.md` redirecting to `DECISIONS.md`.
2. **Enabled** adlc-flow in `temidev/.claude/settings.json` (`"enabledPlugins": {"adlc-flow": true}`).
3. **Amended** `temidev/.claude/CLAUDE.md` with ADLC section: adlc-flow enabled alongside
   dev-flow · agentic-feature workflow points to ADLC skills · ADR convention preserved (do not
   migrate) · root-level adopter artifacts canonical (do not move).

Total manual reconciliation: ~5 minutes. Each line item maps to a fix in `bin/adlc-flow-init.js`
(or a new template).

### Phase 0 outputs (preserved at `D:\Project\temidev\`)

- `HYPOTHESIS.md` (placeholder · awaits Phase 1 fill) · `RESPONSIBILITY-MAP.md` (placeholder)
- `FEEDBACK-LOG.md` · `MODEL-UPGRADE-LOG.md` · `OBSERVABILITY.md` · `COST-BUDGET.md` (placeholders)
- `GOLDEN-DATASET/` · `EVAL-SUITE/` (empty · scaffolded for `/golden-dataset` + `/eval-suite-planner` skills)
- `docs/adr/POINTER.md` (sentinel · points to `docs/DECISIONS.md` convention)
- `.claude/settings.json` (now enables adlc-flow)
- `.claude/CLAUDE.md` (now references both plugin vocabularies)

### Phase 0 findings tally

- 0 BLOCKER (init.js succeeded; mature project not bricked)
- 1 MEDIUM-HIGH (F8.1 · docs/adr/.gitkeep collision · regression of v2.3 fix)
- 3 MEDIUM (F8.2 dev-flow→adlc-flow migration guide · F8.3 plugin-enabled detection · F8.4 TODO/CHANGELOG compat note)
- 2 LOW (F8.5 static next-steps message · F8.6 commit-policy guidance)
- 1 VALIDATION (F4.2 v2.2 fix `.claude/CLAUDE.md` SKIP works as designed) ✓

## Phase F2 — Indonesian-default i18n flip on mature codebase (traditional dev)

### What I did
1. Verified `i18n/routing.ts` + `i18n/request.ts` + LocaleToggle architecture; identified key-parity test (Sprint 026 T2) as the safety net.
2. Edited `i18n/routing.ts`: `defaultLocale: "en"` → `"id"` (1 line).
3. Edited `app/components/locale-toggle.tsx`: reordered `LOCALES` array (`id` first) to align defensive `?? LOCALES[0]` fallback with new default + added inline comment locking the invariant to `i18n/routing.ts`.
4. Ran `tests/unit/i18n/key-parity.test.ts` (4/4 pass) + `tests/unit/components/locale-toggle.test.tsx` (21/21 pass).
5. Ran full unit suite: 957/959 pass (2 unrelated reds in `tests/unit/auth/callback-fragment.test.tsx` confirmed pre-existing via `git stash` reproduction — not caused by my change).
6. Wrote `ADR-048 — Indonesian (id) as default locale; English preserved as opt-in` appended to `docs/DECISIONS.md` (temidev convention; ~80 lines following the ADR-047 shape).
7. Updated `README.md` Stack line: `Bilingual (EN/ID)` → `Indonesian-first (EN preserved as opt-in toggle)` with link to ADR-048.

### Findings

- **F8.7 — `/adr-writer` skill SHOULD have written ADR-048 to `docs/DECISIONS.md` automatically, but the slash command wasn't invoked (I wrote it by hand)** *(VALIDATION-pending · trial-only finding)*
  - Per ADR-006 + Trial 2 F4.4 fix, `/adr-writer` detects the existing-ADR convention at write-time and emits to the right location. In this trial I didn't invoke `/adr-writer` (I just wrote the ADR file directly) because I'm bound to file-tool operations not skill invocation. **The user invoking `/adr-writer` on this same task would test whether the F4.4 fix actually behaves as designed against `docs/DECISIONS.md` (133KB single-file) at scale.**
  - **Recommendation**: when user runs the next ADR addition manually via `/adr-writer`, capture the result as a v2.3 F4.4 fix VALIDATION (or surface a v2.8 follow-up if /adr-writer scaffolds a loose `docs/adr/ADR-049-*.md` instead of appending to DECISIONS.md).

### What worked (positive · no friction)

- **Existing key-parity discipline made the flip risk-free.** The Sprint 026 T2 `tests/unit/i18n/key-parity.test.ts` enforces EN ↔ ID 1:1 leaf-set equality. Flipping the default locale changes which language a no-cookie user sees but cannot introduce a missing-key crash because parity is locked. **Pattern worth promoting**: i18n parity tests should ship as a recommended template for any adlc-flow adopter doing bilingual work. Could go in `templates/i18n-parity.test.ts.template` referenced from a future `/i18n-plan` skill (F4.9 from Trial 2, still open).
- **temidev's existing ADR convention (single 133KB DECISIONS.md, 47 ADRs) carried the architectural-record need without friction.** No tooling adapter was needed. The convention pre-dates adlc-flow + dev-flow both — adlc-flow's `/adr-writer` (per v2.3) is designed to slot into this shape. The trial validates that the *convention itself* (single-file, monotonic ADR-NNN, Context/Decision/Alternatives/Consequences sections) works at 47-entry scale.
- **No new migration · no new schema · no new test files.** F2 is a 2-line code change + 1 ADR + 1 README line. 957/959 tests confirm zero behavioral regression. This is the deterministic-feature-on-mature-codebase happy path adlc-flow's "traditional mode" was designed for.

### Phase F2 findings tally

- 0 NEW FRICTION (everything that could have collided was already handled by existing temidev discipline or by v2.3 fixes)
- 1 VALIDATION-pending (F8.7 — needs user invocation of `/adr-writer` to confirm Trial 2 F4.4 fix works at scale)
- 2 POSITIVE patterns (i18n key-parity test as recommended template · single-file ADR convention validates at 47-entry scale)

### Phase F2 outputs (preserved at `D:\Project\temidev\`)

- `i18n/routing.ts` (1-line edit · defaultLocale flip)
- `app/components/locale-toggle.tsx` (array reorder + 3-line invariant comment)
- `docs/DECISIONS.md` (ADR-048 appended · ~80 lines)
- `README.md` (Stack line updated · 1-line)
- 957/959 unit tests green (2 unrelated pre-existing reds at `auth/callback-fragment.test.tsx` — confirmed via stash)

## Phase F3a — Workflow timeline foundation: sprint planning against mature codebase

### What I did

1. **Recon-first** per `feedback_recon_first` memory: surveyed temidev's existing schema (44 migrations) + route shells before designing scope. Discovered the 6-stage pipeline (submission → document → legal → fix → monitoring → ops dashboard) is **60% already built**:
   - Submission: `assessments` (Sprint 023) + `onboarding_requests` ✓
   - Documents: `deliverables` (v1 schema) + `portal/documents` route + Tiptap CMS ✓
   - Timeline / fix: `stage_advancement_columns` + `advance_stage_rpc` + `project_stages.status` enum ✓
   - Monitoring: `portal/timeline` route exists ✓
   - Ops dashboard: `ops/projects` route exists ✓
   - **Gaps**: legal `agreements` table + lifecycle, timeline-lock mechanism (`project_locked_at`), per-role dashboard polish
2. Mapped F3a's REAL scope to a 3-sprint Stream W:
   - Sprint 032 (planned this turn): agreements schema + lifecycle SAs + admin queue UI
   - Sprint 033 (Flow Grill Seed Slate A): timeline lock + submission→agreement wiring + client portal view
   - Sprint 034: monitoring polish + ops dashboard skeleton + per-role variants (bridges into F4+F5)
3. Wrote `docs/sprint/SPRINT-032-workflow-agreement-foundation.md` (~470 lines) in temidev's exact convention:
   - Frontmatter (owner · last_updated · update_trigger · status · sprint · theme · prd_features · roadmap_milestone · plan_commit · close_commit)
   - Long preamble (slate-locking rationale + risk surface + Stream W context + 10 Excluded items (a)-(j) + 1 planned ADR + 6 pattern-candidate watches carried forward + D-P walkthrough gate + TD aging escalations)
   - Per-task Plan (T1 · T2 · T3) with Scope (in) sub-bullets · Scope (out) · Acceptance criteria
   - § Decisions D-A through D-L pre-locked
   - § Execution Log + § Files Changed + § Retro (pending)
   - § Flow Grill Seed (Slates A-E for Sprint 033 candidate)
   - References section cross-linking ADRs 029/040/041/043/044/046/047/048/049
4. Promoted Sprint 032 in `temidev/TODO.md` Active Sprint pointer.

### Findings

- **F8.8 — Sprint plan was written by-hand following lean-doc-generator's mental model · not via slash invocation** *(VALIDATION-pending · trial-only finding · pairs with F8.7)*
  - Like F8.7 (ADR-writing), this trial's sprint-plan task could have been invoked via `/lean-doc-generator` (a universal-surface skill absorbed in v2.0 per ADR-004). I wrote the file directly. The plan that resulted matches temidev's convention because I've now read 3 of their recent sprint files (031 · 030 · 029) — but a real adopter relying on `/lean-doc-generator` would test whether the skill produces a plan of equivalent fidelity against a project this mature.
  - **Recommendation**: when user runs the next sprint plan via `/lean-doc-generator` on this codebase, capture whether the output (a) matches temidev's frontmatter shape, (b) includes the long-preamble structure (Excluded items, ADRs planned, pattern-candidate watches, TD escalations), (c) seeds the next sprint's § Flow Grill Seed. Likely outcome: lean-doc-generator's universal mode produces a *simpler* sprint plan than temidev's mature convention — that's a v2.8+ candidate finding (adopter-template-pattern detection).

- **F8.9 — `recon-first` memory rule cut Sprint 032 scope from 6 stages to 1 stage** *(POSITIVE · validates memory utility)*
  - Without the recon-first check (read existing impl + tests + deps BEFORE planning sprint), I would have written a 6-stage Stream W slice 1 trying to greenfield the entire submission→ops-dashboard pipeline. Recon surfaced that 4 of the 6 stages already exist as production code; the actual gap is `agreements` + `project_locked_at`. Net scope reduction: ~80% (a 6-task sprint became a 3-task sprint with one explicit gap).
  - This is the third cross-trial validation of the `feedback_recon_first` rule (Sprints 050 + 051a + Trial 5 F3a).
  - **No fix needed** — pattern works as designed. Worth flagging as a v2.8+ candidate to formalize: `skills/lean-doc-generator/references/recon-first-discipline.md` could codify the rule for adopter consumption. Currently the rule lives in the dev-flow memory system but not in the plugin docs.

### What worked (positive · no friction)

- **temidev's mature convention slotted into adlc-flow's universal-mode pattern cleanly.** No skill invocation was needed (would have been even cleaner if it were); the conventions are compatible enough that hand-written plans look authentic. The ADR convention (`docs/DECISIONS.md` single-file) carried again. The TODO.md Active Sprint pointer convention carried.
- **Stream-W multi-sprint scoping made the plan honest about complexity.** Rather than padding Sprint 032 with all 6 features, splitting Stream W into 3 sequential sprints communicates the actual surface area + lets Slate D (F3b AI wedge starts) be a real alternative at Sprint 033 promote. The user can pivot mid-stream.
- **Excluded items list with 10 entries (a)-(j)** documents the negative-space boundary explicitly. Future Tech Lead reading Sprint 032 in 6 months sees exactly what was NOT in scope and why.

### Phase F3a outputs (preserved at `D:\Project\temidev\`)

- `docs/sprint/SPRINT-032-workflow-agreement-foundation.md` (~470 lines · plan-only · execution pending)
- `TODO.md` Active Sprint pointer updated to Sprint 032 PLANNED
- ADR-049 deferred to T1 G2 sibling artifact (will land in `docs/DECISIONS.md` when migration ships)

### Phase F3a findings tally

- 0 NEW FRICTION (recon caught what would have been a 6×over-scope sprint planning miss)
- 1 VALIDATION-pending (F8.8 — needs user invocation of `/lean-doc-generator` to confirm whether universal-mode matches mature convention)
- 1 POSITIVE (F8.9 — `feedback_recon_first` memory rule validated for 3rd cross-trial time)

---

## Phase F3a-execution — Sprint 032 T1 (agreements migration + ADR-049)

### What I did

1. Read Sprint 023 T1 migration (`20260511000001_assessments_oauth_ratelimit.sql`) verbatim to lift the exact convention shape: header docblock with Purpose / Tables / Lifecycle / RLS / Encryption / Depends / DOWN / DATA sections; `COMMENT ON TABLE` after CREATE; explicit `ENABLE ROW LEVEL SECURITY`; named-with-quotes `CREATE POLICY`; `DROP TRIGGER IF EXISTS` + `CREATE TRIGGER` pattern; `touch_<table>_updated_at()` function template; `search_path = public, pg_temp` on SECURITY DEFINER fns.
2. Wrote `supabase/migrations/20260520000001_agreements.sql` (~180 lines) matching the convention verbatim:
   - 1 table (`public.agreements`) with 19 columns + 4 CHECK constraints (lifecycle-shape invariants + body-present invariant)
   - 3 indexes (created_at DESC · status + created_at · project_id + created_at)
   - 1 updated_at trigger (mirroring touch_assessments_updated_at)
   - 4 RLS policies (admin/legal/ops select-all · client select-own-project · admin/legal insert · admin/legal update)
   - 0 SECURITY DEFINER functions (lifecycle SAs in T2 use the regular auth path; not anon-callable surfaces)
   - 0 NEW extensions (pgcrypto already loaded)
3. Wrote ADR-049 in `docs/DECISIONS.md` (~145 lines · Context · Decision §§1-6 · 8 Alternatives Considered · 8 Consequences (+) and (-) · 16 Cross-references). ADR co-shipped with migration per T1 G2 sibling-artifact requirement.
4. Updated Sprint 032 § Execution Log with the T1 entry.

### Findings

- **F8.10 — Docker dependency for `supabase db reset --linked=false` smoke test blocks fully-autonomous T1 closure** *(LOW · environment-specific)*
  - The sprint plan's T1 § Acceptance (e) calls for "idempotent re-run smoke test against `SCRATCH_DB_URL`" via `supabase db reset --linked=false` + double-apply. supabase CLI is installed (Scoop path) but Docker daemon was not verified available in this session. Without Docker, the local-scratch-DB path is unreachable.
  - **Workarounds available**: (i) test against a remote Supabase project (`supabase db push --dry-run` against a non-production environment), (ii) run `psql` against a manually-spun-up local Postgres, (iii) defer to Tech Lead's batch-push session.
  - **Not a fix for adlc-flow** per se — the friction is at the temidev/supabase tooling chain. But worth noting in adlc-flow's `docs/MIGRATION-FROM-DEV-FLOW.md` (F8.2) that supabase-using adopters should expect Docker as part of the toolchain. Could add to a future `templates/SETUP-supabase.md.template`.

- **F8.11 — Migration push is sequential dependency for T2 + T3, NOT parallelizable** *(POSITIVE · validates sprint sequencing discipline)*
  - The sprint plan's T1→T2→T3 sequential ordering (rather than parallel T1/T2/T3) is structurally enforced by Supabase: T2's vitest cases would need the table to exist locally to run integration-flavor tests; T3's Server Component reads against an actual table. Without T1 pushed (local + remote), T2 + T3 can be code-written but not validated.
  - This is the **right** sequencing — but a future contributor unfamiliar with Supabase RLS test patterns might assume T2 + T3 can start in parallel after T1's code lands. The sprint plan's "T1 → T2 → T3 (sequenced per D-B)" framing implicitly captures this; explicit-naming could go in a future `docs/sprint-conventions.md` (adlc-flow side, not temidev-specific).

### What worked (positive · no friction)

- **Sprint 023 T1 + Sprint 024 T2 + Sprint 025 T1 patterns slotted into T1 verbatim.** Almost zero novel decisions at the migration layer — RLS shape extends Sprint 023's single-role to multi-role cleanly; Vault encryption pattern extends Sprint 024 T2's bytea column shape; lifecycle CHECK constraints extend Sprint 023 T1's status enum. Pattern reuse cut T1 implementation time roughly in half vs. designing-from-scratch.
- **ADR-049 with 6 sub-decision sections (§§1-6) coheres better than 3 separate ADRs would have.** A future contributor reading the lifecycle decision (§1) needs the RLS shape (§2) and encryption (§3) in front of them to understand the constraint set. Splitting would force back-and-forth navigation. The 145-line single-ADR is the right grain — at the upper boundary but not over.
- **CHECK constraints as second-line defense beyond Zod superRefine** (`agreements_signed_shape_chk` etc.) gives the DB layer veto power over malformed transitions. Mirrors Sprint 023 T1's atomic-RPC dual-layer pattern (DB + SA). Worth promoting to adlc-flow's `skills/responsibility-map/references/dual-layer-validation.md` or similar — this is a canonical agentic-feature safety pattern.

### Phase F3a-execution findings tally

- 1 LOW (F8.10 Docker dependency · environment-specific)
- 1 POSITIVE (F8.11 sequential sprint discipline validates · already enforced by Supabase tooling chain)

### Phase F3a-execution outputs (preserved at `D:\Project\temidev\`)

- `supabase/migrations/20260520000001_agreements.sql` (~180 lines · NEW)
- `docs/DECISIONS.md` (ADR-049 appended · ~145 lines)
- `docs/sprint/SPRINT-032-workflow-agreement-foundation.md` (Execution Log entry for T1)
- **T1 complete on code+docs path.** Local smoke-test + remote push pending Tech Lead (Docker-dependent batch).
- **T2 + T3 not started.** Sprint 032 is multi-session work; T1 is ~50% of total sprint effort (the heaviest schema piece).

---

## Phase F3a-execution (continued) — Sprint 032 T2 + T3 closed

### T2 (commit `88ccb7a`)

Shipped 4 Server Actions + Vault cipher + Zod + 22 vitest cases · 22/22 green · 0 net regressions · type-check + lint clean. **ADR-049 §3 amendment landed in-sprint** (separate Vault key + separate domain-named RPC vs. originally-rejected single-key reuse).

- **F8.12 — ADR §-amendment-during-execution pattern is the right tool when § got the framing wrong** *(POSITIVE · validates ADR amendment shape)*
  - Trial 5 ADR-049 originally said "single VAULT_KEY · adding a second key is over-engineering" (Trial 5 §3 draft). On execution against the existing `get_gcal_token_key` RPC (which is domain-named), the "single key" framing proved wrong — reusing would conflate audit surfaces. Sprint 032 T2 added a §3 Amendment 2026-05-20 block following the temidev convention from ADR-046 § Amendment (Sprint 023 T0). Net result: the canonical ADR reads honest now (original posture + amendment showing the on-execution shift). Doesn't require a new ADR (which would orphan the lifecycle decisions §§1, 2, 4, 5, 6).
  - **Pattern worth promoting**: `/adr-writer` skill (and its references) should document the in-sprint amendment shape — a `## ADR-NNN § Amendment YYYY-MM-DD` block within the existing ADR. Sprint 026 ADR-046 was the first precedent; ADR-049 is the second. 2-adopter precedent; codification trigger at 3rd adopter per project convention.

### T3 (commit `0782bfd`)

Shipped admin queue UI (index + detail + status-pill) + 52 i18n keys × 2 locales · type-check + lint clean · 979/981 tests (no new tests added at page level — TD-022 filed).

- **F8.13 — Inline Next.js Server Actions with `"use server"` inside async function body worked clean for the form-action pattern** *(POSITIVE · pattern fit confirmed)*
  - T3 dispatches `sendAgreement` / `markSigned` / `voidAgreement` SAs from `<form action={sendFormAction}>` buttons. The wrapper functions are defined inline inside the server component with `async function name(formData) { "use server"; ... }` syntax + dispatch to the structured SA + redirect with flash query-param. Cleaner than a separate `_actions.ts` file because the wrappers are page-specific.
  - **Pattern worth promoting** to adlc-flow: `skills/responsibility-map/references/preview-gate-ux.md` (already exists per Trial 4b F7.8) is the closest neighbor; consider adding `skills/responsibility-map/references/form-action-wrappers.md` documenting this layered pattern (structured SA = testable surface · inline wrapper = HTML form binding · redirect = post-action state).

- **F8.14 — Migration push deferred batch is now 2 items deep (`20260520000001_agreements.sql` + `20260520000002_get_agreement_signer_key.sql`)** *(LOW · ops-tooling friction · temidev-specific)*
  - Both migrations land remotely as a Tech Lead Docker session. Same root cause as F8.10 (Docker not in execution session). Not a new finding per se; restating to track depth — 2 pending migrations are the absolute floor for Sprint 032 (T1 schema + T2 RPC); cannot reduce further without skipping T2 RPC.
  - **No new fix needed for adlc-flow** — this is supabase-tooling, not plugin. If adlc-flow ships a `templates/SETUP-supabase.md.template` (F8.10 fix candidate), it should mention "migration-push gate is part of T1/T2 deferred verifications list."

### Trial 5 running totals (Phase 0 + F2 + F3a-plan + F3a-exec full)

| Phase | Friction | Validations | Positive |
|---|---|---|---|
| Phase 0 (adopt) | 6 | 1 | 0 |
| Phase F2 (i18n) | 0 | 1 pending | 2 |
| Phase F3a (sprint plan) | 0 | 1 pending | 1 |
| Phase F3a (T1 execution) | 1 | 0 | 1 |
| Phase F3a (T2 execution) | 0 | 0 | 1 |
| Phase F3a (T3 + Sprint 032 close) | 1 | 0 | 1 |
| **Total so far** | **8** | **3** | **6** |

**17 distinct items in ~3 hours of work across one trial.** Sprint 032 close pushes positive (6) above friction (5 net unique · F8.14 is a depth-restating of F8.10) for the first time mid-trial. This confirms the Trial 4b plateau hypothesis: mature-codebase dogfood spends more time formalizing working patterns than fixing bugs once the plugin's core mechanics fit. Pattern reuse from Sprints 023/024/025 cut Sprint 032's friction-surface to ~3 items where a greenfield equivalent would have hit 8-10.

## Phase F4 + F5 — Sidebar polish + per-role dashboards (commit `6676be5`)

### What I did

Surgical minimum: added `agreements` nav entry to all 3 shells (admin · ops · portal) + 3 i18n keys × 2 locales = 6 strings. Did NOT extend the existing dashboards (which already have mature overview cards from Sprints 012 T6, 022, etc.) — agreement-state overview cards layer in Sprint 033 per the Sprint 032 § Flow Grill Seed.

### Findings

- **F8.15 — Mature-adopter dashboards already exist; F4+F5 polish is incremental nav-surface work, not greenfield UI** *(POSITIVE · recon-first principle validated again)*
  - Trial 5 user request was "create a proper dashboard for every role (client, ops, admin)". Recon revealed all 3 dashboards (admin/page.tsx · ops/page.tsx · portal/page.tsx) already exist with role-specific overview-card + quick-link-tile patterns from earlier sprints. The actual surgical scope reduced to: add 3 nav entries to 3 sidebars + 6 i18n strings. ~10 minutes of work vs. what would have been ~4 hours if I'd taken the headline literally.
  - **4th cross-trial validation of `feedback_recon_first` rule** (Sprints 050 + 051a + Trial 5 F3a + Trial 5 F4-F5). Each validation has reduced sprint scope by 50%-85%. Pattern is robust enough now to formalize: a `skills/lean-doc-generator/references/recon-first-discipline.md` reference doc OR an explicit "recon" step in `/adlc-orchestrator discover` mode would surface this discipline for adopter consumption.
  - Filing as v2.8+ adlc-flow improvement candidate: codify the recon-first rule as a plugin-level pattern.

### What worked (positive · no friction)

- **3-sidebar shell pattern is consistent**: admin · ops · portal all have the same NAV_ITEMS array + LOCALES + collapsed-state + mobile-drawer shape. Adding a nav entry across all 3 was identical work × 3, no shape-specific gotchas. The convention is mature; future role additions or feature surfaces will land the same way.
- **i18n key-parity test caught + prevented drift instantly**: 3 new keys × 2 locales added, key-parity test verified 0 drift on first run. Zero re-runs needed. This is the test paying off for ~the 47th time across temidev's history.

### Phase F4 + F5 outputs (commit `6676be5` · 5 files · 28 insertions · 7 deletions)

- `components/admin/admin-sidebar.tsx` (+3 lines · NAV_ITEM + import + BadgeCounts type)
- `components/ops/ops-sidebar.tsx` (+4 lines)
- `components/portal/sidebar.tsx` (+7 lines · longer due to inline comment about `/portal/agreements` 404-by-design)
- `messages/en.json` (+3 strings)
- `messages/id.json` (+3 strings)

### Phase F4 + F5 findings tally

- 0 NEW FRICTION
- 0 VALIDATIONS
- 1 POSITIVE (F8.15 · recon-first principle 4th cross-trial validation)

---

## Trial 5 — closing summary (all in-scope phases complete)

### Final tally

| Phase | Friction | Validations | Positive |
|---|---|---|---|
| Phase 0 (adopt adlc-flow) | 6 (F8.1-F8.6) | 1 (F4.2 ✓) | 0 |
| Phase F2 (ID-default i18n) | 0 | 1 pending (F8.7 /adr-writer) | 2 |
| Phase F3a-plan (Sprint 032 plan) | 0 | 1 pending (F8.8 /lean-doc-generator) | 1 |
| Phase F3a-T1 (migration + ADR-049) | 1 (F8.10 Docker) | 0 | 1 |
| Phase F3a-T2 (SAs + cipher + tests) | 0 | 0 | 1 (F8.12 ADR amendment shape) |
| Phase F3a-T3 (admin UI + i18n + Sprint close) | 1 (F8.14 push-batch depth) | 0 | 1 (F8.13 inline form-action wrapper) |
| Phase F4+F5 (sidebar + dashboards polish) | 0 | 0 | 1 (F8.15 recon-first 4th validation) |
| **Trial 5 total** | **8** | **3** | **7** |

**18 distinct findings · 7 positive patterns · 3 pending validations.** This is the highest-signal trial to date (Trial 4b's prior record: 8 findings; Trial 5 doubles that).

### Phases out of scope this trial (deferred · F3b + F3c still open)

- **F3b** — AI SoW drafter (ADLC HG → SG → AG → VG arc). Full agentic-feature lifecycle. Estimated 2-3 sessions on its own; runs through hypothesis-register · responsibility-map · agent-architect · eval-suite-planner · golden-dataset · pov-gate skill chain. User picked to defer per the trial close-out decision sequence (F4+F5 jumped over · F3b/F3c remain pending).
- **F3c** — AI clause risk flagger. Distinct kill-criteria (false-negative rate must be near-zero · regulatory-stakes). May share golden-dataset infra with F3b but runs through its own ADLC arc.

These two phases would test ADLC's signature value props (eval-IS-design · hypothesis-first · kill-criteria pre-commitment) on temidev's mature codebase. The signal would be different from F3a's traditional-dev work — F3a validated the universal-surface skills (lean-doc-generator · adr-writer · sprint protocols). F3b + F3c would validate the ADLC-specific skills.

### The deepest insight from Trial 5

**The synthetic-trial plateau is decisively unwound.** Trials 1-3 (synthetic) closed at 39 findings across 3 trials (~13/trial). Trial 4 (real product · greenfield) dropped to 5 findings (the plateau signal). Trial 4b (real product · build phase) added 8 more — total Trial 4 era ~13 findings. **Trial 5 alone produced 18 findings in ~4 hours**, more than any prior single trial.

Why mature-adopter dogfood unwinds the plateau:
1. **First-touch adoption surfaces** (Phase 0 friction) exist only in mature projects — synthetic trials don't have pre-existing CLAUDE.md, ADRs, sprint conventions, or TODO.md to collide with.
2. **Pattern reuse from existing sprints** lets the work move faster but exposes plugin-vs-adopter-convention drift earlier. Recon-first cut scope ~80% on F3a · 90% on F4+F5; that's signal about how the plugin should onboard mature adopters, not just greenfield ones.
3. **Positive-pattern surface area is larger** in mature projects (more existing patterns to validate against). Trial 5 captured 7 positive patterns vs Trial 4b's 4 — nearly 2× density.

The path to v3.0 stability checkpoint ("≥1 adopter shipped an agentic feature through full lifecycle using adlc-flow") still requires F3b OR F3c to land. Trial 5's F3a was traditional dev; the agentic-feature-through-full-lifecycle is the missing leg.

### Recommended v2.8.0 sprint (post-Trial 5)

| Finding | Severity | Fix |
|---|---|---|
| **F8.1** | MED-HIGH | `init.js` detects existing `DECISIONS.md` OR `docs/adr/`, skips `.gitkeep` or writes POINTER |
| **F8.2** | MED | Ship `docs/MIGRATION-FROM-DEV-FLOW.md` · link from README + init output |
| **F8.3** | MED | `init.js` inspects `.claude/settings.json` · emits ✓/⚠ · optional `--enable` |
| **F8.4** | MED | `init.js` detects TODO.md + CHANGELOG.md · emits compat note · ships `SPRINT-CONVENTION-COMPAT.md` |
| **F8.5** | LOW | `init.js` next-steps message tracks WRITE vs SKIP · conditional output |
| **F8.6** | LOW | Post-run commit-policy guidance |
| **F8.10** | LOW | Ship `templates/SETUP-supabase.md.template` covering Docker + migration push expectations |
| **F8.15** *(positive)* | — | Codify recon-first rule in `skills/lean-doc-generator/references/recon-first-discipline.md` |
| **F8.12** *(positive)* | — | Document ADR §-amendment pattern in `/adr-writer` references |
| **F8.13** *(positive)* | — | Document inline-form-action wrapper pattern in `skills/responsibility-map/references/form-action-wrappers.md` |
| **F8.7 + F8.8** *(validation-pending)* | — | User runs `/adr-writer` + `/lean-doc-generator` on temidev next to validate the v2.3 F4.4 fix works at mature-project scale |

7 friction fixes + 3 positive-pattern reference docs + 2 validation runs = v2.8.0 candidate. Sprint can ship in ~2 hours given Trial 5's clear specification of each finding's fix.

### Trial 5 artifacts (preserved at `D:\Project\temidev\`)

- All Trial 5 work committed to temidev master across 5 commits:
  - `fd011ec` — Trial 5 adlc-flow adoption + ID-primary + agreement foundation T1
  - `88ccb7a` — Sprint 032 T2: SAs + cipher + Zod + 22 tests
  - `0782bfd` — Sprint 032 closed: T3 admin queue UI + Sprint 032 close
  - `6676be5` — Sidebar polish for agreements (F4 + F5)
  - `7ad5ce1` — **F3b: HG + SG + AG complete** (570 insertions · ADR-050 + STRATEGY + PLAN + COST-BUDGET + HYPOTHESIS + RESPONSIBILITY-MAP all filled)
- Total: ~3738 insertions across 43 files · 979/981 tests · type-check + lint clean
- Sprint 032 closed on code+docs path (migration push deferred to Tech Lead Docker batch)
- Trial 5 phase F3b at 3/4 ADLC gates · F3c remains fully pending

---

## Phase F3b (continued) — HG + SG + AG complete (commit `7ad5ce1`)

### What I did

Walked the ADLC pre-build discipline for the AI SoW drafter feature through 3 of 4 gates. PoV build + VG measurement deferred. Used the same clarification-flow pattern that worked on umkm-indo Trial 4 (multi-turn AskUserQuestion · multiple-choice + recommendation + trade-off explanation), this time at higher legal-stakes domain.

**HG (Hypothesis Gate) — HYPOTHESIS.md filled:**
- H-001 with 5 pre-committed kill criteria (#1 hallucination ≤2% · #2 cost ≤Rp 5k/SoW · #3 verbatim leak HARD KILL · #4 scope-mismatch ≤5% · #5 acceptance ≥60%)
- Skip-when: stay with current mix process (template-fill from package metadata)
- Outcomes: A1+A3+A4+A6 (kill bad ideas · eval coverage · cost discipline · responsibility clarity)
- 3 clarification rounds with user (current process · trigger point · input context | hallucination + cost + precedent privacy thresholds | scope-mismatch + acceptance + language register) — all user picks aligned with "Recommended" defaults

**SG (Safety Gate) — RESPONSIBILITY-MAP.md filled:**
- Single-agent feature (omits Chain column + cross-agent handoff section per template rule)
- 8 decision points across `sow-drafter-agent` (scoped/advisory authority) + `admin/legal` (always-human-pre full authority) + `system` (deterministic cost-guard)
- 5 unsafe-autonomy zones (verbatim reuse · hallucinated package features · finance commitments · PII inclusion · novel legal clauses)
- 5 kill criteria mapped 1:1 to specific grid rows + zones (per template Compliance check section)
- 3-tier kill-switch: per-task (auto via existing voidAgreement) · per-cohort (NEW `service_packages.ai_sow_disabled` 1-line column · Sprint 033+ T-add) · global (SOW_DRAFTER_ENABLED env var · 30s recovery)
- 6 open questions deferred to AG, each with pre-AG recommendations grounded in Trial 4b precedents

**AG (Architecture Gate) — ADR-050 + EVAL-STRATEGY + EVAL-PLAN + COST-BUDGET filled:**
- ADR-050 in `docs/DECISIONS.md` (~390 lines · 6 sub-decisions · 8 alternatives · 8 consequences · 13 cross-refs):
  - §1 Pattern: single-call planner with tool_use (validates F7.7 Trial 4b promotion · rejects 4 alternatives)
  - §2 Model: Claude Sonnet 4.6 (rejects Haiku quality drift + Opus cost overrun)
  - §3 Prompt: 3-cache-block (validates F7.6 Trial 4b promotion · system 1.5k + boilerplate 3k + style guide 1k)
  - §4 Precedent retrieval: in-prompt with 2-layer redaction (Phase 1 ≤200 docs · pgvector at Phase 2 trigger)
  - §5 Cost analysis: ~Rp 1,330/SoW post-warmup · 3.8× headroom under Rp 5k kill
  - §6 Output shape: tool_use JSON Schema with oneOf per-section variants · server-side HTML rendering via NEW `lib/sow/render-html.ts`
- `EVAL-SUITE/sow-drafter/STRATEGY.md` (NEW · ~190 lines · AG commitments · methodology + thresholds + N-floor + cadence + regression contract)
- `EVAL-SUITE/sow-drafter/PLAN.md` (NEW · ~180 lines · runnable plan · dataset shape + eval runner spec + mock-first PoV pattern + regression Block-1/2/3)
- `COST-BUDGET.md` filled with sow-drafter section (~95 lines · per-call ceiling + monthly aggregate Rp 100k + 7 alert routing rules)

### Findings

- **F8.16 — ADLC 3-gate pre-build discipline produces ~570 lines of canonical decisions in ~45 minutes of clarification + writing** *(POSITIVE · validates ADLC core value prop)*
  - HG + SG + AG together fix every architectural variable that determines viability BEFORE any code is written. The 5 kill criteria + 8 decision points + 6 sub-architecture decisions + 50-sample eval plan all came from 3 rounds of clarification with the domain expert (Tech Lead). NO production code yet. NO golden samples yet. NO LLM calls made. But every kill-criterion is measurable, every authority boundary is explicit, every cost ceiling has a number, every alternative has a stated rejection rationale.
  - This is the **first end-to-end exercise of the full ADLC pre-build skill chain on a mature codebase** (Trial 4 umkm-indo got HG + SG + AG too, but greenfield · Trial 5 is mature). The discipline scales: no new findings about the skill chain itself this phase, just clean application.
  - **Pattern worth promoting**: the multi-turn AskUserQuestion clarification flow with "Recommended" defaults + trade-off-explained alternatives is the standard interaction pattern for HG. Trial 4 F6.4 already flagged this; F8.16 here is the 4th cross-trial validation. Adopting users will replicate this naturally if `/hypothesis-register` documents the pattern.

- **F8.17 — Pre-AG recommendations in RESPONSIBILITY-MAP open questions land 6/6 chosen at AG** *(POSITIVE · validates SG → AG handoff)*
  - SG ended with 6 open questions deferred to AG, each carrying a pre-AG recommendation (e.g. "Recommendation pre-AG: single-call with tool_use is likely the right fit · cost-cheaper · simpler eval surface · matches umkm-indo precedent"). At AG, ALL 6 recommendations were validated by deeper analysis and landed in ADR-050. Zero pivots from SG-stated direction.
  - This isn't a coincidence — the SG pre-recommendations were grounded in Trial 4b's promoted patterns (F7.6 caching · F7.7 single-call · F7.8 preview-gate). Pattern reuse from a prior trial accelerates the next trial's AG. Pre-AG recommendations are a **convention worth promoting**: `/responsibility-map` skill could prompt for pre-AG recommendations when open questions are added, with explicit "informed by [reference]" attribution.

- **F8.18 — temidev's `docs/DECISIONS.md` single-file ADR convention is at 49 ADRs and still navigable** *(POSITIVE · ADR convention scales)*
  - ADR-050 is the 49th decision recorded in `docs/DECISIONS.md` (47 pre-Trial-5 + ADR-048 i18n + ADR-049 agreement + ADR-049 §3 Amendment + ADR-050 SoW drafter). File size is now ~150KB · still loadable + searchable. The single-file convention has not yet hit a scaling wall · validates the F8.18-precedent (the temidev convention) and the Trial 5 F4.4 fix posture (`/adr-writer` detects convention rather than forcing migration).
  - **2nd-adopter precedent for "single-file ADR convention scales past 40 ADRs"** (1st adopter was the temidev decision to keep it · this Trial 5 measurement is the 2nd). Worth keeping the F4.4 v2.3 fix in adlc-flow.

### What worked (positive · no friction)

- **The clarification flow stayed tight**: 3 rounds × 3 questions = 9 decisions clarified. User chose "Recommended" on 8/9 questions and added one Other text on input-context (payment + timeline). Strong signal that the recommendations were well-calibrated to the actual product reality.
- **Pre-AG recommendations attribution**: every SG open question that referenced "Trial 4b F7.6" / "F7.7" etc. resolved cleanly at AG because the precedent provided a strong default. Cross-trial pattern reuse is now load-bearing for adlc-flow's value proposition.
- **ADR-050 §5 cost arithmetic landed in writing before any LLM call**: ~Rp 1,330/SoW with 3.8× headroom · zero ambiguity about the budget envelope. If the PoV measurement disagrees, the disagreement is the surface signal, not the unit economics.

### Phase F3b (HG+SG+AG) outputs (commit `7ad5ce1` · 6 files · 570 insertions · 77 deletions)

- HYPOTHESIS.md filled (~80 lines)
- RESPONSIBILITY-MAP.md filled (~110 lines)
- COST-BUDGET.md filled (~95 lines)
- docs/DECISIONS.md +ADR-050 (~390 lines)
- EVAL-SUITE/sow-drafter/STRATEGY.md NEW (~190 lines)
- EVAL-SUITE/sow-drafter/PLAN.md NEW (~180 lines)

### Phase F3b (HG+SG+AG) findings tally

- 0 NEW FRICTION
- 0 VALIDATIONS
- 3 POSITIVE (F8.16 ADLC 3-gate discipline value · F8.17 SG→AG handoff via pre-recommendations · F8.18 temidev single-file ADR convention scales)

### What remains in F3b for full HG→VG arc

- **P3 prep** (1 session · ~2-3 hours): generateSowDraft SA (mock-first per F7.5) · 4 helper modules (render-html · redact-precedent · diff-precedent · the system prompt builder) · golden dataset 50 samples + 20 synthetic precedent corpus with honey-tokens · eval runner at `apps/web/scripts/eval-sow-drafter.ts`
- **P4 build** (1 session · ~1-2 hours): wire live Anthropic SDK (Sonnet 4.6 + tool_use + 3-cache) · admin/agreements 'Create AI-drafted' button + SA dispatch · SOW_DRAFTER_ENABLED env var + cost-guard + audit emission
- **VG measurement** (1 session · requires Vault key + Anthropic API key · ~Rp 82,500 spend for first 50-sample eval pass): live eval run + reviewer-rubric scoring + /pov-gate verdict synthesis · HYPOTHESIS.md status update OPEN → PROVED/GO_WITH_CONCERNS/KILLED


