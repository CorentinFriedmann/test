# ESTRAN, « une marée » : piliers de design

> **Tâche** : T-005 · **Auteur** : `game-director` · **Date** : 2026-11-23 · **Statut** : à valider par la Boss
> Un pilier est une promesse faite au joueur. Chaque décision de design, d'art, de son et de code doit en servir au moins un. Si elle n'en sert aucun, on ne la fait pas.
> Cadre : jeu solo sur PC (navigateur), rendu stylisé atmosphérique, 1 h 30 à 2 h 30, 4 marées.

## Pilier 1 : La marée est l'horloge et la carte

Le monde s'ouvre et se ferme avec l'eau. Le joueur planifie, il ne subit pas.

**On fait**
- Une horloge de marée visible dans le monde (montre, table des marées) et une hauteur d'eau continue.
- Deux états de référence (marée basse, marée haute) qui changent vraiment les chemins et les lieux accessibles.
- Un village englouti qui n'existe à découvert que pendant une fenêtre limitée.

**On ne fait pas**
- Autres îles.
- Mode rejouable.

## Pilier 2 : La peur vient de ce qu'on entend

La menace est presque invisible. Elle répond au bruit dans l'eau, pas à la vue.

**On fait**
- Une menace révélée par le son, les remous, les traces et une silhouette lointaine ou à contre-jour.
- Un bruit lisible : le joueur sait pourquoi il a été entendu.
- Un son riche, qui porte au moins la moitié de la peur.

**On ne fait pas**
- Combat.
- Corps complet.

## Pilier 3 : La lumière est la seule arme

Pas d'arme. Le phare et la lampe sont la défense, et les entretenir est un choix.

**On fait**
- Le faisceau du phare comme règle de jeu : il fait reculer la menace près du phare.
- Une lampe à main pour les intérieurs noyés, avec ses limites.
- Un coût réel à l'entretien de la lumière (du temps pris sur l'exploration).

**On ne fait pas**
- Artisanat.
- Bateau.

## Pilier 4 : Une ambiance stylisée, des traces plutôt que des visages

Le rendu sert l'inquiétude et la lisibilité. L'histoire se lit dans les objets, pas dans des personnages animés.

**On fait**
- Un rendu stylisé atmosphérique : brouillard, lumière rasante, grain, écume.
- Une histoire par traces : lettres, photos, cassettes, radio, pour 2 à 3 personnages.
- Une interface dans le monde (montre, table des marées, carnet).
- Un jeu court, fini, de 1 h 30 à 2 h 30, avec une fin (éventuellement deux).

**On ne fait pas**
- Mode photo.
- Doublage.
- Multijoueur.

## Liste « on ne fait pas » (reprise telle quelle de `production/validations/T-004.md` §6)

> Cette liste est gelée. Elle est reprise sans changement et n'est pas élargie. Toute demande hors périmètre passe par la `producer` (registre de dérive, porte P4) et remplace autre chose.

Autres îles, bateau, combat, artisanat, mode photo, mode rejouable, corps complet, doublage, multijoueur, portage console.

## Comment utiliser les piliers

- Test d'une idée : quel pilier sert-elle ? Si aucun, on la refuse. Si elle en sert un mais figure dans la liste ci-dessus, on la refuse aussi.
- Test de compréhension (porte P2) : un joueur extérieur doit énoncer la règle de la marée et la règle de la menace (`docs/vision/PITCH.md`) en moins de 10 minutes de jeu.
- En cas de conflit entre piliers, l'ordre de priorité est : 2 (la peur vient de ce qu'on entend), 1 (la marée), 3 (la lumière), 4 (l'ambiance).
