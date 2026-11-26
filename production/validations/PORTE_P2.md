# Porte P2 : évaluation de la Boss (2026-11-26)

## Verdict : P2 NON CONCLUANTE

ESTRAN n'est ni franchi ni échoué. Le test n'a pas mesuré ce qu'il devait mesurer. Une porte d'arrêt ne se déclenche pas sur une mesure invalide.

## Raisons

1. **Seuil GDD §13, condition 1 (automates)** : passée (T-032, T-037).
2. **Condition 2 (questions 1 à 4)** : non mesurable. La règle a été expliquée en entier avant la partie.
3. **Condition 2 (question 5, note >= 3)** : réponse « pas du tout », soit environ 1. Mais la partie a été jouée **sans le son**. Le pilier de conception (R3 de T-004) est que « l'audio porte au moins la moitié de la peur ». On a donc mesuré au mieux la moitié visuelle de la peur, et le résultat est faible. Cela ne prouve pas l'échec du concept ; cela prouve que, sans son, rien n'inquiète. C'est un signal à ne pas ignorer.
4. **Condition 3 (questions 6 à 8)** : en attente, sans objet sans le son.
5. **Arrêt avant la fin** : cause inconnue (lassitude, difficulté, absence de tension). C'est le signal le plus gênant : si c'est l'ennui, le problème n'est pas le son.
6. **Envie d'en voir plus : oui.** Signal positif, mais faible : le propriétaire est favorable au projet par construction et n'a pas vécu la tension prévue.

**Pourquoi pas « ÉCHOUÉE »** : la condition d'échec visée par T-004 est que la règle ne se comprenne pas ou que la scène n'inquiète pas **telle que conçue**. La scène conçue inclut le son. Un échec déclaré ici engagerait le propriétaire dans un arrêt ou un repli sur une mesure invalide.

**Pourquoi pas « FRANCHIE »** : la note de peur est basse et la compréhension sans aide n'est pas mesurée.

**Point à corriger dans le prototype, quelle que soit la suite** : la peur ne doit pas être nulle sans le son. Un joueur sur machine muette, ou dont la page n'émet pas de son, doit quand même ressentir la menace. Et le son ne doit jamais être manqué silencieusement (cause « son qui ne marche pas dans la page publiée » non écartée).

## Options classées

| Rang | Option | Coût pour le propriétaire | Avis |
|---|---|---|---|
| 1 | **(a)+(b) minimales : correctifs ciblés, puis un seul essai guidé de 10 minutes avec le son, au casque** | environ 15 minutes de jeu, une fois | **Recommandée** |
| 2 | (a) seul : même essai sur le prototype actuel, sans changement | idem | Acceptable si on veut économiser l'abonnement, mais risque de refaire un test pollué par un son qui ne part pas |
| 3 | (c) Repli B « DERNIÈRE POSITION CONNUE » | +30 à 50 % de travail, aucun prototype | Prématuré : décision du propriétaire, à ne poser qu'après un essai valide |
| 4 | (d) Arrêt | nul | Prématuré : décision du propriétaire, à ne poser qu'après un essai valide |

### Détail de l'option 1

**Changements au prototype (petits, justifiés par les réponses)** :
- Son : écran de démarrage avec un clic « Commencer » qui active l'audio, un indicateur visible « SON ACTIF » (ou « SON COUPÉ »), et un bip de test audible dès le départ. Vérifier que le son joue réellement dans la page publiée.
- Tension visible sans le son : les sous-titres des bruits (GDD §13 Q8) affichés par défaut, plus un indice visuel des remous (cercles à la surface, brume, vignette qui se resserre) quand la Laisse s'approche.
- Partie plus courte : cible de 5 minutes, avec une fin claire (écran de fin gagné ou perdu), pour réduire l'arrêt prématuré.

Ne rien changer à la logique ni aux constantes (règle de parité, GDD §12).

**Essai unique, guidé** : 10 minutes au maximum, avec le son, au casque si possible, **sans explication préalable** de la règle autre que l'écran d'accueil du jeu. Jouer jusqu'à la fin. Puis trois réponses en un mot :
1. Avez-vous entendu le son dès le début ? (oui / non / coupé)
2. Avez-vous eu peur ou été inquiété ? (pas du tout / un peu / oui)
3. Avez-vous joué jusqu'à la fin ? Sinon, pourquoi ? (ennuyé / trop dur / pas compris / autre)

**Critère de lecture** :
- Peur « un peu » ou « oui » avec le son : P2 franchie (réserve : compréhension non mesurée sans aide, à couvrir par la démo P3).
- Peur « pas du tout » **avec le son, entendu, partie finie** : **P2 ÉCHOUÉE**. Alors, et seulement alors, le propriétaire choisit entre (c) repli B, un autre concept, ou (d) arrêt.
- Partie arrêtée par ennui : même conclusion qu'un échec, la menace ne tient pas.

## Ce que la Coordination demande au propriétaire (langage simple)

> Votre essai n'a pas pu juger le jeu, car il a été joué sans le son, alors que la peur repose surtout dessus. Je propose que les agents corrigent deux ou trois petites choses (son bien actif, indices visibles, partie plus courte), puis que vous rejouiez une seule fois, 10 minutes, avec le son et si possible au casque.
> D'accord ? Et sinon, préférez-vous passer à l'autre idée (repli B) ou arrêter ici ? Cette décision vous appartient.

## Limites de cette évaluation

Je n'ai pas relu `RAPPORT_P2.md` ni `T-037.md` : la condition 1 est reprise de `docs/qa/REPONSES_P2.md`. Je n'ai pas vérifié si le son joue dans la page publiée.

Aucune tâche n'est créée au backlog ; le producer s'en chargera selon la décision du propriétaire.
