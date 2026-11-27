// T-043 C1: the guidance is a pure function of the simulation state (texts, ladder list, marker target), the end card and the
// first aids. States are built by moving the simulation clock and the player by hand (test only), without stepping, so that a
// missed window never ends the scenario.
import test from 'node:test';
import assert from 'node:assert/strict';
import { data, newSim, run } from './helpers.js';
import { NEUTRAL_INPUT } from '../../src/sim/sim.js';
import { runBot } from '../../src/sim/bot.js';
import { stationReadable } from '../../src/sim/env.js';
import { guidance, endCard, createTips, mmss } from '../../src/ui/guidance.js';
import { hypot } from '../../src/sim/util.js';

/** Sets the simulation clock to t (level, trend, readable flags) without stepping. */
function setTime(sim, t) {
  const st = sim.state;
  st.tick = Math.round(t * 30); st.t = t; st.level = sim.env.tide.levelAt(t); st.trend = sim.env.tide.trendAt(t);
  st.stations.forEach((s, i) => { s.readable = !s.read && stationReadable(sim.env, data.stations[i], t); });
  return sim;
}
const put = (sim, x, z) => { sim.state.player.x = x; sim.state.player.z = z; return sim; };
const markRead = (sim, ...idx) => { for (const i of idx) { sim.state.stations[i].read = true; sim.state.stations[i].readable = false; } sim.state.readCount = sim.state.stations.filter((s) => s.read).length; };
/** A point `r` metres from ladder i, away from the lighthouse (never inside the platform). */
const near = (sim, i, r) => { const w = sim.world.stations[i], lh = sim.world.lighthouse, d = hypot(w.x - lh.x, w.z - lh.z); return { x: w.x + ((w.x - lh.x) / d) * r, z: w.z + ((w.z - lh.z) / d) * r }; };
const G = (sim, memo) => guidance(sim.state, data, sim.world, memo);
const sim0 = (opts) => newSim({ threat: false, ...opts });

test('mmss: whole seconds, rounded up, M:SS', () => {
  assert.equal(mmss(0), '0:00'); assert.equal(mmss(0.01), '0:01'); assert.equal(mmss(68.03, true), '1:08'); assert.equal(mmss(300, true), '5:00'); assert.equal(mmss(38), '0:38'); assert.equal(mmss(299.2), '5:00'); assert.equal(mmss(75), '1:15'); assert.equal(mmss(-3), '0:00');
});

test('guidance: objective, status line and clock come from the data (3 ladders, 300 s)', () => {
  const sim = sim0();
  let g = G(sim);
  assert.equal(g.objective, 'Lisez les 3 échelles de marée, puis revenez au phare.');
  assert.equal(g.status, 'Relevés : 0/3 · Fin de la marée : 5:00');
  assert.equal(g.warn, false);
  setTime(sim, 270); markRead(sim, 0, 1);
  g = G(sim);
  assert.equal(g.status, 'Relevés : 2/3 · Fin de la marée : 0:30');
  assert.equal(g.warn, true, 'orange under 0:45');
  setTime(sim, 255); assert.equal(G(sim).warn, true);
  setTime(sim, 254); assert.equal(G(sim).warn, false);
});

test('guidance: ladder list states (lue, OUVERTE with the time left, s\'ouvre dans, manquée)', () => {
  const sim = sim0();
  setTime(sim, 0);
  let l = G(sim).list;
  assert.deepEqual(l.map((x) => x.name), ['1 · marée montante', '2 · marée haute', '3 · marée descendante']);
  assert.deepEqual(l.map((x) => x.state), ['pending', 'pending', 'pending']);
  assert.deepEqual(l.map((x) => x.text), ['s\'ouvre dans 0:38', 's\'ouvre dans 1:40', 's\'ouvre dans 3:55']);
  setTime(sim, 50);
  l = G(sim).list;
  assert.equal(l[0].state, 'open'); assert.equal(l[0].text, 'OUVERTE, reste 0:22');
  markRead(sim, 0); setTime(sim, 110);
  l = G(sim).list;
  assert.equal(l[0].text, 'lue ✓'); assert.equal(l[1].text, 'OUVERTE, reste 1:30');
  setTime(sim, 250);
  assert.equal(G(sim).list[1].state, 'missed'); assert.equal(G(sim).list[1].text, 'manquée');
});

