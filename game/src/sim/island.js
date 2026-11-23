// Deterministic procedural island (GDD 8 and 17): flat lighthouse platform, low terrain elsewhere, 3 ladders.
import { param, worldParam } from '../data/load.js';
import { mulberry32, hashStr, valueNoise } from './rng.js';
import { readInterval } from './env.js';
import { walkRay, planDeparture } from './walk.js';
import { hypot } from './util.js';

export function createHeightFn(data, seed) {
  const W = (id) => worldParam(data, id);
  const R = W('island_radius');
  const lh = { x: W('lighthouse_x'), z: W('lighthouse_z') };
  const plateauR = param(data, 'lighthouse_plateau_radius');
  const plateauH = param(data, 'lighthouse_plateau_height');
  const dome = W('terrain_dome_height'), off = W('terrain_dome_offset');
  const aLo = W('terrain_noise_low_amp'), fLo = W('terrain_noise_low_freq');
  const aHi = W('terrain_noise_high_amp'), fHi = W('terrain_noise_high_freq');
  const capStart = W('terrain_softcap_start'), capMax = W('terrain_softcap_max');
  const rng = mulberry32(seed);
  const ox = rng() * 1000, oz = rng() * 1000, s1 = (rng() * 1e9) | 0, s2 = (rng() * 1e9) | 0;

  const softCap = (h) => (h <= capStart ? h : capStart + (capMax - capStart) * Math.tanh((h - capStart) / (capMax - capStart)));
  function terrain(x, z) {
    const r = hypot(x, z) / R;
    const base = dome * (1 - r * r) + off;
    const n = (valueNoise((x + ox) * fLo, (z + oz) * fLo, s1) - 0.5) * aLo + (valueNoise((x + ox) * fHi, (z + oz) * fHi, s2) - 0.5) * aHi;
    return softCap(base + n * Math.max(0, 1 - r * 0.6));
  }
  const heightAt = (x, z) => (hypot(x - lh.x, z - lh.z) <= plateauR ? plateauH : terrain(x, z));
  return { heightAt, lighthouse: lh, plateauRadius: plateauR, plateauHeight: plateauH };
}

/**
 * Builds the island and places the ladders. A candidate point is accepted when its ground is within the
 * altitude tolerance of the ladder, it lies in the distance ring of the GDD, and a straight walk from the
 * platform start reaches it in time without drowning and comes back before the end of the slice.
 */
export function generateIsland(data, env, seed) {
  const W = (id) => worldParam(data, id);
  const base = createHeightFn(data, seed);
  const { heightAt, lighthouse: lh } = base;
  const tol = W('station_altitude_tolerance'), minSep = W('station_min_separation');
  const startOffset = W('player_start_offset');
  const start = { x: lh.x + startOffset, z: lh.z };
  const holdMargin = 0.5;
  const placed = [];

  for (const st of data.stations) {
    const dMin = W(`place_${st.id}_dist_min`), dMax = W(`place_${st.id}_dist_max`);
    const interval = readInterval(env, st);
    const rng = mulberry32((seed ^ hashStr(st.id)) >>> 0);
    const cands = [];
    for (let i = 0; i < 20000; i++) {
      const a = rng() * Math.PI * 2, dist = dMin + (dMax - dMin) * rng();
      const x = lh.x + Math.cos(a) * dist, z = lh.z + Math.sin(a) * dist;
      if (hypot(x, z) > env.mapRadius - 10) continue;
      const err = Math.abs(heightAt(x, z) - st.altitude);
      if (err <= tol) cands.push({ x, z, err });
    }
    cands.sort((p, q) => p.err - q.err);
    let chosen = null;
    for (const c of cands) {
      if (placed.some((p) => hypot(p.x - c.x, p.z - c.z) < minSep)) continue;
      const t0 = planDeparture(env, heightAt, start, c, interval, 0);
      const go = walkRay(env, heightAt, start, c, t0);
      if (go.maxSub > 4) continue;
      const readEnd = Math.max(go.arrival, interval.from) + st.holdS;
      if (readEnd > interval.to - holdMargin) continue;
      const back = walkRay(env, heightAt, c, start, readEnd);
      if (back.arrival > env.tide.duration - 5 || back.maxSub > 4) continue;
      chosen = c; break;
    }
    if (!chosen) throw new Error(`island: no valid position for ladder ${st.id} (seed ${seed})`);
    placed.push({ id: st.id, x: chosen.x, z: chosen.z, ground: heightAt(chosen.x, chosen.z), altitude: st.altitude, interval });
  }
  return { ...base, seed, start, stations: placed, mapRadius: env.mapRadius, islandRadius: W('island_radius') };
}
