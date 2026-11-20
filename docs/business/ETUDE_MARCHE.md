# Étude de marché : jeu premium AA haut de gamme photoréaliste (T-002, révisée par T-019)

- **Auteur** : agent `marketing-publishing`
- **Version** : 2 (révision T-019) du 20 novembre 2026. La version 1 (T-002) a été validée avec réserves par la Boss.
- **Statut** : brouillon soumis à la validation de la Boss. **Aucun chiffre de ce document n'a été relu à la source** (voir section 0). Il ne doit pas sortir du studio avant la validation de T-020.
- **Destinataires** : Boss (choix du concept, T-004), `business-affairs` (chiffrage, T-015), `game-director` (concepts, T-001)
- **Journal des modifications** : section 14 (chaque correction y est reliée au numéro de retour de la Boss dans `production/validations/T-002.md`).

## 0. Méthode, limites et conventions de lecture (à lire en premier)

**Ce qui a été fait.** Deux passes de recherche web avec l'outil `WebSearch` : novembre 2026 (T-002), puis le 20 novembre 2026 (T-019). **Aucune page source n'a été ouverte** : les hôtes de référence (`alineaanalytics.substack.com`, `partner.steamgames.com`, `gamedevreports.substack.com`, `www.gematsu.com`) ne sont pas autorisés par le réseau de la session, et la consigne de T-019 interdit de contourner cette restriction. Je n'ai donc pas retenté d'ouvrir ces pages. La recherche renvoie des résumés et des adresses ; **un chiffre qui figure ici est un chiffre lu dans un résumé de recherche, jamais relu sur la page d'origine**. La relecture à la source est l'objet de T-020 (bloquée en attente de la décision de l'humain propriétaire sur l'accès réseau).

