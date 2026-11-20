#!/usr/bin/env node
'use strict';

// Exporte l'état du studio dans une page HTML autonome, en lecture seule :
// équipe, backlog, documents livrés, rapports de la Boss et, en option, un journal d'exécution.
//
// Usage : node studio-ui/exporter.js [--sortie fichier.html] [--journal journal.json] [--fragment]
//   --fragment : n'écrit pas <html>/<head>/<body> (page destinée à être enveloppée par un hébergeur)

const fs = require('node:fs');
const path = require('node:path');
const { parseFrontmatter } = require('./lib/frontmatter');
const { etat, lireEquipe, P, ROOT } = require('./server');

const args = process.argv.slice(2);
const option = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
const sortie = path.resolve(option('--sortie') || path.join(__dirname, 'export', 'studio.html'));
const journal = option('--journal');
const fragment = args.includes('--fragment');

const TEXTE = /\.(md|csv|json|txt|ini|ya?ml|cs|h|cpp|py|uproject|uplugin|gitattributes|gitignore)$/i;
const MAX_FICHIER = 400_000;

function parcourir(relatif, acc, limite = 400) {
  const abs = path.join(ROOT, relatif);
  let st;
  try { st = fs.statSync(abs); } catch { return; }
  if (st.isDirectory()) {
    for (const n of fs.readdirSync(abs)) {
      if (n === '.git' || n === 'node_modules' || n.startsWith('.env')) continue;
      if (Object.keys(acc).length >= limite) return;
      parcourir(path.posix.join(relatif, n), acc, limite);
    }
  } else if (st.size <= MAX_FICHIER && (TEXTE.test(relatif) || /(^|\/)\.git(attributes|ignore)$/.test(relatif))) {
    const buf = fs.readFileSync(abs);
    if (!buf.includes(0)) acc[relatif] = buf.toString('utf8');
  }
}

(async () => {
  const e = await etat();
  e.claude = { disponible: false, version: null };
  e.runs = [];

  const equipe = await lireEquipe();
  const agents = {};
  for (const a of e.agents) {
    const { data, body } = parseFrontmatter(fs.readFileSync(path.join(P.agents, `${a.nom}.md`), 'utf8'));
    const meta = equipe.agents[a.nom] || {};
    agents[a.nom] = { nom: a.nom, description: data.description || '', model: data.model || '', tools: data.tools || '', prompt: body, pole: meta.pole || 'autre', emoji: meta.emoji || '🤖', titre: meta.titre || '' };
  }

  const validations = {};
  for (const v of e.validations) {
    validations[v.id] = { id: v.id, fichier: v.fichier, contenu: fs.readFileSync(path.join(ROOT, v.fichier), 'utf8') };
  }

  const fichiers = {};
  for (const dossier of ['docs', 'production', 'studio']) parcourir(dossier, fichiers);
  for (const t of e.taches) for (const l of t.livrables) if (l.existe) parcourir(l.chemin.replace(/\*.*$/, '').replace(/\/+$/, ''), fichiers);

  const runs = {};
  if (journal) {
    const j = JSON.parse(fs.readFileSync(journal, 'utf8'));
    for (const r of Array.isArray(j) ? j : [j]) {
      runs[r.id] = r;
      e.runs.push({ id: r.id, titre: r.titre, type: r.type, tache: r.tache || null, agent: r.agent || null, statut: r.statut, debut: r.debut, fin: r.fin || null, cout: r.cout ?? null, duree: r.duree ?? null, permissionMode: r.permissionMode || '', model: r.model || '', nbEntrees: r.entrees.length, agentsActifs: r.agentsActifs || [] });
    }
  }

  const donnees = { genere: new Date().toISOString(), etat: e, agents, validations, fichiers, runs };
  const LS = String.fromCharCode(0x2028);
  const PS = String.fromCharCode(0x2029);
  const json = JSON.stringify(donnees).replace(/</g, '\\u003c').split(LS).join('\\u2028').split(PS).join('\\u2029');

  const lire = (f) => fs.readFileSync(path.join(P.public, f), 'utf8');
  const html = lire('index.html');
  const corps = (/<body>([\s\S]*)<\/body>/.exec(html) || [, ''])[1].replace(/\s*<script src="[^"]*"><\/script>/g, '');
  const scripts = `<script>${lire('markdown.js')}</script>\n<script>window.STUDIO_STATIQUE = ${json};</script>\n<script>${lire('app.js')}</script>`;
  const titre = `<title>Studio IA</title>`;
  const style = `<style>${lire('style.css')}</style>`;
  const page = fragment
    ? `${titre}\n${style}\n${corps}\n${scripts}\n`
    : `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n${titre}\n${style}\n</head>\n<body>\n${corps}\n${scripts}\n</body>\n</html>\n`;

  fs.mkdirSync(path.dirname(sortie), { recursive: true });
  fs.writeFileSync(sortie, page);
  console.log(`Export : ${sortie} (${Math.round(page.length / 1024)} Ko, ${e.taches.length} tâches, ${Object.keys(fichiers).length} fichiers, ${Object.keys(validations).length} rapports de la Boss)`);
  process.exit(0);
})().catch((err) => { console.error(err); process.exit(1); });
