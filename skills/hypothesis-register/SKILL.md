---
name: hypothesis-register
description: Use when starting any feature that has a falsifiable success claim worth pre-committing kill-criteria to — agentic features (default) OR non-agentic features (conversion targets, latency SLOs, reliability claims) via --type flag. Converts a business pain point into a testable hypothesis with kill-criteria written BEFORE prototyping. ADLC Phase 0 (P0) artifact builder for agentic; non-agentic variant produces a lighter HYPOTHESIS.md entry. Use --amend H-NNN to refine an existing hypothesis mid-flight with cascade-aware updates. Skip only for pure-housekeeping work with no measurable goal.
user-invocable: true
argument-hint: "[freeform pain point | --ticket ID | --prd file.md] [--type=agentic|conversion|latency|reliability|other] [--amend H-NNN]"
version: "1.5.0"
last-validated: "2026-05-20"
type: rigid
---

# hypothesis-register

Turn intent into a falsifiable hypothesis with kill-criteria. Output: BOTH a summary table row AND a per-ID detail block in `HYPOTHESIS.md` (two-tier format per ADR-006 + trial F1.1 fix).

## Input Types

| Input | Example | Detection |
|:------|:--------|:----------|
| Freeform pain | `"customer onboarding is slow"` | no flag |
| Ticket | `JIRA-123` URL | matches `[A-Z]+-[0-9]+` or URL |
| PRD | `--prd docs/feature.md` | `--prd` flag |

## Hypothesis Types (per ADR-007)

| `--type` value | Use when | Procedure |
|:---|:---|:---|
| `agentic` (default) | LLM-core feature, RAG, multi-agent, prompt-driven behavior | Full 8-step procedure below |
| `conversion` | Marketing goals, signup funnels, activation rates | 5-step lighter procedure (steps 1, 3, 4, 5, 8) |
| `latency` | Performance SLO, response-time guarantee | 5-step lighter procedure |
| `reliability` | Uptime SLO, error-rate ceiling, retry-budget | 5-step lighter procedure |
| `other` | Falsifiable non-agentic claim that doesn't fit above | 5-step lighter procedure |

Non-agentic variants SKIP steps 2 (workflow-step mapping) + 7 (approval gate identical-as-needed) and use a leaner hypothesis form. `/pov-gate` does NOT auto-update non-agentic rows (no agentic eval suite); user updates status manually via `/lean-doc-generator` Sprint Close.

## Procedure

1. **Pain identification** — restate input as a specific user/operator pain. Ask if vague. NEVER paraphrase to sound good — paraphrase to expose mechanism.
2. **Affected workflow step** — where in the user's process does this pain occur? If unclear, halt and ask.
3. **Hypothesis statement** — write as falsifiable claim. Pick ONE form (varies by `--type`):
   - **Agentic one-line**: *An agent that [behavior] will [measurable benefit] for [user] under [conditions], evidenced by [metric] above/below [threshold].*
   - **Agentic structured** (>30 words): Behavior · Benefit · User · Conditions · Metric+threshold (one per line)
   - **Conversion**: *X% of [qualified-audience] will [action] within [time window], evidenced by [metric] ≥ [threshold].*
   - **Latency**: *[Operation] completes in [time-budget] at [percentile] under [load conditions], evidenced by [measurement source].*
   - **Reliability**: *[Service/feature] meets [SLO metric] at [target %] over [observation window], evidenced by [monitoring source].*
   - **Other**: free-form falsifiable claim with a measurable threshold