test('guidance: the 15 rows of the action line, first true condition wins (exact texts)', () => {
  const lh = (sim) => sim.world.lighthouse;
  // 1 reading in progress
  let sim = sim0(); setTime(sim, 50); put(sim, sim.world.stations[0].x, sim.world.stations[0].z); sim.state.reading = { index: 0, ticks: 10, total: 150 };
  assert.equal(G(sim).action, 'Lecture en cours… maintenez E');
  // 2 winding in progress (wins over everything below)
  sim = sim0(); setTime(sim, 10); sim.state.lighthouse.winding = { ticks: 3, total: 150 };
  assert.equal(G(sim).action, 'Remontage du phare… maintenez E');
  // 3 breath running out
  sim = sim0(); setTime(sim, 50); put(sim, sim.world.stations[0].x, sim.world.stations[0].z); sim.state.drown = 1.5;
  assert.equal(G(sim).action, 'Vous manquez d\'air : gagnez un terrain plus haut !');
  // 4 at a readable ladder
  sim = sim0(); setTime(sim, 50); put(sim, sim.world.stations[0].x, sim.world.stations[0].z);
  assert.equal(G(sim).action, 'Maintenez E pour lire l\'échelle (5 s)');
  // 5 water not up to the ladder yet
  sim = sim0(); setTime(sim, 20); put(sim, sim.world.stations[0].x, sim.world.stations[0].z);
  assert.equal(G(sim).action, 'L\'eau n\'atteint pas encore l\'échelle. Attendez.');
  // 6 water too high (S3 while the tide is high)
  sim = sim0(); setTime(sim, 150); markRead(sim, 0, 1); put(sim, sim.world.stations[2].x, sim.world.stations[2].z);
  assert.equal(G(sim).action, 'L\'eau est trop haute pour lire l\'échelle.');
  // 7 wrong direction of the tide: S1 (rising) while it falls, depth in range
  sim = sim0(); setTime(sim, 245); put(sim, sim.world.stations[0].x, sim.world.stations[0].z);
  assert.ok(sim.state.level - data.stations[0].altitude >= 0.15 && sim.state.level - data.stations[0].altitude <= 1.0 && sim.state.trend === -1);
  assert.equal(G(sim).action, 'Pas maintenant : revenez quand la marée sera dans l\'autre sens.');
  // 8 within 6 m of an open ladder
  sim = sim0(); setTime(sim, 50); put(sim, near(sim, 0, 4).x, near(sim, 0, 4).z);
  assert.equal(G(sim).action, 'Approchez-vous de l\'échelle.');
  // 9 at the crank, charge under 60 %
  sim = sim0(); setTime(sim, 10); put(sim, sim.world.crank.x, sim.world.crank.z); sim.state.lighthouse.charge = 55;
  assert.equal(G(sim).action, 'Maintenez E pour remonter le phare (5 s)');
  sim.state.lighthouse.charge = 65; assert.notEqual(G(sim).action, 'Maintenez E pour remonter le phare (5 s)');
  // 10 three readings, away from the platform
  sim = sim0(); setTime(sim, 260); markRead(sim, 0, 1, 2); put(sim, near(sim, 2, 5).x, near(sim, 2, 5).z);
  assert.equal(G(sim).action, 'Retournez au phare : il reste 0:40.');
  // 11 a reading was just made (10 s), away from the platform
  sim = sim0(); setTime(sim, 60); markRead(sim, 0); put(sim, near(sim, 0, 5).x, near(sim, 0, 5).z);
  assert.equal(G(sim, { lastReadT: 55 }).action, 'Relevé noté. Revenez vers le phare.');
  assert.notEqual(G(sim, { lastReadT: 40 }).action, 'Relevé noté. Revenez vers le phare.');
  // 12 next ladder open
  sim = sim0(); setTime(sim, 110); markRead(sim, 0); put(sim, near(sim, 1, 15).x, near(sim, 1, 15).z);
  assert.equal(G(sim).action, 'Échelle 2 ouverte : allez-y ! Il reste 1:30.');
  // 13 time to leave: the opening is within walking time (distance / 3 m/s) + 10 s
  sim = sim0(); setTime(sim, 25); put(sim, lh(sim).x + 7, lh(sim).z);
  const dist = hypot(sim.world.stations[0].x - sim.state.player.x, sim.world.stations[0].z - sim.state.player.z);
  assert.ok(38 - 25 <= dist / 3 + 10, `fixture: opening in 13 s <= ${dist / 3 + 10}`);
  assert.equal(G(sim).action, 'Partez vers l\'échelle 1 : elle s\'ouvre dans 0:13.');
  // 14 waiting on the platform with the lighthouse under 50 %
  sim = sim0(); setTime(sim, 60); markRead(sim, 0); put(sim, lh(sim).x + 4, lh(sim).z + 4); sim.state.lighthouse.charge = 40;
  assert.equal(G(sim).action, 'En attendant : remontez le phare à la manivelle (E, 5 s).');
  // 15 otherwise: wait
  sim.state.lighthouse.charge = 90;
  assert.equal(G(sim).action, 'Attendez au phare : l\'échelle 2 s\'ouvre dans 0:40.');
});

