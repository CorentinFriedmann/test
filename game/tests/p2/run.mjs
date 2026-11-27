// Runs the P2 gate players on 20 seeds each and writes captures/.tmp/p2-discrimination.json (+ prints a table).
// Usage: node tests/p2/run.mjs [verify]   (default: tuning seeds 101-120; "verify": seeds 201-220, never used for tuning)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadData } from '../../src/data/load.js';
import { SEEDS, SEEDS_VERIFY, playAll, summarize, playSlowStart } from './lib.js';

const data = loadData();
const SET = process.argv[2] === 'verify' ? SEEDS_VERIFY : SEEDS;
const out = { seeds: SET, players: {}, games: {} };
for (const mode of ['prudent', 'noisy', 'win', 'heedless', 'silent']) {
  const g = playAll(mode, SET, data);
  out.games[mode] = g; out.players[mode] = summarize(g);
}
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'captures', '.tmp');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, process.argv[2] === 'verify' ? 'p2-discrimination-verify.json' : 'p2-discrimination.json'), JSON.stringify(out, null, 1));
for (const [m, s] of Object.entries(out.players)) {
  console.log(`${m.padEnd(9)} wins ${s.wins}/${s.games} losses ${s.losses}/${s.games} causes ${JSON.stringify(s.causes)} dur min/med/max ${s.duration.min.toFixed(0)}/${s.duration.median.toFixed(0)}/${s.duration.max.toFixed(0)} s ` +
    `near<15m mean ${s.nearS.mean.toFixed(1)} s (<fear: ${s.nearBeforeFearS.mean.toFixed(1)}) approaches<fear ${s.approachesBeforeFear.mean.toFixed(2)} (games with >=1: ${s.approachesBeforeFear.gamesWithAtLeastOne}/${s.games}) grabs ${s.grabs.total} (<fear: ${s.grabsBeforeFear.total}) audible<fear ${s.audibleBeforeFearS.mean.toFixed(1)} s roars<fear ${s.roarsBeforeFear.total}`);
}

// Requirement (b) of the Boss: slow start (leaves for ladder 1 at 30 s, then at 45 s).
for (const t of [30, 45]) {
  const r = SET.map((seed) => playSlowStart(data, seed, t));
  const reads = r.filter((x) => x.read);
  console.log(`slow start at ${t} s: ladder 1 read on ${reads.length}/${r.length} seeds, latest reading at ${Math.max(...reads.map((x) => x.readT)).toFixed(1)} s`);
}
