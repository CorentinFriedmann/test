// T-043 C2: the start-up of the sound. The context is created and resumed inside the start() call (the click handler), the test
// chime is two soft notes, the failure is detected 1.5 s after the click (with resume retries at 0.5 s and 1 s) or when the context
// is lost, and the indicator / banner texts follow. A fake context and a fake scheduler: deterministic, no browser.
import test from 'node:test';
import assert from 'node:assert/strict';
import { data, newSim } from './helpers.js';
import { createAudioSystem } from '../../src/audio/index.js';
import { CHIME_PEAK, CHIME_NOTES } from '../../src/audio/engine.js';
import { soundIndicator, BANNER_TEXT } from '../../src/ui/audio-opts.js';
import { fakeContext } from './fake-audio.js';

/** A context that stays "suspended" until `allow` is called, like a browser that refuses to start the audio. */
function makeClass({ refuse = false, throws = false } = {}) {
  const made = [];
  class FakeAC {
    constructor() {
      if (throws) throw new Error('no audio device');
      const ctx = fakeContext();
      ctx.state = 'suspended'; ctx.resumeCalls = 0; ctx.listeners = [];
      ctx.addEventListener = (type, fn) => { if (type === 'statechange') ctx.listeners.push(fn); };
      ctx.setState = (s) => { ctx.state = s; ctx.listeners.forEach((f) => f()); };
      ctx.resume = () => { ctx.resumeCalls++; if (!refuse) ctx.setState('running'); return Promise.resolve(); };
      ctx.suspend = () => { ctx.setState('suspended'); return Promise.resolve(); };
      made.push(ctx);
      return ctx;
    }
  }
  FakeAC.made = made;
  return FakeAC;
}
function setup(cls, extra = {}) {
  const timers = [], changes = [];
  const sim = newSim();
  const audio = createAudioSystem({
    data, world: sim.world, AudioContextClass: cls, schedule: (fn, ms) => timers.push({ fn, ms }),
    onChange: (s) => changes.push(s), ...extra,
  });
  const fire = () => { const t = timers.splice(0); t.sort((a, b) => a.ms - b.ms).forEach((x) => x.fn()); return t.map((x) => x.ms); };
  return { audio, timers, changes, fire, ctx: () => cls.made[0] };
}

test('start(): creates and resumes the context inside the call, plays the test chime, reports running', () => {
  const cls = makeClass(); const tests = [];
  const { audio, ctx, changes } = setup(cls, { onTestSound: () => tests.push(1) });
  assert.equal(cls.made.length, 0, 'no AudioContext before the gesture');
  assert.equal(audio.start(), true);
  assert.equal(cls.made.length, 1);
  assert.equal(ctx().resumeCalls, 1, 'resume() called in the same call');
  assert.equal(ctx().state, 'running');
  assert.equal(audio.stats().state, 'running');
  assert.equal(tests.length, 1, 'the test sound callback fired once');
  assert.equal(changes.at(-1).status.state, 'running');
  assert.equal(audio.status.failure, null);
  audio.start(); assert.equal(cls.made.length, 1, 'a second click reuses the context'); assert.equal(tests.length, 1, 'chime only once');
});

test('test chime: two notes 440 Hz then 330 Hz, 0.5 s each, slow envelope, peak about -12 dBFS, through the bus (so volume and mute apply)', () => {
  const cls = makeClass(); const { audio, ctx } = setup(cls);
  audio.start();
  const nodes = ctx().nodes;
  const bus = nodes.find((n) => n.type === 'gain' && n.outputs.some((o) => o.type === 'lowpass')); // bus -> master low-pass -> limiter -> volume
  const notes = nodes.filter((n) => n.type === 'sine' && n.started === 1 && n.stopped === 1 && CHIME_NOTES.some(([f]) => f === n.frequency.value));
  assert.deepEqual(notes.map((o) => o.frequency.value), [440, 330]);
  assert.ok(Math.abs(20 * Math.log10(CHIME_PEAK) + 12) < 0.1, `peak ${20 * Math.log10(CHIME_PEAK)} dBFS`);
  for (const o of notes) {
    const g = o.outputs[0], r = g.gain.ramps;
    assert.deepEqual(r.map((x) => x.val), [0, CHIME_PEAK, 0], 'attack to the peak then release to 0: no click');
    assert.ok(r[1].rest[0] - r[0].rest[0] >= 0.1, 'slow attack (>= 0.1 s)');
    assert.ok(Math.abs(r[2].rest[0] - r[0].rest[0] - 0.5) < 1e-9, 'each note lasts 0.5 s');
    assert.ok(g.outputs.includes(bus), 'goes through the bus, the limiter and the volume like every other sound');
  }
  assert.ok(notes[1].frequency.value < notes[0].frequency.value);
});

