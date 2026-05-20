# LEAN DOCUMENTATION STANDARD — Reference

> WHY/WHERE only. Never HOW.

---

## §1 — The 4 Laws

| Law | Name | Rule |
|---|---|---|
| LAW 1 | Minimal by Default | No doc created unless absence causes repeated interruptions or mistakes |
| LAW 2 | Owned, Not Shared | Every doc has exactly one owner role; shared = no ownership |
| LAW 3 | Lifecycle-Bound | Every doc has defined create / update / archive triggers |
| LAW 4 | Signal-Dense | Every line carries unique info not already in code; repeating code = delete |

---

## §2 — Core Files (universal)

| File | Reader | Max Lines | Update Trigger |
|---|---|---|---|
| `README.md` | Anyone | 50 | Project scope changes |
| `ARCHITECTURE.md` | Tech lead | 150 | Major structural change |
| `docs/adr/ADR-NNN-*.md` | Team | unlimited per file | Every significant decision |
| `SETUP.md` | New dev / CI | 100 | Setup process changes |
| `CONTEXT.md` | AI assistant | 200 | Vocab, gate, mode, outcome change |
| `CLAUDE.md` | AI assistant | 80 | Project shape / anti-patterns change |
| `TODO.md` | Dev / AI | Unlimited | Backlog change · sprint promote/close |
| `CHANGELOG.md` | Reviewer | Unlimited (append-only) | Sprint closed |
| `docs/sprint/SPRINT-NNN-*.md` | AI mid-sprint | 400 hard cap | Append during sprint; retro at close |
| Per-module `README.md` | Dev | 10 | Module purpose changes |

## §2b — Core Files (adlc-flow-specific)

| File | Reader | Max Lines | Update Trigger |
|---|---|---|---|
| `HYPOTHESIS.md` | Team | unlimited | New hypothesis via /hypothesis-register |
| `RESPONSIBILITY-MAP.md` | Team | unlimited | New feature scoped via /responsibility-map |
| `FEEDBACK-LOG.md` | Team | unlimited (append) | User feedback event resolved into prompt change |
| `MODEL-UPGRADE-LOG.md` | Team | unlimited (append) | MG gate run via /model-upgrade |
| `OBSERVABILITY.md` | Team | 300 | Schema refresh via /ai-observe |
| `COST-BUDGET.md` | Team | 200 per feature block | Budget review via /cost-budget |

**Rule:** before creating any new file → ask "can this live in code comments?" If yes → code.

---

## §3 — Ownership Header (mandatory on every doc)

```yaml
---
owner: [role, not person name]
last_updated: YYYY-MM-DD
update_trigger: [specific event that triggers update]
status: current | needs-review | stale
---
```

Flag if: `status: stale`, `status: needs-review`, `last_updated` >60 days, or no header present.

---

## §4 — ADR Format (one file per decision in `docs/adr/`)

See `skills/adr-writer/SKILL.md` for the canonical format.

Write ADR when: choosing between non-trivial options · adopting team-wide pattern · reversing prior decision · constraining future choices · choosing agent architecture (ReAct/Plan-Execute/multi-agent).

Skip ADR when: single-module choice · no team-wide ripple · implementation detail.

---

## §5 — HOW Filter

| KEEP (WHY / WHERE) | DISCARD (HOW → belongs in code) |
|---|---|
| System purpose, scope boundaries | Implementation details, algorithm steps |
| Component names, single responsibility | Step-by-step code flow, function logic |
| Architectural decisions and trade-offs | Internal library behavior |
| External dependencies, setup commands | What each function does internally |

Discard log: "Skipped: '[detail]' explains HOW → add as comment in `[file]`."

---

## §6 — Tiered Scale Model

| Tier | Team size | Files |
|---|---|---|
| Tier 1 | Solo | README · SETUP · CONTEXT |
| Tier 2 | Small team | + ARCHITECTURE · docs/adr/ · TODO · CHANGELOG · sprint/ |
| Tier 3+ | Multi-service | + SERVICE_REGISTRY.yaml · DEPENDENCY_MAP.md · GLOBAL_DECISIONS.md |

For agentic-product projects (adlc-flow primary audience), add Tier 2+:
- HYPOTHESIS.md · RESPONSIBILITY-MAP.md · OBSERVABILITY.md
- GOLDEN-DATASET/ + EVAL-SUITE/ directories
- FEEDBACK-LOG.md · MODEL-UPGRADE-LOG.md (start populating at P6 activate)
- COST-BUDGET.md (start populating at AG)

---

## §7 — Anti-Patterns

| Anti-Pattern | Response |
|---|---|
| HOW Documentation | Redirect to code comments |
| Orphan Docs (no ownership header) | Add header before touching file |
| Person Ownership ("Alice") | Reassign to role |
| Mega Doc (over line limit) | Split by Core Files spec; never raise limit |
| Concurrent Active Sprints | Block — one at a time |
| Sprint File Bloat (>400 lines) | Block — split the sprint |
| Stale doc used as source | Run staleness scan first |
| File outside core set | Redirect to code or existing Core File |

---

## §8 — Pre-Delivery Checklist

Before delivering any document, verify:
- [ ] Ownership header present and complete
- [ ] No HOW content (every line passes the HOW filter)
- [ ] Under line limit for this file type
- [ ] No person names as owners
- [ ] Status field set correctly
- [ ] All referenced files exist
- [ ] No stale content used as source without flag
