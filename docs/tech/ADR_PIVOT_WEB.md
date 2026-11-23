# ADR : pivot vers une pile web 3D (T-027)

> **Auteur** : `technical-director` · **Date** : 2026-11-23 · **Statut** : proposé, à valider par la Boss
> **Remplace** : le choix d'Unreal Engine 5 de `ARCHITECTURE.md` (T-003) comme moteur de référence, par décision du propriétaire (`production/DECISIONS.md`, 2026-11-23, « Voie technique »).
> **Preuve** : `prototypes/estran-poc/` (voir `PIPELINE_WEB.md`).

## 0. Décision en bref

Moteur de rendu **three.js** en **WebGL2**, code en **JavaScript maintenant, TypeScript strict pour le vrai jeu**, build par **esbuild**, tests par **Playwright**. Sortie : un fichier HTML autonome. Aucune dépendance payante, tout est fabricable et testable par les agents dans le cloud. Prix : un rendu nettement plus modeste qu'Unreal (section 5).

## 1. Pile retenue, versions figées (critère 1)

| Rôle | Choix | Version exacte | Licence | Pourquoi |
|---|---|---|---|---|
| Rendu 3D | three.js | **0.187.0** | MIT | Le plus répandu, très documenté (les agents le connaissent bien), léger (le bundle complet du prototype fait 537 Kio), WebGL2 stable, pas d'éditeur nécessaire |
| API graphique | **WebGL2** | (navigateur) | n/a | Disponible partout, y compris en headless logiciel pour les tests. WebGPU est exclu pour l'instant (voir ci-dessous) |
| Langage | JavaScript ES2022 (PoC) ; **TypeScript strict** pour la production | TS à figer au démarrage de T-011 | n/a | TS rattrape les erreurs que personne ne verra à l'écran ; esbuild le compile sans changement de pipeline. Le PoC reste en JS pour rester minimal |
| Build | esbuild | **0.28.2** | MIT | Un seul binaire, quasi sans dépendances (3 paquets installés au total), build en moins d'une seconde, sortie IIFE inlinable dans un seul HTML. Vite serait pertinent seulement pour du rechargement à chaud, inutile pour des agents |
| Test navigateur | Playwright + Chromium | **1.63.0** (préinstallé dans la session) | Apache-2.0 | Déjà disponible ; capture et pilotage clavier |
| Gestionnaire | npm 10.9.9, Node 22.23.5 | verrou `package-lock.json` | n/a | Registre npm accessible depuis la session |

**Installable depuis les registres autorisés** : vérifié. `npm install --save-exact` a récupéré `three` et `esbuild` sans autre accès réseau. Les versions sont exactes (sans `^`) dans `prototypes/estran-poc/package.json`.

**Alternatives écartées**
- **WebGPU (three.js WebGPURenderer)** : meilleures performances et compute shaders, mais support navigateur encore inégal (notamment Linux, Firefox et Steam Deck selon versions), et **aucun moyen de le tester ici** (pas de GPU, SwiftShader ne le fournit pas de façon fiable). Un jeu non testable est un risque pour une équipe sans humain. À reconsidérer quand le test automatique sera possible ; three.js permet de migrer le rendu.
- **Babylon.js** : plus complet (physique, éditeur), mais plus lourd ; l'avantage ne justifie pas de quitter l'écosystème le mieux connu des agents.
- **Godot (export web)** ou **Unity** : exigent leur éditeur, difficile à piloter sans humain, et les formats de projet sont peu adaptés à l'écriture par agents.
- **PlayCanvas** : bon moteur, mais orienté éditeur en ligne (compte, réseau).

## 2. Prototype (critère 2)

`prototypes/estran-poc/` : scène nocturne d'ESTRAN, île procédurale, **eau dont le niveau suit une marée** (période accélérée de 90 s, de -0,60 m à +2,40 m), brouillard exponentiel, **phare avec faisceau tournant** (vrai `SpotLight` plus cône visible), **lampe du joueur** (`SpotLight` attaché à la caméra), **marche à la première personne** (ZQSD/WASD, souris, Maj, F pour la lampe, T pour accélérer la marée). Tout est procédural : aucun fichier d'asset.

Version jouable : `prototypes/estran-poc/dist/estran-poc.html`. Captures : `prototypes/estran-poc/captures/` (`estran-poc-joueur.png` est la vue principale).

**Franchise sur le résultat visuel** : c'est une preuve de faisabilité, pas une direction artistique. Le relief est lisse, l'eau est un plan à bosselage, les rochers sont des cônes, il n'y a ni ombres ni réflexions ni végétation. Ce qui est prouvé : les mécaniques (marée, faisceau, lampe, brouillard, déplacement) tournent et se testent seules.

