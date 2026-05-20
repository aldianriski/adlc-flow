---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: Sprint lifecycle rules change; new promote/execute/close steps added
status: current
---

# Sprint Lifecycle Protocols

> On-demand reference for sprint promote, execute, and close operations. Load only when a sprint command is triggered.

---

## Anti-Drift Hard Stops

1. **Before any commit message starting `sprint(NNN):`** — verify `docs/sprint/SPRINT-NNN-<slug>.md` exists with `status: active` and a Plan section. If missing → STOP and run Sprint Promote Protocol before committing.
2. **Audit-driven sprints count too.** A sprint that resolves audit findings is still a sprint. Same protocol applies.
3. **Single-task sprints.** Even one-task remediation work needs a plan doc — protocol is a forcing function for "what does done look like" before changing files.
4. **Backfill discipline.** If a sprint shipped without a plan doc, backfill it retroactively with `backfilled: <date>` in frontmatter, plan reconstructed from commit message, retro acknowledging the drift.

## Parallel Tracks (per ADR-007)

Multiple sprints MAY run concurrently when they touch **disjoint file sets** — same rule as orchestrator `sprint-bulk` overlap gate. Examples: `apps/web` backend wiring + `apps/landing` marketing in separate sub-trees · `packages/db` migrations + `packages/ui` component additions on independent file lists.

**Discipline:**
- Each track has its own `docs/sprint/SPRINT-NNN-*.md` with `status: active`
- TODO.md may list one PRIMARY Active Sprint + a "Parallel Tracks" section pointing at the other sprint files
- Tracks merge through the same PR-review process (no separate parallel-only lane)
- Reviewers must verify pairwise `files_affected ∩ ∅` before allowing concurrent active sprints to merge
- Anti-pattern persists: TWO sprints touching the SAME files concurrently is still forbidden (real conflict risk + reviewer confusion)

---

> **Commit strategy:** One sprint = **two commits**.
> - `sprint(NNN): plan locked` — at promote, after plan approval
> - `sprint(NNN): <summary>` — squash commit at close

---

## Sprint Promote Protocol

**Trigger phrases:** "promote backlog", "start sprint", "execute active sprint", "begin sprint", "kick off sprint".

**Steps:**

1. **Read** TODO.md § Backlog. Confirm `Active Sprint` pointer = `— none —`. If pointing to file with `status: active` → block with: "Sprint NNN still active. Close it before promoting next."

2. **Backlog check.** Scan `TODO.md § Backlog` for open `[ ]` rows across `P0 / P1 / P2`. If zero open rows found → prompt user to surface tasks (via `/hypothesis-register` for agentic ideas, or manual entry for code-side tasks).

3. **Pick** top priority items (P0 → P1 → P2). Apply sprint sizing rules: 2–3 tasks min, more if lightweight. Confirm pick with user.

4. **Planning convergence.** For each picked task, ensure these fields are populated via batched Q&A (≤5 independent Qs per turn — see `FLOW_GRILL.md`):
   - tasks (id · title · size S/M/L · risk · layers)
   - acceptance criteria (observable outcome)
   - assumptions registered (with confirmation source)
   - anti-slip 4 fields: focus · context-budget · explicit-gaps · done-confirmation
   - decisions to pre-lock (vs. defer to mid-sprint)

5. **Review-before-lock.** Emit converged ledger summary. Prompt three keywords:
   - `confirm` — re-emit summary; no write yet
   - `revise <field>` — re-enter loop at named field
   - `lock` — freeze ledger and write sprint file

6. **On `lock`** — generate `docs/sprint/SPRINT-NNN-<slug>.md`:
   - NNN = next zero-padded sequence (scan `docs/sprint/`)
   - `<slug>` = kebab-case theme, ≤30 chars
   - `status: planning`. Execution Log / Files Changed / Decisions / Retro = empty stubs.
   - Open Questions section emitted ONLY if ≥1 unresolved Q at lock; otherwise omitted entirely.
   - Update TODO.md: `Active Sprint` → `→ docs/sprint/SPRINT-NNN-<slug>.md`; remove promoted tasks from Backlog.

7. **Plan-locked commit.** Flip sprint file `status: planning → active`, fill `plan_commit: <sha>` after user runs commit. Provide commit message:

   ```
   sprint(NNN): plan locked — [theme]

   Plan: [brief one-line]
   Tasks: T1, T2, T3

   Plan frozen at this commit. Execution log + retro append in subsequent commits, squashed at close.
   ```

8. **Block** any further plan edit. From this point all changes go to Execution Log § Surprise.

---

## Sprint Execute Protocol

**Trigger:** AI doing work during sprint with `status: active`.

**Steps applied continuously:**

