// tests/unit/doc-registry.test.js
// Registry-integrity check (ADR-010): doc-registry.json must be well-formed and
// every owner must reference a real skill — prevents the drift ADR-010 flagged.
// Run: node --test tests/unit
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const REG = path.join(REPO, 'doc-registry.json');
const load = () => JSON.parse(fs.readFileSync(REG, 'utf8'));

test('doc-registry.json is valid JSON with expected shape', () => {
  const reg = load();
  assert.ok(Array.isArray(reg.docs) && reg.docs.length > 0, 'docs is a non-empty array');
  assert.ok(reg.tiers && reg.tiers.always && reg.tiers.agentic, 'tiers.always + tiers.agentic defined');
});

test('every doc entry has required fields + valid enums', () => {
  const validTier = new Set(['always', 'agentic']);
  const validKind = new Set(['file', 'dir']);
  for (const d of load().docs) {
    assert.ok(d.id, `entry missing id: ${JSON.stringify(d)}`);
    assert.ok(d.path, `${d.id} missing path`);
    assert.ok(d.owner, `${d.id} missing owner`);
    assert.ok(d.purpose, `${d.id} missing purpose`);
    assert.ok(validTier.has(d.tier), `${d.id} bad tier: ${d.tier}`);
    assert.ok(validKind.has(d.kind), `${d.id} bad kind: ${d.kind}`);
  }
});

test('no duplicate ids or paths', () => {
  const reg = load();
  const ids = reg.docs.map(d => d.id);
  const paths = reg.docs.map(d => d.path);
  assert.equal(new Set(ids).size, ids.length, 'ids must be unique');
  assert.equal(new Set(paths).size, paths.length, 'paths must be unique');
});

test('every owner references at least one real skill (no drift)', () => {
  const skills = new Set(
    fs.readdirSync(path.join(REPO, 'skills'), { withFileTypes: true })
      .filter(e => e.isDirectory()).map(e => e.name)
  );
  for (const d of load().docs) {
    const tokens = d.owner.match(/[a-z][a-z-]+/g) || [];
    const hit = tokens.some(t => skills.has(t));
    assert.ok(hit, `owner "${d.owner}" (${d.id}) maps to no real skill — tokens: ${tokens.join(', ')}`);
  }
});
