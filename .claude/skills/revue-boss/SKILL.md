---
name: revue-boss
description: Soumet une tâche terminée (ID T-XXX en argument) à la Boss du studio pour validation ou refus, puis applique son verdict au backlog.
---

# Soumettre une tâche à la Boss

1. Récupère l'ID `T-XXX` passé en argument. Sans ID, liste les tâches `EN REVUE BOSS` du
   `production/BACKLOG.md` et demande laquelle soumettre.
2. Vérifie dans le backlog que les livrables de la tâche existent dans le dépôt. S'il en manque,
   signale-le et ne soumets pas.
3. Passe la tâche au statut `EN REVUE BOSS` si ce n'est pas déjà fait.
4. Invoque l'agent `boss` avec l'ID de la tâche, la liste des livrables et le dernier rapport de remise s'il est disponible.
5. Vérifie que `production/validations/T-XXX.md` a été écrit et que le statut du backlog correspond au verdict.
6. Rapporte à l'utilisateur le verdict, les notes et les retours principaux. Si la tâche est refusée,
   propose de la renvoyer à son agent avec `/sprint T-XXX`.
