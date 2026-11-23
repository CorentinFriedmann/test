export const hypot = (a, b) => Math.sqrt(a * a + b * b);
export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
export const round4 = (v) => Math.round(v * 1e4) / 1e4;
