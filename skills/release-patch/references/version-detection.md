---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-19
update_trigger: New manifest format supported or bump procedure change
status: current
---

# release-patch — Manifest detection + per-mode bump procedure

Reference loaded at Step 2 + Step 3 of `skills/release-patch/SKILL.md`. Owns detection cascade + per-mode bump logic.

## Detection cascade

Run in priority order; **first match wins**. Multiple manifests OK to coexist (e.g., a Claude Code plugin that also has a `package.json` for tooling) — plugin priority short-circuits.

```
1. Glob `.claude-plugin/plugin.json`             → mode = plugin
2. Glob `package.json` (repo root)               → mode = npm
3. Glob `pyproject.toml` (repo root)             → mode = python
4. Glob `Cargo.toml` (repo root)                 → mode = cargo
5. Glob `go.mod` (repo root)                     → mode = go
6. Glob `VERSION` (repo root, flat file)         → mode = flat
7. None matched                                  → mode = none
```

Workspace / monorepo handling is out of scope. If multiple `package.json` files exist, prompt the user to confirm which is the release target.

## Mode = plugin

**Manifest paths:**
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

**Bump procedure:**
1. Read both files. Parse `version` fields.
2. Verify lockstep: both versions equal. If diverged → ABORT with `[error] plugin.json + marketplace.json versions diverge — manual reconcile required`.
3. Parse semver `MAJOR.MINOR.PATCH`. Increment PATCH.
4. Write both files back with new version. Preserve all other fields verbatim (no reformatting).
5. CHANGELOG → `CHANGELOG.md` at repo root.
6. Run plugin-only Steps 5 + 6 (MEMORY refresh + CONTEXT drift check).

**Why lockstep:** plugin install regression risk when versions diverge between manifest + marketplace listing. Contract is non-negotiable for plugin mode.

## Mode = npm

**Manifest path:** `package.json` (repo root).

**Bump procedure:**
1. Read `package.json` as JSON. Extract `version` field.
2. If missing or non-semver → ABORT.
3. Parse `MAJOR.MINOR.PATCH`. Increment PATCH.
4. Write `package.json` back with new version. Preserve key order + indentation.
5. If `package-lock.json` exists, also update its top-level `version` field.
6. CHANGELOG → root `CHANGELOG.md` (or detected variant).
7. Skip plugin-only Steps 5 + 6.

**Edge cases:**
- Pre-release suffix (`1.2.3-beta.4`) → strip suffix on PATCH bump (`1.2.3-beta.4` → `1.2.4`).
- Workspaces: prompt user; do not auto-bump all sub-packages.

## Mode = python

**Manifest path:** `pyproject.toml` (repo root).

**Bump procedure:**
1. Read `pyproject.toml`. Detect format:
   - `[project]` table with `version = "X.Y.Z"` (PEP 621).
   - `[tool.poetry]` table with `version = "X.Y.Z"` (Poetry).
   - Both present → prefer `[project]` per PEP 621; warn user if Poetry version diverges.
2. If `version = { ... dynamic = true }` → ABORT with `[error] dynamic version detected — release-patch cannot bump dynamic; tag manually`.
3. Parse semver. Increment PATCH.
4. Write back preserving TOML structure (surgical line-level edit; preserve formatting + comments).
5. If `setup.py` or `setup.cfg` exists with hardcoded version → also update for consistency.
6. CHANGELOG → root `CHANGELOG.md`.
7. Skip plugin-only Steps 5 + 6.

**Edge cases:**
- PEP 440 post-release suffixes → strip on PATCH bump.

## Mode = cargo

**Manifest path:** `Cargo.toml` (repo root).

**Bump procedure:**
1. Read `Cargo.toml`. Locate `[package]` table; extract `version = "X.Y.Z"`.
2. If missing → ABORT.
3. Parse semver. Increment PATCH.
4. Write back via surgical line edit.
5. If `Cargo.lock` exists, run `cargo update --workspace --offline` if available; else prompt user to refresh lockfile manually.
6. CHANGELOG → root `CHANGELOG.md`.
7. Skip plugin-only Steps 5 + 6.

**Workspaces:** if `[workspace.package] version` is used (Cargo workspace inheritance), bump there.

## Mode = go

**Manifest path:** `go.mod` (repo root). Note: Go modules use **git tags** for versioning.

**Bump procedure:**
1. Read latest tag: `git describe --tags --abbrev=0`. If none → prompt user for initial tag (e.g., `v0.1.0`).
2. Parse semver. Increment PATCH (go convention: tag prefix `v`).
3. **DO NOT create the tag automatically.** Emit `[bump] go module: next tag = v1.2.4 (will be tagged at push)`. User runs `git tag v1.2.4` after push manually.
4. CHANGELOG → root `CHANGELOG.md`.
5. Skip plugin-only Steps 5 + 6.
6. HARD STOP message includes tag command: `Run manually: git tag v1.2.4 && git push origin master --follow-tags`.

**Why no auto-tag:** tags are immutable; auto-creation would make rollback harder. Push gate is human responsibility.

## Mode = flat

**Manifest path:** `VERSION` (repo root, single-line text file).

**Bump procedure:**
1. Read `VERSION`. Trim whitespace.
2. If non-semver → ABORT.
3. Parse, increment PATCH.
4. Overwrite file with new version + trailing newline.
5. CHANGELOG → root `CHANGELOG.md`.
6. Skip plugin-only Steps 5 + 6.

## Mode = none

No manifest detected. Emit:

```
[skip] no version manifest detected
  Project has no plugin.json / package.json / pyproject.toml / Cargo.toml / go.mod / VERSION.
  Either add a manifest or release-patch is not the right tool for this project.
```

Exit 0 (not an error — release-patch genuinely doesn't apply).

## CHANGELOG file detection (general modes)

For non-plugin modes, search repo root in this order:

```
1. CHANGELOG.md
2. CHANGES.md
3. HISTORY.md
4. CHANGELOG (no extension, plain text)
```

First match wins. If none found, create `CHANGELOG.md` using Keep-a-Changelog format default header.

## CHANGELOG entry format

**Plugin mode:** match existing `CHANGELOG.md` per-version entry schema verbatim.

**General modes:** Keep-a-Changelog format:

```markdown
## [v2.3.1] — 2026-05-08

### Fixed
- <bug fix summary>

### Changed
- <behavior change summary>

### Added
- <new feature summary>
```

## Edge cases

- **Manifest exists but empty / unparseable** → ABORT with file-specific error.
- **Multiple manifests cross-priority** → priority short-circuits; plugin wins. Log: `[mode] plugin (also found: package.json — ignored per priority)`.
- **Version field is `0.0.0`** → bump to `0.0.1`; warn user this looks like initial commit.
- **Version field uses `^` / `~` / range syntax** → ABORT; ranges are dependency syntax.
- **Pre-release suffixes** → strip on PATCH bump.
