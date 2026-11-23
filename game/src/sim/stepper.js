// Fixed-step accumulator: converts variable frame times into whole simulation ticks.
export function createStepper(dt, maxStepsPerFrame = 3) {
  let acc = 0;
  return {
    /** speed > 1 (debug x6, test mode) raises both the time scale and the per-frame cap; the tick itself never changes. */
    advance(frameDt, speed = 1) {
      acc += Math.min(frameDt, 0.1) * speed;
      const cap = maxStepsPerFrame * Math.max(1, Math.ceil(speed));
      let n = 0;
      while (acc >= dt - 1e-9 && n < cap) { acc -= dt; n++; }
      if (acc > dt) acc = dt; // drop the backlog (slow frames slow the game down, they never change a tick)
      return n;
    },
    get alpha() { return Math.max(0, Math.min(1, acc / dt)); },
    reset() { acc = 0; },
  };
}
