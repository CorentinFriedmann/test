// T-031: audio logic that needs no browser: listener isolation in the simulation, spatial maths, mixing rules, director, subtitles, settings.
import test from 'node:test';
import assert from 'node:assert/strict';
import { data, newSim } from './helpers.js';
import { param } from '../../src/data/load.js';
import { createSim } from '../../src/sim/sim.js';
import { runBot, createBot } from '../../src/sim/bot.js';
import { panOf, distanceGain, cutoffFor, sectorLabel, sectorOf, relative } from '../../src/audio/spatial.js';
import { ambientMix, dreadLevel, towerHum, masterCutoff, swirlInterval, tideNorm, tollInterval } from '../../src/audio/mix.js';
import { createDirector } from '../../src/audio/director.js';
import { captionFor } from '../../src/audio/caption-text.js';
import { loadSettings, saveSettings, sanitize, DEFAULTS } from '../../src/audio/settings.js';

const audibleR = param(data, 'threat_audible_radius'), roarR = param(data, 'threat_cue_roar_radius'), flicker = param(data, 'lighthouse_charge_flicker');
const L0 = { x: 0, z: 0, yaw: 0 }; // yaw 0: facing -z, right = +x

// ---- 0. Listener isolation (T-029 reserve) ----
test('a listener that throws never breaks the simulation, is reported outside the journal, and other listeners still run', () => {
  const reported = [];
  const bad = createSim(data, { seed: 2026, onListenerError: (err, rec) => reported.push({ msg: err.message, event: rec.event }) });
  const ref = createSim(data, { seed: 2026 });
  let goodSeen = 0;
  bad.subscribe(() => { throw new Error('boom'); });
  bad.subscribe(() => { goodSeen++; });
  const a = runBot(bad, 'noisy'), b = runBot(ref, 'noisy');
  assert.equal(a.outcome, b.outcome);
  assert.equal(JSON.stringify(bad.telemetry()), JSON.stringify(ref.telemetry()), 'the telemetry is identical with and without the faulty listener');
  assert.ok(goodSeen > 20, `second listener received ${goodSeen} events`);
  assert.ok(bad.listenerErrors.length > 0 && bad.listenerErrors.length <= 50, 'errors are recorded and capped');
  assert.equal(bad.listenerErrors[0].message, 'boom');
  assert.ok(reported.length > 0 && reported[0].msg === 'boom');
  assert.ok(!bad.telemetry().events.some((e) => e.type === 'listener_error'), 'not in the deterministic journal');
});

test('a reporter that throws is also contained; a listener may unsubscribe itself while being called', () => {
  const sim = createSim(data, { seed: 2026, onListenerError: () => { throw new Error('reporter'); } });
  let off = null, calls = 0, other = 0;
  off = sim.subscribe(() => { calls++; off(); throw new Error('x'); });
  sim.subscribe(() => { other++; });
  const st = runBot(sim, 'noisy', 4000);
  assert.ok(st.tick >= 4000 || st.outcome, 'the simulation ran on');
  assert.equal(calls, 1, 'unsubscribed after the first call');
  assert.ok(other > 5, 'the next listener was not skipped by the unsubscribe');
});

// ---- 1. Spatial maths ----
test('pan follows the source side and the listener orientation', () => {
  assert.ok(panOf(L0, { x: -10, z: 0 }) < -0.99, 'left');
  assert.ok(panOf(L0, { x: 10, z: 0 }) > 0.99, 'right');
  assert.ok(Math.abs(panOf(L0, { x: 0, z: -10 })) < 1e-9, 'ahead: centre');
  assert.ok(Math.abs(panOf(L0, { x: 0, z: 10 })) < 1e-9, 'behind: centre');
  const turned = { x: 0, z: 0, yaw: Math.PI }; // facing +z: the left of the world is now on the right
  assert.ok(panOf(turned, { x: -10, z: 0 }) > 0.99);
  const east = { x: 0, z: 0, yaw: -Math.PI / 2 }; // the start pose: facing +x, right hand = +z
  assert.ok(panOf(east, { x: 0, z: 10 }) > 0.99 && panOf(east, { x: 0, z: -10 }) < -0.99);
  let prev = -2;
  for (let x = -20; x <= 20; x += 2) { const p = panOf(L0, { x, z: -8 }); assert.ok(p > prev, `monotonic at x=${x}`); prev = p; }
  assert.ok(Math.abs(panOf(L0, { x: 0.3, z: 0 })) < 0.25, 'a source at the head does not swing hard');
  assert.equal(panOf(L0, { x: 0, z: 0 }), 0);
});

