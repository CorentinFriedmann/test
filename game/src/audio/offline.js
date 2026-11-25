// Offline rendering (OfflineAudioContext) of the same director + engine as the live game. Used by the tests: peak level of a
// whole run and the stereo balance of a moving source. Not used during play.
import { createDirector } from './director.js';
import { createEngine } from './engine.js';
import { audioConfig } from './index.js';

const dbfs = (x) => (x > 0 ? 20 * Math.log10(x) : -Infinity);

function measure(buf, from = 0, to = buf.length) {
  const L = buf.getChannelData(0), Rr = buf.getChannelData(1);
  let peak = 0, sl = 0, sr = 0, clipped = 0;
  for (let i = from; i < to; i++) {
    const a = Math.abs(L[i]), b = Math.abs(Rr[i]);
    if (a > peak) peak = a; if (b > peak) peak = b;
    if (a >= 1 || b >= 1) clipped++;
    sl += L[i] * L[i]; sr += Rr[i] * Rr[i];
  }
  const n = Math.max(1, to - from);
  return { peak, peakDb: dbfs(peak), rmsL: Math.sqrt(sl / n), rmsR: Math.sqrt(sr / n), rmsDb: dbfs(Math.sqrt((sl + sr) / (2 * n))), clipped };
}

export function createOfflineTools(data, world) {
  const Offline = () => window.OfflineAudioContext || window.webkitOfflineAudioContext;

  /**
   * Replays a recorded run: frames = state samples ({t, level, player, threat, lighthouse, drown, drownLimit, cold}) and
   * events = journal events. Returns the level measures and the number of voices played per kind.
   */
  async function renderRun({ frames, events, sampleRate = 24000, step = 0.5, limiter = true, volume = 1 }) {
    const duration = frames[frames.length - 1].t + 1;
    const ctx = new (Offline())(2, Math.ceil(duration * sampleRate), sampleRate);
    const cfg = audioConfig(data, world, { limiter });
    const eng = createEngine(ctx, cfg), dir = createDirector(cfg);
    eng.setVolume(volume);
    let fi = 0, ei = 0;
    const apply = (time) => {
      while (fi + 1 < frames.length && frames[fi + 1].t <= time + 1e-6) fi++;
      const st = frames[fi], L = { x: st.player.x, z: st.player.z, yaw: st.player.yaw };
      while (ei < events.length && events[ei].t <= time + 1e-6) for (const c of dir.onEvent(events[ei++], st)) eng.play(c, L, st.t);
      for (const c of dir.update(st)) eng.play(c, L, st.t);
      eng.update(st, L);
    };
    apply(0);
    for (let t = step; t < duration; t += step) ctx.suspend(t).then(() => { apply(t); return ctx.resume(); });
    const buf = await ctx.startRendering();
    const secs = [];
    for (let s = 0; s + 1 <= duration; s++) secs.push(measure(buf, Math.floor(s * sampleRate), Math.floor((s + 1) * sampleRate)).peak);
    return { duration, sampleRate, ...measure(buf), played: eng.stats.played, dropped: eng.stats.dropped, droppedCritical: eng.stats.droppedCritical, stolen: eng.stats.stolen, peakPerSecondMax: Math.max(...secs) };
  }

  /**
   * One-second windows, each with its own listener and one cue (no continuous layers). Returns the left/right RMS of each window
   * after the first 100 ms, and the balance (R - L) / (R + L) in [-1, 1].
   */
  async function renderPanTest({ windows, sampleRate = 24000 }) {
    const ctx = new (Offline())(2, windows.length * sampleRate, sampleRate);
    const eng = createEngine(ctx, audioConfig(data, world));
    eng.setVolume(1);
    windows.forEach((w, i) => {
      const go = () => eng.play(w.cue, w.listener, i);
      if (i === 0) go(); else ctx.suspend(i).then(() => { go(); return ctx.resume(); });
    });
    const buf = await ctx.startRendering();
    return windows.map((w, i) => {
      const m = measure(buf, Math.floor((i + 0.1) * sampleRate), (i + 1) * sampleRate);
      return { rmsL: m.rmsL, rmsR: m.rmsR, balance: (m.rmsR - m.rmsL) / Math.max(1e-12, m.rmsR + m.rmsL), peak: m.peak };
    });
  }

  return { renderRun, renderPanTest };
}
