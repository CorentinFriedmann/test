# ESTRAN : noyau jouable (T-029, passes a et b)

Jeu web 3D (three.js 0.187.0, esbuild 0.28.2, JavaScript ES2022). Dépôt autonome : tout est dans `game/`.

```
npm install        # ou npm ci
npm run all        # npm ci + lint + build (dist/estran-p2.html) + tests unitaires (node --test) + scénarios Playwright
npm run lint       # ESLint 10.14.0 (T-040) : vraies erreurs seulement (variable non définie, import cassé, code inatteignable...), aucune règle de style
npm run test:unit  # tests Node (passe a, passe b, rendu, audio T-031), sans navigateur
npm run test:e2e   # scénarios navigateur : tests/e2e/run.cjs (jeu), render.cjs (rendu, T-030), audio.cjs (audio, T-031) puis guidance.cjs (guidage, son et indices visuels, T-043), après npm run build
npm run captures   # reconstruit puis met à jour les captures VERSIONNÉES de captures/ (sur demande seulement)
npm run sync-data  # recopie docs/design/data/*.csv dans data/ (source de vérité : docs)
```

- `src/sim/` : simulation pure à pas fixe de 30 Hz (ni three.js, ni DOM, ni horloge murale). Île, marée, bandes, échelles, lampe, noyade, victoire/défaite, journal de télémétrie, joueurs automatiques (`bot.js`).
- `src/data/` : lecture des CSV de `data/` (embarqués par `scripts/gen-data.mjs`). Aucune valeur d'équilibrage en dur.
- `src/render/` : scène three.js et niveaux de qualité (`?q=low|high`), qui n'influencent jamais la simulation.
- `src/ui/` : HUD (modèle pur + DOM) et saisies.
- Options d'URL : `?seed=N`, `?q=low|medium|high`, `?moment=night|dawn|day`, `?perf=1` (écran de mesure, aussi F2), `?debug=1` (F3 : chiffres, T : temps x6).
- Crochets de test : `window.__estran` (`getState`, `getTelemetry`, `setBot`, `advance`, `setQuality`, `restart`...), **seulement avec `?test=1`** (T-033) ; les tests l'ajoutent eux-mêmes.
- `data/monde.csv` appartient au jeu : paramètres de génération du terrain et règles absentes des tableaux du GDD.

## Passe b : bruit, la Laisse, phare

- `src/sim/threat.js` : automate de la Laisse (dormante, rode, enquete, traque, repli, attente au bord), ecoute (rayon de bruit, presence 4 m, erreur de position 3 m), apparition/disparition selon la maree, halo, faisceau, lampe, saisies. Generateur propre a graine (`seed ^ hash('laisse')`), avance par pas de simulation uniquement. Toutes les valeurs viennent de `menace.csv`; les reglages propres au jeu sont dans `monde.csv` (lignes marquees `passe b` ou GDD).
- `src/sim/sim.js` : bruit du joueur a chaque pas (max des sources x multiplicateur de bande, debris non multiplie), usure et remontage du phare (manivelle `world.crank`), froid apres une premiere saisie, defaite `seized` a la 2e saisie en 45 s.
- Evenements pour l'audio (T-031) : `sim.subscribe(fn)` (navigateur : `window.__estran.subscribe(fn)`) recoit chaque evenement du journal, dont `noise {src, x, z, r}` (toutes les 0,5 s tant que le rayon est positif, et a chaque debris heurte), `debris_hit`, `threat_spawn`, `threat_state {from, to, dist, source}` (le passage `roam -> inquire` est le grondement), `grab`, `lighthouse_low/out/wound`. Les memes evenements sont dans la telemetrie, avec `charge`, `threat`, `tx`, `tz` dans chaque echantillon.
- Etat lisible : `state.threat` (`active, mode, x, z, dist, heard, lit`), `state.lighthouse` (`charge, winding`), `state.noise`, `state.cold`, `state.grabs`. Distances audibles (`threat_audible_radius`, `threat_cue_roar_radius`) : a appliquer cote audio avec `threat.dist`.
- Rendu provisoire : silhouette sombre visible seulement quand le faisceau ou la lampe la touche (0,5 s), toujours avec `?debug=1`; anneaux d'eau (rayon proportionnel au bruit, max 8 m); debris, manivelle, faisceau qui vacille sous 20 %. HUD : jauge du phare (sans texte), anneau pour le remontage, vignette bleue du froid.
- Automates : `prudent` (revient a la manivelle apres chaque releve, gagne), `noisy` (releve S1 puis court vers la Laisse, 2 saisies, defaite).
- URL : `?threat=0` desactive la Laisse (comparaisons, pas de jeu normal). Crochets de test ajoutes : `subscribe`, `lookAt`.
- Coupes de la Boss respectees : pas d'haptique, pas de marche lente au stick (la touche C reste), pas de silhouette de faisceau.

