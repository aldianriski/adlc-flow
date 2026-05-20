# Release Manager — Execution Procedure

1. **Read current version** from `.claude-plugin/plugin.json` (plugin mode), `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod` tag, or `VERSION` file.
   If no version source found → ask user to specify before proceeding.
2. **Classify changes** from `git log` since last tag — label each commit MAJOR / MINOR / PATCH.
3. **Confirm bump** with user before writing anything.
4. **Generate CHANGELOG entry** using the CHANGELOG Entry Format in `../SKILL.md`.
5. **Update version file(s)**. Plugin mode requires lockstep: `plugin.json` + `marketplace.json` versions must stay equal.
6. **Propose tag command** — do not run it: `git tag -a v[version] -m "Release v[version]"`.
7. **Hand off PATCH** — if the requested bump is PATCH, redirect to `/release-patch` instead of executing in this skill.
