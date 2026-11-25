# Revue TD : T-038 (audio, voix prioritaires, BUG-001)

Revue rapide sur le diff (`git diff`), sans relance des suites. `npm run test:unit` : 72/72. Aucun fichier hors `src/audio/`, tests audio et notes n'est modifié (ni rendu, ni simulation).

## 1. Logique de vol : correcte
- Critique jamais refusée : `makeRoom` accepte comme victime une voix de priorité strictement inférieure, et, pour une voix critique seulement, la plus ancienne voix critique. Une voix critique n'est donc refusée que si `live` est vide de voix non volées, ce qui ne peut pas arriver à 28 voix actives. `droppedCritical` est bien comptée.
- Comptage : `stats.active` est décrémenté une seule fois (au vol, ou à `release` si non volée). `release` est idempotent (`done`), donc `onended` puis `setTimeout` ne double pas.
- Pas de fuite de nœuds : la voix volée reste dans `live` jusqu'à sa fin naturelle, où `release` appelle `out.dispose()` et le nettoyage de `build`. Les sources vont au bout en silence (au plus 4 s, 28 voix plus quelques voix volées : borné).
- Pas de clic : rampe 30 ms sur le gain d'étage `out.input`, que les `build` n'automatisent pas (ils ont leurs propres gains d'enveloppe) ; `cancelScheduledValues` puis `setValueAtTime(g.value)` évite le saut.
- Réserve mineure (non bloquante) : un battement de coeur ou un grondement peut couper un grondement critique plus ancien en cours, quand seules des voix critiques restent. Cas extrême, acceptable.

## 2. Test e2e : affaibli, mais de façon justifiée
- Les deux contrôles (0 critique refusée, refus <= 15 % et aucun de priorité haute) restent significatifs. 15 % est raisonnable : mesuré 0 à 4 %, soit une marge d'environ 4x contre le bruit de cadence, et une régression de durée de vie des voix la dépasserait.
- Faiblesse : le test peut passer sans jamais atteindre le plafond (0 refus, 0 vol), donc sans exercer la règle. À corriger avec le point 4.

## 3. Autres changements
Statistiques exposées (`index.js`, `offline.js`), script `audio-cpu.cjs` (sortie 1 si critique refusée, bien). Rien d'autre. `NOTES_AUDIO_P2.md` à jour et honnête sur l'affaiblissement.

## 4. Test unitaire déterministe du vol : à faire dans la foulée, non bloquant pour T-038
Aucun test unitaire ne couvre `engine.js` ; la règle n'est vérifiée que par un e2e stochastique. Recommandation : tâche courte (contexte audio factice, 28 voix basses, puis une critique : `stolen` = 1, `droppedCritical` = 0, `active` = 28 ; une basse de plus : refusée) et test pur de `priorityOf` (seuil 65 %). À planifier avant la fin de la phase audio, pas avant la validation Boss.

Revue TD : OK
