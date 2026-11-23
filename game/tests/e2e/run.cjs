// Headless browser scenarios (Playwright + Chromium, software WebGL). Usage: node tests/e2e/run.cjs (after npm run build).
// The page is driven through window.__estran: scripted players (bots) feed the same sim.step() as the keyboard.
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const root = path.resolve(__dirname, '..', '..');
const base = 'file://' + path.join(root, 'dist/estran.html');
const outDir = path.join(root, 'captures');
fs.mkdirSync(outDir, { recursive: true });

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

async function openPage(browser, query = '') {
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const problems = [];
  // Chromium's software GL driver (SwiftShader) emits this performance notice by itself; it is not produced by the game.
  const driverNoise = /GL Driver Message .*GPU stall due to ReadPixels/;
  page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !driverNoise.test(m.text())) problems.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e}`));
  await page.goto(base + query);
  await page.waitForFunction(() => window.__estran, null, { timeout: 20000 });
  await page.evaluate(() => { window.__estran.hideIntro(); window.__estran.setManual(true); });
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

(async () => {
  const browser = await chromium.launch();

  // ---- 1. Boot, HUD without rule text ----
  {
    const g = await openPage(browser);
    await g.frames(3);
    const s = await g.st();
    check('WebGL2 context', s.gl === 'webgl2', s.gl);
    const hudText = await g.page.evaluate(() => document.getElementById('hud').innerText.replace(/\s+/g, ' ').trim());
    check('HUD shows no rule text at start (objective line only)', /^(Lisez les trois échelles de marée\.)?$/.test(hudText), JSON.stringify(hudText));
    const parts = await g.page.evaluate(() => ['gauge', 'pastilles', 'lamp', 'ring'].map((id) => !!document.getElementById(id)));
    check('HUD parts present: tide gauge, 3 pastilles, lamp, interaction ring', parts.every(Boolean) && (await g.page.evaluate(() => document.querySelectorAll('.pastille').length)) === 3);
    check('Simulation starts at tick 0, seed 2026 world has 3 ladders', s.tick === 0 && (await g.page.evaluate(() => window.__estran.getWorld().stations.length)) === 3);
    check('No console error or warning at boot', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }

  // ---- 2. Winning bot (reads S1, S2, S3, returns to the platform) ----
  let winLog;
  {
    const g = await openPage(browser, '?q=high');
    await g.frames(2);
    await g.shot('estran-depart.png');
    await g.page.evaluate(() => window.__estran.setBot('win'));
    await g.until((s) => s.t >= 58);
    await g.shot('estran-marche.png');
    const reading = await g.until((s) => s.stations[0].progress > 0.5);
    check('HUD ring fills while reading S1', await g.page.evaluate(() => document.getElementById('ring').classList.contains('active')) && reading.stations[0].progress > 0.5, `progress=${reading.stations[0].progress.toFixed(2)}`);
    await g.shot('estran-lecture-s1.png');
    await g.until((s) => s.stations[1].read);
    const pastilles = await g.page.evaluate(() => [...document.querySelectorAll('.pastille')].map((e) => e.getAttribute('class')));
    check('Pastilles: S1 and S2 read (filled)', pastilles[0].includes('read') && pastilles[1].includes('read'), pastilles.join(' / '));
    const high = await g.until((s) => s.t >= 238);
    await g.shot('estran-maree-haute.png');
    check('Tide gauge follows the level (high water, nearly full)', (await g.page.evaluate(() => parseFloat(document.getElementById('gauge-fill').style.height))) > 95, `level=${high.level.toFixed(2)}`);
    const end = await g.until((s) => !!s.outcome, 20000, 60);
    await g.frames(2);
    await g.shot('estran-victoire.png');
    check('Win scenario: bot reads the 3 ladders and wins', end.outcome === 'victory' && end.readCount === 3, `t=${end.t.toFixed(1)} s`);
    const card = await g.page.evaluate(() => document.getElementById('card').classList.contains('on') && document.getElementById('card-text').textContent);
    check('Victory card shown', card === 'Les trois relevés sont faits.', String(card));
    winLog = await g.tel();
    const reads = winLog.events.filter((e) => e.type === 'station_read');
    check('Journal lists the 3 readings in order, inside their windows', reads.map((e) => e.id).join() === 'S1_flot,S2_haute,S3_jusant' && reads[2].t >= 380 && reads[2].t <= 427, reads.map((e) => `${e.id}@${e.t}`).join(' '));
    // Restart (R) replays the very same game.
    await g.page.keyboard.press('KeyR');
    await g.frames(2);
    const s0 = await g.st();
    check('R restarts: tick 0, no outcome, card hidden', s0.tick === 0 && !s0.outcome && !(await g.page.evaluate(() => document.getElementById('card').classList.contains('on'))));
    await g.until((s) => !!s.outcome, 20000, 600);
    check('Same seed after restart gives the identical journal', JSON.stringify(await g.tel()) === JSON.stringify(winLog));
    check('No console error or warning during the win run', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }

  // ---- 3. Drowning bot ----
  {
    const g = await openPage(browser);
    await g.page.evaluate(() => window.__estran.setBot('drown'));
    const mid = await g.until((s) => s.drown > 3);
    const vignette = await g.page.evaluate(() => parseFloat(document.getElementById('vignette-drown').style.opacity));
    await g.shot('estran-noyade.png');
    check('Drowning vignette grows with the breath counter', vignette > 0.2, `opacity=${vignette}`);
    const end = await g.until((s) => !!s.outcome, 20000, 15);
    await g.frames(2);
    const card = await g.page.evaluate(() => document.getElementById('card-text').textContent);
    check('Drown scenario: defeat by drowning, card "La mer a gagné."', end.outcome === 'defeat' && end.cause === 'drowned' && card === 'La mer a gagné.', `t=${end.t.toFixed(1)} cause=${end.cause}`);
    check('No console error or warning during the drown run', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }

  // ---- 4. Missed window ----
  {
    const g = await openPage(browser);
    await g.page.evaluate(() => window.__estran.setBot('idle'));
    const end = await g.until((s) => !!s.outcome, 20000, 30);
    await g.frames(2);
    const card = await g.page.evaluate(() => document.getElementById('card-text').textContent);
    check('Idle scenario: S1 window missed at t ~ 110 s, card "Relevé manqué."', end.cause === 'window_missed' && end.t > 110 && end.t < 111 && card === 'Relevé manqué.', `t=${end.t.toFixed(2)}`);
    await g.page.close();
  }

  // ---- 5. Parity: two render settings, two stepping modes, identical journal ----
  {
    const a = await openPage(browser, '?q=low');
    await a.page.evaluate(() => window.__estran.setBot('win'));
    await a.until((s) => !!s.outcome, 20000, 600);
    const logLow = await a.tel();
    await a.page.close();

    const b = await openPage(browser, '?q=high');
    await b.page.evaluate(() => { window.__estran.setBot('win'); window.__estran.setManual(false); window.__estran.setSpeed(60); });
    await b.page.waitForFunction(() => window.__estran.getState().outcome, null, { timeout: 120000 });
    const logHigh = await b.tel();
    const sb = await b.st();
    check('Render quality low vs high (and real-time vs manual stepping): identical simulation journal', JSON.stringify(logLow) === JSON.stringify(logHigh) && sb.quality === 'high', `${logLow.events.length} events, ${logLow.samples.length} samples`);
    check('Parity run matches the win run of scenario 2', JSON.stringify(logLow) === JSON.stringify(winLog));
    check('No console error or warning during the real-time run', b.problems.length === 0, b.problems.slice(0, 3).join(' | '));
    await b.page.close();
  }

  // ---- 6. Human input path: keyboard moves the player and F toggles the lamp ----
  {
    const g = await openPage(browser);
    await g.page.evaluate(() => { window.__estran.setManual(false); });
    const p0 = (await g.st()).player;
    await g.page.keyboard.down('KeyD'); // strafe, away from the tower
    await g.page.waitForTimeout(1500);
    await g.page.keyboard.up('KeyD');
    const p1 = (await g.st()).player;
    check('Keyboard input moves the player through the fixed-step simulation', Math.hypot(p1.x - p0.x, p1.z - p0.z) > 0.3, `moved ${Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(2)} m`);
    await g.page.keyboard.press('KeyF');
    await g.page.waitForTimeout(300);
    check('F toggles the lamp', (await g.st()).lamp.on === true);
    check('No console error or warning on the keyboard run', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `${failed} check(s) FAILED` : `ALL ${results.length} E2E CHECKS PASSED`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
