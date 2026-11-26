# Architecture technique (pile web 3D)

| | |
|---|---|
| **Tâche** | T-034 : mise à jour pour la voie web (remplace la version T-003, archivée) |
| **Auteur** | `technical-director` |
| **Version** | 2.0 du 2026-11-26 |
| **Statut** | Soumis à la validation de la Boss |
| **Décision d'origine** | `production/DECISIONS.md` (2026-11-23, « Voie technique ») ; justification dans [`ADR_PIVOT_WEB.md`](ADR_PIVOT_WEB.md) |
| **Documents liés** | [`BUDGETS.md`](BUDGETS.md) · [`NORMES_CODE.md`](NORMES_CODE.md) · [`PIPELINE_WEB.md`](PIPELINE_WEB.md) · [`PERF_P2.md`](PERF_P2.md) |
| **Ancienne version** | [`archive/ARCHITECTURE.md`](archive/ARCHITECTURE.md) (ancienne pile ; portage éventuel seulement) |

Légende de l'état : **réel** = existe dans `game/` et est testé ; **prévu** = recommandé, n'existe pas encore. Ce document ne décrit jamais un module prévu comme s'il existait.

---

## 1. Principes

1. **Tout est fabricable et testable par des agents dans le cloud**, sans GPU, sans éditeur, sans action du propriétaire.
2. **La simulation est la vérité ; le rendu et l'audio la lisent.** Aucune valeur de rendu (qualité, résolution, effets) n'influence un seul pas de simulation (« règle de parité », vérifiée par des tests).
3. **Les données d'équilibrage ne sont pas dans le code** : elles viennent de CSV (`docs/design/data/`).
4. **Un fichier HTML autonome** en sortie : aucune requête réseau à l'exécution.
5. **Rien de spécifique à une plateforme hors du module `platform/`** (prévu).
6. **Natif d'abord** : three.js, Web Audio, Gamepad API, Pointer Lock, plutôt que des bibliothèques tierces. Toute dépendance nouvelle est justifiée (licence, maintenance, taille) et inscrite dans `docs/legal/LICENCES.md`.

## 2. Pile figée (réelle)

| Rôle | Choix | Version |
|---|---|---|
| Rendu 3D | three.js (MIT), WebGL2 | **0.187.0** (exacte, sans `^`) |
| Langage | **JavaScript ES2022, modules ES** (voir §3 pour la décision) | n/a |
| Build | esbuild (MIT) : bundle, minification, IIFE, inliné dans un seul HTML | **0.28.2** |
| Tests | `node --test` (unitaires, équilibrage) ; Playwright + Chromium (scénarios navigateur) | Node 22.23.5 ; Playwright 1.63.0 préinstallé (pas dans `package.json`) |
| Gestionnaire | npm 10.9.9, `package-lock.json` | verrouillé |
| Sortie | `game/dist/estran-p2.html` (≈ 655 Kio, limite testée : 1,5 Mio) | |

WebGPU reste exclu tant qu'il n'est pas testable dans le cloud (ADR §1). Les montées de version de three.js sont **volontaires** : une tâche dédiée, les tests de parité et de rendu rejoués, jamais automatiques.

## 3. Langage : JavaScript maintenant, typage par JSDoc ensuite (décision du TD)

L'ADR prévoyait TypeScript strict « pour la production ». Après T-029 à T-033, la décision est ajustée :

| Option | Verdict |
|---|---|
| **Rester en JavaScript, ajouter JSDoc et `// @ts-check` fichier par fichier** | **Retenu.** 5 100 lignes déjà écrites, testées et validées ; aucune étape de compilation ajoutée (esbuild lit le JS tel quel) ; le vérificateur de types de TypeScript (`tsc --noEmit --checkJs`) donne l'essentiel des garanties du typage sur les modules où l'on en a besoin |
| Migrer vers TypeScript | Écarté pour l'instant : réécriture de tout `game/src/` sans gain visible pour le joueur, risque de régression sur des tests de parité octet pour octet, et budget d'abonnement limité (`DECISIONS.md`, 2026-11-20). À rouvrir seulement si le code dépasse environ 15 000 lignes ou si les erreurs de forme de données deviennent la première cause de défauts |

Ordre d'adoption de `// @ts-check` (tâche future, voir remise) : d'abord `src/sim/` et `src/data/` (le coeur, déjà pur), puis `src/audio/` (modules purs), enfin `render/` et `ui/`. Les types des données CSV et des événements de simulation sont décrits par `@typedef` dans un seul fichier `src/types.js` (prévu).

