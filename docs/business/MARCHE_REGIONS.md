# Données de marché par région et par langue (T-022)

- **Auteur** : agent `marketing-publishing`
- **Date de rédaction** : 20 novembre 2026
- **Statut** : brouillon soumis à la validation de la Boss
- **Destinataires** : `localization-manager` (T-017, plan de langues), `business-affairs` (T-015), Boss. Les points de la section 5 sont à relire par un juriste.
- **Documents liés** : `docs/business/ETUDE_MARCHE.md` (non modifiée ici ; corrigée en parallèle par T-019), `production/validations/T-002.md` (retour 11), `docs/vision/CONCEPTS.md` (concepts non validés).

## 0. Méthode, limites et conventions de lecture (à lire en premier)

**Ce qui a été fait.** Recherches via `WebSearch` (20 novembre 2026). Les résultats sont des synthèses de pages ; je n'ai lu aucune page à la source.

**Pages que j'ai tenté d'ouvrir avec `WebFetch`, sans succès** (hôte non résolu : hors des domaines autorisés de la session) : `www.gamingonlinux.com`, `www.digitalcitizen.life`, `store.steampowered.com` (page de l'enquête matériel), `wnhub.io`, `devdocs.xbox.com`. Pour relire ces chiffres, il faudrait autoriser ces hôtes dans les paramètres réseau de la session (décision de l'humain propriétaire, cf. T-020). Je n'ai pas cherché à contourner cette restriction.

**Conséquence : aucun chiffre de ce document n'a été relu sur la page d'origine.** Chaque ligne indique l'étiquette de confiance, la source et la date, avec l'URL quand les résultats de recherche la donnaient.

**Étiquettes** (mêmes que `ETUDE_MARCHE.md`, section 0) :

| Étiquette | Signification |
|---|---|
| **[Annoncé]** | Chiffre communiqué par l'éditeur ou le développeur (via la presse). |
| **[Analyste]** | Estimation d'un cabinet ou d'un outil de données, ou donnée d'un organisme (Valve, Newzoo, Alinea...), lue via un relais. |
| **[Estimation]** | Calcul de ma part, méthode et hypothèses explicites. |
| **[Mémoire]** | Connaissance générale de l'auteur, non confirmée par la recherche. À vérifier avant usage. |
| **non vérifié** | Cherché, non trouvé ou contradictoire. Ne pas utiliser. |

**Règle d'usage (décision 1 de T-002).** Les chiffres [Mémoire] et « non vérifié » ne servent que d'hypothèses de sensibilité, jamais de base de calcul. Aucun chiffre de ce document ne sort du studio avant T-020.

## 1. Répartition des joueurs Steam par langue

### 1.1 Ce que mesure l'enquête Steam, et ce qu'elle ne mesure pas

L'enquête matériel et logiciel de Steam est **volontaire et par échantillon** : elle classe les réponses par **langue de l'interface Steam**, pas par pays, ni par revenu, ni par nombre d'acheteurs. Elle mesure donc une **part d'utilisateurs ayant répondu**, pas un poids commercial. Les résultats récents montrent une forte instabilité (voir 1.2), et la presse relie ces variations à des effets d'échantillonnage.

### 1.2 Chiffres relevés

