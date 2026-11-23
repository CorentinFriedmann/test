'use strict';
(() => {
  const TOKEN = document.querySelector('meta[name="studio-token"]')?.content || '';
  const $ = (s, r = document) => r.querySelector(s);
  const e = (v) => window.echapper(v ?? '');
  const md = (t) => window.renderMarkdown(t || '');

  const FAITS = ['VALIDÉ', 'VALIDÉ AVEC RÉSERVES'];
  const COLONNES = [
    { titre: 'À faire', statuts: ['À FAIRE'] },
    { titre: 'En cours', statuts: ['EN COURS'] },
    { titre: '👑 En revue Boss', statuts: ['EN REVUE BOSS'] },
    { titre: 'À corriger', statuts: ['À CORRIGER'] },
    { titre: 'Bloqué / abandonné', statuts: ['BLOQUÉ', 'ABANDONNÉ'] },
    { titre: '✅ Validé', statuts: FAITS },
  ];
  const CLS = { 'À FAIRE': 'afaire', 'EN COURS': 'encours', 'EN REVUE BOSS': 'revue', 'VALIDÉ': 'valide', 'VALIDÉ AVEC RÉSERVES': 'reserves', 'À CORRIGER': 'corriger', 'BLOQUÉ': 'bloque', 'ABANDONNÉ': 'abandon', 'REFUSÉ': 'corriger', 'INCONNU': 'afaire' };
  const MODES = [
    { id: 'acceptEdits', nom: 'Modifications acceptées (recommandé)', aide: "Les agents créent et modifient les fichiers du dépôt. Les commandes shell non pré-autorisées dans .claude/settings.json sont refusées." },
    { id: 'auto', nom: 'Auto', aide: 'Claude Code décide seul, avec ses garde-fous automatiques.' },
    { id: 'bypassPermissions', nom: 'Tout autoriser ⚠️', aide: 'Aucune confirmation, toutes les commandes sont permises. À réserver à une machine ou un dépôt isolé.' },
    { id: 'plan', nom: 'Plan (lecture seule)', aide: "Les agents analysent et proposent un plan sans rien modifier." },
    { id: 'dontAsk', nom: 'Strict', aide: "Refuse tout outil qui n'est pas explicitement pré-autorisé." },
  ];
  const ICONES = { info: 'ℹ️', texte: '💬', outil: '🛠️', delegation: '🤝', 'fin-agent': '📦', resultat: '🏁', erreur: '⛔', 'erreur-outil': '⚠️', alerte: '🚫', stderr: '⚙️' };
  const STATUT_RUN = { 'en cours': 'encours', 'terminé': 'valide', 'échec': 'corriger', 'arrêté': 'bloque', 'interrompu': 'bloque' };

  const S = { etat: null, empreinte: '', vue: vueDepuisHash(), runSel: null, run: null, filtreAgent: '', filtreJalon: '' };

  // ------------------------------------------------------------ outils

  function vueDepuisHash() {
    const v = location.hash.replace('#', '');
    return ['tableau', 'equipe', 'backlog', 'validations', 'executions'].includes(v) ? v : 'tableau';
  }

  // Vue de consultation (page exportée par exporter.js) : les données sont intégrées à la page.
  const STATIQUE = window.STUDIO_STATIQUE || null;
  if (STATIQUE) document.body.classList.add('statique');

  function apiStatique(methode, url) {
    if (methode !== 'GET') throw new Error("Vue de consultation : pour agir, utilisez l'interface locale ou demandez-le à Claude dans la conversation.");
    const u = new URL(url, 'http://studio.local');
    const [, , a, b] = u.pathname.split('/').map(decodeURIComponent);
    const D = STATIQUE;
    if (a === 'etat') return JSON.parse(JSON.stringify(D.etat));
    if (a === 'agents' && D.agents[b]) return D.agents[b];
    if (a === 'validations' && D.validations[b]) return D.validations[b];
    if (a === 'runs' && D.runs[b]) {
      const depuis = Number(u.searchParams.get('depuis')) || 0;
      return { ...D.runs[b], depuis, entrees: D.runs[b].entrees.slice(depuis) };
    }
    if (a === 'fichier') {
      const c = (u.searchParams.get('chemin') || '').replace(/\/+$/, '');
      if (D.fichiers[c] != null) return { chemin: c, contenu: D.fichiers[c] };
      const re = c.includes('*') ? new RegExp(`^${c.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*')}$`) : null;
      const liste = Object.keys(D.fichiers).filter((k) => (re ? re.test(k) : k.startsWith(`${c}/`))).sort();
      if (liste.length) return { chemin: c, liste };
      throw new Error("Ce livrable n'existe pas encore");
    }
    throw new Error('Introuvable dans cette vue de consultation');
  }

  async function api(methode, url, corps) {
    if (STATIQUE) return apiStatique(methode, url);
    const res = await fetch(url, {
      method: methode,
      headers: { 'Content-Type': 'application/json', 'X-Studio-Token': TOKEN },
      body: corps ? JSON.stringify(corps) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.erreur || `Erreur ${res.status}`);
    return data;
  }

  function lireReglages() {
    const def = { permissionMode: 'acceptEdits', model: '', budget: '' };
    try { return { ...def, ...JSON.parse(localStorage.getItem('studio-reglages') || '{}') }; } catch { return def; }
  }
  function ecrireReglages(r) { try { localStorage.setItem('studio-reglages', JSON.stringify(r)); } catch { /* stockage indisponible */ } }

  function toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => el.classList.add('sortie'), 3800);
    setTimeout(() => el.remove(), 4300);
  }

  const agent = (nom) => S.etat?.agents.find((a) => a.nom === nom);
  const tache = (id) => S.etat?.taches.find((t) => t.id === id);
  const pole = (id) => S.etat?.poles.find((p) => p.id === id) || { id: 'autre', nom: 'Autres', emoji: '🤖', couleur: '#94a3b8' };
  const validation = (id) => S.etat?.validations.find((v) => v.id === id);
  const actifs = () => new Set((S.etat?.runs || []).filter((r) => r.statut === 'en cours').flatMap((r) => r.agentsActifs || []));
  const couleur = (nom) => pole(agent(nom)?.pole).couleur;

  const badge = (st) => `<span class="badge st-${CLS[st] || 'afaire'}">${e(st)}</span>`;
  const heure = (t) => new Date(t).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateCourte = (iso) => (iso ? new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '');
  const dollars = (v) => (typeof v === 'number' ? `${v.toFixed(2)} $` : '');

  function puce(nom) {
    if (!nom) return '<span class="puce vide">non assignée</span>';
    const a = agent(nom);
    return `<span class="puce" style="--c:${couleur(nom)}" data-action="agent" data-nom="${e(nom)}" title="${e(a?.titre || nom)}"><span>${e(a?.emoji || '🤖')}</span><span class="nom">${e(nom)}</span></span>`;
  }

  // ------------------------------------------------------------ chargement

  async function charger(force = false) {
    try {
      const etat = await api('GET', '/api/etat');
      const empreinte = JSON.stringify(etat);
      if (!force && empreinte === S.empreinte) return;
      S.etat = etat;
      S.empreinte = empreinte;
      rendreChrome();
      // Dans la vue Exécutions, on ne rafraîchit que la liste pour ne pas perdre le défilement du journal.
      if (!force && S.vue === 'executions' && $('#runs-liste')) rendreListeRuns(); else rendre();
    } catch (err) {
      $('#cli').innerHTML = `<span class="rouge">● Serveur injoignable</span>`;
    }
  }

  function rendreChrome() {
    const { etat } = S;
    $('#projet').textContent = etat.projet || 'Projet sans nom';
    $('#mode').hidden = etat.mode !== 'econome';
    $('#cli').innerHTML = etat.claude.disponible
      ? `<span class="vert">●</span> ${e(etat.claude.version)}`
      : '<span class="rouge">●</span> CLI claude introuvable';
    const pastille = (id, n) => { const el = $(id); el.hidden = !n; el.textContent = n; };
    pastille('#nb-actifs', actifs().size);
    pastille('#nb-revue', etat.taches.filter((t) => t.statut === 'EN REVUE BOSS').length);
    pastille('#nb-runs', etat.runs.filter((r) => r.statut === 'en cours').length);
    document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('actif', a.dataset.vue === S.vue));
    if (STATIQUE) {
      const quand = new Date(STATIQUE.genere).toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
      $('#cli').innerHTML = `<span class="vert">●</span> Mis à jour le ${e(quand)}`;
      $('#bandeau').innerHTML = `<div class="info-bandeau">👀 <span><strong>Vue de consultation</strong> · état du studio au ${e(quand)}. Claude la republie à chaque étape du sprint. Pour lancer des agents, demandez-le dans la conversation ou utilisez l'interface locale (<code>node studio-ui/server.js</code>).</span></div>`;
      return;
    }
    $('#bandeau').innerHTML = etat.claude.disponible ? '' : `<div class="alerte-bandeau">⚠️ La commande <code>claude</code> est introuvable : vous pouvez gérer l'équipe et le backlog, mais pas lancer les agents. Installez Claude Code puis relancez <code>node studio-ui/server.js</code>.</div>`;
  }

  function rendre() {
    if (!S.etat) return;
    const vues = { tableau: vueTableau, equipe: vueEquipe, backlog: vueBacklog, validations: vueValidations, executions: vueExecutions };
    $('#vue').innerHTML = vues[S.vue]();
    if (S.vue === 'executions') { rendreListeRuns(); rendreLog(true); }
  }

  // ------------------------------------------------------------ vue : tableau de bord

  function vueTableau() {
    const { taches, agents, validations, runs } = S.etat;
    const n = (f) => taches.filter(f).length;
    const valides = n((t) => FAITS.includes(t.statut));
    const pct = taches.length ? Math.round((valides / taches.length) * 100) : 0;
    const jalons = [...new Set(taches.map((t) => t.jalon || '—'))].sort();
    const pretes = taches.filter((t) => t.prete);
    const attention = taches.filter((t) => ['BLOQUÉ', 'À CORRIGER', 'EN REVUE BOSS'].includes(t.statut));
    const kpi = (val, lib, cls = '') => `<div class="kpi ${cls}"><strong>${val}</strong><span>${lib}</span></div>`;
    return `
      <header class="tete-vue"><div><h1>Tableau de bord</h1><p class="doux">Avancement du studio et décisions à prendre</p></div>
        <div class="actions"><button class="btn" data-action="nouvelle-tache">＋ Nouvelle tâche</button><button class="btn primaire" data-action="lancer" data-type="sprint">▶ Lancer le sprint</button></div></header>
      <section class="kpis">
        ${kpi(`${pct}%`, `${valides}/${taches.length} tâches validées`, 'or')}
        ${kpi(n((t) => t.statut === 'EN COURS'), 'en cours')}
        ${kpi(n((t) => t.statut === 'EN REVUE BOSS'), 'en revue Boss', 'violet')}
        ${kpi(n((t) => ['À CORRIGER', 'BLOQUÉ'].includes(t.statut)), 'à corriger / bloquées', 'rouge')}
        ${kpi(agents.length, 'agents dans l\'équipe')}
        ${kpi(runs.filter((r) => r.statut === 'en cours').length, 'exécutions en cours', 'vert')}
      </section>
      <div class="grille2">
        <section class="panneau">
          <h2>Jalons</h2>
          ${jalons.map((j) => {
            const tj = taches.filter((t) => (t.jalon || '—') === j);
            const v = tj.filter((t) => FAITS.includes(t.statut)).length;
            return `<div class="jalon-ligne"><span class="jalon">${e(j)}</span><div class="barre"><i style="width:${tj.length ? (v / tj.length) * 100 : 0}%"></i></div><span class="doux">${v}/${tj.length}</span></div>`;
          }).join('') || '<p class="vide">Aucune tâche</p>'}
        </section>
        <section class="panneau">
          <h2>Prêtes à démarrer <span class="doux">(${pretes.length})</span></h2>
          ${pretes.length ? `<ul class="liste-taches">${pretes.map((t) => `
            <li><span class="tid" data-action="tache" data-id="${t.id}">${t.id}</span><span class="lib" data-action="tache" data-id="${t.id}">${e(t.titre)}</span>${puce(t.assigne)}
            <button class="btn petit" data-action="lancer" data-type="tache" data-tache="${t.id}" title="Faire réaliser puis valider par la Boss">▶</button></li>`).join('')}</ul>`
            : '<p class="vide">Aucune tâche prête : les dépendances ne sont pas encore validées.</p>'}
        </section>
        <section class="panneau">
          <h2>À votre attention</h2>
          ${attention.length ? `<ul class="liste-taches">${attention.map((t) => `
            <li><span class="tid" data-action="tache" data-id="${t.id}">${t.id}</span><span class="lib" data-action="tache" data-id="${t.id}">${e(t.titre)}</span>${badge(t.statut)}</li>`).join('')}</ul>`
            : '<p class="vide">Rien en attente. 🎉</p>'}
        </section>
        <section class="panneau">
          <h2>Derniers verdicts de la Boss</h2>
          ${validations.length ? `<ul class="liste-taches">${validations.slice(0, 6).map((v) => `
            <li data-action="validation" data-id="${v.id}"><span class="tid">${v.id}</span><span class="lib">${e(tache(v.id)?.titre || v.fichier)}</span>${badge(v.verdict)}</li>`).join('')}</ul>`
            : '<p class="vide">La Boss n\'a encore rendu aucun verdict.</p>'}
        </section>
      </div>`;
  }

  // ------------------------------------------------------------ vue : équipe

  function vueEquipe() {
    const { agents, poles, taches } = S.etat;
    const enActivite = actifs();
    const blocs = poles.map((p) => {
      const membres = agents.filter((a) => a.pole === p.id);
      if (!membres.length) return '';
      return `<section class="pole" style="--c:${p.couleur}">
        <h2><span>${e(p.emoji)}</span>${e(p.nom)} <span class="doux">${membres.length}</span></h2>
        <div class="cartes-agents">${membres.map((a) => {
          const sesTaches = taches.filter((t) => t.assigne === a.nom);
          const ouvertes = sesTaches.filter((t) => !FAITS.includes(t.statut)).length;
          const faites = sesTaches.length - ouvertes;
          return `<article class="carte-agent ${enActivite.has(a.nom) ? 'actif' : ''} ${a.nom === 'boss' ? 'boss' : ''}" data-action="agent" data-nom="${e(a.nom)}">
            <div class="avatar">${e(a.emoji)}</div>
            <div class="ca-infos"><h3>${e(a.nom)}</h3><p class="titre-agent">${e(a.titre || '')}</p>
              <p class="desc">${e(a.description)}</p>
              <div class="ca-bas"><span class="modele">${e(a.model || 'inherit')}</span>
                ${sesTaches.length ? `<span class="doux">${ouvertes} ouverte${ouvertes > 1 ? 's' : ''} · ${faites} validée${faites > 1 ? 's' : ''}</span>` : '<span class="doux">aucune tâche</span>'}
                ${enActivite.has(a.nom) ? '<span class="au-travail">● au travail</span>' : ''}</div>
            </div></article>`;
        }).join('')}</div></section>`;
    }).join('');
    return `<header class="tete-vue"><div><h1>Équipe</h1><p class="doux">${agents.length} agents · cliquez sur un agent pour modifier ses instructions ou lui confier une mission</p></div>
      <div class="actions"><button class="btn primaire" data-action="nouvel-agent">＋ Recruter un agent</button></div></header>${blocs}`;
  }

  // ------------------------------------------------------------ vue : backlog

  function vueBacklog() {
    const { taches, agents } = S.etat;
    const filtrees = taches.filter((t) => (!S.filtreAgent || t.assigne === S.filtreAgent) && (!S.filtreJalon || t.jalon === S.filtreJalon));
    const jalons = [...new Set(taches.map((t) => t.jalon).filter(Boolean))].sort();
    return `<header class="tete-vue"><div><h1>Backlog</h1><p class="doux">Source : production/BACKLOG.md · seule la Boss peut valider ou refuser</p></div>
      <div class="actions">
        <select data-change="filtre-agent"><option value="">Tous les agents</option>${agents.map((a) => `<option value="${e(a.nom)}" ${S.filtreAgent === a.nom ? 'selected' : ''}>${e(a.emoji)} ${e(a.nom)}</option>`).join('')}</select>
        <select data-change="filtre-jalon"><option value="">Tous les jalons</option>${jalons.map((j) => `<option ${S.filtreJalon === j ? 'selected' : ''}>${e(j)}</option>`).join('')}</select>
        <button class="btn primaire" data-action="nouvelle-tache">＋ Nouvelle tâche</button></div></header>
      <div class="kanban">${COLONNES.map((c) => {
        const liste = filtrees.filter((t) => c.statuts.includes(t.statut));
        return `<section class="colonne st-${CLS[c.statuts[0]]}"><h3>${c.titre}<span>${liste.length}</span></h3>
          ${liste.map(carteTache).join('') || '<p class="vide petit">—</p>'}</section>`;
      }).join('')}</div>`;
  }

  function carteTache(t) {
    const deps = t.deps.map((d) => {
      const ok = FAITS.includes(tache(d)?.statut);
      return `<span class="dep ${ok ? 'ok' : ''}" title="${ok ? 'validée' : 'non validée'} : ${e(tache(d)?.titre || '')}">${ok ? '✓' : '⧗'} ${e(d)}</span>`;
    }).join('');
    return `<article class="carte-tache" data-action="tache" data-id="${t.id}" style="--c:${couleur(t.assigne)}">
      <div class="ct-haut"><span class="tid">${t.id}</span>${t.jalon ? `<span class="jalon">${e(t.jalon)}</span>` : ''}${t.prete ? '<span class="etiquette prete">prête</span>' : ''}${t.statut === 'VALIDÉ AVEC RÉSERVES' ? '<span class="etiquette reserve">réserves</span>' : ''}</div>
      <h4>${e(t.titre)}</h4>
      <div class="ct-bas">${puce(t.assigne)}</div>
      ${deps ? `<div class="deps">${deps}</div>` : ''}
    </article>`;
  }

  // ------------------------------------------------------------ vue : validations

  function vueValidations() {
    const { validations } = S.etat;
    return `<header class="tete-vue"><div><h1>👑 Validations de la Boss</h1><p class="doux">Rapports dans production/validations/</p></div></header>
      ${validations.length ? `<div class="panneau"><table class="tableau"><thead><tr><th>Tâche</th><th>Titre</th><th>Responsable</th><th>Verdict</th><th>Cycles</th><th>Date</th></tr></thead><tbody>
        ${validations.map((v) => { const t = tache(v.id); return `<tr data-action="validation" data-id="${v.id}"><td><span class="tid">${v.id}</span></td><td>${e(t?.titre || '')}</td><td>${puce(t?.assigne)}</td><td>${badge(v.verdict)}</td><td>${v.cycles || 1}</td><td class="doux">${e(v.date || dateCourte(v.modifie))}</td></tr>`; }).join('')}
        </tbody></table></div>`
        : `<div class="panneau vide-grand"><p>👑</p><p>Aucun verdict pour l'instant.</p><p class="doux">Lancez une tâche : la Boss écrira son rapport ici dès qu'elle l'aura relue.</p></div>`}`;
  }

  // ------------------------------------------------------------ vue : exécutions

  function vueExecutions() {
    return `<header class="tete-vue"><div><h1>Exécutions</h1><p class="doux">Chaque exécution est une session Claude Code qui coordonne les agents</p></div>
      <div class="actions"><button class="btn primaire" data-action="lancer" data-type="tache">▶ Nouvelle exécution</button></div></header>
      <div class="executions"><aside id="runs-liste" class="panneau runs-liste"></aside><section id="run-detail" class="panneau run-detail"></section></div>`;
  }

  function rendreListeRuns() {
    const el = $('#runs-liste');
    if (!el) return;
    const { runs } = S.etat;
    if (!S.runSel && runs.length) S.runSel = runs[0].id;
    el.innerHTML = runs.length ? runs.map((r) => `
      <div class="run-item ${r.id === S.runSel ? 'sel' : ''}" data-action="voir-run" data-id="${r.id}">
        <span class="point st-${STATUT_RUN[r.statut] || 'afaire'}"></span>
        <div><strong>${e(r.titre)}</strong><small>${dateCourte(r.debut)} · ${e(r.statut)} ${r.cout != null ? `· ${dollars(r.cout)}` : ''}</small>
        ${r.agentsActifs?.length ? `<small class="vert">● ${r.agentsActifs.map(e).join(', ')}</small>` : ''}</div>
      </div>`).join('') : '<p class="vide">Aucune exécution. Lancez une tâche ou un sprint.</p>';
  }

  function ligneLog(en) {
    const acteur = en.acteur === 'coordination'
      ? '<span class="puce coord">🎬 Coordination</span>'
      : puce(en.acteur);
    let corps = ['texte', 'resultat'].includes(en.type) ? `<div class="md">${md(en.texte)}</div>` : `<span>${e(en.texte)}</span>`;
    if (en.type === 'delegation') corps = `${puce(en.cible)} <span>reçoit la mission : ${e(en.texte.replace(/^.*?»\s*:?\s*/, ''))}</span>`;
    if (en.type === 'fin-agent') corps = `${puce(en.cible)} <span>a rendu son travail</span>`;
    if (en.extrait) corps += `<details><summary>Voir le travail rendu</summary><div class="md">${md(en.extrait)}</div></details>`;
    return `<div class="log-ligne t-${en.type}"><time>${heure(en.t)}</time><span class="ic">${ICONES[en.type] || '•'}</span>${acteur}<div class="log-corps">${corps}</div></div>`;
  }

  function rendreLog(complet) {
    const el = $('#run-detail');
    if (!el) return;
    const r = S.run;
    if (!S.runSel) { el.innerHTML = '<div class="vide-grand"><p>▶️</p><p>Sélectionnez ou lancez une exécution.</p></div>'; return; }
    if (!r || r.id !== S.runSel) { el.innerHTML = '<p class="vide">Chargement…</p>'; return; }
    if (complet || !$('#log')) {
      el.innerHTML = `<header class="run-tete"><div><h2>${e(r.titre)}</h2><p class="doux" id="run-meta"></p></div><div id="run-actions"></div></header>
        <div class="log" id="log">${r.entrees.map(ligneLog).join('')}</div>`;
    }
    majEnteteRun();
    const log = $('#log');
    log.scrollTop = log.scrollHeight;
  }

  function majEnteteRun() {
    const r = S.run;
    if (!r || !$('#run-meta')) return;
    $('#run-meta').innerHTML = `${badge(r.statut.toUpperCase())} démarré ${dateCourte(r.debut)} · mode ${e(r.permissionMode)}${r.model ? ` · ${e(r.model)}` : ''}${r.cout != null ? ` · coût ${dollars(r.cout)}` : ''}${r.duree ? ` · ${Math.round(r.duree / 1000)} s` : ''}`;
    $('#run-actions').innerHTML = r.statut === 'en cours' ? `<button class="btn danger" data-action="stop-run" data-id="${r.id}">■ Arrêter</button>` : '';
  }

  async function suivreRun() {
    if (S.vue !== 'executions' || !S.runSel) return;
    const meme = S.run && S.run.id === S.runSel;
    const depuis = meme ? S.run.entrees.length : 0;
    let r;
    try { r = await api('GET', `/api/runs/${encodeURIComponent(S.runSel)}?depuis=${depuis}`); } catch { return; }
    if (!meme) { S.run = r; rendreLog(true); return; }
    const log = $('#log');
    const enBas = log && log.scrollHeight - log.scrollTop - log.clientHeight < 80;
    if (r.entrees.length && log) {
      S.run.entrees.push(...r.entrees);
      log.insertAdjacentHTML('beforeend', r.entrees.map(ligneLog).join(''));
      if (enBas) log.scrollTop = log.scrollHeight;
    }
    const changement = r.statut !== S.run.statut || r.cout !== S.run.cout;
    Object.assign(S.run, { ...r, entrees: S.run.entrees });
    if (changement) { majEnteteRun(); charger(); }
  }

  // ------------------------------------------------------------ fenêtres

  function ouvrirModal(html, classe = '') {
    const m = $('#modal');
    m.innerHTML = `<div class="fenetre ${classe}" role="dialog" aria-modal="true">${html}</div>`;
    m.hidden = false;
    document.body.classList.add('modal-ouverte');
    const champ = m.querySelector('input:not([readonly]):not([type=radio]), textarea');
    if (champ) champ.focus();
  }
  function fermerModal() {
    $('#modal').hidden = true;
    $('#modal').innerHTML = '';
    document.body.classList.remove('modal-ouverte');
  }
  const enteteModal = (titre, avant = '') => `<header class="m-tete">${avant}<h2>${titre}</h2><button class="btn fantome" data-action="fermer" aria-label="Fermer">✕</button></header>`;

  function ouvrirTache(id) {
    const t = tache(id);
    if (!t) return;
    const v = validation(id);
    const statutsManuels = S.etat.statuts.filter((s) => !S.etat.reservesBoss.includes(s));
    ouvrirModal(`${enteteModal(e(t.titre), `<span class="tid">${t.id}</span>`)}
      <div class="m-corps grille-tache">
        <div>
          <section><h3>Critères d'acceptation</h3>${t.criteres.length ? `<ul class="criteres">${t.criteres.map((c) => `<li class="${c.fait ? 'fait' : ''}"><span class="coche">${c.fait ? '☑' : '☐'}</span>${md(c.texte).replace(/^<p>|<\/p>$/g, '')}</li>`).join('')}</ul>` : '<p class="vide">Aucun critère : la Boss risque de refuser.</p>'}</section>
          <section><h3>Livrables</h3>${t.livrables.length ? `<ul class="livrables">${t.livrables.map((l) => `<li><button class="lien" data-action="fichier" data-chemin="${e(l.chemin)}" ${l.existe ? '' : 'disabled'}>${l.existe ? '📄' : '⏳'} ${e(l.chemin)}</button></li>`).join('')}</ul>` : '<p class="vide">Non précisés</p>'}</section>
          ${t.contexte ? `<section><h3>Contexte</h3><div class="md">${md(t.contexte)}</div></section>` : ''}
        </div>
        <aside class="m-cote">
          <dl>
            <dt>Statut</dt><dd>${badge(t.statut)}</dd>
            <dt>Responsable</dt><dd>${puce(t.assigne)}</dd>
            ${t.revue ? `<dt>Revue de pôle</dt><dd>${t.revue.split(/[,\s]+/).filter(Boolean).map((n) => puce(n.replace(/`/g, ''))).join(' ')}</dd>` : ''}
            <dt>Dépend de</dt><dd>${t.deps.length ? t.deps.map((d) => `<span class="dep ${FAITS.includes(tache(d)?.statut) ? 'ok' : ''}" data-action="tache" data-id="${d}">${e(d)}</span>`).join(' ') : 'aucune'}</dd>
            ${t.jalon ? `<dt>Jalon</dt><dd><span class="jalon">${e(t.jalon)}</span></dd>` : ''}
          </dl>
          ${t.bloqueePar.length ? `<p class="avert">⧗ En attente de : ${t.bloqueePar.map(e).join(', ')}</p>` : ''}
          <button class="btn primaire large" data-action="lancer" data-type="tache" data-tache="${t.id}">▶ Faire réaliser par l'équipe</button>
          <button class="btn large" data-action="lancer" data-type="boss" data-tache="${t.id}">👑 Soumettre à la Boss</button>
          ${v ? `<button class="btn large" data-action="validation" data-id="${t.id}">📄 Rapport de la Boss ${badge(v.verdict)}</button>` : ''}
          <div class="changer-statut">
            <label>Changer le statut à la main
              <select id="sel-statut">${S.etat.statuts.map((s) => `<option ${s === t.statut ? 'selected' : ''} ${statutsManuels.includes(s) ? '' : 'disabled'}>${e(s)}</option>`).join('')}</select></label>
            <button class="btn petit" data-action="appliquer-statut" data-id="${t.id}">Appliquer</button>
            <p class="aide">VALIDÉ et À CORRIGER sont réservés à la Boss.</p>
          </div>
        </aside>
      </div>`, 'large');
  }

  async function ouvrirAgent(nom) {
    const nouveau = !nom;
    let a = { nom: '', description: '', model: 'sonnet', tools: '', prompt: modelePrompt(), pole: 'design', emoji: '🤖', titre: '' };
    if (!nouveau) {
      try { a = await api('GET', `/api/agents/${encodeURIComponent(nom)}`); } catch (err) { toast(err.message, 'erreur'); return; }
    }
    const sesTaches = nouveau ? [] : S.etat.taches.filter((t) => t.assigne === nom);
    const modeles = ['inherit', 'opus', 'sonnet', 'haiku'];
    if (a.model && !modeles.includes(a.model)) modeles.push(a.model);
    ouvrirModal(`<form id="form-agent" data-nouveau="${nouveau ? 1 : ''}">
      ${enteteModal(nouveau ? 'Recruter un agent' : e(a.nom), `<span class="avatar petit" style="--c:${pole(a.pole).couleur}">${e(a.emoji)}</span>`)}
      <div class="m-corps grille-agent">
        <div class="champs">
          <div class="ligne-champs">
            <label>Identifiant<input name="nom" value="${e(a.nom)}" ${nouveau ? '' : 'readonly'} required pattern="[a-z0-9][a-z0-9-]{1,48}" placeholder="ex. concept-artist"></label>
            <label class="etroit">Emoji<input name="emoji" value="${e(a.emoji)}" maxlength="8"></label>
          </div>
          <div class="ligne-champs">
            <label>Pôle<select name="pole">${S.etat.poles.map((p) => `<option value="${e(p.id)}" ${p.id === a.pole ? 'selected' : ''}>${e(p.emoji)} ${e(p.nom)}</option>`).join('')}</select></label>
            <label>Titre<input name="titre" value="${e(a.titre)}" placeholder="ex. Concept artist senior"></label>
          </div>
          <div class="ligne-champs">
            <label>Modèle<select name="model">${modeles.map((m) => `<option ${m === (a.model || 'inherit') ? 'selected' : ''}>${e(m)}</option>`).join('')}</select></label>
            <label>Outils autorisés<input name="tools" value="${e(a.tools)}" placeholder="vide = tous (ex. Read, Grep, Glob, Write)"></label>
          </div>
          <label>Description · quand faire appel à cet agent<textarea name="description" rows="3" required>${e(a.description)}</textarea></label>
          <label>Instructions (prompt système)<textarea name="prompt" rows="16" class="mono" required>${e(a.prompt)}</textarea></label>
        </div>
        ${nouveau ? `<aside class="m-cote"><h3>Conseils de recrutement</h3><ul class="conseils"><li>Une mission claire et un périmètre précis.</li><li>Des livrables avec leurs chemins dans <code>docs/</code> ou <code>game/</code>.</li><li>Le protocole de remise : rapport, puis validation par la Boss.</li><li>Les limites : ce qu'il ne doit jamais faire.</li></ul></aside>`
          : `<aside class="m-cote"><h3>Ses tâches</h3>${sesTaches.length ? `<ul class="liste-taches compacte">${sesTaches.map((t) => `<li data-action="tache" data-id="${t.id}"><span class="tid">${t.id}</span><span class="lib">${e(t.titre)}</span>${badge(t.statut)}</li>`).join('')}</ul>` : '<p class="vide">Aucune tâche assignée.</p>'}
            <button type="button" class="btn large" data-action="lancer" data-type="mission" data-agent="${e(a.nom)}">🎯 Confier une mission</button></aside>`}
      </div>
      <footer class="m-pied">
        ${!nouveau && a.nom !== 'boss' ? `<button type="button" class="btn danger" data-action="supprimer-agent" data-nom="${e(a.nom)}">Licencier</button>` : '<span></span>'}
        <div><button type="button" class="btn" data-action="fermer">${STATIQUE ? 'Fermer' : 'Annuler'}</button><button class="btn primaire" type="submit">${nouveau ? 'Recruter' : 'Enregistrer'}</button></div>
      </footer></form>`, 'large');
    if (STATIQUE) $('#form-agent').querySelectorAll('input, textarea, select').forEach((el) => { el.readOnly = true; if (el.tagName === 'SELECT') el.disabled = true; });
  }

  function modelePrompt() {
    return `Tu es **<Titre>** du studio, <expérience>.

## Mission
<Ce que cet agent apporte au jeu, en une phrase.>

## Responsabilités
- **<Livrable principal>** (\`docs/<dossier>/<FICHIER>.md\`) : <contenu attendu>.
- ...

## Principes
- ...

## Protocole de remise
Termine chaque tâche par le rapport de remise (\`studio/templates/REMISE.md\`).
Tu ne valides jamais ton propre travail : il doit être **validé par la Boss**.
`;
  }

  function ouvrirNouvelleTache() {
    const { agents, taches } = S.etat;
    const leads = ['technical-director', 'art-director', 'game-director'].filter((n) => agent(n));
    ouvrirModal(`<form id="form-tache">${enteteModal('Nouvelle tâche')}
      <div class="m-corps champs">
        <label>Titre<input name="titre" required maxlength="200" placeholder="ex. Prototype de la locomotion"></label>
        <div class="ligne-champs">
          <label>Responsable<select name="assigne" required>${agents.filter((a) => a.nom !== 'boss').map((a) => `<option value="${e(a.nom)}">${e(a.emoji)} ${e(a.nom)}</option>`).join('')}<option value="boss">👑 boss</option></select></label>
          <label>Revue de pôle<select name="revue"><option value="">aucune</option>${leads.map((n) => `<option>${e(n)}</option>`).join('')}</select></label>
          <label class="etroit">Jalon<select name="jalon"><option value="">—</option>${['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map((j) => `<option>${j}</option>`).join('')}</select></label>
        </div>
        <fieldset><legend>Dépend de</legend><div class="choix-deps">${taches.map((t) => `<label class="case-dep"><input type="checkbox" name="deps" value="${t.id}"><span>${t.id}</span> ${e(t.titre)}</label>`).join('')}</div></fieldset>
        <label>Livrables attendus · un chemin par ligne<textarea name="livrables" rows="3" class="mono" placeholder="docs/design/systemes/locomotion.md"></textarea></label>
        <label>Critères d'acceptation · un par ligne, mesurables<textarea name="criteres" rows="4" required placeholder="La spécification couvre marche, course, saut et accroupi&#10;Toutes les valeurs sont dans docs/design/data/locomotion.csv"></textarea></label>
        <label>Contexte / références<input name="contexte" placeholder="optionnel"></label>
      </div>
      <footer class="m-pied"><span class="aide">La tâche est ajoutée à production/BACKLOG.md au statut À FAIRE.</span><div><button type="button" class="btn" data-action="fermer">Annuler</button><button class="btn primaire" type="submit">Créer la tâche</button></div></footer>
    </form>`, 'large');
  }

  function ouvrirLancement(preset = {}) {
    const { taches, agents, runs } = S.etat;
    const r = lireReglages();
    const type = preset.type || 'tache';
    const ouvertes = taches.filter((t) => !FAITS.includes(t.statut));
    const tacheSel = preset.tache || taches.find((t) => t.prete)?.id || ouvertes[0]?.id || '';
    const enCours = runs.filter((x) => x.statut === 'en cours').length;
    const types = [
      ['sprint', '🏃 Sprint complet', 'Toutes les tâches prêtes, validées une à une par la Boss'],
      ['tache', '▶ Une tâche', "L'agent responsable la réalise, puis la Boss valide"],
      ['boss', '👑 Revue de la Boss', 'Soumettre une tâche déjà réalisée'],
      ['mission', '🎯 Mission libre', 'Une demande ponctuelle à un agent'],
    ];
    ouvrirModal(`<form id="form-lancer">${enteteModal('Lancer une exécution')}
      <div class="m-corps champs">
        <div class="types">${types.map(([id, nom, aide]) => `<label class="type-run"><input type="radio" name="type" value="${id}" ${id === type ? 'checked' : ''}><span><strong>${nom}</strong><small>${aide}</small></span></label>`).join('')}</div>
        <label data-pour="tache boss">Tâche<select name="tache">${taches.map((t) => `<option value="${t.id}" ${t.id === tacheSel ? 'selected' : ''}>${t.id} · ${e(t.titre)} (${e(t.statut)}${t.prete ? ', prête' : ''})</option>`).join('')}</select></label>
        <label data-pour="sprint">Nombre maximum de tâches<input name="max" type="number" min="1" placeholder="toutes"></label>
        <div data-pour="mission" class="champs">
          <label>Agent<select name="agent">${agents.map((a) => `<option value="${e(a.nom)}" ${a.nom === preset.agent ? 'selected' : ''}>${e(a.emoji)} ${e(a.nom)} · ${e(a.titre)}</option>`).join('')}</select></label>
          <label>Mission<textarea name="mission" rows="5" placeholder="ex. Propose 3 mécaniques de traversée originales pour le monde du jeu, en cohérence avec les piliers."></textarea></label>
        </div>
        <details class="reglages" ${r.permissionMode === 'bypassPermissions' ? 'open' : ''}><summary>⚙️ Réglages d'exécution</summary>
          <div class="ligne-champs">
            <label>Permissions<select name="permissionMode">${MODES.map((m) => `<option value="${m.id}" ${m.id === r.permissionMode ? 'selected' : ''}>${e(m.nom)}</option>`).join('')}</select></label>
            <label>Modèle de coordination<select name="model">${[['', 'par défaut'], ['opus', 'opus'], ['sonnet', 'sonnet'], ['haiku', 'haiku']].map(([v, l]) => `<option value="${v}" ${v === r.model ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
            <label class="etroit">Budget max ($)<input name="budget" type="number" min="0" step="0.5" value="${e(r.budget)}" placeholder="∞"></label>
          </div>
          <p class="aide" id="aide-mode"></p>
        </details>
        ${enCours ? `<p class="avert">⚠️ ${enCours} exécution(s) déjà en cours : plusieurs exécutions simultanées peuvent modifier le backlog en même temps.</p>` : ''}
      </div>
      <footer class="m-pied"><span class="aide">Une session Claude Code s'ouvre dans le dépôt et suit les règles de CLAUDE.md.</span><div><button type="button" class="btn" data-action="fermer">Annuler</button><button class="btn primaire" type="submit" ${S.etat.claude.disponible ? '' : 'disabled'}>▶ Lancer</button></div></footer>
    </form>`);
    majFormLancer();
  }

  function majFormLancer() {
    const f = $('#form-lancer');
    if (!f) return;
    const type = f.type.value;
    f.querySelectorAll('[data-pour]').forEach((el) => { el.hidden = !el.dataset.pour.split(' ').includes(type); });
    const mode = MODES.find((m) => m.id === f.permissionMode.value);
    $('#aide-mode').textContent = mode ? mode.aide : '';
  }

  async function ouvrirFichier(chemin) {
    try {
      const f = await api('GET', `/api/fichier?chemin=${encodeURIComponent(chemin)}`);
      if (f.liste) {
        ouvrirModal(`${enteteModal(e(chemin))}<div class="m-corps"><ul class="livrables">${f.liste.map((c) => `<li><button class="lien" data-action="fichier" data-chemin="${e(c)}">📄 ${e(c)}</button></li>`).join('')}</ul></div>`);
      } else {
        const rendu = /\.md$/i.test(f.chemin) ? `<div class="md document">${md(f.contenu)}</div>` : `<pre class="code">${e(f.contenu)}</pre>`;
        ouvrirModal(`${enteteModal(e(f.chemin))}<div class="m-corps">${rendu}</div>`, 'large');
      }
    } catch (err) { toast(err.message, 'erreur'); }
  }

  async function ouvrirValidation(id) {
    try {
      const v = await api('GET', `/api/validations/${encodeURIComponent(id)}`);
      const resume = validation(id);
      ouvrirModal(`${enteteModal(`Rapport de la Boss · ${e(id)}`, resume ? badge(resume.verdict) : '')}<div class="m-corps"><div class="md document">${md(v.contenu)}</div></div>
        <footer class="m-pied"><span class="aide">${e(v.fichier)}</span><div><button class="btn" data-action="tache" data-id="${e(id)}">Voir la tâche</button></div></footer>`, 'large');
    } catch (err) { toast(err.message, 'erreur'); }
  }

  // ------------------------------------------------------------ actions

  const actions = {
    fermer: fermerModal,
    tache: (d) => ouvrirTache(d.id),
    agent: (d) => ouvrirAgent(d.nom),
    'nouvel-agent': () => ouvrirAgent(null),
    'nouvelle-tache': ouvrirNouvelleTache,
    validation: (d) => ouvrirValidation(d.id),
    fichier: (d) => ouvrirFichier(d.chemin),
    lancer: (d) => ouvrirLancement({ type: d.type, tache: d.tache, agent: d.agent }),
    'voir-run': (d) => { S.runSel = d.id; S.run = null; rendreListeRuns(); rendreLog(true); suivreRun(); },
    'stop-run': async (d) => {
      if (!confirm('Arrêter cette exécution ? Le travail en cours de l\'agent sera interrompu.')) return;
      try { await api('POST', `/api/runs/${encodeURIComponent(d.id)}/stop`); toast('Arrêt demandé'); } catch (err) { toast(err.message, 'erreur'); }
    },
    'appliquer-statut': async (d) => {
      try {
        await api('PATCH', `/api/taches/${d.id}`, { statut: $('#sel-statut').value });
        toast(`${d.id} : statut mis à jour`, 'succes');
        await charger(true);
        ouvrirTache(d.id);
      } catch (err) { toast(err.message, 'erreur'); }
    },
    'supprimer-agent': async (d) => {
      const n = S.etat.taches.filter((t) => t.assigne === d.nom && !FAITS.includes(t.statut)).length;
      if (!confirm(`Licencier ${d.nom} ? Son fichier .claude/agents/${d.nom}.md sera supprimé.${n ? `\n⚠️ ${n} tâche(s) ouverte(s) lui sont encore assignées.` : ''}`)) return;
      try { await api('DELETE', `/api/agents/${encodeURIComponent(d.nom)}`); fermerModal(); toast(`${d.nom} a quitté le studio`); charger(true); } catch (err) { toast(err.message, 'erreur'); }
    },
  };

  document.addEventListener('click', (ev) => {
    if (ev.target.id === 'modal') { fermerModal(); return; }
    const el = ev.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.action];
    if (!fn) return;
    ev.preventDefault();
    ev.stopPropagation();
    fn(el.dataset, el);
  });

  document.addEventListener('change', (ev) => {
    const c = ev.target.dataset.change;
    if (c === 'filtre-agent') { S.filtreAgent = ev.target.value; rendre(); }
    if (c === 'filtre-jalon') { S.filtreJalon = ev.target.value; rendre(); }
    if (ev.target.closest('#form-lancer')) majFormLancer();
  });

  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && !$('#modal').hidden) fermerModal(); });

  document.addEventListener('submit', async (ev) => {
    const f = ev.target;
    ev.preventDefault();
    const bouton = f.querySelector('[type=submit]');
    if (bouton) bouton.disabled = true;
    try {
      if (f.id === 'form-agent') {
        const nom = f.nom.value.trim();
        if (f.dataset.nouveau && agent(nom)) throw new Error(`Un agent « ${nom} » existe déjà`);
        await api('PUT', `/api/agents/${encodeURIComponent(nom)}`, {
          description: f.description.value, prompt: f.prompt.value, model: f.model.value === 'inherit' ? 'inherit' : f.model.value,
          tools: f.tools.value, pole: f.pole.value, emoji: f.emoji.value, titre: f.titre.value,
        });
        fermerModal();
        toast(f.dataset.nouveau ? `${nom} a rejoint le studio 🎉 (disponible dans les nouvelles sessions)` : `${nom} : instructions enregistrées`, 'succes');
        await charger(true);
      } else if (f.id === 'form-tache') {
        const { id } = await api('POST', '/api/taches', {
          titre: f.titre.value, assigne: f.assigne.value, revue: f.revue.value, jalon: f.jalon.value,
          deps: [...f.querySelectorAll('input[name=deps]:checked')].map((x) => x.value),
          livrables: f.livrables.value, criteres: f.criteres.value, contexte: f.contexte.value,
        });
        fermerModal();
        toast(`${id} ajoutée au backlog`, 'succes');
        await charger(true);
      } else if (f.id === 'form-lancer') {
        const reglages = { permissionMode: f.permissionMode.value, model: f.model.value, budget: f.budget.value };
        ecrireReglages(reglages);
        const run = await api('POST', '/api/runs', {
          type: f.type.value, tache: f.tache.value, agent: f.agent.value, mission: f.mission.value, max: f.max.value, ...reglages,
        });
        fermerModal();
        toast('Exécution lancée', 'succes');
        S.runSel = run.id;
        S.run = null;
        location.hash = 'executions';
        await charger(true);
      }
    } catch (err) {
      toast(err.message, 'erreur');
    } finally {
      if (bouton) bouton.disabled = false;
    }
  });

  window.addEventListener('hashchange', () => {
    S.vue = vueDepuisHash();
    rendreChrome();
    rendre();
    suivreRun();
  });

  // ------------------------------------------------------------ démarrage

  charger(true).then(suivreRun);
  setInterval(() => { if (!document.hidden) charger(); }, 4000);
  setInterval(() => { if (!document.hidden) suivreRun(); }, 1500);
})();
