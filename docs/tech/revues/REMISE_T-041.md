# Rapport de remise : T-041, archivé par la Coordination

> Texte rendu par `qa-lead` le 2026-11-26, résumé fidèlement par la Coordination.

## Fichiers
- Nouveaux : `game/tests/p2/timing.mjs` (simulation sous Node, 70 lignes), `game/tests/p2/timing-load.cjs` (chargement en Chromium headless, 46 lignes).
- Modifiés : `game/package.json` (script `p2:timing`, hors de `npm run all`), `game/README.md`, `docs/tech/BUDGETS.md` (§2.2, §2.4, §2.5, liste des mesures à faire), `docs/tech/PERF_P2.md` (§3).
- `game/src/` non modifié. `npm run lint` et `npm run test:unit` (85/85) verts. Contrôle de la Coordination : `git diff -- game/src` vide, lint vert.

## Commande
`npm run p2:timing` : `gen-data`, `node tests/p2/timing.mjs` (argument `verify` pour les graines 201-220), `build`, `node tests/p2/timing-load.cjs 5` (essais, `q=low|medium|high`).

## Mesures (2026-11-26, cloud 4 cœurs Xeon 2,1 GHz, Node 22.23.5, Chromium 157 headless SwiftShader)
Simulation, un appel de `sim.step()` (chronométré côté test avec `process.hrtime.bigint()`, échauffement de 3 parties par automate écarté, Laisse active dans 82 % des pas), 100 parties (graines 101-120 × 5 automates), 844 443 pas : moyenne 0,0009 ms, p95 0,0020 ms, p99 0,0044 ms, max 2,65 ms (4 pas au-dessus de 1 ms). `createSim` : 20,1 ms en moyenne (max 25,3 ms).

Chargement à froid, 5 essais, navigateur neuf à chaque essai, `file://` avec `?test=1` :

| Niveau | Scripts et scène prêts (médiane) | Première peinture | 2e image |
|---|---|---|---|
| haut | 1,11 s (1,05 à 1,13) | 0,76 s | 1,23 s |
| moyen | 0,91 s | 0,66 s | 0,99 s |
| bas | 0,71 à 0,76 s | 0,62 à 0,63 s | 0,74 à 0,79 s |

## Budgets
Pas ≤ 1 ms : tenu (moyenne 0,1 % du budget ; pointes isolées jusqu'à 2,65 ms, 8 % de la période de 33,3 ms). Chargement ≤ 10 s : tenu (~1,1 s). Démarrage à froid ≤ 3 s : tenu (~0,75 s à la première peinture).

## Limites
Génération du terrain et texture des hauteurs non séparables dans le navigateur sans toucher `src/` (total mesuré) ; simulation sous Node sans audio ni dessin ; pointes attribuées sans preuve au ramasse-miettes ; rendu logiciel seulement indicatif, fichier local sans réseau ; chiffres variables d'un lancement à l'autre (d'où hors CI).

## Reste à mesurer sur un vrai PC
Chargement et première image sur vrai GPU (Steam Deck, portable sans GPU dédié), coût du pas avec l'audio (F2), GPU et mémoire GPU, coût CPU de l'audio sur machine réelle.

## Remise complémentaire (après la revue TD)
Les 3 corrections de `REVUE_T-041.md` sont faites : max du pas présenté comme variable (2,65 ms à la mesure, 7,13 ms à la relance du TD) dans BUDGETS §2.5 et PERF_P2 §3 ; chargement à retenir = 2e image (≈ 1,2 s, niveau haut), « scène prête » = « au plus ≈ 1,1 s » (borne supérieure), « première peinture » = première peinture quelconque de la page (BUDGETS §2.4, PERF_P2 §3, en-tête du tableau de `timing-load.cjs`) ; `createSim` mesuré à chaud sous Node, niveaux bas et moyen par `node tests/p2/timing-load.cjs 5 q=low|medium` (BUDGETS, PERF_P2, `game/README.md`). `npm run lint` vert, `game/src/` non touché.
