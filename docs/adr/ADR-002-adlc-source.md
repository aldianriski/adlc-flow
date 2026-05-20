---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: EPAM publishes substantive revision, or adlc-flow diverges substantively from source
status: decided
---

# ADR-002: EPAM ADLC article as authoritative source framework

**Date**: 2026-05-19
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

`adlc-flow` derives its phase structure, gate placements, vocabulary, and anti-patterns from a specific external framework: EPAM's *Introducing Agentic Development Lifecycle (ADLC): Building and Operating AI Agents in Production* (Feb 5, 2026).

Two design risks if source is left informal:
1. **Drift** — successive contributors invent ADLC-adjacent concepts that diverge from the published framework, fragmenting vocabulary.
2. **URL rot** — EPAM may move, restructure, or unpublish the source article; later contributors cannot reconcile current plugin shape against original framework.

## Decision

**1. EPAM article is the canonical source framework.** All ADLC vocabulary, phase numbering (P0–P7), human-in-the-loop checkpoints, anti-patterns, and the "deployment is the start of monitoring" framing trace to this article. When in conflict between intuition and source, source wins (or an explicit deviation ADR is written).

**2. A vendored extract lives at `docs/research/ADLC-source.md`.** ~800-word faithful paraphrase with attribution. This file survives URL rot. It is the file contributors actually read; the original URL is cited but not relied upon.

**3. Deviations from source are explicitly enumerated.** `docs/research/ADLC-source.md` ends with an "Adapter notes" table listing every place `adlc-flow` deviates from EPAM's text (e.g., 7 modes vs 8 phases — P0+P1 merged; named gates we invented; specialist agent roster not in source). New deviations require an ADR row or a new ADR.

**4. License posture.** Content is paraphrased, not republished verbatim. Full attribution to EPAM authors. The vendored extract is for engineering reference, not redistribution.

**5. Revision policy.** If EPAM publishes a substantive update to the article, re-extract the source file, diff against the existing extract, and write a follow-up ADR if any change forces a vocabulary/phase/gate revision in `adlc-flow`. Cosmetic article edits do not trigger an ADR.

## Alternatives Considered

- **Link-only reference (no vendored extract).** Rejected: URL rot risk; contributors can't read source while offline; EPAM article is marketing-flavored and substantive content takes effort to locate within the page.
- **Treat ADLC as starting inspiration only, then design freely.** Rejected: erases provenance, fragments vocabulary, makes review of "is this on-framework?" impossible.
- **Build adlc-flow on a different source framework.** Considered: LangChain's published patterns, OpenAI Cookbook agent guides, Microsoft Autogen docs. None offers a full *lifecycle* framing — they cover tactics not lifecycle. EPAM is the only published lifecycle as of 2026-05-19.

## Consequences

**Positive**
- Vocabulary stays anchored; deviations are visible.
- Survives EPAM URL changes.
- Contributors have one file to read to "learn ADLC" before contributing.
- Permits principled disagreement with source via dedicated ADR.

**Negative**
- Single point of intellectual dependency; if EPAM substantially revises the framework, we revise too (or document why we don't).
- Extract is ~10 KB in the repo — small but counts toward repo size.
- Attribution discipline must be enforced at review (no verbatim-republish).

## References

- Vendored source — `docs/research/ADLC-source.md`
- Original URL — https://www.epam.com/insights/ai/blogs/agentic-development-lifecycle-explained
- Authors — Stanislau Shandrokha, Avya Chaudhary, Antonio Di Marzo, Pavel Seviaryn, Vadym Vlasenko, Pavel Golub
