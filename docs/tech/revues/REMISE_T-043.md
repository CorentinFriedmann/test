# Rapport de remise : T-043, archivé par la Coordination

> Texte rendu par `gameplay-programmer` le 2026-11-27, résumé fidèlement par la Coordination.

## Résumé
Les cinq corrections C1 à C5 de `docs/design/P2_CORRECTIONS.md` sont réalisées dans `game/`. La simulation `src/sim/`
n'est pas modifiée (0 ligne, `bot.js` compris) ; seules des valeurs CSV ont changé. `npm run all` exécuté, code de sortie 0.
Contrôle de la Coordination : `git diff -- game/src/sim` vide.

## Fichiers
- Données : `docs/design/data/stations.csv` (S1 élargie), `game/data/{maree,menace,stations}.csv` (`npm run sync-data`).
- Source modifiée : `game/src/audio/{engine,index,settings}.js`, `game/src/index.template.html`, `game/src/main.js`,
  `game/src/render/{scene,shaders}.js`, `game/src/ui/{audio-opts,captions,hud-model,hud,p2}.js`.
- Source créée : `game/src/ui/guidance.js` (fonctions pures), `game/src/render/threat-cues.js` (calcul pur des indices visuels).
- Tests : modifiés `game/tests/e2e/{audio,harness,p2,render,run}.cjs`, `game/tests/p2/{discrimination.test.js,lib.js,run.mjs}`,
  `game/tests/unit/{audio-engine,audio,island,sim,threat,tide}.test.js` ; créés `game/tests/unit/{guidance,audio-start,threat-cues}.test.js`,
  `game/tests/unit/fake-audio.js`, `game/tests/p2/slow-start.test.js`, `game/tests/e2e/guidance.cjs`.
- Divers : `game/package.json`, `game/scripts/captures.mjs`, `game/README.md`, `docs/qa/QUESTIONNAIRE_P2.md`.
- Captures : 10 nouvelles dans `game/captures/`, captures existantes de `run.cjs` rafraîchies.
- Non versionné : `game/dist/estran-p2.html`.

## Corrections
- **C1 Guidage** : `guidance(state, data, world, memo)` pure (14 tests) : objectif, relevés, horloge, ligne d'action (15 lignes,
  textes exacts), liste des 3 échelles, cible du repère ; nombres lus dans les CSV. Aides (`createTips`) et écran de fin
  (`endCard`) purs. La Laisse n'entre ni ne sort de `guidance()` (test d'invariance). Repère losange + distance ou flèche de bord,
  en DOM via `view.project` (lecture seule). `showObjective` supprimé. Recalcul à chaque tick de simulation.
- **C2 Son** : bouton « Cliquer pour commencer (avec le son) » qui crée et reprend l'`AudioContext` dans le gestionnaire de clic,
  son de test 440 puis 330 Hz (0,5 s chacun, crête −12 dBFS). Indicateur SON ACTIF / SON COUPÉ / SON INDISPONIBLE / SON EN ATTENTE.
  Bandeau d'erreur si le contexte n'est pas `running` à 1,5 s (reprises à 0,5 et 1 s) ou en cas de perte hors pause ; bandeau
  « Essayez Chrome ou Edge » sans `AudioContext`. Test e2e : `running` après un vrai clic, touche M, bandeau avec un contexte bloqué.
- **C3 Menace visible** : sous-titres actifs par défaut (clé `estran.audio.v1` → `v2`, test), 18 px sur fond noir 55 %.
  `threat-cues.js` : rien au-delà de 25 m, anneaux 0,15 → 0,50, vignette 0 → 0,45, pulsation ±10 % à 1,2 Hz en traque seulement.
  Réserve propre de 4 anneaux. Vignette = uniform du passe plein écran existant. Mesure à 8 m : coins −23 % de luminosité.
  Croissant facultatif non fait.
- **C4 Partie de 5 minutes** : marée 300 s, S2 100-200 s, S3 235-266 s, apparition à 25 s ; tests recalés (`FEAR_WINDOW_S` = 100 s).
- **C5 Questionnaire** : `QUESTIONNAIRE_P2.md` commence par la version courte (3 questions de `PORTE_P2.md`, telles quelles),
  l'ancien questionnaire est conservé « pour mémoire ». Le formulaire du jeu pose ces 3 questions (Q3 avec « Précisions » facultatif).

