// Shared pure environment: tide, bands and player speeds, all read from the CSV data.
import { createTide, createBands } from './tide.js';
import { param, worldParam } from '../data/load.js';

export function createEnv(data) {
  const hz = Math.round(1 / param(data, 'sim_step'));
  return {
    data,
    tide: createTide(data.tide),
    bands: createBands(data.bands),
    hz,
    dt: 1 / hz,
    speeds: { slow: param(data, 'player_speed_slow'), walk: param(data, 'player_speed_walk'), run: param(data, 'player_speed_run') },
    smoothS: param(data, 'player_speed_smooth'),
    mapRadius: worldParam(data, 'map_radius'),
    /** Breath counter drain, in counter-seconds per second (GDD 3: full counter empties in drown_recovery_s). */
    drownDrainRate: (data.bands.find((b) => b.drownTimerS > 0)?.drownTimerS ?? 0) / worldParam(data, 'drown_recovery_s'),
  };
}

/** Depth d = water level - ground altitude (GDD 2). */
export const depthAt = (env, heightAt, t, x, z) => env.tide.levelAt(t) - heightAt(x, z);

/** Is a station readable at time t (depth range and tide trend), whatever the player position? */
export function stationReadable(env, station, t) {
  const d = env.tide.levelAt(t) - station.altitude;
  if (d < station.readDepthMin || d > station.readDepthMax) return false;
  return station.requiredTrend === 0 || env.tide.trendAt(t) === station.requiredTrend;
}

/** First contiguous time interval where the station is readable (scan at the simulation step). */
export function readInterval(env, station) {
  let from = null, to = null;
  const n = Math.round(env.tide.duration * env.hz);
  for (let i = 0; i <= n; i++) {
    const t = i * env.dt;
    if (stationReadable(env, station, t)) { if (from === null) from = t; to = t; } else if (from !== null) break;
  }
  if (from === null) throw new Error(`station ${station.id} is never readable`);
  return { from, to };
}
