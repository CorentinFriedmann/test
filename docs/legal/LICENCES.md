# Registre des licences et règles d'usage de l'IA générative (T-024)

> **BROUILLON DE TRAVAIL. À faire valider par un juriste (avocat ou conseil en propriété intellectuelle) avant tout usage commercial.**
> Ce document n'est pas un avis juridique. **Aucune acceptation de conditions, aucun compte et aucun achat** ne doit être fait sans l'accord explicite du propriétaire du projet.
> Rédigé par `business-affairs` le 2026-11-25. Voie web (three.js), jeu fabriqué par des agents IA, sans voix humaine enregistrée (voir `production/DECISIONS.md`).

## 1. Comment utiliser ce registre

Règle de `CLAUDE.md` : **tout asset ou outil tiers** doit avoir une licence compatible avec la vente commerciale, consignée ici **avant** son intégration. Un agent qui veut importer un asset (image, son, police, modèle 3D, bibliothèque) ajoute d'abord une ligne au registre (section 3 ou 4) ; sans ligne complétée, l'import est refusé en revue.

Format d'une ligne (colonnes de la section 3) :

| Colonne | Contenu attendu |
|---|---|
| Asset ou outil | Nom exact et version |
| Origine | URL ou dépôt de provenance, auteur |
| Licence et version | Identifiant SPDX si possible (ex. MIT, Apache-2.0, CC0-1.0) |
| Consulté le | Date de lecture du texte de licence |
| Usage commercial | Oui / Non / À vérifier |
| Plateformes | Web (itch.io), Electron (Steam), outil de dev seulement |
| Attribution | Texte ou mention exigée, et où elle apparaît |
| Obligations | Conservation du texte, partage à l'identique, interdictions... |
| Preuve d'acquisition | Chemin du fichier de licence, capture, reçu, facture |
| Embarqué | Oui (dans le jeu livré) / Non (outil) |

Licences acceptées d'office : MIT, BSD, Apache-2.0, ISC, CC0, domaine public. À soumettre à la Boss et au juriste : CC-BY (attribution), CC-BY-SA et GPL (partage à l'identique), toute licence « non commerciale » (refusée par défaut), toute licence sans texte clair.

## 2. Source des vérifications

Les licences des paquets ci-dessous ont été lues **hors réseau** dans `game/node_modules/<paquet>/LICENSE` et `package.json` (source la plus fiable, c'est le texte livré avec la version exacte), le 2026-11-25. Playwright a été lu dans `/opt/node-tools/node_modules/` (installation préexistante de l'environnement).

## 3. Registre : dépendances et outils

