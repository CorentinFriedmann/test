// Render-only settings. They never reach the simulation (the parity tests prove it, see tests/e2e/render.cjs).
// Rule (GDD 12): quality levels change cost and finish only. Fog, rock placement, the Laisse visibility rule and
// every light that decides what the player can see are identical on the three levels.
export const QUALITY = {
  low: {
    pixelRatioMax: 1, scale: 0.8, antialias: false, rockDetail: 0, terrainBump: false, waterOctaves: 1, waterGlint: false,
    grain: false, beamSegments: 12, laisseRadial: 6, laisseTendrils: 3, laisseNoise: false,
  },
  medium: {
    pixelRatioMax: 1.5, scale: 1, antialias: false, rockDetail: 1, terrainBump: true, waterOctaves: 2, waterGlint: true,
    grain: true, beamSegments: 18, laisseRadial: 9, laisseTendrils: 5, laisseNoise: true,
  },
  high: {
    pixelRatioMax: 2, scale: 1, antialias: true, rockDetail: 2, terrainBump: true, waterOctaves: 3, waterGlint: true,
    grain: true, beamSegments: 24, laisseRadial: 12, laisseTendrils: 7, laisseNoise: true,
  },
};

export function qualityFromUrl(search) {
  const q = new URLSearchParams(search).get('q');
  return q && QUALITY[q] ? q : 'high';
}

// Lighting moments (GDD 12). Night is the P2 slice; dawn (victory) and grey day are starting points "a regler".
// Colours are hex numbers, the rest numeric, so two moments can be blended field by field.
export const MOMENTS = {
  night: {
    bg: 0x101c2a, fog: 0.018, sun: 0x6f8fc0, sunI: 1.1, sunPos: [-30, 40, 25], amb: 0x2a3a55, ambI: 1.4,
    hemiSky: 0x3a5078, hemiGround: 0x0c1014, hemiI: 0.9, beam: 1, lantern: 1, glow: 0.85,
    waterDeep: 0x12304a, waterShallow: 0x1d4a66, foam: 0x9db4c6, sand: 1,
    grain: 0.022, vignette: 0.5, vignetteColor: 0x02060a,
  },
  dawn: {
    bg: 0x6e7c8c, fog: 0.012, sun: 0xe8b58a, sunI: 1.6, sunPos: [60, 9, -30], amb: 0x5a6677, ambI: 1.2,
    hemiSky: 0x7f8b9c, hemiGround: 0x34383e, hemiI: 0.8, beam: 0, lantern: 0.35, glow: 0.2,
    waterDeep: 0x3a566e, waterShallow: 0x587890, foam: 0xdfe3e6, sand: 1.25,
    grain: 0.012, vignette: 0.3, vignetteColor: 0x161a20,
  },
  day: {
    bg: 0x8a9499, fog: 0.010, sun: 0xbfc7cc, sunI: 0.9, sunPos: [10, 60, 10], amb: 0x8a949b, ambI: 1.8,
    hemiSky: 0x9aa4aa, hemiGround: 0x4a4c50, hemiI: 0.6, beam: 0, lantern: 0.2, glow: 0.1,
    waterDeep: 0x41596a, waterShallow: 0x6b8794, foam: 0xe4e8ea, sand: 1.3,
    grain: 0.018, vignette: 0.28, vignetteColor: 0x1a1d20,
  },
};

export function momentFromUrl(search) {
  const m = new URLSearchParams(search).get('moment');
  return m && MOMENTS[m] ? m : 'night';
}

// Fixed visual constants (kept here, not scattered in the scene code).
export const LOOK = {
  lampColor: 0xdfe9ff, lampIntensity: 220, lampAngleDeg: 26,
  beamColor: 0xfff0cc, beamIntensity: 9000, beamAngleDeg: 9, beamConeRadius: 5, beamConeLength: 70, beamOpacity: 0.16,
  laisseBaseDrop: 1.1, laisseLitFadeIn: 8, laisseLitFadeOut: 0.15,
  victoryBlendSeconds: 2.5,
  wetBand: 0.55,
};

const hex = (c) => [(c >> 16 & 255), (c >> 8 & 255), (c & 255)];
const unhex = ([r, g, b]) => (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
/** Blends two moments (k = 0 gives a, k = 1 gives b). Pure; used for the victory dawn. */
export function blendMoments(a, b, k) {
  const out = {};
  for (const key of Object.keys(a)) {
    const va = a[key], vb = b[key];
    if (Array.isArray(va)) out[key] = va.map((x, i) => x + (vb[i] - x) * k);
    else if (/^(bg|sun|amb|hemiSky|hemiGround|waterDeep|waterShallow|foam|vignetteColor)$/.test(key)) {
      const ha = hex(va), hb = hex(vb); out[key] = unhex(ha.map((x, i) => x + (hb[i] - x) * k));
    } else out[key] = va + (vb - va) * k;
  }
  return out;
}
