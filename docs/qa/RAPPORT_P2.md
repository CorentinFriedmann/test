# Rapport de la porte P2 (partie automatisée)

> Auteur : `qa-lead`, tâche T-032, 2026-11-25. Build : `d76a4b5` (+ fichiers de test de T-032). Environnement : Chromium sans tête, Linux 4 coeurs, rendu logiciel SwiftShader, **aucune sortie audio**, simulation pure sous Node pour les parties.

## Conclusion

**P2 : NON PRÊTE à être jugée tant que BUG-001 n'est pas corrigé.**

Raison : `npm run all` n'est pas vert (une vérification audio échoue, de façon reproductible, voir BUG-001), alors que le critère de la porte l'exige. Le reste est en état : les automates passent les seuils de discrimination, les durées et les mesures de peur sont établies, le questionnaire est prêt. Une fois BUG-001 corrigé (correctif court, un agent audio), P2 peut être jugée « prête à être jugée par le propriétaire », avec les réserves ci-dessous (BUG-002 à BUG-004).

**Partie humaine : EN ATTENTE du propriétaire.** Aucun avis de joueur n'a été recueilli ni inventé. **L'objectif « la moitié de la peur est portée par le son » (T-004 R3) n'est PAS présenté comme atteint : personne n'a écouté le jeu**, le studio n'a pas de sortie audio. Les mesures audio (niveau, panoramique, absence d'erreur) disent que le son est techniquement correct, pas qu'il fait peur.

## 1. Discrimination de la règle (20 graines par automate : 101 à 120)

Commande : `cd game && npm run p2:report` (données brutes : `game/captures/.tmp/p2-discrimination.json`). Test : `game/tests/p2/discrimination.test.js` (`npm run test:p2`, 2,6 s, fait partie de `npm test`).

| Automate | Ce qu'il représente | Victoires | Défaites | Seuil | Verdict |
|---|---|---|---|---|---|
| `prudent` | suit la règle : attend, retourne à la manivelle après chaque relevé, remonte le phare | **20/20 (100 %)** | 0 | >= 90 % de victoires | **atteint** |
| `noisy` | ignore la règle : après le premier relevé il **court vers la Laisse** dans les hauts-fonds | 0/20 | **20/20 (100 %)**, toutes par saisie | >= 90 % de défaites | **atteint** |

Les deux automates sont ceux de `src/sim/bot.js`, **non modifiés**. **Réserve importante** : `noisy` ne représente pas honnêtement quelqu'un qui « ignore la règle » ; il cherche activement le danger. J'ai donc ajouté trois joueurs d'appoint (`game/tests/p2/lib.js`), rapportés sans être comptés dans le critère :

| Automate d'appoint | Comportement | Victoires | Défaites |
|---|---|---|---|
| `win` | marche, relève au plus court, ne touche jamais la manivelle, attend où il se trouve | 14/20 (70 %) | 6/20 (5 saisies, 1 noyade) |
| `heedless` | comme `win` mais court dès qu'il bouge (bruyant) | 16/20 (80 %) | 4/20 (3 saisies, 1 noyade) |
| `silent` | comme `prudent` mais marche lente dans l'eau (bruit minimal) | 20/20 | 0 |

**Lecture** : la règle est **discriminante au sens du critère** (100 % / 100 %), mais seulement contre un joueur qui attaque la Laisse. Contre un joueur qui ignore la règle sans la chercher, l'échec n'est que de 20 à 30 % (BUG-002). La règle n'est **pas signalée comme non discriminante** (seuils atteints), mais ce critère est faible ; la partie humaine tranchera.

## 2. Durée des parties (temps de simulation, 40 parties de la paire de référence)

| Automate | Min | Médiane | Max | Dans 5 à 10 min (300 à 600 s) |
|---|---|---|---|---|
| `prudent` (20 victoires) | 392 s | 395 s | 397 s | **20/20** (6 min 35 s) |
| `noisy` (20 défaites) | 84 s | 221 s | 289 s | **0/20** (1 min 24 s à 4 min 49 s) |

Lecture : une **partie menée à terme dure environ 6 min 35 s** (la tranche dure 480 s, la victoire arrive vers 395 s) : l'objectif est atteint. Les défaites par saisie sont plus courtes (3,5 min en médiane) : c'est normal, la partie s'arrête. Sur l'ensemble des 40 parties, 20 sont dans la cible, 20 sont des défaites plus courtes. D'appoint : `silent` 414 à 428 s ; `win` et `heedless` 142 à 398 s.

## 3. Mesure de la peur avant 160 s (écart 6 du GDD)

