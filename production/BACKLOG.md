# Backlog de production

> Tenu par `producer`. Statuts : À FAIRE · EN COURS · EN REVUE BOSS · VALIDÉ · VALIDÉ AVEC RÉSERVES · À CORRIGER · BLOQUÉ.
> Seule la `boss` peut poser `VALIDÉ` ou `À CORRIGER`.

## Vue d'ensemble : Sprint 0 (Jalon M0 Concept, puis début de M1)

| ID | Tâche | Assigné à | Dépend de | Statut |
|---|---|---|---|---|
| T-001 | Trois concepts de jeu et pitch | game-director | aucune | À FAIRE |
| T-002 | Étude de marché et positionnement | marketing-publishing | aucune | À FAIRE |
| T-003 | Choix techniques, architecture et budgets | technical-director | aucune | À FAIRE |
| T-004 | Choix du concept (Go / No-Go) | boss | T-001, T-002, T-003, T-015 | À FAIRE |
| T-005 | Piliers et pitch final | game-director | T-004 | À FAIRE |
| T-006 | GDD v1 | game-designer | T-005 | À FAIRE |
| T-007 | Bible artistique | art-director | T-005 | À FAIRE |
| T-008 | Bible narrative | narrative-designer | T-005 | À FAIRE |
| T-009 | Direction audio | audio-director | T-005 | À FAIRE |
| T-010 | Roadmap et plan de production | producer | T-006, T-007 | À FAIRE |
| T-011 | Squelette du projet UE5 et pipeline CI | build-engineer | T-003 | À FAIRE |
| T-012 | Plan de portage et de certification | platform-engineer | T-003 | À FAIRE |
| T-013 | Stratégie de test et de qualité | qa-lead | T-003, T-006 | À FAIRE |
| T-014 | Principes UX/UI et accessibilité | ui-ux-designer | T-006 | À FAIRE |
| T-015 | Chiffrage des 3 concepts et pistes de financement | business-affairs | T-001, T-002, T-003 | À FAIRE |
| T-016 | Moodboards et key art du concept retenu | concept-artist | T-005 | À FAIRE |
| T-017 | Plan de localisation | localization-manager | T-002, T-008 | À FAIRE |
| T-018 | Services en ligne et télémétrie | online-engineer | T-003, T-005 | À FAIRE |

---

### T-001 : Trois concepts de jeu et pitch
- **Assigné à** : `game-director` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : À FAIRE
- **Livrables** : `docs/vision/CONCEPTS.md`
- **Critères d'acceptation** :
  - [ ] 3 concepts nettement différents (genre, univers, boucle de gameplay, USP)
  - [ ] Chaque concept tire parti du rendu photoréaliste (Lumen, Nanite, MetaHuman)
  - [ ] Pour chacun : public cible, 3 jeux comparables, taille d'équipe et durée estimées, risques
  - [ ] Une recommandation argumentée

### T-002 : Étude de marché et positionnement
- **Assigné à** : `marketing-publishing` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : À FAIRE
- **Livrables** : `docs/business/ETUDE_MARCHE.md`
- **Critères d'acceptation** :
  - [ ] Tendances 2025-2026 sur PC, PS5 et Xbox (genres porteurs, saturation)
  - [ ] Fourchettes de prix et modèle économique recommandé (premium, deluxe, DLC)
  - [ ] Analyse de 5 concurrents ou plus (ventes estimées, notes, points forts et faibles)
  - [ ] Sources citées pour chaque chiffre ; les estimations sont signalées comme telles

### T-003 : Choix techniques, architecture et budgets
- **Assigné à** : `technical-director` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : À FAIRE
- **Livrables** : `docs/tech/ARCHITECTURE.md`, `docs/tech/BUDGETS.md`, `docs/tech/NORMES_CODE.md`
- **Critères d'acceptation** :
  - [ ] Choix du moteur justifié (UE5 par défaut) et de sa version
  - [ ] Découpage en modules C++, gestion de la source (Git LFS ou Perforce) justifiée
  - [ ] Budgets par plateforme : temps de frame CPU/GPU, mémoire, streaming, taille d'installation
  - [ ] Liste des risques techniques (stutter de shaders, mémoire Series S...) avec mitigations