test('distance gain and cutoff fall monotonically; direction labels cover the 8 sectors', () => {
  assert.ok(Math.abs(distanceGain(0.5, 3, 45) - distanceGain(3, 3, 45)) < 1e-9, 'flat inside the reference distance');
  assert.ok(distanceGain(3, 3, 45) > 0.99);
  assert.equal(distanceGain(45, 3, 45), 0);
  assert.equal(distanceGain(80, 3, 45), 0);
  let prev = Infinity;
  for (let d = 3; d <= 45; d += 3) { const g = distanceGain(d, 3, 45); assert.ok(g < prev); prev = g; }
  assert.ok(cutoffFor(0, 45) > cutoffFor(20, 45) && cutoffFor(20, 45) > cutoffFor(45, 45));
  const at = (x, z) => sectorLabel(L0, { x, z });
  assert.equal(at(0, -10), 'devant'); assert.equal(at(10, -10), 'devant à droite'); assert.equal(at(10, 0), 'à droite');
  assert.equal(at(10, 10), 'derrière à droite'); assert.equal(at(0, 10), 'derrière'); assert.equal(at(-10, 10), 'derrière à gauche');
  assert.equal(at(-10, 0), 'à gauche'); assert.equal(at(-10, -10), 'devant à gauche');
  assert.equal(sectorOf({ x: 0, z: 0, yaw: Math.PI }, { x: -10, z: 0 }), 2, 'turning round moves the left source to the right');
  assert.ok(Math.abs(relative(L0, { x: 3, z: -4 }).dist - 5) < 1e-9);
});

// ---- 2. Mixing rules ----
test('ambience varies with the tide: heavier, closer sea and covered wind at high tide', () => {
  const lo = ambientMix(0), hi = ambientMix(1);
  assert.ok(hi.seaBody > lo.seaBody * 2 && hi.seaBodyCut > lo.seaBodyCut && hi.seaHiss > lo.seaHiss);
  assert.ok(hi.windGain < lo.windGain && hi.windFreq < lo.windFreq);
  assert.equal(tideNorm(-0.6, -0.6, 2), 0); assert.equal(tideNorm(5, -0.6, 2), 1);
  const levels = data.tide.map((r) => r.level), mid = ambientMix(tideNorm((Math.min(...levels) + Math.max(...levels)) / 2, Math.min(...levels), Math.max(...levels)));
  assert.ok(mid.seaBody > lo.seaBody && mid.seaBody < hi.seaBody);
});

test('dread grows as the hunting Laisse gets close, stays 0 beyond the audible radius; a dead lighthouse and drowning add to it', () => {
  const cfg = { audibleR, roarR };
  const mk = (mode, dist, extra = {}) => ({ threat: { active: true, mode, dist }, lighthouse: { charge: 100 }, drown: 0, drownLimit: 8, ...extra });
  assert.equal(dreadLevel(mk('hunt', audibleR + 5), cfg), 0);
  assert.ok(dreadLevel(mk('hunt', 30), cfg) < dreadLevel(mk('hunt', 10), cfg));
  assert.ok(dreadLevel(mk('hunt', 3), cfg) > 0.8);
  assert.ok(dreadLevel(mk('roam', 10), cfg) < dreadLevel(mk('hunt', 10), cfg));
  assert.ok(dreadLevel(mk('roam', 100, { lighthouse: { charge: 0 } }), cfg) >= 0.2, 'the dead lighthouse alone weighs');
  assert.ok(dreadLevel({ threat: null, lighthouse: { charge: 100 }, drown: 7, drownLimit: 8 }, cfg) > 0.5, 'drowning');
  assert.equal(dreadLevel({ threat: null, lighthouse: { charge: 100 }, drown: 0, drownLimit: 8 }, cfg), 0);
});