La Laisse apparaît à t = 57 s ; le phare passe sous 20 % de charge à 160 s. Substitut mesuré : distance entre la Laisse et le joueur (un automate n'a pas peur). Une « approche » commence quand la Laisse passe sous 15 m et se termine au-delà de 20 m.

| Mesure (moyenne sur 20 parties) | `prudent` | `noisy` | `win` | `heedless` | `silent` |
|---|---|---|---|---|---|
| Temps à moins de 15 m, avant 160 s | **0 s** | 4,1 s (max 15,2) | 0 s | 0 s | 0 s |
| Temps à moins de 15 m, partie entière | **0 s** | 18,0 s | 25,1 s | 28,7 s | 0 s |
| Approches avant 160 s | **0** (0/20 parties) | 0,60 (8/20 parties) | 0 | 0 | 0 |
| Temps à portée d'écoute (< 45 m), avant 160 s | **0,7 s** | 75,9 s | 13,3 s | 19,1 s | 5,2 s |
| Grondements (rôde vers enquête), avant 160 s | **0** | 10 en tout | 0 | 0 | 0 |
| Saisies, partie entière | **0** | 40 (2 par partie) | 14 | 15 | 0 |
| Saisies avant 160 s | **0** | 6 (3 parties) | 0 | 0 | 0 |

**Constat : pour le joueur qui suit la règle, la peur n'existe pas avant 160 s** au sens de cette mesure : aucune approche, aucune saisie, presque aucun moment à portée d'écoute. L'automate prudent ne rencontre **jamais** la Laisse (0 s à moins de 15 m, sur 20 parties entières). La tension d'un joueur humain dépendra donc de l'attente et des remous lointains, ce que seule la partie humaine peut dire (questions 5 et 7). Signalé en BUG-003.

## 4. Suites de tests

| Suite | Résultat |
|---|---|
| `npm run all` (npm ci + build + `npm test`), dépôt propre, **passage 1** | **ROUGE** : 72/72 tests unitaires, 5/5 tests P2, 37/37 scénarios jeu, 26/26 rendu, **audio : 1 échec** (« Voice count stays bounded and nothing was dropped », `active=22 dropped=28`). Durée : 20 min 10 s |
| Relances de `node tests/e2e/audio.cjs` | 3 sur 3 en échec (1 à 2 vérifications), et même échec sur le commit `994df01` avant l'étape 1 de T-032 : **BUG-001**, pas un hasard |
| `npm test` (second passage) | **ROUGE** (second passage, même cause) : 72/72 unitaires, 5/5 P2, 37/37 jeu, 26/26 rendu, audio : même échec « Voice count stays bounded and nothing was dropped » (`active=28 dropped=26`) |
| Console | 0 erreur et 0 avertissement relevés dans toutes les vérifications qui contrôlent la console (le bruit du pilote logiciel « GPU stall due to ReadPixels » est filtré par le harnais, déjà accepté) |

**Exigence « deux fois de suite verte » : NON remplie.** Elle ne peut pas l'être tant que BUG-001 est ouvert. Le second passage a été fait avec `npm test` (sans `npm ci`) plutôt qu'avec `npm run all`, faute de temps utile : la cause de l'échec est déterministe.

## 5. Performances (rendu logiciel : ne dit rien d'un vrai GPU)

Tableau de `docs/tech/PERF_P2.md` repris avec ses limites : Chromium sans tête, **SwiftShader (CPU)**, 960x540 (768x432 au niveau bas), automate prudent en temps réel, 10 s après 3 s de chauffe. **On ne peut conclure ni que 60 i/s est tenu, ni qu'il ne l'est pas.** Valables : appels de dessin, triangles, temps JS, ordre relatif des niveaux.

| Niveau | Cadence (cette mesure) | Frame moyenne | 95e centile | JS du dessin | Appels de dessin | Triangles | `PERF_P2.md` (mesure de T-030) |
|---|---|---|---|---|---|---|---|
| high | 10,1 i/s | 99,0 ms | 116,7 ms | 0,65 ms | 5 en jeu (37 vue large) | 59 923 (61 577 vue large) | 5,4 i/s, 185 ms, p95 200 ms |
| medium | 14,3 i/s | 70,0 ms | 83,4 ms | 0,58 ms | 5 (37) | 55 123 (56 765) | 8,6 i/s, 117 ms, p95 133 ms |
| low | 39,8 i/s | 25,1 ms | 33,4 ms | 0,50 ms | 5 (37) | 52 243 (53 873) | 22,7 i/s, 44 ms, p95 50 ms |

Les cadences absolues diffèrent de celles de T-030 d'un facteur d'environ 2 : ce sont deux machines ou deux charges différentes, ce qui confirme que **ces chiffres n'ont de valeur que comparés entre eux**. Budgets de l'ADR web : appels de dessin, triangles, lumières, tas JS tenus ; GPU (11 ms PC, 14 ms Steam Deck) **inconnu**. Seule mesure qui compte : celle du propriétaire (F2 pendant 60 s, bouton « Copier le rapport de performance »), **avec le son actif** (BUG-004).

**Coût CPU de l'audio (réserve de T-031)** : `node tests/p2/audio-cpu.cjs` (`game/captures/.tmp/p2-audio-cpu.json`). Niveau bas, automate bruyant en temps réel, 15 s, deux mesures par cas :

| Cas | Cadence | Frame moyenne | 95e centile | JS du dessin | Voix jouées / refusées |
|---|---|---|---|---|---|
| Sans audio (aucun geste) | 38,8 et 38,7 i/s | 25,8 ms | 33,4 ms | 0,45 ms | 0 / 0 |
| Audio démarré | **20,2 et 20,3 i/s** | 49,6 ms | **100 ms** | 1,2 ms | 66 / **11** et 67 / **11** |
| Synthèse hors ligne d'un parcours bruyant (213,9 s d'audio) | n.a. | n.a. | n.a. | n.a. | 12,1 à 12,8 s de calcul = **environ 6 % d'un coeur** à 24 kHz ; 0 voix refusée |