## 4. Structure réelle de `game/`

```
game/
  data/            CSV embarqués (copie de docs/design/data/ + monde.csv, propre au jeu)
  scripts/         build.mjs, gen-data.mjs, sync-data.mjs, captures.mjs
  src/
    sim/           simulation pure (réel)
    data/          lecture des CSV (réel)
    render/        vue three.js, shaders, niveaux de qualité (réel)
    audio/         synthèse Web Audio procédurale (réel)
    ui/            HUD, saisies, écran de départ, mesure (réel)
    main.js        point d'entrée navigateur : branche tout (réel)
    index.template.html
  tests/
    unit/          node --test : simulation, données, rendu (pur), audio (pur)
    p2/            équilibrage et discrimination (node --test) ; mesure CPU audio
    e2e/           scénarios Playwright (*.cjs) sur dist/estran-p2.html
  dist/            sortie (un seul fichier HTML)
  captures/        captures versionnées pour la revue
```

### 4.1 Modules et dépendances autorisées

| Module | Rôle | Peut dépendre de | Ne doit jamais dépendre de |
|---|---|---|---|
| `src/sim/` | Île, marée, bandes, échelles, lampe, noyade, la Laisse, victoire/défaite, journal de télémétrie, automates de test (`bot.js`) | `src/data/` (valeurs lues par `param()`) | three.js, DOM, `window`, horloge murale (`Date.now`, `performance.now`), `Math.random`, `requestAnimationFrame` |
| `src/data/` | Lecture des CSV embarqués ; aucune valeur d'équilibrage en dur ailleurs | rien | tout le reste |
| `src/render/` | Scène, shaders GLSL maison, niveaux de qualité (`low`, `medium`, `high`), mesure de frames | `sim` (**lecture seule** de l'état), three.js | écriture dans la simulation |
| `src/audio/` | Cues (`director.js`, pur), mixage (`mix.js`, pur), spatialisation (`spatial.js`, pur), synthèse (`engine.js`), priorités de voix | `sim` (événements et état, lecture seule), Web Audio | rendu |
| `src/ui/` | Modèle du HUD (pur) et DOM, saisies, écran de départ et questionnaire | `sim` (lecture), `audio` (réglages) | écriture dans la simulation |
| `src/main.js` | Seul endroit qui connaît tous les modules ; boucle d'animation | tous | n/a |

Règles vérifiées aujourd'hui par revue (T-029) ; **une vérification automatique** (recherche des interdits dans `src/sim/` en test unitaire) est proposée en tâche future.

### 4.2 Modules prévus (n'existent pas)

| Module prévu | Rôle | Quand |
|---|---|---|
| `src/save/` | Sauvegarde (§7) | Après la porte P2, si le périmètre garde une sauvegarde en cours de marée |
| `src/platform/` | Abstraction plateforme (§8) : stockage, plein écran, manette, quitter, succès | Avec la version Steam |
| `src/online/` | Aucun : jeu solo, pas de service en ligne prévu (ADR §7.2) | n/a |

## 5. Boucle de jeu et simulation à pas fixe (réel)

- **Pas fixe de 30 Hz** : `sim_step` dans `menace.csv` (0,0333 s) ; `hz = round(1/sim_step)` et `dt = 1/hz`, donc le pas réel est exactement 1/30 s.
- `createStepper(dt, maxStepsPerFrame = 3)` (`src/sim/stepper.js`) accumule les durées de frame et rend un nombre entier de pas. Durée de frame bornée à 0,1 s ; au-delà de 3 pas par frame, le retard est abandonné : **un frame lent ralentit le jeu, il ne change jamais la longueur d'un pas**.
- `sim.step(input)` avance d'exactement un pas. **Déterminisme** : même graine (`?seed=N`, sinon `sim_seed`) et mêmes entrées donnent le même journal de télémétrie, octet pour octet (testé : 88 364 octets sur le scénario `prudent`). La Laisse a son générateur propre (`seed ^ hash('laisse')`), avancé par pas seulement.
- **Interpolation** : `stepper.alpha` donne la fraction de pas restante, que `main.js` utilise pour interpoler la **pose du joueur** entre deux pas (position, hauteur au sol). Les autres éléments (marée, Laisse, faisceau) ne sont pas interpolés : lus à l'état du dernier pas.
- **Évènements** : `sim.subscribe(fn)` (copies des évènements du journal, retourne une fonction de désabonnement). Chaque écouteur est isolé par `try/catch` : une erreur d'audio ou de rendu est rangée dans `sim.listenerErrors` (50 au plus) et ne casse jamais un pas.
- **Automates** : `bot.js` (`prudent`, `noisy`, `win`) jouent sans humain ; ils servent aux tests e2e, à l'équilibrage (`tests/p2/`) et à la parité.

## 6. Données (réel)

- Source de vérité : `docs/design/data/*.csv` (équilibrage, par le `game-designer`). `npm run sync-data` les recopie dans `game/data/` ; `scripts/gen-data.mjs` les embarque dans `src/data/generated.js` (build et tests unitaires).
- `game/data/monde.csv` appartient au jeu : paramètres de génération du terrain et règles absentes des tableaux du GDD, chacun avec une note et un statut (`FIXE` / `A_REGLER`).
- Accès par `param(data, nom)` et `worldParam(data, nom)`. **Aucune valeur d'équilibrage en dur** dans `sim/` ; les constantes de rendu sont rangées dans `src/render/quality.js` (`QUALITY`, `MOMENTS`, `LOOK`). Les gains et fréquences de timbre de `audio/` sont en dur (dette connue, REVUE_T-031).
- Le faisceau visible dérive des mêmes données que le faisceau logique (période, portée, demi-angle × `LOOK.beamVisualFactor`) : ce que le joueur voit est ce qui repousse la Laisse (T-039).

## 7. Sauvegarde (prévue, rien n'existe)

Aujourd'hui, **le jeu ne sauvegarde rien** hors réglages audio et sous-titres (`localStorage`, sous `try/catch`, facultatif).

**Choix recommandé** (à confirmer par la Boss avant de coder) :

| Question | Recommandation |
|---|---|
| Quoi sauvegarder | Pour une version courte « une marée » : **réglages** et **résultat de la partie** d'abord. Une reprise en cours de marée n'est utile que si une partie dépasse 10 minutes |
| Comment, en cours de partie | **Instantané de l'état de simulation avec version de schéma**, pas rejeu de la graine et des entrées (le rejeu casse dès qu'une valeur CSV change) |
| Prérequis technique | **Rendre l'état de la Laisse sérialisable** : aujourd'hui il vit dans des variables de fermeture (`hearAcc`, `silence`, `wp`, `target`...) de `threat.js` (réserve 5 de REVUE_T-029). Sans cela, pas d'instantané fiable |
| Où | Navigateur : `localStorage` (réglages, petit) et **IndexedDB** (parties) ; Electron : fichier JSON dans le dossier utilisateur ; même interface `save.read(key)` / `save.write(key, value)` derrière le module `platform/` |
| Robustesse | Tout accès au stockage sous `try/catch` (déjà la règle) ; version de schéma dans chaque fichier ; sauvegarde corrompue ou plus récente que le jeu : ignorée avec message, jamais de plantage |

