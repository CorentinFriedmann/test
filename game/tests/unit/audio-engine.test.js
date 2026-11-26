// T-040: deterministic test of src/audio/engine.js with a fake audio context (no browser, no real audio).
// Covers voice stealing at MAX_VOICES (28), priorityOf, and "a critical voice is never refused" (reserve of T-038).
// The fake context records the connections and the automation of the nodes; a voice is identified by its stereo panner.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createEngine, priorityOf, PRIORITY } from '../../src/audio/engine.js';

const MAX_VOICES = 28; // mirrors the private constant of engine.js: the tests below also check it is really reached
const AUDIBLE_R = 100;
const CFG = { tide: { min: 0, max: 10 }, lighthouse: { x: 0, z: -50 }, audibleR: AUDIBLE_R, roarR: 80, flicker: 0.2, seed: 7 };
const L0 = { x: 0, z: 0, yaw: 0 };

/** Minimal AudioParam: stores the value and records the automation calls. */
function fakeParam(v = 0) {
  const p = { value: v, ramps: [], cancelled: 0 };
  for (const m of ['setValueAtTime', 'setTargetAtTime', 'exponentialRampToValueAtTime', 'linearRampToValueAtTime']) {
    p[m] = (val, ...rest) => { p.ramps.push({ m, val, rest }); return p; };
  }
  p.cancelScheduledValues = () => { p.cancelled++; return p; };
  return p;
}

/** Fake BaseAudioContext: just enough nodes for createEngine. Sample rate is low to keep the noise generation fast. */
function fakeContext() {
  const nodes = [];
  const mk = (type, params = {}) => {
    const n = { type, inputs: [], outputs: [], started: 0, stopped: 0, onended: null, ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, fakeParam(v)])) };
    n.connect = (to) => { n.outputs.push(to); if (to && to.inputs) to.inputs.push(n); return to; };
    n.disconnect = () => { for (const o of n.outputs) if (o.inputs) o.inputs = o.inputs.filter((x) => x !== n); n.outputs = []; };
    n.start = () => { n.started++; };
    n.stop = () => { n.stopped++; };
    nodes.push(n);
    return n;
  };
  const ctx = {
    sampleRate: 8000, currentTime: 0, state: 'running', destination: mk('destination'), nodes,
    createGain: () => mk('gain', { gain: 1 }),
    createBiquadFilter: () => mk('biquad', { frequency: 350, Q: 1, detune: 0, gain: 0 }),
    createStereoPanner: () => mk('panner', { pan: 0 }),
    createOscillator: () => mk('osc', { frequency: 440, detune: 0 }),
    createBufferSource: () => mk('source', { playbackRate: 1, detune: 0 }),
    createDynamicsCompressor: () => mk('comp', { threshold: 0, knee: 0, ratio: 0, attack: 0, release: 0 }),
    createWaveShaper: () => mk('shaper'),
    createBuffer: (ch, len, sr) => { const d = new Float32Array(len); return { duration: len / sr, getChannelData: () => d }; },
    /** Ends every voice that has a pending `onended` (what the browser does when a source finishes). */
    endAll() { for (const n of nodes) if (typeof n.onended === 'function') { const f = n.onended; n.onended = null; f(); } },
  };
  return ctx;
}

// Cue factories. All have a position so that the geometry is defined (the voice's own pan is overridden where needed).
let footCounter = 0;
const step = () => ({ kind: 'step', band: 'berge', hits: 1, foot: ((footCounter++ % 11) - 5) / 10, power: 1, x: 0, z: -1 });
const debris = () => ({ kind: 'debris', x: 0, z: -5 });
const lhToll = () => ({ kind: 'lh_toll', x: 0, z: -10 });
const heartbeat = () => ({ kind: 'heartbeat', power: 1 });
const grab = () => ({ kind: 'grab' });
const swirl = (dist) => ({ kind: 'swirl', x: 0, z: -dist, dist });

