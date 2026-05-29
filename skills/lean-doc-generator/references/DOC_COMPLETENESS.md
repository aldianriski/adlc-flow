# Doc-set completeness check (registry-driven)

Per [ADR-010](../../../docs/adr/ADR-010-doc-layer-tiering.md). Run this at session close (Step 7) so a daily `/lean-doc-generator` run surfaces the **full** doc gap — not just the general docs lean-doc itself owns.

## Procedure

1. **Read the registry**: `${CLAUDE_PLUGIN_ROOT}/doc-registry.json` (fall back gracefully if absent — report that the registry is missing and skip the check). It lists every expected doc/artifact with `path`, `owner`, `tier` (`always` | `agentic`), `kind` (`file` | `dir`), `purpose`.

2. **Classify each entry** against the adopter project root:
   - **✓ present** — exists (and, for `kind:dir`, is a non-empty directory).
   - **⚠ stale** — exists but its ownership header / `last_updated` is flagged by Step 1's staleness scan, OR its format drifted from the template (Step 6 reconciliation applies).
   - **✗ missing** — not found.

3. **Act by ownership — generate only what you own:**
   - `owner: lean-doc-generator` (the `always`-tier docs) → **generate / reconcile here**, following Step 6 (template-mandatory, format-conformant).
   - Any other owner (all `agentic`-tier artifacts: hypothesis-register, responsibility-map, golden-dataset, eval-suite-planner, ai-observe, cost-budget, model-upgrade) → **do NOT generate**. These have domain-specific generators. Emit a **handoff line** instead.

4. **Report** a compact completeness table, e.g.:

   ```
   Doc-set completeness (doc-registry.json):
     ✓ README.md · CONTEXT.md · CHANGELOG.md · docs/adr/        [always — owned, current]
     ⚠ .claude/CLAUDE.md — format drift, reconciled this run
     ✗ HYPOTHESIS.md        → /hypothesis-register   (agentic · only if building an LLM-core feature)
     ✗ RESPONSIBILITY-MAP.md→ /responsibility-map     (agentic)
     ✗ GOLDEN-DATASET/      → /golden-dataset         (agentic)
   ```

## Rules

- **Tier-aware framing.** `agentic`-tier misses are NOT failures for a traditional/general project — present them as "needed only if this becomes an LLM-core feature," never as a nag. This is the whole point of the tiering (ADR-010 §4).
- **Never improvise an artifact you don't own.** A golden-dataset is a dataset; an eval-suite has domain logic. Handoff > fabricate.
- **One handoff per missing artifact**, naming the exact owner skill from the registry's `owner` field.
- **Registry is the source of truth** — do not hardcode the artifact list here or in any consumer. Adding a doc = one registry entry.
