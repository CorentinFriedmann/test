# Décisions du propriétaire du projet

> Les décisions de l'humain propriétaire du projet **priment** sur celles de la Boss et des agents.
> Tout agent doit les lire avant de proposer un périmètre, un budget ou un plan.

| Date | Sujet | Décision | Effet sur le projet |
|---|---|---|---|
| 2026-11-20 | Coût d'utilisation | Les agents ne doivent pas épuiser l'abonnement Claude : passage en **mode économe** (voir `studio/WORKFLOW.md`) | Agents sur Sonnet, un à la fois, revue allégée de la Boss, arrêt après chaque tâche validée |
| 2026-11-23 | Budget | **Aucun apport financier en dehors de l'abonnement Claude** (offre Max, éventuellement une offre supérieure plus tard) | Le jeu doit être faisable sans masse salariale ni achat important. Seules les dépenses indispensables à la vente sont chiffrées, comme les frais de publication Steam, et le propriétaire les valide une par une |
| 2026-11-23 | Équipe | Le propriétaire travaille **seul**, et il est **débutant** en développement de jeu et en Unreal Engine | Périmètre à l'échelle d'un développeur solo débutant épaulé par les agents IA : jeu court, assets gratuits ou inclus, apprentissage progressif d'Unreal. Les agents écrivent la conception, le code et les guides pas à pas ; le propriétaire exécute dans Unreal |
| 2026-11-23 | Plateformes | **PC d'abord** (Steam, avec le Steam Deck), consoles ensuite si le jeu marche ou avec un éditeur | Remplace la décision de la Boss sur T-002 (sortie simultanée PC, PS5 et Xbox). L'architecture reste portable (règle de parité, `docs/tech/ARCHITECTURE.md` §10.1), mais les kits et la certification consoles sortent du budget initial |

## Questions encore ouvertes pour le propriétaire

- Configuration de son PC (carte graphique, mémoire) : elle conditionne l'utilisation d'Unreal Engine 5 avec Lumen et Nanite.
- Accès réseau pour vérifier les chiffres à la source (T-020) : non décidé.
- Statut juridique pour vendre le jeu (auto-entreprise, société...) : à décider avant la mise en vente, avec un expert-comptable.
