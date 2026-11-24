// Pure geometry of the sound field (no Web Audio, no DOM): pan, distance gain, direction labels.
// World convention shared with the simulation: forward = (-sin yaw, -cos yaw), right = (cos yaw, -sin yaw).
export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/** Source position relative to the listener: distance, metres ahead (f) and to the right (r). */
export function relative(listener, src) {
  const dx = src.x - listener.x, dz = src.z - listener.z;
  const fx = -Math.sin(listener.yaw), fz = -Math.cos(listener.yaw);
  const rx = Math.cos(listener.yaw), rz = -Math.sin(listener.yaw);
  return { dist: Math.hypot(dx, dz), f: dx * fx + dz * fz, r: dx * rx + dz * rz };
}

/** Stereo pan in [-1, 1] (-1 = left ear). Close to the head the pan is relaxed toward the centre (no hard swing at 20 cm). */
export function panOf(listener, src, near = 1.5) {
  const { dist, r } = relative(listener, src);
  if (dist < 1e-6) return 0;
  return clamp((r / dist) * Math.min(1, dist / near), -1, 1);
}

/** Gain 1 inside `ref`, 1/d beyond, faded to exactly 0 at `max` (monotonic decreasing). */
export function distanceGain(dist, ref, max) {
  if (dist >= max) return 0;
  const d = Math.max(dist, ref);
  return (ref / d) * (1 - (d / max) * (d / max));
}

/** Low-pass cutoff (Hz) that dulls a source with distance: 12 kHz close, 700 Hz at `max`. */
export function cutoffFor(dist, max, top = 12000, bottom = 700) {
  return top * Math.pow(bottom / top, clamp(dist / max, 0, 1));
}

const SECTORS = ['devant', 'devant à droite', 'à droite', 'derrière à droite', 'derrière', 'derrière à gauche', 'à gauche', 'devant à gauche'];
/** Index 0..7 of the 45 degree sector of the source around the listener (0 = ahead, clockwise). */
export function sectorOf(listener, src) {
  const { f, r } = relative(listener, src);
  const a = Math.atan2(r, f); // 0 ahead, +pi/2 right
  return ((Math.round(a / (Math.PI / 4)) % 8) + 8) % 8;
}
export const sectorLabel = (listener, src) => SECTORS[sectorOf(listener, src)];
