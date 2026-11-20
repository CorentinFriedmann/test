'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const backlog = require('../lib/backlog');
const { parseFrontmatter, serializeFrontmatter } = require('../lib/frontmatter');

const MD = fs.readFileSync(path.join(__dirname, '..', '..', 'production', 'BACKLOG.md'), 'utf8');

test('le backlog réel est entièrement analysé', () => {
  const taches = backlog.analyser(MD);
  const lignesTableau = (MD.match(/^\|\s*T-\d+\s*\|/gm) || []).length;
  assert.equal(taches.length, lignesTableau);
  for (const t of taches) {
    assert.ok(t.titre, `${t.id} sans titre`);
    assert.ok(t.assigne, `${t.id} sans responsable`);
    assert.ok(backlog.STATUTS.includes(t.statut), `${t.id} statut ${t.statut}`);
    assert.ok(t.criteres.length > 0, `${t.id} sans critère`);
    assert.ok(t.livrables.length > 0, `${t.id} sans livrable`);
  }
});

test('dépendances et tâches prêtes', () => {
  const taches = backlog.analyser(MD);
  const t004 = taches.find((t) => t.id === 'T-004');
  assert.ok(t004.deps.includes('T-001'));
  const t001 = taches.find((t) => t.id === 'T-001');
  if (t001.statut === 'À FAIRE') assert.equal(t001.prete, true);
});

test('livrables en liste ou en ligne', () => {
  const t = backlog.analyser(MD).find((x) => x.id === 'T-011');
  assert.ok(t.livrables.includes('game/'));
  assert.ok(t.livrables.includes('.gitattributes'));
});

test('changer le statut met à jour le tableau et la section', () => {
  const md = backlog.changerStatut(MD, 'T-002', 'EN COURS');
  const t = backlog.analyser(md).find((x) => x.id === 'T-002');
  assert.equal(t.statut, 'EN COURS');
  assert.match(md, /^\| T-002 \|.*\| EN COURS \|$/m);
  assert.match(md, /### T-002[\s\S]*?\*\*Statut\*\* : EN COURS/);
  // Les autres tâches ne bougent pas.
  assert.equal(backlog.analyser(md).find((x) => x.id === 'T-003').statut, backlog.analyser(MD).find((x) => x.id === 'T-003').statut);
});

test('ajouter une tâche', () => {
  const { id, md } = backlog.ajouterTache(MD, {
    titre: 'Prototype | locomotion', assigne: 'gameplay-programmer', revue: '`technical-director`',
    deps: ['T-006'], jalon: 'M1', livrables: ['game/Source/Locomotion/'], criteres: ['Marche, course, saut'], contexte: 'GDD',
  });
  const t = backlog.analyser(md).find((x) => x.id === id);
  assert.equal(t.assigne, 'gameplay-programmer');
  assert.equal(t.revue, 'technical-director');
  assert.deepEqual(t.deps, ['T-006']);
  assert.equal(t.statut, 'À FAIRE');
  assert.equal(t.jalon, 'M1');
  assert.deepEqual(t.criteres, [{ fait: false, texte: 'Marche, course, saut' }]);
  assert.match(md, new RegExp(`^\\| ${id} \\| Prototype / locomotion \\|`, 'm'));
});

test('statuts tolérants (accents, casse)', () => {
  assert.equal(backlog.normStatut('valide avec reserves'), 'VALIDÉ AVEC RÉSERVES');
  assert.equal(backlog.normStatut('`A CORRIGER`'), 'À CORRIGER');
  assert.equal(backlog.normStatut('En revue Boss'), 'EN REVUE BOSS');
});

test('frontmatter : aller-retour sans perte', () => {
  const src = '---\nname: test\ndescription: "Arguments : avec deux-points"\nmodel: opus\n---\n\nCorps **markdown**\n';
  const { data, body } = parseFrontmatter(src);
  assert.equal(data.description, 'Arguments : avec deux-points');
  const re = parseFrontmatter(serializeFrontmatter(data, body));
  assert.deepEqual(re.data, data);
  assert.equal(re.body.trim(), 'Corps **markdown**');
});

test('les agents du dépôt ont un frontmatter valide', () => {
  const dossier = path.join(__dirname, '..', '..', '.claude', 'agents');
  for (const f of fs.readdirSync(dossier)) {
    const { data, body } = parseFrontmatter(fs.readFileSync(path.join(dossier, f), 'utf8'));
    assert.equal(`${data.name}.md`, f);
    assert.ok(data.description && body.length > 200, f);
  }
});
