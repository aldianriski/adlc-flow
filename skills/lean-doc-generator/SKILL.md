---
name: lean-doc-generator
description: Use when creating, updating, or reviewing technical documentation, ADRs, sprint files, or AI context files. Also use for sprint lifecycle (start/promote/close). Follows LEAN DOCUMENTATION STANDARD — WHY and WHERE only, never HOW. Do not use to document HOW something works; redirect to code comments instead.
argument-hint: "[init | type subject | sprint-command]"
allowed-tools: Read, Write, Bash(git *), Glob, Grep
user-invocable: true
type: rigid
version: "1.0.1"
last-validated: "2026-05-29"
---

# Lean Documentation Generator

Generate high-signal technical documentation. Read `references/DOCS_Guide.md` before writing anything.

## Golden Rule

> Never generate documentation that explains HOW something works.

| Explains… | Goes in… |
|---|---|
| HOW it works | code (comments, types, tests) |
| WHY decided | `docs/adr/ADR-NNN-*.md` |
| WHERE things live | `ARCHITECTURE.md` or `README.md` |
| Unsure | code |

---

## Invocation Modes

| Mode | Command | Behavior |
|---|---|---|
| Session update | `/lean-doc-generator` | Update all docs touched this session |
| Init scaffold | `/lean-doc-generator init` | Full flow incl. outline approval |
| Single doc | `/lean-doc-generator [type] [subject]` | One file created or updated |
| Sprint promote | `/lean-doc-generator promote` | Promote backlog → active sprint per `references/SPRINT_PROTOCOLS.md` |
| Sprint close | `/lean-doc-generator close` | Close active sprint + write retro |

---

## Execution Flow

**Step 0 — Date-sanity pre-flight**: before writing any `last_updated:` value or dated filename, compare today's date against the value about to be written. On mismatch ≥1 day → WARN + ask for confirmation. Never silently auto-fix.

**Step 1 — Staleness scan**: check ownership headers; flag `stale` / `needs-review` / no-header before proceeding.

**Step 2 — Load standard**: read `references/DOCS_Guide.md` — 4 Laws, Core Files, line limits, anti-patterns, checklist.

**Step 3 — Codebase access**: read manifests only (`package.json`, `pyproject.toml`, etc.) + existing docs. If inaccessible → ask user to paste file tree + manifest + system description.

**Step 4 — HOW filter**: discard anything that explains implementation; keep WHY/WHERE only.

**Step 5 — Outline approval** *(init only)*: present Tier 1/2/3 options from `references/DOCS_Guide.md §6`; wait for human choice before writing.

**Step 6 — Generate / reconcile**: for each doc —
- **Template is mandatory when one exists.** Before writing, locate the matching template (`templates/<NAME>.template`, else the relevant template block in `references/DOCS_Guide.md`). If a template exists you MUST mirror its section structure — never write from memory or improvise sections. Only fall back to the DOCS_Guide Core-File shape when no template exists.
- **Existing file ≠ skip.** If the target already exists, do NOT skip on file-presence alone. Diff its structure against the template/standard (sections present, ownership header, line limits). If the format has drifted, reconcile it to the standard while preserving content/intent. Leave a file untouched ONLY when it is already format-conformant AND unchanged this session — and say so explicitly in the Step 7 summary.
- Write enforcing line limits + ownership header on every file.

**Step 7 — Session close + doc-set completeness**: list docs delivered + ownership headers to verify. Then run the registry-driven completeness check — read `${CLAUDE_PLUGIN_ROOT}/doc-registry.json`, report every doc present / stale / missing. **Generate only the `always`-tier docs you own**; **hand off** `agentic`-tier artifacts to their owner skill (e.g. `✗ RESPONSIBILITY-MAP.md → /responsibility-map`) — never improvise them. Frame agentic misses as opt-in, not failures. Detail: `references/DOC_COMPLETENESS.md`.

---

## Sprint Lifecycle — full protocols → `references/SPRINT_PROTOCOLS.md`

| User says… | Protocol |
|---|---|
| "start sprint" / "promote backlog" | Sprint Promote |
| AI executing work during active sprint | Sprint Execute |
| "close sprint" / "sprint done" | Sprint Close |

Commit strategy: `sprint(NNN): plan locked` at promote · `sprint(NNN): <summary>` squash at close.

---

## Red Flags

❌ **HOW in a doc** — redirect to code comment; never raise line limit to fit HOW
❌ **No ownership header** — every doc touched gets updated header before leaving it
❌ **Person as owner** ("Alice") — reassign to role
❌ **Stale doc as source** — run Step 1 first; flag before using as source
❌ **New file outside core set** — redirect to code comments or fit in existing Core File
❌ **Existing doc skipped on presence alone** — existing ≠ conformant; always diff against the template/standard and reconcile format drift (Step 6) before leaving it
❌ **Generated without its template** — when `templates/<NAME>.template` exists, output MUST mirror its structure; never improvise from memory

---

## Reference

- `references/DOCS_Guide.md` — full standard: Core Files, line limits, templates, anti-patterns, pre-delivery checklist
- `references/DOC_COMPLETENESS.md` — registry-driven doc-set completeness check + handoff rules (ADR-010)
- `references/SPRINT_PROTOCOLS.md` — sprint promote/execute/close protocols
- `references/FLOW_GRILL.md` — batched Q&A discipline for planning convergence
- `references/recon-first-discipline.md` — recon-first sprint planning (4-trial-validated · 50-85% scope reduction)

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
