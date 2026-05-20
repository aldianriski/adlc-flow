---
name: eval-suite-planner
description: Use when an agentic feature has passed AG and needs the eval suite designed in detail before P4 implementation. ADLC Phase 2/3 artifact — expands agent-architect's eval-strategy outline into a concrete eval suite plan (golden-dataset shape, run cadence, cost-per-run, regression contract, owner + maintenance). Do not use for deterministic test planning — use /test-planner instead.
user-invocable: true
argument-hint: "[--feature name]"
version: "1.2.0"
last-validated: "2026-05-20"
type: rigid
---

# eval-suite-planner

Expand `EVAL-SUITE/<feature>/STRATEGY.md` (from `/agent-architect`) into a runnable eval suite plan at `EVAL-SUITE/<feature>/PLAN.md`. Per ADR-006, division of labor:
- `agent-architect` produces STRATEGY.md: methodology + thresholds (AG commitments)
- This skill produces PLAN.md: dataset shape + cadence + cost budget + regression contract + owner

## Inputs

- `EVAL-SUITE/<feature>/STRATEGY.md` — methodology + thresholds (from `agent-architect`)
- Hypothesis row from `HYPOTHESIS.md` (for kill-criteria + business KPIs)
- Responsibility map (for unsafe-autonomy zones that need adversarial eval coverage)

If any missing, halt and prompt.

## Plan Sections (required)

### 1. Cross-reference STRATEGY methodology + thresholds
PLAN.md does NOT re-state methodology + thresholds — those live in STRATEGY.md (single source of truth per ADR-006). PLAN.md cross-references STRATEGY § Methodology and § Thresholds at the top.

### 1a. Per-agent eval subfiles (multi-agent only · F5.2 Trial 3)

When the architecture is multi-agent with **≥3 agents**, PLAN.md MAY split per-agent eval detail into `EVAL-SUITE/<feature>/per-agent/<agent-name>.md` files. Each subfile contains: agent-specific metrics + thresholds + golden-subset cross-link + per-agent cost ceiling. PLAN.md retains the cross-surface concerns (handoff metrics, end-to-end metrics, cadence, budget, owner). Optional below 3 agents — at 2 agents, inline tables stay readable; at 3+, the PLAN.md table grows past the 100-line readability threshold (Trial 3 finding F5.2).

### 2. Golden dataset shape
- Size (target N; minimum for stable p95)
- Composition (% happy path · % edge cases · % imperfect inputs · % adversarial)
- Provenance (synthetic / real-pulled / hand-curated)
- Versioning policy (semver? snapshot per release?)
- Refresh cadence (drift triggers re-curation)

Cross-link to `/golden-dataset` skill for the artifact itself.

### 3. Run cadence
- **Dev loop** (P4): which subset runs after every meaningful change? Target latency ≤ 30s.
- **Pre-merge**: full suite or fast subset? Where does the line sit?
- **Pre-release** (P5/RG): full suite + UAT + red-team. No timeline pressure.
- **Operational** (P7): which metrics run daily/weekly against live samples?
- **Model-upgrade** (MG): full regression suite re-run.

### 4. Cost-per-run budget
- Per dev-loop run · per pre-merge · per pre-release · per operational sample · per MG regression
- Daily/weekly/monthly aggregate budget
- Alert thresholds (cost overrun triggers escalation)

### 5. Regression contract
- What constitutes a regression (delta from previous baseline > X)
- Who can approve a baseline shift (and on what evidence)
- Baseline location: `EVAL-SUITE/<feature>/BASELINE.md` (single file; append-only history table)
- MG gate references THIS contract — make it explicit

### 6. Owner + maintenance plan
- Eval-suite owner (human contact)
- Threshold-review cadence (typically quarterly)
- Golden-dataset refresh process

## Procedure

1. Load `EVAL-SUITE/<feature>/STRATEGY.md`; verify methodology + thresholds are populated.
2. For each required plan section (1-6), draft content. Use one-at-a-time prompts where the user must decide (cadence, owner).
3. Synthesize draft `EVAL-SUITE/<feature>/PLAN.md`.
4. Self-check: does the plan let `/pov-gate` produce a verdict? STRATEGY thresholds + PLAN sample-count + cost budget all present?
5. Confirm → `approve` → write.

## Hard Rules

- Every metric in the plan MUST have N-run statistical floor — single-pass thresholds are inadmissible.
- Cost budget MUST be set; "we'll measure later" rejected.
- Regression contract MUST exist before P4 begins; it's how MG gate works.
- Dev-loop subset MUST be fast enough to fit in the change → evaluate → confirm → proceed loop (typically ≤30s). If it can't, surface the conflict.

## Red Flags

❌ **Methodology = "LLM-as-judge for everything"** — judge drift becomes silent quality degradation; mix methods
❌ **Golden dataset entirely synthetic** — misses real-world distribution shift; require real samples
❌ **Threshold registry without "who set it"** — un-auditable thresholds get softened post-hoc; require attribution
❌ **Dev-loop subset slow** — kills P4 discipline; if can't be fast, redesign suite
❌ **No regression contract** — MG gate becomes inoperable; produce contract before plan approved

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
