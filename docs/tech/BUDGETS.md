# Budgets techniques par plateforme

| | |
|---|---|
| **Tâche** | T-003 : Choix techniques, architecture et budgets |
| **Auteur** | `technical-director` |
| **Version** | 1.0 du 2026-11-20 (budgets d'allocation initiaux) |
| **Statut** | Soumis à la validation de la Boss |
| **Documents liés** | [`ARCHITECTURE.md`](ARCHITECTURE.md) · [`NORMES_CODE.md`](NORMES_CODE.md) |
| **Utilisé par** | Bible artistique (T-007), direction audio (T-009), UX (T-014), plan plateformes (T-012), tests (T-013), chiffrage (T-015) |

Les marqueurs **[Public]**, **[Secondaire]**, **[Estimation TD]**, **[À mesurer]** et **[NDA]** ont le sens
défini dans `ARCHITECTURE.md` §0.

---

## 1. Principes

1. **Ce sont des budgets d'allocation, pas des mesures.** Rien n'a été mesuré : ni le moteur, ni les kits
   ne sont disponibles. Ces valeurs servent à répartir l'effort entre les pôles dès maintenant ; elles sont
   **recalées** après le test « pire cas » de M1 (S-1) puis au Vertical Slice (M2), sur matériel réel.
   Chaque révision incrémente la version de ce document.
2. **La Xbox Series S est le plancher de contenu.** Le contenu est produit une seule fois ; les autres
   plateformes montent en qualité par les réglages (Device Profiles, scalabilité), jamais par un contenu
   différent. Le Steam Deck dérive du profil Series S.
3. **Les modes Qualité et Performance d'une même console partagent le même budget CPU.** La simulation
   (gameplay, IA, physique) est identique dans les deux modes ; seul le rendu change. Un système qui ne
   tient qu'en mode Qualité est un système hors budget.
4. **Le mode Performance à 60 fps sur console est une exigence ferme.** La résolution dynamique absorbe les
   variations ; quand elle atteint son plancher, ce sont les réglages qui baissent, pas la fréquence.
5. **La frame generation ne compte jamais** dans l'atteinte d'une fréquence cible.
6. **On mesure avant d'optimiser**, sur des parcours de référence automatisés (§13).
7. **Chaque ligne de budget a un responsable** (§13.3). Un dépassement suit la procédure du §13.4.
8. **Les plateformes ne diffèrent que par le rendu, jamais par une information utile au jeu** (règle de
   parité, `ARCHITECTURE.md` §10.1). Un budget ne peut donc jamais être tenu en réduisant, sur une seule
   plateforme, ce que le joueur a besoin de voir ou d'entendre : quand un levier touche une information de
   jeu, il s'applique à toutes les plateformes ou pas du tout.

---

## 2. Tableau de référence : confirmation et corrections

Le tableau de `studio/WORKFLOW.md` est **confirmé pour PS5 et Xbox Series X**, et **corrigé** sur quatre
points : la résolution de sortie de la Series S dépend du mode, la configuration PC minimale (GTX 1070 /
RX 5600) n'est plus tenable, le Steam Deck devient une ligne à part, et le PC n'a pas de modes « Qualité /
Performance » mais des préréglages.

| Plateforme | Mode | Fréquence (temps de frame) | Résolution interne visée (plancher de la résolution dynamique) | Sortie | Upscaling |
|---|---|---|---|---|---|
| PS5 / Xbox Series X | Qualité | 30 fps verrouillés (33,3 ms) | 1440p (plancher 1200p) | 4K, HDR | TSR |
| PS5 / Xbox Series X | **Performance** | **60 fps (16,7 ms)** | 1080p (plancher 864p) | 4K, HDR | TSR |
| PS5 Pro (optionnel, décision à M4) | Performance « Pro » | 60 fps | 1440p ou plus | 4K, HDR | PSSR [NDA] |
| Xbox Series S | Qualité | 30 fps verrouillés | 900p (plancher 720p) | **1440p** | TSR |
| Xbox Series S | **Performance** | **60 fps** | 720p (plancher 540p) | **1080p** | TSR |
| Steam Deck | Unique | 30 fps (option 40 fps si la marge le permet) | 853×533, soit 67 % de 800p (plancher 50 %) | 1280×800 | TSR ou FSR |
| PC minimum | Préréglage Bas | 30 fps | 720p | 1080p | TSR, FSR, DLSS ou XeSS |
| PC recommandé | Préréglage Élevé | 60 fps | 960p (mode « Qualité » des upscalers) | 1440p | DLSS, FSR, XeSS ou TSR |
| PC haut de gamme | Préréglage Épique, Lumen matériel | 60 fps et plus | 1440p | 4K | DLSS, FSR, XeSS ou TSR ; frame generation optionnelle |

**Détail des corrections** :
1. **Series S** : une sortie 1440p en mode Performance n'est pas réaliste pour un rendu Lumen à 60 fps sur
   un GPU de 4 TFLOPS [Public]. Sortie 1080p en Performance, 1440p en Qualité. Le 60 fps sur Series S est
   le point le plus risqué du projet (R-02, R-03) : **la Boss arbitrera à M2**, sur mesure, entre des
   réglages encore réduits et une Series S limitée au mode 30 fps. Le TD recommande de conserver le 60 fps.
2. **PC minimum** : la GTX 1070 (architecture Pascal) ne reçoit plus de nouveaux pilotes « Game Ready »
   après la branche 580 de NVIDIA [Public, annonce NVIDIA relayée par la presse], et la RX 5600 XT n'a que
   6 Go de mémoire vidéo. Nouvelle configuration minimale : **GPU DirectX 12 avec Shader Model 6 et 8 Go de
   mémoire vidéo** (§11).
3. **Steam Deck** : sa puissance (1,6 TFLOPS, 4 cœurs) est très inférieure à celle d'un PC minimum ; il a
   donc sa propre ligne et son propre profil, dérivé de celui de la Series S. L'objectif de label
   (« Verified » ou « Playable ») est décidé à M2 (R-08).
4. **PC** : préréglages Bas, Moyen, Élevé, Épique et Cinématique, plutôt que des modes.

La Coordination peut remplacer le tableau de `studio/WORKFLOW.md` par un renvoi vers cette section.

---

## 3. Budgets de temps de frame

### 3.1 Budgets globaux

Mesurés en **moyenne** et au **99e centile (p99)** sur les parcours de référence (§13.1). Le render thread
inclut le RHI thread (chacun doit tenir dans la colonne).

| Plateforme et mode | Frame | Game thread moyen / p99 | Render thread moyen / p99 | GPU moyen (cible de la résolution dynamique) / p99 |
|---|---|---|---|---|
| PS5 / Series X, Performance | 16,7 ms | 10,0 / 14,0 ms | 10,0 / 14,0 ms | 14,5 / 16,0 ms |
| PS5 / Series X, Qualité | 33,3 ms | **10,0 / 14,0 ms** (identique, principe 3) | 14,0 / 20,0 ms | 30,0 / 32,5 ms |
| PS5 Pro, Performance « Pro » | 16,7 ms | 10,0 / 14,0 ms | 10,0 / 14,0 ms | 14,5 / 16,0 ms |
| Series S, Performance | 16,7 ms | 10,5 / 14,5 ms | 10,5 / 14,5 ms | 14,5 / 16,0 ms |
| Series S, Qualité | 33,3 ms | 10,5 / 14,5 ms | 14,5 / 20,0 ms | 30,0 / 32,5 ms |
| Steam Deck | 33,3 ms | 22,0 / 30,0 ms | 22,0 / 30,0 ms | 30,0 / 32,5 ms |
| PC minimum, Bas | 33,3 ms | 20,0 / 28,0 ms | 20,0 / 28,0 ms | 30,0 / 32,5 ms |
| PC recommandé, Élevé | 16,7 ms | 10,0 / 14,0 ms | 10,0 / 14,0 ms | 14,5 / 16,0 ms |

Pourquoi 10 ms de game thread pour une frame de 16,7 ms : le game thread, le render thread et le GPU
travaillent en parallèle, décalés d'une frame. Chacun doit tenir dans la frame, avec une marge pour les pics
(ramasse-miettes, streaming, apparition d'ennemis). La marge de 6,7 ms en moyenne est ce qui permet de tenir
le p99. Les CPU des trois consoles sont de la même famille (Zen 2, 8 cœurs) [Public] ; celui de la Series S
est un peu moins rapide, d'où 10,5 ms **mesurés sur Series S**, qui correspondent à 10 ms sur les autres.

**Threads de travail** (animation, physique, Niagara, décompression) : occupation moyenne inférieure à 70 %
sur console, sans allonger le chemin critique du game thread [Estimation TD].

### 3.2 Répartition du game thread (mode Performance, consoles, concept de référence)

Concept de référence : solo, linéaire ou semi-ouvert, troisième personne (`ARCHITECTURE.md` §14).

| Poste | Budget moyen | Contenu |
|---|---|---|
| Moteur (tick du monde, timers, ramasse-miettes incrémental amorti) | 1,5 ms | |
| Joueur (entrées, déplacement, caméra) | 0,8 ms | |
| Gameplay (GAS, interactions, logique) | 1,5 ms | |
| IA (StateTree, perception, navigation, Smart Objects) | 1,5 ms | Environ 20 IA actives à pleine fréquence [Estimation TD] |
| Animation (part du game thread ; l'évaluation est sur les threads de travail) | 1,0 ms | |
| Physique (part du game thread) | 1,0 ms | |
| Streaming et World Partition (part du game thread) | 0,8 ms | |
| UI (CommonUI, HUD) | 0,7 ms | |
| Audio (part du game thread) | 0,3 ms | |
| Effets Niagara (part du game thread) | 0,4 ms | |
| Blueprints de contenu (scripts de niveau, événements) | 0,5 ms | |
| **Total** | **10,0 ms** | |

**Ramasse-miettes** : pas plus de 2 ms par frame en moyenne pendant le jeu ; aucune pause de plus de 5 ms
hors écrans de chargement. Un ramasse-miettes complet n'a lieu que pendant un chargement.

### 3.3 Répartition du GPU (mode Performance)

| Poste | PS5 / Series X (1080p vers 4K) | Series S (720p vers 1080p) | Steam Deck, 30 fps (533p vers 800p) |
|---|---|---|---|
| Géométrie Nanite et base pass (GBuffer ou Substrate) | 3,0 ms | 3,0 ms | 7,0 ms |
| Personnages (skinning, peau, cheveux, vêtements) | 1,0 ms | 1,0 ms | 2,5 ms |
| Ombres (Virtual Shadow Maps) | 2,0 ms | 2,0 ms | 4,0 ms |
| Lumen (GI et réflexions) | 3,2 ms | 3,0 ms | 6,0 ms |
| Éclairage direct (MegaLights ou deferred) | 1,0 ms | 0,8 ms | 1,5 ms |
| Ciel, nuages et brouillard volumétriques | 0,6 ms | 0,8 ms | 1,5 ms |
| Translucidité et effets Niagara | 1,0 ms | 1,0 ms | 2,0 ms |
| Post-traitement (exposition, profondeur de champ, flou de mouvement, bloom, tonemapping) | 0,8 ms | 0,8 ms | 1,5 ms |
| Upscaling (TSR) | 1,2 ms | 1,0 ms | 1,5 ms |
| UI et divers | 0,2 ms | 0,3 ms | 0,5 ms |
| Marge | 0,5 ms | 0,8 ms | 2,0 ms |
| **Total (cible de la résolution dynamique)** | **14,5 ms** | **14,5 ms** | **30,0 ms** |

Répartition du mode **Qualité** sur PS5 / Series X (1440p vers 4K, 30 ms) : géométrie 5,5 ; personnages 2,0 ;
ombres 3,5 ; Lumen (matériel si retenu) 8,0 ; éclairage direct 2,5 ; ciel et volumétrie 1,5 ; translucidité
et effets 2,0 ; post-traitement 1,5 ; TSR 1,5 ; UI 0,3 ; marge 1,7.

Ces répartitions sont des **[Estimations TD]**, à recaler après S-1. Le détail des réglages par poste sera
dans `docs/tech/RENDU.md` (graphics-programmer).

### 3.4 Régularité de la cadence

| Mesure, sur les parcours de référence | Mode 60 fps | Mode 30 fps |
|---|---|---|
| Frames dans la cible | 99 % ou plus sous 16,9 ms | 99 % ou plus à 33,3 ms (cadencement régulier, sans alternance de frames courtes et longues) |
| 1 % des frames les plus lentes | 55 fps ou plus | 28 fps ou plus |
| Hitch maximal toléré hors écran de chargement | Aucune frame de plus de 33,3 ms | Aucune frame de plus de 50 ms |
| Hitchs de compilation de shaders (PSO) | 0 de plus de 50 ms | 0 de plus de 50 ms |

---

## 4. Contraintes publiques des plateformes et ce qui relève du NDA

### 4.1 Spécifications publiques

| | PS5 | PS5 Pro | Xbox Series X | Xbox Series S | Steam Deck (LCD / OLED) |
|---|---|---|---|---|---|
| CPU | 8 cœurs Zen 2, jusqu'à 3,5 GHz (fréquence variable) | Zen 2 | 8 cœurs Zen 2, 3,8 GHz (3,66 GHz avec SMT) | 8 cœurs Zen 2, 3,6 GHz (3,4 GHz avec SMT) | 4 cœurs / 8 threads Zen 2, 2,4 à 3,5 GHz |
| GPU | RDNA 2, 36 CU jusqu'à 2,23 GHz, 10,28 TFLOPS | 67 % de CU en plus que la PS5 | RDNA 2, 52 CU à 1,825 GHz, 12 TFLOPS | RDNA 2, 20 CU à 1,565 GHz, 4 TFLOPS | RDNA 2, 8 CU, 1,0 à 1,6 GHz, 1,6 TFLOPS |
| Mémoire totale | 16 Go GDDR6, 448 Go/s | 16 Go GDDR6, bande passante en hausse de 28 % | 16 Go GDDR6 : 10 Go à 560 Go/s et 6 Go à 336 Go/s | 10 Go GDDR6 : 8 Go à 224 Go/s et 2 Go à 56 Go/s | 16 Go LPDDR5 partagés : 88 Go/s (LCD), 102,4 Go/s (OLED) |
| Mémoire disponible pour le jeu | **Non publiée** [NDA] | **Non publiée** [NDA] | **13,5 Go** : 10 Go « GPU optimal » et 3,5 Go « standard » [Public, Microsoft via Digital Foundry, 2020] | **Environ 8 Go**, plus « quelques centaines de Mo » libérés par le GDK de juin 2022 [Secondaire] ; valeur exacte [NDA] | Partagée avec SteamOS ; pas de valeur publiée |
| Stockage | SSD de 825 Go (environ 667 Go utilisables [Secondaire]), 5,5 Go/s brut, 8 à 9 Go/s typiques compressés | 2 To | SSD NVMe de 1 To | SSD de 512 Go (une version 1 To existe) | 64 Go eMMC à 1 To NVMe selon le modèle |
| Écran | Téléviseur | Téléviseur | Téléviseur | Téléviseur | 1280×800 ; 60 Hz (LCD), jusqu'à 90 Hz et HDR (OLED) |

### 4.2 Ce que nous ne savons pas, et ne devons pas inventer [NDA]

Les éléments suivants existent dans la documentation des constructeurs, accessible seulement après
signature des accords : ils **ne figurent pas** dans ce document et seront intégrés par `platform-engineer`
sous forme générique une fois l'accès obtenu (T-012).

- la mémoire exacte disponible pour un jeu sur PS5 et PS5 Pro, et la valeur exacte sur Series S ;
- les exigences de certification (TRC de Sony, XR de Microsoft) : délais de suspension et de reprise,
  règles de sauvegarde, de taille d'installation et de patch, comportements obligatoires ;
- les outils de profilage et de débogage propres aux consoles, et les versions de SDK exigées à la soumission ;
- les détails des mécanismes d'installation progressive et de livraison adaptée à chaque modèle de console.

**Conséquence pour les budgets** : sur PS5, on applique **le même budget que sur la Series X** (12,5 Go,
§6), ce qui garantit qu'un contenu validé sur l'une passe sur l'autre. Sur Series S, on budgète avec une
marge de 1 Go sous la valeur publique approximative.

---

## 5. Budgets de rendu et de contenu

### 5.1 Compteurs par frame (vue principale, mode Performance)

| Compteur | PS5 / Series X | Series S | Steam Deck |
|---|---|---|---|
| Appels de dessin hors Nanite | 2 000 | 1 500 | 1 200 |
| Lumières locales projetant des ombres, visibles en même temps, sans MegaLights | 8 | 4 | 2 |
| Lumières locales projetant des ombres avec MegaLights | 64 [À mesurer] | 16 [À mesurer] | Selon mesure |
| Lumières ombrées **mobiles** (leur cache de VSM est invalidé à chaque frame), visibles en même temps | 2, dont une seule à longue portée | 2, dont une seule à longue portée, résolution d'ombre réduite | 2, selon mesure (§15.1) |
| Lumières locales sans ombre | 64 | 32 | 16 |
| Personnages squelettiques animés à pleine fréquence (au-delà : Animation Budget Allocator et mise à jour réduite) | 12 | 8 | 6 |
| MetaHumans en LOD 0 ou 1 en jeu | 3 | 2 | 1 |
| Cheveux en strands | Personnage principal, mode Qualité et cinématiques | Jamais en jeu | Jamais |
| Systèmes Niagara actifs | 150 | 100 | 60 |
| Particules GPU / CPU | 200 000 / 10 000 | 100 000 / 5 000 | 50 000 / 3 000 |
| Couches de translucidité superposées (moyenne à l'écran) | 3 | 2 | 2 |
| Décals visibles | 200 | 120 | 80 |
| Matériaux de post-traitement actifs | 3 | 2 | 1 |

### 5.2 Shaders et permutations (risque R-01)

| Règle | Budget |
|---|---|
| Matériaux maîtres dans le projet | 40 au plus |
| Commutateurs statiques par matériau maître (chacun double le nombre de permutations) | 6 au plus |
| Drapeaux d'usage (`bUsedWith...`) | Seulement ceux qui servent, vérifiés par validateur |
| Matériaux uniques par asset | Interdits : instances de matériaux obligatoires |
| Nombre total de PSO | Suivi chaque nuit ; toute hausse de plus de 10 % d'une nuit à l'autre est examinée |

### 5.3 Plafonds de contenu [Estimation TD]

La densité de texels, l'échelle et le style sont fixés par la bible artistique (T-007), **à l'intérieur** de
ces plafonds :

| Type d'asset | Plafond technique |
|---|---|
| Textures | 4096² pour les assets majeurs, 2048² par défaut, 1024² pour les petits objets. **Pas de 8K**, sauf terrain en Virtual Texture avec dérogation du TD. Le mip le plus haut est retiré automatiquement sur Series S et Steam Deck par les profils |
| Formats de texture | Compression BCn adaptée au type (BC7, BC5, BC4, BC1), Oodle Texture (RDO) ; non compressé interdit hors UI justifiée |
| Maillages statiques opaques | Nanite par défaut. Matériaux masqués ou avec World Position Offset sur Nanite : réservés à la végétation, coût mesuré |
| Personnage principal hors Nanite (corps et vêtements, sans les cheveux) | 100 000 triangles au LOD 0 |
| Personnages secondaires / PNJ / foule | 60 000 / 30 000 / 10 000 triangles au LOD 0 |
| LOD des maillages squelettiques hors Nanite | 4 au minimum |
| Os du squelette du corps (hors visage et simulation de vêtements) | 200 au plus |
| MetaHumans | LOD 0 réservé aux cinématiques et au mode photo ; LOD selon la distance en jeu ; nombre limité par le §5.1 |
| Matériaux (système classique) | 300 instructions au plus dans le base pass (500 pour un asset majeur) ; 12 échantillonneurs de texture au plus |
| Matériaux Substrate (si adopté) | 2 couches (slabs) au plus, 3 pour un asset majeur |
| Blueprint : assets chargés par références dures | 50 Mo au plus par classe ; 400 Mo au plus pour l'ensemble toujours chargé (personnage, GameMode, HUD) |
| Voix audio réelles simultanées | 64 (PS5 / Series X), 48 (Series S), 32 (Steam Deck) ; à affiner dans T-009 |

---

## 6. Budgets mémoire

### 6.1 Consoles et Steam Deck

| Catégorie | Series S (plancher) | PS5 / Series X | Steam Deck (processeur et GPU confondus) |
|---|---|---|---|
| Code, moteur, données statiques, surcoût des allocateurs | 0,60 Go | 0,70 Go | 0,80 Go |
| Cibles de rendu et tampons GPU (GBuffer, historique TSR, Lumen, pool des VSM, post-traitement) | 0,90 Go | 1,60 Go | 0,70 Go |
| Pool de streaming des textures (Virtual Texturing compris) | 1,80 Go | 3,50 Go | 1,80 Go |
| Pool de streaming de Nanite | 0,40 Go | 0,80 Go | 0,40 Go |
| Maillages hors Nanite (squelettiques, translucides) et structures de ray tracing si Lumen matériel | 0,50 Go | 1,20 Go | 0,50 Go |
| Scène Lumen (surface cache) | 0,20 Go | 0,40 Go | 0,20 Go |
| Animation (séquences, base de Motion Matching, Control Rig) | 0,35 Go | 0,60 Go | 0,35 Go |
| Physique, collisions, navigation | 0,30 Go | 0,45 Go | 0,30 Go |
| Audio (résident et cache de streaming) | 0,20 Go | 0,35 Go | 0,20 Go |
| Gameplay et monde (objets, acteurs, cellules World Partition, IA, sauvegarde) | 0,75 Go | 1,10 Go | 0,75 Go |
| UI (textures, polices, y compris les polices asiatiques) | 0,15 Go | 0,25 Go | 0,15 Go |
| Effets Niagara | 0,15 Go | 0,25 Go | 0,15 Go |
| Entrées et sorties, tampons de streaming et de décompression | 0,20 Go | 0,30 Go | 0,20 Go |
| Réserve pour les pics et la fragmentation (non allouable au contenu) | 0,50 Go | 1,00 Go | 1,00 Go |
| **Budget total utilisé par le jeu** | **7,00 Go** | **12,50 Go** | **7,50 Go** (pour un total processus inférieur à 10 Go, surcoût de Proton et de SteamOS compris) |
| Mémoire disponible publiée | environ 8 Go [Secondaire] | 13,5 Go sur Series X [Public] ; non publiée sur PS5 [NDA] | non publiée |
| **Marge non allouée** | environ 1 Go | 1 Go (Series X) | à mesurer |

**Series X** : les ressources GPU (cibles de rendu, textures, Nanite, maillages, Lumen, effets) représentent
environ 7,8 Go et doivent tenir dans les 10 Go rapides ; les données du processeur vont dans la mémoire
standard.

**Réglages correspondants dans le moteur** (valeurs fixées par `graphics-programmer` dans les Device
Profiles) : `r.Streaming.PoolSize`, `r.Nanite.Streaming.StreamingPoolSize`, `r.Shadow.Virtual.MaxPhysicalPages`.

**Suivi** : chaque catégorie correspond à des tags du Low Level Memory Tracker (LLM). Les pics sont relevés
chaque nuit sur les parcours de référence (§13).

### 6.2 PC

| Préréglage | Mémoire vidéo visée | Mémoire système du processus | Matériel visé |
|---|---|---|---|
| Bas | 6,5 Go au plus | 10 Go au plus | GPU de 8 Go, 16 Go de RAM |
| Moyen | 7,5 Go au plus | 11 Go au plus | GPU de 8 Go |
| Élevé | 10 Go au plus | 12 Go au plus | GPU de 12 Go |
| Épique | 14 Go au plus | 14 Go au plus | GPU de 16 Go, 32 Go de RAM |

---

## 7. Budgets de streaming

| Mesure | Budget | Raison |
|---|---|---|
| Débit de lecture soutenu (données compressées) pendant une traversée à vitesse maximale | 100 Mo/s au plus, sur toutes les plateformes | Dimensionné pour un SSD SATA de PC minimum et les modèles de Steam Deck à mémoire eMMC (plus lents, débit à mesurer), avec une marge |
| Pic de lecture | 300 Mo/s au plus, pendant 2 s au plus | |
| Vitesse de traversée prise en charge sans attente | 8 m/s à pied ; 30 m/s pour une monture ou un véhicule (monde ouvert seulement) | Point de variation (§14) |
| Distance de chargement des cellules | Au moins vitesse maximale × temps de chargement p99 d'une cellule × 2 | Le joueur ne doit jamais atteindre une cellule non chargée |
| Temps de chargement d'une cellule World Partition (p99) | 2 s au plus | |
| Dépassement du pool de textures (« over budget ») sur les parcours | 0 Mo | |
| Textures floues visibles plus d'une seconde | Considéré comme un bug | |
| Chargements synchrones pendant le jeu | 0 (détectés automatiquement) | `NORMES_CODE.md` §5 |
| Cellule critique non prête à temps | Écran de chargement court plutôt qu'une chute dans le vide ; objectif : 0 sur les parcours | |
| Disque dur mécanique sur PC | **Non pris en charge** (SSD obligatoire) | |

---

## 8. Taille d'installation et patchs [Estimation TD]

| Concept | Consoles (installé) | PC | Steam Deck |
|---|---|---|---|
| Linéaire (10 à 15 h) | 50 Go au plus | 60 Go au plus | Comme le PC |
| Hubs semi-ouverts | 70 Go au plus | 80 Go au plus | Comme le PC |
| Monde ouvert (30 h et plus) | 100 Go au plus | 120 Go au plus | Comme le PC |

| Patch | Budget |
|---|---|
| Patch du jour de sortie | 10 Go au plus |
| Patch correctif courant | 3 Go au plus |
| Mise à jour de contenu ou DLC | Selon le contenu, dans des chunks dédiés |

Moyens : compression Oodle des conteneurs IoStore, Oodle Texture (RDO), déduplication, chunks d'installation
organisés pour limiter la taille des deltas, pack de textures haute résolution optionnel sur PC si le budget
PC est dépassé. Les règles exactes des constructeurs sur la taille des patchs sont [NDA]. Pour mémoire, une
installation de 100 Go occupe plus du quart du stockage utilisable d'une Series S de 512 Go.

---

## 9. Temps de chargement

| Situation | PS5 / Series X | Series S | PC recommandé (NVMe) | PC minimum (SSD SATA) | Steam Deck |
|---|---|---|---|---|---|
| Lancement à froid jusqu'à l'écran titre interactif (hors logos obligatoires) | 15 s | 20 s | 20 s | 30 s | 30 s |
| Chargement d'une sauvegarde jusqu'au contrôle du personnage | 10 s | 15 s | 12 s | 25 s | 25 s |
| Réapparition après une mort | 3 s | 5 s | 4 s | 8 s | 8 s |
| Voyage rapide (monde ouvert) | 8 s | 12 s | 10 s | 20 s | 20 s |
| Préparation des shaders au premier lancement (PC) | sans objet | sans objet | 3 min au plus, avec barre de progression | 5 min au plus | Selon le cache de shaders de Steam, à mesurer |

---

## 10. Stabilité

| Indicateur | Alpha (M3) | Beta (M4) | Gold (M5) et lancement |
|---|---|---|---|
| Sessions sans crash (playtests puis télémétrie avec consentement) | 97 % | 99 % | 99,5 % sur PC, 99,8 % sur console |
| Test d'endurance automatisé sans crash | 4 h | 8 h | 12 h, sur chaque plateforme |
| Croissance mémoire après la phase de mise en route, pendant le test d'endurance | Mesurée | 200 Mo au plus | 100 Mo au plus |
| Manque de mémoire (OOM) sur Series S, parcours et endurance | Mesuré | 0 | 0 |
| Gel de plus de 5 s (watchdog) | Mesuré | 0 | 0 |
| Sauvegardes corrompues, y compris en test de coupure de courant | 0 | 0 | 0 |
| Bugs bloquants ouverts (classification de T-013) | Selon T-013 | Selon T-013 | 0 |
| Checklist de pré-certification (T-012) | Démarrée | 90 % | 100 %, objectif : certification au premier passage |

---

## 11. Configurations PC et latence

### 11.1 Configurations proposées (à confirmer à M2 sur contenu réel ; publication sur les boutiques à M4)

| | Minimum (Bas, 1080p, 30 fps) | Recommandé (Élevé, 1440p, 60 fps) | Haut de gamme (Épique, 4K, 60 fps) |
|---|---|---|---|
| Processeur | 6 cœurs / 12 threads (Ryzen 5 3600, Core i5-10400) | 8 cœurs (Ryzen 7 5800X, Core i7-12700) | Ryzen 7 7800X3D, Core i7-14700 |
| Mémoire | 16 Go | 16 Go (32 Go conseillés en monde ouvert) | 32 Go |
| GPU | DirectX 12, Shader Model 6, **8 Go** : RTX 2060 Super, RTX 3050 8 Go, RX 6600, Arc A750 | RTX 4070 (12 Go), RX 7800 XT (16 Go) | RTX 4080 ou 5080, RX 7900 XTX |
| Stockage | **SSD obligatoire** | SSD NVMe | SSD NVMe |
| Système | Windows 11 64 bits ; Windows 10 non garanti (fin de support par Microsoft en octobre 2025 [Public]) | Windows 11 64 bits | Windows 11 64 bits |

### 11.2 Latence d'entrée (de l'appui sur le bouton à l'affichage, téléviseur en mode jeu) [Estimation TD, À mesurer]

| Mode | Objectif |
|---|---|
| Console, Performance 60 fps | 80 ms au plus |
| Console, Qualité 30 fps | 120 ms au plus |
| PC à 60 fps avec NVIDIA Reflex ou AMD Anti-Lag | 60 ms au plus |

Mesure à la caméra rapide sur les parcours de combat, à partir de M2.

---

## 12. Budgets d'outillage et d'itération

| Mesure | Budget | Matériel de référence |
|---|---|---|
| Compilation incrémentale (un fichier `.cpp` modifié) | 60 s au plus | Poste de développement (`ARCHITECTURE.md` §13) |
| Compilation complète de l'éditeur | 20 min au plus | Poste de développement |
| Démarrage de l'éditeur avec le DDC partagé chaud | 3 min au plus | Poste de développement |
| CI d'une pull request (compilation, tests, validation des données) | 30 min au plus | Machines de build |
| Cook et packaging nocturnes d'une plateforme | 3 h au plus | Machines de build |
| Validation du contenu d'une pull request | 10 min au plus | Machines de build |

---

## 13. Mesure et application des budgets

### 13.1 Parcours de référence

Trois types de parcours automatisés, de 3 à 5 minutes chacun, rejoués par Gauntlet :
- **Traversée** (streaming et mémoire) ;
- **Combat ou situation chargée** (CPU, IA, effets) ;
- **Panorama** (GPU, distance d'affichage, éclairage).

Ils tournent chaque nuit sur le PC de référence (proxy des consoles, indicatif seulement) puis sur les kits
dès leur arrivée. Les captures du CSV Profiler sont agrégées par PerfReportTool dans un tableau de bord.
**Alerte** dès qu'un budget est dépassé ou qu'une métrique régresse de plus de 5 % d'une nuit à l'autre.

### 13.2 Outils

`stat unit`, `stat unitgraph`, `stat gpu`, `ProfileGPU`, Unreal Insights (CPU, GPU, mémoire, chargement),
CSV Profiler, `memreport -full`, LLM, `stat streaming`, visualisations de Nanite et de Lumen, RenderDoc sur
PC, et les profileurs des constructeurs (versions consoles [NDA]).

**Validateurs de contenu** (`PrjEditor`, plugin Data Validation), bloquants en CI : taille et format des
textures, triangles des maillages hors Nanite selon leur classe, LOD présents, instructions et échantillonneurs
des matériaux, nombre de matériaux maîtres, poids des références dures des Blueprints, réglages de
compression audio, lumières projetant des ombres par cellule, nommage.

### 13.3 Responsables

| Budget | Responsable | Contributeurs |
|---|---|---|
| GPU par plateforme et par mode | graphics-programmer | technical-artist, art-director |
| Game thread et render thread | technical-director | gameplay-programmer |
| Mémoire (tableau du §6) | technical-director | tous les pôles, par catégorie |
| Textures, maillages, matériaux | art-director | technical-artist |
| Audio (voix, mémoire) | audio-director | |
| UI (temps, mémoire, polices) | ui-ux-designer | gameplay-programmer |
| Streaming | technical-director | level-designer |
| Taille d'installation et patchs | build-engineer | online-engineer |
| Temps de chargement | technical-director | platform-engineer |
| Stabilité | qa-lead | build-engineer, online-engineer |
| Outillage et itération | build-engineer | |

### 13.4 Procédure en cas de dépassement

1. Le dépassement est détecté (CI ou mesure nocturne) et un ticket est ouvert automatiquement.
2. Le responsable propose, dans le sprint, une correction ou une **réallocation** prise sur une autre ligne
   (le total ne bouge pas).
3. Le TD arbitre les réallocations entre pôles.
4. Si l'objectif de 60 fps en mode Performance ou une plateforme est menacé, la décision remonte à la Boss.
5. Les budgets sont révisés à chaque jalon ; toute révision est datée dans l'historique de ce document.

---

## 14. Variation des budgets selon le concept

Les budgets ci-dessus valent pour le concept de référence (solo, linéaire ou semi-ouvert, troisième
personne). Le **total ne change pas** : un concept plus coûteux doit **reprendre** son surcoût ailleurs.

| Variante | Game thread | GPU | Mémoire (Series S) | Streaming | Installation | Chargements |
|---|---|---|---|---|---|---|
| Coopératif en ligne | +1,0 ms (réplication), à reprendre sur l'IA et les Blueprints | Inchangé | +0,1 Go (réseau, états des autres joueurs) | Inchangé | Inchangée | Inchangés, plus le temps de connexion à une session |
| Compétitif (PvP) | +1,5 ms côté client, plus un budget serveur dédié | Inchangé | +0,15 Go | Inchangé | Inchangée | Matchmaking hors budget de chargement |
| Monde ouvert | +0,5 ms (streaming) et +1,0 ms (foules, Mass) à reprendre | +0,5 ms (distance d'affichage, HLOD) à reprendre sur la marge et le post-traitement | Gameplay et monde +0,25 Go, pris sur le pool de textures | Budgets du §7 plus tendus, vitesse de 30 m/s | Ligne « monde ouvert » du §8 | Ajout du voyage rapide |
| Première personne | Inchangé | Personnages −0,5 ms (bras à la place du corps), rendu des bras +0,3 ms | Animation −0,05 Go | Inchangé | Légèrement plus faible | Inchangés |
| Troisième personne | Base | Base (personnage principal : 1 à 1,5 ms, inclus dans « Personnages ») | Base | Base | Base | Base |

---

## 15. Sources (consultées le 2026-11-20)

- PS5 : [Gematsu, spécifications officielles](https://www.gematsu.com/2020/03/ps5-technical-specifications-announced),
  [Android Authority, stockage utilisable](https://androidauthority.com/ps5-specs-1133031).
- PS5 Pro : [Tom's Hardware, présentation de Mark Cerny](https://www.tomshardware.com/video-games/playstation/playstation-5-pro-specifications-thoroughly-explained-flopflation-debunked-by-ps5-system-architect-mark-cerny),
  [Hitmarker, annonce](https://hitmarker.net/news/sony-unveils-ps5-pro-featuring-significant-improvements-to-frame-rate-upscaling-and-ray-tracing-940091).
- Xbox Series X : [GamingBolt, 13,5 Go alloués aux jeux](https://gamingbolt.com/xbox-series-x-allocates-13-5-gb-of-memory-to-games),
  [TechRadar, spécifications](https://techradar.com/news/xbox-series-x-full-specs-revealed-just-how-powerful-is-microsofts-next-gen-console).
- Xbox Series S : [page officielle Xbox](https://www.xbox.com/en-us/consoles/xbox-series-s),
  [Windows Central, mise à jour du GDK](https://www.windowscentral.com/gaming/xbox/microsoft-game-development-kit-update-can-improve-performance-on-xbox-series-s),
  [GamesRadar, mémoire libérée](https://gamesradar.com/microsoft-frees-up-memory-on-xbox-series-s-to-improve-graphics-performance).
- Parité Series X et S : [Pure Xbox, janvier 2025](https://www.purexbox.com/news/2025/01/xbox-boss-dismisses-idea-of-removing-the-series-s-parity-clause),
  [Windows Central](https://windowscentral.com/gaming/xbox/xbox-fans-debate-whether-microsoft-should-drop-the-xbox-series-s-feature-parity-clause).
- Steam Deck : [fiche technique Valve (PDF)](https://cdn.steamstatic.com/steamdeck/images/press/techspecs/steamdeck_techspecs.pdf),
  [GamingBolt](https://gamingbolt.com/steam-deck-full-specs-revealed-features-custom-rdna-2-gpu-claims-1-6-tflops-of-power/amp).
- Pilotes NVIDIA : [Tom's Hardware, fin du support de Maxwell, Pascal et Volta](https://www.tomshardware.com/pc-components/gpu-drivers/nvidia-to-axe-maxwell-pascal-and-volta-gpus-with-end-of-driver-support-580-series-drivers-will-be-the-last-to-support-gtx-900-and-1000-cards).
- Configuration requise d'Unreal Engine : [Epic, spécifications matérielles et logicielles](https://dev.epicgames.com/documentation/unreal-engine/hardware-and-software-specifications-for-unreal-engine).
- Stutter et PSO : [Epic, précaching des PSO](https://dev.epicgames.com/documentation/unreal-engine/pso-precaching-for-unreal-engine?lang=en-US),
  [TechPowerUp, Advanced Shader Delivery dans 5.8](https://www.techpowerup.com/354139/unreal-engine-5-8-gets-advanced-shader-delivery-for-less-in-game-stuttering).

## Historique

| Version | Date | Changement |
|---|---|---|
| 1.0 | 2026-11-20 | Budgets d'allocation initiaux (T-003) |
