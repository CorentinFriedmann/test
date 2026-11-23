# Budget des trois concepts (T-015)

> **Brouillon à faire valider par un expert-comptable** (et par un juriste pour les points contractuels) avant tout usage.
> Aucun engagement, aucune signature, aucune dépense sans l'accord explicite de l'humain propriétaire du projet.

- **Date** : 23 novembre 2026. **Auteur** : `business-affairs`. **Statut** : brouillon soumis à la Boss, pour T-004.
- **Fichiers liés** : `docs/business/FINANCEMENT.md` (pistes de financement). Registre des licences : T-024, pas encore fait.
- **Mode économe** : le modèle de calcul est un script jetable ; les règles et les paramètres sont tous écrits ici, pour qu'un expert-comptable puisse les refaire.

## 0. À lire en premier : ce que ce document dit et ne dit pas

1. **Presque tout le chiffrage est une hypothèse de travail.** Aucun devis n'a été demandé (cela engagerait le studio). Les seules données sourcées sont : les effectifs et durées de `CONCEPTS.md` v1.1, les prix et les paramètres de recette de l'étude de marché, le coût de Git LFS (`ARCHITECTURE.md`), la redevance du moteur et le taux de change (section 8). Tout le reste porte l'étiquette **[Hypothèse]**, avec une fourchette basse / médiane / haute à remplacer par des devis.
2. **Sources de chiffres externes non relues à la source** : le réseau de la session est restreint. Les pages officielles ont été relevées par recherche web ; **aucune n'a pu être ouverte** (les pages d'Epic, du CNC, de la BCE et de l'administration fiscale ne sont pas ouvertes). Elles sont marquées « relevé via recherche, non vérifié à la source ».
3. **Résultat principal, à regarder en face** : avec ces hypothèses, **le point mort de chaque concept (au centre : environ 0,7 M d'exemplaires pour A, 1,2 M pour B, 0,9 M pour C) est au-dessus des fourchettes prudentes de ventes de T-021** (A 75 à 300 k ; B 30 à 200 k ; C 25 à 150 k). Ces fourchettes sont des hypothèses de sensibilité, pas des prévisions, mais l'écart est d'un facteur 2 à 6 au centre. Aucun concept n'est rentable sans **financement externe qui couvre une part importante du budget**, une **réduction du périmètre** ou un **éditeur**. C'est une information pour T-004, pas un verdict : les hypothèses de coût peuvent être trop hautes, et c'est le premier point que les devis et l'expert-comptable doivent trancher.
4. Les montants du budget sont en **euros hors taxes** (la TVA déductible n'est pas un coût). Les recettes sont en **USD** (décision 1 de T-019) et converties en euros **sur la recette nette uniquement**, au taux de la section 8.

## 1. Méthode

### 1.1 Équipe humaine
- Effectifs au pic et durées par phase : `CONCEPTS.md` A.10, B.10, C.10, **non modifiés**.
- **ETP moyens par phase** [Hypothèse] : 35 % du pic en préproduction, 85 % en production, 100 % de l'Alpha au Gold. Le pic n'est pas tenu pendant toute la durée.
- **Coût chargé par ETP et par mois** [Hypothèse, aucune source ; à remplacer par la grille de salaires réelle et les charges patronales selon l'expert-comptable] : **6 000 / 7 000 / 8 500 €** (bas / médian / haut), soit environ 72 / 84 / 102 k€ par an. Il inclut salaire brut, charges patronales et congés ; il ne couvre pas les freelances (ligne séparée).
- **Frais généraux** (locaux, assurances, matériel de bureau courant, administration) [Hypothèse] : 8 / 10 / 12 % du coût de l'équipe. Ce poste n'était pas dans la liste demandée ; je l'ajoute parce qu'un budget qui l'oublie sous-estime la trésorerie.
- **Support après lancement** [Hypothèse] : 3 mois à 20 % de l'effectif au pic (correctifs, patchs de certification).

### 1.2 Fourchettes
- **Bas** = effectif bas, durée basse, coût par ETP bas, devis bas. **Haut** = tout haut. **Médian** = milieu de chaque fourchette. Les bas et hauts cumulent volontairement tous les écarts : ce sont des **bornes**, pas des cas probables.
- **Provision pour aléas** (règle de T-023, décision 1) : pourcentage du sous-total, fixé par **le nombre de risques à 9 ou plus** de `CONCEPTS.md` 5.1 : 1 risque (A) = 15 % ; 2 risques (C) = 20 % ; 3 risques dont un à 12 (B) = 25 % au centre ; bas = centre − 5 points, haut = centre + 5 points. **[Hypothèse]** : les pourcentages sont de mon fait ; seule la règle de comptage vient de T-023. La provision ne remplace pas le chiffrage des mitigations (prototypes à M1), qui sont dans l'équipe.
- Les durées sont celles du concept, **sans marge de planning** : un retard de 3 mois coûte environ un huitième à un onzième du coût d'équipe selon le concept.

## 2. Concept A. ESTRAN

Source des effectifs et durées : `CONCEPTS.md` A.10 (22 à 33 ETP, 26 à 32 mois). Montants en k€ HT, [Hypothèse] sauf mention contraire.

| Poste | Bas (k€) | Médian (k€) | Haut (k€) |
|---|---:|---:|---:|
| Équipe humaine | 2 640 | 4 259 | 6 802 |
| Frais généraux (locaux, assurances, administration) | 211 | 426 | 816 |
| Support post-lancement (3 mois, 20 % de l'équipe) | 79 | 116 | 168 |
| Freelances et sous-traitance d'art | 100 | 200 | 350 |
| Assets sous licence (Fab, scans, plugins) | 30 | 60 | 120 |
| Capture de mouvement et faciale, casting, droits | 80 | 140 | 220 |
| Voix et doublage | 40 | 70 | 110 |
| Localisation | 40 | 70 | 110 |
| Audio externe (musique, sound design) | 60 | 110 | 180 |
| Kits de développement et machines de test | 106 | 156 | 238 |
| Certification et classification d'âge | 15 | 30 | 60 |
| Tests de compatibilité et QA externe | 75 | 130 | 210 |
| Outils et licences logicielles (dont Git LFS) | 54 | 115 | 251 |
| Juriste (contrats, licences, régions) | 20 | 35 | 60 |
| Expert-comptable | 31 | 52 | 96 |
| Consultant métier (secours en montagne) | 0 | 0 | 0 |
| Marketing de lancement | 150 | 300 | 600 |
| Sous-total avant aléas | 3 732 | 6 269 | 10 392 |
| **Provision pour aléas** (10 / 15 / 20 %) | 373 | 940 | 2 078 |
| **TOTAL** | **4 105** | **7 209** | **12 470** |
| Durée de production (mois) | 26 | 29 | 32 |
| ETP au pic / personnes-mois | 22 / 440 | 27,5 / 608 | 33 / 800 |

- **Sous-traitance prévue** (`CONCEPTS.md` A.10) : petit casting (6 à 8 rôles), musique, localisation, QA externe, appui au portage. Postes dominants annoncés : art de l'environnement, système de marée et d'eau, audio ; ils sont dans l'équipe et les freelances.
- Variante de prix : 29,99 (base) et 39,99 (variante haute). « Sans combat » est une hypothèse de périmètre (T-001, décision 4) : un combat ajouté changerait le budget, non chiffré.

## 3. Concept B. DERNIÈRE POSITION CONNUE

Source des effectifs et durées : `CONCEPTS.md` B.10 (36 à 53 ETP, 34 à 42 mois). Montants en k€ HT, [Hypothèse] sauf mention contraire.

| Poste | Bas (k€) | Médian (k€) | Haut (k€) |
|---|---:|---:|---:|
| Équipe humaine | 5 638 | 9 080 | 14 506 |
| Frais généraux (locaux, assurances, administration) | 451 | 908 | 1 741 |
| Support post-lancement (3 mois, 20 % de l'équipe) | 130 | 187 | 270 |
| Freelances et sous-traitance d'art | 250 | 450 | 750 |
| Assets sous licence (Fab, scans, plugins) | 80 | 150 | 250 |
| Capture de mouvement et faciale, casting, droits | 250 | 400 | 650 |
| Voix et doublage | 150 | 250 | 400 |
| Localisation | 70 | 120 | 180 |
| Audio externe (musique, sound design) | 90 | 160 | 260 |
| Kits de développement et machines de test | 158 | 231 | 348 |
| Certification et classification d'âge | 15 | 30 | 60 |
| Tests de compatibilité et QA externe | 135 | 230 | 350 |
| Outils et licences logicielles (dont Git LFS) | 115 | 241 | 526 |
| Juriste (contrats, licences, régions) | 25 | 45 | 75 |
| Expert-comptable | 41 | 68 | 126 |
| Consultant métier (secours en montagne) | 15 | 30 | 50 |
| Marketing de lancement | 300 | 600 | 1 100 |
| Sous-total avant aléas | 7 912 | 13 180 | 21 643 |
| **Provision pour aléas** (20 / 25 / 30 %) | 1 582 | 3 295 | 6 493 |
| **TOTAL** | **9 494** | **16 475** | **28 135** |
| Durée de production (mois) | 34 | 38 | 42 |
| ETP au pic / personnes-mois | 36 / 940 | 44.5 / 1297 | 53 / 1707 |

- **Sous-traitance prévue** (`CONCEPTS.md` B.10) : capture de mouvement importante (traversée, portage), doublage de 20 à 30 rôles, musique, localisation, QA externe, consultant en secours en montagne (ligne dédiée).
- **Sans chien de recherche** (T-001, décision 3) ; le chien est une option chiffrée à part (section 5). Le budget est celui d'un concept à **risque très élevé** (B1 à 12, 60 fps sur Series S).

## 4. Concept C. AVEUX

Source des effectifs et durées : `CONCEPTS.md` C.10 (23 à 34 ETP, 24 à 30 mois). Montants en k€ HT, [Hypothèse] sauf mention contraire.

| Poste | Bas (k€) | Médian (k€) | Haut (k€) |
|---|---:|---:|---:|
| Équipe humaine | 2 525 | 4 075 | 6 517 |
| Frais généraux (locaux, assurances, administration) | 202 | 407 | 782 |
| Support post-lancement (3 mois, 20 % de l'équipe) | 83 | 120 | 173 |
| Freelances et sous-traitance d'art | 100 | 180 | 300 |
| Assets sous licence (Fab, scans, plugins) | 30 | 60 | 100 |
| Capture de mouvement et faciale, casting, droits | 350 | 550 | 850 |
| Voix et doublage | 150 | 250 | 400 |
| Localisation | 100 | 180 | 280 |
| Audio externe (musique, sound design) | 50 | 90 | 150 |
| Kits de développement et machines de test | 104 | 155 | 233 |
| Certification et classification d'âge | 15 | 30 | 60 |
| Tests de compatibilité et QA externe | 75 | 130 | 200 |
| Outils et licences logicielles (dont Git LFS) | 52 | 110 | 240 |
| Juriste (contrats, licences, régions) | 35 | 60 | 100 |
| Expert-comptable | 29 | 49 | 90 |
| Consultant métier (secours en montagne) | 0 | 0 | 0 |
| Marketing de lancement | 150 | 300 | 550 |
| Sous-total avant aléas | 4 050 | 6 745 | 11 025 |
| **Provision pour aléas** (15 / 20 / 25 %) | 607 | 1 349 | 2 756 |
| **TOTAL** | **4 657** | **8 094** | **13 782** |
| Durée de production (mois) | 24 | 27 | 30 |
| ETP au pic / personnes-mois | 23 / 421 | 28,5 / 582 | 34 / 767 |

- **Sous-traitance prévue** (`CONCEPTS.md` C.10) : 20 à 25 comédiens avec capture du corps et du visage, cession des droits à l'image et à la voix, doublage anglais et français, localisation d'un gros volume de texte, QA externe. La ligne « Capture… casting, droits » est le poste le plus incertain du concept : il dépend du statut des comédiens et des contrats (risque C6) et doit être chiffré par devis.
- Le budget de C est **majoritairement variable avec le casting** : une réduction à 5 affaires (repli de C3) le baisse, non chiffrée ici.

## 5. Options chiffrées à part (hors budget de base)

| Option | Bas (k€) | Médian (k€) | Haut (k€) | Hypothèse |
|---|---:|---:|---:|---|
| **Chien de recherche scénarisé (concept B)** | 134 | 281 | 547 | 2 / 3 / 4 ETP (animation quadrupède, IA) pendant 8 / 10 / 12 mois au coût chargé de la section 1, frais généraux inclus, plus 30 / 50 / 90 k€ de capture ou d'animation externe. Ajouterait du risque sur B3 (animation) : la provision de B n'est pas relevée. |
| **DLC narratif post-lancement, A** | 137 | 325 | 650 | 15 / 25 / 35 % de l'équipe médiane pendant 4 / 5 / 6 mois, plus un devis externe (voix, audio) de 30 / 60 / 100 k€. Décision T-002 : un DLC narratif « si le budget le permet ». |
| **DLC narratif, B** | 223 | 528 | 1 060 | idem, externe 50 / 100 / 170 k€ |
| **DLC narratif, C** | 151 | 354 | 700 | idem, externe 40 / 80 / 130 k€ (voix, capture) |
| **Édition Deluxe cosmétique** | négligeable | négligeable | négligeable | Artbook, bande-son, skins : travail de l'équipe existante (T-002). Non chiffré. |
| **Accord d'abonnement (Game Pass, PS Plus)** | non chiffré | non chiffré | non chiffré | **Calculé comme un seuil, jamais comme un montant** (T-019, décision 2) : voir section 7.5. |

Les DLC ne sont **pas** dans le point mort de base : leur recette n'est pas modélisée. Tout contact avec Microsoft ou Sony pour un abonnement est un engagement : il exige l'accord de l'humain propriétaire.

## 6. Synthèse comparative (pour T-004)

Une ligne par concept. Budget en M€ HT, bas / médian / haut. Point mort en unités vendues, toutes plateformes, **au prix de base**, **budget médian**, recette nette à 41 % du prix catalogue, 1 USD = 0,899 €, sans aide. Les fourchettes de ventes sont les **hypothèses de sensibilité nommées** de T-021, pas des prévisions.

| Concept | Durée (mois) | Budget (M€) bas / médian / haut | Prix de base (USD) | Point mort médian (unités) | Plage du point mort (bon cas à mauvais cas, voir 7.1) | Ventes T-021 (hypothèse) | Médian ÷ borne haute T-021 | Risque (règle 5.1) |
|---|---|---|---:|---:|---:|---|---:|---|
| **A. ESTRAN** | 26 à 32 (médian 29) | 4,1 / **7,2** / 12,5 | 29,99 | **698 k** | 318 k à 1 379 k | 75 k à 300 k | ×2.3 | Élevé (1 risque à 9) |
| **B. DERNIÈRE POSITION CONNUE** | 34 à 42 (médian 38) | 9,5 / **16,5** / 28,1 | 39,99 | **1 201 k** | 555 k à 2 338 k | 30 k à 200 k | ×6.0 | Très élevé (max 12, 3 à 9 ou plus) |
| **C. AVEUX** | 24 à 30 (médian 27) | 4,7 / **8,1** / 13,8 | 24,99 | **941 k** | 434 k à 1 830 k | 25 k à 150 k | ×6.3 | Élevé (2 risques à 9) |

**Lecture** :
- Classement par budget médian : A < C < B. A et C sont proches (écart d'environ 1 M€ en médian) ; B coûte plus du double. B est aussi le concept dont la recette de base par exemplaire est la plus haute (39,99), mais son point mort reste le plus haut en unités.
- Aucun concept n'atteint son point mort dans la fourchette haute de T-021 au budget médian. **A est le plus proche** (point mort médian ≈ 2,3 fois la borne haute de T-021 ; borne favorable ≈ 1 fois). **C** est pénalisé par un prix de base de 24,99, au-dessus de ce que le genre a prouvé. **B** est le moins plausible commercialement : *Echoes of the End* (39,99 USD, ≈ 27 à 68 k exemplaires Steam, [Estimation] T-021) contredit le prix de base de B.
- Le facteur qui change le plus le résultat n'est pas le concept mais **la part du budget financée par des aides** (section 7.2) et **le coût réel par ETP** (hypothèse non sourcée).

## 7. Point mort

### 7.1 Méthode
- **Prix catalogue en USD** (décision 1 de T-019). Les prix de `CONCEPTS.md` se lisent « même nombre, en USD ». Base : A 29,99 ; B 39,99 ; C 24,99 (T-001, décision 5). Variantes : 39,99 pour A et C (haute) ; pour B : 49,99 (haute) et 29,99 (test de contradiction avec *Echoes of the End*) ; 29,99 pour C en intermédiaire.
- **Recette nette par exemplaire = 0,41 × prix catalogue** (valeur centrale de T-019, décision 2, cohérente avec la chaîne de `ETUDE_MARCHE.md` 6.3 : taxes, soldes, remboursements, commission de 30 % sur toutes les boutiques). **0,36 et 0,51 ne servent qu'en sensibilité** ; 0,51 n'est jamais central. Epic à 12 % et son exonération ne sont pas utilisés.
- **Redevance du moteur** : 5 % du revenu brut du produit au-delà de 1 M USD à vie, par produit [Epic, EULA, voir section 8, non vérifié à la source]. Hypothèse : revenu brut = recette nette ÷ 0,70 (avant commission). Elle n'apparaît dans le point mort qu'au-delà de ce seuil.
- **Taux de change** : 1 USD = 0,899 € (BCE 1,1127 USD pour 1 €, 11 novembre 2026, relevé via recherche). Sensibilité ± 10 %.
- **Point mort** = nombre d'exemplaires dont la recette nette convertie couvre le **budget total du concept** (provision incluse). Il ne tient compte ni du temps (pas d'actualisation), ni des DLC, ni des aides (sauf 7.2), ni du coût du financement.
- Colonnes : « bon cas » = budget bas avec k = 0,51 ; « central » = budget médian, k = 0,41 ; « mauvais cas » = budget haut, k = 0,36. Ce sont des **bornes qui cumulent tous les écarts**.

### 7.2 Résultats (milliers d'exemplaires, toutes plateformes)

| Concept et prix (USD) | Bon cas | **Central** | Mauvais cas | Central, euro +10 % (USD −9 %) | Central, euro −10 % (USD +11 %) | Central, k = 0,36 | Central, k = 0,51 | Central, 15 % du budget financé | Central, 30 % financé |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A. ESTRAN à 29,99 (base) | 318 k | **698 k** | 1 379 k | 768 k | 628 k | 795 k | 561 k | 593 k | 487 k |
| A. ESTRAN à 39,99 | 239 k | **524 k** | 1 034 k | 576 k | 471 k | 596 k | 421 k | 445 k | 366 k |
| B. Dernière position à 29,99 | 740 k | **1 601 k** | 3 118 k | 1 762 k | 1 441 k | 1 824 k | 1 287 k | 1 360 k | 1 120 k |
| B. Dernière position à 39,99 (base) | 555 k | **1 201 k** | 2 338 k | 1 321 k | 1 080 k | 1 368 k | 965 k | 1 020 k | 840 k |
| B. Dernière position à 49,99 | 444 k | **961 k** | 1 870 k | 1 057 k | 864 k | 1 094 k | 772 k | 816 k | 672 k |
| C. AVEUX à 24,99 (base) | 434 k | **941 k** | 1 830 k | 1 036 k | 847 k | 1 072 k | 757 k | 799 k | 657 k |
| C. AVEUX à 29,99 | 361 k | **784 k** | 1 525 k | 863 k | 706 k | 893 k | 631 k | 666 k | 548 k |
| C. AVEUX à 39,99 | 271 k | **588 k** | 1 143 k | 647 k | 529 k | 670 k | 473 k | 500 k | 411 k |

Notes de lecture : Le taux de référence 1,1127 USD pour 1 € est multiplié par 1,1 (euro plus fort, le dollar rapporte moins : le point mort monte) ou par 0,9 (le point mort baisse). Sensibilité de ± 10 % demandée par T-019. Les colonnes « financé » illustrent l'effet d'aides couvrant 15 ou 30 % du budget : **ce sont des hypothèses d'illustration, pas des promesses d'aides** (voir `FINANCEMENT.md`, où aucun montant n'est garanti).

### 7.3 Comparaison aux scénarios de `ETUDE_MARCHE.md` 6.3 (A à D, sans probabilité)
Recette nette convertie (k = 0,41, prix de base, 0,899 €) et part du budget médian couverte :

| Scénario de l'étude | Unités | A à 29,99 | B à 39,99 | C à 24,99 |
|---|---:|---:|---:|---:|
| A | 12 000 | 0,13 M€ (2 %) | 0,18 M€ (1 %) | 0,11 M€ (1 %) |
| B | 60 000 | 0,66 M€ (9 %) | 0,88 M€ (5 %) | 0,55 M€ (7 %) |
| C | 180 000 | 1,99 M€ (28 %) | 2,65 M€ (16 %) | 1,66 M€ (20 %) |
| D | 600 000 | 6,63 M€ (92 %) | 8,84 M€ (54 %) | 5,53 M€ (68 %) |
- Même le scénario **D** (600 000 unités, environ 1 M de wishlists, que l'étude réserve aux « titres de marque ») ne couvre pas le budget médian d'un concept au prix de base. Pour A et C il le couvrirait en variante à 39,99 (points morts centraux : A 524 k, C 588 k).
- Les scénarios A et B de l'étude (12 000 et 60 000 unités) ne couvrent qu'une faible part du budget.

### 7.4 Comparaison aux fourchettes de ventes de T-021 (hypothèses de sensibilité)
| Concept | Fourchette T-021 | Prix des comparables qui ont bien marché | Lecture |
|---|---|---|---|
| A | 75 k à 300 k | 13 à 35 $ | Le prix de base de 29,99 est dans la plage prouvée ; **39,99 est au-dessus** de ce que les comparables ont prouvé. À 29,99, le point mort central (698 k) dépasse la borne haute. À 39,99 (524 k) aussi. |
| B | 30 k à 200 k | Echoes of the End à 39,99 : faible ; Cairn ≈ 30 $ : >500 k | **Le prix de 39,99 est contredit** par *Echoes of the End*. Point mort central à 39,99 : 1 201 k, soit environ 6 fois la borne haute. Même à 49,99 (961 k) il reste hors de portée. |
| C | 25 k à 150 k | 13,99 à 25 $ ; durée courte | Le prix de base de 24,99 est à la borne haute du prouvé ; 39,99 est hors de ce que le genre a prouvé. Point mort central à 24,99 : 941 k, soit environ 6 fois la borne haute. |

**Conclusion honnête** : les fourchettes de T-021 **ne permettent pas de conclure à la rentabilité d'un concept**. Elles sont des bornes de sensibilité et ne reposent que sur des comparables à succès. Mais si les budgets ci-dessus sont ordre de grandeur justes, un jeu de cette ambition (22 à 53 ETP) vendu 25 à 40 $ ne se rentabilise que s'il est un **succès exceptionnel** (hors fourchette) ou si le budget est financé à plus de 30 % par des aides ou un éditeur. Il faut soit réduire l'équipe et la durée (périmètre plus étroit), soit chiffrer par devis pour contredire cette conclusion.

### 7.5 Variante « accord d'abonnement » : un seuil, jamais un montant (T-019, décision 2)
Pour un concept, un accord d'abonnement compense la perte de ventes supposée si son montant est **au moins égal à** : exemplaires perdus × recette nette par exemplaire (0,41 × prix × 0,899 €). Formule, sans hypothèse de montant d'accord :
- Seuil (M€) = pertes d'exemplaires × 0,41 × prix catalogue USD × 0,899 ÷ 1 000 000.
- Exemple de lecture, **non une prévision** : si l'abonnement faisait perdre 20 000 exemplaires à A à 29,99 USD, le seuil serait de 20 000 × 0,41 × 29,99 × 0,899 ≈ **0,22 M€** ; à 100 000 exemplaires perdus, ≈ **1,1 M€**. Les mêmes calculs pour B à 39,99 donnent 0,29 M€ et 1,5 M€ ; pour C à 24,99, 0,18 M€ et 0,92 M€.
- Les montants réellement versés par Microsoft ou Sony ne sont pas publiés : **non vérifié**. La part d'abonnés qui auraient acheté le jeu est elle aussi inconnue.

## 8. Postes isolés à mettre à jour après T-024 (licences et redevances)

Ces postes sont volontairement séparés pour être remplacés par le registre `docs/legal/LICENCES.md` quand T-024 sera faite. Date de consultation : **23 novembre 2026**, par recherche web ; **pages officielles non ouvertes (réseau restreint)**.

| Poste | Valeur retenue | Source et statut |
|---|---|---|
| **Redevance Unreal Engine** | **5 %** du revenu brut du produit **au-delà de 1 M USD de revenu brut à vie, par produit** ; ventes sur l'Epic Games Store exemptées ; déclaration et paiement dans les 45 jours suivant la fin du trimestre civil | Pages Epic relevées par recherche : `https://www.unrealengine.com/en-US/license`, FAQ `https://www.unrealengine.com/en-US/faq`, journal des changements de l'EULA `https://www.unrealengine.com/eula-change-log/unreal`. **Non vérifié à la source.** Divergence relevée : la FAQ évoque un « Release Form » à déposer à temps ; le journal de l'EULA indique que cette condition a été supprimée. À trancher sur l'EULA en vigueur par le juriste |
| Calcul de la « revenu brut » (avant ou après commission des boutiques) | Hypothèse : avant commission. Choix conservateur | **Non vérifié** (définition de l'EULA non lue) |
| Licence par poste d'Unreal Engine pour les studios au-delà d'un seuil de revenu | 0 € dans le budget (aucun revenu pendant le développement). Un forum cite 1 850 USD par an et par poste : **source secondaire, non vérifiée, non retenue** | À vérifier avant tout revenu, notamment avec un éditeur ou une aide qui comptent comme revenus |
| **MetaHuman** | Utilisation couverte par l'EULA d'Unreal Engine pour UE 5.6 et plus ; l'ancienne licence de MetaHuman Creator reste applicable aux versions ≤ 5.5. Pas de redevance supplémentaire relevée | `https://www.metahuman.com/license` relevée par recherche. **Non vérifié à la source.** Droits des comédiens dont le visage sert de base : voir juriste |
| **Fab, Megascans** | Aucune licence propre relevée | **Non vérifié** (aucun résultat de recherche exploitable). Le poste « assets sous licence » est donc une hypothèse pure |
| Git LFS (hébergement) | 60 USD par mois (équipe de 5 à 8) à 370 USD par mois (pic) ; 0,07 USD par Gio de stockage, 0,0875 USD par Gio de transfert | `docs/tech/ARCHITECTURE.md` §8.2, tarifs GitHub constatés le 20 novembre 2026 par le directeur technique. Repris à 60 / 215 / 370 USD par mois. Perforce à 39 USD par utilisateur et par mois : « à vérifier » dans l'architecture, **non retenu** (décision : Git + LFS) |
| Kits de développement PS5 et Xbox, certification (TRC, XR) | Kits et machines de test : forfait [Hypothèse]. Frais de certification et de plateforme : forfait [Hypothèse] | **Non vérifié** : sous accord de confidentialité (NDA) chez Sony et Microsoft, conditions et tarifs accessibles après inscription aux programmes (engagement : accord du propriétaire) |
| Classification d'âge (PEGI, ESRB, IARC) | Dans la ligne « Certification et classification » [Hypothèse] | **Non vérifié** (barèmes non relevés) |
| Taux de change | 1 USD = 0,899 € (BCE : 1 € = 1,1127 USD, 11 novembre 2026) | Barème BCE relayé par la Banca d'Italia (`https://www.bancaditalia.it/compiti/operazioni-cambi/cambio/cambi_rif_20261111`), relevé via recherche, **non vérifié à la source** ; chiffre BCE direct non ouvert |

## 9. Décisions et points à traiter

1. **Juriste** (T-022) : le budget inclut une ligne « Juriste » (20 / 35 / 60 k€ pour A, 25 / 45 / 75 pour B, 35 / 60 / 100 pour C : relecture des contrats, licences, droits des comédiens, points par région). **Elle est à engager seulement après T-004 et l'accord du propriétaire.**
2. **Expert-comptable** : ligne mensuelle de 1,2 / 1,8 / 3 k€ [Hypothèse] pendant toute la durée. Il doit valider ce document avant tout usage.
3. **Prix de B** : *Echoes of the End* à 39,99 USD contredit le prix de base ; B doit être revu à la baisse du périmètre ou du prix avant T-004, ou assumé comme risque.
4. **Éditeur** : un éditeur finance en échange d'une part des recettes ; le point mort ci-dessus devrait être refait avec ses conditions, **non connues**.
5. **Premier test de vérité** : demander des devis (capture, doublage, localisation, QA) et la grille réelle de coût par ETP. Cela peut changer tous les chiffres de ce document.

## 10. Limites
- Aucun chiffre n'a été vérifié à la source (réseau restreint, pages non ouvertes). Les hypothèses de coût sont de mon fait.
- Pas d'actualisation, pas de plan de trésorerie mensuel, pas de coût du financement (intérêts, fonds propres).
- Pas de calcul de TVA sur les dépenses, de crédit d'impôt (voir `FINANCEMENT.md`), de bénéfice imposable ni de la part de l'éditeur.
- La part de chaque plateforme dans les ventes est inconnue (T-021) : le point mort est en unités toutes plateformes.
