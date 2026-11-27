// Audio system of the game: director (cues) + synthesis engine (Web Audio) + settings + subtitles.
// The AudioContext is created only from a player gesture (start()), never at load: no autoplay warning, no error.
import { param } from '../data/load.js';
import { createDirector } from './director.js';
import { createEngine } from './engine.js';
import { captionFor } from './caption-text.js';
import { loadSettings, saveSettings, sanitize } from './settings.js';

/** Static audio configuration from the CSV data and the generated world. */
export function audioConfig(data, world, extra = {}) {
  const levels = data.tide.map((r) => r.level);
  return {
    tide: { min: Math.min(...levels), max: Math.max(...levels) },
    lighthouse: { x: world.lighthouse.x, z: world.lighthouse.z },
    audibleR: param(data, 'threat_audible_radius'), roarR: param(data, 'threat_cue_roar_radius'), flicker: param(data, 'lighthouse_charge_flicker'),
    debris: world.debris, seed: 7, ...extra,
  };
}

/**
 * opts: { data, world, storage, onCaption({key,text}), onChange(settings + status), onCue(cue), onTestSound(),
 *         AudioContextClass (tests), schedule(fn, ms) (tests; default setTimeout) }
 * Methods: start() (from a gesture; also retries a context that did not start), suspend(), resume(), reset(),
 * onEvent(e, state, listener), update(state, listener), setVolume(v), setMuted(b), toggleMute(), setCaptions(b), settings, status, stats().
 *
 * Start-up (T-043 C2): start() creates the context inside the click handler (browser autoplay rule), resumes it and plays the
 * test chime. 0.5 s and 1 s later it tries resume() again; 1.5 s after the click, a context that is still not "running" is a failure
 * (status.failure = 'context'), and so is a later loss of the context that the game did not ask for (statechange). No AudioContext
 * at all, or one that throws, is failure 'unsupported'. onChange receives { volume, muted, captions, status } at every change.
 */
export function createAudioSystem(opts) {
  const cfg = audioConfig(opts.data, opts.world);
  const director = createDirector(cfg);
  let settings = opts.storage ? loadSettings(opts.storage) : sanitize({});
  let ctx = null, engine = null;
  const cueCounts = {};
  const schedule = opts.schedule || ((fn, ms) => setTimeout(fn, ms));
  const st = { failure: null, intentional: false, armed: false, token: 0 }; // intentional: suspended by the pause; armed: start-up check done

  const status = () => ({ started: !!engine, state: ctx ? ctx.state : 'none', failure: st.failure, intentional: st.intentional });
  const applyVolume = () => { if (engine) engine.setVolume(settings.muted ? 0 : settings.volume); };
  const notify = () => { if (opts.onChange) opts.onChange({ ...settings, status: status() }); };
  const changed = () => { if (opts.storage) saveSettings(opts.storage, settings); applyVolume(); notify(); };
  const tryResume = () => { try { const r = ctx.resume(); if (r && r.catch) r.catch(() => {}); } catch { /* the check below reports it */ } };
  const running = () => !!ctx && ctx.state === 'running';

  // Verifies that the context really runs: retries at 0.5 s and 1 s, declares the failure at 1.5 s.
  function verify() {
    const token = ++st.token; st.armed = false;
    const guard = (fn) => () => { if (token === st.token && ctx && !st.intentional) fn(); };
    schedule(guard(() => { if (!running()) tryResume(); }), 500);
    schedule(guard(() => { if (!running()) tryResume(); }), 1000);
    schedule(guard(() => { st.armed = true; if (!running()) st.failure = 'context'; notify(); }), 1500);
  }
  function onState() {
    if (running()) { st.failure = null; if (st.token) st.armed = true; } else if (st.armed && !st.intentional) st.failure = 'context';
    notify();
  }

  function dispatch(cues, listener, state) {
    for (const c of cues) {
      cueCounts[c.kind] = (cueCounts[c.kind] || 0) + 1;
      if (opts.onCue) opts.onCue(c);
      if (settings.captions && opts.onCaption) { const cap = captionFor(c, listener, cfg); if (cap) opts.onCaption(cap); }
      if (engine) engine.play(c, listener, state.t);
    }
  }

  return {
    get settings() { return { ...settings }; },
    get status() { return status(); },
    start() {
      st.intentional = false;
      if (!engine) {
        const AC = opts.AudioContextClass || (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext));
        if (!AC) { st.failure = 'unsupported'; notify(); return false; }
        try {
          ctx = new AC();
          engine = createEngine(ctx, cfg);
        } catch { ctx = null; engine = null; st.failure = 'unsupported'; notify(); return false; }
        if (ctx.addEventListener) ctx.addEventListener('statechange', onState);
        applyVolume();
        tryResume();
        try { engine.testChime(); if (opts.onTestSound) opts.onTestSound(); } catch { /* the chime is a courtesy: never break the start */ }
        verify(); notify();
        return true;
      }
      if (ctx.state !== 'running') { tryResume(); verify(); }
      notify();
      return true;
    },
    suspend() { if (ctx && ctx.state === 'running') { st.intentional = true; ctx.suspend().catch(() => {}); notify(); } },
    resume() {
      st.intentional = false;
      if (ctx && ctx.state !== 'running') { tryResume(); verify(); }
      notify();
    },
    reset() { director.reset(); if (engine) engine.setGrabTime(-1e9); },
    onEvent(e, state, listener) { dispatch(director.onEvent(e, state), listener, state); },
    update(state, listener) {
      dispatch(director.update(state), listener, state);
      if (engine && ctx.state === 'running') engine.update(state, listener);
    },
    setVolume(v) { settings = sanitize({ ...settings, volume: v }); changed(); },
    setMuted(b) { settings = sanitize({ ...settings, muted: !!b }); changed(); },
    toggleMute() { this.setMuted(!settings.muted); return settings.muted; },
    setCaptions(b) { settings = sanitize({ ...settings, captions: !!b }); changed(); },
    stats() {
      return { started: !!engine, state: ctx ? ctx.state : 'none', failure: st.failure, ...settings, cues: { ...cueCounts }, played: engine ? { ...engine.stats.played } : {},
        active: engine ? engine.stats.active : 0, dropped: engine ? engine.stats.dropped : 0,
        droppedCritical: engine ? engine.stats.droppedCritical : 0, stolen: engine ? engine.stats.stolen : 0, droppedByPriority: engine ? [...engine.stats.droppedByPriority] : [0, 0, 0, 0], sampleRate: ctx ? ctx.sampleRate : 0 };
    },
  };
}
