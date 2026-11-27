// P2 gate (T-032, thresholds raised by T-037): does the rule discriminate, and is there fear before 100 s?
// Seeds 101-120 were used to tune game/data; seeds 201-220 were never used for tuning. Both sets must pass.
// These are measures of automata: they feel nothing. Only the owner can say whether the fear is there (questions 5 and 7).
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadData } from '../../src/data/load.js';
import { SEEDS, SEEDS_VERIFY, playAll, summarize, playGame, isWin } from './lib.js';

const data = loadData();
const SETS = { 'tuning 101-120': SEEDS, 'verification 201-220': SEEDS_VERIFY };

test('seed sets: 20 distinct seeds each, disjoint', () => {
  assert.equal(new Set(SEEDS).size, 20);
  assert.equal(new Set(SEEDS_VERIFY).size, 20);
  assert.equal(new Set([...SEEDS, ...SEEDS_VERIFY]).size, 40);
});

for (const [label, seeds] of Object.entries(SETS)) {
  const games = {};
  const get = (mode) => (games[mode] ??= playAll(mode, seeds, data));

  test(`[${label}] prudent (follows the rule) wins at least 90 % of games`, () => {
    const s = summarize(get('prudent'));
    assert.ok(s.winRate >= 0.9, `prudent wins ${s.wins}/20`);
  });

  test(`[${label}] prudent suffers at least one approach (Laisse under 15 m) before 100 s in at least 14 of 20 games`, () => {
    const n = get('prudent').filter((g) => g.approachesBeforeFear > 0).length;
    assert.ok(n >= 14, `approach before 100 s in ${n}/20 games`);
  });

  test(`[${label}] win and heedless (ignore the rule without hunting the Laisse) win at most 16 of 20 games (T-042 ceiling: no more lenient than measured)`, () => {
    for (const m of ['win', 'heedless']) { const s = summarize(get(m)); assert.ok(s.wins <= 16, `${m} wins ${s.wins}/20`); }
  });

  test(`[${label}] noisy (ignores the rule and hunts the Laisse) loses at least 90 % of games`, () => {
    const s = summarize(get('noisy'));
    assert.ok(s.lossRate >= 0.9, `noisy loses ${s.losses}/20`);
  });

  test(`[${label}] silent (slow walk) wins at least 80 % of games`, () => {
    const s = summarize(get('silent'));
    assert.ok(s.winRate >= 0.8, `silent wins ${s.wins}/20`);
  });

  test(`[${label}] a game played to the end (victory) lasts between 4 and 6 minutes`, () => {
    let wins = 0;
    for (const m of ['prudent', 'win', 'heedless', 'silent']) for (const g of get(m)) if (isWin(g)) { wins++; assert.ok(g.durationS >= 240 && g.durationS <= 360, `${m} ${g.seed}: ${g.durationS} s`); }
    assert.ok(wins > 0);
    for (const g of [...get('prudent'), ...get('noisy')]) assert.ok(g.durationS > 0 && g.durationS <= 300.1, `${g.mode} ${g.seed}: ${g.durationS}`);
  });
}

test('same seed, same game (determinism of the measures)', () => {
  assert.deepEqual(playGame(data, SEEDS[0], 'prudent'), playGame(data, SEEDS[0], 'prudent'));
});
