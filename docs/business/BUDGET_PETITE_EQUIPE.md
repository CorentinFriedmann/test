# Budget du scénario « studio IA + propriétaire seul » (T-026, étape 2)

> **BROUILLON DE TRAVAIL, à faire valider par un expert-comptable (et un avocat pour les points juridiques) avant tout usage.** Il n'engage aucune dépense et ne vaut ni conseil fiscal ni conseil juridique.
> Rédigé par `business-affairs` le 2026-11-23. À valider par la Boss, puis par le propriétaire.

## 0. À lire en premier

1. **Périmètre, effectifs et durées : repris tels quels de `docs/vision/PERIMETRE_SOLO.md` §0 et §9** (game director, estimations à ±50 % au moins). Je n'ai rien inventé ni arrondi.
2. **Enveloppe : décision du propriétaire du 2026-11-23** (`production/DECISIONS.md`) : aucun apport financier en dehors de l'abonnement Claude. **Aucune hypothèse de fonds propres.** Toute autre dépense est listée en §2.2 comme « à valider par le propriétaire », jamais supposée acquise.
3. **Ce n'est plus le modèle d'un studio** : `BUDGET.md` chiffrait 7 à 16 M€ de budget médian (masse salariale, sous-traitance, marketing). Ici, la masse salariale est nulle (le temps du propriétaire n'est pas payé) et le budget décaissé se compte en **milliers d'euros**. Le point mort baisse donc de plusieurs ordres de grandeur, **mais il ne mesure que la couverture des dépenses décaissées, pas la valeur du temps du propriétaire** (§1.3 et §3.4).
4. **Chiffres sourcés** : seuls quatre sont sourcés (prix de l'abonnement Claude, frais Steam, SMIC, taux de change), tous **par recherche web du 2026-11-23, pages non ouvertes** (réseau restreint). Tout le reste est un calcul à partir de ces chiffres et du modèle de `BUDGET.md`, ou porte « à vérifier ».
5. **Taux de change** : 1 USD = 0,899 € (`BUDGET.md` §7.1, BCE du 2026-11-11, non vérifié à la source). Les montants en euros sont arrondis.

## 1. Périmètre, effectifs et durées (repris de PERIMETRE_SOLO)

| | **A. ESTRAN, « une marée »** | **B. DERNIÈRE POSITION CONNUE, « un col, une nuit »** | **C. AVEUX, « une nuit »** |
|---|---|---|---|
| Durée de jeu | 1 h 30 à 2 h 30 | 1 h 30 à 2 h 30 | 45 à 75 min |
| Lieux | 1 petite île, 4 à 6 intérieurs | 1 petit secteur de montagne, 1 refuge | 1 salle d'interrogatoire, 1 salle d'observation, 1 bureau |
| Effectif humain | 1 personne (propriétaire, débutant) | idem | idem, **plus comédiens hors budget actuel** |
| Durée, temps partiel (15 à 20 h/semaine) | 14 à 24 mois | 18 à 30 mois | 24 à 36 mois ou plus |
| Durée, temps plein (35 à 40 h/semaine) | 7 à 12 mois | 10 à 16 mois | 12 à 20 mois |
| Sous-traitance | Aucune | Aucune | Comédiens, capture, voix : **non finançable** |
| Assets | Gratuits ou inclus, licence à valider en T-024 | idem | idem |
| Faisabilité (game director) | Faisable, avec réserves | Faisable, nettement plus risqué | **Non faisable seul en l'état** |

### 1.1 Ce qui est coupé ou remplacé
Repris de PERIMETRE_SOLO §2 à §4 : pas de monde ouvert, un seul lieu par concept, assets gratuits ou inclus à la place d'assets payants, aucune sous-traitance. Je n'ai pas relu le détail des coupes (mode économe) : voir le document source.

### 1.2 Temps de travail du propriétaire (non rémunéré, non décaissé)
Les durées de la section 1 sont exprimées en mois calendaires au rythme indiqué. Le temps du propriétaire est donc : A, 14 à 24 mois à 15 à 20 h par semaine (ou 7 à 12 mois à temps plein) ; B, 18 à 30 mois (ou 10 à 16) ; C, 24 à 36 mois ou plus (ou 12 à 20), **mais C n'est pas faisable seul**.

### 1.3 Valeur indicative de ce temps, à titre d'information seulement
**Non incluse dans le budget décaissé.** Repère : SMIC mensuel brut (35 h) **1 867,02 €** depuis le 1er juin 2026 (+2,41 %, après 1 823,03 € au 1er janvier 2026) [info.gouv.fr, relevé par recherche le 2026-11-23, page non ouverte ; à vérifier]. Appliqué aux mois à temps plein de la section 1 (salaire brut seul, **sans charges patronales, et sans prétendre que ce soit le tarif d'un développeur**) :

| Concept | Mois à temps plein | Valeur indicative au SMIC brut |
|---|---|---|
| A | 7 à 12 | ≈ 13 100 à 22 400 € |
| B | 10 à 16 | ≈ 18 700 à 29 900 € |
| C | 12 à 20 (non faisable seul) | ≈ 22 400 à 37 300 € |

(Calcul : mois × 1 867,02 €.) À comparer à `BUDGET.md`, où l'équipe humaine représentait l'essentiel de 7,2 à 16,5 M€.

## 2. Dépenses incontournables

### 2.1 Tableau par poste

| Poste | Montant | Source et date | Statut |
|---|---|---|---|
| **Abonnement Claude** (coût d'exploitation des agents IA : abonnement, jetons et calcul sont inclus dans l'abonnement, aucune facturation API supposée) | Offre Max : **100 USD/mois** (palier « 5x ») ou **200 USD/mois** (palier « 20x ») = **≈ 90 € ou ≈ 180 €/mois** | Centre d'aide Anthropic et page « max plan », relevés par recherche le 2026-11-23, pages non ouvertes. **Une version plus récente de l'aide ne liste que le palier à 100 USD et mentionne une offre « Ultra » : les paliers actuels et le prix d'une offre supérieure sont à vérifier à la souscription** (non inventé ici). Taxe incluse ou non : à vérifier | Dépense **déjà décidée** par le propriétaire (enveloppe) ; le prix sur la durée varie |
| **Frais de publication Steam (Steam Direct)** | **100 USD par application ≈ 90 €** ; non remboursable, **récupérable** une fois 1 000 USD de revenu brut ajusté atteints ; délai de 30 jours entre le paiement et la sortie | Steamworks (`partner.steamgames.com/steamdirect`), relevé par recherche le 2026-11-23, page non ouverte. Frais d'une démo ou d'un second produit : à vérifier | **À valider par le propriétaire** |
| Assets ou outils payants | **0 €** (règle : gratuits ou inclus, T-024) | PERIMETRE_SOLO §1.4 | Aucun achat prévu. Chaque asset doit figurer au registre `docs/legal/LICENCES.md` |
| Redevance Unreal Engine | 0 € tant que le revenu brut du produit reste sous 1 M USD ; 5 % au-delà | `BUDGET.md` §8, **non vérifié à la source** | Hors de portée probable, à garder en tête |
| Statut juridique pour vendre (micro-entreprise, société...) | **À vérifier** : coût d'immatriculation et de gestion non relevé | Question ouverte du propriétaire (`DECISIONS.md`) | **À valider par le propriétaire** ; à trancher avec un expert-comptable avant la mise en vente |
| Expert-comptable (statut, TVA, déclarations des revenus étrangers, relecture de ce brouillon) | **À vérifier** : aucun tarif relevé | | **À valider par le propriétaire** |
| Formalités fiscales de la boutique (identification fiscale auprès de Steam) | À vérifier (gratuit ou non) | | À vérifier |
| Musique, voix | 0 € (libre de droits ou voix du propriétaire, PERIMETRE_SOLO §10, point 3) ; règle sur l'IA générative à fixer en T-024 | | Aucun achat prévu |
| Hébergement du code (Git LFS) | **Non retenu ici** : le tarif de `BUDGET.md` §8 (60 USD/mois) est celui d'une équipe de 5 à 8. Pour un solo, un dépôt local ou gratuit est à étudier par `build-engineer` | | À vérifier (peut devenir une dépense : à valider par le propriétaire) |

### 2.2 Dépenses « à valider par le propriétaire » (jamais supposées acquises)

1. Frais Steam : ≈ 90 €.
2. Statut juridique et expert-comptable : montant à vérifier.
3. **Mise à niveau du PC (option)** : configuration du propriétaire inconnue. Cibles de PERIMETRE_SOLO §5 (32 Go de mémoire, GPU récent avec 8 à 12 Go de VRAM ou plus, SSD NVMe de 200 Go libres), elles-mêmes **non vérifiées à la source**. **Aucun prix relevé : à chiffrer sur devis une fois la configuration connue.** Si la machine est inutilisable, le projet doit être repensé : décision du propriétaire.
4. Passage à une offre Claude supérieure : prix à vérifier.
5. Hébergement du code si l'option gratuite ne suffit pas : à vérifier.
6. **Option consoles (hors budget initial)** : kits PS5 et Xbox, certification, classification d'âge, portage. **Aucun prix sourcé** (sous accord de confidentialité chez les plateformes ; `BUDGET.md` §8 les traite en forfaits [Hypothèse]). À chiffrer seulement si le jeu marche ou avec un éditeur, et avec l'accord du propriétaire.

### 2.3 Coût de l'abonnement sur la durée (ligne séparée)

Mois × prix mensuel × 0,899. **Arrondi à l'euro.**

| Concept | Durée | Abonnement à 100 USD/mois | Abonnement à 200 USD/mois |
|---|---|---|---|
| A, temps partiel | 14 à 24 mois | 1 259 à 2 158 € | 2 517 à 4 315 € |
| A, temps plein | 7 à 12 mois | 629 à 1 079 € | 1 259 à 2 158 € |
| B, temps partiel | 18 à 30 mois | 1 618 à 2 697 € | 3 236 à 5 394 € |
| B, temps plein | 10 à 16 mois | 899 à 1 438 € | 1 798 à 2 877 € |
| C, temps partiel (non faisable seul) | 24 à 36 mois | 2 158 à 3 236 € | 4 315 à 6 473 € |
| C, temps plein (non faisable seul) | 12 à 20 mois | 1 079 à 1 798 € | 2 158 à 3 596 € |

### 2.4 Dépenses décaissées totales (abonnement + frais Steam ≈ 90 €)

Hors statut juridique, expert-comptable, matériel et options (à vérifier, §2.2). **Fourchette « bas »** = durée basse à 100 USD/mois ; **« haut »** = durée haute à 200 USD/mois.

| Concept | Temps partiel, bas | Temps partiel, haut | Temps plein, bas | Temps plein, haut |
|---|---|---|---|---|
| A | ≈ 1 350 € | ≈ 4 400 € | ≈ 720 € | ≈ 2 250 € |
| B | ≈ 1 710 € | ≈ 5 480 € | ≈ 990 € | ≈ 2 970 € |
| C (non faisable seul) | ≈ 2 250 € | ≈ 6 560 € | ≈ 1 170 € | ≈ 3 690 € |

**Marge pour imprévus** : `BUDGET.md` appliquait une provision. Je n'en ajoute pas ici (aucune base sourcée) ; la fourchette bas-haut tient lieu de marge, et **le premier risque est la durée** : si le projet dure plus longtemps que prévu (±50 % au moins), l'abonnement coûte plus.

## 3. Point mort

### 3.1 Prix : ne pas reprendre ceux de CONCEPTS.md
Les prix de `CONCEPTS.md` (29,99 / 39,99 / 24,99 USD) valent pour des jeux de 7 à 9 h. Le jeu étant de 1 h 30 à 2 h 30 (A et B) ou 45 à 75 min (C), **je ne les reprends pas.** Hypothèses de sensibilité : **9,99 / 14,99 / 19,99 USD**, et 24,99 en borne haute de test. Elles sont **choisies par moi**, sans étude de prix pour jeux courts ; elles s'appuient seulement sur ce que `MARCHE_PAR_CONCEPT.md` relève : des succès de comparables à 13 à 35 USD (Mouthwashing ≈ 13 USD ; Mortuary Assistant 24,99 USD ; Still Wakes the Deep 34,99 USD ; comparables de C à 13,99 à 25 USD). **La durée de ces comparables n'y est pas relevée : à vérifier.** Un jeu de 2 h à 19,99 USD est donc au haut de ce qui est défendable ; 9,99 à 14,99 est plus prudent. Cet écart de prix est **une décision pour T-004 et le propriétaire**, pas pour moi.

### 3.2 Recette nette par exemplaire (modèle de BUDGET.md §7.1)
Recette nette = **0,41 × prix catalogue USD × 0,899 €** (le 0,41 de T-019 regroupe taxes ou TVA, soldes, remboursements et commission Steam de 30 % ; il n'est pas détaillé ici). Sensibilité de `BUDGET.md` : 0,36 à 0,51. **Redevance Unreal de 5 %** : elle ne s'applique qu'au-delà de 1 M USD de revenu brut (non vérifié à la source) ; elle est **sans effet** dans toutes les valeurs ci-dessous.

| Prix catalogue (USD) | Recette nette par exemplaire (k = 0,41) |
|---|---|
| 9,99 | ≈ 3,68 € |
| 14,99 | ≈ 5,52 € |
| 19,99 | ≈ 7,37 € |
| 24,99 | ≈ 9,21 € |

### 3.3 Exemplaires pour couvrir les dépenses décaissées (§2.4)

Nombre d'exemplaires = dépenses ÷ recette nette. Les cases sont arrondies. Pour C (non faisable seul), les chiffres sont donnés pour comparaison seulement.

| Concept (temps partiel) | Dépenses bas / haut | À 9,99 USD | À 14,99 USD | À 19,99 USD |
|---|---|---|---|---|
| A | ≈ 1 350 € / ≈ 4 400 € | 366 à 1 196 | 244 à 797 | 183 à 598 |
| B | ≈ 1 710 € / ≈ 5 480 € | 464 à 1 489 | 309 à 993 | 232 à 744 |
| C | ≈ 2 250 € / ≈ 6 560 € | 610 à 1 782 | 407 à 1 188 | 305 à 891 |

| Concept (temps plein) | Dépenses bas / haut | À 9,99 USD | À 14,99 USD | À 19,99 USD |
|---|---|---|---|---|
| A | ≈ 720 € / ≈ 2 250 € | 195 à 610 | 130 à 407 | 98 à 305 |
| B | ≈ 990 € / ≈ 2 970 € | 269 à 806 | 179 à 537 | 134 à 403 |
| C | ≈ 1 170 € / ≈ 3 690 € | 317 à 1 001 | 212 à 667 | 159 à 500 |

Lecture : **couvrir les dépenses décaissées demande de quelques centaines à environ 1 500 exemplaires**, soit un ordre de grandeur sans commune mesure avec les 0,5 à 1,6 million de `BUDGET.md`. Ce n'est pas un signe de rentabilité : le coût réel, le temps du propriétaire, n'y est pas.

### 3.4 Exemplaires pour atteindre un revenu de référence (illustration)

Référence : **SMIC brut annuel = 12 × 1 867,02 = 22 404 €** (SMIC du 1er juin 2026, voir §1.3). **Illustration seulement** : pas un objectif ni une promesse ; la recette nette de la boutique n'est ni un salaire, ni un bénéfice. Cotisations sociales, impôt, statut et TVA ne sont **pas** modélisés (à faire par l'expert-comptable). Exemplaires = 22 404 ÷ recette nette, **sans** ajouter les dépenses décaissées (ajouter ≈ 1 000 à 6 500 € de dépenses, soit quelques centaines d'exemplaires de plus) :

| Prix catalogue (USD) | Exemplaires pour 22 404 € de recette nette |
|---|---|
| 9,99 | ≈ 6 100 |
| 14,99 | ≈ 4 050 |
| 19,99 | ≈ 3 040 |

Ce seuil vise une année de SMIC brut en recette nette de boutique ; il se lit comme un repère de comparaison avec le temps passé (§1.3), pas comme un objectif du projet.

## 4. Comparaison avec les ventes plausibles d'un jeu court d'un développeur seul

**Aucune donnée de ventes d'un développeur solo débutant n'a été relevée** dans `MARCHE_PAR_CONCEPT.md`. Ce qui existe est biaisé :

- **Biais de survie** : les comparables cités sont des **succès** (A : 155 à 560 k exemplaires Steam ; C : 6 à 424 k), signalés par la presse parce qu'ils ont réussi, et produits par des studios de plusieurs personnes. Ils ne représentent pas le sort d'un jeu moyen.
- **Fourchettes du marché prudentes de T-021** (estimations de `marketing-publishing`, calculées avec abattement) : A 75 à 300 k ; B 30 à 200 k ; C 25 à 150 k, **pour un jeu au budget de studio**. Je ne les applique pas à un jeu solo débutant : ce serait un contresens.
- **Scénario d'échec** relevé : sous 25 k exemplaires pour A, sous 15 k pour C. Pour l'horreur indépendante de 2024, **7,2 % seulement** ont dépassé 500 avis (≈ 10 à 25 k exemplaires selon le multiplicateur de 20 à 50 de T-021, une estimation) ; 59 % des succès ont gagné au moins 200 000 USD brut, **2 % seulement ont dépassé 1 M USD** (confiance faible, périmètre non précisé). Moins de 300 jeux sur ≈ 20 000 devraient dépasser 1 M USD brut en 2025. En 2026, 27 286 jeux étaient déjà sortis sur Steam au 18 novembre. **Un jeu sans notoriété, sans éditeur et sans budget de marketing se vend, dans la plupart des cas, très en dessous de ces comparables ; je n'ai pas de chiffre sourcé pour le dire plus précisément.**

**Grille d'illustration (non une prévision)** : recette nette selon le nombre d'exemplaires, au modèle de §3.2.

| Exemplaires vendus | À 9,99 USD | À 14,99 USD | À 19,99 USD |
|---|---|---|---|
| 500 | ≈ 1 840 € | ≈ 2 760 € | ≈ 3 680 € |
| 2 000 | ≈ 7 360 € | ≈ 11 050 € | ≈ 14 740 € |
| 10 000 | ≈ 36 820 € | ≈ 55 250 € | ≈ 73 680 € |
| 25 000 | ≈ 92 050 € | ≈ 138 130 € | ≈ 184 200 € |

**Lecture** : couvrir les dépenses décaissées (§3.3) est à portée d'un jeu qui trouve ne serait-ce qu'un petit public. Atteindre l'équivalent d'un SMIC annuel (3 000 à 6 100 exemplaires) est plausible pour un jeu qui se démarque, mais **rien de sourcé ne le garantit, et la probabilité d'y arriver est inconnue**. Une vente à zéro ou quelques dizaines d'exemplaires reste un scénario réaliste que cette étude ne sait pas quantifier. Le principal levier est la visibilité (§6), pas le budget.

## 5. Tableau de synthèse A/B/C pour T-004

Les durées, effectifs et la faisabilité sont repris de PERIMETRE_SOLO. Dépenses : fourchette bas à haut du §2.4, **temps partiel puis temps plein**. Point mort : exemplaires à 14,99 USD (k = 0,41).

| | **A. ESTRAN, « une marée »** | **B. DERNIÈRE POSITION CONNUE, « un col, une nuit »** | **C. AVEUX, « une nuit »** |
|---|---|---|---|
| Périmètre | 1 île, 1 h 30 à 2 h 30 | 1 secteur de montagne, 1 h 30 à 2 h 30 | 3 salles, 45 à 75 min |
| Effectif | 1 (propriétaire) | 1 (propriétaire) | 1 + comédiens non finançables |
| Durée | 14 à 24 mois (temps partiel) ; 7 à 12 (temps plein) | 18 à 30 ; 10 à 16 | 24 à 36 ou plus ; 12 à 20 |
| Dépenses décaissées | ≈ 1 350 à 4 400 € ; ≈ 720 à 2 250 € | ≈ 1 710 à 5 480 € ; ≈ 990 à 2 970 € | ≈ 2 250 à 6 560 € ; ≈ 1 170 à 3 690 € **(indicatif, hors comédiens, capture, droits)** |
| Valeur indicative du temps (information, non décaissée) | ≈ 13 100 à 22 400 € | ≈ 18 700 à 29 900 € | ≈ 22 400 à 37 300 € |
| Point mort sur les dépenses (14,99 USD) | ≈ 244 à 797 ex. ; ≈ 130 à 407 | ≈ 309 à 993 ; ≈ 179 à 537 | ≈ 407 à 1 188 ; ≈ 212 à 667 **(sans signification : le jeu n'est pas faisable)** |
| Exemplaires pour 1 SMIC annuel (illustration, 14,99 USD) | ≈ 4 050 | ≈ 4 050 | ≈ 4 050 |
| Faisabilité (game director) | **Faisable, avec réserves** ; point de sortie au prototype J2 | **Faisable mais nettement plus risqué** (plan de repli) | **Non faisable seul en l'état** : visages, comédiens, capture, droits d'image |
| Remarque commerciale | Comparables à 13 à 35 USD ; horreur, genre qui sur-performe légèrement | Comparable Echoes of the End (échec, ≈ 27 à 68 k Steam) ; Cairn réussi mais avec un autre périmètre | Comparables à 13,99 à 25 USD ; promesse de visages hors de portée |

**Point d'attention** : cette étude n'a pas comparé les ventes plausibles entre concepts avec des données propres à un solo : l'écart de point mort entre A, B et C vient seulement de la durée de l'abonnement. La faisabilité et le risque de PERIMETRE_SOLO pèsent plus que le budget dans le choix.

## 6. Financement possible pour un solo

Rien n'est garanti ; **aucun critère inventé**. Source : `docs/business/FINANCEMENT.md` (relevés par recherche du 2026-11-23, pages non ouvertes). Les dépenses décaissées étant de l'ordre du millier d'euros, **le besoin de financement est très faible** : la question est surtout celle du temps non rémunéré du propriétaire.

| Piste | Constat pour un solo | À vérifier |
|---|---|---|
| **Crédit d'impôt jeu vidéo (CIJV)** | Taux de 30 % ; agrément du CNC ; **coût de développement du jeu ≥ 100 000 €** ; dépenses éligibles à partir de la demande d'agrément provisoire. Un budget décaissé de quelques milliers d'euros est très en dessous du seuil. Crédit d'**impôt sur les sociétés** : lié à une entreprise soumise à cet impôt | Si le temps non rémunéré du propriétaire compte comme dépense (probablement non), si une micro-entreprise peut en bénéficier, échéance du dispositif (2026 ou 2031, deux sources discordantes) |
| **CNC, FAJV production** | Bénéficiaires relevés : **sociétés commerciales établies en France**, non contrôlées par des capitaux extra-européens, conservant une part significative des droits ; subvention plafonnée à 50 % des dépenses. Un propriétaire non constitué en société n'est probablement pas dans la cible | Éligibilité d'une personne seule ou d'une société unipersonnelle ; dates des sessions 2027 ; montants ; **aide à la préproduction** |
| Creative Europe MEDIA (jusqu'à 200 000 €, une source) | Appel 2026 clos ; appel 2027 non trouvé. Un projet de ce format est probablement trop petit ; non vérifié | Éligibilité et appel 2027 |
| Régions | Dépend du siège de l'entreprise | Dispositifs locaux |
| **Éditeur indépendant** | Un éditeur attend généralement une vertical slice (jalon M2, non vérifié). Pour un jeu court d'un solo débutant, **un accord est possible mais rien de sourcé ne l'indique**. Tout contact est un engagement : accord du propriétaire | Conditions, avances, parts de recettes |
| **Financement participatif** | Précommandes, dons, accès anticipé : aucune donnée relevée. Crée des engagements envers le public (livraison, remboursement) | Plateformes, frais, fiscalité, effet sur la visibilité |
| **Démo et Steam Next Fest** | Outils de **visibilité**, pas de financement (cf. `FINANCEMENT.md` §6). Une démo permet de mesurer l'intérêt avant d'investir plus et d'alimenter les listes de souhaits | Règles et dates du prochain Next Fest ; frais éventuels d'une démo |

**Constat** : aucune aide connue n'est à la fois ouverte à un solo non constitué en société et utile à ce niveau de dépenses. La voie la plus réaliste est la visibilité (démo, Next Fest, page Steam publiée tôt), puis, si le jeu a un public, un éditeur ou des aides pour une suite ou le portage consoles.

## 7. Limites

- Aucune provision pour imprévus chiffrée ; la durée (±50 % au moins) est le risque principal.
- Dépassement possible des limites de l'abonnement Claude (quotas) : non chiffré. Il pourrait obliger à passer à une offre supérieure (prix à vérifier, décision du propriétaire).
- TVA sur l'abonnement et sur la vente, impôts, cotisations sociales, statut : non modélisés.
- Les paramètres de recette (0,41, 0,899) sont ceux de `BUDGET.md`, **non revérifiés** à la source.
- Les durées des comparables, la part Steam des ventes et les prix des jeux courts ne sont pas relevés : à compléter si T-020 aboutit.
- Valeur du SMIC : relevé par recherche, à vérifier sur le site officiel avant tout usage.

## 8. Sources (recherche web du 2026-11-23, pages non ouvertes)

- Anthropic, centre d'aide « how much does the Max plan cost » (`support.claude.com/en/articles/11049744`) et `anthropic.com/news/max-plan`.
- Steamworks, Steam Direct (`partner.steamgames.com/steamdirect`, `partner.steamgames.com/doc/gettingstarted/appfee`).
- Info.gouv.fr, « Le SMIC revalorisé le 1er juin 2026 » et « au 1er janvier 2026 ».
- Documents du dépôt : `docs/vision/PERIMETRE_SOLO.md`, `docs/business/BUDGET.md`, `docs/business/MARCHE_PAR_CONCEPT.md`, `docs/business/FINANCEMENT.md`, `production/DECISIONS.md`.

**Rappel : brouillon à faire valider par un expert-comptable avant tout usage.**
