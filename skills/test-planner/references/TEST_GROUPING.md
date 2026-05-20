---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: Group definition changes or new group added
status: current
---

# Test Grouping — full reference for test-planner

> Loaded on demand from `skills/test-planner/SKILL.md`.

---

## 4-Group Canonical Convention

These four groups are locked. Adopters MAY extend in their own conventions, but the plugin-bundled skill ships with this set. Each group has distinct scope, speed budget, and isolation level.

### 1. Unit

**Scope:** pure functions · single class methods · isolated logic with no I/O · in-memory data transformations.

**Examples:**
- A pure function `formatCurrency(123.45, 'USD') === '$123.45'`
- A class method `Order.calculateTotal()` returning expected total from given items
- A reducer `cartReducer(state, action)` returning correct next state

**Counter-examples (NOT unit):**
- Calls a real database → integration
- Spawns a child process → integration
- Renders a UI in a browser → e2e
- Mocks an entire HTTP server → still integration (the seam is real-ish)

**Common pitfalls:**
- Mocking pure logic to "speed up tests" — pure logic is already fast; mocks add noise
- Asserting implementation details (private methods called) instead of observable outputs
- Sharing state across unit tests (test order dependence)

**Speed budget:** <100ms per test. If a unit test exceeds this, it's probably integration in disguise.

### 2. Integration

**Scope:** module seams · DB queries · HTTP clients · queue producers/consumers · cross-module collaborations · adapter boundaries.

**Examples:**
- `userRepository.findByEmail()` against a real test DB returns the right user
- HTTP client correctly serializes auth header + handles 401 retry
- Queue producer publishes correct payload shape on order-created event

**Counter-examples (NOT integration):**
- Pure function with no I/O → unit
- Full user signup flow including UI → e2e
- Asserting the DB schema itself → migration test (separate surface)

**Common pitfalls:**
- Mock-heavy integration tests (defeats the purpose; if you're mocking the seam, write a unit test)
- Shared test DB state across tests (use transaction rollback or per-test schemas)
- Asserting timing of async operations without proper await/poll

**Speed budget:** <2s per test.

**Isolation:** real deps · isolated environment (test DB · test queue · localstack for cloud).

### 3. E2E (end-to-end)

**Scope:** complete user-visible flows · full stack (UI + API + DB + queue + external if mockable) · happy path + 1-2 critical error paths per flow.

**Examples:**
- User signs up → confirms email → logs in → sees dashboard
- Customer adds item to cart → checks out → receives order confirmation
- Admin adjusts setting → page refresh shows new value

**Counter-examples (NOT e2e):**
- API contract test without UI → integration
- UI component renders correctly in isolation → unit (or component test)
- Cron job fires correctly → integration (unless it's part of a user flow)

**Common pitfalls:**
- Testing every CRUD permutation as e2e (too slow; cover CRUD at integration · cover flows at e2e)
- Flaky e2e from real network/3rd-party dependencies (use VCR or mock at network boundary)
- E2e suite that takes >30 minutes (split: critical-path e2e on every commit · full-suite nightly)

**Speed budget:** <30s per test. Suite total <10 minutes for critical paths.

**Isolation:** real stack (staging environment OR local docker-compose full-stack).

### 4. Regression

**Scope:** explicit replay tests for past bugs OR critical edge cases that MUST NOT recur. Can be unit, integration, OR e2e in shape — what makes it "regression" is the **intent**: assert the fix holds.

**Examples:**
- Bug #1234 — null email crashed signup → unit test asserting null email returns 400 (not 500)
- Bug #2345 — race condition in cart-reducer under double-click → integration test reproducing the race
- Bug #3456 — checkout flow failed for users with no last name → e2e test specifically with no last name

**Common pitfalls:**
- Letting regression tests rot (no one reads them) — link each regression test to its bug ID + post-mortem in comments
- Conflating "I'd like to test this" with "this fixed a real bug" — regression-bucket is for actual past failures
- Removing regression tests when refactoring "because the bug can't happen anymore" — keep them; they document the bug class

**Speed budget:** matches the host group (unit / integration / e2e budgets apply).

---

## Decision Tree — which group covers a scenario?

```
Question: does the scenario involve I/O (DB · HTTP · queue · file · process)?
  NO  → Unit
  YES → continue

Question: does the scenario involve a complete user-visible flow?
  NO  → Integration
  YES → continue

Question: is this replaying a specific past bug or critical edge case?
  YES (any group above + replay-intent) → Regression
  NO                                     → E2E
```

Multi-group scenarios: a single test usually fits ONE group. If it fits two, it's likely doing too much — split it.

---

## Skip-When Guidance (per group)

- **Unit:** skip when the function is a thin pass-through with no logic. Force-writing units for trivial code is busywork.
- **Integration:** skip when the seam is provided by a vetted library you trust. Test YOUR usage of it, not its existence.
- **E2E:** skip when the flow is non-critical (admin-only · debug-only · feature-flagged off by default). Cover at integration instead.
- **Regression:** skip when the bug is rendered impossible by structural change (e.g., type-system makes the null case unreachable). Document the structural change instead of writing a test that can't fail.

---

## Hand-off to `/tdd`

After test-planner outputs the test plan, dispatch `/tdd` per scenario in the plan:

1. test-planner emits the plan → user reviews + adjusts.
2. `/tdd` is invoked per task: writes the tests in the planned group(s), red-green-refactor cycle.
3. test-planner does NOT write tests; only plans. tdd does NOT plan; writes from a given plan.

**Hand-off envelope:**
```
{
  "feature": "<name>",
  "tests_planned": [
    { "group": "unit|integration|e2e|regression", "scenario": "...", "boundary_or_seam": "...", "assertion_shape": "..." }
  ],
  "skipped_groups": [
    { "group": "...", "reason": "<explicit N/A>" }
  ]
}
```

---

## When NOT to use test-planner

Use `/eval-suite-planner` instead when:
- Measuring agentic behavior (hallucination rate, refusal accuracy, output-distribution quality)
- N-run distributional tests, not single-pass assertions
- Eval frameworks (RAGAS / DeepEval / LLM-as-judge) are involved

test-planner is for **deterministic code** that wraps or supports the agentic feature (tool implementations, API surfaces, business logic, data transformations). The two skills cover non-overlapping surfaces.

---

## Anti-Outcomes (what test-planner does NOT do)

- **Coverage-percentage measurement** — plan covers scenarios, not %
- **Test execution** — that's the test runner's job (jest · pytest · go test · etc)
- **Test refactoring** — refactor-advisor surfaces test brittleness; pr-reviewer reviews test quality
- **Mock/fixture authoring** — tdd writes those during red-green-refactor
- **Agentic eval planning** — eval-suite-planner covers that surface
