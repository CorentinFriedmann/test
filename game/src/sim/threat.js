// La Laisse (GDD 6.2): hears, never sees. Pure, deterministic (own seeded generator advanced by simulation ticks only).
// Every number comes from menace.csv (or monde.csv for what the GDD leaves out); nothing is tuned in this file.
import { param, worldParam } from '../data/load.js';
import { mulberry32, hashStr } from './rng.js';
import { hypot } from './util.js';

export const MODES = Object.freeze({ DORMANT: 'dormant', ROAM: 'roam', INQUIRE: 'inquire', HUNT: 'hunt', FLEE: 'flee', BANK: 'bank_wait' });

/**
 * @param log (type, extra) => void : event journal of the simulation.
 * Returns { th (public, read-only for others), update(ctx) }.
 * ctx = { t, level, trend, player: {x, z, yaw, safe, wet}, noiseR, lamp: {on}, charge }
 * update() returns true on the tick a grab happens (the simulation applies the consequences).
 */
export function createThreat(data, env, world, seed, log) {
  const P = (id) => param(data, id), W = (id) => worldParam(data, id);
  const dt = env.dt;
  const rng = mulberry32((seed ^ hashStr('laisse')) >>> 0);
  const rand = (a, b) => a + (b - a) * rng();
  const lh = world.lighthouse;
  const C = {
    spawnLevel: P('threat_spawn_level'), despawnLevel: P('threat_despawn_level'),
    spawnMin: P('threat_spawn_dist_min'), spawnMax: P('threat_spawn_dist_max'), minDepth: P('threat_water_min_depth'),
    vRoam: P('threat_speed_roam'), vInquire: P('threat_speed_inquire'), vHunt: P('threat_speed_hunt'), vFlee: P('threat_speed_flee'),
    wpMin: P('threat_waypoint_min'), wpMax: P('threat_waypoint_max'), wpPerMin: P('threat_waypoint_period_min'), wpPerMax: P('threat_waypoint_period_max'),
    curAfter: P('threat_curiosity_after'), curMin: P('threat_curiosity_dist_min'), curMax: P('threat_curiosity_dist_max'),
    presence: P('threat_presence_radius'), toInquire: P('threat_hear_to_inquire'), toHunt: P('threat_hear_to_hunt'),
    huntOverride: P('threat_hunt_dist_override'), lose: P('threat_lose_track'), bankWait: P('threat_bank_wait'),
    contactR: P('threat_contact_radius'), contactT: P('threat_contact_time'),
    recoilT: P('threat_grab_recoil'), recoilD: P('threat_grab_recoil_dist'), locErr: P('noise_location_error'),
    beamHalf: P('lighthouse_beam_half_angle') * Math.PI / 180, beamReach: P('lighthouse_beam_reach'), beamFlee: P('lighthouse_beam_flee'),
    beamPeriod: P('lighthouse_beam_period'), halo: P('lighthouse_halo_radius'), flicker: P('lighthouse_charge_flicker'),
    lampHalf: P('lamp_half_angle') * Math.PI / 180, lampReach: P('lamp_reach'), lampAfter: P('lamp_flee_after'), lampFlee: P('lamp_flee_duration'),
    depthMaxSpawn: W('threat_spawn_depth_max'), tries: W('threat_spawn_tries'), retry: W('threat_spawn_retry_s'),
    relaxAfter: W('threat_spawn_relax_after_s'), relaxDist: W('threat_spawn_dist_relaxed'), refresh: W('threat_perceive_refresh_s'),
    arrive: W('threat_arrive_radius'), bankDist: W('threat_bank_stand_dist'), wpTries: W('threat_waypoint_tries'),
    steerStep: W('threat_steer_step_deg') * Math.PI / 180, steerMax: W('threat_steer_max_deg') * Math.PI / 180, lit: W('threat_lit_duration_s'),
    mapR: env.mapRadius,
  };

  const th = {
    phase: 'before', // before | active | gone
    active: false, mode: MODES.DORMANT, x: 0, z: 0,
    dist: Infinity, heard: false, lit: 0, flee: null, bankUntil: 0,
  };
  let hearAcc = 0, silence = 0, contact = 0, lampAcc = 0, wetNoContact = 0;
  let perceived = null, perceiveTimer = 0, lastKnown = null, target = null;
  let wpUntil = 0, wp = null, steerSign = 1, stuck = 0, spawnAt = 0, spawnFirst = -1;
  let level = 0, charge = 100, now = 0;

  const depth = (x, z) => level - world.heightAt(x, z);
  const haloR = () => (charge > 0 ? C.halo : 0);
  const setMode = (m, t, extra = {}) => {
    if (th.mode === m) return;
    log('threat_state', { from: th.mode, to: m, x: Math.round(th.x * 100) / 100, z: Math.round(th.z * 100) / 100, dist: Math.round(th.dist * 100) / 100, ...extra });
    th.mode = m;
    if (m !== MODES.FLEE) th.flee = null;
    stuck = 0;
  };

  /** A point the Laisse may stand on: enough water, inside the map, outside the halo. */
  function standable(x, z) {
    if (hypot(x, z) > C.mapR) return false;
    if (depth(x, z) < C.minDepth) return false;
    return hypot(x - lh.x, z - lh.z) >= haloR();
  }
  /** Move allowed from the current point: valid, or leading out of a forbidden area (tide falling under her, halo lit around her). */
  function stepOk(nx, nz) {
    if (hypot(nx, nz) > C.mapR) return false;
    if (depth(nx, nz) < C.minDepth && depth(nx, nz) <= depth(th.x, th.z)) return false;
    const dh = hypot(nx - lh.x, nz - lh.z), h = haloR();
    if (dh < h && dh < hypot(th.x - lh.x, th.z - lh.z)) return false;
    return true;
  }
  /** Moves up to speed * dt along (dx, dz), steering around forbidden ground. Returns true when she moved. */
  function moveDir(dx, dz, speed, maxStep = Infinity, needProgress = true) {
    const len = hypot(dx, dz);
    if (len < 1e-9) return false;
    const ux = dx / len, uz = dz / len, step = Math.min(speed * dt, maxStep);
    const offsets = [0];
    for (let a = C.steerStep; a <= C.steerMax + 1e-9; a += C.steerStep) offsets.push(a * steerSign, -a * steerSign);
    for (const a of offsets) {
      const c = Math.cos(a), s = Math.sin(a);
      const vx = ux * c - uz * s, vz = ux * s + uz * c;
      if (needProgress && vx * ux + vz * uz < 0.2) continue;
      const nx = th.x + vx * step, nz = th.z + vz * step;
      if (stepOk(nx, nz)) {
        if (a !== 0) steerSign = a > 0 ? 1 : -1;
        th.x = nx; th.z = nz; return true;
      }
    }
    return false;
  }
  function goTo(tx, tz, speed) {
    const dx = tx - th.x, dz = tz - th.z, d = hypot(dx, dz);
    if (d <= C.arrive) return 'arrived';
    return moveDir(dx, dz, speed, d) ? 'moving' : 'blocked';
  }

  function startFlee(t, duration, from, recoil = false) {
    const until = t + duration;
    if (th.mode === MODES.FLEE) { // beam and lamp never add up: the longest flee wins
      if (until > th.flee.until) th.flee.until = until;
      return;
    }
    setMode(MODES.FLEE, t, { source: recoil ? 'grab' : from.source });
    th.flee = { until, from: { x: from.x, z: from.z }, left: recoil ? C.recoilD : Infinity };
  }

  function pickWaypoint(p) {
    const curious = wetNoContact >= C.curAfter;
    const lo = curious ? C.curMin : C.wpMin, hi = curious ? C.curMax : C.wpMax;
    for (let i = 0; i < C.wpTries; i++) {
      const a = rng() * Math.PI * 2, d = rand(lo, hi);
      const x = p.x + Math.cos(a) * d, z = p.z + Math.sin(a) * d;
      if (standable(x, z)) { wp = { x, z }; return; }
    }
  }

  function trySpawn(t, p) {
    if (spawnFirst < 0) spawnFirst = t;
    const minD = t - spawnFirst >= C.relaxAfter ? C.relaxDist : C.spawnMin;
    for (let i = 0; i < C.tries; i++) {
      const a = rng() * Math.PI * 2, d = rand(minD, C.spawnMax);
      const x = p.x + Math.cos(a) * d, z = p.z + Math.sin(a) * d;
      const dd = depth(x, z);
      if (dd < C.minDepth || dd > C.depthMaxSpawn || !standable(x, z)) continue;
      th.phase = 'active'; th.active = true; th.x = x; th.z = z;
      th.dist = hypot(x - p.x, z - p.z);
      th.mode = MODES.ROAM; hearAcc = 0; silence = 0; contact = 0; wp = null; wpUntil = 0; perceived = null; lastKnown = null; target = null;
      log('threat_spawn', { x: Math.round(x * 100) / 100, z: Math.round(z * 100) / 100, dist: Math.round(th.dist * 100) / 100 });
      return;
    }
    spawnAt = t + C.retry;
  }

  function beamHit() {
    if (charge <= 0) return false;
    const reach = charge >= C.flicker ? C.beamReach : C.beamReach * charge / C.flicker;
    const dx = th.x - lh.x, dz = th.z - lh.z, d = hypot(dx, dz);
    if (d > reach) return false;
    const th0 = (now / C.beamPeriod) * Math.PI * 2; // beam heading, same as the rotating mesh
    const diff = Math.atan2(Math.sin(Math.atan2(dx, dz) - th0), Math.cos(Math.atan2(dx, dz) - th0));
    return Math.abs(diff) <= C.beamHalf;
  }
  function lampHit(p) {
    const dx = th.x - p.x, dz = th.z - p.z, d = hypot(dx, dz);
    if (d > C.lampReach) return false;
    const a = Math.atan2(-dx, -dz); // yaw such that forward = (-sin yaw, -cos yaw)
    const diff = Math.atan2(Math.sin(a - p.yaw), Math.cos(a - p.yaw));
    return Math.abs(diff) <= C.lampHalf;
  }

  function update(c) {
    const { t, player: p } = c;
    level = c.level; charge = c.charge; now = t;
    th.heard = false;
    if (th.phase === 'gone') return false;
    if (th.phase === 'before') {
      if (c.level >= C.spawnLevel && c.trend > 0 && t >= spawnAt) trySpawn(t, p);
      if (!th.active) return false;
    } else if (c.level < C.despawnLevel && c.trend < 0) {
      th.phase = 'gone'; th.active = false;
      log('threat_despawn', {}); th.mode = MODES.DORMANT; th.flee = null;
      return false;
    }

    th.dist = hypot(p.x - th.x, p.z - th.z);
    th.lit = Math.max(0, th.lit - dt);

    // Hearing: noise disc around the player, or presence when outside the dry zone.
    const heard = (c.noiseR > 0 && th.dist <= c.noiseR) || (!p.safe && th.dist <= C.presence);
    th.heard = heard;
    if (heard) {
      silence = 0;
      perceiveTimer -= dt;
      if (!perceived || perceiveTimer <= 0) {
        const a = rng() * Math.PI * 2, r = C.locErr * Math.sqrt(rng());
        perceived = { x: p.x + Math.cos(a) * r, z: p.z + Math.sin(a) * r };
        perceiveTimer = C.refresh;
      }
      lastKnown = { x: p.x, z: p.z };
    } else silence += dt;

    // Light: lighthouse beam and lamp push her back (longest flee wins).
    if (beamHit()) { th.lit = C.lit; startFlee(t, C.beamFlee, { ...lh, source: 'beam' }); }
    if (c.lamp.on && lampHit(p)) {
      th.lit = C.lit; lampAcc += dt;
      if (lampAcc >= C.lampAfter) { startFlee(t, C.lampFlee, { x: p.x, z: p.z, source: 'lamp' }); lampAcc = 0; }
    } else lampAcc = 0;

    // Curiosity timer: player in the water with no contact for curiosity_after seconds.
    if (!p.wet || th.dist <= C.contactR) wetNoContact = 0; else wetNoContact += dt;

    switch (th.mode) {
      case MODES.FLEE: {
        const f = th.flee;
        if (t >= f.until) { setMode(MODES.ROAM, t); hearAcc = 0; wp = null; wpUntil = 0; break; }
        if (f.left > 0) {
          let dx = th.x - f.from.x, dz = th.z - f.from.z;
          if (hypot(dx, dz) < 1e-6) { dx = 1; dz = 0; }
          const before = { x: th.x, z: th.z };
          moveDir(dx, dz, C.vFlee, f.left, false);
          f.left -= hypot(th.x - before.x, th.z - before.z);
          if (th.x === before.x && th.z === before.z) f.left = 0;
        }
        break;
      }
      case MODES.ROAM: {
        if (heard) hearAcc += dt; else if (silence >= C.lose) hearAcc = 0;
        if (hearAcc >= C.toInquire) { setMode(MODES.INQUIRE, t); hearAcc = 0; silence = 0; target = perceived; break; }
        if (!wp || t >= wpUntil) { pickWaypoint(p); wpUntil = t + rand(C.wpPerMin, C.wpPerMax); }
        if (wp) { const r = goTo(wp.x, wp.z, C.vRoam); if (r === 'blocked') { stuck += dt; if (stuck >= 1) { wp = null; stuck = 0; } } }
        break;
      }
      case MODES.INQUIRE: {
        if (heard) { hearAcc += dt; target = perceived; }
        if (hearAcc >= C.toHunt || th.dist < C.huntOverride) { setMode(MODES.HUNT, t); hearAcc = 0; silence = 0; break; }
        if (silence >= C.lose) { setMode(MODES.ROAM, t); hearAcc = 0; wp = null; wpUntil = 0; break; }
        if (target) goTo(target.x, target.z, C.vInquire);
        break;
      }
      case MODES.HUNT: {
        if (silence >= C.lose) { setMode(MODES.INQUIRE, t); hearAcc = 0; silence = 0; target = lastKnown; break; }
        const goal = lastKnown ?? p;
        const r = goTo(goal.x, goal.z, C.vHunt);
        if (p.safe && (r === 'blocked' || th.dist <= C.bankDist)) { setMode(MODES.BANK, t); th.bankUntil = t + C.bankWait; }
        break;
      }
      case MODES.BANK: {
        if (t >= th.bankUntil) { setMode(MODES.ROAM, t); hearAcc = 0; silence = 0; wp = null; wpUntil = 0; }
        break;
      }
      default: break;
    }

    // Contact: continuous, outside the dry zone, never while she is falling back.
    if (th.mode !== MODES.FLEE && !p.safe && hypot(p.x - th.x, p.z - th.z) <= C.contactR) contact += dt; else contact = 0;
    if (contact >= C.contactT - 1e-9) {
      contact = 0; wetNoContact = 0;
      startFlee(t, C.recoilT, { x: p.x, z: p.z }, true);
      return true;
    }
    th.dist = hypot(p.x - th.x, p.z - th.z);
    return false;
  }

  return { th, update };
}
