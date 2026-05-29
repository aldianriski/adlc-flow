// tests/unit/init.test.js
// Behavioral test for bin/adlc-flow-init.js: scaffolds canonical artifacts into
// the TARGET (cwd), is idempotent on re-run, and never writes into the plugin repo.
// Run: node --test tests/unit
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const INIT = path.join(REPO, 'bin', 'adlc-flow-init.js');

function tmp() { return fs.mkdtempSync(path.join(os.tmpdir(), 'adlc-init-')); }
function run(cwd) { return spawnSync('node', [INIT], { encoding: 'utf8', cwd }); }

test('scaffolds canonical artifacts into the target dir', () => {
  const d = tmp();
  const r = run(d);
  assert.equal(r.status, 0, r.stderr);
  for (const f of ['HYPOTHESIS.md', 'RESPONSIBILITY-MAP.md', 'COST-BUDGET.md', '.claude/CLAUDE.md']) {
    assert.ok(fs.existsSync(path.join(d, f)), `expected ${f} written`);
  }
  assert.ok(fs.existsSync(path.join(d, 'GOLDEN-DATASET', '.gitkeep')), 'GOLDEN-DATASET/.gitkeep');
  assert.match(r.stdout, /WRITE/);
  fs.rmSync(d, { recursive: true, force: true });
});

test('is idempotent — a second run skips existing files', () => {
  const d = tmp();
  run(d);
  const r2 = run(d);
  assert.equal(r2.status, 0, r2.stderr);
  assert.match(r2.stdout, /SKIP/);
  assert.doesNotMatch(r2.stdout, /WRITE \.claude\/CLAUDE\.md/); // not overwritten
  fs.rmSync(d, { recursive: true, force: true });
});

test('does not scaffold into the plugin repo itself', () => {
  const d = tmp();
  const before = fs.existsSync(path.join(REPO, 'HYPOTHESIS.md'));
  run(d);
  const after = fs.existsSync(path.join(REPO, 'HYPOTHESIS.md'));
  assert.equal(after, before, 'plugin repo HYPOTHESIS.md presence must be unchanged');
  fs.rmSync(d, { recursive: true, force: true });
});
