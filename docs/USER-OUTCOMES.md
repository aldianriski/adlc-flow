---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: Component added or outcome revised
status: current
---

# USER-OUTCOMES.md — User-Project Outcome Registry

adlc-flow is a plugin. The plugin is a means; **the adopter's agentic product is the end**. This file maps every plugin component to the user-project outcome(s) it supports, plus the **counter-evidence** (when to skip it).

> **How to read this file** — Each row claims a non-trivial outcome AND names a concrete scenario where the component is *not* the right fit. Tautological skip-whens are rejected at review.

---

## Outcomes (canonical)

| ID | Alias | Outcome | One-line definition | Lens / proxy signal |
|:--:|:------|:--------|:--------------------|:--------------------|
| **A1** | `hypothesis-quality` | Bad ideas killed early | Falsifiable hypotheses with kill-criteria abort ill-fitting work before code | Hypotheses rejected at HG or VG / total |
| **A2** | `architecture-clarity` | Agent pattern chosen with rationale | ReAct/Plan-Execute/multi-agent decisions ADR'd; future contributors understand why | ADR coverage of agent-pattern choices |
| **A3** | `eval-coverage` | Behavioral quality measurable | Eval suite exists with thresholds before production code lands | % features with eval thresholds defined at AG |
| **A4** | `cost-discipline` | Token economics tracked | Per-feature cost model + budget alerts prevent silent OpEx blow-up | Cost-budget skill invocations / feature |
| **A5** | `drift-detection` | Model upgrades don't surprise | Regression eval re-run + tolerance check on every LLM-provider upgrade | Model-upgrade gate pass rate |
| **A6** | `responsibility-clarity` | Human–agent boundary explicit | Responsibility map names decisions, approvals, authority per feature | Features with current responsibility-map |
| **A7** | `release-confidence` | Formal sign-off vs ad-hoc deploy | Multi-metric thresholds + red-team + UAT at RG gate | Releases passing RG / total releases |
| **A8** | `operational-loop` | Feedback closed into prompts | User feedback drives prompt/context updates with traceability | FEEDBACK-LOG entries → prompt-change PRs |

---

## Skills — Agentic lifecycle (14) → outcomes

- **`adlc-orchestrator`** → A2 · A3 · A7 — phase-aware dispatch; runs HG/SG/AG/VG/RG/MG gates; prevents skipping eval-first discipline. **Skip when:** the work isn't agentic — bypass the ADLC modes and invoke code-side skills (`/tdd`, `/pr-reviewer`, etc.) directly.
- **`hypothesis-register`** → A1 — testable hypothesis + kill-criteria artifact at HG. **Skip when:** the agentic feature is a forced port from an existing deterministic feature with no business hypothesis (rare).
- **`responsibility-map`** → A6 · A4 — human–agent decision/approval grid at SG. **Skip when:** the feature has zero agent-driven user-visible actions (e.g., backend-only ranking with deterministic post-processing).
- **`agent-architect`** → A2 · A3 — ReAct vs Plan-Execute vs multi-agent decision; co-produces ADR + initial eval strategy. **Skip when:** architecture is dictated by a parent framework — document the constraint via `/adr-writer` instead.
- **`eval-suite-planner`** → A3 · A5 — expands eval-strategy outline into runnable plan (methodology mix · thresholds · cadence · regression contract). **Skip when:** feature is purely qualitative with no measurable success metric (rare — usually still benefits from explicit sampling protocol).
- **`golden-dataset`** → A3 · A1 — versioned ground-truth corpus with edge-case + imperfect-input + adversarial coverage. **Skip when:** evaluating against live production samples only (acceptable for some operational metrics; not for pre-launch).
- **`pov-gate`** → A1 · A3 · A4 — golden-dataset PoV go/no-go report; halts at VG on threshold miss. **Skip when:** no golden dataset exists (prerequisite — run `/golden-dataset` first).
- **`context-engineer`** → A3 · A2 — P4 review of memory · history · RAG · injection surfaces via graphify graph (HARD dep per ADR-005). **Skip when:** feature uses single-turn no-RAG no-memory architecture (rare but possible — e.g., classification-only agents); halt with install hint if `graphify-out/` absent.
- **`release-readiness`** → A7 — RG-gate sign-off doc generator. **Skip when:** PATCH-only release with no behavior change (use `/release-patch`).
- **`canary-plan`** → A7 · A8 — controlled-rollout designer with abort triggers + rollback. **Skip when:** non-user-facing internal-only feature with no production risk (still need ai-observe schema though).
- **`ai-observe`** → A5 · A8 · A4 — observability schema generator (behavioral + operational + drift signals). **Skip when:** N/A — every deployed agent needs observability config; skip = silent operations.
- **`model-upgrade`** → A5 — MG gate runner on LLM version bump. **Skip when:** model version not pinned (anti-pattern; pin first).
- **`drift-audit`** → A5 · A8 — periodic behavior-alignment audit. **Skip when:** feature is fresh from RG and < 1 quarter live (still schedule first audit at quarter mark).
- **`cost-budget`** → A4 — token-economics planner with three-level thresholds. **Skip when:** internal demo at low scale where billing < $20/month and ROI of planning > savings (rare in production).

