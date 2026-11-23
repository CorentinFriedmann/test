// Straight-line walking model (coarse, 0.1 s step) used by the island generator and by the test bots.
import { hypot } from './util.js';

/**
 * Walks from `from` to within `stop` metres of `to`, starting at time t0, at walking speed scaled by the depth band.
 * Returns the arrival time and the longest continuous time spent in a band with a drown timer.
 */
export function walkRay(env, heightAt, from, to, t0, stop = 1.0) {
  const step = 0.1;
  let x = from.x, z = from.z, t = t0, sub = 0, maxSub = 0;
  for (let guard = 0; guard < 20000; guard++) {
    const dx = to.x - x, dz = to.z - z, dist = hypot(dx, dz);
    if (dist <= stop) break;
    const d = env.tide.levelAt(t) - heightAt(x, z);
    const band = env.bands.classify(d);
    if (band.drownTimerS > 0) { sub += step; if (sub > maxSub) maxSub = sub; } else sub = 0;
    const v = env.speeds.walk * band.speedMult * step;
    x += (dx / dist) * Math.min(v, dist);
    z += (dz / dist) * Math.min(v, dist);
    t += step;
  }
  return { arrival: t, maxSub };
}

/** Earliest departure time (>= tNow, 1 s granularity) so that the walker arrives when the station becomes readable. */
export function planDeparture(env, heightAt, from, to, interval, tNow) {
  let t0 = tNow;
  for (; t0 < env.tide.duration; t0 += 1) {
    if (walkRay(env, heightAt, from, to, t0).arrival >= interval.from + 0.5) break;
  }
  return t0;
}
