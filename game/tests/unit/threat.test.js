// T-029 pass b: noise, la Laisse, saisies, phare. Controlled scenarios place the player and the Laisse by writing the state
// the simulation owns (test-only), then let step() do the work.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadData, param } from '../../src/data/load.js';
import { RAW_CSV } from '../../src/data/generated.js';
import { data, newSim, run } from './helpers.js';
import { NEUTRAL_INPUT, createSim } from '../../src/sim/sim.js';
import { runBot } from '../../src/sim/bot.js';
import { hypot } from '../../src/sim/util.js';

const T = (id) => param(data, id);
const HZ = 30;
const fwd = (extra = {}) => ({ ...NEUTRAL_INPUT, moveF: 1, ...extra });
const types = (sim, ...names) => sim.telemetry().events.filter((e) => names.includes(e.type));

/** Marks the three ladders as read (flags only) so that a long idle scenario is not cut short by a missed-window defeat. */
const calm = (sim) => { for (const x of sim.state.stations) { x.read = true; x.readable = false; } return sim; };

/** First water point (grid scan) whose depth at time t lies in [lo, hi] and that is far from the lighthouse halo. */
function waterSpot(sim, t, lo, hi, from = { x: 0, z: 0 }, minDist = 0) {
  const level = sim.env.tide.levelAt(t), lh = sim.world.lighthouse;
  for (let r = 20; r < 70; r += 1) for (let a = 0; a < 360; a += 5) {
    const x = Math.cos(a * Math.PI / 180) * r, z = Math.sin(a * Math.PI / 180) * r;
    const d = level - sim.world.heightAt(x, z);
    if (d >= lo && d <= hi && hypot(x - lh.x, z - lh.z) > 25 && hypot(x - from.x, z - from.z) >= minDist) return { x, z };
  }
  throw new Error('no water spot');
}

/** Arena at t = 100 s: lighthouse dead (no beam, no halo), Laisse alive, player and Laisse placed `gap` metres apart in the ford. */
function arena(gap, opts = {}) {
  const sim = calm(newSim(opts));
  run(sim, 100 * HZ, NEUTRAL_INPUT);
  const st = sim.state;
  st.lighthouse.charge = 0;
  const spot = waterSpot(sim, 101, 0.3, 0.5);
  st.player.x = spot.x; st.player.z = spot.z;
  const th = st.threat;
  assert.ok(th.active, 'the Laisse is alive at t = 100 s');
  // a point `gap` metres away that is still deep enough for her
  const level = sim.env.tide.levelAt(101);
  let placed = false;
  for (let a = 0; a < 360 && !placed; a += 10) {
    const x = spot.x + Math.cos(a * Math.PI / 180) * gap, z = spot.z + Math.sin(a * Math.PI / 180) * gap;
    if (level - sim.world.heightAt(x, z) >= 0.4 && hypot(x, z) < 70) { th.x = x; th.z = z; placed = true; }
  }
  assert.ok(placed);
  th.mode = 'roam'; th.flee = null;
  return sim;
}

test('noise: radius = base x band multiplier (max of the sources, never the sum), idle = 0', () => {
  const sim = arena(30);
  const st = sim.state; // player in the ford (x1.0)
  run(sim, 2, { ...NEUTRAL_INPUT, yaw: 0 });
  assert.equal(st.player.band, 'gue');
  assert.equal(st.noise.radius, 0);
  run(sim, 2, { ...fwd(), yaw: 0, slow: true });
  assert.equal(st.noise.radius, T('noise_slow'));
  run(sim, 2, { ...fwd(), yaw: 0 });
  assert.equal(st.noise.radius, T('noise_walk') * 1.0);
  run(sim, 2, { ...fwd(), yaw: 0, run: true });
  assert.equal(st.noise.radius, T('noise_run'));
  // several sources at once: the run (18) wins over the reading, no sum
  assert.ok(st.noise.radius < T('noise_run') + T('noise_interact'));
  // dry zone x0.25: walking on the platform
  const sim2 = newSim();
  run(sim2, 3, { ...fwd(), yaw: 0 });
  assert.equal(sim2.state.player.band, 'zone_seche');
  assert.equal(sim2.state.noise.radius, T('noise_walk') * 0.25);
});

