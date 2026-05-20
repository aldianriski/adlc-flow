# adlc-flow — AI Context

## Project Overview
- **Name**: adlc-flow
- **Type**: Claude Code plugin · Unified Skill Library · Workflow Scaffold for traditional + agentic dev
- **Supersedes**: `dev-flow` (frozen at v4.x) — see ADR-004
- **Stack**: Markdown · Claude Code skills system · Node.js ≥18 · Python ≥3.10 (graphify, soft dep · hard for /zoom-out · /context-engineer · /graph-query per ADR-005)
- **Source framework**: EPAM Agentic Development Lifecycle (ADLC) — see [`docs/research/ADLC-source.md`](../docs/research/ADLC-source.md) + ADR-002
- **Knowledge graph backend**: graphify (https://graphify.net) — see ADR-005
- **Architecture**: Plugin-first layout — components at repo root per Claude Code plugin spec

## What this plugin is for

Unified dev workflow for **both traditional code AND agentic products**. Two surfaces in one plugin:

- **Agentic lifecycle** (ADLC-native): the 7 modes (`discover → operate`) for LLM-core features. Behavior is probabilistic; eval IS development; deployment starts monitoring; model upgrades trigger regression.
- **Universal dev workflow** (absorbed from dev-flow v4.x per ADR-004): PR review · ADR · sprint protocols · TDD · debugging · refactoring · release. Use these on the traditional code that surrounds your agentic features.

Most modern projects ship hybrid code; one plugin covers both.

## File Structure
```
skills/                  # Phase-bound skills (plugin auto-discovers)
agents/                  # Specialist agents (v0.2+)
.claude-plugin/
  plugin.json            # plugin manifest
  marketplace.json
.claude/
  CLAUDE.md              # this file
  CONTEXT.md             # vocab · gates · modes · A1-A8 outcomes · principles
docs/
  USER-OUTCOMES.md       # A1-A8 registry — every component maps here
  adr/                   # ADR-001+ one decision per file
  research/              # vendored source material (ADLC-source.md)
```

## Code Generation Order
1. `SKILL.md` — purpose, steps, red flags (≤100 lines)
2. `skills/<name>/references/` — reference content >100 lines
3. Agent binding (v0.2+)
4. Phase-specific artifact templates

## Anti-Patterns
❌ Treating evaluation as a downstream activity — eval IS development in ADLC
❌ Designing tests after implementation — eval strategy defined at Phase 2 (AG gate)
❌ Skipping P0/P3 PoV → automating the wrong thing or shipping uneconomic agents
❌ Bypassing graphify in knowledge-heavy skills — `/zoom-out` · `/context-engineer` · `/graph-query` hard-fail without it per ADR-005
❌ Plugin-internal optimization without stated user-project outcome (see `docs/USER-OUTCOMES.md`)
❌ Hiding probabilistic behavior behind pass/fail tests — use distributions + thresholds

## Naming Conventions — files: kebab-case · gates: 2-letter codes (HG/SG/AG/VG/RG/MG)

## Definition of Done
- [ ] Acceptance criteria verified by human at the relevant ADLC gate
- [ ] Phase-appropriate artifact updated (HYPOTHESIS.md / RESPONSIBILITY-MAP.md / GOLDEN-DATASET/ / EVAL-SUITE/ / OBSERVABILITY.md / FEEDBACK-LOG.md)
- [ ] CONTEXT.md updated if vocabulary, gate, mode, or outcome changed
- [ ] ADR written for hard-to-reverse decisions (esp. agent-architecture choice)
- [ ] Line limits respected: CLAUDE.md ≤80 · SKILL.md ≤100 · agents ≤30

## Behavioral Guidelines

### Think Before Acting
Surface assumptions. Ask on ambiguous requirements. Do not generate plausible-sounding output to cover uncertainty in agent behavior.

### Eval Before Code
ADLC's signature discipline. Define eval strategy at AG (Architecture Gate) before any production code. Phase 4 builds via change → evaluate → confirm → proceed.

### Probabilistic Honesty
Single-pass test results are noise. Report distributions over N runs. Threshold-based pass, not binary.

### Goal-Driven Execution
Restate the task as a verifiable goal AND name its ADLC phase before implementing.
