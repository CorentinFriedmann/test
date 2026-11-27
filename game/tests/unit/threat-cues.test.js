// T-043 C3: visual cues of the Laisse (ripples at her position, edge vignette): thresholds, cadence, smoothing, pulse, dry zone.
// They are numbers computed from state.threat only; the simulation never reads them back (see also render.cjs for the parity).
import test from 'node:test';
import assert from 'node:assert/strict';
import { closeness, ringOpacity, ringPeriod, vignetteTarget, createThreatCues, FAR_M, NEAR_M, VIGNETTE_MAX, RING_MAX_RADIUS, RING_LIFE_S } from '../../src/render/threat-cues.js';

const near = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;

test('ripples: none beyond 25 m, 0.15 at 25 m, rising linearly to 0.50 at 8 m and closer', () => {
  assert.equal([FAR_M, NEAR_M].join(), '25,8');
  assert.equal(ringOpacity(25.01), 0); assert.equal(ringOpacity(60), 0);
  assert.ok(near(ringOpacity(25), 0.15));
  assert.ok(near(ringOpacity(8), 0.5)); assert.ok(near(ringOpacity(3), 0.5));
  assert.ok(near(ringOpacity(16.5), 0.325), 'half way');
  for (let d = 25; d > 8; d -= 1) assert.ok(ringOpacity(d - 1) >= ringOpacity(d));
  assert.equal(RING_MAX_RADIUS, 3); assert.equal(RING_LIFE_S, 1.5);
});

test('ripple cadence: 1.2 s while she roams or investigates, 0.6 s while she hunts', () => {
  assert.equal(ringPeriod('roam'), 1.2); assert.equal(ringPeriod('inquire'), 1.2); assert.equal(ringPeriod('hunt'), 0.6);
  const cues = createThreatCues();
  const th = { active: true, mode: 'roam', dist: 12 };
  let n = 0;
  for (let t = 0; t < 12; t += 1 / 30) if (cues.update(th, false, t, 1 / 30).ring) n++;
  assert.ok(n >= 9 && n <= 11, `roam: ${n} ripples in 12 s`);
  const h = createThreatCues(); th.mode = 'hunt'; n = 0;
  for (let t = 0; t < 12; t += 1 / 30) if (h.update(th, false, t, 1 / 30).ring) n++;
  assert.ok(n >= 19 && n <= 21, `hunt: ${n} ripples in 12 s`);
});

test('no ripple and no vignette when she is inactive, dormant, absent (?threat=0) or farther than 25 m', () => {
  const c = createThreatCues();
  for (const th of [null, { active: false, mode: 'dormant', dist: 5 }, { active: true, mode: 'dormant', dist: 5 }, { active: true, mode: 'hunt', dist: 40 }]) {
    let any = false;
    for (let t = 0; t < 5; t += 0.1) { const o = c.update(th, false, t, 0.1); any = any || o.ring || o.vignette > 0 || o.ringOpacity > 0; }
    assert.equal(any, false, JSON.stringify(th));
  }
});

test('vignette target: 0 beyond 25 m, linear to 0.45 at 8 m, times the mode factor, halved on a dry zone', () => {
  assert.equal(closeness(30), 0); assert.equal(closeness(8), 1); assert.equal(closeness(2), 1); assert.ok(near(closeness(16.5), 0.5));
  assert.equal(vignetteTarget(30, 'hunt', false), 0);
  assert.ok(near(vignetteTarget(8, 'hunt', false), VIGNETTE_MAX));
  assert.ok(near(vignetteTarget(8, 'roam', false), VIGNETTE_MAX * 0.5));
  assert.ok(near(vignetteTarget(8, 'inquire', false), VIGNETTE_MAX * 0.8));
  assert.ok(near(vignetteTarget(8, 'flee', false), VIGNETTE_MAX * 0.2));
  assert.ok(near(vignetteTarget(8, 'bank_wait', false), VIGNETTE_MAX * 0.3));
  assert.ok(near(vignetteTarget(8, 'hunt', true), VIGNETTE_MAX * 0.5), 'protected on the dry zone');
  assert.ok(near(vignetteTarget(16.5, 'hunt', false), VIGNETTE_MAX * 0.5));
  assert.equal(VIGNETTE_MAX, 0.45);
});

test('vignette smoothing: up in 0.5 s, down in 1.5 s; pulse of +-10 % at 1.2 Hz only while she hunts; never a flash', () => {
  const c = createThreatCues(), th = { active: true, mode: 'inquire', dist: 8 };
  let prev = 0, t = 0, maxStep = 0;
  for (; t < 0.5 - 1e-9; t += 1 / 60) { const v = c.update(th, false, t, 1 / 60).vignette; maxStep = Math.max(maxStep, v - prev); prev = v; }
  const target = VIGNETTE_MAX * 0.8;
  assert.ok(prev >= target * 0.97 && prev <= target + 1e-9, `after 0.5 s: ${prev} of ${target}`);
  assert.ok(maxStep < 0.02, `no jump: ${maxStep}`);
  th.active = false;
  let s = 0; for (let i = 0; i < 30; i++) { s = c.update(th, false, t += 1 / 60, 1 / 60).vignette; }
  assert.ok(s > 0.15, `after 0.5 s of falling still ${s} (slow descent: 1.5 s for the full scale)`);
  for (let i = 0; i < 90; i++) { s = c.update(th, false, t += 1 / 60, 1 / 60).vignette; }
  assert.ok(s < 1e-6, `gone after 2 s: ${s}`);
  // pulse
  const h = createThreatCues(), th2 = { active: true, mode: 'hunt', dist: 8 }; let lo = 9, hi = -9;
  for (let k = 0; k < 240; k++) { const v = h.update(th2, false, k / 60, 1 / 60).vignette; if (k > 60) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }
  assert.ok(near(hi, VIGNETTE_MAX * 1.1, 0.01) && near(lo, VIGNETTE_MAX * 0.9, 0.01), `pulse ${lo}..${hi}`);
  const r = createThreatCues(), th3 = { active: true, mode: 'roam', dist: 8 }; lo = 9; hi = -9;
  for (let k = 0; k < 240; k++) { const v = r.update(th3, false, k / 60, 1 / 60).vignette; if (k > 60) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }
  assert.ok(hi - lo < 1e-9, 'no pulse outside the hunt');
});

test('no allocation: update() returns the same object every call; the clock going back (restart) resets the cues', () => {
  const c = createThreatCues(), th = { active: true, mode: 'roam', dist: 10 };
  const a = c.update(th, false, 5, 0.03), b = c.update(th, false, 5.03, 0.03);
  assert.equal(a, b);
  assert.equal(c.update(th, false, 0, 0.03).ring, true, 'a new game (time went back) starts the ripples again at once');
  assert.equal(c.update(th, false, 0.03, 0.03).ring, false, 'then the cadence applies');
});