test('noise: deep water raises the radius (walking x1.5) and only the platform walk is quiet', () => {
  const sim = calm(newSim());
  run(sim, 230 * HZ, NEUTRAL_INPUT);
  const st = sim.state;
  const spot = waterSpot(sim, 231, 0.65, 1.0);
  st.player.x = spot.x; st.player.z = spot.z;
  run(sim, 2, { ...fwd(), yaw: 0 });
  assert.equal(st.player.band, 'eau_profonde');
  assert.equal(st.noise.radius, T('noise_walk') * 1.5);
});

test('debris: a hit makes a 30 m impulse for 1 s, not multiplied by the water, once per contact; the event reaches subscribers', () => {
  const sim = newSim();
  const seen = [];
  const off = sim.subscribe((e) => { if (e.type === 'noise' || e.type === 'debris_hit') seen.push(e); });
  const d = sim.world.debris[0];
  assert.equal(sim.world.debris.length, T('debris_count'));
  run(sim, 3, NEUTRAL_INPUT);
  sim.state.player.x = d.x; sim.state.player.z = d.z; // lands on the debris, standing still
  run(sim, 1, NEUTRAL_INPUT);
  assert.equal(sim.state.noise.radius, T('noise_debris'));
  assert.equal(sim.state.noise.source, 'debris');
  run(sim, 25, NEUTRAL_INPUT);
  assert.equal(sim.state.noise.radius, T('noise_debris'), 'still loud 0.9 s later');
  run(sim, 6, NEUTRAL_INPUT);
  assert.equal(sim.state.noise.radius, 0, 'impulse over after 1 s although the player still stands on the debris');
  assert.equal(seen.filter((e) => e.type === 'debris_hit').length, 1);
  const n = seen.find((e) => e.type === 'noise' && e.src === 'debris');
  assert.ok(n && n.r === T('noise_debris') && typeof n.x === 'number' && typeof n.z === 'number', 'event carries type, position and intensity');
  off();
  const count = seen.length;
  run(sim, 40, { ...fwd(), yaw: 0 });
  assert.equal(seen.length, count, 'unsubscribed');
  assert.ok(types(sim, 'noise').length > 0, 'noise events are in the telemetry journal');
});

test('noise events: emitted at the configured period while the radius is positive, none when silent', () => {
  const sim = newSim();
  run(sim, 60, NEUTRAL_INPUT);
  assert.equal(types(sim, 'noise').length, 0);
  run(sim, 90, { ...fwd(), yaw: Math.PI });
  const n = types(sim, 'noise');
  assert.ok(n.length >= 5 && n.length <= 7, `events=${n.length}`); // 3 s at 0.5 s
  assert.ok(n.every((e) => e.src === 'walk' && e.r > 0));
});

test('laisse: appears when the rising tide reaches -0.20 m (~57 s) at 45-70 m from the player, in 0.30-1.00 m of water, outside the halo; leaves at -0.30 m falling (~431 s)', () => {
  const sim = calm(newSim());
  run(sim, 56 * HZ, NEUTRAL_INPUT);
  assert.equal(sim.state.threat.active, false);
  run(sim, 2 * HZ, NEUTRAL_INPUT);
  const th = sim.state.threat;
  assert.ok(th.active);
  const sp = types(sim, 'threat_spawn')[0];
  assert.ok(sp.t > 56 && sp.t < 58);
  const p = sim.state.player, lh = sim.world.lighthouse;
  const d = hypot(th.x - p.x, th.z - p.z);
  assert.ok(d >= T('threat_spawn_dist_min') - 0.01 && d <= T('threat_spawn_dist_max') + 0.01, `spawn distance ${d}`);
  const depth = sim.env.tide.levelAt(sp.t) - sim.world.heightAt(sp.x, sp.z);
  assert.ok(depth >= T('threat_water_min_depth') - 0.05 && depth <= 1.0 + 0.05, `spawn depth ${depth}`);
  assert.ok(hypot(sp.x - lh.x, sp.z - lh.z) >= T('lighthouse_halo_radius'));
  sim.state.lighthouse.charge = 100;
  run(sim, 360 * HZ, NEUTRAL_INPUT);
  assert.ok(sim.state.threat.active, 'still there at t = 418 s');
  run(sim, 20 * HZ, NEUTRAL_INPUT);
  assert.equal(sim.state.threat.active, false);
  const gone = types(sim, 'threat_despawn')[0];
  assert.ok(gone.t > 430 && gone.t < 432, `despawn at ${gone.t}`);
});

