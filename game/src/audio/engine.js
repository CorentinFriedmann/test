// Web Audio synthesis of ESTRAN: no file, no voice, everything is generated. Works on any BaseAudioContext, so the same code
// runs live (AudioContext) and offline (OfflineAudioContext, used by the level and panning tests).
//
// Graph:  layers + one-shot voices -> bus -> master low-pass -> compressor -> soft ceiling (waveshaper) -> volume -> out
// Spatialisation: per voice StereoPanner (pan from the listener's position and yaw) + gain and low-pass falling with distance.
import { mulberry32 } from '../sim/rng.js';
import { panOf, distanceGain, cutoffFor, relative } from './spatial.js';
import { ambientMix, masterCutoff, towerHum, tideNorm, dreadLevel } from './mix.js';

export const CEILING = 0.85; // asymptote of the soft ceiling: -1.4 dBFS, under the -1 dBFS target
const MAX_VOICES = 28;

// Voice priorities (T-038, BUG-001). At the ceiling a new voice may take the place of the oldest voice of a strictly lower
// priority (the stolen voice is faded out in 30 ms: no click). A CRITICAL voice is never refused: if nothing of lower priority
// is playing, it takes the oldest voice of its own priority. Anything else is refused when it finds no lower voice to take.
export const PRIORITY = { LOW: 0, NORMAL: 1, HIGH: 2, CRITICAL: 3 };
const STEAL_FADE = 0.03;
/** Priority of a voice kind. Critical: grab, growl, roar, heartbeat, and swirls of a close Laisse (<= 65 % of audibleR). */
export function priorityOf(kind, c, audibleR) {
  if (kind === 'grab' || kind === 'growl' || kind === 'roar' || kind === 'heartbeat') return PRIORITY.CRITICAL;
  if (kind === 'swirl') return c && c.dist !== undefined && c.dist <= 0.65 * audibleR ? PRIORITY.CRITICAL : PRIORITY.NORMAL;
  if (kind.startsWith('lh_') || kind === 'end') return PRIORITY.HIGH;
  if (kind === 'debris' || kind === 'flee_splash') return PRIORITY.NORMAL;
  return PRIORITY.LOW; // step_*, interact, station, lamp
}

