# Architecture technique

| | |
|---|---|
| **Tâche** | T-003 : Choix techniques, architecture et budgets |
| **Auteur** | `technical-director` |
| **Version** | 1.1 du 2026-11-20 (parité §10.1, risques R-23 et R-24, tests S-9 et S-10) |
| **Statut** | Soumis à la validation de la Boss |
| **Documents liés** | [`BUDGETS.md`](BUDGETS.md) (budgets chiffrés) · [`NORMES_CODE.md`](NORMES_CODE.md) (normes de code) |
| **Documents aval** | `docs/tech/BUILD.md` (T-011), `docs/tech/PLATEFORMES.md` (T-012), `docs/tech/ONLINE.md` (T-018), `docs/tech/RENDU.md` (graphics-programmer, tâche à créer) |

## 0. Comment lire ce document

Ce document fixe les choix techniques qui engagent tout le projet. Il est **indépendant du concept** (T-001
n'est pas tranché) : les différences entre un jeu solo ou multijoueur, linéaire ou en monde ouvert, à la
première ou à la troisième personne sont regroupées dans la section 14, pour que `business-affairs` puisse
chiffrer chaque concept (T-015).

Chaque affirmation porte, si nécessaire, un niveau de certitude :

| Marqueur | Signification |
|---|---|
| **[Public]** | Spécification ou fait publié par le constructeur ou l'éditeur (Sony, Microsoft, Valve, Epic, NVIDIA...) |
| **[Secondaire]** | Information trouvée dans la presse spécialisée ou les forums, non confirmée sur la page officielle |
| **[Estimation TD]** | Valeur d'allocation ou ordre de grandeur fixé par le directeur technique, à recaler par la mesure |
| **[À mesurer]** | Hypothèse qui ne vaut rien tant qu'elle n'est pas mesurée sur le matériel cible |
| **[NDA]** | L'information existe dans la documentation confidentielle des plateformes. Elle n'est **ni inventée ni reproduite** ici |

**Ce qui n'a pas été vérifié** : rien n'a été compilé ni mesuré. L'environnement de travail n'a ni Unreal
Engine, ni GPU, ni kit de développement console. Les pages officielles d'Epic (`unrealengine.com`,
`dev.epicgames.com`, `forums.unrealengine.com`) n'étaient pas accessibles depuis l'environnement : l'état des
versions du moteur provient de résultats de recherche (presse et extraits des pages officielles). Il est à
reconfirmer par `build-engineer` au démarrage de T-011.

---

## 1. Résumé des décisions

| ID | Décision | Section |
|---|---|---|
| ADR-01 | Moteur : **Unreal Engine 5**, compilé depuis les sources | 2 |
| ADR-02 | Version : **la dernière 5.x stable au démarrage de la production**, soit **5.8.x** au 2026-11-20 (à confirmer). Gel du moteur à l'**Alpha (M3)** | 2.3 |
| ADR-03 | **Pas d'Unreal Engine 6** pour ce projet (accès anticipé annoncé pour fin 2027 seulement) | 2.4 |
| ADR-04 | Gestion de source : **Git + Git LFS avec verrous**, seuils de bascule vers Perforce évalués à chaque jalon et décision ferme à M2 | 8 |
| ADR-05 | Sept modules C++ : `PrjCore`, `PrjPlatform`, `PrjOnline`, `PrjRender`, `PrjGameplay`, `PrjUI`, `PrjEditor` (préfixe provisoire `Prj`) | 4 |
| ADR-06 | **C++ pour les systèmes, Blueprints pour le contenu**. Les valeurs d'équilibrage viennent des données | 5 |
| ADR-07 | Systèmes retenus : GAS, Enhanced Input, CommonUI, StateTree, World Partition, PCG, MetaSounds, Niagara, Chaos | 6 |
| ADR-08 | Rendu : Lumen, Nanite, Virtual Shadow Maps, TSR ; Lumen matériel ou logiciel **selon la mesure** par plateforme et par mode ; Substrate **conditionné à un test en M1** | 7 |
| ADR-09 | **La Xbox Series S est le plancher de contenu.** Le profil Steam Deck dérive du profil Series S | 7, BUDGETS |
| ADR-10 | Le code propre à une plateforme n'existe que dans `PrjPlatform`, `Config/` et `Platforms/` (dépôt séparé à accès restreint pour le code sous NDA) | 10 |
| ADR-11 | Les modes Qualité et Performance d'une console **partagent le même budget CPU** : la simulation est identique, seul le rendu change | BUDGETS §1 et §3 |
| ADR-12 | Plugins tiers : **liste blanche** tenue par le TD ; solution native d'UE5 par défaut | 6.3 |

---

## 2. Choix du moteur

### 2.1 Critères

L'objectif fixé par `CLAUDE.md` impose : rendu au niveau des productions UE5 actuelles, 60 fps en mode
Performance sur console, sortie simultanée PC, PS5 et Xbox Series, et une équipe petite (« AA haut de gamme »).

| Critère | Poids | Unreal Engine 5 | Unity 6 (HDRP) | Moteur maison | Godot 4 | O3DE / CryEngine | UE6 (accès anticipé) |
|---|---|---|---|---|---|---|---|
| Photoréalisme (GI dynamique, géométrie massive, humains numériques) | 5 | 5 : Lumen, Nanite, VSM, MetaHuman | 3 : HDRP solide, sans équivalent de Nanite ni de MetaHuman | 1 : hors de portée d'une petite équipe | 2 | 3 | 5 (supposé) |
| Support PS5 / Xbox Series | 5 | 5 : code plateforme fourni par Epic aux développeurs agréés | 4 | 1 | 2 : portages par des tiers | 2 | 1 : calendrier inconnu |
| Outils monde ouvert (streaming, PCG) | 3 | 5 : World Partition, PCG | 3 | 1 | 2 | 3 | 4 |
| Maturité, risque de production | 5 | 4 | 4 | 1 | 3 | 2 | 1 |
| Recrutement (vivier de talents) | 4 | 5 | 5 | 1 | 3 | 1 | 4 |
| Accès au code source | 3 | 5 : GitHub, pour les licenciés | 2 : payant | 5 | 5 | 5 | 5 |
| Coût de licence pour notre modèle (jeu premium) | 3 | 4 : redevance sur les revenus au-delà d'un seuil (conditions de l'EULA à vérifier par `business-affairs`, T-015) | 3 : abonnement par poste | 5 | 5 | 5 | 4 |
| **Score pondéré (sur 140)** | | **132** | **99** | **52** | **83** | **78** | **90** |

Les notes vont de 1 à 5 ; le score est la somme des notes multipliées par les poids (total des poids : 28).
UE6 obtient un score honorable sur le papier, mais ses deux notes de 1 (support console et maturité) sont
éliminatoires à elles seules (voir §2.4).

**Décision ADR-01 : Unreal Engine 5.** C'est le seul moteur qui coche à la fois le photoréalisme, les trois
familles de plateformes et la maturité de production, avec un vivier de recrutement large. Le moteur
maison est exclu pour une petite équipe. Unity reste crédible pour un jeu moins exigeant visuellement, mais
l'écart sur la géométrie massive et les humains numériques est un handicap direct pour notre argument de vente.

### 2.2 État des versions au 2026-11-20 [Secondaire]

| Version | État constaté | Source |
|---|---|---|
| 5.7 | Publiée fin 2025. Substrate et PCG passent « production-ready » | Annonce Epic (forum), GameFromScratch |
| 5.8 | Publiée le 17 juin 2026 (State of Unreal). Présentée par Epic comme **la dernière version majeure planifiée d'UE5**, avec l'option de publier une 5.9. Correctifs 5.8.1 à 5.8.4 publiés. Nouveautés citées : MegaLights « production-ready », « Lumen Lite » (qualité moyenne, en bêta), Mesh Terrain (expérimental), support de l'Advanced Shader Delivery de Microsoft contre le stutter sur PC, refonte partielle du précaching des PSO | Presse (PC Gamer, Wccftech, 80.lv, GamesBeat), extraits des notes de version |
| 5.9 | **En Preview** depuis le 9 novembre 2026, orientée outils IA (agents, MCP), WebAssembly / WebGPU, Lumen World Cache. Version finale annoncée pour 2027, sans date | 80.lv, Digital Production, Creative Bloq |
| UE6 | Accès anticipé visé « fin 2027 environ », version complète 12 à 18 mois plus tard | PC Gamer, GamesBeat, Pocket Gamer.biz |

Ces éléments viennent de résultats de recherche : les pages officielles d'Epic n'ont pas pu être ouvertes
depuis l'environnement. **La version exacte à utiliser est à confirmer** par `build-engineer` au démarrage
de T-011, sur les notes de version officielles.

### 2.3 Version retenue et politique de montée de version (ADR-02)

