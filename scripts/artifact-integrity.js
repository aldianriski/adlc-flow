#!/usr/bin/env node
// scripts/artifact-integrity.js
// adlc-flow PostToolUse hook (cross-platform replacement for artifact-integrity.ps1).
// When a canonical ADLC artifact is edited, verifies `last_updated` frontmatter is current.
// Warn-only — never blocks the tool call.
// Node >=18, no deps.

'use strict';

const fs = require('fs');
const path = require('path');

const CANONICAL = new Set([
  'HYPOTHESIS.md',
  'RESPONSIBILITY-MAP.md',
  'FEEDBACK-LOG.md',
  'MODEL-UPGRADE-LOG.md',
  'OBSERVABILITY.md',
  'COST-BUDGET.md',
]);

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    if (process.stdin.isTTY) resolve('');
  });
}

(async () => {
  const raw = await readStdin();
  if (!raw) process.exit(0);

  let data;
  try { data = JSON.parse(raw); } catch { process.exit(0); }

  const filePath = data?.tool_input?.file_path;
  if (!filePath) process.exit(0);

  const leaf = path.basename(filePath);
  if (!CANONICAL.has(leaf)) process.exit(0);
  if (!fs.existsSync(filePath)) process.exit(0);

  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); } catch { process.exit(0); }

  const m = content.match(/^last_updated:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/m);
  const today = new Date().toISOString().slice(0, 10);

  if (m) {
    const stamp = m[1];
    if (stamp !== today) {
      console.log(`[adlc-flow] integrity: '${leaf}' last_updated=${stamp} != today=${today}`);
      console.log(`[adlc-flow]            consider updating frontmatter before commit`);
    }
  } else {
    console.log(`[adlc-flow] integrity: '${leaf}' has no last_updated frontmatter field`);
  }

  process.exit(0);
})();
