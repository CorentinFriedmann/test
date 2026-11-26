# Budgets techniques (pile web 3D)

| | |
|---|---|
| **Tâche** | T-034 : mise à jour pour la voie web (remplace la version T-003, archivée) |
| **Auteur** | `technical-director` |
| **Version** | 2.0 du 2026-11-26 |
| **Statut** | Soumis à la validation de la Boss |
| **Sources** | [`ADR_PIVOT_WEB.md`](ADR_PIVOT_WEB.md) §4 (cibles) ; [`PERF_P2.md`](PERF_P2.md) (mesures T-030) ; `production/DECISIONS.md` (avis du propriétaire) |
| **Ancienne version** | [`archive/BUDGETS.md`](archive/BUDGETS.md) (ancienne pile et consoles ; portage éventuel seulement) |

Plateformes visées : **PC (navigateur, puis Steam via Electron)** et **Steam Deck**. Pas de budget pour consoles : hors périmètre initial (`DECISIONS.md`, 2026-11-23).

## 1. Honnêteté des mesures : trois statuts

| Statut | Sens |
|---|---|
| **Objectif** | Chiffre de conception, jamais mesuré sur du matériel réel |
| **Compté / mesuré (cloud)** | Obtenu dans Chromium headless en rendu logiciel (SwiftShader, CPU). Valable pour les **comptes** (appels de dessin, triangles, lumières), le **poids**, la **mémoire JS** et la correction fonctionnelle. **Non valable** pour le temps de frame réel, le coût GPU, les ombres, la transparence, le thermique |
| **Confirmé sur GPU réel** | Mesure d'un vrai PC (rapport F2). **Aucune à ce jour** |

Seule donnée venant d'un vrai PC : le propriétaire a joué au prototype P2 le 2026-11-26 et dit « **c'est fluide** » (porte P1 franchie sur son avis). Ce n'est **pas une mesure** : pas de rapport F2 chiffré, GPU, navigateur, fréquence d'écran et résolution inconnus. BUG-004 (cadence divisée par deux avec le son sous rendu logiciel) n'a pas été observé chez lui.

## 2. Budgets et état

### 2.1 Temps de frame

| Cible | Résolution | Cadence | Temps de frame | Répartition indicative | Statut |
|---|---|---|---|---|---|
| **PC milieu de gamme** (classe GTX 1660 / RX 580, 4 coeurs) | 1080p | 60 i/s | 16,6 ms | JS (simulation, préparation du rendu, HUD, audio) ≤ 5 ms ; GPU ≤ 11 ms | JS : **mesuré (cloud) 0,8 ms de moyenne, 1,2 ms au p95**, hors simulation et audio ; GPU : **inconnu** ; ressenti : « fluide » (non chiffré) |
| **Steam Deck** (APU, 800p) | 1280x800 | 40 minimum, 60 visé | 25 ms (16,6 ms visé) | GPU ≤ 14 ms ; pas de résolution dynamique sous 0,6 | **Inconnu**, jamais testé |
| **Portable sans GPU dédié** | 1080p | 30 | 33 ms | niveau `low` | **Inconnu** |

Critère de décision sur un rapport F2 réel : **95e centile > 20 ms au niveau haut** : rendu à revoir (premiers leviers : `waterOctaves` 2, `pixelRatioMax`, niveau `medium` par défaut).

### 2.2 Comptes indépendants du GPU

| Budget | Objectif | Compté (vue large de nuit, pire cas, T-030) | Statut |
|---|---|---|---|
| Appels de dessin | ≤ 300 | **37** (5 à 11 en jeu normal) | tenu, compté |
| Triangles visibles | ≤ 1 M | **≈ 62 000** (terrain ≈ 51 000) | tenu, compté |
| Lumières dynamiques | ≤ 30 (cible réelle < 4 avec ombres) | **5**, **0 ombre** | tenu, compté |
| Programmes de shader | stable en cours de partie | constant à la première apparition de la Laisse au niveau haut (`render.cjs`) | vérifié niveau haut seulement |

