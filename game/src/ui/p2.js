// P2 additions of the start/pause screen: the 8-question form, the performance report copy button and the credits screen.
// Pure DOM, no network, no browser dialogs (they do not show in a locked frame): every message is shown in the page.
// The "expected answers" of docs/qa/QUESTIONNAIRE_P2.md are deliberately NOT part of this file (the owner answers blind).

/** Copies text; falls back to a visible, selected text area when the clipboard is blocked. Resolves to true if copied. */
export async function copyText(text, area, msg) {
  area.value = text;
  area.style.display = 'block';
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch { /* blocked in a locked frame: fall back */ }
  if (!ok) {
    try { area.focus(); area.select(); ok = !!document.execCommand('copy'); } catch { ok = false; }
  }
  try { area.focus(); area.select(); } catch { /* nothing to select */ }
  msg.textContent = ok ? 'Copié. Collez-le maintenant dans la conversation.' : 'Copie bloquée : le texte est sélectionné ci-dessous, faites Ctrl+C puis collez-le dans la conversation.';
  return ok;
}

const YN = ['oui', 'non'];
// Each question: id, wording (same meaning as docs/qa/QUESTIONNAIRE_P2.md), and its fields.
export const QUESTIONS = [
  { id: 'Q1', title: '1. Que fait l\'eau, et qu\'est-ce que ça change pour vous ? Où êtes-vous en sécurité quand elle est haute ?', fields: [{ k: 'r', t: 'text', label: 'Réponse' }] },
  { id: 'Q2', title: '2. Qu\'est-ce qui attire la chose dans l\'eau ?', fields: [{ k: 'r', t: 'text', label: 'Réponse' }] },
  { id: 'Q3', title: '3. Que fait le phare ? Que faut-il y faire, et pourquoi ?', fields: [{ k: 'r', t: 'text', label: 'Réponse' }] },
  { id: 'Q4', title: '4. Que faites-vous quand vous entendez un bruit dans l\'eau ? Pourquoi ?', fields: [{ k: 'r', t: 'text', label: 'Réponse' }] },
  { id: 'Q5', title: '5. À quel moment avez-vous eu le plus peur ? Qu\'est-ce qui l\'a causé ? Note de 1 (pas peur) à 5 (très peur).', fields: [
    { k: 'm', t: 'text', label: 'Moment et cause' }, { k: 'n', t: 'choice', label: 'Note (1 à 5)', opts: ['1', '2', '3', '4', '5'] }] },
  { id: 'Q6', title: '6. Avez-vous joué au casque ? Au premier contact, le niveau sonore était-il trop faible, correct ou trop fort ?', fields: [
    { k: 'c', t: 'choice', label: 'Casque', opts: YN }, { k: 'v', t: 'choice', label: 'Niveau au premier contact', opts: ['faible', 'correct', 'fort'] },
    { k: 'r', t: 'text', label: 'Autre chose sur le son (facultatif) : la Laisse arrive-t-elle en silence quand elle est au bord ? l\'absence de musique vous a-t-elle gêné ? saviez-vous si un bruit venait de devant ou de derrière ?' }] },
  { id: 'Q7', title: '7. Refaites 2 minutes en coupant le son (touche M) : la peur est-elle la même ? Qu\'est-ce qui change ?', fields: [
    { k: 'p', t: 'choice', label: 'La peur sans le son est', opts: ['la même', 'un peu plus faible', 'nettement plus faible'] },
    { k: 'h', t: 'choice', label: 'Le son porte', opts: ['la moitié ou plus de la peur', 'moins de la moitié de la peur'] },
    { k: 'r', t: 'text', label: 'Ce qui change' }] },
  { id: 'Q8', title: '8. Les sous-titres (descriptions des bruits, touche K) étaient-ils lisibles, utiles, et ont-ils gâché la peur ?', fields: [
    { k: 'l', t: 'choice', label: 'Lisibles', opts: YN }, { k: 'u', t: 'choice', label: 'Utiles', opts: YN }, { k: 'g', t: 'choice', label: 'Ont gâché la peur', opts: YN },
    { k: 'r', t: 'text', label: 'Remarques' }] },
];
export const P1 = { id: 'P1', title: 'Performance : fluide ou saccadé ? (une réponse suffit)', fields: [
  { k: 'f', t: 'choice', label: 'Le jeu était', opts: ['fluide', 'saccadé'] }, { k: 'r', t: 'text', label: 'Précisions (facultatif)' }] };

/** Builds the text to paste in the conversation. `values` maps "Q1.r" -> string. Empty answers are marked as pending. */
export function formatAnswers(values, meta = {}) {
  const get = (q, f) => (values[`${q.id}.${f.k}`] || '').trim() || '(sans réponse)';
  const lines = [`ESTRAN P2 : réponses du propriétaire${meta.build ? ` (version ${meta.build})` : ''}`, ''];
  for (const q of [P1, ...QUESTIONS]) {
    lines.push(q.title);
    for (const f of q.fields) lines.push(q.fields.length === 1 && f.label === 'Réponse' ? `  Réponse : ${get(q, f)}` : `  ${f.label.split(' (facultatif)')[0].split(' : ')[0]} : ${get(q, f)}`);
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}

function h(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) { if (k === 'class') e.className = v; else if (k === 'style') e.style.cssText = v; else e[k] = v; }
  for (const c of kids) e.append(c);
  return e;
}

