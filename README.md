# 🎮 Studio IA : développement d'un jeu vidéo photoréaliste multiplateforme

Ce dépôt contient un **studio de développement de jeu vidéo** composé de **24 agents IA**
(Claude Code), organisés comme une vraie équipe. Chaque tâche terminée est **validée ou refusée par la Boss**.

**Objectif** : un jeu **vendable**, sur **PC (Steam, Epic, Steam Deck), PS5 et Xbox Series X|S**,
avec un rendu **photoréaliste** (Unreal Engine 5 : Lumen, Nanite, MetaHuman).

## L'équipe

| Pôle | Agents |
|---|---|
| 👑 Direction | `boss`, `producer`, `game-director` |
| 🎲 Design | `game-designer`, `level-designer`, `narrative-designer`, `ui-ux-designer` |
| 💻 Programmation | `technical-director`, `gameplay-programmer`, `graphics-programmer`, `platform-engineer`, `online-engineer`, `build-engineer` |
| 🎨 Art | `art-director`, `concept-artist`, `environment-artist`, `character-artist`, `technical-artist`, `animator` |
| 🔊 Audio | `audio-director` |
| 🧪 Qualité | `qa-lead`, `localization-manager` |
| 💰 Business | `marketing-publishing`, `business-affairs` |

Détails : [`studio/ORGANIGRAMME.md`](studio/ORGANIGRAMME.md) · Agents : [`.claude/agents/`](.claude/agents/)

## Le circuit de validation

```
producer crée la tâche ─► agent responsable ─► revue du lead de pôle ─► 👑 BOSS ─► VALIDÉ ✅
                                ▲                                           │
                                └────────────── À CORRIGER ❌ ◄─────────────┘
```

- Chaque tâche a un ID, un responsable et des **critères d'acceptation mesurables** : [`production/BACKLOG.md`](production/BACKLOG.md)
- La Boss écrit un rapport noté pour chaque tâche : `production/validations/T-XXX.md`
- Un hook (`.claude/settings.json`) rappelle automatiquement de passer par la Boss après chaque agent.
- Processus complet et jalons (Concept, Vertical Slice, Alpha, Beta, Gold, Lancement) : [`studio/WORKFLOW.md`](studio/WORKFLOW.md)

## 🖥️ Interface graphique

```bash
node studio-ui/server.js     # puis ouvrir http://127.0.0.1:4747
```

Tableau de bord, équipe par pôle (recruter, modifier, licencier un agent), backlog en kanban,
rapports de la Boss et **suivi en direct** des agents au travail. Détails : [`studio-ui/README.md`](studio-ui/README.md).

## Utilisation en ligne de commande

Ouvrez une **nouvelle session** Claude Code dans ce dépôt (les agents se chargent au démarrage), puis :

| Commande | Effet |
|---|---|
| `/sprint` | Lance toutes les tâches prêtes, avec validation par la Boss après chacune |
| `/sprint T-001 T-002` | Lance des tâches précises |
| `/revue-boss T-003` | Soumet une tâche à la Boss |
| « Demande au game-designer de... » | Confie une tâche ponctuelle à un agent |

Le **Sprint 0** est prêt : trois concepts de jeu, étude de marché et choix techniques, puis le choix du
concept par la Boss, **soumis à votre accord**.

## Ce que les agents peuvent faire, et ce qu'il vous reste à faire

Les agents produisent : la conception (GDD, niveaux, narration, UX), l'architecture et le **code C++
Unreal**, les configurations de rendu, les scripts d'outils, les spécifications d'assets, les plans de
test, la stratégie marketing et les dossiers de certification.

Il vous reste, en tant qu'humain ou société :
- **Un PC de développement** avec Unreal Engine 5 et un GPU récent pour compiler, voir et tester le jeu
  (cet environnement cloud n'a ni GPU ni Unreal).
- **L'accès aux consoles** : inscription aux programmes PlayStation Partners et ID@Xbox, NDA et kits
  de développement. Les SDK consoles ne sont pas publics.
- **La production d'assets 3D** : bibliothèques sous licence (Fab / Megascans, MetaHuman), artistes ou
  outils de génération, mocap et enregistrement des voix.
- **Les contrats, l'argent et le juridique** : comptes développeur (Steamworks...), classification
  PEGI / ESRB, validation des textes légaux par un juriste.
