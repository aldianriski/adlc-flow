// scripts/eval-skills.js
// Structural eval harness for adlc-flow skills.
// Mirrors dev-flow's eval-skills.js (per ADR-001 pattern reuse) but
// adapted for adlc-flow paths. Exit non-zero on violation.
// Runnable: `node scripts/eval-skills.js`
'use strict';

const { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } = require('fs');
const { join, dirname } = require('path');

const SKILLS_DIR = 'skills';
const AGENTS_DIR = 'agents';
const OUT_MD = 'docs/audit/skill-eval-report.md';
const SKILL_LINE_CAP = 100;
const AGENT_LINE_CAP = 30;
const DESC_CHAR_CAP = 1024;

function read(p) { return readFileSync(p, 'utf8').replace(/\r\n/g, '\n'); }

function parseFrontmatter(s) {
  const m = s.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return fm;
}

const SKILL_RULES = [
  { id: 'R1', desc: 'frontmatter present',                  check: (c) => parseFrontmatter(c) !== null },
  { id: 'R2', desc: 'name field present',                   check: (c) => !!parseFrontmatter(c)?.name },
  { id: 'R3', desc: 'description field present',            check: (c) => !!parseFrontmatter(c)?.description },
  { id: 'R4', desc: 'description starts with "Use when"',   check: (c) => parseFrontmatter(c)?.description?.startsWith('Use when') },
  { id: 'R5', desc: `description <= ${DESC_CHAR_CAP} chars`, check: (c) => (parseFrontmatter(c)?.description?.length || 0) <= DESC_CHAR_CAP },
  { id: 'R6', desc: `SKILL.md <= ${SKILL_LINE_CAP} lines`,   check: (c) => c.split('\n').length <= SKILL_LINE_CAP },
  { id: 'R7', desc: 'has "## Red Flags" section',           check: (c) => /^##\s+Red Flags/m.test(c) },
];

const AGENT_RULES = [
  { id: 'A1', desc: 'frontmatter present',                  check: (c) => parseFrontmatter(c) !== null },
  { id: 'A2', desc: 'name field present',                   check: (c) => !!parseFrontmatter(c)?.name },
  { id: 'A3', desc: 'description field present',            check: (c) => !!parseFrontmatter(c)?.description },
  { id: 'A4', desc: `agent <= ${AGENT_LINE_CAP} lines`,     check: (c) => c.split('\n').length <= AGENT_LINE_CAP },
];

function evaluate(name, content, rules) {
  const violations = [];
  for (const r of rules) {
    let pass = false;
    try { pass = !!r.check(content); } catch { pass = false; }
    if (!pass) violations.push({ id: r.id, desc: r.desc });
  }
  return { name, violations, lines: content.split('\n').length };
}

function scan(dir, fileName, rules) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (fileName) {
      if (!ent.isDirectory()) continue;
      const p = join(dir, ent.name, fileName);
      if (!existsSync(p)) continue;
      results.push(evaluate(ent.name, read(p), rules));
    } else {
      if (!ent.isFile() || !ent.name.endsWith('.md')) continue;
      const p = join(dir, ent.name);
      results.push(evaluate(ent.name.replace(/\.md$/, ''), read(p), rules));
    }
  }
  return results;
}

const skillResults = scan(SKILLS_DIR, 'SKILL.md', SKILL_RULES);
const agentResults = scan(AGENTS_DIR, null, AGENT_RULES);
const all = [...skillResults, ...agentResults];
const totalViolations = all.reduce((n, r) => n + r.violations.length, 0);
const withViolations = all.filter((r) => r.violations.length > 0);

// ─── Report ──────────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const md = [
  '---',
  'owner: Tech Lead (Aldian Rizki)',
  `last_updated: ${today}`,
  'purpose: structural eval of skills + agents (line caps, frontmatter, red flags)',
  'status: current',
  'generator: scripts/eval-skills.js',
  '---',
  '',
  '# adlc-flow — Skill + Agent Eval Report',
  '',
  `**Skills evaluated:** ${skillResults.length}`,
  `**Agents evaluated:** ${agentResults.length}`,
  `**Total violations:** ${totalViolations}`,
  `**Components with violations:** ${withViolations.length}`,
  '',
];

if (withViolations.length === 0) {
  md.push('All components pass structural rules.');
} else {
  md.push('## Violations');
  md.push('');
  for (const r of withViolations) {
    md.push(`### ${r.name} (${r.lines} lines)`);
    for (const v of r.violations) {
      md.push(`- ${v.id}: ${v.desc}`);
    }
    md.push('');
  }
}

mkdirSync(dirname(OUT_MD), { recursive: true });
writeFileSync(OUT_MD, md.join('\n'), 'utf8');

console.log(`Skills: ${skillResults.length} · Agents: ${agentResults.length} · Violations: ${totalViolations}`);
console.log(`Report: ${OUT_MD}`);

if (totalViolations > 0) {
  console.error('FAIL: structural violations found.');
  process.exit(1);
}