4. **Kill-criteria** — write the conditions that abort this hypothesis. Template:
   > *Abort if: [metric] worse than [threshold] after [budget] of effort, OR [risk] materializes during PoV.*
   Kill-criteria written BEFORE prototyping. If you can't write kill-criteria, the hypothesis is too vague.

   **Multi-agent prompt (F5.4 · Trial 3 · deferral added F6.1 · Trial 4)** — for `--type=agentic`, ask explicitly: *"Is this a multi-agent system (≥2 LLM agents with handoffs)?"* Accept three answers:
   - **yes** → prompt for at least one kill-criterion from each of three classes: inter-agent injection-resistance · role-confusion attack rate · authority-escalation success rate
   - **no** → skip; single-agent kill-criteria only
   - **not sure / decide at AG** *(Trial 4 fix)* → write a `[DEFER-TO-AG]` placeholder block in the kill-criteria section: *"Multi-agent kill-criteria deferred to AG. If `/agent-architect` selects multi-agent (any sub-variant), revisit this hypothesis and amend kill-criteria for inter-agent injection-resistance · role-confusion · authority-escalation."* The amendment is then triggered by `/agent-architect` Step 6 before ADR write.

   Background: Trial 3 surfaced inter-agent injection as the first kill-criterion to fire on data. Trial 4 then showed that asking the multi-agent question at HG has a chicken-and-egg problem — multi-agent vs single-agent is an AG decision, not an HG one. The deferral option resolves this without losing the pre-commitment discipline.
5. **Skip-when** (counter-evidence) — when is the agentic approach *not* the right answer? Non-tautological. Identify the deterministic / human-workflow / off-the-shelf-tool alternative.
6. **User-project outcome** — name ≥1 of A1-A8 (per `docs/USER-OUTCOMES.md`); A1 (hypothesis-quality) is universal across all types.
7. **Confirm** — emit draft to user; await `approve`. Never write to `HYPOTHESIS.md` before approval.
8. **Write BOTH** — append (a) summary table row + (b) per-ID detail block under `## H-NNN detail` heading. Schema per `templates/HYPOTHESIS.md.template`:
   - **Summary row**: `ID · Date · Type · Pain (1-line) · Hypothesis (1-line) · Outcome · Status`
   - **Detail block** (separate `## H-NNN detail` section): Type · Pain (full) · Hypothesis (full — form per step 3) · Kill-criteria (full) · Skip-when (full) · Outcome rationale · VG verdict placeholder (agentic only; non-agentic uses Sprint Close status update)

If the file doesn't exist, create it from `templates/HYPOTHESIS.md.template`. Status values: `OPEN` · `PROVED` · `KILLED` · `DEFERRED`. VG verdict appended by `/pov-gate` to summary row + detail block.

## Amendment mode (`--amend H-NNN` · F7.1 · Trial 4b)

Invoke when an existing hypothesis's wedge refines mid-flight (e.g. scope narrows · pivot · learnings reshape kill-criteria). Modified flow: load current H-NNN · prompt one-field-at-a-time which to amend (Behavior · Benefit · User · Conditions · Metric · Kill-criteria · Skip-when · skip unchanged) · cascade-scan dependent artifacts and recommend per-artifact action:

- `RESPONSIBILITY-MAP.md` — decision rows (Behavior change usually requires review)
- `docs/adr/ADR-NNN-*.md` for this hypothesis — amendment header noting fields changed
- `EVAL-SUITE/<feature>/{STRATEGY,PLAN}.md` — rewrite metrics if kill-criteria changed
- `COST-BUDGET.md` — feature ceiling if cost kill-criterion changed
- `EVAL-SUITE/<feature>/` directory name — flag as stale if Behavior fundamentally changed

Emit amended row + detail block + `**Amendment history**` line in detail block. Hard rule: never silently soften kill-criteria — softening post-PoV is the anti-pattern; always require explicit reaffirmation when amending criteria.

## Hard Rules

- Never skip kill-criteria — that's the entire point of P0 vs. just "writing tasks."
- Kill-criteria must be measurable and time/effort-bounded ("if accuracy < 70% after 1-week PoV").
- Hypothesis must name a *specific* user, not "users" generically.
- Reject hypothesis if skip-when is tautological ("skip when not useful").
- Never write to `HYPOTHESIS.md` before user types `approve`.

## Red Flags

❌ **Hypothesis without metric or threshold** — not falsifiable; rewrite or reject
❌ **Kill-criteria written *after* PoV** — defeats the gate; the whole point is pre-commitment
❌ **"AI could help with X" as hypothesis** — too vague; force the behavior + benefit + condition + threshold
❌ **Skip-when says "skip when not needed"** — tautological; identify the actual alternative
❌ **User can't name a single affected user/operator** — likely a solution looking for a problem; halt and re-scope

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
