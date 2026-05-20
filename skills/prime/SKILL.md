---
name: prime
description: Use when starting a new session and want to load project context in a deterministic order — CLAUDE.md, CONTEXT.md, MEMORY.md, active sprint plan, canonical ADLC artifacts. Emits a health check showing which files were found versus missing. Required reads (CLAUDE.md + CONTEXT.md) cause the skill to fail if absent; optional reads degrade gracefully. Do not use for general orientation in the middle of a session — that is /zoom-out.
argument-hint: ""
allowed-tools: Read, Bash, Grep
user-invocable: true
type: rigid
version: "1.0.0"
last-validated: "2026-05-19"
---

# prime

Ordered context loader + health check. One-shot session priming.

## When to invoke
- First action of a fresh Claude Code session before any code-touching work.
- After `/clear` to reload context without restarting the session.
- When the session feels stale and you want to confirm what state the assistant is operating against.

Not a substitute for `/zoom-out` (mid-session orientation) or `/adlc-orchestrator` (task execution).

## Read order

| # | Path | Required? | Purpose |
|---|---|---|---|
| 1 | `.claude/CLAUDE.md` | YES | Project instructions, anti-patterns, line caps, commands |
| 2 | `.claude/CONTEXT.md` | YES | Shared vocabulary, ADLC gates, modes, A1-A8 outcomes |
| 3 | MEMORY.md (resolved per harness) | NO | User-level memory index — sprint state, feedback, references |
| 4 | Active sprint plan (`docs/sprint/SPRINT-NNN-*.md`) | NO | Frontmatter + § Active Sprint section only (~50 lines) |
| 5 | Canonical ADLC artifacts (`HYPOTHESIS.md` · `RESPONSIBILITY-MAP.md` · etc.) | NO | One-line presence-check per artifact |
| 6 | `graphify-out/GRAPH_REPORT.md` (graphify knowledge-graph summary) | NO | Architectural highlights · concept index · suggested questions |

**Resolution rules**:
- Active sprint number from `TODO.md` frontmatter `sprint:` field. Resolve glob `docs/sprint/SPRINT-0<N>-*.md`. If `sprint: none` or unresolved, skip Read 4 and warn.
- MEMORY.md path is harness-defined — not under repo root. If unreadable, skip and warn.
- Canonical ADLC artifacts: presence-check only, not full read (full read happens when their owning skill fires).
- Graphify report: soft dep — emits `[OK]` if present, `[MISSING]` with install hint if not. Knowledge-heavy skills (`/zoom-out`, `/context-engineer`, `/graph-query`) hard-depend on graphify per ADR-005; `/prime` itself does not.

## Steps
1. Read each path in order. Track `[OK]` / `[MISSING]` per item. For sprint plan use partial read (frontmatter + § Active Sprint only).
2. If either CLAUDE.md or CONTEXT.md is `[MISSING]`, abort with FAIL.
3. Parse `TODO.md` frontmatter → resolve active sprint number; count `Backlog` open tasks too.
4. Count incomplete tasks (`- [ ]` lines under `## Active Sprint` heading).
5. Emit health report.
6. Emit `Next:` line based on detection: active sprint + open tasks → `/adlc-orchestrator`; active sprint + zero open → close sprint via lean-doc-generator; no sprint + backlog has tasks → promote backlog; no canonical artifacts → `/adlc-orchestrator init`.

## Output format

```
=== PRIME HEALTH ===
[OK]         .claude/CLAUDE.md
[OK]         .claude/CONTEXT.md
[OK]         MEMORY.md
[OK]         docs/sprint/SPRINT-001-bootstrap.md (partial)
[OK]         HYPOTHESIS.md · RESPONSIBILITY-MAP.md · OBSERVABILITY.md
[MISSING]    COST-BUDGET.md · MODEL-UPGRADE-LOG.md
[OK]         graphify-out/GRAPH_REPORT.md       (or [MISSING] — install: pip install graphifyy && graphify .)
Sprint:      001 (Bootstrap)
Tasks:       3 open / 5 total
Status:      ready
Next:        run /adlc-orchestrator to continue Sprint 001 (3 open tasks)
====================
```

## Constraints
- Read-only. Never writes files.
- Canonical artifacts: presence-check only — do not load full content.
- TODO.md task count is sprint-scoped (Active Sprint section only), not Backlog.

## Red Flags
❌ **Reading files outside the declared paths** — adds noise; use `/zoom-out` for broader orientation
❌ **Failing on optional file absence** — only CLAUDE.md + CONTEXT.md are required; everything else is `[MISSING]`
❌ **Writing context summaries back to disk** — read-only by contract
❌ **Running mid-task** — for session priming, not active task work; mid-task invocation suggests context drift
❌ **Summarizing file contents inline** — emit health check only; files load into conversation context for downstream skills

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
