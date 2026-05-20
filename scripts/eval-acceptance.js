#!/usr/bin/env node
/**
 * eval-acceptance.js — TASK-202 (Sprint 011 · v2.4 polish round · 2026-05-20)
 *
 * Skill-triggering acceptance harness. Ported from dev-flow with one safety
 * inversion: the default is DRY RUN (no Claude invocation, no tokens spent).
 * Live runs require explicit --live flag. This matches adlc-flow's cost-safety
 * contract elsewhere (no auto-LLM in SessionStart, no auto-graphify on commit).
 *
 * For each prompt file under tests/skill-triggering/prompts/<skill>.txt:
 *   1. Default (dry-run): emit the plan; exit 0; spend zero tokens.
 *   2. --live: spawn `claude -p "<prompt>" --dangerously-skip-permissions
 *      --max-turns N --output-format stream-json` and regex-match
 *      `"name":"Skill"` AND `"skill":"<expected>"` in the stream.
 *   3. 3 runs per prompt; pass = ≥2/3 quorum (matches dev-flow ADR-021 Mode A).
 *
 * Usage:
 *   node scripts/eval-acceptance.js                    # dry run (default · $0)
 *   node scripts/eval-acceptance.js --live             # spawn claude (costs tokens)
 *   node scripts/eval-acceptance.js --skill prime      # single skill
 *   node scripts/eval-acceptance.js --runs 3
 *   node scripts/eval-acceptance.js --max-turns 5
 *   node scripts/eval-acceptance.js --plugin-dir <path>
 *
 * Plugin namespace: prompts may match bare skill name OR `adlc-flow:<skill>`.
 */
'use strict';

const { spawnSync, execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const opt = (flag, dflt) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : dflt;
};
const has = (flag) => args.includes(flag);

const PROMPTS_DIR = 'tests/skill-triggering/prompts';
const LOGS_DIR = 'tests/skill-triggering/logs';
const SKILL_FILTER = opt('--skill', null);
const NUM_RUNS = parseInt(opt('--runs', '3'), 10);
const MAX_TURNS = parseInt(opt('--max-turns', '5'), 10);
const PLUGIN_DIR = opt('--plugin-dir', process.env.ADLC_FLOW_PLUGIN_DIR || '');
const LIVE = has('--live');
const TODAY = opt('--date', new Date().toISOString().slice(0, 10));
const OUT_REPORT = opt('--out', `docs/audit/eval-acceptance-${TODAY}.md`);

function sh(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim(); }
  catch { return ''; }
}

function getClaudeVersion() {
  return sh('claude --version') || '_(claude CLI not found in PATH)_';
}

function listPrompts() {
  if (!fs.existsSync(PROMPTS_DIR)) return [];
  return fs.readdirSync(PROMPTS_DIR)
    .filter(f => f.endsWith('.txt'))
    .map(f => ({ skill: f.replace(/\.txt$/, ''), file: path.join(PROMPTS_DIR, f) }))
    .filter(p => !SKILL_FILTER || p.skill === SKILL_FILTER);
}

function buildClaudeArgs(prompt) {
  const a = ['-p', prompt, '--dangerously-skip-permissions', '--max-turns', String(MAX_TURNS), '--output-format', 'stream-json'];
  if (PLUGIN_DIR) a.push('--plugin-dir', PLUGIN_DIR);
  return a;
}

function runOnce(skill, prompt, runIdx, runDir) {
  const logFile = path.join(runDir, `run-${runIdx}.json`);
  const errFile = path.join(runDir, `run-${runIdx}.stderr`);

  if (!LIVE) {
    fs.writeFileSync(logFile, JSON.stringify({ dry_run: true, skill, runIdx, prompt_chars: prompt.length }, null, 2));
    return { passed: false, reason: 'dry-run (default; pass --live to spawn claude)', logFile };
  }

  const result = spawnSync('claude', buildClaudeArgs(prompt), {
    encoding: 'utf8', timeout: 5 * 60 * 1000, maxBuffer: 50 * 1024 * 1024,
  });
  fs.writeFileSync(logFile, result.stdout || '');
  if (result.stderr) fs.writeFileSync(errFile, result.stderr);

  if (result.error) return { passed: false, reason: `spawn error: ${result.error.message}`, logFile };
  if (result.status !== 0) return { passed: false, reason: `claude exit ${result.status}`, logFile };

  const transcript = result.stdout || '';
  const skillToolInvoked = /"name":"Skill"/.test(transcript);
  const skillNameRe = new RegExp(`"skill":"(?:adlc-flow:)?${skill}"`);
  const targetSkillTriggered = skillNameRe.test(transcript);
  const passed = skillToolInvoked && targetSkillTriggered;

  return {
    passed,
    reason: passed ? 'matched' : `Skill-tool=${skillToolInvoked} target-match=${targetSkillTriggered}`,
    logFile,
  };
}

