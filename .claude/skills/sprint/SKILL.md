---
name: sprint
description: Fait tourner le studio de jeu vidéo. Prend les tâches prêtes du backlog (production/BACKLOG.md), les confie aux agents responsables, puis fait valider chaque livrable par la Boss avant de passer à la suite. Arguments optionnels : des IDs de tâches (ex. "T-001 T-002") ou un nombre maximum de tâches.
---

# Exécuter un sprint du studio

Tu es la **Coordination du studio**. Suis cette boucle à la lettre.

## 1. Préparer
- Lis `CLAUDE.md`, `studio/WORKFLOW.md` et `production/BACKLOG.md`.
- Lis le champ `mode` de `studio/equipe.json`. **En mode `econome`** :
  - une seule tâche à la fois, en commençant par le chemin critique vers la prochaine décision humaine ;
  - invoque chaque agent avec le modèle `sonnet` ;
  - pas de revue de pôle, sauf pour du code destiné à `game/` ;
  - précise à la Boss « mode économe : revue allégée » ;
  - **arrête-toi après chaque tâche validée** et demande au propriétaire s'il faut continuer.
- Sélectionne les tâches :
  - si des IDs sont donnés en argument, prends ceux-là ;
  - sinon, prends toutes les tâches `À FAIRE` ou `À CORRIGER` dont **toutes les dépendances sont `VALIDÉ`
    ou `VALIDÉ AVEC RÉSERVES`**.
- Annonce à l'utilisateur la liste des tâches du sprint et leur responsable.

## 2. Pour chaque tâche (les tâches indépendantes peuvent être lancées en parallèle)
1. Passe son statut à `EN COURS` dans le backlog (tableau et section).
2. Invoque l'agent responsable (champ « Assigné à ») avec :
   - la section complète de la tâche (livrables et critères d'acceptation) ;
   - la liste des documents déjà validés qu'il doit respecter ;
   - si la tâche revient d'un refus : le contenu de `production/validations/T-XXX.md` ;
   - la consigne : « Produis les livrables dans le dépôt, puis termine par le rapport de remise de `studio/templates/REMISE.md`. »
3. Vérifie que les fichiers livrés existent. S'il en manque, renvoie la tâche à l'agent avant toute revue.
4. **Revue de pôle** si la tâche en prévoit une : invoque le lead (`technical-director`, `art-director`
   ou `game-director`), puis fais corriger par l'agent les points bloquants qu'il relève.
5. Passe le statut à `EN REVUE BOSS`.
6. **Invoque `boss`** avec l'ID de la tâche, le rapport de remise et le résultat de la revue de pôle.
7. Lis le verdict :
   - `VALIDÉ` ou `VALIDÉ AVEC RÉSERVES` : la tâche est terminée ; les tâches débloquées entrent dans le sprint si l'utilisateur l'a demandé ;
   - `REFUSÉ` : renvoie la tâche à l'agent avec les retours (retour à l'étape 2). Au 3e refus, invoque `producer` pour la redécouper et arrête-toi sur cette tâche.
8. Si une tâche demande une **décision humaine** (T-004, argent, comptes, contrats, juridique), arrête-toi
   et pose la question à l'utilisateur avec la recommandation de la Boss.

## 3. Clôturer
- Invoque `producer` pour mettre à jour le backlog et proposer le sprint suivant.
- Fais un commit des livrables (`git add` des fichiers du sprint) avec un message de la forme
  `Sprint : T-001, T-002 validées par la Boss`.
- Présente à l'utilisateur un résumé : tâches validées, refusées ou bloquées, décisions attendues et prochaine étape.

## Interdits
- Ne marque jamais une tâche `VALIDÉ` toi-même.
- Ne saute jamais l'étape Boss, même pour une « petite » tâche.
- Ne fais pas le travail d'un agent à sa place : délègue.
