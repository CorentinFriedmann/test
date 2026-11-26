// T-041: cold load time to the first displayed frame, in headless Chromium (software GL / SwiftShader: indicative only, not a real GPU).
// Usage: node tests/p2/timing-load.cjs [trials=5]   (needs dist/estran-p2.html: npm run build). Outside `npm run all`.
// Each trial launches a NEW browser (empty cache, fresh JS engine state = cold). The page exposes no internal timing, so the
// terrain/height-texture generation is not separable in the browser: we report the total up to the hooks (all module code and
// scene construction run synchronously before window.__estran exists) and up to the first painted frame. The sim-side
// terrain generation (createSim) is timed under Node by tests/p2/timing.mjs.
const { chromium } = require('playwright');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const file = path.resolve(__dirname, '..', '..', 'dist/estran-p2.html');
const N = Number(process.argv[2]) || 5;
const q = (process.argv[3] || '').replace(/^q=/, ''); // optional quality: low | medium | high

(async () => {
  if (!fs.existsSync(file)) { console.error('dist/estran-p2.html missing: run npm run build first'); process.exit(1); }
  const rows = [];
  let version = '';
  for (let i = 0; i < N; i++) {
    const browser = await chromium.launch();
    version = browser.version();
    const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
    const t0 = Date.now();
    await page.goto(`file://${file}?test=1${q ? '&q=' + q : ''}`, { waitUntil: 'commit' });
    await page.waitForFunction(() => window.__estran, null, { timeout: 30000, polling: 'raf' });
    const r = await page.evaluate(() => new Promise((res) => {
      const hooks = performance.now(); // ms since navigation start: all scripts and scene construction are done
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const paint = performance.getEntriesByType('paint').map((p) => [p.name, p.startTime]);
        const nav = performance.getEntriesByType('navigation')[0];
        res({ hooks, frame2: performance.now(), dcl: nav.domContentLoadedEventEnd, loadEnd: nav.loadEventEnd, paint, state: window.__estran.getState().quality });
      }));
    }));
    r.wall = Date.now() - t0; r.firstPaint = (r.paint.find((p) => p[0] === 'first-paint') || [0, null])[1];
    rows.push(r);
    await browser.close();
  }
  const f = (x) => (x === null ? 'n/a' : x.toFixed(0));
  console.log(`T-041 cold load | ${new Date().toISOString().slice(0, 10)} | node ${process.version} | ${os.cpus().length} cores ${os.cpus()[0].model} | Chromium ${version} (headless, SwiftShader) | quality ${rows[0].state}`);
  console.log('trial  scene ready, upper bound (hooks) ms   first paint of the page ms   2nd frame ms   DOMContentLoaded ms   load event ms   wall ms');
  rows.forEach((r, i) => console.log(`${String(i + 1).padStart(5)}  ${f(r.hooks).padStart(20)}   ${f(r.firstPaint).padStart(14)}   ${f(r.frame2).padStart(12)}   ${f(r.dcl).padStart(19)}   ${f(r.loadEnd).padStart(13)}   ${String(r.wall).padStart(7)}`));
  const col = (k) => rows.map((r) => r[k]).filter((x) => x !== null).sort((a, b) => a - b);
  for (const k of ['hooks', 'firstPaint', 'frame2']) { const c = col(k); if (c.length) console.log(`${k.padEnd(10)} min ${f(c[0])}  median ${f(c[Math.floor(c.length / 2)])}  mean ${f(c.reduce((a, b) => a + b, 0) / c.length)}  max ${f(c[c.length - 1])} ms`); }
  console.log('JSON ' + JSON.stringify(rows.map(({ paint, ...r }) => r)));
})();
