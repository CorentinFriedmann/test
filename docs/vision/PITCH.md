# ESTRAN, « une marée » : pitch

> **Tâche** : T-005 · **Auteur** : `game-director` · **Date** : 2026-11-23 · **Statut** : à valider par la Boss
> **Sources** : `production/DECISIONS.md`, `production/validations/T-004.md`, `docs/vision/DECISION_CONCEPT.md`, `docs/vision/PERIMETRE_SOLO.md` §2.1.
> Le concept est accepté **à l'essai** par le propriétaire (« oui pour essai, on verra ensuite pour évoluer »).

## Titre provisoire

**ESTRAN**. Un estran est la zone de la côte que la mer découvre et recouvre à chaque marée : le titre dit le jeu.

**Vérification d'antériorité : non vérifiée.** Aucun accès réseau n'a été utilisé pour cette tâche. À faire avant toute page publique : recherche du nom sur Steam, itch.io, les moteurs de recherche et les bases de marques. Le mot est un nom commun de géographie : le risque porte sur un jeu ou une marque du même nom, pas sur le mot lui-même. Si un conflit apparaît, le titre change sans effet sur le design.

## Pitch en une phrase (25 mots)

Technicienne sur une île coupée du monde par la marée, tu répares un marégraphe et gardes le phare allumé quand quelque chose remonte avec l'eau.

## Les deux règles à comprendre (test de la porte P2)

Ces deux énoncés doivent se comprendre sans image. Ils servent de test de compréhension à la porte P2.

**Règle de la marée**
L'eau monte et descend selon une horloge que tu lis sur ta montre et dans la table des marées. À marée basse, des chemins et un village englouti s'ouvrent ; à marée haute, ils sont noyés et tu dois être à l'abri. Tu planifies donc chaque sortie avant que la mer ne revienne.

**Règle de la menace : bruit dans l'eau, lumière du phare**
Ce qui remonte avec l'eau ne te voit pas : il t'entend quand tu fais du bruit dans l'eau, en marchant vite, en courant ou en heurtant des objets. La lumière du phare le fait reculer et le tient loin du phare, alors garde-le allumé ; plus loin, seul le silence te protège. Tu n'as aucune arme : tu avances lentement, tu écoutes, tu restes au sec ou dans la lumière.

## Pitch en un paragraphe

ESTRAN est un jeu d'horreur calme, en solo, jouable dans le navigateur. Tu es une technicienne envoyée réparer un vieux marégraphe sur une petite île que la marée coupe du monde deux fois par jour. À marée basse, la mer découvre un village englouti qu'on peut fouiller : des maisons, des lettres, des enregistrements, les traces de ceux qui ont vécu là. À marée haute, quelque chose remonte avec l'eau. Tu n'as pas d'arme : tu lis les marées pour savoir quand sortir, tu évites de faire du bruit dans l'eau, et tu gardes la lumière du phare allumée. Le rendu est stylisé et atmosphérique (brouillard, lumière rasante, grain, écume). La partie dure 1 h 30 à 2 h 30, en 4 marées sur 2 jours.

## Pitch en une page

### Le fantasme du joueur

Être seul face à la mer et à ce qu'elle cache, et s'en sortir en comprenant les lieux plutôt qu'en tirant. Le plaisir vient de la maîtrise : au début, la marée est une menace ; à la fin, on la lit comme une carte.

### Le hook (lisible en 10 secondes de trailer)

La mer monte et efface le chemin. Un plan large : une île grise, un phare, un village de pierre qui sort de l'eau à marée basse. Puis l'eau revient, et quelque chose avance avec elle.

### Ce que le joueur fait

- **Il lit les marées.** L'horloge de la marée décide où l'on peut aller et pendant combien de temps. La table des marées et la montre sont dans le monde, pas dans un menu.
- **Il fouille le village englouti** à marée basse : intérieurs, photos, lettres, cassettes, radio. L'histoire se reconstitue par traces ; les personnages (2 à 3) ne sont jamais montrés en gros plan.
- **Il fait attention au bruit.** Marcher dans l'eau, courir ou faire tomber un objet s'entend. La menace, presque invisible (remous, traces, silhouette lointaine), répond au bruit.
- **Il garde le phare allumé.** La lumière du phare et sa lampe font reculer la menace, près du phare. Entretenir la lumière coûte du temps, donc des choix.
- **Il répare le marégraphe**, ce qui donne le fil du jeu et la raison de rester sur l'île.

### Structure et durée

4 marées sur 2 jours (jamais plus de 5 en cas de glissement), 1 h 30 à 2 h 30 de jeu, une fin, éventuellement deux. Un seul lieu : une petite île avec un phare et 4 à 6 intérieurs. Pas d'arme, pas de combat.

### Ambiance et rendu

Stylisé et atmosphérique : brouillard, lumière rasante, faisceau du phare, grain, écume. Le rendu sert l'inquiétude et la lisibilité ; il ne cherche pas à imiter la réalité. Le son porte au moins la moitié de la peur : eau, vent, pas, grincements, radio. Il n'y a ni dialogue animé ni visage en gros plan ; les voix éventuelles sont de la radio ou des cassettes filtrées, selon la décision de T-024.

### Plateforme et public

Solo, sur PC, dans le navigateur d'abord (démo gratuite sur itch.io, puis Steam). Public : joueurs d'horreur calme et d'exploration atmosphérique, qui aiment les jeux courts et d'ambiance. Prix de travail 9,99 à 14,99 USD, à confirmer avec la démo.

### Ce qui nous distingue

Une mécanique unique et lisible (une horloge naturelle qui ouvre et ferme le monde), une menace qu'on entend plus qu'on ne la voit, et un périmètre assez petit pour être fini. La peur vient de la planification et de l'écoute, pas du combat.

### Risques assumés

Le genre est très encombré, la peur d'une menace presque invisible n'est pas garantie, et la vendabilité n'est pas démontrée (voir `production/validations/T-004.md` §8). Les portes d'arrêt P1 à P4 de ce document s'appliquent : si le prototype de marée et de menace ne fait pas peur ou ne se comprend pas en moins de 10 minutes, on ne poursuit pas ESTRAN tel quel.
