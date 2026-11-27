// T-043 requirement (b) of the Boss: a slow human (reads the start screen, then leaves for ladder 1 at t = 30 s, or at t = 45 s)
// must still be able to read ladder 1 on at least 18 of 20 seeds, on both seed sets. If this fails, widen the S1 window in stations.csv.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadData } from '../../src/data/load.js';
import { SEEDS, SEEDS_VERIFY, playSlowStart } from './lib.js';

const data = loadData();
for (const departT of [30, 45]) {
  for (const [label, seeds] of [['101-120', SEEDS], ['201-220', SEEDS_VERIFY]]) {
    test(`slow start: leaving for ladder 1 at t = ${departT} s, seeds ${label}: ladder 1 read on at least 18 of 20 seeds`, () => {
      const r = seeds.map((s) => playSlowStart(data, s, departT));
      const ok = r.filter((x) => x.read).length;
      assert.ok(ok >= 18, `read on ${ok}/20 (failures: ${r.filter((x) => !x.read).map((x) => `${x.seed}:${x.cause}`).join(', ')})`);
    });
  }
}
test('slow start: same seed, same result (determinism)', () => {
  assert.deepEqual(playSlowStart(data, 101, 45), playSlowStart(data, 101, 45));
});
