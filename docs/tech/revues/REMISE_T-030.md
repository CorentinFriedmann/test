# Rapport de remise : T-030 (résumé archivé par la Coordination)

> Rendu par `graphics-programmer` le 2026-11-24. Archivé pour la revue de pôle et la Boss.

- **Tests** : `npm run all` vert.
  - 60 tests unitaires (4 nouveaux pour le rendu) ;
  - 37 contrôles e2e (`run.cjs`) ;
  - 25 contrôles de rendu (`render.cjs`, nouveau) ;
  - aucune erreur de console.
  - Bundle de 623 Kio. Aucune dépendance ni aucun asset ajoutés.
- **Livré** :
  - 3 moments d'éclairage (`?moment=night|dawn|day`) ;
  - eau en shader maison : le niveau suit la simulation, écume au rivage tirée des hauteurs du terrain, reflets ;
  - sable procédural ;
  - 48 rochers en un seul appel de dessin ;
  - brouillard, grain, vignette ;
  - faisceau lu depuis `lighthouse_beam_period` ;
  - lampe et faisceau jamais retirés de la scène, pour éviter les recompilations ;
  - **Laisse** en forme sombre à capuche avec lanières et eau troublée, visible seulement si `threat.lit > 0` ;
  - 3 niveaux de qualité (`?q=low|medium|high`) ;
  - écran de mesure (F2 ou `?perf=1`) avec bouton « copier le rapport de performance » ;
  - captures des tests dans `captures/.tmp/` (ignoré par git) et `npm run captures` pour mettre à jour les captures versionnées.
- **Parité** : journaux de télémétrie identiques octet pour octet (88 364 octets) sur 4 parties `prudent` : low avec `debug`, medium, high de jour, et high avec changement de niveau en cours de partie. La Laisse change 2,0 à 2,75 % de l'image selon le niveau, et 0 pixel quand elle n'est pas éclairée.
- **Mesures (SwiftShader, non représentatives d'un vrai GPU)** :

  | Niveau | Cadence moyenne | 95e centile |
  |---|---|---|
  | high | 5,4 i/s | 200 ms |
  | medium | 8,6 i/s | 133 ms |
  | low | 22,7 i/s | 50 ms |

  - 37 appels de dessin et 54 000 à 62 000 triangles.
  - Budgets GPU inconnus : seule la porte P1 (F2 sur le PC du propriétaire) les confirmera.
  - Leviers en cas de saccades : `waterOctaves`, `pixelRatioMax`, anticrénelage.
- **Réserves** :
  - rendu non jugé sur un vrai GPU ;
  - aube et jour à régler (T-007) ;
  - de près, la Laisse fait un peu « cône à capuche » ;
  - l'écran de mesure donne des intervalles entre frames, pas des temps GPU ;
  - `npm run all` dure 10 à 15 minutes dans le cloud ;
  - l'anticrénelage ne change qu'au chargement.
- Rapport complet de performance : `docs/tech/PERF_P2.md`. Captures : `game/captures/estran-{nuit,aube,jour}-{high,medium,low}.jpg`, `estran-laisse*.png`.
