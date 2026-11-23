# Données de marché par concept et par genre (T-021)

- **Date de la recherche** : 23 novembre 2026. **Auteur** : `marketing-publishing`.
- **Statut** : brouillon soumis à la Boss. Ne remplace ni `ETUDE_MARCHE.md` (v2) ni la note finale de T-004.
- **Légende des étiquettes** : celle de `ETUDE_MARCHE.md` section 0 ([Annoncé], [Analyste], [Presse], [Valve], [Prévision], [Estimation], [Mémoire], non vérifié). Une étiquette **[Estimation]** est un calcul de ma part, avec méthode.

## 0. Méthode et limites (à lire en premier)

1. **Aucune page source n'a été ouverte.** J'ai fait une seule tentative de lecture directe (GamingOnLinux) : le réseau de la session refuse la résolution du domaine (`ENOTFOUND`). Je n'ai pas contourné la restriction et je n'ai pas retenté d'autres sites. **Tout chiffre ci-dessous est lu dans un résumé de recherche web, jamais relu sur la page d'origine.** Pour lire les pages à la source, il faut que le propriétaire autorise les domaines concernés (en premier : `www.gamingonlinux.com`, `steamdb.info`, `store.steampowered.com`, `alineaanalytics.substack.com`).
2. **Multiplicateur Boxleiter** (ventes ≈ avis Steam × multiplicateur) : j'applique **20 à 50**, la fourchette de `ETUDE_MARCHE.md` 5.2, **elle-même étiquetée [Mémoire]** (non vérifiée). Le multiplicateur réel varie selon le prix, le genre et l'époque ; il est souvent plus élevé pour les jeux très bon marché. **Les estimations par avis sont des ordres de grandeur, jamais des ventes.** Elles ne portent que sur Steam.
3. **Biais de survie** : les jeux comparables ci-dessous sont ceux dont on parle. Les jeux échoués sont absents des articles. Les fourchettes de comparables sont donc des fourchettes de **succès**, pas de moyennes.
4. **Les prix des concepts** (A 29,99 €, B 39,99 €, C 24,99 à 29,99 €, `CONCEPTS.md` v1.1) sont des hypothèses en euros. Par la décision 1 de T-019, la fourchette de travail se lit en **USD, prix catalogue Steam, 39,99 à 49,99**. Je n'ai fait aucune conversion.

## 1. Résumé pour `business-affairs` (T-015)

**Fourchettes prudentes de ventes comparables. Ce sont des [Estimation], pas des données** : elles résultent de mon calcul à partir des comparables sourcés en section 3, avec un abattement pour le biais de survie. Bornes basses = environ la moitié du comparable de succès le plus bas ; bornes hautes = zone des comparables de succès hors cas exceptionnels. À utiliser en T-015 comme **hypothèses de sensibilité nommées comme telles** (décision 1 de la Boss en T-019).

| Concept | Comparables de succès (ventes Steam estimées, toutes confiances faibles à moyennes) | Fourchette prudente de travail [Estimation], unités cumulées, toutes plateformes, 12 à 24 mois | Scénario d'échec |
|---|---|---|---|
| **A. ESTRAN** | 155 k à 560 k (Routine, Still Wakes the Deep, Mortuary Assistant, Amnesia: The Bunker) ; Mouthwashing >500 k [Annoncé] ; Dredge >1 M [Annoncé, hors norme, 6 plateformes] | **75 k à 300 k** | Sous 25 k : seuls ≈7 % des jeux d'horreur indépendants de 2024 ont dépassé 500 avis [Analyste], soit ≈10 à 25 k unités avec le multiplicateur 20 à 50 [Estimation] |
| **B. DERNIÈRE POSITION CONNUE** | Cairn >500 k en ≈2 mois [Annoncé] ; Jusant sous les objectifs de l'éditeur, sans chiffre [Presse] ; Echoes of the End ≈27 à 68 k Steam [Estimation, Boxleiter] ; Death Stranding 2 ≈2 à 2,5 M [Analyste, franchise : non transposable] | **30 k à 200 k** (dispersion très large) | Sous 30 k (cas Echoes of the End) |
| **C. AVEUX** | The Operator ≈116 à 424 k Steam [Estimation] ; Who's Lila? ≈50 à 126 k Steam [Estimation] ; Interrogation: You Will Be Deceived ≈6 à 16 k Steam [Estimation] | **25 k à 150 k** | Sous 15 k. Plafond bas : les comparables sont vendus à 13,99 à 25 $ ; **le prix de travail de C (24,99 €) est au-dessus de ce que le genre a prouvé** |

Ces fourchettes incluent les consoles **sans donnée propre** (les comparables sont mesurés surtout sur Steam). Repères de répartition : pour Mafia: The Old Country, 48 % des premières ventes étaient sur PS5 et ≈33 % sur Steam [Analyste, ETUDE_MARCHE 5.1] ; pour Dredge, plus de 60 % sur PC [Annoncé]. Pas de ventilation trouvée pour les autres.

## 2. Vérification des concurrents cités de mémoire dans `CONCEPTS.md`

