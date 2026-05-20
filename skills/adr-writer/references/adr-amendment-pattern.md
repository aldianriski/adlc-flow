# ADR §-amendment pattern (the right tool when § got the framing wrong)

Filed per Trial 5 F8.12 (2026-05-20). Codifies a 2-adopter precedent:
when an ADR's § contains a decision that proves wrong on execution, the
right move is a `## ADR-NNN § Amendment YYYY-MM-DD` block INSIDE the
existing ADR — not a new ADR that orphans the surrounding decisions.

## Precedents

- **ADR-046 § Amendment 2026-05-11** (temidev · Sprint 023 T0) — original
  rejected manual DB CHECK gate as "overengineering"; on execution the
  Sprint 022 `SQLSTATE 23514` push failure proved the gate was needed.
  Amendment block added inline · ADR-046 now carries both the original
  decision and the on-execution correction.
- **ADR-049 § Amendment 2026-05-20** (temidev · Sprint 032 T2 · Trial 5
  F8.12) — original §3 said "reuse single VAULT_KEY · adding a second
  key is overengineering"; on execution the existing `get_gcal_token_key`
  RPC's domain-named shape made reuse semantically wrong. Amendment
  shifted to "separate Vault key + separate domain-named RPC."

Two-adopter precedent locked. Codify here for downstream consumers.

## When to use the amendment pattern

Use a `§ Amendment YYYY-MM-DD` block INSIDE the existing ADR when:

1. **An identifiable § of the ADR** got a specific framing wrong (not the
   whole ADR · just one or two sub-decisions).
2. **The surrounding decisions are still correct** — splitting into a new
   ADR would orphan them or require a backwards-compatibility chain.
3. **The on-execution finding** is documented in a specific sprint /
   commit and warrants traceability back to "what changed and why".

Use a NEW ADR (e.g. `ADR-NNN+1` superseding `ADR-NNN`) when:

1. The ENTIRE original decision is wrong.
2. The original decision's REJECTED alternatives are now the right call.
3. Major architectural pivot (new pattern · new model · new stack).

## Shape

Append to the existing ADR (do NOT modify the original § text · just add
the Amendment block):

```markdown
**§N Amendment YYYY-MM-DD (sprint NNN execution finding):**
The original §N said "[verbatim quote of what was wrong]". On execution
this proved [semantically wrong / unimplementable / overspecified / etc.]:
[1-2 sentence explanation of what was wrong and why we found out].
The sprint NNN T-N ship introduced [what we actually did]. Both
[differences A and B] cost [small cost]; the [benefit] is real. The
original [framing] was wrong — [right framing] is the right posture, not
[the framing we rejected]. This amendment closes the §N wording-vs-reality
drift at sprint close.
```

## What NOT to do

- Don't silently revise the original § text. Future readers need to see
  the original framing + the on-execution correction together · that's
  the audit trail.
- Don't write a separate ADR amendment file (`ADR-049-amendment-1.md`).
  The shape is INLINE.
- Don't use this pattern for typo-fixes or formatting cleanups. Those
  edits go directly into the original ADR with no Amendment block.
- Don't amend an ADR > 3 times. If a single ADR collects multiple
  amendments, the underlying decisions probably need a NEW ADR superseding
  the original.

## Cross-reference convention

In the sprint's Execution Log entry or close commit message, name the
amendment explicitly:
> ADR-049 §3 amendment landed in-sprint — separate Vault key + separate
> domain-named RPC vs originally-rejected single-key reuse. Original
> "over-engineering" framing was wrong.

This makes the amendment greppable when future readers ask "why did we
flip on the single-key decision?"

## Trigger to promote to a NEW ADR (not amendment)

If a single ADR collects 3+ Amendment blocks, the underlying decisions are
probably no longer coherent enough to be one ADR. Promote to a NEW ADR
that supersedes the original. Pattern: `ADR-049 → ADR-052 (supersedes
ADR-049 · documents the consolidated state after 3 amendments)`.
