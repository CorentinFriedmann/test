# ESTRAN, « une marée » : Game Design Document

> **Tâche** : T-006 · **Auteur** : `game-designer` · **Date** : 2026-11-23 · **Statut** : à revoir par `game-director`, puis à valider par la Boss
> **Cadre** (`production/DECISIONS.md`) : jeu solo, 3D web (three.js), PC dans le navigateur, rendu stylisé atmosphérique, aucune voix enregistrée, tout fabriqué par les agents.
> **Niveau de détail** : la **tranche P2** (§4 à §12) est spécifiée en détail. Le reste du jeu est un plan (§15, §16).
> **Données** : `data/maree.csv`, `data/maree_effets.csv`, `data/stations.csv`, `data/menace.csv`. Elles font foi pour les chiffres ; ce document explique.
> **Convention** : `[à régler]` = estimation à ajuster au playtest (les valeurs concernées ont `status = A_REGLER` dans `menace.csv`). Tout le reste est fixé.

## 1. Piliers cités

Par ordre de priorité (conflit : le premier gagne). Le GDD les nomme au lieu de les numéroter, car la numérotation de `PILIERS.md` n'est pas dans l'ordre de priorité (voir le rapport de remise).

| Nom | Pilier (`PILIERS.md`) | Résumé |
|---|---|---|
| **ÉCOUTE** | 2 | La peur vient de ce qu'on entend ; la menace répond au bruit |
| **MARÉE** | 1 | La marée est l'horloge et la carte |
| **LUMIÈRE** | 3 | La lumière est la seule arme ; l'entretenir coûte du temps |
| **AMBIANCE** | 4 | Rendu stylisé, histoire par traces, jeu court |

## 2. Vocabulaire (un terme, une définition)

| Terme | Définition | À ne pas confondre |
|---|---|---|
| **profondeur d** | `d = niveau d'eau − altitude du sol` à la position du joueur (en m). Négatif : le sol est au-dessus de l'eau. | |
| **zone sèche** | Tout point où `d ≤ −0,25 m` (le sol dépasse l'eau d'au moins 25 cm). **C'est l'unique terme pour « l'abri », « à l'abri » et « au sec »** dans le jeu et dans les documents. Le mot « abri » n'est plus utilisé seul. En zone sèche, la Laisse ne peut pas toucher le joueur. | berge |
| **plateforme du phare** | Disque de 6 m de rayon à 3,00 m d'altitude autour du phare. Toujours zone sèche (3,00 > 2,40 + 0,25). | |
| **berge** | `−0,25 < d < 0,15` : sol mouillé, ce n'est **pas** une zone sèche. | zone sèche |
| **gué, eau profonde, eau haute, submersion** | Bandes de `d` croissantes (`maree_effets.csv`). | |
| **bruit** | Rayon (m) dans lequel la Laisse entend le joueur : `R = rayon de base de l'action × multiplicateur de la bande`. | |
| **bruit dans l'eau** | Bruit émis alors que `d ≥ 0,15` (gué et au-delà). C'est le seul qui porte loin (8 à 36 m), d'où le nom. | |
| **échelle** | Échelle de marée graduée à lire (3 dans la tranche P2) ; **relevé** = l'avoir lue. | |
| **charge** | Niveau d'énergie du phare, de 100 à 0 %. | batterie (lampe) |
| **la Laisse** | La menace. Une seule dans la tranche P2. | |

## 3. Règles complètes (référence de la porte P2)

Elles complètent `PITCH.md` (trous signalés par `production/validations/T-005.md`). Ces textes servent de réponses attendues au questionnaire (§12).

**Règle de la marée.** L'eau monte et descend selon un cycle que tu lis sur la jauge de marée. Seule une **zone sèche** te protège : plus l'eau monte, plus les zones sèches rétrécissent, et la plateforme du phare est la dernière. Dans l'eau, tu vas plus lentement, tu fais plus de bruit, et si l'eau te dépasse la poitrine pendant 8 secondes, tu te noies. Les échelles ne se lisent que quand l'eau les touche.

**Règle de la menace.** Ce qui remonte avec l'eau ne te voit pas, il t'entend. Chaque pas dans l'eau fait du bruit : plus fort si tu cours, plus fort si l'eau est profonde ; immobile, tu ne fais aucun bruit. Si elle t'entend, elle vient. Si elle te touche deux fois en 45 secondes, tu es perdue. Elle ne peut pas te toucher en zone sèche. Le faisceau du phare la repousse tant que le phare est allumé, et la lampe la fait reculer de près. Le phare s'use (200 s) : on le rallume à la manivelle.

**Conséquences (chiffrées).**

