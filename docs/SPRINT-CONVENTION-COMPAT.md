---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
status: current
audience: Adopters with existing TODO.md / CHANGELOG.md / sprint file conventions.
---

# Sprint convention compatibility

Filed per Trial 5 finding F8.4 (mature-adopter dogfood 2026-05-20).
`bin/adlc-flow-init.js` v2.8.0+ detects existing TODO.md + CHANGELOG.md
and points adopters here.

## TL;DR

**Keep your existing sprint protocol.** adlc-flow coexists with most TODO.md
+ CHANGELOG.md conventions without requiring migration. The plugin's
universal-surface skills (`/lean-doc-generator` · `/adr-writer` · sprint
protocols) detect adopter conventions at write-time and adapt rather than
forcing migration.

## What adlc-flow expects (canonical · but not required)

- `TODO.md` at repo root with an "Active Sprint" section pointing to a
  detailed sprint file in `docs/sprint/SPRINT-NNN-<theme>.md`.
- `CHANGELOG.md` at repo root OR `docs/CHANGELOG.md` with closed-sprint
  ribbons (newest first).
- ADRs at `docs/adr/<NNN>-<slug>.md` (multi-file) OR `docs/DECISIONS.md`
  (single-file · auto-detected by `/adr-writer` v2.3+).

## Common adopter conventions — compatibility notes

### temidev shape (validated in Trial 5)

- 83KB TODO.md with extremely detailed Active Sprint ribbons (~5-10
  closed-sprint summaries inline)
- 247KB `docs/CHANGELOG.md` with deeply-nested per-task summaries
- Single-file `docs/DECISIONS.md` (49+ ADRs · ~150KB)

**Compatibility**: works clean. `/lean-doc-generator` produces sprint
plans matching the existing convention's frontmatter + structure if it
reads recent sprint files first.

### naraly shape (validated in Trial 2)

- Multi-app monorepo with per-app TODO.md
- Some apps have separate sprint files · others ride a single TODO.md

**Compatibility**: works with the v2.3+ `traditional` orchestrator mode
+ parallel-tracks-allowed sprint protocol (F4.3 fix).

### Standard simple shape

- Flat TODO.md with checklist items
- No closed-sprint archive
- ADRs in `docs/adr/NNN.md` files

**Compatibility**: native. adlc-flow's templates assume this default.

## When to consider migration

You DON'T need to migrate unless:

1. **You want adlc-flow's sprint promote/close protocol features** (Flow Grill
   Seed pre-staging · `pattern-candidate watch` tracking · Anti-Pattern
   Lock #3 aging rules). These benefit from the canonical structure.

2. **You want the per-sprint Decisions D-A..D-Z pre-lock convention** (lock
   decisions at promote · honor verbatim during execution unless invalidated).

3. **You have multiple Tech Leads coordinating across teams** — the canonical
   structure is more searchable + audit-friendly.

If none of these apply, keep your existing convention.

## When to migrate (gradual)

1. Add a "themed" sprint file under `docs/sprint/SPRINT-NNN-<theme>.md` for
   the NEXT sprint only. Reference it from your existing TODO.md "Active
   Sprint" pointer.
2. After 3-4 sprints land cleanly with the new shape, decide whether to
   migrate the rest.
3. Use `/lean-doc-generator` to scaffold the new sprint file — it produces
   the canonical structure.

Don't bulk-migrate historical sprints unless you have a specific need (e.g.
publishing the changelog publicly). Existing CHANGELOG.md entries continue
to work as-is.

## When NOT to migrate

- Your team is happy with the existing convention.
- Your TODO.md / CHANGELOG.md has years of historical context — preserving
  that context is more valuable than uniformity.
- The features you ship are mostly traditional dev (universal-surface
  skills work identically against any convention).

## Cross-references

- ADR-007 — `traditional` orchestrator mode + multi-track + existing-project
  support (Trial 2 F4.3 fix)
- Trial 2 friction log § F4.5 — sprint file shape collision (carried
  forward to deferred · this doc closes part of that gap)
- Trial 5 friction log § F8.4 — mature-adopter dogfood validating this
  pattern at temidev scale
- `bin/adlc-flow-init.js` v2.8.0 — detection + adopter notification
