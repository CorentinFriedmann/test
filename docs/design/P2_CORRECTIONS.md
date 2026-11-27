# ESTRAN : corrections du prototype avant le nouvel essai P2 (T-042)

> Auteur : `game-designer`, 2026-11-27. Pour `gameplay-programmer` (T-043). Sources : `production/DECISIONS.md` (2026-11-27), `production/validations/PORTE_P2.md`, `docs/qa/REPONSES_P2.md`. Principe : **aucune nouvelle mécanique** ; on rend visible et lisible ce qui existe. Le rendu et l'interface ne lisent que l'état de la simulation et ne l'influencent jamais (règle de parité, GDD §12). Textes en français, « vous » comme le HUD actuel. Temps affichés au format `M:SS`.

## Rattachement aux réponses du propriétaire

| Réponse (REPONSES_P2 / DECISIONS) | Correction |
|---|---|
| « Arrêté avant la fin », raison « pas compris quoi faire » | C1 Guidage (priorité n°1), C4 partie de 5 min |
| « Joué sans le son », raison « je ne sais pas » | C2 Son impossible à manquer |
| Peur « pas du tout » | C3 Menace visible sans le son (et C2) |
| Envie d'en voir plus « oui » | Garder le jeu tel quel hors de ces quatre points |

## C1. Guidage (effort **M**)

Tout est calculé par une fonction **pure** `guidance(state, data, world)` (nouvelle, dans `hud-model.js`) qui renvoie `{objective, action, tip, target, list[], clock}` ; `hud.js` ne fait que l'afficher. Trois zones, toutes sobres (texte blanc cassé, ombre portée, fond noir à 35 %, pas de couleur vive) :