/** Engine + helpers. `voices()` lists the voice panners (created last by outStage, one per live or finished voice). */
function setup() {
  const ctx = fakeContext();
  const eng = createEngine(ctx, CFG);
  const afterInit = ctx.nodes.length;
  const play = (cue) => eng.play(cue, L0);
  /** Voice gain nodes in creation order: gain -> lowpass -> panner -> bus; found through the panners created after init. */
  const voiceGains = () => ctx.nodes.slice(afterInit).filter((n) => n.type === 'panner').map((p) => p.inputs[0] ? p.inputs[0].inputs[0] : null);
  return { ctx, eng, play, voiceGains, stats: eng.stats };
}
/** A voice is stolen when its gain is ramped to 0 in 30 ms (STEAL_FADE). */
const isFadedOut = (g) => g && g.gain.ramps.some((r) => r.m === 'linearRampToValueAtTime' && r.val === 0 && r.rest[0] === 0.03);

// ---- priorityOf ----
test('priorityOf: critical kinds, swirl by distance, high, normal and low kinds', () => {
  for (const k of ['grab', 'growl', 'roar', 'heartbeat']) assert.equal(priorityOf(k, undefined, AUDIBLE_R), PRIORITY.CRITICAL, k);
  assert.equal(priorityOf('swirl', { dist: 65 }, 100), PRIORITY.CRITICAL, 'swirl at exactly 65 % of audibleR is critical');
  assert.equal(priorityOf('swirl', { dist: 65.01 }, 100), PRIORITY.NORMAL, 'swirl just beyond 65 % is normal');
  assert.equal(priorityOf('swirl', undefined, 100), PRIORITY.NORMAL, 'swirl without a cue is normal');
  assert.equal(priorityOf('swirl', {}, 100), PRIORITY.NORMAL, 'swirl without distance is normal');
  for (const k of ['lh_low', 'lh_toll', 'lh_out', 'lh_wound', 'end']) assert.equal(priorityOf(k, undefined, 100), PRIORITY.HIGH, k);
  for (const k of ['debris', 'flee_splash']) assert.equal(priorityOf(k, undefined, 100), PRIORITY.NORMAL, k);
  for (const k of ['step_gue', 'step_berge', 'interact', 'station', 'lamp']) assert.equal(priorityOf(k, undefined, 100), PRIORITY.LOW, k);
  assert.ok(PRIORITY.LOW < PRIORITY.NORMAL && PRIORITY.NORMAL < PRIORITY.HIGH && PRIORITY.HIGH < PRIORITY.CRITICAL);
});

// ---- voice stealing ----
test('below the ceiling nothing is stolen or dropped; at the ceiling a same-priority voice is refused', () => {
  const { play, stats } = setup();
  for (let i = 0; i < MAX_VOICES; i++) play(step());
  assert.equal(stats.active, MAX_VOICES, 'the ceiling is really reached');
  assert.equal(stats.stolen, 0); assert.equal(stats.dropped, 0);
  play(step()); // LOW onto a full house of LOW: refused (no strictly lower voice)
  assert.equal(stats.active, MAX_VOICES);
  assert.equal(stats.dropped, 1); assert.equal(stats.droppedByPriority[PRIORITY.LOW], 1); assert.equal(stats.stolen, 0);
});

test('a higher-priority voice at the ceiling steals the OLDEST voice of the lowest priority, with a 30 ms fade', () => {
  const { play, voiceGains, stats } = setup();
  for (let i = 0; i < MAX_VOICES; i++) play(step());
  play(debris()); // NORMAL > LOW
  assert.equal(stats.stolen, 1); assert.equal(stats.dropped, 0);
  assert.equal(stats.active, MAX_VOICES, 'the budget stays at the ceiling');
  const gains = voiceGains();
  assert.equal(gains.length, MAX_VOICES + 1);
  assert.ok(isFadedOut(gains[0]), 'the oldest voice is the one faded out');
  assert.ok(gains.slice(1, MAX_VOICES).every((g) => !isFadedOut(g)), 'the other old voices are untouched');
  assert.ok(!isFadedOut(gains[MAX_VOICES]), 'the new voice is not faded');
  play(lhToll()); // HIGH steals the next oldest LOW voice, not the NORMAL one
  assert.equal(stats.stolen, 2);
  assert.ok(isFadedOut(voiceGains()[1]), 'second oldest LOW voice stolen');
  assert.ok(!isFadedOut(voiceGains()[MAX_VOICES]), 'the NORMAL debris voice survives while LOW voices exist');
});

