# Rapport de remise : T-034, archivé par la Coordination

> Texte rendu par `technical-director` le 2026-11-26, résumé fidèlement par la Coordination pour la Boss.

## Livré
- `docs/tech/ARCHITECTURE.md` v2.0 (163 lignes), `docs/tech/BUDGETS.md` v2.0 (132 lignes), `docs/tech/NORMES_CODE.md` v2.0 (130 lignes), pile web.
- `docs/tech/archive/{ARCHITECTURE,BUDGETS,NORMES_CODE}.md` : copies de la version Unreal Engine 5, chacune avec en tête « Archivé le 2026-11-26 : version Unreal Engine 5, conservée pour un portage éventuel ».
- `docs/tech/revues/TRANSMISSIONS_T-034.md` : passages à mettre à jour, par destinataire (`business-affairs`, `game-director`, Coordination pour `CLAUDE.md` et `studio/ORGANIGRAMME.md`), avec fichier et ligne.
- Rien n'est modifié dans `game/`. Tâche documentaire : aucun build ni test lancé.

## Critères
1. Réécriture selon l'ADR §7.1 : modules réels et prévus (marqués « réel » / « prévu »), pas fixe de 30 Hz, données CSV, sauvegarde et abstraction navigateur / Electron décrites comme prévues. Budgets de l'ADR §4 sans Series S ni PS5, chaque ligne avec un statut (objectif, compté ou mesuré dans le cloud, confirmé sur GPU réel ; aucune ligne confirmée sur GPU réel à ce jour). Normes : JavaScript, pas d'allocation dans la boucle, libération des ressources GPU et audio, interdits de `sim/`, tests.
2. Leçons de T-029 à T-032 reportées : structure réelle de `game/`, 37 appels de dessin, 62 000 triangles, heap 11 à 13 Mo, 655 Kio, cadences SwiftShader non valables pour un GPU, BUG-004, parité octet pour octet, `try/catch` par écouteur, test de vol de voix seulement stochastique, état de la Laisse non sérialisable.
3. Recherche `grep -n -i "unreal\|lumen\|nanite\|metahuman\|blueprint"` sur les trois documents : 4 occurrences, toutes dans des sections intitulées « Archive » (ARCHITECTURE l.161 et 163, BUDGETS l.130, NORMES_CODE l.130).
4. Transmissions écrites : `TRANSMISSIONS_T-034.md` (numéros de ligne à revérifier avant édition).
5. Réserves de T-031 : déjà couvertes par `docs/qa/QUESTIONNAIRE_P2.md` (questions 6, 7, 8).

## Décisions du TD (à valider par la Boss)
- **Langage** : on reste en JavaScript, avec JSDoc et `// @ts-check` introduits progressivement (d'abord `sim/` et `data/`). TypeScript strict de l'ADR §1 non adopté pour l'instant (5 100 lignes testées, risque sur la parité, abonnement limité) ; à rouvrir vers 15 000 lignes.
- **Outils** : ESLint adopté mais pas encore installé ; Prettier écarté (reformatage sans gain de fiabilité) ; `.editorconfig` proposé.
- **Sauvegarde** (prévue) : instantané versionné, `localStorage` pour les réglages, IndexedDB pour les parties, fichier JSON sous Electron ; prérequis : état de la Laisse sérialisable.
- **Plateforme** (prévue) : itch.io HTML5 pour les démos, Electron pour Steam, Tauri écarté, futur module `platform/`.
- **Écart signalé** : `tests/e2e/p2.cjs` tolère 3 Mo, `PERF_P2.md` parle de 1,5 Mo.
- **Budgets nouveaux non mesurés** : simulation ≤ 1 ms par pas, audio ≤ 2 ms par frame.

## Non vérifié
Budgets GPU (PC, Steam Deck) inconnus, seul signal « c'est fluide » du propriétaire ; chargement et simulation non chronométrés à part ; Electron, Steam Deck et navigateurs autres que Chromium jamais testés.

## Propositions de tâches futures
1. Test des interdits de `sim/` (`Math.random`, `Date.now`, `document`…), priorité haute.
2. Test unitaire déterministe de `engine.js` (vol de voix, `priorityOf`), solde la réserve de T-038, priorité haute.
3. ESLint (version figée, `npm run lint` dans `npm run all`), priorité moyenne.
4. TypeScript en devDependency pour `tsc --noEmit --checkJs`, priorité moyenne.
5. `.editorconfig`, priorité basse.
6. Un seul seuil de poids en CI, priorité basse.
7. Chronométrage cloud de la simulation et du chargement.
8. Découpage de `createView`, `threat.update()`, `sim.step()` ; état de la Laisse sérialisable avant toute sauvegarde.
9. Nouvelle demande de rapport F2 chiffré au propriétaire.
