# Questionnaire de la porte P2 (version à remplir)

## Version courte du nouvel essai (à utiliser en premier)

> Décision du propriétaire du 2026-11-27 (`production/DECISIONS.md`) : après les corrections de T-043, **un seul nouvel essai** (10 minutes au plus). Source des 3 questions : `production/validations/PORTE_P2.md`, reprises telles quelles.
> Dans le jeu (`game/dist/estran-p2.html`), le bouton « Questionnaire (3 questions) » de l'écran de départ remplace le formulaire long par ces 3 questions ; le bouton « Copier mes réponses » donne un texte à coller dans la conversation.

**Avant de jouer.** Au casque si possible, son activé, volume de l'ordinateur monté. Le jeu affiche lui-même son objectif et sa prochaine action : **aucune explication préalable** n'est donnée en dehors de l'écran d'accueil. Un court son de test se joue au démarrage ; l'indicateur « SON ACTIF » doit rester visible en haut à gauche. Jouez **jusqu'à la fin** (victoire ou défaite, environ 5 minutes par partie, 10 minutes au plus en tout).

**Vos réponses, en un mot chacune.**

1. Avez-vous entendu le son dès le début ? (oui / non / coupé)

   Réponse :

2. Avez-vous eu peur ou été inquiété ? (pas du tout / un peu / oui)

   Réponse :

3. Avez-vous joué jusqu'à la fin ? Sinon, pourquoi ? (ennuyé / trop dur / pas compris / autre)

   Réponse :

**Lecture (pour la Boss et la Coordination, pas pour le propriétaire).** Peur « un peu » ou « oui » avec le son : P2 franchie (réserve : compréhension non mesurée sans aide, à couvrir par la démo P3). Peur « pas du tout » avec le son entendu et la partie finie : P2 échouée. Partie arrêtée par ennui : même conclusion. Détail : `production/validations/PORTE_P2.md`.

---

# Questionnaire long de la première porte P2 (conservé pour mémoire)

> Ce questionnaire de 8 questions (T-036) correspond au premier essai. Il n'est plus dans le jeu depuis T-043 ; il reste ici comme référence.

> Source : `docs/design/GDD.md` §13, 8 questions validées en T-036. Mise en forme : `qa-lead`, T-032.
> **Répondant : le propriétaire, seul.** Réponses avec vos mots, sans relire le pitch ni le GDD, en 5 minutes au plus.
> **Ne lisez pas la dernière section (« Réponses attendues ») avant d'avoir répondu à tout.**
> Dans la version publiée (`game/dist/estran-p2.html`), ce questionnaire est un formulaire (bouton « Questionnaire » de l'écran de départ) **sans** la section « Réponses attendues » ; il copie vos réponses en texte à coller dans la conversation (T-033).
> Alignement T-037 : le faisceau protège le phare et ses abords (portée 40 m), plus les échelles lointaines ; les formulations ci-dessous n'affirment rien de plus large.

## Avant de jouer

- Jouez **une partie complète** (5 à 10 minutes), ou au moins 10 minutes, **au casque si possible**, son activé.
- Le jeu ne vous explique pas la règle : c'est voulu. Ne cherchez pas d'aide.
- Pour la question 7, après la partie, refaites **2 minutes en coupant le son (touche M)**.
- Pour la question 8, essayez les sous-titres des bruits (touche **K**).
- Rappel des touches : celles de l'écran de départ.

## Vos réponses

**1. Que fait l'eau, et qu'est-ce que ça change pour vous ? Où êtes-vous en sécurité quand elle est haute ?**

Réponse : 

**2. Qu'est-ce qui attire la chose dans l'eau ?**

Réponse : 

**3. Que fait le phare ? Que faut-il y faire, et pourquoi ?**

Réponse : 

**4. Que faites-vous quand vous entendez un bruit dans l'eau ? Pourquoi ?**

Réponse : 

**5. À quel moment avez-vous eu le plus peur ? Qu'est-ce qui l'a causé ? Note de 1 (pas peur) à 5 (très peur).**

Moment et cause : 

Note (1 à 5) : 

**6. Avez-vous joué au casque ? Au premier contact, le niveau sonore était-il trop faible, correct ou trop fort ?**

Casque (oui / non) : 

Niveau au premier contact (faible / correct / fort) : 

Si vous avez remarqué autre chose sur le son (facultatif) : la Laisse arrive-t-elle en silence quand elle est au bord ? l'absence de musique vous a-t-elle gêné ? saviez-vous si un bruit venait de devant ou de derrière ?

Réponse : 

**7. Refaites 2 minutes en coupant le son (touche M) : la peur est-elle la même ? Qu'est-ce qui change ?**

La peur sans le son est : (la même / un peu plus faible / nettement plus faible)

Réponse « moitié ou plus » ou « moins de la moitié » de la peur portée par le son : 

Ce qui change : 

**8. Les sous-titres (descriptions des bruits, touche K) étaient-ils lisibles, utiles, et ont-ils gâché la peur ?**

Lisibles (oui / non) : 

Utiles (oui / non) : 

Ont gâché la peur (oui / non) : 

Remarques : 

## Pour le rapport de performance (question P1, indépendante)

Fluide ou saccadé ? (une réponse suffit) : 

Si vous le souhaitez : F2 pendant 60 s de jeu, bouton « Copier le rapport de performance », coller le texte à la suite.

---

## Réponses attendues (à lire seulement après avoir répondu)

Une réponse est « comprise » si l'**idée-clé** figure dans la réponse. Auto-évaluation contre ce tableau.

| # | Idée-clé attendue | Comptabilisé pour la porte |
|---|---|---|
| 1 | L'eau monte et redescend selon un cycle (jauge). Il faut être **hors de l'eau** : zone sèche, plateforme du phare, qui rétrécit. L'eau ralentit et peut noyer. Les échelles ne se lisent qu'à certains moments | oui (compris / non compris) |
| 2 | **Le bruit** (marcher vite, courir, éclabousser, heurter des objets), plus que la vue. Immobile ou lent, on est moins entendu | oui |
| 3 | Le faisceau **repousse** la chose **près du phare et de ses abords** (il ne couvre plus les échelles lointaines, où seul le silence protège), mais le phare **s'éteint** à l'usure ; il faut le **remonter** à la manivelle avant de ressortir | oui |
| 4 | Se figer ou ralentir, écouter la direction, rejoindre une zone sèche ou le voisinage du phare, allumer la lampe de près ; **ne pas courir** | oui |
| 5 | Un moment d'écoute ou d'attente (remous, grondement, silence) plutôt qu'une apparition visible. Note **3 ou plus**. Notez la cause citée | oui (note >= 3) |
| 6 | « Casque oui/non » et « faible / correct / fort » | information de réglage (volume maître), sans seuil |
| 7 | Le son porte **au moins la moitié** de la peur : sans son, la peur baisse nettement et l'écoute des remous manque | suivi, non éliminatoire : « moins de la moitié » rouvre le son (retour à T-031) sans bloquer P3 |
| 8 | Lisibles et utiles sans gâcher l'ambiance | information d'accessibilité, sans seuil |

**Seuil de passage** (GDD §13) : la porte P2 est franchie si (1) les automates passent le critère de discrimination (voir `docs/qa/RAPPORT_P2.md`), (2) vous obtenez **4/4 « compris »** aux questions 1 à 4 et une note **>= 3** à la question 5, (3) les questions 6 à 8 sont renseignées.

Rien n'est considéré comme répondu tant que vous n'avez pas répondu : toute question restée vide est **en attente**.
