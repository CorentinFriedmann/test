# Backlog de production

> Tenu par `producer`. Statuts : À FAIRE · EN COURS · EN REVUE BOSS · VALIDÉ · VALIDÉ AVEC RÉSERVES · À CORRIGER · BLOQUÉ · ABANDONNÉ (voir `studio/WORKFLOW.md`).
> **Essai ESTRAN « une marée » (voie web)** : chemin critique jusqu'à la porte P2 = T-005, T-006, T-029, T-030, T-031, T-024, T-032, T-033, dans cet ordre, un agent à la fois. Tout le reste est hors chemin P2 (voir `production/ROADMAP.md`).
> Seule la `boss` peut poser `VALIDÉ` ou `À CORRIGER`.

## Vue d'ensemble : Sprint 0 (Jalon M0 Concept, puis début de M1)

| ID | Tâche | Assigné à | Dépend de | Statut |
|---|---|---|---|---|
| T-001 | Trois concepts de jeu et pitch | game-director | aucune | VALIDÉ AVEC RÉSERVES |
| T-002 | Étude de marché et positionnement | marketing-publishing | aucune | VALIDÉ AVEC RÉSERVES |
| T-003 | Choix techniques, architecture et budgets | technical-director | aucune | VALIDÉ AVEC RÉSERVES |
| T-004 | Choix du concept (Go / No-Go) | boss | T-001, T-002, T-003, T-015, T-023, T-026, T-027 | VALIDÉ |
| T-005 | Piliers et pitch final (ESTRAN « une marée ») | game-director | T-004 | VALIDÉ AVEC RÉSERVES |
| T-006 | GDD « une marée » et tranche P2 | game-designer | T-005 | VALIDÉ AVEC RÉSERVES |
| T-007 | Bible artistique (rendu stylisé atmosphérique) | art-director | T-005, T-033 | À FAIRE |
| T-008 | Bible narrative (textes, sans voix) | narrative-designer | T-005, T-033 | À FAIRE |
| T-009 | Direction audio (synthèse Web Audio, sans doublage) | audio-director | T-031, T-033 | À FAIRE |
| T-010 | Plan de la tranche verticale et registre des risques | producer | T-033 | À FAIRE |
| T-011 | Squelette du projet UE5 et pipeline CI | build-engineer | T-003 | ABANDONNÉ |
| T-012 | Plan de portage et de certification | platform-engineer | T-003 | ABANDONNÉ |
| T-013 | Stratégie de test et de qualité (web) | qa-lead | T-032 | À FAIRE |
| T-014 | Principes UX/UI et accessibilité (web) | ui-ux-designer | T-033 | À FAIRE |
| T-015 | Chiffrage des 3 concepts et pistes de financement | business-affairs | T-001, T-002, T-003, T-019, T-021 | VALIDÉ AVEC RÉSERVES |
| T-016 | Moodboards et key art du concept retenu | concept-artist | T-007 | À FAIRE |
| T-017 | Plan de localisation (FR et EN) | localization-manager | T-008 | À FAIRE |
| T-018 | Services en ligne et télémétrie | online-engineer | T-003, T-005 | ABANDONNÉ |
| T-019 | Corrections et compléments de l'étude de marché | marketing-publishing | aucune | VALIDÉ AVEC RÉSERVES |
| T-020 | Vérification à la source des chiffres de l'étude de marché | marketing-publishing | T-019 | BLOQUÉ |
| T-021 | Données de marché par concept et par genre | marketing-publishing | T-001, T-019 | VALIDÉ AVEC RÉSERVES |
| T-022 | Données de marché par région et par langue | marketing-publishing | aucune | À CORRIGER |
| T-023 | Révision v1.1 des trois concepts | game-director | aucune | VALIDÉ |
| T-024 | Registre des licences et règles d'usage de l'IA générative (voie web) | business-affairs | aucune | VALIDÉ AVEC RÉSERVES |
| T-025 | Finitions de l'étude de marché v2 (scénarios, sources, étiquettes) | marketing-publishing | aucune | À FAIRE |
| T-026 | Scénario « studio IA + petite équipe humaine » pour les 3 concepts | business-affairs | T-015 | VALIDÉ AVEC RÉSERVES |
| T-027 | Pivot technique web : pile, pipeline autonome et prototype de faisabilité | technical-director | T-026 | VALIDÉ AVEC RÉSERVES |
| T-028 | Replanification du backlog pour l'essai ESTRAN (voie web, agents seuls) | producer | T-004, T-027 | VALIDÉ AVEC RÉSERVES |
| T-029 | Noyau jouable : marée, menace, île, boucle de jeu | gameplay-programmer | T-006 | VALIDÉ AVEC RÉSERVES |
| T-030 | Ambiance visuelle stylisée, niveaux de qualité et mesures de performance | graphics-programmer | T-029 | VALIDÉ AVEC RÉSERVES |
| T-031 | Audio procédural : bruit dans l'eau et ambiance | audio-director | T-029 | VALIDÉ AVEC RÉSERVES |
| T-032 | Tests automatisés et rapport de la porte P2 | qa-lead | T-030, T-031 | VALIDÉ AVEC RÉSERVES |
| T-033 | Version jouable P2 en un seul fichier HTML, prête à publier | build-engineer | T-032, T-024, T-037, T-038 | EN COURS |
| T-034 | Mise à jour des documents techniques pour la voie web | technical-director | T-027 | À FAIRE |
| T-035 | Mise à jour des fiches d'agents pour la voie web | technical-director | T-034 | À FAIRE |
| T-036 | Seuil de la porte P2 adapté (GDD §13) | game-designer | T-006 | VALIDÉ AVEC RÉSERVES |
| T-037 | Rééquilibrage de la peur avant P2 (BUG-002, BUG-003) | game-designer | T-032 | VALIDÉ AVEC RÉSERVES |
| T-038 | Correction audio : voix prioritaires, `npm run all` vert (BUG-001) | audio-director | T-037 | VALIDÉ AVEC RÉSERVES |

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
- **Assigné à** : `technical-director` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `docs/tech/ARCHITECTURE.md`, `docs/tech/BUDGETS.md`, `docs/tech/NORMES_CODE.md`
- **Critères d'acceptation** :
  - [ ] Choix du moteur justifié (UE5 par défaut) et de sa version
  - [ ] Découpage en modules C++, gestion de la source (Git LFS ou Perforce) justifiée
  - [ ] Budgets par plateforme : temps de frame CPU/GPU, mémoire, streaming, taille d'installation
  - [ ] Liste des risques techniques (stutter de shaders, mémoire Series S...) avec mitigations

