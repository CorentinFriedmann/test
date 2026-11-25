// Runs the P2 gate players on 20 seeds each and writes captures/.tmp/p2-discrimination.json (+ prints a table).
// Usage: node tests/p2/run.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadData } from '../../src/data/load.js';
import { SEEDS, playAll, summarize } from './lib.js';

const data = loadData();
const out = { seeds: SEEDS, players: {}, games: {} };
for (const mode of ['prudent', 'noisy', 'win', 'heedless', 'silent']) {
  const g = playAll(mode, SEEDS, data);
  out.games[mode] = g; out.players[mode] = summarize(g);
}
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'captures', '.tmp');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'p2-discrimination.json'), JSON.stringify(out, null, 1));
for (const [m, s] of Object.entries(out.players)) {
  console.log(`${m.padEnd(9)} wins ${s.wins}/${s.games} losses ${s.losses}/${s.games} causes ${JSON.stringify(s.causes)} dur min/med/max ${s.duration.min.toFixed(0)}/${s.duration.median.toFixed(0)}/${s.duration.max.toFixed(0)} s ` +
    `near<15m mean ${s.nearS.mean.toFixed(1)} s (<160s: ${s.nearBefore160S.mean.toFixed(1)}) approaches<160s ${s.approachesBefore160.mean.toFixed(2)} grabs ${s.grabs.total} (<160s: ${s.grabsBefore160.total}) audible<160s ${s.audibleBefore160S.mean.toFixed(1)} s roars<160s ${s.roarsBefore160.total}`);
}
