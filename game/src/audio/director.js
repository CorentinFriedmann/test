// Audio director (pure): turns simulation events and state into "cues" (what must be heard, where, how strongly).
// The same cues feed the synthesis (engine.js) and the optional subtitles, so both always agree. Deterministic: it only
// reads simulation time and its own seeded generator, never the wall clock.
import { mulberry32 } from '../sim/rng.js';
import { swirlInterval, dreadLevel, heartbeatInterval, tollInterval } from './mix.js';

/** cfg: { audibleR, roarR, flicker, debris: [{x,z}], lighthouse: {x,z}, seed } */
export function createDirector(cfg) {
  const rng = mulberry32((cfg.seed ?? 1) >>> 0);
  let nextSwirl = 0, nextBeat = 0, nextToll = 0, lastT = -1, foot = 1;
  const tower = () => ({ x: cfg.lighthouse.x, z: cfg.lighthouse.z });
  function reset() { nextSwirl = nextBeat = nextToll = 0; lastT = -1; foot = 1; }

  function onEvent(e, st) {
    const cues = [];
    switch (e.type) {
      case 'noise': {
        const player = st.player;
        if (e.src === 'walk' || e.src === 'run' || e.src === 'slow') {
          foot = -foot;
          cues.push({ kind: 'step', x: e.x, z: e.z, band: player.band, run: e.src === 'run', slow: e.src === 'slow', hits: e.src === 'run' ? 2 : 1, foot, power: Math.min(1, e.r / 18) });
        } else if (e.src === 'interact') cues.push({ kind: 'interact', x: e.x, z: e.z });
        break;
      }
      case 'debris_hit': {
        const d = cfg.debris[e.index] || st.player;
        cues.push({ kind: 'debris', x: d.x, z: d.z });
        break;
      }
      case 'threat_spawn':
        if (e.dist <= cfg.audibleR) cues.push({ kind: 'swirl', x: e.x, z: e.z, dist: e.dist, big: true });
        break;
      case 'threat_state':
        if (e.from === 'roam' && e.to === 'inquire' && e.dist <= cfg.roarR) cues.push({ kind: 'roar', x: e.x, z: e.z, dist: e.dist });
        else if (e.to === 'hunt' && e.dist <= cfg.roarR) cues.push({ kind: 'growl', x: e.x, z: e.z, dist: e.dist });
        else if (e.to === 'flee' && e.dist <= cfg.audibleR) cues.push({ kind: 'flee_splash', x: e.x, z: e.z, dist: e.dist });
        break;
      case 'grab': cues.push({ kind: 'grab', n: e.n }); break;
      case 'lighthouse_low': cues.push({ kind: 'lh_low', ...tower() }); nextToll = (st.t ?? e.t) + 4; break;
      case 'lighthouse_out': cues.push({ kind: 'lh_out', ...tower() }); break;
      case 'lighthouse_wound': cues.push({ kind: 'lh_wound', ...tower() }); break;
      case 'station_read': cues.push({ kind: 'station' }); break;
      case 'lamp_on': cues.push({ kind: 'lamp', on: true }); break;
      case 'lamp_off': cues.push({ kind: 'lamp', on: false }); break;
      case 'victory': cues.push({ kind: 'end', outcome: 'victory' }); break;
      case 'defeat': cues.push({ kind: 'end', outcome: 'defeat', cause: e.cause }); break;
      default: break;
    }
    return cues;
  }

  /** Called every frame with the simulation state; emits the recurring cues (swirls, heartbeat, alert toll). */
  function update(st) {
    const cues = [], t = st.t;
    if (t < lastT) reset();
    lastT = t;
    const th = st.threat;
    if (th && th.active && th.mode !== 'dormant' && th.mode !== 'bank_wait' && th.dist <= cfg.audibleR && t >= nextSwirl) {
      cues.push({ kind: 'swirl', x: th.x, z: th.z, dist: th.dist, mode: th.mode });
      nextSwirl = t + swirlInterval(th.mode, th.dist, cfg.audibleR) * (0.8 + 0.4 * rng());
    }
    const dread = dreadLevel(st, cfg);
    if (dread > 0.3 && t >= nextBeat) { cues.push({ kind: 'heartbeat', power: dread }); nextBeat = t + heartbeatInterval(dread); }
    const charge = st.lighthouse ? st.lighthouse.charge : 100;
    if (charge > 0 && charge < cfg.flicker && t >= nextToll) { cues.push({ kind: 'lh_toll', ...tower() }); nextToll = t + tollInterval(charge, cfg.flicker); }
    return cues;
  }

  return { onEvent, update, reset };
}