test('guidance: the start of the game shows row 15, then row 13 once it is time to leave (around 10-20 s)', () => {
  const sim = sim0();
  assert.equal(G(sim).action, 'Attendez au phare : l\'échelle 1 s\'ouvre dans 0:38.');
  let first = null;
  for (let t = 0; t <= 38; t += 1) { setTime(sim, t); if (/^Partez vers l'échelle 1/.test(G(sim).action)) { first = t; break; } }
  assert.ok(first !== null && first >= 8 && first <= 24, `first "Partez" at t=${first}`);
});

test('guidance: S2 (required_trend 0) never gets the "wrong direction" message, only depth decides', () => {
  const sim = sim0(); put(sim, sim.world.stations[1].x, sim.world.stations[1].z);
  for (let t = 0; t <= 299; t++) {
    setTime(sim, t);
    const a = G(sim).action;
    assert.notEqual(a, 'Pas maintenant : revenez quand la marée sera dans l\'autre sens.', `t=${t}`);
    if (stationReadable(sim.env, data.stations[1], t)) assert.equal(a, 'Maintenez E pour lire l\'échelle (5 s)', `t=${t}`);
  }
});

test('guidance: marker target is one point at a time (next ladder, or the lighthouse after a reading and when all are read)', () => {
  const sim = sim0(); setTime(sim, 5);
  let g = G(sim);
  assert.deepEqual([g.target.kind, g.target.index, g.target.strong], ['station', 0, false], 'not open yet: faint');
  setTime(sim, 50); g = G(sim); assert.equal(g.target.strong, true, 'open: strong');
  setTime(sim, 30); g = G(sim); put(sim, sim.world.start.x, sim.world.start.z);
  // "time to leave" makes it strong too
  const d = hypot(sim.world.stations[0].x - sim.world.start.x, sim.world.stations[0].z - sim.world.start.z);
  setTime(sim, 38 - (d / 3 + 5)); assert.equal(G(sim).target.strong, true);
  setTime(sim, 38 - (d / 3 + 15)); assert.equal(G(sim).target.strong, false);
  markRead(sim, 0); setTime(sim, 60);
  g = G(sim, { lastReadT: 58 }); assert.equal(g.target.kind, 'lighthouse');
  g = G(sim, { lastReadT: 20 }); assert.deepEqual([g.target.kind, g.target.index], ['station', 1]);
  markRead(sim, 1, 2); g = G(sim); assert.equal(g.target.kind, 'lighthouse');
  assert.deepEqual([g.target.x, g.target.z], [sim.world.lighthouse.x, sim.world.lighthouse.z]);
});

test('guidance: never reveals the Laisse (the output does not depend on her state, and never mentions her)', () => {
  const a = newSim(); setTime(a, 120); a.state.threat.active = true; a.state.threat.x = 20; a.state.threat.z = 5; a.state.threat.mode = 'hunt'; a.state.threat.dist = 6;
  const b = newSim(); setTime(b, 120); b.state.threat.active = false; b.state.threat.x = -33; b.state.threat.z = 41;
  assert.deepEqual(G(a), G(b));
  assert.ok(!/laisse|menace|monstre|créature/i.test(JSON.stringify(G(a))));
  const t = createTips(data, a.world);
  t.onCue('swirl');
  assert.ok(!/laisse|menace|monstre|créature/i.test(t.step(a.state) ?? ''));
});

test('guidance: pure (same input, same output, input untouched) and an ended game has no action line', () => {
  const sim = sim0(); setTime(sim, 70); markRead(sim, 0);
  const before = JSON.stringify(sim.state);
  assert.deepEqual(G(sim), G(sim));
  assert.equal(JSON.stringify(sim.state), before);
  sim.state.outcome = 'defeat'; sim.state.cause = 'time_up';
  assert.equal(G(sim).action, ''); assert.equal(G(sim).target, null);
});

test('end card: a title, one sentence of reason, then "Relevés : n/3 · Temps : M:SS" and the restart key', () => {
  assert.equal(endCard(newSim().state, data), null);
  const win = newSim({ threat: false }); runBot(win, 'win');
  const w = endCard(win.state, data);
  assert.equal(w.title, 'Les trois relevés sont faits.');
  assert.equal(w.reason, 'Vous êtes de retour au phare avant la fin de la marée.');
  assert.match(w.summary, /^Relevés : 3\/3 · Temps : \d:\d\d$/); assert.equal(w.hint, 'R pour recommencer'); assert.equal(w.kind, 'victory');

  const miss = newSim({ threat: false }); runBot(miss, 'idle');
  const m = endCard(miss.state, data);
  assert.deepEqual([m.title, m.reason], ['Relevé manqué.', 'L\'échelle 1 s\'est refermée avant d\'être lue. Chaque échelle ne se lit que pendant sa fenêtre.']);
  assert.match(m.summary, /^Relevés : 0\/3 · Temps : 1:12$/);

  const drown = newSim({ threat: false }); runBot(drown, 'drown');
  const d = endCard(drown.state, data);
  assert.deepEqual([d.title, d.reason], ['La mer a gagné.', 'Vous êtes resté plus de 8 s sous l\'eau. Quand la marée monte, gagnez le phare.']);

  const seized = newSim(); runBot(seized, 'noisy');
  assert.equal(seized.state.cause, 'seized');
  const s = endCard(seized.state, data);
  assert.deepEqual([s.title, s.reason], ['La mer a gagné.', 'Quelque chose vous a saisi deux fois en moins de 45 s. Dans l\'eau, le bruit attire : marchez lentement (C) ou restez immobile.']);

  const lax = newSim({ threat: false });
  lax.state.outcome = 'defeat'; lax.state.cause = 'time_up'; lax.state.t = 300; markRead(lax, 0, 1, 2);
  assert.deepEqual([endCard(lax.state, data).title, endCard(lax.state, data).reason], ['La marée est finie.', 'Vous n\'êtes pas revenu au phare à temps.']);
  const two = newSim({ threat: false });
  two.state.outcome = 'defeat'; two.state.cause = 'time_up'; two.state.t = 300; markRead(two, 0, 1);
  assert.deepEqual([endCard(two.state, data).title, endCard(two.state, data).reason], ['La marée est finie.', 'Il manquait des relevés : 2 sur 3.']);
  assert.match(endCard(two.state, data).summary, /Temps : 5:00$/);
});

test('end card: the missed ladder is named from the state (ladder 2 and 3)', () => {
  for (const [i, tEnd] of [[1, 200.1], [2, 266.1]]) {
    const sim = sim0(); markRead(sim, ...[0, 1, 2].filter((k) => k < i));
    setTime(sim, tEnd); sim.state.outcome = 'defeat'; sim.state.cause = 'window_missed';
    assert.match(endCard(sim.state, data).reason, new RegExp(`^L'échelle ${i + 1} s'est refermée`));
  }
});

test('first aids: keys at the start until the first move (20 s at most), once, then the lamp, crank and noise aids', () => {
  const sim = sim0(); const tips = createTips(data, sim.world);
  setTime(sim, 0);
  assert.equal(tips.step(sim.state), 'ZQSD ou flèches : marcher · Souris : regarder · Maj : courir · C : marcher lentement · M : son');
  setTime(sim, 12); assert.ok(/^ZQSD/.test(tips.step(sim.state)), 'still there while the player has not moved (no 8 s limit for the keys)');
  // first move closes it; on dry ground (d < 0.15) the lamp aid is not due yet
  put(sim, sim.world.start.x + 3, sim.world.start.z); sim.state.player.d = -1; setTime(sim, 14);
  assert.equal(tips.step(sim.state), null);
  // first step in the water (d >= 0.15): the lamp aid, 8 s, closed by F
  sim.state.player.d = 0.3; setTime(sim, 16);
  assert.equal(tips.step(sim.state), 'Appuyez sur F : la lampe éclaire devant vous (120 s d\'autonomie).');
  setTime(sim, 23.9); assert.ok(tips.step(sim.state));
  setTime(sim, 24.1); assert.equal(tips.step(sim.state), null, 'gone after 8 s');
  setTime(sim, 30); assert.equal(tips.step(sim.state), null, 'never twice');
  // crank aid under 50 % charge, closed by the first winding
  sim.state.lighthouse.charge = 49; setTime(sim, 101);
  assert.equal(tips.step(sim.state), 'Le phare s\'use. La manivelle, au pied de la tour, le remonte : maintenez E 5 s.');
  sim.state.lighthouse.winding = { ticks: 1, total: 150 }; setTime(sim, 102);
  assert.equal(tips.step(sim.state), null);
  // first noise in the water: the cue, 8 s, never named
  tips.onCue('step'); setTime(sim, 110); assert.equal(tips.step(sim.state), null, 'footsteps are not the noise aid');
  tips.onCue('swirl'); setTime(sim, 111);
  assert.equal(tips.step(sim.state), 'Quelque chose bouge dans l\'eau. Ralentissez (C) ou restez immobile.');
  setTime(sim, 119.5); assert.equal(tips.step(sim.state), null);
  tips.onCue('roar'); setTime(sim, 125); assert.equal(tips.step(sim.state), null, 'once per game');
});

test('first aids: keys end at 20 s without moving; lamp aid also at 20 s; closed lamp aid when F was pressed; reset replays them', () => {
  const sim = sim0(); const tips = createTips(data, sim.world);
  setTime(sim, 19); assert.ok(/^ZQSD/.test(tips.step(sim.state)));
  setTime(sim, 20); assert.match(tips.step(sim.state), /^Appuyez sur F/, 'keys closed at 20 s, the lamp aid takes over');
  sim.state.lamp.on = true; setTime(sim, 21); assert.equal(tips.step(sim.state), null, 'F pressed: closed');
  setTime(sim, 0); assert.match(tips.step(sim.state), /^ZQSD/, 'new game (time went back): the aids are armed again');
  const sim2 = sim0(); const t2 = createTips(data, sim2.world);
  setTime(sim2, 40); sim2.state.lamp.on = true; sim2.state.player.d = 1;
  assert.equal(t2.step(sim2.state), null, 'late start with the lamp already on and the keys already useless: nothing to show');
});

test('a played game of the prudent bot: the action line never contradicts the state (smoke over 300 s, text always defined)', () => {
  const sim = newSim(); const memo = { lastReadT: null }; const seen = new Set();
  sim.subscribe((e) => { if (e.type === 'station_read') memo.lastReadT = e.t; });
  const tips = createTips(data, sim.world);
  const bot = (sim, mode) => import('../../src/sim/bot.js').then((m) => m.createBot(sim, mode));
  return bot(sim, 'prudent').then((b) => {
    for (let i = 0; i < 9000 && !sim.state.outcome; i++) {
      sim.step(b());
      if (i % 15 === 0) { const g = guidance(sim.state, data, sim.world, memo); assert.equal(typeof g.action, 'string'); seen.add(g.action.replace(/\d+:\d\d/g, 'M:SS')); tips.step(sim.state); }
    }
    assert.equal(sim.state.outcome, 'victory');
    for (const need of ['Maintenez E pour lire l\'échelle (5 s)', 'Retournez au phare : il reste M:SS.']) assert.ok(seen.has(need), `never saw: ${need}`);
    assert.ok([...seen].some((a) => /^Partez vers l'échelle/.test(a)) && [...seen].some((a) => /^Attendez au phare/.test(a)));
  });
});

void run; void NEUTRAL_INPUT;
