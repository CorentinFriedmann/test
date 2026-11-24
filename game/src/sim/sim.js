// Pure fixed-step simulation (30 Hz). No three.js, no DOM, no wall clock, no Math.random.
// One call to step(input) advances exactly one tick; rendering never influences the result.
import { param, worldParam } from '../data/load.js';
import { createEnv, stationReadable } from './env.js';
import { generateIsland } from './island.js';
import { createThreat } from './threat.js';
import { hypot, round4 } from './util.js';

export const NEUTRAL_INPUT = Object.freeze({ moveF: 0, moveR: 0, yaw: null, run: false, slow: false, interact: false, lampToggle: false });

export function createSim(data, opts = {}) {
  const seed = opts.seed ?? param(data, 'sim_seed');
  const env = createEnv(data);
  const world = generateIsland(data, env, seed);
  const { hz, dt } = env;
  const P = (id) => param(data, id);
  const duration = P('defeat_time_limit');
  const eyeHeight = P('player_eye_height');
  const lampTotal = P('lamp_battery_seconds');
  const sampleTicks = Math.max(1, Math.round(P('telemetry_sample_period') * hz));
  const towerR = worldParam(data, 'lighthouse_collision_radius');
  const needed = P('victory_stations_required');
  const holdTicks = data.stations.map((s) => Math.round(s.holdS * hz));
  const stationDefs = data.stations;

  // Pass b: noise, lighthouse, threat.
  const useThreat = opts.threat !== false;
  const noiseBase = { slow: P('noise_slow'), walk: P('noise_walk'), run: P('noise_run'), interact: P('noise_interact'), debris: P('noise_debris') };
  const noiseEventTicks = Math.max(1, Math.round(worldParam(data, 'noise_event_period_s') * hz));
  const debrisTicks = Math.round(worldParam(data, 'debris_noise_duration_s') * hz);
  const debrisR = P('debris_collision_radius');
  const decayPerTick = P('lighthouse_charge_decay') * dt, flicker = P('lighthouse_charge_flicker');
  const windTicks = Math.round(P('lighthouse_wind_hold') * hz), windReach = P('lighthouse_wind_reach'), windTo = P('lighthouse_wind_to');
  const coldMult = P('threat_grab_cold_speed_mult'), coldDuration = P('threat_grab_cold_duration'), grabWindow = P('threat_grab_defeat_window');
  const crank = { x: world.lighthouse.x + worldParam(data, 'lighthouse_crank_distance'), z: world.lighthouse.z };
  world.crank = crank;
  const listeners = [];
  // Listener faults (audio, view...) are recorded here, outside the journal and the telemetry, and never reach the simulation.
  const listenerErrors = [];
  const MAX_LISTENER_ERRORS = 50;

  let st, events, samples, threat;

  function reset() {
    const yaw0 = -Math.PI / 2; // facing outwards (+x), away from the tower
    st = {
      tick: 0, t: 0, level: env.tide.levelAt(0), trend: env.tide.trendAt(0),
      player: { x: world.start.x, z: world.start.z, yaw: yaw0, ground: 0, d: 0, band: '', speedMult: 1, eyeHeight },
      lamp: { on: false, battery: lampTotal, total: lampTotal },
      drown: 0, drownLimit: data.bands.find((b) => b.drownTimerS > 0)?.drownTimerS ?? 0,
      reading: null, // { index, ticks, total }
      lighthouse: { charge: P('lighthouse_charge_start'), winding: null }, // winding: { ticks, total }
      noise: { radius: 0, source: 'none' }, debrisTicks: 0, debrisInside: world.debris.map(() => false),
      cold: 0, lastGrab: null, grabs: 0, threat: null,
      stations: stationDefs.map((s, i) => ({ id: s.id, read: false, readable: stationReadable(env, s, 0), progress: 0, index: i })),
      readCount: 0, outcome: null, cause: null, duration,
    };
    events = []; samples = [];
    if (useThreat) { threat = createThreat(data, env, world, seed, log); st.threat = threat.th; }
    const p = st.player;
    p.ground = world.heightAt(p.x, p.z); p.d = st.level - p.ground;
    const band = env.bands.classify(p.d); p.band = band.id; p.speedMult = band.speedMult;
    sample();
  }

  const log = (type, extra = {}) => {
    const e = { t: round4(st.t), type, ...extra };
    events.push(e);
    for (const fn of listeners.slice()) {
      try { fn({ ...e }); } catch (err) {
        const rec = { t: e.t, event: type, message: String(err && err.message || err) };
        if (listenerErrors.length < MAX_LISTENER_ERRORS) listenerErrors.push(rec);
        if (typeof opts.onListenerError === 'function') { try { opts.onListenerError(err, rec); } catch { /* the reporter must not break the step either */ } }
      }
    }
  };
  function sample() {
    const p = st.player;
    samples.push({ t: round4(st.t), x: round4(p.x), z: round4(p.z), band: p.band, d: round4(p.d), level: round4(st.level),
      lamp: round4(st.lamp.battery), drown: round4(st.drown), read: st.readCount,
      charge: round4(st.lighthouse.charge), threat: st.threat?.active ? st.threat.mode : '',
      tx: st.threat?.active ? round4(st.threat.x) : null, tz: st.threat?.active ? round4(st.threat.z) : null });
  }
  function end(outcome, cause, extra) {
    st.outcome = outcome; st.cause = cause;
    log(outcome === 'victory' ? 'victory' : 'defeat', outcome === 'victory' ? {} : { cause, ...extra });
    sample();
  }

  function step(input = NEUTRAL_INPUT) {
    if (st.outcome) return false;
    st.tick++; st.t = st.tick * dt;
    st.level = env.tide.levelAt(st.t); st.trend = env.tide.trendAt(st.t);
    const p = st.player;

    // Lighthouse wear (the only cause in slice P2) and cold wearing off.
    {
      const lh = st.lighthouse, before = lh.charge;
      lh.charge = Math.max(0, lh.charge - decayPerTick);
      if (before >= flicker && lh.charge < flicker) log('lighthouse_low');
      if (before > 0 && lh.charge === 0) log('lighthouse_out');
      st.cold = Math.max(0, st.cold - dt);
    }

    // Lamp: toggle, then drain while lit (battery only, no threat in pass a).
    if (input.lampToggle) {
      if (st.lamp.on) { st.lamp.on = false; log('lamp_off'); } else if (st.lamp.battery > 0) { st.lamp.on = true; log('lamp_on'); }
    }
    if (st.lamp.on) {
      st.lamp.battery = Math.max(0, st.lamp.battery - dt);
      if (st.lamp.battery === 0) { st.lamp.on = false; log('lamp_empty'); }
    }

    // Movement: base speed from the input, scaled by the smoothed depth-band multiplier.
    if (input.yaw !== null && input.yaw !== undefined) p.yaw = input.yaw;
    const prevBand = p.band;
    const band0 = env.bands.classify(st.level - world.heightAt(p.x, p.z));
    p.speedMult += (band0.speedMult - p.speedMult) * Math.min(1, dt / env.smoothS);
    const fx = -Math.sin(p.yaw), fz = -Math.cos(p.yaw), rx = Math.cos(p.yaw), rz = -Math.sin(p.yaw);
    let moveClass = 'walk';
    let mx = fx * input.moveF + rx * input.moveR, mz = fz * input.moveF + rz * input.moveR;
    const len = hypot(mx, mz);
    if (len > 1) { mx /= len; mz /= len; }
    if (len > 0) {
      moveClass = input.run && band0.runAllowed ? 'run' : input.slow ? 'slow' : 'walk';
      const base = env.speeds[moveClass] * (st.cold > 0 ? coldMult : 1);
      p.x += mx * base * p.speedMult * dt;
      p.z += mz * base * p.speedMult * dt;
      const r = hypot(p.x, p.z);
      if (r > env.mapRadius) { p.x *= env.mapRadius / r; p.z *= env.mapRadius / r; }
      const lx = p.x - world.lighthouse.x, lz = p.z - world.lighthouse.z, lr = hypot(lx, lz);
      if (lr < towerR) {
        const nx = lr > 1e-6 ? lx / lr : 1, nz = lr > 1e-6 ? lz / lr : 0;
        p.x = world.lighthouse.x + nx * towerR; p.z = world.lighthouse.z + nz * towerR;
      }
    }
    p.ground = world.heightAt(p.x, p.z); p.d = st.level - p.ground;
    const band = env.bands.classify(p.d); p.band = band.id;
    if (p.band !== prevBand) log('band_change', { band: p.band });

    // Breath counter.
    if (band.drownTimerS > 0) st.drown = Math.min(st.drownLimit, st.drown + dt);
    else st.drown = Math.max(0, st.drown - dt * env.drownDrainRate);

    // Ladders: readable flags, then hold-to-read of the nearest readable ladder in reach.
    for (const s of st.stations) s.readable = !s.read && stationReadable(env, stationDefs[s.index], st.t);
    let target = -1, best = Infinity;
    if (input.interact) {
      world.stations.forEach((w, i) => {
        const def = stationDefs[i];
        const dist = hypot(w.x - p.x, w.z - p.z);
        if (!st.stations[i].read && st.stations[i].readable && dist <= def.reachM && dist < best) { best = dist; target = i; }
      });
    }
    if (target < 0) { st.reading = null; for (const s of st.stations) s.progress = 0; } else {
      if (!st.reading || st.reading.index !== target) { st.reading = { index: target, ticks: 0, total: holdTicks[target] }; for (const s of st.stations) s.progress = 0; }
      st.reading.ticks++;
      st.stations[target].progress = st.reading.ticks / st.reading.total;
      if (st.reading.ticks >= st.reading.total) {
        st.stations[target].read = true; st.stations[target].readable = false; st.stations[target].progress = 1;
        st.readCount++; st.reading = null;
        log('station_read', { id: stationDefs[target].id });
      }
    }

    // Lighthouse crank: hold E within reach of the crank (a ladder in reach has priority; they are never close).
    {
      const lh = st.lighthouse;
      const can = input.interact && target < 0 && lh.charge < windTo && hypot(p.x - crank.x, p.z - crank.z) <= windReach;
      if (!can) lh.winding = null;
      else {
        if (!lh.winding) lh.winding = { ticks: 0, total: windTicks };
        lh.winding.ticks++;
        if (lh.winding.ticks >= lh.winding.total) { lh.charge = windTo; lh.winding = null; log('lighthouse_wound'); }
      }
    }

    // Noise (GDD 6.1): the largest source, never the sum; water multiplies it, debris does not.
    {
      let R = 0, src = 'none';
      const consider = (r, source) => { if (r > R) { R = r; src = source; } };
      if (len > 0) consider(noiseBase[moveClass] * band.noiseMult, moveClass);
      if (st.reading || st.lighthouse.winding) consider(noiseBase.interact * band.noiseMult, 'interact');
      world.debris.forEach((d, i) => {
        const inside = hypot(d.x - p.x, d.z - p.z) <= debrisR;
        if (inside && !st.debrisInside[i]) { st.debrisTicks = debrisTicks; log('debris_hit', { index: i }); }
        st.debrisInside[i] = inside;
      });
      if (st.debrisTicks > 0) { st.debrisTicks--; consider(noiseBase.debris, 'debris'); }
      st.noise.radius = R; st.noise.source = src;
      if (R > 0 && st.tick % noiseEventTicks === 0) log('noise', { src, x: round4(p.x), z: round4(p.z), r: round4(R) });
    }

    // The Laisse.
    let seized = false;
    if (useThreat) {
      const grab = threat.update({
        t: st.t, level: st.level, trend: st.trend, noiseR: st.noise.radius, charge: st.lighthouse.charge, lamp: st.lamp,
        player: { x: p.x, z: p.z, yaw: p.yaw, safe: band.safeFromThreat, wet: p.d >= env.wetDepth },
      });
      if (grab) {
        const second = st.lastGrab !== null && st.t - st.lastGrab <= grabWindow;
        st.grabs++;
        log('grab', { n: second ? 2 : 1 });
        st.reading = null; for (const x of st.stations) x.progress = 0; st.lighthouse.winding = null; // GDD 9 case 9
        if (second) seized = true; else { st.cold = coldDuration; st.lastGrab = st.t; }
      }
    }

    if (st.tick % sampleTicks === 0) sample();

    // Outcome: victory first, then defeats.
    const onPlatform = hypot(p.x - world.lighthouse.x, p.z - world.lighthouse.z) <= world.plateauRadius && band.safeFromThreat;
    if (st.readCount >= needed && onPlatform) { end('victory', null); return true; }
    if (seized) { end('defeat', 'seized'); return true; }
    if (st.drown >= st.drownLimit && st.drownLimit > 0) { end('defeat', 'drowned'); return true; }
    for (let i = 0; i < stationDefs.length; i++) {
      const d = stationDefs[i];
      if (!st.stations[i].read && st.t > d.windowEnd + d.graceS) { end('defeat', 'window_missed', { id: d.id }); return true; }
    }
    if (st.t >= duration) { end('defeat', 'time_up'); return true; }
    return true;
  }

  reset();
  return {
    world, env, data, seed,
    /** Subscribes to every journal event (noise, threat_state, grab...). Returns the unsubscribe function. */
    subscribe(fn) { listeners.push(fn); return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; },
    /** Errors thrown by listeners (kept apart from the deterministic journal; capped at 50). */
    get listenerErrors() { return listenerErrors; },
    get state() { return st; },
    step, reset,
    telemetry() {
      return JSON.parse(JSON.stringify({ version: 1, seed, hz, duration, outcome: st.outcome, cause: st.cause, events, samples }));
    },
  };
}