/** Creates the form overlay; returns { open, close, text }. */
export function createQuestionnaire({ build, getPerfReport }) {
  const values = {};
  const root = h('div', { id: 'qform', class: 'p2panel' });
  const inner = h('div', { class: 'p2inner' });
  root.append(inner);
  inner.append(h('h2', {}, 'Questionnaire (8 questions)'),
    h('p', { class: 'p2note' }, 'Répondez avec vos mots, sans relire quoi que ce soit, en 5 minutes. Une question laissée vide reste « en attente ».'));
  for (const q of [P1, ...QUESTIONS]) {
    const box = h('fieldset', { class: 'p2q' });
    box.append(h('legend', {}, q.title));
    for (const f of q.fields) {
      const key = `${q.id}.${f.k}`;
      const row = h('div', { class: 'p2row' });
      row.append(h('div', { class: 'p2lab' }, f.label));
      if (f.t === 'text') {
        const ta = h('textarea', { rows: 2, id: `f-${q.id}-${f.k}` });
        ta.addEventListener('input', () => { values[key] = ta.value; });
        row.append(ta);
      } else {
        const grp = h('div', { class: 'p2choices' });
        f.opts.forEach((o) => {
          const inp = h('input', { type: 'radio', name: `f-${q.id}-${f.k}`, value: o });
          inp.addEventListener('change', () => { values[key] = o; });
          grp.append(h('label', {}, inp, ` ${o}`));
        });
        row.append(grp);
      }
      box.append(row);
    }
    inner.append(box);
  }
  const msg = h('div', { class: 'p2msg', role: 'status' });
  const area = h('textarea', { readOnly: true, rows: 10, id: 'qform-out', style: 'display:none' });
  const text = () => formatAnswers(values, { build });
  const bCopy = h('button', { id: 'qform-copy', type: 'button' }, 'Copier mes réponses');
  const bPerf = h('button', { id: 'qform-copy-perf', type: 'button' }, 'Copier aussi le rapport de performance');
  const bBack = h('button', { id: 'qform-back', type: 'button' }, 'Retour');
  bCopy.addEventListener('click', () => copyText(text(), area, msg));
  bPerf.addEventListener('click', () => copyText(JSON.stringify(getPerfReport(), null, 2), area, msg));
  bBack.addEventListener('click', () => close());
  inner.append(h('div', { class: 'p2btns' }, bCopy, bPerf, bBack), msg, area);
  // Nothing typed here may reach the game (R, M, K, F...), and a click here must not start the game.
  for (const ev of ['keydown', 'keyup']) root.addEventListener(ev, (e) => e.stopPropagation());
  root.addEventListener('click', (e) => e.stopPropagation());
  document.body.append(root);
  function open() { root.classList.add('on'); inner.scrollTop = 0; root.scrollTop = 0; }
  function close() { root.classList.remove('on'); }
  return { open, close, text, el: root };
}

/** Credits and licences screen: the full MIT text of three.js is read from the page (inserted by the build). */
export function createCredits() {
  const root = h('div', { id: 'credits', class: 'p2panel' });
  const inner = h('div', { class: 'p2inner' });
  const lic = document.getElementById('licence-three');
  inner.append(h('h2', {}, 'Crédits et licences'),
    h('p', {}, 'ESTRAN, prototype P2. Fabriqué par des agents IA ; aucune image, aucun son et aucune police d\'un tiers : géométrie, textures et sons sont générés par le code.'),
    h('p', {}, 'Rendu 3D : three.js (licence MIT), © 2010-2026 three.js authors.'));
  const det = h('details', {}, h('summary', {}, 'Texte de la licence de three.js'),
    h('pre', { id: 'credits-three' }, lic ? lic.textContent.trim() : 'Texte de la licence MIT de three.js : voir le fichier LICENSE du paquet three.'));
  const back = h('button', { id: 'credits-back', type: 'button' }, 'Retour');
  back.addEventListener('click', () => root.classList.remove('on'));
  inner.append(det, h('div', { class: 'p2btns' }, back));
  root.append(inner);
  for (const ev of ['keydown', 'keyup']) root.addEventListener(ev, (e) => e.stopPropagation());
  root.addEventListener('click', (e) => e.stopPropagation());
  document.body.append(root);
  return { open: () => root.classList.add('on'), close: () => root.classList.remove('on'), el: root };
}

/** Wires the three buttons of the start screen. */
export function bindStartScreen(bar, { build, getPerfReport }) {
  const form = createQuestionnaire({ build, getPerfReport });
  const credits = createCredits();
  const msg = bar.querySelector('#p2-msg'), area = bar.querySelector('#p2-out');
  bar.addEventListener('click', (e) => e.stopPropagation()); // clicking here must not start the game
  bar.querySelector('#p2-form').addEventListener('click', () => form.open());
  bar.querySelector('#p2-credits').addEventListener('click', () => credits.open());
  bar.querySelector('#p2-perf').addEventListener('click', () => copyText(JSON.stringify(getPerfReport(), null, 2), area, msg));
  return { form, credits };
}
