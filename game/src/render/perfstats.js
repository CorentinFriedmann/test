// Pure frame-time statistics (no DOM, no three.js): unit-tested, used by the measurement screen.

/** Percentile with linear interpolation. p in [0, 100]. Returns 0 for an empty list. */
export function percentile(values, p) {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  const pos = (s.length - 1) * Math.min(100, Math.max(0, p)) / 100;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return s[lo] + (s[hi] - s[lo]) * (pos - lo);
}

const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);

/** Rolling window over the last `size` frames: frame interval (ms) and CPU time spent in the draw call (ms). */
export function createPerfMeter(size = 600) {
  let dts = [], cpus = [], total = 0;
  return {
    /** dtMs: time between two frames; cpuMs: JavaScript time of the draw (never the GPU time). Gaps > 1 s (hidden tab) are ignored. */
    record(dtMs, cpuMs = 0) {
      if (!(dtMs > 0) || dtMs > 1000) return;
      dts.push(dtMs); cpus.push(cpuMs); total++;
      if (dts.length > size) { dts.shift(); cpus.shift(); }
    },
    reset() { dts = []; cpus = []; total = 0; },
    summary() {
      const m = mean(dts);
      return {
        frames: dts.length, framesTotal: total,
        avgFps: m > 0 ? 1000 / m : 0,
        avgFrameMs: m, p50FrameMs: percentile(dts, 50), p95FrameMs: percentile(dts, 95), p99FrameMs: percentile(dts, 99),
        maxFrameMs: dts.length ? Math.max(...dts) : 0,
        hitches33ms: dts.filter((x) => x > 33.4).length,
        cpuDrawAvgMs: mean(cpus), cpuDrawP95Ms: percentile(cpus, 95),
      };
    },
  };
}
