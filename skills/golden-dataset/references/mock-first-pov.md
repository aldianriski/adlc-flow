---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
purpose: P3 best-practice — build a deterministic mock pipeline before wiring live LLM
status: validated (3 cross-trial confirmations)
---

# Mock-first PoV scaffold pattern

## TL;DR

Build a deterministic mock implementation of your AI pipeline FIRST · evaluate it against the golden dataset at $0 · fix latent bugs there · then wire the live LLM. Three cross-trial validations in adlc-flow's dogfood loop confirm: mock-first finds the bugs live-mode would have charged you to discover.

## When to use

- P3 prep (after AG / before P4 implementation)
- ANY agentic feature with a generator function (LandingPage · classification output · structured manifest · etc.)
- Whenever the eval surface is structural-or-counted (theme pick · section types · compliance flags · attribute coverage) and NOT pure-judgment (creative copy quality · nuanced tone)

## When NOT to use

- Pure-judgment metrics where the mock can't approximate (e.g. "does the copy sound like a luxury brand?"). Mock-first won't help here; you need live LLM + human eval.
- Features where the AI's value IS the variability (e.g. brainstorm generation). Determinism defeats the purpose.

## The pattern

```ts
// generator with mock/live branch — opt-in to spend tokens
export async function generateThing(input: X, opts: { live?: boolean } = {}): Promise<Y> {
  return opts.live ? generateThingLive(input) : generateThingMock(input);
}

function generateThingMock(input: X): Y {
  // Deterministic heuristics — keyword matching, rules, fixed transforms.
  // Sufficient detail to exercise the eval surface (themes picked · sections emitted ·
  // flags declared · attributes guarded). Does NOT need to be PRODUCTION quality —
  // it needs to be ENOUGH for the eval-runner's structural checks to run.
}

async function generateThingLive(input: X): Promise<Y> {
  // Actual LLM call. Costs tokens. Default off.
}
```

Then your eval-runner reads samples and calls `generateThing({live: false})` for cheap iteration, `{live: true}` only when ready to measure real metrics.

## What the mock SHOULD do

- Return the SAME SHAPE as the live output (so the eval-runner doesn't branch on mode)
- Be deterministic (same input → same output) for reproducibility
- Hit the most-common heuristic paths so the eval can verify the pipeline plumbing works
- Track $0 cost in the cost field (or fixed "mock" placeholder)

## What the mock should NOT do

- Try to be production-quality. That's the LIVE LLM's job. Mock that's too clever masks the gap between mock and live, and the gap IS the signal.
- Skip the structured-output schema. The mock should produce schema-valid output so schema-validation tests run.
- Cache results across calls without an explicit cache layer. Each call = same deterministic compute.

## What the mock-first eval surfaces

Three categories of bug, all caught at $0:

1. **Pipeline plumbing bugs** — schema mismatches · path-resolution issues · serialization failures · race conditions. These bugs would crash the live run too · finding them in mock saves the live call cost.
2. **Structural bugs in the eval-runner itself** — wrong sample paths · metric calc errors · aggregation bugs. Cheap iteration here matters because the eval-runner is the measurement instrument.
3. **Gaps between mock heuristics and expected output** — these are EXPECTED to fail at mock-mode and indicate which metrics need live LLM to score well. This is the diagnostic value: "sections include 0/30 in mock → mock is too sparse → live LLM is the only path to score here."

The third category is the most valuable. The mock's failures TELL YOU which metrics depend on real AI judgment vs which depend on structural correctness.

## Validated cross-trial

| Trial | Project | Mock-found bugs |
|---|---|---|
| Trial 4 (F6.5 first surfacing) | umkm-indo storefront PoV (4 samples) | 3 latent bugs in mock heuristics (false-positive IP flag · copy-strategy too conservative · hallucination guards mis-fired) |
| Trial 4b (F7.5 second surfacing) | umkm-indo landing-page MVP (30 samples) | 5 metric-gap signals (theme picks 73% · sections-include 0/30 · compliance 19/30) at $0 in <2 seconds |
| Future external adopter | TBD | TBD |

## Cost economics

If your live LLM cost per call is $C and your golden dataset has N samples:

- Mock eval cost: **$0** per iteration · run as many times as you want during prompt iteration
- Live eval cost: **N × $C** per iteration · pay each time you change a prompt
- Breakeven for mock-first investment: 2-3 iterations of the eval (almost always trivially worth it)

## See also

- [`docs/audit/trial-friction-log.md` § Trial 4b · F7.5](../../../docs/audit/trial-friction-log.md) — third cross-trial confirmation
- [`docs/references/script-from-nextjs.md`](../../../docs/references/script-from-nextjs.md) — running the eval-runner as a CLI script when the AI module is server-only
- [`/pov-gate`](../../pov-gate/SKILL.md) — the gate that consumes the live-mode baseline produced after mock-first iteration