| Langue | Part des réponses | Mois | Confiance | Source |
|---|---|---|---|---|
| Anglais | **39,04 %** (+4,84 point) | octobre 2026 | [Analyste, Valve via presse] | Digital Citizen, « Linux Gains Steam Market Share as October 2026 Hardware Survey Shows Major Changes » (https://www.digitalcitizen.life/linux-gains-steam-market-share-as-october-2026-hardware-survey-shows-major-changes/), non ouverte |
| Chinois simplifié | **21,98 %** (-9,41 points) | octobre 2026 | [Analyste, Valve via presse] | idem ; en septembre 2026 : 31,39 % (+7,42 points) |
| Russe | **10,14 %** (+1,09 point) | octobre 2026 | [Analyste, Valve via presse] | idem (obtenu à la seconde requête ; la première n'avait pas donné de chiffre russe) |
| Anglais / chinois simplifié | 37,96 % / 24,01 % | octobre 2025 | [Analyste, Valve via presse] | iXBT Games, 3 novembre 2025 (https://ixbt.games/en/news/2025/11/03/valve-nazvala-samye-populiarnye-videokarty-steam-v-oktiabre-2025-goda-i-podtverdila-vaznost-russkoi-l.html), non ouverte |
| Espagnol | 4,11 %, « quatrième langue » | mois non précisé dans le résumé | **non vérifié** | Xataka Colombia (https://www.xataka.com.co/videojuegos/espanol-se-queda-fuera-top-idiomas-utilizados-gamers-steam-revela-su-posicion-ranking-mundial-lenguas-utilizadas-pc), non ouverte |

- **Calcul [Estimation]** : en octobre 2026, anglais + chinois simplifié + russe = 71,16 % ; les 28,84 % restants se répartissent entre toutes les autres langues, dont **je n'ai trouvé aucune part chiffrée pour 2026** (allemand, portugais brésilien, français, japonais, coréen, etc. : non vérifié).
- **Instabilité** : le chinois simplifié passe de 24,01 % (oct. 2025) à 31,39 % (sept. 2026) puis 21,98 % (oct. 2026). Un écart de plus de 9 points en un mois n'est pas un mouvement de marché réel : c'est un artefact d'échantillon. Valve a aussi révisé des chiffres de septembre 2026 d'après la presse (non vérifié à la source). **Il ne faut citer aucune part précise de langue sans fourchette et sans date ; l'ordre de grandeur utile est « anglais environ 4 sur 10, chinois simplifié environ 2 à 3 sur 10, russe environ 1 sur 10 ».** C'est une lecture de ma part [Estimation].
- Un article Gamingonlinux (septembre 2026, https://www.gamingonlinux.com/2026/10/steam-survey-for-september-2026-shows-a-drop-in-linux-with-simplified-chinese-rising/) et un autre de GamesRadar (« English is no longer the biggest language on Steam... », date non précisée, https://www.gamesradar.com/games/english-is-no-longer-the-biggest-language-on-steam-as-chinese-gamers-embrace-pc-gaming-even-harder-after-black-myth-wukong) confirment que le chinois simplifié a dépassé l'anglais certains mois. Contenus non ouverts.
- **Ce qui manque** : le tableau complet de l'enquête (toutes les langues) pour un mois donné. Il est sur la page de Valve, inaccessible ici. Statista publie aussi une série « langue principale des utilisateurs Steam 2024 » (https://www.statista.com/statistics/957319/steam-user-language), derrière un accès que je n'ai pas ouvert.

### 1.3 Poids commercial : ce que dit la recherche

- Alinea (Steam, S1 2026 : 11,1 Md$ de revenus bruts [Analyste], déjà dans l'étude) attribue la hausse à l'arrivée de joueurs asiatiques, notamment chinois ; son bilan 2025 classerait la Chine comme première région de Steam. **Je n'ai vu que des résumés de recherche** (Tom's Hardware, juillet 2026 : https://www.tomshardware.com/video-games/pc-gaming/steam-sales-reportedly-topped-usd11-billion-during-h1-2026-due-to-shifting-trends-staggering-growth-driven-by-influx-of-chinese-players-and-booming-legacy-catalogues ; Alinea : https://alineaanalytics.substack.com/p/steam-is-having-another-record-year). Confiance : [Analyste], non relu.
- Un résumé de recherche évoque que 50 % des comptes Steam seraient chinophones en février 2025. **Non vérifié** (source non identifiable) ; c'est de plus une part de **comptes**, pas de revenus.
- **Aucune répartition des revenus Steam par région (Europe, Amérique du Nord, etc.) n'a été trouvée** : non vérifié.
- **Écart à ne pas oublier** : les joueurs chinois sont très nombreux sur Steam, mais cela ne dit rien de leur dépense moyenne par achat (prix régionaux plus bas, cf. section 3.2). Part d'utilisateurs et part de revenus ne se confondent pas.

## 2. Poids des grandes régions sur PC et consoles

### 2.1 Marché mondial par région (toutes plateformes, mobile compris)

| Région | Donnée | Confiance | Source |
|---|---|---|---|
| Asie-Pacifique | ≈100,7 Md$, ≈47 % du marché mondial 2026 (+6 %) | [Analyste, Newzoo via presse] | Résumé de recherche de GameDev Reports (https://gamedevreports.substack.com/p/newzoo-the-gaming-market-in-2026) et God is a Geek (https://godisageek.com/2026/08/global-games-market-2026/), août 2026 ; non ouvertes |
| Amérique du Nord | 27 % du marché en 2025 ; croissance 2026 de l'ordre de 1,5 % selon une source | [Analyste], une seule source pour la croissance : confiance faible | idem |
| Amérique latine | ≈9,3 Md$, ≈+7,9 % | [Analyste] | idem |
| Moyen-Orient et Afrique | ≈8,5 Md$, ≈+10,3 % | [Analyste] | idem |
| Europe | **non vérifié** (aucun chiffre 2026 trouvé) | | |

- Vérification interne [Estimation] : 100,7 / 213,9 = 47,1 %, cohérent avec le « ≈47 % » relevé. Total 2026 : 213,9 Md$ (déjà dans l'étude).
- **Piège de lecture** : ces parts incluent le **mobile** (121,1 Md$ sur 213,9 Md$ en 2026, voir l'étude). Elles **ne** donnent **pas** le poids de chaque région sur PC et console. Je n'ai trouvé aucune ventilation PC et console par région : non vérifié. Newzoo publie un rapport « PC and Console Market in 2026 » (https://gamedevreports.substack.com/p/newzoo-pc-and-console-market-in-2026), non ouvert.
- Les sources divergent légèrement sur les parts console (22 %) et PC (21 %) ; l'une d'elles cite un total 2025 de 263,7 Md$, incohérent avec le 201,6 Md$ de l'étude : traité comme aberrant, ignoré.

### 2.2 PC

- Voir section 1 : l'audience Steam est dominée par l'anglais, le chinois simplifié et le russe. Le poids régional en revenus est non vérifié hors de la mention « Chine, première région » (Alinea, via résumé).
- Les parts de revenus d'un jeu occidental sur Steam par région sont **non disponibles** publiquement hors outils payants (Gamalytic, VG Insights, SteamDB) ; aucun abonnement n'est pris sans accord de l'humain propriétaire.

### 2.3 PlayStation 5

| Donnée | Valeur | Confiance | Source |
|---|---|---|---|
| Expéditions cumulées | 95,3 M au 30 juin 2026 ; ≈97,9 M au 30 septembre 2026 (2,6 M expédiées au T2 de l'exercice) | [Annoncé, Sony via presse] ; le total 97,9 est [Estimation] = 95,3 + 2,6, confirmé par le titre d'un article Gematsu | Gematsu (https://www.gematsu.com/2026/11/ps5-shipments-top-97-9-million ; https://www.gematsu.com/2026/07/ps5-shipments-top-95-3-million), non ouverts |
| Expéditions de l'exercice précédent | 16 M (contre 18,5 M) | [Annoncé] | résumé de recherche (mmohuts) |
| Japon | plus de 7,5 M de PS5 vendues (suivi de ventes au détail, hors chiffres Sony) ; hausse de prix du modèle de base à 97 980 yens (avril 2026) | [Analyste] ; confiance faible | GamingBolt et autres résumés de recherche |
| Répartition régionale de la base installée | **non vérifié** | | Sony publie des données par région dans ses documents financiers ; non lus |
| Part des revenus PlayStation par région (Amérique du Nord 37 %, Europe 34 %, Asie-Pacifique 19 %, reste du monde 10 %) | **non vérifié** : site de basse qualité, qui mélange revenus et matériel | | à ignorer |

Ceci répond en partie au retour 10 de T-002 (base installée PS5, « non trouvée » dans l'étude), mais la **répartition régionale** manque. À consigner pour T-021.

### 2.4 Xbox Series X|S

- Aucune donnée régionale trouvée : non vérifié. Les seuls repères sont ceux de l'étude (≈4 % du physique américain, Circana).
- Conséquence : en scénario de sortie simultanée (décision 2 de T-002), **je ne peux pas chiffrer le poids par région d'aucune console**. Ne pas inférer de part Xbox par pays.

## 3. Jeux de référence : répartition par langue ou par région

### 3.1 Principe et limites

La seule répartition **publique et gratuite** par langue est celle des avis Steam (langue de rédaction de l'avis, **pas** le pays de l'acheteur). Elle ne donne ni les ventes ni les revenus. Les avis sont aussi un indicateur biaisé (un joueur qui écrit dans sa langue n'est pas représentatif, et la propension à écrire varie selon les cultures). **Toutes les parts ci-dessous sont des [Estimation] de ma part, calculées sur des résumés de recherche.**

| Jeu | Donnée relevée | Part calculée | Confiance |
|---|---|---|---|
| **Clair Obscur: Expedition 33** (réf. de l'étude) | Jour de sortie (24 avril 2025), ≈1 100 avis : chinois simplifié 37,5 %, anglais 35 %, russe 7,9 %, français 4,3 % (données « Steam Scout » citées par WN Hub, https://wnhub.io/news/stores-and-publishing/item-47651 ; page non ouverte). Total des quatre langues : 84,7 % ; les 15,3 % restants ne sont pas détaillés | Part de langue **à J0 sur un petit échantillon** | [Analyste, via résumé], confiance faible. **Ne représente ni la répartition actuelle (plus de 52 000 avis depuis), ni les ventes.** Un biais de lancement est plausible [Estimation] (les avis du jour 0 proviennent des premiers acheteurs PC) |
| **Senua's Saga: Hellblade II** (réf. de l'étude) | Page Steam via résumé de recherche : 4 639 avis anglais sur 9 103 avis toutes langues (même extrait) | Anglais ≈51,0 % des avis (4 639 / 9 103) [Estimation] | Faible. Le total de l'extrait (9 103) diffère du total de l'étude (10 030) : instantanés de dates différentes. La part anglaise reste indicative. Rappel : la version PC exclut les joueurs Xbox et Game Pass (T-002, retour 6) |
| **Still Wakes the Deep** (The Chinese Room, 2024) | Page Steam via résumé de recherche : 6 030 avis anglais sur 9 035 avis toutes langues. D'autres sites donnent 11,8 k avis au total (dates différentes) | Anglais ≈66,7 % des avis (6 030 / 9 035) [Estimation] | Faible, même réserve de date. **Ce jeu n'est pas dans l'étude actuelle** ; il figure dans `CONCEPTS.md` (A.9) et dans la liste de pistes du retour 7 de T-002, donc sera probablement ajouté par T-019 |
| **Silent Hill 2 Remake** (réf. de l'étude) | Un résumé évoque, sans précision de période ni d'édition, que les États-Unis seraient majoritaires, devant le Japon et l'Europe | Aucune part chiffrée | **non vérifié** (non utilisable). Konami donne des totaux mondiaux, pas de ventilation régionale trouvée |

Exemple supplémentaire, **non retenu comme référence** : un billet Substack tiers estime que Stellar Blade et Split Fiction auraient réalisé une part majeure de leurs ventes Steam en Chine (≈56 % et ≈44 %). **Non vérifié**, source unique et non identifiée : à ne pas citer.

### 3.2 Lecture prudente

1. **Le chinois simplifié est une langue de premier plan pour un jeu premium sur Steam** quand le jeu le propose. Cette lecture s'appuie sur un seul cas à J0 (Clair Obscur) et sur la part dans l'enquête Steam ; elle n'est pas démontrée pour un jeu d'horreur ou d'enquête sans marque. Statut : hypothèse.
2. **Pour des jeux occidentaux à forte image, la majorité des avis est en anglais** (≈51 % à ≈67 % sur deux cas) [Estimation]. L'anglais reste la langue source indispensable.
3. **Impossible, avec les données gratuites, de dire quelle langue génère quel revenu.** C'est la question à poser à Steamworks après l'ouverture de la page du jeu (rapports de ventes et de wishlists par pays et par langue), puis à confirmer par l'extraction SteamDB, Gamalytic ou VG Insights (T-020).

## 4. Recommandation de langues en trois paliers (transmise à `localization-manager`, pour T-017)

### 4.1 Définition des paliers

La grille de Steamworks distingue « interface », « voix » et « sous-titres » par langue [Mémoire] ; je m'y aligne :

- **Palier 1, texte** : interface, menus, textes écrits dans le monde (journaux, documents, objets lisibles) et page de boutique.
- **Palier 2, sous-titres** : palier 1 plus sous-titres complets de tous les dialogues.
- **Palier 3, doublage** : palier 2 plus voix dans la langue.

Les paliers sont emboîtés (3 est dans 2, 2 est dans 1). Pour un jeu **solo narratif**, comme les trois concepts, un palier 1 sans sous-titres est une solution faible : je le propose seulement pour les langues où le sous-titrage complet n'est pas justifié.

### 4.2 Langues attendues par le marché, et ce qui l'étaye

| Langue | Étayé par une donnée de ce document ? | Statut proposé |
|---|---|---|
| Anglais | Oui : 1re langue Steam (≈39 % en oct. 2026), 51 à 67 % des avis des références | Source, tous les paliers |
| Chinois simplifié | Oui : 2e langue Steam (22 à 31 % selon le mois), 1re langue d'avis de Clair Obscur à J0 | Palier 2 |
| Russe | Oui : 3e langue Steam (≈10 %), 3e langue d'avis de Clair Obscur à J0 | Palier 2, **sous réserve de la section 5.4 (distribution)** |
| Français, allemand, espagnol, portugais brésilien, japonais, coréen | **Non** : aucune part 2026 trouvée (seul l'espagnol : 4,11 %, non vérifié). Choix par convention de l'industrie [Mémoire] ; le français est aussi une langue des concepts (`CONCEPTS.md`, C.3) | Palier 2 (candidates), à confirmer par les données de T-020 |
| Italien, polonais, turc, chinois traditionnel, espagnol d'Amérique latine | **Non** | Palier 1 en candidates, **non chiffrées**, décision après les premières données de wishlists par langue |
| Doublage | **Aucune donnée de marché trouvée sur la demande de doublage** : non vérifié | Palier 3 : anglais seul comme base. Un second doublage (français est cité dans `CONCEPTS.md` C.3, C.7) relève d'un arbitrage de budget (T-015), pas d'une exigence de marché prouvée |

### 4.3 Proposition pour T-017

| Palier | Langues proposées | Remarque |
|---|---|---|
| **3, doublage** | anglais (base) ; français en option, selon le concept retenu et le budget | La capture faciale d'un concept comme AVEUX lie la synchronisation labiale à la langue ; chaque doublage supplémentaire est un poste lourd (`CONCEPTS.md`, C.3, C.7) |
| **2, sous-titres** | anglais, chinois simplifié, russe (sous réserve), français, allemand, espagnol, portugais brésilien, japonais, coréen | Les trois premières sont étayées par ce document ; les six suivantes sont par convention [Mémoire] |
| **1, texte** | + italien, polonais, turc, chinois traditionnel, espagnol d'Amérique latine | Candidates ; coût au mot à chiffrer par `localization-manager` ; décision après T-020/T-021 |

Le volume de texte diffère beaucoup selon le concept (répliques estimées par le `game-director` : A 1 500 à 2 500, B 4 000 à 6 000, C 6 000 à 9 000 ; estimations de `CONCEPTS.md`, non validées). C'est un facteur de coût majeur pour les paliers 2 et 3.

### 4.4 Exigences des plateformes (distinctes des attentes du marché)

| Plateforme | Ce que j'ai trouvé | Confiance |
|---|---|---|
| **Xbox** | Le test XR-003 vérifie que le jeu démarre et affiche la bonne localisation pour **chaque langue prise en charge** ; en langue de console non prise en charge, repli en anglais ; les métadonnées de la fiche Microsoft Store doivent être localisées. La page XR-006 contient un tableau d'exigences de langues par région de sortie : **je n'ai pas pu lire le contenu du tableau** (hôte devdocs.xbox.com inaccessible) | Moyenne pour XR-003 (résumé de recherche), **non vérifié** pour XR-006 |
| **PlayStation** | Les TRC existent mais ne sont accessibles qu'aux développeurs enregistrés : **aucune exigence de langue vérifiée** | non vérifié |
| **Steam** | Pas d'exigence de nombre de langues connue de ma part [Mémoire] ; aucune page lue | [Mémoire] |
| **Epic** | Rien trouvé | non vérifié |

**Aucune exigence de langue des plateformes n'est donc confirmée.** À vérifier par `business-affairs` après accès aux portails partenaires (aucune inscription ni compte créé ici). Jusqu'à là, la liste des paliers ne repose que sur le marché et la convention.

## 5. Points d'attention par région (classification et distribution)

**Aucune conclusion juridique. Tout ce qui suit est une liste de points à faire relire par un juriste avant toute décision.** Les informations viennent de résumés de recherche et de [Mémoire].

### 5.1 Classification d'âge

| Système | Zone | Ce que j'ai trouvé | Confiance |
|---|---|---|---|
| ESRB | Amérique du Nord | Autorité participante d'IARC | [Analyste], résumé de recherche (ESRB, Wikipedia IARC) |
| PEGI | Europe | Autorité participante d'IARC (note : PEGI est un système de classification, sa participation à IARC figure dans les résultats) | idem |
| USK | Allemagne | Autorité participante d'IARC | idem |
| ClassInd | Brésil | Autorité participante d'IARC | idem |
| GRAC | Corée du Sud | Participante à IARC depuis 2017 (ESRB, blog officiel : https://www.esrb.org/blog/republic-of-koreas-game-rating-and-administration-committee-grac-becomes-newest-participant-in-iarc-rating-system/) | [Annoncé], non ouvert |
| CERO | Japon | **Absent des listes IARC que j'ai trouvées** ; système séparé | [Analyste], confiance faible |
| Autres autorités IARC citées | Australie, Taïwan, Arabie saoudite, Indonésie | Citées dans des listes de contacts IARC, sources divergentes sur dates et périmètre | faible |

- **Boutiques utilisant IARC** : l'Epic Games Store et le PlayStation Store d'après les résultats. **Steam et Xbox : non confirmé par ma recherche.**
- **À faire vérifier** : quelles notes sont obtenues via questionnaire IARC (gratuit, par boutique), lesquelles exigent un dossier séparé (CERO notamment, côté PS5 et Xbox au Japon), et si une note d'autorité nationale est exigée pour la distribution physique ou numérique (Allemagne, Corée du Sud, Australie, Brésil) [Mémoire].
- **Concepts** : la classification anticipée est PEGI 16 (A, C) et PEGI 12 (B), hypothèse du `game-director`, non vérifiée. Les thèmes sensibles de C (coercition policière, faux aveux) et d'A (horreur) pourraient peser sur plusieurs systèmes, ce qui est un **point à instruire par concept après T-004**, pas une conclusion.

### 5.2 Chine continentale

- La vente officielle d'un jeu en Chine continentale exige en général une **licence de publication (ISBN, « licence de jeu »)** de l'administration NPPA ; un éditeur chinois doit détenir une licence de service de publication en ligne ; une entreprise étrangère ne peut pas la demander seule, et un partenariat via Hong Kong ou Macao ne remplace pas la licence. Le cadre ne prévoit ni recours formel ni délai (résumé d'un rapport du ministère néo-zélandais des affaires étrangères, https://www.mfat.govt.nz/assets/Trade-General/Trade-Market-reports/Chinas-Gaming-Market-Scale-Growth-and-a-Distinct-Regulatory-Environment.pdf ; Niko Partners via résumé). Confiance : [Analyste], moyenne.
- **Importations** : un suivi chiffre 46 importations sur 1 571 approbations cumulées à fin septembre 2026 (≈1 525 nationales) ; aucune approbation de grand éditeur occidental cité dans le lot d'août (tech-insider.org, https://tech-insider.org/china-approves-209-games-september-2026/ ; Niko Partners https://substack.nikopartners.com/p/china-approves-197-video-games-in). Confiance : [Analyste], source secondaire. Ces chiffres couvrent surtout le mobile et le PC en ligne [Mémoire].
- **Ce que je ne peux pas dire** : comment les joueurs chinois achètent des jeux sur Steam sans licence locale (page non trouvée), ni les contraintes de contenu (horreur, sujets historiques, représentation de la police dans le concept C) : **non vérifié**. Il faut un conseil juridique spécialisé avant d'affirmer qu'un contenu est vendable ou non en Chine.
- **Impact sur les langues** : le chinois simplifié reste un choix de langue pertinent pour des joueurs Steam même si une édition officielle en Chine n'est pas visée. C'est un choix de marché, pas une position sur la légalité de la distribution.

### 5.3 Autres régions

| Région | Point à instruire | Confiance |
|---|---|---|
| Allemagne | Système USK ; contraintes historiques sur certains symboles et contenus violents [Mémoire] | [Mémoire] |
| Corée du Sud | Note GRAC ; règles locales sur la distribution et sur les mineurs [Mémoire] | [Mémoire] |
| Japon | Note CERO propre aux consoles [Mémoire] ; sensibilités de contenu et de représentation | [Mémoire] |
| Brésil | ClassInd ; règles locales de classification | résumé (IARC) |
| Australie | Autorité de classification propre | résumé (IARC) ; contenu précis non lu |
| Moyen-Orient | Autorités de classification et de contenu locales (Arabie saoudite citée par IARC) ; restrictions possibles sur les thèmes | faible |
| Prix régionaux et taxes | Steam propose des prix régionaux (T-002, retour 4) ; TVA et taxes numériques variables par pays | [Mémoire] |

### 5.4 Distribution, paiements et sanctions

- **Russie** : le russe est la 3e langue de l'enquête Steam (≈10 %). Les conditions de vente et de paiement dans ce marché (sanctions, restrictions de paiement, règles des consoles) évoluent et **ne sont pas vérifiées ici**. Je classe donc le russe en palier 2 « sous réserve » : la traduction peut se justifier par l'audience Steam, mais une analyse juridique doit confirmer la possibilité de vendre ou de percevoir des revenus. **Pas de conclusion.**
- **Conditions de distribution par plateforme et par territoire** (Sony, Microsoft, Valve, Epic) : listes de territoires et contrats **non lues**. À obtenir par `business-affairs` après autorisation de l'humain propriétaire.

## 6. Données manquantes et actions recommandées

1. **Autoriser l'accès** aux hôtes bloqués (`store.steampowered.com`, `www.gamingonlinux.com`, `www.digitalcitizen.life`, `wnhub.io`, `devdocs.xbox.com`) pour relire les chiffres et obtenir le tableau complet de l'enquête Steam (T-020).
2. **Obtenir la liste complète des langues** de l'enquête Steam pour au moins six mois, afin de remplacer l'instantané instable par une moyenne.
3. **Données par pays et par langue** issues de Steamworks (wishlists, ventes) dès l'ouverture de la page du jeu, plus extraction SteamDB, Gamalytic ou VG Insights : seul moyen de relier langue et revenus.
4. **Lire les exigences de langue** des portails Sony et Microsoft (XR-006 et TRC) : `business-affairs`.
5. **Répartition régionale PC et console** de Newzoo (rapport « PC and Console Market in 2026 ») et de Sony/Microsoft (documents financiers).
6. **Instruction juridique** de la section 5, avant tout engagement de langue ou de territoire.
7. **Ajouter Still Wakes the Deep et Silent Hill 2** (avec des parts régionales vérifiées) aux références, lors de T-019 et T-021.

## 7. Avertissement

Ce document est un brouillon de travail. Il ne contient aucune conclusion juridique, aucun engagement contractuel ni aucune dépense. Les points de classification, de distribution et de territoires (section 5) devront être relus par un juriste. Aucun chiffre ne doit sortir du studio avant la vérification à la source (T-020).
