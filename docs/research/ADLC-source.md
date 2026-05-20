---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: EPAM publishes substantive revision to ADLC article
status: current
type: vendored-reference
---

# ADLC — Vendored Source Extract

Faithful paraphrase of EPAM's *Introducing Agentic Development Lifecycle (ADLC): Building and Operating AI Agents in Production* (Feb 5, 2026). Authors: Stanislau Shandrokha, Avya Chaudhary, Antonio Di Marzo, Pavel Seviaryn, Vadym Vlasenko, Pavel Golub.

**Canonical URL:** https://www.epam.com/insights/ai/blogs/agentic-development-lifecycle-explained

**Why vendored:** survives URL rot and offline use. This file is the authoritative reference for all `adlc-flow` decisions per ADR-002. The vocabulary and phase structure of `adlc-flow` is derived from this article; *we adapt it, we do not invent it*.

**License note:** content paraphrased for engineering reference; full credit to EPAM. Do NOT republish verbatim sections of this file as original work.

---

## Premise

ADLC is a lifecycle for systems where LLMs sit at the **core** of product behavior, not at the edges as coding assistants. Traditional SDLC assumes behavior is fully specified at build time; agentic systems violate that assumption because they reason, adapt, and act across tools/environments engineers don't fully control. Small context changes compound into materially different outcomes.

> If software keeps changing after release, why is our lifecycle still static?

---

## SDLC vs ADLC

| Dimension | SDLC | ADLC |
|---|---|---|
| Behaviour | Deterministic — same input → same output | Probabilistic — same input can yield different output over time |
| Logic lives in | Code, config, 3rd-party deps | Code, **prompts, models, tools, external services** |
| Success metrics | Functional correctness, pass/fail | Accuracy *distribution*, hallucination rate, cost per outcome |
| Testing paradigm | Predefined tests on known paths | Continuous evaluation of reasoning, safety, tool use |
| Deployment | End of dev → stable operating phase | **Start** of active monitoring/control |
| Feedback loop | Reactive (users file bugs, fixes shipped later) | Recursive — telemetry continuously feeds back into prompts and context |

---

## The 8 Phases (P0–P7)

### P0 — Preparation & Hypotheses *(maps to SDLC Planning)*
Pain-point discovery with users/operators; review existing docs/workflows/policies; form **testable hypotheses** about where an agent could assist / augment / automate.
**Deliverables:** explicit assumptions about where AI may/may-not help; early success criteria and failure signals.

### P1 — Scope Framing & Problem Definition *(SDLC Analysis)*
Map end-to-end business process and link AI use to specific workflow steps; identify constraints (compliance, risk tolerance, acceptable error rates, unsafe-autonomy zones); define business + technical KPIs (cycle time, accuracy, cost, latency, escalation rate); **human–agent responsibility mapping** (decisions, approval gates, authority levels); data readiness review.
**Deliverables:** scoped problem, KPIs and thresholds, documented human–agent responsibility model.
> The responsibility-mapping deliverable has *no equivalent in SDLC* — explicitly called out in the source.

### P2 — Agent Definition & Architecture *(SDLC Design)*
Choose agent pattern (ReAct, Plan-and-Execute, multi-agent); design data architecture & governance; CAPEX/OPEX cost structure incl. token economics; technology stack (LLMs/SLMs, orchestration frameworks like LangChain/CrewAI, vector DBs); compliance & risk assessment for prompt injection / unintended actions.
**Testing strategy and evaluation framework are defined before any code is written**, including golden-dataset strategy.

### P3 — Simulation & Proof of Value *(SDLC Design / Validation)*
Build a **golden dataset** ("ground truth"); build a lightweight PoV prototype aimed at high-risk assumptions (not UI polish); capture baselines for accuracy / hallucination rate / response quality / cost; validate the business case against the original hypothesis.
**Treated as a hard go/no-go validation gate.**

### P4 — Implementation & Evals *(SDLC Implementation)*
Build the production system through a high-frequency **change → evaluate → confirm → proceed** loop. May execute dozens or hundreds of times during implementation, not once per release.
Activities: agent dev + prompt engineering, tool/API integration, data pipelines, **context engineering** (memory mgmt, conversation history, dynamic context assembly), continuous evaluation, data quality & labeling validation.

### P5 — Testing *(SDLC Testing)*
End-to-end LLM validation under production-like conditions; UAT with stakeholders; bias & fairness testing; compliance / safety / red-team exercises; performance & scalability; formal **release-readiness sign-off** against documented thresholds. Generic frameworks (RAGAS, DeepEval) are a starting point but thresholds must be tailored.

### P6 — Agent Activation & Deployment *(SDLC Deployment)*
Controlled rollout (canary, blue-green, phased); infrastructure setup; smoke tests confirming integrations and escalation paths; **AI-specific observability** (hallucination rate, latency, toxicity, context drift); alerting & escalation triggers; rollback / containment plan. Framed in the source as the *transition from build to supervision*.

