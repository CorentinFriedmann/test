// Player guidance (T-043, spec docs/design/P2_CORRECTIONS.md C1). Pure functions: they read the simulation state and the CSV
// data and return texts and a marker target. No DOM, no clock, no random: the HUD (hud.js) only displays what is returned here.
// Rules that keep the secret of the game: the position of the Laisse is never an input and never part of an output.
import { param } from '../data/load.js';

const hypot = Math.hypot;

/** Whole seconds shown as M:SS. Countdowns round up (never 0:00 while time remains); an elapsed time (down = true) rounds down. */
export function mmss(seconds, down = false) {
  const s = Math.max(0, down ? Math.floor(seconds + 1e-9) : Math.ceil(seconds - 1e-9));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const TREND_NAME = { 1: 'marée montante', 0: 'marée haute', '-1': 'marée descendante' };
const NOTE_S = 10;        // "relevé noté" message and lighthouse target after a reading
const NEAR_LADDER_M = 6;  // "approchez-vous de l'échelle"
const CRANK_REACH_M = 2.5;
const CRANK_BELOW = 60;   // percent: the crank hint appears under this charge
const WAIT_CRANK_BELOW = 50;
const MARGIN_S = 10;      // seconds of margin added to the walking time before "partez"
const WARN_CLOCK_S = 45;

/** A ladder as the guidance sees it: 'read' | 'open' | 'pending' | 'missed', with its remaining time. */
function ladderStatus(state, def, s) {
  if (s.read) return { key: 'read', secs: 0 };
  const missed = state.t > def.windowEnd + def.graceS;
  if (missed) return { key: 'missed', secs: 0 };
  if (s.readable) return { key: 'open', secs: def.windowEnd - state.t };
  return { key: 'pending', secs: def.windowStart - state.t };
}

/**
 * guidance(state, data, world, memo) -> { objective, status, clock, warn, action, list[], target }
 *   memo: { lastReadT } (the time of the latest reading, kept by the caller; null if none).
 *   target: null, or { kind: 'station'|'lighthouse', index, x, z, strong } : the single marker to draw (strong = ready now).
 * Never contains anything about the Laisse.
 */
export function guidance(state, data, world, memo = {}) {
  const need = param(data, 'victory_stations_required');
  const duration = state.duration;
  const clock = Math.max(0, duration - state.t);
  const p = state.player, lh = world.lighthouse;
  const walk = param(data, 'player_speed_walk');
  const chargePct = (state.lighthouse.charge / param(data, 'lighthouse_charge_start')) * 100;
  const onPlatform = hypot(p.x - lh.x, p.z - lh.z) <= world.plateauRadius;
  const crank = world.crank;
  const crankDist = crank ? hypot(p.x - crank.x, p.z - crank.z) : Infinity;
  const lastReadT = memo.lastReadT ?? null;
  const justRead = lastReadT !== null && state.t - lastReadT <= NOTE_S;

  const st = data.stations.map((def, i) => ladderStatus(state, def, state.stations[i]));
  const dist = world.stations.map((w) => hypot(w.x - p.x, w.z - p.z));
  const list = data.stations.map((def, i) => {
    const s = st[i];
    const text = s.key === 'read' ? 'lue ✓' : s.key === 'open' ? `OUVERTE, reste ${mmss(s.secs)}` : s.key === 'pending' ? `s'ouvre dans ${mmss(s.secs)}` : 'manquée';
    return { n: i + 1, name: `${i + 1} · ${TREND_NAME[def.requiredTrend]}`, state: s.key, text };
  });

  const out = {
    objective: `Lisez les ${need} échelles de marée, puis revenez au phare.`,
    status: `Relevés : ${state.readCount}/${need} · Fin de la marée : ${mmss(clock)}`,
    clock, warn: clock <= WARN_CLOCK_S, action: '', list, target: null,
  };
  if (state.outcome) return out;

  // The next ladder to read: the first one not read (its window is not over, otherwise the game is already lost).
  const next = st.findIndex((s) => s.key !== 'read' && s.key !== 'missed');
  const N = next + 1;
  const allRead = state.readCount >= need;

  // ---- marker target: one at a time. The lighthouse after a reading and once everything is read, else the next ladder.
  if (allRead || justRead) out.target = { kind: 'lighthouse', index: -1, x: lh.x, z: lh.z, strong: true };
  else if (next >= 0) {
    const w = world.stations[next], leave = st[next].key === 'pending' && st[next].secs <= dist[next] / walk + MARGIN_S;
    out.target = { kind: 'station', index: next, x: w.x, z: w.z, strong: st[next].key === 'open' || leave };
  }

  // ---- action line: first true condition of the table (spec C1, 15 rows).
  const nearest = (pred) => { let k = -1; data.stations.forEach((def, i) => { if (pred(def, i) && (k < 0 || dist[i] < dist[k])) k = i; }); return k; };
  const hold = (i) => data.stations[i].holdS;
  const stationAt = nearest((def, i) => st[i].key === 'open' && dist[i] <= def.reachM);
  const stuckAt = nearest((def, i) => state.stations[i].read === false && dist[i] <= def.reachM && !state.stations[i].readable);
  let action;
  if (state.reading) action = 'Lecture en cours… maintenez E';
  else if (state.lighthouse.winding) action = 'Remontage du phare… maintenez E';
  else if (state.drown > 0) action = 'Vous manquez d\'air : gagnez un terrain plus haut !';
  else if (stationAt >= 0) action = `Maintenez E pour lire l'échelle (${hold(stationAt)} s)`;
  else if (stuckAt >= 0 && refusal(state, data.stations[stuckAt])) action = refusal(state, data.stations[stuckAt]);
  else if (nearest((def, i) => (st[i].key === 'open') && dist[i] <= NEAR_LADDER_M) >= 0) action = 'Approchez-vous de l\'échelle.';
  else if (crankDist <= CRANK_REACH_M && chargePct < CRANK_BELOW) action = `Maintenez E pour remonter le phare (${param(data, 'lighthouse_wind_hold')} s)`;
  else if (allRead && !onPlatform) action = `Retournez au phare : il reste ${mmss(clock)}.`;
  else if (justRead && !onPlatform) action = 'Relevé noté. Revenez vers le phare.';
  else if (next >= 0 && st[next].key === 'open') action = `Échelle ${N} ouverte : allez-y ! Il reste ${mmss(st[next].secs)}.`;
  else if (next >= 0 && st[next].key === 'pending' && st[next].secs <= dist[next] / walk + MARGIN_S) action = `Partez vers l'échelle ${N} : elle s'ouvre dans ${mmss(st[next].secs)}.`;
  else if (next >= 0 && chargePct < WAIT_CRANK_BELOW && onPlatform) action = `En attendant : remontez le phare à la manivelle (E, ${param(data, 'lighthouse_wind_hold')} s).`;
  else if (next >= 0) action = `Attendez au phare : l'échelle ${N} s'ouvre dans ${mmss(st[next].secs)}.`;
  else action = '';
  out.action = action;
  return out;
}

/**
 * Why a ladder in reach cannot be read now (rows 5 to 7). d is the water depth at the ladder (level - its altitude), as in
 * stations.csv. The trend row only exists for a ladder with a required trend: S2 has required_trend 0 (any trend), so depth is
 * its only condition and it never receives the "wrong tide direction" message.
 */
function refusal(state, def) {
  const d = state.level - def.altitude;
  if (d < def.readDepthMin) return 'L\'eau n\'atteint pas encore l\'échelle. Attendez.';
  if (d > def.readDepthMax) return 'L\'eau est trop haute pour lire l\'échelle.';
  if (def.requiredTrend !== 0 && state.trend !== def.requiredTrend) return 'Pas maintenant : revenez quand la marée sera dans l\'autre sens.';
  return '';
}

// ---------------------------------------------------------------- end card

/** Which ladder closed (the first unread one past its window), same rule as the simulation. */
function missedStation(state, data) {
  for (let i = 0; i < data.stations.length; i++) {
    const d = data.stations[i];
    if (!state.stations[i].read && state.t > d.windowEnd + d.graceS) return i;
  }
  return -1;
}

/** End screen text (spec C1): null while the game runs, else { kind, title, reason, summary, hint }. */
export function endCard(state, data) {
  if (state.outcome === null || state.outcome === undefined) return null;
  const need = param(data, 'victory_stations_required');
  const summary = `Relevés : ${state.readCount}/${need} · Temps : ${mmss(state.t, true)}`, hint = 'R pour recommencer';
  const done = (kind, title, reason) => ({ kind, title, reason, summary, hint });
  if (state.outcome === 'victory') return done('victory', 'Les trois relevés sont faits.', 'Vous êtes de retour au phare avant la fin de la marée.');
  switch (state.cause) {
    case 'seized':
      return done('sea', 'La mer a gagné.', `Quelque chose vous a saisi deux fois en moins de ${param(data, 'threat_grab_defeat_window')} s. Dans l'eau, le bruit attire : marchez lentement (C) ou restez immobile.`);
    case 'drowned':
      return done('sea', 'La mer a gagné.', `Vous êtes resté plus de ${state.drownLimit} s sous l'eau. Quand la marée monte, gagnez le phare.`);
    case 'window_missed': {
      const i = missedStation(state, data);
      return done('missed', 'Relevé manqué.', `L'échelle ${i + 1} s'est refermée avant d'être lue. Chaque échelle ne se lit que pendant sa fenêtre.`);
    }
    default:
      return done('sea', 'La marée est finie.', state.readCount >= need ? 'Vous n\'êtes pas revenu au phare à temps.' : `Il manquait des relevés : ${state.readCount} sur ${need}.`);
  }
}

// ---------------------------------------------------------------- first aids

/**
 * First aids (spec C1, table "Premières aides"): each shows once per game, 8 s, one at a time, and closes as soon as the
 * action it teaches is done. step(state) is called with the simulation state; onCue(kind) with the audio cue kinds.
 * Choices on the ambiguities of the spec:
 *   aid 1 (keys): from the start until the first move, at most 20 s (the 20 s is a ceiling, not a delay);
 *   aid 2 (lamp): "d" is the player's own water depth; shown at the first step taken in the water (d >= 0.15) or at 20 s at the latest.
 * Time is the simulation time, so it is frozen while the game is paused.
 */
export function createTips(data, world) {
  const SHOW_S = 8, KEYS_MAX_S = 20, LAMP_AT_S = 20, WATER_D = 0.15;
  const lampTotal = param(data, 'lamp_battery_seconds');
  const text = {
    keys: 'ZQSD ou flèches : marcher · Souris : regarder · Maj : courir · C : marcher lentement · M : son',
    lamp: `Appuyez sur F : la lampe éclaire devant vous (${lampTotal} s d'autonomie).`,
    crank: `Le phare s'use. La manivelle, au pied de la tour, le remonte : maintenez E ${param(data, 'lighthouse_wind_hold')} s.`,
    noise: 'Quelque chose bouge dans l\'eau. Ralentissez (C) ou restez immobile.',
  };
  let done, current, since, queue, noiseCue, lastT;
  const reset = () => { done = {}; current = null; since = 0; queue = []; noiseCue = false; lastT = 0; };
  reset();
  const closed = (id, s) => {
    const p = s.player;
    const moved = hypot(p.x - world.start.x, p.z - world.start.z) > 0.3;
    if (id === 'keys') return moved || s.t >= KEYS_MAX_S;
    if (id === 'lamp') return s.lamp.on || s.lamp.battery < s.lamp.total;
    if (id === 'crank') return !!s.lighthouse.winding || s.lighthouse.charge >= param(data, 'lighthouse_wind_to');
    return false;
  };
  const wanted = (id, s) => {
    const p = s.player;
    const moved = hypot(p.x - world.start.x, p.z - world.start.z) > 0.3;
    if (id === 'keys') return true;
    if (id === 'lamp') return (moved && p.d >= WATER_D) || s.t >= LAMP_AT_S;
    if (id === 'crank') return s.lighthouse.charge < 50;
    return noiseCue;
  };
  return {
    reset,
    onCue(kind) { if (kind === 'swirl' || kind === 'roar') noiseCue = true; },
    /** Returns the text of the aid to show now, or null. */
    step(s) {
      if (s.t < lastT) reset();
      lastT = s.t;
      if (s.outcome) { current = null; return null; }
      for (const id of ['keys', 'lamp', 'crank', 'noise']) {
        if (!done[id] && !queue.includes(id) && current !== id && wanted(id, s)) queue.push(id);
      }
      if (current) {
        const timeUp = current !== 'keys' && s.t - since >= SHOW_S;
        if (timeUp || closed(current, s)) { done[current] = true; current = null; }
      }
      // An aid whose action is already done is dropped without being shown.
      while (!current && queue.length) {
        const id = queue.shift();
        if (closed(id, s)) { done[id] = true; continue; }
        current = id; since = s.t;
      }
      return current ? text[current] : null;
    },
    get current() { return current; },
  };
}