## 8. Abstraction plateforme : navigateur / Electron (prévue)

Distribution (ADR §5) : démos sur **itch.io en HTML5**, version Steam en **Electron** (un seul moteur de rendu, celui des tests Playwright). Tauri est écarté (WebView hétérogène, risque WebGL2).

Seul le futur `src/platform/` connaît la différence. Interface minimale prévue : `storage` (§7), `fullscreen`, `quit`, `openExternal`, `achievements` (Steamworks, Electron seulement), `isElectron`. Le jeu ne teste jamais `window.process` ou `navigator.userAgent` ailleurs.

Ce qui est vérifié aujourd'hui : le fichier unique s'ouvre en `file://` dans Chromium (Playwright) sans requête réseau. **Rien n'est vérifié** sur Electron, sur le Steam Deck, ni sur un autre navigateur que Chromium. La page publiée par la Coordination (cadre verrouillé) impose déjà des règles : pas de `alert`/`confirm`/`prompt`, copie par `navigator.clipboard` avec repli, `localStorage` toujours protégé.

## 9. Rendu (réel)

- `createView(sim, qualityName, opts)` construit la scène à partir de l'état ; relecture à chaque frame, aucune écriture. Trois niveaux (`low` ×0,8, `medium` ×1, `high` ×1,5 à 2 de résolution, MSAA au niveau haut seulement, décidé au chargement) qui changent **le coût et la finition, jamais la logique** : brouillard, nombre et place des rochers, lumières et règle de visibilité de la Laisse sont identiques.
- Aucune lumière n'est ajoutée ou retirée en cours de partie (intensité 0 plutôt que `visible = false`) pour éviter une recompilation de shader. En fin de `createView`, un `renderer.compile` force la compilation des objets cachés (Laisse, anneaux d'eau).
- Rochers en `InstancedMesh` (un appel de dessin). Eau, grain, vignette, Laisse : GLSL maison, sans asset.
- Style : **stylisé atmosphérique** (décision du 2026-11-23), pas de photoréalisme.

