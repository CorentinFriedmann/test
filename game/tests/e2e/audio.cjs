// T-031 browser scenarios: audio start on a gesture, voices, subtitles, settings, panning and levels on OfflineAudioContext.
// Usage: node tests/e2e/audio.cjs (after npm run build).
const { chromium, check, results, openPage } = require('./harness.cjs');

const MINUS_1_DBFS = Math.pow(10, -1 / 20); // 0.891

// Records a whole run of a scripted player: one state sample every 0.5 s (15 ticks) plus every journal event.
const RECORD = async (mode) => {
  const E = window.__estran;
  E.restart(); E.setBot(mode);
  const events = [], frames = [];
  const off = E.subscribe((e) => events.push(e));
  const lite = (s) => ({ t: s.t, level: s.level, player: { x: s.player.x, z: s.player.z, yaw: s.player.yaw, band: s.player.band }, threat: s.threat, lighthouse: { charge: s.lighthouse.charge }, drown: s.drown, drownLimit: s.drownLimit, cold: s.cold, outcome: s.outcome });
  frames.push(lite(E.getState()));
  while (!E.getState().outcome && frames.length < 1200) { E.advance(15); frames.push(lite(E.getState())); }
  off(); E.setBot(null);
  return { frames, events, outcome: E.getState().outcome, cause: E.getState().cause };
};

