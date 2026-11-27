// Visual cues of the Laisse when the player cannot hear (T-043, spec C3). Render side only: it reads state.threat (active, dist, mode)
// and returns numbers for the view (ripples at her position, edge vignette). Nothing is ever written back to the simulation.
// Distances: nothing beyond FAR_M; ripples from 0.15 opacity at FAR_M to 0.50 at NEAR_M; vignette from 0 to 0.45 on the same range.
export const FAR_M = 25;
export const NEAR_M = 8;
export const RING_OPACITY = [0.15, 0.50];
export const RING_MAX_RADIUS = 3;
export const RING_LIFE_S = 1.5;
export const VIGNETTE_MAX = 0.45;
const MODE_K = { roam: 0.5, inquire: 0.8, hunt: 1.0, flee: 0.2, bank_wait: 0.3 };
const RISE_S = 0.5, FALL_S = 1.5, PULSE_HZ = 1.2, PULSE = 0.1, DRY_K = 0.5;

/** 0 at FAR_M and beyond, 1 at NEAR_M and closer (linear in the distance). */
export const closeness = (dist) => (dist > FAR_M ? 0 : dist <= NEAR_M ? 1 : (FAR_M - dist) / (FAR_M - NEAR_M));

/** Ripple opacity: none beyond 25 m, 0.15 at 25 m, up to 0.50 at 8 m and closer. */
export function ringOpacity(dist) {
  if (dist > FAR_M) return 0;
  return RING_OPACITY[0] + (RING_OPACITY[1] - RING_OPACITY[0]) * closeness(dist);
}

/** Seconds between two ripples: 1.2 s while she roams or investigates (and in any other active mode), 0.6 s while she hunts. */
export const ringPeriod = (mode) => (mode === 'hunt' ? 0.6 : 1.2);

/** Vignette target (before smoothing and pulse): 0 to 0.45 by distance, times the mode factor, halved on a dry zone. */
export function vignetteTarget(dist, mode, playerSafe) {
  const k = MODE_K[mode] ?? 0;
  return VIGNETTE_MAX * closeness(dist) * k * (playerSafe ? DRY_K : 1);
}

/**
 * Stateful smoother and ripple clock. update(threat, safe, simT, dt) returns the same object each call (no allocation):
 *   { ring: true when a new ripple is due, ringOpacity, vignette }.
 * simT is the simulation time (frozen while paused, so nothing spawns on the pause screen); dt is the real frame time (s).
 */
export function createThreatCues() {
  const out = { ring: false, ringOpacity: 0, vignette: 0 };
  let v = 0, nextRing = 0, lastT = 0;
  return {
    reset() { v = 0; nextRing = 0; lastT = 0; out.ring = false; out.ringOpacity = 0; out.vignette = 0; },
    update(th, safe, simT, dt) {
      if (simT < lastT) { v = 0; nextRing = 0; }
      lastT = simT;
      out.ring = false;
      const on = !!th && th.active && th.mode !== 'dormant';
      const target = on ? vignetteTarget(th.dist, th.mode, safe) : 0;
      const step = (VIGNETTE_MAX / (target > v ? RISE_S : FALL_S)) * dt;
      v = target > v ? Math.min(target, v + step) : Math.max(target, v - step);
      out.vignette = th && th.mode === 'hunt' && on ? v * (1 + PULSE * Math.sin(2 * Math.PI * PULSE_HZ * simT)) : v;
      out.ringOpacity = on ? ringOpacity(th.dist) : 0;
      if (out.ringOpacity > 0 && simT >= nextRing) { out.ring = true; nextRing = simT + ringPeriod(th.mode); }
      return out;
    },
  };
}