## 10. Audio (réel)

Synthèse procédurale Web Audio, sans fichier ni voix : cues purs (`director.js`) puis synthèse (`engine.js`). `AudioContext` créé seulement sur un geste du joueur. Chaîne : bus, passe-bas, compresseur, plafond doux à -1,4 dBFS, volume. **Plafond de 28 voix avec priorités** (T-038) : une voix critique (grondement, saisie) n'est jamais refusée, les voix basses sont volées en premier. Sous-titres des bruits depuis les mêmes cues (touche K), coupure (touche M).

## 11. Tests et crochets de test

- `window.__estran` (état, télémétrie, avance manuelle, qualité, audio hors ligne...) existe **seulement avec `?test=1`** ; les tests l'ajoutent eux-mêmes. Le joueur n'en a pas besoin et le jeu normal ne l'expose pas.
- Options d'URL de mise au point : `?seed`, `?q=low|medium|high`, `?moment=night|dawn|day`, `?perf=1` (aussi F2), `?debug=1` (F3), `?threat=0` (comparaisons seulement).
- Stratégie complète : [`NORMES_CODE.md`](NORMES_CODE.md) §8.

## 12. Ce qui a été appris (T-029 à T-038)

| Leçon | Conséquence |
|---|---|
| La simulation pure et le journal déterministe permettent des tests de parité octet pour octet entre niveaux de qualité (T-030) | Règle maintenue : tout nouveau rendu est rejoué contre `prudent` en `low`, `medium` et `high` |
| Un `try/catch` par écouteur d'évènements était nécessaire avant de brancher l'audio (T-029 réserve 3, soldée en T-031) | Toute nouvelle souscription à `sim` est isolée de la même façon |
| Un nombre en dur côté rendu (période du faisceau) a divergé de la logique (T-029, T-030, T-039) | Le rendu lit les paramètres dans les données, jamais de copie |
| Les mesures du cloud sont du rendu logiciel (SwiftShader) : valables pour les comptes (appels de dessin, triangles), le poids et la mémoire JS ; **pas pour le temps GPU** (T-030) | Voir `BUDGETS.md` §3 |
| Sous SwiftShader, le son divise la cadence par deux (BUG-004), non observé sur le PC du propriétaire | À confirmer par une mesure F2 avec le son actif sur un vrai PC |
| Un plafond de voix sans priorité pouvait refuser un évènement critique (T-031, BUG-001, corrigé en T-038) ; le test du vol de voix est encore seulement stochastique | Tâche future : test unitaire déterministe de `engine.js` |
| `createView` (≈ 300 lignes) et `threat.update()` (≈ 90 lignes) sont longs ; l'état de la Laisse n'est pas sérialisable | À découper avant d'ajouter sauvegarde ou rediffusions |
| Le fichier unique doit conserver les avis de licence (T-033, `docs/legal/LICENCES.md` §5) | Test e2e qui vérifie les deux chaînes MIT dans `dist/` |

## 13. Archive : portage Unreal Engine 5 éventuel

L'ancienne architecture (modules C++, Gameplay Ability System, Enhanced Input, Lumen, Nanite, MetaHuman, Blueprints) est conservée dans [`archive/ARCHITECTURE.md`](archive/ARCHITECTURE.md). Un portage ne serait envisagé que si le jeu se vend et que les consoles deviennent un objectif (`DECISIONS.md`, 2026-11-23). La séparation actuelle (simulation pure, données en CSV, rendu en lecture seule) est précisément ce qui le rendrait possible : la simulation et les CSV se réécrivent en C++ sans changer les règles du jeu. Aucune ligne de l'archive ne s'applique à `game/`.
