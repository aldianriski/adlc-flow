#!/usr/bin/env node
// bin/adlc-flow-init.js — scaffolds adlc-flow artifact files into a target repo.
// Node >=18, no deps. Invoke: node bin/adlc-flow-init.js [--enable]
//
// v2.8.0 fixes (Trial 5 friction log F8.1-F8.6):
//   F8.1 — Detect existing docs/DECISIONS.md (single-file ADR convention)
//          or docs/adr/ · skip the .gitkeep + write POINTER.md instead.
//   F8.3 — Inspect adopter's .claude/settings.json · emit ✓/⚠ status ·
//          --enable flag patches enabledPlugins automatically.
//   F8.4 — Detect existing TODO.md + CHANGELOG.md · emit compat note
//          pointing to docs/SPRINT-CONVENTION-COMPAT.md.
//   F8.5 — Conditional next-steps message based on what was actually
//          WRITE vs SKIP (don't suggest customizing files that exist).
//   F8.6 — Post-run commit-policy guidance ("commit these adopter
//          artifacts · they're project records, not generated output").
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const TARGET = process.cwd();
const ENABLE_FLAG = process.argv.includes('--enable');

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
// F8.1: docs/adr is conditional — skipped if existing DECISIONS.md/decisions/ detected.
const EMPTY_DIRS = ['GOLDEN-DATASET', 'EVAL-SUITE'];

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
    return { wrote: false, skipped: true };
  }
  if (!exists(src)) {
    console.log(`MISS  ${srcRel} (template missing in plugin install)`);
    return { wrote: false, skipped: false };
  }
  const content = read(src).replace(/YYYY-MM-DD/g, new Date().toISOString().slice(0, 10));
  write(dest, content);
  console.log(`WRITE ${destRel}`);
  return { wrote: true, skipped: false };
}

function ensureEmptyDir(rel) {
  const dir = path.join(TARGET, rel);
  const gitkeep = path.join(dir, '.gitkeep');
  if (exists(gitkeep)) {
    console.log(`SKIP  ${rel}/.gitkeep (exists)`);
    return { wrote: false };
  }
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(gitkeep, '', 'utf8');
  console.log(`WRITE ${rel}/.gitkeep`);
  return { wrote: true };
}

// ─── F8.1: detect existing ADR convention ────────────────────────────────────
function detectAdrConvention() {
  const decisionsMd = path.join(TARGET, 'docs/DECISIONS.md');
  const decisionsLowerMd = path.join(TARGET, 'docs/decisions.md');
  const adrDir = path.join(TARGET, 'docs/adr');
  const decisionsDir = path.join(TARGET, 'docs/decisions');

  if (exists(decisionsMd)) {
    return { kind: 'single-file', path: 'docs/DECISIONS.md' };
  }
  if (exists(decisionsLowerMd)) {
    return { kind: 'single-file', path: 'docs/decisions.md' };
  }
  if (exists(adrDir) && fs.readdirSync(adrDir).filter((f) => f.endsWith('.md') && f !== '.gitkeep').length > 0) {
    return { kind: 'multi-file', path: 'docs/adr/' };
  }
  if (exists(decisionsDir) && fs.readdirSync(decisionsDir).filter((f) => f.endsWith('.md') && f !== '.gitkeep').length > 0) {
    return { kind: 'multi-file', path: 'docs/decisions/' };
  }
  return { kind: 'none', path: null };
}

