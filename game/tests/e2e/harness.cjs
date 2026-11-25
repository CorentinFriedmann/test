// Shared helpers of the headless browser scenarios (Playwright + Chromium, software WebGL).
// The page is driven through window.__estran: scripted players (bots) feed the same sim.step() as the keyboard.
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const root = path.resolve(__dirname, '..', '..');
const base = 'file://' + path.join(root, 'dist/estran-p2.html');
// Captures written by the tests go to an ignored folder, so that `npm test` never modifies versioned files.
// `npm run captures` sets ESTRAN_CAPTURE_DIR=captures to refresh the versioned screenshots on demand.
const outDir = process.env.ESTRAN_CAPTURE_DIR ? path.resolve(root, process.env.ESTRAN_CAPTURE_DIR) : path.join(root, 'captures', '.tmp');
fs.mkdirSync(outDir, { recursive: true });

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

async function openPage(browser, query = '', opts = {}) {
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const problems = [];
  // Chromium's software GL driver (SwiftShader) emits this performance notice by itself; it is not produced by the game.
  const driverNoise = /GL Driver Message .*GPU stall due to ReadPixels/;
  page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !driverNoise.test(m.text())) problems.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e}`));
  // ?test=1 exposes window.__estran, which the published P2 build hides by default.
  await page.goto(base + (query ? `${query}&test=1` : '?test=1'));
  await page.waitForFunction(() => window.__estran, null, { timeout: 20000 });
  // opts.gesture: a real click on the intro (user activation, as a player would), so that the audio can start.
  if (opts.gesture) { await page.click('#intro'); await page.evaluate(() => window.__estran.setManual(true)); } else await page.evaluate(() => { window.__estran.hideIntro(); window.__estran.setManual(true); });
  const api = {
    page, problems,
    st: () => page.evaluate(() => window.__estran.getState()),
    tel: () => page.evaluate(() => window.__estran.getTelemetry()),
    frames: (n = 2) => page.evaluate((n) => new Promise((r) => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); f(); }), n),
    // Advances the simulation (fixed ticks) until pred(state) is true or maxTicks elapsed; renders a frame every `chunk` ticks.
    async until(pred, maxTicks = 20000, chunk = 30) {
      let s = await api.st();
      for (let n = 0; n < maxTicks && !pred(s) && !s.outcome; n += chunk) {
        await page.evaluate((c) => window.__estran.advance(c), chunk);
        await api.frames(1);
        s = await api.st();
      }
      return s;
    },
    shot: (name) => page.screenshot({ path: path.join(outDir, name) }),
  };
  return api;
}

module.exports = { chromium, root, base, outDir, results, check, openPage };