### T-004 : Choix du concept (Go / No-Go)
- **Assigné à** : `boss` · **Dépend de** : T-001, T-002, T-003, T-015 · **Jalon** : M0 · **Statut** : À FAIRE
- **Livrables** : `production/validations/T-004.md`
- **Critères d'acceptation** :
  - [ ] Un concept retenu, avec sa justification (marché, faisabilité technique, budget, vision)
  - [ ] Périmètre cible fixé (durée de jeu, taille du monde, solo ou multijoueur)
  - [ ] **Proposition présentée à l'humain propriétaire du projet pour accord final**

### T-005 : Piliers et pitch final
- **Assigné à** : `game-director` · **Dépend de** : T-004 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/vision/PITCH.md`, `docs/vision/PILIERS.md`
- **Critères d'acceptation** :
  - [ ] Pitch en une phrase, en un paragraphe et en une page
  - [ ] 3 à 5 piliers de design avec des exemples de « on fait / on ne fait pas »
  - [ ] Titre provisoire et vérification sommaire d'antériorité du nom

### T-006 : GDD v1
- **Assigné à** : `game-designer` · **Revue de pôle** : game-director · **Dépend de** : T-005 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/design/GDD.md`, `docs/design/data/*.csv`
- **Critères d'acceptation** :
  - [ ] Boucles de gameplay (30 s / 5 min / 1 h), contrôles manette et clavier/souris
  - [ ] Systèmes principaux spécifiés (entrées, sorties, règles, cas limites)
  - [ ] Progression et économie chiffrées dans des tableaux CSV
  - [ ] Périmètre du Vertical Slice défini

### T-007 : Bible artistique
- **Assigné à** : `art-director` · **Dépend de** : T-005 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/art/BIBLE_ARTISTIQUE.md`, `docs/art/NOMMAGE_ASSETS.md`
- **Critères d'acceptation** :
  - [ ] Direction visuelle, palettes, ambiances lumineuses, références
  - [ ] Standards de photoréalisme : PBR calibré, texel density, échelle, Nanite ou LOD
  - [ ] Budgets d'assets alignés sur `docs/tech/BUDGETS.md`
  - [ ] Convention de nommage et arborescence de `game/Content/`

### T-008 : Bible narrative
- **Assigné à** : `narrative-designer` · **Dépend de** : T-005 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/narrative/BIBLE_NARRATIVE.md`
- **Critères d'acceptation** :
  - [ ] Univers, thèmes, structure en actes, personnages principaux
  - [ ] Ton cohérent avec les piliers ; classification d'âge visée (PEGI) anticipée
  - [ ] Format des textes prêt pour la localisation (tables de chaînes)

### T-009 : Direction audio
- **Assigné à** : `audio-director` · **Dépend de** : T-005 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/audio/DIRECTION_AUDIO.md`
- **Critères d'acceptation** :
  - [ ] Identité sonore et musicale, références
  - [ ] Choix du middleware (MetaSounds ou Wwise) justifié, coût de licence inclus
  - [ ] Budgets audio (voix simultanées, mémoire) et plan de doublage et de localisation

### T-010 : Roadmap et plan de production
- **Assigné à** : `producer` · **Dépend de** : T-006, T-007 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `production/ROADMAP.md`, `production/RISQUES.md`, mise à jour de ce backlog
- **Critères d'acceptation** :
  - [ ] Jalons M1 à M6 datés avec leurs contenus
  - [ ] Backlog du jalon M1 (Vertical Slice) découpé en tâches avec critères d'acceptation
  - [ ] Registre des risques (probabilité, impact, mitigation, responsable)

### T-011 : Squelette du projet UE5 et pipeline CI
- **Assigné à** : `build-engineer` · **Revue de pôle** : technical-director · **Dépend de** : T-003 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `game/` (projet UE5 avec ses modules), `.gitattributes`, `.gitignore`, `ci/`, `docs/tech/BUILD.md`
- **Critères d'acceptation** :
  - [ ] Structure de projet conforme à `ARCHITECTURE.md`
  - [ ] Git LFS configuré pour les binaires (uasset, umap, textures, audio)
  - [ ] Pipeline CI documenté : compilation, tests d'automatisation, packaging Win64
  - [ ] Procédure reproductible pour un poste développeur

### T-012 : Plan de portage et de certification
- **Assigné à** : `platform-engineer` · **Dépend de** : T-003 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/tech/PLATEFORMES.md`
- **Critères d'acceptation** :
  - [ ] Démarches pour devenir développeur PlayStation, Xbox (ID@Xbox) et Steamworks, avec les actions humaines requises
  - [ ] Couche d'abstraction plateforme prévue dans l'architecture
  - [ ] Checklist de pré-certification (TRC / XR) sans contenu sous NDA
  - [ ] Plan Steam Deck Verified

