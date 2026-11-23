# Concepts de jeu : trois propositions

> **Tâche** : T-001 · **Auteur** : `game-director` · **Jalon** : M0 Concept · **Version** : 1.1 du 2026-11-23 (révision T-023, journal en section 9)
> **Statut** : révision v1.1 remise pour validation de la Boss (retours 1 à 11 de T-001). Rien dans ce document n'est encore validé en v1.1.
> **Lecteurs principaux** : `boss` (choix du concept, T-004), `marketing-publishing` (étude de marché, T-002),
> `technical-director` (choix techniques, T-003), `business-affairs` (chiffrage, T-015).

## Sommaire

0. Synthèse en 30 secondes
1. Cadre, hypothèses et méthode
2. Concept A : ESTRAN (horreur psychologique, île de marée)
3. Concept B : DERNIÈRE POSITION CONNUE (aventure de sauvetage en montagne)
4. Concept C : AVEUX (thriller d'interrogatoire)
5. Tableau comparatif
6. Grille de notation et recommandation
7. Questions ouvertes pour T-002, T-003 et T-015
8. Originalité et points juridiques
9. Journal des modifications (v1.1)

Les trois fiches suivent **exactement la même structure** (sections X.1 à X.13) pour que chaque pôle puisse
les comparer ligne à ligne.

---

## 0. Synthèse en 30 secondes

| | **A. ESTRAN** | **B. DERNIÈRE POSITION CONNUE** | **C. AVEUX** |
|---|---|---|---|
| En une phrase | Sur une île coupée du monde deux fois par jour, survivre à ce qui remonte avec la marée | Secouriste en haute montagne, retrouver les disparus dans la tempête et les ramener vivants | Une nuit de garde à vue pour obtenir la vérité, en lisant les visages des suspects |
| Genre | Horreur psychologique et exploration, sans combat | Aventure de sauvetage et de traversée, non violente | Thriller d'enquête et d'interrogatoire, narratif à embranchements |
| Perspective | 1re personne | 3e personne | 1re personne (face-à-face) |
| Pari technique dominant | La lumière et l'eau (Lumen) | La nature à grande échelle (Nanite, PCG, scans) | Les visages (MetaHuman Animator) |
| Équipe au pic *(estimation)* | 22 à 33 ETP | 36 à 53 ETP | 23 à 34 ETP + forte sous-traitance de capture |
| Production *(estimation)* | 26 à 32 mois | 34 à 42 mois | 24 à 30 mois |
| Risque global *(règle d'agrégation en 5.1)* | Élevé (1 risque à 9) | Très élevé (1 risque à 12, 2 à 9) | Élevé (2 risques à 9, 1 à 8) |
| Note pondérée (section 6) | **4,15 / 5** | 3,40 / 5 | 3,50 / 5 |

**Recommandation du game director : ESTRAN**, sous trois conditions vérifiables au jalon M1 (section 6.3).
AVEUX est le plan de repli ; DERNIÈRE POSITION CONNUE est le meilleur candidat pour un **deuxième projet**,
une fois le studio et ses pipelines photoréalistes en place.

---

## 1. Cadre, hypothèses et méthode

### 1.1 Contraintes du studio, appliquées aux trois concepts

- **Plateformes dès le premier jour** : PC (Steam, Epic, Steam Deck), PS5, Xbox Series X|S.
- **Rendu le plus réaliste possible sous Unreal Engine 5**, mais **60 fps en mode performance sur console**
  (budgets de référence de `studio/WORKFLOW.md`, à confirmer par le `technical-director` en T-003).
  La **Xbox Series S** et le **Steam Deck** sont les plateformes qui dimensionnent le design.
- **Studio qui démarre** (agents IA et quelques humains à recruter) : chaque concept vise un
  **AA haut de gamme maîtrisé**, jamais un AAA de 300 personnes.
- **100 % original** : aucune marque, aucun personnage, aucun univers protégé (voir section 8).

### 1.2 Leçons tirées des AA photoréalistes récents

Repères publics, cités de mémoire et **à vérifier par `marketing-publishing` (T-002)** :

- *Senua's Saga: Hellblade II* (Ninja Theory, UE5) : une référence de photoréalisme, dont les gros plans de
  visages sont précisément ce qui coûte cher. **À sa sortie (mai 2024), le jeu était limité à 30 fps sur Xbox
  Series** (fait daté). Selon mes informations, sa version PS5 (2025) et une mise à jour ultérieure ont ajouté un
  mode performance : **à vérifier par T-002**, avec les dates exactes. Si cela se confirme, la leçon se renforce :
  le 60 fps a été obtenu **après coup**, ce que notre cahier des charges interdit. **Conséquence** : nous
  choisissons des concepts dont le design rend les 60 fps naturels, au lieu de les chercher en fin de production.
  **Pour AVEUX**, cette leçon s'applique directement : un visage en gros plan remplit l'écran, et le coût par pixel
  (diffusion sous la surface, cheveux en mèches) est maximal là où le concept se joue (voir C.6 et 6.1).
- *Clair Obscur: Expedition 33* (Sandfall Interactive, 2025, UE5) : une équipe interne compacte (de l'ordre
  d'une trentaine de personnes selon les déclarations publiques du studio, chiffre à vérifier), appuyée par de
  la sous-traitance, peut atteindre un très haut niveau visuel et un grand succès commercial.
- *Still Wakes the Deep* (The Chinese Room, 2024) : un jeu court, contenu et porté par l'atmosphère peut
  exister durablement sur le marché premium.

**Ce que nous en retenons** : le photoréalisme accessible à une petite équipe est un **photoréalisme dirigé** :
des lieux contenus, des matières scannées, une lumière maîtrisée, peu de personnages mais filmés de près.
C'est la règle commune aux trois concepts.

### 1.3 Ce que les trois concepts ont en commun, volontairement

- **Solo, premium, sans service live au lancement** : périmètre maîtrisé, pas de coût de serveurs
  (le volet en ligne se limite aux succès, sauvegardes cloud et télémétrie, voir T-018).
- **Des lieux contenus et très travaillés** plutôt qu'un grand monde vide.
- **Photoréalisme atteignable** : bibliothèques scannées sous licence (Fab / Megascans), MetaHuman, PCG pour
  la dispersion, photogrammétrie maison pour quelques objets clés, kits modulaires réutilisables.
- **Accessibilité pensée dès la conception** (sous-titres, contraste, aides, remappage), détaillée en T-014.
- **Trois paris techniques différents** : A mise sur la lumière et l'eau, B sur la nature à grande échelle,
  C sur les visages. Les trois utilisent Lumen, Nanite et MetaHuman, mais chacun en pousse un plus loin.
  C'est un choix délibéré pour que T-003 puisse comparer des profils de risque technique distincts.

### 1.4 Comment lire les estimations

> **Toutes les tailles d'équipe, durées, volumes et prix de ce document sont des estimations d'ordre de
> grandeur du game director**, à ±30 %. Ce ne sont ni un budget ni un engagement. Le chiffrage fait foi en T-015.

- **ETP** : équivalent temps plein **humain**, au pic de la production. Les agents IA sont comptés comme un
  **appui** (documentation, code, outils, prototypage, tests automatisés) : ils réduisent la charge mais ne
  remplacent ni la capture de performance, ni l'art final, ni les tests sur kits de développement.
- **Durée de production** : du début de la préproduction (M1) jusqu'au master Gold (M5), hors post-lancement.
- **Sous-traitance** : listée à part, pour que `business-affairs` la chiffre séparément.
- **Prix, public et classification d'âge** : hypothèses à confirmer par T-002.

### 1.5 Règle de parité entre plateformes (valable pour les trois concepts)

Cette règle reprend celle que le `technical-director` a écrite dans `docs/tech/ARCHITECTURE.md` §10.1
(ADR-10 bis) ; elle n'est pas recopiée ici, seul son effet sur le design l'est.

- **Les plateformes (Series S, Steam Deck, Series X, PS5, PC) ne diffèrent que par le rendu** : résolution
  interne, qualité de Lumen, finesse du brouillard, résolution des ombres, niveau de détail, mode de cheveux,
  fréquence d'image. Elles ne diffèrent **jamais par une information utile au jeu** : ce que le joueur peut voir,
  entendre ou en déduire pour décider.
- **La logique de jeu ne dépend jamais des réglages de rendu.** Le faisceau qui repousse la Laisse (A), la
  portée de visibilité, le bruit, les zones sûres, la distance de vue d'une tempête (B), les micro-expressions
  qui trahissent un mensonge (C) sont calculés à partir de données de jeu, pas lus dans l'image rendue. Le rendu
  illustre l'état de jeu ; il ne le décide pas.
- **Conséquence pour les fiches** : les « garde-fous » X.6 qui concernent la Series S et le Steam Deck ne peuvent
  réduire que la **finesse** (grille du brouillard, résolution d'ombre, LOD), jamais la **portée** ni la
  **densité** équivalentes en jeu. Toute formulation contraire de la v1.0 a été retirée (A.6, A.11).

---

## 2. Concept A : ESTRAN

### A.1 Fiche d'identité

| Champ | Valeur |
|---|---|
| Titre provisoire | **ESTRAN** (l'estran est la partie du littoral que la mer découvre à marée basse) |
| Pitch en une phrase | Sur une île coupée du monde deux fois par jour, une technicienne doit percer le secret d'un village englouti que chaque reflux découvre un peu plus, et survivre à ce qui remonte avec le flot. |
| Genre | Horreur psychologique et exploration, **sans combat** |
| Perspective | Première personne, corps complet visible (mains, jambes dans l'eau, reflets) |
| Univers | Île de marée fictive au large d'une côte atlantique imaginaire, fin des années 1980 |
| Solo ou multijoueur | Solo |
| Durée de jeu visée | 7 à 9 h pour finir l'histoire, 10 à 12 h pour tout découvrir |
| Classification anticipée | PEGI 16 ; équivalent ESRB anticipé : **M** (Mature 17+), à cause de l'horreur et des thèmes, sans gore recherché *(hypothèses, T-002)* |
| Prix de lancement | 29,99 € *(base de chiffrage, décision 5 de T-001)* ; variante haute 39,99 €, argumentée en A.8 |
| Équipe et durée | 22 à 33 ETP au pic, 26 à 32 mois *(estimations, détail en A.10)* |

### A.2 Pitch

**En une phrase** : voir A.1.

**En un paragraphe** : fin des années 1980. Sur une petite île évacuée depuis vingt ans, après la tempête qui
a englouti son village, le vieux marégraphe s'est remis à émettre. Vous êtes la technicienne envoyée le réparer.
Le passeur vous dépose à marée basse : vous avez six heures. À chaque reflux, l'estran découvre un peu plus du
village noyé, de ses maisons, de ses épaves et de ses secrets, et un peu plus de votre propre passé. À chaque
flot, la mer reprend l'île, et quelque chose remonte avec elle : **la Laisse**, attirée par le bruit dans l'eau,
qui ne craint que la lumière du phare. Pas d'arme : vous lisez la table des marées, vous choisissez vos chemins,
vous rallumez le phare et vous jouez contre l'horloge la plus ancienne du monde. Jusqu'à la grande marée
d'équinoxe, qui découvrira tout.

### A.3 Fantasme du joueur

**« Seule face à l'océan, je survis parce que j'ai appris à lire la mer. »**
Le joueur passe de la vulnérabilité à la maîtrise du lieu. La courbe émotionnelle de chaque chapitre suit la
marée : **émerveillement** (l'estran immense au soleil rasant), **angoisse** (le flot qui monte),
**confinement** (la pleine mer), **révélation** (le jusant découvre un lieu nouveau).

### A.4 Boucle de gameplay

| Échelle | Ce que fait le joueur |
|---|---|
| **30 secondes** | Avancer, écouter, éclairer. Lire l'eau (profondeur, courant, bruit des pas). Choisir entre le chemin sec mais long et le gué court mais bruyant. Sortir de l'eau et se cacher quand la Laisse approche. |
| **5 minutes** | Une expédition sur l'estran : vérifier sur la montre et la table des marées l'heure à laquelle le passage se referme, atteindre un lieu que la mer vient de découvrir (épave, maison engloutie, cabine du marégraphe), récupérer un indice, une pièce ou un souvenir, revenir avant que le chemin ne soit coupé, ou improviser un refuge si c'est trop tard. |
| **1 heure** | Un chapitre = un cycle de marée compressé (45 à 60 min de jeu) : **basse mer** (exploration ouverte) → **flot** (tension, course contre l'eau) → **pleine mer** (confinement sur les hauteurs, la Laisse chasse dans les zones inondées) → **jusant** (l'île découvre de nouveaux lieux, le récit avance). |
| **Partie entière** | 8 marées sur 4 jours, alternant jour et nuit. Rallumer le phare étend peu à peu les zones sûres. Les coefficients de marée augmentent jusqu'à la grande marée d'équinoxe finale, qui découvre le cœur du village et amène la plus haute mer. |

**Règle systémique centrale** (simple, lisible, apprenable) : la Laisse **entend le bruit dans l'eau** et
**fuit le faisceau du phare**. Plus la mer est haute, plus son territoire est grand. Le joueur arbitre en
permanence entre vitesse (traverser l'eau, bruyant) et sécurité (rester au sec, plus long, plus de temps perdu).

### A.5 USP (arguments de vente uniques)

1. **Un niveau qui respire** : la même île transformée par une marée systémique, plusieurs fois par heure de
   jeu. Les chemins, les cachettes et la menace changent avec le niveau de l'eau.
2. **La mer est à la fois l'horloge et l'antagoniste** : la tension naît d'un phénomène naturel que tout le
   monde comprend (une montre, une table des marées), pas d'un minuteur arbitraire.
3. **Le contraste jour / nuit** : l'estran au soleil rasant est l'un des plus beaux décors qu'on puisse montrer
   en photoréalisme ; la nuit, ce même décor devient mortel. Le jeu n'est pas « tout noir ».
4. **Interface diégétique** : montre, table des marées en papier, carnet, radio VHF. Pas de HUD permanent.

### A.6 Apport du photoréalisme

| Technologie | Ce qu'elle apporte à l'expérience |
|---|---|
| **Lumen** | Indispensable : le niveau de l'eau, l'heure et la météo changent en permanence, aucun éclairage précalculé ne tiendrait. Le faisceau du phare balaie l'île et sa lumière rebondit sur le sable mouillé ; la lampe éclaire réellement les intérieurs ; le brouillard est volumétrique. **La lumière est une mécanique** (le faisceau repousse la Laisse). |
| **Nanite** | Côtes rocheuses, falaises, épaves, maisons en ruine, champs de galets et de varech : une géométrie scannée très dense, idéale pour Nanite. Le littoral fait partie des milieux les mieux couverts par les bibliothèques de scans. |
| **MetaHuman** | Corps complet de l'héroïne en vue subjective et visage dans les reflets et les miroirs. Casting réduit (6 à 8 personnages) vu dans des souvenirs et des photographies : des gros plans **rares, donc marquants**. MetaHuman Animator pour ces scènes. |
| **Autres** | **Substrate** pour les transitions sec / mouillé (sable, roche, bois, rouille, algues) pilotées par la hauteur d'eau. **PCG** pour générer la laisse de mer (débris, algues, coquillages) le long des lignes de marée. **Virtual Shadow Maps** pour les ombres du faisceau. **MetaSounds** pour une mer spatialisée qui « respire » : en horreur, l'audio pèse autant que l'image. |

**Comment le photoréalisme reste atteignable** : une seule île (0,6 à 1 km² d'extérieur) et une douzaine
d'intérieurs ; kits côtiers scannés (Fab / Megascans) et photogrammétrie maison pour quelques objets clés ;
dispersion par PCG ; 6 à 8 personnages MetaHuman. L'eau repose sur un plan principal à hauteur variable et
des volumes locaux pour les intérieurs, avec **3 états de marée de référence** (basse, mi-marée, pleine) et des
transitions continues entre eux. Pas de simulation de fluide.

**Garde-fous de design pour tenir 60 fps** *(proposés au `technical-director`, à confirmer en T-003)* :

- Distances de vue courtes la plupart du temps (nuit, brouillard, intérieurs). Les grandes vues de jour sont
  cadrées, et l'horizon marin est une surface plane peu coûteuse.
- **Pire cas technique** (retour 4 de T-001), qui sert de scène de mesure : **nuit, pleine mer (eau dans tout le
  champ), faisceau du phare en mouvement et lampe du joueur visibles ensemble, brouillard volumétrique, reflets
  sur l'eau, un ou deux monstres dans le champ**. Estimation du `technical-director` (`docs/tech/BUDGETS.md`
  §14.1.1, **non mesurée**) : environ **17,5 ms avant optimisation, pour 14,5 ms visées**, soit 3,0 ms de trop,
  que six leviers de rendu ramèneraient à environ 13,7 ms. La cause principale : deux lumières locales mobiles
  invalident à chaque image leurs ombres (Virtual Shadow Maps) et s'injectent dans le brouillard.
- **Coexistence des deux sources** : les scènes clés (A.2, A.4, trailer) les montrent ensemble. Règle de design :
  la **lampe du joueur est la seule lumière locale à ombres complètes** ; le **faisceau du phare** est un cône de
  grande portée dont les ombres sont **limitées à son cône** (ou à un rayon autour du joueur), sans ombre dynamique
  sur le reste de l'île. Les deux lumières ont un rayon d'atténuation borné. Ce choix est un levier de **rendu** :
  l'effet du faisceau sur la Laisse est calculé par la logique de jeu (cône et tracés de collision contre les
  volumes de l'île), jamais à partir des ombres rendues. Le faisceau garde la même portée visible sur toutes les
  plateformes (règle de parité, 1.5).
- Translucidité limitée à l'eau (ombrage d'eau à couche unique), pas de grandes surfaces vitrées.
- 1 à 3 personnages à l'écran.
- **Series S** : résolution interne, qualité de Lumen, **finesse** de la grille du brouillard et résolution des
  ombres réduites ; la **portée de visibilité, la densité du brouillard en jeu et la portée du faisceau restent
  identiques** à celles de la PS5 (règle de parité, 1.5 ; test de lisibilité en `BUDGETS.md` §14.1.1). Un
  brouillard « plus dense » sur Series S est **interdit** : il changerait la distance à laquelle on voit la Laisse,
  donc la difficulté. **Steam Deck** : bon candidat (lieux contenus, rythme lent), mêmes règles.

### A.7 Périmètre AA maîtrisé

| On fait | On ne fait pas |
|---|---|
| Une île, 8 marées (chapitres), 4 jours | Plusieurs îles, monde ouvert |
| Un antagoniste systémique (la Laisse) dont le comportement évolue au fil des marées | Combat, armes (au plus une fusée de détresse à usage rare) |
| 3 états de marée de référence, transitions continues | Simulation de fluide, navigation libre en bateau |
| Une douzaine d'intérieurs, 6 à 8 personnages | Artisanat, collecte de survie, inventaire lourd |
| 1 500 à 2 500 répliques *(estimation)*, une fin principale et ses variantes | Multijoueur, génération procédurale du niveau |

### A.8 Public cible

- **Cœur** : 18 à 40 ans, joueurs PC et PS5 amateurs d'horreur atmosphérique et narrative, qui préfèrent
  l'immersion et la découverte au combat.
- **Élargi** : amateurs d'exploration narrative attirés par la beauté de l'estran de jour ; public des
  vidéastes et streamers spécialisés dans l'horreur (jeu court, peurs partageables, démo idéale pour un
  festival Steam).
- **Plateformes, par poids attendu des ventes** *(hypothèse, à confirmer par T-002)* : PC (Steam) et PS5 en
  tête, à parts proches ; Xbox Series X|S en complément. **Sortie simultanée** sur PC, PS5 et Xbox (scénario de
  base, T-002 décision 2) : aucune plateforme n'est servie après les autres.
- **Prix et contenu** *(retour 7)*. Base de chiffrage : **29,99 €** pour 7 à 9 h (10 à 12 h à 100 %), ce qui est
  cohérent avec la durée et avec le genre (horreur narrative courte, sans combat) ; les prix de lancement des
  comparables sont à collecter par T-021. **Contenu qui justifierait 39,99 €** : les 8 marées complètes avec leurs
  coefficients croissants, les 10 à 12 h de découverte à 100 %, les fins variantes, un mode « grande marée »
  rejouable (mêmes données de marée, difficulté et variations de la Laisse, sans nouveau décor) et un mode photo.
  Ce contenu est déjà dans le périmètre de A.7 et A.10. Décision de prix en T-004.

### A.9 Concurrents directs et références de design

*Dates et studios cités de mémoire, à vérifier par T-021. Aucun chiffre de ventes dans cette fiche (T-021).*

**Concurrents directs** (sortis depuis 2022, qui visent le même joueur et le même créneau) :

| Jeu | Ce qu'il partage avec nous | Ce qui nous en distingue |
|---|---|---|
| *Dredge* (Black Salt Games, 2023) | Horreur maritime où le danger vient de la nuit, et l'horloge jour / nuit comme tension | Rendu photoréaliste en vue subjective, contre une vue stylisée ; la **menace est liée à la marée** et change le décor lui-même ; pas de boucle de pêche ni de gestion d'inventaire ; récit intime et sans combat |
| *Still Wakes the Deep* (The Chinese Room, 2024) | Un héros ordinaire et sans combat, un lieu clos, une menace liée à l'eau, une narration intime | Une île semi-ouverte et non linéaire au lieu d'un parcours linéaire ; une carte qui change systémiquement avec la marée ; des extérieurs de jour aussi beaux qu'effrayants |

**Références de design** (ce que nous leur empruntons, sans les concurrencer) :

| Jeu | Ce qu'on lui emprunte | Ce qu'on fait différemment |
|---|---|---|
| *Amnesia: The Bunker* (Frictional Games, 2023) | Un hub semi-ouvert hanté par un prédateur systémique persistant ; la lumière comme ressource | Notre ressource est un temps naturel et lisible (la marée) ; menace qui vit dans l'eau ; rendu photoréaliste |
| *Outer Wilds* (Mobius Digital, 2019) | Un monde qui se transforme selon une horloge ; une progression par la connaissance du lieu | Pas de boucle temporelle ; de l'horreur ; une vue subjective photoréaliste et un récit intime |

### A.10 Équipe et durée de production *(estimations)*

| Pôle | ETP au pic |
|---|---|
| Direction et production | 2 à 3 |
| Game design et level design | 3 à 4 |
| Narration | 1 à 2 |
| Programmation (gameplay, IA, eau et marée, rendu, outils, plateformes) | 5 à 7 |
| Art de l'environnement et tech art | 5 à 8 |
| Personnages et animation | 2 à 3 |
| Audio | 2 à 3 |
| QA interne | 2 à 3 |
| **Total** | **22 à 33** |

- **Sous-traitance** : capture de mouvement et faciale (petit casting), comédiens de doublage (6 à 8 rôles),
  musique, localisation, QA externe et tests de compatibilité, appui au portage si besoin.
- **Postes de coût dominants** (pour T-015) : art de l'environnement, système de marée et d'eau, audio.
- **Calendrier indicatif** : préproduction 6 à 8 mois (dont le prototype de marée), production 14 à 17 mois,
  de l'Alpha au Gold 6 à 7 mois. **Total : 26 à 32 mois.**

### A.11 Risques et mitigations

| # | Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|---|
| A1 | Level design à trois états d'eau : chaque espace se conçoit trois fois | Élevée | Élevé | États de référence discrets ; blockout jouable d'une première zone dès M1 ; île plafonnée à 1 km² ; outil d'éditeur pour prévisualiser les états |
| A2 | Coût GPU de l'eau (translucidité, réflexions) et de Lumen sur Series S à 60 fps | Moyenne | Élevé | Eau à couche unique, sans simulation ; scène de référence profilée sur Series S en M1, **dans le pire cas nocturne décrit en A.6** ; leviers de rendu seulement (finesse du brouillard, résolution d'ombre), jamais la portée ni la densité en jeu (règle de parité, 1.5) |
| A3 | Marché de l'horreur encombré ; étiquette « walking sim » | Moyenne | Élevé | USP de la marée visible en 10 s ; prédateur systémique ; démo pour un festival Steam ; prix aligné sur la durée |
| A4 | Lisibilité dans l'obscurité (TV à 3 m, Steam Deck, HDR) | Moyenne | Moyen | Règle de direction artistique « lisible avant d'être sombre » ; calibrage gamma et HDR ; tests sur TV et Deck dès la vertical slice |
| A5 | Répétitivité du cycle de marée sur 8 chapitres | Moyenne | Moyen | Chaque marée découvre un lieu nouveau ; coefficients croissants ; variations météo ; la Laisse change de comportement |
| A6 | Cinétose en vue subjective | Faible | Moyen | Options de champ de vision, de balancement et de flou ; mouvements de caméra doux |

### A.12 Hook du trailer de 10 secondes

- **0 à 4 s** : plan unique en accéléré. Une silhouette minuscule marche sur un estran immense au soleil
  rasant, reflets parfaits dans le sable mouillé. La mer monte ; derrière elle, le chemin disparaît.
- **4 à 8 s** : nuit, couloir inondé. La lampe éclaire une eau qui monte aux genoux. Au fond, quelque chose se
  tient debout dans l'eau, immobile. Le faisceau du phare passe : il n'y a plus rien.
- **8 à 10 s** : carton « **Deux fois par jour, la mer revient. Elle n'est jamais seule.** » Logo ESTRAN.
  *(Fait corrigé, retour 10 : la pleine mer revient environ toutes les 12 h 25, donc deux fois par jour, comme
  l'écrit A.1 ; ce sont la montée et la descente qui durent environ six heures. L'exactitude fait partie de la
  promesse de l'USP 2.)*

**Capsule principale** (image fixe et titre, à comprendre en 3 secondes) : l'USP d'ESTRAN est temporelle, donc la
capsule doit la **figer**. Image : à l'aube, un estran immense et lisse ; au premier plan, une ligne de traces de
pas qui part de l'objectif vers un phare minuscule, et **la mer, déjà rouge de lumière rasante, qui avale les
dernières traces** (celles du premier plan sont encore sèches, celles du fond ont disparu sous l'eau). Dans un
coin, une main tient une montre : le temps manque. Titre « ESTRAN » en grandes capitales ; sous-titre
« Deux fois par jour, la mer revient ». Lecture en 3 secondes : un chemin, une mer qui monte, un refuge lointain.
Un second visuel (même vue en deux moitiés, basse mer à gauche et pleine mer à droite) sert de carrousel Steam.

### A.13 Vertical slice envisagée (M2)

La première marée complète : arrivée à basse mer, expédition jusqu'au marégraphe, montée du flot, première
rencontre avec la Laisse, refuge au phare. **12 à 15 minutes**, sur PC et PS5, à 60 fps en mode performance.

**Démo publique (Steam Next Fest, 20 à 30 minutes)** *(retour 9)* : la vertical slice, étendue à la première marée
complète puis au début de la deuxième (22 à 25 minutes visées). **Elle dévoile** : la règle de la marée (le chemin
qui disparaît), la lumière comme mécanique, l'ambiance de l'estran de jour et de nuit, le premier intérieur.
**Elle montre la Laisse sans la révéler** : on entend son bruit dans l'eau, on voit ses traces et le faisceau qui
la fait disparaître, jamais son corps en pleine lumière ni de près. Le hook (la menace systémique) est tenu, la
révélation est gardée pour le jeu complet. **Elle cache** : les 6 marées suivantes, les variantes de comportement
de la Laisse et la fin.

---

## 3. Concept B : DERNIÈRE POSITION CONNUE

### B.1 Fiche d'identité

| Champ | Valeur |
|---|---|
| Titre provisoire | **DERNIÈRE POSITION CONNUE** (titre de travail international : *Last Known*) |
| Pitch en une phrase | Secouriste de haute montagne dans un massif imaginaire, vous traquez les disparus dans la tempête et vous les ramenez vivants, avec la météo pour seul adversaire. |
| Genre | Aventure de sauvetage et de traversée, **non violente** |
| Perspective | Troisième personne (caméra à l'épaule), vue subjective en option |
| Univers | Massif alpin fictif, époque contemporaine : une vallée et ses habitants, de l'hiver au dégel |
| Solo ou multijoueur | Solo |
| Durée de jeu visée | 12 à 15 h |
| Classification anticipée | PEGI 12 ; équivalent ESRB anticipé : **T** (Teen), éventuellement E10+ selon les scènes de détresse *(hypothèses, T-002)* |
| Prix de lancement | 39,99 € *(hypothèse, dans la fourchette de travail de T-002 ; la durée de 12 à 15 h le justifie)* |
| Équipe et durée | 36 à 53 ETP au pic, 34 à 42 mois *(estimations, détail en B.10)* |

### B.2 Pitch

**En une phrase** : voir B.1.

**En un paragraphe** : chaque hiver, le massif attire randonneurs, skieurs hors-piste et imprudents. Quand l'un
d'eux ne rentre pas, l'appel arrive au refuge de l'équipe de secours : une dernière position connue, une
description, un bulletin météo qui se dégrade. Vous êtes une secouriste qui reprend du service après l'accident
qui a coûté la vie à un coéquipier. Vous choisissez votre matériel, vous lisez la montagne, vous suivez les
indices (une trace dans la neige, un bâton abandonné, le dernier signal d'un téléphone), vous trouvez la victime,
vous la stabilisez et vous décidez comment la ramener : à pied, sur une luge de secours, ou en attendant une
fenêtre météo pour l'hélicoptère. Pas d'ennemis : la montagne n'est pas méchante, elle est indifférente.
Et chaque tempête redessine la vallée.

### B.3 Fantasme du joueur

**« Je suis celle qui ramène les gens vivants. »**
Compétence calme, courage, sang-froid. Le sommet émotionnel de chaque mission est la **découverte** : un visage
dans la neige, des yeux qui s'ouvrent. Le joueur se sent utile et fort sans jamais blesser personne.

### B.4 Boucle de gameplay

| Échelle | Ce que fait le joueur |
|---|---|
| **30 secondes** | Lire le terrain (pente, neige, roche mouillée, glace), choisir sa ligne, placer ses pas, s'assurer à un ancrage, repérer un indice. |
| **5 minutes** | Suivre une piste : indice → déduction d'une direction → progression → nouvel indice. Gérer la chaleur, l'énergie, la lumière du jour et la batterie. Décider de monter, de contourner ou d'attendre une accalmie. |
| **1 heure** | Une mission : appel et briefing (dernière position connue, profil de la victime, météo) → choix du matériel sous contrainte de poids → recherche → découverte et bilan (hypothermie, fracture, conscience) → évacuation (portage, luge, hélicoptère si la météo le permet) → débriefing au refuge. |
| **Partie entière** | Une saison de 14 à 18 missions, de l'hiver au dégel. La vallée change (neige, crues, avalanches). Nouveaux équipements et compétences, liens avec les habitants et l'équipe, arc personnel de l'héroïne. |

### B.5 USP

1. **Sauver, pas survivre ni tuer** : la victoire, c'est un visage qui rouvre les yeux. Un positionnement non
   violent rare dans l'aventure premium, qui élargit le public.
2. **La météo comme level designer** : la même vallée devient un autre niveau selon la neige, le vent, le
   brouillard et l'heure.
3. **Une enquête dans la nature** : on suit des indices physiques (empreintes, objets, signaux) plutôt que des
   marqueurs d'objectif.

### B.6 Apport du photoréalisme

| Technologie | Ce qu'elle apporte à l'expérience |
|---|---|
| **Lumen** | Météo et heure dynamiques, impossibles à précalculer : lumière diffuse d'un jour blanc, soleil rasant sur la neige, frontale dans le blizzard, réflexions sur la glace. |
| **Nanite** | Falaises, éboulis, moraines, séracs, chalets : une géométrie alpine scannée à très haute densité, dans les vues lointaines comme sous les pieds. Végétation du fond de vallée avec les évolutions récentes de Nanite pour le feuillage (démontrées par Epic en 2025 ; maturité à évaluer en T-003). |
| **MetaHuman** | Les visages des victimes au moment de la découverte sont le sommet émotionnel de chaque mission (peau marbrée par le froid, cils givrés, souffle, regard). L'équipe et les habitants (20 à 30 personnages). L'héroïne, visible en troisième personne. |
| **Autres** | **Substrate** pour la neige, la glace, la roche mouillée et les textiles techniques. Déformation de la neige (traces, pistage) autour des personnages. Nuages et brouillard volumétriques. **PCG** pour répartir forêt et rochers et pour les dégâts d'avalanche. Quelques chutes de pierres scriptées avec la physique Chaos. |

**Comment le photoréalisme reste atteignable** : une vallée jouable de 4 à 6 km² et un décor lointain Nanite non
jouable ; les milieux alpins sont bien couverts par les bibliothèques de scans ; dispersion par PCG ;
14 à 18 missions faites main avec des variations systémiques ; l'hélicoptère n'apparaît qu'en séquences
mises en scène. Le joueur se déplace à pied : le streaming du monde est bien moins sollicité que dans un jeu de
conduite.

**Garde-fous de design pour tenir 60 fps** *(proposés au `technical-director`, à confirmer en T-003)* :

- Environ **70 % du jeu au-dessus de la limite des arbres** : roche et neige coûtent beaucoup moins cher que
  la forêt dense. La forêt est concentrée en fond de vallée, avec une densité maîtrisée.
- Les tempêtes réduisent la distance de vue ; les grandes vues dégagées sont rares et cadrées.
- Déformation de la neige uniquement près du joueur ; 4 personnages au plus à l'écran.
- World Partition et HLOD ; hélicoptère en séquences.
- **Series S** : la plateforme la plus à risque, avec un profil dédié, **limité au rendu** (densité de végétation en
  imposteurs, résolution, qualité de Lumen) : la distance de visibilité d'une tempête, la position des traces et des
  victimes sont des données de jeu identiques partout (règle de parité, 1.5). **Steam Deck** : objectif « jouable » ;
  le label « vérifié » n'est pas garanti.

### B.7 Périmètre AA maîtrisé

| On fait | On ne fait pas |
|---|---|
| Une vallée, 14 à 18 missions faites main | Monde ouvert sur plusieurs vallées, missions générées |
| 4 états saisonniers, météo dynamique | Second biome (désert, jungle...) |
| Pistage d'indices, traversée contextuelle sur ancrages prévus | Escalade libre partout, ski libre et sports de glisse |
| Portage et luge, bilan médical simplifié à 3 variables | Simulation médicale réaliste, artisanat, collecte de survie |
| Hélicoptère en séquences, radio comme fil narratif | Pilotage d'hélicoptère, combat, coopération en ligne au lancement |
| 20 à 30 personnages, 4 000 à 6 000 répliques *(estimation)* | |

**Décision à arbitrer en préproduction** : le **chien de recherche**. C'est un énorme atout marketing et
émotionnel, mais l'IA et l'animation d'un quadrupède coûtent cher. Si on le garde, ce sera dans une version
scénarisée et contextuelle.

### B.8 Public cible

- **Cœur** : 25 à 45 ans, PC et consoles, amateurs d'aventure contemplative et de défi de traversée,
  passionnés de montagne et d'activités de plein air.
- **Élargi** : joueurs qui cherchent une aventure premium non violente (PEGI 12 anticipé), jeu partagé
  en couple ou en famille sur le canapé, créateurs de contenu friands de « nature photoréaliste ».
- **Plateformes, par poids attendu des ventes** *(hypothèse, à confirmer par T-002)* : PC et PS5 à parts proches,
  Xbox Series X|S en complément. **Sortie simultanée** sur les trois (scénario de base, T-002 décision 2).

### B.9 Concurrents directs et références de design

*Dates et studios cités de mémoire, à vérifier par T-021. Aucun chiffre de ventes dans cette fiche (T-021).*

**Concurrents directs** (sortis depuis 2022) :

| Jeu | Ce qu'il partage avec nous | Ce qui nous en distingue |
|---|---|---|
| *Jusant* (Don't Nod, 2023) | Une montagne sans ennemis, la traversée comme gameplay, un jeu court et contemplatif | Un monde photoréaliste contre un décor stylisé ; des missions de sauvetage centrées sur des personnes ; la météo qui change la vallée ; 12 à 15 h contre un jeu bref |
| *Death Stranding 2: On the Beach* (Kojima Productions, 2025, à vérifier) | Le terrain comme gameplay, la solitude dans le paysage, la charge et l'équilibre | Réalisme contemporain sans science-fiction ni combat ; une zone unique et dense ; l'enjeu est la survie d'autrui, pas la livraison |
| *Simulateurs de secours en montagne* (titres et studios **à identifier**, à vérifier) | Le métier de secouriste, au plus près du réel | Une aventure narrative et émotionnelle, non une simulation ; positionnement à protéger (risque B4) |

**Références de design** :

| Jeu | Ce qu'on lui emprunte | Ce qu'on fait différemment |
|---|---|---|
| *Death Stranding* (Kojima Productions, 2019) | Le terrain comme gameplay, l'équilibre et la charge, la solitude dans le paysage | Réalisme contemporain, sans science-fiction ; des missions centrées sur des personnes à retrouver ; une zone unique et dense |
| *The Long Dark* (Hinterland Studio, 2017) | Le froid, la fatigue, la météo comme menace principale, une nature indifférente | Pas de boucle de survie par collecte et artisanat ; l'enjeu est la survie d'autrui ; rendu photoréaliste plutôt que peint |
| *Firewatch* (Campo Santo, 2016) | La radio comme lien narratif, le sens du lieu, un personnage en reconstruction | Des missions systémiques et une vraie traversée physique ; la montagne en hiver ; des missions rejouables |

### B.10 Équipe et durée de production *(estimations)*

| Pôle | ETP au pic |
|---|---|
| Direction et production | 3 à 4 |
| Design (game design, level design, systèmes, missions) | 5 à 7 |
| Narration | 1 à 2 |
| Programmation (traversée, météo, monde et streaming, IA, rendu, outils, plateformes) | 9 à 13 |
| Art du monde et de l'environnement, tech art | 9 à 13 |
| Personnages et animation | 4 à 6 |
| Audio | 2 à 3 |
| QA interne | 3 à 5 |
| **Total** | **36 à 53** |

- **Sous-traitance** : capture de mouvement importante (traversée, portage), doublage (20 à 30 rôles),
  musique, localisation, QA externe, **consultant en secours en montagne** (réalisme et justesse des messages
  de sécurité).
- **Postes de coût dominants** (pour T-015) : art du monde, animation et capture de la traversée,
  optimisation des performances.
- **Calendrier indicatif** : préproduction 8 à 10 mois, production 18 à 22 mois, de l'Alpha au Gold 8 à 10 mois.
  **Total : 34 à 42 mois.**

### B.11 Risques et mitigations

| # | Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|---|
| B1 | Tenue des 60 fps avec végétation, météo et grandes vues, surtout sur Series S | Élevée | Très élevé | Majorité du jeu au-dessus des arbres ; scène de référence « forêt et tempête » profilée sur Series S en M1 ; plan B : densité réduite et imposteurs |
| B2 | Dérive du périmètre d'un monde semi-ouvert | Élevée | Élevé | Une seule vallée, missions faites main, liste « on ne fait pas » validée par la Boss ; pas de second biome |
| B3 | Animation de la traversée et du portage (interaction entre deux corps) | Élevée | Élevé | Traversée contextuelle sur ancrages ; motion matching ; peu d'états de portage ; budget de capture dédié |
| B4 | Étiquette « simulateur », ou attente d'un jeu de survie et d'artisanat | Moyenne | Élevé | Positionnement « aventure de sauvetage » ; trailers centrés sur l'émotion de la découverte ; démo jouable |
| B5 | Répétitivité des missions | Moyenne | Moyen | Situations variées (crevasse, avalanche, rivière en crue, enfant égaré, alpiniste blessé) ; météo et saisons ; arcs narratifs |
| B6 | Messages de sécurité en montagne erronés ; usage du nom d'organismes de secours réels | Faible | Élevé | Consultant professionnel ; organisation de secours fictive ; avertissement en jeu |

### B.12 Hook du trailer de 10 secondes

- **0 à 4 s** : vue aérienne dans le blizzard, plongée vers un point lumineux minuscule : une frontale.
- **4 à 8 s** : la secouriste dégage la neige à mains nues et découvre un visage aux cils givrés.
  Les yeux s'ouvrent.
- **8 à 10 s** : carton « **Quatre heures de jour. Ramenez-les vivants.** » Logo DERNIÈRE POSITION CONNUE.

**Capsule principale** (image fixe et titre, à comprendre en 3 secondes) : gros plan sur un visage givré, cils
blancs de cristaux, yeux entrouverts, éclairé par le cône d'une frontale dans le blizzard ; au bord du cadre, une
main gantée écarte la neige. Titre « DERNIÈRE POSITION CONNUE », sous-titre « Ramenez-les vivants ». Lecture en
3 secondes : quelqu'un est vivant sous la neige, et c'est à nous de le sortir de là.

### B.13 Vertical slice envisagée (M2)

Une mission courte et complète : appel, briefing, montée dans le brouillard, pistage jusqu'à un randonneur blessé,
bilan, descente en luge sous une tempête qui se lève. **12 à 15 minutes**, sur PC et PS5, à 60 fps en mode
performance.

**Démo publique (Steam Next Fest, 20 à 30 minutes)** *(retour 9)* : la mission de la vertical slice, précédée d'un
court prologue de traversée libre (une dizaine de minutes en tout pour ce prologue et la mise en place des outils).
**Elle dévoile** : la traversée, la météo qui se lève, le pistage, l'émotion de la découverte d'un visage vivant.
**Elle cache** : la taille de la vallée, les arcs narratifs, les autres types de missions (crevasse, avalanche,
rivière en crue).

---

## 4. Concept C : AVEUX

### C.1 Fiche d'identité

| Champ | Valeur |
|---|---|
| Titre provisoire | **AVEUX** (titre de travail international : *The Tell*, le « tell » étant le signe involontaire qui trahit) |
| Pitch en une phrase | Inspectrice dans une ville portuaire imaginaire en 1999, vous avez une nuit de garde à vue pour obtenir la vérité, et seuls les visages de vos suspects peuvent vous dire si vous tenez un coupable ou un innocent qui a craqué. |
| Genre | Thriller d'enquête et d'interrogatoire, narratif à embranchements |
| Perspective | Première personne en face-à-face, quelques plans cinématiques |
| Univers | Ville portuaire européenne fictive, hiver 1999 : un commissariat de nuit et des scènes de crime |
| Solo ou multijoueur | Solo (un mode « le public vote » pour les streamers est étudié, hors périmètre de base) |
| Durée de jeu visée | 8 à 10 h ; rejouabilité par les embranchements |
| Classification anticipée | PEGI 16 ; équivalent ESRB anticipé : **M** (Mature 17+), ou T si la violence reste hors champ *(hypothèses, T-002)* |
| Prix de lancement | 24,99 € (base de chiffrage, décision 5 de T-001) à 29,99 € ; variante haute 39,99 €, argumentée en C.8 |
| Équipe et durée | 23 à 34 ETP au pic et forte sous-traitance de capture, 24 à 30 mois *(estimations, détail en C.10)* |

### C.2 Pitch

**En une phrase** : voir C.1.

**En un paragraphe** : hiver 1999, dans une ville portuaire qui vit ses dernières nuits avant l'an 2000. Vous êtes
inspectrice à la brigade criminelle, réputée pour obtenir des aveux. Chaque affaire tient en une nuit : douze
heures de garde à vue, deux à quatre personnes dans des salles séparées, des preuves qui arrivent au
compte-gouttes et une hiérarchie qui veut un nom avant l'aube. Vous écoutez, vous relancez, vous bluffez, vous
vous taisez. Surtout, vous regardez : un regard qui fuit, une déglutition, un sourire qui arrive une
demi-seconde trop tard. Les interrogatoires sont enregistrés sur cassette : vous pouvez les rembobiner, les
ralentir, zoomer sur un visage, puis revenir confronter le suspect à ce que son visage a trahi. Mais un signe de
stress n'est pas un aveu, et un aveu n'est pas la vérité : sous la pression, un innocent finit aussi par craquer.
Et les erreurs d'une nuit reviennent hanter les suivantes.

### C.3 Fantasme du joueur

**« Je vois clair dans les gens. »**
Le duel psychologique, la jubilation de la faille repérée, puis le poids de la responsabilité : le joueur
signe un procès-verbal et doit vivre avec.

### C.4 Boucle de gameplay

| Échelle | Ce que fait le joueur |
|---|---|
| **30 secondes** | Une question, une réponse, un visage. Choisir une approche (empathie, confrontation, silence, preuve, bluff), observer la réaction, marquer un moment de l'enregistrement. |
| **5 minutes** | Un tour d'interrogatoire : établir la **ligne de base** du suspect (comment il réagit quand il dit vrai), insister sur un point, relire la cassette, confronter avec une preuve ou une contradiction, voir la version changer. |
| **1 heure** | Une affaire = une nuit (60 à 90 min) : répartir son temps entre les salles, demander des vérifications à l'équipe de terrain (en nombre limité, chaque demande coûte du temps), recouper sur le tableau de l'affaire, puis rédiger le procès-verbal (qui, quoi, pourquoi) et en assumer les suites. |
| **Partie entière** | 6 affaires reliées par un fil rouge. Les conséquences (coupable relâché, innocent condamné, informateur grillé) se répercutent d'une nuit à l'autre. Plusieurs fins. |

**Principe de design honnête** : les signes indiquent qu'une question **touche quelque chose**, pas que la
personne ment. Le jeu ne cautionne pas le mythe du « détecteur de mensonge par les micro-expressions » :
chaque personnage a sa ligne de base, ses signes sont cohérents et apprenables, et seule leur combinaison avec
les preuves mène à la vérité. C'est à la fois plus juste et plus intéressant à jouer.

### C.5 USP

1. **Le visage est l'interface** : pas de jauge de mensonge à l'écran, seulement des performances de comédiens
   captées en photoréalisme, qu'il faut apprendre à lire.
2. **La relecture de cassette** : rembobiner, ralentir, zoomer sur un visage. Un geste de jeu original et très
   partageable.
3. **Un aveu n'est pas la vérité** : un système de pression qui peut produire de faux aveux, avec des
   conséquences durables. Un thème adulte et rare.
4. **La lumière comme horloge** : la nuit avance dans les salles (néons, lampes de bureau) jusqu'à l'aube qui
   filtre par les stores au moment où la garde à vue expire.

### C.6 Apport du photoréalisme

| Technologie | Ce qu'elle apporte à l'expérience |
|---|---|
| **MetaHuman** | Le pilier du concept : 20 à 25 personnages en gros plan, performances faciales captées sur de vrais comédiens avec MetaHuman Animator. Une **couche additive de signes** (regard, déglutition, crispation) pilotée par le système de stress se superpose à la performance captée : les réactions varient sans qu'il faille capturer toutes les combinaisons. |
| **Lumen** | L'éclairage dur et réaliste des salles (néon qui grésille, lampe de bureau, miroir sans tain) révèle la peau. La lumière évolue au fil de la nuit jusqu'à l'aube (horloge visuelle). Scènes de crime nocturnes. |
| **Nanite** | Commissariat et scènes de crime denses en objets d'époque photoscannés (dossiers, cendriers, téléphones, magnétoscopes), visibles de très près lors des relectures zoomées. Quelques extérieurs sur le port. |
| **Autres** | **Substrate** pour la peau, les yeux humides, la sueur et les tissus. Cheveux en mèches (groom) en gros plan. Post-traitement « cassette » (bruit, défauts de piste) qui sert aussi l'immersion. |

**Comment le photoréalisme reste atteignable** : des lieux minuscules (salles d'interrogatoire, commissariat,
6 à 10 scènes de crime compactes) ; des sessions de capture planifiées par affaire ; des personnages créés à
partir de MetaHuman puis personnalisés ; des objets d'époque photographiés et scannés par le studio.

**Garde-fous de design pour tenir 60 fps** *(proposés au `technical-director`, à confirmer en T-003)* :

- Au plus 2 personnages au niveau de détail maximal à l'écran ; pièces de moins de 100 m².
- Cheveux en mèches sur PS5, Xbox Series X et PC ; cartes de cheveux sur Series S et Steam Deck si nécessaire
  (différence de rendu seulement).
- **Parité (1.5)** : aucun signe porteur d'information (regard, déglutition, crispation) n'est absent ou atténué
  sur une plateforme. Le rig facial réduit de la Series S doit conserver tous les gestes listés comme porteurs
  d'indice (`BUDGETS.md` §14.1.2). La couche de signes est calculée par la logique de jeu, pas par le niveau de
  détail affiché.
- Le coût principal tient à la peau, aux cheveux, aux yeux et à l'évaluation du rig facial : le nombre de
  visages haute qualité simultanés est donc plafonné par le design. **Estimation du `technical-director`
  (`BUDGETS.md` §14.1.2, non mesurée)** pour deux visages en gros plan : 2,0 à 3,0 ms de GPU sur PS5, 1,4 à
  2,0 ms sur Series S, contre 1,0 ms prévu pour le poste « Personnages » d'une scène de jeu ; le budget du poste
  est porté à 3,0 ms (PS5) et 2,0 ms (Series S) en scène de dialogue, repris sur le décor. C'est le risque 60 fps
  principal du concept, à mesurer en S-10 (T-003).
- **Steam Deck** : bon candidat, avec le zoom de la relecture et des sous-titres agrandis.

### C.7 Périmètre AA maîtrisé

| On fait | On ne fait pas |
|---|---|
| 6 affaires, une nuit chacune ; un commissariat comme hub | Fusillades, poursuites, conduite, monde ouvert |
| 6 à 10 scènes de crime compactes | Générateur procédural d'affaires |
| 20 à 25 personnages ; 6 000 à 9 000 répliques captées *(estimation, premier poste de coût)* | Doublage synchronisé dans plus de 2 langues au lancement |
| Relecture de cassette, tableau de l'affaire, procès-verbal, fins multiples | Violence physique jouable sur les suspects (le jeu peut la montrer comme une faute, jamais la récompenser) |

### C.8 Public cible

- **Cœur** : 20 à 45 ans, amateurs de jeux narratifs à choix et de jeux d'enquête, spectateurs de séries
  policières et de documentaires criminels.
- **Élargi** : streamers et leur public (« il ment ou pas ? » est un format participatif naturel) ; joueurs
  occasionnels, car le jeu demande peu de dextérité.
- **Plateformes, par poids attendu des ventes** *(hypothèse, à confirmer par T-002)* : PS5 et PC en tête, Xbox
  Series X|S en complément (genre narratif, public de séries policières sur console). **Sortie simultanée** sur
  les trois (scénario de base, T-002 décision 2).
- **Prix et contenu** *(retour 7)*. Base de chiffrage : **24,99 €** (borne basse de la fourchette de T-001) pour
  8 à 10 h. **Argument d'un prix inférieur à 39,99 €** : un jeu de dialogue plus étroit que la moyenne du marché
  premium (C4), une rejouabilité faible (C7) et une durée proche de celle d'ESTRAN ; les prix de lancement des
  comparables restent à collecter par T-021. **Contenu qui justifierait 39,99 €** : les 6 affaires complètes
  (sans le repli à 5), les 20 à 25 personnages, les fins multiples avec le mode expert sans assistance, le doublage
  anglais et français. Ce contenu est déjà celui de C.4 et C.10, avec un coût de capture élevé. Décision de prix
  en T-004.

### C.9 Concurrents directs et références de design

*Dates et studios cités de mémoire, à vérifier par T-021. Aucun chiffre de ventes dans cette fiche (T-021).*

**Concurrents directs** (sortis depuis 2022) :

| Jeu | Ce qu'il partage avec nous | Ce qui nous en distingue |
|---|---|---|
| *The Operator* (2024, studio à vérifier) | Le jeu d'enquête par interrogatoire, où l'on questionne et où l'on déduit | Un visage photoréaliste en gros plan comme interface, contre une enquête menée surtout par documents et par interface ; une couche de signes qui varie selon le stress ; des embranchements aux conséquences durables |
| *Who's Lila?* (2022, Garage Heathen selon T-021, non relu à la source) | Le visage comme interface de jeu | Un visage photoréaliste capté sur de vrais comédiens ; un interrogatoire contextuel et déductif, non un défi d'expressions ; une nuit de garde à vue qui structure le récit |

**Références de design** (plus anciennes) :

| Jeu | Ce qu'on lui emprunte | Ce qu'on fait différemment |
|---|---|---|
| *Telling Lies* (Sam Barlow, 2019) et *Interrogation: You Will Be Deceived* (2019, studio à vérifier) | Revoir et croiser des déclarations pour trouver la faille | Du temps réel et une performance faciale influencée par le joueur |
| *L.A. Noire* (Team Bondi / Rockstar Games, 2011) | La performance faciale captée comme indice ; l'interrogatoire comme duel | L'interrogatoire est le jeu entier (pas de conduite ni de fusillades) ; pas de choix binaire vérité / doute / mensonge, mais des approches et une relecture ; la technologie MetaHuman actuelle |
| *Her Story* (Sam Barlow, 2015) | Revoir des enregistrements pour trouver la faille ; un joueur détective actif | Des interrogatoires en temps réel que le joueur influence ; de la 3D photoréaliste au lieu de vidéo filmée ; des conséquences durables |
| *Detroit: Become Human* (Quantic Dream, 2018) | Le jeu d'acteurs capté, les embranchements et leurs conséquences, une mise en scène de cinéma | La déduction au cœur du jeu, sans séquences d'action à réflexes ; un périmètre contenu (une ville, six nuits) ; un budget AA |

### C.10 Équipe et durée de production *(estimations)*

| Pôle | ETP au pic |
|---|---|
| Direction et production | 2 à 3 |
| Game design (systèmes de déduction, conception des affaires) | 3 à 4 |
| Narration et écriture | 3 à 4 |
| Programmation (dialogues, couche de signes faciaux, relecture, outils, plateformes) | 4 à 6 |
| Art de l'environnement et tech art | 3 à 5 |
| Personnages et animation faciale | 4 à 6 |
| Audio (dont direction des voix) | 2 à 3 |
| QA interne | 2 à 3 |
| **Total** | **23 à 34** |

- **Sous-traitance (le gros poste)** : casting de 20 à 25 comédiens, sessions de capture du corps et du
  visage, cession des droits à l'image et à la voix, doublage, localisation d'un gros volume de texte,
  QA externe.
- **Postes de coût dominants** (pour T-015) : comédiens et capture, écriture, animation faciale, localisation.
- **Calendrier indicatif** : préproduction 6 à 8 mois, production 12 à 15 mois, de l'Alpha au Gold 6 à 7 mois.
  **Total : 24 à 30 mois.**

### C.11 Risques et mitigations

| # | Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|---|
| C1 | Vallée de l'étrange : si un visage sonne faux, le concept s'effondre | Moyenne | Très élevé | Une affaire complète en vertical slice ; de vrais comédiens ; des animateurs faciaux pour la finition ; tests avec des joueurs dès M1 |
| C2 | Lisibilité des signes : trop subtils, c'est frustrant ; trop évidents, c'est trivial | Élevée | Élevé | Ligne de base par personnage ; signes cohérents et apprenables ; mode « lecture assistée » (accessibilité) ; tests de jeu fréquents |
| C3 | Volume de capture, d'écriture et de voix ; doublage synchronisé coûteux par langue | Élevée | Élevé | Couche additive de signes pour réduire les variantes captées ; repli à 5 affaires ; doublage anglais et français, sous-titres ailleurs ; animation faciale générée depuis l'audio des doublages à évaluer |
| C4 | Marché plus étroit pour un jeu « bavard », surtout sur console | Moyenne | Élevé | Prix ajusté (C.8) ; **démo courte de 20 à 30 minutes** (C.13), non la première affaire entière de 60 à 90 minutes ; mode public pour les streamers ; marketing sur le hook du visage |
| C5 | Thèmes sensibles : coercition policière, faux aveux | Moyenne | Moyen | Institutions fictives ; la violence n'est jamais récompensée ; relecture juridique et de sensibilité ; classification anticipée |
| C6 | Droits des comédiens (image, voix, réutilisation numérique, IA) | Moyenne | Élevé | Contrats de cession explicites préparés par `business-affairs` et validés par un avocat ; consentement explicite pour toute réutilisation numérique |
| C7 | Faible rejouabilité | Élevée | Moyen | Embranchements et fins multiples ; mode expert sans assistance ; prix cohérent avec la durée |

### C.12 Hook du trailer de 10 secondes

- **0 à 4 s** : gros plan fixe, image de cassette avec horodatage. Un homme dit calmement :
  « Je n'étais pas là ce soir-là. »
- **4 à 8 s** : rembobinage, ralenti, zoom sur le coin de sa bouche : une contraction d'un dixième de seconde.
- **8 à 10 s** : carton « **Tout le monde ment. Les visages, un peu moins.** » Logo AVEUX.

**Capsule principale** (image fixe et titre, à comprendre en 3 secondes) : un visage d'homme en gros plan, de face,
dans l'image granuleuse d'une cassette, avec un horodatage « 03:12:44 » en bas à gauche ; un petit réticule de
zoom encadre le coin de sa bouche, qui se contracte. Titre « AVEUX », sous-titre « Tout le monde ment ». Lecture en
3 secondes : un interrogatoire filmé, et on nous demande de regarder le visage.

### C.13 Vertical slice envisagée (M2)

Une nuit complète en version courte : deux suspects, trois preuves, la relecture, la confrontation et le
procès-verbal. **12 à 15 minutes**, sur PC et PS5, à 60 fps en mode performance.

**Démo publique (Steam Next Fest, 20 à 30 minutes)** *(retour 9)* : la **version courte de la première affaire**
(l'affaire complète dure 60 à 90 minutes, trop longue pour un festival) : un seul suspect principal, trois
preuves, la relecture zoomée, une confrontation et le procès-verbal, avec le mode « lecture assistée » activé par
défaut pour apprendre le langage des signes. **Elle dévoile** : le visage comme interface, la relecture, le
doute entre un coupable et un innocent qui craque. **Elle cache** : l'escalade sur les six nuits, les
conséquences durables des choix et la fin.

---

## 5. Tableau comparatif

| Critère | A. ESTRAN | B. DERNIÈRE POSITION CONNUE | C. AVEUX |
|---|---|---|---|
| Genre | Horreur psychologique, exploration | Aventure de sauvetage, traversée | Thriller d'interrogatoire, narratif |
| Perspective | 1re personne | 3e personne | 1re personne (face-à-face) |
| Univers et époque | Île de marée atlantique fictive, fin des années 1980 | Massif alpin fictif, contemporain | Ville portuaire fictive, hiver 1999 |
| Fantasme | Survivre en lisant la mer | Ramener les gens vivants | Voir clair dans les gens |
| Boucle d'une heure | Un cycle de marée | Une mission de sauvetage | Une nuit de garde à vue |
| USP principale | Un niveau qui respire avec la marée | Sauver plutôt que tuer, la météo comme level designer | Le visage est l'interface |
| Pari technique dominant | Lumen (lumière, eau) | Nanite, PCG, scans (nature) | MetaHuman (visages) |
| Usage de MetaHuman | Casting réduit (6 à 8), corps de l'héroïne | 20 à 30 personnages, visages des victimes | 20 à 25 personnages en gros plan, cœur du jeu |
| Espace jouable | Une île de 0,6 à 1 km², une douzaine d'intérieurs | Une vallée de 4 à 6 km² | Un commissariat, 6 à 10 scènes compactes |
| Durée de jeu | 7 à 9 h | 12 à 15 h | 8 à 10 h |
| Solo ou multijoueur | Solo | Solo | Solo |
| Classification anticipée | PEGI 16 ; ESRB M | PEGI 12 ; ESRB T | PEGI 16 ; ESRB M (ou T) |
| Prix *(hypothèse)* | 29,99 € (variante haute 39,99 €) | 39,99 € | 24,99 à 29,99 € (variante haute 39,99 €) |
| Équipe au pic *(estimation)* | 22 à 33 ETP | 36 à 53 ETP | 23 à 34 ETP |
| Production *(estimation)* | 26 à 32 mois | 34 à 42 mois | 24 à 30 mois |
| Sous-traitance dominante | Musique, petit casting, QA | Capture de traversée, doublage | Comédiens et capture, localisation |
| Coût relatif *(estimation)* | Moyen | Élevé | Moyen, avec une part variable liée au casting |
| Risque 60 fps (Series S) | Moyen (eau ; pire cas nocturne estimé à 17,5 ms pour 14,5 visées avant optimisation, non mesuré) | Élevé (végétation, météo, vues) | **Moyen** (visages en gros plan : 2,0 à 3,0 ms estimés pour deux visages sur PS5, non mesuré ; à mesurer par T-003) |
| Steam Deck | Bon candidat | Difficile (« jouable » visé) | Bon candidat |
| Risque de production *(règle 5.1, risques de contenu et de volume : A1, A5, A6 ; B2, B3, B5, B6 ; C1, C2, C3, C5, C6, C7)* | **Élevé** (max 9 : A1 ; 1 risque à 9) | **Élevé** (max 9 : B2, B3 ; 2 risques à 9) | **Élevé** (max 9 : C2, C3 ; 2 risques à 9, C1 à 8) |
| Risque global *(règle 5.1, tous les risques X.11)* | **Élevé** (max 9, 1 risque à 9) | **Très élevé** (max 12 : B1 ; 3 risques à 9 ou plus) | **Élevé** (max 9, 2 risques à 9, C1 à 8) |
| Risque marché | Moyen (horreur encombrée) | Moyen (positionnement inédit à expliquer) | Moyen à élevé (niche plus étroite) |
| Hook en 10 s | La mer monte et efface le chemin | Un visage givré rouvre les yeux | Un mensonge rembobiné au ralenti |
| Extensibilité | Nouvelle île en DLC, anthologie littorale | Nouveaux massifs et saisons en DLC | Nouvelles affaires en DLC épisodiques |

### 5.1 Règle d'agrégation des risques

Les tableaux X.11 sont la source ; la synthèse (section 0 et lignes « Risque global » et « Risque de production »
ci-dessus) en est **calculée**, jamais écrite à la main.

- **Probabilité (P)** : Faible = 1, Moyenne = 2, Élevée = 3, Très élevée = 4. **Impact (I)** : Faible = 1,
  Moyen = 2, Élevé = 3, Très élevé = 4.
- **Score d'un risque = P × I** (de 1 à 16).
- **Niveau global du concept = niveau du pire risque** : **Très élevé** si le maximum est de 12 ou plus ;
  **Élevé** de 9 à 11 ; **Moyen** de 5 à 8 ; **Faible** jusqu'à 4. On indique en plus le **nombre de risques à 9
  ou plus**, pour qu'un concept qui en cumule plusieurs ne se confonde pas avec un concept qui n'en a qu'un.
- **Risque de production** : même règle, restreinte aux risques de contenu, de volume et de qualité de production
  (hors coût GPU, marché et affichage). Le **risque global** les prend tous.

| Concept | Scores P × I (X.11) | Maximum | Risques à 9 ou plus | Niveau global |
|---|---|---|---|---|
| A. ESTRAN | A1 9 ; A2 6 ; A3 6 ; A4 4 ; A5 4 ; A6 2 | 9 | 1 | **Élevé** |
| B. DERNIÈRE POSITION CONNUE | B1 12 ; B2 9 ; B3 9 ; B4 6 ; B5 4 ; B6 3 | 12 | 3 | **Très élevé** |
| C. AVEUX | C1 8 ; C2 9 ; C3 9 ; C4 6 ; C5 4 ; C6 6 ; C7 6 | 9 | 2 | **Élevé** |

Lecture : la v1.0 résumait A et C en « Moyen » alors que chacun porte au moins un risque à 9. Le classement par
risque ne change pas (B reste le plus risqué), mais A et C ne sont plus sous-estimés. C1 (vallée de l'étrange,
probabilité moyenne, impact très élevé) fait 8 : un seul cran de probabilité de plus le ferait passer à 12. La
recommandation reste ESTRAN parce que son seul risque à 9 (A1) se vérifie par un prototype au jalon M1.

---

## 6. Grille de notation et recommandation

### 6.1 Grille pondérée

Notes de 1 à 5 attribuées par le game director. Elles sont **subjectives** et seront recalculées quand T-002,
T-003 et T-015 seront disponibles.

**Note 60 fps d'AVEUX ramenée de 5 à 4** (retour 2) : la section 1.2 tire de *Hellblade II* la leçon que les gros
plans photoréalistes coûtent cher, et C.6 dit que la peau, les cheveux, les yeux et le rig facial sont le coût
principal (2,0 à 3,0 ms estimés pour deux visages sur PS5, `BUDGETS.md` §14.1.2, non mesuré). La note reste à 4,
et non plus bas, parce que le design plafonne les visages (2 au plus) et les pièces. Elle sera revue par T-003 (S-10).
La note de 4 d'ESTRAN reste conditionnée par la scène du pire cas (6.3, condition 1), estimée à 17,5 ms avant
optimisation pour 14,5 visées. AVEUX passe de 3,70 à **3,50** ; le classement ne change pas.

| Critère (poids) | A. ESTRAN | B. DERNIÈRE POSITION CONNUE | C. AVEUX |
|---|---|---|---|
| Vendabilité et clarté du hook (25 %) | 4 | 4 | 3 |
| Faisabilité pour un studio qui démarre : périmètre, équipe, coût (25 %) | 4 | 2 | 3 |
| Tenue des 60 fps en mode performance, Series S comprise (20 %) | 4 | 2 | **4** |
| Rendement du photoréalisme : qualité visuelle par euro, au service de l'expérience (15 %) | 5 | 5 | 4 |
| Originalité et différenciation (15 %) | 4 | 5 | 4 |
| **Note pondérée** | **4,15** | **3,40** | **3,50** |

**Solidité du classement** :

- B ne passe devant A que si la faisabilité et la tenue des 60 fps pèsent **ensemble moins de la moitié du
  poids de l'originalité** (moins de 7,5 % avec une originalité à 15 %), ce qui contredirait le cahier des
  charges du studio.
- C ne passe jamais devant A par les seuls poids : avec les notes de la v1.1, A est au moins égal à C sur chaque
  critère (la tenue des 60 fps et l'originalité sont à égalité), donc quelle que soit la pondération non négative
  A reste devant ou à égalité.

**Test de sensibilité sur les notes** *(retour 11)*. L'écart de départ est de 0,65 point entre A et C, et de
0,75 point entre A et B. Aucune note seule ne renverse le classement ; il faut plusieurs notes qui bougent dans le
même sens.

| Scénario (notes modifiées) | A | B | C | Classement |
|---|---|---|---|---|
| Base v1.1 | 4,15 | 3,40 | 3,50 | A, C, B |
| T-003 juge l'eau intenable : A 60 fps 4 vers 2 ; C 60 fps 4 vers 5 | 3,75 | 3,40 | 3,70 | A devant C de 0,05 |
| Le scénario précédent et T-015 abaisse la faisabilité d'A de 4 à 3 | 3,50 | 3,40 | 3,70 | **C passe devant A** |
| T-002 et T-015 : A vendabilité 3 et faisabilité 3 ; C vendabilité 4 et faisabilité 4 | 3,65 | 3,40 | 4,00 | **C passe devant A** |
| Tout joue pour B : vendabilité 5, faisabilité 3, 60 fps 3 | 4,15 | 4,10 | 3,50 | A devant B de 0,05 |
| Le scénario précédent et T-003 abaisse le 60 fps d'A de 4 à 3 | 3,95 | 4,10 | 3,50 | **B passe devant A** |

**Quelle tâche peut faire bouger quelle note** : la tenue des 60 fps par **T-003** (S-9 pour A, S-10 pour C, B1
pour B) ; la vendabilité par **T-002 et T-021** (marché, prix de lancement des concurrents directs) ; la
faisabilité par **T-015** (chiffrage des équipes et des durées). L'originalité et le rendement du photoréalisme
relèvent du game director et de l'`art-director`. Le classement dépend surtout du 60 fps d'ESTRAN : c'est la note à
mesurer en premier.

### 6.2 Recommandation : ESTRAN

1. **Le meilleur rendement du photoréalisme.** Le littoral est l'un des milieux les mieux couverts par les
   bibliothèques de scans, et l'horreur est le genre où Lumen produit le plus d'émotion par euro dépensé :
   lumière qui balaie, sable mouillé, brume, eau. Le photoréalisme y sert directement l'expérience (la peur
   naît de ce qu'on voit et de ce qu'on ne voit pas), ce n'est pas une vitrine.
2. **Les 60 fps sont tenables par le design.** Distances de vue courtes, lieux contenus, peu de personnages,
   une seule île : le risque technique est concentré sur un seul sujet (l'eau), que l'on peut prototyper et
   mesurer dès M1.
3. **Un périmètre adapté à un studio qui démarre.** 22 à 33 ETP au pic, 26 à 32 mois, solo, sans combat et
   sans monde ouvert. C'est le projet le moins exposé aux deux grands dérapages classiques : l'animation de
   combat et le contenu de monde ouvert.
4. **Un marché de l'horreur durable pour les AA**, très présent chez les streamers et propice aux démos de
   festival. Ce point reste **à confirmer par T-002**.
5. **Un hook immédiat** : la mer qui monte et efface le chemin se comprend en une seconde, sans texte, dans
   toutes les langues.
6. **Il prépare la suite du studio.** Les pipelines construits pour ESTRAN (environnements scannés, Lumen
   dynamique, eau, petit casting MetaHuman) servent directement à DERNIÈRE POSITION CONNUE, qui deviendrait
   un excellent deuxième projet avec une équipe plus grande et rodée.

### 6.3 Conditions de la recommandation (vérifiables au jalon M1)

1. **Prototype de marée** : une zone en blockout avec les 3 états d'eau et leurs transitions, mesurée à 60 fps
   en mode performance sur PS5 et sur Xbox Series S (ou sur une configuration équivalente validée par le
   `technical-director`), avant l'engagement de la vertical slice. **La scène mesurée est le pire cas** : nuit,
   pleine mer (eau dans tout le champ), faisceau du phare en mouvement et lampe du joueur ensemble, brouillard
   volumétrique, reflets sur l'eau, un ou deux monstres dans le champ (protocole S-9, `BUDGETS.md` §14.1.1 ; estimation
   de départ : 17,5 ms avant optimisation pour 14,5 ms visées, avec six leviers de rendu qui ne touchent aucune
   information de jeu). Les seuls états d'eau, sans cette scène, ne suffisent pas.
2. **Prototype de la Laisse** : en test de jeu, les testeurs comprennent sans tutoriel la règle
   « bruit dans l'eau, lumière du phare » en moins de 10 minutes, et décrivent la rencontre comme effrayante.
3. **Lisibilité de l'obscurité** validée sur une TV à 3 m et sur Steam Deck.

**Plan de repli** : si la condition 1 échoue sur Series S, la marée passe en états discrets déclenchés pendant
des transitions mises en scène, entre chapitres (l'USP est affaiblie mais conservée). Si elle échoue
complètement, je recommande de basculer sur **AVEUX**, le concept dont le risque technique est le plus faible.

### 6.4 Ce qui me ferait changer de recommandation

- **T-002** montre que l'horreur AA est saturée ou se vend mal sur consoles : AVEUX ou B remontent.
- **T-003** juge l'eau dynamique avec Lumen intenable à 60 fps sur Series S, même en états discrets :
  AVEUX devient le premier choix.
- **T-003** juge le pire cas nocturne (A.6) intenable sur Series S même avec tous les leviers de rendu autorisés par
  la règle de parité : c'est le scénario du test de sensibilité (6.1) qui rapproche C d'A.
- **T-015** montre un écart de budget important entre A et C au profit de C : la question se rouvre, car A et C
  sont proches en équipe et en durée. B reste, selon toute vraisemblance, trop coûteux pour un premier projet.

La décision finale revient à la Boss (T-004), qui la soumet à l'humain propriétaire du projet. Le pitch définitif
et les piliers du concept retenu seront rédigés en T-005 (`docs/vision/PITCH.md`, `docs/vision/PILIERS.md`).

---

## 7. Questions ouvertes pour T-002, T-003 et T-015

**Pour `marketing-publishing` (T-002)**

- Performance commerciale des jeux d'horreur AA premium sur PS5 et Xbox, par rapport au PC.
- Prix acceptable pour une horreur de 7 à 9 h, une aventure de 12 à 15 h et un jeu d'enquête de 8 à 10 h.
- Appétit pour une aventure premium non violente (concept B) et pour l'enquête narrative sur consoles (concept C).
- Poids des streamers et des démos de festival pour chacun des trois genres.

**Pour le `technical-director` (T-003)**

- Coût d'une eau à couche unique à hauteur variable combinée à Lumen, à 60 fps sur Series S (concept A).
- **Pire cas nocturne d'ESTRAN** (retour 4) : nuit, pleine mer, faisceau en mouvement et lampe du joueur,
  brouillard volumétrique, reflets sur l'eau ; est-ce que la règle « lampe à ombres complètes, faisceau à ombres
  limitées à son cône » (A.6) tient 60 fps, et à quel coût en rendu ? Estimation actuelle : 17,5 ms pour 14,5 visées.
- Maturité de Nanite pour la végétation dans la version d'UE5 retenue, et coût de la météo dynamique (concept B).
- Coût de 2 MetaHumans au niveau de détail maximal avec cheveux en mèches sur Series S (concept C) ; estimation
  actuelle : 1,4 à 2,0 ms sur Series S, 2,0 à 3,0 ms sur PS5 (`BUDGETS.md` §14.1.2).
- **Pour T-021** : dates, studios et prix de lancement des concurrents directs cités en A.9, B.9 et C.9 (chiffres de
  ventes inclus), non vérifiés dans cette révision.
- Maturité du motion matching et des outils MetaHuman Animator dans la version retenue (concepts B et C).

**Pour `business-affairs` (T-015)**

- Chiffrage des trois concepts à partir des fourchettes d'équipe et de durée des sections A.10, B.10 et C.10.
- Postes de sous-traitance : petit casting (A), capture de traversée et consultant (B), comédiens, capture et
  droits (C).

---

## 8. Originalité et points juridiques

- **Univers, lieux, personnages et organisations sont fictifs** dans les trois concepts. Les jeux comparables
  sont cités comme repères de marché et de design ; nous ne leur empruntons que des principes de genre
  généraux, non protégeables.
- **Pas de lieu réel reconnaissable** : l'île d'ESTRAN, le massif de DERNIÈRE POSITION CONNUE et la ville
  d'AVEUX sont imaginaires. Pas de nom d'organisme de secours réel (B), ni de police réelle (C).
- **Créature d'ESTRAN** : le design de la Laisse doit être original et ne ressembler à aucune créature d'une
  franchise connue (revue par l'`art-director`).
- **Titres provisoires à vérifier en T-005** : ESTRAN, DERNIÈRE POSITION CONNUE / *Last Known*, AVEUX /
  *The Tell* (boutiques en ligne et registres de marques INPI, EUIPO et USPTO, classes 9 et 41).
  Point d'attention : *The Tell* pourrait être jugé proche de *Tell Me Why* (Dontnod, 2020).
- **Licences des assets** : les conditions d'utilisation de Fab / Megascans ont évolué depuis la migration vers
  Fab, et MetaHuman relève du contrat de licence d'Unreal Engine. `business-affairs` doit les vérifier et les
  consigner dans `docs/legal/LICENCES.md` avant toute utilisation.
- **Comédiens (A, B et surtout C)** : contrats de cession des droits à l'image et à la voix, avec un
  consentement explicite pour toute réutilisation numérique, à préparer par `business-affairs` et à faire
  valider par un avocat.

---

## 9. Journal des modifications

### v1.1 du 2026-11-23 (tâche T-023, auteur `game-director`)

Les effectifs et les durées des sections A.10, B.10 et C.10 **n'ont pas été modifiés** (base du chiffrage T-015) ;
leurs totaux (22 à 33, 36 à 53, 23 à 34 ETP ; 26 à 32, 34 à 42, 24 à 30 mois) ont été recalculés et sont corrects.

| Retour de la Boss (T-001) | Modification | Où |
|---|---|---|
| 1. Synthèse des risques | Règle d'agrégation P × I écrite et synthèse recalculée : ESTRAN Élevé, DERNIÈRE POSITION CONNUE Très élevé, AVEUX Élevé (au lieu de Moyen, Élevé, Moyen) | 0, 5 (lignes de risque), 5.1 |
| 2. Note 60 fps d'AVEUX | Note ramenée de 5 à 4, risque 60 fps ramené de Faible à Moyen, estimation de §14.1.2 citée, note pondérée de 3,70 à 3,50 ; classement inchangé | 0, 1.2, C.6, 5, 6.1 |
| 3. Parité de jeu | Règle de parité résumée (renvoi à `ARCHITECTURE.md` §10.1) ; brouillard plus dense sur Series S retiré d'A.6 et d'A.11 ; garde-fous de B.6 et C.6 alignés | 1.5, A.6, A.11, B.6, C.6 |
| 4. Pire cas d'ESTRAN | Pire cas décrit (17,5 ms estimés pour 14,5 visées) ; coexistence lampe et faisceau précisée ; condition 1 de 6.3 reformulée ; question ajoutée pour T-003 | A.6, 6.3, 6.4, 7 |
| 5. Concurrents directs | Concurrents directs séparés des références de design, au moins 2 par concept sortis depuis 2022, avec « ce qui nous en distingue » ; aucun chiffre de ventes ; dates et studios incertains marqués « à vérifier » | A.9, B.9, C.9, 7 |
| 6. Capsule fixe | Capsule principale décrite pour les trois concepts | A.12, B.12, C.12 |
| 7. Prix et contenu | Argument de contenu pour 39,99 € ou de prix inférieur (A et C) ; prix alignés sur la décision 5 de T-001 | A.1, A.8, C.1, C.8, 5 |
| 8. Ordre de sortie | Plateformes reformulées en poids attendu des ventes, avec sortie simultanée | A.8, B.8, C.8 |
| 9. Démo publique | Contenu de la démo de 20 à 30 minutes et ce qu'elle dévoile ou cache ; version courte de la première affaire d'AVEUX ; mitigation de C4 corrigée | A.13, B.13, C.13, C.11 |
| 10. Faits à dater ou corriger | *Hellblade II* daté (sortie mai 2024 à 30 fps, mise à jour à vérifier) ; carton d'ESTRAN corrigé (« Deux fois par jour, la mer revient ») ; équivalent ESRB ajouté | 1.2, A.12, A.1, B.1, C.1, 5 |
| 11. Sensibilité de la grille | Test sur les notes ajouté, avec la tâche qui peut faire bouger chaque note ; test sur les poids revu pour AVEUX | 6.1 |

Retour 12 (licences et IA générative) : traité par la tâche T-024 (`business-affairs`), non par ce document.
- 2026-11-23 · Coordination, sur demande de la Boss (validation T-021, retour 2) : date de *Who's Lila?* corrigée en C.9 (2022 au lieu de 2024), d'après `docs/business/MARCHE_PAR_CONCEPT.md` section 2.
