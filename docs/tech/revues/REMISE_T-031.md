# Rapport de remise : T-031 (résumé archivé par la Coordination)

> Rendu par `audio-director` (qui a écrit le code lui-même, sur arbitrage de la Boss) le 2026-11-24. Archivé pour la revue de pôle et la Boss.

- **Audio 100 % synthèse Web Audio** : aucun fichier, aucune voix, aucune dépendance.
  - Code : `game/src/audio/` (`spatial.js`, `mix.js`, `director.js`, `caption-text.js`, `settings.js`, `engine.js`, `index.js`, `offline.js`), `src/ui/captions.js`, `src/ui/audio-opts.js`.
  - Documentation : `docs/audio/NOTES_AUDIO_P2.md`.
- **Réserve de T-029 traitée** : `try/catch` par écouteur dans `sim.subscribe` et dans le journal. Les erreurs vont dans `sim.listenerErrors` (hors télémétrie). Deux tests : télémétrie identique avec un écouteur fautif, et désabonnement pendant l'appel. La logique de simulation est inchangée.
- **Contenu** :
  - mer et vent selon la marée (-19,7 dBFS efficace à marée haute, -27,9 à marée basse) ;
  - 8 variantes de bruit dans l'eau, spatialisées par `StereoPannerNode` piloté par `panOf` (fonction pure). Test `OfflineAudioContext` : la balance suit la position de la source et l'orientation du joueur ;
  - Laisse : remous sous 45 m (`threat_audible_radius`), grondement et grognement sous 60 m (`threat_cue_roar_radius`), sous-grave et battement de cœur selon l'angoisse, effet de saisie ;
  - phare : ronronnement positionnel, panne, glas, chute grave ;
  - volume et coupure (touche M, curseur) ;
  - sous-titres des bruits, désactivés par défaut (touche K), avec 8 secteurs de direction ;
  - démarrage sur un geste du joueur, sans erreur de console.
- **Tests (`npm test` complet, environ 40 min)** :
  - 72 tests unitaires ;
  - 37 e2e jeu, 25 e2e rendu, 29 e2e audio.
- **Crête** : parcours `prudent`, `win` et `noisy` rendus hors ligne. La crête maximale est de **-3,9 dBFS** (cible -1), sans aucun écrêtage. Limiteur de sortie à -1,4 dBFS.
- Bundle de 644 Kio.
- **Limites** :
  - **personne n'a écouté** le résultat : le timbre et l'effet de peur sont des hypothèses ;
  - le niveau efficace est d'environ -20 dBFS, le LUFS n'est pas mesuré ;
  - les gains et fréquences sont dans `engine.js` et `mix.js`, pas dans les CSV ;
  - pas d'occlusion, de réverbération ni de HRTF ;
  - pas de musique.
