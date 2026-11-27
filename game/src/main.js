// Browser entry: wires the pure simulation (30 Hz fixed step) to the three.js view, the HUD and the input.
// Rendering reads the simulation state; it never writes to it, and render settings never change a tick.
import { loadData, param } from './data/load.js';
import { createSim } from './sim/sim.js';
import { createStepper } from './sim/stepper.js';
import { createBot } from './sim/bot.js';
import { QUALITY, qualityFromUrl, momentFromUrl } from './render/quality.js';
import { createPerfMeter } from './render/perfstats.js';
import { createPerfPanel } from './ui/perf.js';
import { createView } from './render/scene.js';
import { createHud } from './ui/hud.js';
import { createInput } from './ui/input.js';
import { hudModel } from './ui/hud-model.js';
import { guidance, createTips } from './ui/guidance.js';
import { createThreatCues, RING_MAX_RADIUS, RING_LIFE_S } from './render/threat-cues.js';
import { createAudioSystem } from './audio/index.js';
import { createOfflineTools } from './audio/offline.js';
import { createCaptions } from './ui/captions.js';
import { bindAudioOptions } from './ui/audio-opts.js';
import { bindStartScreen } from './ui/p2.js';

const url = new URLSearchParams(location.search);
const data = loadData();
const seed = url.has('seed') ? Number(url.get('seed')) : param(data, 'sim_seed');
// A listener (audio, view) that throws is reported here, outside the simulation, and never breaks a step.
const sim = createSim(data, { seed, threat: url.get('threat') !== '0', onListenerError: (err, rec) => console.error(`[estran] listener error on "${rec.event}":`, err) });
let quality = qualityFromUrl(location.search);
const debugEnabled = url.get('debug') === '1';
const moment = momentFromUrl(location.search);
const view = createView(sim, quality, {
  showThreat: debugEnabled, flicker: param(data, 'lighthouse_charge_flicker'),
  beamPeriod: param(data, 'lighthouse_beam_period'), beamReach: param(data, 'lighthouse_beam_reach'), beamHalfAngleDeg: param(data, 'lighthouse_beam_half_angle'),
  moment, momentFixed: url.has('moment'),
});
const meter = createPerfMeter(600);
const perf = createPerfPanel({
  meter, visible: url.get('perf') === '1',
  getContext: () => {
    const i = view.info(), mem = performance.memory;
    return {
      quality, moment, seed, tick: sim.state.tick, pixelRatio: view.pixelRatio(), bufferW: view.dom.width, bufferH: view.dom.height, gpu: view.gpuName(),
      drawCalls: i.drawCalls, triangles: i.triangles, geometries: i.geometries, textures: i.textures, heapMB: mem ? Math.round(mem.usedJSHeapSize / 1048576) : null,
    };
  },
});
sim.subscribe((e) => { if (e.type === 'noise') view.addRing(e.x, e.z, e.r, sim.state.level); });
// Guidance memory (UI only): when the latest reading happened; the first aids (spec C1) follow the simulation time.
const guideMemo = { lastReadT: null };
sim.subscribe((e) => { if (e.type === 'station_read') guideMemo.lastReadT = e.t; });
const tips = createTips(data, sim.world);
const threatCues = createThreatCues();
const safeBand = (id) => !!data.bands.find((b) => b.id === id)?.safeFromThreat;
let guideTick = -1, guide = null, tipText = null;
const hud = createHud(document.getElementById('hud'));
const captions = createCaptions(document.getElementById('captions'), document.getElementById('toast'));
let storage = null;
try { storage = window.localStorage; } catch { /* storage blocked: settings just do not persist */ }
let syncOptions = () => {};
const audio = createAudioSystem({
  data, world: sim.world, storage, onCaption: (c) => captions.show(c), onChange: (st) => syncOptions(st), onCue: (c) => tips.onCue(c.kind),
  // The start click also plays a short test sound: say so, unless the sound is muted on purpose.
  onTestSound: () => { const s = audio.settings; if (!s.muted && s.volume > 0) captions.toast('Son de test lancé. Rien entendu ? Vérifiez le volume et le casque. M : couper ou activer le son.', 6000); },
});
const audioOffline = createOfflineTools(data, sim.world);
const listenerNow = () => { const p = sim.state.player; return { x: p.x, z: p.z, yaw: bot ? p.yaw : input.yaw }; };
sim.subscribe((e) => audio.onEvent(e, sim.state, listenerNow()));
const stepper = createStepper(sim.env.dt, 3);
const debugEl = document.getElementById('debug');
const intro = document.getElementById('intro');
syncOptions = bindAudioOptions(document.getElementById('opts'), audio, captions, { indicator: document.getElementById('sound-ind'), banner: document.getElementById('audio-banner') });
syncOptions({ ...audio.settings, status: audio.status });
// P2 start screen: questionnaire, performance report copy, credits (reads the meter through perf.report()).
bindStartScreen(document.getElementById('p2bar'), { build: typeof __ESTRAN_BUILD__ === 'string' ? __ESTRAN_BUILD__ : 'dev', getPerfReport: () => perf.report() });
const typing = (e) => { const t = e.target; return !!t && (t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && t.type === 'text')); };

