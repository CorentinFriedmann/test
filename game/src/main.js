// Browser entry: wires the pure simulation (30 Hz fixed step) to the three.js view, the HUD and the input.
// Rendering reads the simulation state; it never writes to it, and render settings never change a tick.
import { loadData, param } from './data/load.js';
import { createSim } from './sim/sim.js';
import { createStepper } from './sim/stepper.js';
import { createBot } from './sim/bot.js';
import { QUALITY, qualityFromUrl } from './render/quality.js';
import { createView } from './render/scene.js';
import { createHud } from './ui/hud.js';
import { createInput } from './ui/input.js';
import { hudModel } from './ui/hud-model.js';

const url = new URLSearchParams(location.search);
const data = loadData();
const seed = url.has('seed') ? Number(url.get('seed')) : param(data, 'sim_seed');
const sim = createSim(data, { seed });
let quality = qualityFromUrl(location.search);
const view = createView(sim, quality);
const hud = createHud(document.getElementById('hud'));
const stepper = createStepper(sim.env.dt, 3);
const debugEnabled = url.get('debug') === '1';
const debugEl = document.getElementById('debug');
const intro = document.getElementById('intro');

let bot = null, botMode = null;
let paused = true;      // true while the intro/pause overlay is up
let manual = false;     // test mode: real-time stepping off, ticks only through advance()
let speed = 1;          // debug x6 / test fast-forward: more ticks per frame, same tick length
let prev = { x: 0, z: 0, ground: 0 };
let fps = 0, frames = 0, fpsAcc = 0;

const input = createInput(view.dom, () => { if (sim.state.outcome) restart(); });
input.yaw = sim.state.player.yaw;
const snapshotPrev = () => { const p = sim.state.player; prev = { x: p.x, z: p.z, ground: p.ground }; };
snapshotPrev();

function tickInput() { return bot ? bot() : input.tick(); }
function tickOnce() { snapshotPrev(); sim.step(tickInput()); }

function restart() {
  sim.reset(); stepper.reset(); input.clear(); input.yaw = sim.state.player.yaw; snapshotPrev();
  if (bot) bot = createBot(sim, botMode);
  hud.showObjective('Lisez les trois échelles de marée.', 6000);
}
function pause() { if (paused) return; paused = true; input.clear(); intro.classList.remove('hidden'); }
function resume() {
  intro.classList.add('hidden'); input.clear(); stepper.reset();
  if (paused) hud.showObjective('Lisez les trois échelles de marée.', 6000);
  paused = false;
}
intro.addEventListener('click', () => { resume(); view.dom.requestPointerLock?.(); });
document.addEventListener('pointerlockchange', () => { if (document.pointerLockElement !== view.dom && !manual && !sim.state.outcome) pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
addEventListener('keydown', (e) => {
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
  view.draw(st, pose, st.t);
  hud.update(hudModel(st, sim.world, data));
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
window.__estran = {
  version: 'estran-0.1.0-passe-a',
  getState: () => {
    const st = sim.state, p = st.player;
    return {
      tick: st.tick, t: st.t, level: st.level, trend: st.trend, outcome: st.outcome, cause: st.cause, readCount: st.readCount,
      player: { x: p.x, z: p.z, yaw: p.yaw, ground: p.ground, d: p.d, band: p.band, speedMult: p.speedMult },
      drown: st.drown, lamp: { on: st.lamp.on, battery: st.lamp.battery },
      stations: st.stations.map((s) => ({ id: s.id, read: s.read, readable: s.readable, progress: s.progress })),
      quality, paused, speed, fps, ...view.info(),
    };
  },
  getTelemetry: () => sim.telemetry(),
  getWorld: () => ({ seed, start: sim.world.start, lighthouse: sim.world.lighthouse, stations: sim.world.stations }),
  hideIntro: () => { resume(); },
  setQuality: (q) => { if (QUALITY[q]) { quality = q; view.setQuality(q); } },
  setBot: (mode) => { botMode = mode; bot = mode ? createBot(sim, mode) : null; },
  setManual: (b) => { manual = b; },
  setSpeed: (n) => { speed = n; },
  advance: (n) => { for (let i = 0; i < n && !sim.state.outcome; i++) tickOnce(); return sim.state.tick; },
  restart,
};
