# Notes audio de la porte P2 (T-031)

> Auteur : `audio-director` · Périmètre : tranche P2 « une marée » · Pile : API Web Audio, synthèse procédurale, **aucun fichier audio, aucune voix, aucune dépendance**.
> Les décisions du propriétaire (`production/DECISIONS.md`) priment : voie web, agents seuls, pas de doublage, pas de coût de licence. La direction audio complète (`DIRECTION_AUDIO.md`, T-009) vient après P2 et partira de ces notes.

## 1. Ce qui est fait

### Architecture (`game/src/audio/`)

| Fichier | Rôle | Testable sous Node |
|---|---|---|
| `spatial.js` | panoramique selon la position et l'orientation, gain et coupure selon la distance, secteur de direction (8) | oui |
| `mix.js` | règles de mixage : ambiance selon la marée, niveau d'angoisse, ronronnement du phare, filtre général, cadences | oui |
| `director.js` | événements et état de la simulation -> « cues » (quoi, où, avec quelle force) ; déterministe, graine propre | oui |
| `caption-text.js` | texte court des sous-titres, avec la direction | oui |
| `settings.js` | volume, coupure, sous-titres ; `localStorage` facultatif | oui |
| `engine.js` | synthèse sur n'importe quel `BaseAudioContext` (direct ou hors ligne) | navigateur |
| `index.js`, `offline.js` | branchement au jeu ; rendu `OfflineAudioContext` pour les tests | navigateur |

Le même « directeur » alimente la synthèse **et** les sous-titres : ce que l'on lit est ce que l'on entend. L'audio ne lit que `sim.subscribe` (événements) et `state` (à chaque frame) ; il n'écrit rien dans la simulation et n'ajoute ni lumière ni matériau (aucun code de rendu touché, risque de saccade de T-030 inchangé).

### Critères de T-031

