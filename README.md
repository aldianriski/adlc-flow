# adlc-flow

**Unified phase-gated workflow scaffold for modern software development — both traditional code AND agentic products.** Implements [EPAM's Agentic Development Lifecycle (ADLC)](https://www.epam.com/insights/ai/blogs/agentic-development-lifecycle-explained) as a Claude Code plugin.

> **adlc-flow v2.0 absorbs the universal-dev-workflow surface from `dev-flow`** (PR review, ADR writing, sprint protocols, debugging, refactoring, etc.) — so you install ONE plugin for both your traditional code AND your LLM-core features. dev-flow v4.x stays in marketplace for legacy users; new projects should install adlc-flow.

---

## What your project gets

| Outcome | What it means in practice |
|---|---|
| **A1 hypothesis-quality** | Bad ideas killed before code — falsifiable hypothesis + kill-criteria at HG, validated at VG |
| **A2 architecture-clarity** | ReAct vs Plan-Execute vs multi-agent decided with rationale (agentic-side); 5-lens code review (code-side); ADR'd |
| **A3 eval-coverage** | Eval methodology + thresholds defined BEFORE production code; eval suite is design, not afterthought |
| **A4 cost-discipline** | Token economics tracked from P2 onward; three-level alert thresholds; no silent OpEx blow-up |
| **A5 drift-detection** | Model upgrades trigger regression suite; quarterly drift audits across 5 drift types |
| **A6 responsibility-clarity** | Human–agent decision/approval grid documented per feature |
| **A7 release-confidence** | Multi-metric formal sign-off + red-team + UAT at RG; controlled canary with abort triggers |
| **A8 operational-loop** | User feedback → prompt updates with traceability; drift analysis with root-cause ranking |

Full registry with skip-when counter-evidence and explicit anti-outcomes: [`docs/USER-OUTCOMES.md`](docs/USER-OUTCOMES.md).

---

## Lifecycle (8 modes, 6 gates)

```
init ──► discover ── HG ─► SG ── design ── AG ── prove ── VG ── build ── validate ── RG ── activate ── operate ⇄ MG
                    P0+P1                    P2              P3                P4         P5              P6              P7
                                                       (hard go/no-go)
```

| Mode | ADLC Phase | Use when |
|---|---|---|
| `init` | — | scaffold canonical artifacts into a fresh adopter project |
| `discover` | P0+P1 | starting from a business pain point |
| `design` | P2 | hypothesis ratified, choosing agent pattern |
| `prove` | P3 | architecture set, before production code (golden-dataset PoV) |
| `build` | P4 | PoV passed; change → evaluate → confirm → proceed loop |
| `validate` | P5 | release-readiness sign-off |
| `activate` | P6 | canary / blue-green / observability stand-up |
| `operate` | P7 | feedback loop, drift audits, model upgrades |

Gates: **HG** Hypothesis · **SG** Scope · **AG** Architecture · **VG** Validation *(hard go/no-go)* · **RG** Release-Readiness · **MG** Model-Upgrade.

---

## Skills (28 total)

### Agentic lifecycle (ADLC-native — 14 skills)

| Skill | Phase | Purpose |
|---|---|---|
| `/adlc-orchestrator` | all | Phase-aware dispatcher; includes `init` mode |
| `/hypothesis-register` | P0 | Falsifiable hypothesis + kill-criteria artifact (HG) |
| `/responsibility-map` | P1 | Human–agent decision/approval grid (SG) |
| `/agent-architect` | P2 | ReAct / Plan-Execute / multi-agent decision + ADR (AG) |
| `/eval-suite-planner` | P2/P3 | Runnable eval-suite plan (methodology · thresholds · cadence) |
| `/golden-dataset` | P3 | Versioned ground-truth corpus builder |
| `/pov-gate` | P3 | Golden-dataset PoV go/no-go report (VG) |
| `/context-engineer` | P4 | Memory · history · RAG · injection-surface review |
| `/release-readiness` | P5 | RG-gate sign-off doc (8 sections) |
| `/canary-plan` | P6 | Controlled-rollout designer with abort triggers + rollback |
| `/ai-observe` | P6/P7 | Observability schema (behavioral + operational + drift signals) |
| `/model-upgrade` | P7 | MG-gate regression suite + cost-delta + behavioral-diff |
| `/drift-audit` | P7 | Periodic 5-type behavior-alignment audit |
| `/cost-budget` | cross | Token-economics budget planner |

### Universal dev workflow (14 skills — absorbed from dev-flow + graphify integration)

| Skill | Purpose |
|---|---|
| `/prime` | Deterministic context load on session start (graphify-aware soft dep) |
| `/zoom-out` | Module map via graphify knowledge graph (**HARD dep on graphify**, ADR-005) |
| `/graph-query` | Natural-language query against graphify knowledge graph (**HARD dep on graphify**, ADR-005) |
| `/pr-reviewer` | 7-lens code review (auto-invoked by code-reviewer agent) |
| `/security-auditor` | OWASP audit (auto-invoked by security-analyst in separate session) |
| `/refactor-advisor` | Code-smell sweep + deep-module candidates |
| `/diagnose` | 6-phase systematic debugging |
| `/tdd` | Tracer-bullet → red-green-refactor for deterministic code |
| `/test-planner` | Group test planning (unit / integration / e2e / regression) BEFORE writing |
| `/lean-doc-generator` | Doc discipline + sprint promote/execute/close protocols |
| `/adr-writer` | Hard-to-reverse decision records (one file per ADR in `docs/adr/`) |
| `/release-manager` | MINOR/MAJOR semver + CHANGELOG |
| `/release-patch` | PATCH bump with multi-manifest auto-detection (plugin · npm · python · cargo · go · flat) |
| `/write-a-skill` | Meta-skill for authoring new adlc-flow skills |

> `/codemap-refresh` retired in v2.1.0 — replaced by graphify integration per ADR-005 (multi-modal AST + LLM knowledge graph; ~71.5× token reduction on queries vs raw-file reads).

## Agents (11 specialists)

### Agentic-side (5)
- `eval-analyst` — AG/VG eval-setup review (methodology, thresholds, dataset adequacy)
- `prompt-reviewer` — Prompts-as-artifacts review at P4 commit boundaries
- `red-team-analyst` — RG adversarial PoC review (prompt injection, goal hijacking, etc.)
- `drift-analyst` — P7 root-cause ranking when drift suspected
- `cost-analyst` — Independent cost-model audit + optimization ledger

### Code-side (6)
- `design-analyst` — Code-side architecture review with 5 lenses (correctness · scalability · coupling · operational · resilience); supports `--grill`
- `code-reviewer` — Post-implementation review wrapper (preloads pr-reviewer)
- `scope-analyst` — Blast-radius assessment when feature spans multiple modules
- `security-analyst` — OWASP audit in separate `/security-review` session
- `performance-analyst` — Hot-path / DB / API risk assessment
- `migration-analyst` — DB schema change safety + rollback feasibility

## Hooks (2)

- **SessionStart** — verifies `.claude/CLAUDE.md` + scans for canonical artifacts; warns if you haven't run `init` yet.
- **PostToolUse artifact-integrity** — checks `last_updated` frontmatter currency when canonical artifact files are edited.

Both Node-based for cross-platform parity.

---

## Quick start

```bash
# 1. Install adlc-flow (once published to marketplace)
claude plugin add adlc-flow

# 2. Install graphify — required by /zoom-out, /context-engineer, /graph-query (ADR-005)
#    uv-tool install is the upstream-recommended path; isolates graphify in its own venv.
uv tool install "graphifyy[mcp]"        # Linux/Mac:   curl -LsSf https://astral.sh/uv/install.sh | sh
                                         # Windows:     winget install astral-sh.uv
graphify install                        # Linux/Mac
graphify install --platform windows     # Windows (path separator differs)

# 3. (Optional) Build the graph for THIS repo — costs LLM tokens on your own API key.
#    Skip to step 4 if you only want to use the non-graphify-dependent skills.
graphify .                              # full pipeline · semantic extraction · ~$0.50–$5 depending on corpus

# 4. In your project:
/adlc-orchestrator init                 # scaffold canonical artifacts
/adlc-orchestrator discover "<pain>"    # start the lifecycle
```

`init` creates 6 artifact files + 3 empty dirs in your project root:
- `HYPOTHESIS.md` · `RESPONSIBILITY-MAP.md` · `FEEDBACK-LOG.md` · `MODEL-UPGRADE-LOG.md` · `OBSERVABILITY.md` · `COST-BUDGET.md`
- `GOLDEN-DATASET/` · `EVAL-SUITE/` · `docs/adr/`

**Prerequisites**:
- Node.js ≥18 (Claude Code requirement; adlc-flow's own scripts)
- **Python ≥3.10** (for graphify — required by `/zoom-out`, `/context-engineer`, `/graph-query`; optional otherwise)

For traditional code-only projects, you can use `/adr-writer`, `/pr-reviewer`, `/tdd`, etc. directly without going through the agentic lifecycle. Graphify is still recommended (knowledge graph helps everywhere) but only hard-required by the 3 knowledge-heavy skills listed above.

---

## Graphify install — backend choice + cost notes

### Pick a backend before `graphify .`

The semantic-extraction pass calls an LLM on your own API key. Pick **one** below, set the corresponding env var, then run the build.

| Backend | Cost | API key env var | uv-tool install extra |
|---|---|---|---|
| **Anthropic Claude** (highest quality) | ~$0.50–$5 per full rebuild | `ANTHROPIC_API_KEY` | `uv tool install "graphifyy[mcp]" --with anthropic` |
| **Google Gemini** (free tier) | $0 within free quota | `GEMINI_API_KEY` | `uv tool install "graphifyy[mcp,gemini]"` |
| **Local Ollama** (offline) | $0 (your hardware) | n/a — run `ollama pull qwen2.5-coder` | `uv tool install "graphifyy[mcp,ollama]"` |

Then build with `graphify extract . --backend claude` (or `gemini` / `ollama`). The bare `graphify .` slash-command auto-detects whichever key is set.

> **Windows uv-tool gotcha**: `pip install anthropic` does NOT make anthropic visible to graphify, because uv-tool creates an isolated venv. Use `uv tool install --with anthropic --force "graphifyy[mcp]"` to inject the dep correctly.

### When `graphify .` is full-cost vs free

- `graphify .` / `graphify extract .` — **full LLM cost**. Use after major refactors or first-time setup.
- `graphify update .` — **$0**. Re-extracts AST only; semantic results are cached. Use after code-only changes.
- `graphify cluster-only .` — **$0**. Regenerates `GRAPH_REPORT.md` + `graph.html` from existing `graph.json`.

### Expected token-reduction per query

graphify's published 71.5× number was measured on a 52-file mixed-content corpus (code + SQL + docs + SVG). Your reduction scales with corpus size + multi-modal coverage:

| Corpus shape | Realistic per-query reduction |
|---|---|
| Markdown-only or tiny single-language repo | ~3–5× (grep + Read often competitive) |
| Mid-size single-language code (50k–200k tokens) | ~15–30× |
| Large mixed-content (code + docs + diagrams, 200k+ tokens) | ~50–100× |

For small repos the build cost may not pay back inside your session — that's why graphify is **opt-in per project**, not a plugin-wide requirement. Re-evaluate per project, not blindly.

---

## Migration from dev-flow

If you're currently using `dev-flow`:

1. **dev-flow keeps working** at v4.x. No urgent migration needed.
2. **Skill names are unchanged** in adlc-flow (no `dev-flow:` prefix anymore — same command names).
3. **Sprint protocols are unchanged** — `lean-doc-generator` sprint promote/execute/close work identically.
4. **New capabilities** in adlc-flow: 14 ADLC-native skills + 5 specialist agents + canonical artifact templates.
5. **dev-flow gets a deprecation notice** pointing here; will be archived once ecosystem migrates.

See [ADR-004 absorption decision](docs/adr/ADR-004-absorb-dev-flow.md) for the strategic rationale.

---

## Source framework + adapter notes

ADLC vocabulary, phase numbering (P0–P7), gates, and anti-patterns derive from EPAM's Agentic Development Lifecycle article. Vendored extract: [`docs/research/ADLC-source.md`](docs/research/ADLC-source.md). Authoritative reference per [ADR-002](docs/adr/ADR-002-adlc-source.md). Deviations from source are enumerated in the extract's "Adapter notes" table.

---

## License

MIT — see [`LICENSE`](LICENSE).

---

## Status

**v2.4.0** — Multi-agent template + kill-criteria adjustments. 28 skills · 11 specialist agents · 2 Node hooks · 6 canonical artifact templates · 8 ADRs · vendored ADLC source extract. Lifecycle traversable end-to-end from `init` through `operate`. Knowledge-heavy skills (`/zoom-out` · `/context-engineer` · `/graph-query`) hard-depend on [graphify](https://graphify.net) for semantic+structural code understanding. Three dogfood trials (greenfield agentic · existing-project traditional · multi-agent with NO_GO kill-criterion validation) closed end-to-end.

**v2.5+ roadmap** — external adopter dogfood, marketplace publish, behavioral skill-triggering acceptance harness, audit-baseline Node port, multi-agent sub-variants (orchestrator-worker · peer-network · hierarchical). See [`TODO.md`](TODO.md).

Built on Claude Code by [Aldian Rizki](mailto:aldian.mar@gmail.com).
