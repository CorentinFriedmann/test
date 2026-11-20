#!/usr/bin/env node
'use strict';

// Interface graphique du studio IA : serveur local sans dépendance.
// Usage : node studio-ui/server.js   puis ouvrir http://127.0.0.1:4747

const http = require('node:http');
const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const crypto = require('node:crypto');
const { execFile } = require('node:child_process');
const { parseFrontmatter, serializeFrontmatter } = require('./lib/frontmatter');
const backlog = require('./lib/backlog');
const { RunManager } = require('./lib/runs');

const ROOT = path.resolve(process.env.STUDIO_ROOT || path.join(__dirname, '..'));
const PORT = Number(process.env.PORT) || 4747;
const HOST = process.env.HOST || '127.0.0.1';
const CLAUDE_BIN = process.env.CLAUDE_BIN || 'claude';
const TOKEN = crypto.randomBytes(24).toString('hex');
const LOOPBACK = ['127.0.0.1', 'localhost', '::1'].includes(HOST);
const HOTES = new Set([`127.0.0.1:${PORT}`, `localhost:${PORT}`, `[::1]:${PORT}`]);

const P = {
  agents: path.join(ROOT, '.claude', 'agents'),
  equipe: path.join(ROOT, 'studio', 'equipe.json'),
  backlog: path.join(ROOT, 'production', 'BACKLOG.md'),
  validations: path.join(ROOT, 'production', 'validations'),
  pitch: path.join(ROOT, 'docs', 'vision', 'PITCH.md'),
  public: path.join(__dirname, 'public'),
  runs: path.join(__dirname, '.runs'),
};

const NOM_AGENT = /^[a-z0-9][a-z0-9-]{1,48}$/;
const ID_TACHE = /^T-\d{3,}$/;
const MODES = ['acceptEdits', 'auto', 'bypassPermissions', 'manual', 'dontAsk', 'plan'];
const TYPES_MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8',
};

let claude = { disponible: false, version: null };
execFile(CLAUDE_BIN, ['--version'], { timeout: 20000 }, (err, out) => {
  claude = err ? { disponible: false, version: null } : { disponible: true, version: String(out).trim() };
});

const runs = new RunManager({ root: ROOT, dir: P.runs, bin: CLAUDE_BIN });

// ---------------------------------------------------------------- utilitaires

function erreurHttp(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

function envoyer(res, status, obj) {
  const corps = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(corps);
}

function lireCorps(req) {
  return new Promise((resolve, reject) => {
    let taille = 0;
    const morceaux = [];
    req.on('data', (c) => {
      taille += c.length;
      if (taille > 1_000_000) { reject(erreurHttp(413, 'Requête trop volumineuse')); req.destroy(); return; }
      morceaux.push(c);
    });
    req.on('end', () => {
      if (!morceaux.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(morceaux).toString('utf8'))); } catch { reject(erreurHttp(400, 'JSON invalide')); }
    });
    req.on('error', reject);
  });
}

const lireTexte = (f) => fsp.readFile(f, 'utf8').catch(() => '');
const chaine = (v, max = 100000) => String(v ?? '').slice(0, max);

function cheminSur(relatif) {
  const abs = path.resolve(ROOT, String(relatif || ''));
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) throw erreurHttp(403, 'Chemin hors du dépôt');
  const rel = path.relative(ROOT, abs);
  if (rel.split(path.sep).some((s) => s === '.git' || /^\.env/.test(s))) throw erreurHttp(403, 'Fichier non consultable');
  return abs;
}

function globVersRegex(motif) {
  return new RegExp(`^${motif.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.')}$`);
}

async function correspondances(livrable) {
  const sansSlash = livrable.replace(/\/+$/, '');
  if (!/[*?]/.test(sansSlash)) {
    try { fs.accessSync(cheminSur(sansSlash)); return [sansSlash]; } catch { return []; }
  }
  const dossier = path.posix.dirname(sansSlash);
  const re = globVersRegex(path.posix.basename(sansSlash));
  try {
    const noms = await fsp.readdir(cheminSur(dossier));
    return noms.filter((n) => re.test(n)).map((n) => `${dossier}/${n}`);
  } catch { return []; }
}

// ---------------------------------------------------------------- données du studio

async function lireEquipe() {
  try {
    const j = JSON.parse(await fsp.readFile(P.equipe, 'utf8'));
    return { poles: j.poles || [], agents: j.agents || {} };
  } catch { return { poles: [], agents: {} }; }
}

