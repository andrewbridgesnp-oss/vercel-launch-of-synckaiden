import test from 'node:test';
import assert from 'node:assert/strict';
import { TIER_ORDER, tierRank, hasTierAccess } from '../src/lib/tiers.js';

test('tierRank returns an ordered index', () => {
  assert.equal(tierRank(TIER_ORDER[0]), 0);
  assert.equal(tierRank(TIER_ORDER[1]), 1);
  assert.equal(tierRank('unknown'), 0);
});

test('hasTierAccess enforces upgrade path', () => {
  assert.ok(hasTierAccess('Empire Sync', 'Starter Sync'));
  assert.ok(!hasTierAccess('Starter Sync', 'Operator Sync'));
  assert.ok(hasTierAccess('Operator Sync', 'Builder Sync'));
});
