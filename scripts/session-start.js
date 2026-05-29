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

// Required-doc registry — single source of truth (doc-registry.json + ADR-010).
// session-start ships inside the plugin, so resolve the registry relative to __dirname.
// Fall back to a built-in list if the registry is missing/unreadable.
let registryDocs;
try {
  registryDocs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'doc-registry.json'), 'utf8')).docs;
} catch (e) {
  registryDocs = [
    { path: 'HYPOTHESIS.md',         kind: 'file', tier: 'agentic', purpose: 'P0 hypothesis register' },
    { path: 'RESPONSIBILITY-MAP.md', kind: 'file', tier: 'agentic', purpose: 'P1 human-agent grid' },
    { path: 'FEEDBACK-LOG.md',       kind: 'file', tier: 'agentic', purpose: 'P7 feedback loop' },
    { path: 'MODEL-UPGRADE-LOG.md',  kind: 'file', tier: 'agentic', purpose: 'P7 MG-gate history' },
    { path: 'OBSERVABILITY.md',      kind: 'file', tier: 'agentic', purpose: 'P6/P7 schema' },
    { path: 'COST-BUDGET.md',        kind: 'file', tier: 'agentic', purpose: 'cross-phase budget' },
    { path: 'GOLDEN-DATASET/',       kind: 'dir',  tier: 'agentic', purpose: 'P3 ground-truth corpus' },
  ];
}
// session-start warns only on agentic-tier artifacts (always-tier core docs are validated elsewhere).
const artifacts = registryDocs.filter(d => d.tier === 'agentic');

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
  const rel = a.path || a.name;
  const isDir = a.kind === 'dir';
  const p = path.join(root, rel);
  const exists = fs.existsSync(p) && (!isDir || fs.statSync(p).isDirectory());
  if (exists) {
    let note = a.purpose;
    if (isDir) {
      const features = fs.readdirSync(p, { withFileTypes: true }).filter(d => d.isDirectory()).length;
      note = `${a.purpose} · ${features} feature(s)`;
    }
    console.log(`[OK] ${rel.padEnd(26)} (${note})`);
  } else {
    missing.push(rel);
  }
}

if (missing.length > 0) {
  console.log('');
  console.log(`[WARN] Missing agentic-lifecycle artifacts: ${missing.join(', ')}`);
  console.log('       Needed ONLY when building an LLM-core feature (not for traditional/daily work).');
  console.log('       Scaffold: /orchestrator init  ·  or check/handoff via /lean-doc-generator (doc-registry.json · ADR-010)');
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
      console.log(`     stale > ${staleDays}d — \`/graphify . --update\` (skill · subscription · code-only = $0) or \`graphify update .\` (CLI · AST-only · $0). Full \`/graphify .\` rebuilds the semantic pass on your subscription (no API key). Set ADLC_GRAPHIFY_AUTO_UPDATE=1 to auto-run update on session start.`);
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
