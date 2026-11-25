# Revue de pôle TD : T-031 (audio procédural Web Audio)

Code relu : `game/src/audio/*`, `src/ui/captions.js`, `src/ui/audio-opts.js`, diff de `src/sim/sim.js` et de `src/main.js` (entre 95e448e et d84e8dc). Mode économe : suite complète non rejouée (prévue en T-032).

## Vérifié (exécuté)
- `npm run test:unit` : **72/72 OK** (2,2 s).
- `npm run test:audio` : **29 contrôles OK** (« ALL 29 AUDIO E2E CHECKS PASSED »). Crête maximale -3,91 dBFS, aucun écrêtage, `dropped 0` sur les trois parcours (prudent, win, noisy).
- Bundle : `dist/estran.html` = 659 355 octets = **644 Kio**, conforme.
- Non rejoués : e2e jeu (37) et e2e rendu (25). Leur résultat reste celui annoncé par l'auteur, non vérifié par moi.

## 1. `sim.js` : OK
Le diff se limite à : tableau `listenerErrors` (plafonné à 50), `try/catch` autour de chaque écouteur dans `log()`, itération sur `listeners.slice()` (désabonnement pendant l'appel sans effet de bord), accesseur `listenerErrors`, option `onListenerError`. L'événement est poussé dans `events` avant les écouteurs, l'ordre et le contenu du journal sont inchangés, aucun appel au RNG. Les erreurs vont hors télémétrie. Parité préservée. Coût : un `slice()` par événement, négligeable. Réserve de T-029 correctement traitée.

## 2. Architecture : OK
- Séparation nette : `spatial.js`, `mix.js`, `caption-text.js` et `director.js` sont purs (sans Web Audio ni DOM, RNG seedé, aucune horloge murale). Les sous-titres et la synthèse partent des mêmes `cues`.
- Lecture seule de la simulation : `main.js` s'abonne par `sim.subscribe` et passe `sim.state` en lecture ; aucune écriture. Une faute audio est isolée par le `try/catch`.
- Démarrage sur geste : `AudioContext` créé uniquement dans `start()`, appelé au clic sur l'intro. Suspension à la pause, reprise au retour.
- Chaîne de sortie : bus, passe-bas maître, compresseur, plafond doux (WaveShaper, asymptote 0,85 soit -1,4 dBFS), volume. Le limiteur est mesuré par les tests.
- Nettoyage : chaque voix se libère à `onended` de sa dernière source (repli `setTimeout` 4 s), déconnexion des nœuds de sortie, LFO arrêtés ; plafond de 28 voix avec compteur `dropped`. Pas de fuite visible. Couches continues créées une fois.

## 3. Données : acceptable pour P2, avec dette
Rayons et seuils viennent de `menace.csv` / `lighthouse_*` (via `audioConfig` et `param`), marée via `data.tide`. Gains, fréquences, enveloppes et courbes de `mix.js` sont en dur : acceptable pour P2 (aucune valeur d'équilibrage de gameplay, uniquement du timbre). Dette à inscrire pour la direction audio complète (T-009) : externaliser en CSV les niveaux par catégorie.

## 4. Coût CPU : non mesuré (honnêteté)
Aucune mesure sur machine réelle. Estimation par construction : ~15 nœuds continus, au plus 28 voix de courte durée, tampons bruit ~2,8 Mo, `update()` une fois par frame (quelques `setTargetAtTime`, sans allocation notable ; le `place()` crée de petits objets par voix, négligeable). Risque faible. À mesurer en T-032 avec le panneau de perf (F2) sur un parcours bruyant.

## 5. Rendu : OK
Aucun fichier de `src/render/` modifié. `main.js` : ajout du branchement audio et de `drownLimit` dans `getState` (lecture seule, hook de test).

## Remarques non bloquantes
1. La note audio dit « les pas sont sacrifiés en premier » ; le code refuse simplement toute nouvelle voix au-delà de 28 (premier arrivé, premier servi). Un `grab` ou un glas pourrait être refusé en cas de saturation. Jamais observé (`dropped 0`) ; à corriger (priorité par type) ou à reformuler dans la note.
2. Personne n'a écouté le résultat : timbre et effet de peur non validés (limite déjà déclarée par l'auteur).
3. LUFS non mesuré (RMS -20 dBFS).

Aucun défaut bloquant ; aucune correction de code effectuée.

**Revue TD : OK**
