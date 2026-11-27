// DOM HUD. The gauges are driven by the pure hudModel(); the texts (objective, action line, ladder list, first aids, end card) and the
// marker come from the pure guidance() (T-043). This file only displays: it decides nothing about the game.
const ICON = {
  rise: '<path d="M2 16 q5 -9 10 0 t10 0" /><path d="M12 9 v-5 m-3 3 l3 -3 l3 3" />',
  peak: '<path d="M3 17 q4 0 6 -6 q3 -9 6 0 q2 6 6 6" />',
  fall: '<path d="M2 8 q5 9 10 0 t10 0" /><path d="M12 15 v5 m-3 -3 l3 3 l3 -3" />',
};
// Edge arrow region: clear of the tide gauge (left margin), of the guidance texts and the ladder list (top: 27 % of the height),
// of the action line and the subtitles (bottom: 32 % of the height).
const EDGE_X = 100, EDGE_TOP = 0.27, EDGE_BOTTOM = 0.32;
const HIDE_NEAR_M = 3; // no marker once you stand at the ladder (the action line takes over); lighthouse: see HIDE_NEAR_LH_M


export function createHud(root) {
  root.innerHTML = `
    <div id="gauge"><div id="gauge-fill"></div><svg id="gauge-chevron" viewBox="0 0 24 24"><path d="M5 14 l7 -8 l7 8 z" /></svg></div>
    <div id="guide-top"><div id="g-objective" class="gl"></div><div id="g-status" class="gl"></div><div id="g-tip" class="gl"></div></div>
    <div id="pastilles"></div>
    <div id="lamp"><svg viewBox="0 0 24 24"><path d="M9 3 h6 l2 6 h-10 z M10 12 h4 v8 h-4 z" /></svg><div id="lamp-bar"><div id="lamp-fill"></div></div></div>
    <div id="phare"><svg viewBox="0 0 24 24"><path d="M9 21 l1 -13 h4 l1 13 z M10 8 v-3 h4 v3 M4 4 l3 1 M20 4 l-3 1 M12 1 v2" /></svg><div id="phare-bar"><div id="phare-fill"></div></div></div>
    <svg id="ring" viewBox="0 0 48 48"><circle id="ring-bg" cx="24" cy="24" r="18" /><circle id="ring-fg" cx="24" cy="24" r="18" /><circle id="ring-dot" cx="24" cy="24" r="2.5" /></svg>
    <div id="vignette-drown"></div>
    <div id="vignette-cold"></div>
    <div id="g-action" class="gl"></div>
    <div id="marker"><svg id="marker-diamond" viewBox="0 0 24 24"><path d="M12 2 L22 12 L12 22 L2 12 Z" /></svg><svg id="marker-arrow" viewBox="0 0 24 24"><path d="M4 12 H18 M12 5 L19 12 L12 19" /></svg><span id="marker-dist"></span></div>
    <div id="card"><div id="card-text"></div><div id="card-reason"></div><div id="card-summary"></div><div id="card-hint"></div></div>`;
  const $ = (id) => root.querySelector(`#${id}`);
  const els = { fill: $('gauge-fill'), chev: $('gauge-chevron'), pastilles: $('pastilles'), lampFill: $('lamp-fill'), lamp: $('lamp'),
    ringFg: $('ring-fg'), ring: $('ring'), drown: $('vignette-drown'), card: $('card'), cardText: $('card-text'), cardReason: $('card-reason'),
    cardSummary: $('card-summary'), cardHint: $('card-hint'),
    phare: $('phare'), phareFill: $('phare-fill'), cold: $('vignette-cold'), objective: $('g-objective'), status: $('g-status'), tip: $('g-tip'),
    action: $('g-action'), marker: $('marker'), markerDist: $('marker-dist') };
  const C = 2 * Math.PI * 18;
  els.ringFg.style.strokeDasharray = `${C}`;
  let built = false, rows = null;
  // Text is written only when it changes (no layout work at 60 fps for a sentence that lasts seconds).
  const setText = (el, text) => { if (el.textContent !== text) el.textContent = text; el.classList.toggle('empty', text === ''); };
  const sproj = { x: 0, y: 0, behind: false };
  let markerKey = '';

  return {
    update(m) {
      els.fill.style.height = `${(m.gauge.fill * 100).toFixed(1)}%`;
      els.chev.style.transform = m.gauge.trend < 0 ? 'rotate(180deg)' : 'none';
      els.chev.style.opacity = m.gauge.trend === 0 ? '0.25' : '1';
      els.chev.style.bottom = `calc(${(m.gauge.fill * 100).toFixed(1)}% - 9px)`;
      if (!built) {
        els.pastilles.innerHTML = m.pastilles.map((p) => `<div class="lrow"><svg class="pastille" viewBox="0 0 24 24">${ICON[p.kind]}</svg><div class="ltxt"><span class="lname"></span><span class="lstate"></span></div></div>`).join('');
        rows = [...els.pastilles.children];
        built = true;
      }
      m.pastilles.forEach((p, i) => { rows[i].children[0].setAttribute('class', `pastille ${p.status}`); });
      els.lampFill.style.width = `${(m.lamp.frac * 100).toFixed(1)}%`;
      els.lamp.classList.toggle('on', m.lamp.on);
      els.phareFill.style.width = `${(m.lighthouse.frac * 100).toFixed(1)}%`;
      els.phare.classList.toggle('low', m.lighthouse.low);
      els.cold.style.opacity = `${(m.cold * 0.85).toFixed(2)}`;
      els.ring.classList.toggle('active', m.ring.active);
      els.ringFg.style.strokeDashoffset = `${C * (1 - m.ring.progress)}`;
      els.drown.style.opacity = `${(m.drown * 0.9).toFixed(2)}`;
      const c = m.card;
      if (c) {
        els.card.classList.add('on'); els.card.dataset.kind = c.kind;
        els.cardText.textContent = c.title; els.cardReason.textContent = c.reason; els.cardSummary.textContent = c.summary; els.cardHint.textContent = c.hint;
      } else els.card.classList.remove('on');
    },
    /** g: guidance() result; tip: text of the current first aid or null. Called when the simulation ticks. */
    setGuide(g, tip) {
      setText(els.objective, g.objective);
      setText(els.status, g.status);
      els.status.classList.toggle('warn', g.warn);
      setText(els.tip, tip || '');
      setText(els.action, g.action);
      g.list.forEach((l, i) => {
        const row = rows && rows[i]; if (!row) return;
        setText(row.children[1].children[0], l.name); setText(row.children[1].children[1], l.text);
        row.dataset.state = l.state;
      });
    },
    /**
     * Places the single marker (diamond + distance, or an edge arrow when the target is off screen). target: guidance().target or null.
     * project(x, y, z, out) -> NDC of the camera of the last frame. Never draws anything about the Laisse (it is not an input).
     */
    placeMarker(target, project, eyeX, eyeZ, world) {
      if (!target) { els.marker.classList.remove('on'); markerKey = ''; return; }
      const dist = Math.hypot(target.x - eyeX, target.z - eyeZ);
      if (dist <= (target.kind === 'lighthouse' ? world.plateauRadius + 2 : HIDE_NEAR_M)) { els.marker.classList.remove('on'); markerKey = ''; return; }
      const y = target.kind === 'lighthouse' ? world.plateauHeight + 12 : world.stations[target.index].ground + 3.0;
      project(target.x, y, target.z, sproj);
      const W = root.clientWidth || window.innerWidth, H = root.clientHeight || window.innerHeight;
      const on = !sproj.behind && Math.abs(sproj.x) <= 0.94 && Math.abs(sproj.y) <= 0.9;
      let px, py, rot = 0;
      if (on) { px = (sproj.x * 0.5 + 0.5) * W; py = (0.5 - sproj.y * 0.5) * H; } else {
        let dx = sproj.x * W / 2, dy = -sproj.y * H / 2;
        if (sproj.behind) { dx = -dx; dy = -dy; if (Math.abs(dx) < 1 && Math.abs(dy) < 1) dy = 1; }
        const room = dy < 0 ? H / 2 - EDGE_TOP * H : (1 - EDGE_BOTTOM) * H - H / 2;
        const k = Math.min((W / 2 - EDGE_X) / (Math.abs(dx) || 1e-6), room / (Math.abs(dy) || 1e-6));
        px = W / 2 + dx * k; py = H / 2 + dy * k; rot = Math.atan2(dy, dx);
      }
      const key = `${target.kind}${target.index}${target.strong}${on}`;
      if (key !== markerKey) { markerKey = key; els.marker.className = `on ${target.strong ? 'strong' : 'weak'} ${on ? 'face' : 'edge'}`; }
      setText(els.markerDist, `${Math.round(dist)} m`);
      els.marker.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
      els.marker.children[1].style.transform = `rotate(${rot.toFixed(3)}rad)`;
    },
  };
}
