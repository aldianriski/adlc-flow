# adlc-flow

**Phase-gated workflow scaffold for software projects — agentic OR traditional, greenfield OR mature.** Claude Code plugin implementing [EPAM's Agentic Development Lifecycle (ADLC)](https://www.epam.com/insights/ai/blogs/agentic-development-lifecycle-explained) alongside a 14-skill universal dev workflow (sprint protocols · ADR writing · PR review · debugging · refactoring).

Validated across **5 dogfood trials** (greenfield agentic · existing-project traditional · multi-agent NO_GO kill · real-product PoV · mature-codebase adoption). 31 closed friction findings · 14 promoted positive patterns. The plugin's mechanics adapt to your project — not the other way around.

> **adlc-flow v2.0+ absorbs the universal-dev-workflow surface from `dev-flow`** (PR review · ADR writing · sprint protocols · debugging · refactoring) — install ONE plugin for both your traditional code AND your LLM-core features. Migrating from dev-flow? See [`docs/MIGRATION-FROM-DEV-FLOW.md`](docs/MIGRATION-FROM-DEV-FLOW.md).

---

## Quick start

```bash
# 1. Install (after marketplace publish)
claude plugin add adlc-flow

# 2. Scaffold your project (idempotent · safe on mature codebases)
node ~/.claude/plugins/adlc-flow/bin/adlc-flow-init.js --enable

# 3. Start the lifecycle
/adlc-orchestrator init                           # if you skipped step 2
/adlc-orchestrator discover "<business pain>"     # agentic feature
/adlc-orchestrator traditional                    # non-agentic work
```

For mature existing projects, `init` detects your existing `docs/DECISIONS.md` / `docs/adr/` / `TODO.md` / `CHANGELOG.md` and preserves them. It scaffolds only what's missing. See `init`'s output for the detected conventions + commit policy.

**Prerequisites**:
- Node.js ≥18 (Claude Code requirement)
- Python ≥3.10 + graphify (for `/zoom-out` · `/context-engineer` · `/graph-query` — see [Graphify section](#graphify-knowledge-graph-backend) below)

---

## Scenario → skill chain cheatsheet (F4.11 · Trial 5 onboarding gap closed)

| Scenario | Skill chain |
|---|---|
| **I want to build an agentic feature (LLM-core)** | `/adlc-orchestrator discover "pain"` → `/hypothesis-register` (HG) → `/responsibility-map` (SG) → `/agent-architect` (AG · with ADR) → `/eval-suite-planner` → `/golden-dataset` → build mock-first → `/pov-gate` (VG · hard go/no-go) |
| **I want to ship a traditional feature (landing · API · ops tool)** | `/adlc-orchestrator traditional` → `/lean-doc-generator` (sprint plan) → `/tdd` + `/test-planner` → code-reviewer agent → `/release-patch` or `/release-manager` |
| **I have a hard-to-reverse decision to document** | `/adr-writer` — auto-detects existing convention (`docs/DECISIONS.md` single-file OR `docs/adr/<NNN>.md` multi-file) |
| **I need to understand an unfamiliar module** | `/zoom-out <module>` — semantic + structural map via graphify |
| **I need to debug a production bug** | `/diagnose` — 6-phase systematic debug (reproduce · isolate · hypothesize · verify · fix · prevent) |
| **I'm about to refactor; what's risky?** | `/refactor-advisor` — code-smell sweep + deep-module candidates |
| **My change touches DB schema** | `migration-analyst` agent — safety · rollback feasibility · data-loss risk |
| **My change touches a hot path** | `performance-analyst` agent — DB · API · render-hot path assessment |
| **Pre-merge code review** | `/pr-reviewer` (or auto via `code-reviewer` agent) — 7-lens review |
| **OWASP / security review** | `/security-review` skill session — OWASP audit · stack-specific findings |
| **Release prep (MINOR/MAJOR)** | `/release-manager` — semver bump · CHANGELOG · audit-baseline run |
| **Patch release** | `/release-patch` — PATCH bump · multi-manifest auto-detection |
| **Eval reveals a regression** | `drift-analyst` agent — root-cause ranking across 5 drift types |
| **Model upgrade (Anthropic version bump)** | `/model-upgrade` (MG) — regression suite · cost-delta · behavioral-diff |
| **Cost overrun suspected** | `cost-analyst` agent — independent cost-model audit + optimization ledger |
| **Adversarial / red-team review** | `red-team-analyst` agent — prompt injection · goal hijacking · jailbreak attempts |
| **Production observability stand-up** | `/ai-observe` — emits observability schema (behavioral + operational + drift signals) |
| **Phased rollout planning** | `/canary-plan` — controlled-rollout designer with abort triggers + rollback |
| **Release-readiness sign-off** | `/release-readiness` — 8-section RG-gate sign-off doc |

> Don't memorize this. Just run `/adlc-orchestrator <task description>` and the dispatcher routes to the right entry point.

---

## What your project gets

The plugin maps every skill + agent to one of 8 user-outcomes (A1-A8). Full registry with skip-when counter-evidence: [`docs/USER-OUTCOMES.md`](docs/USER-OUTCOMES.md).

| Outcome | What it means in practice |
|---|---|
| **A1 hypothesis-quality** | Bad ideas killed before code — falsifiable hypothesis + kill-criteria at HG · validated at VG |
| **A2 architecture-clarity** | ReAct / Plan-Execute / multi-agent decided with rationale · ADR'd · code-side: 5-lens review |
| **A3 eval-coverage** | Eval methodology + thresholds defined BEFORE production code; eval suite IS design |
| **A4 cost-discipline** | Token economics tracked from P2 onward · three-level alerts · no silent OpEx blow-up |
| **A5 drift-detection** | Model upgrades trigger regression suite · quarterly drift audits across 5 drift types |
| **A6 responsibility-clarity** | Human–agent decision/approval grid · explicit kill-switch tiers per feature |
| **A7 release-confidence** | Multi-metric formal sign-off + red-team + UAT at RG · controlled canary with abort triggers |
| **A8 operational-loop** | User feedback → prompt updates with traceability · drift analysis with root-cause ranking |

---

## Lifecycle (8 modes · 6 gates)

```
init ──► discover ── HG ─► SG ── design ── AG ── prove ── VG ── build ── validate ── RG ── activate ── operate ⇄ MG
                    P0+P1                    P2              P3                P4         P5              P6              P7
                                                       (hard go/no-go)
```

Gates: **HG** Hypothesis · **SG** Scope · **AG** Architecture · **VG** Validation *(hard go/no-go)* · **RG** Release-Readiness · **MG** Model-Upgrade.

For traditional (non-agentic) work, the lifecycle simplifies to `init → traditional → <ship>` using universal-surface skills — no ADLC gates fire.

---

## Skills (28 total · 14 ADLC + 14 universal)

### ADLC-native (14)
`/adlc-orchestrator` · `/hypothesis-register` · `/responsibility-map` · `/agent-architect` · `/eval-suite-planner` · `/golden-dataset` · `/pov-gate` · `/context-engineer` · `/release-readiness` · `/canary-plan` · `/ai-observe` · `/model-upgrade` · `/drift-audit` · `/cost-budget`

### Universal dev workflow (14 · absorbed from dev-flow per ADR-004)
`/prime` · `/zoom-out` · `/graph-query` · `/pr-reviewer` · `/security-auditor` · `/refactor-advisor` · `/diagnose` · `/tdd` · `/test-planner` · `/lean-doc-generator` · `/adr-writer` · `/release-manager` · `/release-patch` · `/write-a-skill`

> `/codemap-refresh` retired in v2.1.0 · replaced by graphify integration per ADR-005.

Per-skill purpose + skip-when conditions: [`docs/USER-OUTCOMES.md`](docs/USER-OUTCOMES.md).

## Agents (11 specialists)

**Agentic-side (5)**: `eval-analyst` · `prompt-reviewer` · `red-team-analyst` · `drift-analyst` · `cost-analyst`

**Code-side (6)**: `design-analyst` · `code-reviewer` · `scope-analyst` · `security-analyst` · `performance-analyst` · `migration-analyst`

## Hooks (2 · Node-based · cross-platform)

- **SessionStart** — verifies `.claude/CLAUDE.md` + scans for canonical artifacts; warns if you haven't run `init` yet.
- **PostToolUse artifact-integrity** — checks `last_updated` frontmatter currency when canonical artifact files are edited.

---

## Templates (8 · drop into your adopter project)

| Template | Purpose | Trial validation |
|---|---|---|
| `CLAUDE.md.template` | Project AI context bootstrap | Trials 1-5 |
| `HYPOTHESIS.md.template` | Agentic feature hypothesis register (2-tier summary + detail) | Trials 1, 3, 4, 5 |
| `RESPONSIBILITY-MAP.md.template` | Human–agent decision/approval grid (with multi-agent chain support) | Trials 1, 3, 4, 5 |
| `FEEDBACK-LOG.md.template` | Operational feedback → prompt-change traceability | Trial 5 scaffolded |
| `MODEL-UPGRADE-LOG.md.template` | MG-gate regression log | Trial 5 scaffolded |
| `OBSERVABILITY.md.template` | RG-emitted observability schema | Trial 5 scaffolded |
| `COST-BUDGET.md.template` | Per-feature token economics + alert thresholds | Trials 4, 5 |
| `BASELINE.md.template` | PoV golden-dataset metric baseline | Trial 3 |
| `SERVER-ACTION-RLS.md.template` ⭐ NEW v2.9 | Supabase Server Action + RLS dual-layer pattern | Trial 5 (12+ SAs · Sprints 023-032) |
| `I18N-BILINGUAL.md.template` ⭐ NEW v2.9 | Bilingual i18n content-object + parity discipline | Trial 5 (1700+ keys · validated) |
| `DEPLOY-PLAN.md.template` ⭐ NEW v2.9 | Vercel + Supabase production deploy + rollback runbook | Trial 5 stack |
| `SETUP-supabase.md.template` ⭐ NEW v2.8 | Supabase tooling expectations (Docker · CLI · Vault) | Trial 5 |

---

## Graphify (knowledge-graph backend)

Three skills hard-depend on [graphify](https://graphify.net) for semantic+structural code understanding: `/zoom-out` · `/context-engineer` · `/graph-query`. See [ADR-005](docs/adr/ADR-005-graphify-adoption.md) for the adoption rationale.

### Install (one-time)

```bash
# Pick a backend before `graphify .`:
uv tool install "graphifyy[mcp] --with anthropic"   # Anthropic Claude (highest quality · ~$0.50-5/rebuild)
# OR  uv tool install "graphifyy[mcp,gemini]"       # Google Gemini (free tier · within quota)
# OR  uv tool install "graphifyy[mcp,ollama]"       # Local Ollama (offline · $0)

graphify install                        # Linux/Mac
graphify install --platform windows     # Windows

# Build the graph for THIS repo (full LLM cost · skip if you only use non-graphify skills):
graphify .
```

### Cost vs free commands

- `graphify .` / `graphify extract .` — **full LLM cost**. Use after major refactors or first-time.
- `graphify update .` — **$0**. Re-extracts AST only; semantic results cached. Use after code-only changes.
- `graphify cluster-only .` — **$0**. Regenerates `GRAPH_REPORT.md` + `graph.html` from existing `graph.json`.

### Token-reduction by corpus shape

| Corpus | Realistic per-query reduction |
|---|---|
| Markdown-only or tiny single-language repo | ~3–5× (grep + Read often competitive) |
| Mid-size single-language code (50k–200k tokens) | ~15–30× |
| Large mixed-content (code + docs + diagrams, 200k+ tokens) | ~50–100× |

Graphify is opt-in per project · re-evaluate per project, not blindly.

---

## Migrating from dev-flow

dev-flow v4.x keeps working — no urgent migration needed. Most skill names carry over verbatim (`/prime` · `/lean-doc-generator` · `/adr-writer` · `/pr-reviewer` · `/tdd` etc.). One renamed: `/orchestrator` → `/adlc-orchestrator`.

Full migration guide: [`docs/MIGRATION-FROM-DEV-FLOW.md`](docs/MIGRATION-FROM-DEV-FLOW.md). ADR-004 captures the absorption decision.

---

## Documentation

- [`docs/USER-OUTCOMES.md`](docs/USER-OUTCOMES.md) — A1-A8 outcome registry · per-skill skip-when conditions
- [`docs/MIGRATION-FROM-DEV-FLOW.md`](docs/MIGRATION-FROM-DEV-FLOW.md) — dev-flow → adlc-flow migration
- [`docs/SPRINT-CONVENTION-COMPAT.md`](docs/SPRINT-CONVENTION-COMPAT.md) — coexist with existing TODO.md / CHANGELOG conventions
- [`docs/audit/trial-friction-log.md`](docs/audit/trial-friction-log.md) — 5 trial dogfood evidence base · 31 findings · 14 positive patterns
- [`docs/adr/`](docs/adr/) — 8 architectural decision records
- [`docs/research/ADLC-source.md`](docs/research/ADLC-source.md) — vendored EPAM ADLC source extract
- [`templates/`](templates/) — 12 drop-in templates for adopter projects

---

## Status (v2.9.0 · 2026-05-20)

- 28 skills · 11 specialist agents · 2 Node hooks · 12 canonical artifact templates · 8 ADRs · vendored ADLC source extract
- Lifecycle traversable end-to-end from `init` through `operate`
- Validated against 5 dogfood trials: ticket triage (greenfield agentic) · Naraly landing (mature existing traditional) · multi-agent escalation (NO_GO kill-criterion validation) · umkm-indo PoV build (real product · pre-VG arc) · temidev mature adoption (49+ ADRs · 31 closed sprints · full ADLC arc to 5/6 gates on 2 AI wedges)
- Both AI wedges through F3b (SoW drafter) + F3c (clause risk flagger) have 9 numeric kill-criteria locked in writing BEFORE production code reached VG
- v2.9 ships Tier 2 high-impact templates (SERVER-ACTION-RLS · I18N-BILINGUAL · DEPLOY-PLAN) + scenario→skill cheatsheet · closing Trial 2's LOW-priority backlog

**v3.0 stability checkpoint** (future) — pending one adopter shipping an agentic feature through full lifecycle (post-VG · RG · MG · P5-P7). The 7 post-VG ADLC skills (`/release-readiness` · `/canary-plan` · `/ai-observe` · `/model-upgrade` · `/drift-audit` · `/context-engineer` · `/cost-budget` live wiring) are deployed but unvalidated against production data.

Built on Claude Code by [Aldian Rizki](mailto:aldian.mar@gmail.com).

## License

MIT — see [`LICENSE`](LICENSE).
