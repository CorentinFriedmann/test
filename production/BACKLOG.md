# Backlog de production

> Tenu par `producer`. Statuts : À FAIRE · EN COURS · EN REVUE BOSS · VALIDÉ · VALIDÉ AVEC RÉSERVES · À CORRIGER · BLOQUÉ.
> Seule la `boss` peut poser `VALIDÉ` ou `À CORRIGER`.

## Vue d'ensemble : Sprint 0 (Jalon M0 Concept, puis début de M1)

| ID | Tâche | Assigné à | Dépend de | Statut |
|---|---|---|---|---|
| T-001 | Trois concepts de jeu et pitch | game-director | aucune | VALIDÉ AVEC RÉSERVES |
| T-002 | Étude de marché et positionnement | marketing-publishing | aucune | VALIDÉ AVEC RÉSERVES |
| T-003 | Choix techniques, architecture et budgets | technical-director | aucune | EN REVUE BOSS |
| T-004 | Choix du concept (Go / No-Go) | boss | T-001, T-002, T-003, T-015, T-023 | À FAIRE |
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
| T-015 | Chiffrage des 3 concepts et pistes de financement | business-affairs | T-001, T-002, T-003, T-019, T-021 | À FAIRE |
| T-016 | Moodboards et key art du concept retenu | concept-artist | T-005 | À FAIRE |
| T-017 | Plan de localisation | localization-manager | T-002, T-008, T-022 | À FAIRE |
| T-018 | Services en ligne et télémétrie | online-engineer | T-003, T-005 | À FAIRE |
| T-019 | Corrections et compléments de l'étude de marché | marketing-publishing | aucune | VALIDÉ AVEC RÉSERVES |
| T-020 | Vérification à la source des chiffres de l'étude de marché | marketing-publishing | T-019 | BLOQUÉ |
| T-021 | Données de marché par concept et par genre | marketing-publishing | T-001, T-019 | À FAIRE |
| T-022 | Données de marché par région et par langue | marketing-publishing | aucune | À CORRIGER |
| T-023 | Révision v1.1 des trois concepts | game-director | aucune | À FAIRE |
| T-024 | Registre des licences et règles d'usage de l'IA générative | business-affairs | aucune | À FAIRE |
| T-025 | Finitions de l'étude de marché v2 (scénarios, sources, étiquettes) | marketing-publishing | aucune | À FAIRE |

---

### T-001 : Trois concepts de jeu et pitch
- **Assigné à** : `game-director` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `docs/vision/CONCEPTS.md`
- **Critères d'acceptation** :
  - [x] 3 concepts nettement différents (genre, univers, boucle de gameplay, USP)
  - [x] Chaque concept tire parti du rendu photoréaliste (Lumen, Nanite, MetaHuman)
  - [x] Pour chacun : public cible, 3 jeux comparables, taille d'équipe et durée estimées, risques
  - [x] Une recommandation argumentée
- **Validation** : `production/validations/T-001.md` (cycle 1, 2026-11-20) · **Réserves** : T-023, T-024

### T-002 : Étude de marché et positionnement
- **Assigné à** : `marketing-publishing` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `docs/business/ETUDE_MARCHE.md`
- **Critères d'acceptation** :
  - [x] Tendances 2025-2026 sur PC, PS5 et Xbox (genres porteurs, saturation)
  - [x] Fourchettes de prix et modèle économique recommandé (premium, deluxe, DLC)
  - [x] Analyse de 5 concurrents ou plus (ventes estimées, notes, points forts et faibles)
  - [x] Sources citées pour chaque chiffre ; les estimations sont signalées comme telles
- **Validation** : `production/validations/T-002.md` (cycle 1, 2026-11-20) · **Réserves** : T-019, T-020, T-021, T-022

### T-003 : Choix techniques, architecture et budgets
- **Assigné à** : `technical-director` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : EN REVUE BOSS
- **Livrables** : `docs/tech/ARCHITECTURE.md`, `docs/tech/BUDGETS.md`, `docs/tech/NORMES_CODE.md`
- **Critères d'acceptation** :
  - [ ] Choix du moteur justifié (UE5 par défaut) et de sa version
  - [ ] Découpage en modules C++, gestion de la source (Git LFS ou Perforce) justifiée
  - [ ] Budgets par plateforme : temps de frame CPU/GPU, mémoire, streaming, taille d'installation
  - [ ] Liste des risques techniques (stutter de shaders, mémoire Series S...) avec mitigations