| Asset ou outil | Origine | Licence et version | Consulté le | Usage commercial | Plateformes | Attribution | Obligations | Preuve d'acquisition | Embarqué |
|---|---|---|---|---|---|---|---|---|---|
| `three` 0.187.0 | npm, dépôt three.js | MIT (`"license": "MIT"`) ; « Copyright © 2010-2026 three.js authors » | 2026-11-25 | Oui | Web, Electron | Oui : conserver l'avis de copyright et le texte MIT dans la version publiée | Texte MIT intégral joint à toute copie substantielle | `game/node_modules/three/LICENSE`, `package.json`, `package-lock.json` | **Oui** (code inclus dans `dist/estran-p2.html`, avec avis et texte MIT, section 5) |
| `esbuild` 0.28.2 | npm, Evan Wallace | MIT ; « Copyright (c) 2020 Evan Wallace » | 2026-11-25 | Oui | Outil de build | Non requise pour le jeu : le code d'esbuild n'est pas copié dans le bundle (voir note ci-dessous) | Aucune pour la sortie du build | `game/node_modules/esbuild/LICENSE.md`, `package.json` | Non |
| `@esbuild/linux-x64` 0.28.2 | npm (binaire d'esbuild) | MIT (`package.json`) ; pas de fichier LICENSE dans le paquet | 2026-11-25 | Oui | Outil de build | Non | Aucune pour la sortie | `game/node_modules/@esbuild/linux-x64/package.json` | Non |
| Playwright (`playwright` et `playwright-core`) 1.63.0 | npm, Microsoft | Apache-2.0 | 2026-11-25 | Oui | Outil de test seulement | Non requise (rien n'est distribué) | Si jamais redistribué : texte Apache-2.0 et mentions NOTICE | `/opt/node-tools/node_modules/playwright/LICENSE`, `package.json` | Non |
| `eslint` 10.14.0 et ses dépendances (106 paquets de développement : 80 MIT, 12 Apache-2.0, 6 BSD-2-Clause, 4 ISC, 3 BlueOak-1.0.0, 1 BSD-3-Clause) | npm, OpenJS Foundation | MIT ; « Copyright OpenJS Foundation and other contributors » | 2026-11-26 | Oui | Outil de vérification du code seulement (T-040) | Non requise (rien n'est copié dans le jeu livré) | Aucune pour le jeu ; ne jamais embarquer dans le bundle | `game/node_modules/eslint/LICENSE`, `game/package-lock.json` | Non |
| Navigateurs headless de Playwright | Téléchargés par Playwright | Licences propres à chaque navigateur : **non vérifié** | n/a | Sans objet (non distribués) | Outil de test seulement | Non | Ne jamais inclure dans le jeu livré | n/a | Non |
| `prototypes/estran-poc/` : `three` 0.187.0 et `esbuild` 0.28.2 | idem ci-dessus | MIT (mêmes versions, lues dans `prototypes/estran-poc/node_modules/`) | 2026-11-25 | Oui | Prototype de faisabilité (T-027), non vendu | Même règle que `three` si le prototype est publié | idem | `prototypes/estran-poc/node_modules/<paquet>/package.json` | `three` oui dans le prototype ; `esbuild` non |

Notes :
- `game/package.json` et `prototypes/estran-poc/package.json` déclarent `"license": "UNLICENSED"` : c'est le code **propriétaire** du studio (aucune licence ouverte accordée), ce qui est cohérent avec une vente.
- Dépendances transitives : `three` et `esbuild` ne déclarent aucune dépendance d'exécution dans les dossiers `node_modules` présents (seulement `@esbuild/linux-x64` pour esbuild). À re-contrôler à chaque changement de `package-lock.json`.
- Esbuild peut insérer de petits fragments d'aide (« runtime helpers ») dans un bundle ; ils ne créent pas d'obligation d'attribution à ma connaissance. **À faire confirmer par le juriste.**

## 4. Registre : assets tiers (art, son, police, modèle, texte)

État actuel : **aucun asset tiers**. Les sons sont synthétisés (Web Audio), la géométrie est procédurale, les textes sont écrits par les agents. Toute ligne ajoutée ci-dessous doit reprendre les colonnes de la section 1.

| Asset | Origine | Licence et version | Consulté le | Usage commercial | Plateformes | Attribution | Obligations | Preuve d'acquisition | Embarqué |
|---|---|---|---|---|---|---|---|---|---|
| (vide) | | | | | | | | | |

## 5. Obligation d'attribution pour three.js (appliquée par T-033)

**Constat initial (2026-11-25, avant T-033)** : `game/scripts/build.mjs` utilisait `legalComments: 'none'`, donc l'avis MIT de three.js était retiré du fichier assemblé. Cela ne respectait pas la condition MIT (conserver l'avis de copyright et le texte de permission).

**Correction appliquée par T-033** (fichier assemblé : `game/dist/estran-p2.html`) :

1. `game/scripts/build.mjs` utilise `legalComments: 'inline'` : les commentaires `@license` de three.js (« Copyright 2010-2026 three.js authors », `SPDX-License-Identifier: MIT`) restent dans le code embarqué.
2. Le build lit `game/node_modules/three/LICENSE` et en insère le **texte MIT complet** dans la page (balise `<script type="text/plain" id="licence-three">`). Le build échoue si ce fichier ne contient pas « three.js authors » et « Permission is hereby granted ».
3. Écran **« Crédits et licences »** dans le jeu (écran de départ et de pause) : « Rendu 3D : three.js (licence MIT), © 2010-2026 three.js authors », mention qu'aucun asset tiers n'est utilisé, et le texte MIT complet dans un dépliant.
4. Test de non-régression `game/tests/e2e/p2.cjs` (lancé par `npm test`) : le fichier assemblé contient « three.js authors » et « Permission is hereby granted », ainsi que le texte complet de `LICENSE` ; l'écran de crédits les affiche.
5. Pour Electron (Steam), non fait ici : fournir aussi un fichier `LICENSES` dans le paquet (voir section 6) et ajouter **Electron et Chromium** au registre si l'empaquetage est abordé (non vérifié, hors périmètre de T-033).

Reste à faire par un juriste : confirmer que ces mentions suffisent pour la vente (voir section 8).

## 6. Règles de distribution

**Statut de la vérification : non vérifié.** Les pages officielles n'ont pas pu être consultées le 2026-11-25 (le réseau de la session refuse l'accès à `store.steampowered.com`, `partner.steamgames.com` et `itch.io`, réponse HTTP 403 du proxy). Les restrictions n'ont pas été contournées. Rien n'est affirmé ci-dessous comme condition officielle : ce sont des **points à vérifier** à la source par le propriétaire ou un agent ayant accès au réseau, avec la date de consultation à noter.

### 6.1 itch.io (HTML5)

| Point | Statut |
|---|---|
| Conditions générales des créateurs et du partage de revenus | **Non vérifié** (source à lire : documentation créateurs d'itch.io, section HTML5 et conditions de service) |
| Format HTML5 (archive zip contenant un `index.html`, taille et dimensions maximales) | **Non vérifié** ; à confronter au fichier unique `dist/estran-p2.html` (T-033) |
| Pourcentage prélevé par itch.io et frais de paiement | **Non vérifié** (la part est réglable par le créateur d'après mes connaissances générales, à confirmer) |
| Compte créateur et informations fiscales | **Non vérifié** ; compte à créer par le propriétaire (section 9) |
| Divulgation de l'IA générative | Voir 7.1 |

### 6.2 Steam via Electron

| Point | Statut |
|---|---|
| Programme Steamworks, contrat de distribution (Steam Distribution Agreement), identification fiscale et bancaire | **Non vérifié** ; démarche à faire par le propriétaire |
| Frais Steam Direct (frais par jeu, remboursement conditionné à un seuil de ventes) | **Montant non vérifié** : ne retenir aucun chiffre avant lecture de la page officielle. Dépense à valider par le propriétaire (`DECISIONS.md`, 2026-11-23) |
| Part prélevée par Valve | **Non vérifié** |
| Empaquetage Electron : un jeu web devient une application de bureau (Windows en priorité) ; Electron est lui-même sous licence MIT et Chromium sous ses propres licences, **à ajouter au registre** (section 3) avec versions et textes au moment de T-033 ou de la tâche d'empaquetage | Licences d'Electron et de Chromium **non vérifiées**, paquet absent du dépôt |
| Certificat de signature de code (Windows) | Coût et autorités acceptées **non vérifiés** ; dépense à valider par le propriétaire. Sans signature, des avertissements de sécurité du système sont à prévoir (à confirmer) |
| Steamworks SDK (si utilisé pour succès, nuage...) | Licence du SDK **non vérifiée** ; à enregistrer en section 3 avant tout usage. Hors périmètre actuel |
| Classification d'âge, questionnaire de contenu, page boutique | **Non vérifié** ; démarches du propriétaire |
| Divulgation de l'IA générative | Voir 7.1 |

## 7. IA générative

### 7.1 Obligations de divulgation (informations publiques)

**Non vérifié à la source le 2026-11-25** (pages inaccessibles). D'après des connaissances générales publiques, à confirmer :
- **Steam** : le formulaire de soumission du jeu comporte une rubrique de déclaration de l'usage d'IA générative, distinguant le contenu **préparé à l'avance** (visible dans le jeu livré) et le contenu **généré pendant le jeu** (avec garde-fous). La déclaration est affichée sur la page boutique. À confirmer sur la documentation Steamworks.
- **itch.io** : existence d'une déclaration ou d'un marquage de l'usage d'IA générative sur la page du projet : modalités **non vérifiées**.

**Position du studio, en attendant la vérification : déclarer largement.** Le jeu a été **entièrement fabriqué par des agents IA** (code, textes, conception, sons de synthèse, formes procédurales). Il faut donc répondre « oui, de l'IA générative a été utilisée » sur chaque plateforme et décrire honnêtement ce qui est concerné. Aucun contenu n'est généré par IA **pendant** le jeu chez le joueur (pas d'appel à un modèle en ligne dans le jeu livré).

### 7.2 Règle interne : ce que les agents IA produisent pour le jeu livré

| Nature du contenu | Autorisé | Conditions et traçabilité |
|---|---|---|
| Code du jeu et des outils (`game/`) | Oui | Historique git (auteur, date, message) ; rapport de remise `studio/templates/REMISE.md` par tâche ; validation Boss dans `production/validations/` |
| Sons de synthèse (Web Audio, procéduraux) | Oui | Générés par code, donc sources dans le dépôt ; pas d'échantillon tiers |
| Formes et textures procédurales (géométrie, shaders, bruit) | Oui | Générées par code ; pas d'image tierce |
| Textes (interface, narration, noms) | Oui | Écrits par les agents ; relecture par le `narrative-designer` et la Boss ; vérifier l'absence de citation d'œuvres protégées |
| Images, modèles 3D, musiques **produits par un générateur d'IA externe** | **Non, sans accord préalable** | Exigent une ligne au registre (section 4) : outil, version, conditions d'usage commercial **lues à la source**, date, prompt conservé. Accord de la Boss et du propriétaire requis, vu l'incertitude sur la titularité des droits et la divulgation |
| Reprise d'un style ou d'une œuvre identifiable d'un artiste ou d'un jeu | **Non** | Aucun prompt visant à imiter un artiste, un jeu ou une marque nommés |
| Assets tiers non IA (CC0, MIT, achetés) | Oui, après inscription | Section 1 |
| Noms, logos et marques de tiers | Non | Le titre « ESTRAN » doit être vérifié (recherche d'antériorité à faire, voir section 8) |

Mise en garde de fond : **la protection par le droit d'auteur de contenus produits majoritairement par IA est incertaine** (varie selon les pays et évolue). Conséquence possible : difficulté à interdire la copie de certaines parties du jeu. Le juriste doit se prononcer, notamment sur la titularité (le propriétaire commandite, mais ne crée pas lui-même). **Non vérifié, à soumettre.**

Traçabilité minimale à tenir : (1) tout commit indique la tâche `T-XXX` ; (2) chaque rapport de remise liste les livrables produits par agent ; (3) ce registre liste tout apport extérieur ; (4) un journal des déclarations IA faites sur chaque plateforme (date, texte soumis) est ajouté à ce fichier au moment de la vente.

### 7.3 Voix de synthèse

**Aucune voix de synthèse n'est utilisée** et aucune voix humaine n'est enregistrée. Si on en ajoute un jour :
1. Lire à la source les conditions commerciales du service ou du modèle de voix (droit d'usage commercial, redistribution, durée, plateformes) et les consigner au registre.
2. Interdire le clonage de la voix d'une personne réelle sans **contrat écrit de consentement** (étendue, durée, usages, rémunération, droit de retrait), validé par un juriste.
3. Déclarer l'usage sur Steam (contenu préparé à l'avance) et sur itch.io.
4. Décision de la Boss et accord du propriétaire requis.

## 8. Autres points juridiques à traiter (hors périmètre de cette tâche)

- **Titre et marque « ESTRAN »** : recherche d'antériorité (registres de marques, boutiques) et éventuel dépôt : **non fait**, à faire avant la sortie. Dépense éventuelle à valider par le propriétaire.
- **Mentions légales, conditions d'utilisation, politique de confidentialité** : le jeu actuel ne collecte aucune donnée personnelle d'après la conception (pas de service en ligne, T-018 abandonnée) ; à re-vérifier avant publication. **Non traité ici.**
- **Statut juridique du vendeur** (auto-entreprise, société) et fiscalité (TVA, impôts, revenus de plateformes étrangères) : à décider avec un expert-comptable (`DECISIONS.md`, question ouverte). Aucun taux n'est donné ici.

## 9. Ce que le propriétaire devra faire au moment de vendre

En langage simple. C'est la seule partie qui vous concerne ; tout le reste est fait par les agents. **Rien de tout cela n'est à faire maintenant.**

1. **Choisir votre statut pour vendre** (par exemple auto-entreprise ou société). Parlez-en à un expert-comptable avant d'ouvrir un compte vendeur : il vous dira aussi comment déclarer vos revenus et la TVA.
2. **Créer le compte vendeur** sur chaque boutique (itch.io, puis Steam). C'est vous qui acceptez leurs conditions, pas un agent : lisez-les, ou faites-les relire.
3. **Donner les informations fiscales et bancaires** demandées (identité, adresse, numéro d'identification fiscale, compte bancaire). Les agents ne doivent jamais les voir ni les saisir.
4. **Payer ce qui est exigé, un par un, après votre accord** : frais de publication Steam, éventuel certificat de signature pour l'application Windows, éventuel dépôt de marque. Les montants sont à lire sur les pages officielles ; aucun n'est confirmé dans ce document.
5. **Répondre honnêtement à la question sur l'IA** : le jeu a été fait par des agents IA. Les agents vous préparent le texte de déclaration ; c'est vous qui le validez et le soumettez.
6. **Faire relire ce dossier par un juriste** avant la mise en vente.

## 10. Historique

| Date | Auteur | Changement |
|---|---|---|
| 2026-11-25 | build-engineer | T-033 : avis et texte MIT de three.js conservés dans `dist/estran-p2.html`, écran « Crédits et licences », test de non-régression ; `dist/estran.html` devient `dist/estran-p2.html` |
| 2026-11-25 | business-affairs | Création (T-024) : dépendances réelles, règles de distribution (non vérifiées, réseau fermé), IA générative, aide au propriétaire |
