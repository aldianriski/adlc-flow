---
name: release-patch
description: Use when releasing a patch on any project — auto-detects manifest (plugin / npm / python / cargo / go / flat), bumps PATCH version, prepends CHANGELOG entry, runs plugin-only metadata refresh if applicable, then HARD STOPS before push. Skips bump entirely if only docs/ changed. Never invokes `git push`; emits ready-to-push message and exits.
allowed-tools: Read, Write, Edit, Bash(git diff *), Bash(git log *), Bash(git tag *), Glob, Grep
user-invocable: true
type: rigid
version: "1.0.0"
last-validated: "2026-05-19"
---

# release-patch

Patch-release orchestrator. Auto-detects project type via manifest cascade. 8 ordered steps. Last step is hard human gate before push.

## When to invoke

- Sprint just closed; PATCH bump needed.
- Single bug-fix landed or hotfix on master; reload needed before next session.

Do **not** invoke for MINOR (new mode/agent/skill) or MAJOR (gate/contract change) bumps — paired counterpart `release-manager` handles those.

## Mode detection cascade

| Detected file | Mode | Bump target |
|---|---|---|
| `.claude-plugin/plugin.json` | plugin | lockstep with `marketplace.json` |
| `package.json` | npm | `version` field |
| `pyproject.toml` | python | `[project]` or `[tool.poetry]` `version` |
| `Cargo.toml` | cargo | `[package] version` |
| `go.mod` | go | tag-based — prompts user for tag string |
| `VERSION` (flat file) | flat | overwrite with new semver |
| none of above | n/a | emit `[skip] no version manifest detected`, exit 0 |

Multi-manifest priority: plugin > npm > python > cargo > go > flat. Per-mode procedure: `references/version-detection.md`.

## Steps

1. **Diff scan**: `git diff --name-only HEAD~1 HEAD` (or `HEAD` if uncommitted). If every changed path matches `^docs/`, abort with `[skip] docs-only diff — no version bump`. Exit 0.
2. **Mode detect**: run cascade. Save mode + manifest path(s). If none → `[skip] no version manifest detected`. Exit 0.
3. **PATCH bump**: per mode. Plugin: lockstep verify + bump both files. Single-manifest modes (npm/python/cargo/flat): read-bump-write. Go: prompt for tag string. Procedure: see `references/version-detection.md`.
4. **CHANGELOG entry**:
   - Plugin → `CHANGELOG.md` at repo root (existing schema).
   - General → detect `CHANGELOG.md` / `CHANGES.md` / `HISTORY.md` at repo root; default `CHANGELOG.md` if none. Prepend new block matching detected file's entry shape.
5. **MEMORY refresh** *(plugin mode only)*: if `TODO.md` Active Sprint is `— none —`, update MEMORY.md sprint-state entry. General modes skip.
6. **CONTEXT drift check** *(plugin mode only)*: diff `.claude/CONTEXT.md` Gates/Modes/Agent Roster against last tag. WARN if drift. General modes skip.
7. **Stale-doc auto-clear**: any doc with `last_updated:` frontmatter touched in diff → bump to today (`yyyy-MM-dd`).
8. **HARD STOP — push gate**: emit exact message:

```
=== READY TO PUSH ===
Mode: <plugin|npm|python|cargo|go|flat>
Version: <new>
Sprint: <number-or-none>
Run manually: git push origin master
=====================
```

Exit 0. **Skill never invokes `git push`.**

## Output format

```
=== RELEASE-PATCH ===
[mode]      <plugin | npm | python | cargo | go | flat>
[diff]      <N> files changed
[bump]      <manifest>: 2.3.0 → 2.3.1 (lockstep paths if plugin)
[changelog] entry prepended for v2.3.1
[memory]    <skipped non-plugin | refreshed Sprint NNN>
[context]   <skipped non-plugin | no drift | DRIFT WARN>
[stale]     <N> docs touched; last_updated bumped
[push]      HARD STOP — manual `git push origin master` required
======================
```

## Red Flags

❌ **Bumping plugin.json without marketplace.json (or vice versa)** — lockstep contract; both versions must stay equal
❌ **Skipping the diff check** — noisy version churn for docs-only commits
❌ **MINOR/MAJOR bumps** — out of scope; route to `release-manager`
❌ **Auto-creating ADRs for the release** — packaging skill, not decision-recorder
❌ **Mode-detection bypass** — never hardcode mode; always run cascade

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