### 2.3 Mémoire

| Budget | Objectif | Constaté | Statut |
|---|---|---|---|
| Mémoire JS (heap) | ≤ 500 Mo | **11 à 13 Mo** | tenu, mesuré (cloud) |
| Mémoire GPU | ≤ 1 Go | non mesurée ; textures minuscules (sable 256², hauteurs 320² en 8 bits, lueur 128²) + tampons 960x540 à 1920x1080 | estimée très inférieure ; **à confirmer** |
| Tampons audio | n/a | ≈ 2,8 Mo de bruit généré ; 28 voix maximum | compté |

### 2.4 Poids, chargement, installation

| Budget | Objectif | Constaté | Statut |
|---|---|---|---|
| Fichier unique navigateur | ≤ 100 Mo (ADR) ; **limite testée 1,5 Mio** (`p2.cjs`, `render.cjs`) | `dist/estran-p2.html` ≈ **655 Kio** (three.js 0,5 Mio compris) | tenu, mesuré |
| Version Steam (Electron) | ≤ 500 Mo (ADR) | non construite ; Electron seul pèse plus de 100 Mo | objectif |
| Chargement avant de pouvoir jouer | ≤ 10 s | génération du terrain et de la texture de hauteurs non chronométrée à part | **non mesuré finement** |
| Démarrage à froid du fichier unique | ≤ 3 s en local | idem | non mesuré finement |
| Requêtes réseau à l'exécution | 0 | 0 (le test échoue sur toute requête autre que le fichier) | tenu, vérifié |

### 2.5 Simulation et audio