async function ecrireEquipe(eq) {
  await fsp.mkdir(path.dirname(P.equipe), { recursive: true });
  await fsp.writeFile(P.equipe, JSON.stringify(eq, null, 2) + '\n');
}

async function listerAgents() {
  const eq = await lireEquipe();
  let fichiers = [];
  try { fichiers = (await fsp.readdir(P.agents)).filter((f) => f.endsWith('.md')); } catch { /* aucun agent */ }
  const ordreAgents = Object.keys(eq.agents);
  const ordrePoles = eq.poles.map((p) => p.id);
  const agents = [];
  for (const f of fichiers) {
    const { data, body } = parseFrontmatter(await lireTexte(path.join(P.agents, f)));
    const nom = data.name || f.slice(0, -3);
    const meta = eq.agents[nom] || {};
    agents.push({
      nom, fichier: `.claude/agents/${f}`, description: data.description || '', model: data.model || '',
      tools: data.tools || '', pole: meta.pole || 'autre', emoji: meta.emoji || '🤖', titre: meta.titre || '',
      taillePrompt: body.length,
    });
  }
  const rang = (liste, v) => { const i = liste.indexOf(v); return i < 0 ? 999 : i; };
  agents.sort((a, b) => rang(ordrePoles, a.pole) - rang(ordrePoles, b.pole) || rang(ordreAgents, a.nom) - rang(ordreAgents, b.nom) || a.nom.localeCompare(b.nom));
  const poles = [...eq.poles];
  if (agents.some((a) => !ordrePoles.includes(a.pole))) poles.push({ id: 'autre', nom: 'Autres', emoji: '🤖', couleur: '#94a3b8' });
  return { agents, poles };
}

async function lireTaches() {
  const taches = backlog.analyser(await lireTexte(P.backlog));
  for (const t of taches) {
    t.livrables = await Promise.all(t.livrables.map(async (l) => ({ chemin: l, existe: (await correspondances(l)).length > 0 })));
  }
  return taches;
}

async function listerValidations() {
  let fichiers = [];
  try { fichiers = (await fsp.readdir(P.validations)).filter((f) => /^T-\d+.*\.md$/.test(f)); } catch { /* aucune */ }
  const liste = [];
  for (const f of fichiers) {
    const contenu = await lireTexte(path.join(P.validations, f));
    const verdicts = [...contenu.matchAll(/verdict[^A-Za-zÀ-ÿ\n]{0,12}(VALIDÉ AVEC RÉSERVES|VALIDE AVEC RESERVES|VALIDÉ|VALIDE|REFUSÉ|REFUSE)/gi)];
    const brut = verdicts.length ? verdicts[verdicts.length - 1][1].toUpperCase() : '';
    const verdict = /RESERVES|RÉSERVES/.test(brut) ? 'VALIDÉ AVEC RÉSERVES' : /^VALID/.test(brut) ? 'VALIDÉ' : /^REFUS/.test(brut) ? 'REFUSÉ' : 'INCONNU';
    const date = (/\*\*Date\*\*\s*:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/.exec(contenu) || [])[1] || null;
    const stat = await fsp.stat(path.join(P.validations, f));
    liste.push({ id: (/^(T-\d+)/.exec(f) || [])[1], fichier: `production/validations/${f}`, verdict, date, modifie: stat.mtime.toISOString(), cycles: verdicts.length });
  }
  return liste.sort((a, b) => b.modifie.localeCompare(a.modifie));
}

