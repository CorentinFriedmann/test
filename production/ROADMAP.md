# Feuille de route de l'essai ESTRAN « une marée »

> Tenue par `producer` (T-028). **Aucune date ferme** : la durée réelle de P2 n'est pas connue et le budget est celui de l'abonnement Claude. Les portes viennent de `production/validations/T-004.md` §7 ; les décisions du propriétaire (`production/DECISIONS.md`) priment.
> Principe : le propriétaire ne fait rien lui-même. À chaque porte il **regarde, joue ou lit, puis répond**. Une réponse manquante ne bloque pas le travail des agents, sauf à P2 (suite de l'essai) et à P3.

## Vue d'ensemble

| Porte | Ce que les agents produisent | Ce que le propriétaire verra | Ce qu'il décidera |
|---|---|---|---|
| **P1 : fluidité** | Prototype T-027 publié ; version mesurable avec le bouton « copier le rapport de performance » (T-030, T-033) | La page du prototype (https://claude.ai/artifact/R7U9ExVcv6TRw3B2fzzBDE), puis la version P2 | Un mot : « fluide » ou « saccadé » (peut aussi coller le rapport de performance) |
| **P2 : marée et menace** | T-005, T-006, T-029, T-030, T-031, T-024, T-032, T-033 | Un fichier HTML jouable de 5 à 10 minutes, une page de rapport d'une page (`production/RAPPORT_P2.md`), cinq questions | Les cinq réponses : la règle « bruit dans l'eau, lumière du phare » se comprend-elle, la scène inquiète-t-elle ? Puis : poursuivre ESTRAN, passer au repli B, un autre concept, ou arrêter |
| **P3 : démo publique** | Tranche verticale, bible artistique, key art, localisation FR et EN, page de démo, plan Steam (T-007, T-008, T-009, T-014, T-016, T-017, tâches de T-010) | La démo et sa page, avec un chiffre de listes de souhaits et de retours quand il existe | Accord pour **publier** la démo (itch.io), décision de prix, dépenses éventuelles une par une, **création du compte vendeur** ; continuer, sortir à bas coût ou arrêter |
| **P4 : dérive** (permanente) | Suivi de la durée et du périmètre par le `producer` | Un signalement dès qu'un jalon dépasse de plus de 50 % son estimation ou que le périmètre s'étend | Geler, couper ou arrêter |

## Étape P1 : fluidité

- **État** : la question est ouverte et ne bloque pas le travail.
- **Agents** : aucun travail propre ; T-030 ajoute l'outil de mesure, T-033 le met dans la version publiée.
- **Si « saccadé »** : réduire les effets (brouillard, résolution) ; si cela suffit pas, **réévaluer la pile avant tout** (T-004 §7). Le `producer` crée alors une tâche de correction.

## Étape P2 : prototype de marée et de menace

Ordre d'exécution, un agent à la fois, chaque tâche validée par la Boss avant la suivante (T-024 peut s'intercaler à tout moment avant T-033) :

| # | Tâche | Agent | Résultat |
|---|---|---|---|
| 1 | T-005 | game-director | Pitch, piliers, règles de marée et de menace en 3 phrases |
| 2 | T-006 | game-designer | GDD de la tranche, courbes chiffrées, questionnaire P2 |
| 3 | T-029 | gameplay-programmer | Noyau jouable testé (marée, menace, île, victoire, défaite) |
| 4 | T-030 | graphics-programmer | Ambiance, 3 niveaux de qualité, mesures de performance |
| 5 | T-031 | audio-director | Bruit dans l'eau et ambiance en synthèse |
| 6 | T-024 | business-affairs | Registre des licences (prérequis de tout asset tiers) |
| 7 | T-032 | qa-lead | Rapport automatisé de P2 (40 parties d'automates, console propre) |
| 8 | T-033 | build-engineer | `estran-p2.html` en un seul fichier, prête à publier |

- **Critère de passage** (T-004 §7) : le rapport automatisé (T-032) **et** au moins un avis humain extérieur, c'est-à-dire le propriétaire, indiquent que la règle se comprend en moins de 10 minutes et que la scène inquiète.
- **Si échec** : on ne poursuit pas ESTRAN tel quel. Le propriétaire choisit entre B (repli « un col, une nuit », environ 30 à 50 % de travail en plus, sans prototype), un autre concept ou l'arrêt.
- **En parallèle, sans bloquer P2** : T-034 puis T-035 (documents techniques et fiches d'agents, ADR §7) ; T-020 (reste BLOQUÉE tant que l'accès réseau n'est pas décidé) ; T-025 (finitions de l'étude, avant l'étude de prix).

## Étape P3 : démo publique

- **Prérequis** : P2 passée. Le `producer` découpe la tranche verticale en T-010, en mode économe, avec marge et sans date.
- **Tâches prévues** (adaptées, non recréées) : T-007 bible artistique, T-008 bible narrative, T-009 direction audio, T-014 UX et accessibilité, T-013 stratégie de test web, T-016 key art, T-017 localisation FR et EN ; plan Steam (Electron, Steam Deck « Jouable ») créé à ce moment seulement.
- **Avant toute publication** : T-024 faite ; T-020 faite avant d'utiliser les chiffres de marché pour le prix ; statut juridique de vente à décider avec un expert-comptable (DECISIONS) ; aucune dépense sans accord.
- **Ne se fait pas** (T-004 §6) : autres îles, bateau, combat, artisanat, mode photo, mode rejouable, corps complet, doublage, multijoueur, portage console.

## Étape P4 : dérive (tout moment)

Seuil : durée réelle supérieure de plus de 50 % à l'estimation d'un jalon, ou extension du périmètre. Le `producer` le signale à la Boss avec des propositions de coupe ; la décision d'arrêter est celle du propriétaire.

## Tâches abandonnées et hors périmètre

T-011 (Unreal, CI), T-012 (consoles, certification) et T-018 (services en ligne) sont ABANDONNÉES (voir le backlog). T-001 à T-004, T-015, T-019, T-021, T-023, T-026 et T-027 sont terminées et ne sont pas touchées.

## Réserves reprises

- T-024 est un prérequis de tout asset tiers : dans le chemin P2 avant T-033, et avant tout import.
- La fluidité (P1) attend la réponse du propriétaire et ne bloque pas les agents.
- T-020 reste bloquée jusqu'à la décision sur l'accès réseau ; T-022 (À CORRIGER) est gelée avec elle.
