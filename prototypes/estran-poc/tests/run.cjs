// Headless test + screenshots. Runs with the preinstalled Playwright/Chromium (software WebGL).
// Usage: node tests/run.cjs   (after npm run build)
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const root = path.resolve(__dirname, '..');
const page_url = 'file://' + path.join(root, 'dist/estran-poc.html');
const outDir = path.join(root, 'captures');
fs.mkdirSync(outDir, { recursive: true });

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(page_url);
  await page.waitForFunction(() => window.__estran, null, { timeout: 20000 });
  await page.evaluate(() => window.__estran.hideIntro());
  const st = () => page.evaluate(() => window.__estran.getState());
  const frames = (n) => page.evaluate((n) => new Promise((r) => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); f(); }), n);

  await frames(5);
  const s0 = await st();
  check('WebGL2 context', s0.gl === 'webgl2', s0.gl);

  // Tide: low water vs high water (deterministic via the clock hook), levels must differ clearly.
  await page.evaluate(() => { window.__estran.setTideClock(0); window.__estran.setBeamClock(0); window.__estran.setPlayer(10, 6, Math.PI * 0.95, -0.1); });
  await frames(3);
  const low = await st();
  await page.screenshot({ path: path.join(outDir, 'estran-poc-maree-basse.png') });
  await page.evaluate(() => window.__estran.setTideClock(45));
  await frames(3);
  const high = await st();
  await page.screenshot({ path: path.join(outDir, 'estran-poc-maree-haute.png') });
  check('Water rises between low and high tide', high.tideLevel - low.tideLevel > 2.5, `${low.tideLevel.toFixed(2)} -> ${high.tideLevel.toFixed(2)} m`);

  // Natural progression of the tide clock in real time.
  await page.evaluate(() => window.__estran.setTideClock(10));
  const a = (await st()).tideClock; await frames(20); const b = (await st()).tideClock;
  check('Tide clock advances by itself', b > a, `${a.toFixed(2)} -> ${b.toFixed(2)}`);

  // Beam rotates.
  const b1 = (await st()).beamAngle; await frames(20); const b2 = (await st()).beamAngle;
  check('Lighthouse beam rotates', Math.abs(b2 - b1) > 0.01, `${b1.toFixed(3)} -> ${b2.toFixed(3)} rad`);
  await page.evaluate(() => { window.__estran.setTideClock(20); window.__estran.setBeamClock(1.78); window.__estran.setPlayer(12, 10, 0.62, 0.08); });
  await frames(3);
  await page.screenshot({ path: path.join(outDir, 'estran-poc-phare.png') });

  // First-person movement: hold W, position must change in the facing direction.
  await page.evaluate(() => window.__estran.setPlayer(10, 10, 0, 0));
  const p0 = (await st()).player;
  await page.keyboard.down('KeyW');
  await new Promise((r) => setTimeout(r, 1500));
  await page.keyboard.up('KeyW');
  const p1 = (await st()).player;
  check('Player moves forward with W', p0.z - p1.z > 0.5 && Math.abs(p1.x - p0.x) < 0.01, `dz=${(p1.z - p0.z).toFixed(2)}`);
  check('Camera follows terrain height', Math.abs(p1.eyeY - (await page.evaluate(([x, z]) => window.__estran.heightAt(x, z) + 1.7, [p1.x, p1.z]))) < 1e-6);

  // Flashlight toggle.
  await page.keyboard.press('KeyF');
  check('Flashlight toggles with F', (await st()).flashlight === false);
  await page.keyboard.press('KeyF');

  // Final player view (flashlight on, night) for the main screenshot.
  await page.evaluate(() => { window.__estran.setTideClock(30); window.__estran.setBeamClock(1.2); window.__estran.setPlayer(14, 18, 0.62, -0.2); });
  await frames(3);
  await page.screenshot({ path: path.join(outDir, 'estran-poc-joueur.png') });

  // Software-rendering timing only: NOT representative of a real GPU.
  await page.setViewportSize({ width: 960, height: 540 });
  await new Promise((r) => setTimeout(r, 2500));
  const sf = await st();
  console.log(`INFO  software-render fps=${sf.fps.toFixed(1)} drawCalls=${sf.drawCalls} triangles=${sf.triangles} (SwiftShader, not representative)`);
  check('No console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  check('Screenshots produced', ['maree-basse', 'maree-haute', 'phare', 'joueur'].every((n) => fs.statSync(path.join(outDir, `estran-poc-${n}.png`)).size > 5000));

  await browser.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `${failed} test(s) FAILED` : `ALL ${results.length} CHECKS PASSED`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
