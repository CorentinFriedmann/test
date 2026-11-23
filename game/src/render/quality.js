// Render-only settings. They never reach the simulation (the parity test proves it).
export const QUALITY = {
  low: { pixelRatioMax: 1, rocks: 14, waterBump: false, antialias: false },
  high: { pixelRatioMax: 2, rocks: 40, waterBump: true, antialias: false },
};
export function qualityFromUrl(search) {
  const q = new URLSearchParams(search).get('q');
  return q && QUALITY[q] ? q : 'high';
}