test('failure: a context that stays suspended is retried at 0.5 s and 1 s, declared failed at 1.5 s, and recovers when it runs', () => {
  const cls = makeClass({ refuse: true }); const { audio, timers, changes, fire, ctx } = setup(cls);
  audio.start();
  assert.deepEqual(timers.map((t) => t.ms), [500, 1000, 1500]);
  assert.equal(audio.status.failure, null, 'not yet: the check is at 1.5 s');
  const before = ctx().resumeCalls;
  fire();
  assert.equal(ctx().resumeCalls, before + 2, 'two more resume() tries (0.5 s and 1 s)');
  assert.equal(audio.status.failure, 'context');
  assert.equal(changes.at(-1).status.failure, 'context');
  assert.equal(soundIndicator(changes.at(-1)).text, 'SON INDISPONIBLE');
  // the player clicks again and the browser accepts: the failure goes away
  ctx().resume = () => { ctx().resumeCalls++; ctx().setState('running'); return Promise.resolve(); };
  audio.start();
  assert.equal(audio.status.failure, null);
  assert.equal(soundIndicator(changes.at(-1)).text, 'SON ACTIF');
});

test('failure: a late resume (before 1.5 s) is fine; losing the context later without a pause is a failure; a pause is not', () => {
  const cls = makeClass({ refuse: true }); const { audio, fire, ctx } = setup(cls);
  audio.start();
  ctx().resume = () => { ctx().setState('running'); return Promise.resolve(); }; // accepted at the 0.5 s retry
  fire();
  assert.equal(audio.status.failure, null);
  ctx().setState('suspended'); // browser took the audio away
  assert.equal(audio.status.failure, 'context');
  audio.start(); assert.equal(audio.status.failure, null);
  audio.suspend(); // the pause screen
  assert.equal(audio.status.failure, null, 'a pause is not a failure');
  assert.equal(audio.status.intentional, true);
  assert.equal(soundIndicator({ volume: 0.8, muted: false, status: audio.status }).text, 'SON ACTIF', 'indicator stays on during the pause');
  audio.resume(); assert.equal(audio.status.state, 'running');
});

test('failure: no AudioContext, or one that throws, is "unsupported" with the browser message', () => {
  const none = setup(null, { AudioContextClass: undefined });
  assert.equal(none.audio.start(), false);
  assert.equal(none.audio.status.failure, 'unsupported');
  assert.equal(BANNER_TEXT.unsupported, 'Ce navigateur ne peut pas jouer le son du jeu. Essayez Chrome ou Edge.');
  const th = setup(makeClass({ throws: true }));
  assert.equal(th.audio.start(), false);
  assert.equal(th.audio.status.failure, 'unsupported');
  assert.equal(soundIndicator(th.changes.at(-1)).text, 'SON INDISPONIBLE');
});

test('indicator: SON ACTIF / SON COUPÉ follow the mute key and the volume; waiting before the first click; exact banner text', () => {
  const cls = makeClass(); const { audio, changes } = setup(cls);
  const ind = () => soundIndicator({ ...audio.settings, status: audio.status }).text;
  assert.equal(ind(), 'SON EN ATTENTE');
  audio.start(); assert.equal(ind(), 'SON ACTIF');
  assert.equal(audio.toggleMute(), true); assert.equal(ind(), 'SON COUPÉ'); assert.equal(soundIndicator(changes.at(-1)).text, 'SON COUPÉ');
  assert.equal(audio.toggleMute(), false); assert.equal(ind(), 'SON ACTIF');
  audio.setVolume(0); assert.equal(ind(), 'SON COUPÉ', 'volume 0 reads as muted');
  audio.setVolume(0.5); assert.equal(ind(), 'SON ACTIF');
  assert.equal(BANNER_TEXT.context, 'Le son ne démarre pas. Cliquez dans la fenêtre, vérifiez le volume de l\'ordinateur et que l\'onglet n\'est pas muet.');
});

test('subtitles are on by default and the audio cues reach onCue (first aids) and the subtitles', () => {
  const cls = makeClass(); const cues = [], caps = [];
  const sim = newSim();
  const audio = createAudioSystem({ data, world: sim.world, AudioContextClass: cls, schedule: () => {}, onCue: (c) => cues.push(c.kind), onCaption: (c) => caps.push(c.text) });
  assert.equal(audio.settings.captions, true);
  audio.onEvent({ type: 'threat_spawn', x: 10, z: 0, dist: 10 }, sim.state, { x: 0, z: 0, yaw: 0 });
  assert.deepEqual(cues, ['swirl']);
  assert.equal(caps.length, 1);
  assert.match(caps[0], /bruit dans l'eau/);
});
