# Rapport de remise : T-035, archivé par la Coordination

> Texte rendu par `technical-director` le 2026-11-26, résumé fidèlement par la Coordination pour la Boss.

## Fiches modifiées (`.claude/agents/`)
- **Adaptation complète (12)** : `technical-director`, `graphics-programmer`, `gameplay-programmer`, `technical-artist`, `environment-artist`, `level-designer`, `character-artist`, `animator`, `build-engineer`, `online-engineer`, `platform-engineer`, `qa-lead`. Pile web (JavaScript ES2022 + JSDoc, three.js, WebGL2, esbuild, `node --test`, Playwright, Web Audio), assets procéduraux ou CC0 légers, glTF, pas de logiciel graphique, qualité jugée sur captures ; Electron pour Steam, itch.io pour les démos ; consoles « hors périmètre (portage éventuel) ».
- **Relecture légère (8)** : `art-director`, `game-designer`, `narrative-designer`, `localization-manager`, `business-affairs`, `boss` (objectif l.9 et standards « Réaliste » / « Multiplateforme » reformulés ; grille, règles de verdict et « Revue allégée » intactes), `audio-director` (Web Audio au lieu de MetaSounds/Wwise), `ui-ux-designer` (HTML/CSS au lieu d'UMG/CommonUI).
- **Hors liste, pour des vérifications propres** : `concept-artist`, `game-director` (photoréalisme, ligne DECISIONS), `marketing-publishing` (boutiques consoles retirées de la description).
- `studio/equipe.json` : 4 titres mis à jour (gameplay-programmer « Programmeur gameplay JavaScript », graphics-programmer « Ingénieur rendu web stylisé », platform-engineer « Ingénieur plateformes · PC / Steam / Electron », character-artist « Artiste personnages · low-poly stylisé ») ; JSON valide, `mode` = `econome` intact.
- `producer.md` non modifié.

## Vérifications
1. Recherche `unreal|lumen|nanite|metahuman|blueprint|gameplay ability|PS5|playstation|xbox|console` : seules restent des mentions « consoles hors périmètre (portage éventuel) » et `producer.md`. Contrôle de la Coordination : aucune occurrence d'Unreal, Lumen, Nanite, MetaHuman ou Blueprint hors `producer.md`.
2. `grep -L "DECISIONS.md"` : seul `producer.md`.
3. `grep "^model:"` : tous `sonnet`. Contrôle de la Coordination : `git diff` ne montre aucune ligne `name:`, `model:` ou `tools:` modifiée. `npm test` de `studio-ui` : vert.

## Pour la Coordination
`producer.md` l.15 : exemple « tient en 16,6 ms sur PS5 » à remplacer par un exemple web ; pas de renvoi à `DECISIONS.md`.

## Remarques
Modifications de texte uniquement, rien construit ni exécuté, `game/` non touché. Les fiches citent des documents futurs (`docs/tech/RENDU.md`, etc.) qui n'existent que si leurs tâches les produisent.
