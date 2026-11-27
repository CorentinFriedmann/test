import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { data, newSim, run, place } from './helpers.js';
import { NEUTRAL_INPUT } from '../../src/sim/sim.js';
import { runBot, createBot } from '../../src/sim/bot.js';
import { createStepper } from '../../src/sim/stepper.js';
import { hudModel } from '../../src/ui/hud-model.js';
import { mulberry32 } from '../../src/sim/rng.js';

const fwd = (extra = {}) => ({ ...NEUTRAL_INPUT, moveF: 1, ...extra });
/** A dry spot of the island at the given heading from the platform (ground well above the tide at t = 0). */
const dryPoint = (sim) => ({ x: sim.world.start.x + 3, z: sim.world.start.z });

test('sim: runs at a fixed 30 Hz step; time is tick / 30 without drift', () => {
  const sim = newSim();
  assert.equal(sim.env.hz, 30);
  run(sim, 900, NEUTRAL_INPUT);
  assert.equal(sim.state.tick, 900);
  assert.equal(sim.state.t, 30);
  assert.equal(sim.state.level, sim.env.tide.levelAt(30));
});

test('sim module is pure: no three.js, DOM, wall clock or Math.random in src/sim and src/data', () => {
  const dirs = ['../../src/sim/', '../../src/data/'];
  for (const d of dirs) for (const f of readdirSync(new URL(d, import.meta.url))) {
    const code = readFileSync(fileURLToPath(new URL(d + f, import.meta.url)), 'utf8').replace(/\/\/.*$/gm, '');
    for (const banned of [/from 'three'/, /\bdocument\b/, /\bwindow\b/, /Math\.random/, /Date\.now/, /performance\.now/, /requestAnimationFrame/]) {
      assert.ok(!banned.test(code), `${d}${f} uses ${banned}`);
    }
  }
});

test('stepper: variable frame times give a whole number of identical ticks, capped at 3 per frame', () => {
  const dt = 1 / 30, s = createStepper(dt, 3);
  assert.equal(s.advance(0.016), 0);
  assert.equal(s.advance(0.02), 1);
  assert.equal(s.advance(1.0), 3); // slow frame: dt clamped to 0.1 s, at most 3 steps
  let total = 0; const s2 = createStepper(dt, 3);
  for (let i = 0; i < 600; i++) total += s2.advance(1 / 60);
  assert.ok(Math.abs(total - 300) <= 1, `ticks=${total}`);
  const s3 = createStepper(dt, 3);
  total = 0; for (let i = 0; i < 120; i++) total += s3.advance(1 / 60, 6);
  assert.ok(Math.abs(total - 360) <= 2, `x6 ticks=${total}`); // 120 frames of 1/60 s at x6 = 12 s = 360 ticks
});

test('movement: speed follows the depth band (walk 3 m/s on dry ground, slower and no running in deep water)', () => {
  const sim = newSim();
  const p = sim.state.player;
  // Dry ground at t = 0: 1 s of walking covers about 3 m, running about 5.5 m.
  run(sim, 30, fwd({ yaw: -Math.PI / 2 })); // forward = +x, away from the tower
  const walked = Math.hypot(p.x - sim.world.start.x, p.z - sim.world.start.z);
  assert.ok(Math.abs(walked - 3.0) < 0.05, `walked ${walked}`);
  const sim2 = newSim();
  run(sim2, 30, fwd({ run: true, yaw: -Math.PI / 2 }));
  const ran = Math.hypot(sim2.state.player.x - sim2.world.start.x, sim2.state.player.z - sim2.world.start.z);
  assert.ok(Math.abs(ran - 5.5) < 0.05, `ran ${ran}`);
  // Deep water: put the player at the S1 ladder at t = 62.5 (level 0.51, d = 0.81): eau_profonde, x0.55, run refused.
  const sim3 = newSim();
  const s = sim3.world.stations[0];
  sim3.state.tick = Math.round(62.5 * 30) - 1;
  place(sim3, s.x, s.z); sim3.state.player.speedMult = 0.55;
  const x0 = s.x, z0 = s.z;
  sim3.step({ ...NEUTRAL_INPUT, yaw: 0, moveF: 1, run: true });
  assert.equal(sim3.state.player.band, 'eau_profonde');
  const moved = Math.hypot(sim3.state.player.x - x0, sim3.state.player.z - z0);
  assert.ok(Math.abs(moved - (3.0 * 0.55) / 30) < 1e-3, `moved ${moved}`);
});