### T-013 : Stratégie de test et de qualité
- **Assigné à** : `qa-lead` · **Dépend de** : T-003, T-006 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/qa/STRATEGIE_TEST.md`, `production/BUGS.md`
- **Critères d'acceptation** :
  - [ ] Types de tests (unitaires, automatisation UE, Gauntlet, perf, régression, playtests)
  - [ ] Classification des bugs (sévérité et priorité) et processus de triage
  - [ ] Critères de sortie de chaque jalon (Alpha, Beta, Gold)

### T-014 : Principes UX/UI et accessibilité
- **Assigné à** : `ui-ux-designer` · **Dépend de** : T-006 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/ux/UX_UI.md`
- **Critères d'acceptation** :
  - [ ] Arborescence des menus, principes du HUD, lisibilité sur TV à 3 m et sur Steam Deck
  - [ ] Glyphes de boutons par plateforme et remappage des contrôles
  - [ ] Plan d'accessibilité (sous-titres, daltonisme, difficulté, aides motrices) inspiré des Xbox Accessibility Guidelines

### T-015 : Chiffrage des 3 concepts et pistes de financement
- **Assigné à** : `business-affairs` · **Dépend de** : T-001, T-002, T-003 · **Jalon** : M0 · **Statut** : À FAIRE
- **Livrables** : `docs/business/BUDGET.md`, `docs/business/FINANCEMENT.md`
- **Critères d'acceptation** :
  - [ ] Fourchette de budget et durée de production pour chacun des 3 concepts, avec les postes de coût détaillés
  - [ ] Scénarios de ventes et point mort par concept, à partir de l'étude de marché
  - [ ] Pistes de financement avec critères d'éligibilité, sources officielles et dates de consultation
  - [ ] Mention explicite : brouillon à faire valider par un expert-comptable

### T-016 : Moodboards et key art du concept retenu
- **Assigné à** : `concept-artist` · **Revue de pôle** : art-director · **Dépend de** : T-005 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/art/concepts/MOODBOARD_univers.md`, `docs/art/concepts/KEY_ART.md`
- **Critères d'acceptation** :
  - [ ] 3 pistes d'ambiance visuelle avec des références sourcées et commentées
  - [ ] Color keys pour au moins 3 lieux ou moments clés du jeu
  - [ ] Brief détaillé du key art (composition, lumière, personnage, logo), utilisable pour la capsule Steam
  - [ ] Licence et origine de chaque image consignées

### T-017 : Plan de localisation
- **Assigné à** : `localization-manager` · **Dépend de** : T-002, T-008 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/loc/PLAN_LOCALISATION.md`, `docs/loc/PIPELINE.md`
- **Critères d'acceptation** :
  - [ ] Langues cibles et niveau par langue (texte, sous-titres, doublage), justifiés par le marché
  - [ ] Pipeline String Tables / fichiers PO décrit, avec les règles d'ID et de contexte
  - [ ] Estimation du volume (mots, lignes de voix) et du coût, signalée comme estimation
  - [ ] Plan de pseudo-localisation et de LQA

### T-018 : Services en ligne et télémétrie
- **Assigné à** : `online-engineer` · **Revue de pôle** : technical-director · **Dépend de** : T-003, T-005 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/tech/ONLINE.md`, `docs/tech/TELEMETRIE.md`
- **Critères d'acceptation** :
  - [ ] Liste de ce qui est en ligne et hors ligne, et comportement du jeu sans réseau
  - [ ] Services choisis (EOS, Steamworks, services des plateformes) avec leurs coûts
  - [ ] Plan de télémétrie : événements, consentement, minimisation et conservation des données (RGPD)
  - [ ] Stratégie de patchs et de mises à jour