| Situation | Conséquence | Délai |
|---|---|---|
| Hors zone sèche à marée haute, `d ≥ 1,40 m` | Compteur de souffle : défaite par noyade | 8 s sous l'eau ; le compteur se vide en 4 s dès que `d < 1,40` |
| Bruit entendu (rayon atteint la Laisse) | RÔDE → ENQUÊTE (elle va vers la source) | 0,4 s d'écoute cumulée |
| Bruit renouvelé pendant ENQUÊTE | ENQUÊTE → TRAQUE (elle fonce) | 1,2 s d'écoute cumulée, ou `distance < 6 m` |
| Contact (1,8 m) hors zone sèche | 1re saisie : froid (vitesse ×0,60 pendant 10 s), la Laisse recule 10 s | 0,5 s de contact |
| 2e saisie dans les 45 s | **Défaite** | |
| Échelle non lue à la fin de sa fenêtre | **Défaite** (relevé manqué) | à `window_end_s` |
| Phare à 0 % de charge | Plus de faisceau ni de halo ; les zones sèches protègent encore | |

## 4. Boucles de jeu

| Échelle | Boucle | Pilier |
|---|---|---|
| **30 s** | Écouter, lire la jauge et le terrain, choisir la vitesse (lente, normale, course) et la route entre deux zones sèches ; bouger ou se figer quand un remous ou un grondement est entendu ; allumer la lampe si la Laisse est proche. | ÉCOUTE, LUMIÈRE |
| **5 min** | Une marée complète (tranche P2, 8 min) : attendre depuis la plateforme jusqu'à la fenêtre d'une échelle, sortir, lire (5 s), revenir ; remonter le phare juste avant la sortie suivante ; recommencer pour l'échelle suivante. | MARÉE, LUMIÈRE |
| **1 h** | Jeu complet : 2 marées, avec exploration des intérieurs à marée basse et retour avant la marée haute (plan, §15). | MARÉE, AMBIANCE |
| **Méta** | 4 marées sur 2 jours, une fin ; l'histoire se lit par traces. Aucune rejouabilité voulue (liste « on ne fait pas »). | AMBIANCE |

## 5. Marée (tranche P2) · effort **S**

