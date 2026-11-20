# Processus de production et de validation

## Cycle de vie d'une tâche

```
À FAIRE ──► EN COURS ──► EN REVUE BOSS ──► VALIDÉ ✅
                ▲               │
                │               ▼
                └──────── À CORRIGER ❌  (retours de la Boss)
```

| Statut | Qui le pose | Signification |
|---|---|---|
| `À FAIRE` | producer | Tâche prête, critères d'acceptation définis |
| `EN COURS` | Coordination | Tâche confiée à un agent |
| `EN REVUE BOSS` | Coordination | Livrable remis, en attente du verdict |
| `VALIDÉ` / `VALIDÉ AVEC RÉSERVES` | **boss uniquement** | Tâche terminée (les réserves deviennent de nouvelles tâches) |
| `À CORRIGER` | **boss uniquement** | Refusée, retour à l'agent avec les retours numérotés |
| `BLOQUÉ` | n'importe quel agent | Dépendance ou décision humaine manquante |

## Étapes détaillées

1. **Planification** : le `producer` écrit la tâche dans `production/BACKLOG.md` (modèle :
   `studio/templates/TACHE.md`) avec un responsable, des dépendances et des critères mesurables.
2. **Exécution** : la Coordination confie la tâche à l'agent responsable en lui donnant la section
   de la tâche et les documents de référence (pitch, GDD, bible artistique, architecture...).
3. **Revue de pôle (recommandée)** : pour le code, le `technical-director` relit le travail ;
   pour l'art, l'`art-director` ; pour le design, le `game-director`. Leurs remarques sont corrigées
   **avant** la Boss.
4. **Remise** : l'agent termine par un **rapport de remise** (modèle : `studio/templates/REMISE.md`).
5. **Validation** : la Coordination invoque `boss`. La Boss ouvre chaque livrable, applique sa
   grille, écrit `production/validations/T-XXX.md` (modèle : `studio/templates/VALIDATION.md`)
   et met à jour le statut dans le backlog.
6. **Itération** : si la tâche est refusée, elle retourne à l'agent avec les retours. Au bout de
   3 refus, le `producer` redécoupe la tâche ou la Boss revoit le périmètre.

## Jalons du projet

| Jalon | Contenu | Validation |
|---|---|---|
| **M0 Concept** | Pitch, piliers, étude de marché, choix techniques | Boss : Go / No-Go du concept |
| **M1 Préproduction** | GDD v1, bible artistique, architecture, pipeline de build, prototype du gameplay | Boss |
| **M2 Vertical Slice** | 10 à 15 min jouables à la qualité finale, sur PC et une console | Boss : Go production |
| **M3 Alpha** | Toutes les fonctionnalités en place, tout le contenu en version blockout | Boss |
| **M4 Beta** | Contenu complet, polish, optimisation, pré-certification | Boss |
| **M5 Gold** | Certification consoles réussie, build master | Boss |
| **M6 Lancement** | Pages des boutiques, marketing, patch day-one, suivi post-lancement | Boss |

## Budgets techniques de référence (à confirmer par le technical-director en T-003)

| Plateforme | Mode Qualité | Mode Performance | Résolution de sortie |
|---|---|---|---|
| PS5 / Xbox Series X | 30 fps (33,3 ms) | 60 fps (16,6 ms) | 4K avec upscaling |
| Xbox Series S | 30 fps | 60 fps (réglages réduits) | 1440p avec upscaling |
| PC recommandé (RTX 4070 / RX 7800 XT) | 60 fps et plus | 60 fps et plus | 1440p / 4K avec DLSS / FSR |
| PC minimum (GTX 1070 / RX 5600 / Steam Deck) | 30 fps | n/a | 1080p / 800p |
