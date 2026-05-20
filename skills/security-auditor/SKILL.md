---
name: security-auditor
description: Use when code, API specs, or configuration files need a security audit — or when a /security-review session is needed. Invoked automatically by the security-analyst agent in a separate /security-review session. Do not use for general code quality review; use pr-reviewer instead.
user-invocable: true
agent: security-analyst
version: "1.0.0"
last-validated: "2026-05-19"
type: rigid
---

# Security Auditor

Audit code, API specs, or configurations for security vulnerabilities. Loaded by the `security-analyst` agent in a separate `/security-review` session (same-context security audits cause context contamination), or invoked directly.

For agentic adversarial review (prompt injection, goal hijacking, etc.), use the `red-team-analyst` agent instead — different surface.

## OWASP Top 10 Checklist (2021)

| ID | Category | What to check |
|:---|:---------|:--------------|
| A01 | Broken Access Control | Missing authz checks, IDOR, privilege escalation, path traversal |
| A02 | Cryptographic Failures | PII unencrypted, weak algorithms (MD5, SHA1, DES), secrets in code |
| A03 | Injection | SQL, NoSQL, command, LDAP, template, XPath injection vectors |
| A04 | Insecure Design | Missing rate limiting, no threat model, business logic flaws |
| A05 | Security Misconfiguration | Debug mode on, open CORS, default credentials, verbose errors |
| A06 | Vulnerable Components | Known CVEs in dependencies — flag names + versions for manual check |
| A07 | Auth/Session Failures | Weak passwords, no MFA path, session fixation, JWT `alg: none` |
| A08 | Integrity Failures | Unsigned updates, unsafe deserialization of untrusted data |
| A09 | Logging Failures | No audit trail for auth events, PII in log output |
| A10 | SSRF | Server-side requests to user-controlled URLs without allowlisting |

## Additional Checks

- **Secrets exposure**: hardcoded API keys, passwords, tokens, connection strings in source
- **Mass assignment**: unfiltered request body mapped directly to a DB model or object
- **Insecure direct object references**: object IDs in URLs without ownership verification
- **Path traversal**: user input used in file system operations

## Output Format

```
## Security Audit — [scope]

status: DONE | DONE_WITH_CONCERNS | BLOCKED

### CRITICAL (no truncation — show all)
- [A0X] [finding]: [file:line] — [exact fix required]

### BLOCKING (max 5)
- [A0X] [finding]: [file:line] — [fix]

### NON-BLOCKING
- [A0X] [finding — brief]

### APPROVED PATTERNS
- [good security practice noted]

### RECOMMENDATION
[One actionable next step — max 2 sentences]
```

## Hard Rules

- CRITICAL findings are never truncated — spill into a follow-up response rather than summarizing.
- Tag every finding with OWASP ID (A01–A10) where applicable.
- Do NOT return raw file contents — line references and minimal excerpts only.
- Do NOT write, delete, or modify any files.

## Red Flags

❌ **"This looks fine — no clear OWASP category matches"** — no clear match → flag as NON-BLOCKING with reasoning; silent skips are the most dangerous findings
❌ **"This was clean in a previous audit"** — prior approval does not carry over; audit each invocation independently
❌ **"I'll note the class of issue without listing every instance"** — CRITICAL findings enumerate every instance; partial disclosure is incomplete disclosure
❌ **"This is an internal service, auth checks aren't critical"** — A01 applies regardless; internal services are breached laterally

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