**Traçabilité.** La section 13 donne, pour chaque source, l'URL **quand la recherche l'a renvoyée**, et la date de consultation (date de la recherche, pas d'ouverture de page). Les sources de la première passe dont l'adresse n'a pas été renvoyée à nouveau portent la mention « URL non retrouvée » : je n'invente aucune adresse.

**Niveaux de confiance utilisés dans tout le document** (toute étiquette employée figure dans ce tableau) :

| Étiquette | Signification |
|---|---|
| **[Annoncé]** | Chiffre communiqué par l'éditeur ou le développeur (communiqué, résultats financiers), lu via un article de presse ou un résumé de recherche. |
| **[Analyste]** | Estimation d'un cabinet ou d'un site de données (Alinea, Sensor Tower, Newzoo, Circana, Statista...). Méthodes différentes, résultats parfois contradictoires. |
| **[Presse]** | Fait rapporté par un média (prix, note, date, déclaration) sans donnée primaire consultée. Le média est nommé quand il est connu. |
| **[Valve]** | Donnée publiée par Valve (enquête matériel et logiciel Steam, documentation Steamworks), lue via un média ou un résumé de recherche, pas sur la page de Valve. |
| **[Prévision]** | Projection d'un cabinet ou d'une banque sur une période future. |
| **[Estimation]** | Calcul ou hypothèse de ma part, avec méthode et hypothèses explicites. Ce n'est pas une donnée. Inclut les estimations tierces de ventes (Raijin, méthode Boxleiter), toujours nommées. |
| **[Mémoire]** | Information issue de la connaissance générale de l'auteur, **non confirmée par la recherche**. À vérifier avant tout usage. |
| **non vérifié** | Donnée cherchée mais non trouvée, contradictoire ou non cherchée dans cette passe. La raison est donnée. Ne pas utiliser comme base de calcul. |

**Règles** : aucun chiffre n'est inventé ; aucune donnée n'est présentée comme « vérifiée » ; les chiffres [Mémoire] et « non vérifié » ne servent, en T-015, que d'hypothèses de sensibilité nommées comme telles (décision 1 de la Boss).

## 1. Résumé exécutif

1. **Le marché PC est le plus porteur et le plus accessible à un petit studio.** Alinea estime les revenus bruts de Steam à 11,1 Md$ au S1 2026, record (+14,5 % sur un an) [Analyste]. Sensor Tower donne un tout autre chiffre (5,36 Md$, -5 %) [Analyste] : les méthodes divergent, retenir la tendance « Steam est grand et stable ou en croissance », pas un montant.
2. **Mais la croissance vient du catalogue, pas des nouveautés.** Selon Alinea, les jeux sortis en 2026 ne représentent que 21 % des revenus Steam du S1 2026 (27 % au S1 2025, 29 % au S1 2024) [Analyste]. Un nouveau jeu se bat contre un catalogue ancien qui se vend très bien en promotion. Conséquence : il faut un **hook visible dès la vignette** et une **longue traîne** (soldes, DLC).
3. **Les franchises captent la moitié du haut du classement.** Les deux montants de 2,4 Md$ qui circulent ne mesurent **pas la même chose** (détail en 2.2) :
   - **S1 2026 (janvier à juin)** : 2,40 Md$ = **l'ensemble des jeux sortis en 2026**, soit 21 % des 11,10 Md$ de revenus bruts Steam de la période [Analyste, Alinea].
   - **Janvier à août 2026** : les **100 meilleures nouveautés 2026** font ≈2,4 Md$, soit 15,9 % des ≈15 Md$ de revenus bruts Steam de ces huit mois [Analyste, Alinea via un relais de presse]. Sur ce même périmètre (top 100), 63 % des jeux sont de nouvelles IP, mais 52,5 % du revenu vient de franchises connues.
   - **Réserve** : la quasi-égalité des deux montants (2,40 et ≈2,4) est suspecte, car un top 100 sur huit mois devrait dépasser, ou au moins ne pas égaler, l'ensemble des nouveautés de six mois. Je ne peux pas trancher sans la source : **à relire en T-020**. Le pourcentage de 15,9 % est cohérent avec la base de ≈15 Md$ (2,4 / 15,9 % ≈ 15,1 Md$), pas avec celle de 11,1 Md$.
   - Conclusion qualitative, inchangée : une IP inconnue doit compenser par un concept très lisible.
4. **Le AA premium photoréaliste a des preuves de succès, mais à forte variance, et les comparaisons sont faussées par la distribution** (Game Pass day-one, exclusivité Epic). Réussites : Clair Obscur: Expedition 33 (8 M d'unités en un an, annoncé), Silent Hill 2 Remake (6 M), Silent Hill f (2 M en 7 mois), Kingdom Come: Deliverance II (plus de 6 M, annoncé). Résultats modestes ou décevants : Hellblade II (≈272 k exemplaires Steam, estimation tierce, hors Xbox et Game Pass), Banishers (« sous les attentes », éditeur). Voir section 5.
5. **Les consoles sont un marché plus cher et plus fragile en 2026** : hausses de prix PS5 (+100 $ en avril 2026) et Xbox (août 2026) liées aux coûts mémoire, ventes de matériel en baisse aux États-Unis (Circana). Newzoo estime pourtant la console à 46,9 Md$ en 2026 (+5,1 %), tirée par GTA VI [Prévision, Newzoo].
6. **Recommandation de positionnement (hypothèse à valider par la Boss)** :
   - **sortie simultanée sur PC (Steam, Epic), PS5 et Xbox Series X|S** : c'est le scénario de base fixé par la Boss (décision 2 de T-002). Décaler les consoles reste une option de repli, à trancher au plus tard au jalon M2 avec l'accord de l'humain propriétaire ;
   - prix de référence **39,99 à 49,99 USD**, devise de base de Steam, déclinés par région (section 6.2). C'est une hypothèse de travail, pas un prix ;
   - édition standard et éventuelle Deluxe cosmétique, démo pour un Steam Next Fest ;
   - **aucune date ni fenêtre de sortie** : elles dépendent de la roadmap du `producer` (T-010). La saisonnalité est présentée en section 8 comme un calendrier récurrent.
7. **Genres recommandés pour un AA photoréaliste** : action-aventure narrative courte ou moyenne, horreur et survival-horror, exploration et immersive sim à ambiance forte. **À éviter** : jeux service live, extraction-shooter, open world massif, MMO (section 4).

## 2. État du marché par plateforme

### 2.1 Marché global
- Newzoo (prévision, août 2026) : marché mondial **213,9 Md$ en 2026 (+6,1 %)** contre 201,6 Md$ en 2025 ; mobile 121,1 Md$ ; **console 46,9 Md$ (+5,1 %)** ; **PC 45,9 Md$ (+5,3 %)**. Le PC a crû de 12 % en 2025, record historique de Newzoo [Prévision et Analyste, Newzoo]. Newzoo indique que sans GTA VI, la console serait en recul en 2026. *Sources : Newzoo « The Gaming Market in 2026 », lu via GameDev Reports, gamedev.net et God is a Geek (août 2026) ; rapport complet annoncé le 10 septembre 2026, non lu.*
- **Attention** : GTA VI est annoncé au 19 novembre 2026 (PS5 et Xbox Series, PC non annoncé) d'après plusieurs sites [Presse] ; **je n'ai pas pu confirmer que le lancement a bien eu lieu**. Cela concerne l'encombrement de l'automne 2026, pas notre calendrier.

### 2.2 PC (Steam, Epic, Steam Deck)
- **Revenus bruts de Steam** (Alinea) [Analyste] :

| Période | Périmètre | Montant | Base du pourcentage |
|---|---|---|---|
| S1 2026 (janvier à juin) | Tous jeux, revenus bruts | 11,10 Md$ (record, +14,5 % sur un an) | |
| S1 2026 | Jeux **sortis avant 2026** (catalogue) | 8,70 Md$, soit 78,4 % | 11,10 Md$ |
| S1 2026 | **Tous les jeux sortis en 2026** | 2,40 Md$, soit 21,6 % (arrondi à 21 % par la source) | 11,10 Md$ |
| Janvier à août 2026 | Tous jeux, revenus bruts | ≈15 Md$ | |
| Janvier à août 2026 | **Top 100 des nouveautés 2026** | ≈2,4 Md$, soit 15,9 % | ≈15 Md$ (≈15,1 Md$ implicite) |

  Les deux montants de 2,4 Md$ portent donc sur **deux périodes et deux périmètres différents** ; le premier est rapporté à 11,1 Md$, le second à ≈15 Md$. Ne jamais citer l'un avec le pourcentage de l'autre. La coïncidence des montants reste à vérifier à la source (section 1, point 3).
- Sensor Tower : 5,36 Md$ au S1 2026, -5 % [Analyste]. **Écart d'un facteur 2 avec Alinea : ne pas bâtir un chiffrage sur un seul de ces totaux.**
- Top nouveautés S1 2026 (revenu brut estimé, Alinea) : Forza Horizon 6 ≈197,7 M$, Resident Evil Requiem ≈194,5 M$, Crimson Desert ≈190,1 M$, puis Slay the Spire 2 et Subnautica 2 [Analyste]. Les seuls AAA ou AA photoréalistes du top 3 sont des productions très fortes en marque ou en budget.
- Matériel PC (enquête Steam, septembre 2026) : GPU le plus courant RTX 5070 (5,86 %) ; **16 Go de VRAM est devenu le palier le plus courant** (27,21 % en septembre 2026, devant 8 Go) [Valve, via PCGamesN et Digital Citizen]. Le RTX 3060 reste très présent (≈3,7 à 4 % en juillet 2026). **Implication** : le parc peut faire tourner un rendu UE5 haut de gamme, mais le photoréalisme maximal (Lumen matériel, RT) doit rester **scalable** pour les GPU 8 Go. Part du Steam Deck : non vérifié (non trouvée ; à traiter en T-021, retour 10).
- Observation qualitative d'un article japonais sur les données du S1 2026 : la progression perçue de la qualité graphique a ralenti, ce qui expliquerait en partie la force des vieux jeux [Analyste, GameBusiness.jp, juillet 2026]. **Le seul photoréalisme n'est donc pas un argument de vente suffisant.**
- Tags : une source de synthèse (Video Game Insights, bilan 2025) indique que les tags « cute » et « realistic » ont eu la plus forte croissance de revenus d'une année sur l'autre [Analyste]. Je n'ai pas pu lire le détail (période, périmètre) : non vérifié.

### 2.3 PlayStation 5
- Prix : PS5 Digital **599,99 $**, PS5 Pro **899,99 $** depuis le 2 avril 2026 (+100 $ et +150 $) [Presse : VGC, Push Square, mars 2026]. Cause évoquée : coûts mémoire ; Sony n'a pas confirmé ce lien.
- États-Unis (Circana, 2026) : dépenses matériel de juillet -29 % (282 M$), plus faible juillet depuis 2020 ; ventes de logiciels physiques de juillet à 85 M$, plus bas depuis le début du suivi en 1995 ; **Nintendo = 63 % du physique neuf cumulé 2026, PlayStation 32 %, Xbox un peu plus de 4 %** ; dépenses totales -9 % en août 2026 sur un an, ≈-1 % cumulé en juin après +5 % à fin mars [Analyste, Circana via presse].
- Part du numérique pur : 27 % des PS5 vendues aux États-Unis à fin juin 2026 sont sans lecteur [Analyste, Circana]. **Le physique est secondaire pour un AA : le numérique domine.**
- Base installée mondiale PS5 : non vérifié (non trouvée ; Sony la publie dans ses résultats trimestriels, à traiter en T-021, retour 10).

### 2.4 Xbox Series X|S
- Prix relevés en octobre 2025 puis août 2026 ; Series X avec lecteur à 799,99 $ d'après Statista [Analyste, Statista ; Presse : Push Square]. Sources divergentes sur la Series S : non vérifié.
- Xbox ≈ 4 % du physique américain en 2026 [Analyste, Circana]. **Le marché Xbox est surtout numérique et passe par Game Pass.**
- Game Pass : restructuré en avril 2026 ; day-one limité à PC Game Pass et Ultimate selon une source ; rumeur non confirmée d'une disparition du day-one entre février et avril 2027 [Presse]. **Rien de fiable trouvé sur les montants versés aux AA** : non vérifié. L'effet du day-one sur les ventes est analysé en 5.4.
- PS Plus : Sony n'adopte pas le day-one pour ses jeux et utilise PS Plus comme levier de rétention de catalogue [Presse, 2025-2026].

### 2.5 Lecture par plateforme (pour le choix de sortie)
| Plateforme | Attrait pour un AA photoréaliste | Risque principal |
|---|---|---|
| PC Steam | Fort : marché large, découvrabilité par wishlists et démo | Catalogue ancien très concurrentiel ; saturation des sorties |
| PC Epic | Commission plus basse (section 7), exclusivité possible (Epic First Run : 100 % des revenus pendant six mois d'exclusivité [Presse, page Epic relevée via recherche]) | Audience beaucoup plus faible que Steam (non chiffrée ici). **Cas d'école : Alan Wake 2**, exclusif Epic sur PC, n'est toujours pas sur Steam en janvier 2026 [Presse] ; ses ventes PC ne se comparent donc pas à celles d'un titre Steam (5.4) |
| PS5 | Bon pour AAA et AA narratifs ; PS5 Pro (PSSR) valorise le visuel | Parc ralenti par les hausses de prix ; certification Sony |
| Xbox Series | Dépend de Game Pass | Ventes à plein tarif difficiles à isoler du day-one ; Series S limite le rendu (10 Go) |

## 3. Tendances 2025-2026

1. **Records Steam mais portés par l'ancien** (sections 1 et 2.2).
2. **Le AA progresse en valeur** : Sensor Tower, bilan 2025 : franchises AAA 3,98 Md$ (3,13 Md$ en 2024), franchises AA 1,23 Md$, indé stable à 0,64 Md$ [Analyste, via GameDev Reports]. Lecture prudente : ces totaux portent sur des « franchises », pas sur des sorties neuves.
3. **Les AA « à histoire » ont montré qu'ils peuvent surperformer** : Clair Obscur: Expedition 33 a vendu 1 M en 3 jours, 3,3 M en 33 jours, 5 M en octobre 2025, **8 M à son premier anniversaire (avril 2026)** [Annoncé, Kepler/Sandfall via Gematsu, VGC, TweakTown]. **Il est sorti day-one sur Game Pass** (5.4).
4. **Les remakes et l'horreur de marque fonctionnent** : Silent Hill 2 Remake 6 M au 24 avril 2026 [Annoncé, Konami via Anime News Network, VGC] ; Silent Hill f 1 M en 4 jours puis 2 M au 22 avril 2026 [Annoncé, Konami].
5. **Le multiplateforme Xbox est devenu la norme** (pas d'exclusivité à attendre), ce qui augmente la concurrence sur PS5 et PC.
6. **Pression sur les prix du matériel** (RAM) : possible effet de frein sur les ventes consoles en 2027 ; Jefferies prévoit des hausses de mémoire de 40-50 % au T3 et 30-40 % au T4 2026 [Prévision, via Player.One]. À surveiller.
7. **Stagnation du « wow graphique »** (article japonais, section 2.2) : le rendu seul ne vend plus ; le hook doit être un concept, un lieu ou un système.
8. **Prix contenus des AA premium** : Mafia: The Old Country à 49,99 $ au lancement, « pas un jeu premium plein tarif » selon la presse [Presse : VGC, MP1st] ; Clair Obscur à 49,99 $ (5.1). Tendance cohérente avec l'hypothèse de prix de la section 6.

## 4. Genres porteurs et genres saturés ou risqués

**Important** : je n'ai **pas trouvé de ventilation vérifiée des revenus Steam par genre** (horreur, survie, action...) pour 2026. Le tableau ci-dessous est un **jugement qualitatif [Estimation]** fondé sur les cas de la section 5. L'analyse concept par concept est l'objet de T-021.

| Genre | Verdict | Fondement (sources en section 5) | Confiance |
|---|---|---|---|
| Action-aventure narrative (courte à moyenne, forte direction artistique) | **Porteur** | Clair Obscur (8 M, mais day-one Game Pass), Hellblade II (reconnu, ventes Steam tièdes, mais facteurs de confusion : 5.4) | Moyenne |
| Horreur / survival-horror photoréaliste | **Porteur, concurrence de marques fortes** | Silent Hill 2 (6 M), Silent Hill f (2 M), Resident Evil Requiem n°1 des ventes US 2026 cumulé (Circana), Still Wakes the Deep (nouvelle IP, sans chiffre de ventes officiel : 5.1) | Moyenne |
| Exploration / aventure à ambiance (immersive sim léger, enquête) | **Porteur de niche, budget maîtrisable** | Atomfall (1,5 M de joueurs, Game Pass inclus, Rebellion) | Faible |
| Action-RPG « soulslike » | **Saturé** : forte offre ; réussites (Black Myth, Lies of P) mais échecs aussi | Lies of P ≥1 M, Banishers sous les attentes | Moyenne |
| Survie-craft multi / service live | **Risqué pour un petit studio** : budget de contenu continu, concurrence extrême | Observation générale ; Subnautica 2 dans le top S1 2026 [Analyste] est une exception de marque | Faible |
| Shooter multijoueur, extraction, MMO | **À éviter** | Coûts et besoin de communauté ; hors périmètre d'un AA qui démarre | Faible |
| Open world très vaste photoréaliste | **À éviter** | Coût de contenu et de performance (60 fps console). Kingdom Come: Deliverance II réussit à très grande échelle (5.1) mais avec une marque établie | Moyenne |
| Co-op physique « friendslop » | Tendance émergente (Alinea) mais **stylisée et peu compatible avec le photoréalisme** | Alinea, 2026, non chiffré | Faible |

## 5. Concurrents et jeux de référence

**Lecture des colonnes** : « Ventes » = dernier chiffre trouvé, avec son niveau de confiance. « Note » = note presse quand elle a été trouvée ; sinon « non vérifié » avec la raison. « Prix » = prix de lancement quand la recherche l'a donné ; sinon « non vérifié » avec la raison. « Distribution » signale la sortie day-one sur un abonnement ou une exclusivité, qui fausse les comparaisons (5.4).

### 5.1 Tableau comparatif

**A. Références de la version 1 (corrigées et complétées)**

| Jeu (studio, sortie) | Distribution au lancement | Ventes | Note | Prix lancement | Point fort | Point faible |
|---|---|---|---|---|---|---|
| **Clair Obscur: Expedition 33** (Sandfall/Kepler, 24 avr. 2025, PC/PS5/Xbox) | **Game Pass day-one** (Microsoft : plus grand lancement tiers 2025 de Game Pass en utilisateurs uniques sur 30 jours [Annoncé, via Windows Central et blog Windows]) | 8 M en un an [Annoncé, avril 2026] ; 3,3 M en 33 jours. Le total inclut-il Game Pass ? non vérifié | Metacritic 92 (PS5), 91 (Xbox et PC) [Presse, mi-2025] | 49,99 $ (édition standard ; Deluxe 59,99 $) d'après la page boutique Xbox relevée via recherche [Presse]. Prix à la date de lancement non confirmé | Direction artistique et narration, bouche-à-oreille, prix contenu | Rendu stylisé, pas photoréaliste : référence de **modèle**, pas de **look**. Réussite obtenue **malgré ou avec** le day-one Game Pass : non séparable |
| **Black Myth: Wukong** (Game Science, août 2024, PC/PS5) | Pas d'abonnement ; marché chinois fort | ≈20 M en un mois (diapositive d'un ancien dirigeant de PlayStation au TGS, **non officiel**) [Presse] | Presse : non vérifié (pas trouvée dans cette passe ; recherche non refaite car titre hors cible, cas hors norme). Notes utilisateurs Metacritic 81 (PC) et 75 (PS5) [Presse] | 60 $ [Presse : GamesRadar] | Spectacle visuel UE5, marque culturelle forte | Budget estimé 43 M$ (GamesRadar) à 70 M$ (Bloomberg via TweakTown) : sources contradictoires. Cas hors norme, non reproductible |
| **Silent Hill 2 Remake** (Bloober/Konami, oct. 2024, PS5/PC) | Pas de day-one sur abonnement (non vérifié) | 1 M en 3 jours ; 2 M (janv. 2025) ; 5 M (janv. 2026) ; **6 M (24 avr. 2026)** [Annoncé] ; le comptage Konami inclut les abonnements | 86 presse, 9,2 utilisateurs [Presse] | non vérifié (non cherché dans cette passe, qui a privilégié les références proches de la cible ; à traiter en T-020) | Marque culte, ambiance, photoréalisme UE5 | Dépend d'une IP exceptionnelle |
| **Silent Hill f** (Konami/NeoBards, sept. 2025) | non vérifié | 1 M en 4 jours ; **2 M au 22 avr. 2026** [Annoncé] | « milieu des 80 » [Presse] | non vérifié (même raison) | Direction artistique, horreur japonaise | Idem : IP |
| **Senua's Saga: Hellblade II** (Ninja Theory/Xbox, mai 2024 ; PS5 août 2025) | **Game Pass day-one** (retour 6 de la Boss ; commentaires de presse sur l'effet Game Pass [Presse : Inverse, Sportskeeda]) | Pas de total officiel. Steam : **≈272,5 k exemplaires, ≈8,2 M$ brut** [Estimation tierce, Raijin, confiance « moyenne », sept. 2026] ; **ce chiffre exclut les joueurs Xbox et Game Pass**. 10 030 avis Steam à 87 % positifs ; pic de 3 982 joueurs simultanés au lancement [Presse, SteamDB] ; le studio a déclaré ≈5 M£ de profit au 30 juin 2025 [Annoncé via GamingBolt] | ≈80-81 Metacritic au lancement [Presse] | 50 $ [Mémoire] | **Référence technique du photoréalisme UE5**, bien reçue | Court, peu rejouable. Les ventes Steam modestes **ne démontrent pas** que « la prouesse graphique ne suffit pas » : elles sont aussi cohérentes avec le day-one Game Pass, le prix et la durée (5.4) |
| **S.T.A.L.K.E.R. 2** (GSC, nov. 2024, PC/Xbox ; PS5 plus tard) | **Game Pass day-one** | 1 M en 2 jours (**malgré le day-one Game Pass**) [Annoncé, via Windows Central] ; **6 M de joueurs en mars 2025 (Game Pass inclus, donc pas des ventes)** [Annoncé] ; 2,9 M d'unités / 137 M$ après un an d'après un site statistique secondaire (**non vérifié**) | Metacritic au lancement : PC 76, Xbox 82 (OpenCritic 77) ; plus tard PC 73, PS5 80 [Presse]. Snapshots qui varient dans le temps. Steam 80 % sur 134 820 avis (juillet 2026, Raijin) | non vérifié (la recherche n'a pas renvoyé de prix de lancement) | Ambiance, monde immense, photoréalisme | Lancement techniquement difficile ; production longue et très lourde |
| **Alan Wake 2** (Remedy/Epic Publishing, oct. 2023) | **Exclusif Epic Games Store sur PC** ; pas sur Steam à ce jour d'après une source de janvier 2026 [Presse] | >2 M au 31 déc. 2024 [Annoncé Remedy, via Neowin] et rentabilité atteinte (« coûts de développement et marketing couverts ») [Annoncé Remedy] ; **3 M en août 2026** [Annoncé Remedy, via Bloody Disgusting et players.com.ua] | Metacritic ≈89 (PS5), 91-92 (PC) selon les sources et la date [Presse] | 59,99 $ : seulement indirect (liste actuelle d'un site de prix et un commentaire de lecteur). **non vérifié** comme prix de lancement | Direction narrative et rendu, critique excellente | Lancement lent, rentabilité atteinte tardivement ; ventes PC non comparables à un titre Steam |
| **Atomfall** (Rebellion, mars 2025) | **Game Pass day-one** (CEO de Rebellion : « énorme succès » ; un média parle de lancement « immédiatement rentable » [Presse : VGC, Robots Over Dinosaurs]) | **1,5 M de joueurs** en quelques jours, puis plus de 2 M de joueurs d'après un relais (Game Pass inclus ; pas des ventes) ; « meilleur lancement de l'histoire de Rebellion » [Annoncé] | Metacritic ≈74-75 [Presse] | non vérifié : 60 $ dans un article, 49,99 à 79,99 $ selon l'édition dans un autre ; pas de prix de lancement daté | AA britannique, ambiance, budget maîtrisé | Visuel moins spectaculaire ; chiffres non ventilés |
| **Banishers: Ghosts of New Eden** (Don't Nod, 2024) | non vérifié | Pas de chiffre ; l'éditeur dit avoir été **« en dessous des attentes »** [Annoncé] | non vérifié (non cherché dans cette passe : titre peu proche de la cible) | non vérifié (même raison) | Narration, duo de personnages | Contre-exemple : AA narratif de qualité mais résultat décevant |
| **Hell is Us** (Rogue Factor, 2025) | Un titre d'article associe le jeu à Game Pass : non vérifié | Non vérifié. Un titre d'article évoque 1 M de joueurs avec Game Pass ; un chiffre Sensor Tower « 3,6 m » non interprétable | non vérifié (non cherché dans cette passe) | non vérifié (même raison) | Direction artistique, aventure sans guidage | Visibilité limitée |

**B. Références photoréalistes de 2024-2025 plus proches de notre cible (ajoutées par T-019)**

| Jeu (studio, sortie) | Distribution au lancement | Ventes | Note | Prix lancement | Point fort | Point faible |
|---|---|---|---|---|---|---|
| **Still Wakes the Deep** (The Chinese Room, 18 juin 2024, PC/PS5/Xbox) | **Game Pass day-one** [Presse : Pure Xbox, Comicbook] | **Aucun chiffre officiel trouvé** : non vérifié. Indices Steam seulement : 10 557 avis positifs et 1 418 négatifs, pic de 927 joueurs simultanés le 18 juin 2024 [Analyste : agrégateur tiers, instantané non daté] | Metacritic : 73 à 77 selon l'instantané (83 cité par un article Game Pass). Une moyenne finale est non vérifiée [Presse] | 34,99 $ d'après un agrégateur de prix tiers (**non vérifié** : source peu fiable, prix de lancement non daté) | Nouvelle IP, lieu clos, horreur sans combat, jeu court : **le plus proche d'ESTRAN** | Pas de donnée de ventes ; le day-one Game Pass brouille la lecture ; pic Steam modeste |
| **Mafia: The Old Country** (Hangar 13/2K, 8 août 2025, PC/PS5/Xbox) | Pas de day-one Game Pass trouvé (non vérifié) | ≈800 000 unités en 4-5 jours : **48 % PS5, ≈33 % Steam** [Analyste, Sensor Tower via GamingBolt, Pure Xbox, PSU] ; plus de 1 M début septembre selon un seul relais (non confirmé) ; Take-Two dit que les ventes ont dépassé ses attentes internes [Annoncé via PSU]. Pas de total officiel | Metacritic 76 au lancement ; PC 75 sur 68 critiques plus tard [Presse : GamesRadar, Tech4Gamers] | **49,99 $** ; Deluxe 59,99 $ [Presse : VGC, GamingBolt, MP1st] | Photoréalisme UE5 sur un jeu **narratif et linéaire**, prix contenu, sortie simultanée PC et consoles : **bon modèle pour notre scénario de base** | **Suite d'une franchise établie** et éditeur AAA (2K/Take-Two) : l'écart avec un studio indépendant est large. Presque la moitié des ventes sur PS5 : le poids des consoles est élevé |
| **Kingdom Come: Deliverance II** (Warhorse/Deep Silver, 4 fév. 2025, PC/PS5/Xbox) | Pas de day-one sur abonnement trouvé (non vérifié) | 1 M en ≈1 jour, 2 M en moins de deux semaines, 3 M en mai 2025, 4 M, puis **plus de 6 M au 25 juin 2026** [Annoncé, communiqué Warhorse/Deep Silver via Game Developer et RPG Site] | Metacritic 87 à 89 selon le relevé (88 cité par Windows Central) [Presse] | 59,99 $ d'après un site de suivi de prix tiers : **non vérifié** (prix de lancement non daté dans la source) | Photoréalisme et immersion, bouche-à-oreille, réussite sur PC, PS5 et Xbox | **Suite d'un jeu à plus de 10 M d'unités** [Annoncé, RPG Site] et RPG en monde ouvert : le plus éloigné de nos garde-fous (60 fps, périmètre AA). Taille de l'équipe : non vérifiée. Prix plus haut que notre hypothèse |

**Proximité de ces références avec notre cible** (studio de taille moyenne, IP nouvelle ou secondaire, prix premium contenu, photoréalisme) [Estimation] :

| Jeu | IP nouvelle ou secondaire | Prix contenu | Périmètre contenu | Photoréalisme | Lecture |
|---|---|---|---|---|---|
| Still Wakes the Deep | Oui (nouvelle IP) | Probable (non vérifié) | Oui | Oui | La plus proche pour le genre et le périmètre, mais **sans chiffre de ventes** |
| Mafia: The Old Country | Non (franchise) | Oui (49,99 $) | Oui (jeu narratif linéaire) | Oui | Proche pour le prix, le format et la sortie simultanée ; **pas pour le poids de la marque** |
| Kingdom Come: Deliverance II | Non (suite d'un succès) | Non (59,99 $, non vérifié) | Non (monde ouvert) | Oui | Preuve que le photoréalisme se vend sur les trois plateformes ; **peu transposable** |

**Constat** : aucune référence ne cumule les quatre critères de notre cible, et la seule qui les cumule presque (Still Wakes the Deep) n'a pas de chiffre de ventes public trouvé. Le tableau ne permet donc **pas** de calibrer les ventes d'une IP nouvelle de studio moyen ; il montre seulement ce qui est possible (Mafia, KCD2, Clair Obscur) et ce qui ne l'est pas (Banishers). Les analyses par concept sont à faire en T-021.

### 5.2 Estimation par méthode Boxleiter (illustration, **pas une donnée**)
Méthode : ventes ≈ nombre d'avis Steam × multiplicateur. Le multiplicateur varie fortement selon le genre, le prix et l'époque ; la fourchette 20 à 50 est un ordre de grandeur courant dans la profession, **que je n'ai pas vérifié ici [Mémoire]**.
- **Hellblade II** : 10 030 avis × 27,2 ≈ 272,5 k. C'est exactement l'estimation de Raijin (le multiplicateur implicite est donc ≈27, calculé en divisant 272 500 par 10 030). **Steam uniquement.**
- **S.T.A.L.K.E.R. 2** : 134 820 avis × 20 = ≈2,7 M ; × 30 = ≈4,0 M ; × 50 = ≈6,7 M. Le résultat varie d'un facteur 2,5 selon le multiplicateur : **utile pour un ordre de grandeur uniquement**. Une source indique « plus de 2,5 M sur Steam » (estimation, non vérifiée), cohérente avec le bas de la fourchette. **Steam uniquement.**

### 5.3 Leçons pour nous
1. **Le rendu seul ne suffit pas, mais Hellblade II ne le démontre pas.** Son chiffre Steam (≈272 k) exclut les joueurs Xbox et Game Pass, et le jeu est sorti day-one sur Game Pass. La conclusion « la prouesse graphique ne suffit pas » reste **plausible** (le catalogue ancien domine, section 2.2 ; le « wow graphique » stagne, section 3) mais **elle ne s'appuie pas sur cette donnée seule**. Le hook doit se dire en une phrase et se voir sur la capsule : c'est une recommandation de marketing, pas une conclusion tirée de Hellblade II.
2. **Le prix contenu** de Clair Obscur (49,99 $) et de Mafia: The Old Country (49,99 $) est un meilleur modèle qu'un AAA à 70 $ ou plus. Le prix exact de lancement de Clair Obscur reste à confirmer (5.1).
3. **L'horreur photoréaliste se vend**, mais les références de ventes sont des marques ; sans marque, le concept et le trailer doivent faire le travail. Still Wakes the Deep (nouvelle IP) est le cas à documenter en priorité : ses ventes sont inconnues.
4. **La variance est énorme** : mêmes ingrédients (AA narratif, qualité critique) → 8 M (Clair Obscur) ou « sous les attentes » (Banishers). Il faut un chiffrage par **scénarios** (T-015), pas un point.
5. **Le day-one sur abonnement est un facteur de confusion majeur, pas un simple gonflement des « joueurs ».** Quatre références (Hellblade II, Clair Obscur, Stalker 2, Atomfall) et Still Wakes the Deep sont sorties day-one sur Game Pass ; Alan Wake 2 était exclusif Epic sur PC. Les chiffres de « joueurs » ne sont pas des ventes (Stalker 2, Atomfall, Hell is Us), et les chiffres Steam seuls sous-estiment les titres qui ont aussi une audience Xbox ou Game Pass. **Ne jamais comparer « joueurs », « exemplaires Steam » et « exemplaires toutes plateformes »**. Cet effet joue dans les deux sens : le day-one a pu **réduire** des ventes (hypothèse pour Hellblade II) ou **aider** la découverte (Clair Obscur, Atomfall) ; les données ne permettent pas de trancher (5.4).
6. **Les productions très lourdes (Stalker 2) ont souffert au lancement** : budget QA et optimisation à prévoir, et sortie PC propre.
7. **La sortie simultanée sur trois plateformes est la norme des références proches** (Mafia, KCD2, Clair Obscur) : sur Mafia, ≈48 % des premières ventes viennent de la PS5 et ≈33 % de Steam [Analyste, Sensor Tower]. Un plan centré uniquement sur les wishlists Steam sous-estimerait les ventes consoles (6.3).

### 5.4 Effet du day-one sur abonnement et de l'exclusivité Epic

**Faits relevés** :

| Titre | Situation de distribution | Ce que les sources permettent de dire |
|---|---|---|
| Hellblade II | Game Pass day-one | Pas de ventes ni de chiffres Game Pass publiés par Microsoft ou Ninja Theory. Steam : pic ≈4 000 joueurs simultanés ; commentateurs de presse mettent en cause Game Pass, le prix et la durée [Presse : Inverse, Sportskeeda, Game World Observer]. **Aucune donnée ne sépare ces causes.** |
| Clair Obscur | Game Pass day-one | Microsoft : plus grand lancement tiers 2025 de Game Pass en utilisateurs uniques sur 30 jours [Annoncé]. Et 8 M d'exemplaires vendus en un an [Annoncé]. Les deux faits coexistent ; **leur part respective n'est pas connue.** |
| S.T.A.L.K.E.R. 2 | Game Pass day-one | 1 M d'exemplaires vendus en moins de deux jours sur Xbox et PC malgré Game Pass [Presse : Windows Central]. Le directeur dit que Game Pass a aidé à faire exister la version console [Presse : Tech4Gamers]. Un titre d'article avance que Microsoft aurait payé plus que le coût de production : **non lu, non retenu**. |
| Atomfall | Game Pass day-one | CEO de Rebellion : « énorme succès » ; lancement « immédiatement rentable » selon un média [Presse : VGC, Robots Over Dinosaurs]. Déclaration de l'éditeur, non vérifiable. |
| Still Wakes the Deep | Game Pass day-one | Jeu perçu comme fort chez les abonnés [Presse]. Pas de chiffres. |
| Forza Horizon 6, Subnautica 2 | Game Pass day-one (2026) | Premiers du classement des ventes Steam malgré le day-one [Presse : Digital Citizen]. Marques fortes : non transposable. |
| Alan Wake 2 | **Exclusif Epic Games Store sur PC**, publié par Epic | Remedy dit que le jeu n'existerait pas sans Epic et que l'accord était « très juste » [Presse : Wccftech]. Remedy a mis plus d'un an pour déclarer la rentabilité (2 M fin 2024) ; 3 M en août 2026 [Annoncé]. L'absence de Steam **empêche toute comparaison PC avec les titres Steam** et réduit l'audience PC (non chiffrée). |

**Analyse** [Estimation, à partir des faits ci-dessus] :
- Le day-one sur abonnement a **deux effets opposés** : il peut **cannibaliser** des achats (surtout PC et Xbox) et il peut **amplifier la découverte** et réduire le risque financier du studio (un accord peut couvrir une partie des coûts). Microsoft ne publie pas les montants.
- Les données disponibles sont **compatibles avec les deux lectures** : Stalker 2 et les titres de marque 2026 vendent beaucoup malgré le day-one ; Hellblade II vend peu sur Steam avec le day-one, mais pour plusieurs raisons possibles. **Aucune source ne mesure l'effet net**, et je n'en tire donc pas de chiffre.
- Pour nous, trois conséquences : (1) ne pas citer Hellblade II comme preuve que le photoréalisme ne se vend pas ; (2) ne pas citer Clair Obscur comme preuve qu'un AA se vend **sans** abonnement, puisqu'il est sorti dessus ; (3) ne jamais agréger ventes Steam, ventes consoles et joueurs abonnés.
- **Décision à ne pas prendre ici** : un accord Game Pass ou PS Plus est un contrat, donc une décision de l'humain propriétaire. Il reste hors du plan de base (décision 2 de la Boss), mais comme **option à chiffrer** en T-015, pas comme risque à éviter.

## 6. Prix et modèle économique recommandé

### 6.1 Fourchettes observées
- Black Myth: Wukong : 60 $ [Presse : GamesRadar]. Mafia: The Old Country : 49,99 $, Deluxe 59,99 $ [Presse : VGC]. Clair Obscur : 49,99 $ en boutique Xbox (prix de lancement non daté) [Presse]. Hellblade II : 50 $ [Mémoire]. Kingdom Come: Deliverance II : 59,99 $ d'après un site de suivi tiers (non vérifié). Alan Wake 2 : 59,99 $, indirect (non vérifié). AAA premium : 70 $ [Mémoire]. Pour les autres titres, le prix de lancement n'a pas été trouvé : non vérifié.
- Repères Steam : une médiane de conversion plus faible pour les jeux à plus de 10 $ (section 9).

### 6.2 Recommandation (à valider par la Boss ; **c'est une proposition de positionnement, pas une donnée de marché**)

**Prix de référence et déclinaison régionale.**
- **Devise de base de Steam : le dollar américain.** La documentation Steamworks indique que le prix se saisit en dollars et que Steamworks propose ensuite un prix pour chacune des 37 devises, que l'éditeur peut modifier ; une devise sans prix rend le jeu indisponible pour ses utilisateurs [Valve, page Steamworks « pricing », relevée via recherche, non ouverte].
- **Le prix de référence de l'hypothèse de travail est donc exprimé en USD : 39,99 à 49,99 USD** (la Boss a retenu la fourchette 39,99 à 49,99 comme hypothèse de travail). Le prix en euros n'est **pas** une conversion de ce chiffre : il est choisi dans la grille recommandée par Valve, qui ne reflète pas le taux de change.
- **Méthode de déclinaison** : (1) saisir le prix USD ; (2) partir de la grille de prix régionaux recommandée par Valve (Steamworks, outil « pricing explorer ») ; (3) arrêter à la main les prix de l'euro, de la livre, du yen, etc., à des seuils psychologiques (xx,99) ; (4) contrôler la cohérence entre régions et avec les prix de la PlayStation Store et du Xbox Store, qui ont leurs propres grilles (non vérifié) ; (5) revoir la grille à chaque mise à jour par Valve (Valve a relevé ses prix recommandés dans plusieurs régions en 2025 [Presse : Wnhub, GamesRadar]).
- **TVA** : en Europe, la TVA est incluse dans le prix affiché, alors que le prix américain s'affiche hors taxe de vente. Je n'ai pas trouvé de déclaration officielle de Valve disant si les prix **recommandés** incluent la TVA : **non vérifié**, à lire dans Steamworks (T-020). La recette nette par exemplaire (6.3) en tient compte comme hypothèse.
- **Équivalence 39,99 € / 44,99 $ retirée** : la version 1 convertissait un écart de 10 € en 5 $ sans méthode. Je ne propose aucune équivalence numérique entre euro et dollar. **Décision à arbitrer** : la Boss avait retenu « 39,99 à 49,99 € » ; je lis cette fourchette comme un repère de prix affiché en Europe, et je la reporte en USD comme repère de base pour Steamworks. Si l'intention est une fourchette **en euros** pour l'Europe, il faut le dire pour T-015.

| Élément | Recommandation | Justification |
|---|---|---|
| Édition standard | **39,99 à 49,99 USD** (prix de base Steam), déclinés par région selon la méthode ci-dessus | Entre les AA narratifs à succès (≈50 $ : Mafia, Clair Obscur) et le niveau de risque d'un studio sans marque. Un prix plus bas aide la conversion des wishlists mais écrase la marge unitaire. Pour le détail du modèle : `POSITIONNEMENT.md` (à produire) |
| Prix régionaux | Grille Steam recommandée par région, ajustée à la main | Valve propose des grilles régionales ; à lire et confirmer dans Steamworks |
| Édition Deluxe | **Cosmétique et bonus numériques seulement** (artbook, bande-son, skins) à +10 à +15 USD | Ne pas fragmenter le contenu de jeu ; pas de « pay-to-win » ; ne coûte presque rien à produire. Repère : Deluxe à +10 $ pour Mafia, Clair Obscur [Presse] |
| DLC | **Un DLC narratif post-lancement (3 à 6 mois)** si le budget le permet ; pas de season pass vendu avant d'avoir le contenu | Règle du studio : n'annoncer que ce que le design tient |
| Démo | **Oui** : démo Steam pour un Next Fest (section 9). L'édition visée sera fixée dans la roadmap (T-010) | Valve et GameDiscoverCo : les démos de showcase sont bonnes pour les ventes |
| Abonnements (Game Pass, PS Plus) | **Hors du plan de base, mais comme option chiffrée en T-015, jamais comme interdit.** Avantages : découverte et audience Xbox, un accord peut transférer une partie du risque (montants non publiés : non vérifié). Inconvénients : risque de cannibaliser les ventes (non mesuré), dépendance aux conditions d'une plateforme en restructuration, accord = contrat soumis à l'humain propriétaire. Les références sont partagées : Clair Obscur, Atomfall et Stalker 2 s'en déclarent satisfaits, Hellblade II ne permet pas de conclure (5.4) | Aucune donnée ne mesure l'effet net. Le day-one est une décision de négociation, à prendre avec des chiffres de T-015, pas une règle |
| Microtransactions | **Non** | Cohérent avec le positionnement premium |

### 6.3 Passage des wishlists aux ventes et recette nette (scénarios) [Estimation]

**Ce bloc est une illustration de calcul, pas une prévision.** Il remplace les anciens scénarios « Prudent / Médian / Haut ». Ces noms induisaient une probabilité (un scénario « médian » à 300 000 unités n'est pas étayé pour une IP inconnue) : les scénarios sont désormais **nommés A, B, C et D, sans valeur de probabilité**. Le choix des probabilités et le point mort relèvent de `business-affairs` (T-015). Conformément à la décision 1 de la Boss, tous les paramètres ci-dessous sont des **hypothèses de sensibilité**, pas des bases de calcul.

**Chaîne de calcul** (chaque étape est une hypothèse) :

1. **Wishlists Steam au lancement** (W) : donnée d'entrée de chaque scénario.
2. **Ventes Steam du lancement** = W × taux de conversion. Taux de référence : **0,10** (médiane GameDiscoverCo pour les jeux à plus de 10 $) ; 0,15 est la médiane pour les jeux à plus de 25 000 wishlists [Analyste]. **L'horizon exact de cette mesure n'est pas précisé dans mes sources** : non vérifié. Je prends 0,10 pour tous les scénarios.
3. **Ventes Steam cumulées après la longue traîne** = ventes du lancement × multiplicateur de longue traîne. **Hypothèse : × 3** (période de deux ans environ, soldes comprises). Ce multiplicateur n'est pas sourcé : **[Estimation] à remplacer par une donnée en T-020 ou T-021**. À faire varier de 2 à 4 en sensibilité.
4. **Ventes toutes plateformes** = ventes Steam cumulées ÷ part de Steam. **Hypothèse : 50 %** (sortie simultanée sur trois plateformes). Repère unique : sur Mafia: The Old Country, ≈33 % des premières ventes viennent de Steam et ≈48 % de la PS5 [Analyste, Sensor Tower] ; Mafia est une franchise connue, donc peu transposable. La part de Steam d'un jeu qui n'a pas de marque est inconnue : **non vérifié**.
5. **Recette nette par exemplaire** = prix catalogue × (1 − part de taxes) × (prix réalisé ÷ prix catalogue) × (1 − remboursements) × (1 − commission).

| Paramètre de la recette nette | Valeur « lancement » | Valeur « longue traîne » | Statut |
|---|---|---|---|
| Part de taxes (TVA et taxes de vente) retirée du prix payé | 8 % | 8 % | [Estimation] : TVA incluse en Europe, non incluse aux États-Unis ; moyenne mondiale non sourcée |
| Prix réalisé ÷ prix catalogue (promotions, soldes, prix régionaux plus bas) | 0,85 | 0,60 | [Estimation] : part des ventes en solde et écart des prix régionaux non sourcés |
| Remboursements | 6 % | 6 % | [Estimation] : taux non sourcé |
| Commission des boutiques | 30 % | 30 % | Steam : standard ; consoles [Mémoire] (section 7) ; **Epic et l'exonération du premier million non pris en compte** |
| **Part du prix catalogue qui revient au studio** | **0,92 × 0,85 × 0,94 × 0,70 ≈ 0,51** | **0,92 × 0,60 × 0,94 × 0,70 ≈ 0,36** | Calcul |

La recette nette par exemplaire est donc **de 36 % à 51 % du prix catalogue**, avant coûts de distribution, de certification et de marketing (T-015). Pour un prix catalogue de **39,99** : **≈14,5 à ≈20,6** par exemplaire. Pour **49,99** : **≈18,2 à ≈25,7**. Les montants sont dans la devise du prix catalogue : **aucune conversion USD / EUR n'est faite**.

| Scénario | W (wishlists Steam au lancement) | Ventes Steam du lancement (W × 0,10) | Ventes Steam cumulées (× 3) | Ventes toutes plateformes (÷ 0,50) | Recette nette à 39,99 (M) | Recette nette à 49,99 (M) |
|---|---|---|---|---|---|---|
| **A** | 20 000 | 2 000 | 6 000 | **12 000** | 0,17 à 0,25 | 0,22 à 0,31 |
| **B** | 100 000 | 10 000 | 30 000 | **60 000** | 0,87 à 1,23 | 1,09 à 1,54 |
| **C** | 300 000 | 30 000 | 90 000 | **180 000** | 2,61 à 3,70 | 3,27 à 4,63 |
| **D** | 1 000 000 | 100 000 | 300 000 | **600 000** | 8,71 à 12,35 | 10,90 à 15,43 |

*Calculs : ventes × (14,52 à 20,58) à 39,99 ; ventes × (18,16 à 25,72) à 49,99. La borne basse utilise la part « longue traîne » (0,36), la borne haute la part « lancement » (0,51) : c'est un encadrement, pas un mélange pondéré.*

**Lecture** :
- Le scénario **A** est **sous 50 000 unités** (12 000) : il représente un jeu qui ne perce pas. Il est plausible au regard des repères de la section 9 (le top 5 % des démos gagne ≈7 000 wishlists en un Next Fest ; la médiane est ≈200), mais **je ne donne pas de probabilité**.
- **B** à **D** ne sont **pas** des cibles. À titre de repère de position, mais non de calibrage : Hellblade II ≈272 k exemplaires **sur Steam seul** [Estimation tierce], dans une marque soutenue par Xbox ; atteindre le scénario D demanderait environ 1 M de wishlists, ordre de grandeur que seuls des titres de marque approchent (non vérifié).
- Sensibilité : avec un taux de conversion de 0,15, toutes les ventes de B à D sont multipliées par 1,5 ; avec une part de Steam à 35 % au lieu de 50 %, elles sont multipliées par ≈1,43 (50 / 35). Ces deux variations sont indépendantes de la qualité du jeu.
- **Corrélation à ne pas oublier** : W, le taux de conversion et la longue traîne dépendent **tous** de la qualité du concept et du marketing. Ils ne sont pas indépendants : les scénarios ne sont pas combinables à volonté.

## 7. Commissions des boutiques

| Boutique | Commission | Niveau de confiance |
|---|---|---|
| **Steam** | 30 % standard ; 25 % sur la part de revenu au-delà de 10 M$ ; 20 % au-delà de 50 M$ (par jeu) [Presse : PC Gamer, Neowin ; une source discordante sur l'application cumulative ou marginale, la lecture marginale de PC Gamer est retenue] | Moyenne. À confirmer dans Steamworks (page inaccessible) |
| **Epic Games Store** | **12 %** (le développeur garde 88 %). **Source nommée : page officielle d'Epic « Revenue share »** (`https://store.epicgames.com/distribution/revenue-programs/revenue-share`) et article d'Epic « Keep 100% of the first $1M per product, per year », relevés via recherche, pages **non ouvertes** [Presse, relevé d'une page de l'éditeur de la boutique]. **Exonération du premier palier** : le développeur garde **100 % du premier million de dollars de revenu net par produit et par année civile**, avec effet au 1er juin 2025 ; le seuil se remet à zéro chaque 1er janvier ; l'application est automatique. **Ambiguïté non levée** : le résumé de la FAQ indique que le programme s'applique « jusqu'au 31 décembre 2025 », alors que la même page parle d'une remise à zéro annuelle à partir de 2026. **Le statut de l'exonération en 2026-2027 est donc non vérifié.** Les revenus recoupables à l'avance par Epic sont déduits avant l'application du 100 % | Moyenne pour le 88/12 ; **faible** pour le statut de l'exonération |
| **PlayStation Store** | Non vérifié par la recherche ; la presse indique que Sony, Microsoft et Nintendo prennent des parts « similaires » à Steam. Taux de 30 % [Mémoire] | Faible |
| **Microsoft Store / Xbox** | Idem ; 30 % [Mémoire] ; 12 % sur le PC Store annoncé il y a quelques années [Mémoire] | Faible |

**Action** : demander à `business-affairs` de confirmer les taux par contrat ou portail partenaire avant tout chiffrage final. Aucune inscription ni engagement n'est effectué sans l'accord de l'humain propriétaire.

## 8. Saisonnalité : un calendrier qui revient chaque année

**Cette section ne propose aucune date ni fenêtre de sortie.** Elle décrit un calendrier récurrent. La date de sortie dépend de la roadmap du `producer` (T-010) ; aucune date écrite ici ne doit servir de référence.

**Éléments relevés, non relus à la source** (aucun n'est vérifié)
- **Trois Steam Next Fest par an : février, juin et octobre.** La documentation Steamworks le dit d'après un résumé de recherche (`https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest`, non ouverte) et GamesRadar le reprend [Valve, via Presse]. Les dates changent chaque année ; **les éditions passées ou en cours ne nous concernent pas**, puisqu'aucun concept n'est choisi. Le calendrier des éditions suivantes est publié par Valve à l'avance [Presse : Digital Citizen].
- **Grandes soldes Steam** : Valve publie un calendrier annuel des soldes et festivals (printemps, été, automne, hiver, plus des soldes thématiques) [Presse : Digital Citizen, GamingOnLinux, PC Gamer]. Le détail des dates n'est pas repris ici (voir remarque ci-dessus). À consulter au moment de la roadmap.
- **Périodes encombrées par les AAA** : le dernier trimestre est le plus chargé en sorties AAA [Mémoire]. En 2026, GTA VI est annoncé au 19 novembre [Presse] ; son issue n'est pas confirmée.
- **Effet d'un Next Fest** : une sortie suffisamment proche d'un Next Fest bénéficie des wishlists gagnées ; les démos publiées bien avant gagnent ≈2,5 fois plus de wishlists que celles publiées pendant l'événement (section 9). Conséquence pour la roadmap : la démo se planifie **à rebours** depuis une édition de Next Fest, que le `producer` choisira.

**À fournir par le `producer` (T-010)** : date de fin de production, édition de Next Fest visée, fenêtre de sortie. L'étude fournira alors les collisions à éviter (soldes, sorties AAA connues à ce moment).

**Éléments non vérifiés** : le calendrier des sorties AAA de l'année de sortie visée (aucune liste fiable trouvée) ; les fenêtres « creuses » par mois.

## 9. Wishlists et démo (Steam Next Fest)

Sources : GameDiscoverCo, Alinea Analytics, Chris Zukowski (enquête auprès de 182 développeurs après le Next Fest de février 2026), Valve (via Game Developer, GamingOnLinux). **Tous lus via synthèses de recherche ; aucune page ouverte.**

- **Les démos de showcase sont bonnes pour les ventes** (GameDiscoverCo, « Steam demo showcases officially good for sales » ; Valve a publié des analyses en 2020-2021) [Analyste].
- **Conversion des wishlists du Next Fest : elles convertissent moins bien par unité, mais il y en a beaucoup plus.** Le rapport de **0,752** vient de l'analyse par GameDiscoverCo des données de Valve du **premier Next Fest, été 2020** : pour 100 wishlists qui se convertissent hors événement, il y en a **521 pendant le Next Fest**, dont **392** se convertissent, soit 392 / 521 ≈ 0,752. Une wishlist du Next Fest convertit donc **environ 25 % moins bien** qu'une wishlist hors événement, mais le volume est ≈5 fois plus grand, d'où ≈3,9 fois plus d'acheteurs. **Ce chiffre date de 2020** et n'a pas été relu à la source ; les éditions récentes peuvent différer [Analyste, GameDiscoverCo, relevé via recherche]. *La version 1 écrivait que ces wishlists « convertissent mieux » : c'était un contresens.*
- **Gains typiques au Next Fest de février 2026** : démo médiane ≈ 11 abonnés (≈ 200 wishlists) ; top 5 % ≈ 350 abonnés (≈ 7 000 wishlists) [Analyste, estimations GameDiscoverCo, basées sur les abonnés]. Enquête Zukowski : médiane ≈ 322 wishlists pour les jeux sous 1 000 avant le fest, ≈ 12 882 pour les jeux à 100 000 et plus. Les démos publiées bien avant le Next Fest gagnent ≈ 2,5 fois plus de wishlists que celles publiées pendant le fest [Analyste].
- **Conversion au lancement (GameDiscoverCo)** : médiane **0,15 × pour les jeux avec plus de 25 000 wishlists** au lancement (sur l'année écoulée), **0,10 × pour les jeux à plus de 10 $** [Analyste]. L'**horizon de temps exact de cette mesure n'est pas précisé dans mes sources** : non vérifié. Arithmétique indicative : 100 000 wishlists × 0,10 = 10 000 exemplaires sur la période mesurée ; viser 100 000 exemplaires Steam sur cette période demanderait de l'ordre de 1 000 000 de wishlists (100 000 / 0,10) [Estimation]. Le chiffrage de la section 6.3 décrit le passage complet vers la longue traîne et les consoles.
- Des sources secondaires listent des « seuils de wishlists » pour être mis en avant, sans méthode claire : **ignorés**.
- **Cible de communication pour la Boss** (hypothèse, à discuter) : démarrer la page Steam « Coming soon » dès que la vertical slice est présentable ; viser la démo pour un Next Fest dont l'édition sera fixée dans la roadmap (T-010) ; mesurer les wishlists par semaine.

## 10. Critères de choix du concept du point de vue marché (grille pour T-004)

Notation de 0 à 3 par critère (3 = favorable). **Les poids sont ceux fixés par la Boss dans `production/validations/T-002.md` (décision 3)** : score marché = somme de (poids × note / 3), sur 100. Critères éliminatoires : une note de 0 sur les critères 4, 5 ou 11. **Cette grille est une méthode, pas un résultat.**

| # | Critère | Poids | Question à poser | Preuve ou repère |
|---|---|---|---|---|
| 1 | **Hook en une phrase et sur une capsule** | 15 | Comprend-on le jeu et son unicité en 3 secondes ? | Les jeux neufs se battent contre le catalogue (21 % du revenu S1 2026) |
| 2 | **Photoréalisme utile au concept** | 10 | Le réalisme sert-il le jeu (horreur, ambiance, lieu) ou n'est-il qu'une démo technique ? | Section 2.2 : le « wow graphique » stagne. Hellblade II est un cas ambigu (5.4) |
| 3 | **Genre porteur et non saturé** | 10 | Genre en section 4, concurrents dominants ? | Section 4 |
| 4 | **Faisabilité AA** | 15 | Durée de jeu, quantité de contenu, équipe ? | Clair Obscur (AA), Atomfall |
| 5 | **Performance 60 fps console** | 10 | Le design évite-t-il l'open world massif et les foules ? | Exigence du studio (CLAUDE.md) |
| 6 | **Prix soutenable (39,99 à 49,99, base USD)** | 8 | La durée et la richesse justifient-elles ce prix ? | Section 6 |
| 7 | **Démo démontrable** | 7 | 20 à 30 minutes jouables et représentatives pour un Next Fest ? | Section 9 |
| 8 | **Potentiel DLC / suite** | 5 | Le monde permet-il une extension ? | Section 6 |
| 9 | **Promesse de rejouabilité ou de bouche-à-oreille** | 10 | Raisons de streamer, de parler du jeu ? | Clair Obscur |
| 10 | **Risque de classification d'âge** | 5 | Contenu limitant l'audience (PEGI 18 / ESRB M) ? À anticiper par concept | Prévu dans un livrable ultérieur |
| 11 | **Risque légal / licence** | 5 | IP, musique, assets tiers ? | `docs/legal/LICENCES.md` |
| | **Total** | **100** | | |

## 11. Risques

| Risque | Gravité | Atténuation |
|---|---|---|
| **Visibilité noyée** par un catalogue très dominant et par les franchises (52,5 % du revenu du top 100 janvier-août) | Élevée | Hook, démo, Next Fest, communauté, trailers |
| **Conversion de wishlists faible** pour un jeu à plus de 10 $ (0,10 ×) | Élevée | Objectifs de wishlists réalistes, démo précoce |
| **Écart de données** (Steam 11,1 Md$ vs 5,36 Md$) : risque de surévaluer le marché | Moyenne | Chiffrer sur scénarios, pas sur un total |
| **Matériel console plus cher** (hausses PS5/Xbox 2026), parc ralenti | Moyenne | Sortie simultanée (scénario de base) : budget de certification et de tests consoles chiffré en T-015 ; repli : décaler les consoles, décision au plus tard à M2 avec l'humain propriétaire |
| **Dépendance à Game Pass / PS Plus** (conditions changeantes, 2027 incertain) | Moyenne | Ne pas l'inclure dans le plan de base ; option chiffrée en T-015 (6.2) |
| **Comparaisons faussées** par le day-one sur abonnement ou les exclusivités (5.4) | Moyenne | Ne jamais agréger joueurs, ventes Steam et ventes consoles ; relire les chiffres en T-020 |
| **Qualité technique au lancement** (cf. Stalker 2) | Élevée | Budget QA/optimisation ; paliers de qualité ; test sur GPU 8 Go (très répandus) |
| **Photoréalisme coûteux** (assets, MetaHuman, temps de rendu) vs équipe réduite | Élevée | Direction artistique ciblée ; périmètre court |
| **Sortie à contre-temps** (périodes encombrées par les AAA, soldes) | Moyenne | Choisir la fenêtre dans la roadmap (T-010) à partir du calendrier récurrent de la section 8 |
| **Chiffres de cette étude non relus à la source** | Moyenne | Relecture après autorisation réseau (T-020) ; usage interne seulement d'ici là |
| **Légal / contractuel** (commissions, régions, EULA) | Moyenne | Validation par un juriste avant tout engagement |

## 12. Données manquantes et actions recommandées

1. **Autoriser l'accès réseau** aux sources de référence (Steamworks, Alinea, GameDev Reports, Gematsu, SteamDB, Gamalytic) pour relire chaque chiffre à la source (**T-020**, bloquée).
2. **Extraire des données par genre et par concept** : revenus par tag, nombre de sorties Steam par an, base installée PS5, part du Steam Deck, tendances consoles (**T-021**).
3. **Données par région et par langue** (**T-022**).
4. **Compléter les prix de lancement** et notes manquants (Silent Hill 2 Remake, Silent Hill f, Stalker 2, Atomfall, Banishers, Hell is Us, Black Myth presse) par une relecture à la source (T-020).
5. **Obtenir les chiffres de ventes de Still Wakes the Deep** (aucun chiffre officiel trouvé) et préciser si le total de Clair Obscur inclut Game Pass.
6. **Confirmer les commissions** consoles et Epic, et le statut de l'exonération du premier million sur 2026-2027, par les portails partenaires.
7. **Mesurer le multiplicateur de longue traîne et la part de Steam** pour un jeu premium sans marque (hypothèses de 6.3).
8. **Vérifier l'issue du lancement de GTA VI** et, quand la roadmap (T-010) aura fixé une date, le calendrier AAA de la période.
9. Prévoir ensuite `POSITIONNEMENT.md`, `BOUTIQUES.md`, `LANCEMENT.md` et la classification d'âge, une fois le concept choisi (tâches à planifier après T-004, hors T-019).

## 13. Sources et dates de consultation

**Principe** : « Date » = date de la recherche qui a renvoyé le résultat (20 novembre 2026 pour la passe T-019 ; novembre 2026 sans jour précis pour la passe T-002). **Aucune page n'a été ouverte** : l'URL est celle que la recherche a renvoyée. « URL non retrouvée » signifie que la recherche de T-019 n'a pas renvoyé de nouveau l'adresse ; je ne l'invente pas.

### 13.1 Sources renvoyées par la passe T-019 (20 novembre 2026)

| Sujet | Source | URL | Date |
|---|---|---|---|
| Revenus Steam S1 2026 | Alinea Analytics, « Steam is having another record year for revenue » | https://alineaanalytics.substack.com/p/steam-is-having-another-record-year | 2026-11-20 |
| Revenus Steam S1 2026, part des nouveautés | WN Hub, relais d'Alinea | https://wnhub.io/news/analytics/item-51407 ; https://wnhub.io/news/stores-and-publishing/item-51420 | 2026-11-20 |
| Revenus Steam janvier-août 2026, top 100 | WN Hub, relais d'Alinea | https://wnhub.io/news/analytics/item-51980 | 2026-11-20 |
| Alinea S1 2026 | Game Industry Library | https://gameindustrylibrary.com/documents/alinea-analytics-steam-reached-highest-revenue-in-history-in-h1-26-sponsored-by-pwn-games | 2026-11-20 |
| Conversion Next Fest (0,752) | GameDiscoverCo, « Steam demo showcases officially good for sales » | https://newsletter.gamediscover.co/p/steam-demo-showcases-officially-good ; https://www.gamedeveloper.com/business/steam-demo-showcases-officially-good-for-sales- | 2026-11-20 |
| Conversion des wishlists | GameDiscoverCo via GameDev Reports | https://gamedevreports.substack.com/p/gamediscoverco-the-state-of-steam ; https://gamedevreports.substack.com/p/gamediscoverco-conversion-benchmarks | 2026-11-20 |
| Next Fest trois par an | GamesRadar ; Steamworks (non ouverte) | https://www.gamesradar.com/games/steam-next-fest-guide ; https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest | 2026-11-20 |
| Calendrier Steam | Digital Citizen | https://www.digitalcitizen.life/valve-reveals-full-steam-sale-and-festival-schedule-through-july-2027/ | 2026-11-20 |
| Prix Steam, devises | Steamworks « pricing » (fragments) | https://partner.steamgames.com/doc/store/pricing | 2026-11-20 |
| Prix recommandés relevés par Valve | WN Hub ; GamesRadar | https://wnhub.io/news/marketing/item-481 ; https://gamesradar.com/steams-new-regional-price-guides-make-games-more-expensive-pretty-much-everywhere-outside-the-us | 2026-11-20 |
| Commission Epic | Epic Games Store, « Revenue share » | https://store.epicgames.com/distribution/revenue-programs/revenue-share | 2026-11-20 |
| Exonération Epic du premier million | Epic Games Store, article d'actualité | https://store.epicgames.com/news/epic-games-store-updates-revenue-share-keep-100-of-the-first-1m-per-product-per-year | 2026-11-20 |
| Epic First Run | Epic Games Store | https://store.epicgames.com/features/epic-first-run-program | 2026-11-20 |
| Mafia: The Old Country, prix | VGC | https://www.videogameschronicle.com/news/mafia-the-old-country-release-date-and-50-price-point-confirmed | 2026-11-20 |
| Mafia: The Old Country, ventes | Pure Xbox ; GamingBolt ; PSU | https://www.purexbox.com/news/2025/08/mafia-the-old-country-off-to-strong-start-across-all-platforms-says-new-sales-analysis ; https://gamingbolt.com/mafia-the-old-country-has-reportedly-sold-more-than-800000-copies-in-four-days ; https://www.psu.com/news/mafia-the-old-country-sales-surpassed-take-twos-internal-expectations/ | 2026-11-20 |
| Mafia: The Old Country, notes | GamesRadar | https://www.gamesradar.com/games/action/mafia-the-old-country-debuts-to-the-second-best-reviews-in-the-series-but-has-been-beaten-in-steam-player-count-by-a-version-of-every-past-entry-so-far | 2026-11-20 |
| Kingdom Come: Deliverance II, ventes | Communiqué Warhorse via Game Developer ; RPG Site | https://www.gamedeveloper.com/press-release/kingdom-come-deliverance-ii-surpasses-6-million-copies-sold-worldwide ; https://www.rpgsite.net/news/20781-kingdom-come-deliverance-ii-has-surpassed-6-million-copies-sold-worldwide | 2026-11-20 |
| Kingdom Come: Deliverance II, notes | Windows Central | https://www.windowscentral.com/gaming/kingdom-come-deliverance-2-reviews-and-metacritic-scores-are-in-heres-what-everyones-saying-about-the-medieval-rpg | 2026-11-20 |
| Still Wakes the Deep | Pure Xbox ; Metacritic (pages non ouvertes) | https://purexbox.com/news/2024/06/roundup-heres-what-the-critics-are-saying-about-still-wakes-the-deep ; https://legacy.prod.metacritic.com/game/pc/still-wakes-the-deep/critic-reviews | 2026-11-20 |
| Alan Wake 2, ventes | Neowin ; Bloody Disgusting ; players.com.ua | https://www.neowin.net/news/remedy-reveals-alan-wake-2-has-sold-two-million-copies-control-2-now-in-full-production/ ; https://bloody-disgusting.com/video-games/3963150/alan-wake-ii-has-now-sold-over-3-million-units/ ; https://players.com.ua/en/news/alan-wake-2-surpasses-3-million-copies-sold-as-control-resonant-gains-momentum/ | 2026-11-20 |
| Alan Wake 2, accord Epic | Wccftech | https://wccftech.com/remedy-defends-epic-games-deal-alan-wake-2/amp/ | 2026-11-20 |
| Alan Wake 2, notes | Tech4Gamers ; Deku Deals | https://tech4gamers.com/alan-wake-2-review-roundup ; https://www.dekudeals.com/items/alan-wake-ii | 2026-11-20 |
| Clair Obscur, Game Pass | Blog Windows (Microsoft) ; Windows Central | https://blogs.windows.com/windowsexperience/2025/12/03/biggest-new-third-party-launch-for-xbox-game-pass-2025-clair-obscur-expedition-33/ | 2026-11-20 |
| Stalker 2, ventes et Game Pass | Windows Central ; Tech4Gamers | https://windowscentral.com/gaming/stalker-2-has-already-reached-an-impressive-sales-milestone-across-xbox-and-pc ; https://tech4gamers.com/stalker-2-game-pass-consoles | 2026-11-20 |
| Stalker 2, notes | ITC.ua | https://itc.ua/en/news/atmospheric-but-full-of-bugs-s-t-a-l-k-e-r-2-debuts-with-76-100-on-metacritic-release-trailer | 2026-11-20 |
| Hellblade II, Game Pass | Inverse ; Game World Observer | https://www.inverse.com/gaming/hellblade-2-proves-microsoft-needs-to-give-their-games-more-visibility ; https://gameworldobserver.com/2024/05/23/hellblade-2-concurrent-players-vs-other-xbox-games | 2026-11-20 |
| Atomfall, Game Pass | VGC ; Windows Central | https://www.videogameschronicle.com/news/rebellion-ceo-hails-xbox-game-pass-as-huge-success-for-indie-hit-atomfall ; https://www.windowscentral.com/gaming/rebellions-atomfall-has-already-reached-1-5-million-players | 2026-11-20 |
| Atomfall, notes | Tech4Gamers ; Metacritic (page non ouverte) | https://tech4gamers.com/atomfall-review-roundup ; https://legacy.prod.metacritic.com/game/playstation-5/atomfall/user-reviews | 2026-11-20 |
| Forza Horizon 6 et Subnautica 2 | Digital Citizen | https://www.digitalcitizen.life/forza-horizon-6-and-subnautica-2-top-steam-sales-despite-game-pass-launches/ | 2026-11-20 |

### 13.2 Sources de la passe T-002 (novembre 2026), sans URL renvoyée dans la passe T-019

URL non retrouvée pour chacune ; consultées uniquement via `WebSearch` (résumés), date : novembre 2026, jour non consigné. À relire en T-020.
- Sensor Tower, « The Premium PC/Console Market » (via GameDev Reports) ; Video Game Insights et Alinea « Year in review 2025 » (via Game Industry Library, mars 2026).
- Newzoo, « The Gaming Market in 2026 » (via GameDev Reports, gamedev.net, God is a Geek, Game World Observer, août 2026).
- Circana : bilans mensuels janvier-août 2026 (via GameDev Reports, Insider Gaming, God is a Geek, Gaming Amigos).
- Konami (via Anime News Network, 14 mai 2026 ; VGC ; OpenCritic ; Windows Central ; The Outer Haven) pour Silent Hill 2 Remake et Silent Hill f.
- Kepler / Sandfall (via Gematsu avril 2026, VGC, TweakTown, Cosmocover) pour Clair Obscur.
- Ninja Theory / Xbox (via GamingBolt, 80.lv, Raijin, Insider Gaming, WN Hub) pour Hellblade II.
- GamesRadar, Insider Gaming, Yicai Global, TweakTown, Push Square, Pure Xbox pour Black Myth: Wukong.
- Neowin, PC Gamer, OpenCritic, Windows Central, Raijin, levvvel.com (site statistique secondaire) pour S.T.A.L.K.E.R. 2.
- Remedy (via GamingBolt) pour Alan Wake 2 ; PC Gamer, Neowin, Push Square pour Atomfall et Banishers ; Sensor Tower VGI, TrueAchievements pour Hell is Us.
- Steamworks, PC Gamer, Insider Gaming, Neowin, GamingOnLinux (calendrier Steam).
- Zukowski, Game Developer, GamingOnLinux, Alinea (wishlists et démos).
- PC Gamer, Neowin, TechCrunch, Fortune (commissions Steam).
- VGC, Push Square, SlashGear, Statista, Player.One, Naavik (prix des consoles).
- PCGamesN, Club386, TBreak, Digital Citizen (enquête matériel Steam, juillet-septembre 2026).
- Push Square, TweakTown, Gaming Bolt, Outlook Respawn (Game Pass et PS Plus).

La commission Epic 88/12, dont la source n'était pas nommée en version 1, est désormais rattachée à la page officielle d'Epic (13.1, section 7).

## 14. Journal des modifications (T-019, 20 novembre 2026)

Chaque ligne relie une correction au numéro de retour de la Boss (`production/validations/T-002.md`).

| Retour | Correction | Où |
|---|---|---|
| **1** | Les deux montants de 2,4 Md$ sont distingués : S1 2026 (tous jeux sortis en 2026, base 11,10 Md$, 21,6 %) et janvier-août 2026 (top 100, base ≈15 Md$, 15,9 %). Tableau période, périmètre, base. Réserve sur la coïncidence des montants, renvoyée à T-020. | 1 (point 3), 2.2 |
| **2** | Sens corrigé : les wishlists du Next Fest convertissent environ 25 % moins bien par unité (rapport 0,752 = 392 / 521, données de 2020), pour un volume ≈5 fois plus grand. Source nommée (GameDiscoverCo, URL en 13.1) ; non relue à la source. | 9 |
| **3** | Intitulé de la section 8 changé en « Éléments relevés, non relus à la source ». Légende de la section 0 complétée ([Presse], [Valve], [Prévision], [Estimation] élargie, [Mémoire], non vérifié) ; crochets sans type remplacés par des étiquettes de la légende. Section 0 reformulée : aucun chiffre n'est présenté comme vérifié. | 0, 2.x, 3, 8 |
| **4** | Prix de référence exprimé en USD (devise de base de Steam), méthode de déclinaison régionale décrite, TVA traitée, équivalence 39,99 € / 44,99 $ **retirée**. Point à arbitrer : sens euro ou dollar de la fourchette. | 1 (point 6), 6.2 |
| **5** | Scénarios nommés A, B, C, D, sans connotation de probabilité ; scénario A à 12 000 unités (sous 50 000) ; chaîne wishlists → ventes de lancement → longue traîne → toutes plateformes ; recette nette par exemplaire (taxes, prix réalisé, remboursements, commission) ; le tout [Estimation] avec hypothèses de sensibilité. | 6.3 |
| **6** | Effet du day-one sur Game Pass (Hellblade II, Clair Obscur, Stalker 2, Atomfall, plus Still Wakes the Deep) et de l'exclusivité Epic d'Alan Wake 2 analysés (nouvelle section 5.4) ; colonne « Distribution » ajoutée au tableau 5.1 ; leçon 5.3.1 réécrite, leçon 5.3.5 renforcée ; ligne « Abonnements » de 6.2 réécrite (avantages, inconvénients, option chiffrée) ; ligne Epic de 2.5 mise à jour ; section 4 et risques ajustés. | 5.1, 5.3, 5.4, 6.2, 2.5, 4, 11 |
| **7** | Trois références photoréalistes de 2024-2025 ajoutées (Still Wakes the Deep, Mafia: The Old Country, Kingdom Come: Deliverance II) avec les mêmes colonnes et une table de proximité avec la cible ; limites signalées (aucune ne cumule IP nouvelle, prix contenu et ventes connues). Notes et prix complétés pour Clair Obscur (prix), Alan Wake 2 (note, ventes à jour), Stalker 2 (note), Atomfall (note) ; les autres champs restent « non vérifié » avec la raison indiquée dans la cellule. | 5.1 |
| **8** | Saisonnalité réécrite comme calendrier récurrent (trois Next Fest par an, grandes soldes, périodes encombrées par les AAA). Fenêtre « printemps ou début d'automne 2027 », échéances de février 2027 et dates de juin 2027 **supprimées**. Aucune date de sortie avant la roadmap du `producer` (T-010). | 1 (point 6), 8, 11 |
| **9** | Section 0 corrigée (aucune page ouverte) ; URL et date de consultation pour chaque source renvoyée par la recherche, mention explicite « URL non retrouvée » pour les autres ; commission Epic reliée à la page officielle d'Epic ; statut de l'exonération du premier million relevé, avec son ambiguïté de dates laissée « non vérifié ». | 0, 7, 13 |
| Décision 2 de la Boss | Scénario de base : sortie simultanée PC, PS5 et Xbox ; « PC d'abord » retiré ; repli = décalage des consoles tranché au plus tard à M2. Démo, Deluxe cosmétique, DLC narratif, abonnements hors plan de base conservés. | 1 (point 6), 6.2, 11 |
| Décision 3 de la Boss | Poids de la grille marché reportés. | 10 |
| **10, 11, 12** | Non traités ici, conformément à la tâche : retours 10 → T-021, 11 → T-022, 12 → T-020. Les données manquantes correspondantes sont listées en 12. | 12 |

*Ce document est un brouillon de travail. Il ne contient ni engagement contractuel ni dépense. Les points juridiques et contractuels devront être relus par un juriste.*
