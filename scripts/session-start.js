#!/usr/bin/env node
// scripts/session-start.js
// adlc-flow SessionStart hook (cross-platform replacement for session-start.ps1).
// Verifies .claude/CLAUDE.md (fail if missing) + scans for canonical artifacts (warn).
// Node >=18, no deps.
// Exit 1 = fail (CLAUDE.md missing); Exit 0 = ok or warnings only.

'use strict';

const fs = require('fs');
const path = require('path');

const started = Date.now();

let rootSource = 'CLAUDE_PROJECT_DIR';
let root = process.env.CLAUDE_PROJECT_DIR;
if (!root) {
  if (process.env.CLAUDE_PLUGIN_ROOT) {
    rootSource = 'CLAUDE_PLUGIN_ROOT';
    root = process.env.CLAUDE_PLUGIN_ROOT;
  } else {
    rootSource = 'CWD (fallback)';
    root = process.cwd();
  }
}

const claudeMd = path.join(root, '.claude', 'CLAUDE.md');

const artifacts = [
  { name: 'HYPOTHESIS.md',         purpose: 'P0 hypothesis register' },
  { name: 'RESPONSIBILITY-MAP.md', purpose: 'P1 human-agent grid' },
  { name: 'FEEDBACK-LOG.md',       purpose: 'P7 feedback loop' },
  { name: 'MODEL-UPGRADE-LOG.md',  purpose: 'P7 MG-gate history' },
  { name: 'OBSERVABILITY.md',      purpose: 'P6/P7 schema' },
  { name: 'COST-BUDGET.md',        purpose: 'cross-phase budget' },
];

console.log('=== adlc-flow SESSION START ===');
console.log('');

if (rootSource.startsWith('CWD')) {
  console.log(`[WARN] root resolved via ${rootSource} (CLAUDE_PROJECT_DIR + CLAUDE_PLUGIN_ROOT both unset)`);
}

if (!fs.existsSync(claudeMd)) {
  console.error(`FAIL: .claude/CLAUDE.md missing at '${claudeMd}' — cannot bootstrap adlc-flow session.`);
  process.exit(1);
}
console.log('[OK] .claude/CLAUDE.md present');

const missing = [];
for (const a of artifacts) {
  const p = path.join(root, a.name);
  if (fs.existsSync(p)) {
    console.log(`[OK] ${a.name.padEnd(26)} (${a.purpose})`);
  } else {
    missing.push(a.name);
  }
}

if (missing.length > 0) {
  console.log('');
  console.log(`[WARN] Missing canonical artifacts: ${missing.join(', ')}`);
  console.log('       Run: /adlc-orchestrator init    (or: node bin/adlc-flow-init.js)');
}

const gd = path.join(root, 'GOLDEN-DATASET');
if (fs.existsSync(gd) && fs.statSync(gd).isDirectory()) {
  const features = fs.readdirSync(gd, { withFileTypes: true }).filter(d => d.isDirectory()).length;
  console.log(`[OK] GOLDEN-DATASET/ present (${features} feature(s) tracked)`);
} else {
  console.log('[WARN] GOLDEN-DATASET/ missing — run /adlc-orchestrator init to scaffold');
}

const graphOut = path.join(root, 'graphify-out', 'graph.json');
const staleDaysRaw = process.env.ADLC_GRAPHIFY_STALE_DAYS;
const staleDays = staleDaysRaw !== undefined && staleDaysRaw !== '' ? Number(staleDaysRaw) : 7;
const autoUpdate = process.env.ADLC_GRAPHIFY_AUTO_UPDATE === '1';
if (fs.existsSync(graphOut)) {
  const stat = fs.statSync(graphOut);
  const ageDays = (Date.now() - stat.mtimeMs) / 86400000;
  console.log(`[OK] graphify-out/graph.json present (${ageDays.toFixed(1)}d old)`);
  if (ageDays > staleDays) {
    if (autoUpdate) {
      try {
        const { spawnSync } = require('child_process');
        const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['graphify'], { encoding: 'utf8' });
        if (which.status === 0) {
          console.log(`     ADLC_GRAPHIFY_AUTO_UPDATE=1 set; running \`graphify update .\` (AST-only, no LLM cost)…`);
          const res = spawnSync('graphify', ['update', root], { encoding: 'utf8', timeout: 120000 });
          if (res.status === 0) console.log('     [OK] graphify update complete');
          else console.log(`     [WARN] graphify update exited ${res.status} — run manually to inspect`);
        } else {
          console.log('     [WARN] ADLC_GRAPHIFY_AUTO_UPDATE=1 set but `graphify` not on PATH — skipping auto-update');
        }
      } catch (e) {
        console.log(`     [WARN] auto-update failed: ${e.message} — skipping`);
      }
    } else {
      console.log(`     stale > ${staleDays}d — \`graphify update .\` (no LLM) or \`graphify .\` (semantic, costs tokens). Set ADLC_GRAPHIFY_AUTO_UPDATE=1 to auto-run update on session start.`);
    }
  }
} else {
  console.log('[WARN] graphify-out/graph.json missing — /zoom-out · /context-engineer · /graph-query require graphify (ADR-005)');
  console.log('       install: uv tool install "graphifyy[mcp]" && graphify install && graphify .');
}

const elapsed = Date.now() - started;
console.log('');
console.log(`Elapsed: ${elapsed} ms`);
console.log('===============================');
process.exit(0);
