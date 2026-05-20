# Recon-first discipline (read existing impl + tests + deps BEFORE planning sprint)

Filed per Trial 5 F8.15 (2026-05-20). 4 cross-trial validations: Sprint 050 ·
Sprint 051a · Trial 5 F3a · Trial 5 F4+F5. The pattern cuts speculative
sprint scope by 50-85% consistently.

## The rule

**Before planning a sprint to "build X", read what already exists.**
Specifically:

1. Survey the migration/schema directory if X touches data
2. List the route structure if X touches UI
3. Grep for existing helpers/skills that solve the same problem
4. Read 1-2 recent sprint files for pattern conventions
5. THEN write the sprint plan, with scope informed by reality

The discipline is to NOT write the sprint plan from the user's headline
("build a workflow timeline · build per-role dashboards"). Headlines hide
how much already exists.

## Why this works

Mature codebases accumulate solutions to common problems. A user's "build
X" request often translates to "extend the existing Y" or "wire up the
existing Z to surface W" once you look. Without recon, the sprint plan
treats X as greenfield · scope balloons · most of the work duplicates
existing code.

Recon takes ~10-15 minutes. Scope reduction of 50-85% saves ~2-8 hours.
ROI is consistent across all 4 validations.

## Adopter precedents

### Trial 5 F3a (temidev workflow agreement · 2026-05-20)

- **Headline**: "Wire workflow timeline from submission → document → legal
  agreement → fix timeline → monitoring → ops dashboard"
- **Recon revealed**: 4 of 6 stages already built (submissions via
  assessments table · documents via deliverables table · timeline via
  stage_advancement RPCs · ops dashboard via /ops/projects route)
- **Sprint scope after recon**: agreements table + lifecycle + admin UI
  (Sprint 032 · 3-task sprint) instead of greenfield 6-stage pipeline
- **Reduction**: ~80% scope cut

### Trial 5 F4+F5 (temidev sidebar + dashboards · 2026-05-20)

- **Headline**: "Improve UX sidebar composition + create proper dashboard
  for every role"
- **Recon revealed**: 3 mature dashboards already exist (admin · ops ·
  portal · with overview cards + quick-link tiles + recent audit lists);
  3 mature sidebar shells with consistent NAV_ITEMS arrays
- **Sprint scope after recon**: add agreements nav entry to 3 sidebars
  + 3 i18n keys × 2 locales (commit `6676be5` · ~10 min of work)
- **Reduction**: ~90% scope cut (a "create proper dashboards" headline
  would have meant 4+ hours of dashboard work · actual work was nav
  surface only)

### Sprint 050 (dev-flow · 2026-04-?? validation #1)

50% scope cut · existing memory system surface was reusable for the new
session-end audit feature.

### Sprint 051a (dev-flow · 2026-04-?? validation #2)

85% scope cut · existing canonical-edit pivot pattern already covered
the planned mid-sprint workflow.

## When to apply

Apply recon-first BEFORE writing the sprint plan when ANY of:

1. The user's request mentions a domain object that might already exist
   in the codebase (e.g. "build dashboards" when /admin/page.tsx may
   already render one)
2. The user's request is a multi-step pipeline (often N-1 of the N steps
   already exist)
3. The user's request mentions UI surfaces (sidebars · tables · forms)
   that the codebase likely already has primitives for
4. The user's request is a refactor or polish task (the existing
   implementation is the constraint surface · understand it first)

DON'T apply (full sprint plan from scratch is OK) when:

1. Genuinely greenfield project (Trial 4 umkm-indo was greenfield · no
   recon needed because nothing existed)
2. Single-file change (e.g. "fix this bug" · "add this prop" · recon
   would be over-engineering)

## Recon-first procedure

The pattern is mostly read-and-grep. Time-box to 10-15 minutes:

1. **List recent commits** to understand current sprint context:
   ```
   git log --oneline -10
   ```

2. **Read the most recent sprint file** for convention/shape:
   ```
   cat docs/sprint/SPRINT-NNN-*.md | head -100
   ```

3. **Survey schema** if domain object likely exists:
   ```
   ls supabase/migrations/ | tail -10
   grep "CREATE TABLE" supabase/migrations/*.sql
   ```

4. **Survey routes** if UI surfaces are in scope:
   ```
   find app -type d | grep -v node_modules
   ```

5. **Grep for likely-existing helpers**:
   ```
   grep -r "<keyword from request>" lib/ components/
   ```

6. **NOW write the sprint plan** with scope informed by what already
   exists. The plan's § Scope (in) lists what's NEW. The plan's § Scope
   (out) lists what's already done OR explicitly deferred.

## Trade-off

Recon-first front-loads ~10-15 min of search/read time before any
planning happens. For greenfield work that's wasted; for mature
codebases it's the single highest-ROI discipline available.

The cost of NOT applying it: sprint plans that propose building things
that already exist · execution surfaces "wait, this is already there" ·
mid-sprint scope churn · plan-author drift (the canonical Trial 2 TD-002).

## Cross-references

- Sprint 050 + 051a (dev-flow · validation #1 + #2)
- Trial 5 F8.15 (this finding) — codifies the rule into the plugin
- Trial 5 F3a + F4+F5 — Trial 5 validations #3 + #4
- `/lean-doc-generator` SKILL.md — should reference this doc in its
  "Before writing the sprint plan" step