**Règle** : on démarre sur **la dernière version 5.x stable au démarrage de la production**, avec son dernier
correctif (`5.x.y`). Au 2026-11-20, c'est **5.8.x**. On n'utilise jamais une version Preview pour le projet.

**Cas de la 5.9** : si elle sort en version stable avant la fin de M1, on évalue la migration, parce qu'elle
sera probablement la dernière version d'UE5 et donc la plus longtemps maintenue. On ne migre que si
l'évaluation est positive (voir la procédure ci-dessous), car c'est une version très orientée outils IA, dont
on n'a pas besoin, et chaque version majeure apporte son lot de régressions.

| Phase | Ce qui est autorisé |
|---|---|
| M0 à fin M1 (préproduction) | Une montée de version mineure (par exemple 5.8 vers 5.9) après évaluation |
| M2 (Vertical Slice) | Une seule fenêtre de montée, **avant** le début de la réalisation du Vertical Slice. Moteur gelé pendant sa réalisation |
| M2 à M3 (production) | Correctifs `5.x.y` d'Epic et cherry-picks de correctifs ciblés. Une montée mineure seulement par décision de la Boss, sur un gain mesuré critique (par exemple la mémoire de la Series S) |
| **M3 Alpha à M5 Gold** | **Moteur gelé.** Seuls les cherry-picks de correctifs Epic, revus ligne à ligne par le TD |
| Après lancement | Pas de montée de moteur, sauf obligation plateforme (SDK minimal exigé par un constructeur) |

**Procédure d'évaluation d'une montée de version** (responsable : `build-engineer`, revue TD) :
1. branche dédiée, compilation de toutes les cibles et tests d'automatisation au vert ;
2. comparaison de performance sur les parcours de référence (voir `BUDGETS.md` §13) : aucune régression
   supérieure à 5 % sur le temps de frame ou la mémoire, sur chaque plateforme disponible ;
3. vérification des plugins de la liste blanche (section 6.3) sur la nouvelle version ;
4. coût plafonné à environ 2 semaines-personne [Estimation TD] ; au-delà, on reste sur la version courante ;
5. retour arrière possible tant que la branche n'est pas fusionnée.

**Compilation depuis les sources** : obligatoire. Les extensions plateforme des consoles ne sont fournies par
Epic qu'aux développeurs agréés par Sony et Microsoft, et elles s'intègrent à un moteur compilé depuis les
sources. Le moteur est stocké dans notre propre dépôt (branche « vendor » qui suit Epic). Les modifications
du moteur sont **minimales**, chacune liée à un ticket, marquée `PRJ_ENGINE_MOD` dans le code et inscrite dans
un registre (`docs/tech/ENGINE_MODS.md`, créé par `build-engineer`).

**Contrainte SDK** : chaque version d'UE est liée à des versions précises des SDK consoles, et les
constructeurs imposent des versions minimales à la soumission [NDA]. Le moteur gelé à l'Alpha doit donc
supporter le SDK exigé à la date de soumission prévue. `platform-engineer` surveille ce point (risque R-07).

### 2.4 Unreal Engine 6 (ADR-03)

UE6 est **exclu** pour ce projet. Avec un accès anticipé fin 2027 et une version complète 12 à 18 mois plus
tard [Secondaire], il arriverait en pleine production, sans garantie de support console ni de stabilité.
Des commentateurs anticipent une migration plus lourde que celle d'UE4 vers UE5 [Secondaire, non confirmé
par Epic]. On réévalue ce choix à M2 **uniquement** si la production ne démarre pas avant 2028.

---

## 3. Vue d'ensemble

```
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ CONTENU  game/Content                                                    │
 │ Blueprints de contenu, DataAssets, DataTables (depuis docs/design/data), │
 │ maps World Partition, Game Feature plugins (GF_*)                        │
 └───────────────▲───────────────────────────────▲──────────────────────────┘
                 │ sous-classes, données          │
 ┌───────────────┴──────────┐   ┌────────────────┴─────────┐   ┌────────────────────┐
 │ PrjUI                    │──►│ PrjGameplay              │   │ PrjEditor          │
 │ CommonUI, HUD, menus,    │   │ GAS, personnage, IA,     │   │ outils, imports,   │
 │ ViewModels               │   │ interactions, sauvegarde │   │ validateurs        │
 └───┬───────────┬──────────┘   └────────┬─────────────────┘   │ (éditeur seulement)│
     │           │                       │                     └────────────────────┘
 ┌───▼──────┐ ┌──▼──────────┐   ┌────────▼─────┐
 │PrjRender │ │ PrjOnline   │   │ PrjPlatform  │◄── seul module avec du code
 │scalabilité│ │ télémétrie, │──►│ succès, profils,│   propre à une plateforme
 │modes, PSO│ │ EOS, réseau │   │ sauvegardes  │   (+ Platforms/<P>/ sous NDA)
 └───┬──────┘ └──────┬──────┘   └──────┬───────┘
     └───────────────┴────────┬────────┘
                       ┌──────▼──────┐
                       │  PrjCore    │  types de base, interfaces, sous-systèmes,
                       └──────┬──────┘  Asset Manager, tags natifs, journalisation
                              ▼
                   Unreal Engine 5 (sources) + plugins de la liste blanche
```

Une flèche signifie « dépend de ». Le schéma est simplifié : le tableau du §4.2 fait foi pour la liste
complète des dépendances. Le graphe est **acyclique** et vérifié par `build-engineer` en CI
(une dépendance interdite dans un `.Build.cs` fait échouer la compilation de la revue).

---

## 4. Modules C++ (ADR-05)

### 4.1 Préfixe

`Prj` est un **nom de code technique provisoire**. Le nom de code définitif (2 à 4 lettres, jamais le titre
commercial, qui peut changer) est fixé **avant la première ligne de code** de T-011, puis ne change plus :
renommer un module après coup casse les chemins `/Script/<Module>.<Classe>` des assets et impose des
redirections. Dans tous les documents techniques, `Prj` désigne ce nom de code.

### 4.2 Découpage

| Module | Type | Phase de chargement | Dépend de (projet) | Contenu | Interdit |
|---|---|---|---|---|---|
| `PrjCore` | Runtime | `PreDefault` | aucun | Types communs, catégories de logs, tags de gameplay natifs, interfaces de services (télémétrie, succès, sauvegarde) implémentées ailleurs, Asset Manager du projet (`UPrjAssetManager`), paramètres (`UDeveloperSettings`), utilitaires | Toute dépendance vers un autre module du projet ; tout code de gameplay |
| `PrjPlatform` | Runtime | `PreDefault` | `PrjCore` | Couche d'abstraction plateforme (section 10) : utilisateurs et manettes, succès et trophées, présence et activités, stockage des sauvegardes, droits d'accès aux DLC, cycle de vie de l'application (suspension, reprise), clavier virtuel, retours haptiques | Logique de jeu ; dépendance vers `PrjGameplay` ou `PrjUI` |
| `PrjOnline` | Runtime | `Default` | `PrjCore`, `PrjPlatform` | Télémétrie (avec consentement), contexte de crash, intégration Epic Online Services et services en ligne d'UE, sessions et réseau si le concept est multijoueur (section 11) | Appels réseau bloquants ; envoi de données sans consentement |
| `PrjRender` | Runtime | `Default` | `PrjCore`, `PrjPlatform` | Bascule des modes Qualité et Performance, scalabilité, politique de résolution dynamique, préréglages PC, écran de préparation des shaders (PSO), réglages graphiques exposés à l'UI | Modifications du renderer du moteur (elles passent par le registre `PRJ_ENGINE_MOD`) |
| `PrjGameplay` | Runtime | `Default` | `PrjCore`, `PrjPlatform` (interfaces) | Personnage et caméra, Gameplay Ability System (capacités, effets, attributs), IA (StateTree, Smart Objects), interactions, inventaire, progression, logique de sauvegarde, modes de jeu | Dépendance vers `PrjUI` ; valeurs d'équilibrage en dur |
| `PrjUI` | Runtime | `Default` | `PrjCore`, `PrjGameplay`, `PrjPlatform`, `PrjRender` | Widgets CommonUI, HUD, menus, glyphes par plateforme, réglages d'accessibilité, ViewModels qui lisent l'état du gameplay | Modifier l'état du jeu autrement que par des commandes publiques du gameplay |
| `PrjEditor` | Editor | `Default` | tous | Outils de l'éditeur, import des CSV de design en DataTables, **validateurs de contenu** qui appliquent les budgets (`BUDGETS.md` §13), commandlets de CI, actions sur les assets | Être référencé par un module Runtime ; être packagé dans le jeu |

