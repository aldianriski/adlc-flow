---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
purpose: 3-cache-blocks architecture for structured-output AI features — cost economics + when to use
status: validated (umkm-indo Trial 4b)
---

# 3-cache-blocks pattern for structured-output AI

## TL;DR

Split your LLM call's "system content" into three cache-eligible blocks: **system prompt** · **reference data** (registry · taxonomy · enums) · **style guide**. Mark each as ephemeral-cached (Anthropic 5-min TTL · OpenAI similar). User prompt stays outside cache. Result: ~40-60% input-token cost reduction after the first call in a session, with no quality loss. Validated in umkm-indo's landing-page generator.

## When to use

- LLM features where you generate structured output for many requests (landing pages · classifications · structured emails · etc.)
- System content >2k tokens that's STABLE between requests
- Per-request input that's small (<500 tokens) compared to system content
- Dev/prod sessions that span minutes (cache TTL benefit)

## When NOT to use

- One-shot integrations where you call the LLM once per session
- System content that varies per request (defeats caching)
- Very small system prompts (<1k tokens) — cache overhead exceeds savings

## The three blocks

### Block 1 — system prompt (~1-2k tokens)

Role · process · hard rules · output format expectations. Stable across all requests in this feature. Example structure:

```
You are [role].

## Role boundaries
[what you ARE · what you are NOT]

## Hard rules (REFUSE or FLAG)
1. [rule with mechanism, not "be careful about X"]
2. [...]

## Process
1. [step]
2. [step]

## Output format
[explicit format constraints · all required fields · enums]
```

### Block 2 — reference data (~1-3k tokens)

Registries · taxonomies · enums · domain vocabulary. Serialized as JSON or markdown. Stable across requests; changes only on registry edit (which forces a redeploy + cache rebuild). Example: theme registry · category taxonomy · BPOM-product-database snippet · compliance-flag dictionary.

### Block 3 — style guide (~0.5-1k tokens)

Tone · forbidden phrases · domain-specific patterns. Stable across requests. Often locale-specific (Bahasa Indonesia commerce-copy conventions · German formal-vs-informal · etc.). Worth its own block because it can be versioned independently of the system prompt.

### Outside-cache — user prompt

Per-request specifics: seller business name · description · category hint · optional featured products. Small (~0.5-1k tokens) and unique per request. Never cache-marked.

## Anthropic SDK example

```ts
const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  system: [
    { type: "text", text: SYSTEM_PROMPT,    cache_control: { type: "ephemeral" } },
    { type: "text", text: REFERENCE_DATA,   cache_control: { type: "ephemeral" } },
    { type: "text", text: STYLE_GUIDE,      cache_control: { type: "ephemeral" } },
  ],
  tools: [/* structured-output tool */],
  tool_choice: { type: "tool", name: "..." },
  messages: [{ role: "user", content: buildUserPrompt(input) }],
});
```

Anthropic respects up to 4 cache breakpoints per request; we use 3 here with room for one more if you add a fourth stable block.

## Cost math (worked example)

Input cost per token: $3/M input · $3.75/M cache_write (1.25×) · $0.30/M cache_read (0.10× of input · 90% savings)

For Sonnet 4.6 on a structured-output feature with:
- 4k cache-eligible system tokens (3 blocks combined)
- 1k user prompt
- 3k structured output

**First call** (no cache hit · all writes):
- 4k × $3.75/M = $0.015 (cache write)
- 1k × $3/M = $0.003 (user)
- 3k × $15/M = $0.045 (output)
- **Total: $0.063 ≈ Rp 1.000**

**Cached call** (within 5-min TTL):
- 4k × $0.30/M = $0.0012 (cache read)
- 1k × $3/M = $0.003 (user)
- 3k × $15/M = $0.045 (output)
- **Total: $0.049 ≈ Rp 790**

**Savings per cached call**: $0.014 (~22% of first-call cost · 90% reduction on input portion).

## Cache invalidation triggers

- **5-minute idle** — ephemeral cache evicts after 5 min of no reads. Plan dev sessions in bursts.
- **Block content changes** — any byte change in a cached block invalidates that block AND all subsequent blocks in the array. Order matters: stable-est blocks first.
- **Model change** — switching from Sonnet 4.6 → Opus invalidates cache (different model).

## Anti-patterns

- **Per-request system prompt edits**: defeats caching. If you need per-request variations, put them in the user prompt instead.
- **Single mega-prompt block**: works but you lose the ability to invalidate JUST the style guide when you tweak tone — you'd invalidate everything.
- **Cache_control on the user prompt**: doesn't help (user prompt changes per request anyway). Skip it.

## Cross-trial validation

Surfaced as F7.6 in umkm-indo Trial 4b. The landing-page generator's three blocks (1.5k system · 2k theme registry · 1k Bahasa style guide) hit the projected ~Rp 790 cached cost vs ~Rp 1.000 first call. ADR-002 documents the full math in the umkm-indo project.

## See also

- [`docs/audit/trial-friction-log.md` § Trial 4b · F7.6](../../../docs/audit/trial-friction-log.md)
- [`single-call-planner.md`](single-call-planner.md) — pairs with this pattern; structured-output via tool_use that consumes the cached blocks
- Anthropic prompt caching docs: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
