---
name: graph-query
description: Use when querying the project's knowledge graph for architectural facts, semantic relationships, or cross-cutting impact analysis. Hard depends on graphify (https://graphify.net) — install via `pip install graphifyy && graphify install` (Python ≥3.10). Reads graphify-out/graph.json + GRAPH_REPORT.md OR queries graphify's MCP stdio server if configured. Do not use to write code; this skill answers questions only.
user-invocable: true
argument-hint: "[natural-language question | --component name | --files path/to/file.py]"
allowed-tools: Read, Bash, Grep
version: "1.0.0"
last-validated: "2026-05-19"
type: flexible
---

# graph-query

Natural-language query interface against the project's graphify knowledge graph. Hard-depends on graphify (per [ADR-005](../../docs/adr/ADR-005-graphify-adoption.md)).

## When to invoke

- "What functions call X?" / "Which modules depend on Y?"
- "How is the auth system structured?" / "Where do architectural decisions document this concept?"
- Cross-cutting impact analysis before a refactor
- Surfacing the link between a design ADR and the functions that implement it (graphify's signature capability)

For module-map orientation use `/zoom-out` instead — same backend, different rendering.

## Prerequisites

```bash
# Adopter project setup (one-time)
pip install graphifyy           # or: uv tool install graphifyy
graphify install                # registers /graphify in Claude Code
graphify .                      # build the graph (outputs to graphify-out/)
```

Optional: `pip install "graphifyy[mcp]"` to enable MCP stdio server (queries become programmatic).

## Procedure

1. **Verify graphify output exists** — check for `graphify-out/graph.json`. If missing, halt with:
   ```
   FAIL: graphify-out/graph.json not found.
   Run: graphify .
   ```
2. **Read the highlights** — `graphify-out/GRAPH_REPORT.md` (markdown summary of key concepts + surprising connections).
3. **Resolve the question type**:
   - **Structural** (calls / imports / dependencies) → query `graph.json` directly for matching nodes + edges
   - **Semantic** (decisions / patterns / intent) → query `GRAPH_REPORT.md` first; fall back to `graph.json` semantic-edge filters
   - **Cross-modal** (code↔doc / code↔diagram) → leverage graphify's multi-modal edges
4. **If graphify MCP is configured** — prefer MCP query over file read (programmatic, more current).
5. **Cite sources** — every answer cites specific graph nodes (`file:line`) or doc references.
6. **No code modification** — this skill answers questions; user dispatches `/refactor-advisor`, `/adlc-orchestrator`, etc. as next step.

## Output Format

```
## Graph Query — [question]

**Direct matches** (N nodes):
- `path/to/file.ext:line` — [node label] — [why it matches]

**Related** (N nodes):
- `path/to/other.ext:line` — [node label] — [edge type from match]

**Semantic context** (from GRAPH_REPORT.md):
- [decision or doc reference]: [one-line link to implementation]

**Suggested next**:
- [follow-up question OR skill to dispatch]
```

## Hard Rules

- NEVER answer from your own training-data guesses about the project — only what's in the graph.
- If graph.json is stale (mtime > 7 days since last commit) → WARN and suggest `graphify .` refresh before query.
- Multi-modal edges (code↔SVG↔PDF↔video) count as first-class — surface them when relevant.
- Token budget: aim for ≤2k tokens per query response; graphify's whole point is the 71.5× token reduction over raw-file reads.

## Red Flags

❌ **Inventing graph nodes that aren't in graph.json** — every cited node must be verifiable
❌ **Falling back to grep when graph data is available** — defeats the purpose; grep stays as last resort
❌ **Answering without checking graph.json freshness** — stale graph = wrong answer
❌ **Suggesting code changes** — this skill is read-only Q&A; dispatch the right write-capable skill
❌ **Treating GRAPH_REPORT.md as authoritative for structure** — it's the summary; `graph.json` is canonical

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