**Tests** : chaque module contient ses tests dans `Private/Tests/`, compilés seulement avec
`WITH_DEV_AUTOMATION_TESTS`. Les cartes de tests fonctionnels sont dans `Content/Tests/` et exclues du cook
de shipping. Les scripts Gauntlet (C#) sont dans `game/Build/Gauntlet/`. Détails dans `NORMES_CODE.md` §11.

**Principe d'inversion** : quand un module bas niveau doit être appelé par le gameplay (télémétrie, succès,
sauvegarde), l'**interface** est déclarée dans `PrjCore` ou `PrjPlatform`, et l'**implémentation** est un
sous-système (`UGameInstanceSubsystem`, `ULocalPlayerSubsystem`) du module spécialisé. Le gameplay ne dépend
jamais de `PrjOnline`. Les tests utilisent des implémentations factices.

### 4.3 Game Feature plugins

Les fonctionnalités **optionnelles ou découpables** sont des Game Feature plugins (`GF_<Nom>`) dans
`game/Plugins/GameFeatures/` : un mode de jeu annexe, un pack de contenu, un DLC, le mode multijoueur si le
concept en a un. Cela permet de les activer, de les désactiver et de les packager séparément (chunks
d'installation et de patch) sans toucher au cœur. Le cœur du jeu reste dans les modules ci-dessus : on ne
découpe pas en plugins par principe.

### 4.4 Arborescence cible de `game/` (à créer par T-011)

```
game/
├── Prj.uproject                  (nom provisoire)
├── Source/
│   ├── Prj.Target.cs             (jeu)
│   ├── PrjEditor.Target.cs       (éditeur)
│   ├── PrjServer.Target.cs       (seulement si serveur dédié, voir §14)
│   ├── PrjCore/      ├── Public/  ├── Private/  └── PrjCore.Build.cs
│   ├── PrjPlatform/  PrjOnline/  PrjRender/  PrjGameplay/  PrjUI/  PrjEditor/
├── Plugins/
│   └── GameFeatures/GF_<Nom>/
├── Platforms/                    (extensions plateforme : code et config consoles,
│   └── <Plateforme>/              dépôt séparé à accès restreint, voir §8.4 et §10)
├── Config/                       (DefaultEngine.ini, DefaultGame.ini, DefaultInput.ini,
│   ├── Windows/  Linux/           DefaultScalability.ini, DefaultDeviceProfiles.ini, Tags/)
├── Content/                      (arborescence fixée par la bible artistique, T-007)
└── Build/                        (BuildGraph, Gauntlet, scripts de CI)
```

---

## 5. Frontière entre C++ et Blueprints (ADR-06)

UE5 n'a plus de « nativisation » des Blueprints : tout Blueprint s'exécute dans la machine virtuelle, plus
lentement que du C++. La règle est donc simple : **les systèmes sont en C++, le contenu est en Blueprint**.

| En C++ (obligatoire) | En Blueprint (autorisé) | Interdit en Blueprint |
|---|---|---|
| Toute classe de base (personnage, contrôleur, composants, capacités, IA) | Sous-classes de contenu : réglages, références d'assets, variantes | Logique exécutée à chaque frame (Tick) sans dérogation du TD |
| Tout ce qui s'exécute à chaque frame ou sur de nombreux objets | Scénarisation de niveau ponctuelle (déclencheurs, séquences) | Boucles sur de nombreux éléments (plus d'une centaine d'itérations) |
| Réplication réseau, prédiction (si multijoueur) | Partie cosmétique des capacités (Gameplay Cues : sons, effets) | Logique systémique dans le Level Blueprint |
| Sauvegarde, plateforme, en ligne, rendu | Mise en page de l'UI (concepteur UMG), sans logique métier | Références dures vers des assets lourds (utiliser des références souples) |
| Définition des structures de données (`UPrimaryDataAsset`, structures des DataTables) | Graphes d'animation (Animation Blueprints) avec mise à jour thread-safe | Accès aux fichiers, au réseau, aux API plateforme |
| Tout calcul mathématique non trivial | Prototypage, avec une durée de vie limitée (ci-dessous) | Équilibrage en dur (les valeurs viennent des données) |

**Prototypes** : un prototype en Blueprint qui survit à deux sprints est soit migré en C++, soit justifié dans
la revue du TD. Il est migré d'office s'il coûte plus de 0,1 ms par frame en mode Performance, s'il est
réutilisé par plus de trois assets ou s'il gère un état persistant.

**Exposition aux designers** : le C++ expose ce qu'il faut et pas plus (`BlueprintCallable`,
`BlueprintImplementableEvent`, `BlueprintNativeEvent`, propriétés en `EditDefaultsOnly` et `BlueprintReadOnly`
par défaut). Règles détaillées dans `NORMES_CODE.md` §4 et §6.

### 5.1 Conception pilotée par les données

| Donnée | Format dans le moteur | Source | Outil |
|---|---|---|---|
| Équilibrage (dégâts, coûts, progression, économie) | DataTables et CurveTables | `docs/design/data/*.csv` (T-006) | Import automatisé par un commandlet de `PrjEditor`, lancé en CI : un CSV invalide fait échouer le build |
| Définitions (objets, capacités, ennemis, quêtes) | `UPrimaryDataAsset` gérés par l'Asset Manager | Éditeur | Validateurs de données |
| Identifiants transverses (états, capacités, événements, entrées) | Gameplay Tags (natifs en C++ ou dans `Config/Tags/`) | Design + code | Hiérarchie décrite dans `NORMES_CODE.md` §3 |
| Textes | `FText` dans des String Tables | T-008, T-017 | Pipeline de localisation (T-017) |
| Réglages par plateforme | Fichiers `.ini` et Device Profiles | Programmation | Revue du TD |

---

## 6. Systèmes UE5 retenus (ADR-07)

### 6.1 Tableau des systèmes

Statut indiqué tel que connu du TD ou trouvé dans les sources consultées ; il est **à revérifier
systématiquement** dans les notes de version de la version retenue (au démarrage de T-011).
**Règle** : une fonctionnalité **expérimentale** est interdite dans le jeu livré sans dérogation écrite du TD ;
une fonctionnalité en **bêta** est autorisée avec une entrée au registre des risques.

| Système | Usage chez nous | Statut moteur | Décision | Responsable |
|---|---|---|---|---|
| **Gameplay Ability System** | Capacités, effets, attributs, cooldowns, Gameplay Cues. Même en solo : structure pilotée par les données, réplication prête si besoin | Production (utilisé par Fortnite et Lyra) | Retenu | gameplay-programmer |
| **Enhanced Input** | Toutes les entrées, contextes de mapping par situation, remappage manette et clavier/souris | Production (l'ancien système d'entrées est déprécié) | Retenu, obligatoire | gameplay-programmer, ui-ux-designer |
| **CommonUI** | Navigation manette et souris, routage des entrées dans les menus, glyphes de boutons par plateforme | Utilisé en production par Epic (Lyra, Fortnite) ; statut officiel à vérifier | Retenu | ui-ux-designer, gameplay-programmer |
| **StateTree** + **Smart Objects** | IA et machines à états du gameplay ; Behavior Trees seulement pour un besoin précis | Production (à vérifier pour Smart Objects) | Retenu | gameplay-programmer |
| **World Partition** (One File Per Actor, Data Layers, HLOD, Level Instances) | Organisation de **tous** les niveaux, même en linéaire : un fichier par acteur réduit les conflits entre personnes | Production | Retenu | level-designer, TD |
| **PCG** | Habillage procédural (végétation, débris, dispersion), généré à l'édition par défaut. Génération à l'exécution seulement si mesurée | Production depuis 5.7 [Secondaire] | Retenu | environment-artist, technical-artist |
| **MetaSounds** | Audio procédural et mixage | Production | Retenu par défaut ; Wwise seulement si validé par la Boss (T-009) | audio-director |
| **Niagara** | Effets visuels | Production | Retenu | technical-artist |
| **Chaos Physics** | Physique, collisions, ragdolls ; Chaos Destruction selon le concept (coûteux) | Production | Retenu | gameplay-programmer |
| **Motion Matching** (Pose Search), **Control Rig**, **IK Rig**, **Animation Budget Allocator** | Locomotion, procédural, retargeting, limitation du coût d'animation | Production [Secondaire pour Motion Matching] | Retenu | animator, gameplay-programmer |
| **MetaHuman** | Personnages photoréalistes, avec LOD stricts (BUDGETS §5) | Production | Retenu | character-artist |
| **Asset Manager**, IoStore, Zen loader, chunking | Chargement asynchrone, bundles, découpage d'installation et de patch | Production | Retenu | TD, build-engineer |
| **Zen Server** (DDC partagé) | Cache des données dérivées partagé, cook incrémental | Production | Retenu | build-engineer |
| **Game Features** | Fonctionnalités découpables (§4.3) | Production | Retenu | TD |
| **Data Validation** | Validateurs qui appliquent les budgets de contenu | Production | Retenu | TD, technical-artist |
| **Automation Spec, Functional Tests, Gauntlet, Low Level Tests** | Tests (voir `NORMES_CODE.md` §11) | Production | Retenu | qa-lead, programmeurs |
| **Unreal Insights, CSV Profiler, LLM (Low Level Memory Tracker)** | Mesure du temps de frame et de la mémoire | Production | Retenu | TD, graphics-programmer |
| **Movie Render Queue** + path tracer | Cinématiques et images marketing hors temps réel | Production | Retenu | graphics-programmer |
| **Mass Entity** | Foules et circulation (monde ouvert seulement) | À vérifier | À évaluer selon le concept | gameplay-programmer |
| **Mover** | Alternative au `CharacterMovementComponent` | Non confirmé pour 5.8 | **Écarté par défaut** : `CharacterMovementComponent`. Réévalué seulement si multijoueur | gameplay-programmer |
| **Gameplay Cameras** (plugin) | Système de caméra | À vérifier | À évaluer en M1 ; caméra C++ maison par défaut (`APlayerCameraManager` et modes) | gameplay-programmer |
| **Iris** (réplication) | Réplication à grande échelle | À vérifier | Seulement si multijoueur, évaluation en M1 | online-engineer |
| **Online Services** (OSSv2) et **Epic Online Services** | Services en ligne multiplateformes | À vérifier par plateforme | Décision dans T-018 | online-engineer |
| **Mesh Terrain** | Terrains 3D | Expérimental en 5.8 [Secondaire] | **Écarté** (Landscape classique) | environment-artist |
| Éclairage précalculé (Lightmass) | GI précalculée | Production | **Écarté** : deux chaînes d'éclairage coûtent trop cher. Repli seulement si Lumen est intenable sur Series S et Steam Deck, décision à M2 | graphics-programmer |