test('laisse: she never leaves the water (>= 0.30 m) nor enters the lit halo, over a whole game', () => {
  const sim = calm(newSim());
  let worstDepth = Infinity, closest = Infinity;
  for (let i = 0; i < 400 * HZ; i++) {
    sim.step(NEUTRAL_INPUT);
    const th = sim.state.threat;
    if (!th.active) continue;
    // beached by the falling tide is the only legal exception, so only the rising tide and the full-charge period are checked
    if (sim.state.trend > 0) worstDepth = Math.min(worstDepth, sim.state.level - sim.world.heightAt(th.x, th.z));
    if (sim.state.lighthouse.charge > 0) closest = Math.min(closest, hypot(th.x - sim.world.lighthouse.x, th.z - sim.world.lighthouse.z));
  }
  assert.ok(worstDepth >= T('threat_water_min_depth') - 1e-6, `min depth ${worstDepth}`);
  assert.ok(closest >= T('lighthouse_halo_radius') - 1e-6, `closest ${closest}`);
});

test('laisse: heard for 0.4 s she inquires (to the perceived position, error <= 3 m), then hunts; silence sends her back to roam', () => {
  const sim = arena(7);
  const st = sim.state, th = st.threat;
  const toInquire = T('threat_hear_to_inquire');
  // walking in place (alternate forward/back): the ford radius is 8 m, she is at 7 m
  const noisy = (i) => ({ ...NEUTRAL_INPUT, yaw: 0, moveF: i % 2 ? 1 : -1 });
  let n = 0;
  while (th.mode === 'roam' && n < 90) sim.step(noisy(n++));
  assert.equal(th.mode, 'inquire');
  assert.ok(n / HZ >= toInquire - 1e-9 && n / HZ <= toInquire + 0.2, `inquire after ${n / HZ}s`);
  while (th.mode === 'inquire' && n < 400) sim.step(noisy(n++));
  assert.equal(th.mode, 'hunt');
  // the player goes silent: hunt -> inquire after 6 s of silence, then roam after 6 more
  const lose = T('threat_lose_track');
  const far = () => { th.x = st.player.x + 40; th.z = st.player.z; }; // far: she cannot hear nor reach it
  far();
  let s = 0;
  while (th.mode === 'hunt' && s < 20 * HZ) { sim.step({ ...NEUTRAL_INPUT, yaw: 0 }); s++; }
  assert.equal(th.mode, 'inquire');
  assert.ok(s / HZ >= lose - 0.1 && s / HZ <= lose + 0.2, `hunt lost after ${s / HZ}s`);
  s = 0; far(); // (within 6 m a silent player would be hunted again: GDD 6.2)
  while (th.mode === 'inquire' && s < 20 * HZ) { sim.step({ ...NEUTRAL_INPUT, yaw: 0 }); far(); s++; }
  assert.equal(th.mode, 'roam');
  assert.ok(s / HZ >= lose - 0.1 && s / HZ <= lose + 0.2);
  const tr = types(sim, 'threat_state').map((e) => e.to);
  assert.ok(tr.indexOf('inquire') < tr.indexOf('hunt'));
});

test('laisse: a player standing still in the water is heard only within the presence radius (4 m); never on dry ground', () => {
  const far = arena(6), near = arena(3);
  for (const sim of [far, near]) run(sim, 15, NEUTRAL_INPUT); // 0.5 s
  assert.equal(far.state.threat.mode, 'roam', 'at 6 m, immobile: not heard');
  assert.equal(far.state.noise.radius, 0);
  assert.notEqual(near.state.threat.mode, 'roam', 'at 3 m, immobile: presence');
  // dry zone: the platform player is not "present" even next to her
  const dry = newSim();
  run(dry, 60 * HZ, NEUTRAL_INPUT);
  const th = dry.state.threat, p = dry.state.player;
  assert.equal(p.band, 'zone_seche');
  th.x = p.x + 2; th.z = p.z; th.mode = 'roam';
  dry.state.lighthouse.charge = 0;
  run(dry, 1 * HZ, NEUTRAL_INPUT);
  assert.equal(th.heard, false);
});