- **Synthèse seule** : bruits blanc, rose et brun générés au démarrage (graine fixe), oscillateurs, filtres, enveloppes. Pas de `fetch`, pas d'`<audio>`, pas de voix.
- **Ambiance qui suit la marée** (`ambientMix`) : à marée basse, mer mince et lointaine, vent ouvert plus aigu ; à marée haute, mer lourde et proche (corps de bruit brun environ 5 fois plus fort et plus ouvert, sifflement de ressac plus fort et plus grave), vent couvert. Houle lente par deux LFO de périodes premières entre elles.
- **Bruits dans l'eau, 4 familles et 8 variantes au moins**, spatialisées par `StereoPannerNode` (pan calculé par `panOf`, gain et coupure selon la distance) :
  1. pas selon la bande d'eau : sec, berge, gué (éclaboussure et gouttes), eau profonde ou haute (clapot lourd), submersion (étouffé) ; la course double les pas ;
  2. choc d'un débris (claquement de bois et éclaboussure, à la position du débris) ;
  3. remous de la Laisse (à sa position, tant qu'elle est dans `threat_audible_radius`) ; cadence selon son état et sa distance ;
  4. éclaboussure de repli (faisceau ou lampe) ; apparition lointaine.
- **Présence de la Laisse** :
  - remous audibles sous `threat_audible_radius` (45 m), de plus en plus rapprochés (2,6 s en rôde, 0,8 s en traque, réduits par la proximité) ;
  - grondement (`roam -> inquire`) et grognement (entrée en `hunt`) **seulement** sous `threat_cue_roar_radius` (60 m), avec la distance de l'événement ;
  - sous-grave battant (41 et 43,3 Hz) et battement de cœur, tous deux proportionnels à l'« angoisse » (`dreadLevel` : proximité x état, plus 0,2 si le phare est éteint, plus la jauge de noyade) ;
  - **saisie** : choc grave, bruit sourd, sifflement très faible, et filtre général qui s'étouffe puis se rouvre en 3,5 s ; le froid garde un filtre à 3,5 kHz tant qu'il dure.
- **Danger lié au phare** : ronronnement positionnel du phare (55 et 110 Hz) rassurant tant qu'il est chargé, qui devient instable (vibrato et tremolo) sous `lighthouse_charge_flicker` et se tait à 0 ; `lighthouse_low` = grognement de panne puis **glas** grave (cloche inharmonique, étouffée) répété de plus en plus vite (toutes les 8,5 s juste sous le seuil, 2,5 s presque éteint) ; `lighthouse_out` = chute de 110 à 24 Hz puis silence du phare ; `lighthouse_wound` = cliquet et clac.
- **Volume et coupure** : `M` coupe/rétablit, curseur et case dans l'écran d'entrée et de pause, `K` sous-titres. Réglages mémorisés (`localStorage`, avec `try/catch`, jamais requis). Courbe de volume au carré.
- **Démarrage sur geste** : l'`AudioContext` n'est créé que par le clic d'entrée (ou une touche) ; suspendu à la pause et quand l'onglet est caché. Aucun avertissement de console au chargement (test).
- **Sous-titres des bruits** : désactivés par défaut, trois lignes au plus, 3 s chacune, par exemple « bruit dans l'eau, à gauche », « grondement, derrière à droite, au loin », « le phare s'éteint ». Huit secteurs (devant, devant à droite, à droite, ...) calculés comme le panoramique. Ils ne dépendent pas du démarrage de l'audio (utilisables sans son).
- **Niveau** : chaîne `bus -> filtre général -> compresseur (-18 dB, 6:1) -> plafond doux (waveshaper, asymptote 0,85 = -1,4 dBFS) -> volume`. Mesures ci-dessous.
- **Robustesse de la simulation** (réserve de T-029) : chaque écouteur de `sim.subscribe` et du journal est isolé par `try/catch` ; l'erreur va dans `sim.listenerErrors` (50 au plus, hors télémétrie, donc le déterminisme est intact) et dans le rappel `onListenerError` (le navigateur écrit un `console.error`). Un écouteur peut se désabonner pendant l'appel sans en faire sauter un autre.

### Mesures

Rendu hors ligne (`OfflineAudioContext`, 24 kHz, volume 1, parcours complets rejoués depuis les automates `prudent`, `win` et `noisy`, un échantillon d'état toutes les 0,5 s) :

| Parcours | Issue | Durée | Crête (avec chaîne de sortie) | Niveau efficace | Familles de voix | Voix refusées |
|---|---|---|---|---|---|---|
| `prudent` | victoire | 395 s | **-5,2 dBFS** | -20,3 dBFS | 10 | 0 |
| `win` (phare non remonté : panne et glas) | victoire | 396 s | **-5,0 dBFS** | -20,8 dBFS | 15 | 0 |
| `noisy` (deux saisies) | défaite | 214 s | **-3,9 dBFS** (sans compresseur ni plafond : -4,9 dBFS) | -21,8 dBFS | 16 | 0 |

- Pire crête : **-3,9 dBFS**, soit 2,9 dB sous la cible de -1 dBFS ; aucun échantillon à 1,0 ; le plafond doux garantit en théorie moins de -1,4 dBFS à volume 1. Honnêteté : le mélange brut est déjà sous la cible (-4,9 dBFS), la chaîne de sortie est une garantie, pas ce qui tient le niveau en pratique.
- Niveau efficace voisin de -20 dBFS : plus fort qu'une cible console de -24 LUFS (la mesure LUFS n'est pas faite, voir « Ce qui reste ») ; le curseur de volume (0,8 au carré par défaut, soit -3,9 dB) en retire un peu. À rééquilibrer à l'écoute.
- Ambiance : à marée haute (2,0 m) le niveau efficace est supérieur de 8,2 dB à celui de la marée basse (-0,6 m) : -19,7 contre -27,9 dBFS.
- Panoramique : la balance gauche/droite (R-L)/(R+L) d'une source qui traverse de -30 m à +30 m devant le joueur croît strictement : -0,95 -0,83 -0,44 0,00 0,44 0,83 0,95 (remous) ; mêmes valeurs pour le choc de débris et le grondement. Source fixe à 12 m à gauche : balance -1,00, puis 0,00 (le joueur la regarde), +1,00 (il tourne le dos) et 0,00 (elle est derrière lui).
- Tests : `game/tests/unit/audio.test.js` (12 tests) et `game/tests/e2e/audio.cjs` (29 contrôles, dont : aucun contexte audio avant geste, démarrage au clic, au moins 3 variantes d'eau jouées, aucune erreur de console avec l'audio réel, sous-titres, options, panoramique, ambiance selon la marée, crête).
- Poids : `dist/estran.html` passe de 623 à 644 Kio.

### Correctif T-038 (BUG-001) : priorité des voix

- **Cause** : au plafond de 28 voix, toute nouvelle voix était refusée (premier arrivé, premier servi). Sur un parcours bruyant, des pas pouvaient occuper les 28 places et une saisie était refusée.
- **Règle réelle** : voir « Budgets » en section 3. Coupe douce de 30 ms de la plus ancienne voix de priorité inférieure ; repères critiques jamais refusés.
- **Test `tests/e2e/audio.cjs` mis d'accord, et pourquoi** : l'ancienne vérification (`dropped === 0` pour toutes les voix) interdisait tout refus, y compris celui d'un pas, ce qui n'a plus de sens avec des priorités, et le test avance la simulation de 60 pas par image, plus dense que le jeu réel. Deux vérifications la remplacent : (1) voix actives <= 28 **et 0 voix critique refusée** (`droppedCritical`, `droppedByPriority[3]`) ; (2) voix refusées <= 15 % des repères et **aucune de priorité haute** (phare, fin). Le test détecte encore une régression : une règle de vol cassée ou des voix qui ne se libèrent plus feraient refuser des repères critiques ou dépasser 15 %. Il n'est pas aussi strict que l'ancien : un pas peut être refusé ou coupé.
- **Mesures (Chromium sans tête, sans sortie audio, 6 passages de `audio.cjs` + 2 de `npm run all`)** : 0 voix critique refusée à chaque fois ; refus de basse priorité de 0 à 4 % des repères (pire cas : 4 refusés sur 103, 9 voix coupées).
- **`node tests/p2/audio-cpu.cjs`** (automate bruyant, 15 s, niveau bas) : `droppedCritical` = 0 sur les quatre passages en temps réel et sur le rendu hors ligne ; 11 voix de basse priorité refusées sur 15 s dans les deux passages audio, 1 et 3 voix coupées. Cadence : sans audio 37,4 et 36,7 i/s ; avec audio 18,6 et 11,5 i/s (p95 : 117 et 272 ms), plus variable qu'au relevé précédent (20,2 et 20,3 i/s) ; le rendu logiciel est partagé avec le fil audio sur 4 coeurs. Travail JS du dessin : 1,0 et 0,9 ms contre 0,4 et 0,5 ms. Synthèse hors ligne : 5,7 s de calcul pour 85 s d'audio = **environ 6,7 % d'un coeur** (24 kHz), contre 6 % auparavant. Le coût du vol de voix lui-même est négligeable (quelques voix par parcours). **BUG-004 reste « à confirmer sur un vrai PC »** : ces chiffres viennent d'un rendu logiciel sans sortie audio.

## 2. Hypothèses sur ce qui fait peur (à vérifier en jeu)

1. **Le danger est d'abord une absence de confort.** Le ronronnement du phare est un bruit « de maison » que le joueur n'écoute pas ; quand il se met à vaciller, puis à se taire, la perte se remarque sans qu'aucun signal d'alerte n'ait été nécessaire. Le glas est volontairement bas et étouffé, pas une sirène.
2. **Entendre sans voir.** La Laisse n'a pas de voix : seuls ses remous la trahissent, et ils cessent quand elle s'arrête au bord (`bank_wait`). Le silence autour de soi devient l'information (hypothèse : un silence soudain fait plus peur qu'un son de plus).
3. **La direction avant la distance.** Au casque, un remous à gauche qui passe à derrière-gauche, sans rien à l'écran, doit pousser à tourner la tête. D'où le panoramique complet (pas seulement la distance) et la coupure qui s'assombrit avec l'éloignement.
4. **Le corps du joueur réagit.** Le sous-grave et le cœur ne sont jamais forts : ils sont ressentis plus qu'entendus (< 100 Hz), et suivent la proximité de la traque. Le cœur n'apparaît qu'au-delà d'un seuil d'angoisse de 0,3 pour ne pas devenir un bruit de fond.
5. **Se faire saisir doit « couper le monde »** : l'étouffement du filtre général et le sifflement durent 3,5 s, le temps de sentir la perte avant que le froid ne prenne le relais.
6. **Le joueur fait lui-même du bruit.** Ses pas dans l'eau (cadence de 0,5 s imposée par les événements `noise`) rappellent en continu que l'eau le trahit ; courir est audiblement plus coûteux que marcher.
7. **Sobriété** : pas de musique en P2, pas de stinger de « jump scare ». À confirmer par le test de la porte P2 (l'absence de musique peut être un choix à garder ou un manque).

## 3. Ce qui reste (hors P2)

- **Écoute humaine** : tout est vérifié par des mesures et des tests (direction, niveau, absence d'erreur), mais **personne n'a encore écouté le résultat** (le studio n'a pas de sortie audio). Le timbre, l'équilibre et l'efficacité de la peur sont des hypothèses jusqu'à un retour du propriétaire ou de testeurs ; tous les réglages sont dans `mix.js` et `engine.js`.
- **Paramètres en dur** : les gains et fréquences de la synthèse sont dans `engine.js` / `mix.js`, pas dans les CSV (les rayons et le seuil du phare, eux, viennent de `menace.csv`). À sortir en CSV si le game designer veut équilibrer sans toucher au code.
- **Pas d'obstruction** : pas d'occlusion par le terrain ni de réverbération par zone (le terrain est ouvert ; une réverbération par convolution générée est possible plus tard). La distance assombrit le son mais le pan reste valable à travers le phare.
- **Spatialisation** : `StereoPannerNode` (casque et enceintes stéréo). Pas de HRTF (`PannerNode`) : la distinction devant/derrière ne vient que du timbre et des sous-titres. À tester contre `PannerNode` « HRTF » si les testeurs confondent l'avant et l'arrière.
- **Musique adaptative, brief compositeur, voix** : hors périmètre voie web (aucune voix enregistrée par défaut ; une musique composée ou générée devra passer par T-024 pour la licence).
- **Loudness** : les crêtes sont mesurées, pas le LUFS intégré (-24 LUFS visés en console). Le niveau efficace (RMS) rendu est donné en dBFS ; une mesure LUFS (K-weighting) reste à ajouter.
- **Cadence des pas** : elle est celle des événements `noise` (0,5 s). Une course ressemble à deux frappes par événement ; un vrai rythme de pas demanderait un événement par pas dans la simulation (hors périmètre : la simulation n'est pas modifiée).
- **Budgets** : voix simultanées plafonnées à 28 (`MAX_VOICES` dans `src/audio/engine.js`), **avec priorité par type** (T-038, BUG-001) : *critique* = saisie, grondement, rugissement, battement de coeur et remous de la Laisse à 65 % du rayon audible ou moins ; *haute* = phare (`lh_*`) et fin de partie ; *normale* = remous lointains, débris, fuite de la Laisse ; *basse* = pas, interaction, poste, lampe. Au plafond, une nouvelle voix prend la place de la **plus ancienne voix de priorité strictement inférieure** (la plus basse d'abord), coupée par une rampe de 30 ms sans clic ; une voix **critique n'est jamais refusée** (à défaut de voix inférieure, elle remplace la plus ancienne voix critique) ; toute autre voix sans voix inférieure à prendre est refusée, donc les pas sont coupés ou refusés en premier. Il n'y a plus de « premier arrivé, premier servi »; chaque voix refusée est comptée dans `dropped` (détail `droppedByPriority`, dont `droppedCritical`, et `stolen` pour les voix coupées) ; mémoire des tampons de bruit : 4 s + 6 s + 6 s mono à 44,1 kHz = environ 2,8 Mo ; coût du code : environ 20 Kio de plus dans `dist/estran.html`. Pas de mesure du coût processeur sur machine réelle (le rendu hors ligne tourne à environ 10 fois le temps réel dans Chromium sans GPU).
- **Tests de rendu hors ligne** : à 24 kHz pour la rapidité ; la crête entre échantillons n'est pas évaluée au-dessus de la fréquence de Nyquist (peu d'énergie au-dessus de 12 kHz) ; la marge de 0,4 dB entre le plafond (-1,4 dBFS) et la cible (-1 dBFS) la couvre.

## 4. Pour tester à l'oreille

`npm run build`, ouvrir `dist/estran.html` au casque, cliquer, **M** coupe, **K** sous-titres. Scénarios utiles : `?seed=N` ; `?debug=1` puis **T** (temps x6) pour atteindre la traque ; laisser le phare s'user sans le remonter pour entendre la panne.
