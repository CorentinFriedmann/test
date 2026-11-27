// Fake Web Audio context shared by the audio tests (no browser, no real audio).
/** Minimal AudioParam: stores the value and records the automation calls. */
export function fakeParam(v = 0) {
  const p = { value: v, ramps: [], cancelled: 0 };
  for (const m of ['setValueAtTime', 'setTargetAtTime', 'exponentialRampToValueAtTime', 'linearRampToValueAtTime']) {
    p[m] = (val, ...rest) => { p.ramps.push({ m, val, rest }); return p; };
  }
  p.cancelScheduledValues = () => { p.cancelled++; return p; };
  return p;
}

/** Fake BaseAudioContext: just enough nodes for createEngine. Sample rate is low to keep the noise generation fast. */
export function fakeContext() {
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