test('lighthouse hum: steady while charged, unstable under the flicker threshold, silent when out; the toll slows with charge', () => {
  const ok = towerHum(100, flicker, 10), low = towerHum(flicker / 2, flicker, 10), out = towerHum(0, flicker, 10);
  assert.ok(ok.gain > 0.01 && ok.wobble === 0 && ok.flick === 0);
  assert.ok(low.wobble > 0 && low.flick > 0 && low.gain < ok.gain);
  assert.deepEqual(out, { gain: 0, wobble: 0, flick: 0 });
  assert.ok(tollInterval(2, flicker) < tollInterval(flicker - 1, flicker), 'the lower the charge, the faster the toll');
  assert.ok(masterCutoff({ band: 'submersion', cold: 0, sinceGrab: -1 }) < 500);
  assert.ok(masterCutoff({ band: 'gue', cold: 5, sinceGrab: -1 }) < 4000);
  assert.ok(masterCutoff({ band: 'gue', cold: 0, sinceGrab: 0.2 }) < 1000 && masterCutoff({ band: 'gue', cold: 0, sinceGrab: 4 }) === 12000);
  assert.ok(swirlInterval('hunt', 10, audibleR) < swirlInterval('roam', 10, audibleR) && swirlInterval('hunt', 5, audibleR) < swirlInterval('hunt', 40, audibleR));
});

// ---- 3. Director on real runs ----
function recordCues(mode, seed = 2026, calm = false) {
  const sim = createSim(data, { seed });
  if (calm) for (const x of sim.state.stations) { x.read = true; x.readable = false; } // flags only: no missed-window defeat during a long idle
  const dir = createDirector({ audibleR, roarR, flicker, debris: sim.world.debris, lighthouse: sim.world.lighthouse, seed: 7 });
  const cues = [];
  sim.subscribe((e) => { for (const c of dir.onEvent(e, sim.state)) cues.push({ t: e.t, ...c }); });
  const bot = createBot(sim, mode);
  for (let i = 0; i < 20000 && !sim.state.outcome; i++) { sim.step(bot()); for (const c of dir.update(sim.state)) cues.push({ t: sim.state.t, ...c }); }
  return { cues, sim };
}

test('director: the noisy run produces water noises, swirls, a roar or growl, a grab and a heartbeat; cues are deterministic', () => {
  const a = recordCues('noisy'), b = recordCues('noisy');
  const kinds = new Set(a.cues.map((c) => c.kind));
  for (const k of ['step', 'swirl', 'grab', 'heartbeat', 'station']) assert.ok(kinds.has(k), `cue ${k}`);
  assert.ok(kinds.has('roar') || kinds.has('growl'), 'a growl');
  assert.equal(JSON.stringify(a.cues), JSON.stringify(b.cues), 'same seed, same cues');
  const swirls = a.cues.filter((c) => c.kind === 'swirl');
  assert.ok(swirls.every((c) => c.dist <= audibleR + 1e-9), 'no swirl beyond threat_audible_radius');
  const growls = a.cues.filter((c) => c.kind === 'roar' || c.kind === 'growl');
  assert.ok(growls.every((c) => c.dist <= roarR + 1e-9), 'no growl beyond threat_cue_roar_radius');
  const wet = new Set(a.cues.filter((c) => c.kind === 'step').map((c) => c.band));
  assert.ok(wet.size >= 2, `steps on several bands: ${[...wet]}`);
});

