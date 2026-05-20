#!/usr/bin/env node
// bin/adlc-flow-init.js — scaffolds adlc-flow artifact files into a target repo.
// Node >=18, no deps. Invoke: node bin/adlc-flow-init.js
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const TARGET = process.cwd();

// Files scaffolded into adopter project. ADLC canonical artifacts per ADR-002.
// All marked [CUSTOMIZE] for adopter to fill in. Idempotent — skips existing files.
const FILES = [
  { src: 'templates/CLAUDE.md.template',              dest: '.claude/CLAUDE.md' },
  { src: 'templates/HYPOTHESIS.md.template',          dest: 'HYPOTHESIS.md' },
  { src: 'templates/RESPONSIBILITY-MAP.md.template',  dest: 'RESPONSIBILITY-MAP.md' },
  { src: 'templates/FEEDBACK-LOG.md.template',        dest: 'FEEDBACK-LOG.md' },
  { src: 'templates/MODEL-UPGRADE-LOG.md.template',   dest: 'MODEL-UPGRADE-LOG.md' },
  { src: 'templates/OBSERVABILITY.md.template',       dest: 'OBSERVABILITY.md' },
  { src: 'templates/COST-BUDGET.md.template',         dest: 'COST-BUDGET.md' },
];

// Empty dirs created with .gitkeep — populated by skills as they fire.
const EMPTY_DIRS = ['GOLDEN-DATASET', 'EVAL-SUITE', 'docs/adr'];

function exists(p) { return fs.existsSync(p); }
function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, c) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, 'utf8');
}

function copyTemplate(srcRel, destRel) {
  const src = path.join(REPO_ROOT, srcRel);
  const dest = path.join(TARGET, destRel);
  if (exists(dest)) {
    console.log(`SKIP  ${destRel} (exists — not overwriting)`);
    return false;
  }
  if (!exists(src)) {
    console.log(`MISS  ${srcRel} (template missing in plugin install)`);
    return false;
  }
  const content = read(src).replace(/YYYY-MM-DD/g, new Date().toISOString().slice(0, 10));
  write(dest, content);
  console.log(`WRITE ${destRel}`);
  return true;
}

function ensureEmptyDir(rel) {
  const dir = path.join(TARGET, rel);
  const gitkeep = path.join(dir, '.gitkeep');
  if (exists(gitkeep)) {
    console.log(`SKIP  ${rel}/.gitkeep (exists)`);
    return;
  }
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(gitkeep, '', 'utf8');
  console.log(`WRITE ${rel}/.gitkeep`);
}

// ─── Run ─────────────────────────────────────────────────────────────────────
console.log(`adlc-flow init → ${TARGET}`);
console.log('');

let wrote = 0;
for (const f of FILES) {
  if (copyTemplate(f.src, f.dest)) wrote++;
}
for (const d of EMPTY_DIRS) {
  ensureEmptyDir(d);
}

console.log('');
console.log(`Done. ${wrote} files written / ${EMPTY_DIRS.length} dirs scaffolded.`);
console.log('');
console.log('Next steps:');
console.log('  1. Customize .claude/CLAUDE.md — fill in [Project Name] · stack · anti-patterns');
console.log('  2. Run /adlc-orchestrator discover "<business pain point>" to fill HYPOTHESIS.md');
console.log('  3. (Optional but recommended) install graphify for knowledge-graph backend:');
console.log('     pip install graphifyy && graphify install && graphify .');