### P7 — Continuous Learning & Governance *(SDLC Maintenance)*
Ongoing ops & cost monitoring; feedback-loop management (incl. thumbs up/down); **model versioning & compatibility regression tests** whenever an LLM provider updates; behavior-alignment audits for concept drift and guardrail effectiveness; periodic RAG/embedding refreshes.

---

## Human-in-the-Loop Checkpoints (explicit in source)

- **P1** — human–agent responsibility mapping (responsibilities, decisions, approval gates, authority levels divided)
- **P3** — go/no-go validation gate comparing prototype performance/cost against hypothesis
- **P5** — UAT + formal release-readiness sign-off with documented quality and risk thresholds
- **P6** — alerting & escalation paths with defined triggers for manual intervention
- **P7** — behavior-alignment audits, validated model-upgrade decisions, feedback prioritization

---

## Canonical Artifacts

- Assumptions register + early success/failure signals (P0)
- Scoped problem definition tied to workflow steps; KPI thresholds; human–agent responsibility model (P1)
- Agent architecture + integration model; tech/data architecture blueprint; token-consumption / ROI breakdown; **upfront test strategy & golden-dataset plan** (P2)
- **Golden dataset** — persistent artifact reused for regression and fine-tuning (P3)
- Working system + fast developer-level behavioral tests; validated context-assembly/memory handling (P4)
- Data-backed sign-off doc across all metrics; red-team findings summary; incident-response & monitoring plan (P5)
- Production-deployed agent with controlled exposure; monitoring dashboards; alerting rules; rollback/containment strategy (P6)
- Ongoing quality/cost/behavior reports; prioritized improvement backlog; validated model-upgrade decisions; updated guardrails (P7)

The **golden dataset is architecturally distinctive** — defined in P3 and reused through P4, P5, and P7 as the canonical regression / fine-tuning reference.

---

## Agent Roles / Specialization

The source article does **NOT** define a named roster of agent archetypes. It references architectural *patterns* (ReAct, Plan-and-Execute, multi-agent workflows) and treats specialization as a Phase-2 design decision. `adlc-flow`'s specialist roster (eval-analyst, prompt-reviewer, red-team-analyst, cost-analyst, drift-analyst) is *our* adaptation, not EPAM's.

---

## Feedback & Evaluation Loops (signature ADLC discipline)

- Evaluation tooling is part of the build process, not downstream: "change → evaluate → confirm → proceed" runs many times per feature.
- Two-tier testing: P4 fast developer-level behavioral checks + P5 formal end-to-end with sign-off authority.
- Continuous evaluation of reasoning, safety, tool use.
- AI-specific observability in P6: hallucination, latency, toxicity, context drift dashboards.
- Recursive feedback (P7): telemetry, thumbs-up/down, drift audits → prompt/context updates.
- Regression suite re-runs on every LLM provider model update — "silent failure" prevention.
- Tools mentioned as starting points only: RAGAS, DeepEval, LLM-as-a-judge.

---

## Principles & Anti-Patterns (verbatim themes from source)

**Principles**
- Uncertainty made explicit and manageable via quality thresholds, early validation with real data, continuous monitoring.
- Deployment is the start of active monitoring, not the end of development.
- Development and evaluation are inseparable in agentic systems.
- Success measured by behavioral quality and alignment, not exact output matching.
- Agentic systems are non-stationary after deployment.

**Anti-patterns**
- Skipping P0 → automating the wrong work, amplifying broken processes.
- Skipping P1 (esp. human–agent responsibility mapping) → compliance/risk surfaces in production.
- Jumping straight into prompts/prototypes under pressure to "demonstrate AI progress."
- Treating data governance as post-launch cleanup ("Data functions as the agent's logic layer").
- Designing tests *after* implementation rather than upfront in P2.
- Batch testing — delayed validation cascades failures.
- Testing only on curated examples; missing edge cases and imperfect data.
- Treating generic eval frameworks as drop-in without tailoring thresholds.

---

## Known gaps in the source (for honesty)

- No agent-role taxonomy (planner/coder/reviewer/etc).
- Numbering inconsistency: header says "7 phases" but body lists 8 (P0–P7); article does not reconcile.
- Diagram images referenced (`gaentic-development-lifecycle.png`) not extractable; may contain detail beyond text.
- Marketing-flavored — no formal spec templates for artifacts; we author our own per ADR-002.

---

## Adapter notes — how `adlc-flow` deviates from the source

| Source concept | adlc-flow choice | Rationale |
|---|---|---|
| 8 phases (P0–P7) | 7 modes (P0+P1 merged into `discover`) | A solo team rarely needs separate discover/analysis phases — merging keeps mode count manageable. Can split if friction emerges. |
| No named gates | 6 named gates (HG/SG/AG/VG/RG/MG) | Explicit acronyms map to skill names + speed protocol output. See ADR-003. |
| No named agent roster | 5 planned specialists (v0.2) | Mirrors dev-flow's dispatcher pattern; aids invocation clarity. |
| Eval tooling left unspecified | Plugin scaffolds *strategy* + *artifacts*, not runtime | Per anti-outcomes (USER-OUTCOMES.md) — plugin can't run user-project infra. |
