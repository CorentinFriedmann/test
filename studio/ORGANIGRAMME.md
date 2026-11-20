# Organigramme du studio

```
                              ┌──────────────┐
                              │   👑 BOSS    │  valide chaque tâche
                              └──────┬───────┘
                 ┌───────────────────┼───────────────────┐
          ┌──────┴──────┐     ┌──────┴───────┐    ┌──────┴────────────┐
          │  producer   │     │game-director │    │marketing-publishing│
          │ (planning)  │     │  (vision)    │    │  (vente, boutiques)│
          └─────────────┘     └──────┬───────┘    └────────────────────┘
      ┌──────────────┬──────────────┼──────────────┬──────────────┐
 ┌────┴─────┐  ┌─────┴──────┐ ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴────┐
 │ DESIGN   │  │ PROGRAMMATION│ │   ART    │  │  AUDIO    │  │   QA     │
 └────┬─────┘  └─────┬──────┘ └─────┬─────┘  └─────┬─────┘  └─────┬────┘
 game-designer  technical-director  art-director    audio-director  qa-lead
 level-designer gameplay-programmer concept-artist                  localization-
 narrative-     graphics-programmer environment-artist                manager
   designer     platform-engineer   character-artist
 ui-ux-designer online-engineer     technical-artist     BUSINESS : marketing-publishing,
                build-engineer      animator                        business-affairs
```

## Équipes et missions

| Pôle | Agent | Mission |
|---|---|---|
| **Direction** | `boss` | Directrice exécutive : valide ou refuse chaque livrable, arbitre la stratégie, le périmètre et les conflits |
| | `producer` | Chef de projet : backlog, découpage des tâches, roadmap, risques, maîtrise du périmètre |
| | `game-director` | Vision créative : pitch, piliers, cohérence de l'expérience |
| **Design** | `game-designer` | GDD, boucles de gameplay, systèmes, progression, équilibrage, économie |
| | `level-designer` | Niveaux, blockouts, rythme, métriques, monde ouvert ou linéaire |
| | `narrative-designer` | Histoire, personnages, dialogues, quêtes, localisation |
| | `ui-ux-designer` | Menus, HUD, ergonomie manette et clavier/souris, accessibilité |
| **Programmation** | `technical-director` | Architecture C++/UE5, normes de code, budgets de performance, revues de code |
| | `gameplay-programmer` | Mécaniques, IA, caméra, contrôles, sauvegardes, tests automatisés |
| | `graphics-programmer` | Rendu photoréaliste : Lumen, Nanite, ombres, upscaling, profils de scalabilité |
| | `platform-engineer` | Portages PS5 / Xbox / PC, certification (TRC/XR), trophées, succès |
| | `online-engineer` | Télémétrie (RGPD), crashs, sauvegardes cloud, EOS, multijoueur éventuel, patchs et live ops |
| | `build-engineer` | CI/CD, builds nocturnes, packaging, crash reporting, versioning |
| **Art** | `art-director` | Bible artistique, standards de photoréalisme, revue de l'art |
| | `concept-artist` | Moodboards, recherches visuelles, color keys, key art |
| | `environment-artist` | Décors, Megascans/Fab, PCG, végétation, mise en lumière |
| | `character-artist` | Personnages (MetaHuman), vêtements, cheveux, LODs |
| | `technical-artist` | Shaders et matériaux, VFX Niagara, pipeline DCC vers UE, optimisation des assets |
| | `animator` | Motion matching, Control Rig, mocap, animation faciale, cinématiques |
| **Audio** | `audio-director` | Sound design, musique, MetaSounds, mixage, audio spatial, doublage |
| **QA** | `qa-lead` | Plan de test, bugs, tests automatisés, tests de perf, pré-certification, playtests |
| | `localization-manager` | Langues cibles, pipeline de traduction, glossaire, culturalisation, LQA |
| **Business** | `marketing-publishing` | Marché, prix, pages des boutiques, classification PEGI/ESRB, plan de lancement |
| | `business-affairs` | Budget, prévisionnel, financement (aides, éditeurs), contrats, licences, marque, RGPD |

Les pôles, emojis et titres affichés dans l'interface graphique sont définis dans `studio/equipe.json`.
