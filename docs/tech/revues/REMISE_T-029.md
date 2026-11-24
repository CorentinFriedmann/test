# Rapport de remise : T-029 (passes a et b), archivé par la Coordination

> Texte rendu par `gameplay-programmer` le 2026-11-24, archivé tel quel par la Coordination pour que la Boss
> puisse valider les écarts au GDD (demande de la revue TD, `REVUE_T-029.md`).

## Résultat de `npm run all` (exécuté réellement, code de sortie 0)
- Build OK. Tests unitaires : 56 sur 56 verts (40 de la passe a, 16 nouveaux dans `tests/unit/threat.test.js`).
- E2E Playwright : 37 sur 37 verts (24 + 13 nouveaux), aucune erreur ni avertissement dans la console.
- Parité verte : les qualités low et high, et le pas réel ou manuel, donnent un journal identique, égal à celui de la victoire.

## Livré
1. **Bruit** : rayon = max(base de l'action × multiplicateur de bande), débris non multiplié (30 m pendant 1 s, une fois par contact).
   - Événement `noise {src, x, z, r}` toutes les 0,5 s tant que R > 0, plus `debris_hit`.
   - Exposé dans la télémétrie et par `sim.subscribe(fn)`.
   - 4 débris placés de façon déterministe.
2. **La Laisse** (`src/sim/threat.js`, générateur à graine propre) :
   - apparition vers t = 57 s, disparition vers t = 431 s ;
   - états roam, inquire, hunt, flee, bank_wait ;
   - écoute (rayon, présence à 4 m, erreur de position de 3 m) ;
   - repli sous le faisceau (3 s) et sous la lampe (0,8 s puis 5 s) ; halo de 14 m tant que la charge est positive ;
   - saisie après 0,5 s de contact hors zone sèche : froid ×0,6 pendant 10 s, recul de 8 m en 6 s ;
   - 2e saisie en 45 s ou moins : défaite `seized`.
3. **Phare** :
   - usure de 0,5 %/s, `lighthouse_low` à 160 s, `lighthouse_out` à 200 s ;
   - portée proportionnelle sous 20 % de charge ;
   - remontage en maintenant E 5 s à moins de 2,5 m de la manivelle, avec un bruit de 4 m ;
   - HUD sans texte.
4. **Tests** : 16 unitaires. Automates `prudent` (gagne en remontant le phare, 0 saisie, t = 394 s) et `noisy` (2 saisies, défaite `seized`).

## Paramètres ajoutés à `game/data/monde.csv` (absents de `menace.csv`)
lighthouse_crank_distance, noise_event_period_s, debris_noise_duration_s, debris_ground_min/max,
debris_dist_min/max, debris_min_separation, debris_station_clearance, threat_spawn_depth_max, threat_spawn_tries,
threat_spawn_retry_s, threat_spawn_relax_after_s, threat_spawn_dist_relaxed, threat_perceive_refresh_s,
threat_arrive_radius, threat_bank_stand_dist, threat_waypoint_tries, threat_steer_step_deg, threat_steer_max_deg,
threat_lit_duration_s. Aucune incohérence bloquante dans `menace.csv`.

## Écarts et interprétations par rapport au GDD (à valider par la Boss)
1. **TRAQUE** : la Laisse vise la position réelle du joueur tant qu'elle l'entend, puis la dernière position connue. L'erreur de 3 m ne s'applique qu'à ENQUÊTE (sinon elle tournerait autour du joueur sans le toucher).
2. **ENQUÊTE → TRAQUE à moins de 6 m** : sur la distance seule, sans exiger d'écoute (lecture littérale du CSV). Un joueur silencieux à moins de 6 m est donc retraqué.
3. **Écoute cumulée** : le cumul est remis à zéro après 6 s de silence (le GDD ne le précise pas).
4. **ATTENTE_BORD** : déclenchée quand la Laisse en TRAQUE ne peut plus avancer vers un joueur en zone sèche, ou se trouve à 2 m ou moins.
5. **Recul après saisie** : REPLI qui s'arrête après 8 m parcourus, puis attend la fin des 6 s.
6. **Équilibrage** : le faisceau couvre 70 m. Tant que la charge est d'au moins 20 %, la Laisse est repoussée presque partout et ne s'approche quasiment jamais. Le danger réel commence sous 20 % (t ≈ 160 s) et à 0 % (t ≈ 200 s). Point à surveiller au playtest.
7. **Automate `noisy`** : il lit d'abord S1, car la fenêtre de S1 se ferme à 110 s, avant l'extinction du phare à 200 s.
8. **Coupes de la Boss respectées** : pas d'haptique, pas de marche lente au stick (la touche C est conservée), pas de silhouette de faisceau.

Hors périmètre : l'audio (T-031). Les distances audibles `threat_audible_radius` et `threat_cue_roar_radius` sont à appliquer côté audio avec `state.threat.dist`.
Ajouts hors liste : option d'URL `?threat=0` et crochets de test `subscribe` et `lookAt`.
