---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
purpose: Single-call planner with tool_use structured output — worked example from umkm-indo
status: validated (umkm-indo Trial 4b)
---

# Single-call planner with `tool_use` structured output

## TL;DR

For most structured-output AI features, a single LLM call that produces a complete JSON manifest via `tool_use` beats orchestrated multi-call approaches on both **cost** and **coherence**. Validated against the multi-agent alternative in umkm-indo's H-001: single-call ~Rp 1.200/landing-page vs hybrid multi-agent ~Rp 157.000/storefront (130× cheaper at same coherence quality).

This is the practical Plan-and-Execute implementation: one LLM call IS the Plan; deterministic code IS the Execute. Multi-agent fits only when domains are genuinely non-overlapping AND coordination cost is justified.

## When to use

- Feature output is a single coherent artifact (landing page · email · classification · structured manifest)
- Decisions about the output are INTERDEPENDENT (theme pick depends on category which depends on tone which depends on user demographic — splitting into multiple calls loses coherence)
- Total per-feature LLM cost budget is tight (<$0.50 per generation)
- Latency budget allows one synchronous LLM round-trip

## When NOT to use

- Genuinely independent specialist domains (one agent for legal review · one for creative writing · one for compliance — different expertise, parallel callable)
- Long-horizon orchestration where intermediate state matters (research pipelines · agentic workflows with tool-call loops)
- Output that must be progressively streamed to UI (single call is fine for backend processing but harder to stream chunks)

## The pattern

```ts
// 1. Define the output schema (matches your TypeScript types)
const OutputSchema = {
  type: "object",
  required: ["theme_id", "sections", "compliance_flags", "reasoning_summary"],
  properties: {
    theme_id: { type: "string", enum: [...] },
    sections: { type: "array", items: { oneOf: [/* per-section schemas */] } },
    compliance_flags: { type: "array", items: { type: "string", enum: [...] } },
    reasoning_summary: { type: "string", minLength: 50, maxLength: 800 },
  },
};

// 2. Single LLM call with tool_use
const response = await client.messages.create({
  model: MODELS.planner,
  system: [/* 3 cached blocks per prompt-caching-pattern.md */],
  tools: [{ name: "emit_output", input_schema: OutputSchema }],
  tool_choice: { type: "tool", name: "emit_output" },  // forces tool call
  messages: [{ role: "user", content: buildUserPrompt(input) }],
});

// 3. Extract the structured output
const toolUse = response.content.find((b) => b.type === "tool_use");
const output = toolUse.input as MyOutputType;  // schema-validated by Anthropic
```

## Why `tool_use` over plain JSON-in-text

- **Schema validation at API**: Anthropic validates the model's output against your `input_schema` before returning. Failure modes (missing required fields · wrong enum value · malformed nested object) are caught before your code sees them.
- **Type-safe parsing**: `toolUse.input` is statically typed once you cast to your TS interface. No `JSON.parse` + zod validation step needed.
- **`tool_choice: { type: "tool", name: "..." }`** forces the model to call that tool. No free-form prose escapes. The model can ONLY respond by calling the tool.
- **Reasoning preservation**: include a `reasoning_summary` field in your schema. The model writes its rationale into it — useful for eval audits without affecting output.

## What you give up vs multi-call

- **Per-decision auditability** — you can't independently inspect "the theme decision" vs "the brand decision" vs "the copy decision." They all live in one tool call. Mitigation: the `reasoning_summary` field gives you the model's narrative of its decisions.
- **Per-decision retry** — if one section's copy is bad, you can't regenerate JUST that section in the same call. You'd need a follow-on Haiku-tier "refine this section" call. (Worth doing as opt-in UX feature.)
- **Streaming partial results** — single-call returns all-or-nothing. Multi-call lets you show progress. For backend gen + preview-gate UX, this rarely matters.

## What you GAIN vs multi-call

- **30-130× lower cost** — one Sonnet input pass vs N specialist calls. Cache hits make this even better.
- **Coherence** — theme · brand · copy decisions made by the same model in the same context window. Multi-call loses this; each specialist re-derives shared context.
- **Lower compliance attack surface** — no inter-agent prompt-injection vector (cf. Trial 3's NO_GO verdict on inter-agent injection-resistance). One agent, one prompt.
- **Simpler eval** — one input → one output. No handoff metrics to track.

## Worked example: umkm-indo H-001 landing-page MVP

Trade-off analysis at AG:

| Pattern | Planner | Per-task work | Total/landing | Verdict |
|---|---|---|---|---|
| Single-call planner (chosen) | 1 call · ~Rp 600 | Haiku refinements + photo API · ~Rp 400 | **~Rp 1.000-1.200** | ✅ Hits Rp 5k kill ceiling with 75% headroom |
| Multi-call orchestrator | 1 orchestrator · ~Rp 1k | 5 specialists × per-call · ~Rp 7-8k | ~Rp 8-9k | Blows kill ceiling 1.8× |
| Hybrid (orchestrator + multi-agent executor) | 1 orchestrator · 3 specialists per-product | varies | ~Rp 12-15k | Blows ceiling 2-3× |

Cost-kill-criterion fired at AG on the multi-call options; single-call won by economics + matched the coherence requirement. ADR-002 in umkm-indo documents the full reasoning.

## Anti-patterns

- **Splitting interdependent decisions across calls**: theme pick + brand voice + copy are coupled. Splitting them = inconsistent output.
- **Trusting the model's reasoning_summary as ground truth**: it explains what it DID, not necessarily what it SHOULD do. Use it for audit, not verification.
- **Skipping `tool_choice: { type: "tool", name: "..." }`**: lets the model respond with prose. Always force the tool call.

## Cross-trial validation

- Trial 3 (multi-agent escalation · NO_GO) — proved inter-agent injection is a real compliance class. Multi-agent imports that surface.
- Trial 4 + 4b (umkm-indo · F6.3 + F7.7) — single-call planner chosen explicitly to avoid that surface AND hit cost ceiling. Two cross-trial confirmations.

## See also

- [`docs/audit/trial-friction-log.md` § Trial 4b · F7.7](../../../docs/audit/trial-friction-log.md)
- [`prompt-caching-pattern.md`](prompt-caching-pattern.md) — pair with this for the cache-block architecture that feeds the planner
- [`docs/adr/ADR-008-multi-agent-template-adjustments.md`](../../../docs/adr/ADR-008-multi-agent-template-adjustments.md) — multi-agent sub-variants when this pattern doesn't fit
- Anthropic tool_use docs: https://docs.anthropic.com/en/docs/build-with-claude/tool-use
