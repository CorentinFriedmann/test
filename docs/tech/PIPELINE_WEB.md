# Pipeline web autonome (T-027)

> **Auteur** : `technical-director` · **Date** : 2026-11-23 · **Statut** : brouillon remis à la Boss
> Prototype : `prototypes/estran-poc/`. Décision et justification : `ADR_PIVOT_WEB.md`.

## 1. Principe

Tout se fait dans le cloud, sans action humaine : installer, construire, tester dans un navigateur headless, capturer, produire **un seul fichier HTML autonome** (three.js inclus, aucun serveur ni réseau nécessaire à l'exécution).

## 2. Pré-requis de la session

| Élément | Valeur constatée |
|---|---|
| Node / npm | 22.23.5 / 10.9.9 |
| Registre npm | accessible (seul accès réseau nécessaire) |
| Navigateur | Chromium + Playwright 1.63.0 préinstallés (`require('playwright')` global ; ne pas lancer `playwright install`) |
| GPU | aucun : WebGL2 logiciel (SwiftShader) |

Hors de la session : ajouter `playwright` en devDependency (version figée) si on veut rejouer les tests ailleurs.

## 3. Commandes (depuis `prototypes/estran-poc/`)

| Étape | Commande | Effet |
|---|---|---|
| Installation | `npm ci` (ou `npm install --save-exact` la première fois) | installe `three@0.187.0` et `esbuild@0.28.2` ; le `package-lock.json` fige l'arbre complet |
| Build | `npm run build` | `scripts/build.mjs` : esbuild (bundle, minification, IIFE, tree-shaking) puis insertion dans `src/index.template.html` ; produit `dist/estran-poc.html` |
| Tests + captures | `npm test` | `tests/run.cjs` : ouvre `dist/estran-poc.html` en `file://` dans Chromium headless 960x540, vérifie 9 points, écrit 4 PNG dans `captures/` |
| Tout d'un coup | `npm run all` | `npm ci && npm run build && npm test` |

Code de sortie non nul si un contrôle échoue : utilisable tel quel en CI.

## 4. Ce que vérifient les tests

Contexte WebGL2 ; hauteur d'eau basse -0,60 m puis haute 2,40 m (horloge pilotée par un crochet de test, donc déterministe) ; l'horloge de marée avance seule ; le faisceau tourne ; déplacement avant avec la touche W ; la caméra suit le relief ; la lampe s'éteint avec F ; aucune erreur console ni page ; 4 captures non vides.

Les crochets de test sont exposés par `window.__estran` (lecture d'état, réglage de l'horloge et de la position). Ils sont à garder dans le vrai jeu, sous un drapeau de build, pour tester sans humain.

## 5. Exécution réelle (2026-11-23)

Installation, build et tests exécutés dans cette session : build en 537 Kio, **9 contrôles sur 9 passés**, captures produites. Mesure indicative en rendu logiciel : environ 11 à 15 images/s à 960x540 (voir limites, ADR §4.3). Ce chiffre ne dit rien des performances sur un vrai GPU.

## 6. Sorties

| Fichier | Rôle | Versionné |
|---|---|---|
| `prototypes/estran-poc/dist/estran-poc.html` | version jouable autonome (≈ 0,55 Mo) | oui (< 2 Mo) |
| `prototypes/estran-poc/captures/*.png` | captures de contrôle (4 fichiers, ≈ 0,55 Mo au total) | oui, pour la revue |
| `node_modules/` | dépendances | non (déjà dans `.gitignore`) |

**Publication** : non faite par ce pipeline. La Coordination publie `dist/estran-poc.html` pour le propriétaire (page publiée ou lien équivalent).

## 7. Évolutions prévues du pipeline

1. TypeScript strict et `tsc --noEmit` dans le pipeline (voir ADR §1).
2. Tests de non-régression visuelle : comparaison de captures à tolérance (en rendu logiciel les images sont stables mais pas identiques à celles d'un GPU).
3. Harnais de simulation sans rendu (logique de marée, sauvegarde, énigmes) testé en Node pur : c'est la partie la plus fiable et la plus rapide.
4. Empaquetage Electron ou Tauri en CI (ADR §5) ; la signature et les comptes restent côté propriétaire.
5. Budget de poids en CI : échec si le HTML dépasse un seuil.

## 8. Version P2 : un seul fichier publiable (T-033)

> Auteur : `build-engineer` · 2026-11-25. Le jeu est dans `game/` (pas dans `prototypes/estran-poc/`).

| Étape | Commande (depuis `game/`) | Effet |
|---|---|---|
| Tout d'un coup | `npm run all` | `npm ci`, build, tests unitaires, tests P2 (automates), puis scénarios Playwright. Dure environ 15 à 40 minutes en rendu logiciel |
| Build seul | `npm run build` | `scripts/build.mjs` : génère les données, bundle esbuild (minifié, IIFE, `legalComments: 'inline'`), insère le texte MIT de `node_modules/three/LICENSE` dans la page, écrit **`game/dist/estran-p2.html`** (environ 655 Kio, limite 3 Mo) |
| Test de la version assemblée | `npm run test:p2file` | `tests/e2e/p2.cjs` : taille, licences, fichier autonome, écran de départ, formulaire des 8 questions, copie avec presse-papiers bloqué, stockage bloqué, aucune boîte de dialogue, aucune requête réseau, crochets cachés, une partie jouée par un automate, aucune erreur de console |
| Autres scénarios | `npm run test:e2e` | `p2.cjs`, `run.cjs`, `render.cjs`, `audio.cjs` sur le même fichier |

Règles de la version P2 :
- **Fichier unique** `dist/estran-p2.html` (remplace `dist/estran.html`) : aucun script, style, image ni police externe ; aucune requête réseau au chargement (vérifié par Playwright : toute requête autre que le fichier lui-même fait échouer le test).
- **Crochets de test** `window.__estran` : absents par défaut, présents seulement avec `?test=1`. Le harnais des tests (`tests/e2e/harness.cjs`) ajoute ce paramètre lui-même ; le joueur n'en a pas besoin.
- **Cadre verrouillé de la page publiée** : aucun `alert`, `confirm` ni `prompt` ; copie par `navigator.clipboard.writeText` avec repli sur une zone de texte visible et sélectionnée ; `localStorage` toujours dans un `try/catch`.
- **Licences** : voir `docs/legal/LICENCES.md` section 5 (avis `@license` conservés, texte MIT complet dans le fichier, écran « Crédits et licences », test de non-régression).
- **Mesure** : seules les images jouées entrent dans le compteur de performance (pas celles de l'écran de départ), pour que « Copier le rapport de performance » depuis l'écran de départ décrive la partie.
- **Publication** : non faite par ce pipeline. La Coordination publie `game/dist/estran-p2.html` comme page et reporte le lien dans `production/RAPPORT_P2.md`.
- **Ce qui n'est pas vérifié** : le comportement réel dans le cadre verrouillé de la page publiée (presse-papiers, verrouillage du pointeur, audio) n'a été simulé que par Playwright en local ; il se confirme à la première ouverture de la page publiée.
