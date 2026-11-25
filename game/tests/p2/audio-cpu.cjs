// T-032 (reserve of T-031): CPU cost of the audio on a loud run. Manual measure, not part of `npm test` (timing-sensitive).
//   node tests/p2/audio-cpu.cjs      (after npm run build)
// Three views, all in headless Chromium with SOFTWARE rendering and no audio device (so not representative of a player's PC):
//   A. real time, no audio context (no gesture)  vs  B. real time, audio running, same loud player (F2 / perfReport numbers);
//   C. offline synthesis of a whole noisy run: wall time / audio time = share of ONE core the audio graph needs on this machine;
// AudioContext.renderCapacity (real audio-thread load) is NOT read: it needs a real output device and the game exposes no hook to the context.
const { chromium, openPage, outDir } = require('../e2e/harness.cjs');
const path = require('node:path');
const fs = require('node:fs');

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

async function realTime(browser, withAudio) {
  const g = await openPage(browser, '?q=low&perf=1', { gesture: withAudio });
  await g.page.evaluate(() => { const E = window.__estran; E.restart(); E.setBot('noisy'); E.setManual(true); while (E.getState().readCount < 1 && !E.getState().outcome) E.advance(30); E.setManual(false); }); // skip to the loud part (after reading S1)
  await g.page.waitForTimeout(3000);
  await g.page.evaluate(() => window.__estran.perfReset());
  await g.page.waitForTimeout(15000);
  const rep = await g.page.evaluate(() => window.__estran.perfReport());
  const audio = await g.page.evaluate(() => window.__estran.audioStats());
  const out = { withAudio, fps: rep.avgFps, avgFrameMs: rep.avgFrameMs, p95FrameMs: rep.p95FrameMs, cpuDrawAvgMs: rep.cpuDrawAvgMs, frames: rep.window.frames,
    audioStarted: audio.started, audioState: audio.state, voicesPlayed: Object.values(audio.played || {}).reduce((a, b) => a + b, 0), dropped: audio.dropped, problems: g.problems.length };
  await g.page.close();
  return out;
}

(async () => {
  const browser = await chromium.launch();
  const A = await realTime(browser, false), B = await realTime(browser, true), A2 = await realTime(browser, false), B2 = await realTime(browser, true);
  for (const [n, r] of [['A (no audio)', A], ['B (audio on)', B], ['A2 (no audio)', A2], ['B2 (audio on)', B2]]) console.log(n.padEnd(14), JSON.stringify(r));
  const g = await openPage(browser, '?q=low');
  const rec = await g.page.evaluate(RECORD, 'noisy');
  const t0 = Date.now();
  const r = await g.page.evaluate((rec) => window.__estran.audioOffline.renderRun({ ...rec, limiter: true }), rec);
  const wallS = (Date.now() - t0) / 1000;
  const C = { audioSeconds: +r.duration.toFixed(1), wallSeconds: +wallS.toFixed(2), coreShare: +(wallS / r.duration).toFixed(3), sampleRate: r.sampleRate, dropped: r.dropped, peakDb: +r.peakDb.toFixed(2) };
  console.log('C (offline)   ', JSON.stringify(C));
  await g.page.close(); await browser.close();
  fs.writeFileSync(path.join(outDir, 'p2-audio-cpu.json'), JSON.stringify({ A, B, A2, B2, C }, null, 2));
})().catch((e) => { console.error(e); process.exit(2); });