## 3. Pipeline (critère 3)

Voir `PIPELINE_WEB.md` : `npm ci`, `npm run build`, `npm test`, exécutés avec succès. Publication faite par la Coordination, pas par ce document.

## 4. Budgets de performance et limites des mesures (critère 4)

### 4.1 Cibles proposées (à confirmer par mesure sur matériel réel)

| Cible | Résolution | Images/s | Temps de frame | Budget indicatif |
|---|---|---|---|---|
| PC milieu de gamme (GPU de classe GTX 1660 / RX 580 ou mieux, 4 coeurs) | 1080p | 60 | 16,6 ms | JS (logique et préparation du rendu) ≤ 5 ms ; GPU ≤ 11 ms |
| Steam Deck (APU, 800p, souvent 40 Hz ou 30 Hz verrouillés) | 1280x800 | 40 minimum, 60 visé | 25 ms (16,6 ms visé) | GPU ≤ 14 ms ; pas de résolution dynamique sous 0,6 |
| Commun | | | | ≤ 300 appels de dessin, ≤ 1 M triangles visibles, ≤ 30 lumières dynamiques actives (cible réelle : moins de 4 avec ombres), mémoire GPU ≤ 1 Go, JS heap ≤ 500 Mo |
| Chargement | | | | ≤ 10 s pour jouer, démarrage à froid du fichier unique ≤ 3 s en local |
| Poids du jeu web | | | | ≤ 100 Mo pour la version navigateur ; ≤ 500 Mo version Steam |

Ces chiffres sont des **objectifs de conception**, pas des mesures. Les budgets de `BUDGETS.md` (Unreal, consoles) ne s'appliquent plus.

### 4.2 Stratégies

Résolution dynamique, `setPixelRatio` plafonné à 2, instanciation pour la végétation et les rochers, éclairage cuit (lightmaps) pour l'intérieur fixe, une ou deux lumières dynamiques avec ombres au plus, fusion de géométries, compression de textures (KTX2/Basis) et de maillages (Draco/Meshopt), logique de marée en pur calcul (coût nul).

### 4.3 Limites des mesures faites dans le cloud

Le rendu est **logiciel (SwiftShader, CPU)**. Ce que la session a mesuré, environ **11 à 15 images/s à 960x540, 22 appels de dessin, 51 000 triangles**, **n'est pas représentatif** : il ne permet de conclure ni que la cible 60 fps est tenue, ni qu'elle ne l'est pas. Ce qui est valable ici : le **nombre d'appels de dessin et de triangles** (indépendant du GPU), la **taille du bundle**, la **correction fonctionnelle**, la **mémoire JS**. Ce qui ne l'est pas : temps de frame, coût des ombres, du brouillard, du remplissage d'écran, de la transparence, thermique du Steam Deck.
**Conséquence** : la première vraie mesure de performance exigera de faire jouer la version à quelqu'un sur un vrai PC, ce qui touche à la décision « le propriétaire ne fait rien » : voir section 5.3, point 1.

## 5. Distribution (critère 4, suite)

### 5.1 Voies envisagées

| Voie | Principe | Avantages | Limites |
|---|---|---|---|
| **itch.io en HTML5** | Archive ZIP de `dist/` (ou du fichier unique) téléversée | Gratuit, immédiat, bon pour démos et retours | Pas Steam ; performances navigateur ; pas de plein écran garanti ni de gestion fine de la manette selon navigateur |
| **Steam via Electron** | Application empaquetée (Chromium + Node) | Chemin le plus courant des jeux web sur Steam, API Steamworks via module natif communautaire | Installation lourde (plus de 100 Mo), WebGL2 selon pilote, maintenance des mises à jour de sécurité d'Electron |
| **Steam via Tauri** | Coque légère avec WebView du système | Petite taille | WebView hétérogène (WebKitGTK sous Linux/Steam Deck, WebView2 sous Windows) : **risque pour WebGL2**, plus de variations à tester. Moins recommandé pour un rendu 3D |

**Recommandation** : démos sur itch.io HTML5 (gratuit), version Steam en **Electron** (un seul moteur de rendu à tester, identique à celui des tests Playwright).

### 5.2 Compatibilité Steam Deck

Le Deck exécute des applications Linux via Proton ou en natif ; une application Electron Linux est possible. Le statut « Vérifié » dépend de critères de Valve (manette, lisibilité du texte, lancement sans réglage) que nous ne pouvons pas tester ici. Visé : « Jouable ».

### 5.3 Étapes qui exigent le propriétaire

