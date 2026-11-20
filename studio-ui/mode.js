#!/usr/bin/env node
'use strict';

// Bascule le studio entre le mode « normal » et le mode « econome ».
// Usage : node studio-ui/mode.js [normal | econome]   (sans argument : affiche le mode actuel)
//
// - econome : tous les agents passent sur le modèle sonnet (moins coûteux).
// - normal  : chaque agent retrouve son modèle d'origine, conservé dans studio/equipe.json (champ modeleNormal).
// Les règles de travail propres à chaque mode sont décrites dans studio/WORKFLOW.md.

const fs = require('node:fs');
const path = require('node:path');
const { parseFrontmatter, serializeFrontmatter } = require('./lib/frontmatter');

const ROOT = path.resolve(process.env.STUDIO_ROOT || path.join(__dirname, '..'));
const AGENTS = path.join(ROOT, '.claude', 'agents');
const EQUIPE = path.join(ROOT, 'studio', 'equipe.json');
const MODELE_ECONOME = 'sonnet';

const equipe = JSON.parse(fs.readFileSync(EQUIPE, 'utf8'));
const cible = process.argv[2];

if (!cible) {
  console.log(`Mode actuel : ${equipe.mode || 'normal'}`);
  process.exit(0);
}
if (!['normal', 'econome'].includes(cible)) {
  console.error('Usage : node studio-ui/mode.js [normal | econome]');
  process.exit(1);
}

const lignes = [];
for (const f of fs.readdirSync(AGENTS).filter((x) => x.endsWith('.md'))) {
  const fichier = path.join(AGENTS, f);
  const { data, body } = parseFrontmatter(fs.readFileSync(fichier, 'utf8'));
  const nom = data.name || f.slice(0, -3);
  const meta = (equipe.agents[nom] ||= { pole: 'autre', emoji: '🤖', titre: '' });
  // Le modèle « normal » est mémorisé la première fois qu'on quitte le mode normal.
  if (!meta.modeleNormal && (equipe.mode || 'normal') === 'normal') meta.modeleNormal = data.model || 'inherit';
  const nouveau = cible === 'econome' ? MODELE_ECONOME : meta.modeleNormal || data.model || 'inherit';
  if (data.model !== nouveau) {
    lignes.push(`${nom.padEnd(22)} ${String(data.model || 'inherit').padEnd(8)} → ${nouveau}`);
    data.model = nouveau;
    fs.writeFileSync(fichier, serializeFrontmatter(data, body));
  }
}
equipe.mode = cible;
fs.writeFileSync(EQUIPE, JSON.stringify(equipe, null, 2) + '\n');

console.log(`Studio en mode ${cible}.`);
console.log(lignes.length ? lignes.join('\n') : 'Aucun modèle à changer.');
console.log('Les agents modifiés sont pris en compte dans les nouvelles sessions Claude Code.');