function scaffoldAdrSurface() {
  const adr = detectAdrConvention();
  const adrDir = path.join(TARGET, 'docs/adr');

  if (adr.kind === 'single-file') {
    // F8.1 — single-file convention exists (e.g. docs/DECISIONS.md).
    // Write a POINTER.md sentinel in docs/adr/ rather than .gitkeep, so
    // future readers see the redirect immediately + `/adr-writer` skill
    // doesn't accidentally scaffold loose ADR-NNN.md files here.
    fs.mkdirSync(adrDir, { recursive: true });
    const pointerPath = path.join(adrDir, 'POINTER.md');
    if (!exists(pointerPath)) {
      const pointerContent = `# ADRs live in \`${adr.path}\`

This \`docs/adr/\` directory exists only as a sentinel — your project's
architectural decisions are recorded in **\`${adr.path}\`** following an
existing single-file ADR convention detected by \`adlc-flow init\`.

## For adlc-flow's \`/adr-writer\` skill

The skill detects this convention at write-time and appends new ADRs to
\`${adr.path}\` rather than scaffolding loose files here. Do not move
ADRs into this directory.

## Why this pointer file exists

\`bin/adlc-flow-init.js\` v2.8.0 detected an existing single-file ADR
convention and wrote this POINTER.md instead of an empty \`.gitkeep\`.
This prevents reviewers asking "why are there two ADR locations?"

Remove this file if you migrate to a multi-file convention in
\`docs/adr/<NNN>.md\` shape.
`;
      write(pointerPath, pointerContent);
      console.log(`WRITE docs/adr/POINTER.md (redirect to existing ${adr.path})`);
    } else {
      console.log(`SKIP  docs/adr/POINTER.md (exists)`);
    }
    return { adrSurface: 'pointer', convention: adr };
  }

  if (adr.kind === 'multi-file' && adr.path !== 'docs/adr/') {
    // Existing multi-file convention at non-standard path · write a POINTER too.
    fs.mkdirSync(adrDir, { recursive: true });
    const pointerPath = path.join(adrDir, 'POINTER.md');
    if (!exists(pointerPath)) {
      write(pointerPath, `# ADRs live in \`${adr.path}\`\n\nMulti-file ADR convention detected at \`${adr.path}\`. \`/adr-writer\` will append there.\n`);
      console.log(`WRITE docs/adr/POINTER.md (redirect to existing ${adr.path})`);
    }
    return { adrSurface: 'pointer', convention: adr };
  }

  // No existing convention — scaffold the standard docs/adr/.gitkeep.
  ensureEmptyDir('docs/adr');
  return { adrSurface: 'gitkeep', convention: adr };
}

// ─── F8.3: detect + optionally patch .claude/settings.json plugin enable ──────
function checkPluginEnabled() {
  const settingsPath = path.join(TARGET, '.claude/settings.json');
  if (!exists(settingsPath)) {
    return { state: 'no-settings', enabled: false };
  }
  let settings;
  try {
    settings = JSON.parse(read(settingsPath));
  } catch {
    return { state: 'parse-error', enabled: false };
  }
  const enabledPlugins = settings.enabledPlugins ?? {};
  const enabled = enabledPlugins['adlc-flow'] === true;
  return { state: enabled ? 'enabled' : 'disabled', enabled, settingsPath, settings };
}

