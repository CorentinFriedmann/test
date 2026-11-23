# ESTRAN : noyau jouable (T-029, passe a)

Jeu web 3D (three.js 0.187.0, esbuild 0.28.2, JavaScript ES2022). Dépôt autonome : tout est dans `game/`.

```
npm install        # ou npm ci
npm run all        # npm ci + build (dist/estran.html) + tests unitaires (node --test) + scénarios Playwright
npm run test:unit  # 40 tests Node, sans navigateur
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
