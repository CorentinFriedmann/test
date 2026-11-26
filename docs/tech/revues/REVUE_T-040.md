# Revue TD : T-040 « Garde-fous du code »

Relecture par `build-engineer` (revue de pôle, mode économe), 2026-11-26. Ne valide pas la tâche (rôle de la Boss).

## Avis : Revue TD : OK (avec 3 remarques non bloquantes)

## Vérifications
1. `git diff -- game/src` vide : OK. `engine.js` est testé tel quel.
2. ESLint : OK. Version exacte `10.14.0` (package.json et lock), aucun plugin, uniquement des règles d'erreurs réelles, aucune règle de style. Globals par dossier cohérents : `src/sim/` et `src/data/` n'ont que les natifs ES (ni navigateur ni Node), `src/` le navigateur, tests et scripts Node, `.cjs` Node + navigateur. `reportUnusedDisableDirectives` en erreur : bien. La règle `local/imports-resolve` est lisible, en lecture seule (`fs.existsSync`, `readFileSync`), sans état partagé ni effet de bord. Limite connue : analyse par regex des exports, `export *` ignoré (dans ce cas la règle se tait, donc pas de faux positif).
3. `sim-purity.test.js` : OK. Les 11 interdits de NORMES §5 sont couverts. Le détecteur est lui-même testé (cas positifs, commentaires, noms de propriété, numéros de ligne). Les lookbehinds évitent les faux positifs sur `x.window` ; le message donne `fichier:ligne`. Limites déjà documentées (chaînes non neutralisées, accès indirects) ; acceptables pour un garde-fou d'accidents. Vert sur le code actuel.
4. `audio-engine.test.js` : OK. Contexte factice, `currentTime` fixe, aucune horloge, pas de `setTimeout`, aucun `Math.random` (`engine.js` n'en contient pas, seed passée en config) ; les fins de voix sont déclenchées à la main (`endAll`). La garantie T-038 est testée dans trois configurations (plafond plein de LOW, de HIGH, de CRITICAL, 5 itérations), avec `droppedCritical === 0` et vérification de la voix volée par la rampe 30 ms ; plus le cas des remous proches contre lointains.
5. Exécutions réelles dans `game/` : `npm run lint` sans erreur ; `npm run test:unit` 85/85 ; `npm run test:p2` 14/14. `npm run all` non relancé (non justifié).

## Remarques non bloquantes
1. `MAX_VOICES = 28` est recopié dans le test ; la garde `stats.active === MAX_VOICES` fait échouer le test si la valeur change, ce qui est le comportement voulu, mais un `export` de la constante depuis `engine.js` serait plus propre (modification de `src/`, hors T-040 : à proposer plus tard).
2. `npm audit` : 2 vulnérabilités moderate dans `minimatch` (devDependency ESLint, sans effet sur le jeu livré). Passer à ESLint 10.15.0 à partir du 27 novembre, en respectant la règle des deux semaines de NORMES.
3. `sim-purity` ne couvre pas `globalThis`, `Intl.DateTimeFormat`, ni `crypto.getRandomValues` ; à ajouter à la liste de NORMES §5 si l'on veut resserrer. `no-unused-vars` non activé : choix cohérent avec « vraies erreurs seulement ».

## Corrections exigées
Aucune.
