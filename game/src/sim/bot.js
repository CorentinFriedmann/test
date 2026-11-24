// Scripted players for tests (pure, deterministic): they only read the simulation state and return an input per tick.
//   win   : reads the three ladders, returns to the platform between reads and at the end.
//   drown : reads the first ladder, then wades out to sea until it drowns.
//   idle  : never moves (misses the first window).
//   prudent : like win, but walks back to the crank after every reading and rewinds the lighthouse (pass b).
//   noisy   : reads S1 like win, then runs at the Laisse in the shallows: it gets seized twice and loses (pass b).
import { planDeparture } from './walk.js';
import { hypot } from './util.js';
import { NEUTRAL_INPUT } from './sim.js';

const headingTo = (from, to) => Math.atan2(-(to.x - from.x), -(to.z - from.z)); // forward = (-sin yaw, -cos yaw)

export function createBot(sim, mode = 'win') {
  const { world, env } = sim;
  const rewindBelow = 60; // prudent bot: rewinds the lighthouse (back to 100 %) whenever it is home and below this charge
  let plan = null, returning = false, lastRead = 0;
  const toward = (p, target, stop) => {
    const dist = hypot(target.x - p.x, target.z - p.z);
    return dist <= stop ? { ...NEUTRAL_INPUT, yaw: p.yaw } : { ...NEUTRAL_INPUT, yaw: headingTo(p, target), moveF: 1 };
  };

  return function botInput() {
    const s = sim.state, p = s.player;
    if (mode === 'idle' || s.outcome) return NEUTRAL_INPUT;

    if (mode === 'noisy' && s.readCount >= 1) {
      const th = s.threat;
      if (p.d >= 0.8) return toward(p, world.start, 0.8); // never wade into deep water: this bot dies of the Laisse, not of the sea
      if (!th || !th.active || th.mode === 'flee') return { ...NEUTRAL_INPUT, yaw: p.yaw };
      const dist = hypot(th.x - p.x, th.z - p.z);
      return dist <= 0.5 ? { ...NEUTRAL_INPUT, yaw: p.yaw } : { ...NEUTRAL_INPUT, run: true, yaw: headingTo(p, th), moveF: 1 };
    }

    const next = s.stations.findIndex((x) => !x.read);
    if (mode === 'drown' && next > 0) {
      // Wade straight out to sea beyond the first ladder.
      const w = world.stations[0], k = (env.mapRadius - 3) / hypot(w.x, w.z);
      return toward(p, { x: w.x * k, z: w.z * k }, 0.5);
    }
    if (next < 0) return toward(p, world.start, 0.8); // all read: back to the platform

    if (mode === 'prudent') {
      if (s.readCount !== lastRead) { lastRead = s.readCount; returning = true; plan = null; }
      if (returning) {
        const c = world.crank;
        if (hypot(c.x - p.x, c.z - p.z) > 1.2) return toward(p, c, 1.2);
        if (s.lighthouse.charge < rewindBelow) return { ...NEUTRAL_INPUT, yaw: p.yaw, interact: true };
        returning = false;
      }
    }
    const w = world.stations[next];
    if (!plan || plan.index !== next) {
      plan = { index: next, depart: planDeparture(env, world.heightAt, p, w, w.interval, s.t) };
    }
    if (s.t < plan.depart) {
      const c = world.crank;
      if (mode === 'prudent' && s.lighthouse.charge < rewindBelow && hypot(c.x - p.x, c.z - p.z) <= 2) return { ...NEUTRAL_INPUT, yaw: p.yaw, interact: true };
      return { ...NEUTRAL_INPUT, yaw: p.yaw };
    }
    const dist = hypot(w.x - p.x, w.z - p.z);
    if (dist <= 1.0) return { ...NEUTRAL_INPUT, yaw: p.yaw, interact: true };
    return toward(p, w, 1.0);
  };
}

/** Runs a bot to the end of the game (or maxTicks). Returns the final state. */
export function runBot(sim, mode = 'win', maxTicks = 20000) {
  const bot = createBot(sim, mode);
  for (let i = 0; i < maxTicks && !sim.state.outcome; i++) sim.step(bot());
  return sim.state;
}
