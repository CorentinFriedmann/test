# PERF_P2 : mesures de rendu de la tranche P2 (T-030)

> Voie web (three.js 0.187.0, WebGL2). Les budgets d'Unreal de `BUDGETS.md` ne s'appliquent pas ; la référence est `ADR_PIVOT_WEB.md` §4.
> Auteur : graphics-programmer. Revue de pôle : technical-director. Validation : Boss.

## 1. Ce que ce rapport vaut, et ce qu'il ne vaut pas

Toutes les mesures ci-dessous viennent de Chromium headless dans le cloud, avec le **rendu logiciel SwiftShader (CPU, Vulkan émulé)**, à 960x540 (768x432 au niveau bas, échelle 0,8). Ce n'est pas un GPU.

- **Valable** : nombre d'appels de dessin, nombre de triangles, nombre de lumières, poids du fichier, mémoire JS, temps JavaScript du dessin, correction fonctionnelle, **ordre relatif** des trois niveaux (le coût de remplissage d'écran domine ici comme sur un petit GPU, mais pas dans les mêmes proportions).
- **Non valable** : cadence réelle, 95e centile réel, coût des ombres (il n'y en a pas), du brouillard, de la transparence et de l'eau sur un vrai GPU, thermique du Steam Deck. **On ne peut conclure ni que 60 i/s est tenu, ni qu'il ne l'est pas.**
- Les temps de frame sont des **intervalles entre deux `requestAnimationFrame`** (vsync compris), pas des temps GPU. Aucun compteur GPU n'est lu (l'extension de requête de temps n'est pas fiable dans les navigateurs).

La seule mesure qui compte est celle du propriétaire sur son PC (porte P1) : `?perf=1` (ou F2), jouer 60 s, bouton « Copier le rapport de performance », coller le JSON. Un navigateur à 60 Hz plafonne la cadence à 60 ; si le 95e centile dépasse 20 ms, le rendu est à revoir.

## 2. Mesures (headless, SwiftShader, bot « prudent » en temps réel, 10 s après 3 s de chauffe)

| Niveau | Résolution du tampon | Cadence moyenne | Frame moyenne | 95e centile | Pire frame | JS du dessin (moy. / p95) | Mémoire JS |
|---|---|---|---|---|---|---|---|
| high | 960x540 (x1, anticrénelage MSAA) | 5,4 i/s | 185 ms | 200 ms | 217 ms | 0,77 / 1,1 ms | 13 Mo |
| medium | 960x540 | 8,6 i/s | 117 ms | 133 ms | 150 ms | 0,77 / 1,2 ms | 12 Mo |
| low | 768x432 (x0,8) | 22,7 i/s | 44 ms | 50 ms | 67 ms | 0,67 / 1,1 ms | 11 Mo |

Lecture : le temps JS du dessin est négligeable aux trois niveaux (moins de 1,2 ms) ; tout le coût est du remplissage logiciel (shader d'eau plein écran, MSAA, résolution). Pour mémoire, le prototype de T-027 faisait 11 à 15 i/s au même format avec une scène plus simple : le niveau haut est donc **plus lourd que le prototype sous SwiftShader**, le niveau bas à peu près équivalent. Ce n'est pas un résultat de GPU.

Fichier brut des mesures : lancer `npm run test:render` ; `captures/.tmp/perf.json` (ignoré par git ; `captures/perf.json` après `npm run captures`) contient les trois rapports complets et les comptes de la vue large.

### Comptes indépendants du GPU (vue large de nuit : phare, faisceau, rochers, eau dans le champ)

| Niveau | Appels de dessin | Triangles |
|---|---|---|
| high | 37 | 61 577 |
| medium | 37 | 56 765 |
| low | 37 | 53 873 |

Dans le jeu normal (regard vers le sable) le compte tombe à 5-11 appels (élimination hors champ). Le terrain (≈ 51 000 triangles, maillage fixe de la simulation) domine ; les niveaux diffèrent peu en triangles, surtout en pixels et en shaders. Les rochers sont **un seul** appel (InstancedMesh, 48 instances).

## 3. Écarts aux budgets de `ADR_PIVOT_WEB.md` §4

| Budget | Valeur mesurée ou comptée | État |
|---|---|---|
| ≤ 300 appels de dessin | 37 (pire vue mesurée) | tenu |
| ≤ 1 M triangles visibles | 62 000 | tenu |
| ≤ 30 lumières dynamiques (cible réelle < 4 avec ombres) | 5 : lune, ambiante, hémisphérique, faisceau, lampe ; **0 ombre** | tenu (aucune lumière n'est retirée en jeu : intensité 0 plutôt que `visible = false`, pour éviter la recompilation d'un shader) |
| JS (logique + préparation du rendu) ≤ 5 ms | dessin + HUD : 0,8 ms en moyenne, 1,2 ms au p95 ; la simulation à pas fixe n'est pas chronométrée à part | tenu pour le rendu ; simulation à mesurer par le propriétaire |
| GPU ≤ 11 ms (PC 1080p) | **non mesurable ici** | **inconnu** |
| GPU ≤ 14 ms (Steam Deck, 800p) | **non mesurable ici** | **inconnu** |
| Mémoire GPU ≤ 1 Go | non mesurée ; textures minuscules (sable 256², hauteurs 320² en 8 bits, lueur 128²), tampons 960x540 à 1920x1080 | estimée très inférieure, à confirmer |
| JS heap ≤ 500 Mo | 11 à 13 Mo | tenu |
| Poids du jeu web ≤ 100 Mo | `dist/estran.html` : 623 Kio (limite fixée par la Coordination : 1,5 Mo, testée) | tenu |
| Chargement ≤ 10 s, démarrage à froid ≤ 3 s | génération du terrain et de la texture des hauteurs au démarrage non chronométrée à part ; la page est prête avant la première mesure | non mesuré finement |

## 4. Où est le risque sur un vrai GPU (estimations, non mesurées)

1. **Shader d'eau plein écran** : environ 14 évaluations de bruit par pixel au niveau haut (3 octaves, normale par différences finies, reflets, écume), 6 au niveau bas. Négligeable sur un GPU de classe GTX 1660 à 1080p d'après le nombre d'opérations, mais c'est le premier suspect si P1 est « saccadé ». Premier levier : `waterOctaves` à 2 ou résolution dynamique.
2. **Résolution** : le niveau haut accepte un `devicePixelRatio` jusqu'à 2 (4K sur écran dense) ; c'est le deuxième levier (`pixelRatioMax`).
3. **Anticrénelage MSAA** (haut seulement) : coûteux sur APU ; décidé au chargement, car il ne peut pas être changé en cours de partie.
4. Pas de saccade de compilation attendue en jeu : les shaders sont tous compilés dès la première image ; les lumières ne sont ni ajoutées ni retirées ; le changement de niveau en cours de partie recompile (action volontaire du joueur).

## 5. Parité (règle du GDD §12) : ce qui est vérifié

`tests/e2e/render.cjs`, tous verts :

- scénario `prudent` (le plus long, victoire sans saisie) rejoué avec `?q=low&debug=1`, `?q=medium`, `?q=high&moment=day`, et `?q=high` avec changement de niveau **en cours de partie** (low, medium, high en alternance) : **journaux de télémétrie octet pour octet identiques** (88 364 octets) ;
- scénario `win` (T-029) : low contre high, temps réel contre pas manuel : identique ;
- la Laisse : lisible aux trois niveaux (pixels qu'elle modifie dans la frame : 2,75 % de l'image en haut, 2,7 % au milieu, 2,0 % en bas) ; **jamais dessinée quand la simulation dit qu'elle n'est pas éclairée**, aux trois niveaux (sauf `?debug=1`).
- Ce qui peut cacher la Laisse (brouillard, rochers, lumières) est identique aux trois niveaux ; seules la finesse de sa forme, la résolution et le grain changent.

## 6. Reproduire

```
cd game && npm run build && npm run test:render   # captures et mesures dans captures/.tmp/
npm run captures                                   # met à jour les captures versionnées de game/captures/
```
