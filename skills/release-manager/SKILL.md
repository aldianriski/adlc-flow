---
name: release-manager
description: Use when managing semantic versioning, generating changelogs from git history or PR lists, or producing formatted release notes at the end of a sprint or before a deployment. Owns MINOR/MAJOR bumps; PATCH bumps go through release-patch.
user-invocable: true
version: "1.0.0"
last-validated: "2026-05-19"
type: rigid
---

# Release Manager

Produce semantic-versioned releases with CHANGELOG entries and formatted release notes.

## Versioning Rules (SemVer)

| Change type | Bump | Example trigger |
|:------------|:-----|:----------------|
| Breaking API change | MAJOR | Removed endpoint, incompatible schema change, retired skill/gate |
| New feature (backward-compatible) | MINOR | New endpoint, new optional field, new skill/agent |
| Bug fix / patch | PATCH | Fix incorrect behavior, update dependency |

Pre-release suffixes: `-alpha.N`, `-beta.N`, `-rc.N`.

> **Paired counterpart:** PATCH releases via `release-patch` (auto-detects manifest cascade · plugin lockstep · hard-stop push gate). This skill owns MINOR/MAJOR; `--from-sprint` flag detects bump-class from Active Sprint task-types (MINOR/MAJOR only); never overlaps `release-patch` PATCH cascade.

## Invocation

```bash
/release-manager [version]       # Explicit version (e.g. 1.2.0)
/release-manager patch           # Auto-bump PATCH (defer to release-patch)
/release-manager minor           # Auto-bump MINOR
/release-manager major           # Auto-bump MAJOR
/release-manager --from-sprint   # Detect bump from Active Sprint task types
```

Execution procedure: `references/procedure.md`.

## CHANGELOG Entry Format

```markdown
## [version] — YYYY-MM-DD

### Breaking Changes
- [change] ([short SHA])

### Features
- [feature] ([short SHA])

### Fixes
- [fix] ([short SHA])

### Dependencies
- Updated [dep] from [old] to [new]
```

## Red Flags

| Rationalization | Reality |
|:----------------|:--------|
| "It's a small breaking change — a MINOR bump is fine" | Any breaking change is MAJOR. No exceptions. |
| "I'll update the CHANGELOG after the tag" | CHANGELOG must be written and confirmed before any tag command is proposed |
| "There's no version file yet — I'll infer a version" | Hard stop: ask the user to specify the version before writing anything |
| "The commit messages are vague — I'll summarize loosely" | Write only what the commits confirm; flag ambiguous commits explicitly rather than guessing intent |

## Hard Rules

- Never skip a MAJOR bump when a breaking change is present.
- Never write the CHANGELOG until the version is confirmed with the user.
- Do NOT run `git tag` — propose the command for the user to execute.
- Empty sections (e.g., no breaking changes) are omitted from the CHANGELOG entry.

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
