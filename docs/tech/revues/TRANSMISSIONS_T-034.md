# Transmissions de T-034 : passages à mettre à jour par les autres rôles

> Auteur : `technical-director` · 2026-11-26. Ces fichiers **n'ont pas été modifiés** par T-034 (ADR `ADR_PIVOT_WEB.md` §7.1). Numéros de ligne relevés le 2026-11-26 : à revérifier avant édition si le fichier a bougé.
> Référence de remplacement : `docs/tech/ARCHITECTURE.md`, `BUDGETS.md`, `NORMES_CODE.md` (version 2.0), `production/DECISIONS.md` (2026-11-23 : voie web, rendu stylisé, PC d'abord, consoles éventuellement plus tard).

## 1. À `business-affairs` : `docs/business/`

Constat général : les budgets supposent Unreal et une sortie PC + PS5 + Xbox. Décisions du propriétaire : voie web (three.js, MIT, aucune redevance), PC d'abord (Steam via Electron, itch.io pour les démos), consoles hors budget initial.

| Fichier | Lignes | Passage | Mise à jour attendue |
|---|---|---|---|
| `docs/business/BUDGET.md` | 213 | « Redevance Unreal Engine 5 % au-delà de 1 M USD » | Ne s'applique plus à la voie web (aucun moteur sous redevance). Conserver comme **coût du portage éventuel**, à marquer comme tel |
| `docs/business/BUDGET.md` | 215 | Licence par poste d'Unreal | Idem |
| `docs/business/BUDGET.md` | 216 | MetaHuman (EULA Unreal) | Sans objet en voie web (pas de MetaHuman) ; à retirer ou à archiver |
| `docs/business/BUDGET.md` | 219 | Kits PS5/Xbox, certification TRC/XR | Hors budget initial (consoles plus tard éventuellement) ; marquer « option » |
| `docs/business/BUDGET.md` | autour de 213-219 (section 8) | Aucune ligne pour les **coûts de la voie web** | Ajouter : Electron (MIT, empaquetage Steam), esbuild et three.js (MIT, 0 €), Playwright (Apache-2.0, outil de test), **signature de code Windows** (payant, ADR §5.3 point 5, à ne pas faire au départ), frais Steamworks (déjà chiffrés par ailleurs) |
| `docs/business/BUDGET_PETITE_EQUIPE.md` | 53 | « Redevance Unreal Engine 0 € … 5 % au-delà » | Remplacer par « aucune redevance moteur (voie web) » ; mention du portage éventuel |
| `docs/business/BUDGET_PETITE_EQUIPE.md` | 67 | « Option consoles (hors budget initial) » | Déjà cohérent ; vérifier qu'aucun chiffre ne suppose les kits Unreal |
| `docs/business/ETUDE_MARCHE.md` | 1 | Titre « jeu premium AA haut de gamme photoréaliste » | Le produit est un jeu **stylisé atmosphérique** : ajouter une note de révision en tête et revoir la comparaison de référence |
| `docs/business/ETUDE_MARCHE.md` | 39, 46, 85, 110, 115, 147-153, 163, 165 | Conclusions et tableaux fondés sur le photoréalisme (AA photoréaliste, horreur photoréaliste, « Photoréalisme : Oui ») | Marquer ces passages comme **comparables d'un autre niveau de rendu** ; ajouter des comparables de jeux stylisés atmosphériques indépendants en 3D web ou à petit budget (le rendu seul ne justifie plus le prix) |
| `docs/business/ETUDE_MARCHE.md` | 40, 42, 72-90, 98-99, 169, 225 | Scénario de base « sortie simultanée PC, PS5, Xbox » ; Series S « limite le rendu (10 Go) » ; hypothèse « 50 % de ventes sur Steam » | Remplacer le scénario de base par **PC seul d'abord (Steam, Steam Deck)** ; le calcul « ventes toutes plateformes = Steam ÷ part de Steam » devient « Steam seul » |
| `docs/business/MARCHE_PAR_CONCEPT.md` | 24 | Fourchettes incluant les consoles | À recalculer pour PC seul |
| `docs/business/MARCHE_REGIONS.md`, `FINANCEMENT.md` | 82-88 (PS5), 112 | Données PS5 et consoles | Pas d'erreur ; marquer « hors périmètre initial » |

À ajouter côté juridique (`docs/legal/LICENCES.md`) : **Electron et Chromium** (déjà demandé dans le backlog T-033), Playwright (Apache-2.0, outil seulement). T-034 n'ajoute aucune dépendance.

## 2. Au `game-director` : `docs/vision/`

| Fichier | Lignes | Passage | Mise à jour attendue |
|---|---|---|---|
| `docs/vision/CONCEPTS.md` | 33 | « La lumière et l'eau (Lumen) » comme pari technique | Remplacer par « lumière et eau en rendu stylisé (brouillard, faisceau, grain, écume) » |
| `docs/vision/CONCEPTS.md` | 41, 49-52 | Pipelines photoréalistes ; « rendu le plus réaliste sous Unreal Engine 5 » ; 60 fps console ; Series S et Steam Deck dimensionnent le design | Note de révision : voie web, PC d'abord ; seul le **Steam Deck** reste une cible ; plus de Series S ni de 60 fps console |
| `docs/vision/CONCEPTS.md` | 57-88 | Références UE5 (Hellblade II, Clair Obscur), « Lumen, Nanite et MetaHuman » | Conserver comme leçons historiques de marché, mais retirer toute promesse de rendu équivalent |
| `docs/vision/CONCEPTS.md` | 108-109 | « Les plateformes ne diffèrent que par le rendu (qualité de Lumen…) » | Remplacer par les **trois niveaux de qualité** web (`low`, `medium`, `high`), qui ne changent que le coût visuel, jamais la logique |
| `docs/vision/PERIMETRE_SOLO.md` | 31, 92-98, 148 | « Photoréalisme à cette échelle », « Ce que devient le photoréalisme » | Mettre à jour : stylisé atmosphérique accepté (`DECISIONS.md`, 2026-11-23) ; ADR §6 donne la faisabilité par concept |
| `docs/vision/PERIMETRE_SOLO.md` | 48, 53-54, 100-104 | « Débutante en Unreal », « Les agents ne voient pas l'éditeur Unreal », « Propriétaire (dans Unreal et hors Unreal) » | Dépassé : **les agents font tout** ; le propriétaire joue, répond au questionnaire, valide les grandes décisions et crée les comptes |
| `docs/vision/PERIMETRE_SOLO.md` | 63, 80, 88, 90, 146 | Fab, Megascans, MetaHuman, scans | Sans objet en voie web (assets procéduraux ou CC0 accessibles par npm : ADR §6.1) |
| `docs/vision/DECISION_CONCEPT.md` | 20 | Style stylisé atmosphérique | Déjà à jour : rien à faire |

## 3. À la Coordination : `CLAUDE.md` et `studio/ORGANIGRAMME.md`

| Fichier | Lignes | Passage | Mise à jour attendue |
|---|---|---|---|
| `CLAUDE.md` | 8-10 | « Objectif du studio » : PC, PS5, Xbox, « graphismes les plus réalistes possibles », « 60 fps en mode performance sur console » | **PC d'abord (navigateur, puis Steam via Electron, Steam Deck)**, rendu stylisé atmosphérique, fluidité mesurée par `docs/tech/BUDGETS.md` ; consoles éventuelles plus tard |
| `CLAUDE.md` | 52-64 | « Stack technique de référence » : Unreal Engine 5, C++, Blueprints, Lumen, Nanite, MetaHuman, PSSR PS5 Pro ; « `game/` (projet Unreal) » | Remplacer par la pile de `ARCHITECTURE.md` §2 (three.js 0.187.0, esbuild 0.28.2, JavaScript ES2022 + JSDoc, `node --test`, Playwright) ; `game/` est un projet npm ; garder une ligne « Unreal : archive pour portage éventuel » |
| `CLAUDE.md` | 16 | « Situation actuelle » | Ajouter : « normes et budgets web : `docs/tech/` v2.0 » |
| `studio/ORGANIGRAMME.md` | 35 | `technical-director` : « Architecture C++/UE5 » | « Architecture web (three.js), normes JS, budgets » |
| `studio/ORGANIGRAMME.md` | 36 | `gameplay-programmer` : sauvegardes | Précision : JavaScript, entrées navigateur et manette (Gamepad API) |
| `studio/ORGANIGRAMME.md` | 37 | `graphics-programmer` : Lumen, Nanite, ombres, upscaling | Shaders GLSL three.js, niveaux de qualité, résolution dynamique, budgets d'appels de dessin |
| `studio/ORGANIGRAMME.md` | 38 | `platform-engineer` : PS5 / Xbox / PC, TRC/XR, trophées | Navigateur et Electron (Steam), succès Steamworks ; consoles hors périmètre initial |
| `studio/ORGANIGRAMME.md` | 39 | `online-engineer` : EOS, multijoueur, sauvegardes cloud | Jeu solo hors ligne : télémétrie et cloud non prévus (à confirmer) |
| `studio/ORGANIGRAMME.md` | 41, 44 | `art-director` : « standards de photoréalisme » ; `character-artist` : MetaHuman | Direction stylisée atmosphérique ; modèles simples, visages hors périmètre (ADR §6) |

Les fiches `.claude/agents/` relèvent de T-035 (liste en ADR §7.2), non traitée ici.
