# Bugs et écarts connus

> Tenu par `qa-lead`. Triage avec le `producer`. Un bug n'est fermé qu'après vérification du correctif.
> Sévérités : Bloquant, Critique, Majeur, Mineur, Cosmétique. Priorité : P1 (avant la porte P2), P2 (avant P3), P3 (plus tard).
> Plateforme et build : tous les bugs ci-dessous ont été constatés dans Chromium sans tête (Linux, rendu logiciel SwiftShader, pas de sortie audio), sur le dépôt au commit `d76a4b5` (T-032 étape 1) sauf mention.
> Création : T-032, 2026-11-25.

| ID | Titre | Sévérité | Priorité | Statut |
|---|---|---|---|---|
| BUG-001 | Audio : plafond de 28 voix atteint sur un parcours bruyant, `npm run all` rouge | **Bloquant pour P2** | P1 | FERMÉ (T-038, 2026-11-25) |
| BUG-002 | La règle ne punit que le joueur qui chasse la Laisse | Majeur (conception) | P1 (décision) | OUVERT |
| BUG-003 | Aucune approche de la Laisse avant 160 s pour un joueur qui suit la règle | Majeur (conception) | P1 (décision) | OUVERT |
| BUG-004 | Le démarrage de l'audio divise la cadence par deux sous rendu logiciel | Majeur, à confirmer | P2 | OUVERT |
| BUG-005 | Le backlog parle de 5 questions de P2, le GDD en compte 8 | Mineur (documentation) | P1 | OUVERT |

---

## BUG-001 : Audio, plafond de 28 voix atteint, `npm run all` rouge  (FERMÉ par T-038)

> **Fermé le 2026-11-25 (T-038, `audio-director`)** : priorité par type dans `src/audio/engine.js` (saisie, grondement, battement de coeur et remous proches jamais refusés ; coupe de 30 ms de la plus ancienne voix de priorité inférieure ; pas coupés ou refusés en premier). Vérifié : `audio.cjs` vert 3 fois de suite, `audio-cpu.cjs` 0 voix critique refusée, `npm run all` vert 2 fois de suite depuis `npm ci` (72 unitaires, 14 P2, 37 jeu, 26 rendu, 30 audio). Détail : `docs/audio/NOTES_AUDIO_P2.md`. BUG-004 reste ouvert.

