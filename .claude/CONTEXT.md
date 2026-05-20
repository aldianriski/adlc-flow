---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: Vocab, gate, mode, outcome, or agent roster change
status: current
---

# CONTEXT.md — adlc-flow Shared Domain Language

All agents and skills read this file. Single source of truth for ADLC vocabulary, principles, gates, modes, and outcomes.

> Source framework: EPAM Agentic Development Lifecycle (ADLC). Vendored extract: [`docs/research/ADLC-source.md`](../docs/research/ADLC-source.md). Canonical: [epam.com/insights/ai/blogs/agentic-development-lifecycle-explained](https://www.epam.com/insights/ai/blogs/agentic-development-lifecycle-explained). Anchor: ADR-002.

---

## Vocabulary

| Term | Definition |
|---|---|
| **agentic product** | A system whose user-facing behavior is materially driven by LLM reasoning (not a deterministic app that happens to call an LLM) |
| **gate** | Human checkpoint between ADLC phases; must pass before proceeding |
| **mode** | Operational context naming the active ADLC phase: `discover` / `design` / `prove` / `build` / `validate` / `activate` / `operate` |
| **skill** | Slash command loaded on demand from `skills/` (plugin install) |
| **agent** | Specialist worker spawned by orchestrator for targeted analysis (v0.2+) |
| **red flag** | Condition that hard-stops a skill; listed inline per skill |
| **golden dataset** | Versioned ground-truth corpus used for PoV baselines + regression — ADLC's most distinctive artifact |
| **eval** | Behavioral measurement of a probabilistic system; produces distributions, not pass/fail. Methods include RAGAS, DeepEval, LLM-as-judge, domain-custom |
| **kill-criteria** | Conditions that abort a hypothesis at PG/VG gate — written *before* the experiment |
| **responsibility map** | Per-feature grid splitting decisions, approvals, authority between human and agent |
| **drift** | Behavioral change with no code change — caused by model upgrades, input-distribution shift, RAG-corpus updates |
| **user-project outcome** | Measurable benefit adlc-flow delivers to a project that adopts it (8 canonical A1-A8, see `docs/USER-OUTCOMES.md`) |

_Avoid: confusing **test** with **eval** — tests assert deterministic correctness; evals measure distributions of probabilistic behavior._
_Avoid: confusing **gate** with **mode** — modes are operational context (phase you're in); gates are checkpoints between modes._
_Avoid: confusing **golden dataset** with **test fixtures** — fixtures verify code paths; golden dataset benchmarks agent quality._

---

## ADLC Engineering Principles

- **Eval is development** — change → evaluate → confirm → proceed loop runs dozens of times per feature, not once per release
- **Deployment is the start of monitoring** — Phase 6+7 are first-class, not afterthoughts
- **Probabilistic honesty** — report distributions and thresholds, never single-pass pass/fail
- **Hypothesis-first** — every agentic feature starts as a testable hypothesis with kill-criteria
- **Human–agent responsibility is explicit** — decisions, approvals, authority levels documented per feature
- **Context engineering is design** — memory, history, dynamic assembly are architectural concerns
- **Model upgrades trigger regression** — silent failures are the dominant failure mode for agentic systems
- **User-Project Lens** — every component states a user-project outcome (A1-A8). Registry: `docs/USER-OUTCOMES.md`

---

## Gates

ADLC has more checkpoints than SDLC because the system is probabilistic and post-deployment monitoring is first-class.

### HG — Hypothesis Gate *(P0 → P1)*
- [ ] Pain point named with affected user/operator
- [ ] AI-assist hypothesis stated as falsifiable claim
- [ ] Kill-criteria written *before* prototyping
- [ ] Workflow context mapped (where in the user's process this would sit)
- [ ] User-project outcome named (≥1 of A1-A8)

### SG — Scope Gate *(P1 → P2)*
- [ ] Business + technical KPIs with numeric thresholds
- [ ] Responsibility map drafted (human vs agent decisions/approvals)
- [ ] Compliance / risk-tolerance constraints named
- [ ] Data readiness reviewed (sources, quality, governance)
- [ ] Acceptable error rates + escalation triggers stated

### AG — Architecture Gate *(P2 → P3)*
- [ ] Agent pattern chosen (ReAct / Plan-Execute / multi-agent / hybrid) with ADR
- [ ] Tech stack selected (LLM/SLM, orchestration framework, vector DB)
- [ ] **Eval strategy defined before any production code** — methodology + thresholds
- [ ] Cost model drafted (token economics, capex/opex)
- [ ] Prompt-injection / unsafe-action risk assessment recorded

### VG — Validation Gate *(P3 → P4)* — **hard go/no-go**
- [ ] Golden dataset built with representative edge cases AND imperfect inputs
- [ ] PoV prototype meets accuracy / hallucination / cost / latency thresholds
- [ ] Business case re-validated against hypothesis
- [ ] No `NO-GO` finding from `pov-gate` skill

### RG — Release-Readiness Gate *(P5 → P6)*
- [ ] End-to-end eval suite passing at production-tuned thresholds
- [ ] UAT with stakeholders signed off
- [ ] Bias / fairness / compliance audits clean
- [ ] Red-team exercise completed; mitigations applied
- [ ] Performance + scalability validated
- [ ] Rollback / containment plan documented

### MG — Model-Upgrade Gate *(within P7)*
- [ ] New model version pinned in `MODEL-UPGRADE-LOG.md`
- [ ] Regression eval suite re-run; deltas within tolerance
- [ ] Prompt / context changes required by new model documented
- [ ] Cost delta within budget
- [ ] Rollback path verified

---

## Modes

| Mode | ADLC Phase | Gates fired | Use when |
|---|---|---|---|
| `discover` | P0 hypotheses + P1 scope | HG → SG | starting from a business pain point |
| `design` | P2 architecture | AG | hypothesis ratified, choosing agent pattern |
| `prove` | P3 PoV + golden dataset | VG | architecture set, before production code |
| `build` | P4 implementation+evals | none mid-phase (continuous eval loop) | PoV passed, building production system |
| `validate` | P5 testing | RG | release-readiness sign-off |
| `activate` | P6 deployment | none mid-phase | canary / blue-green / observability stand-up |
| `operate` | P7 continuous learning | MG (per model upgrade) | feedback loop, drift audits, model upgrades |

---

## Relationships

- **mode → gate** — each mode declares which gate(s) fire on transition (see Modes table).
- **gate → skill** — HG=`hypothesis-register`, SG=`responsibility-map` (v0.2), AG=`agent-architect`, VG=`pov-gate`, RG=`release-readiness` (v0.2), MG=`model-upgrade` (v0.2).
- **orchestrator → all** — `adlc-orchestrator` is the only thing that dispatches phase work; never self-implement.
- **CONTEXT.md → all** — every skill reads this file first.

---

## Knowledge-graph backend

Per [ADR-005](../docs/adr/ADR-005-graphify-adoption.md), adlc-flow adopts [graphify](https://graphify.net) (MIT, 49k★) as the canonical knowledge-graph backend. **Hard dep** for `/zoom-out`, `/context-engineer`, `/graph-query`. **Soft dep** for `/prime` (warns if missing). Install: `pip install graphifyy && graphify install && graphify .`. `codemap-refresh` retired in v2.1.0.

---

## Skill Roster (v2.1 — 28 skills total)

### Agentic lifecycle (ADLC-native — 14)

| Skill | Phase | Purpose |
|---|---|---|
| `adlc-orchestrator` | all | phase-aware dispatcher; includes `init` mode |
| `hypothesis-register` | P0 | testable hypothesis + kill-criteria artifact |
| `responsibility-map` | P1 | human–agent decision/approval grid |
| `agent-architect` | P2 | ReAct / Plan-Execute / multi-agent decision + ADR |
| `eval-suite-planner` | P2/P3 | runnable eval-suite plan |
| `golden-dataset` | P3 | versioned ground-truth corpus builder |
| `pov-gate` | P3 | golden-dataset PoV go/no-go report |
| `context-engineer` | P4 | memory · history · RAG · injection-surface review |
| `release-readiness` | P5 | RG sign-off doc (8 sections) |
| `canary-plan` | P6 | controlled rollout designer |
| `ai-observe` | P6/P7 | observability schema |
| `model-upgrade` | P7 | MG gate runner |
| `drift-audit` | P7 | periodic 5-type drift audit |
| `cost-budget` | cross | token-economics budget planner |

### Universal dev workflow (14, absorbed from dev-flow per ADR-004; graphify adopted per ADR-005)

| Skill | Purpose |
|---|---|
| `prime` | Deterministic context load on session start (graphify-aware soft dep) |
| `zoom-out` | Module map via graphify graph (HARD dep, ADR-005) |
| `graph-query` | NL query against graphify knowledge graph (HARD dep, ADR-005) |
| `pr-reviewer` | 7-lens code review |
| `security-auditor` | OWASP audit |
| `refactor-advisor` | Code-smell sweep + deep-module candidates |
| `diagnose` | 6-phase systematic debugging |
| `tdd` | Tracer-bullet red-green-refactor for deterministic code |
| `test-planner` | Group test planning before writing |
| `lean-doc-generator` | Doc discipline + sprint protocols |
| `adr-writer` | Hard-to-reverse decision records |
| `release-manager` | MINOR/MAJOR semver |
| `release-patch` | PATCH bump multi-manifest cascade |
| `write-a-skill` | Meta-skill for authoring new skills |

---

## Agent Roster (11 specialists)

### Agentic-side (5)

| Agent | Trigger | Spawned by |
|---|---|---|
| `eval-analyst` | AG/VG eval-setup review | orchestrator (auto) |
| `prompt-reviewer` | P4 commit boundary | orchestrator (auto) |
| `red-team-analyst` | RG adversarial review | orchestrator (propose → approve) |
| `drift-analyst` | P7 drift root-cause | orchestrator or `/drift-audit` |
| `cost-analyst` | independent cost-model review | orchestrator (propose → approve) |

### Code-side (6)

| Agent | Trigger | Spawned by |
|---|---|---|
| `design-analyst` | code-side architecture review (P2/P4) | orchestrator (auto on `mvp`-style flows); supports `--grill` |
| `code-reviewer` | post-implementation P4 | orchestrator (propose → approve) |
| `scope-analyst` | blast-radius when feature spans modules | orchestrator (auto if unclear) |
| `security-analyst` | RG security audit (separate session) | user runs `/security-review` |
| `performance-analyst` | hot-path / DB / API + high risk | orchestrator (propose → approve) |
| `migration-analyst` | DB schema change detected | orchestrator (propose → approve) |

Dispatcher role lives in `adlc-orchestrator` skill.

---

## Skill Authoring Standards

- `SKILL.md` ≤ 100 lines; overflow → `references/` files
- Description field < 1,024 characters; must start with `Use when…`
- Red flags: 3–5 inline, not in a separate doc
- Trigger phrase must be specific enough to avoid false positives with `dev-flow:` skills

---

## Output Discipline

Plugin-wide. Mirrors dev-flow ADR-033.

**Rules:**
- Status = one-line verdict per step; no narrated walkthrough
- No decorative emoji checkmarks in protocol output. Plain-text verdicts only
- Lists render compactly
- HALT prompts ≤ 4 lines + option list
- Code blocks, ADR text, eval reports: write normal (Auto-Clarity rule)

---

## Relationship to dev-flow

**v2.0.0 absorbs the universal-dev-workflow surface from dev-flow** (per ADR-004 superseding ADR-001). adlc-flow is now a unified plugin: ADLC-native skills + 14 absorbed universals. dev-flow v4.x is frozen with a deprecation notice; new projects install adlc-flow only.

Migration is mechanical:
- Skill names are unchanged (e.g., `/adr-writer`, `/pr-reviewer`, `/tdd`) — no `dev-flow:` prefix anymore.
- Sprint protocols (`lean-doc-generator` promote/execute/close) work identically.
- Existing dev-flow adopters can keep using dev-flow v4.x or migrate at their own pace.

Skipped from absorption (true overlap with adlc-flow): `orchestrator` (replaced by `adlc-orchestrator`); `task-decomposer` (replaced by `hypothesis-register` for agentic features + direct TODO entry for code-side tasks).