(async () => {
  const browser = await chromium.launch();

  // ---- 1. Nothing starts without a gesture; a real click starts the audio ----
  {
    const g = await openPage(browser, '?q=low');
    await g.frames(3);
    let a = await g.page.evaluate(() => window.__estran.audioStats());
    check('Audio does not start before a player gesture (no AudioContext at load)', !a.started && a.state === 'none');
    check('No console error or warning without gesture', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }
  {
    const g = await openPage(browser, '?q=low', { gesture: true });
    await g.frames(3);
    let a = await g.page.evaluate(() => window.__estran.audioStats());
    check('A click on the intro starts the audio (AudioContext running)', a.started && a.state === 'running', `state=${a.state} sr=${a.sampleRate}`);
    check('Defaults: volume 0.8, not muted, subtitles off', a.volume === 0.8 && a.muted === false && a.captions === false);
    check('No captions on screen by default', (await g.page.evaluate(() => document.querySelectorAll('#captions .cap').length)) === 0);

    // ---- 2. A noisy run triggers several water-noise variants and the Laisse cues ----
    await g.page.evaluate(() => window.__estran.setBot('noisy'));
    await g.until((s) => s.outcome, 20000, 60);
    a = await g.page.evaluate(() => window.__estran.audioStats());
    const waterKinds = Object.keys(a.played).filter((k) => /^step_(berge|gue|eau_profonde|eau_haute)|^debris$|^swirl$|^flee_splash$/.test(k));
    check('At least 3 variants of "noise in the water" were played', waterKinds.length >= 3, waterKinds.join(', '));
    check('The Laisse cues were played: swirl, growl/roar, grab, heartbeat', ['swirl', 'grab', 'heartbeat'].every((k) => a.played[k] > 0) && (a.played.roar > 0 || a.played.growl > 0), JSON.stringify(a.played));
    // T-038 (BUG-001): the old check (`dropped === 0` for EVERY voice) was wrong by design once the ceiling of 28 voices has priorities:
    // this run advances 60 simulation steps per frame, denser than real play, and low-priority voices (footsteps, interact, lamp)
    // may legitimately be refused or cut. What must hold: the voice count stays bounded, NO critical cue (grab, growl, roar,
    // heartbeat, close swirl) is ever refused, and the loss of low-priority voices stays a small share so the test still
    // detects a mix that collapses (a regression in voice lifetime or in the stealing rule would blow this bound).
    const playedTotal = Object.values(a.played).reduce((x, y) => x + y, 0);
    const lostShare = a.dropped / Math.max(1, playedTotal + a.dropped);
    check('Voice count stays bounded; no critical cue refused (grab, growl, roar, heartbeat, close swirl)', a.active <= 28 && a.droppedCritical === 0 && a.droppedByPriority[3] === 0, `active=${a.active} droppedCritical=${a.droppedCritical} byPriority=${a.droppedByPriority} stolen=${a.stolen}`);
    check('Refusals stay bounded: at most 15 % of the cues (measured 0 to 4 % over 3 runs), and only low or normal priority', lostShare <= 0.15 && a.droppedByPriority[2] === 0, `refused=${a.dropped} of ${playedTotal + a.dropped} (${(lostShare * 100).toFixed(1)} %) stolen=${a.stolen}`);
    check('No listener error, no console error or warning during the noisy run with live audio', a.listenerErrors === 0 && g.problems.length === 0, g.problems.slice(0, 3).join(' | '));

    // ---- 3. Mute key, settings ----
    await g.page.keyboard.press('KeyM');
    a = await g.page.evaluate(() => window.__estran.audioStats());
    check('Key M mutes (setting kept, context still running)', a.muted === true && a.state === 'running');
    const stored = await g.page.evaluate(() => JSON.parse(localStorage.getItem('estran.audio.v1') || 'null'));
    check('The mute setting is stored', stored && stored.muted === true);
    await g.page.keyboard.press('KeyM');
    a = await g.page.evaluate(() => window.__estran.audioStats());
    check('Key M again restores the sound', a.muted === false);
    await g.page.close();
  }

  // ---- 4. Subtitles: off by default, K or the option turns them on, text names the direction ----
  {
    const g = await openPage(browser, '?q=low', { gesture: true });
    await g.page.keyboard.press('KeyK');
    const on = (await g.page.evaluate(() => window.__estran.audioStats())).captions;
    check('Key K turns the noise subtitles on', on === true);
    await g.page.evaluate(() => window.__estran.setBot('noisy'));
    const seen = new Set();
    let s = await g.st();
    for (let n = 0; n < 12000 && !s.outcome && ![...seen].some((t) => /^bruit dans l'eau/.test(t)); n += 30) {
      await g.page.evaluate(() => window.__estran.advance(30));
      await g.frames(1); // the cues are emitted per frame (audio.update), so draw one before reading the DOM
      for (const t of await g.page.evaluate(() => [...document.querySelectorAll('#captions .cap')].map((e) => e.textContent))) seen.add(t);
      s = await g.st();
    }
    const texts = [...seen];
    check('A subtitle names the noise and its direction, e.g. "bruit dans l\'eau, à gauche"', texts.some((t) => /^bruit dans l'eau, (devant|derrière|à gauche|à droite)/.test(t)), texts.join(' | '));
    check('Subtitles are short', texts.every((t) => t.length <= 45), texts.join(' | '));
    await g.page.close();
  }
  {
    // Options in the intro overlay: changing them does not start the game.
    const g = await openPage(browser);
    await g.page.evaluate(() => { document.getElementById('intro').classList.remove('hidden'); });
    await g.page.click('#opt-cap');
    await g.page.fill('#opt-vol', '40');
    let a = await g.page.evaluate(() => window.__estran.audioStats());
    check('Options in the overlay: subtitles checkbox and volume slider apply', a.captions === true && Math.abs(a.volume - 0.4) < 1e-9, `captions=${a.captions} volume=${a.volume}`);
    check('Clicking an option does not start the game or the audio', !a.started && (await g.page.evaluate(() => !document.getElementById('intro').classList.contains('hidden'))));
    await g.page.click('#opt-cap');
    await g.page.click('#opt-mute');
    a = await g.page.evaluate(() => window.__estran.audioStats());
    check('Options: subtitles off again, mute checkbox applies', a.captions === false && a.muted === true);
    await g.page.close();
  }

  // ---- 5. Panning on OfflineAudioContext ----
  {
    const g = await openPage(browser, '?q=low');
    const run = (windows) => g.page.evaluate((w) => window.__estran.audioOffline.renderPanTest({ windows: w }), windows);
    const L0 = { x: 0, z: 0, yaw: 0 };
    for (const kind of ['swirl', 'debris', 'roar']) {
      const xs = [-30, -15, -5, 0, 5, 15, 30];
      const res = await run(xs.map((x) => ({ listener: L0, cue: { kind, x, z: -8, dist: Math.hypot(x, 8) } })));
      const b = res.map((r) => r.balance);
      const mono = b.every((v, i) => i === 0 || v > b[i - 1]);
      check(`Pan follows the source position (${kind}): balance rises monotonically from left to right`, mono && b[0] < -0.5 && b[b.length - 1] > 0.5 && Math.abs(b[3]) < 0.1, b.map((v) => v.toFixed(2)).join(' '));
    }
    // Turning the head: the same world source switches ears.
    const src = { kind: 'swirl', x: -12, z: 0, dist: 12 };
    const turn = await run([0, Math.PI / 2, Math.PI, -Math.PI / 2].map((yaw) => ({ listener: { x: 0, z: 0, yaw }, cue: src })));
    const tb = turn.map((r) => r.balance);
    check('Listener orientation matters: left source heard left, then ahead, then right, then behind', tb[0] < -0.5 && Math.abs(tb[1]) < 0.15 && tb[2] > 0.5 && Math.abs(tb[3]) < 0.15, tb.map((v) => v.toFixed(2)).join(' '));
    const dist = await run([4, 12, 25, 40].map((d) => ({ listener: L0, cue: { kind: 'swirl', x: -d, z: 0, dist: d } })));
    check('Level falls with distance', dist.every((r, i) => i === 0 || r.rmsL < dist[i - 1].rmsL) && dist[3].rmsL < dist[0].rmsL * 0.3, dist.map((r) => r.rmsL.toExponential(1)).join(' '));
    await g.page.close();
  }

  // ---- 6. Ambience follows the tide (offline) ----
  {
    const g = await openPage(browser, '?q=low');
    const synth = (level) => {
      const frames = [];
      for (let t = 0; t <= 30; t += 0.5) frames.push({ t, level, player: { x: 0, z: 0, yaw: 0, band: 'zone_seche' }, threat: null, lighthouse: { charge: 100 }, drown: 0, drownLimit: 8, cold: 0 });
      return frames;
    };
    const lo = await g.page.evaluate((f) => window.__estran.audioOffline.renderRun({ frames: f, events: [] }), synth(-0.6));
    const hi = await g.page.evaluate((f) => window.__estran.audioOffline.renderRun({ frames: f, events: [] }), synth(2.0));
    check('Sea and wind ambience is audible and louder at high tide than at low tide', lo.rmsDb > -70 && hi.rmsDb > lo.rmsDb + 3, `low ${lo.rmsDb.toFixed(1)} dBFS rms, high ${hi.rmsDb.toFixed(1)} dBFS rms`);
    await g.page.close();
  }

  // ---- 7. Level of full runs rendered offline ----
  {
    const g = await openPage(browser, '?q=low');
    let worst = 0, worstRaw = 0;
    const lines = [];
    for (const mode of ['prudent', 'win', 'noisy']) {
      const rec = await g.page.evaluate(RECORD, mode);
      const r = await g.page.evaluate((rec) => window.__estran.audioOffline.renderRun({ ...rec, limiter: true }), rec);
      // The same run without compressor and ceiling, to show how much headroom the raw mix has (only the loudest run, for time).
      const raw = mode === 'noisy' ? await g.page.evaluate((rec) => window.__estran.audioOffline.renderRun({ ...rec, limiter: false }), rec) : { peak: 0, peakDb: NaN };
      worst = Math.max(worst, r.peak); worstRaw = Math.max(worstRaw, raw.peak);
      const kinds = Object.keys(r.played).length;
      lines.push(`${mode}: ${rec.outcome}${rec.cause ? '/' + rec.cause : ''} ${r.duration.toFixed(0)} s, peak ${r.peakDb.toFixed(1)} dBFS ${mode === 'noisy' ? '(without limiter ' + raw.peakDb.toFixed(1) + ')' : ''}, rms ${r.rmsDb.toFixed(1)} dBFS, ${kinds} voice kinds, dropped ${r.dropped}`);
      check(`Full run "${mode}" rendered offline: peak under -1 dBFS and no clipped sample`, r.peak < MINUS_1_DBFS && r.clipped === 0 && r.rmsDb > -80, lines[lines.length - 1]);
    }
    console.log('  Level measure (24 kHz offline render, volume 1): worst peak ' + (20 * Math.log10(worst)).toFixed(2) + ' dBFS, noisy run without limiter ' + (20 * Math.log10(worstRaw)).toFixed(2) + ' dBFS');
    check('Peak of all runs under -1 dBFS', worst < MINUS_1_DBFS, (20 * Math.log10(worst)).toFixed(2) + ' dBFS');
    check('No console error or warning during the offline renders', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `${failed} check(s) FAILED` : `ALL ${results.length} AUDIO E2E CHECKS PASSED`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