---

## Skills — Universal dev workflow (14, absorbed from dev-flow per ADR-004) → outcomes

- **`prime`** → A6 — deterministic context load on session start. **Skip when:** resuming mid-session with context still warm.
- **`zoom-out`** → A2 — module map via graphify knowledge graph (HARD dep per ADR-005). **Skip when:** implementation plan already exists (use `/adlc-orchestrator`); halt with install hint if `graphify-out/graph.json` absent.
- **`graph-query`** → A2 · A8 — NL query interface against graphify graph (HARD dep). **Skip when:** question is a simple file-grep with no semantic / cross-modal component; use Grep tool directly.
- **`pr-reviewer`** → A7 · A2 — 7-lens code review. **Skip when:** docs-only PR with no behavior change.
- **`security-auditor`** → A7 · A2 — OWASP audit in separate session. **Skip when:** governance/docs change with no security surface.
- **`refactor-advisor`** → A2 — code-smell + deep-module candidates. **Skip when:** green-field code with no callers yet.
- **`diagnose`** → A7 · A8 — 6-phase systematic debugging. **Skip when:** architectural concern (use `design-analyst --grill`) or test-first work (use `/tdd`).
- **`tdd`** → A7 · A3 — tracer-bullet → red-green-refactor for deterministic code. **Skip when:** throwaway prototype OR agent behavior (use `/eval-suite-planner` + `/golden-dataset`).
- **`test-planner`** → A7 · A3 — group test planning. **Skip when:** trivial change with obvious 1-test coverage OR agentic behavior (use `/eval-suite-planner`).
- **`lean-doc-generator`** → A6 · A2 — frontmatter discipline + sprint protocols. **Skip when:** target is prose-only with no frontmatter contract.
- **`adr-writer`** → A2 · A6 — captures hard-to-reverse decisions. **Skip when:** reversible low-impact decision.
- **`release-manager`** → A7 — MINOR/MAJOR semver + CHANGELOG. **Skip when:** PATCH bump (use `/release-patch`).
- **`release-patch`** → A7 — PATCH bump with multi-manifest auto-detect. **Skip when:** no version manifest detected; docs-only diff (auto-skipped).
- **`write-a-skill`** → A2 — skill authoring for plugin contributors. **Skip when:** one-off prompt that won't be reused.

> `codemap-refresh` retired in v2.1.0 — replaced by graphify integration per ADR-005.

---

## Agents — Agentic-side (5) → outcomes

- **`eval-analyst`** → A3 · A5 — methodology + threshold + dataset-adequacy + regression-contract review at AG/VG. **Skip when:** eval setup is trivial (single binary metric, deterministic).
- **`prompt-reviewer`** → A3 · A2 — prompts-as-artifacts review (clarity · injection · drift · role-boundary · few-shot). **Skip when:** prompts are frozen at GA and changes go through PR-review only.
- **`red-team-analyst`** → A7 · A8 — adversarial PoC review at RG (6 attack categories). **Skip when:** N/A — every release-ready agent gets a red-team pass; skipping is documented residual-risk acceptance.
- **`drift-analyst`** → A5 · A8 — root-cause ranking when drift suspected. **Skip when:** no observability data yet to analyze (escalate to `/ai-observe` to widen collection).
- **`cost-analyst`** → A4 — independent cost-model audit + optimization ledger. **Skip when:** budget is small enough that audit overhead exceeds savings (typically <$1k/month features).

---

## Agents — Code-side (6, absorbed from dev-flow per ADR-004) → outcomes

- **`design-analyst`** → A2 · A7 — code-side architecture + 5 review lenses (correctness · scalability · coupling · operational · resilience); supports `--grill`. **Skip when:** agentic-side architecture (use `/agent-architect`); mode without design gate (e.g., trivial in-file edit).
- **`code-reviewer`** → A7 — post-implementation review wrapper (preloads pr-reviewer). **Skip when:** docs-only diff; reviewer can fast-path.
- **`scope-analyst`** → A2 — blast-radius when feature spans multiple modules. **Skip when:** size already estimated S/M/L with named files.
- **`security-analyst`** → A7 — separate `/security-review` session (never same-context). **Skip when:** no externally-exposed surface in diff.
- **`performance-analyst`** → A7 · A4 — hot-path / DB / API + high-risk gate. **Skip when:** no hot-path code in diff; cold-path optimization is premature.
- **`migration-analyst`** → A7 — DB schema safety + rollback feasibility. **Skip when:** no migration files in diff.