async function etat() {
  const [{ agents, poles }, taches, validations, pitch] = await Promise.all([listerAgents(), lireTaches(), listerValidations(), lireTexte(P.pitch)]);
  const projet = (/^#\s+(.+)$/m.exec(pitch) || [])[1] || null;
  return { projet, claude, statuts: backlog.STATUTS, reservesBoss: backlog.RESERVES_BOSS, agents, poles, taches, validations, runs: runs.list() };
}

// ---------------------------------------------------------------- actions

async function enregistrerAgent(nom, corps) {
  const description = chaine(corps.description, 2000).trim();
  const prompt = chaine(corps.prompt, 200000).trim();
  if (!description) throw erreurHttp(400, 'La description est obligatoire (elle dit quand utiliser cet agent).');
  if (!prompt) throw erreurHttp(400, "Les instructions de l'agent sont obligatoires.");
  const fichier = path.join(P.agents, `${nom}.md`);
  const existant = parseFrontmatter(await lireTexte(fichier)).data;
  const donnees = { ...existant, name: nom, description, model: chaine(corps.model, 60).trim(), tools: chaine(corps.tools, 500).trim() };
  if (!donnees.model) delete donnees.model;
  if (!donnees.tools) delete donnees.tools;
  const ordre = { name: donnees.name, description: donnees.description, model: donnees.model, tools: donnees.tools };
  await fsp.mkdir(P.agents, { recursive: true });
  await fsp.writeFile(fichier, serializeFrontmatter({ ...ordre, ...donnees }, prompt));

  const eq = await lireEquipe();
  eq.agents[nom] = {
    pole: chaine(corps.pole, 40).trim() || eq.agents[nom]?.pole || 'autre',
    emoji: chaine(corps.emoji, 8).trim() || eq.agents[nom]?.emoji || '🤖',
    titre: chaine(corps.titre, 80).trim() || eq.agents[nom]?.titre || '',
  };
  await ecrireEquipe(eq);
}

async function supprimerAgent(nom) {
  if (nom === 'boss') throw erreurHttp(400, 'La Boss ne peut pas être supprimée : elle valide toutes les tâches.');
  try { await fsp.unlink(path.join(P.agents, `${nom}.md`)); } catch { throw erreurHttp(404, 'Agent introuvable'); }
  const eq = await lireEquipe();
  delete eq.agents[nom];
  await ecrireEquipe(eq);
}

async function creerTache(corps) {
  const titre = chaine(corps.titre, 200).trim();
  const assigne = chaine(corps.assigne, 50).trim();
  if (!titre) throw erreurHttp(400, 'Le titre est obligatoire');
  if (!NOM_AGENT.test(assigne) || !fs.existsSync(path.join(P.agents, `${assigne}.md`))) throw erreurHttp(400, 'Agent responsable inconnu');
  const revue = chaine(corps.revue, 50).trim();
  if (revue && !NOM_AGENT.test(revue)) throw erreurHttp(400, 'Agent de revue invalide');
  const deps = (Array.isArray(corps.deps) ? corps.deps : String(corps.deps || '').split(/[\s,;]+/)).filter((d) => ID_TACHE.test(d));
  const jalon = /^M\d$/.test(corps.jalon) ? corps.jalon : '';
  const liste = (v) => (Array.isArray(v) ? v : String(v || '').split('\n')).map((x) => chaine(x, 500).trim()).filter(Boolean).slice(0, 50);
  const criteres = liste(corps.criteres);
  if (!criteres.length) throw erreurHttp(400, "Au moins un critère d'acceptation est obligatoire : c'est ce que la Boss vérifiera.");
  const md = await lireTexte(P.backlog);
  const { id, md: nouveau } = backlog.ajouterTache(md, {
    titre, assigne, revue: revue ? `\`${revue}\`` : '', deps, jalon, livrables: liste(corps.livrables), criteres, contexte: chaine(corps.contexte, 2000),
  });
  await fsp.writeFile(P.backlog, nouveau);
  return id;
}

async function changerStatutTache(id, statut) {
  if (!backlog.STATUTS.includes(statut)) throw erreurHttp(400, 'Statut inconnu');
  if (backlog.RESERVES_BOSS.includes(statut)) throw erreurHttp(403, `Le statut « ${statut} » est réservé à la Boss : soumettez la tâche à la Boss.`);
  const md = await lireTexte(P.backlog);
  try { await fsp.writeFile(P.backlog, backlog.changerStatut(md, id, statut)); } catch (e) { throw erreurHttp(400, e.message); }
}

const CONSIGNE_GUI = "\n\nTu es lancé depuis l'interface graphique du studio, en mode non interactif : personne ne peut te répondre pendant l'exécution. Si une décision humaine est nécessaire (choix du concept, argent, comptes, contrats, juridique), arrête-toi et formule clairement la question et la recommandation de la Boss dans ta réponse finale.";

async function lancer(corps) {
  const type = corps.type;
  const permissionMode = MODES.includes(corps.permissionMode) ? corps.permissionMode : 'acceptEdits';
  const model = /^[a-z0-9.\-[\]]{0,60}$/i.test(corps.model || '') ? corps.model || '' : '';
  const budget = Number(corps.budget) > 0 ? Math.min(Number(corps.budget), 1000) : null;
  const taches = backlog.analyser(await lireTexte(P.backlog));
  let titre;
  let prompt;
  let tache = null;
  let agent = null;
  if (type === 'tache' || type === 'boss') {
    tache = corps.tache;
    const t = taches.find((x) => x.id === tache);
    if (!ID_TACHE.test(tache || '') || !t) throw erreurHttp(400, 'Tâche inconnue');
    if (type === 'tache') {
      titre = `${tache} · ${t.titre}`;
      prompt = `Exécute le skill \`sprint\` du studio (.claude/skills/sprint/SKILL.md) UNIQUEMENT pour la tâche ${tache} : confie-la à son agent responsable, fais la revue de pôle si elle est prévue, puis fais-la valider par l'agent \`boss\`. Respecte strictement la règle de validation de CLAUDE.md.`;
    } else {
      titre = `👑 Revue ${tache} · ${t.titre}`;
      prompt = `Exécute le skill \`revue-boss\` du studio (.claude/skills/revue-boss/SKILL.md) pour la tâche ${tache}.`;
    }
  } else if (type === 'mission') {
    agent = corps.agent;
    const mission = chaine(corps.mission, 20000).trim();
    if (!NOM_AGENT.test(agent || '') || !fs.existsSync(path.join(P.agents, `${agent}.md`))) throw erreurHttp(400, 'Agent inconnu');
    if (!mission) throw erreurHttp(400, 'Décrivez la mission');
    titre = `Mission · ${agent}`;
    prompt = `Confie la mission ci-dessous à l'agent \`${agent}\` du studio (outil Agent, subagent_type "${agent}"), puis rapporte son résultat. Si la mission produit un livrable lié à une tâche du backlog, fais-le ensuite valider par l'agent \`boss\` comme l'exige CLAUDE.md.\n\nMission :\n${mission}`;
  } else if (type === 'sprint') {
    titre = 'Sprint · toutes les tâches prêtes';
    const max = Number(corps.max) > 0 ? ` (au maximum ${Math.floor(Number(corps.max))} tâches)` : '';
    prompt = `Exécute le skill \`sprint\` du studio (.claude/skills/sprint/SKILL.md) sur les tâches prêtes du backlog${max}. Respecte strictement la règle de validation par la Boss.`;
  } else {
    throw erreurHttp(400, "Type d'exécution inconnu");
  }
  return runs.start({ titre, type, tache, agent, prompt: prompt + CONSIGNE_GUI, permissionMode, model, budget });
}

// ---------------------------------------------------------------- routes

async function routerApi(req, res, url) {
  const m = req.method;
  const [, a, b, c] = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);

  if (a === 'etat' && m === 'GET') return envoyer(res, 200, await etat());

  if (a === 'agents' && b) {
    if (!NOM_AGENT.test(b)) throw erreurHttp(400, "Identifiant d'agent invalide (minuscules, chiffres et tirets)");
    if (m === 'GET') {
      const texte = await lireTexte(path.join(P.agents, `${b}.md`));
      if (!texte) throw erreurHttp(404, 'Agent introuvable');
      const { data, body } = parseFrontmatter(texte);
      const meta = (await lireEquipe()).agents[b] || {};
      return envoyer(res, 200, { nom: b, description: data.description || '', model: data.model || '', tools: data.tools || '', prompt: body, pole: meta.pole || 'autre', emoji: meta.emoji || '🤖', titre: meta.titre || '' });
    }
    if (m === 'PUT') { await enregistrerAgent(b, await lireCorps(req)); return envoyer(res, 200, { ok: true }); }
    if (m === 'DELETE') { await supprimerAgent(b); return envoyer(res, 200, { ok: true }); }
  }

  if (a === 'taches') {
    if (m === 'POST' && !b) return envoyer(res, 201, { id: await creerTache(await lireCorps(req)) });
    if (m === 'PATCH' && b) {
      if (!ID_TACHE.test(b)) throw erreurHttp(400, 'ID de tâche invalide');
      await changerStatutTache(b, (await lireCorps(req)).statut);
      return envoyer(res, 200, { ok: true });
    }
  }

  if (a === 'validations' && b && m === 'GET') {
    if (!/^T-\d+$/.test(b)) throw erreurHttp(400, 'ID invalide');
    const f = (await fsp.readdir(P.validations).catch(() => [])).find((x) => x.startsWith(`${b}.`) || x.startsWith(`${b}-`) || x === `${b}.md`);
    if (!f) throw erreurHttp(404, 'Aucun rapport de la Boss pour cette tâche');
    return envoyer(res, 200, { id: b, fichier: `production/validations/${f}`, contenu: await lireTexte(path.join(P.validations, f)) });
  }

  if (a === 'fichier' && m === 'GET') {
    const chemin = url.searchParams.get('chemin') || '';
    const trouves = await correspondances(chemin);
    if (!trouves.length) throw erreurHttp(404, "Ce livrable n'existe pas encore");
    const premier = cheminSur(trouves[0]);
    const st = await fsp.stat(premier);
    if (trouves.length > 1 || st.isDirectory()) {
      const liste = st.isDirectory() && trouves.length === 1
        ? (await fsp.readdir(premier)).map((n) => `${trouves[0].replace(/\/$/, '')}/${n}`)
        : trouves;
      return envoyer(res, 200, { chemin, liste });
    }
    if (st.size > 1_000_000) throw erreurHttp(413, 'Fichier trop volumineux pour être affiché');
    const buf = await fsp.readFile(premier);
    if (buf.includes(0)) throw erreurHttp(415, 'Fichier binaire : ouvrez-le dans son logiciel');
    return envoyer(res, 200, { chemin: trouves[0], contenu: buf.toString('utf8') });
  }

  if (a === 'runs') {
    if (m === 'GET' && !b) return envoyer(res, 200, runs.list());
    if (m === 'POST' && !b) {
      if (!claude.disponible) throw erreurHttp(503, "La commande « claude » est introuvable sur cette machine : installez Claude Code pour lancer les agents.");
      return envoyer(res, 201, await lancer(await lireCorps(req)));
    }
    if (m === 'GET' && b) {
      const r = runs.get(b, Math.max(0, Number(url.searchParams.get('depuis')) || 0));
      if (!r) throw erreurHttp(404, 'Exécution introuvable');
      return envoyer(res, 200, r);
    }
    if (m === 'POST' && b && c === 'stop') return envoyer(res, 200, { ok: runs.stop(b) });
  }

  throw erreurHttp(404, 'Route inconnue');
}

