# Rapport de remise : T-040, archivé par la Coordination

> Texte rendu par `build-engineer` le 2026-11-26, résumé fidèlement par la Coordination pour la revue du TD et la Boss.

## Résultat
`npm run all` exécuté, code de sortie 0. Avant : unitaires 72/72, p2 14/14, e2e verts. Après : unitaires 85/85 (72 + 10 `audio-engine` + 3 `sim-purity`), p2 14/14, e2e identiques et verts, `eslint .` sans erreur. Contrôle de la Coordination : `npm run lint` vert, `npm run test:unit` 85/85, `git diff -- game/src` vide.

## Fichiers
- Créés : `game/eslint.config.js`, `game/.editorconfig`, `game/tests/unit/sim-purity.test.js`, `game/tests/unit/audio-engine.test.js`.
- Modifiés : `game/package.json` (script `lint`, `all` = `npm ci && npm run lint && npm run build && npm test`, `eslint` `10.14.0` exact), `game/package-lock.json`, `game/tests/e2e/p2.cjs` et `render.cjs` (seuil unique), `game/README.md`, `docs/tech/NORMES_CODE.md` (§5 interdits et limites), `docs/tech/BUDGETS.md` (§2.4, §6), `docs/tech/PERF_P2.md` (nom `dist/estran-p2.html`), `docs/tech/ARCHITECTURE.md` l.35 (1,5 Mio).
- **Aucune modification de `game/src/`** ; `engine.js` testable sans injection.

## ESLint 10.14.0
- 10.15.0 (13 novembre) écartée : moins de deux semaines. Aucun plugin, globals listés à la main par dossier (navigateur dans `src/`, ES seul dans `src/sim/` et `src/data/`, Node dans `scripts/` et `tests/`, Node + navigateur dans les `.cjs`).
- Règles de vraies erreurs seulement (`no-undef`, `no-unreachable`, `no-dupe-keys`, `no-redeclare`, `no-const-assign`, `use-isnan`, `valid-typeof`…), plus une règle locale `local/imports-resolve` (import relatif vers un fichier existant, noms réellement exportés). Aucune règle de style.
- Les premières erreurs n'étaient que des globals manquants dans la config (`URLSearchParams`, `addEventListener`, `DOMException`, `__ESTRAN_BUILD__`).
- Détection vérifiée sur du code fautif : import inexistant, nom non exporté, clé dupliquée, variable non définie, code inatteignable, `document` dans `src/sim/`.

## Tests ajoutés
- `sim-purity` : interdits `Math.random`, `Date.now`, `new Date`, `performance.now`, `setTimeout`, `setInterval`, `requestAnimationFrame`, `document`, `window`, `navigator`, import de `three` ; message `fichier:ligne` ; commentaires ignorés ; le détecteur est lui-même testé. Limites documentées : chaînes non ignorées, regex contenant `//`, accès indirects non détectés.
- `audio-engine` (10 tests, contexte audio factice) : `priorityOf`, vol de la plus ancienne voix de priorité la plus basse (rampe 30 ms), refus d'une voix non critique quand le plafond est plein de voix de priorité égale ou supérieure, voix critique jamais refusée (plafond plein de LOW, de HIGH ou de CRITICAL), libération unique par voix. Sensibilité vérifiée par mutation hors dépôt (1 et 5 échecs). Solde la réserve de T-038.

## Seuil de poids unique : 1,5 Mio
Même valeur dans `p2.cjs`, `render.cjs`, `BUDGETS.md`, `PERF_P2.md`, `ARCHITECTURE.md`, `README`. Fichier actuel 655 Kio (marge ×2,3).

## Non-régression
1. `dist/estran-p2.html` identique à l'octet (sha256 `794e69a0…db9a5`, 671 073 octets).
2. Empreinte de simulation (5 automates × 4 graines, état final + télémétrie) identique avant et après.
3. Sorties normalisées de `npm run all` : p2 et unitaires existants identiques, parités e2e vertes ; seules différences : nouveaux tests, libellés du seuil, mesures dépendant de l'horloge en rendu logiciel.

## À signaler
- `npm audit` : 2 vulnérabilités « moderate » en devDependencies (`minimatch` via ESLint, déni de service par globs), sans effet sur le jeu livré ; corrigées par ESLint 10.15.0, à adopter à partir du 27 novembre.
- Le test audio recopie `MAX_VOICES = 28` (constante privée) ; un changement de valeur le ferait échouer.
- Non couvert : rendu sonore réel (déjà dans `audio.cjs`) ; `no-unused-vars`, `eqeqeq`, `prefer-const` non activés ; `export *` non contrôlé par la règle d'imports ; rien exécuté sous Windows.