| Jeu cité | Résultat de la vérification | Écart avec `CONCEPTS.md` | Source / confiance |
|---|---|---|---|
| *Dredge* | Black Salt Games (Nouvelle-Zélande), éditeur Team17, **30 mars 2023**, PC, PS4, PS5, Xbox One, Xbox Series, Switch. Plus de 1 M d'unités en oct. 2023 ; plus de 100 000 en 24 h ; plus de 60 % PC | Aucun | [Annoncé, via Game Developer et 80.lv] ; confiance bonne |
| *The Operator* | **Bureau 81**, **22 juillet 2024**, Steam et GOG ; un listing tiers (Discord) donne un autre nom de développeur. Plateformes consoles : non trouvées | Studio confirmé (Bureau 81), à une réserve près | [Presse, communiqué relayé par Game Developer] ; confiance moyenne |
| *Who's Lila?* | **Garage Heathen**, sortie Steam le **23 février 2022** (et non 2024). Ne pas confondre avec *Leila* (Ubik Studios, autre jeu) | **Date à corriger : 2022** | [Presse / bases de données : Steam, SteamDB, IsThereAnyDeal via recherche] ; confiance bonne |
| *Interrogation: You Will Be Deceived* | **Critique Gaming**, PC/Mac/Linux **5 décembre 2019**, Switch **28 juillet 2020** | **Sortie avant 2022** : hors du critère « depuis 2022 » ; garder comme référence ancienne seulement | [Presse : NicheGamer, Worthplaying, Nintendo Life] ; confiance bonne |
| *Death Stranding 2: On the Beach* | PS5 **26 juin 2025**, PC **19 mars 2026**, 69,99 $ édition standard. Studio Kojima Productions [Mémoire : non rappelé par les résultats] | Date confirmée ; **le jeu est sorti sur PS5 puis PC, pas sur Xbox** (une source parle d'un espoir de sortie Xbox : non vérifié) | [Presse : Gematsu, Insider Gaming, Dekudeals] ; confiance bonne |
| Simulateurs de secours en montagne | Titres identifiés : *Mountain Rescue Simulator* (Steam, sortie 2019 selon la page Steam, 2014 selon GamePressure pour la version allemande ; avis « Mostly Negative », 10 avis) ; *Helicopter Simulator VR 2021 - Rescue Missions* (VR seulement, « Very Positive », 158 avis) ; *Everest Search and Rescue* (Himalaya, non sorti d'après la page Steam). Un jeu d'arcade d'hélicoptère de sauvetage est annoncé pour le T3 2026 : titre non renvoyé. **Studios : non vérifié** pour tous | Titres à identifier : fait, studios non vérifiés | [Presse / pages Steam via recherche] ; confiance faible. **Conclusion : le segment « sauvetage en montagne » est occupé par des simulations marginales, pas par un concurrent AA** |
| *Hellblade II* sur PS5 | PS5 le **12 août 2025** avec la mise à jour « Enhanced ». Mode performance **60 fps** sur PS5 et PS5 Pro ; absent sur Series S. Base PS5 : résolution dynamique moyenne ≈1080p en performance, reconstruction depuis 1440p en qualité (30 fps) ; PS5 Pro ≈1166 à 1200p en performance | Aucun chiffre dans `CONCEPTS.md` à contredire ; donnée utile pour T-003 | [Presse : relais d'un forum reprenant l'analyse Digital Foundry, PSU, Gematsu, TechRadar] ; **confiance moyenne : l'analyse DF n'a pas été lue à la source** |

**Pistes complémentaires de la Boss**

- ***The Alters*** (11 bit studios) : sortie 13 juin 2025 sur PC, PS5 et Xbox, **Game Pass day-one**. 280 000 exemplaires en ≈1 mois et plus de 1 M de wishlists [Annoncé, juillet 2025] ; **656 000 au 30 juin 2026 hors abonnés Game Pass** et ≈48,56 M PLN (≈13 M$) de revenu, d'après un seul relais du rapport semestriel ; un autre article cite 545 000 sans date [Presse] : **chiffres contradictoires, confiance faible**. Prix de lancement : non vérifié. Lecture : un AA narratif à idée forte, avec 1 M de wishlists, a vendu de l'ordre de 0,3 à 0,7 M en un an hors abonnement. Utile comme borne pour B.
- ***Echoes of the End*** (Myrkur Games, Islande, premier jeu du studio) : sortie **12 août 2025**, PC, PS5, Xbox Series ; **39,99 $ / 39,99 € / 32,99 £** [Presse, GamesPress, GamingBolt]. OpenCritic 68 ; Steam « Mixed » au lancement, puis « Mostly Positive » (1 355 avis, instantané non daté) ; pic de 558 joueurs simultanés au lancement [Analyste, SteamDB]. Aucune vente publiée. Estimation Boxleiter : 1 355 × 20 à 50 ≈ **27 à 68 k** Steam [Estimation]. **C'est le comparable le plus proche du concept B pour le prix (39,99) et l'angle (aventure AA à la troisième personne) : résultat faible.**
- ***Still Wakes the Deep*** : **aucune déclaration officielle de The Chinese Room ou de l'éditeur sur les ventes trouvée.** Estimations tierces : 200 à 500 k (SteamSpy, propriétaires, inclut les jeux offerts) ; ≈558 k et ≈13,6 M$ brut (GameRevenueData, méthode Boxleiter) [Analyste, confiance faible à moyenne]. 10 588 avis Steam, 88 % positifs ; Game Pass day-one ; **Steam seulement, hors Game Pass et consoles**.

## 3. Jeux comparables par concept (sortis depuis 2022)

Colonnes : ventes = dernier chiffre trouvé et son étiquette ; note = presse ou Steam, avec l'instantané ; prix = prix de lancement quand trouvé ; abonnement = présence day-one sur Game Pass ou PS Plus. « nv » = non vérifié.

### 3.A ESTRAN (horreur subjective sans combat, île et marée)

| Jeu (studio, sortie, plateformes) | Ventes | Note | Prix lancement | Abonnement |
|---|---|---|---|---|
| **Dredge** (Black Salt / Team17, 30 mars 2023 ; PC, PS4/5, Xbox One/Series, Switch) | >1 M en oct. 2023, >60 % PC [Annoncé] ; objectif initial 100 k la première année | nv (aucune note trouvée) | nv | nv |
| **Still Wakes the Deep** (The Chinese Room, 18 juin 2024 ; PC, PS5, Xbox) | 200 à 560 k Steam [Analyste, tiers, voir section 2] ; aucun chiffre officiel | Metacritic 73 à 77 selon l'instantané [Presse] ; Steam 88 % sur 10 588 avis | 34,99 $ (agrégateur tiers, nv) | **Game Pass day-one** [Presse] |
| **Amnesia: The Bunker** (Frictional Games, 6 juin 2023) | 200 à 500 k « propriétaires » Steam (SteamSpy, inclut offerts) [Analyste, faible] ; la série dépasse 5 M d'unités (sept. 2025, un relais russe, nv) | nv | nv (le 4,99 $ relevé par SteamSpy est probablement un instantané de promotion, non daté : à ne pas utiliser) | nv |
| **Routine** (Lunar Software / Raw Fury, 4-5 déc. 2025 ; PC, Xbox One, Xbox Series) | 155 à 310 k Steam [Estimation tierce, SteamPageAnalyzer] | Metacritic 79 [Presse] ; 90 % positifs au lancement Steam [Presse, 3DNews] | 2 800 yens sur Steam ; prix USD : nv | nv |
| **Mouthwashing** (Wrong Organ / Critical Reflex, 26 sept. 2024 ; PC, puis PS5, Xbox, Switch annoncés pour 2025) | >300 k en déc. 2024, **>500 k en fév. 2025** [Annoncé] ; ≈24 000 avis Steam en fév. 2025 | nv | ≈13 $ (titre d'article GamesRadar, nv) | nv |
| **The Mortuary Assistant** (DarkStone Digital / DreadXP, 2022 [Mémoire]) | ≈210 à 277 k Steam, 3,2 à 4,9 M$ brut [Analyste, Raijin et SteamData.ai] ; 216 à 432 k (SteamPageAnalyzer) | nv | **24,99 $** [Presse, communiqué] | nv |

**Lecture pour A** : le genre produit des succès à 150 à 550 k sur Steam avec un prix de 13 à 35 $, **sous la fourchette de travail de 39,99 à 49,99 $**. Aucun comparable n'a prouvé qu'une horreur courte sans combat se vend 40 $.

### 3.B DERNIÈRE POSITION CONNUE (sauvetage en montagne, troisième personne)

| Jeu (studio, sortie, plateformes) | Ventes | Note | Prix lancement | Abonnement |
|---|---|---|---|---|
| **Jusant** (Don't Nod, 31 oct. 2023 ; PC, PS5, Xbox Series) | **Aucun chiffre**. Don't Nod a supprimé des postes en 2024-2025 après des ventes sous les objectifs de *Jusant* et *Banishers* [Presse, via Gagadget citant Game Rant, de seconde main] ; pic Steam 329 joueurs simultanés | Metacritic 82 à 85 selon la plateforme [Presse] | nv (24,99 $ en fév. 2025 sur un agrégateur tiers : instantané, pas un prix de lancement) | **Game Pass day-one** [Presse] |
| **Cairn** (The Game Bakers, 29 janv. 2026 ; PC, PS5) | 100 k le jour de sortie, 200 k en 3 jours, 300 k, **>500 k en ≈2 mois** [Annoncé, via PC Gamer, PSU, TechRaptor] | Metacritic PC 86 (39 critiques), PS5 83 (37) ; Steam 94 % sur 17 239 avis [Presse] | ≈29,99 $ (déduit d'une promo à 26,99 $ à −10 % : **nv**) | nv |
| **Echoes of the End** (Myrkur, 12 août 2025 ; PC, PS5, Xbox) | ≈27 à 68 k Steam [Estimation, Boxleiter, 1 355 avis] | OpenCritic 68 [Presse] | 39,99 $ [Presse] | nv |
| **Death Stranding 2** (Kojima Productions, PS5 26 juin 2025 ; PC 19 mars 2026) | ≈2 M fin mars 2026 (≈1,6 M PS5 + 425 k Steam, ≈142,6 M$) [Analyste, Alinea] ; 2,5 M et ≈170 M$ dans un relais de date incertaine [Analyste, faible]. 1,4 M à fin juin 2025 [Analyste, Ampere] | Metacritic ≈89-90 [Presse] | 69,99 $ [Presse] | nv (PS Plus : nv) |
| **Peak** (Landfall / Aggro Crab, juin 2025 ; PC) | >5 M en 26 jours [Annoncé] ; ≈10 M en 8 semaines [Analyste, Alinea] | nv | **≈8 $** (7,99 $ selon un relais, sources divergentes) | nv |

**Lecture pour B** : l'intérêt du public pour l'escalade existe (Cairn, Peak), mais ces deux jeux sont à bas prix, petits en périmètre, et **Peak est un jeu coopératif de jam sans rapport de périmètre avec B : à ne pas utiliser pour calibrer**. Les deux AA les plus proches par le prix et la production (*Jusant*, *Echoes of the End*) ont déçu. *Death Stranding 2* est une franchise de plateforme exclusive : non transposable.

### 3.C AVEUX (thriller d'interrogatoire, visages)

| Jeu (studio, sortie, plateformes) | Ventes | Note | Prix lancement | Abonnement |
|---|---|---|---|---|
| **The Operator** (Bureau 81, 22 juil. 2024 ; Steam, GOG) | ≈116 à 424 k Steam [Estimation, 5 780 à 8 473 avis × 20 à 50] ≈ 1,6 à 5,9 M$ brut au prix de 13,99 $, **borne haute (promotions ignorées)** | Metacritic 78, OpenCritic 77 [Presse] ; Steam « Very Positive » | 13,99 $ (prix de liste actuel, Dekudeals : prix de lancement nv) | nv ; consoles : nv |
| **Who's Lila?** (Garage Heathen, 23 fév. 2022 ; PC) | ≈50 à 126 k Steam [Estimation, 2 515 avis × 20 à 50] | Steam 95 % positifs, « Overwhelmingly Positive » [Presse] ; 15 fins | nv | nv |
| **Immortality** (Half Mermaid / Sam Barlow, 30 août 2022 ; Xbox Series, PC) | **Aucun chiffre trouvé** | PC Gamer 95, IGN 8/10, Pure Xbox 10/10 [Presse] ; Metacritic nv | ≈16,74 £ (un article britannique, nv) | **Game Pass day-one** [Presse] |
| **Interrogation: You Will Be Deceived** (Critique Gaming, déc. 2019 ; **hors période**) | ≈6 à 16 k Steam [Estimation, 319 avis] | Steam « Mostly Positive » | nv | nv |
| 5e comparable | **Non identifié** : la recherche n'a renvoyé que *Suspicious Minds* (interrogatoire par la voix, année de sortie nv) et *Interrogator 2* (non sorti, prévu en 2026) | | | |

**Critère d'acceptation 2 pour C : rempli en partie.** Seuls 3 comparables sortis depuis 2022 ont des données (The Operator, Who's Lila?, Immortality) ; *Interrogation* est de 2019 et le 5e n'a pas été identifié.

**Lecture pour C** : le genre prouve un public fidèle et de très bonnes notes, mais **à 14 à 25 $ et avec des jeux courts (The Operator : 3,5 h d'après Dekudeals)**. Le prix et la durée de C (24,99 à 29,99 €, 8 à 10 h) restent à justifier.

## 4. Chiffres de marché par genre sur Steam (2024 à 2026)

### 4.1 Nombre de jeux sortis sur Steam par an

| Année | Tous genres | Confiance | Source |
|---|---|---|---|
| 2024 | **18 558** | Moyenne ; chiffre du 12/2025, probablement révisé à la hausse depuis (voir 2025) | [Analyste] SteamDB, relayé par GamingOnLinux, déc. 2025 |
| 2025 | **21 185** (autres relevés : 21 344, 21 382, 21 489). Le même média donnait 19 008 en déc. 2025 : la base a été révisée de ≈+11 % | Moyenne | [Analyste] SteamDB via GamingOnLinux, 18 nov. 2026 ; recoupement par 3DNews |
| 2026 (au 18 nov.) | **27 286**, année **incomplète**, déjà au-dessus du total 2025 depuis le 16 oct. ; record de 720 sorties sur la semaine du 24 au 30 août 2026 ; ≈12 000 au S1 (+19 %) selon Sensor Tower | Moyenne | [Analyste] GamingOnLinux, 3DNews, Inven Global |

### 4.2 Genre du concept A : horreur

| Année | Sorties étiquetées horreur | Confiance | Source |
|---|---|---|---|
| 2023 | 1 609 | Faible (non relu) | [Analyste] SteamDB (tags), via Automaton (japonais), nov. 2025 |
| 2024 | 2 586 (+61 %) ; **une autre méthode donne ≈1 077** ; 778 jeux d'horreur indépendants dont 56 (7,2 %) ont dépassé 500 avis | Faible : deux méthodes divergentes d'un facteur 2,4 | Automaton ; billet HowToMarketAGame (URL exacte non confirmée) ; WN Hub |
| 2025 | 3 016 ; « survival horror » : 1 106 (882 en 2024) | Faible | Automaton ; recherche web, source du détail non identifiée |
| 2026 | **≥ ≈3 300** [Estimation] = « plus de 12 % des sorties » × 27 286 : **deux sources de périodes différentes, à ne pas citer comme une donnée** | Très faible | WN Hub ; GamingOnLinux |

- **Part du revenu** : en 2026, l'horreur fait plus de 12 % des sorties mais près de 15 % des jeux au-dessus d'1 M$ de revenu [Analyste, WN Hub, 2026] : **le genre sur-performe légèrement**. Parmi les jeux d'horreur indépendants à succès, 59 % ont gagné au moins 200 000 $ de brut et **2 % seulement ont dépassé 1 M$** [Analyste, WN Hub, périmètre et année nv].
- **Ventes ou revenus des titres dominants** : *Resident Evil Requiem* ≈194,5 M$ brut Steam au S1 2026 [Analyste, Alinea, via ETUDE_MARCHE 2.2] ; *Silent Hill 2 Remake* 6 M d'unités au 24 avr. 2026 et *Silent Hill f* 2 M [Annoncé, ETUDE_MARCHE 5.1] ; *Dredge* >1 M ; *Mouthwashing* >500 k ; *Still Wakes the Deep* ≈558 k et ≈13,6 M$ brut [Analyste, tiers]. **Les dominants sont des franchises ; les nouvelles IP à succès sont à 0,2 à 1 M.**
- **Part des nouvelles IP** : **non vérifié** (aucune source trouvée qui sépare nouvelles IP, suites et licences). Sur mon échantillon de 6 comparables A, **5 sont des nouvelles IP** (Dredge, SWtD, Routine, Mouthwashing, Mortuary Assistant) et 1 est une suite de franchise (Amnesia: The Bunker) [Estimation sur échantillon biaisé par le succès : **ne pas extrapoler au marché**].

### 4.3 Genre du concept B : aventure de sauvetage en montagne, non violente

- Nombre de sorties par an pour « aventure » / « escalade » / « sauvetage » : **non vérifié** (la recherche n'a pas renvoyé de décompte par tag ; il faudrait SteamDB ou Video Game Insights).
- **Dominants** : *Death Stranding 2* ≈110 M$ PS5 + ≈32,6 M$ Steam [Analyste, Alinea, via recherche] ; *Cairn* >500 k ; *Peak* >5 M (outlier). Les simulateurs de sauvetage identifiés sont marginaux (10 et 158 avis).
- **Part des nouvelles IP** : non vérifié. Échantillon B : **4 nouvelles IP sur 5** (Jusant, Cairn, Echoes of the End, Peak) ; *Death Stranding 2* est la seule suite [Estimation sur échantillon biaisé par le succès].

### 4.4 Genre du concept C : thriller d'interrogatoire / enquête par le visage

- Nombre de sorties par an : **non vérifié** (genre trop étroit pour un tag Steam ; aucun décompte trouvé).
- **Dominants** : *The Operator* ≈116 à 424 k (estimation) ; *Who's Lila?* ≈50 à 126 k ; *Immortality* : sans chiffre. **Aucun titre du genre n'a un chiffre de ventes officiel.**
- **Part des nouvelles IP** : non vérifié. Échantillon C : 4 nouvelles IP sur 4 comparables avec données (Operator, Who's Lila, Immortality, Interrogation) [Estimation sur échantillon].

### 4.5 Contexte commun

- 21 % des revenus Steam du S1 2026 viennent des jeux de 2026 [Analyste, Alinea, ETUDE_MARCHE 2.2] ; moins de 300 jeux sur ≈20 000 devraient dépasser 1 M$ brut en 2025 [Analyste, un bilan d'analyse, non relu]. **Pour un jeu neuf, le principal adversaire est la quantité de sorties (+27 286 en 2026) et le catalogue.**

## 5. Bases installées et Steam Deck

| Plateforme | Chiffre | Étiquette, confiance, source |
|---|---|---|
| **PS5** | **97,9 M** d'unités livrées au 30 sept. 2026 (2,6 M sur le trimestre) ; 95,3 M au 30 juin 2026 ; 93,7 M au 31 mars 2026 | [Annoncé, résultats Sony, via GamingBolt, Thurrott, Push Square, Gematsu]. Le chiffre de sept. 2026 n'a **qu'un seul relais** : confiance moyenne. **Expéditions (sell-in), pas des ventes aux joueurs** ; le trimestre de juin est donné à 1,3 ou 1,6 M selon les médias |
| **Xbox Series X\|S** | **Aucun chiffre officiel** (Microsoft ne publie pas). Estimations : ≈35 à 37 M vendus (analyste J. Welfare, ventes « bloquées » depuis mars 2025) ; base **active** ≈42 M fin 2025 (Omdia) ; 48 à 50 M (Generación Xbox, présenté par moi comme aberrant) ; livraisons prévues 2,5 M en 2026, 3,2 M en 2025 (S&P Kagan) | [Analyste], confiance faible, sources qui divergent ; **ne pas additionner** « vendus » et « actifs » |
| **Steam Deck** | **Part de tous les utilisateurs Steam : non vérifié** (aucune source directe). Repère : le Deck LCD (12,26 %) et OLED (11,92 %) font ≈24 % des utilisateurs Linux de l'enquête de janv. 2026 ; Linux vaut ≈3 à 4 % (3,05 % en sept. 2026, 3,99 % en mai 2026) | [Valve, enquête matériel, via GamingOnLinux et SteamDeckHQ]. **Mon calcul [Estimation] : ≈0,7 à 1 % des participants à l'enquête**, enquête volontaire et peu transparente, donc ordre de grandeur seulement. Le Deck est classé « Linux » par l'enquête |

Implication pour `ETUDE_MARCHE.md` 2.3/2.4 (à reporter par la Coordination, je ne modifie pas ce fichier) : les lignes « PS5 : non vérifié » et « Steam Deck : non vérifié » peuvent être remplacées par ces valeurs, avec leurs réserves.

## 6. Notes proposées sur la grille marché (section 10 de `ETUDE_MARCHE.md`)

Échelle 0 à 3. **Ce sont des propositions argumentées ; la note finale reste celle de la Boss en T-004.** Contribution = poids × note / 3.

| Critère (poids) | A. ESTRAN | B. DERNIÈRE POSITION CONNUE | C. AVEUX |
|---|---|---|---|
| **1. Hook en une phrase, sur une capsule (15)** | **2** | **2** | **3** |
| **3. Genre porteur et non saturé (10)** | **1** | **2** | **1** |
| **6. Prix soutenable, 39,99 à 49,99 $ (8)** | **1** | **2** | **1** |
| **9. Rejouabilité / bouche-à-oreille (10)** | **2** | **2** | **2** |
| **Sous-total sur ces 4 critères (max 43)** | **22,7** | **28,7** | **27,7** |

**Arguments**

- **Critère 1.**
  - *A (2)* : l'île coupée par la marée se comprend en une phrase et se montre en 10 secondes sur une capsule. Deux risques : l'étiquette « walking sim » (risque A3 de `CONCEPTS.md`), et la proximité visuelle avec *Still Wakes the Deep* et *Dredge*.
  - *B (2)* : « Quatre heures de jour, ramenez-les vivants » est un bon hook de trailer, mais la capsule doit lever trois confusions : simulateur de secours (segment aux notes médiocres), *Jusant* (alpinisme stylisé), *Death Stranding* (portage).
  - *C (3)* : un visage photoréaliste en gros plan est la meilleure capsule des trois et se comprend en 3 secondes. Réserve : *Who's Lila?* et *The Operator* occupent déjà l'idée du « visage comme interface » ; l'unicité (capture de vrais comédiens, 1999, garde à vue) doit se voir sur la capsule.
- **Critère 3.**
  - *A (1)* : genre à forte demande (l'horreur est ≈12 % des sorties et ≈15 % des jeux à plus d'1 M$ en 2026) **mais très saturé** : 2 586 à 3 016 sorties étiquetées horreur par an (2024-2025), 7 % seulement des jeux d'horreur indépendants dépassent 500 avis. La demande existe, la visibilité d'un nouveau venu est faible.
  - *B (2)* : peu de concurrents sérieux (les simulateurs de sauvetage sont marginaux), et l'intérêt pour la montagne est prouvé (*Cairn*, *Peak*). Mais les deux AA comparables (*Jusant*, *Echoes of the End*) ont déçu et le décompte du genre est non vérifié : pas 3.
  - *C (1)* : genre non saturé mais **de niche**, plafond observé ≈100 à 400 k sur Steam, très bonnes notes. Porteur : peu prouvé.
- **Critère 6.**
  - *A (1)* : 7 à 9 h pour 29,99 € (variante 39,99 €). Les comparables à succès se vendent 13 à 35 $ ; aucun n'a prouvé un prix de 40 $. En dessous de la fourchette de travail.
  - *B (2)* : 12 à 15 h justifient 39,99 ; *Echoes of the End* à 39,99 $ a pourtant mal vendu (réception et notes plus faibles que celles que viserait B) : le prix tient si la qualité suit, pas autrement.
  - *C (1)* : 24,99 à 29,99 €, sous la fourchette ; les comparables sont à 14 à 25 $ ; le concept C se vend sous le prix de travail et n'a pas de preuve qu'un prix supérieur soit accepté. Passerait à 0 si la Boss exige que le prix tienne dans la fourchette de 39,99 à 49,99.
- **Critère 9.**
  - *A (2)* : l'horreur se streame et se partage (*Mouthwashing* : ≈24 000 avis ; *Routine* : « surprise hit ») ; la rejouabilité est faible (jeu de 7 à 9 h).
  - *B (2)* : l'émotion et le vertige se partagent (*Cairn* : 94 % de positifs sur 17 239 avis) ; pas de rejouabilité.
  - *C (2)* : le déduction-en-direct se prête au streaming et *Who's Lila?* offre 15 fins ; mais `CONCEPTS.md` C.8 note lui-même une rejouabilité faible (C7). Pas de donnée de streaming trouvée.

**Aucune note éliminatoire** (critères 4, 5, 11) n'est traitée ici : hors périmètre de T-021.

## 7. Données manquantes (« non vérifié ») et ce qu'il faudrait pour les lever

1. Relecture à la source de tous les chiffres de ce document : domaines à autoriser (voir section 0). C'est la suite logique de T-020.
2. Décompte annuel par tag Steam (horreur, aventure, enquête, escalade) sur 2024 à 2026 : SteamDB ou Video Game Insights.
3. Part de nouvelles IP par genre : aucune source ; calcul possible à partir d'une liste de jeux étiquetés, avec accès aux données.
4. Ventes officielles de *Still Wakes the Deep*, *Jusant*, *Immortality*, *Echoes of the End*, *Who's Lila?*, *The Operator* : aucune trouvée.
5. Prix de lancement de la plupart des comparables (Dredge, Amnesia: The Bunker, Jusant, Cairn, Who's Lila?, The Alters, The Operator) : non trouvés ou instantanés tiers.
6. Studios des simulateurs de secours en montagne.
7. Part du Steam Deck dans tous les utilisateurs Steam ; base installée Xbox Series officielle (n'existe pas).
8. Présence sur abonnement pour *Dredge*, *Amnesia: The Bunker*, *Routine*, *Cairn*, *The Operator* et *Echoes of the End* : non vérifiée.

## 8. Sources et dates de consultation (recherche web du 23 novembre 2026, résumés de recherche, pages non ouvertes)

- Dredge : https://gamedeveloper.com/business/dredge-smashes-internal-expectations-after-topping-1-million-sales ; https://80.lv/articles/an-indie-game-dredge-has-sold-over-1-million-copies/ ; https://gamingbolt.com/dredge-crosses-1-million-units-sold-smashes-internal-expectations/amp
- The Operator : https://store.steampowered.com/app/1771980/The_Operator/ ; https://gamedeveloper.com/press-release/intense-conspiracy-puzzler-the-operator-launches-on-steam-july-22nd ; https://www.dekudeals.com/items/the-operator ; https://pcgamer.com/games/adventure/in-this-investigation-game-youre-the-desk-jockey-with-all-the-cool-analysis-software
- Who's Lila? : https://store.steampowered.com/app/1697700 ; https://steamdb.info/app/1697700 ; https://isthereanydeal.com/game/whos-lila/info/
- Interrogation: You Will Be Deceived : https://kotaku.com/games/interrogation-you-will-be-deceived ; https://nichegamer.com/noir-thriller-interrogation-you-will-be-deceived-launches-december-5 ; https://store.steampowered.com/app/1016770/Interrogation/
- Death Stranding 2 : https://www.gematsu.com/2025/03/death-stranding-2-on-the-beach-launches-june-26 ; https://www.pcgamer.com/gaming-industry/death-stranding-2s-pc-port-pushed-it-past-2-million-copies-sold ; https://gamingbolt.com/death-stranding-2-on-the-beach-sold-1-4-million-copies-in-june-says-analyst-firm ; https://games.gg/news/death-stranding-2-sells-25-million/ ; https://insider-gaming.com/death-stranding-2-on-the-beach-release-date-platforms-editions-price/
- Jusant : https://godisageek.com/2023/10/jusant-is-out-now-for-pc-ps5-and-xbox-series-sx/ ; https://gagadget.com/en/707196-dont-nods-aphelion-lands-on-game-pass-with-mixed-reviews/
- Cairn : https://www.pcgamer.com/games/action/cairn-developers-couldnt-be-happier-as-they-celebrate-200-000-copies-sold-we-hope-you-feel-the-passion-we-baked-into-the-mountain ; https://opencritic.com/news/28786/cairn-sales-climb-to-500k-just-two-months-after-launch-techraptor ; https://www.notebookcheck.net/Cairn-steam-launch.1217675.0.html ; https://legacy.prod.metacritic.com/game/pc/cairn/critic-reviews
- Simulateurs de secours : https://store.steampowered.com/app/1087910 ; https://gamepressure.com/games/mountain-rescue-simulator/z23c39 ; https://store.steampowered.com/app/1324760
- Hellblade II PS5 : https://www.psu.com/news/senuas-saga-hellblade-2-ps5-release-date-set-for-august-12-includes-60-fps-performance-mode/ ; https://www.gematsu.com/2025/06/senuas-saga-hellblade-ii-for-ps5-launches-august-12-alongside-enhanced-update ; https://www.techradar.com/gaming/senuas-saga-hellblade-2-enhanced-review ; https://www.neogaf.com/threads/digital-foundry-senuas-saga-hellblade-2-enhanced-df-review-ps5-ps5-pro-xbox-series-x-steam-deck.1687184/ (relais de l'analyse Digital Foundry, non lue à la source)
- Still Wakes the Deep : https://gamerevenuedata.pages.dev/games/still-wakes-the-deep ; https://www.steamspy.com/dev/The+Chinese+Room ; https://steamdb.info/app/1622910
- Amnesia: The Bunker : https://steamspy.com/dev/Frictional+Games ; https://stopgame.ru/newsdata/68818/tirazh_serii_amnesia_prevysil_5_millionov_kopiy
- Routine : https://www.steampageanalyzer.com/games/606160 ; https://gamebiz.jp/news/417119 ; https://3dnews.ru/1133454/neveroyatno-atmosfernoe-priklyuchenie-horrordolgostroy-routine-startoval-v-steam-s-reytingom-90-/amp
- Mouthwashing : https://gamedeveloper.com/business/mouthwashing-sales-top-500k-copies-ps5-and-switch-ports-in-tow ; https://www.gematsu.com/2025/02/mouthwashing-coming-to-ps5-xbox-series-and-switch-in-2025
- Mortuary Assistant : https://steamdata.ai/game/1295920 ; https://raijin.gg/app/1295920/The_Mortuary_Assistant ; https://www.gamedeveloper.com/press-release/embalm-and-exorcize-the-dead-in-supernatural-horror-game-the-mortuary-assistant
- Immortality : https://pcgamer.com/our-highest-reviewed-game-of-2022-so-far-is-immediately-on-game-pass ; https://gamesradar.com/immortality-is-getting-rave-reviews-from-critics-and-its-coming-to-game-pass-today
- The Alters : https://gamingbolt.com/the-alters-has-sold-280000-copies ; https://wnhub.io/news/investment/item-51912 ; https://opencritic.com/news/29855/this-war-of-mine-is-a-generational-hit-but-11-bit-wants-to-reimagine-it
- Echoes of the End : https://www.gamespress.com/SELF-MADE-ICELANDIC-STUDIO-DEBUT-GAME-ECHOES-OF-THE-END-IS-OUT-NOW ; https://steamdb.info/app/2821610 ; https://gamingbolt.com/echoes-of-the-end-is-out-now
- Peak : https://www.pcgamer.com/games/adventure/peak-has-now-sold-2-million-copies-in-just-9-days-as-the-devs-reveal-whats-next-for-this-co-op-climbing-game-lets-talk-about-what-were-cooking ; https://80.lv/articles/climbing-sim-peak-has-sold-4-5-million-copies-in-less-than-a-month
- Sorties Steam par an : https://www.gamingonlinux.com/2025/12/over-19000-games-have-released-on-steam-in-2025-with-nearly-half-seeing-less-than-10-reviews ; https://www.gamingonlinux.com/2026/11/steam-is-officially-drowning-in-game-releases/ ; https://www.notebookcheck.net/Steam-averages-almost-70-new-games-a-day-in-2026.1374113.0.html ; https://labs.invenglobal.com/articles/25520/new-steam-releases-hit-record-high-of-720-in-one-week-averaging-103-per-day
- Horreur sur Steam : https://automaton-media.com/articles/newsjp/20251121-366723/ ; https://wnhub.io/news/analytics/item-47472 ; https://wnhub.io/news/indie/item-52426 ; https://howtomarketagame.com/2025/01/15/what-the-hell-happened-in-2024/
- PS5 : https://gamingbolt.com/?p=656373 ; https://www.thurrott.com/games/playstation/339911/playstation-5-sales-hit-95-3-million-units ; https://gematsu.com/2026/05/ps5-shipments-top-93-7-million ; https://www.pushsquare.com/news/2026/07/ps5-crawls-past-95-million-units-sales-down-36percent-year-on-year
- Xbox Series : https://tech4gamers.com/xbox-series-sales-stuck/ ; https://www.tweaktown.com/news/107437/xbox-consoles-will-flatline-to-42-million-users-by-the-end-of-2025-analyst-firm-predicts/index.html ; https://gameluster.com/console-shipments-2026-sp-kagan-forecast/ ; https://en.generacionxbox.com/xbox-series-sales-would-already-be-around-50-million-according-to-the-latest-take-two-data-review/
- Steam Deck / enquête matériel : https://www.gamingonlinux.com/2026/02/steam-survey-for-january-2026-shows-a-small-drop-for-linux ; https://gamingonlinux.com/2026/06/steam-survey-for-may-2026-is-out-linux-down-at-3-99-percent-but-still-above-macos ; https://steamdeckhq.com/news/steam-hardware-survey-results-sep-26/
- Références internes : `docs/business/ETUDE_MARCHE.md` (sections 0, 2.2, 5.1, 5.2, 10), `docs/vision/CONCEPTS.md` v1.1, `production/validations/T-019.md`.