test('saisie: 0.5 s of contact outside the dry zone = cold (x0.60 for 10 s), recoil 8 m for 6 s; reading and winding are interrupted', () => {
  const sim = arena(1);
  const st = sim.state, th = st.threat;
  st.reading = { index: 0, ticks: 40, total: 150 };
  th.x = st.player.x + 1; th.z = st.player.z; th.mode = 'hunt';
  let n = 0;
  while (st.grabs === 0 && n < 3 * HZ) { sim.step({ ...NEUTRAL_INPUT, yaw: 0 }); n++; }
  assert.equal(st.grabs, 1);
  assert.ok(n / HZ >= T('threat_contact_time') - 0.1 && n / HZ <= T('threat_contact_time') + 0.3, `grab after ${n / HZ}s`);
  assert.equal(st.reading, null);
  assert.equal(st.outcome, null);
  assert.ok(st.cold > T('threat_grab_cold_duration') - 0.2);
  const g = types(sim, 'grab')[0];
  assert.equal(g.n, 1);
  assert.equal(th.mode, 'flee');
  // cold speed: base walk x 0.60 (compare with a clone without cold)
  const p0 = { x: st.player.x, z: st.player.z };
  run(sim, 30, { ...fwd(), yaw: 0 });
  const moved = hypot(st.player.x - p0.x, st.player.z - p0.z) / 1.0;
  assert.ok(moved < T('player_speed_walk') * T('threat_grab_cold_speed_mult') * 0.81 + 0.05, `cold speed ${moved}`); // ford x0.8 too
  // recoil: she backs off 8 m from the grab point then waits for the 6 s to pass
  run(sim, 6 * HZ, NEUTRAL_INPUT);
  assert.notEqual(th.mode, 'flee');
  assert.ok(Math.abs(hypot(th.x - p0.x, th.z - p0.z) - T('threat_grab_recoil_dist')) < 4, 'recoiled about 8 m');
});

test('saisie: a second grab within 45 s is the defeat; after 45 s it counts as a first one (GDD 9 case 14)', () => {
  const sim = arena(1);
  const st = sim.state, th = st.threat;
  const away = () => { th.x = st.player.x + 60; th.z = st.player.z; th.mode = 'roam'; th.flee = null; };
  const grab = () => { th.x = st.player.x + 1; th.z = st.player.z; th.mode = 'hunt'; th.flee = null; const g = st.grabs; let n = 0; while (st.grabs === g && !st.outcome && n < 90) { sim.step({ ...NEUTRAL_INPUT, yaw: 0 }); n++; } };
  grab();
  assert.equal(st.grabs, 1);
  for (let i = 0; i < 46 * HZ; i++) { away(); sim.step(NEUTRAL_INPUT); } // > 45 s later; she stays away, the player stays in the ford
  assert.equal(st.outcome, null, `ended early: ${st.cause}`);
  grab();
  assert.equal(st.grabs, 2);
  assert.equal(st.outcome, null, 'second grab after the window = first grab');
  assert.ok(st.cold > 9);
  for (let i = 0; i < 8 * HZ; i++) { away(); sim.step(NEUTRAL_INPUT); }
  grab();
  assert.equal(st.outcome, 'defeat');
  assert.equal(st.cause, 'seized');
  assert.deepEqual(types(sim, 'grab').map((e) => e.n), [1, 1, 2]);
});

