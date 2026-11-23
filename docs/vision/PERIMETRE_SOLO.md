# Périmètre solo : les trois concepts à l'échelle d'un développeur seul et débutant

> **Tâche** : T-026, étape 1 · **Auteur** : `game-director` · **Date** : 2026-11-23 · **Version** : 1.0
> **Statut** : brouillon remis pour validation de la Boss. Rien ici n'est validé.
> **Lecteurs** : `business-affairs` (étape 2 de T-026 : chiffrage), `boss` (T-004), propriétaire du projet.
> **Source de vérité des contraintes** : `production/DECISIONS.md` (budget nul hors abonnement Claude, propriétaire seul et débutant, PC d'abord). Concepts d'origine : `docs/vision/CONCEPTS.md` v1.1, non modifié.

## Sommaire

0. Synthèse
1. Cadre, hypothèses et façon de lire les estimations
2. Concept A : ESTRAN en version solo
3. Concept B : DERNIÈRE POSITION CONNUE en version solo
4. Concept C : AVEUX en version solo
5. Prérequis matériels (communs)
6. Risques propres au solo débutant (communs) et mitigations
7. Jalons d'apprentissage (communs)
8. Classement de faisabilité solo et recommandation
9. Passage de relais à `business-affairs` (T-026, étape 2)
10. Points à arbitrer

---

## 0. Synthèse

| | **A. ESTRAN** | **B. DERNIÈRE POSITION CONNUE** | **C. AVEUX** |
|---|---|---|---|
| Version solo | « ESTRAN : une marée » | « DERNIÈRE POSITION CONNUE : un col, une nuit » | « AVEUX : une nuit » |
| Durée de jeu | 1 h 30 à 2 h 30 | 1 h 30 à 2 h 30 | 45 à 75 min |
| Lieux | 1 petite île, 4 à 6 intérieurs | 1 petit secteur de montagne, 1 refuge | 1 salle d'interrogatoire, 1 salle d'observation, 1 bureau |
| Photoréalisme à cette échelle | Crédible et même beau (lumière, eau, scans) | Crédible de loin, fragile de près (neige, végétation, personnages) | **Hors de portée** sur son cœur (visages) |
| Humain indispensable | Voix (ou radio filtrée), tests | Voix, tests, animation à acheter ou à cadrer | Comédiens, capture, voix : **tout** |
| Durée estimée, temps partiel | 14 à 24 mois | 18 à 30 mois | 24 à 36 mois ou plus, très incertain |
| Durée estimée, temps plein | 7 à 12 mois | 10 à 16 mois | 12 à 20 mois, très incertain |
| Faisable seul, sans budget | **Oui, avec réserves** | **Oui, mais plus risqué** | **Non en l'état** |

**Recommandation du game director : ESTRAN en version solo** (A), pour trois raisons : la menace peut rester presque invisible (donc pas besoin d'animer une créature crédible), le lieu est petit et se prête aux scans, et la mécanique centrale (la marée) est une donnée simple qu'un débutant peut maîtriser. B est un plan de repli possible mais plus lourd en animation et en optimisation. C n'est pas faisable seul sans acteurs ni capture faciale : sans ses visages, ce n'est plus AVEUX.

**Honnêteté sur le rendu** : le résultat attendu est un petit jeu atmosphérique et soigné, pas un AAA. Il peut être beau dans quelques vues bien choisies. Il ne rivalisera pas avec les jeux cités dans `CONCEPTS.md` §1.2, qui ont des dizaines de personnes.

---

## 1. Cadre, hypothèses et façon de lire les estimations

### 1.1 Contraintes reprises de `production/DECISIONS.md`

- **Budget** : aucun apport hors abonnement Claude. Donc : pas de comédiens payés, pas de studio de capture, pas d'assets payants, pas de sous-traitance. Seules les dépenses indispensables à la vente (frais de publication Steam) sont chiffrées, une par une, par `business-affairs`.
- **Équipe** : une personne, débutante en Unreal Engine et en développement de jeu. Les agents écrivent la conception, le code et des guides pas à pas ; le propriétaire exécute dans Unreal.
- **Plateformes** : PC d'abord (Steam, Steam Deck visé « jouable »). Consoles hors périmètre initial. La règle de parité de `CONCEPTS.md` §1.5 reste valable comme principe de design (la logique ne dépend pas du rendu), sans coût de portage.

### 1.2 Limites des agents IA à garder en tête

- **Les agents ne voient pas l'éditeur Unreal.** Ils ne peuvent pas cliquer, compiler, ni juger un rendu à l'écran. Le propriétaire est leurs yeux et leurs mains : il colle les messages d'erreur, décrit ou capture ce qu'il voit, et les agents corrigent. Cette boucle est plus lente qu'un développeur expérimenté, et c'est la raison principale des durées de la section 7.
- **Les agents peuvent se tromper sur l'API d'Unreal** (versions, noms de nœuds, réglages). Les guides doivent préciser la version du moteur et être testés pas à pas ; toute étape qui échoue est reportée à l'agent avec l'erreur exacte.
- **Les agents ne remplacent pas** une voix humaine, une capture de mouvement, des tests de jeu par d'autres personnes, ni l'œil du propriétaire sur le rendu final.

### 1.3 Estimations

> **Toutes les durées de ce document sont des estimations d'ordre de grandeur du game director, avec une incertitude d'au moins ±50 %** pour un débutant qui apprend en même temps. Ce ne sont pas des engagements. Le temps partiel est compté à 15 à 20 h par semaine, le temps plein à 35 à 40 h. Aucun chiffre de marché n'est donné ici : pour les ventes et la concurrence, voir `docs/business/MARCHE_PAR_CONCEPT.md`.

### 1.4 Assets gratuits ou inclus : règle générale

Sources envisagées : bibliothèques Fab et Megascans, contenus gratuits ou inclus avec Unreal Engine, MetaHuman, exemples de projets d'Epic, sons et musiques sous licence libre. **Pour chacune : licence à vérifier en T-024** (usage commercial, redistribution dans un jeu vendu, conditions propres à Unreal, mentions obligatoires). Tant que T-024 n'a pas validé une source, aucun asset n'est considéré comme utilisable dans une version vendue. Le registre `docs/legal/LICENCES.md` doit être tenu à jour dès le premier asset importé.

L'**IA générative** (images, voix, musique) soulève des questions de licence et de déclaration sur les plateformes : **règles à fixer en T-024** avant tout usage dans le jeu.

---

## 2. Concept A : ESTRAN en version solo

### 2.1 Périmètre réduit

| Dimension | Version complète (`CONCEPTS.md`) | **Version solo** |
|---|---|---|
| Durée | 7 à 9 h (10 à 12 h à 100 %) | **1 h 30 à 2 h 30** |
| Structure | 8 marées sur 4 jours | **4 marées sur 2 jours** (3 à 5 en cas de glissement, jamais plus) |
| Monde | Île de 0,6 à 1 km², une douzaine d'intérieurs | **Île jouable d'environ 0,1 à 0,25 km²** (à fixer au blockout), **4 à 6 intérieurs**, un phare |
| États de marée | 3 de référence, transitions continues | **2 états de référence** (basse, pleine) et une hauteur d'eau continue pilotée par l'horloge de jeu |
| Menace | La Laisse, créature systémique | **La Laisse reste presque invisible** : bruit dans l'eau, traces, remous, silhouette lointaine ou à contre-jour. Pas de gros plan, pas de combat |
| Personnages | 6 à 8 en MetaHuman, souvenirs et photos | **2 à 3 personnages seulement présents par photos, lettres, enregistrements et radio.** Aucun visage animé en gros plan |
| Héroïne | Corps complet visible | **Mains et ombre seulement** (vue subjective) : pas d'animation de corps complet |
| Voix | 1 500 à 2 500 répliques doublées | **Quelques dizaines de répliques**, essentiellement radio VHF et cassettes (voix filtrée, donc plus indulgente) ; l'héroïne parle peu |
| Interface | Diégétique | Inchangée : montre, table des marées, carnet (bon marché à faire, fort rendement) |
| Fins | Une principale et variantes | **Une fin, éventuellement deux** |

**Gardé** : la marée comme horloge, la lumière comme mécanique (faisceau du phare et lampe), l'interface diégétique, le contraste jour / nuit.
**Coupé** : la 2e moitié des marées, la plupart des personnages, le corps complet de l'héroïne, la capture de mouvement, le mode « grande marée » rejouable, le mode photo, les variantes de comportement multiples de la Laisse.
**Remplacé** : les personnages MetaHuman animés par des photos, du texte et du son ; l'animation d'une créature par des effets (Niagara), des matériaux et de l'audio, plus une silhouette peu animée ; le doublage complet par des voix de radio et de cassette.

**Assets gratuits ou inclus (licence à vérifier en T-024)** : scans de littoral, roches, galets, sable, algues et bois de Megascans/Fab ; matériaux de sable et de roche ; épaves et bâtiments modulaires gratuits de Fab ; plugin d'eau fourni avec Unreal (à évaluer) ou plan d'eau simple à hauteur variable ; sons de mer sous licence libre ; MetaSounds pour le mixage.

### 2.2 Ce que devient le photoréalisme

**À portée** : un petit décor extérieur de jour au soleil rasant, avec sable mouillé, reflets et rochers scannés, est le genre de vue où Lumen et Nanite donnent beaucoup avec peu de travail. Brouillard, phare qui balaie, lampe qui éclaire un intérieur noyé : ce sont des effets d'éclairage, pas d'animation, et ils sont bien à la portée d'un débutant guidé. L'horreur aide : l'obscurité et le brouillard cachent la pauvreté d'un asset.

**Hors de portée sans moyens** : des visages animés en gros plan, un corps complet animé de façon crédible, une créature visible en pleine lumière, une simulation d'eau (écoulement, écume dynamique), un vaste décor dense comme dans un jeu de studio.

**Conséquences de design** : on montre peu et on montre de loin ; la lumière fait le travail ; les humains sont des traces (photos, lettres, voix). C'est cohérent avec l'esprit du concept (la mer est l'antagoniste).

### 2.3 Répartition du travail

| Agents IA | Propriétaire (dans Unreal et hors Unreal) |
|---|---|
| Conception : règles de la marée, table des marées, structure des chapitres, énigmes, écriture des lettres, cassettes et dialogues radio | Installer Unreal, créer le projet, suivre les guides pas à pas |
| Code : horloge de marée et hauteur d'eau, perception sonore de la Laisse, logique du faisceau, sauvegarde, interface diégétique (C++ isolé ou Blueprint, voir 10) | Importer les assets, les placer, construire le blockout de l'île, peindre l'éclairage |
| Guides illustrés par étapes, listes de contrôle de la scène, scripts d'import et de nommage | Régler les matériaux et l'éclairage en suivant les guides, juger le rendu, signaler les erreurs |
| Plan de test, budget de performance, registre de licences | **Humain obligatoire** : voix (la sienne, ou celle de proches avec **consentement écrit**), tests de jeu par des tiers, décisions de goût, packaging, page Steam |
| Textes de la page Steam, du trailer (plan, découpage) | Montage du trailer, captures d'écran |

**Tâches qui exigent un humain** : enregistrement des voix, essais de jeu par d'autres personnes (au moins 5 à 10 testeurs avant la sortie), jugement sur la peur et la lisibilité, validation des licences, formalités de vente. **Aucune capture de mouvement ni capture faciale n'est nécessaire** dans cette version.

### 2.4 Durée estimée *(estimation, ±50 %)*

| Rythme | Durée totale | Dont apprentissage initial (avant d'être productif) |
|---|---|---|
| Temps partiel (15 à 20 h / semaine) | **14 à 24 mois** | 3 à 5 mois |
| Temps plein (35 à 40 h / semaine) | **7 à 12 mois** | 2 à 3 mois |

Jalons détaillés en section 7.

### 2.5 Risques propres à cette version

| # | Risque | Mitigation |
|---|---|---|
| A-S1 | Le décor à trois états d'eau double le travail de level design | 2 états seulement ; une seule hauteur d'eau continue ; outil de prévisualisation du niveau d'eau dès le prototype |
| A-S2 | La Laisse ne fait pas peur sans corps visible | Tester **au prototype** (jalon 2) avec bruit, remous et traces seulement ; l'audio porte au moins la moitié de la peur |
| A-S3 | Eau et brouillard coûteux sur une machine modeste | Eau à couche unique ; mesurer tôt sur la machine du propriétaire (section 5) |
| A-S4 | Marché de l'horreur encombré | Voir `docs/business/MARCHE_PAR_CONCEPT.md`, aucun chiffre ici |

---

## 3. Concept B : DERNIÈRE POSITION CONNUE en version solo

### 3.1 Périmètre réduit

| Dimension | Version complète | **Version solo** |
|---|---|---|
| Durée | 12 à 15 h, 14 à 18 missions | **1 h 30 à 2 h 30, 2 à 3 missions courtes** (une seule vraie mission très travaillée est un minimum acceptable) |
| Monde | Vallée de 4 à 6 km² | **Un petit secteur de montagne d'environ 0,5 à 1 km²** jouable, plus un décor lointain non jouable ; un refuge de départ |
| Perspective | 3e personne | **1re personne** : supprime l'animation du corps complet, des mains et de l'équipement suffisent |
| Mécaniques gardées | Pistage, météo, froid, traversée, portage, bilan médical, hélicoptère | **Pistage d'indices, météo changeante (2 à 3 états), froid et énergie très simplifiés, traversée par ancrages prévus** |
| Coupées | Portage et luge, hélicoptère piloté, 4 états saisonniers, arcs narratifs, 20 à 30 personnages | **Portage et luge**, bilan médical à 3 variables, saisons, équipe de secouristes à l'écran |
| Remplacées | Visage des victimes en gros plan, animation de traversée captée | **La victime est trouvée sous masque, capuche, lunettes et givre, de nuit et en demi-lumière, ou seulement entendue** ; la fin de mission se fait à la radio (« hélicoptère en route »), sans évacuation jouable |
| Voix | 4 000 à 6 000 répliques | **Radio : quelques dizaines de répliques** ; la victime parle peu |

**Assets gratuits ou inclus (licence à vérifier en T-024)** : roches, éboulis, neige et glace de Megascans/Fab, kits de végétation et de chalet gratuits de Fab, système de météo et de ciel fournis avec Unreal, sons de vent et de neige sous licence libre.

### 3.2 Ce que devient le photoréalisme

**À portée** : une pente enneigée au soleil rasant ou dans un voile de brouillard, vue de loin, avec des roches scannées et une lumière diffuse, peut être très convaincante. Une tempête réduit la distance de vue, ce qui est avantageux pour la performance.

**Hors de portée sans moyens** : un visage de victime en gros plan crédible, une traversée et un portage animés avec des corps en contact, une forêt dense à 60 fps sur une machine modeste, une neige déformable de qualité avec traces et accumulation, un terrain de plusieurs km² cohérent de près comme de loin.

**Conséquence** : la version solo ne tient pas la promesse émotionnelle du hook original (le visage aux cils givrés qui rouvre les yeux). Il faut une autre émotion (la voix à la radio, l'attente, la traversée seule), à valider par le prototype.

### 3.3 Répartition du travail

| Agents IA | Propriétaire |
|---|---|
| Conception des missions et des indices, règles de météo, logique du froid et de l'énergie, textes et dialogues radio | Sculpter le terrain (Landscape), placer les assets, peindre la neige et la roche |
| Code : pistage, système d'indices, météo pilotée par des données, traversée par ancrages, sauvegarde | Régler le ciel, le brouillard et la neige, juger le rendu, relayer les erreurs |
| Guides pas à pas, budgets de performance, plan de test | **Humain obligatoire** : voix, tests de jeu, optimisation à l'œil sur sa machine, choix des animations gratuites compatibles, packaging |

**Tâches exigeant un humain** : voix de la radio, tests de jeu (la lisibilité de la piste est le risque central), choix et intégration d'animations gratuites ou incluses (licence à vérifier en T-024). **La capture de mouvement est exclue du budget** : on n'anime que ce que des animations fournies permettent.

### 3.4 Durée estimée *(estimation, ±50 %)*

| Rythme | Durée totale |
|---|---|
| Temps partiel | **18 à 30 mois** |
| Temps plein | **10 à 16 mois** |

L'écart avec A vient du terrain (Landscape, World Partition, neige, météo), de la traversée, de l'optimisation et de l'animation.

### 3.5 Risques propres à cette version

| # | Risque | Mitigation |
|---|---|---|
| B-S1 | Terrain et végétation : performances et cohérence visuelle difficiles pour un débutant | Un secteur minuscule ; peu ou pas de forêt ; brouillard et tempête pour limiter la vue |
| B-S2 | Piste d'indices illisible ou frustrante | Prototype papier puis blockout jouable avant tout asset final ; tests de jeu précoces |
| B-S3 | Traversée et mains animées avec des animations génériques : rendu bancal | Vue subjective, interactions limitées à un petit nombre de gestes |
| B-S4 | Perte du hook émotionnel | Valider l'émotion au jalon 2 ; si elle ne prend pas, arrêter ou bascule vers A |

---

## 4. Concept C : AVEUX en version solo

### 4.1 Périmètre réduit

| Dimension | Version complète | **Version solo (la plus petite version qui reste AVEUX)** |
|---|---|---|
| Durée | 8 à 10 h, 6 affaires | **45 à 75 min : une seule affaire** |
| Lieux | Commissariat, 6 à 10 scènes de crime | **Une salle d'interrogatoire, une salle d'observation, un bureau** |
| Personnages | 20 à 25 en gros plan | **2 suspects, 1 collègue (voix seule)** |
| Mécaniques gardées | Interrogatoire, relecture de cassette, couche de signes, procès-verbal | **Les quatre, à petite échelle** |
| Coupées | 5 affaires, scènes de crime, embranchements entre nuits, doublage multilingue | Tout ce qui n'est pas une seule nuit |
| Voix et visages | 6 000 à 9 000 répliques captées, comédiens, capture faciale | **Voir 4.2 : c'est ici que le concept casse** |

**Assets gratuits ou inclus (licence à vérifier en T-024)** : mobilier de bureau et accessoires d'époque de Fab ; MetaHuman pour les personnages de base (conditions d'usage de MetaHuman à confirmer en T-024).

### 4.2 Ce que devient le photoréalisme

C'est le seul concept dont la promesse **est** le visage : « le visage est l'interface ». Or, à cette échelle :

- **Sans comédiens ni capture faciale**, les visages sont animés par des clips de MetaHuman fournis ou par une animation depuis l'audio. Le résultat est correct pour un personnage à distance, mais **en gros plan, zoomé et ralenti** (le geste central de la relecture), les défauts se voient : regard, micro-mouvements, transition entre expressions. C'est la vallée de l'étrange, que le risque C1 de `CONCEPTS.md` classait déjà « très élevé ».
- **Les « signes » du jeu** (regard qui fuit, déglutition, crispation) doivent être lisibles, cohérents et pilotables par le système de stress. Une couche additive est possible dans le principe, mais la régler pour qu'elle paraisse humaine demande un œil d'animateur facial et beaucoup d'essais, ce qui est difficile à guider à distance.
- **Les voix** : 2 suspects crédibles exigent du jeu d'acteur. Une voix synthétique ou la voix du propriétaire jouant plusieurs rôles tuerait la crédibilité d'un jeu où il faut distinguer un mensonge d'un aveu forcé. Les voix synthétiques posent en plus des questions de droit et de déclaration (**règles à fixer en T-024**).
- **Les droits à l'image et à la voix** de tout comédien bénévole exigent un contrat écrit. Ce n'est pas un détail pour un jeu commercial sur un thème sensible (coercition policière, faux aveux).

**À portée** : une salle d'interrogatoire à la lumière dure, un magnétoscope, un post-traitement « cassette », un tableau d'enquête. **Hors de portée** : ce qui fait la valeur du concept.

**Variante éventuelle** (non chiffrée, à étudier si le propriétaire insiste sur C) : interrogatoire par **vidéo granuleuse très dégradée, vue de loin ou par caméra de surveillance**, où les visages ne sont jamais en gros plan. Cela change le jeu (on ne lit plus le visage mais le geste et la voix) et affaiblit l'USP ; à traiter comme un autre concept plutôt que comme une réduction.

### 4.3 Répartition du travail

| Agents IA | Propriétaire |
|---|---|
| Écriture de l'affaire, arbre de dialogue, preuves, contradictions, système de pression et de stress, textes du procès-verbal | Mettre en place MetaHuman, importer les animations, régler l'éclairage |
| Code : dialogues, relecture, couche de signes, procès-verbal, sauvegarde | Évaluer en continu si les visages « tiennent » (jugement humain obligatoire) |
| Guides, plan de test | **Humain obligatoire et bloquant** : comédiens (2 suspects au minimum) et contrats de droits, enregistrement audio, capture faciale si elle est tentée (iPhone ou caméra, selon la méthode MetaHuman Animator : prérequis à vérifier), tests de jeu |

**Tâches exigeant un humain** : toutes les performances. Sans personnes à convaincre de jouer gratuitement et sans budget pour les rémunérer, ce volet est **le facteur bloquant**, indépendamment de la technique.

### 4.4 Durée estimée *(estimation, très incertaine)*

| Rythme | Durée totale |
|---|---|
| Temps partiel | **24 à 36 mois ou plus** |
| Temps plein | **12 à 20 mois** |

La fourchette est large parce que la durée dépend moins du travail que de la disponibilité de comédiens et du nombre d'essais nécessaires pour obtenir des visages crédibles.

### 4.5 Risques propres à cette version

| # | Risque | Mitigation |
|---|---|---|
| C-S1 | Visages non crédibles, donc concept vide | Test de faisabilité de 2 à 4 semaines **avant tout autre travail** : un visage, un dialogue de 1 minute, zoomé. Si ce n'est pas convaincant, arrêter |
| C-S2 | Pas de comédiens sans budget | Aucune mitigation sans financement ; ne pas compter sur des bénévoles pour un jeu vendu |
| C-S3 | Voix synthétiques : droit et réception | Règles à fixer en T-024 avant tout essai public |
| C-S4 | Sujet sensible traité maladroitement par un débutant | Relecture juridique et de sensibilité (hors budget actuel) |

---

## 5. Prérequis matériels (communs)

> **Le propriétaire n'a pas encore indiqué sa configuration** (`production/DECISIONS.md`, questions ouvertes). Les valeurs ci-dessous sont des **ordres de grandeur du game director, issus de ma connaissance générale des exigences d'Unreal Engine 5, non vérifiés à la source**. À confirmer sur la documentation officielle d'Epic quand l'accès réseau sera décidé (T-020), puis par l'essai d'un projet vide.

| Élément | Minimum pour travailler | Confortable pour Lumen et Nanite |
|---|---|---|
| Système | Windows 10 ou 11, 64 bits (Windows fortement conseillé : les guides et les outils supposent Windows) | idem |
| Processeur | 4 à 6 cœurs récents | 8 cœurs ou plus |
| Mémoire vive | 16 Go (compilation et chargement lents, limites de projet) | **32 Go** |
| Carte graphique | Compatible DirectX 12, environ 6 à 8 Go de mémoire vidéo (Lumen logiciel possible, éditeur lent) | Carte récente de milieu ou haut de gamme avec **8 à 12 Go de mémoire vidéo ou plus** (famille RTX de 3060 ou équivalent AMD en repère, à vérifier) |
| Stockage | SSD, 100 Go libres | **SSD NVMe**, 200 Go libres (moteur, assets scannés, compilations de shaders et paquets) |
| Écran | Un écran Full HD | Deux écrans (éditeur et guides côte à côte) |
| Test Steam Deck | Facultatif | Un Steam Deck pour le test réel, **si le propriétaire en possède un**, sinon on s'en tient à un profil de test sur PC faible |

**Conséquences** :
- Sur une machine en deçà du minimum, **A reste le plus réaliste** (lieux courts, vues limitées par la nuit et le brouillard) et **B le plus exposé** (terrain étendu). Il faut alors désactiver Lumen matériel, viser Lumen logiciel et réduire Nanite.
- La première vérification pratique (jalon 0) est : installer Unreal, créer un projet « scène vide avec Lumen », noter les temps de compilation et la fluidité de l'éditeur. Si l'éditeur est inutilisable, le projet doit être repensé (autre moteur ou machine à venir), ce qui est une **décision pour le propriétaire**, pas pour les agents.

---

## 6. Risques propres au solo débutant (communs) et mitigations

| # | Risque | Pourquoi | Mitigation |
|---|---|---|---|
| S1 | **Abandon** (loin le plus fréquent dans les projets solo) | Projet de 1 à 2 ans, sans équipe ni échéance externe, récompenses tardives | Jalons courts avec une chose jouable à chaque fois (section 7) ; un « point de sortie » décidé d'avance à chaque jalon (arrêter ou continuer) ; rythme soutenable plutôt que sprint ; publier de petites avancées (journal de développement) pour créer un engagement envers l'extérieur |
| S2 | **Courbe d'apprentissage d'Unreal** | Éditeur très vaste, Blueprints, matériaux, éclairage, Nanite, World Partition... | Un seul sujet nouveau à la fois ; guides pas à pas par les agents, avec **la version d'Unreal imposée** ; commencer par des tutoriels officiels d'Epic ; garder un projet de bac à sable jetable |
| S3 | **Glissement de périmètre** | « Juste une marée de plus », « juste un personnage », « un meilleur visage » | **Liste « on ne fait pas » figée** par la Boss avant le prototype ; toute addition remplace une autre chose ; gel du périmètre à la vertical slice ; la `producer` tient le registre des demandes |
| S4 | **Dépendance aux guides des agents** et erreurs d'API | Les agents ne voient pas l'éditeur et peuvent se tromper de version ou de nom de nœud | Boucle courte : un guide = une étape testable ; erreur exacte renvoyée ; versions figées ; code C++ limité à quelques modules isolés (voir 10) |
| S5 | **Perfectionnisme visuel** | Le photoréalisme donne envie de tout polir | Règle : « lisible avant d'être beau » ; budget de temps par lieu ; le rendu final se règle **après** que le jeu est amusant ou effrayant |
| S6 | **Pas de tests extérieurs** | Un débutant seul ne voit plus ses propres défauts | Tester sur 5 à 10 personnes au moins une fois avant la sortie, et avec la démo d'un festival Steam si le calendrier le permet (voir `MARCHE_PAR_CONCEPT.md`) |
| S7 | **Budget nul face aux dépenses indispensables** | Frais de publication, éventuellement relecture juridique, musique, comptabilité | Chaque dépense est listée par `business-affairs` et **validée une par une par le propriétaire** (décision du 2026-11-23) |
| S8 | **Licences d'assets et IA générative** | Un asset gratuit n'est pas toujours vendable | Aucun asset hors registre ; T-024 avant le moindre import destiné à la version vendue |
| S9 | **Usure des quotas Claude** | Décision du 2026-11-20 (mode économe) | Guides courts et ciblés, un agent à la fois, ne pas redemander ce qui est déjà documenté |
| S10 | **Machine insuffisante** | Voir section 5 | Jalon 0 sans engagement |

---

## 7. Jalons d'apprentissage (communs)

Chaque jalon a un livrable jouable ou mesurable et une **décision de continuer ou d'arrêter**. Les durées sont des estimations, et valent pour A ; B ajoute environ 30 à 50 % et C est dominé par les performances (4.4).

| Jalon | Contenu | Livrable | Durée estimée, temps partiel / temps plein |
|---|---|---|---|
| **J0 : Machine et premiers pas** | Installer Unreal ; suivre les tutoriels officiels ; projet vide avec Lumen ; vérifier la fluidité | Un niveau vide qui tourne, temps de compilation notés | 2 à 4 semaines / 1 à 2 semaines |
| **J1 : Bac à sable** | Se déplacer en vue subjective, interagir, importer un asset, placer une lumière | Une pièce où l'on marche et où l'on allume une lampe | 1 à 2 mois / 3 à 4 semaines |
| **J2 : Premier prototype jouable** | Le cœur de la mécanique en gris (sans beaux assets) : **A** marée qui monte et menace sonore ; **B** piste d'indices sur terrain simple ; **C** face-à-face avec un visage de test | Un prototype de 5 à 10 minutes qui fait ressentir (ou non) l'intention. **Point de sortie** : si ce n'est pas convaincant, on change de concept ou on arrête | 3 à 5 mois / 6 à 10 semaines |
| **J3 : Vertical slice** | Une vraie zone ou une vraie mission avec assets finaux, éclairage, son, interface | 12 à 15 minutes représentatives du jeu final ; test avec des tiers ; mesure de performance | 8 à 12 mois (A) / 4 à 6 mois (A) |
| **J4 : Contenu complet** | Toutes les marées, ou missions, ou scènes du périmètre gelé | Jeu complet en qualité d'essai | 12 à 20 mois (A) / 6 à 10 mois (A) |
| **J5 : Finition et sortie** | Corrections, tests, optimisation, démo, page Steam, paquet, formalités | Version vendable (sous réserve des validations de la Boss et du propriétaire) | 14 à 24 mois (A) / 7 à 12 mois (A) |

*Les durées de J3 à J5 sont cumulées depuis le début du projet, pour A.*

---

## 8. Classement de faisabilité solo et recommandation

| Rang | Concept | Faisabilité solo | Raison principale |
|---|---|---|---|
| **1** | **A. ESTRAN** | **Faisable, avec réserves** | Le lieu est petit, la menace peut rester presque invisible (l'audio et la lumière portent la peur), pas de visages ni de corps complet, assets littoraux abondants, mécanique centrale simple. Réserve : tenir la peur sans créature visible, et gérer l'eau |
| **2** | **B. DERNIÈRE POSITION CONNUE** | **Faisable, mais nettement plus risqué** | Terrain, météo, neige, optimisation et animation de traversée pèsent beaucoup sur un débutant ; la valeur émotionnelle (le visage) est perdue. Réduit à une vraie mission, c'est un concept possible mais moins vendeur |
| **3** | **C. AVEUX** | **Non faisable seul en l'état** | Sa promesse repose sur des visages crédibles en gros plan, des comédiens et des droits d'image : tout ce que le propriétaire ne peut ni animer seul ni acheter. Réserve : reconsidérable avec un budget ou un partenaire, pas dans le cadre actuel |

**Recommandation du game director : ESTRAN en version solo (A)**, avec J2 comme **point de sortie** : si le prototype de marée et de menace sonore ne fait pas peur, on ne poursuit pas A tel quel. Le plan de repli est B, plus lourd. **Le choix final reste à la Boss (T-004), puis au propriétaire.**

Cette recommandation vaut pour la faisabilité seulement. Elle n'a pas été croisée avec la rentabilité : les ventes et la concurrence relèvent de `docs/business/MARCHE_PAR_CONCEPT.md`, et le chiffrage de T-026 étape 2.

---

## 9. Passage de relais à `business-affairs` (T-026, étape 2)

Valeurs à utiliser comme **entrées** du chiffrage. Ce sont des estimations, à reprendre telles quelles (fourchettes), sans les « arrondir » à la baisse.

| Entrée | A | B | C |
|---|---|---|---|
| Effectif humain | 1 personne (propriétaire) | 1 personne | 1 personne, plus comédiens **hors budget actuel** |
| Durée, temps partiel | 14 à 24 mois | 18 à 30 mois | 24 à 36 mois ou plus |
| Durée, temps plein | 7 à 12 mois | 10 à 16 mois | 12 à 20 mois |
| Sous-traitance | Aucune | Aucune | Comédiens, capture, voix : **non finançable** dans le cadre actuel |
| Assets | Gratuits ou inclus (T-024) | Gratuits ou inclus (T-024) | Gratuits ou inclus (T-024) |
| Durée de jeu (pour le prix de vente) | 1 h 30 à 2 h 30 | 1 h 30 à 2 h 30 | 45 à 75 min |
| Dépenses indispensables à lister | Frais de publication Steam ; éventuellement relecture juridique ; musique libre de droits | idem | idem, plus droits d'image et de voix |
| Coût d'exploitation des agents IA | Abonnement Claude du propriétaire (ligne séparée, voir T-015 réserve 2) | idem | idem |
| Matériel | Dépend de la configuration non communiquée : **ne pas supposer un achat** | idem | idem |

La durée de jeu réduite (1 h 30 à 2 h 30 contre 7 à 9 h) **change le prix de vente plausible** : ne pas reprendre les 29,99 € de `CONCEPTS.md` sans nouvelle étude (T-021 et `MARCHE_PAR_CONCEPT.md`).

---

## 10. Points à arbitrer

1. **C++ ou Blueprint pour un débutant** (`technical-director`, avec la Boss). `CLAUDE.md` demande « C++ en priorité ». Pour un débutant guidé par des agents, je recommande des **Blueprints pour l'essentiel** et du C++ limité à quelques modules isolés et bien testés (horloge de marée, logique de perception). À décider en T-003 ou par une note d'architecture.
2. **Taille exacte de l'île** (A) : à fixer par le blockout au jalon J1 ou J2, pas avant.
3. **Voix** : voix du propriétaire, proches avec contrat de consentement, ou voix synthétiques. Dépend de T-024 (IA générative) et de la préférence du propriétaire.
4. **Configuration du PC du propriétaire** : conditionne tout (section 5). À demander avant T-004.
5. **Point de sortie** : confirmer que J2 (prototype jouable) est le point où l'on décide de continuer ou d'arrêter.
6. **Statut juridique de vente** : question ouverte du propriétaire (`DECISIONS.md`), hors de ce document.