Lecture : le travail ajouté au fil JavaScript est faible (+0,8 ms), le fil audio coûte environ 6 % d'un coeur en synthèse ; mais, sous rendu logiciel sur 4 coeurs, démarrer l'audio **divise la cadence par deux**. Probablement une concurrence pour le processeur avec SwiftShader ; **non démontré sur un vrai PC** (BUG-004). `AudioContext.renderCapacity` n'a pas été lu (aucun crochet, aucune sortie audio).

**Captures** (toutes dans `game/captures/`, versionnées, ou `game/captures/.tmp/`, ignorées par git, régénérées par `npm test`) :
- Rendu : `/home/user/test/game/captures/estran-nuit-high.jpg`, `estran-nuit-medium.jpg`, `estran-nuit-low.jpg`, `estran-aube-*.jpg`, `estran-jour-*.jpg`.
- Parcours : `estran-depart.png`, `estran-lecture-s1.png`, `estran-marche.png`, `estran-maree-haute.png`, `estran-phare-manivelle.png`, `estran-laisse.png`, `estran-laisse-moyen.png`, `estran-laisse-bas.png`, `estran-saisie.png`, `estran-noyade.png`, `estran-victoire.png` (même dossier).
- Mesures : `/home/user/test/game/captures/.tmp/perf.json` (rapports des trois niveaux de cette session), `/home/user/test/game/captures/.tmp/p2-discrimination.json`, `/home/user/test/game/captures/.tmp/p2-audio-cpu.json`.

## 6. Bugs

Détail dans `production/BUGS.md`.

| ID | Sévérité | Résumé |
|---|---|---|
| **BUG-001** | **BLOQUANT pour P2** | Audio : plafond de 28 voix atteint sur un parcours bruyant, `npm run all` rouge ; une saisie peut ne pas être jouée |
| BUG-002 | Majeur (conception) | La règle ne punit que le joueur qui chasse la Laisse (ignorer sans chasser : 70 à 80 % de victoires) |
| BUG-003 | Majeur (conception) | Pas d'approche de la Laisse avant 160 s pour un joueur qui suit la règle |
| BUG-004 | Majeur, à confirmer | Démarrer l'audio divise la cadence par deux sous rendu logiciel |
| BUG-005 | Mineur | Le backlog dit 5 questions de P2, le GDD en compte 8 |

## 7. Partie humaine (EN ATTENTE)

Le questionnaire de 8 questions est dans `docs/qa/QUESTIONNAIRE_P2.md`, réponses attendues en fin de document. État : **aucune réponse reçue**. Conditions du seuil de passage (GDD §13) : discrimination des automates (atteinte, avec la réserve du §1), 4/4 aux questions 1 à 4 et note >= 3 à la question 5 (**en attente**), questions 6 à 8 renseignées (**en attente**). Les points de T-031 à faire vérifier par le propriétaire sont dans les questions 6 à 8 : casque, niveau sonore au premier contact, comparaison avec et sans son (M), silence de la Laisse au bord, absence de musique, repérage devant/derrière, sous-titres (K).

## 8. Limites de ce rapport

- Les automates ne ressentent rien ; distance et saisies sont des substituts de la peur.
- Les 20 graines (101 à 120) ne couvrent qu'une partie de l'espace des îles ; la graine du jeu normal est 2026.
- Rendu logiciel et pas de sortie audio : rien ici ne prouve la fluidité ni la qualité sonore sur un PC de joueur.
