# Rapport de remise : T-042, archivé par la Coordination

> Texte rendu par `game-designer` le 2026-11-27, résumé fidèlement par la Coordination.

## Livrables
- `docs/design/P2_CORRECTIONS.md` (nouveau ; un peu plus de 3 pages, textes exacts en tableaux).
- CSV modifiés (source de vérité) : `docs/design/data/maree.csv`, `stations.csv`, `menace.csv` (4 lignes). `game/` non touché (mesures faites sur une copie de travail hors dépôt) ; le programmeur lancera `npm run sync-data` en T-043.

## Corrections
- **C1 Guidage (priorité 1)** : fonction pure `guidance()` ; haut centre : objectif permanent, relevés n/3, temps restant ; haut droite : 3 échelles avec leur état (lue, « OUVERTE, reste M:SS », « s'ouvre dans M:SS », manquée) ; centre bas : une ligne d'action issue d'un tableau de 15 conditions (« Maintenez E pour lire », refus de lecture : eau trop basse, trop haute, mauvais sens de marée ; « Partez vers l'échelle N » ; « Retournez au phare : il reste M:SS » ; remontage du phare). Repère en losange sur la seule échelle utile, ou sur le phare ; ne montre jamais la Laisse. Quatre aides à usage unique (touches, lampe F, manivelle, « Quelque chose bouge dans l'eau. Ralentissez (C)… »). Écran de fin avec une raison par cause (`seized`, `drowned`, `window_missed`, `time_up` en deux variantes, victoire).
- **C2 Son** : bouton « Cliquer pour commencer (avec le son) » et conseil casque ; son de test de deux notes ; indicateur SON ACTIF / SON COUPÉ / SON INDISPONIBLE ; bandeau d'erreur si le contexte audio n'est pas `running` 1,5 s après le clic (3 essais de `resume()`) ; message si `AudioContext` est absent.
- **C3 Menace sans le son** : sous-titres actifs par défaut (clé `estran.audio.v1` → `v2`) ; remous visibles hors lumière de 25 m à 8 m (opacité 0,15 à 0,50) ; vignette bleu-noir de 0 à 0,45 selon la distance et l'état de la Laisse, divisée par deux en zone sèche ; croissant de bord d'écran en option. GDD §6.3 à mettre à jour après l'essai.
- **C4 Partie de 5 minutes** : 3 échelles gardées, marée comprimée à 300 s (facteur 0,625), sans code de simulation à changer. Risque : fenêtre de S1 de 49 s à 30 s, compensée par le guidage.
- **C5** : les 3 questions en un mot de `PORTE_P2.md` reprises telles quelles.

## Valeurs CSV avant / après
| Fichier | Valeur | Avant | Après |
|---|---|---|---|
| `maree.csv` | cycle, pas | 480 s, 10 s | 300 s, 5 s (61 lignes, étale haute à 150 s) |
| `stations.csv` | S1 fenêtre | 61-110 s | 38-68 s |
| `stations.csv` | S2 fenêtre | 160-320 s | 100-200 s |
| `stations.csv` | S3 fenêtre | 375-427 s | 235-266 s |
| `menace.csv` | `slice_duration` | 480 | 300 |
| `menace.csv` | `defeat_time_limit` | 480 | 300 |
| `menace.csv` | `threat_spawn_level` (−0,40 m inchangé) | t = 40 s | t = 25 s |
| `menace.csv` | `threat_despawn_level` (−0,30 m inchangé) | t = 431 s | t = 269 s |

## Mesures (copie de travail, graines 101-120 / 201-220)
| Automate | 101-120 | 201-220 |
|---|---|---|
| `prudent`, victoires | 19/20 | 20/20 |
| `noisy`, défaites | 20/20 | 20/20 |
| `silent`, victoires | 20/20 | 19/20 |
| `win`, victoires | 16/20 | 12/20 (ancien seuil ≤ 10 non tenu) |
| `heedless`, victoires | 16/20 | 13/20 (ancien seuil ≤ 10 non tenu) |
| Durée d'une victoire | 246-287 s | 251-286 s |

## À vérifier par le programmeur
1. Recaler `FEAR_WINDOW_S` (160 s → environ 100 s) et les seuils de `tests/p2/`.
2. Adapter les tests contenant 480 (`tide`, `sim`, `island`, `discrimination`).
3. Atteignabilité des 3 échelles, surtout S1 (départ au plus tard vers t = 50 s) et S3 (fenêtre de 31 s).
4. Parcours scripté « lent » pour confirmer la marge de S1.
5. Pas de recouvrement guidage / sous-titres à 1280×720 et 1920×1080.
6. Parité entre niveaux de qualité.