### T-004 : Choix du concept (Go / No-Go)
- **Assigné à** : `boss` · **Dépend de** : T-001, T-002, T-003, T-015, T-023 · **Jalon** : M0 · **Statut** : À FAIRE
- **Livrables** : `production/validations/T-004.md`
- **Critères d'acceptation** :
  - [ ] Un concept retenu, avec sa justification (marché, faisabilité technique, budget, vision)
  - [ ] Périmètre cible fixé (durée de jeu, taille du monde, solo ou multijoueur)
  - [ ] **Proposition présentée à l'humain propriétaire du projet pour accord final**
- **Contexte / références** : poids et critères éliminatoires de la grille marché fixés dans `production/validations/T-002.md` (décision 3). La proposition indique le niveau de confiance des données de marché (T-020 faite ou non).

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
- **Assigné à** : `business-affairs` · **Dépend de** : T-001, T-002, T-003, T-019, T-021 · **Jalon** : M0 · **Statut** : À FAIRE
- **Livrables** : `docs/business/BUDGET.md`, `docs/business/FINANCEMENT.md`
- **Critères d'acceptation** :
  - [ ] Fourchette de budget et durée de production pour chacun des 3 concepts, avec les postes de coût détaillés
  - [ ] Scénarios de ventes et point mort par concept, à partir de l'étude de marché
  - [ ] Pistes de financement avec critères d'éligibilité, sources officielles et dates de consultation
  - [ ] Mention explicite : brouillon à faire valider par un expert-comptable
- **Contexte / références** : décisions de la Boss sur T-002 (`production/validations/T-002.md`, décisions 1 et 2). Scénario de base : sortie simultanée sur PC, PS5 et Xbox Series X|S, avec la certification, les kits de développement et les tests consoles chiffrés. Les chiffres [Mémoire] et « non vérifié » de l'étude ne servent que d'hypothèses de sensibilité nommées.

### T-016 : Moodboards et key art du concept retenu
- **Assigné à** : `concept-artist` · **Revue de pôle** : art-director · **Dépend de** : T-005 · **Jalon** : M1 · **Statut** : À FAIRE
- **Livrables** : `docs/art/concepts/MOODBOARD_univers.md`, `docs/art/concepts/KEY_ART.md`
- **Critères d'acceptation** :
  - [ ] 3 pistes d'ambiance visuelle avec des références sourcées et commentées
  - [ ] Color keys pour au moins 3 lieux ou moments clés du jeu
  - [ ] Brief détaillé du key art (composition, lumière, personnage, logo), utilisable pour la capsule Steam
  - [ ] Licence et origine de chaque image consignées

### T-017 : Plan de localisation
- **Assigné à** : `localization-manager` · **Dépend de** : T-002, T-008, T-022 · **Jalon** : M1 · **Statut** : À FAIRE
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

### T-019 : Corrections et compléments de l'étude de marché
- **Assigné à** : `marketing-publishing` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `docs/business/ETUDE_MARCHE.md` (mise à jour, avec un journal des modifications)
- **Critères d'acceptation** :
  - [x] Incohérence sur les 2,4 Md$ résolue (section 1 point 3 et section 2.2) : période, périmètre et base de chaque pourcentage indiqués
  - [x] Contradiction sur la conversion des wishlists du Next Fest corrigée (section 9)
  - [x] Aucune donnée non relue à la source présentée comme vérifiée (intitulé de la section 8) ; toutes les étiquettes utilisées figurent dans la légende de la section 0
  - [x] Prix de référence exprimé dans la devise de base de Steam, avec la méthode de déclinaison régionale ; équivalence 39,99 € / 44,99 $ justifiée ou retirée
  - [x] Scénarios de la section 6.3 nommés de façon neutre, avec au moins un scénario sous 50 000 unités, un passage explicite des wishlists aux ventes de lancement puis à la longue traîne, et une recette nette estimée par unité, le tout signalé [Estimation]
  - [x] Effet des sorties day-one sur Game Pass (Hellblade II, Clair Obscur, Stalker 2, Atomfall) et de l'exclusivité Epic d'Alan Wake 2 analysé ; leçon 5.3.1 et ligne « Abonnements » de la section 6.2 revues
  - [x] Au moins 3 références photoréalistes de 2024-2025 plus proches de notre cible ajoutées au tableau 5.1 ; notes presse et prix de lancement manquants complétés ou maintenus en « non vérifié » avec la raison
  - [x] Saisonnalité présentée comme un calendrier récurrent (trois Next Fest par an, grandes soldes, fenêtres encombrées par les AAA), sans fenêtre de sortie datée avant la roadmap (T-010)
  - [x] URL et date de consultation pour chaque source (ou phrase de la section 0 corrigée) ; source nommée pour la commission Epic
