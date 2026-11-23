// Time-dependent earliest-arrival search on a 1 m grid (8 neighbours). Used by the reachability test, not by gameplay.
// The walker may wait anywhere, never enters a band with a drown timer, and moves at walking speed scaled by the band.
import { hypot } from './util.js';

class MinHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(k, v) { const a = this.a; a.push([k, v]); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { let l = 2 * i + 1, r = l + 1, m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } } return top; }
}

/** Earliest time at which the walker, leaving `from` at t0, stands within `reach` metres of `to`; Infinity if never. */
export function earliestArrival(env, heightAt, from, to, t0, reach, cell = 1) {
  const R = env.mapRadius, n = Math.ceil((2 * R) / cell) + 1;
  const idx = (i, j) => j * n + i;
  const pos = (i, j) => ({ x: -R + i * cell, z: -R + j * cell });
  const ci = Math.round((from.x + R) / cell), cj = Math.round((from.z + R) / cell);
  const best = new Float64Array(n * n).fill(Infinity);
  const heap = new MinHeap();
  best[idx(ci, cj)] = t0; heap.push(t0, [ci, cj]);
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  while (heap.size) {
    const [t, [i, j]] = heap.pop();
    if (t > best[idx(i, j)]) continue;
    const p = pos(i, j);
    if (hypot(p.x - to.x, p.z - to.z) <= reach) return t;
    for (const [di, dj] of dirs) {
      const ni = i + di, nj = j + dj;
      if (ni < 0 || nj < 0 || ni >= n || nj >= n) continue;
      const q = pos(ni, nj);
      if (hypot(q.x, q.z) > R) continue;
      const level = env.tide.levelAt(t);
      const band = env.bands.classify(level - heightAt(q.x, q.z));
      if (band.drownTimerS > 0) continue;
      const tn = t + (hypot(di, dj) * cell) / (env.speeds.walk * band.speedMult);
      if (tn < best[idx(ni, nj)]) { best[idx(ni, nj)] = tn; heap.push(tn, [ni, nj]); }
    }
  }
  return Infinity;
}
