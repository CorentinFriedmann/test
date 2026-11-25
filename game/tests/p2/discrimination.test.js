// T-032: does the rule discriminate? (GDD 13, Boss thresholds: follower wins >= 90 %, ignorer loses >= 90 %.)
// The honest variants (win, heedless, silent) are reported but not asserted: see docs/qa/RAPPORT_P2.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadData } from '../../src/data/load.js';
import { SEEDS, playAll, summarize, playGame } from './lib.js';

const data = loadData();

test('20 distinct seeds', () => { assert.equal(new Set(SEEDS).size, 20); });

test('prudent (follows the rule) wins in at least 90 % of 20 games', () => {
  const s = summarize(playAll('prudent', SEEDS, data));
  assert.ok(s.winRate >= 0.9, `prudent wins ${s.wins}/20`);
});

test('noisy (ignores the rule) loses in at least 90 % of 20 games', () => {
  const s = summarize(playAll('noisy', SEEDS, data));
  assert.ok(s.lossRate >= 0.9, `noisy loses ${s.losses}/20`);
});

test('same seed, same game (determinism of the measures)', () => {
  assert.deepEqual(playGame(data, SEEDS[0], 'prudent'), playGame(data, SEEDS[0], 'prudent'));
});

test('game duration of the 40 reference games stays within the 480 s slice', () => {
  for (const mode of ['prudent', 'noisy']) for (const g of playAll(mode, SEEDS, data)) assert.ok(g.durationS > 0 && g.durationS <= 480.1, `${mode} ${g.seed}: ${g.durationS}`);
});