### T-004 : Choix du concept (Go / No-Go)
- **Assigné à** : `boss` · **Dépend de** : T-001, T-002, T-003, T-015, T-023, T-026, T-027 · **Jalon** : M0 · **Statut** : VALIDÉ
- **Livrables** : `production/validations/T-004.md`, `docs/vision/DECISION_CONCEPT.md`
- Accord du propriétaire le 2026-11-23 (à l'essai)
- **Critères d'acceptation** :
  - [x] Un concept retenu, avec sa justification (marché, faisabilité technique, budget, vision)
  - [x] Périmètre cible fixé (durée de jeu, taille du monde, solo ou multijoueur)
  - [x] **Proposition présentée à l'humain propriétaire du projet pour accord final**
- **Contexte / références** : poids et critères éliminatoires de la grille marché fixés dans `production/validations/T-002.md` (décision 3). La proposition indique le niveau de confiance des données de marché (T-020 faite ou non).

### T-005 : Piliers et pitch final (ESTRAN « une marée »)
- **Assigné à** : `game-director` · **Dépend de** : T-004 (VALIDÉ) · **Jalon** : Essai · P2 (chemin critique, 1re tâche) · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `docs/vision/PITCH.md`, `docs/vision/PILIERS.md`
- **Critères d'acceptation** :
  - [ ] Pitch en une phrase (30 mots au plus), en un paragraphe et en une page, pour ESTRAN version « une marée » (voir `production/validations/T-004.md` §6)
  - [ ] La **règle de la marée** et la **règle de la menace** (« bruit dans l'eau, lumière du phare ») énoncées chacune en 3 phrases au plus, compréhensibles sans image : elles servent de test de compréhension à la porte P2
  - [ ] 3 à 5 piliers de design, chacun avec au moins un « on fait » et un « on ne fait pas » ; la liste « on ne fait pas » de T-004 §6 est reprise telle quelle et n'est pas élargie
  - [ ] Rendu stylisé atmosphérique (pas de photoréalisme) et jeu solo sur PC (navigateur) affirmés ; aucune mention d'Unreal, de consoles ou de voix humaine enregistrée
  - [ ] Titre provisoire ; vérification d'antériorité sommaire, ou mention « non vérifié » si l'accès réseau manque
- **Contexte / références** : `production/DECISIONS.md`, `docs/vision/PERIMETRE_SOLO.md` §2.1. Adaptée à la voie web (anciens critères : photoréalisme, plateformes consoles).

### T-006 : GDD « une marée » et tranche P2
- **Assigné à** : `game-designer` · **Revue de pôle** : game-director · **Dépend de** : T-005 · **Jalon** : Essai · P2 (chemin critique) · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `docs/design/GDD.md`, `docs/design/data/maree.csv`, `docs/design/data/menace.csv`
- **Critères d'acceptation** :
  - [ ] Règle de marée spécifiée avec des chiffres : hauteur d'eau en fonction du temps (courbe dans `maree.csv`), zones qui se recouvrent, effet sur le déplacement, durée totale de la tranche P2 entre 5 et 10 minutes
  - [ ] Règle de menace spécifiée avec des chiffres (`menace.csv`) : déclencheurs du « bruit dans l'eau », distance et direction audibles, effet de la lumière du phare et de la lampe, conditions de défaite ; rien de ce qui touche à la logique ne dépend des réglages de rendu (règle de parité de T-023)
  - [ ] Boucles de jeu à 30 s et à 5 min ; objectif, victoire et défaite de la tranche P2 ; au moins 8 cas limites listés (lampe éteinte, marée au maximum, joueur immobile, etc.)
  - [ ] Contrôles clavier et souris, et manette via l'API Gamepad du navigateur ; HUD minimal défini (sans texte d'explication de la règle : c'est ce que la porte P2 teste)
  - [ ] Brief d'ambiance en une page : 5 couleurs de palette et 3 moments d'éclairage (aube, jour gris, nuit), servant de référence à T-030 en attendant T-007
  - [ ] Questionnaire de la porte P2 : 5 questions de compréhension et d'inquiétude (« qu'est-ce qui vous fait peur », « que faites-vous quand vous entendez un bruit dans l'eau », etc.) avec la réponse attendue
  - [ ] Périmètre de la tranche verticale (après P2) défini en une section, sans dépasser T-004 §6
- **Contexte / références** : adaptée de « GDD v1 » (critères d'origine : manette et clavier, économie en CSV, systèmes complets). Seule la tranche P2 est spécifiée en détail ; le reste du jeu est décrit au niveau d'un plan.

### T-007 : Bible artistique (rendu stylisé atmosphérique)
- **Assigné à** : `art-director` · **Dépend de** : T-005, T-033 · **Jalon** : Essai · après P2 · **Statut** : À FAIRE
- **Livrables** : `docs/art/BIBLE_ARTISTIQUE.md`, `docs/art/NOMMAGE_ASSETS.md`
- **Critères d'acceptation** :
  - [ ] Direction visuelle stylisée atmosphérique (low-poly éclairé, brouillard, grain, écume), palettes, ambiances lumineuses ; remplace toute norme de photoréalisme (PBR calibré, Nanite, texel density)
  - [ ] Budgets d'assets alignés sur les budgets web de `docs/tech/ADR_PIVOT_WEB.md` §4 (ou sur `docs/tech/BUDGETS.md` une fois T-034 faite)
  - [ ] Origine de chaque asset : procédural par défaut ; tout asset tiers passe par `docs/legal/LICENCES.md` (T-024)
  - [ ] Convention de nommage et arborescence des assets sous `game/`
- **Contexte / références** : adaptée (rendu stylisé, décision du 2026-11-23). Reportée après P2 : T-006 fournit le brief d'ambiance suffisant pour le prototype.

### T-008 : Bible narrative (textes, sans voix)
- **Assigné à** : `narrative-designer` · **Dépend de** : T-005, T-033 · **Jalon** : Essai · après P2 · **Statut** : À FAIRE
- **Livrables** : `docs/narrative/BIBLE_NARRATIVE.md`
- **Critères d'acceptation** :
  - [ ] Univers, thèmes, 4 marées sur 2 jours, 2 à 3 personnages présents par textes, photos et enregistrements (pas de visages animés)
  - [ ] Ton cohérent avec les piliers ; classification d'âge visée anticipée
  - [ ] Aucune voix humaine enregistrée par défaut : radio et cassettes en texte et sons, ou voix de synthèse selon T-024
  - [ ] Format des textes prêt pour la localisation (fichiers JSON de chaînes avec ID, contexte et limite de longueur)
- **Contexte / références** : adaptée (pas de comédiens ni de doublage, voir `production/validations/T-004.md` §6). Reportée après P2.

### T-009 : Direction audio (synthèse Web Audio, sans doublage)
- **Assigné à** : `audio-director` · **Dépend de** : T-031, T-033 · **Jalon** : Essai · après P2 · **Statut** : À FAIRE
- **Livrables** : `docs/audio/DIRECTION_AUDIO.md`
- **Critères d'acceptation** :
  - [ ] Identité sonore et références, partant de ce qui a fonctionné dans le prototype P2 (T-031 et avis de la porte P2)
  - [ ] Choix technique : Web Audio API et synthèse procédurale ; MetaSounds et Wwise supprimés ; aucun coût de licence
  - [ ] Budgets audio web (voix simultanées, mémoire, taille du fichier jouable)
  - [ ] Plan voix : aucune voix enregistrée par défaut, option de voix de synthèse soumise à T-024 ; pas de plan de doublage
- **Contexte / références** : adaptée à la voie web. La partie audio de P2 est faite par T-031.

### T-010 : Plan de la tranche verticale et registre des risques
- **Assigné à** : `producer` · **Dépend de** : T-033 (résultat de P2) · **Jalon** : Essai · après P2 · **Statut** : À FAIRE
- **Livrables** : `production/RISQUES.md`, mise à jour de `production/ROADMAP.md` et de ce backlog
- **Critères d'acceptation** :
  - [ ] Registre des risques (probabilité, impact, mitigation, responsable), partant des risques R1 à R9 de `production/validations/T-004.md` §8
  - [ ] Si P2 est passée : tâches de la tranche verticale découpées (une tâche, un agent, une session) avec critères mesurables ; durée estimée avec marge, et seuil de dérive P4 (+50 %) repris
  - [ ] Aucune date ferme tant que la durée réelle de P2 n'est pas connue
- **Contexte / références** : adaptée. La feuille de route des portes P1 à P4 est livrée par T-028 (`production/ROADMAP.md`) ; cette tâche ne la refait pas, elle la prolonge après P2.

### T-011 : Squelette du projet UE5 et pipeline CI
- **Assigné à** : `build-engineer` · **Dépend de** : T-003 · **Statut** : ABANDONNÉ (par T-028, 2026-11-23, avec l'accord de la Boss à la revue de T-028)
- **Raison** : Unreal Engine n'est plus le moteur (`production/DECISIONS.md`, 2026-11-23, voie web).
- **Remplacée par** : pipeline web déjà établi par T-027 (`docs/tech/PIPELINE_WEB.md`) ; code du jeu en T-029 ; empaquetage en T-033.
- Critères d'origine supprimés (historique git).

### T-012 : Plan de portage et de certification
- **Assigné à** : `platform-engineer` · **Dépend de** : T-003 · **Statut** : ABANDONNÉ (par T-028, 2026-11-23, avec l'accord de la Boss à la revue de T-028)
- **Raison** : Consoles hors périmètre (PC d'abord, `production/DECISIONS.md`) ; la certification n'a pas d'objet sans console.
- **Remplacée par** : aucune pour l'instant. Après la porte P3 : une tâche de plan Steam (Electron, Steam Deck « Jouable ») sera créée si l'essai continue ; la démo itch.io est couverte par T-033.
- Critères d'origine supprimés (historique git).

### T-013 : Stratégie de test et de qualité (web)
- **Assigné à** : `qa-lead` · **Dépend de** : T-032 · **Jalon** : Essai · après P2 · **Statut** : À FAIRE
- **Livrables** : `docs/qa/STRATEGIE_TEST.md`, `production/BUGS.md`
- **Critères d'acceptation** :
  - [ ] Types de tests retenus : unitaires, Playwright (parcours et captures), cadence en navigateur headless et sur matériel réel (via le rapport de performance copié par le propriétaire), régression ; automatisation d'Unreal et Gauntlet supprimées
  - [ ] Limites des mesures logicielles du cloud écrites (ADR §4.3) ; test humain = la démo publique, faute de testeurs (risque R5)
  - [ ] Classification des bugs (sévérité et priorité) et processus de triage ; `production/BUGS.md` repris tel que créé par T-032
  - [ ] Critères de sortie des portes P3 (démo) et de la version finale
- **Contexte / références** : adaptée ; s'appuie sur ce que T-032 a mis en place.

### T-014 : Principes UX/UI et accessibilité (web)
- **Assigné à** : `ui-ux-designer` · **Dépend de** : T-033 · **Jalon** : Essai · après P2 · **Statut** : À FAIRE
- **Livrables** : `docs/ux/UX_UI.md`
- **Critères d'acceptation** :
  - [ ] Arborescence des menus et principes du HUD, lisibilité sur écran de PC et sur Steam Deck (1280 × 800)
  - [ ] Clavier et souris, manette (API Gamepad) ; glyphes de boutons clavier et manette ; remappage des contrôles
  - [ ] Plan d'accessibilité : sous-titres des bruits, daltonisme, difficulté, aides motrices ; glyphes PlayStation et Xbox supprimés
  - [ ] S'appuie sur les retours de la porte P2 (le HUD minimal a-t-il suffi ?)
- **Contexte / références** : adaptée (consoles et TV à 3 m hors périmètre).

### T-015 : Chiffrage des 3 concepts et pistes de financement
- **Assigné à** : `business-affairs` · **Dépend de** : T-001, T-002, T-003, T-019, T-021 · **Jalon** : M0 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `docs/business/BUDGET.md`, `docs/business/FINANCEMENT.md`
- **Critères d'acceptation** :
  - [ ] Fourchette de budget et durée de production pour chacun des 3 concepts, avec les postes de coût détaillés
  - [ ] Scénarios de ventes et point mort par concept, à partir de l'étude de marché
  - [ ] Pistes de financement avec critères d'éligibilité, sources officielles et dates de consultation
  - [ ] Mention explicite : brouillon à faire valider par un expert-comptable
- **Contexte / références** : décisions de la Boss sur T-002 (`production/validations/T-002.md`, décisions 1 et 2). Scénario de base : sortie simultanée sur PC, PS5 et Xbox Series X|S, avec la certification, les kits de développement et les tests consoles chiffrés. Les chiffres [Mémoire] et « non vérifié » de l'étude ne servent que d'hypothèses de sensibilité nommées.

### T-016 : Moodboards et key art du concept retenu
- **Assigné à** : `concept-artist` · **Revue de pôle** : art-director · **Dépend de** : T-007 · **Jalon** : Essai · avant la porte P3 · **Statut** : À FAIRE
- **Livrables** : `docs/art/concepts/MOODBOARD_univers.md`, `docs/art/concepts/KEY_ART.md`
- **Critères d'acceptation** :
  - [ ] 3 pistes d'ambiance stylisée avec références sourcées et commentées
  - [ ] Color keys pour au moins 3 lieux ou moments du jeu, réalisables avec le moteur web (capture d'écran du prototype comme base)
  - [ ] Brief du key art et de la capsule (3 secondes pour comprendre « la mer efface le chemin »), utilisable pour la page itch.io puis Steam
  - [ ] Licence et origine de chaque image consignées (T-024) ; image générée par IA : règles de T-024
- **Contexte / références** : adaptée (stylisé, pas de MetaHuman). Nécessaire avant la démo publique (P3), pas avant P2.

### T-017 : Plan de localisation (FR et EN)
- **Assigné à** : `localization-manager` · **Dépend de** : T-008 · **Jalon** : Essai · avant la porte P3 · **Statut** : À FAIRE
- **Livrables** : `docs/loc/PLAN_LOCALISATION.md`, `docs/loc/PIPELINE.md`
- **Critères d'acceptation** :
  - [ ] Langues cibles : français et anglais d'abord, autres langues justifiées par le marché ; texte et sous-titres seulement (pas de doublage)
  - [ ] Pipeline par fichiers JSON de chaînes (ID, contexte, limite de longueur) ; String Tables et fichiers PO d'Unreal supprimés
  - [ ] Estimation du volume en mots, signalée comme estimation
  - [ ] Plan de pseudo-localisation et de relecture linguistique
- **Contexte / références** : adaptée. La donnée par région (T-022, À CORRIGER) n'est plus un prérequis : le plan peut se fonder sur FR et EN seulement, et T-022 n'est relancée qu'avec un accès réseau (voir T-020).

### T-018 : Services en ligne et télémétrie
- **Assigné à** : `online-engineer` · **Dépend de** : T-003, T-005 · **Statut** : ABANDONNÉ (par T-028, 2026-11-23, avec l'accord de la Boss à la revue de T-028)
- **Raison** : Jeu solo, hors ligne, sans serveur (`production/validations/T-004.md` §6) ; plus d'EOS ni de services de plateforme.
- **Remplacée par** : aucune. Une éventuelle télémétrie de la démo (avec consentement) sera décidée à la porte P3.
- Critères d'origine supprimés (historique git).

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
  **Mise à jour T-028 (2026-11-23)** : reste **BLOQUÉE** tant que le propriétaire n'a pas décidé de l'accès réseau (question ouverte de `production/DECISIONS.md`). Hors chemin P2 ; à faire avant l'étude de prix et la porte P3. Ne bloque aucun travail.

### T-021 : Données de marché par concept et par genre
- **Assigné à** : `marketing-publishing` · **Dépend de** : T-001, T-019 · **Jalon** : M0 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `docs/business/MARCHE_PAR_CONCEPT.md`
- **Critères d'acceptation** :
  - [x] Pour le genre de chacun des 3 concepts de T-001 : nombre de jeux sortis sur Steam par an (2024 à 2026), ventes ou revenus estimés des titres dominants, part des nouvelles IP, avec la source et le niveau de confiance de chaque chiffre
  - [x] Pour chaque concept : 5 jeux comparables sortis depuis 2022 (ventes estimées, notes, prix de lancement, plateformes, présence sur un abonnement)
  - [x] Bases installées PS5 et Xbox Series (communications officielles ou analystes) et part du Steam Deck
  - [x] Notes proposées pour chaque concept sur les critères 1, 3, 6 et 9 de la grille marché (section 10 de l'étude), argumentées ; la note finale reste celle de la Boss en T-004
  - [x] Les extractions impossibles sans accès réseau autorisé sont signalées « non vérifié », jamais estimées sans source
- **Contexte / références** : réserve de T-002 (retour 10). Alimente T-015 (scénarios par concept) et T-004.
- **Validation** : `production/validations/T-021.md` (cycle 1, 2026-11-23, réserves non bloquantes dans le rapport)

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
- **Mise à jour T-028 (2026-11-23)** : le statut reste posé par la Boss. Hors chemin P2 et ne bloque plus T-017 (qui se limite à FR et EN) ; le cycle 2 exige un accès réseau (voir T-020). Gelée jusqu'à la décision du propriétaire sur l'accès réseau, ou jusqu'à la porte P3.

### T-023 : Révision v1.1 des trois concepts
- **Assigné à** : `game-director` · **Dépend de** : aucune · **Jalon** : M0 · **Statut** : VALIDÉ
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

### T-024 : Registre des licences et règles d'usage de l'IA générative (voie web)
- **Assigné à** : `business-affairs` · **Dépend de** : aucune · **Jalon** : Essai · avant T-033 (prérequis de tout import d'asset tiers) · **Statut** : VALIDÉ AVEC RÉSERVES (`production/validations/T-024.md`, 2026-11-25)
- **Livrables** : `docs/legal/LICENCES.md`
- **Critères d'acceptation** :
  - [ ] Registre au format défini (asset ou outil, origine, licence et version, date de consultation, usage commercial autorisé, plateformes, attribution, obligations, preuve d'acquisition), prêt à recevoir chaque asset tiers comme l'exige `CLAUDE.md`
  - [ ] Pré-rempli avec les dépendances réelles de `prototypes/estran-poc/` et de `game/` : three.js (MIT), esbuild (MIT), Playwright (Apache-2.0, outil de test seulement), avec leurs obligations d'attribution (texte de licence dans la version publiée)
  - [ ] Règles de distribution : itch.io (HTML5) et Steam via Electron (empaquetage et certificat de signature), conditions résumées avec source officielle et date de consultation, ou « non vérifié » si la page est inaccessible
  - [ ] Obligations de divulgation de l'IA générative sur Steam et itch.io, d'après les seules informations publiques, et règle interne : ce que les agents IA peuvent produire pour le jeu livré, et comment c'est tracé ; voix de synthèse : conditions et consentement
  - [ ] Mention explicite : brouillon à faire valider par un juriste ; aucune acceptation de conditions, aucun compte et aucun achat sans l'accord du propriétaire (qui crée lui-même le compte vendeur au moment de vendre)
- **Contexte / références** : réserve de T-001 (retour 12), confirmée par la Boss : prérequis de toute importation d'asset tiers. Adaptée : contrat d'Unreal, Fab, Megascans, MetaHuman, clauses de comédiens retirés (sans objet en voie web et sans voix humaine).

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
  **Mise à jour T-028 (2026-11-23)** : hors chemin P2 ; à faire avant la décision de prix (porte P3). Les mentions Unreal et consoles de l'étude sont à relire à cette occasion (ADR §7.1) ; le prix de travail est maintenant 9,99 à 14,99 USD (`production/validations/T-004.md` §1).

### T-026 : Scénario « studio IA + petite équipe humaine » pour les 3 concepts
- **Assigné à** : `business-affairs` · **Dépend de** : T-015 · **Jalon** : M0 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `docs/business/BUDGET_PETITE_EQUIPE.md`
- **Validation** : `production/validations/T-026.md` (cycle 1, 2026-11-23) · Livrable étape 1 : `docs/vision/PERIMETRE_SOLO.md` · Aucune tâche de suivi bloquante
- **Critères d'acceptation** :
  - [x] Pour chaque concept, un périmètre réduit explicite (durée de jeu, taille du monde, ce qui est coupé ou remplacé par des assets sous licence) avec les effectifs humains et la durée, proposés par `game-director` ou `producer` et non inventés par `business-affairs`
  - [x] Budget et point mort recalculés avec le modèle de `BUDGET.md`, plus le coût d'exploitation des agents IA (abonnements, jetons, calcul) en ligne séparée
  - [x] Enveloppe de financement fournie par l'humain propriétaire, reprise telle quelle ; aucune hypothèse de fonds propres du propriétaire sans son accord
  - [x] Mention explicite : brouillon à faire valider par un expert-comptable
- **Contexte / références** : réserve bloquante de `production/validations/T-015.md` (retours 1 et 2 et point stratégique). Les effectifs de `CONCEPTS.md` X.10 sont ceux d'un studio classique ; ils ne sont pas modifiés. Le périmètre réduit ne se chiffre pas avant que le propriétaire ait donné son enveloppe. **Réponse du propriétaire (2026-11-23, `production/DECISIONS.md`)** : aucun apport financier en dehors de l'abonnement Claude ; il travaille seul et il est débutant en Unreal ; sortie sur PC d'abord, consoles ensuite.

### T-027 : Pivot technique web : pile, pipeline autonome et prototype de faisabilité
- **Assigné à** : `technical-director` · **Dépend de** : T-026 · **Jalon** : M0 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** :
  - `docs/tech/ADR_PIVOT_WEB.md`
  - `docs/tech/PIPELINE_WEB.md`
  - `prototypes/estran-poc/`
- **Critères d'acceptation** :
  - [ ] Pile web retenue et justifiée (moteur de rendu three.js ou alternative, WebGL2 ou WebGPU, langage, outil de build), avec des versions exactes figées, installable depuis les registres de paquets autorisés par le réseau de la session
  - [ ] Prototype minimal exécutable dans le dépôt : une scène nocturne d'ESTRAN (eau avec marée, brouillard, faisceau de phare, lampe du joueur), lancée et testée automatiquement dans le cloud (navigateur headless, capture d'écran), sans aucune action humaine
  - [ ] Pipeline autonome documenté et exécuté au moins une fois : installation, build, tests automatisés, captures, publication d'une version jouable consultable par le propriétaire (page publiée ou équivalent)
  - [ ] Budgets de performance cibles (PC de milieu de gamme, Steam Deck) et limites des mesures faites en rendu logiciel dans le cloud ; distribution envisagée (itch.io en HTML5, Steam via une application empaquetée) avec les étapes qui exigent le propriétaire
  - [ ] Faisabilité des 3 concepts dans cette pile et ce que devient le réalisme ; origine des assets (procéduraux, CC0, générés) avec les contraintes de licence et de réseau
  - [ ] Liste des documents et des fiches d'agents à mettre à jour (ARCHITECTURE, BUDGETS, NORMES_CODE, agents écrits pour Unreal)
- **Contexte / références** : Décision du propriétaire du 2026-11-23 (production/DECISIONS.md, voie « les agents font tout »). Remplace Unreal Engine 5 comme référence. Prérequis de T-004.

### T-028 : Replanification du backlog pour l'essai ESTRAN (voie web, agents seuls)
- **Assigné à** : `producer` · **Dépend de** : T-004, T-027 · **Jalon** : M1 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** :
  - `production/BACKLOG.md`
  - `production/ROADMAP.md`
- **Critères d'acceptation** :
  - [ ] Chaque tâche existante devenue sans objet (Unreal Engine, consoles, équipe humaine) est passée au statut ABANDONNÉ, avec la raison et, le cas échéant, la tâche qui la remplace ; les tâches encore utiles sont adaptées (critères et livrables revus pour la voie web et le rendu stylisé) plutôt que recréées
  - [ ] Un plan court jusqu'à la porte d'arrêt P2 (prototype jouable de 5 à 10 minutes d'ESTRAN « une marée ») : tâches dans l'ordre, une tâche par agent et par session, chacune avec des livrables et des critères d'acceptation mesurables, et des dépendances cohérentes
  - [ ] Une tâche de mise à jour des documents techniques et des fiches d'agents pour la voie web (liste de docs/tech/ADR_PIVOT_WEB.md §7)
  - [ ] production/ROADMAP.md : étapes de l'essai (P1 à P4 de production/validations/T-004.md), ce que le propriétaire verra et décidera à chaque porte, sans date ferme
  - [ ] Respect de production/DECISIONS.md (le propriétaire ne fait rien, budget limité à l'abonnement Claude, mode économe) et des réserves non bloquantes des validations précédentes, reprises quand elles concernent le plan
- **Validation** : `production/validations/T-028.md` (cycle 1, 2026-11-23) · Réserves non bloquantes dans le rapport ; arbitrages de la Boss : langage JavaScript pour P2, audio par `audio-director`, T-024 juste après T-031
- **Contexte / références** : Décision du propriétaire du 2026-11-23 : ESTRAN accepté à l'essai. Périmètre, portes d'arrêt et « on ne fait pas » dans production/validations/T-004.md.

### T-029 : Noyau jouable : marée, menace, île, boucle de jeu
- **Assigné à** : `gameplay-programmer` · **Revue de pôle** : technical-director · **Dépend de** : T-006 · **Jalon** : Essai · P2 · **Statut** : VALIDÉ AVEC RÉSERVES (`production/validations/T-029.md`, 2026-11-24)
- **Livrables** : `game/` (copie de départ de `prototypes/estran-poc/`, mêmes versions figées, dépôt autonome avec `npm run all`), `game/tests/unit/`, `game/tests/e2e/`
- **Critères d'acceptation** :
  - [ ] Simulation à pas fixe (30 Hz, `sim_step` de `menace.csv` ; arbitrage T-006) séparée du rendu, sans dépendance au rendu ; marée lue depuis `maree.csv`, menace depuis `menace.csv` (valeurs de T-006, pas de valeurs en dur)
  - [ ] Île générée de façon procédurale et déterministe à partir d'une graine ; un jeu complet de la tranche P2 dure 5 à 10 minutes de temps de simulation
  - [ ] Déplacement, lampe, déclencheurs du « bruit dans l'eau » (événement émis par la simulation, consommé plus tard par T-031), victoire, défaite, recommencer ; HUD minimal défini par T-006, sans texte qui explique la règle
  - [ ] Au moins 15 tests unitaires (marée, menace, déterminisme : même graine, mêmes entrées, même état final) ; test de parité : deux réglages de rendu donnent un journal de simulation identique
  - [ ] Au moins 2 scénarios Playwright : un joueur automate qui gagne et un qui perd, sans erreur ni avertissement dans la console ; `npm run all` vert depuis un dépôt propre
  - [ ] Rendu provisoire accepté (celui du prototype) : T-030 s'en charge
  - [ ] Langage : **JavaScript ES2022** comme le prototype (arbitrage de la Boss, T-028) ; aucune nouvelle dépendance ni compilateur TypeScript pour P2 ; le passage à TypeScript strict est évalué après P2 (T-034, ADR §2)
- **Contexte / références** : `prototypes/estran-poc/` (T-027), `docs/tech/ADR_PIVOT_WEB.md` (pile et langage), `docs/design/GDD.md`. Pas de nouvelles dépendances sans mise à jour de `docs/legal/LICENCES.md` (T-024).

### T-030 : Ambiance visuelle stylisée, niveaux de qualité et mesures de performance
- **Assigné à** : `graphics-programmer` · **Revue de pôle** : technical-director · **Dépend de** : T-029 · **Jalon** : Essai · P2 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `game/src/render/`, `game/tests/e2e/render.spec.*`, `game/captures/`, `docs/tech/PERF_P2.md`
- **Critères d'acceptation** :
  - [ ] Eau dont le niveau suit la simulation (marée visible sans HUD), brouillard, faisceau du phare, lampe du joueur, écume et grain, selon le brief d'ambiance de T-006
  - [ ] Trois niveaux de qualité (haut, moyen, bas) qui ne changent jamais la logique ni ce que le joueur peut savoir de la menace (règle de parité de T-023) ; test de parité vert
  - [ ] Écran de mesure : cadence moyenne, 95e centile du temps de frame, nombre d'appels de dessin et de triangles, exportables en JSON par un bouton « copier le rapport de performance » (utilisable par le propriétaire sur son PC pour la porte P1)
  - [ ] Rapport `PERF_P2.md` : mesures des 3 niveaux en navigateur headless, avec les limites du rendu logiciel écrites ; écarts aux budgets de `docs/tech/ADR_PIVOT_WEB.md` §4 listés
  - [ ] Au moins 6 captures d'écran (3 moments d'éclairage × 2 niveaux de qualité) dans `game/captures/` ; la menace reste lisible au niveau bas
  - [ ] Aucune erreur de console ; `npm run all` vert
- **Contexte / références** : réserve de T-027 et porte P1 : la fluidité sur un vrai PC reste à confirmer par le propriétaire (« fluide » ou « saccadé »). Si P1 est « saccadé », un correctif est créé hors de cette tâche.
- **Réserves reprises de T-029** (revue TD) : période du faisceau lue depuis `lighthouse_beam_period` et non `simTime / 8` (`scene.js` l.177), constantes visuelles rangées en configuration ; rendu en lecture seule de `getState()` ; rejouer la parité avec le scénario `prudent` et `?debug=1`.

### T-031 : Audio procédural : bruit dans l'eau et ambiance
- **Assigné à** : `audio-director` · **Revue de pôle** : technical-director · **Dépend de** : T-029 · **Jalon** : Essai · P2 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `game/src/audio/`, `game/tests/e2e/audio.spec.*`, `docs/audio/NOTES_AUDIO_P2.md`
- **Critères d'acceptation** :
  - [ ] Tout en synthèse Web Audio, sans fichier audio ni voix ; ambiance (mer, vent) qui varie avec le niveau de la marée
  - [ ] Au moins 3 variantes de « bruit dans l'eau », spatialisées : la direction se perçoit au casque (test : le panoramique calculé suit la position de la source dans un test sur `OfflineAudioContext`)
  - [ ] Signal de danger lié à la lumière du phare ; volume général et coupure du son disponibles
  - [ ] Niveau mesuré : aucun écrêtage (crête sous −1 dBFS) sur un parcours complet rendu hors ligne ; démarrage de l'audio sur un geste du joueur, sans erreur de console
  - [ ] Option de sous-titres des bruits (texte court, par exemple « bruit dans l'eau, à gauche »), désactivée par défaut, servant l'accessibilité
  - [ ] `NOTES_AUDIO_P2.md` : ce qui est fait, ce qui reste, hypothèses sur ce qui fait peur
- **Contexte / références** : **codée par `audio-director`** (arbitrage de la Boss, T-028) ; sa fiche parle encore de MetaSounds et de Wwise : la Coordination lui transmet `docs/tech/ADR_PIVOT_WEB.md` et `production/DECISIONS.md` (Web Audio seulement). Au moins la moitié de la peur est portée par l'audio (`production/validations/T-004.md` R3). La direction audio complète (T-009) vient après P2.
- **Validation** : `production/validations/T-031.md` (cycle 1, 2026-11-25) · R3 (audio = moitié de la peur) non vérifié : personne n'a écouté ; réserves reportées en T-032 et T-033.
- **Réserve reprise de T-030** (Boss, non bloquante) : le rendu de la Laisse est un point de saccade possible ; ne pas ajouter de lumière ni de matériau en cours de partie dans le branchement audio/visuel du danger.
- **Réserve reprise de T-029** : `try/catch` par écouteur dans `sim.subscribe`/`log()` (erreur journalisée hors simulation) avant de brancher l'audio. Appliquer `threat_audible_radius` et `threat_cue_roar_radius` avec `state.threat.dist`.

### T-032 : Tests automatisés et rapport de la porte P2
- **Assigné à** : `qa-lead` · **Dépend de** : T-030, T-031 · **Jalon** : Essai · P2 · **Statut** : VALIDÉ AVEC RÉSERVES (`production/validations/T-032.md`, 2026-11-25) ; critère « `npm run all` vert deux fois » reporté à T-038, bugs de conception traités en T-037
- **Livrables** : `game/tests/p2/`, `docs/qa/RAPPORT_P2.md`, `production/BUGS.md`
- **Critères d'acceptation** :
  - [ ] Deux joueurs automates sur 20 graines chacun : l'un suit la règle (bruit puis lumière du phare), l'autre l'ignore ; le premier réussit dans au moins 90 % des parties, le second échoue dans au moins 90 % ; sinon la règle est signalée comme non discriminante
  - [ ] Durée de partie entre 5 et 10 minutes de temps de simulation, mesurée sur ces 40 parties
  - [ ] 0 erreur et 0 avertissement de console sur l'ensemble, `npm run all` vert depuis un dépôt propre, reproductible deux fois de suite
  - [ ] Tableau de performances de T-030 repris, avec ses limites ; captures jointes
  - [ ] Bugs classés par sévérité et priorité dans `production/BUGS.md` ; chaque bug bloquant la porte P2 est signalé à la Coordination pour une tâche de correction
  - [ ] Questionnaire humain de T-006 (5 questions) mis en forme avec la réponse attendue, et conclusion écrite : P2 « prête à être jugée » ou « non prête », avec la raison
  - [ ] Aucun avis de joueur inventé : la partie humaine de P2 est présentée comme **en attente** du propriétaire
- **Contexte / références** : porte P2 de `production/validations/T-004.md` §7 : rapport automatisé **et** au moins un avis humain extérieur. Le premier est produit ici, le second à l'étape publiée de T-033.
- **Réserves reprises de T-030** (Boss, revue TD) : (1) précompiler le shader de la Laisse et des anneaux (`renderer.compile` avec visibilité forcée à la fin de `createView`) et ajouter un contrôle `renderer.info.programs.length` identique avant et après sa première apparition ; nuancer la phrase « tous les shaders sont compilés » de `PERF_P2.md` §4 ; (2) relier l'angle visible du faisceau à `lighthouse_beam_half_angle` (correctif court par `graphics-programmer`, avant la clôture de T-032).
- **Réserves reprises de T-031** (Boss, non bloquantes) : (1) mesurer le coût CPU audio avec le panneau F2 sur un parcours bruyant ; (2) corriger la note audio (« pas sacrifiés en premier » est inexact : premier arrivé, premier servi au-delà de 28 voix) ou ajouter une priorité par type ; (3) dans le rapport, ne pas présenter R3 comme atteint : l'audio n'a pas été écouté.
- **Point repris de T-029 (écart 6 du GDD)** : mesurer sur les 40 parties le temps passé par la Laisse à moins de 15 m et le nombre de saisies de l'automate qui suit la règle ; signaler si la peur n'existe pas avant 160 s (charge du phare sous 20 %).

### T-033 : Version jouable P2 en un seul fichier HTML, prête à publier
- **Assigné à** : `build-engineer` · **Dépend de** : T-032, T-024 · **Jalon** : Essai · P2 · **Statut** : EN COURS
- **Livrables** : `game/dist/estran-p2.html`, `production/RAPPORT_P2.md`, mise à jour de `docs/legal/LICENCES.md` et de `docs/tech/PIPELINE_WEB.md` (étapes de la version P2)
- **Critères d'acceptation** :
  - [ ] Un seul fichier HTML autonome, d'au plus 3 Mo, sans requête réseau au chargement (vérifié par Playwright) ; fonctionne au clavier et à la souris ; manette si prévue par T-006
  - [ ] Écran de départ en français : touches et rien d'autre (la règle ne s'explique pas) ; bouton « copier le rapport de performance » (T-030) et formulaire des **8 questions** de P2 (`docs/qa/QUESTIONNAIRE_P2.md`, GDD §13, BUG-005) avec copie du texte à renvoyer
  - [ ] Textes de licences des dépendances inclus dans la version publiée (T-024) ; aucun asset tiers non enregistré
  - [ ] `RAPPORT_P2.md` d'une page, pour le propriétaire : ce qu'il y a à jouer (5 à 10 min), quoi répondre (P1 : « fluide » ou « saccadé » ; P2 : les 8 réponses), lien de publication ; rien d'autre à faire
  - [ ] Tests Playwright de la version assemblée (démarrage, une partie automate, aucune erreur de console) verts depuis un dépôt propre
  - [ ] Prête à publier : la Coordination la publie via l'outil Artifact et reporte le lien dans le rapport de remise et dans `production/DECISIONS.md` (questions ouvertes) ; la tâche ne prétend pas que P2 est passée
- **Ajouts de la Boss après T-032** : (1) le formulaire reprend les **8 questions** de `docs/qa/QUESTIONNAIRE_P2.md`, pas 5 (BUG-005), dont les questions 6 à 8 (casque, son coupé avec M, sous-titres avec K) qui portent R3 ; (2) la performance (F2, « copier le rapport de performance ») se mesure **avec le son actif**, 60 s sur un parcours bruyant, et le rapport au propriétaire le dit (BUG-004, divise la cadence par deux sous rendu logiciel, à confirmer sur un vrai PC) ; (3) T-033 ne démarre qu'après T-037 et T-038 : le prototype montré doit avoir un `npm run all` vert et une peur mesurable avant 160 s.
- **Contexte / références** : décision du propriétaire du 2026-11-23 (il ne fait rien lui-même : il joue et répond). Cette version sert aussi à répondre à la question P1 encore ouverte.
- **Anomalie MIT à corriger ici (bloquante pour la publication, constatée par la Boss le 2026-11-25)** : `game/scripts/build.mjs` ligne 16 utilise `legalComments: 'none'` ; `dist/estran.html` ne contient ni « three.js authors » ni « Permission is hereby granted ». Appliquer `docs/legal/LICENCES.md` §5 (`legalComments: 'inline'` ou `banner` avec le texte de `game/node_modules/three/LICENSE`, plus écran Crédits et licences), et ajouter le test Playwright qui vérifie ces deux chaînes dans la version assemblée. Ajouter aussi Electron et Chromium au registre si l'empaquetage est abordé.

### T-034 : Mise à jour des documents techniques pour la voie web
- **Assigné à** : `technical-director` · **Dépend de** : T-027 · **Jalon** : Essai · peut suivre P2 (ne la bloque pas) · **Statut** : À FAIRE
- **Livrables** : `docs/tech/ARCHITECTURE.md`, `docs/tech/BUDGETS.md`, `docs/tech/NORMES_CODE.md` (anciennes versions archivées sous `docs/tech/archive/`)
- **Critères d'acceptation** :
  - [ ] Les trois documents réécrits selon `docs/tech/ADR_PIVOT_WEB.md` §7.1 : modules, pas fixe, sauvegarde, abstraction plateforme (navigateur / Electron) ; budgets web de l'ADR §4 sans Series S ni PS5, avec mesure sur GPU réel ; normes de code web (TypeScript strict si retenu, ESLint et Prettier figés, pas d'allocation dans la boucle, libération des ressources GPU, tests)
  - [ ] Ce qui a été appris par T-029 à T-032 est reporté (écarts de budget, structure réelle de `game/`)
  - [ ] Aucune mention d'Unreal, de Lumen, de Nanite ni de MetaHuman hors des sections « archive » ; vérifié par une recherche et listé dans la remise
  - [ ] Les points de §7.1 qui relèvent d'autres rôles sont transmis par écrit : `business-affairs` (documents `docs/business/`), `game-director` (`CONCEPTS.md`, `PERIMETRE_SOLO.md`), Coordination (`CLAUDE.md`, `studio/ORGANIGRAMME.md`)
- **Réserves reprises de T-031** (Boss) : le questionnaire propriétaire doit inclure (a) l'écoute au casque, (b) une comparaison avec et sans son (touche M) pour juger R3, (c) le niveau sonore au premier contact (volume par défaut, environ -20 dBFS efficace), (d) le silence de la Laisse au bord, l'absence de musique, et le repérage devant/derrière (pan stéréo sans HRTF), (e) les sous-titres (touche K). Toute réponse non obtenue reste « en attente ».
- **Contexte / références** : ADR §7.1. Non bloquante pour P2 : T-029 à T-033 suivent l'ADR directement.

### T-035 : Mise à jour des fiches d'agents pour la voie web
- **Assigné à** : `technical-director` · **Dépend de** : T-034 · **Jalon** : Essai · peut suivre P2 · **Statut** : À FAIRE
- **Livrables** : fiches modifiées dans `.claude/agents/`, `studio/equipe.json` si les titres changent
- **Critères d'acceptation** :
  - [ ] Les fiches de la liste de l'ADR §7.2 (`technical-director`, `graphics-programmer`, `gameplay-programmer`, `technical-artist`, `environment-artist`, `level-designer`, `character-artist`, `animator`, `build-engineer`, `online-engineer`, `platform-engineer`, `qa-lead`, et relecture légère de `art-director`, `game-designer`, `narrative-designer`, `localization-manager`, `business-affairs`, `boss`) adaptées à la pile web et au rendu stylisé
  - [ ] Aucune mention d'Unreal, Lumen, Nanite, MetaHuman, Blueprints, GAS ni de consoles dans les fiches, sauf la mention « hors périmètre » ; vérifié par une recherche listée dans la remise
  - [ ] Rôle, outils et nom des fiches inchangés ; la fiche `producer` n'est pas modifiée ; si elle doit l'être, une note est transmise à la Coordination
  - [ ] Chaque fiche renvoie vers `production/DECISIONS.md`
- **Contexte / références** : ADR §7.2. Non bloquante pour P2. Si la session ne suffit pas, le `producer` découpe en deux tâches.

### T-036 : Seuil de la porte P2 adapté (GDD §13)
- **Assigné à** : `game-designer` · **Dépend de** : T-006 · **Jalon** : Essai · P2 · **Statut** : VALIDÉ AVEC RÉSERVES
- **Livrables** : `docs/design/GDD.md` §13 (paragraphe « Seuil de passage » remplacé)
- **Critères d'acceptation** :
  - [ ] Seuil reformulé selon `production/validations/T-006.md` (arbitrage 1) : propriétaire seul répondant, plus les automates de T-032 ; testeurs extérieurs reportés à la démo P3
  - [ ] Aucune exigence d'un humain extérieur avant P3 ; cohérent avec `production/DECISIONS.md`, T-032 et T-033

### T-037 : Rééquilibrage de la peur avant P2 (BUG-002, BUG-003)
- **Assigné à** : `game-designer` (valeurs des CSV de `game/data/`, surtout `menace.csv` et `maree_effets.csv`) ; `gameplay-programmer` seulement si une valeur ne suffit pas · **Dépend de** : T-032 · **Jalon** : Essai · P2 · **Statut** : VALIDÉ AVEC RÉSERVES (`production/validations/T-037.md`, 2026-11-25)
- **Livrables** : CSV modifiés, tests de `game/tests/p2/` complétés (seuils ci-dessous inscrits dans `discrimination.test.js`), `docs/design/EQUILIBRAGE_P2.md` (une page : valeurs avant/après, raison, mesures)
- **Critères d'acceptation** (mesurés par les automates de `game/tests/p2/`) :
  - [ ] Réglage sur les graines 101 à 120, **vérification sur des graines non utilisées pour le réglage (201 à 220)** pour ne pas ajuster les valeurs aux seules 20 parties connues ; les deux jeux de graines doivent satisfaire les seuils
  - [ ] `prudent` (suit la règle) gagne au moins 90 % des parties **et** subit au moins une approche (Laisse sous 15 m) avant 160 s dans au moins 50 % d'entre elles ; aucune saisie avant 160 s n'est exigée ni interdite pour lui, mais au plus 10 % de parties perdues
  - [ ] `win` et `heedless` (ignorent la règle sans la chasser) gagnent au plus 50 % des parties (contre 70 % et 80 % aujourd'hui) ; `noisy` perd toujours au moins 90 %
  - [ ] `silent` (marche lente) reste viable (au moins 80 % de victoires) : la discrétion récompensée ne doit pas devenir un échec
  - [ ] Durée d'une partie menée à terme toujours entre 5 et 10 minutes ; 72 tests unitaires adaptés si une valeur testée change, tests jeu et rendu verts
  - [ ] Pistes autorisées (la peur est le critère central de P2) : charge ou portée du phare plus faibles, Laisse apparaissant ou rôdant plus près et plus tôt, bruits ordinaires (pas dans l'eau, relevé) mieux entendus ; chaque changement est justifié par la mesure, rien n'est ajouté qui ne soit réglable en CSV sans raison
  - [ ] Le texte du rapport dit explicitement que des automates ne ressentent rien : seul le propriétaire dira si la peur est là (questions 5 et 7)
- **Contexte / références** : `docs/qa/RAPPORT_P2.md` §1 et §3, `production/BUGS.md` BUG-002 et BUG-003, écart 6 du GDD, `production/validations/T-029.md`. Transmettre `production/DECISIONS.md` : le propriétaire est le seul répondant de P2, donc la prototype doit être juste avant de lui être montré. `npm run test:p2` et `npm run p2:report` sont les outils de mesure ; `src/sim/bot.js` n'est pas modifié (sauf ajout de joueurs d'appoint dans `tests/p2/lib.js`). L'audio e2e peut rester rouge (BUG-001) pendant cette tâche.

### T-038 : Correction audio : voix prioritaires, `npm run all` vert (BUG-001)
- **Assigné à** : `audio-director` · **Dépend de** : T-037 (le rééquilibrage change la densité des repères) · **Jalon** : Essai · P2 · **Statut** : VALIDÉ AVEC RÉSERVES (`production/validations/T-038.md`, 2026-11-25) ; test unitaire du vol de voix à reprendre avant la fin de la phase audio
- **Livrables** : correctif de `game/src/audio/` (`engine.js`, `MAX_VOICES`), test `game/tests/e2e/audio.cjs` mis d'accord, `docs/audio/NOTES_AUDIO_P2.md` à jour, `production/BUGS.md` (BUG-001 fermé après vérification)
- **Critères d'acceptation** :
  - [ ] Priorité par type : saisie, grondement, battement de coeur et remous proches ne sont **jamais refusés** (on cède la plus ancienne voix de faible priorité, pas, par exemple) ; les pas se font refuser ou couper en premier
  - [ ] `node tests/e2e/audio.cjs` **vert 3 fois de suite** ; la vérification de bornes porte sur les repères critiques (0 refusé) et non sur `dropped === 0` pour toutes les voix, ou la densité du test est rendue réaliste ; le test n'est pas affaibli au point de ne plus rien vérifier (justifié par écrit)
  - [ ] `node tests/p2/audio-cpu.cjs` : 0 voix critique refusée sur un parcours bruyant
  - [ ] `npm run all` vert depuis un dépôt propre, **deux fois de suite** (critère repris de T-032), 0 erreur et 0 avertissement de console
  - [ ] Note audio corrigée (« premier arrivé, premier servi » remplacé par la règle de priorité réelle) ; coût CPU de l'audio relevé de nouveau et consigné (BUG-004 reste « à confirmer sur un vrai PC »)
- **Contexte / références** : `production/BUGS.md` BUG-001 (piste de correction), `docs/qa/RAPPORT_P2.md` §4 et §5, `production/validations/T-031.md` retour 4. Fiche de l'agent : lui transmettre `docs/tech/ADR_PIVOT_WEB.md` et `production/DECISIONS.md` (Web Audio seulement). Aucune modification du rendu.
