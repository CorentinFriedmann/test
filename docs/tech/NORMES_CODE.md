# Normes de code (pile web 3D)

| | |
|---|---|
| **Tâche** | T-034 : mise à jour pour la voie web (remplace la version T-003, archivée) |
| **Auteur** | `technical-director` |
| **Version** | 2.0 du 2026-11-26 |
| **Statut** | Soumis à la validation de la Boss |
| **S'applique à** | Tout le code de `game/` (src, scripts, tests), écrit par un agent IA ou un humain |
| **Documents liés** | [`ARCHITECTURE.md`](ARCHITECTURE.md) · [`BUDGETS.md`](BUDGETS.md) · [`PIPELINE_WEB.md`](PIPELINE_WEB.md) |
| **Ancienne version** | [`archive/NORMES_CODE.md`](archive/NORMES_CODE.md) (ancienne pile ; portage éventuel seulement) |

Légende : **[AUTO]** vérifié par un test ou un outil qui existe aujourd'hui ; **[REVUE]** vérifié en revue par le TD ; **[PROPOSÉ]** nécessite un outil ou un test qui n'existe pas encore (voir §11).

---

## 1. Langage, typage, outils : décisions

| Sujet | Décision | Justification |
|---|---|---|
| Langage | **JavaScript ES2022, modules ES** (`"type": "module"`), comme le code existant. Les fichiers de test e2e restent en `.cjs` (Playwright préinstallé, CommonJS) | 5 100 lignes testées ; aucune compilation ajoutée |
| Typage | **JSDoc + `// @ts-check`**, introduit fichier par fichier (`sim/`, `data/` d'abord) ; **TypeScript non adopté pour l'instant** (réévaluation : `ARCHITECTURE.md` §3) | Garanties de types sans réécriture ni risque sur les tests de parité |
| Lint | **ESLint 10.14.0** (version exacte, `--save-exact`), config « flat » `game/eslint.config.js`, `npm run lint` (inclus dans `npm run all`) [AUTO, T-040]. Règles : uniquement celles qui attrapent de vraies erreurs (`no-undef`, `no-unreachable`, `no-dupe-keys`, `no-redeclare`, `no-const-assign`, `no-dupe-else-if`, `no-unsafe-negation`, `use-isnan`, `valid-typeof`...) et une règle locale `local/imports-resolve` (import relatif vers un fichier existant, noms importés réellement exportés ; sans plugin). **Aucune règle de style.** Globals déclarés à la main par dossier : navigateur dans `src/`, aucun (ES seul) dans `src/sim/` et `src/data/`, Node dans `scripts/` et `tests/`. `no-unused-vars`, `eqeqeq`, `prefer-const` ne sont **pas** activés (non nécessaires pour rattraper de vraies erreurs ; à réévaluer) | Rattrape variable non définie, import cassé, code inatteignable, clé dupliquée, que personne ne verrait à l'écran |
| Formatage | **Prettier non adopté.** À la place : **`game/.editorconfig`** (UTF-8, LF, 2 espaces, fin de ligne finale) [AUTO, T-040] et la règle d'imitation du §2 | Prettier reformaterait des milliers de lignes (le code compte des lignes denses de plus de 120 caractères), brouillant l'historique et les revues, sans gain de fiabilité. Choix à rouvrir si plusieurs agents produisent des styles divergents |
| Dépendances | Exactes (sans `^`), `package-lock.json` versionné, `npm ci` | reproductibilité |

Tout outil à installer est une **tâche future** (jamais installé par une tâche de documentation). Tant qu'ESLint n'est pas installé, les règles ci-dessous sont en [REVUE].

## 2. Langue, style, formatage

| Règle | Détail |
|---|---|
| Langue du code | Anglais : identifiants, commentaires, messages de log et d'erreur |
| Langue de la documentation | Français : `docs/`, README, rapports. Les textes affichés au joueur sont en français (données de localisation à venir) |
| Style | **Imiter le fichier voisin** : 2 espaces, point-virgule, guillemets simples, virgules finales sur les listes multilignes. Pas de reformatage hors de la zone modifiée |
| Longueur des fonctions | Indicatif : au-delà de 60 lignes, justifier ou découper (dette connue : `createView`, `threat.update()`, `sim.step()`) |
| Longueur des lignes | Indicatif 120 ; les tables de constantes sont tolérées plus longues |
| Encodage | UTF-8, fins de ligne LF |

## 3. Nommage

| Élément | Règle | Exemple |
|---|---|---|
| Fichiers | `kebab-case.js` ; un module = une responsabilité | `hud-model.js`, `perfstats.js` |
| Fonctions, variables | `camelCase`, verbe pour une fonction | `createSim`, `beamHit` |
| Fabriques | `createXxx(...)` qui renvoie un objet de fonctions (style actuel) ; pas de classes sauf besoin motivé | `createStepper`, `createView` |
| Constantes de module | `UPPER_SNAKE_CASE` pour une table figée | `NEUTRAL_INPUT`, `QUALITY` |
| Paramètres de données (CSV) | `snake_case`, lus par `param(data, 'nom')` | `lighthouse_beam_period` |
| Unités | Suffixe dans le nom quand ce n'est pas évident : `holdS`, `windTicks`, `dtMs` | |
| Booléens | `is`, `has`, `can` ou un adjectif (`paused`, `muted`) | |
| Évènements de simulation | `snake_case`, noms stables : une chaîne d'évènement est un contrat avec l'audio et les tests | `threat_state`, `debris_hit` |

## 4. Modules et dépendances [REVUE]

Respecter le tableau de `ARCHITECTURE.md` §4.1. En particulier : `sim/` et `data/` ne dépendent d'aucun autre module ; `render/`, `audio/` et `ui/` **lisent** la simulation et ne l'écrivent jamais ; `main.js` est le seul à tout brancher. Pas d'import circulaire. Pas d'état global de module modifiable (singleton caché) : l'état vit dans les objets créés par les fabriques.

## 5. Interdits dans la simulation (`src/sim/`) [AUTO : `tests/unit/sim-purity.test.js`]

Pour garantir déterminisme, rejeu et tests sans navigateur, `src/sim/` n'utilise **jamais** : `three` (tout import), `document`, `window`, `navigator`, `Date.now`, `new Date`, `performance.now`, `requestAnimationFrame`, `setTimeout`, `setInterval`, `Math.random` (liste vérifiée par `tests/unit/sim-purity.test.js`, T-040 : lecture des fichiers de `src/sim/`, message `fichier:ligne`). Limites du test : les commentaires sont ignorés, pas les chaînes de caractères ; un accès indirect (`globalThis['Math']`, alias) n'est pas détecté ; il attrape les accidents, pas la mauvaise foi. Aléatoire : `rng.js` (mulberry32) avec graine ; un sous-système qui a besoin d'un flux indépendant dérive sa propre graine (`seed ^ hash('nom')`) et ne l'avance que par pas de simulation. Le temps est le compteur de pas (`tick`, `t`), jamais l'horloge murale. Pas d'itération sur des objets dont l'ordre dépend de l'engine (préférer des tableaux). Pas d'état caché dans des variables de fermeture quand il devra être sauvegardé : préférer un objet d'état explicite (`ARCHITECTURE.md` §7).

## 6. Règles de la boucle de rendu et de la performance

| Règle | Statut |
|---|---|
| **Pas d'allocation dans la boucle** : pas de `new THREE.Vector3()`, `new Color()`, tableau, objet littéral ou fermeture créés à chaque frame ou à chaque pas ; réutiliser des variables de module ou de fabrique. Exception : objets minuscules d'évènements (journal) | [REVUE] |
| **Libération des ressources GPU** : tout objet qui possède une ressource GPU (`BufferGeometry`, `Material`, `Texture`, `WebGLRenderTarget`, `ShaderMaterial`) est libéré par `.dispose()` quand on le remplace ou qu'on détruit la vue. Créer à l'initialisation, jamais par frame. Le changement de niveau de qualité libère ce qu'il remplace | [REVUE] |
| **Libération audio** : chaque voix se déconnecte et arrête ses sources à la fin (`onended`, repli temporisé) ; LFO arrêtés ; respect du plafond de 28 voix et des priorités | [REVUE ; test unitaire déterministe PROPOSÉ] |
| **Pas de recompilation de shader en jeu** : ne pas ajouter ni retirer de lumière en cours de partie (intensité 0 plutôt que `visible = false`) ; matériaux créés à l'initialisation puis `renderer.compile` ; ne pas changer `defines` ou `onBeforeCompile` en jeu | [AUTO partiel] contrôle du nombre de programmes (`render.cjs`, niveau haut) |
| **Instanciation** pour toute répétition (`InstancedMesh`) ; budget d'appels de dessin de `BUDGETS.md` | [REVUE] |
| **Pas de chargement bloquant ni d'asset externe** : tout est procédural ou embarqué ; aucune requête réseau | [AUTO] `p2.cjs` |
| **Pas de lecture GPU synchrone** (`readPixels`, requêtes de temps) en jeu ; seulement dans les crochets de test | [REVUE] |
| **Pas de recherche coûteuse par frame** (`scene.getObjectByName`, parcours de scène) ; garder des références | [REVUE] |
| `console.log` hors du code de mise au point : interdit en production ; `console.error` réservé aux erreurs signalées | [REVUE] |
| **Mesure avant d'optimiser** : écran F2 (`?perf=1`) ; `renderer.info` ; profileur du navigateur sur un vrai PC. Une optimisation sans mesure avant et après est refusée en revue | [REVUE] |

## 7. Données et équilibrage

1. **Aucune valeur d'équilibrage en dur** dans `sim/` : tout passe par `param()` / `worldParam()`. Une règle absente du GDD devient une ligne de `monde.csv` avec note et statut (`FIXE` / `A_REGLER`).
2. Source de vérité des CSV : `docs/design/data/` ; ne jamais éditer la copie de `game/data/` à la main (`npm run sync-data`).
3. Le rendu et l'audio **lisent les mêmes paramètres** que la simulation quand ils représentent la même chose (faisceau, rayons de bruit), jamais une copie.
4. Les constantes purement visuelles vivent dans `render/quality.js`. Les valeurs de timbre audio en dur sont tolérées (dette externalisable).

## 8. Tests

| Niveau | Outil | Où | Exigence |
|---|---|---|---|
| Unitaire | `node --test` | `tests/unit/*.test.js` | Tout code pur nouveau (simulation, données, modules audio et rendu purs) arrive avec ses tests. Rapide, sans navigateur, déterministe |
| Équilibrage | `node --test` | `tests/p2/` | Les automates rejouent des parties et vérifient les propriétés de jeu (discrimination, victoire/défaite) |
| Navigateur | Playwright (Chromium, rendu logiciel) | `tests/e2e/*.cjs` | Sur `dist/estran-p2.html` en `file://` : démarrage, une partie par automate, **aucune erreur de console ni de page**, aucune boîte de dialogue, aucune requête réseau, licences présentes |
| Parité | e2e | `render.cjs` | Tout changement de rendu rejoue `prudent` aux niveaux `low`, `medium`, `high` (et un changement en cours de partie) : **journaux identiques octet pour octet** |

Règles :
- **Un défaut corrigé reçoit un test** qui échoue avant la correction.
- **Un test e2e doit pouvoir échouer** : il atteint réellement la condition qu'il vérifie (leçon T-038 : un test peut passer sans jamais atteindre le plafond de voix) ; sinon, doubler par un test unitaire déterministe.
- **Pas de temps réel dans les tests** quand on peut avancer la simulation pas à pas (`advance`) ; les crochets `window.__estran` n'existent qu'avec `?test=1`.
- `npm run all` (`npm ci`, build, unitaires, équilibrage, e2e) doit être **vert depuis un dépôt propre** avant toute remise. Durée : 15 à 40 minutes en rendu logiciel ; en travail courant, lancer seulement les suites concernées et le dire dans la remise.
- Ce qui n'est pas exécuté est écrit comme **non vérifié** dans la remise.

## 9. Sécurité, robustesse, confidentialité

- **Stockage** (`localStorage`, IndexedDB) : toujours sous `try/catch` ; le jeu doit fonctionner s'il est bloqué ou vide ; données lues validées (type, plage) et jamais exécutées. Pas de `eval`, `new Function`, `innerHTML` avec du texte de joueur ou de fichier (préférer `textContent`).
- **Pas de boîte de dialogue** (`alert`, `confirm`, `prompt`) : impossible dans le cadre verrouillé de la page publiée.
- **Presse-papiers** : `navigator.clipboard.writeText` avec repli sur une zone de texte sélectionnée.
- **Aucune requête réseau, aucune télémétrie envoyée, aucun identifiant du joueur** sans décision écrite du propriétaire.
- **Écouteurs d'évènements** : chaque écouteur de `sim.subscribe` est isolé ; une exception ne casse jamais un pas.
- **Audio** : `AudioContext` créé seulement sur un geste ; niveau plafonné ; son jamais requis pour jouer (sous-titres disponibles).
- **Dépendances** : toute nouvelle dépendance (npm) suit la règle de `CLAUDE.md` : licence compatible avec la vente, consignée dans `docs/legal/LICENCES.md` **avant** l'intégration ; version exacte ; justification du TD. Les avis `@license` du bundle sont conservés (esbuild `legalComments: 'inline'`).

## 10. Revue de code par le TD

Pour chaque tâche de programmation, avant la Boss, relecture du diff : architecture (§4), interdits (§5), performance et ressources (§6), données (§7), tests (§8). En **mode économe** : relecture ciblée sur le diff et exécution des suites concernées, sans relecture ligne à ligne du dépôt. Résultat dans le rapport : « **Revue TD : OK** » ou liste de corrections exigées ; les réserves non bloquantes sont listées et reprises dans les critères de la tâche suivante.

Une remise de code contient : fichiers modifiés, commandes exécutées avec leur résultat réel, ce qui n'a pas été exécuté, et les écarts aux budgets de `BUDGETS.md`.

Messages de commit et de remise en français ; identifiants en anglais.

## 11. Outils à mettre en place (propositions de tâches futures)

| Proposition | Effet | Priorité |
|---|---|---|
| Installer **ESLint** (version exacte) avec la configuration du §1 et un script `npm run lint` dans `npm run all` | Rattrape variables non définies, imports inutilisés, `==` | **fait (T-040)** |
| Ajouter `.editorconfig` | Uniformise l'encodage, les fins de ligne et l'indentation | **fait (T-040)** |
| Installer **TypeScript** en devDependency pour `tsc --noEmit --checkJs`, puis `// @ts-check` sur `sim/` et `data/` | Typage sans compilation | moyenne |
| **Test unitaire des interdits de `sim/`** (recherche de `Math.random`, `Date.now`, `document`... dans `src/sim/`) | Vérification automatique du §5 | **fait (T-040)** |
| **Test unitaire déterministe de `engine.js`** (contexte audio factice : vol de voix, `priorityOf`) | Solde la réserve de T-038 | **fait (T-040)** : `tests/unit/audio-engine.test.js` |
| Budget de poids unique (1,5 Mio) | Aligne `p2.cjs`, `render.cjs`, `BUDGETS.md` et `PERF_P2.md` | **fait (T-040)** |

## 12. Archive : normes de l'ancienne pile

Les normes de l'ancienne pile (Unreal Coding Standard, préfixes `A`/`U`/`F`, Gameplay Tags, frontière C++ / Blueprints, interdits de Tick, `.clang-format`) sont conservées dans [`archive/NORMES_CODE.md`](archive/NORMES_CODE.md) pour un portage éventuel. Elles ne s'appliquent pas à `game/`.
