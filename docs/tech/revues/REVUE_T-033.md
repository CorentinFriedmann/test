# Revue TD : T-033 (version jouable P2, fichier unique)

Mode économe : revue sur le diff, sans relancer la suite complète. Reviewer : Directeur Technique.

## Points demandés

1. **Parité de la simulation** : `git status` et `git diff` ne montrent aucun changement dans `game/src/sim/`. Parité intacte.
2. **Licence three.js** : `build.mjs` lit `node_modules/three/LICENSE` et lève une erreur si « three.js authors » ou « Permission is hereby granted » manquent. Le texte est inséré dans `dist/estran-p2.html` (une occurrence de « Permission is hereby granted », deux de « three.js authors »). `p2.cjs` vérifie le début et la fin du texte dans le fichier et dans l'écran de crédits. Réserve mineure : si le marqueur `<!--LICENCE_THREE-->` disparaissait du gabarit, le build ne planterait pas (le remplacement ne ferait rien). Seul le test `p2.cjs` le détecterait. Acceptable, à durcir plus tard.
3. **Crochets de test** : `window.__estran` n'existe qu'avec `?test=1`. `harness.cjs` ajoute `?test=1` à chaque ouverture (`&test=1` si une requête existe). Les tests ne sont donc pas affaiblis. Ils s'exécutent sur le fichier assemblé `estran-p2.html`. Le rendu des tests est le même que celui du public, à l'exception de l'objet exposé.
4. **Compteur de performance** : `meter.record` n'est appelé que si `!paused`. Le harnais appelle `hideIntro()`, qui appelle `resume()` et met `paused = false`. Les mesures P1 (rendu, bots) restent donc inchangées. Seules les images de l'écran de départ et de la pause sont exclues, ce qui est voulu.
5. **Cadre verrouillé** : aucune requête réseau dans `src/` (pas de `fetch`, `XMLHttpRequest`, `WebSocket` ni `sendBeacon`). Les seules URL du fichier sont des espaces de noms et des textes de licence. Aucun `alert`, `confirm` ni `prompt`. Le presse-papiers est sous `try/catch` avec repli sur une zone de texte sélectionnée (`execCommand`). `localStorage` est lu sous `try/catch` et le jeu fonctionne sans. La frappe dans un champ texte ne pilote plus le jeu (garde `typing` dans `main.js`, garde `TEXTAREA` dans `input.js`). F2 reste actif.

## Non vérifié par moi

Je n'ai pas relancé les suites e2e. Les chiffres annoncés (72, 14, 29, 37, 26, 30) et la taille de 655 Kio restent à la charge de l'auteur. Ils ne sont pas contredits par ce que j'ai lu.

## Conclusion

Aucun défaut bloquant, aucune modification de code.

**Revue TD : OK**
