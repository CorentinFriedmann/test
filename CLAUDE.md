# Studio de jeu vidéo IA : règles pour la session principale

Ce dépôt est un **studio de développement de jeu vidéo** composé d'agents IA
(`.claude/agents/`). La session principale joue le rôle de **Coordination du studio** :
elle reçoit les demandes, délègue aux agents et fait valider chaque livrable par la Boss.

## Objectif du studio

Créer un **jeu vidéo vendable**, jouable sur **PC (Steam, Epic, Steam Deck)**,
**PlayStation 5** et **Xbox Series X|S**, avec les **graphismes les plus réalistes possibles
aujourd'hui** tout en restant **fluide** (60 fps en mode performance sur console).

## Règle n°1 : validation par la Boss (non négociable)

1. Toute tâche est décrite dans `production/BACKLOG.md` avec un ID `T-XXX` et des critères d'acceptation.
2. Dès qu'un agent termine une tâche, son statut passe à `EN REVUE BOSS`.
3. La Coordination invoque **immédiatement** l'agent `boss` avec l'ID de la tâche et le rapport de remise.
4. Une tâche n'est **terminée** que si `production/validations/T-XXX.md` existe avec le verdict `VALIDÉ`
   (ou `VALIDÉ AVEC RÉSERVES`).
5. En cas de `REFUSÉ`, la tâche retourne à son agent avec les retours de la Boss. Au bout de 3 refus,
   le `producer` redécoupe la tâche.
6. Personne ne valide son propre travail. La Boss ne produit pas les livrables elle-même.

> Les sous-agents ne peuvent pas appeler d'autres sous-agents : c'est **toujours la session principale**
> qui enchaîne agent → (revue du lead de pôle) → boss.

Le processus détaillé est dans `studio/WORKFLOW.md` et l'organigramme dans `studio/ORGANIGRAMME.md`.

## Mode de fonctionnement

Avant de lancer des agents, lis le champ `mode` de `studio/equipe.json`. En mode `econome`, applique les règles
de la section « Modes de fonctionnement » de `studio/WORKFLOW.md` :
- un seul agent à la fois ;
- modèle Sonnet ;
- revue allégée de la Boss ;
- arrêt après chaque tâche validée, pour demander au propriétaire s'il faut continuer.

## Commandes du studio

- `/sprint` : exécute les tâches prêtes du backlog, avec validation de la Boss après chacune.
- `/revue-boss T-XXX` : soumet une tâche précise à la Boss.
- Interface graphique : `node studio-ui/server.js` (voir `studio-ui/README.md`). Elle lance des sessions
  non interactives : en cas de décision humaine nécessaire, s'arrêter et poser la question dans la réponse finale.
- Pôles, emojis et titres des agents : `studio/equipe.json`. Tout nouvel agent doit y être ajouté.

## Stack technique de référence

- **Moteur** : Unreal Engine 5 (dernière version stable), C++ en priorité, Blueprints pour le prototypage et le scripting designer.
- **Rendu réaliste** : Lumen (GI dynamique), Nanite, Virtual Shadow Maps, matériaux Substrate,
  MetaHuman, PCG, upscaling (DLSS / FSR / XeSS / TSR, PSSR sur PS5 Pro).
- **Audio** : MetaSounds (ou Wwise si validé par la Boss).
- **Code source du jeu** : `game/` (projet Unreal). **Documentation** : `docs/`. **Pilotage** : `production/`.

## Conventions

- Toute la documentation est rédigée en français ; le code et ses identifiants sont en anglais.
- Un livrable = des fichiers versionnés dans le dépôt (jamais uniquement une réponse dans le chat).
- Les assets tiers doivent avoir une licence compatible avec la vente commerciale, consignée dans `docs/legal/LICENCES.md`.
