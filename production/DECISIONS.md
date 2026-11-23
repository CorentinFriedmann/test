# Décisions du propriétaire du projet

> Les décisions de l'humain propriétaire du projet **priment** sur celles de la Boss et des agents.
> Tout agent doit les lire avant de proposer un périmètre, un budget ou un plan.

| Date | Sujet | Décision | Effet sur le projet |
|---|---|---|---|
| 2026-11-20 | Coût d'utilisation | Les agents ne doivent pas épuiser l'abonnement Claude : passage en **mode économe** (voir `studio/WORKFLOW.md`) | Agents sur Sonnet, un à la fois, revue allégée de la Boss, arrêt après chaque tâche validée |
| 2026-11-23 | Budget | **Aucun apport financier en dehors de l'abonnement Claude** (offre Max, éventuellement une offre supérieure plus tard) | Le jeu doit être faisable sans masse salariale ni achat important. Seules les dépenses indispensables à la vente sont chiffrées, comme les frais de publication Steam, et le propriétaire les valide une par une |
| 2026-11-23 | Équipe | Le propriétaire travaille **seul**, et il est **débutant** en développement de jeu et en Unreal Engine | Périmètre à l'échelle d'un développeur solo débutant épaulé par les agents IA : jeu court, assets gratuits ou inclus, apprentissage progressif d'Unreal. Les agents écrivent la conception, le code et les guides pas à pas ; le propriétaire exécute dans Unreal |
| 2026-11-23 | Plateformes | **PC d'abord** (Steam, avec le Steam Deck), consoles ensuite si le jeu marche ou avec un éditeur | Remplace la décision de la Boss sur T-002 (sortie simultanée PC, PS5 et Xbox). L'architecture reste portable (règle de parité, `docs/tech/ARCHITECTURE.md` §10.1), mais les kits et la certification consoles sortent du budget initial |
| 2026-11-23 | Implication | Le propriétaire **ne veut rien avoir à faire lui-même** (ni Unreal, ni assemblage, ni tests) | Remet en cause le plan « vous assemblez dans Unreal, les agents écrivent ». Le choix de la voie technique (agents autonomes avec un rendu plus modeste, ou Unreal piloté à distance sur le PC du propriétaire) lui est soumis avant T-004 |
| 2026-11-23 | Voie technique | **Les agents font tout** : jeu 3D en technologie web (three.js ou équivalent), fabriqué et testé par les agents dans le cloud. Le propriétaire donne seulement son accord sur les grandes décisions et crée le compte vendeur au moment de vendre | Remplace Unreal Engine 5 comme moteur de référence. Graphismes plus modestes qu'avec Unreal, mais aucune intervention technique du propriétaire. Pile détaillée et prototype de faisabilité dans T-027, avant le choix du concept (T-004) |
| 2026-11-23 | Niveau visuel | **Rendu stylisé atmosphérique accepté** à la place du photoréalisme (conséquence de la voie web, validation T-027) | Objectif visuel : une ambiance forte (lumière, brouillard, grain, écume), sans viser le réalisme d'Unreal Engine. Remplace « les graphismes les plus réalistes possibles » de `CLAUDE.md` |
| 2026-11-23 | Rythme | La Coordination **enchaîne les tâches sans demander**, et ne s'arrête qu'aux vraies décisions : choix du concept, dépense, étape légale, changement d'objectif | Remplace la règle « arrêt après chaque tâche validée » du mode économe. Les autres règles du mode économe restent : Sonnet, un agent à la fois, revue allégée |
| 2026-11-23 | Concept | **ESTRAN, version courte « une marée », accepté à l'essai** (« oui pour essai, on verra ensuite pour évoluer ») | T-004 peut être validée. Le projet avance par étapes, avec les portes d'arrêt de `production/validations/T-004.md` ; le périmètre pourra évoluer selon les résultats du prototype et de la démo |

## Questions encore ouvertes pour le propriétaire

- Avis sur la fluidité du prototype publié (https://claude.ai/artifact/R7U9ExVcv6TRw3B2fzzBDE) : « fluide » ou « saccadé ».

- Configuration de son PC : n'est plus bloquante (voie web) ; utile seulement pour savoir sur quoi il jouera aux versions d'essai.
- Accès réseau pour vérifier les chiffres à la source (T-020) : non décidé.
- Statut juridique pour vendre le jeu (auto-entreprise, société...) : à décider avant la mise en vente, avec un expert-comptable.
