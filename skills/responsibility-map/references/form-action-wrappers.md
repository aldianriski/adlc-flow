# Inline Server-Action form-action wrapper pattern

Filed per Trial 5 F8.13 (2026-05-20). Codifies the pattern used in
temidev Sprint 032 T3 + F3b P4 + F3c P4 for dispatching structured
Server Actions from Next.js form-action buttons.

## The pattern

For server-component pages that dispatch typed Server Actions from
buttons, define INLINE async function wrappers with `"use server"`
inside an outer server-component file. The wrapper extracts FormData
fields, calls the structured SA, then redirects based on the result.

```typescript
// app/(admin)/admin/agreements/[id]/page.tsx
export default async function AgreementDetailPage({ params }) {
  const { id } = await params;
  const agreement = await loadAgreement(id);

  // Inline server actions · scoped to this page's context (id closure)
  async function sendFormAction(formData: FormData) {
    "use server";
    const result = await sendAgreement({ id: String(formData.get("id") ?? "") });
    if (result.error) {
      redirect(`/admin/agreements/${id}?error=${result.error}`);
    }
    redirect(`/admin/agreements/${id}?flash=sent`);
  }

  async function markSignedFormAction(formData: FormData) {
    "use server";
    const result = await markSigned({
      id: String(formData.get("id") ?? ""),
      signer_name: String(formData.get("signer_name") ?? ""),
      signer_email: String(formData.get("signer_email") ?? ""),
      signer_company: (formData.get("signer_company") as string | null) || undefined,
      signed_at: String(formData.get("signed_at") ?? ""),
    });
    if (result.error) {
      redirect(`/admin/agreements/${id}?error=${result.error}`);
    }
    redirect(`/admin/agreements/${id}?flash=signed`);
  }

  return (
    <>
      {/* ... */}
      <form action={sendFormAction}>
        <input type="hidden" name="id" value={agreement.id} />
        <button type="submit">Send</button>
      </form>
      <form action={markSignedFormAction}>
        <input type="hidden" name="id" value={agreement.id} />
        <input name="signer_name" required />
        {/* ... */}
        <button type="submit">Mark Signed</button>
      </form>
    </>
  );
}
```

## Why inline · not a separate `_actions.ts` file

Three reasons:

1. **Page-specific context closure**: the wrappers reference `id` (from
   `params`) for the redirect URL. Lifting to a separate file means
   re-deriving id from FormData · duplication.

2. **Co-location with consumers**: the form button + the action handler
   sit in the same file. New contributors see both at once. Avoids "where
   does this form action live?" search.

3. **Phase-2 escape hatch**: if the wrapper grows complex enough to
   warrant testing in isolation, lift to a sibling `_actions.ts` file
   then. Until then, inline is cheaper.

## When to use a Client Component island instead

Use a Client Component with `useActionState` (not inline server action)
when:

- Form needs inline validation feedback BEFORE submit (per-field errors
  surfaced without redirect)
- Form needs optimistic UI (show "Saving..." state mid-request)
- Form has interdependent fields (one field's value drives another's
  visibility)

For simple submit-then-redirect flows, inline server action wins.

## The structured SA → form-action adapter pattern

The wrapper is an ADAPTER between two surfaces:

| Surface | Shape | Caller |
|---|---|---|
| Structured SA (`sendAgreement`, `markSigned`, etc.) | Typed input · typed result with `data?` and `error?` and `fieldErrors?` | Testable from vitest with mocked Supabase · callable from any client island OR any server component |
| Form action (`<form action={fn}>`) | Untyped FormData → `Promise<void>` with `redirect()` | Browsers submit forms · no structured-error surface |

The inline wrapper bridges FormData ↔ typed input, and `result.error` ↔
URL flash query-param. This keeps the structured SA testable in isolation
(22+ test cases in temidev's Sprint 032 T2 + F3c P3 prep) while the
form-action layer stays thin.

## Adopter precedents

- **temidev Sprint 032 T3** — agreement detail page · 3 buttons (Send ·
  Mark Signed · Void) · all inline wrappers + redirect with flash. (Commit
  `0782bfd`.)
- **temidev Sprint 033 F3b P4** — /admin/agreements/new route · single
  wrapper for generateSowDraft → createAgreement chain. (Commit
  `5b60ad3`.)
- **temidev Sprint 033 F3c P4** — risk-review route uses a different
  pattern (analyzes on page load · no form). For F3c the wrapper is
  unnecessary because the action triggers via URL navigation.

## When NOT to use

- The SA returns 0 data (e.g. a fire-and-forget signal). The wrapper still
  works but adds zero value over a plain `<form action={sa}>` direct
  binding.
- The form needs multiple sequential SA calls with conditional flow
  (e.g. "if A succeeds AND user is admin THEN call B"). Lift to a Client
  Component with useActionState · the inline wrapper isn't expressive
  enough for branching.

## Cross-references

- Sprint 024 § Surprise 1 (temidev) — original capture of the
  form-action-vs-client-island decision pattern (gcal integrations setup)
- ADR-029 — RLS as auth layer (the structured SA layer is where the
  app-side guards live · the wrapper just adapts the surface)
- Trial 5 F8.13 — this pattern's promotion validating 3 cross-trial
  adopters