async function servirStatique(req, res, url) {
  if (req.method !== 'GET' && req.method !== 'HEAD') throw erreurHttp(405, 'Méthode non autorisée');
  const demande = url.pathname === '/' ? '/index.html' : url.pathname;
  const fichier = path.resolve(P.public, '.' + path.posix.normalize(decodeURIComponent(demande)));
  if (!fichier.startsWith(P.public + path.sep)) throw erreurHttp(403, 'Interdit');
  let contenu;
  try { contenu = await fsp.readFile(fichier); } catch { throw erreurHttp(404, 'Introuvable'); }
  if (fichier.endsWith('index.html')) contenu = Buffer.from(contenu.toString('utf8').replace('__STUDIO_TOKEN__', TOKEN));
  res.writeHead(200, {
    'Content-Type': TYPES_MIME[path.extname(fichier)] || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'",
  });
  res.end(req.method === 'HEAD' ? undefined : contenu);
}

const serveur = http.createServer(async (req, res) => {
  try {
    if (LOOPBACK && !HOTES.has(String(req.headers.host || '').toLowerCase())) throw erreurHttp(403, 'Hôte non autorisé');
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) {
      if (req.method !== 'GET' && req.headers['x-studio-token'] !== TOKEN) throw erreurHttp(403, 'Jeton invalide : rechargez la page.');
      return await routerApi(req, res, url);
    }
    return await servirStatique(req, res, url);
  } catch (err) {
    if (!res.headersSent) envoyer(res, err.status || 500, { erreur: err.message || 'Erreur interne' });
    else res.end();
  }
});

module.exports = { etat, lireEquipe, correspondances, cheminSur, P, ROOT };

if (require.main !== module) return;

serveur.listen(PORT, HOST, () => {
  const adresse = `http://${HOST.includes(':') ? `[${HOST}]` : HOST}:${PORT}`;
  console.log(`\n  🎮 Studio IA : interface prête sur ${adresse}`);
  console.log(`  Dépôt : ${ROOT}`);
  if (!LOOPBACK) console.log('  ⚠️  Écoute sur une interface réseau : toute personne du réseau peut voir le studio.');
  console.log('  Ctrl+C pour arrêter.\n');
});
