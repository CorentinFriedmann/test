// P2 gate (T-032): scripted players and measurements, run on the pure simulation under Node (no browser).
// Nothing here changes src/sim/: the players only read sim.state and return an input per tick.
import { loadData } from '../../src/data/load.js';
import { createSim, NEUTRAL_INPUT } from '../../src/sim/sim.js';
import { createBot } from '../../src/sim/bot.js';

export const SEEDS = Array.from({ length: 20 }, (_, i) => 101 + i); // tuning seeds (T-037): the values of game/data were set on these
export const SEEDS_VERIFY = Array.from({ length: 20 }, (_, i) => 201 + i); // verification seeds (T-037): never used for tuning
export const FEAR_WINDOW_S = 160; // GDD gap 6: beam charge falls under 20 % at 160 s (100 - 0.5 * 160)
export const NEAR_M = 15;         // "close to the player" threshold (T-032)
export const AUDIBLE_M = 45;      // threat_audible_radius (menace.csv): the Laisse can be heard under this distance
export const NEAR_EXIT_M = 20;    // hysteresis: an approach ends only above this distance
const MAX_TICKS = 20000;

/**
 * Players. Two are the reference pair of the task (src/sim/bot.js):
 *   prudent : follows the rule (waits, goes back to the crank after each reading, rewinds the lighthouse).
 *   noisy   : ignores the rule AND hunts the Laisse (runs straight at it after reading S1).
 * Two honest variants are added here because "noisy" is a strawman (it seeks the danger):
 *   win      : reads the 3 ladders by the shortest way, never touches the crank, walks (src/sim/bot.js).
 *   heedless : same as win but always runs when it moves (loud), never touches the crank.
 *   silent   : same as prudent (crank) but walks slowly in the water (noise_slow instead of noise_walk).
 */
export function makePlayer(sim, mode) {
  if (mode === 'heedless' || mode === 'silent') {
    const inner = createBot(sim, mode === 'heedless' ? 'win' : 'prudent');
    return () => {
      const i = inner();
      if (!i.moveF && !i.moveR) return i;
      return mode === 'heedless' ? { ...i, run: true } : { ...i, slow: true };
    };
  }
  return createBot(sim, mode);
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

/** Plays one full game and returns the outcome and the measures needed by the report. */
export function playGame(data, seed, mode) {
  const sim = createSim(data, { seed });
  const bot = makePlayer(sim, mode);
  const m = {
    mode, seed, outcome: null, cause: null, durationS: 0, readCount: 0, grabs: 0, grabsBefore160: 0,
    nearS: 0, nearBefore160S: 0, approaches: 0, approachesBefore160: 0, spawnT: null, minDist: null, minDistBefore160: null,
    grabTimes: [], endCharge: 0, audibleBefore160S: 0, roarsBefore160: 0, roars: 0,
  };
  const dt = sim.env.dt;
  let near = false;
  sim.subscribe((e) => {
    if (e.type === 'grab') { m.grabs++; m.grabTimes.push(e.t); if (e.t < FEAR_WINDOW_S) m.grabsBefore160++; }
    if (e.type === 'threat_state' && e.from === 'roam' && e.to === 'inquire') { m.roars++; if (e.t < FEAR_WINDOW_S) m.roarsBefore160++; }
    if (e.type === 'threat_spawn' && m.spawnT === null) m.spawnT = e.t;
  });
  for (let i = 0; i < MAX_TICKS && !sim.state.outcome; i++) {
    sim.step(bot());
    const s = sim.state, th = s.threat;
    if (th && th.active) {
      const d = dist(s.player, th);
      const early = s.t < FEAR_WINDOW_S;
      if (m.minDist === null || d < m.minDist) m.minDist = d;
      if (early && (m.minDistBefore160 === null || d < m.minDistBefore160)) m.minDistBefore160 = d;
      if (early && d < AUDIBLE_M) m.audibleBefore160S += dt;
      if (d < NEAR_M) {
        m.nearS += dt; if (early) m.nearBefore160S += dt;
        if (!near) { near = true; m.approaches++; if (early) m.approachesBefore160++; }
      } else if (d > NEAR_EXIT_M) near = false;
    } else near = false;
  }
  const s = sim.state;
  m.outcome = s.outcome; m.cause = s.cause; m.durationS = s.t; m.readCount = s.readCount; m.endCharge = s.lighthouse.charge;
  return m;
}

export function playAll(mode, seeds = SEEDS, data = loadData()) { return seeds.map((seed) => playGame(data, seed, mode)); }

export const rate = (games, pred) => games.filter(pred).length / games.length;
export const isWin = (g) => g.outcome === 'victory';
export const isLoss = (g) => g.outcome !== 'victory';
export const sum = (a) => a.reduce((x, y) => x + y, 0);
export const mean = (a) => (a.length ? sum(a) / a.length : 0);
export const min = (a) => Math.min(...a);
export const max = (a) => Math.max(...a);
export function median(a) { const b = [...a].sort((x, y) => x - y); const n = b.length; return n ? (n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2) : 0; }

/** Summary of one player's games. */
export function summarize(games) {
  const dur = games.map((g) => g.durationS);
  return {
    mode: games[0].mode, games: games.length,
    wins: games.filter(isWin).length, losses: games.filter(isLoss).length,
    winRate: rate(games, isWin), lossRate: rate(games, isLoss),
    causes: games.reduce((a, g) => { const k = g.outcome === 'victory' ? 'victory' : `defeat:${g.cause}`; a[k] = (a[k] || 0) + 1; return a; }, {}),
    duration: { min: min(dur), median: median(dur), mean: mean(dur), max: max(dur) },
    nearS: { mean: mean(games.map((g) => g.nearS)), median: median(games.map((g) => g.nearS)), max: max(games.map((g) => g.nearS)) },
    nearBefore160S: { mean: mean(games.map((g) => g.nearBefore160S)), median: median(games.map((g) => g.nearBefore160S)), max: max(games.map((g) => g.nearBefore160S)) },
    approachesBefore160: { mean: mean(games.map((g) => g.approachesBefore160)), min: min(games.map((g) => g.approachesBefore160)), max: max(games.map((g) => g.approachesBefore160)),
      gamesWithAtLeastOne: games.filter((g) => g.approachesBefore160 > 0).length },
    approaches: { mean: mean(games.map((g) => g.approaches)) },
    grabs: { total: sum(games.map((g) => g.grabs)), gamesWithGrab: games.filter((g) => g.grabs > 0).length },
    grabsBefore160: { total: sum(games.map((g) => g.grabsBefore160)), gamesWithGrab: games.filter((g) => g.grabsBefore160 > 0).length },
    audibleBefore160S: { mean: mean(games.map((g) => g.audibleBefore160S)), median: median(games.map((g) => g.audibleBefore160S)) },
    roarsBefore160: { total: sum(games.map((g) => g.roarsBefore160)), gamesWithAtLeastOne: games.filter((g) => g.roarsBefore160 > 0).length },
    spawnT: games[0].spawnT,
  };
}
export { NEUTRAL_INPUT };