- **Contexte / références** : réserves de la validation de T-002, retours 1 à 9 (`production/validations/T-002.md`). À valider avant que T-015 n'utilise les chiffres de l'étude.
- **Validation** : `production/validations/T-019.md` (cycle 1, 2026-11-20) · **Réserves** : T-025 · **Décisions applicables à T-015 et T-023** : décision 1 (fourchette de prix 39,99 à 49,99 lue en USD, prix catalogue de base Steam ; recette nette en USD, conversion en euros sur la recette seulement), décisions 2 et 3 (abonnements chiffrés comme un seuil ; aucun des deux montants de 2,4 Md$ utilisé comme entrée chiffrée avant T-020)

### T-020 : Vérification à la source des chiffres de l'étude de marché
- **Assigné à** : `marketing-publishing` · **Dépend de** : T-019 · **Jalon** : M0 · **Statut** : BLOQUÉ
- **Livrables** : `docs/business/ETUDE_MARCHE.md` (version vérifiée)
- **Critères d'acceptation** :
  - [ ] Chaque chiffre [Annoncé] ou [Analyste] relu sur sa page d'origine ou sur la source primaire (communiqué de l'éditeur, rapport financier, documentation publique de Steamworks), avec l'URL et la date de consultation
  - [ ] Chaque chiffre [Mémoire] confirmé et requalifié, ou retiré
  - [ ] Écart Alinea / Sensor Tower sur les revenus Steam expliqué (périmètre, méthode) et valeur à utiliser en T-015 justifiée
  - [ ] Commissions de Steam, Epic, PlayStation et Xbox confirmées par des documents publics ; à défaut, maintenues en [Mémoire] et signalées à `business-affairs`
  - [ ] Aucune connexion à un compte développeur et aucun abonnement payant à un outil de données sans l'accord de l'humain propriétaire ; conditions d'utilisation des sites respectées
  - [ ] Journal des modifications : chiffres confirmés, corrigés ou retirés