| N° | Étape | Pourquoi seul lui | Coût |
|---|---|---|---|
| 1 | Premier test sur un vrai PC (ouvrir le fichier HTML, dire si c'est fluide, et idéalement renvoyer un rapport de performances produit par une page de test fournie) | Les agents n'ont pas de GPU | 0 euro, quelques minutes |
| 2 | Compte vendeur **itch.io** (si démo) | Identité | 0 euro |
| 3 | Compte **Steamworks**, identité, fiscalité, coordonnées bancaires, forfait de publication par jeu (à vérifier à la source par `business-affairs`) | Identité, argent, contrat | Frais Steam, à chiffrer par T-015/T-026 |
| 4 | Statut juridique pour vendre (déjà ouvert dans `DECISIONS.md`) | Obligation légale | Selon statut |
| 5 | Signature de code Windows (certificat) pour éviter les avertissements du système sur l'exécutable Electron ; sur macOS un compte développeur | Identité, paiement | Payant (hors budget actuel : à ne pas faire au départ, Steam gère l'installation) |
| 6 | Validation des grandes décisions (concept, prix, page Steam) et dépôt du dossier d'âge/contenu | Responsabilité éditoriale | 0 euro |
| 7 | Tests de jeu par des tiers avant sortie | Les agents ne remplacent pas des joueurs | 0 euro, temps |

Rien d'autre n'exige le propriétaire : build, tests, empaquetage et captures restent automatiques. Les téléversements vers Steam ou itch.io demandent ses identifiants ; ils ne seront jamais confiés aux agents sans accord explicite.

## 6. Faisabilité des 3 concepts et réalisme (critère 5)

Référence : `docs/vision/PERIMETRE_SOLO.md`. Avis technique, avec la pile web.

| Concept | Faisabilité web | Raison technique | Ce que devient le réalisme |
|---|---|---|---|
| **A. ESTRAN** | **Oui, la plus adaptée** | Marée = une valeur ; brouillard, faisceau et lampe sont des effets d'éclairage dont le prototype montre déjà les bases ; lieu petit ; menace presque invisible | Stylisé atmosphérique (low-poly éclairé, matériaux simples, grain, bruit de film). On peut gagner en réalisme avec lightmaps cuits, ombres sur une lumière, cubemap/réflexions planes pour l'eau, particules d'écume, textures CC0 de sable et de roche. **Pas de photoréalisme** type Lumen/Nanite |
| **B. DERNIÈRE POSITION CONNUE** | **Possible, plus risquée** | Neige, relief et végétation denses coûtent cher en navigateur ; animation de personnage à produire | Montagne stylisée, vue de loin, tempête de neige (le brouillard aide). Fragile de près |
| **C. AVEUX** | **Non en l'état** | Cœur = visages et performances d'acteurs : ni capture, ni MetaHuman dans cette pile | Réalisme des visages inatteignable ; une version stylisée en dessin ou en masque changerait la nature du concept |

**Recommandation technique** : ESTRAN reste le concept le plus faisable. Ce n'est qu'un avis technique, pas un Go/No-Go (T-004).

### 6.1 Origine des assets

| Source | Utilisable ? | Contraintes |
|---|---|---|
| **Procédural dans le code** (relief, eau, rochers, textures canvas, sons de synthèse WebAudio) | Oui, c'est le choix par défaut | Aucune licence, reproductible, léger. Le PoC n'utilise que cela |
| **Paquets npm sous licence permissive** (three.js MIT, esbuild MIT) | Oui | Consigner chaque paquet et sa licence dans `docs/legal/LICENCES.md` ; vérifier les dépendances transitives |
| **CC0** (textures, sons, modèles) | Oui **si accessible** | Les sites de dépôts d'assets sont en général **bloqués par le réseau de la session** (seul npm passe) ; il faut donc un paquet npm qui les contienne, ou une fourniture par le propriétaire (étape à ajouter à la liste ci-dessus). Ne pas contourner le blocage. Conserver la preuve de la licence (URL, date, hash) |
| **Générés par IA** (images, textures, voix, musique) | **Incertain** | Règles à fixer par T-024 (licence, déclaration Steam). Le serveur d'outils de génération éventuellement connecté n'est pas une source établie ni gratuite ; ne pas l'utiliser sans accord. Voix : pas de clonage d'une personne réelle sans consentement écrit |
| **Fournis par le propriétaire** | Oui | Preuve de droits à consigner |

## 7. Documents et fiches à mettre à jour (critère 6)