- **Sévérité** : Bloquant (empêche le critère « `npm run all` vert » de T-032) · **Priorité** : P1 · **Plateforme** : Chromium sans tête, Linux · **Build** : `d76a4b5` ; aussi reproduit au commit `994df01` (avant l'étape 1 de T-032), donc pas causé par les correctifs de rendu.
- **Étapes de reproduction** :
  1. `cd game && npm ci && npm run build`.
  2. `node tests/e2e/audio.cjs`.
- **Attendu** : toutes les vérifications passent (T-031 le déclarait vert), dont « Voice count stays bounded and nothing was dropped » (voix actives <= 28 **et** `dropped === 0`).
- **Obtenu** : l'échec est reproduit 5 fois sur 5 (suite complète, puis 3 relances isolées, puis le commit `994df01`) : `active=22 dropped=28`, `active=28 dropped=140`, `active=27 dropped=43`, `active=25 dropped=14`, `active=25 dropped=24`. Dans une relance, la vérification « les repères de la Laisse ont été joués : remous, grondement, saisie, battement de coeur » a aussi échoué : **la saisie n'a pas été jouée** (voix refusée).
- **Mesure indépendante du test** (`node tests/p2/audio-cpu.cjs`, temps réel, automate bruyant après le premier relevé) : 66 voix jouées et **11 refusées en 15 s** (deux fois de suite : 66/11 et 67/11).
- **Analyse** : `MAX_VOICES = 28` (`src/audio/engine.js`) refuse toute nouvelle voix, premier arrivé premier servi, sans priorité par type. Un parcours bruyant (pas dans l'eau, remous) peut donc occuper le plafond et faire refuser un repère critique (saisie, grondement, battement de coeur). Le test, lui, avance la simulation de 60 pas par image, ce qui est plus dense que le jeu réel ; mais la mesure en temps réel montre des refus aussi. Réserve : sans sortie audio réelle, la fin des voix (`onended`) dépend de l'horloge du contexte audio du navigateur sans tête ; sur un vrai PC les refus peuvent être plus rares. À confirmer à l'oreille, mais le risque de perdre un repère critique est réel.
- **Piste de correction** (à décider par `audio-director` + `audio-programmer`) : réserver des voix aux repères critiques (saisie, grondement, battement de coeur, remous proches) et laisser les pas se faire refuser seuls ; ou céder la plus ancienne voix de faible priorité. Mettre le test d'accord (borne sur les repères critiques plutôt que `dropped === 0`, ou rendre la densité du test réaliste).
- **Vérification attendue du correctif** : `node tests/e2e/audio.cjs` vert 3 fois de suite, et `node tests/p2/audio-cpu.cjs` donne 0 voix refusée de type critique.

## BUG-002 : La règle ne punit que le joueur qui chasse la Laisse

- **Sévérité** : Majeur (conception) · **Priorité** : P1 (décision de la Coordination ou du `game-director`) · **Plateforme** : simulation pure sous Node · **Build** : `d76a4b5`
- **Étapes** : `cd game && node tests/p2/run.mjs` (graines 101 à 120) ; résultat dans `game/captures/.tmp/p2-discrimination.json`.
- **Attendu** : un joueur qui ignore la règle (bruit, lumière, manivelle) échoue dans la grande majorité des parties.
- **Obtenu** : l'automate « bruyant » du critère (il court **vers** la Laisse) échoue 20/20, mais deux joueurs qui ignorent la règle **sans chercher le danger** gagnent le plus souvent : `win` (marche, ne touche jamais la manivelle) gagne **14/20** (70 %), `heedless` (court partout, jamais la manivelle) gagne **16/20** (80 %). Le critère de T-032 (90 % / 90 %) est donc rempli par la paire demandée, mais il est facile à passer ; il ne prouve pas qu'un joueur ordinaire est puni de ne pas suivre la règle.
- **Remarque** : l'échec de `win` vient de saisies (5) et d'une noyade (1) : l'automate attend sur place, parfois dans l'eau montante. Ce n'est pas un défaut du jeu.
- **Décision demandée** : accepter (le joueur humain explore et attire la Laisse plus qu'un automate) ou resserrer la menace (portée d'écoute, curiosité) avant P3. À juger d'abord par la partie humaine.

## BUG-003 : Aucune approche de la Laisse avant 160 s pour un joueur qui suit la règle

- **Sévérité** : Majeur (conception, écart 6 du GDD) · **Priorité** : P1 (décision) · **Plateforme** : simulation pure · **Build** : `d76a4b5`
- **Étapes** : `node tests/p2/run.mjs`.
- **Attendu** : de la peur avant que la charge du phare tombe sous 20 % (160 s) ; la Laisse apparaît à t = 57 s.
- **Obtenu** (20 parties, automate `prudent`) : **0 s** passée à moins de 15 m de la Laisse (avant 160 s et sur toute la partie), **0 approche**, 0 saisie, 0 grondement avant 160 s ; moyenne de **0,7 s** à portée d'écoute (moins de 45 m) avant 160 s. L'automate `silent` (marche lente) : 5,2 s à portée d'écoute, rien de plus. Les automates qui ignorent la règle sans la chasser n'approchent pas non plus avant 160 s (0 approche). La peur avant 160 s n'existe, parmi les 100 parties jouées, que pour l'automate qui court vers la Laisse (8 parties sur 20 avec au moins une approche).
- **Limite** : un automate n'a pas peur ; la distance à la Laisse est un substitut. La peur d'un humain naît aussi de l'attente et des remous entendus sans qu'elle approche. Il faut l'avis du propriétaire (questions 5 et 7).
- **Décision demandée** : voir si la partie humaine confirme ; sinon régler l'apparition ou la ronde (`menace.csv`, game-designer).

## BUG-004 : Le démarrage de l'audio divise la cadence par deux sous rendu logiciel

- **Sévérité** : Majeur, **à confirmer** sur un vrai PC · **Priorité** : P2 · **Plateforme** : Chromium sans tête, SwiftShader, 4 coeurs, aucune sortie audio · **Build** : `d76a4b5`
- **Étapes** : `cd game && node tests/p2/audio-cpu.cjs` (sortie dans `captures/.tmp/p2-audio-cpu.json`).
- **Attendu** : coût audio faible devant celui du rendu.
- **Obtenu** (niveau bas, 768x432, automate bruyant en temps réel, 15 s, deux mesures chacune) : sans audio **38,8 i/s**, moyenne 25,8 ms, 95e centile 33,4 ms ; avec audio démarré **20,2 i/s**, moyenne 49,6 ms, 95e centile **100 ms** ; temps JS du dessin (qui inclut la mise à jour audio) 0,45 ms puis 1,2 ms. Synthèse hors ligne d'un parcours bruyant entier : 12,1 à 12,8 s pour 213,9 s d'audio, soit **environ 6 % d'un coeur** (24 kHz).
- **Analyse** : le temps JS ajouté est faible (environ +0,8 ms) ; la perte de cadence vient plutôt du fil audio qui se dispute le processeur avec le rendu logiciel (4 coeurs). Sur un GPU, le rendu ne mange pas le processeur et l'effet doit disparaître, mais ce n'est **pas démontré**. La lecture de `AudioContext.renderCapacity` (charge réelle du fil audio) n'a pas été faite : elle demande une sortie audio et un crochet absent du jeu.
- **Vérification attendue** : la porte P1 (rapport du propriétaire, F2) doit être mesurée **avec le son actif**, 60 s dans une partie bruyante.

## BUG-005 : Le backlog parle de 5 questions de P2, le GDD en compte 8

- **Sévérité** : Mineur (documentation) · **Priorité** : P1 · **Build** : `d76a4b5`
- **Étapes** : comparer `production/BACKLOG.md` (T-032 « questionnaire de T-006 (5 questions) », T-033 « formulaire des 5 questions de P2 », « les 5 réponses ») avec `docs/design/GDD.md` §13 (8 questions, validées en T-036).
- **Attendu** : un seul nombre. **Obtenu** : 5 dans le backlog, 8 dans le GDD et dans `docs/qa/QUESTIONNAIRE_P2.md`.
- **Conséquence** : T-033 doit prévoir un formulaire de **8** questions, sinon les questions 6 à 8 (casque, son coupé, sous-titres) ne seront pas posées et la question 7 (R3) restera sans réponse.

> 2026-11-26 : le propriétaire juge le prototype P2 « fluide » sur son ordinateur (porte P1). BUG-004 n'est pas observé sur machine réelle ; à refermer par le qa-lead si aucun autre signalement.
