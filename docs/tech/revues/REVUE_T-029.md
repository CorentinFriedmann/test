# Revue TD de T-029 : noyau jouable d'ESTRAN

Date : 2026-11-24. Revue de pôle ciblée (mode économe), pas de relecture ligne à ligne. Code : `game/`.

## Résultat : Revue TD : OK (avec 5 réserves non bloquantes)

## Vérifié (exécuté)
- `npm run all` dans `game/` : npm ci, build, **56 tests unitaires verts, 37 contrôles e2e verts** (Playwright, WebGL2, aucune erreur ni alerte console). Les chiffres annoncés sont exacts.
- Bundle `dist/estran.html` : 598 Ko, un seul fichier, minifié (three.js 0.187.0 inclus). Acceptable pour l'essai ; mesure d'ensemble contre `ADR_PIVOT_WEB.md` §4 à faire en T-030.

## OK
- `src/sim/` est pur : aucune occurrence de three, document, window, Date.now, performance.now, requestAnimationFrame ni Math.random. RNG mulberry32 à graine ; la Laisse a son générateur propre (`seed ^ hash('laisse')`) avancé uniquement par tick.
- Pas fixe de 30 Hz : `hz = round(1/sim_step)`, `dt = 1/hz` (le 0.0333 du CSV n'est pas utilisé tel quel, bon). `stepper.js` accumule les temps de frame et borne les pas par frame ; le retard est abandonné au lieu de changer la longueur d'un tick.
- Rendu en lecture seule : `scene.js`, `ui/` et `main.js` ne contiennent aucune écriture dans l'état de la simulation. Le rendu n'émet que des ticks via `sim.step()`.
- Test de parité probant pour ce qu'il couvre : même automate `win`, qualité `low` en pas manuel contre `high` en temps réel x60, comparaison du JSON complet de télémétrie (207 événements, 397 échantillons), puis identité avec le scénario de victoire de référence. Il couvre aussi le redémarrage (même graine, même journal).
- Données : les paramètres d'équilibrage de `threat.js` et `sim.js` passent par `param()` / `worldParam()` ; `monde.csv` porte les valeurs hors GDD avec une note et un statut (`FIXE` / `A_REGLER`) et cite le GDD ou « passe b ». Bonne traçabilité.
- `sim.subscribe(fn)` : renvoie des copies des événements et une fonction de désabonnement ; les écouteurs survivent à `reset()`. Prêt pour T-031.

## Réserves (non bloquantes, à solder en T-030 / T-031)
1. **Période du faisceau en dur dans le rendu** : `src/render/scene.js` ligne 177 utilise `simTime / 8`, alors que la simulation lit `lighthouse_beam_period`. Si ce paramètre change, le faisceau visible et le faisceau logique (qui repousse la Laisse) se désynchronisent sans qu'aucun test le voie. À corriger en T-030 en passant la période au rendu depuis les données. Il y a aussi quelques constantes visuelles en dur dans `scene.js` (altitude du faisceau 21.1, angle du spot 9 degrés) ; acceptable pour le rendu provisoire, à ranger dans une configuration de rendu.
2. **Petites constantes en dur dans `threat.js`** : seuil de progression du contournement `0.2` (ligne 85), délai de blocage `1` s avant de changer de point de ronde (ligne 213). Sans impact sur l'équilibrage joueur, mais elles contredisent l'en-tête du fichier (« nothing is tuned in this file »). À déplacer dans `monde.csv` à la prochaine passe.
3. **Écouteur qui lève une exception** : `log()` appelle les écouteurs sans `try/catch` ; une erreur dans le code audio de T-031 interromprait `step()` en plein tick et laisserait la simulation dans un état partiel. À protéger (try/catch par écouteur, erreur journalisée hors de la simulation) avant de brancher l'audio.
4. **État de la Laisse exposé en écriture** : `st.threat` est l'objet vivant `th`. Rien ne l'écrit aujourd'hui, mais la garantie n'est que par convention. Pour T-030, ne lire que `getState()` ou un instantané ; envisager `Object.freeze` côté rendu en mode debug.
5. **Lisibilité** : `threat.update()` fait environ 90 lignes, le bloc de constantes `C` a des lignes de plus de 200 caractères, et l'état de l'automate vit dans des variables de fermeture (`hearAcc`, `silence`, `wp`, `target`...), donc non sérialisable. Pas un problème pour l'essai ; ce sera une dette si on ajoute des sauvegardes ou des rediffusions. Si T-030 doit toucher `threat.js`, scinder `update()` en une fonction par état. `sim.step()` (environ 150 lignes) mérite le même découpage plus tard.

## Parité : limite à connaître
Le test ne joue que l'automate `win` (sans saisie). Les scénarios avec la Laisse (`prudent`, `noisy`) n'ont pas de comparaison entre qualités. Le risque est faible car le rendu n'écrit pas dans l'état, mais T-030 devra rejouer la parité avec `prudent` et `?debug=1` (la silhouette de la Laisse est alors dessinée).

## Les 8 écarts et interprétations du GDD
Je n'ai pas trouvé la liste des 8 écarts dans `game/README.md` (la section « Passe b » décrit le comportement, pas les écarts) ni dans un rapport de remise du dépôt. Je n'ai donc pas pu les passer en revue un par un. Ce que je vois dans `data/monde.csv` est sain : chaque règle absente du GDD est un paramètre nommé, noté et classé `A_REGLER` ou `FIXE` (profondeur maximale d'apparition, délai d'assouplissement, durée d'impulsion du débris, position de la manivelle, rayon d'arrivée, pas de contournement). Rien de technique à redire. **À demander à `gameplay-programmer`** : consigner les 8 écarts dans le README ou dans le rapport de remise, pour que la Boss et le `game-designer` les valident côté design (ce n'est pas une question technique).

## Corrections faites
Aucune. Aucun défaut bloquant.

## Recommandation à la Boss
Passer T-029 en validation : la pile est conforme à l'ADR, la simulation est pure et déterministe, les tests sont verts et reproductibles. Demander la liste écrite des 8 écarts avant ou avec le verdict, et inscrire les réserves 1 et 3 comme critères d'acceptation de T-030 et T-031.