## Choix sur les ambiguïtés
- Aide 1 (touches) dès le début, fermée à la première avance (20 s = plafond). Aide 2 (lampe) au premier pas dans l'eau
  (profondeur ≥ 0,15) ou à 20 s, fermée par F, 8 s. Une aide à la fois, une seule fois par partie, sur le temps de simulation.
- Lignes 5-7 : « d » = profondeur à l'échelle, seuils `read_depth_min/max`. Ligne 7 absente pour S2 (`required_trend` = 0).
- Décomptes arrondis vers le haut, temps écoulé de fin vers le bas. Ligne 11 « Relevé noté » seulement hors plateforme.
- Repère masqué à moins de 3 m d'une échelle ou de 8 m du phare.
- **Écart** : ligne d'action à 26 % du bas (spécification : 22 %), sous-titres à 6 % ; à 22 % les zones se touchaient avec
  3 lignes de sous-titres. Toast descendu à 150 px du haut.
- `guidance` placée dans `src/ui/guidance.js` (et non `hud-model.js`).

## Exigence (a) : automates
| Automate | Seuil | Graines 101-120 | Graines 201-220 |
|---|---|---|---|
| `win` victoires | ≤ 16/20 | **16/20** | 12/20 |
| `heedless` victoires | ≤ 16/20 | **16/20** | 13/20 |
| `prudent` victoires | ≥ 18/20 | 19/20 | 20/20 |
| `prudent` approche < 15 m avant 100 s | ≥ 14/20 | 16/20 | 18/20 |
| `noisy` défaites | ≥ 18/20 | 20/20 | 20/20 |
| `silent` victoires | ≥ 16/20 | 20/20 | 20/20 |
| Durée d'une victoire | 240-360 s | 247-287 s | 247-286 s |

`win` et `heedless` exactement au plafond sur le lot 101-120. Aucun levier de menace touché. Sur la graine 2026, `prudent`
subit une première saisie : trois tests (`threat`, `render`, `run`) passent de « 0 saisie » à « jamais deux saisies, victoire ».
Lot 101-120 : 9 saisies de `prudent` sur 20 parties.

## Exigence (b) : parcours lent
Avec S1 38-68 s / profondeur max 1,00 : départ à 30 s 20/20 et 20/20 ; départ à 45 s **17/20 et 15/20** (seuil 18/20 non tenu).
S1 élargie dans `docs/design/data/stations.csv` : `read_depth_max_m` 1,00 → 1,10, `window_end_s` 68 → 72. Résultat 20/20
partout ; dernière lecture au pire à 70,6 s. **La spécification dit 38/68, le jeu applique 38/72.**

## Exigence (c) : captures 1280×720 (`game/captures/`)
`estran-guidage-depart.png`, `estran-guidage-echelle.png`, `estran-guidage-liste.png`, `estran-repere.png`,
`estran-repere-bord.png`, `estran-vignette-8m.png` ; annexes `estran-accueil.png`, `estran-son-indisponible.png`,
`estran-fin-manque.png`, `estran-guidage-1080p.png`. Test automatique de non-recouvrement des boîtes à 1280×720 et 1920×1080.
Sous-titres des captures injectés dans le DOM (pas une vraie partie).

## Tests et poids
- Node : 99 → 132 (unitaires 113/113, `tests/p2` 19/19). e2e : p2 30/30, run 37/37, render 26/26, audio 30/30, guidance 58/58.
- ESLint 0 erreur. `dist/estran-p2.html` : 687 299 octets (0,66 Mio), seuil 1,5 Mio.

## Limites déclarées
- Son non vérifié dans la page publiée sur claude.ai (iframe, autoplay) : à vérifier à la publication.
- Audibilité réelle non mesurée (nœuds et plan de lecture seulement). Rendu SwiftShader seulement.
- Densité du guidage et creux entre S2 et S3 : à juger à l'essai. GDD §6.3 (anneaux < 25 m) à mettre à jour par le designer.

## Décisions demandées à la Boss
1. Élargissement de S1 (38-72 s, profondeur max 1,10 m), à transmettre au designer.
2. Ligne d'action à 26 % ; plafond `win` / `heedless` à 16/20, atteint exactement sur le lot 101-120.