test('the lowest priority is stolen first, even when a newer voice has lower priority than an older one', () => {
  const { play, voiceGains, stats } = setup();
  play(debris()); // oldest, NORMAL
  for (let i = 0; i < MAX_VOICES - 1; i++) play(step()); // then 27 LOW
  assert.equal(stats.active, MAX_VOICES);
  play(lhToll()); // HIGH: must take a LOW voice (the oldest LOW = index 1), never the older NORMAL one
  assert.ok(!isFadedOut(voiceGains()[0]), 'older NORMAL voice kept');
  assert.ok(isFadedOut(voiceGains()[1]), 'oldest LOW voice stolen');
});

test('non-critical voices are refused when the ceiling holds only voices of their own or higher priority', () => {
  const { play, stats } = setup();
  for (let i = 0; i < MAX_VOICES; i++) play(lhToll()); // all HIGH
  play(debris()); play(lhToll()); play(step());
  assert.equal(stats.dropped, 3); assert.equal(stats.stolen, 0); assert.equal(stats.active, MAX_VOICES);
  assert.deepEqual(stats.droppedByPriority, [1, 1, 1, 0]);
  assert.equal(stats.droppedCritical, 0);
});

// ---- critical voices ----
test('a critical voice is never refused: full of LOW, it takes the oldest LOW voice', () => {
  const { play, voiceGains, stats } = setup();
  for (let i = 0; i < MAX_VOICES; i++) play(step());
  play(grab());
  assert.equal(stats.droppedCritical, 0); assert.equal(stats.dropped, 0);
  assert.equal(stats.stolen, 1); assert.equal(stats.active, MAX_VOICES);
  assert.ok(isFadedOut(voiceGains()[0]));
  assert.equal(stats.played.grab, 1);
});

test('a critical voice is never refused: full of HIGH, it still takes the oldest HIGH voice', () => {
  const { play, voiceGains, stats } = setup();
  for (let i = 0; i < MAX_VOICES; i++) play(lhToll());
  play(heartbeat());
  assert.equal(stats.droppedCritical, 0); assert.equal(stats.stolen, 1);
  assert.ok(isFadedOut(voiceGains()[0]));
  assert.equal(stats.played.heartbeat, 1);
});

test('a critical voice is never refused: full of CRITICAL voices, it takes the oldest critical one', () => {
  const { play, voiceGains, stats } = setup();
  for (let i = 0; i < MAX_VOICES; i++) play(heartbeat());
  assert.equal(stats.active, MAX_VOICES);
  for (let k = 1; k <= 5; k++) {
    play(grab());
    assert.equal(stats.droppedCritical, 0); assert.equal(stats.dropped, 0);
    assert.equal(stats.stolen, k); assert.equal(stats.active, MAX_VOICES);
    assert.ok(isFadedOut(voiceGains()[k - 1]), `critical voice #${k} took the oldest remaining one`);
  }
  assert.equal(stats.played.grab, 5);
});

test('critical swirls: a close Laisse (<= 65 % of audibleR) is never refused, a far one is refused like any normal voice', () => {
  const { play, stats } = setup();
  for (let i = 0; i < MAX_VOICES; i++) play(debris()); // all NORMAL
  play(swirl(90)); // far: NORMAL, refused
  assert.equal(stats.dropped, 1); assert.equal(stats.droppedByPriority[PRIORITY.NORMAL], 1); assert.equal(stats.stolen, 0);
  play(swirl(40)); // close: CRITICAL, steals a NORMAL voice
  assert.equal(stats.droppedCritical, 0); assert.equal(stats.stolen, 1); assert.equal(stats.played.swirl, 1);
});

// ---- release ----
test('when voices end, slots are freed once (stolen voices are not counted twice) and new voices fit again', () => {
  const { ctx, play, stats } = setup();
  for (let i = 0; i < MAX_VOICES; i++) play(step());
  play(grab()); // one stolen
  assert.equal(stats.active, MAX_VOICES);
  ctx.endAll();
  assert.equal(stats.active, 0, 'every voice, stolen or not, released exactly once');
  play(step());
  assert.equal(stats.active, 1);
});
