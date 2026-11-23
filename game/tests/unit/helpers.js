import { loadData } from '../../src/data/load.js';
import { createSim } from '../../src/sim/sim.js';

export const data = loadData();
export const newSim = (opts) => createSim(data, opts);
/** Runs n ticks of a constant input. */
export function run(sim, n, input) { for (let i = 0; i < n; i++) sim.step(input); return sim.state; }
/** Teleports the player (test-only: writes the state the sim owns). */
export function place(sim, x, z) { sim.state.player.x = x; sim.state.player.z = z; }