test('movement: the speed multiplier is smoothed over player_speed_smooth (0.2 s), not switched instantly', () => {
  const sim = newSim();
  const s = sim.world.stations[0];
  sim.state.tick = Math.round(62.5 * 30) - 1; place(sim, s.x, s.z); sim.state.player.speedMult = 1;
  sim.step({ ...NEUTRAL_INPUT, yaw: 0, moveF: 1 });
  const m1 = sim.state.player.speedMult;
  assert.ok(m1 < 1 && m1 > 0.55, `after 1 tick ${m1}`);
  run(sim, 30, NEUTRAL_INPUT);
  assert.ok(Math.abs(sim.state.player.speedMult - 0.55) < 0.01);
});

test('movement: invisible wall at the map radius and no walking through the lighthouse tower', () => {
  const sim = newSim();
  place(sim, 74, 0); sim.state.tick = 5;
  run(sim, 120, { ...NEUTRAL_INPUT, yaw: -Math.PI / 2, moveF: 1 }); // forward = +x
  assert.ok(Math.hypot(sim.state.player.x, sim.state.player.z) <= 75 + 1e-9);
  const sim2 = newSim();
  const lh = sim2.world.lighthouse;
  run(sim2, 200, { ...NEUTRAL_INPUT, yaw: Math.PI / 2, moveF: 1 }); // forward = -x, straight into the tower
  assert.ok(Math.hypot(sim2.state.player.x - lh.x, sim2.state.player.z - lh.z) >= 2.6 - 1e-9);
});

test('lamp: starts off, drains only while lit, empties after lamp_battery_seconds and then refuses to light', () => {
  const sim = newSim();
  assert.equal(sim.state.lamp.on, false);
  run(sim, 60, NEUTRAL_INPUT);
  assert.equal(sim.state.lamp.battery, 120);
  sim.step({ ...NEUTRAL_INPUT, lampToggle: true });
  assert.equal(sim.state.lamp.on, true);
  run(sim, 29, NEUTRAL_INPUT);
  assert.ok(Math.abs(sim.state.lamp.battery - 119) < 1e-6);
  sim.step({ ...NEUTRAL_INPUT, lampToggle: true });
  assert.equal(sim.state.lamp.on, false);
  const kept = sim.state.lamp.battery;
  run(sim, 30, NEUTRAL_INPUT);
  assert.equal(sim.state.lamp.battery, kept);
});

test('lamp: battery reaches 0 and switches off (checked before the first window closes)', () => {
  const sim = newSim();
  sim.state.lamp.battery = 1;
  sim.step({ ...NEUTRAL_INPUT, lampToggle: true });
  run(sim, 40, NEUTRAL_INPUT);
  assert.equal(sim.state.lamp.battery, 0);
  assert.equal(sim.state.lamp.on, false);
  sim.step({ ...NEUTRAL_INPUT, lampToggle: true });
  assert.equal(sim.state.lamp.on, false);
});

/** Moves the sim to tick `tick` standing at ladder `i` (test-only teleport). */
function atLadder(sim, i, t) {
  const s = sim.world.stations[i];
  sim.state.tick = Math.round(t * 30) - 1; place(sim, s.x, s.z);
}

test('ladder: holding E for hold_s inside the window reads it (5 s = 150 ticks), progress is exposed for the HUD', () => {
  const sim = newSim();
  atLadder(sim, 0, 50);
  run(sim, 75, { ...NEUTRAL_INPUT, interact: true });
  assert.ok(Math.abs(sim.state.stations[0].progress - 0.5) < 0.02);
  assert.equal(sim.state.stations[0].read, false);
  run(sim, 75, { ...NEUTRAL_INPUT, interact: true });
  assert.equal(sim.state.stations[0].read, true);
  assert.equal(sim.state.readCount, 1);
  assert.deepEqual(sim.telemetry().events.filter((e) => e.type === 'station_read').map((e) => e.id), ['S1_flot']);
});

test('ladder: releasing E, leaving the reach, or the depth leaving 0.15-1.00 m resets the progress', () => {
  const sim = newSim();
  atLadder(sim, 0, 50);
  run(sim, 60, { ...NEUTRAL_INPUT, interact: true });
  assert.ok(sim.state.stations[0].progress > 0.3);
  sim.step(NEUTRAL_INPUT);
  assert.equal(sim.state.stations[0].progress, 0);
  assert.equal(sim.state.reading, null);
  run(sim, 30, { ...NEUTRAL_INPUT, interact: true });
  place(sim, sim.world.stations[0].x + 3, sim.world.stations[0].z); // out of the 2 m reach
  sim.step({ ...NEUTRAL_INPUT, interact: true });
  assert.equal(sim.state.stations[0].progress, 0);
  // Too dry (t = 20 s, d < 0.15): refused.
  const dry = newSim(); atLadder(dry, 0, 20);
  run(dry, 60, { ...NEUTRAL_INPUT, interact: true });
  assert.equal(dry.state.stations[0].progress, 0);
  assert.equal(dry.state.stations[0].readable, false);
});

