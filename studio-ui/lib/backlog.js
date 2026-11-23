'use strict';

// Analyse et modification de production/BACKLOG.md.
// Le Markdown reste la source de vérité : les agents l'éditent aussi, le parseur est donc tolérant.

const STATUTS = ['À FAIRE', 'EN COURS', 'EN REVUE BOSS', 'VALIDÉ', 'VALIDÉ AVEC RÉSERVES', 'À CORRIGER', 'BLOQUÉ', 'ABANDONNÉ'];
const RESERVES_BOSS = ['VALIDÉ', 'VALIDÉ AVEC RÉSERVES', 'À CORRIGER'];
const FAITS = ['VALIDÉ', 'VALIDÉ AVEC RÉSERVES'];

const sansAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const nettoyer = (s) => String(s || '').replace(/`/g, '').trim();

function normStatut(s) {
  const u = sansAccents(nettoyer(s).toUpperCase());
  const tries = [...STATUTS].sort((a, b) => b.length - a.length);
  for (const st of tries) if (u.startsWith(sansAccents(st))) return st;
  return nettoyer(s).toUpperCase() || 'À FAIRE';
}

function normCle(k) {
  const c = sansAccents(k.toLowerCase());
  if (c.startsWith('assign')) return 'assigne';
  if (c.startsWith('revue')) return 'revue';
  if (c.startsWith('depend')) return 'deps';
  if (c.startsWith('statut')) return 'statut';
  if (c.startsWith('jalon')) return 'jalon';
  if (c.startsWith('pole')) return 'pole';
  if (c.startsWith('livrable')) return 'livrables';
  if (c.startsWith('crit')) return 'criteres';
  if (c.startsWith('contexte')) return 'contexte';
  return c;
}

const ids = (s) => (String(s || '').match(/T-\d+/g) || []);
const backticks = (s) => (String(s || '').match(/`([^`]+)`/g) || []).map((x) => x.slice(1, -1).trim());

function trouverSections(md) {
  const re = /^###\s+(T-\d+)\s*[:：–-]\s*(.+?)\s*$/gm;
  const sections = [];
  let m;
  while ((m = re.exec(md))) {
    sections.push({ id: m[1], titre: m[2], debut: m.index, debutCorps: m.index + m[0].length });
  }
  sections.forEach((s, i) => {
    let fin = i + 1 < sections.length ? sections[i + 1].debut : md.length;
    const reste = md.slice(s.debutCorps, fin);
    const stop = reste.search(/^(#{1,2}\s|---\s*$)/m);
    if (stop >= 0) fin = s.debutCorps + stop;
    s.fin = fin;
  });
  return sections;
}

function analyserSection(corps) {
  const champs = {};
  const listes = {};
  let cle = null;
  for (const ligne of corps.split('\n')) {
    const haut = /^[-*] (.*)$/.exec(ligne);
    const sous = /^\s{2,}[-*] (.*)$/.exec(ligne);
    if (haut) {
      cle = null;
      for (const partie of haut[1].split(/\s+·\s+/)) {
        const kv = /^\*\*(.+?)\*\*\s*:\s*(.*)$/.exec(partie.trim());
        if (kv) {
          cle = normCle(kv[1]);
          champs[cle] = kv[2].trim();
        }
      }
    } else if (sous && cle) {
      (listes[cle] ||= []).push(sous[1].trim());
    }
  }
  return { champs, listes };
}

function lignesTableau(md) {
  const lignes = [];
  for (const l of md.split('\n')) {
    if (!/^\|\s*T-\d+\s*\|/.test(l)) continue;
    const c = l.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map((x) => x.trim());
    lignes.push({ id: c[0], titre: c[1] || '', assigne: nettoyer(c[2]), deps: c[3] || '', statut: c[c.length - 1] || '' });
  }
  return lignes;
}

function analyser(md) {
  const parId = new Map();
  for (const r of lignesTableau(md)) {
    parId.set(r.id, {
      id: r.id, titre: r.titre, assigne: r.assigne, revue: '', pole: '', jalon: '',
      deps: ids(r.deps), statut: normStatut(r.statut), livrables: [], criteres: [], contexte: '',
      section: false,
    });
  }
  for (const s of trouverSections(md)) {
    const { champs, listes } = analyserSection(md.slice(s.debutCorps, s.fin));
    const t = parId.get(s.id) || { id: s.id, deps: [], livrables: [], criteres: [] };
    t.titre = s.titre;
    if (champs.assigne) t.assigne = nettoyer(champs.assigne);
    if (champs.revue) t.revue = /aucun/i.test(champs.revue) ? '' : nettoyer(champs.revue);
    if (champs.pole) t.pole = nettoyer(champs.pole);
    if (champs.jalon) t.jalon = nettoyer(champs.jalon);
    if ('deps' in champs) t.deps = ids(champs.deps);
    if (champs.statut) t.statut = normStatut(champs.statut);
    if (champs.contexte) t.contexte = champs.contexte;
    const liv = [...backticks(champs.livrables), ...(listes.livrables || []).flatMap((x) => {
      const b = backticks(x);
      return b.length ? b : [x];
    })];
    t.livrables = liv.map((x) => x.replace(/\s*\(.*\)\s*$/, '').trim()).filter(Boolean);
    t.criteres = (listes.criteres || []).map((x) => {
      const m = /^\[( |x|X)\]\s*(.*)$/.exec(x);
      return m ? { fait: m[1] !== ' ', texte: m[2] } : { fait: false, texte: x };
    });
    t.section = true;
    t.titre ||= s.titre;
    t.revue ||= '';
    t.pole ||= '';
    t.jalon ||= '';
    t.contexte ||= '';
    parId.set(s.id, t);
  }
  const taches = [...parId.values()].sort((a, b) => num(a.id) - num(b.id));
  const statutDe = new Map(taches.map((t) => [t.id, t.statut]));
  for (const t of taches) {
    t.bloqueePar = t.deps.filter((d) => !FAITS.includes(statutDe.get(d)));
    t.prete = ['À FAIRE', 'À CORRIGER'].includes(t.statut) && t.bloqueePar.length === 0;
  }
  return taches;
}

const num = (id) => Number(String(id).replace(/\D/g, '')) || 0;

function prochainId(md) {
  const max = Math.max(0, ...ids(md).map(num));
  return `T-${String(max + 1).padStart(3, '0')}`;
}

function changerStatut(md, id, statut) {
  if (!/^T-\d+$/.test(id)) throw new Error('ID de tâche invalide');
  if (!STATUTS.includes(statut)) throw new Error('Statut inconnu');
  let trouve = false;
  let out = md.replace(new RegExp(`^(\\|\\s*${id}\\s*\\|.*\\|)[^|\\n]*\\|[ \\t]*$`, 'm'), (_, avant) => {
    trouve = true;
    return `${avant} ${statut} |`;
  });
  const section = trouverSections(out).find((s) => s.id === id);
  if (section) {
    const corps = out.slice(section.debutCorps, section.fin);
    let nouveau;
    if (/\*\*Statut\*\*\s*:/.test(corps)) {
      nouveau = corps.replace(/(\*\*Statut\*\*\s*:\s*)([^·\n]*)/, (_, a, b) => a + statut + ((b.match(/\s+$/) || [''])[0]));
    } else {
      nouveau = `\n- **Statut** : ${statut}` + corps;
    }
    out = out.slice(0, section.debutCorps) + nouveau + out.slice(section.fin);
    trouve = true;
  }
  if (!trouve) throw new Error(`Tâche ${id} introuvable dans le backlog`);
  return out;
}

const uneLigne = (s) => String(s || '').replace(/\s*\r?\n\s*/g, ' ').trim();

function ajouterTache(md, t) {
  const id = prochainId(md);
  const deps = t.deps && t.deps.length ? t.deps.join(', ') : 'aucune';
  const entete = [
    `**Assigné à** : \`${t.assigne}\``,
    t.revue ? `**Revue de pôle** : ${t.revue}` : null,
    `**Dépend de** : ${deps}`,
    t.jalon ? `**Jalon** : ${t.jalon}` : null,
    '**Statut** : À FAIRE',
  ].filter(Boolean).join(' · ');
  const lignes = [`### ${id} : ${uneLigne(t.titre)}`, `- ${entete}`];
  if (t.livrables && t.livrables.length) {
    lignes.push('- **Livrables** :', ...t.livrables.map((l) => `  - \`${uneLigne(l).replace(/`/g, '')}\``));
  }
  lignes.push("- **Critères d'acceptation** :", ...(t.criteres || []).map((c) => `  - [ ] ${uneLigne(c)}`));
  if (t.contexte) lignes.push(`- **Contexte / références** : ${uneLigne(t.contexte)}`);
  const section = lignes.join('\n');

  let out = md.replace(/\s*$/, '\n\n') + section + '\n';
  const ligneTableau = `| ${id} | ${uneLigne(t.titre).replace(/\|/g, '/')} | ${t.assigne} | ${deps} | À FAIRE |`;
  const lignesMd = out.split('\n');
  let derniere = -1;
  lignesMd.forEach((l, i) => { if (/^\|\s*T-\d+\s*\|/.test(l)) derniere = i; });
  if (derniere >= 0) {
    lignesMd.splice(derniere + 1, 0, ligneTableau);
    out = lignesMd.join('\n');
  }
  return { id, md: out };
}

module.exports = { STATUTS, RESERVES_BOSS, FAITS, analyser, changerStatut, ajouterTache, prochainId, normStatut };