- **Contexte / références** : réserve de T-002 (retour 12). Tâche bloquée tant que l'humain propriétaire du projet n'a pas décidé d'autoriser l'accès en lecture aux sources (sections 0 et 12 de l'étude) ou fourni lui-même les pages et les exports. Obligatoire avant tout usage des chiffres hors du studio (dossier de financement, éditeur, investisseur).

### T-021 : Données de marché par concept et par genre
- **Assigné à** : `marketing-publishing` · **Dépend de** : T-001, T-019 · **Jalon** : M0 · **Statut** : À FAIRE
- **Livrables** : `docs/business/MARCHE_PAR_CONCEPT.md`
- **Critères d'acceptation** :
  - [ ] Pour le genre de chacun des 3 concepts de T-001 : nombre de jeux sortis sur Steam par an (2024 à 2026), ventes ou revenus estimés des titres dominants, part des nouvelles IP, avec la source et le niveau de confiance de chaque chiffre
  - [ ] Pour chaque concept : 5 jeux comparables sortis depuis 2022 (ventes estimées, notes, prix de lancement, plateformes, présence sur un abonnement)
  - [ ] Bases installées PS5 et Xbox Series (communications officielles ou analystes) et part du Steam Deck
  - [ ] Notes proposées pour chaque concept sur les critères 1, 3, 6 et 9 de la grille marché (section 10 de l'étude), argumentées ; la note finale reste celle de la Boss en T-004
  - [ ] Les extractions impossibles sans accès réseau autorisé sont signalées « non vérifié », jamais estimées sans source
- **Contexte / références** : réserve de T-002 (retour 10). Alimente T-015 (scénarios par concept) et T-004.

### T-022 : Données de marché par région et par langue
- **Assigné à** : `marketing-publishing` · **Dépend de** : aucune · **Jalon** : M1 · **Statut** : À CORRIGER
- **Livrables** : `docs/business/MARCHE_REGIONS.md`
- **Critères d'acceptation** :
  - [ ] Répartition des joueurs Steam par langue (enquête matériel Steam) et poids des grandes régions sur PC et consoles, avec la source et le niveau de confiance de chaque chiffre
  - [ ] Pour au moins 3 jeux de référence de l'étude, répartition des avis ou des ventes par langue ou par région quand elle est disponible, signalée comme estimation
  - [x] Recommandation de langues en 3 paliers (texte, sous-titres, doublage), transmise à `localization-manager` pour T-017
  - [x] Points d'attention par région (classification, conditions de distribution) signalés sans conclusion juridique, pour relecture par un juriste
- **Contexte / références** : réserve de T-002 (retour 11). Prérequis de T-017.
- **Validation** : `production/validations/T-022.md` (cycle 1, 2026-11-20 : REFUSÉ, retours 1 à 8 et seuil d'acceptation du cycle 2)

### T-023 : Révision v1.1 des trois concepts
- **Assigné à** : `game-director` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : À FAIRE
- **Livrables** : `docs/vision/CONCEPTS.md` (version 1.1, avec un journal des modifications)
- **Critères d'acceptation** :
  - [ ] Synthèse des risques (section 0 « Risque global », section 5 « Risque de production ») recalculée à partir des tableaux X.11, selon une règle d'agrégation écrite (probabilité × impact)
  - [ ] Note « 60 fps » d'AVEUX (section 6.1) et ligne « Risque 60 fps » du tableau 5 mises en cohérence avec la section 1.2 et le tableau C.6 (coût des visages en gros plan), en attendant la mesure de T-003 ; grille recalculée
  - [ ] Règle de parité écrite pour les trois concepts : la Series S et le Steam Deck ne diffèrent que par le rendu, jamais par une information utile au jeu (brouillard d'ESTRAN en A.6 revu) ; la logique de jeu (faisceau, bruit, visibilité) ne dépend pas des réglages de rendu
  - [ ] Pire cas technique d'ESTRAN décrit et ajouté à la condition 1 de la section 6.3 (nuit, pleine mer, faisceau du phare en mouvement et lampe du joueur, brouillard volumétrique, reflets sur l'eau) ; coexistence des deux sources lumineuses précisée en A.6
  - [ ] Pour chaque concept : références de design séparées des concurrents directs ; au moins 2 concurrents directs sortis depuis 2022, avec « ce qui nous en distingue » (pistes du retour 5 de la validation, à vérifier) ; aucun chiffre de ventes (c'est le rôle de T-021)
  - [ ] Pour chaque concept : capsule principale décrite (une image fixe et le titre) qui fait comprendre le jeu en 3 secondes, et contenu de la démo publique (20 à 30 min) avec ce qu'elle dévoile
  - [ ] Prix : pour ESTRAN et AVEUX, argument de contenu pour 39,99 € ou justification d'un prix inférieur ; plateformes reformulées en poids attendu des ventes, avec une sortie simultanée (A.8, B.8, C.8) ; équivalent ESRB anticipé pour chaque concept
  - [ ] Faits datés ou corrigés : Hellblade II (section 1.2), carton du trailer d'ESTRAN (A.12) ; test de sensibilité de la grille étendu aux notes (section 6.1)
- **Contexte / références** : réserves de la validation de T-001, retours 1 à 11 (`production/validations/T-001.md`). À valider avant T-004. Les effectifs et les durées des sections X.10, sur lesquels T-015 s'appuie, ne changent pas, sauf erreur à signaler à `business-affairs`.

### T-024 : Registre des licences et règles d'usage de l'IA générative
- **Assigné à** : `business-affairs` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : À FAIRE
- **Livrables** : `docs/legal/LICENCES.md`
- **Critères d'acceptation** :
  - [ ] Registre au format défini (asset ou outil, origine, licence et version des conditions, date de consultation, usage commercial autorisé, plateformes, attribution, obligations, preuve d'acquisition), prêt à recevoir chaque asset tiers comme l'exige `CLAUDE.md`
  - [ ] Conditions en vigueur résumées, avec la source officielle et la date de consultation : contrat de licence d'Unreal Engine (redevances, conditions pour les consoles), licences de Fab et statut des Megascans depuis la migration vers Fab, licence MetaHuman (y compris pour des visages créés à partir de scans de comédiens) ; coûts et redevances transmis à T-015
  - [ ] Obligations de divulgation de l'IA générative par boutique (Steam, PlayStation, Xbox, Epic), d'après les seules informations publiques, et règle interne : ce que les agents IA du studio peuvent produire pour le jeu livré, et comment c'est tracé
  - [ ] Clauses types à prévoir dans les contrats des comédiens : cession des droits à l'image et à la voix, consentement explicite à la réplique numérique et à l'animation faciale générée depuis l'audio, cadre syndical éventuel selon le pays des comédiens
  - [ ] Mention explicite : brouillon à faire valider par un juriste ; aucune acceptation de conditions, aucun compte créé et aucun achat sans l'accord de l'humain propriétaire du projet ; les pages inaccessibles sont signalées « non vérifié »
- **Contexte / références** : réserve de la validation de T-001 (retour 12 ; `docs/vision/CONCEPTS.md`, section 8). Aucune tâche ne couvrait ce registre. Prérequis à toute importation d'asset tiers dans `game/` ou `docs/art/` ; alimente T-015 (coûts de licence) et T-004 (critère 11 de la grille marché).

### T-025 : Finitions de l'étude de marché v2 (scénarios, sources, étiquettes)
- **Assigné à** : `marketing-publishing` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : À FAIRE
- **Livrables** : `docs/business/ETUDE_MARCHE.md` (version 2.1, avec une entrée dans le journal des modifications)
- **Critères d'acceptation** :
  - [ ] Section 6.3 : recette nette cohérente avec la chaîne du modèle ajoutée au tableau des scénarios (pondération lancement / longue traîne qu'implique le multiplicateur × 3, soit ≈0,41 du prix catalogue) ; il est écrit que la borne 0,51 suppose toutes les ventes aux conditions du lancement
  - [ ] Section 6.3 : sensibilités symétriques (variations défavorables au moins aussi fortes que les favorables : part de Steam au-dessus de 50 %, conversion sous 0,10, longue traîne × 2), chacune sourcée ou signalée [Estimation] ; contradiction « indépendantes de la qualité du jeu » / « corrélation » supprimée
  - [ ] Décision 1 de `production/validations/T-019.md` reportée dans les sections 1 (point 6), 6.2 (paragraphe « Décision à arbitrer » remplacé), 6.3 (montants en USD) et 10 (critère 6)
  - [ ] Section 13 complétée pour chaque source nommée dans le corps (au minimum GameBusiness.jp, SteamDB, Sportskeeda, Comicbook, MP1st, Robots Over Dinosaurs, Jefferies), avec l'URL renvoyée par la recherche ou « URL non retrouvée », et la passe ou la date
  - [ ] Légende : [Estimation] réservée aux calculs et hypothèses du studio ; estimations tierces (Raijin, SteamDB, agrégateurs) requalifiées en [Analyste], avec le site nommé
  - [ ] Section 9 : rapport de 0,752 reformulé en indices relatifs (volume de wishlists, indice d'achats), sans laisser croire à un taux de conversion de 75 %
  - [ ] Aucune nouvelle donnée de marché sans source ; aucune page ouverte hors de l'accès réseau autorisé
- **Contexte / références** : réserves de la validation de T-019, retours 1 à 6 (`production/validations/T-019.md`). Non bloquante pour T-015 : `business-affairs` applique directement les décisions 1 à 3 de cette validation. À faire avant T-020, qui modifie le même fichier.
