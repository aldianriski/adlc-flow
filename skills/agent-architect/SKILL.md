---
name: agent-architect
description: Use when an agentic feature has passed HG/SG and needs an architecture decision — choosing between ReAct, Plan-and-Execute, multi-agent, or hybrid patterns. ADLC Phase 2 (P2) artifact; co-produces ADR + initial eval-strategy outline BEFORE production code. Do not use for tactical code design — use design-analyst agent instead.
user-invocable: true
argument-hint: "[--hypothesis H-NNN | --feature name]"
version: "1.4.0"
last-validated: "2026-05-20"
type: rigid
spawns: adr-writer
---

# agent-architect

Choose an agent architecture pattern with documented rationale + initial eval strategy. Outputs: ADR via `/adr-writer` + eval-strategy doc at `EVAL-SUITE/<feature>/STRATEGY.md` (standardized in ADR-006).

## Pattern Choices

| Pattern | Fits when | Cost profile | Eval complexity |
|---|---|---|---|
| **ReAct** | Single agent, tool-using, short trajectory, observable reasoning | Low-Medium | Medium — eval reasoning steps + final answer |
| **Plan-and-Execute** | Multi-step task, planning benefits from being decoupled from execution | Medium | Medium-High — eval plan quality separately from execution |
| **Multi-agent** | Specialized roles (researcher, coder, reviewer), parallel work, distinct expertise | High | High — per-agent + handoff eval |
| **Hybrid (Plan + multi-agent)** | Long-horizon tasks with specialized subtasks | Highest | Highest — combines both eval surfaces |

Reference patterns sourced from EPAM ADLC P2 — see `docs/research/ADLC-source.md`.

### Multi-agent sub-variants (when multi-agent selected · F5.8 v2.5)

Multi-agent is a family, not one shape. After confirming multi-agent (Step 3 tie-break), pick the topology:

| Sub-variant | Shape | Fits when | Coordination cost |
|---|---|---|---|
| **orchestrator-worker** | one router + N specialists + optional coordinator | clear classification step upstream of specialized work (e.g. Trial 3: classifier → 3 specialists → coordinator) | Medium — central state simplifies audit |
| **peer-network** | agents collaborate via shared blackboard or direct messages, no fixed hierarchy | emergent multi-perspective synthesis (debate · brainstorm · consensus) | High — message-ordering + termination are non-trivial |
| **hierarchical / supervisor** | supervisor agents recursively manage subordinates | deep task decomposition (research pipeline · multi-stage data prep) | Highest — drift compounds at each level |

ADR MUST name the sub-variant chosen and cite why it beat the others for THIS feature.

## Procedure

1. **Read context** — load HYPOTHESIS.md row (from `--hypothesis H-NNN`) + KPIs + responsibility map if present. If hypothesis status is not `OPEN`, halt.
2. **Trajectory analysis** — answer four questions one at a time:
   - How many tool calls / reasoning steps per task on the median path?
   - Does planning benefit from being separated from execution (yes if plan is reusable / cacheable / human-reviewable)?
   - Are there ≥2 distinct expertise domains required (e.g., SQL + customer-comms)?
   - What's the budget envelope (latency + cost per task)?
3. **Pattern proposal** — propose ONE pattern based on answers; cite the trajectory analysis. Offer the recommended pattern first; explain why alternatives were rejected for THIS feature.
   - **Tie-break (F5.1 · Trial 3)**: when Q3 = yes (≥2 distinct domains) AND Q1 median trajectory <5 steps, the trajectory length is too short to amortize multi-agent coordination overhead. Resolve by:
     - **Multi-agent** ONLY if the specialist domains have non-overlapping knowledge (e.g. billing vs. legal-refund: zero shared corpus → handoff justified)
     - **Hybrid (ReAct with per-domain tool subsets)** when domains overlap in knowledge but differ in tools/output format — keeps a single reasoning loop, swaps tool surface by domain. Lower coordination cost; same expertise routing.
4. **Eval strategy outline (AG-required commitments only)** — methodology + thresholds. Defer dataset/cadence/cost/regression-contract to `/eval-suite-planner` (avoids double-write per ADR-006 § Division of labor). Required at THIS step:
   - Eval methodology (RAGAS / DeepEval / LLM-as-judge / domain-custom) per metric
   - Metrics + thresholds (per metric: pass-threshold, fail-threshold, N-run statistical floor)
5. **Cost model draft** — token economics: average prompt + completion + tool-call cost per task; expected daily/monthly volume; capex + opex.
6. **ADR dispatch** — invoke `/adr-writer` with title `ADR-NNN: Agent pattern for <feature>` and content from steps 3-5. User reviews + approves. Target length: 50-100 lines.
   - **Multi-agent amendment trigger (F6.1 · Trial 4)**: BEFORE invoking `/adr-writer`, if Step 3 chose any multi-agent sub-variant (orchestrator-worker · peer-network · hierarchical) OR hybrid, check HYPOTHESIS.md for `[DEFER-TO-AG]` placeholder in kill-criteria. If present, HALT ADR write and prompt user to amend the hypothesis with the three multi-agent kill-criteria classes (inter-agent injection-resistance · role-confusion · authority-escalation). Amendment runs `/hypothesis-register` in amend mode against the existing H-NNN row. Resume ADR write after amendment confirmed.
7. **Write `EVAL-SUITE/<feature>/STRATEGY.md`** — methodology + thresholds + cost model from steps 4-5. This is the input that `/eval-suite-planner` consumes to produce `PLAN.md`.

## Hard Rules

- Never propose a pattern without trajectory analysis — pattern choice without rationale is cargo-culting.
- Multi-agent recommended ONLY if ≥2 distinct expertise domains AND parallelism gains > coordination overhead.
- Eval strategy MUST be drafted before ADR finalizes — ADLC's eval-before-code rule.
- Cost model MUST include both prompt AND completion tokens — completion is often the larger line item.
- If no golden dataset exists or is planned, mark this as a blocker; cannot pass AG gate.

## Red Flags

❌ **"Just use multi-agent, it's powerful"** — multi-agent without distinct expertise domains is overhead masquerading as architecture
❌ **Eval strategy deferred to "after we see how it goes"** — ADLC rejects this; eval is design, not afterthought
❌ **Cost model = "we'll measure later"** — same anti-pattern; token economics is part of architecture choice
❌ **Pattern chosen because team is familiar with framework X** — framework is a *tactic*, pattern is a *strategy*; don't conflate
❌ **No fallback path if agent fails** — every pattern must have a documented graceful-degradation route

## References

- `references/prompt-caching-pattern.md` — 3-cache-block prompt architecture (Trial 4b F7.6)
- `references/single-call-planner.md` — single-call planner with `tool_use` (Trial 4b F7.7)

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