test('dry zone: she cannot grab a player on dry ground; she waits at the bank 10 s, then roams again', () => {
  // High water (t = 240 s, level flat): the platform is the only dry zone and the water starts 1 m beyond its edge (seed 2026, 135 deg).
  const sim = calm(newSim());
  run(sim, 240 * HZ, NEUTRAL_INPUT);
  const st = sim.state, th = st.threat, lh = sim.world.lighthouse, p = st.player;
  st.lighthouse.charge = 0;
  const at = (r) => ({ x: lh.x + Math.cos(Math.PI * 0.75) * r, z: lh.z + Math.sin(Math.PI * 0.75) * r });
  const level = sim.env.tide.levelAt(241);
  assert.ok(level - sim.world.heightAt(at(8).x, at(8).z) > 0.4, 'water next to the platform');
  p.x = at(5.5).x; p.z = at(5.5).z;
  th.x = at(8).x; th.z = at(8).z; th.mode = 'hunt'; th.flee = null;
  let bank = 0;
  for (let i = 0; i < 24 * HZ; i++) {
    sim.step({ ...NEUTRAL_INPUT, yaw: 0, run: true, moveF: i % 2 ? 1 : -1 }); // loud (4.5 m on dry ground) but stays on the platform edge
    if (th.mode === 'bank_wait') bank++;
    assert.equal(st.player.band, 'zone_seche');
    assert.equal(st.grabs, 0, 'no grab in the dry zone');
  }
  assert.ok(bank > 0, 'she waited at the bank');
  assert.ok(types(sim, 'threat_state').some((e) => e.to === 'hunt' || e.from === 'hunt'));
  const ev = types(sim, 'threat_state');
  const i = ev.findIndex((e) => e.to === 'bank_wait');
  assert.ok(i >= 0, 'bank wait entered');
  const end = ev.find((e, k) => k > i && e.from === 'bank_wait');
  assert.ok(end, 'bank wait ended');
  assert.ok(Math.abs(end.t - ev[i].t - T('threat_bank_wait')) < 0.2, `waited ${end.t - ev[i].t}s`);
  assert.equal(end.to, 'roam');
  assert.ok(ev[i].dist >= T('threat_contact_radius') - 0.5, 'she stayed at the bank');
});

test('lighthouse: charge wears 0.5 %/s, flickers below 20 % with a shorter reach, is out at 0 % (200 s)', () => {
  const sim = calm(newSim());
  run(sim, 100 * HZ, NEUTRAL_INPUT);
  assert.ok(Math.abs(sim.state.lighthouse.charge - 50) < 0.05);
  run(sim, 60 * HZ, NEUTRAL_INPUT);
  assert.ok(Math.abs(sim.state.lighthouse.charge - 20) < 0.05);
  run(sim, 100 * HZ, NEUTRAL_INPUT);
  assert.equal(sim.state.lighthouse.charge, 0);
  const ev = types(sim, 'lighthouse_low', 'lighthouse_out');
  assert.deepEqual(ev.map((e) => e.type), ['lighthouse_low', 'lighthouse_out']);
  assert.ok(Math.abs(ev[0].t - 160) < 0.1 && Math.abs(ev[1].t - 200) < 0.1);
});

test('lighthouse: holding E 5 s within 2.5 m of the crank restores 100 % (noise 4 m while winding); leaving or releasing resets', () => {
  const sim = newSim();
  const crank = sim.world.crank;
  run(sim, 90 * HZ, NEUTRAL_INPUT);
  const st = sim.state;
  assert.ok(st.lighthouse.charge < 60);
  assert.ok(hypot(st.player.x - crank.x, st.player.z - crank.z) <= T('lighthouse_wind_reach'), 'start is within reach of the crank');
  run(sim, 100, { ...NEUTRAL_INPUT, interact: true });
  assert.ok(st.lighthouse.winding && st.lighthouse.winding.ticks === 100);
  assert.equal(st.noise.radius, T('noise_interact') * 0.25, 'winding on the platform: 4 m x dry zone 0.25');
  run(sim, 1, NEUTRAL_INPUT);
  assert.equal(st.lighthouse.winding, null, 'released');
  run(sim, 5 * HZ, { ...NEUTRAL_INPUT, interact: true });
  assert.equal(st.lighthouse.charge, T('lighthouse_wind_to'));
  assert.equal(types(sim, 'lighthouse_wound').length, 1);
  // too far: no winding
  const sim2 = newSim();
  run(sim2, 10 * HZ, NEUTRAL_INPUT);
  sim2.state.player.x = crank.x + 4; sim2.state.player.z = crank.z + 4;
  run(sim2, 6 * HZ, { ...NEUTRAL_INPUT, interact: true });
  assert.equal(types(sim2, 'lighthouse_wound').length, 0);
});

