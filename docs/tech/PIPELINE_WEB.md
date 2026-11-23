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