/** cfg: { tide: {min,max}, lighthouse: {x,z}, audibleR, roarR, flicker, seed, limiter (default true) } */
export function createEngine(ctx, cfg) {
  const rng = mulberry32((cfg.seed ?? 7) >>> 0);
  const sr = ctx.sampleRate, nyq = sr / 2 - 200;
  const hz = (f) => Math.min(f, nyq);
  const stats = { played: {}, dropped: 0, active: 0, stolen: 0, droppedCritical: 0, droppedByPriority: [0, 0, 0, 0] };
  const live = new Set(); // voices counted in the voice budget (stolen ones are silent and already uncounted)
  let seq = 0;

  // ---- noise buffers (generated, looped without a seam) ----
  function makeNoise(seconds, shaper) {
    const L = Math.floor(sr * seconds), N = Math.floor(sr * 0.25), raw = new Float32Array(L + N);
    shaper(raw);
    let peak = 1e-9;
    for (let i = 0; i < raw.length; i++) peak = Math.max(peak, Math.abs(raw[i]));
    const buf = ctx.createBuffer(1, L, sr), d = buf.getChannelData(0);
    for (let i = 0; i < L; i++) d[i] = (i >= N ? raw[i] : raw[i] * (i / N) + raw[L + i] * (1 - i / N)) / peak * 0.9;
    return buf;
  }
  const buffers = {
    white: makeNoise(4, (d) => { for (let i = 0; i < d.length; i++) d[i] = rng() * 2 - 1; }),
    pink: makeNoise(6, (d) => {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < d.length; i++) {
        const w = rng() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362; b6 = w * 0.115926;
      }
    }),
    brown: makeNoise(6, (d) => { let last = 0; for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (rng() * 2 - 1)) / 1.02; d[i] = last; } }),
  };

  // ---- master chain ----
  const bus = ctx.createGain();
  const masterLP = ctx.createBiquadFilter(); masterLP.type = 'lowpass'; masterLP.frequency.value = hz(12000); masterLP.Q.value = 0.5;
  const volume = ctx.createGain(); volume.gain.value = 0;
  bus.connect(masterLP);
  let tail = masterLP;
  if (cfg.limiter !== false) {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 10; comp.ratio.value = 6; comp.attack.value = 0.005; comp.release.value = 0.2;
    const shaper = ctx.createWaveShaper();
    const n = 2049, curve = new Float32Array(n), knee = 0.6, room = CEILING - knee;
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * 2 - 1, a = Math.abs(x);
      curve[i] = Math.sign(x) * (a < knee ? a : knee + room * Math.tanh((a - knee) / room));
    }
    shaper.curve = curve; shaper.oversample = '4x';
    tail.connect(comp); comp.connect(shaper); tail = shaper;
  }
  tail.connect(volume); volume.connect(ctx.destination);

  // ---- helpers ----
  const now = () => ctx.currentTime;
  const set = (param, v, tau = 0.35) => param.setTargetAtTime(v, now(), tau);
  const gain = (v = 1) => { const g = ctx.createGain(); g.gain.value = v; return g; };
  const biquad = (type, f, q = 0.7) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = hz(f); b.Q.value = q; return b; };
  function loopSrc(buf, rate = 1) { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.playbackRate.value = rate; s.start(0, rng() * buf.duration); return s; }
  function osc(type, f) { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.start(); return o; }

  /** Spatial placement of a cue for the current listener: pan, distance gain and cutoff. */
  function place(cue, L, ref, max) {
    const dist = relative(L, cue).dist;
    return { dist, pan: panOf(L, cue), gain: distanceGain(dist, ref, max), cutoff: cutoffFor(dist, max) };
  }
  /** Output stage of a one-shot voice: gain -> low-pass -> stereo panner -> bus. Returns the input node and a disposer. */
  function outStage(P, level) {
    const g = gain(level * P.gain), lp = biquad('lowpass', P.cutoff, 0.5), pn = ctx.createStereoPanner();
    pn.pan.value = P.pan; g.connect(lp); lp.connect(pn); pn.connect(bus);
    return { input: g, dispose: () => { try { pn.disconnect(); lp.disconnect(); g.disconnect(); } catch { /* already gone */ } } };
  }
  let endTrack = null;
  const trackEnd = (node, at) => { if (!endTrack || at > endTrack.at) endTrack = { node, at }; };
  function voice(kind, P, level, build, cue) {
    if (P.gain * level < 0.002) return false;
    const pri = priorityOf(kind, cue, cfg.audibleR);
    if (stats.active >= MAX_VOICES && !makeRoom(pri)) {
      stats.dropped++; stats.droppedByPriority[pri]++; if (pri === PRIORITY.CRITICAL) stats.droppedCritical++;
      return false;
    }
    const out = outStage(P, level), t = now();
    endTrack = null;
    const cleanup = build(out.input, t);
    stats.active++; stats.played[kind] = (stats.played[kind] || 0) + 1;
    // The voice ends when its latest source ends (tracked by burst() and tone()); build() may return an extra cleanup function.
    const v = { pri, seq: ++seq, stolen: false, done: false, out };
    v.release = () => { if (v.done) return; v.done = true; live.delete(v); if (!v.stolen) stats.active--; out.dispose(); if (typeof cleanup === 'function') cleanup(); };
    live.add(v);
    if (endTrack) endTrack.node.onended = v.release; else setTimeout(v.release, 4000);
    return true;
  }
  /** Frees one slot for a voice of priority `pri`: fades out the oldest voice of the lowest lower priority. False = refuse. */
  function makeRoom(pri) {
    let victim = null;
    for (const v of live) {
      if (v.stolen || !(v.pri < pri || (pri === PRIORITY.CRITICAL && v.pri === pri))) continue;
      if (!victim || v.pri < victim.pri || (v.pri === victim.pri && v.seq < victim.seq)) victim = v;
    }
    if (!victim) return false;
    victim.stolen = true; stats.active--; stats.stolen++;
    const g = victim.out.input.gain, t = now();
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0, t + STEAL_FADE); // node disposed at its natural end
    return true;
  }
  /** Shaped noise burst. Returns the source node (its `onended` marks the end of the voice). */
  function burst(dest, t, o) {
    const s = ctx.createBufferSource(); s.buffer = buffers[o.noise || 'pink'];
    const f = biquad(o.type || 'bandpass', o.f0, o.q ?? 1);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(hz(o.f1), t + o.dur);
    const g = gain(0.0001);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.peak, t + (o.attack ?? 0.01)); g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    s.connect(f); f.connect(g); g.connect(dest);
    s.start(t, rng() * Math.max(0, s.buffer.duration - o.dur - 0.1), o.dur + 0.05); s.stop(t + o.dur + 0.05);
    trackEnd(s, t + o.dur + 0.05);
    return s;
  }
  /** Tone with an exponential pitch glide and a percussive or swelling envelope. */
  function tone(dest, t, o) {
    const s = ctx.createOscillator(); s.type = o.type || 'sine'; s.frequency.setValueAtTime(o.f0, t);
    if (o.f1) s.frequency.exponentialRampToValueAtTime(o.f1, t + o.dur);
    const g = gain(0.0001);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.peak, t + (o.attack ?? 0.01)); g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    s.connect(g); g.connect(dest); s.start(t); s.stop(t + o.dur + 0.05);
    trackEnd(s, t + o.dur + 0.05);
    return s;
  }
  const R = (a, b) => a + (b - a) * rng();

  // ---- one-shot voices ----
  const V = {
    // Water noises (spatialised): footsteps by depth band, debris, the Laisse's swirls and wake.
    step(c, L) {
      const P = place(c, L, 1, 1); P.pan = c.foot * 0.18; P.gain = 1; P.cutoff = 12000;
      const lvl = 0.35 + 0.65 * c.power, soft = c.slow ? 0.6 : 1;
      voice('step_' + c.band, P, lvl * soft, (d, t) => {
        let last = null;
        for (let i = 0; i < c.hits; i++) {
          const tt = t + i * 0.24 + R(0, 0.02);
          if (c.band === 'zone_seche') last = burst(d, tt, { type: 'lowpass', f0: 1100, f1: 500, q: 0.7, dur: 0.07, peak: 0.07, attack: 0.004 });
          else if (c.band === 'berge') last = burst(d, tt, { f0: 900, f1: 500, q: 0.8, dur: 0.14, peak: 0.1, attack: 0.01 });
          else if (c.band === 'gue') { // ankle to knee: splash + droplets
            last = burst(d, tt, { f0: 1500, f1: 600, q: 0.9, dur: c.run ? 0.28 : 0.22, peak: c.run ? 0.2 : 0.13, attack: 0.012 });
            for (let k = 0; k < 3; k++) tone(d, tt + R(0.03, 0.22), { f0: R(500, 900), f1: R(1500, 2200), dur: 0.045, peak: 0.018 });
          } else if (c.band === 'submersion') last = burst(d, tt, { type: 'lowpass', f0: 280, f1: 160, q: 0.7, dur: 0.5, peak: 0.12, attack: 0.08, noise: 'brown' });
          else { // thigh or waist: heavy wading, low gloop
            last = burst(d, tt, { type: 'lowpass', f0: 650, f1: 260, q: 0.8, dur: 0.5, peak: 0.17, attack: 0.05, noise: 'brown' });
            tone(d, tt, { f0: 190, f1: 85, dur: 0.22, peak: 0.07, attack: 0.02 });
          }
        }
        return { node: last };
      });
    },
    debris(c, L) {
      const P = place(c, L, 2, 40);
      voice('debris', P, 1, (d, t) => {
        burst(d, t, { f0: 1800, q: 2.5, dur: 0.05, peak: 0.16, attack: 0.002, noise: 'white' }); // wooden clack
        tone(d, t, { f0: 230, f1: 150, dur: 0.16, peak: 0.12, attack: 0.003, type: 'triangle' });
        return { node: burst(d, t + 0.03, { f0: 1300, f1: 500, q: 0.8, dur: 0.4, peak: 0.16, attack: 0.02 }) };
      });
    },
    swirl(c, L) {
      const P = place(c, L, 3, cfg.audibleR), big = !!c.big;
      voice('swirl', P, big ? 1.6 : 1, (d, t) => {
        const dur = big ? 1.6 : R(0.9, 1.3);
        tone(d, t, { f0: R(70, 95), f1: 55, dur, peak: 0.07, attack: dur * 0.35 }); // body of the wake
        return { node: burst(d, t, { f0: R(380, 480), f1: R(200, 260), q: 1.4, dur, peak: 0.2, attack: dur * 0.3 }) };
      }, c);
    },
    flee_splash(c, L) {
      const P = place(c, L, 3, cfg.audibleR);
      voice('flee_splash', P, 1, (d, t) => ({ node: burst(d, t, { type: 'highpass', f0: 900, f1: 1800, q: 0.7, dur: 0.6, peak: 0.28, attack: 0.01, noise: 'white' }) }));
    },
    roar(c, L) { growl(c, L, 2.6, 'roar'); },
    growl(c, L) { growl(c, L, 1.5, 'growl'); },
    grab(c) {
      const P = { pan: 0, gain: 1, cutoff: 9000 };
      voice('grab', P, 1, (d, t) => {
        tone(d, t, { f0: 70, f1: 28, dur: 0.6, peak: 0.45, attack: 0.004 }); // impact
        burst(d, t, { type: 'lowpass', f0: 1400, f1: 300, q: 0.7, dur: 0.5, peak: 0.35, attack: 0.004 });
        tone(d, t + 0.05, { f0: 3100, dur: 3.2, peak: 0.012, attack: 0.05 }); // faint ringing
        return { node: burst(d, t + 0.1, { type: 'lowpass', f0: 600, f1: 200, q: 0.7, dur: 1.4, peak: 0.2, attack: 0.1, noise: 'brown' }) };
      });
    },
    // Lighthouse: the alarm of the player's light.
    lh_low(c, L) {
      const P = place(c, L, 10, 90);
      voice('lh_low', P, 1, (d, t) => { // power-down groan
        const lp = biquad('lowpass', 700, 0.7); lp.connect(d);
        return { node: tone(lp, t, { type: 'sawtooth', f0: 230, f1: 105, dur: 1.4, peak: 0.12, attack: 0.05 }) };
      });
      V.lh_toll(c, L);
    },
    lh_toll(c, L) {
      const P = place(c, L, 10, 90);
      voice('lh_toll', P, 1, (d, t) => { // low muffled bell, inharmonic partials
        let last = null;
        [[110, 0.13, 2.6], [276, 0.07, 1.8], [447, 0.035, 1.2]].forEach(([f, peak, dur]) => { last = tone(d, t, { f0: f, dur, peak, attack: 0.006 }); });
        return { node: last };
      });
    },
    lh_out(c, L) {
      const P = place(c, L, 10, 90);
      voice('lh_out', P, 1, (d, t) => {
        tone(d, t, { f0: 110, f1: 24, dur: 2.6, peak: 0.22, attack: 0.03 });
        return { node: burst(d, t, { type: 'lowpass', f0: 500, f1: 90, q: 0.7, dur: 2.4, peak: 0.2, attack: 0.1, noise: 'brown' }) };
      });
    },
    lh_wound(c, L) {
      const P = place(c, L, 10, 90);
      voice('lh_wound', P, 1, (d, t) => {
        for (let i = 0; i < 6; i++) burst(d, t + i * 0.09, { f0: 2400, q: 3, dur: 0.03, peak: 0.1, attack: 0.002, noise: 'white' });
        return { node: tone(d, t + 0.6, { f0: 120, f1: 70, dur: 0.45, peak: 0.2, attack: 0.004, type: 'triangle' }) };
      });
    },
    interact(c, L) {
      const P = place(c, L, 1, 1); P.pan = 0; P.gain = 1; P.cutoff = 10000;
      voice('interact', P, 1, (d, t) => {
        burst(d, t, { f0: 2600, q: 3, dur: 0.03, peak: 0.06, attack: 0.002, noise: 'white' });
        return { node: tone(d, t, { f0: 880, f1: 760, dur: 0.12, peak: 0.03, attack: 0.003 }) };
      });
    },
    station() {
      voice('station', { pan: 0, gain: 1, cutoff: 8000 }, 1, (d, t) => {
        tone(d, t, { f0: 523, dur: 0.5, peak: 0.05, attack: 0.01 });
        return { node: tone(d, t + 0.14, { f0: 784, dur: 0.7, peak: 0.04, attack: 0.01 }) };
      });
    },
    lamp(c) {
      voice('lamp', { pan: 0, gain: 1, cutoff: 9000 }, 1, (d, t) => {
        burst(d, t, { f0: 3200, q: 2, dur: 0.02, peak: 0.05, attack: 0.001, noise: 'white' });
        return { node: tone(d, t, { f0: c.on ? 520 : 380, dur: 0.07, peak: 0.03, attack: 0.002, type: 'square' }) };
      });
    },
    heartbeat(c) {
      const lvl = 0.35 + 0.65 * c.power;
      voice('heartbeat', { pan: 0, gain: 1, cutoff: 600 }, lvl, (d, t) => {
        tone(d, t, { f0: 62, f1: 44, dur: 0.16, peak: 0.2, attack: 0.012 });
        return { node: tone(d, t + 0.27, { f0: 56, f1: 40, dur: 0.14, peak: 0.14, attack: 0.012 }) };
      });
    },
    end(c) {
      voice('end', { pan: 0, gain: 1, cutoff: 6000 }, 1, (d, t) => {
        if (c.outcome === 'victory') { // a warm, slow chord
          let last = null;
          [220, 330, 440, 554].forEach((f) => { last = tone(d, t, { f0: f, dur: 5, peak: 0.035, attack: 1.4 }); });
          return { node: last };
        }
        tone(d, t, { f0: 52, f1: 34, dur: 4, peak: 0.2, attack: 1.2 });
        return { node: burst(d, t, { type: 'lowpass', f0: 700, f1: 160, q: 0.7, dur: 4, peak: 0.3, attack: 1.4, noise: 'brown' }) };
      });
    },
  };
  /** Growl of the Laisse: a saw sub with tremolo and a throaty noise formant. */
  function growl(c, L, dur, kind) {
    const P = place(c, L, 4, cfg.roarR);
    voice(kind, P, 1, (d, t) => {
      const lp = biquad('lowpass', 260, 0.9), trem = gain(0.65); lp.connect(trem); trem.connect(d);
      const lfo = osc('sine', 8.5), depth = gain(0.35); lfo.connect(depth); depth.connect(trem.gain);
      tone(lp, t, { type: 'sawtooth', f0: 48, f1: 33, dur, peak: kind === 'roar' ? 0.34 : 0.3, attack: dur * 0.2 });
      tone(lp, t, { f0: 96, f1: 70, dur, peak: 0.09, attack: dur * 0.25 });
      burst(d, t, { f0: 150, f1: 110, q: 5, dur, peak: 0.18, attack: dur * 0.25, noise: 'brown' });
      lfo.stop(t + dur + 0.05); trackEnd(lfo, t + dur + 0.06);
      return () => { try { lfo.disconnect(); depth.disconnect(); trem.disconnect(); lp.disconnect(); } catch { /* gone */ } };
    });
  }

  // ---- continuous layers ----
  const swell1 = osc('sine', 0.09), swell2 = osc('sine', 0.173), swell3 = osc('sine', 0.131);
  // Sea body: brown noise, slow swell on the gain.
  const seaBody = gain(0), seaLP = biquad('lowpass', 400, 0.5), seaDepth = gain(0), seaDepth2 = gain(0);
  loopSrc(buffers.brown).connect(seaLP); seaLP.connect(seaBody); seaBody.connect(bus);
  swell1.connect(seaDepth); swell2.connect(seaDepth2); seaDepth.connect(seaBody.gain); seaDepth2.connect(seaBody.gain);
  // Surf hiss: pink noise band, its own swell.
  const hiss = gain(0), hissBP = biquad('bandpass', 1400, 0.6), hissDepth = gain(0);
  loopSrc(buffers.pink, 0.9).connect(hissBP); hissBP.connect(hiss); hiss.connect(bus);
  swell3.connect(hissDepth); hissDepth.connect(hiss.gain);
  // Wind: pink noise band whose centre and level drift slowly.
  const wind = gain(0), windBP = biquad('bandpass', 700, 2.2), windFreqLfo = osc('sine', 0.071), windFreqDepth = gain(220), windGainLfo = osc('sine', 0.047), windGainDepth = gain(0);
  loopSrc(buffers.pink, 1.1).connect(windBP); windBP.connect(wind); wind.connect(bus);
  windFreqLfo.connect(windFreqDepth); windFreqDepth.connect(windBP.frequency); windGainLfo.connect(windGainDepth); windGainDepth.connect(wind.gain);
  // Lighthouse hum (positional).
  const hum = gain(0), humLP = biquad('lowpass', 900, 0.5), humPan = ctx.createStereoPanner(), humTrem = osc('sine', 8.3), humTremDepth = gain(0), humWobble = osc('sine', 0.35), humWobbleDepth = gain(0);
  const h1 = osc('sine', 55), h2 = osc('sine', 110), h2g = gain(0.4);
  h1.connect(hum); h2.connect(h2g); h2g.connect(hum); hum.connect(humLP); humLP.connect(humPan); humPan.connect(bus);
  humTrem.connect(humTremDepth); humTremDepth.connect(hum.gain); humWobble.connect(humWobbleDepth); humWobbleDepth.connect(h1.detune); humWobbleDepth.connect(h2.detune);
  // Dread: two close sub tones that beat slowly.
  const dread = gain(0), d1 = osc('sine', 41), d2 = osc('sine', 43.3), d3 = osc('sine', 82), d3g = gain(0.3);
  d1.connect(dread); d2.connect(dread); d3.connect(d3g); d3g.connect(dread); dread.connect(bus);

  let lastGrab = -1e9, started = false;
  const api = {
    ctx, stats, bus,
    /** Applies the game state to the continuous layers. frame: { t, level, player:{x,z,yaw,band}, threat, lighthouse:{charge}, drown, drownLimit, cold }. */
    update(frame, L) {
      const A = ambientMix(tideNorm(frame.level, cfg.tide.min, cfg.tide.max));
      const tc = started ? 0.4 : 0.001; started = true;
      set(seaBody.gain, A.seaBody, tc); set(seaLP.frequency, hz(A.seaBodyCut), tc);
      set(seaDepth.gain, A.seaBody * A.swellDepth, tc); set(seaDepth2.gain, A.seaBody * A.swellDepth * 0.6, tc);
      set(hiss.gain, A.seaHiss, tc); set(hissBP.frequency, hz(A.seaHissFreq), tc); set(hissDepth.gain, A.seaHiss * 0.7, tc);
      set(wind.gain, A.windGain, tc); set(windBP.frequency, hz(A.windFreq), tc); set(windGainDepth.gain, A.windGain * 0.6, tc);
      const lh = cfg.lighthouse, rel = relative(L, lh), charge = frame.lighthouse ? frame.lighthouse.charge : 100;
      const T = towerHum(charge, cfg.flicker, rel.dist);
      set(hum.gain, T.gain, 0.3); set(humTremDepth.gain, T.gain * T.flick, 0.3); set(humWobbleDepth.gain, T.wobble, 0.3);
      set(humPan.pan, panOf(L, lh, 6), 0.1); set(humLP.frequency, hz(cutoffFor(rel.dist, 90, 3000, 250)), 0.2);
      set(dread.gain, 0.11 * Math.pow(dreadLevel(frame, cfg), 1.2), 0.5);
      set(masterLP.frequency, hz(masterCutoff({ band: frame.player.band, cold: frame.cold || 0, sinceGrab: frame.t - lastGrab })), 0.12);
    },
    /** Plays one cue (see director.js) for the listener L = { x, z, yaw }. Unknown or inaudible cues are ignored. */
    play(cue, L, t) {
      if (cue.kind === 'grab' && t !== undefined) lastGrab = t;
      const fn = V[cue.kind];
      if (fn) fn(cue, L);
    },
    setGrabTime(t) { lastGrab = t; },
    setVolume(v) { set(volume.gain, v * v, 0.05); },
    close() { return ctx.close && ctx.state !== 'closed' ? ctx.close() : Promise.resolve(); },
  };
  return api;
}
