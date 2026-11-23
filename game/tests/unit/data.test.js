import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseCsv } from '../../src/data/csv.js';
import { loadData, param } from '../../src/data/load.js';
import { RAW_CSV } from '../../src/data/generated.js';
import { data } from './helpers.js';

test('csv: parses header, quotes and empty cells', () => {
  const rows = parseCsv('a,b,c\n1,"x,y",\r\n2,z,w\n\n');
  assert.deepEqual(rows, [{ a: '1', b: 'x,y', c: '' }, { a: '2', b: 'z', c: 'w' }]);
});

test('data: stations carry grace_s (0 by default) and trends from the CSV', () => {
  assert.equal(data.stations.length, 3);
  assert.deepEqual(data.stations.map((s) => s.graceS), [0, 0, 0]);
  assert.deepEqual(data.stations.map((s) => s.requiredTrend), [1, 0, -1]);
});

test('data: sim step is 30 Hz and the seed comes from menace.csv', () => {
  assert.equal(Math.round(1 / param(data, 'sim_step')), 30);
  assert.equal(param(data, 'sim_seed'), 2026);
});

test('data: a missing parameter fails fast', () => {
  assert.throws(() => param(data, 'does_not_exist'), /missing parameter/);
  const broken = { ...RAW_CSV, maree: 't_s,level_m,trend,phase_id\n0,abc,1,x\n10,0,1,y\n' };
  assert.throws(() => loadData(broken), /invalid number/);
});

test('data: game/data copies match docs/design/data when the docs are present', () => {
  const docs = fileURLToPath(new URL('../../../docs/design/data/', import.meta.url));
  if (!existsSync(docs)) return;
  for (const n of ['maree', 'maree_effets', 'stations', 'menace']) {
    assert.equal(readFileSync(`${docs}${n}.csv`, 'utf8'), RAW_CSV[n], `${n}.csv differs: run npm run sync-data`);
  }
});