## T-030 : ambiance stylisée, niveaux de qualité, mesures

- `src/render/quality.js` : tables des 3 niveaux (`low`, `medium`, `high`), des 3 moments d'éclairage du GDD §12 (`night` par défaut, `dawn`, `day`) et constantes visuelles (`LOOK`). Rien d'autre n'est réglé en dur dans `scene.js`.
- `src/render/shaders.js` : GLSL maison (aucun asset, aucune dépendance) : eau (niveau = `st.level`, rivage et écume lus dans une texture des hauteurs du terrain, reflets de la lampe et du faisceau), Laisse, perturbation de l'eau, grain et vignette (un triangle plein écran dessiné après la scène).
- `src/render/laisse.js` : forme sombre à capuche et lanières, anneau d'eau troublée. Visible **seulement** si `threat.lit > 0` (règle de la simulation, 0,5 s), ou toujours avec `?debug=1`.
- Faisceau : cap lu depuis `lighthouse_beam_period` (même formule que `threat.js`). Après une victoire, l'éclairage glisse vers l'aube en 2,5 s (rendu seul).
- Les niveaux ne changent que le coût et la finition : résolution (0,8 / 1 / 1,5-2), anti-crénelage (haut seulement, au chargement), détail des rochers, relief du sable, octaves de l'eau, reflets, grain (absent en bas), finesse de la Laisse. Identiques sur les 3 niveaux : brouillard, nombre et place des rochers, lumières, règle de visibilité de la Laisse. Les lumières ne sont jamais retirées (intensité 0 plutôt) pour éviter une recompilation de shader (saccade).
- Mesure : F2 ou `?perf=1`. Cadence moyenne, frame moyenne, 95e centile, pire frame, appels de dessin, triangles, temps JS du dessin. Bouton « Copier le rapport de performance » : JSON dans le presse-papiers (ou zone de texte à copier à la main si le navigateur refuse). Les temps sont des intervalles entre frames (vsync compris), pas des temps GPU. Rapport et limites : `docs/tech/PERF_P2.md`.
- Crochets de test ajoutés : `setPose` (caméra libre pour les captures), `probeLaisse` (pixels que la Laisse change dans la frame), `perfReport`, `perfSummary`, `perfReset`.
- Captures : les tests écrivent dans `captures/.tmp/` (ignoré par git). `npm run captures` met à jour `captures/` : `estran-<nuit|aube|jour>-<high|medium|low>.jpg` (9), `estran-laisse*.png` et les captures de parcours de la passe b.

## T-031 : audio procédural (Web Audio, sans fichier ni voix)