test('director: the unattended run makes the lighthouse low then out, with alert tolls in between', () => {
  const { cues } = recordCues('idle', 2026, true);
  const low = cues.find((c) => c.kind === 'lh_low'), out = cues.find((c) => c.kind === 'lh_out');
  assert.ok(low && out && low.t < out.t, 'low then out');
  const tolls = cues.filter((c) => c.kind === 'lh_toll');
  assert.ok(tolls.length >= 3, `${tolls.length} tolls`);
  assert.ok(tolls.every((c) => c.t >= low.t && c.t < out.t + 0.5), 'tolls only between low and out');
  const gaps = tolls.slice(1).map((c, i) => c.t - tolls[i].t);
  assert.ok(gaps[gaps.length - 1] < gaps[0], 'the toll quickens as the charge falls');
});

test('director: a reset of the simulation restarts the timers; threat swirl timing follows the mode', () => {
  const dir = createDirector({ audibleR, roarR, flicker, debris: [], lighthouse: { x: 0, z: 0 }, seed: 1 });
  const st = (t) => ({ t, threat: { active: true, mode: 'hunt', dist: 10, x: -10, z: 0 }, lighthouse: { charge: 100 }, drown: 0, drownLimit: 8 });
  const times = []; for (let t = 0; t < 10; t += 0.1) if (dir.update(st(t)).some((c) => c.kind === 'swirl')) times.push(t);
  assert.ok(times.length >= 7 && times.length <= 22, `swirls while hunting: ${times.length}`);
  dir.update(st(50)); // jump forward, then back as after a restart
  assert.ok(dir.update(st(0)).some((c) => c.kind === 'swirl'), 'after a restart the first swirl comes at once');
  const far = { t: 100, threat: { active: true, mode: 'hunt', dist: audibleR + 1, x: 0, z: 0 }, lighthouse: { charge: 100 }, drown: 0, drownLimit: 8 };
  assert.equal(dir.update(far).filter((c) => c.kind === 'swirl').length, 0);
});

// ---- 4. Subtitles ----
test('subtitles: short French texts with the direction of the source, none for the own footsteps', () => {
  const cfg = { audibleR };
  assert.equal(captionFor({ kind: 'swirl', x: -10, z: 0, dist: 10 }, L0, cfg).text, "bruit dans l'eau, à gauche");
  assert.equal(captionFor({ kind: 'swirl', x: 40, z: 0, dist: 40 }, L0, cfg).text, "bruit dans l'eau, à droite, au loin");
  assert.equal(captionFor({ kind: 'swirl', x: -10, z: 0, dist: 10 }, { x: 0, z: 0, yaw: Math.PI }, cfg).text, "bruit dans l'eau, à droite");
  assert.match(captionFor({ kind: 'roar', x: 0, z: 30, dist: 30 }, L0, cfg).text, /^grondement, derrière/);
  assert.equal(captionFor({ kind: 'lh_out' }, L0, cfg).text, "le phare s'éteint");
  assert.equal(captionFor({ kind: 'step', x: 0, z: 0 }, L0, cfg), null);
  assert.equal(captionFor({ kind: 'heartbeat' }, L0, cfg), null);
  for (const c of [{ kind: 'swirl', x: -10, z: 0, dist: 10 }, { kind: 'growl', x: 5, z: -5, dist: 7 }, { kind: 'grab' }, { kind: 'lh_toll', x: 20, z: 0 }]) {
    assert.ok(captionFor(c, L0, cfg).text.length <= 40, 'short');
  }
});

// ---- 5. Settings ----
test('settings: subtitles off by default, values are sanitised, a broken storage never throws', () => {
  assert.deepEqual(DEFAULTS, { volume: 0.8, muted: false, captions: false });
  assert.deepEqual(sanitize({ volume: 7, muted: 'yes', captions: true }), { volume: 1, muted: false, captions: true });
  assert.deepEqual(sanitize(null), DEFAULTS);
  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.deepEqual(loadSettings(broken), DEFAULTS);
  saveSettings(broken, DEFAULTS);
  const mem = new Map(); const ok = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
  saveSettings(ok, { volume: 0.3, muted: true, captions: true });
  assert.deepEqual(loadSettings(ok), { volume: 0.3, muted: true, captions: true });
  assert.deepEqual(loadSettings({ getItem: () => 'not json' }), DEFAULTS);
});