### 6.2 Systèmes de base du code

Sous-systèmes (`UGameInstanceSubsystem`, `UWorldSubsystem`, `ULocalPlayerSubsystem`) plutôt que des
singletons ou des acteurs « manager » placés dans les niveaux. Les objets nombreux (projectiles, objets
interactifs, PNJ en arrière-plan) sont mis à jour par un sous-système gestionnaire en une seule boucle,
plutôt que par un Tick par acteur. Le Significance Manager règle la fréquence de mise à jour selon la
distance et la visibilité.

### 6.3 Plugins tiers : liste blanche (ADR-12)

Un plugin tiers n'entre dans le projet que s'il a : une licence compatible avec la vente commerciale
(consignée dans `docs/legal/LICENCES.md`), un support des consoles documenté ou un usage limité au PC, un
mainteneur actif, et un plan de repli. Liste initiale :

| Plugin | Usage | Plateformes | Repli | Statut |
|---|---|---|---|---|
| NVIDIA DLSS (et frame generation) | Upscaling PC | PC NVIDIA RTX | TSR | À intégrer, licence à consigner |
| AMD FSR | Upscaling PC et Steam Deck | PC, Steam Deck | TSR | À intégrer, licence à consigner |
| Intel XeSS | Upscaling PC | PC | TSR | À intégrer, licence à consigner |
| PSSR | Upscaling PS5 Pro | PS5 Pro | TSR | Via le SDK Sony [NDA] |
| Plugin Git pour l'éditeur | Verrous et état des fichiers dans l'éditeur | Éditeur | Client Git externe | **À évaluer en M1** (§8.3) |
| Wwise | Audio | Toutes | MetaSounds | Seulement si validé par la Boss (T-009) |
| Backend de crash (Sentry, Backtrace...) | Remontée des crashs | Toutes | Crash Reporter d'UE seul | Choix dans T-011 et T-018 |

**DRM tiers** : le TD recommande de **ne pas** utiliser de DRM tiers (coût en performance et en stabilité).
Décision commerciale à prendre par la Boss avec `marketing-publishing` et `business-affairs`.

---

## 7. Pipeline de rendu réaliste, en grandes lignes (ADR-08, ADR-09)

Le détail (variables de console, profils, mesures) sera dans `docs/tech/RENDU.md`, rédigé par
`graphics-programmer`. Ce qui suit fixe les **orientations** ; les cases marquées « mesure M1 » sont
tranchées par le test de la section 16.

| Plateforme et mode | GI et réflexions | Ombres | Géométrie | Lumières locales | Cheveux | Upscaling | Sortie |
|---|---|---|---|---|---|---|---|
| PS5 / Series X, Qualité 30 fps | Lumen **matériel** si la mesure M1 le permet, sinon logiciel en qualité haute | VSM | Nanite | MegaLights | Strands pour les personnages principaux | TSR | 4K, HDR |
| PS5 / Series X, Performance 60 fps | Lumen logiciel (ou matériel si la mesure M1 le permet : Epic annonce des progrès à 60 Hz depuis 5.6 [Secondaire]) | VSM, résolution réduite | Nanite | MegaLights limité | Cartes, strands en gros plan | TSR | 4K, HDR |
| PS5 Pro (optionnel) | Lumen matériel | VSM | Nanite | MegaLights | Strands | PSSR [NDA] | 4K, HDR |
| Series S, Qualité 30 fps | Lumen logiciel, qualité basse ou moyenne (« Lumen Lite » si disponible et mesuré) | VSM, pool de pages réduit | Nanite | Peu de lumières ombrées | Cartes | TSR | 1440p, HDR |
| Series S, Performance 60 fps | Lumen logiciel au plus bas, ou « Lumen Lite » | VSM réduites | Nanite | Très peu de lumières ombrées | Cartes | TSR | 1080p, HDR |
| Steam Deck, 30 fps | Dérivé du profil Series S Performance (mesure M1) | Selon mesure | Nanite | Minimum | Cartes | TSR ou FSR | 800p |
| PC, préréglages Bas à Épique | Lumen logiciel, puis matériel à partir d'« Élevé » sur GPU compatible | VSM | Nanite | MegaLights | Selon préréglage | DLSS, FSR, XeSS, TSR ; frame generation optionnelle | Jusqu'à 4K, HDR |

Règles transverses :
- **Résolution dynamique** obligatoire sur console, pilotée par le budget GPU (`BUDGETS.md` §3).
- **Frame generation** : PC uniquement, optionnelle, **jamais comptée** dans les objectifs de fréquence.
- **Substrate** : « production-ready » depuis 5.7 [Secondaire], mais changer de système de matériaux en cours
  de production coûte très cher. On le teste en M1 sur les profils Series S et Steam Deck ; la décision est
  prise **avant la production des matériaux définitifs**, et elle est irréversible ensuite (risque R-22).
- **Stutter** : précaching des PSO activé dès la création du projet, cache de PSO groupé collecté
  automatiquement, Advanced Shader Delivery sur PC si disponible dans notre version et mesuré, budget de
  permutations de shaders (`BUDGETS.md` §5). Risque R-01.
- **Textures** : streaming partout sauf l'UI ; Virtual Texturing pour le terrain et les grandes surfaces ;
  compression Oodle Texture (RDO) pour réduire la taille d'installation.
- **Atmosphère** : Sky Atmosphere, nuages volumétriques et brouillard volumétrique, réglés par profil.

---

## 8. Gestion de la source (ADR-04)

### 8.1 Options comparées

