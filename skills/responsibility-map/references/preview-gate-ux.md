---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-20
purpose: Preview-gate UX pattern — how the RESPONSIBILITY-MAP + COST-BUDGET artifacts surface to the human at decision time
status: validated (umkm-indo Trial 4b)
---

# Preview-gate UX pattern

## TL;DR

The RESPONSIBILITY-MAP says "human approves the irreversible action." The COST-BUDGET says "this generation cost Rp X." A well-designed preview gate makes BOTH visible to the human at the moment they're about to approve. Anti-pattern: AI-generated content rendered as a fait-accompli with a tiny "Publish" button at the bottom. Best practice: sticky preview banner showing **what the AI decided** · **what compliance flags fired** · **what it cost** · **how to regenerate** — at the top of the rendered preview, always visible while the human reviews.

## When to use

- ANY feature where AI generates content that becomes consumer-visible after human approval (landing pages · email drafts · social media posts · contract drafts)
- ANY feature with a `human-pre` row in the RESPONSIBILITY-MAP
- ANY feature with compliance flags (BPOM/halal/IP-risk/medical-claim/restricted-goods)

## The pattern

```tsx
<>
  <PreviewBanner>
    <Status>Preview {live ? "· live AI" : "· mock"}</Status>
    <Decision>Theme: {result.theme_id}</Decision>
    {result.compliance_flags.length > 0 && (
      <ComplianceWarning>⚠ {result.compliance_flags.join(" · ")} — review before publish</ComplianceWarning>
    )}
    <Cost>
      Rp {result.cost.cost_idr.toLocaleString("id-ID")}
      (tokens: in={result.cost.input_tokens} · cache_read={result.cost.cache_read_input_tokens})
    </Cost>
    <RegenerateLink>← Generate ulang</RegenerateLink>
  </PreviewBanner>
  <RenderedContent landing={result} />
</>
```

## What goes in the banner

| Element | Why | Source artifact |
|---|---|---|
| Mode (live / mock) | Sets expectations · prevents "wait, this isn't real?" surprise | Generator opts |
| Top AI decision (theme · category · etc.) | Lets human verify the model didn't drift off-task | Planner output |
| Compliance flags (if non-empty) | RESPONSIBILITY-MAP unsafe-autonomy zones — human MUST review before publish | `compliance_flags` from planner |
| Cost (Rp + token breakdown) | COST-BUDGET visibility — human sees what each generation costs · prevents silent token blow-ups | LLM API usage response |
| Cache-read tokens (if any) | Bonus transparency: shows the caching is working as designed | Anthropic prompt-caching usage fields |
| Regenerate link | Closes the loop · zero-friction iteration | Form submission to same route with new params |

## Anti-patterns

- **Tiny status bar at the bottom of the page** — sellers will scroll past it · click Publish thinking it's safe · find out about the compliance flag in a customer complaint.
- **Compliance warnings hidden behind a "Show details" link** — opt-in surfacing defeats the safety contract. Compliance is non-negotiable; show it always.
- **No cost display** — adopter learns about a Rp 200k bill at month-end instead of in the preview moment when they could act.
- **Hide preview behind another click** — preview-gate works only when the human ACTUALLY sees the preview. If your UI does `/generate` → directly to `/published`, you've removed the gate.

## What the banner enables

- **Last-second compliance reversal** — human sees `bpom` flag · checks they have a registration number · publishes confidently OR halts and gathers info. No surprise.
- **Cost calibration** — human watches cost trend across regenerations · learns whether THEIR feature stays under the budget · self-regulates.
- **Trust** — humans build trust when they SEE the AI's decisions surfaced clearly. Hidden AI = uncanny AI = mistrust.

## Pairs with

- **`RESPONSIBILITY-MAP.md` `human-pre` rows** — every row with this authority level should map to a preview-gate surface element.
- **`COST-BUDGET.md` per-call ceiling** — banner shows actual cost vs budget · color-codes when approaching outlier threshold.
- **`HYPOTHESIS.md` kill-criteria** — banner can also surface "this generation triggered N kill-criteria" links to the verdict log.

## Cross-trial validation

- Trial 4b (F7.8) — umkm-indo `apps/web/src/app/preview/page.tsx` shipped this pattern. PreviewBanner renders sticky-top · shows theme · compliance flags · cost · regenerate. Verified during build that the banner is the FIRST thing the human sees · the rendered content scrolls beneath.
- Confirmed: the banner pattern surfaces the latent COST-BUDGET + RESPONSIBILITY-MAP discipline at exactly the decision moment.

## Code reference

See umkm-indo `apps/web/src/app/preview/page.tsx` for the worked TypeScript + Tailwind implementation (~30 lines for the banner component).

## See also

- [`docs/audit/trial-friction-log.md` § Trial 4b · F7.8](../../../docs/audit/trial-friction-log.md)
- [`../SKILL.md`](../SKILL.md) — the RESPONSIBILITY-MAP skill that produces the artifact this UX pattern surfaces
- [`../../cost-budget/SKILL.md`](../../cost-budget/SKILL.md) — the COST-BUDGET skill whose per-call ceiling shows up in the banner