- `src/audio/` : `spatial.js` (panoramique, gain et coupure selon la distance, secteur de direction : fonctions pures), `mix.js` (règles de mixage pures : ambiance selon la marée, niveau d'angoisse, ronronnement du phare, filtre général), `director.js` (événements et état de la simulation -> « cues », pur et déterministe), `caption-text.js` (textes des sous-titres), `settings.js` (volume, coupure, sous-titres ; `localStorage` facultatif), `engine.js` (synthèse sur tout `BaseAudioContext` : bruits blancs/roses/bruns générés, oscillateurs, `StereoPannerNode`, compresseur puis plafond doux à -1,4 dBFS), `index.js` (système branché sur le jeu), `offline.js` (rendu `OfflineAudioContext` pour les tests).
- Entrée : `sim.subscribe` (événements) et `state` à chaque frame. Les distances audibles viennent de `threat_audible_radius` (remous) et `threat_cue_roar_radius` (grondement) dans `menace.csv`, appliquées avec `state.threat.dist`.
- L'`AudioContext` n'est créé que sur un geste : clic d'entrée ou touche. Touches : **M** coupe le son, **K** bascule les sous-titres des bruits (**activés par défaut depuis T-043**). Volume, coupure et sous-titres aussi dans l'écran d'entrée/pause. Réglages mémorisés dans `localStorage` si possible (clé `estran.audio.v2` depuis T-043).
- `sim.subscribe` et le journal isolent chaque écouteur (`try/catch`) : une erreur est rangée dans `sim.listenerErrors` (50 au plus, hors télémétrie) et signalée par l'option `onListenerError` (le navigateur écrit un `console.error`). Elle ne casse jamais un pas de simulation.
- Crochets de test ajoutés : `audioStats()`, `audio.{start,setVolume,setMuted,setCaptions}`, `audioOffline.{renderRun,renderPanTest}`.
- Aucune lumière ni matériau n'est créé en cours de partie par l'audio (aucun code de rendu touché, hormis deux éléments DOM de sous-titres).
- Détails, mesures et limites : `docs/audio/NOTES_AUDIO_P2.md`.

## T-033 : version P2 en un seul fichier

- `npm run build` écrit `dist/estran-p2.html` (fichier autonome, 1,5 Mio au plus, aucune requête réseau). `tests/e2e/p2.cjs` (`npm run test:p2file`) le vérifie.
- Écran de départ : touches, volume, bouton « Copier le rapport de performance », formulaire de 3 questions en un mot depuis T-043 (`src/ui/p2.js`, copie des réponses en texte ; le formulaire de 8 questions n'est plus dans le jeu), « Crédits et licences » (texte MIT de three.js inséré par le build). Les « réponses attendues » ne sont pas dans le jeu.
- Copie : `navigator.clipboard` avec repli sur une zone de texte sélectionnée ; aucune boîte de dialogue du navigateur ; `localStorage` sous `try/catch`.
- Détails : `docs/tech/PIPELINE_WEB.md` section 8, `docs/legal/LICENCES.md` section 5, `production/RAPPORT_P2.md`.

## T-040 : garde-fous du code

- `npm run lint` (`eslint.config.js`, ESLint 10.14.0 exact, sans plugin) fait partie de `npm run all`. Normes : `docs/tech/NORMES_CODE.md`. `.editorconfig` ajouté ; Prettier non installé.
- `tests/unit/sim-purity.test.js` : échoue, avec `fichier:ligne`, si `src/sim/` utilise `Math.random`, `Date.now`, `new Date`, `performance.now`, `setTimeout`, `setInterval`, `requestAnimationFrame`, `document`, `window`, `navigator` ou un import de `three`.
- `tests/unit/audio-engine.test.js` : `src/audio/engine.js` avec un contexte audio factice (vol de voix à 28 voix, `priorityOf`, voix critique jamais refusée). Aucune modification de `engine.js`.
- Seuil de poids unique du fichier livré : 1,5 Mio (`tests/e2e/p2.cjs`, `render.cjs`, `docs/tech/BUDGETS.md` §6, `PERF_P2.md`).

## T-041 : chronométrage dans le cloud

- `npm run p2:timing` : (1) coût d'un `sim.step()` sous Node, 5 automates x 20 parties à graine (101-120, Laisse active), échauffement écarté, moyenne / p50 / p95 / p99 / max, `createSim` à part (`tests/p2/timing.mjs`, argument `verify` pour les graines 201-220) ; (2) construit `dist/` puis mesure 5 chargements à froid (un navigateur neuf par essai) au niveau haut dans Chromium headless (`tests/p2/timing-load.cjs [essais] [q=low|medium|high]`). Chiffre à retenir : la 2e image ; « scène prête » est une borne supérieure ; « première peinture » est celle de la page, pas du jeu. `createSim` est mesuré à chaud sous Node. Niveaux bas et moyen : `node tests/p2/timing-load.cjs 5 q=low` (ou `q=medium`), pas `npm run p2:timing`.
- **Hors `npm run all`** : les temps varient d'un lancement à l'autre et ne doivent pas faire échouer la CI. Le rendu logiciel (SwiftShader) n'est qu'indicatif pour un vrai GPU. Aucune modification de `src/`.
- Résultats et limites : `docs/tech/BUDGETS.md` (§2.2, §2.4) et `docs/tech/PERF_P2.md` (§3).

## T-043 : corrections du prototype P2 (guidage, son, indices visuels, partie de 5 minutes)

Spécification : `docs/design/P2_CORRECTIONS.md` (T-042). Aucune nouvelle mécanique ; la simulation (`src/sim/`) n'a pas changé (le test `sim-purity` et ESLint passent), seules des valeurs CSV ont changé.

- **C4, partie de 5 minutes (données seules)** : `maree.csv` (cycle de 300 s, 61 lignes de 5 s), `stations.csv` (S1 38-72 s, S2 100-200 s, S3 235-266 s), `menace.csv` (`slice_duration` et `defeat_time_limit` à 300, spawn à 25 s). Source de vérité : `docs/design/data/`, puis `npm run sync-data`. S1 est élargie par rapport à la spécification (38-68 devenu 38-72, profondeur de lecture maximale 1,00 devenue 1,10 m) pour qu'un joueur lent lise l'échelle 1 (voir `tests/p2/slow-start.test.js`).
- **C1, guidage** : `src/ui/guidance.js` (fonctions pures : `guidance(state, data, world, memo)`, `endCard(state, data)`, `createTips(data, world)`, `mmss`). Le HUD (`src/ui/hud.js`) ne fait qu'afficher : objectif et relevés en haut, une ligne d'action au centre bas (première condition vraie des 15 lignes de la spécification), liste des 3 échelles en haut à droite, repère (losange et distance, ou flèche de bord ; calculé en DOM avec `view.project`), premières aides, écran de fin avec sa raison. Tous les nombres viennent des CSV. Le guidage ne reçoit jamais la position de la Laisse.
- **C2, son** : le bouton de l'écran de départ crée et reprend l'`AudioContext` dans le gestionnaire du clic, joue le son de test (`engine.testChime()`, 440 puis 330 Hz, environ -12 dBFS avant le volume), l'indicateur `SON ACTIF / SON COUPÉ / SON INDISPONIBLE / SON EN ATTENTE` reste visible, et un bandeau apparaît si le contexte ne tourne pas 1,5 s après le clic (reprises à 0,5 s et 1 s) ou s'il est perdu hors pause (`src/audio/index.js`, `src/ui/audio-opts.js`).
- **C3, menace visible sans le son** : `src/render/threat-cues.js` (calcul pur des seuils : anneaux de 0,15 à 0,50 entre 25 et 8 m, vignette de 0 à 0,45, facteurs de mode, pulsation en traque, zone sèche) ; `view.addThreatRing` (anneaux à la position de la Laisse, réserve propre de 4 anneaux) et `view.setThreatVignette` (un uniform du passe plein écran existant, aucune lumière ni matériau de plus). Rendu seul : rien n'est relu par la simulation.
- **Tests ajoutés** : `tests/unit/guidance.test.js`, `audio-start.test.js`, `threat-cues.test.js`, `tests/p2/slow-start.test.js`, `tests/e2e/guidance.cjs` (56 contrôles dont l'absence de recouvrement des textes à 1280x720 et 1920x1080). `tests/p2/discrimination.test.js` est recalé sur la partie de 5 minutes (fenêtre de peur 100 s, `win` et `heedless` au plus 16/20, `prudent` au moins 18/20 et une approche sous 15 m dans au moins 14/20 parties, `noisy` au moins 90 % de défaites, victoire entre 4 et 6 minutes). Rapport chiffré : `npm run p2:report` et `node tests/p2/run.mjs verify`.
- **Captures versionnées** (1280x720, `captures/`) : `estran-guidage-depart.png`, `estran-guidage-echelle.png`, `estran-guidage-liste.png`, `estran-repere.png`, `estran-repere-bord.png`, `estran-vignette-8m.png`, `estran-accueil.png`, `estran-son-indisponible.png`, `estran-fin-manque.png`, `estran-guidage-1080p.png` (1920x1080). `npm run captures` les rafraîchit.
- **Test hooks ajoutés** (`?test=1` seulement) : `getGuide()`, `getCue()`.
