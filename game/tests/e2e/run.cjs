// Headless browser scenarios (gameplay, parity, scripted players). Usage: node tests/e2e/run.cjs (after npm run build).
const { chromium, check, results, openPage } = require('./harness.cjs');

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
    await g.page.waitForTimeout(2800); // the victory dawn blends in over 2.5 s of real time
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

  // ---- 7. Prudent bot: wins despite the Laisse by rewinding the lighthouse (pass b) ----
  {
    const g = await openPage(browser, '?q=high');
    await g.page.evaluate(() => { window.__ev = []; window.__estran.subscribe((e) => window.__ev.push(e)); window.__estran.setBot('prudent'); });
    const spawned = await g.until((s) => !!s.threat && s.threat.active);
    check('The Laisse appears with the rising tide (T-037: from t ~ 40 s, first valid point at 15-35 m)', spawned.t > 39 && spawned.t < 70, `t=${spawned.t.toFixed(1)}`);
    const wind = await g.until((s) => s.lighthouse.winding > 0.4 && s.readCount >= 1);
    const ringOn = await g.page.evaluate(() => document.getElementById('ring').classList.contains('active'));
    await g.frames(2);
    await g.shot('estran-phare-manivelle.png');
    check('HUD ring fills while rewinding the lighthouse; lighthouse gauge shown', ringOn && (await g.page.evaluate(() => !!document.getElementById('phare-fill'))), `progress=${wind.lighthouse.winding.toFixed(2)}`);
    const dim = await g.until((s) => s.t >= 150);
    const w = await g.page.evaluate(() => parseFloat(document.getElementById('phare-fill').style.width));
    check('Lighthouse gauge tracks the charge (kept high by the crank)', Math.abs(w - dim.lighthouse.charge) < 0.2 && dim.lighthouse.charge > 20, `charge=${dim.lighthouse.charge.toFixed(1)}`);
    const end = await g.until((s) => !!s.outcome, 20000, 60);
    await g.frames(2);
    const ev = await g.page.evaluate(() => window.__ev);
    check('Prudent scenario: victory without a single grab', end.outcome === 'victory' && end.grabs === 0, `t=${end.t.toFixed(1)}`);
    check('The beam repelled the Laisse and the lighthouse was rewound at least twice', ev.some((e) => e.type === 'threat_state' && e.source === 'beam') && ev.filter((e) => e.type === 'lighthouse_wound').length >= 2);
    check('Noise events reach the subscription hook and the telemetry (type, position, intensity)', ev.some((e) => e.type === 'noise' && typeof e.x === 'number' && typeof e.z === 'number' && e.r > 0) && (await g.tel()).events.some((e) => e.type === 'noise'));
    check('No console error or warning during the prudent run', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }

  // ---- 8. Noisy bot: seized twice, defeat ----
  {
    const g = await openPage(browser, '?q=high');
    await g.page.evaluate(() => window.__estran.setBot('noisy'));
    const first = await g.until((s) => s.grabs >= 1, 20000, 15);
    await g.frames(2);
    const cold = await g.page.evaluate(() => parseFloat(document.getElementById('vignette-cold').style.opacity));
    await g.shot('estran-saisie.png');
    check('First grab: blue cold vignette, speed effect running, Laisse falling back', first.grabs === 1 && cold > 0.4 && first.cold > 8 && first.threat.mode === 'flee', `opacity=${cold} cold=${first.cold.toFixed(1)}`);
    const end = await g.until((s) => !!s.outcome, 20000, 15);
    await g.frames(2);
    const card = await g.page.evaluate(() => document.getElementById('card-text').textContent);
    const tel = await g.tel();
    const grabs = tel.events.filter((e) => e.type === 'grab');
    check('Noisy scenario: second grab within 45 s is the defeat, card "La mer a gagné."', end.outcome === 'defeat' && end.cause === 'seized' && card === 'La mer a gagné.' && grabs.length === 2 && grabs[1].t - grabs[0].t <= 45, `grabs at ${grabs.map((e) => e.t).join(' and ')}`);
    check('Journal shows the Laisse states (inquire, hunt) before the grabs', ['inquire', 'hunt'].every((m) => tel.events.some((e) => e.type === 'threat_state' && e.to === m)));
    check('No console error or warning during the noisy run', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }

  // ---- 9. Capture of the Laisse in the lamp light ----
  {
    const g = await openPage(browser, '?q=high');
    await g.page.evaluate(() => window.__estran.setBot('noisy'));
    const near = await g.until((s) => s.threat && s.threat.active && s.threat.mode === 'hunt' && s.threat.dist < 10, 20000, 6);
    await g.page.evaluate(() => { const s = window.__estran.getState(); window.__estran.setBot(null); window.__estran.lookAt(s.threat.x, s.threat.z, -0.12); });
    await g.page.keyboard.press('KeyF');
    await g.page.evaluate(() => window.__estran.advance(4));
    await g.frames(3);
    const lit = await g.st();
    await g.shot('estran-laisse.png');
    check('The Laisse is lit by the lamp (silhouette visible) at close range', lit.lamp.on && lit.threat.lit > 0 && lit.threat.dist < 12, `dist=${lit.threat.dist.toFixed(1)} mode=${near.threat.mode}`);
    check('No console error or warning on the capture run', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `${failed} check(s) FAILED` : `ALL ${results.length} E2E CHECKS PASSED`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
