# Revue TD de T-030 : ambiance visuelle, niveaux de qualité, mesures

Date : 2026-11-24. Revue de pôle ciblée (mode économe), pas de relecture ligne à ligne. Code : `game/src/render/`, `game/src/ui/perf.js`, `game/src/main.js`, `game/tests/e2e/render.cjs`.

## Résultat : Revue TD : OK (avec 4 réserves non bloquantes)

## Vérifié (exécuté)
- `npm test` dans `game/` (relancé ici, environ 25 minutes en tout dans ce conteneur) : **60 tests unitaires verts, 37 contrôles e2e verts, 25 contrôles de rendu verts**, aucune erreur ni alerte de console. Les chiffres annoncés sont exacts. (`npm ci` et `build` n'ont pas été rejoués : `dist/estran.html` date du build du livreur.)
- Bundle `dist/estran.html` : 637 749 octets (623 Kio), contre 598 Ko à T-029 (+25 Ko). Plafond testé à 1,5 Mo. `package.json` : seuls des scripts ajoutés, `package-lock.json` inchangé, aucune dépendance ni aucun asset nouveau (shaders écrits à la main, textures procédurales ; `three/addons` fait partie de three 0.187.0).
- Capture `estran-nuit-high.jpg` (et `-low.jpg`) regardées : sombre, grain assez marqué au niveau haut, rochers et ligne d'écume lisibles, HUD lisible. Cohérent avec le brief de nuit. Les moments aube et jour ne sont pas jugés (réserve T-007 du livreur).

## Parité et pureté
- `git diff 0c87377..HEAD` sur `game/src/sim/`, `game/data/` et `game/src/data/` : **aucun changement**. Le dépôt est propre.
- Aucun `Math.random` ni `Date.now` dans `src/render/` ni dans `ui/perf.js`. Le rendu lit `st` et `st.threat` sans écrire ; `main.js` ne passe au rendu que `getState()` et une pose.
- Visibilité de la Laisse : `laisse.update` décide par `th.lit > 0` (donnée de la simulation), identique aux trois niveaux ; `debug` seul la montre hors lumière. Brouillard, placement des 48 rochers (même nombre et mêmes positions quel que soit le niveau) et lumières décisives ne dépendent pas du niveau. Le lissage de position et le fondu de la Laisse dépendent de la cadence, mais c'est de l'affichage seul.
- Test de parité probant : scénario `prudent` (le long), 4 parties (`low` + `debug=1`, `medium`, `high` + moment jour, `high` avec changement de niveau en cours de partie), journaux comparés octet pour octet : 88 364 octets identiques, toutes en victoire. Il rejoue donc bien la parité exigée en T-029 (`prudent` et `?debug=1`). Limite : il prouve que le rendu ne perturbe pas la simulation ; la garantie « le rendu n'écrit pas dans l'état » reste une convention (non gelée), vérifiée ici par lecture.
- Lisibilité mesurée : la Laisse change 2,76 % de l'image au niveau haut, 2,02 % au niveau bas, 0 pixel quand elle n'est pas éclairée, aux trois niveaux.

## Réserves de T-029 reprises
1. **Période du faisceau** : OK. `main.js` passe `param(data, 'lighthouse_beam_period')`, `scene.js` calcule `simTime / opts.beamPeriod` ; la formule est la même que `beamHit()` dans `threat.js` (cap `atan2(dx, dz)`, même sens), y compris le shader d'eau. Les portées et le seuil de scintillement viennent aussi des données. Les constantes visuelles sont rangées dans `LOOK` / `QUALITY` / `MOMENTS` : OK.
2. **Lecture seule** : OK (voir ci-dessus).
3. **Parité `prudent` + `?debug=1`** : OK.
Les réserves 2 et 3 de T-029 (constantes de `threat.js`, `try/catch` des écouteurs) ne sont pas de T-030 : restent pour T-031.

## Réserves nouvelles (non bloquantes)
1. **Compilation du shader de la Laisse en cours de partie (risque, non vérifié).** Le groupe de la Laisse est `visible = false` tant qu'elle n'est pas éclairée, et il en va de même des anneaux d'eau. Or `PERF_P2.md` §4 point 4 affirme que « tous les shaders sont compilés dès la première image ». Pour la Laisse (deux `ShaderMaterial` propres) rien ne le prouve, et aucun test ne compte les programmes avant et après sa première apparition. Si le moteur ne les précompile pas, la première apparition de la Laisse provoquerait une saccade de compilation, juste au moment le plus tendu du jeu. Correctif simple : à la fin de `createView`, forcer la visibilité du groupe, appeler `renderer.compile(scene, camera)`, rétablir ; et ajouter un contrôle `renderer.info.programs.length` identique avant et après la première apparition. À faire en T-032 ou en correctif court ; en attendant, nuancer la phrase de `PERF_P2.md`. Je ne l'ai pas corrigé : pas de défaut bloquant prouvé.
2. **Faisceau visible et faisceau logique non reliés par les données.** La simulation lit `lighthouse_beam_half_angle` (6°, `A_REGLER`) ; le rendu a son propre cône (rayon 5 m sur 70 m, projecteur 9°, bande de l'eau 0,2 rad soit 11,5°). Si le game-designer règle l'angle logique, ce que le joueur voit et ce qui repousse la Laisse divergeront. À dériver du paramètre dans une passe suivante (même esprit que la réserve de la période).
3. **Mesures** : tout vient de SwiftShader ; le rapport le dit clairement (§1) et ne conclut pas sur 60 i/s. Les écarts à l'ADR §4 sont cohérents avec le code : 5 lumières, 0 ombre ; appels de dessin 5 à 7 en jeu (37 en vue large) ; triangles 52 000 à 62 000 ; GPU « inconnu » à confirmer par la porte P1. Le temps de simulation n'est pas chronométré à part (budget JS 5 ms non prouvé sur ce point). Écran de mesure : intervalles entre frames et non temps GPU, ce qui est écrit sur l'écran et dans le JSON. La RAZ au changement de niveau est correcte. Mes chiffres (5,0 / 8,3 / 22,1 i/s ; p95 233 / 133 / 50 ms) diffèrent un peu de ceux du rapport (5,4 / 8,6 / 22,7) : bruit normal du rendu logiciel, même ordre relatif.
4. **Lisibilité du code** : `createView` fait environ 300 lignes avec beaucoup de constantes de scène en dur (phare, rochers, sable, échelles). Acceptable pour l'essai ; à découper si le rendu grossit. `window.__estran.setPose/probeLaisse` sont des crochets de test présents dans le bundle livré, sans effet sur le jeu.

## Corrections faites
Aucune. Aucun défaut bloquant.

## Recommandation à la Boss
Valider T-030 (avec réserves). Inscrire les réserves 1 (précompilation et contrôle du nombre de programmes) et 2 (angle du faisceau) à T-032 ou à un correctif court, et rappeler que seule la mesure P1 du propriétaire dira si le rendu est fluide.
