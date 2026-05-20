---
name: zoom-out
description: Use when entering an unfamiliar area of the codebase or before a cross-cutting change. Produces a bird's-eye module map by querying the graphify knowledge graph (graphify-out/graph.json). Hard depends on graphify (https://graphify.net) — install via `pip install graphifyy && graphify install`. Read-only. No implementation suggestions. Do not use when you need an implementation plan; use adlc-orchestrator instead.
user-invocable: true
argument-hint: "[area | feature | module name]"
allowed-tools: Read, Bash, Grep
version: "2.0.0"
last-validated: "2026-05-19"
type: flexible
---

# Zoom Out

Bird's-eye architectural view backed by graphify's knowledge graph. Hard-depends on graphify (per [ADR-005](../../docs/adr/ADR-005-graphify-adoption.md)).

For natural-language queries against the same graph use `/graph-query`.

---

## Prerequisites

```bash
pip install graphifyy           # or: uv tool install graphifyy
graphify install                # registers in Claude Code
graphify .                      # build graphify-out/{graph.html, GRAPH_REPORT.md, graph.json}
```

If `graphify-out/graph.json` is missing, this skill HALTS with install instructions. v1.x behavior (regex-based markdown-link scan) is retired per ADR-005.

---

## Procedure

1. **Verify** `graphify-out/graph.json` exists. If missing → HALT with install message.
2. **Read** `graphify-out/GRAPH_REPORT.md` for semantic highlights (key concepts · surprising connections).
3. **Query** `graph.json` for the requested area:
   - Filter nodes by path-prefix or module-cluster matching the area argument
   - Cap at top-10 nodes by centrality (Leiden cluster + degree)
4. **Identify** ENTRY POINTS (nodes flagged as `entrypoint` in graph metadata) within the filtered set.
5. **Identify** SEAMS (low-coupling edges between clusters — natural refactor boundaries).
6. **Recommend** LOAD THIS NEXT (highest-centrality node not yet in conversation context).
7. **Emit** the Output block (below). Cite file:line for every node.

---

## Output

```
## Zoom Out — [area / feature]

MODULES (from graph.json clusters):
- [module name] — [single responsibility from GRAPH_REPORT.md] — [key files]
- ...

CONNECTIONS:
- [A] → [B]: [edge type from graph.json] — [what flows between]
- ...

ENTRY POINTS:
- [file:line] — [what triggers this flow]

SEAMS (safe change boundaries — low-coupling cluster edges):
- [boundary] — [why it's safe to change in isolation]

LOAD THIS NEXT:
- [file] — [why it's the highest-centrality node not yet loaded]
```

---

## Rules

- Use exact vocabulary from `CONTEXT.md` — no invented terms
- Cite specific `file:line` for every node — graph data is the ground truth
- No implementation suggestions — orientation only
- ≤10 modules per map; if more, narrow the area argument

---

## Red Flags

❌ **Falling back to file-walking when graph.json is missing** — HALT instead; users must build the graph first
❌ **Inventing domain terms not in graph or CONTEXT.md** — agent drift; defer to artifacts
❌ **Suggesting implementation** — orientation only; use `/adlc-orchestrator`
❌ **Mapping >10 modules** — exceeds working-memory; narrow first
❌ **Reading full files** — graph already contains node summaries; raw reads waste the 71.5× token reduction

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
