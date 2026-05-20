# ADR Writer — Execution Procedure

1. **Ask the user**: "What decision should I record? Describe the context, what was chosen, and what alternatives were rejected."

2. **Detect convention** (per ADR-007):
   - `docs/adr/` exists with ≥1 `ADR-NNN-*.md` file → **modern mode** (one file per ADR)
   - `docs/DECISIONS.md` exists AND `docs/adr/` does NOT → **legacy mode** (append to DECISIONS.md)
   - Both exist → **modern mode + warn**: emit one-line warning `"docs/DECISIONS.md and docs/adr/ both present. Writing new ADRs to docs/adr/. Plan a migration ADR if needed."`
   - Neither exists → create `docs/adr/` and proceed in modern mode.

3. **Determine the next ADR number**:
   - Modern: scan `docs/adr/ADR-NNN-*.md` for highest NNN; next is NNN+1
   - Legacy: scan `docs/DECISIONS.md` for highest `## ADR-NNN:` heading; next is NNN+1

4. **Compose the path/target**:
   - Modern: `docs/adr/ADR-NNN-<kebab-slug>.md`
   - Legacy: append `## ADR-NNN: <title>` block to `docs/DECISIONS.md`

5. **Write the ADR** using the format in `../SKILL.md`.

6. **Cross-link** references to other ADRs (`docs/adr/ADR-MMM-*.md` or `docs/DECISIONS.md#adr-mmm`).

7. **Supersede prior ADR (if applicable)**:
   - Modern: edit prior ADR's frontmatter `status:` → `Superseded by ADR-NNN`; add one-line marker at top of body; do NOT rewrite the prior ADR's substance.
   - Legacy: prepend `> SUPERSEDED YYYY-MM-DD by ADR-NNN` to the prior ADR's block in DECISIONS.md.
