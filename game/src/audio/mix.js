// Pure mixing rules (no Web Audio): every number that decides what the player hears from the game state.
import { clamp, distanceGain } from './spatial.js';

/** Tide level -> 0..1 over the tide's range. */
export const tideNorm = (level, min, max) => (max > min ? clamp((level - min) / (max - min), 0, 1) : 0);

/**
 * Sea and wind bed for a normalised tide height h (0 = low slack, 1 = high slack).
 * Low tide: distant, thin sea and an open, whistling wind over the flats. High tide: close, heavy sea that covers the wind.
 */
export function ambientMix(h) {
  return {
    seaBody: 0.05 + 0.20 * h, seaBodyCut: 260 + 520 * h,
    seaHiss: 0.015 + 0.060 * h, seaHissFreq: 1800 - 900 * h,
    swellDepth: 0.35 + 0.25 * h,
    windGain: 0.075 - 0.035 * h, windFreq: 620 + 380 * (1 - h),
  };
}

/** Fear level 0..1 from the proximity of the hunting Laisse, the dead lighthouse and the breath counter. */
export function dreadLevel(st, cfg) {
  let d = 0;
  const th = st.threat;
  if (th && th.active && Number.isFinite(th.dist)) {
    const p = Math.pow(clamp(1 - th.dist / cfg.audibleR, 0, 1), 0.7);
    const w = th.mode === 'hunt' ? 1 : th.mode === 'inquire' ? 0.6 : th.mode === 'roam' ? 0.15 : th.mode === 'flee' ? 0.2 : 0.35;
    d = Math.max(d, w * p);
  }
  if (st.lighthouse && st.lighthouse.charge <= 0) d = Math.min(1, d + 0.2);
  if (st.drownLimit > 0) d = Math.max(d, 0.8 * clamp((st.drown / st.drownLimit - 0.4) / 0.6, 0, 1));
  return d;
}

/** Hum of the lighthouse tower: comforting while it is charged, unstable under the flicker threshold, silent when out. */
export function towerHum(charge, flicker, dist, maxDist = 70) {
  if (charge <= 0) return { gain: 0, wobble: 0, flick: 0 };
  const low = charge < flicker ? 1 - charge / flicker : 0;
  return { gain: 0.05 * distanceGain(dist, 8, maxDist) * (1 - 0.5 * low) + 0.004, wobble: 70 * low, flick: 0.85 * low };
}

/** Cutoff (Hz) of the master low-pass: submerged, cold after a first seizure, and the dull ringing right after a seizure. */
export function masterCutoff({ band, cold, sinceGrab }) {
  let c = 12000;
  if (band === 'submersion') c = Math.min(c, 450);
  else if (band === 'eau_haute') c = Math.min(c, 5000);
  if (cold > 0) c = Math.min(c, 3500);
  if (sinceGrab >= 0 && sinceGrab < 3.5) c = Math.min(c, 350 + 3000 * (sinceGrab / 3.5) ** 2);
  return c;
}

/** Seconds between two swirl sounds of the Laisse: faster when it hunts, faster when close. */
export function swirlInterval(mode, dist, R) {
  const base = mode === 'hunt' ? 0.8 : mode === 'inquire' ? 1.6 : mode === 'flee' ? 0.6 : 2.6;
  return base * (0.6 + 0.4 * clamp(dist / R, 0, 1));
}

export const heartbeatInterval = (dread) => 1.05 - 0.55 * clamp(dread, 0, 1);

/** Seconds between two alert tolls once the lighthouse is under the flicker threshold (slower the more charge is left). */
export const tollInterval = (charge, flicker) => 2.5 + 6 * clamp(charge / flicker, 0, 1);
