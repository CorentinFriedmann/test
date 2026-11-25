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
 * opts: { data, world, storage, onCaption({key,text}), onChange(settings) }
 * Methods: start() (from a gesture), suspend(), resume(), reset(), onEvent(e, state, listener), update(state, listener),
 * setVolume(v), setMuted(b), toggleMute(), setCaptions(b), settings, stats().
 */
export function createAudioSystem(opts) {
  const cfg = audioConfig(opts.data, opts.world);
  const director = createDirector(cfg);
  let settings = opts.storage ? loadSettings(opts.storage) : sanitize({});
  let ctx = null, engine = null;
  const cueCounts = {};

  const applyVolume = () => { if (engine) engine.setVolume(settings.muted ? 0 : settings.volume); };
  const changed = () => { if (opts.storage) saveSettings(opts.storage, settings); applyVolume(); if (opts.onChange) opts.onChange({ ...settings }); };

  function dispatch(cues, listener, st) {
    for (const c of cues) {
      cueCounts[c.kind] = (cueCounts[c.kind] || 0) + 1;
      if (settings.captions && opts.onCaption) { const cap = captionFor(c, listener, cfg); if (cap) opts.onCaption(cap); }
      if (engine) engine.play(c, listener, st.t);
    }
  }

  return {
    get settings() { return { ...settings }; },
    start() {
      if (!engine) {
        const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
        if (!AC) return false;
        ctx = new AC();
        engine = createEngine(ctx, cfg);
        applyVolume();
      }
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      return true;
    },
    suspend() { if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); },
    resume() { if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {}); },
    reset() { director.reset(); if (engine) engine.setGrabTime(-1e9); },
    onEvent(e, st, listener) { dispatch(director.onEvent(e, st), listener, st); },
    update(st, listener) {
      dispatch(director.update(st), listener, st);
      if (engine && ctx.state === 'running') engine.update(st, listener);
    },
    setVolume(v) { settings = sanitize({ ...settings, volume: v }); changed(); },
    setMuted(b) { settings = sanitize({ ...settings, muted: !!b }); changed(); },
    toggleMute() { this.setMuted(!settings.muted); return settings.muted; },
    setCaptions(b) { settings = sanitize({ ...settings, captions: !!b }); changed(); },
    stats() {
      return { started: !!engine, state: ctx ? ctx.state : 'none', ...settings, cues: { ...cueCounts }, played: engine ? { ...engine.stats.played } : {},
        active: engine ? engine.stats.active : 0, dropped: engine ? engine.stats.dropped : 0,
        droppedCritical: engine ? engine.stats.droppedCritical : 0, stolen: engine ? engine.stats.stolen : 0, droppedByPriority: engine ? [...engine.stats.droppedByPriority] : [0, 0, 0, 0], sampleRate: ctx ? ctx.sampleRate : 0 };
    },
  };
}
