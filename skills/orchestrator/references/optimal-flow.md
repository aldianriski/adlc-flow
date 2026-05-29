# Optimal skill-orchestration flow

How to drive adlc-flow with the least ceremony for the most value. Per [ADR-010](../../../docs/adr/ADR-010-doc-layer-tiering.md). Match the tier to the work — **most days are Daily core**; escalate only when the work warrants it.

## Decide the tier first

```
Is the work LLM-core (agent / RAG / prompt behavior is the product)?
  ├─ yes → Agentic tier (gates fire)
  └─ no  → Is it a NEW feature / sprint (real implementation, not just edits/docs)?
            ├─ yes → Per-feature tier (no ADLC gates)
            └─ no  → Daily core (just prime + lean-doc)
```

The orchestrator routes freeform input here automatically — you rarely need to name a mode.

## Tier 1 — Daily core (the 90% case)

```
/prime                     # load context deterministically (CLAUDE.md · CONTEXT.md · MEMORY · active sprint · registry)
   ↓  do the work
/lean-doc-generator        # capture: updates owned docs + runs the registry completeness check
```

No gates. The orchestrator is **optional** here — for pure doc/dev work, skip straight to these two. `/diagnose` (bug), `/zoom-out` (unfamiliar area), `/pr-reviewer` (pre-merge), `/release-patch` (ship) slot in as needed. This is the loop you run every session.

## Tier 2 — Per-feature (a real feature / sprint · no ADLC gates)

```
/orchestrator traditional
   → /lean-doc-generator           # sprint plan (recon-first; parallel tracks if file-overlap = ∅)
   → /tdd  +  /test-planner        # build with tests
   → /refactor-advisor · /diagnose · /zoom-out   (as needed)
   → code-reviewer agent           # pre-merge 7-lens (+ migration-/performance-/security-analyst by risk)
   → /adr-writer                   # any hard-to-reverse decision
   → /release-patch | /release-manager
```

## Tier 3 — Agentic (opt-in · building an LLM-core product · gates fire)

```
/orchestrator discover "<pain>"
  P0/P1  HG  /hypothesis-register      →  SG  /responsibility-map
  P2     AG  /agent-architect (+ADR) · /eval-suite-planner     ← AG BLOCKS without eval strategy
  P3     VG  /golden-dataset · /pov-gate  (hard GO / NO_GO)
  P4         build: change→eval→confirm loop · /context-engineer · code-reviewer + prompt-reviewer
  P5     RG  /release-readiness · red-team-analyst
  P6         /canary-plan · /ai-observe
  P7     MG  FEEDBACK-LOG · /drift-audit · /model-upgrade · /cost-budget
```

Each agentic-tier artifact has an owner skill — see `doc-registry.json`. `/lean-doc-generator`'s completeness check reports which are missing and hands off to the owner (it never improvises them).

## Escalate / de-escalate

- **Escalate** Daily → Per-feature the moment work becomes a real implementation; Per-feature → Agentic the moment LLM behavior becomes the product (switch `traditional` → `discover`).
- **De-escalate**: once an agentic feature ships and you're back to glue/docs work, drop to Daily core. Don't run gates for maintenance.
- **Never** run `traditional` for agentic work (bypasses HG/AG/VG) or fire gates for daily doc edits (pure ceremony).