function enablePlugin(check) {
  if (check.state === 'no-settings') {
    // Create a minimal settings.json with adlc-flow enabled.
    const settingsPath = path.join(TARGET, '.claude/settings.json');
    const content = JSON.stringify({ enabledPlugins: { 'adlc-flow': true } }, null, 2) + '\n';
    write(settingsPath, content);
    console.log(`WRITE .claude/settings.json (NEW · adlc-flow enabled)`);
    return true;
  }
  if (check.state === 'parse-error') {
    console.log(`⚠ .claude/settings.json exists but is not valid JSON · skipping --enable`);
    return false;
  }
  if (check.enabled) {
    console.log(`✓ adlc-flow already enabled in .claude/settings.json`);
    return true;
  }
  // Patch existing settings.json.
  const updated = { ...check.settings, enabledPlugins: { ...(check.settings.enabledPlugins ?? {}), 'adlc-flow': true } };
  fs.writeFileSync(check.settingsPath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
  console.log(`MODIFY .claude/settings.json (adlc-flow now enabled)`);
  return true;
}

// ─── F8.4: detect existing TODO.md / CHANGELOG.md conventions ─────────────────
function detectExistingConventions() {
  const findings = [];
  const todoPath = path.join(TARGET, 'TODO.md');
  const changelogPath = path.join(TARGET, 'CHANGELOG.md');
  const docsChangelogPath = path.join(TARGET, 'docs/CHANGELOG.md');

  if (exists(todoPath)) {
    const size = fs.statSync(todoPath).size;
    findings.push({ kind: 'todo', path: 'TODO.md', size });
  }
  if (exists(changelogPath)) {
    const size = fs.statSync(changelogPath).size;
    findings.push({ kind: 'changelog', path: 'CHANGELOG.md', size });
  }
  if (exists(docsChangelogPath)) {
    const size = fs.statSync(docsChangelogPath).size;
    findings.push({ kind: 'changelog', path: 'docs/CHANGELOG.md', size });
  }
  return findings;
}

// ─── Run ─────────────────────────────────────────────────────────────────────
console.log(`adlc-flow init → ${TARGET}`);
console.log('');

const fileResults = [];
for (const f of FILES) {
  const r = copyTemplate(f.src, f.dest);
  fileResults.push({ ...f, ...r });
}
for (const d of EMPTY_DIRS) {
  ensureEmptyDir(d);
}

// F8.1: ADR convention detection + conditional scaffold
const adrInfo = scaffoldAdrSurface();

console.log('');
const writeCount = fileResults.filter((r) => r.wrote).length;
const skipCount = fileResults.filter((r) => r.skipped).length;
console.log(`Done. ${writeCount} files written · ${skipCount} skipped · ${EMPTY_DIRS.length} core dirs scaffolded · ADR surface: ${adrInfo.adrSurface}.`);

// ─── F8.3: plugin enable status check ────────────────────────────────────────
console.log('');
console.log('─── Plugin enable status ──────────────────────────────────────────');
const pluginCheck = checkPluginEnabled();
if (ENABLE_FLAG) {
  enablePlugin(pluginCheck);
} else {
  switch (pluginCheck.state) {
    case 'enabled':
      console.log('✓ adlc-flow is enabled in .claude/settings.json');
      break;
    case 'disabled':
      console.log('⚠ adlc-flow is NOT enabled in .claude/settings.json');
      console.log('  To enable: re-run with --enable, OR add this to .claude/settings.json:');
      console.log('    "enabledPlugins": { "adlc-flow": true }');
      break;
    case 'no-settings':
      console.log('⚠ .claude/settings.json does not exist yet');
      console.log('  To enable: re-run with --enable to create + enable in one step');
      break;
    case 'parse-error':
      console.log('⚠ .claude/settings.json exists but cannot be parsed as JSON');
      break;
  }
}

// ─── F8.4: existing conventions compatibility notice ─────────────────────────
const conventions = detectExistingConventions();
if (conventions.length > 0) {
  console.log('');
  console.log('─── Existing conventions detected ──────────────────────────────');
  for (const c of conventions) {
    const sizeKb = (c.size / 1024).toFixed(1);
    console.log(`  ℹ ${c.path} (${sizeKb}KB) — preserved`);
  }
  console.log('');
  console.log("  These coexist with adlc-flow's universal sprint protocol.");
  console.log('  See docs/SPRINT-CONVENTION-COMPAT.md (in the adlc-flow repo)');
  console.log('  for guidance on whether to migrate or keep dual conventions.');
}

if (adrInfo.adrSurface === 'pointer') {
  console.log('');
  console.log(`  ℹ Detected existing ADR convention at ${adrInfo.convention.path}`);
  console.log("    docs/adr/POINTER.md written as sentinel. /adr-writer skill");
  console.log("    will respect your existing convention at write-time.");
}

// ─── F8.5: conditional next-steps message (based on what was actually written) ─
console.log('');
console.log('─── Next steps ──────────────────────────────────────────────────');
let stepNum = 1;
const claudeMdResult = fileResults.find((r) => r.dest === '.claude/CLAUDE.md');
if (claudeMdResult?.wrote) {
  console.log(`  ${stepNum++}. Customize .claude/CLAUDE.md — fill in [Project Name] · stack · anti-patterns`);
}
if (!pluginCheck.enabled && !ENABLE_FLAG) {
  console.log(`  ${stepNum++}. Enable adlc-flow: re-run \`node bin/adlc-flow-init.js --enable\` OR edit .claude/settings.json`);
}
console.log(`  ${stepNum++}. Run /adlc-orchestrator discover "<business pain point>" to fill HYPOTHESIS.md`);
console.log(`  ${stepNum++}. (Optional but recommended) install graphify for knowledge-graph backend:`);
console.log('       pip install graphifyy && graphify install && graphify .');

// ─── F8.6: commit-policy guidance ─────────────────────────────────────────────
const adopterArtifactsWritten = fileResults.filter((r) => r.wrote && r.dest !== '.claude/CLAUDE.md').length;
if (adopterArtifactsWritten > 0 || writeCount > 0) {
  console.log('');
  console.log('─── Commit policy ────────────────────────────────────────────────');
  console.log('  ℹ The root-level artifacts (HYPOTHESIS.md · RESPONSIBILITY-MAP.md ·');
  console.log('    FEEDBACK-LOG.md · MODEL-UPGRADE-LOG.md · OBSERVABILITY.md ·');
  console.log('    COST-BUDGET.md) are PROJECT RECORDS, not machine-generated.');
  console.log('    Commit them to git:');
  console.log('');
  console.log('      git add HYPOTHESIS.md RESPONSIBILITY-MAP.md FEEDBACK-LOG.md \\');
  console.log('              MODEL-UPGRADE-LOG.md OBSERVABILITY.md COST-BUDGET.md \\');
  console.log('              GOLDEN-DATASET/ EVAL-SUITE/ docs/adr/');
  console.log('');
  console.log('    These contain your hypotheses · authority maps · cost budgets');
  console.log('    · observability schemas. They evolve with the agentic features.');
  console.log('    Do NOT add them to .gitignore — they are NOT plugin output.');
}