**Non modifiés par cette tâche : liste seulement.** À traiter dans une tâche de mise à jour dédiée (proposition : une tâche pour les trois documents `docs/tech/`, une pour les fiches d'agents).

### 7.1 Documents techniques

| Document | Action |
|---|---|
| `docs/tech/ARCHITECTURE.md` | À réécrire pour la pile web : modules TS (core, gameplay, rendu, audio, UI, sauvegarde, plateforme), boucle de simulation à pas fixe séparée du rendu, données (JSON), sauvegarde (IndexedDB/fichier), abstraction plateforme (navigateur / Electron). Marquer l'ancienne version comme archivée pour portage Unreal éventuel |
| `docs/tech/BUDGETS.md` | Remplacer les budgets Unreal et consoles par ceux de la section 4 ; supprimer Series S et PS5 ; ajouter mesure sur GPU réel |
| `docs/tech/NORMES_CODE.md` | Remplacer Unreal Coding Standard, GAS, Blueprints par normes TypeScript strict, ESLint/Prettier à figer, règles de rendu (pas d'allocation dans la boucle, libération des ressources GPU), tests |
| `docs/business/BUDGET*.md`, `ETUDE_MARCHE.md` | Mentions Unreal, consoles, MetaHuman à revoir (hors périmètre technique, à signaler à `business-affairs`) |
| `docs/vision/CONCEPTS.md`, `PERIMETRE_SOLO.md` | Le photoréalisme (Lumen, Nanite, MetaHuman) et la répartition « le propriétaire exécute dans Unreal » sont dépassés ; à signaler au `game-director` |
| `CLAUDE.md` (section « Stack technique » et « Objectif du studio ») et `studio/ORGANIGRAMME.md` | Moteur, plateformes (PC d'abord) et référence au réalisme à mettre à jour (Coordination) |
| `docs/legal/LICENCES.md` | Créer s'il n'existe pas : three.js (MIT), esbuild (MIT), Playwright (Apache-2.0, outil de test seulement) |

### 7.2 Fiches d'agents écrites pour Unreal (`.claude/agents/`)

| Fiche | Modification attendue |
|---|---|
| `technical-director` | Pile web, budgets web, normes TS |
| `graphics-programmer` | Lumen/Nanite/VSM/Substrate/PSO vers shaders GLSL three.js, éclairage cuit, LOD, instanciation, résolution dynamique |
| `gameplay-programmer` | C++/Blueprints/GAS/Enhanced Input vers TypeScript, entrées navigateur/manette (Gamepad API) |
| `technical-artist` | Niagara, matériaux Substrate, PCG vers shaders et générateurs procéduraux, budgets de textures |
| `environment-artist`, `level-designer` | Nanite/Megascans/PCG/World Partition vers génération procédurale et assets CC0 légers |
| `character-artist`, `animator` | MetaHuman, Control Rig, capture vers modèles low-poly, glTF, animations simples ; visages hors périmètre |
| `build-engineer` | UE5, Unreal Build Tool, Horde vers npm, esbuild, Playwright, CI, empaquetage Electron |
| `online-engineer` | Services en ligne Unreal vers API web, ou suppression (jeu solo) |
| `art-director`, `game-designer`, `narrative-designer`, `localization-manager`, `business-affairs`, `boss` | Mentions Unreal ou photoréalisme à ajuster (relecture légère) |
| `platform-engineer`, `qa-lead` | Consoles et certification hors périmètre ; QA : tests Playwright, performance sur matériel réel |
| `studio/equipe.json` | Pas de changement d'agents requis ; titres éventuellement à ajuster |

Fiches à ne pas modifier tant que la Boss n'a pas validé le pivot.

## 8. Risques et points à arbitrer

| Risque | Gravité | Atténuation |
|---|---|---|
| Rendu jugé insuffisant pour vendre | Élevée | Choisir une direction stylisée forte plutôt que de viser le réalisme ; vérifier tôt le marché pour ce niveau de rendu (T-004) |
| Performances inconnues sur vrai GPU | Moyenne | Étape 1 de §5.3 ; marges larges ; budgets de §4 |
| WebGL2 sous Steam Deck / Electron | Moyenne | Electron plutôt que Tauri ; test réel avant sortie |
| Les agents ne jugent pas la qualité visuelle autrement que par captures | Moyenne | Captures automatiques à chaque tâche relues par la Boss ; avis du propriétaire sur les grandes étapes |
| Enlisement des versions (three.js sort une version mineure presque chaque mois) | Faible | Versions figées, montée de version volontaire et testée |

**À arbitrer par la Boss** : (1) accepter le rendu stylisé comme niveau cible ; (2) accepter l'étape 1 de §5.3 (un test sur un vrai PC), seule intervention technique demandée au propriétaire ; (3) lancer la tâche de mise à jour des documents.
