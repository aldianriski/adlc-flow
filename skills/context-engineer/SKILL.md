---
name: context-engineer
description: Use when reviewing how an agentic feature assembles context at P4 build — memory, conversation history, dynamic context assembly, RAG retrieval, prompt-injection surfaces. Hard depends on graphify (https://graphify.net) to map context-assembly code. Outputs CONTEXT-REVIEW with concrete recommendations. Do not use for prompt content review — use prompt-reviewer agent.
user-invocable: true
argument-hint: "[--feature name | --component memory/rag/history]"
allowed-tools: Read, Bash, Grep
version: "2.0.0"
last-validated: "2026-05-19"
type: rigid
---

# context-engineer

Review the context-assembly code of an agentic feature. ADLC P4 calls "context engineering" out as a first-class concern. Hard-depends on graphify (per [ADR-005](../../docs/adr/ADR-005-graphify-adoption.md)) to map the assembly path through the codebase.

For surface-level orientation use `/zoom-out`. For interactive graph queries use `/graph-query`.

## Prerequisites

```bash
pip install graphifyy && graphify install && graphify .
# Optional but recommended:
pip install "graphifyy[mcp]"     # MCP stdio server for programmatic queries
```

If `graphify-out/graph.json` is missing → HALT with install message.

## What gets reviewed

| Component | Questions | Graph signal |
|---|---|---|
| **Memory** | What persists? What expires? Per-user isolation? | Nodes in `memory/` or labeled `memory-write` |
| **Conversation history** | Window size? Truncation strategy? Token cap? | Edges into prompt-assembly nodes |
| **RAG retrieval** | Index freshness? Embedding-model version pinned? Top-K vs. score threshold? Re-ranker present? | Nodes labeled `retrieval` or `vector_store` |
| **Dynamic assembly** | Block order? Dedup? Total token budget? | Function-call graph terminating at LLM-call node |
| **Injection surface** | User-input entry points? Role boundary markers? Tool-output sanitization? | Edges from user-input nodes into prompt-assembly |

## Procedure

1. **Verify graphify-out present** → HALT if missing.
2. **Identify the assembly entry node** — function that builds the final prompt. Usually labeled `prompt-builder`, `assemble_context`, `make_messages`, etc. If MCP available, query for `kind=prompt-assembly`.
3. **Trace upstream nodes** — every node feeding into the assembly entry. Document each block source.
4. **Per-component pass** (5 components above) — ask one question at a time; cite graph node(s) for each finding.
5. **Token budget audit** — sum max token sizes per block source (from graph node metadata if present; else prompt user to measure). Flag if assembly can exceed model context window.
6. **Injection-surface audit** — enumerate every user-input node with an edge into prompt-assembly. For each, verify role-boundary marker + sanitization. Cross-reference adversarial samples in `GOLDEN-DATASET/<feature>/v*/samples/adversarial/`.
7. **Memory hygiene** — verify per-user isolation via graph (state-write nodes filtered by user-id parameter? or global?). Multi-tenant agent + shared memory = CRITICAL finding.
8. **Recommendations** — severity-ordered (CRITICAL / HIGH / MEDIUM / LOW). CRITICAL blocks the eval loop.

## Output

`CONTEXT-REVIEW-<feature>.md` containing:
- Assembly path diagram (graph subgraph rendering)
- Per-component findings with cited graph nodes
- Token budget table
- Injection-surface table (each entry node + boundary marker + sanitization status)
- Severity-ordered recommendations

## Hard Rules

- Token budget MUST be calculated from graph metadata or measured — never estimated.
- Every user-input injection point MUST have a role boundary marker. Missing → CRITICAL.
- Per-user memory isolation MUST be verified via graph trace, not assumed.
- RAG embedding-model version MUST be pinned (check graph for hardcoded model strings).
- Citations MUST reference graph nodes; "I think this code does X" without graph backing is rejected.

## Red Flags

❌ **"We summarize when history gets long"** — no rule for *when* / *how* = silent quality collapse; specify trigger + algorithm
❌ **Top-K retrieval without score floor** — irrelevant chunks pollute context; add threshold
❌ **User input concatenated without role marker** — prompt-injection vulnerability; CRITICAL
❌ **Embedding model "latest"** — silent drift on provider update; pin version
❌ **Multi-tenant agent shares memory by default** — data-leak surface; verify isolation pattern
❌ **Analysis without graph citations** — falls back to grep-guessing; defeats hard-dep on graphify

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