let bot = null, botMode = null;
let paused = true;      // true while the intro/pause overlay is up
let manual = false;     // test mode: real-time stepping off, ticks only through advance()
let speed = 1;          // debug x6 / test fast-forward: more ticks per frame, same tick length
let prev = { x: 0, z: 0, ground: 0 };
let fps = 0, frames = 0, fpsAcc = 0;
let poseOverride = null; // test only: a free camera for the captures (render side, the simulation is untouched)

const input = createInput(view.dom, () => { if (sim.state.outcome) restart(); });
input.yaw = sim.state.player.yaw;
const snapshotPrev = () => { const p = sim.state.player; prev = { x: p.x, z: p.z, ground: p.ground }; };
snapshotPrev();

function tickInput() { return bot ? bot() : input.tick(); }
function tickOnce() { snapshotPrev(); sim.step(tickInput()); }

function restart() {
  sim.reset(); audio.reset(); stepper.reset(); input.clear(); input.yaw = sim.state.player.yaw; snapshotPrev();
  if (bot) bot = createBot(sim, botMode);
  guideMemo.lastReadT = null; tips.reset(); threatCues.reset(); guideTick = -1;
}
const startButton = document.getElementById('start');
function pause() { if (paused) return; paused = true; input.clear(); audio.suspend(); startButton.textContent = 'Cliquer pour reprendre'; intro.classList.remove('hidden'); document.body.classList.add('menu'); }
function resume() { intro.classList.add('hidden'); document.body.classList.remove('menu'); input.clear(); stepper.reset(); audio.resume(); paused = false; }
// The audio context is created and resumed INSIDE this click handler (browser rule): that is what makes the sound start.
intro.addEventListener('click', () => { audio.start(); resume(); view.dom.requestPointerLock?.(); });
// If the sound failed (banner shown), any click or key in the window retries it.
for (const ev of ['pointerdown', 'keydown']) addEventListener(ev, () => { if (audio.status.failure === 'context') audio.start(); });
document.addEventListener('pointerlockchange', () => { if (document.pointerLockElement !== view.dom && !manual && !sim.state.outcome) pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
addEventListener('keydown', (e) => {
  if (typing(e) && e.code !== 'F2') return; // typing an answer never drives the game (F2 still closes the measurement screen)
  if (e.code === 'F2') { perf.toggle(); e.preventDefault(); }
  if (e.code === 'KeyM' && !e.repeat) { captions.toast(audio.toggleMute() ? 'Son coupé' : 'Son activé'); }
  if (e.code === 'KeyK' && !e.repeat) { audio.setCaptions(!audio.settings.captions); captions.toast(audio.settings.captions ? 'Sous-titres des bruits : oui' : 'Sous-titres des bruits : non'); }
  if (!debugEnabled) return;
  if (e.code === 'F3') { debugEl.style.display = debugEl.style.display === 'block' ? 'none' : 'block'; e.preventDefault(); }
  if (e.code === 'KeyT') speed = speed === 1 ? 6 : 1;
});

let last = performance.now();
function frame(now) {
  const dt = (now - last) / 1000; last = now;
  if (!paused && !manual && !sim.state.outcome) {
    const n = stepper.advance(dt, speed);
    for (let i = 0; i < n; i++) tickOnce();
  }
  const st = sim.state, p = st.player;
  const a = paused || manual || st.outcome ? 1 : stepper.alpha;
  const pose = {
    x: prev.x + (p.x - prev.x) * a, z: prev.z + (p.z - prev.z) * a, ground: prev.ground + (p.ground - prev.ground) * a,
    yaw: bot ? p.yaw : input.yaw, pitch: input.pitch, eye: p.eyeHeight,
  };
  // Visual cues of the Laisse for a player who cannot hear (ripples at her position, edge vignette): render only, never read back.
  const cue = threatCues.update(st.threat, safeBand(p.band), st.t, Math.min(dt, 0.1));
  if (cue.ring) view.addThreatRing(st.threat.x, st.threat.z, st.level, cue.ringOpacity, RING_MAX_RADIUS, RING_LIFE_S);
  view.setThreatVignette(cue.vignette);
  const t0 = performance.now();
  view.draw(st, poseOverride || pose, st.t, Math.min(dt, 0.1));
  hud.update(hudModel(st, sim.world, data));
  // Guidance: recomputed when the simulation has ticked (30 Hz at most), the marker follows the camera every frame.
  if (st.tick !== guideTick || !guide) { guideTick = st.tick; tipText = tips.step(st); guide = guidance(st, data, sim.world, guideMemo); hud.setGuide(guide, tipText); }
  hud.placeMarker(guide.target, view.project, pose.x, pose.z, sim.world);
  if (!paused) audio.update(st, { x: pose.x, z: pose.z, yaw: pose.yaw });
  // Only played frames are measured: the report copied from the start screen then describes the game, not the menu.
  if (!paused) meter.record(dt * 1000, performance.now() - t0);
  frames++; fpsAcc += dt;
  if (fpsAcc >= 1) { fps = frames / fpsAcc; frames = 0; fpsAcc = 0; }
  if (debugEnabled && debugEl.style.display === 'block') {
    debugEl.textContent = `t ${st.t.toFixed(1)} s  tick ${st.tick}  niveau ${st.level.toFixed(2)} m  d ${p.d.toFixed(2)} m  bande ${p.band}\n`
      + `x ${p.x.toFixed(1)} z ${p.z.toFixed(1)}  lampe ${st.lamp.battery.toFixed(0)} s  souffle ${st.drown.toFixed(1)}  fps ${fps.toFixed(0)}  x${speed}`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Test hooks (read-mostly; they drive the same simulation through the same step()).
// Not exposed in the published P2 build unless the URL has ?test=1 (the tests open the page that way).
if (url.get('test') === '1') window.__estran = {
  version: 'estran-0.2.0-passe-b',
  getState: () => {
    const st = sim.state, p = st.player;
    return {
      tick: st.tick, t: st.t, level: st.level, trend: st.trend, outcome: st.outcome, cause: st.cause, readCount: st.readCount,
      player: { x: p.x, z: p.z, yaw: p.yaw, ground: p.ground, d: p.d, band: p.band, speedMult: p.speedMult },
      drown: st.drown, drownLimit: st.drownLimit, lamp: { on: st.lamp.on, battery: st.lamp.battery },
      lighthouse: { charge: st.lighthouse.charge, winding: st.lighthouse.winding ? st.lighthouse.winding.ticks / st.lighthouse.winding.total : 0 },
      noise: { ...st.noise }, cold: st.cold, grabs: st.grabs,
      threat: st.threat ? { active: st.threat.active, mode: st.threat.mode, x: st.threat.x, z: st.threat.z, dist: st.threat.dist, heard: st.threat.heard, lit: st.threat.lit } : null,
      stations: st.stations.map((s) => ({ id: s.id, read: s.read, readable: s.readable, progress: s.progress })),
      quality, moment, paused, speed, fps, ...view.info(),
    };
  },
  getTelemetry: () => sim.telemetry(),
  /** The guidance texts and marker target of the last tick (what the HUD displays). */
  getGuide: () => ({ ...guide, tip: tipText }),
  /** Visual cues of the Laisse as drawn now (ripples on screen, vignette strength). */
  getCue: () => view.threatCueInfo(),
  probeVignette: () => view.probeVignette(),
  /** Audio hooks for the tests: settings and voice counters, listener errors, offline rendering (OfflineAudioContext). */
  audioStats: () => ({ ...audio.stats(), listenerErrors: sim.listenerErrors.length }),
  audio: { start: () => audio.start(), setVolume: (v) => audio.setVolume(v), setMuted: (b) => audio.setMuted(b), setCaptions: (b) => audio.setCaptions(b) },
  audioOffline,
  getWorld: () => ({ seed, start: sim.world.start, lighthouse: sim.world.lighthouse, crank: sim.world.crank, stations: sim.world.stations, debris: sim.world.debris }),
  /** Subscribes to the simulation journal events (noise, threat_state, grab...). Same stream the audio (T-031) will use. */
  subscribe: (fn) => sim.subscribe(fn),
  /** Test only: aims the camera at a point (no effect while a bot drives the yaw). */
  lookAt: (x, z, pitch = -0.1) => { const p = sim.state.player; input.yaw = Math.atan2(-(x - p.x), -(z - p.z)); input.pitch = pitch; },
  hideIntro: () => { resume(); },
  setQuality: (q) => { if (QUALITY[q]) { quality = q; view.setQuality(q); meter.reset(); } },
  /** Render-only probes: pixels changed by the Laisse in the current frame; the performance report as an object. */
  probeLaisse: () => view.probeLaisse(),
  setPose: (p) => { poseOverride = p; },
  perfReport: () => perf.report(),
  perfSummary: () => meter.summary(),
  perfReset: () => meter.reset(),
  setBot: (mode) => { botMode = mode; bot = mode ? createBot(sim, mode) : null; },
  setManual: (b) => { manual = b; },
  setSpeed: (n) => { speed = n; },
  advance: (n) => { for (let i = 0; i < n && !sim.state.outcome; i++) tickOnce(); return sim.state.tick; },
  restart,
};