test('light: the beam pushes her back for 3 s, the lamp (0.8 s in the cone) for 5 s; the halo stops her while lit', () => {
  // beam: put her in the beam's path at the moment it points at her
  const sim = arena(30);
  const st = sim.state, th = st.threat, lh = sim.world.lighthouse;
  st.lighthouse.charge = 100;
  const t0 = st.t;
  // beam heading at time t: angle = 2 pi t / 8; point her 40 m along it (water or not, the beam test is geometric)
  const theta = (2 * Math.PI * (t0 + 1)) / T('lighthouse_beam_period');
  th.x = lh.x + Math.sin(theta) * 40; th.z = lh.z + Math.cos(theta) * 40; th.mode = 'roam';
  run(sim, 2 * HZ, NEUTRAL_INPUT);
  const flee = types(sim, 'threat_state').find((e) => e.to === 'flee');
  assert.ok(flee && flee.source === 'beam', 'beam made her flee');
  let n = 0; while (th.mode === 'flee' && n < 6 * HZ) { sim.step(NEUTRAL_INPUT); n++; }
  assert.ok(n / HZ > 1.5 && n / HZ <= T('lighthouse_beam_flee') + 0.1, `flee lasted ${n / HZ}s more`);

  // lamp: 0.8 s of continuous light in the cone, then 5 s of flee; beam + lamp do not add up
  const sim2 = arena(8);
  const s2 = sim2.state, t2 = s2.threat, p = s2.player;
  const yaw = Math.atan2(-(t2.x - p.x), -(t2.z - p.z));
  sim2.step({ ...NEUTRAL_INPUT, yaw, lampToggle: true });
  assert.ok(s2.lamp.on);
  let k = 0;
  while (t2.mode !== 'flee' && k < 3 * HZ) { sim2.step({ ...NEUTRAL_INPUT, yaw }); k++; }
  assert.equal(t2.mode, 'flee');
  assert.ok(k / HZ >= T('lamp_flee_after') - 0.1 && k / HZ <= T('lamp_flee_after') + 0.2, `lamp took ${k / HZ}s`);
  const until = t2.flee.until;
  assert.ok(Math.abs(until - (s2.t + T('lamp_flee_duration'))) < 0.1);

  // halo: lit lighthouse forbids the disc; dead lighthouse does not
  const sim3 = newSim();
  run(sim3, 60 * HZ, NEUTRAL_INPUT);
  const a = sim3.state.threat, lh3 = sim3.world.lighthouse;
  a.x = lh3.x + 16; a.z = lh3.z; a.mode = 'hunt';
  sim3.state.player.x = lh3.x; sim3.state.player.z = lh3.z + 1; // she would walk straight in
  let inside = false;
  for (let i = 0; i < 4 * HZ; i++) { sim3.step(NEUTRAL_INPUT); if (hypot(a.x - lh3.x, a.z - lh3.z) < T('lighthouse_halo_radius') - 0.01) inside = true; }
  assert.equal(inside, false, 'lit halo keeps her out');
});

test('determinism: same seed, same inputs = same Laisse, same journal; another seed differs; data changes change behaviour', () => {
  const play = (seed) => { const s = createSim(data, { seed }); runBot(s, 'noisy'); return JSON.stringify(s.telemetry()); };
  assert.equal(play(2026), play(2026));
  assert.notEqual(play(2026), play(11));
  // data-driven: a longer contact time in menace.csv delays the grab, no code change
  const slow = loadData({ ...RAW_CSV, menace: RAW_CSV.menace.replace(/^threat_contact_time,menace,0.5,/m, 'threat_contact_time,menace,5,') });
  assert.equal(slow.params.threat_contact_time, 5);
  const grabT = (d) => { const s = createSim(d, {}); runBot(s, 'noisy'); return s.telemetry().events.find((e) => e.type === 'grab')?.t ?? Infinity; };
  assert.ok(grabT(slow) > grabT(data) + 3);
});

test('bots: the prudent bot wins despite the Laisse (rewinds the lighthouse, never seized); the noisy bot is seized twice and loses', () => {
  const a = createSim(data, {});
  const st = runBot(a, 'prudent');
  assert.equal(st.outcome, 'victory');
  assert.equal(st.grabs, 0);
  const ev = a.telemetry().events;
  assert.ok(ev.some((e) => e.type === 'threat_spawn'));
  assert.ok(ev.filter((e) => e.type === 'lighthouse_wound').length >= 2);
  assert.ok(ev.some((e) => e.type === 'threat_state' && e.source === 'beam'), 'the beam repelled her');

  const b = createSim(data, {});
  const sb = runBot(b, 'noisy');
  assert.equal(sb.outcome, 'defeat');
  assert.equal(sb.cause, 'seized');
  assert.deepEqual(b.telemetry().events.filter((e) => e.type === 'grab').map((e) => e.n), [1, 2]);
});
