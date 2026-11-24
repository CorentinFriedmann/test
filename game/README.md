# ESTRAN : noyau jouable (T-029, passes a et b)

Jeu web 3D (three.js 0.187.0, esbuild 0.28.2, JavaScript ES2022). Dépôt autonome : tout est dans `game/`.

```
npm install        # ou npm ci
npm run all        # npm ci + build (dist/estran.html) + tests unitaires (node --test) + scénarios Playwright
npm run test:unit  # tests Node (56 : 40 de la passe a, 16 de la passe b), sans navigateur
npm run test:e2e   # scénarios navigateur (après npm run build)
npm run sync-data  # recopie docs/design/data/*.csv dans data/ (source de vérité : docs)
```

- `src/sim/` : simulation pure à pas fixe de 30 Hz (ni three.js, ni DOM, ni horloge murale). Île, marée, bandes, échelles, lampe, noyade, victoire/défaite, journal de télémétrie, joueurs automatiques (`bot.js`).
- `src/data/` : lecture des CSV de `data/` (embarqués par `scripts/gen-data.mjs`). Aucune valeur d'équilibrage en dur.
- `src/render/` : scène three.js et niveaux de qualité (`?q=low|high`), qui n'influencent jamais la simulation.
- `src/ui/` : HUD (modèle pur + DOM) et saisies.
- Options d'URL : `?seed=N`, `?q=low|high`, `?debug=1` (F3 : chiffres, T : temps x6).
- Crochets de test : `window.__estran` (`getState`, `getTelemetry`, `setBot`, `advance`, `setQuality`, `restart`...).
- `data/monde.csv` appartient au jeu : paramètres de génération du terrain et règles absentes des tableaux du GDD.

## Passe b : bruit, la Laisse, phare

- `src/sim/threat.js` : automate de la Laisse (dormante, rode, enquete, traque, repli, attente au bord), ecoute (rayon de bruit, presence 4 m, erreur de position 3 m), apparition/disparition selon la maree, halo, faisceau, lampe, saisies. Generateur propre a graine (`seed ^ hash('laisse')`), avance par pas de simulation uniquement. Toutes les valeurs viennent de `menace.csv`; les reglages propres au jeu sont dans `monde.csv` (lignes marquees `passe b` ou GDD).
- `src/sim/sim.js` : bruit du joueur a chaque pas (max des sources x multiplicateur de bande, debris non multiplie), usure et remontage du phare (manivelle `world.crank`), froid apres une premiere saisie, defaite `seized` a la 2e saisie en 45 s.
- Evenements pour l'audio (T-031) : `sim.subscribe(fn)` (navigateur : `window.__estran.subscribe(fn)`) recoit chaque evenement du journal, dont `noise {src, x, z, r}` (toutes les 0,5 s tant que le rayon est positif, et a chaque debris heurte), `debris_hit`, `threat_spawn`, `threat_state {from, to, dist, source}` (le passage `roam -> inquire` est le grondement), `grab`, `lighthouse_low/out/wound`. Les memes evenements sont dans la telemetrie, avec `charge`, `threat`, `tx`, `tz` dans chaque echantillon.
- Etat lisible : `state.threat` (`active, mode, x, z, dist, heard, lit`), `state.lighthouse` (`charge, winding`), `state.noise`, `state.cold`, `state.grabs`. Distances audibles (`threat_audible_radius`, `threat_cue_roar_radius`) : a appliquer cote audio avec `threat.dist`.
- Rendu provisoire : silhouette sombre visible seulement quand le faisceau ou la lampe la touche (0,5 s), toujours avec `?debug=1`; anneaux d'eau (rayon proportionnel au bruit, max 8 m); debris, manivelle, faisceau qui vacille sous 20 %. HUD : jauge du phare (sans texte), anneau pour le remontage, vignette bleue du froid.
- Automates : `prudent` (revient a la manivelle apres chaque releve, gagne), `noisy` (releve S1 puis court vers la Laisse, 2 saisies, defaite).
- URL : `?threat=0` desactive la Laisse (comparaisons, pas de jeu normal). Crochets de test ajoutes : `subscribe`, `lookAt`.
- Coupes de la Boss respectees : pas d'haptique, pas de marche lente au stick (la touche C reste), pas de silhouette de faisceau.