---

## Gates (6) → outcomes

- **HG Hypothesis** → A1 · A6 — kills bad ideas at zero code cost. **Skip when:** N/A — mandatory at P0.
- **SG Scope** → A6 · A4 — responsibility + KPI threshold ratification. **Skip when:** N/A — mandatory at P1.
- **AG Architecture** → A2 · A3 · A4 — pattern + eval-strategy + cost-model recorded before code. **Skip when:** N/A — mandatory at P2.
- **VG Validation** → A1 · A3 · A4 — golden-dataset go/no-go. **Skip when:** PoV is impossible (purely qualitative feature) — must document substitute evidence.
- **RG Release-Readiness** → A7 — formal multi-metric sign-off. **Skip when:** N/A — mandatory at P5.
- **MG Model-Upgrade** → A5 — regression check per model bump. **Skip when:** no LLM model version pinned.

---

## Hooks (2) → outcomes

- **SessionStart** (Node) → A6 · A3 — verifies CLAUDE.md + scans for canonical artifacts (HYPOTHESIS · RESPONSIBILITY-MAP · etc.); warns adopter to run `/adlc-orchestrator init` if missing. **Skip when:** N/A — hook-fired; manual disable only by editing settings.
- **PostToolUse artifact-integrity** (Node) → A6 · A2 — when canonical artifact is edited, checks `last_updated` is current. Warn-only. **Skip when:** N/A — silent guardrail.

---

## Scripts (4 Node + 1 retired) → outcomes

- **`bin/adlc-flow-init.js`** (Node) → A6 · A3 · A4 — scaffolds 6 artifact files + 3 empty dirs into adopter project. **Skip when:** adopter has already initialized (script is idempotent; safe to re-run).
- **`scripts/eval-skills.js`** (Node) → reliability — structural eval of plugin's own skills + agents (line caps · frontmatter · red-flags section). **Skip when:** docs-only changes that touched no skill/agent file.
- **`scripts/session-start.js`** (Node) → A6 · A3 — SessionStart hook target. **Skip when:** N/A — hook-fired only.
- **`scripts/artifact-integrity.js`** (Node) → A6 · A2 — PostToolUse hook target. **Skip when:** N/A — hook-fired only.

---

## Anti-outcomes (what adlc-flow does NOT claim)

Honest scope. adlc-flow does **not** deliver:

- **Eval infrastructure / runtime** — the plugin scaffolds *strategy* and *artifacts* (golden-dataset folder, threshold registry, eval-suite plan). Running evals at scale requires user-project tooling (RAGAS, DeepEval, custom harnesses).
- **Live telemetry collection** — `ai-observe` emits dashboard *schemas* + alert *rules*. Plugin cannot observe production hallucination rates / drift; that's user-project observability infra (OpenLLMetry / Helicone / native).
- **Agent runtime / orchestration framework** — adlc-flow does not implement LangGraph / CrewAI / Autogen. It helps you *choose* one and document the choice.
- **Prompt content** — plugin does not write your prompts. It reviews them as artifacts (`prompt-reviewer` agent).
- **Cost optimization implementation** — `cost-budget` plans budgets and alert thresholds; user-project tooling does the actual metering.
- **App-code generation** — same boundary as dev-flow.

---

## Adding a new component

Before opening a PR for a new skill / agent / gate / hook:

1. Identify ≥1 outcome (A1-A8) it supports.
2. Write a non-tautological skip-when describing when another component (or no component) is the better fit.
3. Add the row to the relevant section above.
4. Cross-link from the component's own doc.

PRs without a USER-OUTCOMES row are blocked at review (mirrors dev-flow ADR-026).

---

## References

- [ADR-005](adr/ADR-005-graphify-adoption.md) — graphify adopted as canonical knowledge-graph backend (codemap-refresh retired)
- [ADR-004](adr/ADR-004-absorb-dev-flow.md) — absorption of dev-flow universals (supersedes ADR-001)
- [ADR-001](adr/ADR-001-sister-plugin-relationship.md) — original sister-plugin framing (superseded)
- [ADR-002](adr/ADR-002-adlc-source.md) — EPAM ADLC article as authoritative source
- [ADR-003](adr/ADR-003-gate-naming-rationale.md) — HG/SG/AG/VG/RG/MG naming
- [`docs/research/ADLC-source.md`](research/ADLC-source.md) — vendored extract of source framework
- https://graphify.net + https://github.com/safishamsi/graphify — knowledge-graph backend