1. **Before each task:** read sprint file Plan § T<N>. Re-confirm acceptance + DoD.
2. **On significant decision** (architectural-level, library pick, agent-pattern choice): append to § Decisions with reason. If global-scope → also write ADR in `docs/adr/`, link from sprint file.
3. **On surprise** (plan deviation, unexpected finding, blocker): append `### YYYY-MM-DD HH:MM | Surprise during T<N>` block to § Execution Log with discovery + resolution.
4. **For each file touched:** add row to § Files Changed (`File | Task | Change (one-line WHY) | Risk | Test added`). One row per file, NOT per edit.
5. **On test/eval added/modified:** also update test or eval plan docs as relevant.
6. **Task complete:** append `### YYYY-MM-DD HH:MM | T<N> done` block confirming acceptance verified + DoD met. Tick `[ ] → [x]` only in DoD line.
7. **Open question for user:** route through interactive picker — do NOT pause sprint, do NOT pre-write § Open Questions for Review.
   - **Default path:** invoke `AskUserQuestion` with ≤3 candidate answers + `defer` slot + `block` slot.
   - **On `defer`:** lazy-create § Open Questions for Review if absent; append `### YYYY-MM-DD HH:MM | T<N> | <Q>` + `Deferred: <reason>`. Continue task.
   - **On `block`:** halt task; report to user; wait for direction.
   - **Anti-pattern:** never accumulate Qs silently and "surface at next pause."
8. **Refuse:** any edit to § Plan. Plan frozen. Direct user to log in § Execution Log instead.
9. **Refuse:** code dumps, function explanations, HOW prose in sprint file. Sprint file = WHY/WHERE only.

---

## Sprint Close Protocol

**Trigger phrases:** "close sprint", "sprint done", "wrap sprint", "finalize sprint NNN".

**Steps:**

1. **Verify** every task in § Plan has:
   - Matching `### T<N> done` entry in § Execution Log
   - All DoD line items ticked `[x]`
   - Acceptance verified
   - If gap → block close, list incomplete items.
2. **Verify** § Files Changed covers every file in current `git diff` since `plan_commit`. If file changed but not logged → prompt user to add row.
3. **Verify** docs sync. For each row in § Files Changed:
   - Touched architecture → ARCHITECTURE.md updated?
   - Added pattern/convention → CONTEXT.md updated?
   - § Decisions has ADR-needed → ADR file written in `docs/adr/`?
   - § Files Changed has test row → test plan or eval plan updated?
   - If gap → list and prompt to fix before close.
4. **Fill** § Retro:
   - Worked: what went well
   - Friction: what was slow / wrong assumption / missing context
   - Pattern candidate: rule worth keeping permanently — surface to user
5. **Flip** sprint file `status: closed`. Update `last_updated: <today>`.
6. **Write** pointer row in CHANGELOG.md (prepend, newest first):

   ```markdown
   ## Sprint NNN — [theme] (YYYY-MM-DD)
   - Sprint file: [docs/sprint/SPRINT-NNN-<slug>.md](sprint/SPRINT-NNN-<slug>.md)
   - Plan commit: <plan_sha>
   - Close commit: <close_sha>   *(filled after step 8)*
   - Summary: [one line — what shipped]
   - Docs updated: [list]
   - ADRs: ADR-NNN, ADR-MMM (or —)
   - Files changed: NN
   ```

7. **Clear** TODO.md `Active Sprint` → `— none —`.
8. **Provide** squash-commit message ready to paste:

   ```
   sprint(NNN): <summary>

   Theme: [theme]
   Tasks: T1 ✓ T2 ✓ T3 ✓
   ADRs: ADR-NNN
   Docs: ARCHITECTURE.md, CONTEXT.md
   Files changed: NN

   Sprint file: docs/sprint/SPRINT-NNN-<slug>.md
   ```

9. **After** user commit → fill `close_commit: <sha>` in sprint file ownership header AND in CHANGELOG.md row.
10. **Run** Step 7 (Session Close summary from SKILL.md) as final step.

---

## Date-Sanity (Step 0 protocol)

**Trigger:** any sprint-lifecycle operation about to write a `last_updated:` frontmatter value OR a dated filename.

**Comparison logic:**
1. Read today's date from environment context.
2. For each new `last_updated:` value about to be written, compare to today.
3. If ANY mismatch ≥1 day → enter WARN+CONFIRM flow:

```
[date-sanity] today = YYYY-MM-DD, writing = YYYY-MM-DD in <file or filename>.
Auto-correct? (y/n)
```

**Auto-correct rules:**
- ONLY on explicit `y` from user.
- Apply to ALL files with the same drift in current operation (single confirm covers batch).
- Never silently rewrite.