| Critère | Git + Git LFS | Perforce P4 (ex-Helix Core) | Unity Version Control (ex-Plastic) | Diversion |
|---|---|---|---|---|
| Gros binaires (assets photoréalistes) | Bon : seuls les fichiers de la révision courante sont téléchargés | Excellent, référence de l'industrie | Bon | Bon |
| Verrous exclusifs des `.uasset` / `.umap` | Oui (`git lfs lock`), discipline nécessaire | Natif (checkout exclusif) | Natif | Oui |
| Intégration à l'éditeur UE | Plugin Git d'Epic (bêta selon des sources anciennes) ou plugin communautaire (dernière version publiée en 2023 [Secondaire]) : **à évaluer** | Native, mature | Plugin | Plugin |
| UnrealGameSync et Horde (binaires précompilés pour les artistes) | Non : à remplacer par des binaires d'éditeur publiés par la CI | Oui, conçus pour Perforce | Non | Non |
| Compatibilité avec le studio IA actuel (agents, backlog, revues, CI) | **Totale** : tout le studio fonctionne déjà en Git | Faible : chaîne coupée en deux | Faible | Faible |
| Revue de code ligne à ligne (rôle du TD) | Pull requests | Swarm (à partir de 3 utilisateurs) | Intégrée | Intégrée |
| Gratuité initiale | Selon l'hébergeur | Jusqu'à 5 utilisateurs et 20 espaces de travail [Public, page tarifaire Perforce] | Palier gratuit limité | Palier gratuit limité |
| Coût à 12 personnes (estimation, hors temps d'administration) | Environ 60 à 400 $ par mois de stockage et de transfert LFS selon la phase, plus les postes de l'hébergeur (détail en 8.2) | Environ 470 $ par mois avec l'offre cloud affichée à 39 $ par utilisateur et par mois [Public, à vérifier] ; offre sur site sur devis | Sur devis | Sur devis |
| Courbe d'apprentissage des artistes | Moyenne (client graphique et règles de verrouillage) | Faible pour les profils venant de l'AAA | Faible | Faible |
| Risque fournisseur | Très faible (standard ouvert) | Faible | Moyen | Moyen à élevé (jeune société) |

### 8.2 Décision : Git + Git LFS

**Justification** :
1. **Toute la chaîne du studio est déjà en Git** : agents, backlog, validations de la Boss, revue de code
   par pull request, CI prévue par `build-engineer`. Mettre le jeu dans Perforce couperait cette chaîne en
   deux, alors que les agents écrivent une grande partie du code et de la documentation.
2. **L'équipe démarre petite.** Le palier gratuit de Perforce (5 utilisateurs, 20 espaces de travail) serait
   dépassé dès que l'on compte les machines de build et les postes de test, qui consomment chacun des espaces
   de travail. À 12 personnes, les deux solutions coûtent un ordre de grandeur comparable : le critère
   décisif est donc le flux de travail, pas le prix.
3. **World Partition en un fichier par acteur** réduit fortement les conflits sur les cartes, principal point
   faible historique de Git sur les projets Unreal.
4. T-011 prévoit déjà Git LFS dans ses critères d'acceptation : cette décision est cohérente avec le backlog.

**Coût estimé** [Estimation TD, tarifs publics de GitHub constatés le 2026-11-20 : 0,07 $ par Gio et par mois
de stockage LFS, 0,0875 $ par Gio de transfert, au-delà des quotas inclus] :

| Phase | Stockage LFS (historique compris) | Transfert mensuel | Coût LFS mensuel estimé |
|---|---|---|---|
| M1 et M2 (équipe de 5 à 8) | 150 Gio | 600 Gio | environ 60 $ |
| Pic de production (10 à 15 personnes) | 1,5 Tio | 3 Tio | environ 370 $ |

À ces montants s'ajoutent les abonnements par utilisateur de l'hébergeur (offre à choisir par
`build-engineer`). Un **cache LFS local** sur les machines de build réduit fortement le transfert. Une
alternative auto-hébergée (Forgejo, Gitea ou GitLab avec stockage objet) coûte surtout du temps
d'administration : à comparer dans T-011.

**Conditions obligatoires** (à mettre en place dans T-011) :
- `.gitattributes` : tous les binaires en LFS ; `.uasset` et `.umap` marqués `lockable` ;
- **verrou avant toute modification** d'un binaire, vérifié par un hook côté client et par la CI ;
- binaires de l'éditeur **compilés par la CI** et récupérés par un script : les artistes et designers ne
  compilent jamais le C++ ;
- branche principale protégée, fusion par pull request, CI verte obligatoire ;
- évaluation en M1 du plugin Git de l'éditeur (celui d'Epic et l'alternative communautaire) : si aucun n'est
  fiable sur notre version, les verrous passent par un client externe, avec une procédure documentée.

**Impact sur l'équipe** : une demi-journée de formation pour chaque artiste et designer (verrous, client
graphique, récupération des binaires), une discipline de verrouillage à faire respecter, et du temps de
`build-engineer` pour l'outil de récupération des binaires, qui remplace UnrealGameSync.

### 8.3 Seuils de bascule vers Perforce

Ces indicateurs sont relevés à chaque revue de jalon. **La décision ferme est prise à M2** (Go production),
avant la montée en charge du contenu. Si **deux seuils ou plus** sont franchis, on migre vers Perforce P4 :

