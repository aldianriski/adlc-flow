// tests/unit/session-start.test.js
// Behavioral test for the SessionStart hook: CLAUDE.md gate, registry-driven
// agentic-artifact warning, and tier filter (always-tier docs are NOT nagged).
// Run: node --test tests/unit
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const SCRIPT = path.join(REPO, 'scripts', 'session-start.js');

function tmp() { return fs.mkdtempSync(path.join(os.tmpdir(), 'adlc-ss-')); }
function run(projectDir) {
  return spawnSync('node', [SCRIPT], {
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir, ADLC_GRAPHIFY_AUTO_UPDATE: '' },
  });
}
function withClaudeMd(d) {
  fs.mkdirSync(path.join(d, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(d, '.claude', 'CLAUDE.md'), '# project');
}

test('exits 0 and confirms CLAUDE.md when present', () => {
  const d = tmp(); withClaudeMd(d);
  const r = run(d);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /\.claude\/CLAUDE\.md present/);
  fs.rmSync(d, { recursive: true, force: true });
});

test('exits 1 when CLAUDE.md missing', () => {
  const d = tmp();
  const r = run(d);
  assert.equal(r.status, 1);
  assert.match((r.stderr || '') + r.stdout, /CLAUDE\.md missing/);
  fs.rmSync(d, { recursive: true, force: true });
});

test('warns on agentic-tier artifacts but NOT always-tier docs (registry tier filter)', () => {
  const d = tmp(); withClaudeMd(d);
  const r = run(d);
  assert.match(r.stdout, /Missing agentic-lifecycle artifacts/);
  assert.match(r.stdout, /HYPOTHESIS\.md/);
  // README/CHANGELOG are tier:always — must never appear in the agentic-missing line.
  const warnLine = (r.stdout.split('\n').find(l => l.includes('Missing agentic-lifecycle')) || '');
  assert.doesNotMatch(warnLine, /README\.md|CHANGELOG\.md/);
  fs.rmSync(d, { recursive: true, force: true });
});