- **Cycle** : 480 s (8 min) = un cycle complet, de l'étale basse (−0,60 m) à l'étale basse, avec la haute à t = 240 s (+2,40 m). Les niveaux sont ceux du prototype (`TIDE_MIN`, `TIDE_MAX`).
- **Formule de contrôle** : `niveau(t) = 0,90 − 1,50 × cos(2π·t/480)`. La **table `maree.csv` fait foi** (pas de 10 s, interpolation linéaire, écart à la formule ≤ 0,01 m). Le niveau pilote la position Y du plan d'eau, comme dans le prototype.
- **Horloge** : le temps de marée est le temps de simulation (pas l'heure murale). Il s'arrête en pause (§9.2).
- **Zones qui se recouvrent** : calculées à chaque pas par `d = niveau − heightAt(x, z)` et classées par bande (`maree_effets.csv`). Aucune carte pré-calculée de zones.

| Bande | `d` (m) | Vitesse | Course | Bruit ×|
|---|---|---|---|---|
| zone sèche | ≤ −0,25 | ×1,00 | oui | 0,25 |
| berge | −0,25 à 0,15 | ×1,00 | oui | 0,50 |
| gué | 0,15 à 0,60 | ×0,80 | oui | 1,00 |
| eau profonde | 0,60 à 1,10 | ×0,55 | non | 1,50 |
| eau haute | 1,10 à 1,40 | ×0,35 | non | 2,00 |
| submersion | ≥ 1,40 | ×0,25 | non | 2,00 (+ noyade 8 s) |

- **Effet sur le déplacement** : le multiplicateur de vitesse s'applique à la vitesse de base (1,5 / 3,0 / 5,5 m/s), lissé sur 0,2 s. La course est coupée (retombe à la marche) à partir de 0,60 m.
- **Calendrier de la marée** (valeurs déduites de la table) :

| t (s) | Niveau (m) | Événement |
|---|---|---|
| 0 | −0,60 | Début, étale basse |
| 57 | −0,20 | La Laisse apparaît |
| 61 à 110 | −0,15 à 0,70 | Fenêtre de S1 (flot) |
| 160 à 320 | 1,65 à 2,40 | Fenêtre de S2 (haute) |
| 240 | 2,40 | Étale haute : seule la plateforme du phare est une zone sèche |
| 375 à 427 | 0,60 à −0,25 | Fenêtre de S3 (jusant) |
| 431 | −0,30 | La Laisse disparaît |
| 480 | −0,60 | Fin de la tranche |

## 6. Menace : la Laisse · effort **M** (IA) + **M** (bruit)

### 6.1 Bruit du joueur (déclencheurs)

Chaque pas de simulation, le joueur émet un rayon `R = base × multiplicateur de bande` (max des sources, jamais la somme).

| Source | Base (m) | En zone sèche | Gué | Eau profonde | Eau haute |
|---|---|---|---|---|---|
| Immobile (ou lampe seule) | 0 | 0 | 0 | 0 | 0 |
| Marche lente (touche C, stick < 55 %) | 4 | 1 | 4 | 6 | 8 |
| Marche | 8 | 2 | 8 | 12 | 16 |
| Course | 18 | 4,5 | 18 | n/a | n/a |
| Relevé ou remontage (en cours) | 4 | 1 | 4 | 6 | 8 |
| Débris heurté (impulsion 1 s, non multipliée) | 30 | 30 | 30 | 30 | 30 |

- **4 débris** (seaux, caisses) sont posés sur l'estran (rayon de collision 0,6 m). Les heurter = bruit fixe de 30 m. Ils rendent la règle « heurter des objets » lisible.
- **Distance audible** (par la Laisse) : disque de rayon `R` autour du joueur. Pas d'occlusion dans la tranche P2.
- **Direction** : le bruit est omnidirectionnel. La Laisse retient la **position de la source** au moment où elle l'entend, avec une erreur tirée dans un disque de 3 m. Elle s'y rend (ENQUÊTE), puis suit la source tant qu'elle l'entend (TRAQUE).
- **Présence** : le joueur hors zone sèche à moins de 4 m de la Laisse est entendu même immobile.

### 6.2 Automate de la Laisse

La Laisse ne se déplace que sur des points où elle est dans l'eau (`d ≥ 0,30`). Elle ne voit pas le joueur : rien dans l'automate ne dépend de la vue, de l'éclairage visuel ni du brouillard.

| État | Entrée | Comportement | Sortie |
|---|---|---|---|
| **DORMANTE** | Avant t = 40 s ou après t = 431 s | Absente | Niveau montant ≥ −0,40 m : apparition à 15–35 m du joueur (T-037 ; 45–70 m avant), hors halo, sur un point où `d` est entre 0,30 et 1,00 m |
| **RÔDE** | Apparition ; fin d'ENQUÊTE ; fin de REPLI | Va de point en point à 2,0 m/s ; nouveau point toutes les 8 à 14 s, tiré à 15–45 m du joueur. **Curiosité** : si le joueur est dans l'eau depuis 45 s sans contact, les points sont tirés à 20–35 m | Écoute ≥ 0,4 s → ENQUÊTE |
| **ENQUÊTE** | Bruit entendu | Va à la position perçue à 3,5 m/s | Écoute renouvelée ≥ 1,2 s, ou joueur à moins de 6 m → TRAQUE ; silence 6 s → RÔDE |
| **TRAQUE** | Voir ci-dessus | Va vers le joueur à 4,0 m/s (plus lent que la course en gué : 4,4 m/s) | Contact 0,5 s → saisie ; silence 6 s → ENQUÊTE |
| **REPLI** | Faisceau (3 s), lampe (5 s), saisie (6 s) | S'éloigne de la source de lumière à 4,5 m/s | Fin du délai → RÔDE |
| **ATTENTE_BORD** | Joueur en zone sèche, Laisse au plus près dans l'eau | Reste à ≥ 2 m, immobile 10 s | RÔDE |

- **Saisie** : contact de 1,8 m pendant 0,5 s, joueur **hors zone sèche**. 1re saisie : froid (vitesse ×0,60, 10 s) et recul de la Laisse (14 m, 10 s). 2e saisie dans les 45 s : défaite.
- **Zone sèche** : le joueur ne peut pas être saisi. La Laisse reste au bord (ATTENTE_BORD).
- **Halo** : la Laisse n'entre pas dans le disque de 14 m autour du phare tant que la charge est > 0 %.
- **Hasard** : seul le générateur à graine fixe (`sim_seed = 2026`) est utilisé, avancé par le temps de simulation. Même graine et mêmes entrées = même partie (indispensable aux tests T-032).

### 6.3 Ce que le joueur perçoit (direction et distance audibles)

| Signal | Quand | Distance audible | Direction |
|---|---|---|---|
| Remous (clapotis, filet d'eau) | Laisse en RÔDE ou ENQUÊTE | 45 m, volume `(1 − d/45)²`, filtre passe-bas plus fermé avec la distance | Panoramique stéréo selon l'angle avec la caméra, panoramique 3D HRTF si possible |
| Grondement bref (« elle t'a entendu ») | Passage RÔDE → ENQUÊTE | 60 m | Idem ; c'est la réponse lisible au bruit (pilier ÉCOUTE) |
| Halètement et clapotis rapides | TRAQUE | 45 m | Idem |
| Silhouette | Seulement quand le faisceau ou la lampe la touche (0,5 s) | Selon la lumière | Visuelle |
| Anneaux d'eau visibles | À moins de 30 m, dans la lumière du faisceau ou de la lampe | 30 m | Visuelle |

## 7. Phare et lampe · effort **S**

### 7.1 Phare

| Élément | Règle |
|---|---|
| **Faisceau** | Tourne en 8 s (prototype). Demi-angle logique 6° (le cône visible du prototype fait environ 4°). Portée 40 m à charge ≥ 20 % (T-037 ; 70 m avant : le faisceau couvrait presque toute l'île et supprimait la peur avant 160 s ; à 40 m il protège le phare et ses abords, pas les échelles lointaines). |
| **Effet** | Si la Laisse est dans le faisceau (angle et portée), elle passe en REPLI pendant 3 s et sa silhouette s'éclaire 0,5 s. Le faisceau **ne la tue pas** et ne lui interdit pas de revenir : il la ralentit (gain net d'environ 1,4 m/s au lieu de 4 m/s en TRAQUE). |
| **Halo** | Disque de 14 m autour du phare : la Laisse n'y entre pas. La plateforme (6 m) est à l'intérieur. |
| **Ce qui l'éteint** | **L'usure** : la charge baisse de 0,5 %/s, donc 200 s de 100 % à 0 %. Dans la tranche P2, c'est la seule cause. (Le plan du jeu complet ajoute les grains de vent, §15.) |
| **Dégradation** | Sous 20 % le faisceau clignote et sa portée diminue en proportion (`portée = 40 × charge/20`). À 0 %, plus de faisceau ni de halo. |
| **Rallumer** | À la manivelle (au pied du phare, sur la plateforme) : maintenir E (ou A sur manette) 5 s à moins de 2,5 m. La charge repasse à 100 %. Le geste produit un bruit de 4 m et s'interrompt si le joueur s'éloigne ou est saisi. |
| **Durée de l'effet** | 200 s de charge pleine. Remonter à 50 % fait gagner 50 % : le coût est donc un aller-retour à la plateforme avant chaque sortie longue. |

### 7.2 Lampe

| Élément | Règle |
|---|---|
| **Commande** | F (clavier), X (manette). Bascule. |
| **Cône logique** | Demi-angle 20° (le cône visuel du prototype fait 26°), portée 12 m. |
| **Effet** | Si la Laisse reste ≥ 0,8 s dans le cône, elle passe en REPLI pendant 5 s. |
| **Limite** | Autonomie 120 s cumulées, pas de recharge dans la tranche P2. À 0 % : la lampe s'éteint (clic sec). |
| **Bruit** | Aucun. La lampe n'attire pas la Laisse (elle n'a pas de vue). Elle sert à la voir et à la repousser de près. |
| **Cumul** | Faisceau et lampe ne s'additionnent pas : le REPLI le plus long s'applique. |

## 8. Objectif, victoire, défaite (tranche P2)

**Objectif.** Lire les 3 échelles de marée de l'estran et revenir sur la plateforme du phare. Chaque échelle n'est lisible que dans sa fenêtre (`stations.csv`).

| Échelle | Altitude | Condition de lecture | Fenêtre | Ce qu'elle apprend au joueur |
|---|---|---|---|---|
| **S1 flot** | −0,30 m | `0,15 ≤ d ≤ 1,00` et marée montante | 61 à 110 s | Sortir tôt, l'eau commence à monter, la Laisse apparaît dès t ≈ 40 s si de l'eau est à 15–35 m du joueur |
| **S2 haute** | +1,50 m | `0,15 ≤ d ≤ 1,00` | 160 à 320 s | À l'étale haute, aller dans l'eau profonde pour 5 s |
| **S3 jusant** | −0,40 m | `0,15 ≤ d ≤ 1,00` et marée descendante | 375 à 427 s | Ressortir à la fin, la Laisse est encore là jusqu'à t = 431 s |

- **Placement (T-029)** : S1 et S3 sur le bas de l'estran, entre 35 et 50 m du phare ; S2 en mi-pente, **entre 25 et 40 m** du phare (hors du halo de 14 m), avec une pente permettant `d` entre 0,15 et 1,00 pendant la fenêtre. Le programmeur choisit les points avec `heightAt` pour respecter altitude (± 0,10 m) et distance, et ajoute un test d'atteignabilité (T-032).
- **Lecture** : maintenir E à moins de 2 m de l'échelle pendant 5 s. Si la condition tombe, la lecture est interrompue et remise à zéro.
- **Victoire** : les 3 échelles lues **et** le joueur en zone sèche sur la plateforme du phare, avant t = 480 s. Durée d'une partie gagnée : environ 400 à 480 s (6 min 40 à 8 min), dans la cible de 5 à 10 minutes. Transition de 6 s vers l'aube.
- **Défaites** : noyade (§3), 2 saisies en 45 s, échelle non lue à la fin de sa fenêtre, temps écoulé (t = 480 s) sans victoire.
- **Recommencer** : touche R ou Start. Même graine : la partie est reproductible.

## 9. Cas limites

| # | Cas | Règle |
|---|---|---|
| 1 | **Lampe éteinte** ou à 0 % | La Laisse n'est pas affectée par son absence. Seuls le faisceau et le halo repoussent. La nuit, la Laisse n'est visible que dans le faisceau. |
| 2 | **Marée au maximum** (t = 240 s, 2,40 m) | Seule la plateforme est zone sèche : il faut un sol à 2,65 m ou plus, et le reste de l'île culmine à environ 2,3 m (voir §17). Toute autre position est au moins un gué. |
| 3 | **Joueur immobile** | Bruit nul. Il n'est entendu que si la Laisse passe à moins de 4 m (présence). Hors zone sèche, il peut donc être saisi si elle tombe sur lui. |
| 4 | **Joueur sur la plateforme, Laisse en TRAQUE** | ATTENTE_BORD 10 s, puis RÔDE. Pas de saisie possible. Phare à 0 % : même résultat (la zone sèche protège). |
| 5 | **Phare à 0 % et joueur loin** | Il n'a plus de halo ni de faisceau : il doit rejoindre une zone sèche et la plateforme (manivelle). La lampe reste utilisable. |
| 6 | **Plusieurs bruits simultanés** | On garde le rayon maximal, jamais la somme. |
| 7 | **Faisceau et lampe sur la Laisse** | Pas de cumul : le REPLI le plus long s'applique (5 s). |
| 8 | **Apparition sans point valide** | Retenter chaque seconde ; si aucun point en 10 s, assouplir la distance minimale à 35 m. |
| 9 | **Saisie pendant un relevé ou un remontage** | L'action est interrompue (progression à zéro). |
| 10 | **Échelle noyée** (`d > 1,00`) ou sèche (`d < 0,15`) | Lecture refusée : clic sec, aucune progression. Une lecture en cours est interrompue. |
| 11 | **Pause** (Échap, perte du verrou du pointeur, onglet masqué, manette débranchée) | La simulation s'arrête entièrement (marée, phare, Laisse). Au retour, les touches enfoncées sont effacées. `dt` est borné à 0,1 s (prototype). |
| 12 | **Fenêtre de lecture manquée** | Défaite immédiate avec la carte de fin « relevé manqué ». [à régler au playtest : tolérance de 10 s ?] |
| 13 | **Joueur au bord de la carte** (rayon 75 m, 1,25 × `ISLAND_RADIUS`) | Mur invisible. Les bords sont en submersion : noyade avant d'y arriver. |
| 14 | **Deux saisies hors fenêtre** (2e après 45 s) | Elle compte comme une première saisie. |
| 15 | **Débris heurté en zone sèche** | Bruit fixe de 30 m quand même (impulsion non multipliée). |
| 16 | **Mode debug ×6** (touche T, seulement avec `?debug=1`) | Multiplie le temps de simulation de **tous** les systèmes. Pas de désynchronisation marée/Laisse. |
| 17 | **Fps bas ou onglet ralenti** | Pas fixe de 1/30 s ; au plus 3 pas par image. Les décisions de la Laisse n'utilisent pas le nombre d'images. |

## 10. Contrôles · effort **S**

### 10.1 Clavier et souris

| Action | Touche |
|---|---|
| Avancer / reculer / côtés | W A S D ou Z Q S D ou flèches (déjà dans le prototype) |
| Regarder | Souris (verrou du pointeur ; sensibilité 0,0022 rad/px, réglable en option de plus tard) |
| Courir | Maj (tenir) |
| Marche lente | C (tenir) |
| Lampe | F |
| Interagir (lire une échelle, remonter le phare) | E (tenir) |
| Pause | Échap |
| Recommencer (écran de fin) | R |
| Debug (`?debug=1`) | F3 : affiche les chiffres du prototype ; T : ×6 |

### 10.2 Manette (API Gamepad, mapping « standard » : Xbox, DualSense, Steam Deck)

| Action | Entrée |
|---|---|
| Déplacement | Stick gauche (zone morte 0,15) ; déflexion < 0,55 = marche lente |
| Caméra | Stick droit (zone morte 0,15 ; 2,4 rad/s à fond ; axe Y inversable) |
| Courir | RB (ou clic du stick gauche) |
| Lampe | X (bouton 2) |
| Interagir (tenir) | A (bouton 0) |
| Pause | Start (bouton 9) |
| Recommencer | Start |

- **Retours haptiques** (`vibrationActuator`, double rumble, si supporté) : grondement de la Laisse (80 ms, faible 0,3 / fort 0,6) ; saisie (300 ms, 1,0) ; battement lent (cadence 70/min, intensité 0,2) pendant TRAQUE à moins de 20 m ; noyade en cours (impulsions de 100 ms, 1/s). Les **gâchettes adaptatives du DualSense ne sont pas accessibles** par l'API Gamepad du navigateur : hors périmètre.
- **Remappage** : hors tranche P2 ; prévu à la tranche verticale (tableau d'actions rebindable, stocké en `localStorage`).
- **Basculement** : le dernier périphérique utilisé fait foi. Une manette branchée ou débranchée en cours de partie met en pause.

## 11. HUD et feedbacks · effort **S**

**HUD minimal (aucun texte qui explique une règle)** :

| Élément | Où | Contenu |
|---|---|---|
| **Jauge de marée** | Bord gauche, tube vertical, sans chiffres | Remplissage = niveau (−0,60 en bas, 2,40 en haut) ; petit chevron ▲ (montante) ou ▼ (descendante) |
| **Trois pastilles** | Haut à droite | Icônes : vague montante, pic, vague descendante. Contour = à faire, plein = lu, **pulsation = lisible maintenant** |
| **Lampe** | Bas à droite | Icône + barre d'autonomie |
| **Anneau d'interaction** | Centre | Point ; devient anneau qui se remplit pendant la lecture ou le remontage |
| **Vignettes** | Bord de l'écran | Bleu froid après une saisie ; assombrissement et bulles pendant la submersion |
| **Ligne d'objectif** | Bas, 6 s au début | « Lisez les trois échelles de marée. » (objectif, pas la règle) |
| **Cartes de fin** | Plein écran | Victoire : « Les trois relevés sont faits. » Défaite : « La mer a gagné. » ou « Relevé manqué. » ; puis « R pour recommencer » |

Le texte de debug du prototype (« Marée : x m… ») passe derrière F3.

| Événement | Visuel | Audio (synthèse, T-031) | Haptique |
|---|---|---|---|
| Pas dans l'eau | Anneaux sur l'eau, rayon proportionnel à `R` (max 8 m) | Clapotis dont le volume et la brillance suivent `R` | Aucun |
| Laisse t'entend | Aucun (rien à voir) | Grondement bref, direction | Pulsation |
| Faisceau touche la Laisse | Silhouette éclairée 0,5 s | Souffle court | Aucun |
| Phare faiblit (< 20 %) | Faisceau qui clignote | Grésillement du mécanisme | Aucun |
| Remonter le phare | Manivelle, anneau | Cliquetis régulier | Aucun |
| Saisie | Écran qui se resserre, vignette bleue | Choc sourd, souffle coupé | Fort |
| Noyade | Vignette sombre, bulles | Étouffement des sons (passe-bas) | Pulsé |
| Échelle lue | Pastille qui se remplit | Tintement | Court |

**Télémétrie** (stockée en mémoire, exportable par `__estran.getTelemetry()` pour T-032 ; aucun envoi réseau) : toutes les `1 s` position, bande, niveau, charge, batterie lampe, état de la Laisse et distance ; événements horodatés : `noise_heard`, `state_change`, `grab`, `station_read`, `window_missed`, `phare_wound`, `defeat(cause)`, `victory`, `pause`.

## 12. Brief d'ambiance (une page, pour T-030)

**Intention** : un estran gris et froid, où presque tout est caché. On voit d'abord la lumière, puis l'eau, puis ce qu'elle laisse deviner. Le brouillard et le noir font le travail ; les formes restent simples (low-poly éclairé).

### Palette (5 couleurs)

| # | Nom | Hex | Usage |
|---|---|---|---|
| 1 | Bleu nuit | `#101C2A` | Fond, brouillard de nuit, ombres |
| 2 | Bleu mer | `#12304A` | Eau (plan d'eau), reflets froids |
| 3 | Sable sec | `#6B614C` | Sol, éclairé ; mouillé = ce même ton assombri de 40 % |
| 4 | Lumière chaude | `#FFF0CC` | Faisceau et lanterne du phare : **la seule couleur chaude vive**, repère de sécurité |
| 5 | Rouille | `#6A1D1D` | Bande du phare, vignette de danger, accents d'alerte |

La lampe à main est une teinte de lumière, pas une couleur de palette : blanc froid `#DFE9FF` (opposé à la lumière chaude du phare, pour que le joueur distingue les deux sources).

### Trois moments d'éclairage

| Paramètre | **Nuit** (tranche P2) | **Aube** (victoire, jour 2) | **Jour gris** (exploration) |
|---|---|---|---|
| Fond et brouillard | `#101C2A`, densité 0,018 | `#6E7C8C`, densité 0,012 | `#8A9499`, densité 0,010 [à régler] |
| Lumière principale | Lune `#6F8FC0`, intensité 1,1 | Soleil bas `#E8B58A`, 1,6, rasant | Diffuse `#BFC7CC`, 0,9 |
| Ambiante | `#2A3A55` × 1,4 ; hémisphérique `#3A5078` / `#0C1014` × 0,9 | `#5A6677` × 1,2 | `#8A949B` × 1,8 |
| Faisceau du phare | Visible, additif, opacité 0,16 | Éteint, lanterne pâle | Éteint |
| Grain / contraste | Grain fort, contraste élevé | Grain léger | Grain moyen, couleurs désaturées |

Les valeurs de la nuit sont celles du prototype. Aube et jour gris sont des points de départ [à régler par T-030 puis T-007].

**Règle de parité** : tous ces réglages (brouillard, densité, grain, ombres, résolution, niveaux de qualité) ne modifient **aucune** valeur logique (bruit, portées, vitesses, états de la Laisse). La logique tourne à pas fixe de 1/30 s, lit des constantes de `data/`, et le rendu ne fait que lire son état. Un test de T-032 compare la télémétrie d'une même partie sur deux niveaux de qualité : elle doit être identique.

## 13. Questionnaire de la porte P2

À poser après une partie (ou 10 minutes de jeu), sans aide ni relecture du pitch. **Le propriétaire est le seul répondant de P2** (décision `production/DECISIONS.md`) : il répond avec ses mots, en 5 minutes au plus, 8 questions au maximum. Une réponse est « comprise » si l'idée-clé figure dans la réponse ; en l'absence d'enquêteur, le propriétaire s'auto-évalue contre la colonne de droite après avoir répondu.

| # | Question | Réponse attendue (idée-clé) |
|---|---|---|
| 1 | Que fait l'eau, et qu'est-ce que ça change pour vous ? Où êtes-vous en sécurité quand elle est haute ? | L'eau monte et redescend selon un cycle (jauge). Il faut être **hors de l'eau** : zone sèche, plateforme du phare, qui rétrécit. L'eau ralentit et peut noyer. Les échelles ne se lisent qu'à certains moments |
| 2 | Qu'est-ce qui attire la chose dans l'eau ? | **Le bruit** (marcher vite, courir, éclabousser, heurter des objets), plus que la vue. Immobile ou lent, on est moins entendu |
| 3 | Que fait le phare ? Que faut-il y faire, et pourquoi ? | Le faisceau **repousse** la chose, mais le phare **s'éteint** à l'usure ; il faut le **remonter** à la manivelle avant de ressortir |
| 4 | Que faites-vous quand vous entendez un bruit dans l'eau ? Pourquoi ? | Se figer ou ralentir, écouter la direction, rejoindre une zone sèche ou la lumière, allumer la lampe de près ; **ne pas courir** |
| 5 | À quel moment avez-vous eu le plus peur ? Qu'est-ce qui l'a causé ? Note de 1 à 5 | Moment d'écoute ou d'attente (remous, grondement, silence) plutôt qu'une apparition visible. Note ≥ 3. Notez la cause citée |
| 6 | Avez-vous joué au **casque** ? Au premier contact, le niveau sonore était-il trop faible, correct ou trop fort ? | Réponse « casque oui/non » et « faible / correct / fort ». Information de réglage (volume maître, T-031), sans seuil |
| 7 | Refaites 2 minutes en coupant le son (touche M) : la peur est-elle la même ? Qu'est-ce qui change ? | Le son porte **au moins la moitié** de la peur (objectif sonore de T-031) : sans son, la peur baisse nettement et l'écoute des remous manque. Réponse « moitié ou plus / moins de la moitié » |
| 8 | Les sous-titres (descriptions des bruits) étaient-ils lisibles, utiles, et ont-ils gâché la peur ? | Lisibles et utiles sans gâcher l'ambiance. Information d'accessibilité, sans seuil |

**Seuil de passage** (arbitrage 1 de `production/validations/T-006.md`) : la porte P2 est franchie si les trois conditions suivantes sont réunies.
1. **Les automates de T-032 passent le critère de discrimination** (≥ 90 % / ≥ 90 %, seuils fixés par T-032).
2. **Le propriétaire, seul répondant,** obtient **4/4** « compris » aux questions 1 à 4 et donne une note **≥ 3** à la question 5.
3. **Les questions 6 à 8 sont renseignées** (réponse obligatoire, mais aucune n'est éliminatoire). Seule la question 7 est suivie : si le propriétaire répond « moins de la moitié », le son est rouvert (retour à T-031) sans bloquer P3.

« P2 réussie » signifie **« prête pour P3 »**, et non « validée par le public ». **Aucun humain extérieur n'est requis avant P3** : les testeurs extérieurs sont reportés à la démo P3 et deviennent une **condition de P3**. Les parties de test sont aussi lues par T-032 (télémétrie : nombre de bruits entendus, états de la Laisse, saisies).

## 14. Estimation d'effort de la tranche P2 (pour T-029 à T-033)

| Système | Effort | Notes de réalisation (base : `prototypes/estran-poc/src/main.js`) |
|---|---|---|
| Marée (table, interpolation, bandes) | **S** | Remplacer `tideAt` par lecture de `maree.csv` ; classer `d` à chaque pas |
| Déplacement par bande d'eau | **S** | Étendre `step()` (déjà : marche, course, bornes) |
| Bruit du joueur (rayons, débris) | **M** | Un module pur (fonction de l'état), testable |
| Laisse (automate, apparition, saisie) | **M** | Module pur sans three.js, déterministe ; rendu = anneaux d'eau et silhouette |
| Phare (charge, faisceau, halo) | **S** | Faisceau et cône déjà dans le prototype ; ajouter la charge et la logique d'angle |
| Lampe | **S** | Déjà présente (F) ; ajouter l'autonomie et le cône logique |
| Échelles et objectif | **M** | 3 maillages simples, progression de lecture, états de fin |
| HUD et cartes de fin | **S** | DOM, sans texte de règle |
| Contrôles manette | **S** | `navigator.getGamepads()` à chaque image |
| Télémétrie | **S** | Tableau en mémoire |
| Audio de synthèse (T-031) | **M** | Clapotis, grondement, remous, phare |
| **Total logique + jeu (T-029)** | **L** | Faisable en une à deux sessions d'agent. **Ordre de coupe en cas de retard** : haptique, débris, marche lente par stick, silhouette du faisceau. À ne jamais couper : bruit, Laisse, phare, échelles, zone sèche |

## 15. Reste du jeu (plan, niveau d'intention)

| Élément | Plan | Statut |
|---|---|---|
| Marées | 4 marées sur 2 jours (jamais plus de 5) ; durée de cycle du jeu complet à fixer [à régler] car la tranche P2 compresse un cycle en 8 min (4 cycles × 8 min ne font pas 1 h 30) | Plan |
| Marée 1 | Équivalent de la tranche P2 + didacticiel de lecture de la jauge | Plan |
| Marée 2 | Intérieurs noyés du village : la lampe devient utile ; première cassette | Plan |
| Marée 3 | **Grains de vent** qui éteignent le phare (seconde cause d'extinction) ; la Laisse écoute mieux la nuit | Plan |
| Marée 4 | Dernier relevé du marégraphe, fin (éventuellement une seconde) | Plan |
| Progression | Pas d'expérience ni d'inventaire de loot ; le joueur apprend : routes, fenêtres, intérieurs | Plan |
| Difficulté | Un seul niveau ; options d'accessibilité (sensibilité, vibration, sous-titres des sons) à définir par `ui-ux-designer` (T-014) | Plan |
| Économie | Aucune (pas d'artisanat). Objets : lampe (autonomie), notes, cassettes | Plan |

## 16. Périmètre de la tranche verticale (après P2)

Respecte `production/validations/T-004.md` §6, sans l'étendre. Elle n'est lancée que si la porte P2 est franchie.

- **Solo**, navigateur d'abord, PC ; aucun multijoueur ni serveur ; consoles hors périmètre.
- **Monde** : une île (0,1 à 0,25 km², à fixer au blockout), un phare, **4 à 6 intérieurs** ; pas d'autres îles ni de bateau.
- **Structure** : **4 marées sur 2 jours** (5 au plus), **1 h 30 à 2 h 30**, une fin, éventuellement deux ; pas de mode rejouable.
- **Menace** : la Laisse, presque invisible (bruit, traces, remous, silhouette) ; **ni combat ni gros plan** ; pas d'arme ni d'artisanat.
- **Personnages** : 2 à 3, présents par textes, photos, enregistrements ; **aucun visage animé** ; héroïne en vue subjective (mains et ombre), pas de corps complet.
- **Voix** : aucune voix humaine enregistrée par défaut ; radio et cassettes en texte et sons, ou voix de synthèse selon T-024.
- **Interface** : diégétique (montre, table des marées, carnet) ; remappage des touches ; options d'accessibilité.
- **Style** : stylisé atmosphérique ; pas de photoréalisme ; pas de mode photo.
- **Non fait** (liste gelée de T-004 §6) : autres îles, bateau, combat, artisanat, mode photo, mode rejouable, corps complet, doublage, multijoueur, portage console.

## 17. Hypothèses et points à surveiller

- **Terrain** : la plateforme du phare (3,00 m) n'existe pas dans le prototype, où le sol du phare est à environ 2 m. T-029 doit la créer (cylindre aplani de 6 m de rayon) ; sinon la plateforme n'est plus une zone sèche à l'étale haute. Cas 2 (§9) : l'altitude maximale du terrain hors plateforme (jusqu'à environ 2,3 m selon le bruit) doit rester **sous 2,65 m** pour qu'aucun autre point ne soit zone sèche à marée haute ; à mesurer au blockout.
- **Fenêtres** : l'échelle S2 demande une pente où `d` reste dans 0,15–1,00 pendant 160 s ; si le terrain ne s'y prête pas, ajuster l'altitude de S2 (pas la table de marée) et mettre à jour `stations.csv`.
- **Faisceau** : le calcul d'angle ignore les obstacles ; à revoir si des intérieurs sont ajoutés.
- **Valeurs** : tous les `A_REGLER` de `menace.csv`. Les plus sensibles : `noise_walk`, `noise_run`, `threat_hear_to_inquire`, `lighthouse_charge_decay`, `lamp_battery_seconds`.
- **Équité** : la Laisse apparaît dès t ≈ 40 s (T-037), avant l'ouverture de S1 (61 s) : si le test humain montre un départ trop dur, repousser l'apparition à −0,20 m (t ≈ 57 s, réglage d'avant T-037) ; les automates ne peuvent pas en juger.
