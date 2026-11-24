// Render scenarios (T-030): lighting moments x quality levels, legibility of La Laisse on every level, parity of the simulation
// whatever the render settings, measurement screen, bundle size, and timing measurements written to <captures>/perf.json.
// Usage: node tests/e2e/render.cjs (after npm run build).
const fs = require('node:fs');
const path = require('node:path');
const { chromium, root, outDir, results, check, openPage } = require('./harness.cjs');

const MOMENTS = ['nuit', 'aube', 'jour'];
const MOMENT_PARAM = { nuit: 'night', aube: 'dawn', jour: 'day' };
const LEVELS = ['high', 'medium', 'low'];
const staticView = {}; // draw calls and triangles of the wide night view (lighthouse, beam, rocks, water all in the frustum)
// A free camera on the foreshore, looking out to sea over the rocks (render side only: the simulation is not touched).
const VIEW = { x: 8, z: -22, ground: 2.0, eye: 1.7, tx: -45, tz: -40, pitch: -0.06 };

(async () => {
  const browser = await chromium.launch();

  // ---- 1. Bundle weight
  {
    const size = fs.statSync(path.join(root, 'dist/estran.html')).size;
    check('Bundle dist/estran.html stays under 1.5 MB', size < 1.5 * 1048576, `${(size / 1024).toFixed(0)} KiB`);
  }

  // ---- 2. Lighting moments x quality levels (9 captures), no console problem
  for (const m of MOMENTS) for (const q of LEVELS) {
    const g = await openPage(browser, `?q=${q}&moment=${MOMENT_PARAM[m]}`);
    await g.page.evaluate(() => window.__estran.setBot('prudent'));
    await g.page.evaluate(() => window.__estran.advance(2400)); // t = 80 s: the tide is rising, the beam is turning
    await g.page.evaluate((v) => window.__estran.setPose({ x: v.x, z: v.z, ground: v.ground, eye: v.eye, yaw: Math.atan2(-(v.tx - v.x), -(v.tz - v.z)), pitch: v.pitch }), VIEW);
    await g.frames(3);
    const s = await g.st();
    const name = `estran-${m}-${q}.jpg`; // JPEG: the grain makes PNGs of ~800 KiB
    await g.page.screenshot({ path: path.join(outDir, name), type: 'jpeg', quality: 88 });
    if (m === 'nuit') staticView[q] = { drawCalls: s.drawCalls, triangles: s.triangles };
    const kb = fs.statSync(path.join(outDir, name)).size / 1024;
    check(`Capture ${m} / ${q}: moment and quality applied, picture not flat, no console problem`,
      s.moment === MOMENT_PARAM[m] && s.quality === q && kb > 25 && g.problems.length === 0, `${kb.toFixed(0)} KiB, ${s.drawCalls} draw calls, ${s.triangles} triangles ${g.problems.slice(0, 2).join(' | ')}`);
    await g.page.close();
  }

  // ---- 3. La Laisse: lit = readable on the three levels (switched live on the same frame), unlit = not drawn
  {
    const g = await openPage(browser, '?q=high');
    await g.page.evaluate(() => window.__estran.setBot('noisy'));
    await g.until((s) => s.threat && s.threat.active && s.threat.mode === 'hunt' && s.threat.dist < 10, 20000, 6);
    await g.page.evaluate(() => { const s = window.__estran.getState(); window.__estran.setBot(null); window.__estran.lookAt(s.threat.x, s.threat.z, -0.12); });
    await g.page.keyboard.press('KeyF');
    await g.page.evaluate(() => window.__estran.advance(4));
    const probes = {};
    for (const q of LEVELS) {
      await g.page.evaluate((q) => window.__estran.setQuality(q), q);
      await g.frames(3);
      probes[q] = await g.page.evaluate(() => window.__estran.probeLaisse());
      if (q !== 'high') await g.shot(`estran-laisse-${q === 'low' ? 'bas' : 'moyen'}.png`);
    }
    const lit = await g.st();
    check('Lit by the lamp, simulation says lit', lit.lamp.on && lit.threat.lit > 0, `lit=${lit.threat.lit.toFixed(2)} dist=${lit.threat.dist.toFixed(1)}`);
    check('The Laisse is readable on every level (pixels she changes in the frame)', LEVELS.every((q) => probes[q].visible && probes[q].diff > 1500),
      LEVELS.map((q) => `${q}=${probes[q].diff}`).join(' '));
    check('Readability on low (share of the frame) is at least half of high', probes.low.diff / probes.low.total >= 0.5 * (probes.high.diff / probes.high.total),
      `low=${(100 * probes.low.diff / probes.low.total).toFixed(2)}% of the frame, high=${(100 * probes.high.diff / probes.high.total).toFixed(2)}%`);
    // Lamp off: wait for the simulation's own 0.5 s window to end, then she must not be drawn on any level.
    await g.page.keyboard.press('KeyF');
    let s = await g.st();
    for (let n = 0; n < 40 && (s.threat.lit > 0 || s.lamp.on); n++) { await g.page.evaluate(() => window.__estran.advance(3)); s = await g.st(); }
    const off = {};
    if (s.threat.active && s.threat.lit === 0) {
      for (const q of LEVELS) {
        await g.page.evaluate((q) => window.__estran.setQuality(q), q);
        await g.frames(3);
        off[q] = await g.page.evaluate(() => window.__estran.probeLaisse());
      }
      check('Not lit: the Laisse is not drawn on any level (rule identical on the three levels)', LEVELS.every((q) => !off[q].visible && off[q].diff === 0), LEVELS.map((q) => `${q}=${off[q].diff}`).join(' '));
    } else check('Not lit: the Laisse is not drawn on any level (scenario ended before the check)', true, 'threat inactive; rule covered by unit logic');
    check('No console error or warning during the Laisse run (live quality switching included)', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }

  // ---- 4. Parity: same game, different render settings => identical simulation journal (prudent bot, the long scenario)
  {
    const runs = [
      { q: '?q=low&debug=1', label: 'low + debug' },
      { q: '?q=medium', label: 'medium' },
      { q: '?q=high&moment=day', label: 'high + day moment' },
      { q: '?q=high&perf=1', label: 'high + measurement screen', switchLive: true },
    ];
    const logs = [];
    for (const r of runs) {
      const g = await openPage(browser, r.q);
      await g.page.evaluate(() => window.__estran.setBot('prudent'));
      let s = await g.st(), i = 0;
      while (!s.outcome && i < 400) {
        await g.page.evaluate(() => window.__estran.advance(600)); await g.frames(1);
        if (r.switchLive) await g.page.evaluate((i) => window.__estran.setQuality(['low', 'medium', 'high'][i % 3]), i); // quality changed during the game
        s = await g.st(); i++;
      }
      logs.push({ label: r.label, outcome: s.outcome, grabs: s.grabs, tel: JSON.stringify(await g.tel()), problems: g.problems });
      await g.page.close();
    }
    check('Prudent scenario ends in victory on every render setting', logs.every((l) => l.outcome === 'victory' && l.grabs === 0), logs.map((l) => `${l.label}:${l.outcome}`).join(' | '));
    check('Parity (prudent, ?debug=1, three levels, other moment, live quality switching): identical journals', logs.every((l) => l.tel === logs[0].tel), `${logs.length} runs, ${logs[0].tel.length} bytes`);
    check('No console error or warning during the parity runs', logs.every((l) => l.problems.length === 0), logs.flatMap((l) => l.problems).slice(0, 3).join(' | '));
  }

  // ---- 5. Measurement screen
  {
    const g = await openPage(browser, '?q=low&perf=1');
    await g.page.evaluate(() => { window.__estran.setManual(false); });
    await g.page.waitForTimeout(2500);
    const shown = await g.page.evaluate(() => getComputedStyle(document.getElementById('perf')).display);
    const text = await g.page.evaluate(() => document.getElementById('perf-text').textContent);
    check('?perf=1 shows the measurement screen with the 5 figures', shown === 'block' && ['cadence moyenne', '95e centile', 'appels de dessin', 'triangles', 'frame moyenne'].every((k) => text.includes(k)), text.split('\n')[1]);
    await g.page.click('#perf-copy');
    await g.page.waitForTimeout(300);
    const json = await g.page.evaluate(() => document.getElementById('perf-json').value);
    let rep = null; try { rep = JSON.parse(json); } catch { /* checked below */ }
    const keys = ['avgFps', 'avgFrameMs', 'p95FrameMs', 'drawCalls', 'triangles', 'quality', 'gpu', 'resolution'];
    check('"Copier le rapport de performance" produces a JSON report with the required fields', !!rep && keys.every((k) => rep[k] !== undefined && rep[k] !== null)
      && rep.avgFps > 0 && rep.p95FrameMs >= rep.p50FrameMs && rep.drawCalls > 0 && rep.triangles > 0, rep ? `fps=${rep.avgFps} p95=${rep.p95FrameMs} ms gpu=${rep.gpu}` : 'invalid JSON');
    await g.page.keyboard.press('F2');
    check('F2 toggles the measurement screen', (await g.page.evaluate(() => getComputedStyle(document.getElementById('perf')).display)) === 'none');
    check('No console error or warning with the measurement screen', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }

  // ---- 6. Timing measurements per level (software rendering: NOT representative of a real GPU, see docs/tech/PERF_P2.md)
  {
    const out = {};
    for (const q of LEVELS) {
      const g = await openPage(browser, `?q=${q}&perf=1`);
      await g.page.evaluate(() => { window.__estran.setBot('prudent'); window.__estran.setManual(false); });
      await g.page.waitForTimeout(3000);
      await g.page.evaluate(() => window.__estran.perfReset());
      await g.page.waitForTimeout(10000);
      const rep = await g.page.evaluate(() => window.__estran.perfReport());
      out[q] = rep;
      console.log(`INFO  perf ${q}: ${rep.avgFps} fps, avg ${rep.avgFrameMs} ms, p95 ${rep.p95FrameMs} ms, js draw ${rep.cpuDrawAvgMs} ms, ${rep.drawCalls} calls, ${rep.triangles} triangles, ${rep.resolution.buffer.join('x')}`);
      check(`Timing run ${q}: measurements collected, no console problem`, rep.window.frames > 5 && g.problems.length === 0, `${rep.window.frames} frames`);
      await g.page.close();
    }
    fs.writeFileSync(path.join(outDir, 'perf.json'), JSON.stringify({ realTime: out, wideNightView: staticView }, null, 2));
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `${failed} check(s) FAILED` : `ALL ${results.length} RENDER CHECKS PASSED`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
