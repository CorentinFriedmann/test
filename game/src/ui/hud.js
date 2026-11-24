// DOM HUD driven by the pure hudModel(). Icons and bars only: no sentence explains a rule (GDD 11).
const ICON = {
  rise: '<path d="M2 16 q5 -9 10 0 t10 0" /><path d="M12 9 v-5 m-3 3 l3 -3 l3 3" />',
  peak: '<path d="M3 17 q4 0 6 -6 q3 -9 6 0 q2 6 6 6" />',
  fall: '<path d="M2 8 q5 9 10 0 t10 0" /><path d="M12 15 v5 m-3 -3 l3 3 l3 -3" />',
};

export function createHud(root) {
  root.innerHTML = `
    <div id="gauge"><div id="gauge-fill"></div><svg id="gauge-chevron" viewBox="0 0 24 24"><path d="M5 14 l7 -8 l7 8 z" /></svg></div>
    <div id="pastilles"></div>
    <div id="lamp"><svg viewBox="0 0 24 24"><path d="M9 3 h6 l2 6 h-10 z M10 12 h4 v8 h-4 z" /></svg><div id="lamp-bar"><div id="lamp-fill"></div></div></div>
    <div id="phare"><svg viewBox="0 0 24 24"><path d="M9 21 l1 -13 h4 l1 13 z M10 8 v-3 h4 v3 M4 4 l3 1 M20 4 l-3 1 M12 1 v2" /></svg><div id="phare-bar"><div id="phare-fill"></div></div></div>
    <svg id="ring" viewBox="0 0 48 48"><circle id="ring-bg" cx="24" cy="24" r="18" /><circle id="ring-fg" cx="24" cy="24" r="18" /><circle id="ring-dot" cx="24" cy="24" r="2.5" /></svg>
    <div id="vignette-drown"></div>
    <div id="vignette-cold"></div>
    <div id="objective"></div>
    <div id="card"><div id="card-text"></div><div id="card-hint">R</div></div>`;
  const $ = (id) => root.querySelector(`#${id}`);
  const els = { fill: $('gauge-fill'), chev: $('gauge-chevron'), pastilles: $('pastilles'), lampFill: $('lamp-fill'), lamp: $('lamp'),
    ringFg: $('ring-fg'), ring: $('ring'), drown: $('vignette-drown'), card: $('card'), cardText: $('card-text'), objective: $('objective'),
    phare: $('phare'), phareFill: $('phare-fill'), cold: $('vignette-cold') };
  const C = 2 * Math.PI * 18;
  els.ringFg.style.strokeDasharray = `${C}`;
  let built = false;
  const CARDS = { victory: 'Les trois relevés sont faits.', sea: 'La mer a gagné.', missed: 'Relevé manqué.' };

  return {
    showObjective(text, ms) { els.objective.textContent = text; els.objective.classList.add('on'); setTimeout(() => els.objective.classList.remove('on'), ms); },
    update(m) {
      els.fill.style.height = `${(m.gauge.fill * 100).toFixed(1)}%`;
      els.chev.style.transform = m.gauge.trend < 0 ? 'rotate(180deg)' : 'none';
      els.chev.style.opacity = m.gauge.trend === 0 ? '0.25' : '1';
      els.chev.style.bottom = `calc(${(m.gauge.fill * 100).toFixed(1)}% - 9px)`;
      if (!built) {
        els.pastilles.innerHTML = m.pastilles.map((p) => `<svg class="pastille" viewBox="0 0 24 24">${ICON[p.kind]}</svg>`).join('');
        built = true;
      }
      m.pastilles.forEach((p, i) => { els.pastilles.children[i].setAttribute('class', `pastille ${p.status}`); });
      els.lampFill.style.width = `${(m.lamp.frac * 100).toFixed(1)}%`;
      els.lamp.classList.toggle('on', m.lamp.on);
      els.phareFill.style.width = `${(m.lighthouse.frac * 100).toFixed(1)}%`;
      els.phare.classList.toggle('low', m.lighthouse.low);
      els.cold.style.opacity = `${(m.cold * 0.85).toFixed(2)}`;
      els.ring.classList.toggle('active', m.ring.active);
      els.ringFg.style.strokeDashoffset = `${C * (1 - m.ring.progress)}`;
      els.drown.style.opacity = `${(m.drown * 0.9).toFixed(2)}`;
      if (m.card) { els.card.classList.add('on'); els.cardText.textContent = CARDS[m.card]; } else els.card.classList.remove('on');
    },
  };
}