- **Haut centre** : ligne d'objectif (permanente) : `Lisez les 3 échelles de marée, puis revenez au phare.` suivie de `Relevés : n/3 · Fin de la marée : M:SS` (`clock = 300 − t`). Passe en orange pâle sous 0:45.
- **Centre bas** (à 22 % du bas, au-dessus des sous-titres) : **ligne d'action** (une seule phrase, la première condition vraie du tableau ci-dessous).
- **Haut droite** : **liste des 3 échelles**, une ligne chacune (les pastilles actuelles servent d'icône) ; remplace l'ancienne ligne d'objectif de 6 s (supprimer `showObjective` et ses appels dans `main.js`).

### Liste des échelles (haut droite)

Noms fixes : `1 · marée montante`, `2 · marée haute`, `3 · marée descendante`. Texte d'état, à partir de `windowStart/End` (`stations.csv`) et de `st.t` :

| État | Texte | Style |
|---|---|---|
| Lue | `lue ✓` | plein |
| Ouverte (fenêtre ouverte **et** lisible par la profondeur) | `OUVERTE, reste M:SS` (reste = `windowEnd − t`) | pulsation lente, plus claire |
| Pas encore ouverte | `s'ouvre dans M:SS` | contour |
| Manquée | `manquée` | atténué (la défaite suit) |

### Ligne d'action (première condition vraie, de haut en bas)

| # | Condition | Texte exact |
|---|---|---|
| 1 | Lecture en cours | `Lecture en cours… maintenez E` |
| 2 | Remontage en cours | `Remontage du phare… maintenez E` |
| 3 | `drown > 0` (souffle qui se vide) | `Vous manquez d'air : gagnez un terrain plus haut !` |
| 4 | À ≤ 2,0 m d'une échelle lisible maintenant | `Maintenez E pour lire l'échelle (5 s)` |
| 5 | À ≤ 2,0 m d'une échelle non lue, `d < 0,15` | `L'eau n'atteint pas encore l'échelle. Attendez.` |
| 6 | idem, `d > 1,00` | `L'eau est trop haute pour lire l'échelle.` |
| 7 | idem, mauvais sens de marée | `Pas maintenant : revenez quand la marée sera dans l'autre sens.` |
| 8 | À ≤ 6 m d'une échelle lisible ou ouverte | `Approchez-vous de l'échelle.` |
| 9 | À ≤ 2,5 m de la manivelle et charge < 60 % | `Maintenez E pour remonter le phare (5 s)` |
| 10 | 3 échelles lues, hors plateforme | `Retournez au phare : il reste M:SS.` (M:SS = `300 − t`) |
| 11 | Une échelle vient d'être lue (10 s) | `Relevé noté. Revenez vers le phare.` |
| 12 | Prochaine échelle N ouverte | `Échelle N ouverte : allez-y ! Il reste M:SS.` |
| 13 | Prochaine échelle N, `windowStart − t ≤ distance/3,0 + 10` (le moment de partir) | `Partez vers l'échelle N : elle s'ouvre dans M:SS.` |
| 14 | Prochaine échelle N, charge du phare < 50 %, au pied du phare | `En attendant : remontez le phare à la manivelle (E, 5 s).` |
| 15 | Sinon | `Attendez au phare : l'échelle N s'ouvre dans M:SS.` |

Au début (t = 0, échelle 1 ouverte à 0:38, trajet de 40 à 50 m, soit environ 14 s) la ligne 15 s'affiche jusqu'à t ≈ 14 s, puis la ligne 13. Toutes les phrases se vérifient avec `data.stations[i]` ; aucun nombre n'est écrit en dur dans les textes sauf 5 s (`hold_s`, à lire dans les données) et les 3,0 m/s (`player_speed_walk`).

### Repère vers l'échelle utile

- **Cible** : la première échelle non lue dont la fenêtre n'est pas passée ; après la 3e lecture ou après chaque lecture, **le phare**. Un repère par cible, jamais deux.
- **Dessin (DOM, calculé depuis la caméra, aucun matériau ni lumière ajouté)** : un petit losange blanc cassé à la position de la cible, avec sous lui la distance (`42 m`) ; hors écran, une flèche sur le bord de l'écran dans la bonne direction. Les cibles non encore ouvertes sont à 35 % d'opacité, **ouvertes ou « il faut partir » à 85 %** (pulsation lente 0,5 Hz).
- **Ne montre jamais la Laisse** : pas de repère, de flèche ni de couleur liés à elle.

### Premières aides (une fois par partie, 8 s, sous la ligne d'objectif, fermées dès que l'action est faite)

| Déclencheur | Texte exact | Fermée par |
|---|---|---|
| Début de partie et 20 s | `ZQSD ou flèches : marcher · Souris : regarder · Maj : courir · C : marcher lentement · M : son` | première avance |
| Premier pas avec `d ≥ 0,15` ou `t ≥ 20 s` | `Appuyez sur F : la lampe éclaire devant vous (120 s d'autonomie).` | touche F |
| Charge du phare < 50 % (vers t = 100 s) | `Le phare s'use. La manivelle, au pied de la tour, le remonte : maintenez E 5 s.` | début du remontage |
| Premier bruit dans l'eau entendu (premier événement `swirl` ou `roar`) | `Quelque chose bouge dans l'eau. Ralentissez (C) ou restez immobile.` | 8 s |

La dernière aide nomme la règle de bruit sans nommer ni décrire la Laisse (« quelque chose »).

### Écran de fin (titres actuels conservés, une raison ajoutée, puis `Relevés : n/3 · Temps : M:SS`, puis `R pour recommencer`)

| Issue (`state.cause`) | Titre | Raison (une phrase) |
|---|---|---|
| victoire | `Les trois relevés sont faits.` | `Vous êtes de retour au phare avant la fin de la marée.` |
| `seized` | `La mer a gagné.` | `Quelque chose vous a saisi deux fois en moins de 45 s. Dans l'eau, le bruit attire : marchez lentement (C) ou restez immobile.` |
| `drowned` | `La mer a gagné.` | `Vous êtes resté plus de 8 s sous l'eau. Quand la marée monte, gagnez le phare.` |
| `window_missed` | `Relevé manqué.` | `L'échelle N s'est refermée avant d'être lue. Chaque échelle ne se lit que pendant sa fenêtre.` |
| `time_up`, 3 relevés faits | `La marée est finie.` | `Vous n'êtes pas revenu au phare à temps.` |
| `time_up`, moins de 3 relevés | `La marée est finie.` | `Il manquait des relevés : n sur 3.` |

`hud-model.js` : `card` doit renvoyer la cause et l'identifiant de l'échelle (aujourd'hui seulement `victory/missed/sea`).

**Fichiers probablement touchés** : `src/ui/hud-model.js` (nouvelle fonction pure + test), `src/ui/hud.js`, `src/main.js` (retirer `showObjective`, fournir le projecteur de caméra), `src/render/scene.js` (une méthode `project(x, y, z)` en lecture seule), feuille de style de l'index HTML (build).

## C2. Son impossible à manquer (effort **S**)

| Élément | Règle et texte exact |
|---|---|
| Écran de départ (`#intro`) | Bouton plein écran unique : `Cliquer pour commencer (avec le son)`. Dessous : `Casque recommandé. Montez le volume de l'ordinateur : un court son de test va jouer.` À la reprise après pause : `Cliquer pour reprendre`. Le rappel des touches (aide 1 de C1) est répété dessous en petit ; réglages (volume, couper, sous-titres) et barre P2 sont conservés plus bas. |
| Démarrage | Le clic crée et reprend l'`AudioContext` (déjà le cas) puis joue le **son de test** : deux notes douces (440 Hz puis 330 Hz, 0,5 s chacune, enveloppe lente, environ −12 dBFS avant le volume général), passant par le volume et le plafond actuels. Message de 6 s : `Son de test lancé. Rien entendu ? Vérifiez le volume et le casque. M : couper ou activer le son.` |
| Indicateur permanent (haut gauche, toujours visible, y compris en pause) | `SON ACTIF` si le contexte est `running`, non coupé, volume > 0. `SON COUPÉ` (orange pâle, plus visible) si coupé par M ou volume à 0. Suit la touche M et la case « couper ». |
| Échec du démarrage | Si 1,5 s après le clic le contexte n'est pas `running` (nouvel essai de `resume()` à 0,5 s et 1 s), ou en cas de perte du contexte (`statechange`), bandeau centré, fixe, qui reste tant que le problème dure : `Le son ne démarre pas. Cliquez dans la fenêtre, vérifiez le volume de l'ordinateur et que l'onglet n'est pas muet.` L'indicateur passe à `SON INDISPONIBLE`. Si `AudioContext` n'existe pas ou lève une erreur : `Ce navigateur ne peut pas jouer le son du jeu. Essayez Chrome ou Edge.` |
| Lien avec C3 | Les sous-titres sont actifs par défaut, donc la partie reste lisible si le son échoue. |

**Fichiers** : `src/main.js` (écran de départ, clic, gestion d'état), `src/audio/index.js` et `engine.js` (état du contexte, son de test, événement `onChange` pour l'indicateur), `src/ui/p2.js` ou l'HTML d'entrée du build, `src/ui/audio-opts.js`.

## C3. Menace visible sans le son (effort **M**)

**Sous-titres** : `DEFAULTS.captions` passe à `true` dans `src/audio/settings.js`. **Changer la clé de stockage** (`estran.audio.v1` vers `v2`) pour qu'un ancien réglage mémorisé n'écrase pas la valeur. K les bascule toujours. Lisibilité : texte 18 px minimum, fond noir à 55 %, 3 lignes au plus, 3 s (déjà le cas). Les textes de `caption-text.js` sont conservés.

**Indices visuels** (lus dans `state.threat` : `active`, `dist`, `mode` ; rendu seul, aucun effet sur la simulation ; rien si la Laisse est inactive ou `?threat=0`) :

| Distance Laisse-joueur | Remous (anneaux à la position de la Laisse, lisibles même hors lumière) | Vignette (bords qui s'assombrissent) |
|---|---|---|
| > 25 m | aucun | aucune |
| 25 m | anneaux très faibles (opacité 0,15) | aucune |
| 25 à 8 m | opacité de 0,15 à 0,50, rayon final 3 m | opacité de 0 à 0,45 (linéaire sur la distance) |
| ≤ 8 m | opacité 0,50 | 0,45 (maximum) |

- **Cadence des anneaux** : un nouvel anneau toutes les 1,2 s en RÔDE et ENQUÊTE, toutes les 0,6 s en TRAQUE, durée de vie 1,5 s. Réutiliser `view.addRing` (déjà utilisé pour les bruits du joueur), sans nouvelle texture ni lumière. La **silhouette** reste visible seulement dans la lumière (GDD §6.3 inchangé) : on ne voit que les remous.
- **Vignette** : coefficient de mode RÔDE 0,5 · ENQUÊTE 0,8 · TRAQUE 1,0 · REPLI 0,2 · attente au bord 0,3. Montée lissée sur 0,5 s, descente sur 1,5 s. En TRAQUE seulement, pulsation de ±10 % à 1,2 Hz. Divisée par deux si le joueur est en zone sèche (il est protégé : le jeu le lui dit). Couleur bleu-noir (`#02060c`), jamais de flash. S'ajoute à la vignette froide existante sans la remplacer.
- **Facultatif** (si le temps le permet, sinon à oublier) : croissant sombre sur le bord de l'écran du côté de la Laisse en TRAQUE à moins de 20 m. La brume n'est pas touchée.
- **Mise à jour du GDD** (par le game-designer, après l'essai) : §6.3, ligne « Anneaux d'eau visibles », devient « à moins de 25 m, faibles hors lumière, pleins dans la lumière ».

**Fichiers** : `src/render/scene.js` et `shaders.js` (vignette : un uniform dans le passe plein écran existant, pas de recompilation), `src/render/laisse.js` (anneaux), `src/audio/settings.js`, `src/main.js` (aucune logique de jeu).

## C4. Partie d'environ 5 minutes (effort **S**, données seules)

**Décision : on garde 3 échelles, et on comprime la marée à 300 s (facteur 0,625 sur tous les temps).** Raisons : (1) c'est le seul changement qui ne demande aucun code de simulation : monde, HUD, tests et automates sont déjà faits pour 3 échelles ; (2) les trois échelles (flot, haute, jusant) sont le jeu : l'échelle 2 est le moment dans l'eau profonde, la 3 le retour sous menace ; (3) mesuré (graines 101-120 et 201-220, copie de travail, `src/` intact) : `prudent` 19/20 et 20/20, `noisy` 0 victoire sur 40. Le risque que cette décision porte est la fenêtre de l'échelle 1 (30 s au lieu de 49) : le guidage C1 (ligne 13, repère) y répond.

Formule de contrôle : `niveau(t) = 0,90 − 1,50 × cos(2π·t/300)`, table à pas de 5 s (61 lignes). Les fenêtres sont les instants où la profondeur `d` permet la lecture (0,15 à 1,00), comme avant.

| Fichier | Valeur | Avant | Après |
|---|---|---|---|
| `maree.csv` | cycle, pas de la table | 480 s, 49 lignes de 10 s | **300 s, 61 lignes de 5 s** ; étale haute à t = 150 s (2,40 m) |
| `stations.csv` | S1 `window_start_s` / `window_end_s` | 61 / 110 | **38 / 68** |
| `stations.csv` | S2 | 160 / 320 | **100 / 200** |
| `stations.csv` | S3 | 375 / 427 | **235 / 266** |
| `menace.csv` | `slice_duration` | 480 | **300** |
| `menace.csv` | `defeat_time_limit` | 480 | **300** |
| `menace.csv` | `threat_spawn_level` (valeur inchangée, −0,40 m) | t = 40 s | **t = 25 s** (première position valide vers 30 s) |
| `menace.csv` | `threat_despawn_level` (inchangée, −0,30 m) | t = 431 s | **t = 269 s** |

Inchangés volontairement : charge du phare (usure 0,5 %/s : un remontage reste utile vers t = 100 s), lampe (120 s), toutes les vitesses, rayons de bruit, états de la Laisse, `maree_effets.csv`, `monde.csv`. **CSV modifiés dans `docs/design/data/` : `maree.csv`, `stations.csv`, `menace.csv` (4 lignes).** Le programmeur lance `npm run sync-data` puis recale les tests.

**Mesures préalables** (copie de travail, 20 graines par lot, données ci-dessus) :

| Automate | 101-120 | 201-220 | Seuil T-043 |
|---|---|---|---|
| `prudent` victoires | 19 | 20 | ≥ 90 % (18/20) : tenu |
| `noisy` défaites | 20 | 20 | ≥ 90 % : tenu (défaite à 61-67 s en moyenne, 2 saisies) |
| `silent` victoires | 20 | 19 | (anciennement ≥ 16) |
| `win` victoires | 16 | 12 | **ancien seuil ≤ 10 non tenu** |
| `heedless` victoires | 16 | 13 | **ancien seuil ≤ 10 non tenu** |
| Durée d'une victoire | 246 à 287 s | 251 à 286 s | 240 à 360 s : tenu (S3 ouvre à 235 s, victoire impossible avant ~245 s) |

Les automates « honnêtes » `win` et `heedless` gagnent plus qu'avant (16/20 et 12 à 13/20 contre 6 à 9/20 en T-037) : la cause n'a pas été isolée, probablement la durée plus courte pendant laquelle la Laisse peut les atteindre. Ce n'est pas bloquant pour T-043 (seuls `prudent` et `noisy` sont exigés) ; pour un débutant qui n'a pas compris, un jeu un peu plus indulgent est acceptable. Si le programmeur veut les ramener à ≤ 10, les leviers de T-037 restent `threat_spawn_dist_min` (15 m) et `noise_walk`.

## C5. Trois questions du nouvel essai (reprises de `PORTE_P2.md`)

Essai unique de 10 minutes au maximum, avec le son, au casque si possible, **sans explication préalable** de la règle autre que l'écran d'accueil du jeu. Jouer jusqu'à la fin. Puis trois réponses en un mot :

1. Avez-vous entendu le son dès le début ? (oui / non / coupé)
2. Avez-vous eu peur ou été inquiété ? (pas du tout / un peu / oui)
3. Avez-vous joué jusqu'à la fin ? Sinon, pourquoi ? (ennuyé / trop dur / pas compris / autre)

## À vérifier par la mesure (programmeur)

1. `FEAR_WINDOW_S` et les seuils de `tests/p2/` : la fenêtre de 160 s n'a plus de sens sur 300 s. Mesuré avec 100 s : `prudent` a une approche (< 15 m) dans 16/20 (101-120) et 18/20 (201-220) parties, 6,5 à 7,5 s à moins de 15 m en moyenne, 5 saisies avant 100 s sur 40 parties. Recaler les seuils sur ces ordres de grandeur.
2. Tests à adapter : `tide.test.js` (480 devient 300, formule de contrôle), `sim.test.js` (cas `t = 480`), `island.test.js` (retour avant `defeat_time_limit`), `discrimination.test.js` (durée ≤ 300,1).
3. Atteignabilité des 3 échelles sur les graines d'essai (`island.test.js`) avec les nouvelles fenêtres, surtout S1 (départ au plus tard vers t = 50 s) et S3 (fenêtre de 31 s).
4. Un humain qui lit le texte de départ pendant 15 s a encore 20 s de marge avant le dernier départ vers l'échelle 1 (fenêtre fermée à 68 s, trajet 14 s, lecture 5 s) : à vérifier par un parcours scripté « lent » (départ à t = 30 s, puis t = 45 s).
5. Aucune ligne de texte du guidage ne se recouvre avec les sous-titres, à 1280×720 et 1920×1080 (captures).
6. Parité : rendu et interface identiques en bas et haut niveau de qualité, aucune lumière ni matériau créé en cours de partie.