test('ladder: the rising-tide ladder refuses a falling tide, the falling-tide ladder refuses a rising one, S2 accepts both', () => {
  const a = newSim(); atLadder(a, 2, 100); a.step({ ...NEUTRAL_INPUT, interact: true });
  assert.equal(a.state.stations[2].readable, false, 'S3 at t=100 (rising)');
  const b = newSim(); atLadder(b, 2, 245); b.step({ ...NEUTRAL_INPUT, interact: true });
  assert.equal(b.state.stations[2].readable, true, 'S3 at t=245 (falling)');
  const c = newSim(); atLadder(c, 0, 245); c.step(NEUTRAL_INPUT);
  assert.equal(c.state.stations[0].readable, false, 'S1 at t=245');
  const d = newSim(); atLadder(d, 1, 125); d.step(NEUTRAL_INPUT);
  assert.equal(d.state.stations[1].readable, true, 'S2 rising side');
  const e = newSim(); atLadder(e, 1, 188); e.step(NEUTRAL_INPUT);
  assert.equal(e.state.stations[1].readable, true, 'S2 falling side');
});

test('defeat: a missed window ends the game right after window_end_s (72 s for S1) with the cause', () => {
  const sim = newSim();
  const st = runBot(sim, 'idle');
  assert.equal(st.outcome, 'defeat');
  assert.equal(st.cause, 'window_missed');
  assert.ok(st.t > 72 && st.t < 72.1, `t=${st.t}`);
  const ev = sim.telemetry().events.at(-1);
  assert.deepEqual([ev.type, ev.cause, ev.id], ['defeat', 'window_missed', 'S1_flot']);
});

test('defeat: grace_s from stations.csv postpones the missed-window defeat without code changes', () => {
  const graced = { ...data, stations: data.stations.map((s, i) => (i === 0 ? { ...s, graceS: 10 } : s)) };
  const sim = createSimWith(graced);
  const st = runBot(sim, 'idle');
  assert.equal(st.cause, 'window_missed');
  assert.ok(st.t > 82 && st.t < 82.1, `t=${st.t}`);
});
import { createSim } from '../../src/sim/sim.js';
const createSimWith = (d) => createSim(d);

test('defeat: drowning after 8 s in submersion, the counter drains in 4 s when d < 1.40', () => {
  const sim = newSim();
  const s = sim.world.stations[0];
  sim.state.stations.forEach((x) => { x.read = true; }); // test-only: no missed window
  sim.state.tick = 120 * 30 - 1; place(sim, s.x, s.z); // t = 120, level 2.11, ladder ground -0.30: d = 2.41 (submersion)
  run(sim, 4 * 30, NEUTRAL_INPUT);
  assert.ok(Math.abs(sim.state.drown - 4) < 0.1, `drown=${sim.state.drown}`);
  // back to the platform (dry): drains 8 s of counter in 4 s, i.e. 2 per second
  place(sim, sim.world.start.x, sim.world.start.z);
  run(sim, 30, NEUTRAL_INPUT);
  assert.ok(Math.abs(sim.state.drown - 2) < 0.1, `drown after 1 s dry=${sim.state.drown}`);
  place(sim, s.x, s.z);
  run(sim, 8 * 30, NEUTRAL_INPUT);
  assert.equal(sim.state.outcome, 'defeat');
  assert.equal(sim.state.cause, 'drowned');
});

test('defeat: reaching t = 300 s without all readings is a time_up defeat (windows forced open)', () => {
  const lax = { ...data, stations: data.stations.map((s) => ({ ...s, graceS: 1000 })) };
  const sim = createSimWith(lax);
  const st = runBot(sim, 'idle');
  assert.equal(st.cause, 'time_up');
  assert.equal(st.t, 300);
});

test('victory: the bot reads the three ladders and returns to the platform before t = 300 s', () => {
  const sim = newSim();
  const st = runBot(sim, 'win');
  assert.equal(st.outcome, 'victory');
  assert.equal(st.readCount, 3);
  assert.ok(st.t < 300);
  const ev = sim.telemetry().events;
  assert.deepEqual(ev.filter((e) => e.type === 'station_read').map((e) => e.id), ['S1_flot', 'S2_haute', 'S3_jusant']);
  assert.equal(ev.at(-1).type, 'victory');
});

