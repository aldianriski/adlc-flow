# Skill-triggering acceptance harness

Verifies that a realistic adopter prompt actually triggers the expected adlc-flow skill via Claude Code's description-matching dispatcher.

## How it works

- `prompts/<skill>.txt` — 1-3 sentence realistic prompts that *should* trigger `<skill>`.
- `scripts/eval-acceptance.js` reads each, spawns `claude -p "<prompt>"` 3 times, and checks the stream-json transcript for `"name":"Skill"` AND `"skill":"<expected>"`.
- Pass = ≥2 of 3 runs match.
- Output: `docs/audit/eval-acceptance-YYYY-MM-DD.md` (gitignored — regenerated per run).
- Per-run logs: `tests/skill-triggering/logs/<timestamp>/<skill>/run-N.json` (gitignored — large).

## Default is DRY RUN

`node scripts/eval-acceptance.js` (no flags) does NOT spawn Claude. It emits the plan and exits $0. To run for real:

```bash
node scripts/eval-acceptance.js --live
```

Live runs cost real Claude API tokens. This is operator-initiated, not scheduled. Run cadence: after material description edits OR before each minor-version ship.

## Coverage (v2.4)

Eight prompts spanning the agentic + traditional + orientation paths:

| Prompt | Tests |
|---|---|
| `prime.txt` | Session-start orientation routing |
| `orchestrator.txt` | Sprint/phase dispatch from cold start |
| `hypothesis-register.txt` | Kill-criteria pre-commitment for an agentic feature |
| `agent-architect.txt` | Pattern choice routing (ReAct vs multi-agent vs hybrid) |
| `responsibility-map.txt` | Human-agent decision-grid build |
| `pov-gate.txt` | VG verdict on PoV results |
| `adr-writer.txt` | Hard-to-reverse decision record |
| `zoom-out.txt` | Bird's-eye module-map orientation |

Expand `prompts/` as adopter signal surfaces misfire cases.
