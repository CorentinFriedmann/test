# Rééquilibrage de la peur avant P2 (T-037)

> Auteur : `game-designer`, 2026-11-25. Traite BUG-002 et BUG-003. Seules les valeurs des CSV ont changé (`docs/design/data/menace.csv`, recopié dans `game/data/` par `npm run sync-data`). Aucune ligne de `src/sim/` modifiée.

**Avertissement : des automates ne ressentent rien.** Tout ce qui suit mesure des distances, des victoires et des saisies. Que la Laisse soit à moins de 15 m avant 160 s ne dit pas que le joueur a peur. Seul le propriétaire le dira (questions 5 et 7 de `docs/qa/QUESTIONNAIRE_P2.md`). Ce réglage rend la peur **possible et mesurable**, pas prouvée.

## Diagnostic

1. **Pas de peur au début.** Avec une portée de 70 m, le faisceau repoussait la Laisse presque partout tant que la charge dépassait 20 %. Le joueur prudent reste en plus à la manivelle, sur le plateau : l'eau n'arrive à moins de 15 m de la manivelle qu'au niveau 1,6 m (t ≈ 160 s). Une approche avant 160 s n'est donc possible que pendant les trajets vers les échelles (S1 vers 50 à 75 s, S2 vers 150 à 175 s), à condition que la Laisse soit près de ces trajets.
2. **La règle ne punissait que l'extrême.** Un joueur qui ignore la règle sans chasser la Laisse gagnait 70 à 80 % des parties : la Laisse n'entendait presque rien (bruit de marche 8 m) et le faisceau couvrait tout.
3. **Effet de bord trouvé en réglant.** Dès que le faisceau ne couvre plus les échelles lointaines, le prudent se faisait saisir deux fois en 10 s au retour de S3 (t ≈ 375 à 387 s, 8 défaites sur 40 parties sur des graines d'essai) : le recul de la Laisse après une première saisie (6 s, 8 m) était trop court pour fuir.

## Valeurs avant et après

| Paramètre | Fichier | Avant | Après | Raison (mesure) |
|---|---|---|---|---|
| `lighthouse_beam_reach` | menace.csv | 70 m | **40 m** | Levier principal des approches : à 70 m, 0 approche avant 160 s ; à 40 m, 9 à 12 parties sur 20 en ont. Sous 35 m le prudent perd trop (14 à 17 victoires sur 20) |
| `threat_spawn_dist_min` / `max` | menace.csv | 45 / 70 m | **15 / 35 m** | La Laisse naît près du trajet de S1. 25 à 45 m ne donnait que 45 % d'approches, 20 à 40 m environ 65 %, 15 à 35 m 75 à 80 % |
| `threat_spawn_level` | menace.csv | -0,20 m (57 s) | **-0,40 m (40 s)** | Apparition avant le départ du joueur vers S1. À -0,20 m, `win` remontait à 55 % de victoires (limite à 50 %) |
| `threat_waypoint_min` / `max` | menace.csv | 15 / 45 m | **5 / 30 m** | La ronde se fait plus près du joueur : approches de 18/40 à 34/40 sur un lot d'essai de 40 graines |
| `noise_walk` / `noise_run` | menace.csv | 8 / 18 m | **12 / 24 m** | Bruits ordinaires mieux entendus : sans ce changement, `heedless` gagnait 65 % sur le lot d'essai. `noise_slow` (4 m) inchangé : la marche lente reste le moyen d'être discret |
| `threat_grab_recoil` | menace.csv | 6 s | **10 s** | Corrige l'effet de bord 3 : `prudent` passe de 80-88 % à 100 % de victoires |
| `threat_grab_recoil_dist` | menace.csv | 8 m | **14 m** | idem |

Inchangés après essai : `maree_effets.csv`, `monde.csv`, le halo (14 m), la durée de repli du faisceau (3 s), la charge du phare. Les essais sur la durée de repli, le halo, le rayon de présence et la vitesse de ronde n'ont pas donné de gain net.

Effet de règle (GDD mis à jour, §6.2, §7.1, §13) : le faisceau protège désormais le phare et ses abords, **pas les échelles lointaines** (S1 à 35-50 m et S3 à 35-50 m du phare sont en bordure ou hors de portée). Remonter le phare reste utile, mais c'est le bruit (marcher lentement, ne pas courir) qui protège pendant les trajets.

## Mesures (`npm run p2:report`, puis `node tests/p2/run.mjs verify`)

Réglage sur les graines **101 à 120** ; vérification sur **201 à 220**, jamais utilisées pour régler. Victoires sur 20 parties.

| Automate | Seuil | 101-120 avant | 101-120 après | 201-220 avant | 201-220 après |
|---|---|---|---|---|---|
| `prudent` : victoires | >= 18 | 20 | **20** | 20 | **20** |
| `prudent` : parties avec une approche (< 15 m) avant 160 s | >= 10 | 0 | **15** | 0 | **16** |
| `win` : victoires | <= 10 | 14 | **6** | 13 | **8** |
| `heedless` : victoires | <= 10 | 16 | **9** | 15 | **8** |
| `noisy` : défaites | >= 18 | 20 | **20** | 20 | **20** |
| `silent` : victoires | >= 16 | 20 | **20** | 20 | **20** |
| Durée d'une victoire (tous automates) | 300 à 600 s | 392 à 428 s (prudent, silent) | **387 à 428 s** (55 victoires) | 392 à 427 s | **387 à 427 s** (56 victoires) |

Les seuils sont inscrits dans `game/tests/p2/discrimination.test.js`, pour les deux jeux de graines. Un lot d'essai supplémentaire de 40 graines (301 à 340, hors rapport) a servi à vérifier que le réglage ne tient pas à une chance sur 20 parties : `prudent` 40/40, approches 34/40, `win` 15/40, `heedless` 20/40, `silent` 40/40.

Autres mesures sur 101-120 après réglage : le prudent subit 0,75 approche en moyenne avant 160 s et 5,3 s à moins de 15 m avant 160 s (avant : 0 et 0 s) ; 7 saisies sur 20 parties (aucune avant), toutes survivables ; la durée d'une défaite par saisie de `noisy` tombe à 77-89 s (avant 84-289 s) car la Laisse naît plus près.

## Limites et risques

- **Le prudent subit maintenant des saisies** (7 sur 20 parties, dont 3 avant 160 s). C'est voulu, mais si le propriétaire trouve le jeu trop dur, les leviers sont `threat_spawn_dist_min` (remonter à 20 ou 25 m) et `lighthouse_beam_reach` (45 m).
- **Peur tôt : réglage entre -0,40 m et -0,20 m** (t = 40 s ou 57 s). À -0,40 m la Laisse peut apparaître avant même que le joueur ait quitté le phare ; un joueur qui reste sur le plateau la voit plus tard (74 à 101 s, première position valide à 15-35 m).
- **Un automate suit un chemin fixe** : un humain qui attend plus longtemps, éclaire avec la lampe (l'automate ne l'utilise pas) ou prend un autre chemin n'aura pas les mêmes chiffres. Ni la lampe, ni le son réel ne sont mesurés ici.
- **Aucun code nécessaire.** Un seul besoin éventuel pour plus tard : un joueur d'appoint qui utilise la lampe, si le propriétaire dit que le jeu est trop dur.
