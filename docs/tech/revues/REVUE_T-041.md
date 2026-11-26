# Revue TD : T-041 (chronométrage dans le cloud)

Date : 2026-11-26. Relecteur : directeur technique. Revue de pôle courte, mode économe.

**Revue TD : OK** (avec 3 corrections mineures de documentation, non bloquantes pour la Boss).

## Vérifications demandées

1. **Chronomètre côté test** : `git diff -- game/src` est vide ; seuls `tests/p2/timing.mjs` et `tests/p2/timing-load.cjs` sont nouveaux. `window.__estran` existe déjà (crochet `?test=1`, `src/main.js:134`). Conforme.
2. **Méthode honnête** : oui pour l'essentiel. `performance.now`/`hrtime` seulement dans les tests ; seul `sim.step()` est chronométré (la décision du joueur automatique est hors de la fenêtre) ; échauffement de 3 parties par automate écarté ; surcoût de la paire `hrtime` mesuré (0,0001 ms) et signalé dans la sortie. Aucun chiffre du rendu n'est présenté comme une mesure GPU : « SwiftShader, indicatif » est écrit partout. Le moindre démarrage à froid est mesuré avec un navigateur neuf par essai.
3. **Hors `npm run all`** : confirmé. `all` = `ci + lint + build + test` ; `test` n'appelle pas `p2:timing`, et `timing.mjs` n'est pas un `*.test.js` donc n'est pas ramassé par `node --test`.
4. **Docs** : date, commande, machine (4 coeurs Xeon 2,1 GHz, Node 22.23.5, Chromium 157) et limites présentes dans BUDGETS §2.4/§2.5 et PERF_P2 §3. Critères d'acceptation couverts (100 parties, 844 443 pas, Laisse active à 82 %, 5 essais).

## Recoupement
`node tests/p2/timing.mjs` relancé : moyenne 0,0010 ms, p95 0,0019 ms, p99 0,0044 ms (cohérent), `createSim` 20,6 ms (cohérent). En revanche **max 7,13 ms et 6 pas au-dessus de 1 ms**, contre 2,65 ms et 4 pas dans la doc. Les pointes varient d'un lancement à l'autre, ce que le texte ne dit pas.

## Corrections demandées (mineures)
1. BUDGETS §2.5 et PERF_P2 §3 : présenter le max comme variable (relance du relecteur : 7,1 ms, 6 pas > 1 ms ; quelques ms, 4 à 6 pas sur 844 443) et non comme « 2,65 ms ». La conclusion (budget tenu en moyenne et à p99, pointes isolées sous 25 % de la période de 33,3 ms) reste vraie.
2. `timing-load.cjs` : la valeur « hooks » est `performance.now()` pris dans `page.evaluate`, après une attente par `requestAnimationFrame` ; c'est donc une borne supérieure (latence de scrutation plus aller-retour), pas l'instant exact de la fin de construction de la scène. Ajouter « borne supérieure » dans la doc (« ≈ 1,1 s jusqu'à la fin de la construction » devient « au plus ≈ 1,1 s »). Même remarque : la « première peinture » est la première peinture quelconque de la page, pas la première image du jeu ; le chiffre à retenir pour « jusqu'à la première image » est la 2e image (≈ 1,2 s). Les deux restent très sous les budgets.
3. Précisions de portée : `createSim` à 20 ms est mesuré à chaud (après échauffement, Node), le démarrage réel à froid peut être plus long, mais il est compris dans le total navigateur ; et les niveaux bas/moyen ne sont lancés que par `node tests/p2/timing-load.cjs 5 q=low|medium`, pas par `npm run p2:timing` (qui mesure le niveau par défaut). À écrire dans PERF_P2 §3 (la ligne d'accompagnement du README le dit déjà en partie).

## Limites déjà bien posées
Simulation sous Node sans audio ni dessin ; pointes non attribuées (ramasse-miettes en hypothèse, dit explicitement) ; rendu logiciel indicatif ; cache de fichier de l'OS chaud ; vrai PC à mesurer.

## Non vérifié par la revue
Lint et tests unitaires non relancés (la remise annonce lint vert et 85/85). `timing-load.cjs` non relancé (pas de lancement de navigateur par économie ; ses chiffres n'ont pas été recoupés, seule la simulation l'a été).