function evalSkill(skill, file, ts) {
  const prompt = fs.readFileSync(file, 'utf8').trim();
  const runDir = path.join(LOGS_DIR, ts, skill);
  fs.mkdirSync(runDir, { recursive: true });

  const runs = [];
  for (let i = 1; i <= NUM_RUNS; i++) {
    process.stdout.write(`  run ${i}/${NUM_RUNS}... `);
    const r = runOnce(skill, prompt, i, runDir);
    runs.push(r);
    process.stdout.write(`${r.passed ? 'PASS' : LIVE ? 'FAIL' : 'DRY'} (${r.reason})\n`);
  }

  const passes = runs.filter(r => r.passed).length;
  const verdict = LIVE ? (passes >= Math.ceil(NUM_RUNS * 2 / 3) ? 'PASS' : 'FAIL') : 'DRY';
  return { skill, runs, passes, verdict };
}

function renderReport({ results, ts, claudeVersion }) {
  const quorum = Math.ceil(NUM_RUNS * 2 / 3);
  const lines = [
    '---',
    'owner: Tech Lead (Aldian Rizki)',
    `last_updated: ${TODAY}`,
    'update_trigger: Re-run acceptance harness',
    'status: current',
    `mode: ${LIVE ? 'live' : 'dry-run (default — pass --live to spawn claude)'}`,
    '---',
    '',
    `# Skill-Triggering Acceptance Eval — ${TODAY}`,
    '',
    `> Source: \`scripts/eval-acceptance.js\``,
    `> Mode: **${LIVE ? 'LIVE — claude CLI invoked, tokens spent' : 'DRY RUN — plan only, $0 cost. Pass --live for real verification.'}**`,
    `> Pass rule: stream-json contains \`"name":"Skill"\` AND target skill name; ≥${quorum}/${NUM_RUNS} runs.`,
    `> Run timestamp: \`${ts}\` · claude version: \`${claudeVersion}\``,
    '',
    '## Summary',
    '',
    `- Prompts evaluated: **${results.length}**`,
    `- Pass: **${results.filter(r => r.verdict === 'PASS').length}**`,
    `- Fail: **${results.filter(r => r.verdict === 'FAIL').length}**`,
    `- Dry: **${results.filter(r => r.verdict === 'DRY').length}**`,
    '',
    '## Per-Skill Results',
    '',
  ];

  if (results.length === 0) {
    lines.push('_No prompts found under `tests/skill-triggering/prompts/`._');
  } else {
    lines.push('| Skill | Runs | Passes | Verdict | Log dir |');
    lines.push('|:------|-----:|-------:|:--------|:--------|');
    for (const r of results) {
      lines.push(`| \`${r.skill}\` | ${r.runs.length} | ${r.passes} | **${r.verdict}** | \`${LOGS_DIR}/${ts}/${r.skill}/\` |`);
    }
  }

  lines.push('', '## Per-Run Detail', '');
  for (const r of results) {
    lines.push(`### \`${r.skill}\``);
    lines.push('');
    for (let i = 0; i < r.runs.length; i++) {
      const run = r.runs[i];
      lines.push(`- run ${i + 1}: **${run.passed ? 'PASS' : LIVE ? 'FAIL' : 'DRY'}** — ${run.reason} (\`${run.logFile}\`)`);
    }
    lines.push('');
  }

  lines.push('## Operator Notes', '');
  lines.push('- Re-run dry: `node scripts/eval-acceptance.js [--skill <name>] [--runs N]`');
  lines.push('- Re-run live (costs tokens): `node scripts/eval-acceptance.js --live`');
  lines.push('- Logs: `tests/skill-triggering/logs/<timestamp>/<skill>/run-N.json` (gitignored).');
  lines.push('- Cost-safety contract: DRY RUN is default. `--live` is opt-in only. Matches SessionStart `ADLC_GRAPHIFY_AUTO_UPDATE=1` pattern.');
  lines.push('- Cadence: live runs are operator-initiated, not scheduled. Run after material description edits OR before each minor-version ship.');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const prompts = listPrompts();
  if (prompts.length === 0) {
    console.error(`No prompts found under ${PROMPTS_DIR}/. Add <skill>.txt files there.`);
    process.exit(1);
  }
  console.log(`eval-acceptance: ${prompts.length} prompt(s) · ${NUM_RUNS} runs each · max-turns ${MAX_TURNS} · mode=${LIVE ? 'LIVE' : 'DRY'}`);

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const claudeVersion = LIVE ? getClaudeVersion() : '_(dry-run; not invoked)_';
  fs.mkdirSync(LOGS_DIR, { recursive: true });

  const results = [];
  for (const p of prompts) {
    console.log(`\n[${p.skill}]`);
    results.push(evalSkill(p.skill, p.file, ts));
  }

  const report = renderReport({ results, ts, claudeVersion });
  fs.mkdirSync(path.dirname(OUT_REPORT), { recursive: true });
  fs.writeFileSync(OUT_REPORT, report);

  const passCount = results.filter(r => r.verdict === 'PASS').length;
  const failCount = results.filter(r => r.verdict === 'FAIL').length;
  const dryCount = results.filter(r => r.verdict === 'DRY').length;
  console.log(`\nReport: ${OUT_REPORT}`);
  console.log(`pass=${passCount} fail=${failCount} dry=${dryCount} of ${results.length} skills`);
  if (LIVE && failCount > 0) process.exit(1);
}

main();
