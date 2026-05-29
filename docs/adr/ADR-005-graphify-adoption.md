---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-29
update_trigger: ADR status change OR graphify-integration scope revised
status: decided
---

# ADR-005: Adopt graphify as the canonical knowledge-graph backend

**Date**: 2026-05-19
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

v2.0.0 absorbed `codemap-refresh` from dev-flow: a regex-based script that scans markdown files for `[text](path)` links and produces `docs/codemap/CODEMAP.md` (Hubs · Deps · Modules · L0-overflow) + `handoff.json`. This was always a placeholder — link-count heuristics give surface-level navigation aid, nothing semantic.

In session 2026-05-19 the user surfaced [graphify](https://graphify.net) ([safishamsi/graphify](https://github.com/safishamsi/graphify)) as a reference for "optimal knowledge AI assist, beyond than codemap." Investigation:

- **49k+ GitHub stars · MIT license · multi-language port available** — mature, broadly adopted
- **Two-stage analysis**: Tree-sitter AST (verifiable structure) + LLM semantic extraction (architectural intent from comments / markdown / SVG diagrams / PDFs / images / video)
- **Output**: `graphify-out/{graph.html, GRAPH_REPORT.md, graph.json}` — interactive + readable + machine-queryable; Leiden community clustering
- **Performance claim**: ~1.7k tokens per query vs ~123k reading raw files (71.5× reduction on a 52-file mixed corpus)
- **Privacy**: only semantic descriptions transit to LLM; never raw source. Uses adopter's own API key
- **MCP server**: `graphifyy[mcp]` extra provides stdio MCP server for programmatic queries
- **Install**: `pip install graphifyy && graphify install` — registers `/graphify` skill in Claude Code

Side-by-side comparison with our `codemap-refresh.js`:

| Capability | `codemap-refresh.js` (ours) | graphify |
|---|---|---|
| Scan method | Regex on `[text](path)` markdown links | Tree-sitter AST + LLM semantic pass |
| Output | Hubs · Deps · Modules · L0-overflow strings | Full graph + clusters + multi-modal edges + Mermaid call-flow |
| Multi-modal coverage | Markdown only | Code · SQL · R · shell · docs · PDFs · SVG · audio · video |
| Semantic edges | None | Architectural decisions ↔ implementing functions |
| Query interface | Read static markdown | `graph.json` + optional MCP stdio server |
| Cost | Zero (regex only) | LLM tokens per refresh (adopter's API key) |
| Cross-platform | Node, yes | Python ≥3.10 |
| Maturity | 1 day old | 49k stars, multi-platform CI |

The ours-vs-theirs gap is not "ours is rougher" — it's a category difference. The right move is to retire ours and adopt theirs.

## Decision

**1. Retire `codemap-refresh` entirely.** Delete `scripts/codemap-refresh.js` and `skills/codemap-refresh/SKILL.md`. The `/codemap-refresh` slash command no longer exists in adlc-flow v2.1+.

**2. Adopt graphify as the canonical knowledge-graph backend.** Reference URL: https://graphify.net · Repo: https://github.com/safishamsi/graphify · License: MIT.

**3. Hard dependency for knowledge-heavy skills.** The following skills HALT with a clear install message if `graphify-out/graph.json` is absent:
   - `/zoom-out` (v2.0.0 → v2.1.0) — now queries `graph.json` instead of regex-walking markdown
   - `/context-engineer` (v2.0.0 → v2.1.0) — queries graphify to map agentic context-assembly code
   - `/graph-query` (NEW v2.1.0) — natural-language question interface against the graph

**4. Soft dependency for session-bootstrap.** `/prime` adds a `graphify-out/GRAPH_REPORT.md` read step that emits `[OK]` or `[MISSING]` with install hint. `/prime` itself does NOT hard-fail on missing graphify — basic session-bootstrap remains usable for fresh adopters.

**5. SessionStart hook augmented.** `scripts/session-start.js` now reports graphify presence + graph age; warns if `graphify-out/graph.json` is older than 7 days (refresh hint).

**6. MCP integration encouraged.** When graphify's MCP stdio server is configured (`pip install "graphifyy[mcp]"`), skills prefer MCP queries over static `graph.json` file reads — programmatic queries surface fresher data than the last `graphify .` build.

**7. Python ≥3.10 becomes a soft dep for adlc-flow.** Currently adlc-flow ships Node-only. With graphify integration, adopters who want the deep knowledge-graph features need Python ≥3.10. Adlc-flow's Node-only scripts (init, eval-skills, session-start, artifact-integrity) remain unchanged.

**8. Two execution paths — prefer the `/graphify` skill for $0-to-API billing (amended 2026-05-29).** graphify's semantic extraction runs two ways: **(a)** the **`/graphify` skill** dispatches the semantic pass as Claude Code subagents — billed to the active Claude Code session (subscription on Max/Pro), **no separate API key**; **(b)** the **external `graphify .` / `graphify extract` CLI** runs as a Python process using the adopter's own provider API key (metered $), or a local model (Ollama, $0). For adopters on a Claude subscription, **prefer `/graphify`** (and `/graphify <path> --update` for cheap incremental — code-only changes = $0) so the first/full build costs no API spend. The API-key cost noted in Context + Consequences applies only to path (b). Caveat: if the Claude Code session itself is authenticated to an API key rather than a subscription, path (a) bills to the API too — verify with `/status`.

## Alternatives Considered

- **A — Recommend graphify in README, no integration.** Rejected: leaves the underwhelming `codemap-refresh` in place, doesn't capture the 71.5× token reduction inside any adlc-flow skill.
- **B — Keep both: graphify-aware skills + codemap fallback.** Rejected: maintains two scan engines, doubles maintenance surface, leaves users wondering which to use.
- **C — Thin `/codemap-refresh` wrapper that delegates to graphify when installed.** Rejected: preserves a misleading skill name; "codemap" implies link-graph, not semantic graph. Better to retire and rename.
- **E — Defer entirely; revisit later.** Rejected: codemap is clearly inferior right now; deferring inflates the gap and risks adopters never discovering graphify.
- **D (chosen)** — Deep MCP integration with hard dependency on knowledge-heavy skills, soft on /prime.

## Consequences

**Positive**
- Knowledge queries become 71.5× cheaper in tokens (per graphify's published benchmark).
- Multi-modal coverage (code + docs + diagrams) eliminates the markdown-only blind spot of `codemap-refresh`.
- Adopters get a battle-tested 49k-star tool instead of a 1-day-old placeholder.
- Semantic edges (decision ↔ implementation) become first-class — directly serves A2 architecture-clarity outcome.
- adlc-flow leverages an actively-maintained external ecosystem instead of carrying its own scan engine.

**Negative**
- Python ≥3.10 becomes a soft requirement. Pure JS/Go/Rust shops without Python on dev machines need to install it (`brew install python@3.12`, `apt install python3.12`, `winget install Python.Python.3.12`). Mitigated: only matters when adopter wants knowledge-heavy skills.
- LLM tokens spent on graphify's semantic extraction. **Billing depends on path (see Decision 8):** via the `/graphify` skill → Claude Code subscription, no API key; via the external `graphify .` CLI → adopter's own API key (metered) or a local model ($0). Cost is one-time per full build; `--update` on code-only changes is $0. Minor relative to ongoing query savings.
- External dependency. If graphify abandons or breaks backward compatibility, our knowledge-heavy skills break too. Mitigated: graphify is MIT-licensed; in worst case we can fork. Also: skills can fall back to clear "graphify not installed" messaging — they fail loud, not silent.
- `/codemap-refresh` slash command disappears between v2.0 and v2.1 — small breaking change. Mitigated: pre-adoption stage; no documented external users yet.

**Neutral**
- adlc-flow's plugin manifest stays unchanged in shape. We don't bundle graphify; we depend on it being installed alongside.
- v2.1.0 is a MINOR bump (new skill `/graph-query`; retire one skill; rewire two). Not MAJOR because the rewiring is internal and the surface change is additive for users who had graphify before, hard-fail for users who didn't (clear message, easy fix).

## References

- https://graphify.net — landing page (CDN blocks bot fetch; access via browser)
- https://github.com/safishamsi/graphify — source repo
- https://pypi.org/project/graphifyy/ — PyPI package (`graphifyy` with double-y)
- [ADR-004](ADR-004-absorb-dev-flow.md) — prior absorption decision; codemap-refresh was one of the absorbed skills
- Session 2026-05-19 AskUserQuestion: "Path D — Deep MCP integration" + "Hard for knowledge-heavy skills"
