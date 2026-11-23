import test from 'node:test';
import assert from 'node:assert/strict';
import { data, newSim } from './helpers.js';
import { earliestArrival } from '../../src/sim/reach.js';
import { stationReadable } from '../../src/sim/env.js';
import { hypot } from '../../src/sim/util.js';

const SEEDS = [2026, 1, 2, 3, 42, 777, 12345];

test('island: platform is flat at 3.00 m within 6 m, everything else stays under 2.65 m', () => {
  for (const seed of SEEDS) {
    const { world } = newSim({ seed });
    const lh = world.lighthouse;
    for (let a = 0; a < 360; a += 15) for (const r of [0, 2, 4, 5.9, 5.999]) {
      const h = world.heightAt(lh.x + r * Math.cos((a * Math.PI) / 180), lh.z + r * Math.sin((a * Math.PI) / 180));
      assert.equal(h, 3.0, `seed ${seed} r=${r}`);
    }
    let max = -Infinity;
    for (let x = -80; x <= 80; x += 0.5) for (let z = -80; z <= 80; z += 0.5) {
      if (hypot(x - lh.x, z - lh.z) > 6) max = Math.max(max, world.heightAt(x, z));
    }
    assert.ok(max < 2.65, `seed ${seed} max outside platform = ${max}`);
  }
});

test('island: only the platform is a dry zone at high tide (d <= -0.25 at 2.40 m)', () => {
  const sim = newSim();
  const lh = sim.world.lighthouse;
  for (let x = -80; x <= 80; x += 1) for (let z = -80; z <= 80; z += 1) {
    const dry = 2.4 - sim.world.heightAt(x, z) <= -0.25;
    assert.equal(dry, hypot(x - lh.x, z - lh.z) <= 6, `(${x},${z})`);
  }
});

test('island: same seed gives the same terrain and ladders; another seed differs', () => {
  const a = newSim({ seed: 2026 }), b = newSim({ seed: 2026 }), c = newSim({ seed: 7 });
  assert.deepEqual(a.world.stations, b.world.stations);
  assert.equal(a.world.heightAt(10.3, -22.7), b.world.heightAt(10.3, -22.7));
  assert.notEqual(a.world.heightAt(10.3, -22.7), c.world.heightAt(10.3, -22.7));
});

test('island: ladders respect altitude (+-0.10 m), distance rings and separation (GDD 8)', () => {
  for (const seed of SEEDS) {
    const { world } = newSim({ seed });
    const lh = world.lighthouse;
    world.stations.forEach((s, i) => {
      const def = data.stations[i];
      assert.ok(Math.abs(world.heightAt(s.x, s.z) - def.altitude) <= 0.1 + 1e-9, `${s.id} altitude`);
      const dist = hypot(s.x - lh.x, s.z - lh.z);
      const [lo, hi] = def.id === 'S2_haute' ? [25, 40] : [35, 50];
      assert.ok(dist >= lo && dist <= hi, `${s.id} dist ${dist}`);
      assert.ok(dist > 14, 'outside the lighthouse halo');
    });
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) {
      assert.ok(hypot(world.stations[i].x - world.stations[j].x, world.stations[i].z - world.stations[j].z) >= 15);
    }
  }
});

test('island: reading windows match the GDD (S1 ~61-110 s, S2 160-320 s, S3 ~376-426 s)', () => {
  const { world } = newSim();
  const [s1, s2, s3] = world.stations.map((s) => s.interval);
  assert.ok(s1.from >= 60 && s1.from <= 62 && s1.to >= 109 && s1.to <= 110.1);
  assert.ok(s2.from >= 159.5 && s2.from <= 160.5 && s2.to >= 319.5 && s2.to <= 320.5);
  assert.ok(s3.from >= 374.5 && s3.from <= 377 && s3.to >= 426 && s3.to <= 427.5);
});

test('reachability: every ladder can be reached and read inside its window, then the platform regained', () => {
  for (const seed of SEEDS) {
    const sim = newSim({ seed });
    const { world, env } = sim;
    world.stations.forEach((s, i) => {
      const def = data.stations[i];
      // Can the walker be within reach of the ladder, and for how long is the ladder readable from then on?
      const arrive = earliestArrival(env, world.heightAt, world.start, s, 0, def.reachM);
      assert.ok(Number.isFinite(arrive), `${s.id}: unreachable (seed ${seed})`);
      const startRead = Math.max(arrive, s.interval.from);
      let ok = true;
      for (let t = startRead; t <= startRead + def.holdS; t += env.dt) ok = ok && stationReadable(env, def, t);
      assert.ok(ok, `${s.id}: not readable for ${def.holdS}s after arrival ${arrive.toFixed(1)} (seed ${seed})`);
      assert.ok(startRead + def.holdS <= def.windowEnd, `${s.id}: read would end after the window`);
      const back = earliestArrival(env, world.heightAt, s, world.start, startRead + def.holdS, 1.5);
      assert.ok(back < data.params.defeat_time_limit, `${s.id}: cannot come back before the end (${back})`);
    });
  }
});

test('reachability: the first ladder is reachable well before its window closes (fairness of the 110 s defeat)', () => {
  const sim = newSim();
  const arrive = earliestArrival(sim.env, sim.world.heightAt, sim.world.start, sim.world.stations[0], 0, 2.0);
  assert.ok(arrive < 61, `arrives at ${arrive}`); // the walker can already be there when the window opens
});