| Indicateur | Seuil |
|---|---|
| Personnes produisant régulièrement des binaires | Plus de 12 |
| Volume LFS de la révision courante | Plus de 400 Gio, ou un clone initial de plus de 3 h sur une liaison à 1 Gbit/s |
| Pertes de travail dues à un conflit sur un binaire malgré les verrous | 2 incidents ou plus par mois |
| Partenaire externe (portage, co-développement, sous-traitance d'art) | Exigence contractuelle de Perforce |
| Coût mensuel LFS | Supérieur au coût équivalent de Perforce |

Coût d'une migration [Estimation TD] : 2 à 4 semaines-personne de `build-engineer` et une semaine de
transition pour l'équipe. On importe un instantané ; l'historique Git reste consultable en lecture seule.

### 8.4 Dépôts

| Dépôt | Contenu | Accès |
|---|---|---|
| Dépôt du studio (celui-ci) | `docs/`, `production/`, `studio/`, `.claude/`, `game/` (jeu, hors code sous NDA) | Équipe et agents |
| Dépôt du moteur | Fork des sources d'Unreal Engine (branche vendor + `PRJ_ENGINE_MOD`) | Programmeurs, CI. Licence Epic : jamais public |
| Dépôt plateformes | `game/Platforms/<Console>/` et extensions consoles du moteur, SDK exclus | **Seules les personnes couvertes par les NDA des plateformes.** Les agents IA en sont exclus tant que les accords ne l'autorisent pas explicitement (risque R-17) |

---

## 9. Sauvegardes

| Aspect | Décision |
|---|---|
| Format | Classes `USaveGame` séparées : **profil** (réglages, accessibilité, une par utilisateur) et **progression** (emplacements). Champs marqués `SaveGame` |
| Références | Jamais de pointeur d'objet sérialisé : identifiants stables (`FGuid`, `FPrimaryAssetId`, Gameplay Tags) |
| Versionnage | Version de format explicite (`FCustomVersion`) et fonctions de migration testées en CI pour chaque version publiée |
| Écriture | **Asynchrone** via l'interface de stockage de `PrjPlatform` (qui encapsule `ISaveGameSystem`). Écriture d'un fichier temporaire, vérification, puis remplacement. Somme de contrôle et deux copies de secours en rotation |
| Coût | Sérialisation sur le game thread : 2 ms au plus, le reste en tâche de fond. Pas de sauvegarde automatique pendant un pic de streaming ou un combat |
| Taille | Profil 256 Kio au plus ; progression 2 Mio au plus en linéaire, 8 Mio au plus en monde ouvert [Estimation TD] |
| État du monde (monde ouvert) | Seules les différences avec l'état initial sont sauvegardées, indexées par l'identifiant persistant de l'acteur |
| Nuage | Géré par les plateformes (Steam Cloud, services Sony et Microsoft) ; progression croisée seulement si décidée dans T-018 |
| Tests | Corruption simulée, coupure de courant pendant l'écriture, migration depuis chaque version, quota plein |

---

## 10. Couche d'abstraction plateforme

**Règle (ADR-10)** : rien de spécifique à une plateforme en dehors de `PrjPlatform`, des fichiers `Config/`
(dont les Device Profiles) et du dossier `Platforms/`. Les macros de plateforme (`PLATFORM_*`) sont interdites
partout ailleurs dans le code du projet, vérification automatique en CI. Les gardes de configuration de build
(`WITH_EDITOR`, `UE_BUILD_SHIPPING`) ne sont pas concernées.

| Service | Interface (dans `PrjPlatform`, ou `PrjCore` si appelée par le gameplay) | Implémentation |
|---|---|---|
| Utilisateurs, connexion, changement d'utilisateur, association des manettes | `IPrjUserService` | Services en ligne d'UE et API plateforme |
| Succès et trophées | `IPrjAchievements` | Steam, EOS, Xbox, PlayStation ; liste dans `docs/tech/SUCCES.md` (T-012) |
| Présence, activités, aide en jeu (PS5) | `IPrjPresence` | API plateforme [détails NDA] |
| Stockage des sauvegardes | `IPrjSaveStorage` | `ISaveGameSystem` de chaque plateforme |
| Droits (DLC, éditions) | `IPrjEntitlements` | Boutiques |
| Cycle de vie (suspension, reprise, Quick Resume, perte de focus) | Délégués d'application relayés par `PrjPlatform` | Moteur et plateforme |
| Clavier virtuel, interface système | `IPrjSystemUI` | Plateforme |
| Retours haptiques, gâchettes adaptatives | Propriétés de périphérique d'entrée d'UE, exposées par `PrjPlatform` | Moteur et plateforme |
| Glyphes de boutons | Données CommonInput par plateforme | `PrjUI` |
| Contrôle parental, âge | `IPrjUserService` | Plateforme |

En éditeur et sur PC sans boutique, une **implémentation nulle** permet de tout tester. Le code consoles
(dossier `Platforms/<Console>/Source/`) est dans le dépôt à accès restreint (§8.4). Les exigences de
certification (TRC de Sony, XR de Microsoft) sont sous NDA : `platform-engineer` en tire une checklist
générique dans T-012, sans en reproduire le contenu.

### 10.1 Règle de parité (Series S, Steam Deck et toutes les plateformes)

**Règle (ADR-10 bis)** : les plateformes et leurs profils (Series S, Steam Deck, Series X, PS5, PC) **ne
peuvent différer que par le rendu** (résolution, qualité des effets, niveau de détail, résolution des textures et
des ombres, technique de reflets, mode de cheveux, fréquence d'image). Elles ne diffèrent **jamais par une
information utile au jeu** : ce que le joueur peut voir, entendre ou en déduire pour décider.

**Conséquence : la logique de jeu ne dépend jamais des réglages de rendu.** Visibilité et détection des ennemis,
position, portée et zones d'ombre du faisceau, bruit, brouillard qui masque, éclairage de la lampe comme
condition de jeu : tout cela est calculé à partir de **données de jeu** (volumes, tracés de collision, paramètres
d'un Data Asset, état de la simulation), jamais lu dans le résultat du rendu (pas de lecture du tampon de
brouillard, des cartes d'ombre ni de la luminosité d'un pixel). Le rendu **illustre** l'état de jeu ; il ne le
**décide** pas.

Application :
1. **Interdits dans le code de jeu** : lire un niveau de scalabilité, une variable de console de rendu,
   un Device Profile, ou tester la plateforme (déjà interdit hors `PrjPlatform`, ci-dessus). Vérification
   automatique en CI (recherche de ces appels dans `PrjGameplay`, `PrjCore`, `PrjOnline`).
2. **Un levier de budget (`BUDGETS.md`) n'a le droit de toucher que du rendu pur.** Un levier qui masque,
   atténue ou retire un élément utile au jeu (ombre d'un obstacle qui protège le joueur, monstre dans le
   brouillard, faisceau, expression de visage porteuse d'information) s'applique à toutes les plateformes ou à
   aucune. Les profils bas ne peuvent réduire que la **finesse** (grille du brouillard, résolution d'ombre, LOD),
   pas la **portée** ni la **densité** équivalentes en jeu.
3. **Aucune information ne passe uniquement par un effet facultatif** (reflet, particule décorative, flou de
   mouvement) : si elle est utile, un second canal (son, interface, silhouette) existe.
4. **La logique ne dépend pas de la fréquence d'image ni de la résolution dynamique** : pas de pas de temps
   variable non borné pour la logique, pas de test de visibilité à l'écran.
5. **Tests** : (a) test automatisé qui rejoue la même graine de simulation à deux niveaux de scalabilité
   (profil Series S et profil PC haut) et exige un journal d'état de jeu identique (détections, zones sûres,
   événements de bruit) ; (b) test de lisibilité visuel : captures comparées au profil le plus bas, où chaque
   élément utile doit rester visible à la même distance (à une tolérance fixée par le `art-director`) ;
   (c) revue de parité à chaque levier ajouté dans les Device Profiles.
6. **Cas particulier de la Series X et S** : mêmes modes de jeu, mêmes fonctionnalités (voir plus bas, R-18).

Les budgets des cas pires (`BUDGETS.md` §14.1) appliquent cette règle levier par levier.

**Parité Xbox Series X et S** : Microsoft demande, dans sa documentation développeur, des modes de jeu
identiques sur les deux consoles [Public, via la presse ; texte exact à vérifier]. Aucune fonctionnalité de
gameplay ne doit donc être impossible sur Series S (par exemple un écran partagé à quatre joueurs). Risque R-18.

---

## 11. Services en ligne (frontière avec T-018)

- **Solo** : le jeu est **entièrement jouable hors ligne**. En ligne : succès, sauvegardes dans le nuage
  (par les plateformes), télémétrie avec consentement, remontée des crashs. Aucune fonctionnalité
  bloquante ne dépend du réseau.
- **Multijoueur** : voir la section 14.1.
- Tout le réseau passe par `PrjOnline`. Aucun appel bloquant. La perte du réseau est un cas normal, testé.
- Choix des services (EOS, Steamworks, services des plateformes), coûts, RGPD et stratégie de patch :
  `online-engineer`, T-018.

---

## 12. Exécution, chargement et streaming

- **Aucun chargement synchrone en jeu.** Tout passe par l'Asset Manager (bundles) et le `FStreamableManager`.
  Les écrans de chargement sont les seuls moments où un blocage est toléré.
- **World Partition** pour tous les niveaux : cellules de streaming, HLOD, Data Layers. Les distances de
  chargement sont fixées par le budget de streaming (`BUDGETS.md` §7).
- **Tick** : désactivé par défaut sur toutes les classes. Les objets nombreux sont mis à jour par des
  sous-systèmes. Intervalles de tick et Significance Manager pour le reste.
- **Multithread** : animation en tâches parallèles (mise à jour thread-safe des Animation Blueprints),
  physique Chaos, Niagara, décompression. Le game thread ne fait que la logique.
- **Ramasse-miettes** : peu d'objets temporaires, réutilisation (pools) pour les objets fréquents ; budget de
  pause dans `BUDGETS.md` §3.
- **Installation et patchs** : IoStore et compression Oodle. Découpage en chunks par Primary Asset Labels,
  compatible avec l'installation progressive des consoles [détails NDA].

---

## 13. Outillage, build et CI (frontière avec T-011)

| Élément | Orientation | Responsable |
|---|---|---|
| CI | Pipeline par pull request (compilation éditeur et jeu, tests, validation des données) et pipeline nocturne (cook, packaging, tests de performance). Outil choisi par `build-engineer` (par exemple GitHub Actions avec des machines auto-hébergées, TeamCity ou Jenkins). Horde, conçu autour de Perforce, n'est pas retenu par défaut | build-engineer |
| Machines de build | Au moins 2 machines dédiées : 32 cœurs ou plus, 128 Go de RAM, SSD NVMe de 4 To ou plus, GPU compatible ray tracing pour les tests de rendu [Estimation TD] | build-engineer, humain (achat) |
| DDC | Zen Server partagé sur le réseau du studio, cache local sur chaque poste | build-engineer |
| Poste de développement | 16 cœurs, 64 Go de RAM (128 Go pour l'environnement et l'éclairage), GPU de la classe RTX 4080 / 5080 ou équivalent, 2 To NVMe [Estimation TD] | humain (achat) |
| PC de référence (proxy console) | Avant l'accès aux kits : CPU Zen 2 à 8 cœurs et GPU RDNA 2 proche de la PS5 (par exemple une Radeon RX 6700 10 Go). **Indicatif seulement**, ne remplace pas les kits | graphics-programmer |
| Kits de développement | PS5, PS5 Pro (optionnel), Xbox Series X et S, Steam Deck. Accès, prix et conditions par les programmes constructeurs [NDA] | platform-engineer, humain |

**Limite de l'environnement des agents** : les agents IA écrivent du code sans pouvoir le compiler (pas
d'Unreal dans l'environnement cloud). Tant que la CI sur machine réelle n'existe pas, aucun code n'est
considéré comme vérifié (risque R-16).

---

## 14. Points de variation selon le concept

Base de référence pour les budgets : **solo, linéaire ou semi-ouvert, troisième personne**. Les surcoûts
ci-dessous sont des **ordres de grandeur du TD** pour la programmation, à convertir en budget par
`business-affairs` (T-015). L'équipe de programmation de référence est estimée à **6 à 8 personnes au pic** :
TD, 2 à 3 gameplay, 1 rendu et moteur, 1 outils et build, 1 plateformes (à plein temps à partir de M2),
1 UI, une demi-personne en ligne et télémétrie.

### 14.1 Solo ou multijoueur

| | Solo | Coopératif en ligne (2 à 4 joueurs) | Compétitif (PvP) |
|---|---|---|---|
| Architecture | Base | Réplication dans tout le gameplay (GAS en mode répliqué), prédiction côté client, `PrjOnline` complet, sessions EOS, serveur hôte (listen server) ou relais | Serveurs dédiés (`PrjServer.Target.cs`, builds Linux), anti-triche (Easy Anti-Cheat), matchmaking, classements, live ops |
| Budgets | Base | Game thread +1 ms environ (réseau) ; tests de bande passante | Game thread du serveur, tick rate, bande passante ; budget serveur par joueur |
| Équipe de programmation | Base | +2 programmeurs réseau de M1 au lancement ; effort de programmation multiplié par 1,35 à 1,5 | +3 à 4 programmeurs (réseau, backend, live ops) ; effort multiplié par 1,8 à 2,2 |
| QA | Base | +30 à 50 % | +60 à 100 % |
| Coûts récurrents | Quasi nuls | Faibles avec un hôte joueur et les services EOS [coûts à vérifier dans T-018] | **Élevés** : hébergement de serveurs, exploitation, modération |
| Risques | — | R-19 | R-19 critique, plus le risque commercial de population de joueurs |
| Recommandation TD | Préféré | Acceptable si c'est le cœur du concept, en **listen server** | **Déconseillé** pour une petite équipe |

À noter : sur console, le multijoueur en ligne demande en général un abonnement payant du joueur [Public,
conditions des constructeurs], ce qui touche l'argument de vente.

### 14.2 Monde ouvert ou linéaire

| | Linéaire | Hubs semi-ouverts | Monde ouvert |
|---|---|---|---|
| Architecture | World Partition avec quelques cellules par niveau, écrans de transition | World Partition et HLOD par hub | World Partition à grande échelle, HLOD à plusieurs niveaux, PCG massif, Mass pour les foules, navigation en streaming, état du monde persistant |
| Budgets | Base : contrôle fin du contenu de chaque scène | Streaming moyen | Streaming et mémoire plus tendus (surtout Series S) ; vitesse de traversée à budgéter ; installation multipliée par 1,5 à 2 |
| Équipe de programmation | Base | +0,5 personne (outils) | +1 programmeur outils et monde, +1 IA et foules ; effort multiplié par 1,3 à 1,5 |
| Contenu (hors programmation, indicatif) | Base | ×1,3 à 1,6 | ×1,8 à 2,5 |
| Build | Base | Cook +30 % | Cook ×2, taille d'installation et de patch plus élevée |
| QA | Base | +20 % | +40 à 60 % |

### 14.3 Première ou troisième personne

| | Troisième personne | Première personne |
|---|---|---|
| Architecture | Corps complet toujours visible : Motion Matching, caméra avec collisions, personnage principal MetaHuman (cheveux, vêtements simulés) | Bras et arme avec rendu dédié (champ de vision propre), corps complet optionnel ; caméra sans collision complexe |
| Budgets | Personnage principal : 1 à 1,5 ms de GPU (cheveux, peau, vêtements) | Bras : 0,5 ms environ ; latence d'entrée encore plus critique ; options contre le mal des transports (champ de vision) |
| Équipe | Animation et mocap plus lourdes | Animation des bras et des armes très détaillée, moins de locomotion |
| Effort de programmation | Base | 0,9 à 0,95 fois la base |

---

## 15. Registre des risques techniques

Échelles : probabilité (P) et impact (I) de 1 à 5. Criticité C = P × I. **Critique si C ≥ 15.** Ce registre
sera consolidé par `producer` dans `production/RISQUES.md` (T-010).

| ID | Risque | P | I | C | Mitigation | Indicateur de suivi | Responsable | Échéance de levée |
|---|---|---|---|---|---|---|---|---|
| R-01 | **Stutter de compilation des shaders (PSO)** sur PC et Steam Deck | 4 | 5 | **20** | Précaching des PSO dès T-011 ; cache PSO groupé collecté automatiquement par des parcours Gauntlet nocturnes ; Advanced Shader Delivery sur PC si disponible et mesuré ; écran de préparation au premier lancement ; budget de permutations ; test « cache froid » en CI | Aucun hitch de plus de 50 ms lié aux PSO sur les parcours de référence | graphics-programmer, build-engineer | Pipeline complet à M2 |
| R-02 | **Mémoire de la Series S** dépassée | 4 | 5 | **20** | Series S plancher de contenu dès M1 ; budgets par catégorie suivis avec LLM ; validateurs de contenu ; pools de streaming par plateforme ; LOD MetaHuman stricts ; tests d'endurance sur kit dès l'accès ; 1 Go de marge non allouée | Pic mémoire au plus égal au budget de `BUDGETS.md` §6 sur les parcours | TD, graphics-programmer | Mesure sur kit avant M2 |
| R-03 | **60 fps non atteint** en mode Performance sur console (GPU) | 3 | 5 | **15** | Scène « pire cas » mesurée en M1 ; résolution dynamique ; budgets GPU par poste ; captures hebdomadaires ; leviers listés à l'avance (Lumen matériel vers logiciel, MegaLights, résolution des VSM, cheveux en cartes, plancher de résolution) | Temps GPU au 99e centile ≤ 16 ms sur les parcours | graphics-programmer | M2 |
| R-04 | **Game thread saturé** (IA, Blueprints, Tick, foules) | 3 | 4 | 12 | Systèmes en C++ ; Tick interdit par défaut ; Significance Manager, Mass ; budgets par système ; analyse Insights hebdomadaire | Game thread moyen ≤ 10 ms | TD, gameplay-programmer | M2 puis chaque jalon |
| R-05 | **Accès tardif aux consoles** (programmes, kits, code plateforme d'UE) | 3 | 5 | **15** | Démarches dès M0 et M1 (T-012, actions humaines) ; PC de référence ; architecture plateforme isolée ; aucune date de sortie console promise avant l'accès | Date d'obtention des kits | platform-engineer, humain propriétaire | Avant M2 |
| R-06 | **Montée de version** du moteur et transition vers UE6 (régressions, fin de support d'UE5) | 3 | 4 | 12 | Politique du §2.3 ; gel à l'Alpha ; branche d'évaluation ; modifications du moteur minimales ; UE6 exclu | Nombre de `PRJ_ENGINE_MOD` ; régressions après montée | TD | Gel à M3 |
| R-07 | **SDK minimal exigé** à la soumission non supporté par le moteur gelé | 2 | 5 | 10 | Suivi des exigences constructeurs [NDA] ; créneau de cherry-pick du SDK prévu au planning ; correctifs Epic | Versions de SDK exigées et supportées | platform-engineer | Revue à M3 et M4 |
| R-08 | **Steam Deck** : label « Verified » inatteignable à une qualité acceptable | 4 | 3 | 12 | Profil dérivé de Series S ; mesure à M2 ; décision « Verified » ou « Playable » ; communication honnête | Fréquence et lisibilité sur le Deck | graphics-programmer, platform-engineer | M2 |
| R-09 | **Temps de cook, de compilation et d'itération** qui explosent | 4 | 3 | 12 | DDC Zen partagé ; cook incrémental ; machines dimensionnées ; budgets d'outillage (`BUDGETS.md` §12) | Durées mesurées en CI | build-engineer | Suivi continu |
| R-10 | **Passage à l'échelle de Git LFS** (volume, verrous, conflits) | 3 | 4 | 12 | Verrous obligatoires ; un fichier par acteur ; test de charge en M1 ; seuils de bascule (§8.3) | Indicateurs du §8.3 | build-engineer, TD | Décision à M2 |
| R-11 | **Dépendance aux plugins tiers** (upscalers, plugin Git, Wwise, plugins Fab) | 3 | 3 | 9 | Liste blanche (§6.3) ; sources officielles ; `LICENCES.md` ; repli sur TSR ; pas de plugin sans support consoles documenté | Plugins hors liste = 0 | TD, business-affairs | Continu |
| R-12 | **Fonctionnalités moteur en bêta ou expérimentales** (Lumen Lite, Mesh Terrain, Mover, Iris...) | 3 | 4 | 12 | Expérimental interdit sans dérogation ; tests en M1 ; plan B documenté pour chaque fonctionnalité en bêta | Liste des fonctionnalités bêta utilisées | TD | M2 |
| R-13 | **Taille d'installation** gonflée par le photoréalisme | 3 | 3 | 9 | Budgets ; Oodle Texture ; déduplication ; pas de textures 8K ; mesure de la taille par chunk chaque nuit | Taille mesurée par rapport à `BUDGETS.md` §8 | build-engineer, art-director | Suivi continu |
| R-14 | **Corruption de sauvegarde**, échec de certification sur les sauvegardes | 2 | 5 | 10 | Écritures atomiques, copies de secours, tests de coupure et de migration | Tests au vert | gameplay-programmer, platform-engineer | M3 |
| R-15 | **Fuites mémoire et instabilité** en longue session | 3 | 4 | 12 | Tests d'endurance nocturnes dès l'Alpha ; LLM ; alertes sur la croissance mémoire | Croissance mémoire, taux de sessions sans crash | qa-lead, TD | M4 |
| R-16 | **Code écrit par les agents IA sans compilation ni test** (pas d'UE5 dans l'environnement cloud) | 5 | 4 | **20** | Aucune « Revue TD : OK » sans compilation et tests en CI sur une machine réelle ; CI obligatoire avant fusion ; chaque remise précise ce qui a été compilé et testé ; machines de build fournies par l'humain propriétaire | Part du code fusionné passé par la CI = 100 % | TD, build-engineer | Dès T-011 |
| R-17 | **Confidentialité (NDA consoles)** face à l'usage d'agents IA en nuage | 3 | 5 | **15** | Vérifier les clauses des accords plateformes avant de partager du code ou des documents confidentiels avec un service tiers ; dépôt séparé à accès restreint ; agents exclus tant que les accords ne l'autorisent pas | Accord écrit vérifié | business-affairs, platform-engineer, humain propriétaire | Avant réception des SDK |
| R-18 | **Parité Xbox Series S** : une fonctionnalité impossible sur Series S | 2 | 4 | 8 | Vérifier le GDD (T-006) contre cette contrainte ; aucun mode exclusif à la Series X | Revue du GDD | TD, game-designer | M1 |
| R-19 | **Multijoueur** (si retenu) : complexité réseau, coûts, triche | 4 | 5 | **20** | Coopératif en listen server de préférence ; prototype réseau dès M1 ; Iris évalué ; Easy Anti-Cheat | Prototype jouable en ligne en M1 | online-engineer | M1 (sans objet en solo) |
| R-20 | **Compétences rares** dans une petite équipe (rendu, consoles) | 3 | 4 | 12 | Recrutement ciblé ou partenaire de portage budgété dans T-015 ; documentation ; formation | Postes clés pourvus | producer, TD | M1 |
| R-21 | **Fin de support des pilotes ou des OS** sur PC (Pascal, Windows 10) | 3 | 2 | 6 | Configuration minimale revue à chaque jalon ; matrice de test matérielle | Matrice à jour | qa-lead, TD | Chaque jalon |
| R-22 | **Substrate** : adopté puis intenable sur Series S et Deck, ou écarté puis regretté | 3 | 4 | 12 | Test en M1 et décision avant la production des matériaux définitifs | Décision écrite | graphics-programmer, technical-artist | Fin M1 |
| R-23 | **Pire cas nocturne d'ESTRAN** (nuit, pleine mer, faisceau et lampe ombrés, brouillard volumétrique, reflets sur l'eau) au-dessus de 16,6 ms, surtout sur Series S | 3 | 5 | **15** | Estimation 17,5 ms avant levier (`BUDGETS.md` §14.1.1) ; six leviers chiffrés (3,8 ms) qui ne touchent jamais l'information de jeu (règle §10.1) ; test S-9 dès M1 ; repli Lumen logiciel puis plancher de résolution ; décision de la Boss si 60 fps impossible sur Series S | Temps GPU au 99e centile sur la scène S-9 | graphics-programmer, TD | M1 (S-9), levée à M2 |
| R-24 | **Deux visages MetaHuman en gros plan** (AVEUX) : GPU, animation faciale et mémoire sur Series S | 3 | 4 | 12 | Estimation 2 à 3 ms GPU et 0,45 à 0,8 Go (`BUDGETS.md` §14.1.2) ; LOD et cheveux en cartes sur Series S ; décor allégé et reprise du budget ; test S-10 ; rig facial réduit validé contre la liste des expressions utiles | Mesures de S-10 par variante | graphics-programmer, animation-director | M1 (S-10), levée à M2 |

**Risques critiques (C ≥ 15)** : R-01, R-02, R-03, R-05, R-16, R-17, R-23 et R-19 (si multijoueur).

---

## 16. Plan de dérisquage de M1 (tests techniques proposés)

Ces tests sont des **propositions** que `producer` peut transformer en tâches avec critères d'acceptation.

| Test | Objet | Résultat attendu | Lié à |
|---|---|---|---|
| S-1 Scène « pire cas » | Lumen, Nanite, VSM, MegaLights, 3 MetaHumans, végétation, effets ; mesurée sur PC de référence et avec les profils Series S et Deck | Écarts aux budgets de `BUDGETS.md`, leviers chiffrés | R-02, R-03 |
| S-2 Substrate | Même scène avec et sans Substrate | Coût en ms par profil, décision ADR-08 | R-22 |
| S-3 Lumen matériel ou logiciel | Comparaison à 30 et 60 fps | Choix par plateforme et par mode | R-03 |
| S-4 PSO de bout en bout | Collecte, cache groupé, test cache froid sur Win64 et Steam Deck | Aucun hitch de PSO sur le parcours | R-01 |
| S-5 Charge Git LFS | 200 Gio de contenu représentatif, verrous, clone, plugin de l'éditeur | Durées, choix du plugin, procédure | R-10 |
| S-6 Sauvegarde | Écriture atomique, migration, coupure simulée | Tests automatisés au vert | R-14 |
| S-7 Prototype réseau | Seulement si le concept est multijoueur | Coopératif jouable en ligne | R-19 |
| S-8 Monde ouvert | Seulement si le concept est en monde ouvert : World Partition et PCG à l'échelle | Budgets de streaming tenus | R-02 |
| S-9 Pire cas nocturne ESTRAN | Nuit, pleine mer, faisceau mobile et lampe ombrés, brouillard volumétrique, reflets de l'eau ; protocole du `BUDGETS.md` §14.1.1, avec test de lisibilité de parité | Coût par poste, validation des leviers, décision Series S | R-23, R-03 |
| S-10 Deux visages MetaHuman (AVEUX) | Deux MetaHumans définitifs en gros plan ; protocole du `BUDGETS.md` §14.1.2 ; variantes de LOD, cheveux, textures | Tableau de coût par variante (GPU, CPU, mémoire) | R-24, R-02 |

Une tâche dédiée à `docs/tech/RENDU.md` (`graphics-programmer`) est également à créer : elle n'existe pas
encore dans le backlog.

---

## 17. Sources consultées (le 2026-11-20)

Les pages d'Epic n'ayant pas pu être ouvertes directement, les éléments ci-dessous proviennent de résultats
de recherche. Les marqueurs [Secondaire] du document y renvoient.

- Notes de version et annonces : [notes de version 5.8 (Epic)](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes),
  [notes de version 5.9 Preview (Epic)](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-9-release-notes),
  [annonce 5.7 (forum Epic)](https://forums.unrealengine.com/t/unreal-engine-5-7-released/2673913),
  [annonce 5.6 (forum Epic)](https://forums.unrealengine.com/t/unreal-engine-5-6-released/2538952),
  [correctif 5.8.4 (forum Epic)](https://forums.unrealengine.com/t/5-8-4-hotfix-released/2842775).
- UE 5.8 et UE6 : [PC Gamer, sortie de 5.8](https://pcgamer.com/software/unreal-engine-5-8-launches-with-improved-terrain-and-vegetation-tools-a-lumen-lite-option-for-faster-global-illumination-and-for-the-times-we-now-live-in-an-open-standard-plugin-for-llm-systems/),
  [GamesBeat, sortie de 5.8](https://gamesbeat.com/epic-games-launches-unreal-engine-5-8/),
  [Wccftech, Lumen Lite](https://wccftech.com/unreal-engine-5-8-lumen-lite-60-fps-switch-2/),
  [Wccftech, Advanced Shader Delivery](https://wccftech.com/unreal-engine-5-8-adds-microsoft-advanced-shader-delivery-support-potentially-addressing-one-of-ue5s-biggest-pc-gaming-problems-shader-compilation-stutter/),
  [Pocket Gamer.biz, vision d'UE6](https://www.pocketgamer.biz/epic-games-outlines-its-vision-for-unreal-engine-6/),
  [PC Gamer, UE6](https://pcgamer.com/software/it-is-going-to-change-a-lot-about-how-games-are-made-epic-merges-unreal-engine-5-with-unreal-engine-for-fortnite-to-give-game-devs-around-the-world-unreal-engine-6/),
  [80.lv, 5.9 Preview](https://80.lv/articles/unreal-engine-5-9-preview-is-out-it-was-built-with-ai/),
  [Digital Production, 5.9 Preview](https://digitalproduction.com/2026/11/16/unreal-engine-5-9-preview-agents-canvas-and-a-browser-sized-ambition/),
  [Tom's Hardware, 5.6 et ray tracing à 60 fps](https://www.tomshardware.com/video-games/unreal-engine-5-6-promises-60-fps-ray-tracing-on-current-hardware-features-hardware-ray-tracing-enhancements-and-eliminates-cpu-bottlenecks),
  [GameFromScratch, 5.7](https://gamefromscratch.com/unreal-engine-5-7-released/).
- Gestion de source : [tarifs Perforce](https://www.perforce.com/resources/vcs/helix-core-pricing),
  [facturation Git LFS (GitHub)](https://docs.github.com/en/billing/using-the-new-billing-platform/about-billing-for-git-large-file-storage),
  [UnrealGameSync (Perforce)](https://www.perforce.com/blog/vcs/how-to-use-unrealgamesync),
  [UEGitPlugin (communautaire)](https://www.github.com/ProjectBorealis/UEGitPlugin/releases).
- Plateformes : voir les sources de [`BUDGETS.md`](BUDGETS.md) §15.
