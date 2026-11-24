import { param } from '../data/load.js';

// Pure HUD model (GDD 11): numbers and states only, never explanatory text.
const KIND = { 1: 'rise', 0: 'peak', '-1': 'fall' };

const ring = (state) => {
  const r = state.reading ?? state.lighthouse.winding;
  return { active: r !== null, progress: r ? r.ticks / r.total : 0 };
};

export function hudModel(state, world, data) {
  const lo = data.tide[0].level, hi = Math.max(...data.tide.map((r) => r.level));
  return {
    gauge: { fill: Math.min(1, Math.max(0, (state.level - lo) / (hi - lo))), trend: state.trend },
    pastilles: state.stations.map((s, i) => ({
      kind: KIND[data.stations[i].requiredTrend],
      status: s.read ? 'read' : s.readable ? 'now' : 'todo',
    })),
    lamp: { on: state.lamp.on, frac: state.lamp.battery / state.lamp.total },
    ring: ring(state),
    lighthouse: { frac: state.lighthouse.charge / param(data, 'lighthouse_charge_start'), low: state.lighthouse.charge < param(data, 'lighthouse_charge_flicker') },
    cold: state.cold / param(data, 'threat_grab_cold_duration'),
    drown: state.drownLimit > 0 ? state.drown / state.drownLimit : 0,
    card: state.outcome === null ? null : state.outcome === 'victory' ? 'victory' : state.cause === 'window_missed' ? 'missed' : 'sea',
  };
}
