// T-041: cost of one simulation step under Node (no browser). Measured on the test side only; src/sim/ is untouched.
// Usage: node tests/p2/timing.mjs [verify]   (default seeds 101-120; "verify": 201-220). Outside `npm run all`: timings vary per run.
// Each game is played with the Laisse active (the default of createSim). Only sim.step() is timed, not the player's decision.
import os from 'node:os';
import { loadData } from '../../src/data/load.js';
import { createSim } from '../../src/sim/sim.js';
import { SEEDS, SEEDS_VERIFY, makePlayer } from './lib.js';

const data = loadData();
const SET = process.argv[2] === 'verify' ? SEEDS_VERIFY : SEEDS;
const MODES = ['prudent', 'noisy', 'win', 'heedless', 'silent'];
const WARMUP_SEEDS = [1, 2, 3]; // played first with every player, never counted: lets V8 optimise the code
const MAX_TICKS = 20000;
const BUDGET_MS = 1, DT_MS = 1000 / 30;
const now = () => process.hrtime.bigint();

function play(seed, mode, sink) {
  const t0 = now(); const sim = createSim(data, { seed }); const create = Number(now() - t0) / 1e6;
  const player = makePlayer(sim, mode);
  let threatTicks = 0;
  for (let i = 0; i < MAX_TICKS && !sim.state.outcome; i++) {
    const input = player();
    const a = now(); sim.step(input); const b = now();
    if (sink) { sink.push(Number(b - a) / 1e6); if (sim.state.threat && sim.state.threat.active) threatTicks++; }
  }
  return { create, threatTicks, ticks: sim.state.tick, outcome: sim.state.outcome };
}

const pct = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)];
function stats(a) {
  const s = Float64Array.from(a).sort();
  const sum = s.reduce((x, y) => x + y, 0);
  return { n: s.length, mean: sum / s.length, p50: pct(s, 0.5), p95: pct(s, 0.95), p99: pct(s, 0.99), max: s[s.length - 1] };
}
const f = (x) => x.toFixed(4);

// Timer overhead: two back-to-back hrtime calls around nothing.
const ov = []; for (let i = 0; i < 200000; i++) { const a = now(); const b = now(); ov.push(Number(b - a) / 1e6); }
const overhead = stats(ov);

for (const m of MODES) for (const s of WARMUP_SEEDS) play(s, m, null);

const all = [], byMode = {}, creates = [], games = [];
for (const m of MODES) {
  byMode[m] = [];
  for (const seed of SET) {
    const sink = []; const r = play(seed, m, sink);
    byMode[m].push(...sink); for (const v of sink) all.push(v);
    creates.push(r.create); games.push({ m, seed, ...r });
  }
}
const threatShare = games.reduce((x, g) => x + g.threatTicks, 0) / all.length;
console.log(`T-041 sim step timing | ${new Date().toISOString().slice(0, 10)} | node ${process.version} | ${os.cpus().length} cores ${os.cpus()[0].model} | ${os.platform()} ${os.arch()}`);
console.log(`seeds ${SET[0]}-${SET[SET.length - 1]} (${SET.length}) x ${MODES.length} players = ${games.length} games, ${all.length} steps timed (warm-up ${WARMUP_SEEDS.length} games per player discarded); Laisse active in ${(threatShare * 100).toFixed(0)} % of the steps`);
console.log(`timer overhead (hrtime pair): mean ${f(overhead.mean)} ms, p99 ${f(overhead.p99)} ms (included in the figures below)`);
console.log('\nplayer     steps    mean ms   p50 ms    p95 ms    p99 ms    max ms');
const rows = { ...byMode, TOTAL: all };
const summary = {};
for (const [k, v] of Object.entries(rows)) {
  const st = stats(v); summary[k] = st;
  console.log(`${k.padEnd(9)} ${String(st.n).padStart(7)}  ${f(st.mean)}  ${f(st.p50)}  ${f(st.p95)}  ${f(st.p99)}  ${f(st.max)}`);
}
const c = stats(creates);
console.log(`\ncreateSim (world: island, terrain heights, stations) over ${creates.length} games: mean ${c.mean.toFixed(2)} ms, p95 ${c.p95.toFixed(2)} ms, max ${c.max.toFixed(2)} ms`);
const t = summary.TOTAL;
console.log(`\nBudget ${BUDGET_MS} ms/step: mean ${(t.mean / BUDGET_MS * 100).toFixed(1)} %, p99 ${(t.p99 / BUDGET_MS * 100).toFixed(1)} %, max ${(t.max / BUDGET_MS * 100).toFixed(1)} % -> ${t.max <= BUDGET_MS ? 'held (even the max)' : (t.p99 <= BUDGET_MS ? 'held to p99, max exceeds (isolated spikes)' : 'NOT held')}`);
console.log(`Step period at 30 Hz: ${DT_MS.toFixed(1)} ms; mean = ${(t.mean / DT_MS * 100).toFixed(2)} % of it, max = ${(t.max / DT_MS * 100).toFixed(2)} %`);
const over = all.filter((x) => x > BUDGET_MS).length;
console.log(`Steps over ${BUDGET_MS} ms: ${over} of ${all.length}`);
console.log('\nJSON ' + JSON.stringify({ summary, createSim: c, overhead }));