| Budget | Objectif | Statut |
|---|---|---|
| Pas de simulation | 30 Hz fixe, indépendant de la cadence | tenu, testé (déterminisme octet pour octet) |
| Coût CPU de la simulation par pas | à définir une fois mesuré : **proposition ≤ 1 ms par pas** (30 pas par seconde : 3 % d'un coeur) | **non chronométré à part** ; à mesurer par F2 |
| Coût CPU audio | proposition ≤ 2 ms par frame | **non mesuré sur machine réelle** (estimation par construction : faible) ; script `tests/p2/audio-cpu.cjs` disponible |
| Niveau sonore au premier contact | environ -20 dBFS efficace, plafond à -1,4 dBFS | mesuré hors ligne ; **jamais écouté** par un humain, LUFS non mesuré |

## 3. Mesures du cloud : ce qu'on sait (T-030, SwiftShader, 960x540, bot « prudent », 10 s)

| Niveau | Tampon | Cadence | p95 | JS du dessin |
|---|---|---|---|---|
| high | 960x540 (x1, MSAA) | 5,4 i/s | 200 ms | 0,77 ms |
| medium | 960x540 | 8,6 i/s | 133 ms | 0,77 ms |
| low | 768x432 (x0,8) | 22,7 i/s | 50 ms | 0,67 ms |

À lire ainsi : **le temps JS est négligeable ; tout le coût est du remplissage logiciel.** Ces cadences ne disent rien d'un GPU. Deux séances à des jours différents ont donné des cadences absolues différentes d'un facteur d'environ 2 (`docs/qa/RAPPORT_P2.md`) : **ne jamais comparer des chiffres absolus d'une séance à l'autre**, seulement l'ordre des niveaux et les comptes.

Écart connu : le niveau haut est **plus lourd que le prototype de T-027** sous SwiftShader (11 à 15 i/s pour une scène plus simple). Sans GPU réel, on ne sait pas si cela compte.

Mesure par le joueur : `?perf=1` ou F2, jouer 60 s **avec le son actif**, bouton « Copier le rapport de performance ». Les temps sont des intervalles entre frames (vsync compris), pas des temps GPU. Un navigateur à 60 Hz plafonne la cadence à 60.

## 4. Où est le risque sur un vrai GPU (estimations, non mesurées)

1. **Shader d'eau plein écran** (≈ 14 évaluations de bruit par pixel au niveau haut, 6 au bas). Premier suspect si une machine est saccadée. Levier : `waterOctaves`, résolution dynamique.
2. **Résolution** : `devicePixelRatio` jusqu'à 2 au niveau haut (4K sur écran dense). Levier : `pixelRatioMax`.
3. **MSAA** (haut seulement) : coûteux sur APU ; décidé au chargement.
4. **Steam Deck** : WebGL2 dans Electron/Chromium non testé ; thermique inconnu.
5. **Saccade de compilation de shader** : atténuée (précompilation, lumières jamais retirées) ; vérifiée seulement au niveau haut et pas sur GPU réel. Le changement de niveau en cours de partie recompile (action volontaire).
6. **Audio sur machine lente** : BUG-004, à confirmer.

## 5. Stratégies de tenue du budget (déjà en place ou prévues)

| Stratégie | État |
|---|---|
| Trois niveaux de qualité qui ne touchent jamais la simulation | **en place**, parité vérifiée |
| `InstancedMesh` pour les rochers (un appel de dessin) | **en place** |
| Élimination hors champ | **en place** (5 à 11 appels en jeu) |
| Lumières constantes (intensité 0 plutôt que retrait) | **en place** |
| `setPixelRatio` plafonné | **en place** (`pixelRatioMax`) |
| Résolution dynamique selon le temps de frame | **prévue** ; à décider après un rapport F2 réel |
| Choix automatique du niveau au premier lancement | **prévu** (aujourd'hui `?q=`) ; à décider après F2 |
| Fusion de géométries, textures KTX2, maillages Draco/Meshopt | **prévus**, seulement si des assets externes entrent |
| Lightmaps pour des intérieurs fixes | **prévus** si le concept en a (ESTRAN : sans objet à ce jour) |

## 6. Budget de poids en CI (proposé)

Échec des tests si `dist/estran-p2.html` dépasse **1,5 Mio (1 572 864 octets)**. **Seuil unique** (T-040), identique dans `tests/e2e/p2.cjs`, `tests/e2e/render.cjs`, `PERF_P2.md` et ce fichier. Justification : le fichier pèse 655 Kio (three.js 0,5 Mio compris), soit 2,3 fois de marge pour le contenu à venir, mais assez bas pour qu'une texture, une police ou un fichier son embarqué par erreur fasse échouer le test ; très en dessous de la limite de l'ADR (100 Mo), qui reste le plafond de principe. Toute hausse se décide ici, puis dans les deux scripts, dans la même tâche.

## 7. Objectifs de stabilité

| Indicateur | Objectif | Statut |
|---|---|---|
| Erreur de console ou de page pendant une partie complète d'un automate | 0 | vérifié (`p2.cjs`, `run.cjs`, `render.cjs`, `audio.cjs`) |
| Boîte de dialogue du navigateur | 0 | vérifié |
| Journal de télémétrie identique entre niveaux de qualité | identique | vérifié (88 364 octets) |
| Plantage en jeu | non mesurable aujourd'hui | pas de télémétrie de plantage ; à décider avec la version Steam |
| Exceptions d'écouteurs (`sim.listenerErrors`) | 0 | attendu 0, non affiché au joueur |

## 8. Mesures encore à obtenir, par ordre de valeur

1. **Rapport F2 d'un vrai PC**, son actif, 60 s, avec le GPU, le navigateur et la fréquence d'écran (déjà demandé au propriétaire ; le « c'est fluide » du 2026-11-26 n'en tient pas lieu).
2. **Temps de simulation par pas** chronométré séparément (peut se faire dans le cloud, sans GPU).
3. **Temps de chargement** (terrain, texture de hauteurs) chronométré dans le cloud.
4. **Steam Deck** : seulement par un humain ou un service tiers ; hors budget actuel.

## 9. Archive : budgets Unreal et consoles

Les budgets de l'ancienne pile (temps de frame CPU et GPU par plateforme, Series S, PS5, cache PSO, taille d'installation console) sont conservés dans [`archive/BUDGETS.md`](archive/BUDGETS.md), pour un portage éventuel. Ils ne s'appliquent pas à `game/`.
