# 🖥️ Interface graphique du studio

Une application web **locale** pour piloter les agents du studio, sans ligne de commande.
Aucune dépendance à installer : seulement **Node.js 18 ou plus** et **Claude Code** (commande `claude`).

## Démarrer

```bash
# depuis la racine du dépôt
node studio-ui/server.js
```

Puis ouvrez **http://127.0.0.1:4747** dans votre navigateur.

| Variable | Défaut | Rôle |
|---|---|---|
| `PORT` | `4747` | Port d'écoute |
| `HOST` | `127.0.0.1` | Interface réseau (laissez la valeur locale, sauf besoin précis) |
| `CLAUDE_BIN` | `claude` | Chemin de la CLI Claude Code |
| `STUDIO_ROOT` | dossier parent | Dépôt du studio à piloter |

## Ce que vous pouvez faire

| Écran | Fonctions |
|---|---|
| 🏠 **Tableau de bord** | Avancement global et par jalon, tâches prêtes à démarrer (▶ en un clic), points d'attention, derniers verdicts de la Boss |
| 👥 **Équipe** | Les agents classés par pôle, ceux qui travaillent en ce moment (avatar pulsant), modification des instructions, du modèle et des outils, **recrutement** ou licenciement d'un agent, mission libre |
| 📋 **Backlog** | Kanban des tâches (À faire, En cours, En revue Boss, À corriger, Bloqué, Validé), détail de chaque tâche (critères, livrables consultables, dépendances), création de tâches, changement de statut |
| 👑 **Validations** | Tous les rapports de la Boss avec leur verdict et leur notation |
| ▶️ **Exécutions** | Lancement d'un sprint, d'une tâche, d'une revue de la Boss ou d'une mission, et **suivi en direct** : quel agent reçoit quel travail, quels fichiers il écrit, ce qu'il rend, ce que la Boss décide, et le coût |

## Comment ça marche

- L'interface lit et écrit **directement les fichiers du studio** : `.claude/agents/*.md`, `studio/equipe.json`
  (pôles, emojis, titres), `production/BACKLOG.md` et `production/validations/`. Ce que font les agents
  apparaît dans l'interface, et réciproquement.
- Chaque exécution lance `claude -p … --output-format stream-json` dans le dépôt. La session suit
  `CLAUDE.md` et les skills `/sprint` et `/revue-boss` : **le passage par la Boss reste obligatoire**.
- Les statuts `VALIDÉ` et `À CORRIGER` ne peuvent pas être posés à la main : ils sont réservés à la Boss.
- L'historique des exécutions est conservé dans `studio-ui/.runs/` (non versionné).

## Permissions des agents

Dans **Réglages d'exécution**, choisissez ce que les agents ont le droit de faire :

- **Modifications acceptées** (par défaut) : création et modification de fichiers. Les commandes shell
  (par exemple `git commit`) sont refusées, sauf si vous les avez autorisées dans `.claude/settings.json`
  (section `permissions.allow`).
- **Auto** : Claude Code décide seul, avec ses garde-fous.
- **Tout autoriser** : aucune confirmation. À réserver à une machine ou un dépôt dédiés.
- **Plan** : lecture seule, les agents proposent sans rien modifier.

Un **budget maximum** en dollars peut être fixé pour chaque exécution.

## Sécurité

Le serveur n'écoute que sur `127.0.0.1`, vérifie l'en-tête `Host` (protection contre le DNS rebinding)
et exige un jeton aléatoire, généré à chaque démarrage, pour toute modification. Les fichiers
consultables sont limités au dépôt, sans `.git` ni `.env`.

## Tests

```bash
cd studio-ui && npm test
```
