// Turns the embedded CSV text into typed game data. No gameplay value lives outside the CSV files.
import { parseCsv } from './csv.js';
import { RAW_CSV } from './generated.js';

const num = (v, ctx) => {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new Error(`CSV: invalid number "${v}" (${ctx})`);
  return n;
};

function keyedNumbers(rows, keyCol, valCol, ctx) {
  const out = {};
  for (const r of rows) out[r[keyCol]] = num(r[valCol], `${ctx}.${r[keyCol]}`);
  return out;
}

export function loadData(raw = RAW_CSV) {
  const tide = parseCsv(raw.maree).map((r) => ({
    t: num(r.t_s, 'maree.t_s'), level: num(r.level_m, 'maree.level_m'), trend: num(r.trend, 'maree.trend'), phase: r.phase_id,
  }));
  if (tide.length < 2) throw new Error('maree.csv: at least two rows required');
  for (let i = 1; i < tide.length; i++) if (!(tide[i].t > tide[i - 1].t)) throw new Error('maree.csv: t_s must increase');

  const bands = parseCsv(raw.maree_effets).map((r) => ({
    id: r.band_id, depthMin: num(r.depth_min_m, 'bands'), depthMax: num(r.depth_max_m, 'bands'),
    speedMult: num(r.speed_mult, 'bands'), runAllowed: num(r.run_allowed, 'bands') === 1,
    noiseMult: num(r.noise_mult, 'bands'), safeFromThreat: num(r.safe_from_threat, 'bands') === 1,
    drownTimerS: num(r.drown_timer_s, 'bands'),
  })).sort((a, b) => a.depthMin - b.depthMin);

  const stations = parseCsv(raw.stations).map((r) => ({
    id: r.station_id, altitude: num(r.altitude_m, 'stations'),
    readDepthMin: num(r.read_depth_min_m, 'stations'), readDepthMax: num(r.read_depth_max_m, 'stations'),
    requiredTrend: num(r.required_trend, 'stations'), windowStart: num(r.window_start_s, 'stations'),
    windowEnd: num(r.window_end_s, 'stations'), holdS: num(r.hold_s, 'stations'), reachM: num(r.reach_m, 'stations'),
    graceS: r.grace_s === undefined || r.grace_s === '' ? 0 : num(r.grace_s, 'stations.grace_s'), label: r.label,
  }));

  const params = keyedNumbers(parseCsv(raw.menace), 'param_id', 'value', 'menace');
  const world = keyedNumbers(parseCsv(raw.monde), 'param_id', 'value', 'monde');
  return { tide, bands, stations, params, world };
}

/** Fail-fast accessor: a missing parameter is a data error, never a silent default. */
export function param(data, id) {
  const v = data.params[id];
  if (v === undefined) throw new Error(`menace.csv: missing parameter ${id}`);
  return v;
}
export function worldParam(data, id) {
  const v = data.world[id];
  if (v === undefined) throw new Error(`monde.csv: missing parameter ${id}`);
  return v;
}