test('victory: S3 is only read in its window (235-266 s) and the game freezes once finished', () => {
  const sim = newSim();
  runBot(sim, 'win');
  const readS3 = sim.telemetry().events.find((e) => e.id === 'S3_jusant');
  assert.ok(readS3.t >= 235 + 5 - 0.1 && readS3.t <= 266, `S3 read at ${readS3.t}`);
  const tick = sim.state.tick;
  sim.step(fwd());
  assert.equal(sim.state.tick, tick);
});

test('victory needs the platform: three readings far from the lighthouse are not enough', () => {
  const sim = newSim();
  const bot = createBot(sim, 'win');
  while (!sim.state.outcome && sim.state.readCount < 3) sim.step(bot());
  assert.equal(sim.state.outcome, null);
  assert.equal(sim.state.readCount, 3);
  assert.ok(Math.hypot(sim.state.player.x - sim.world.lighthouse.x, sim.state.player.z - sim.world.lighthouse.z) > 6);
});

test('drown bot: reads S1 then wades out and drowns (Laisse off, to isolate the breath counter)', () => {
  const st = runBot(newSim({ threat: false }), 'drown');
  assert.equal(st.outcome, 'defeat');
  assert.equal(st.cause, 'drowned');
  assert.equal(st.readCount, 1);
});

test('restart: reset() with the same seed replays the same game', () => {
  const sim = newSim();
  runBot(sim, 'win');
  const first = JSON.stringify(sim.telemetry());
  sim.reset();
  assert.equal(sim.state.tick, 0);
  assert.equal(sim.state.outcome, null);
  runBot(sim, 'win');
  assert.equal(JSON.stringify(sim.telemetry()), first);
});

test('determinism: same seed and same inputs give the same final state and journal (random input script)', () => {
  const script = (seed) => {
    const r = mulberry32(seed);
    return Array.from({ length: 3000 }, () => ({
      moveF: Math.round(r() * 2 - 1), moveR: Math.round(r() * 2 - 1), yaw: r() * 6.28, run: r() < 0.3,
      slow: false, interact: r() < 0.5, lampToggle: r() < 0.01,
    }));
  };
  const play = (islandSeed, inputSeed) => {
    const sim = newSim({ seed: islandSeed });
    for (const i of script(inputSeed)) sim.step(i);
    return JSON.stringify({ s: sim.state, t: sim.telemetry() });
  };
  assert.equal(play(2026, 5), play(2026, 5));
  assert.notEqual(play(2026, 5), play(2026, 6));
  assert.notEqual(play(2026, 5), play(9, 5));
});

test('telemetry: timestamped journal, one sample per second, JSON-serialisable and bounded', () => {
  const sim = newSim();
  runBot(sim, 'win');
  const tel = sim.telemetry();
  assert.equal(tel.seed, 2026); assert.equal(tel.hz, 30); assert.equal(tel.outcome, 'victory');
  assert.ok(tel.samples.length >= 240 && tel.samples.length <= 300);
  assert.deepEqual(tel.samples.slice(0, 3).map((s) => s.t), [0, 1, 2]);
  assert.ok(tel.events.every((e, i, a) => typeof e.t === 'number' && (i === 0 || e.t >= a[i - 1].t)));
  assert.ok(tel.events.some((e) => e.type === 'band_change'));
  assert.deepEqual(JSON.parse(JSON.stringify(tel)), tel);
});

test('hud model: gauge, pastilles and ring carry numbers and states only (no text; the end card is null while playing)', () => {
  const sim = newSim();
  atLadder(sim, 0, 50);
  run(sim, 60, { ...NEUTRAL_INPUT, interact: true });
  const m = hudModel(sim.state, sim.world, data);
  assert.ok(m.gauge.fill > 0 && m.gauge.fill < 0.5 && m.gauge.trend === 1);
  assert.deepEqual(m.pastilles.map((p) => p.kind), ['rise', 'peak', 'fall']);
  assert.equal(m.pastilles[0].status, 'now');
  assert.equal(m.pastilles[1].status, 'todo');
  assert.equal(m.ring.active, true);
  assert.ok(m.ring.progress > 0.3 && m.ring.progress < 0.5);
  assert.equal(m.card, null);
  const flat = JSON.stringify(m);
  assert.ok(!/[a-z]{12,}/i.test(flat.replace(/pastilles|progress/g, '')), 'no sentence-like text in the model');
});
