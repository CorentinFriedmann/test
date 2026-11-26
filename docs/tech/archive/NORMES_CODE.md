> Archivé le 2026-11-26 : version Unreal Engine 5, conservée pour un portage éventuel.

# Normes de code

| | |
|---|---|
| **Tâche** | T-003 : Choix techniques, architecture et budgets |
| **Auteur** | `technical-director` |
| **Version** | 1.0 du 2026-11-20 |
| **Statut** | Soumis à la validation de la Boss |
| **Documents liés** | [`ARCHITECTURE.md`](ARCHITECTURE.md) · [`BUDGETS.md`](BUDGETS.md) |
| **S'applique à** | Tout le code C++ et tous les Blueprints de `game/`, écrits par un humain ou par un agent IA |

Les règles marquées **[CI]** sont vérifiées automatiquement par la CI (`build-engineer`, T-011). Les autres
sont vérifiées en revue de code par le TD.

---

## 1. Références

1. **Unreal Engine Coding Standard** d'Epic (documentation officielle, version correspondant à notre moteur) :
   il s'applique intégralement, sauf là où ce document est plus strict.
2. Ce document : règles propres au projet, interdits, revue, tests.
3. `ARCHITECTURE.md` : découpage en modules, dépendances autorisées, frontière C++ / Blueprints.
4. `BUDGETS.md` : budgets de temps de frame et de mémoire que le code doit respecter.

En cas de contradiction, l'ordre de priorité est : ce document, puis l'Unreal Coding Standard.

---

## 2. Langue, version du C++ et formatage

| Règle | Détail |
|---|---|
| Langue du code | Anglais : identifiants, commentaires dans le code, messages de log |
| Langue de la documentation | Français : `docs/`, README des modules, descriptions des pull requests |
| Version du C++ | Celle par défaut du moteur (C++20 depuis UE 5.3) ; pas de `CppStandard` modifié sans accord du TD |
| Formatage | Fichier `.clang-format` aligné sur le style d'Epic, fourni par T-011 [CI] : tabulations, accolades sur leur propre ligne |
| Encodage | UTF-8 ; fins de ligne normalisées par `.gitattributes` |
| Longueur des fonctions | Indicatif : une fonction de plus de 60 lignes est justifiée en revue ou découpée |

---

## 3. Nommage

### 3.1 Code C++

| Élément | Règle | Exemple |
|---|---|---|
| Préfixes d'Unreal | `A` acteurs, `U` objets, `F` structures, `E` énumérations, `I` interfaces, `T` modèles, `S` widgets Slate, `b` booléens | `APrjCharacter`, `bIsAiming` |
| Préfixe du projet | `Prj` (nom de code provisoire, `ARCHITECTURE.md` §4.1) après le préfixe d'Unreal, pour toutes les classes et structures du projet | `UPrjAbilitySystemComponent`, `FPrjSaveHeader` |
| Fichiers | Nom de la classe sans le préfixe d'Unreal | `PrjCharacter.h`, `PrjCharacter.cpp` |
| Énumérations | `enum class` avec `UENUM`, type sous-jacent `uint8` | `enum class EPrjInteractionState : uint8` |
| Fonctions, variables | PascalCase, verbes pour les fonctions | `StartInteraction()`, `CurrentStamina` |
| Paramètres de sortie | Préfixe `Out` | `bool TryGetTarget(AActor*& OutTarget)` |
| Catégories de log | `LogPrj<Module>` ou `LogPrj<Système>` | `LogPrjSave`, `LogPrjAI` |
| Variables de console | `prj.<système>.<nom>`, en minuscules | `prj.ai.maxactiveagents` |
| Gameplay Tags | Hiérarchie fixe, en PascalCase | voir 3.2 |
| Modules | `Prj<Domaine>` | `PrjGameplay` |

### 3.2 Hiérarchie des Gameplay Tags

| Racine | Usage | Exemple |
|---|---|---|
| `Ability.` | Identifiants de capacités | `Ability.Combat.Dodge` |
| `State.` | États portés par un acteur | `State.Stunned` |
| `Event.` | Événements de gameplay | `Event.Damage.Received` |
| `Input.` | Actions d'entrée liées aux capacités | `Input.Action.Interact` |
| `Cue.` | Gameplay Cues (effets cosmétiques) | `Cue.Impact.Metal` |
| `Data.` | Clés de données (SetByCaller) | `Data.Damage.Base` |
| `UI.` | Couches et états de l'interface | `UI.Layer.Menu` |

Les tags utilisés par le C++ sont déclarés en natif (`UE_DECLARE_GAMEPLAY_TAG_EXTERN` et
`UE_DEFINE_GAMEPLAY_TAG`) ; les autres sont dans `Config/Tags/`. Créer une nouvelle racine demande l'accord
du TD.

### 3.3 Assets liés au code

Le nommage complet des assets est fixé par la bible artistique (`docs/art/NOMMAGE_ASSETS.md`, T-007). Les
préfixes des assets qui portent de la logique sont fixés ici pour éviter les conflits :

| Préfixe | Type |
|---|---|
| `BP_` | Blueprint d'acteur ou de composant |
| `WBP_` | Widget Blueprint |
| `ABP_` | Animation Blueprint |
| `GA_`, `GE_`, `GC_` | Gameplay Ability, Gameplay Effect, Gameplay Cue |
| `DA_`, `DT_`, `CT_` | DataAsset, DataTable, CurveTable |
| `ST_` | StateTree |
| `IMC_`, `IA_` | Input Mapping Context, Input Action |
| `GF_` | Game Feature plugin |

---

## 4. Structure du code C++

### 4.1 En-têtes et dépendances

- Les en-têtes publics d'un module (`Public/`) ne contiennent que ce que les autres modules doivent voir ;
  tout le reste va dans `Private/`.
- **Include What You Use** : chaque fichier inclut ce qu'il utilise ; déclarations anticipées dans les
  en-têtes dès que possible. Les en-têtes générés (`*.generated.h`) sont toujours inclus en dernier.
- Dépendances entre modules : seulement celles autorisées par `ARCHITECTURE.md` §4.2 [CI].
- Pas de `using namespace` dans un en-tête. Le code du projet hors classes Unreal est dans le namespace `Prj`.

### 4.2 Réflexion et exposition (`UPROPERTY`, `UFUNCTION`)

| Règle | Détail |
|---|---|
| Pointeurs vers des `UObject` membres | `TObjectPtr<>` avec `UPROPERTY()` ; sinon `TWeakObjectPtr<>`. Jamais de pointeur brut non suivi par le ramasse-miettes |
| Références vers des assets | `TSoftObjectPtr<>` ou `TSoftClassPtr<>` par défaut ; une référence dure doit être justifiée (asset léger et toujours nécessaire) |
| Édition | `EditDefaultsOnly` par défaut ; `EditAnywhere` seulement si la valeur doit varier par instance dans un niveau |
| Accès Blueprint | `BlueprintReadOnly` par défaut ; `BlueprintReadWrite` seulement si le Blueprint doit modifier la valeur |
| Catégorie | `Category = "Prj|<Système>"` obligatoire sur toute propriété ou fonction exposée |
| Fonctions | `BlueprintCallable` pour les actions ; `BlueprintPure` seulement pour les calculs triviaux et sans effet de bord (une fonction pure est réévaluée à chaque connexion de sa sortie) |
| Points d'extension | `BlueprintImplementableEvent` (sans code C++) ou `BlueprintNativeEvent` (avec comportement par défaut) |
| Méta-données | `ClampMin` et `ClampMax` sur les valeurs numériques éditables ; `ToolTip` sur tout ce que voit un designer |

### 4.3 Classes et objets

- Une classe, une responsabilité. Les comportements réutilisables sont des composants, pas des héritages
  profonds : **3 niveaux d'héritage au plus** sous une classe du moteur.
- Les services globaux sont des **sous-systèmes** (`UGameInstanceSubsystem`, `UWorldSubsystem`,
  `ULocalPlayerSubsystem`). Pas de singleton maison, pas de variable globale mutable.
- `const` partout où c'est possible : méthodes, paramètres passés par référence, variables locales.
- Les énumérations et valeurs « magiques » sont nommées ; les valeurs d'équilibrage viennent des données
  (`ARCHITECTURE.md` §5.1).
- Les textes visibles par le joueur sont des `FText` venant de String Tables. Jamais de `FString` littérale
  affichée au joueur.

---

## 5. Interdits

Chaque interdit a une alternative. Une exception passe par la procédure de dérogation (§15).

| # | Interdit | Pourquoi | À faire à la place |
|---|---|---|---|
| I-01 | **Tick activé par défaut** (`PrimaryActorTick.bCanEverTick = true` sans justification, Event Tick en Blueprint) | Coût cumulé sur des centaines d'objets, cause n° 1 des dépassements du game thread | Tick désactivé par défaut [CI] ; événements, timers, délégués ; mise à jour groupée par un sous-système ; `TickInterval` et Significance Manager si un tick est indispensable |
| I-02 | **Chargement synchrone en jeu** : `LoadSynchronous()`, `LoadObject()`, `StaticLoadObject()`, `TryLoad()`, `FlushAsyncLoading()` | Hitch garanti, parfois de plusieurs centaines de ms sur console | Asset Manager (bundles), `FStreamableManager::RequestAsyncLoad`, préchargement pendant les transitions. Autorisé seulement dans l'éditeur, les commandlets et les écrans de chargement [CI : détection à l'exécution sur les parcours] |
| I-03 | **Cast coûteux ou recherche dans une boucle ou à chaque frame** : `Cast<>` répétés, `GetAllActorsOfClass`, `GetAllActorsWithTag`, `FindComponentByClass`, `GetComponents` | Parcours de tout le monde ou de la hiérarchie à chaque appel | Mettre en cache à l'initialisation ; registres tenus par des sous-systèmes ; interfaces ; Gameplay Tags |
| I-04 | **Références dures vers des assets lourds** (Blueprints, `ConstructorHelpers::FObjectFinder` pour du contenu) | Chaînes de chargement qui gonflent la mémoire et les temps de chargement | `TSoftObjectPtr`, références configurées dans des DataAssets ; budget de références dures (`BUDGETS.md` §5.3) [CI : validateur] |
| I-05 | **Pointeur brut vers un `UObject`** stocké dans un membre sans `UPROPERTY()` | Pointeur invalide après un passage du ramasse-miettes, crash aléatoire | `TObjectPtr` avec `UPROPERTY()`, `TWeakObjectPtr`, `TStrongObjectPtr` hors des `UObject` |
| I-06 | `new` et `delete` sur des `UObject` | Contourne le cycle de vie du moteur | `NewObject<>`, `SpawnActor<>`, `CreateDefaultSubobject<>` |
| I-07 | **Code propre à une plateforme hors de `PrjPlatform`** (`#if PLATFORM_...`, appels aux API d'un constructeur) | Bloque les portages, viole l'architecture | Interfaces de `PrjPlatform` (`ARCHITECTURE.md` §10) [CI] |
| I-08 | **Entrées et sorties bloquantes** sur le game thread (fichiers, réseau) | Gel du jeu ; non conforme aux exigences des plateformes | API asynchrones, tâches de fond, `AsyncSaveGameToSlot` via `PrjPlatform` |
| I-09 | **Valeurs d'équilibrage en dur** | Empêche les designers d'itérer, source d'incohérences | DataTables, CurveTables, DataAssets |
| I-10 | **Logique systémique dans le Level Blueprint** | Non réutilisable, non testable, conflits de fichiers | Acteurs dédiés, composants, StateTree |
| I-11 | Allocations et manipulation de chaînes dans du code exécuté à chaque frame : `FString` formatées, `FName` créés depuis une chaîne, `TArray` sans `Reserve()` | Allocations et coût CPU invisibles | `FName` et `FGameplayTag` précalculés, `TInlineAllocator`, `Reserve()`, buffers réutilisés |
| I-12 | Lambdas de timers ou de délégués qui capturent `this` sans protection | Appel sur un objet détruit, crash | `CreateUObject`, `CreateWeakLambda`, vérification de validité |
| I-13 | `UE_DISABLE_OPTIMIZATION` et assimilés commités | Code non optimisé livré par accident | Uniquement en local [CI] |
| I-14 | Activer les exceptions C++ ou le RTTI | Désactivés par défaut dans Unreal ; coût en taille de binaire et en performance ; contraires au standard d'Epic | Codes de retour, `TOptional`, `TValueOrError` ; `Cast<>` pour les `UObject` |
| I-15 | Conteneurs de la bibliothèque standard dans le code de jeu (`std::vector`, `std::map`, `std::string`) | Incompatibles avec la réflexion, le ramasse-miettes et le suivi mémoire LLM | `TArray`, `TMap`, `TSet`, `FString`. Exceptions admises par le standard d'Epic (par exemple `<atomic>`, traits de types) |
| I-16 | **Fonctionnalité expérimentale du moteur** activée dans le jeu livré | Instabilité, absence de support | Dérogation du TD obligatoire (`ARCHITECTURE.md` §6.1) |
| I-17 | **Modification du moteur** sans ticket ni marqueur `PRJ_ENGINE_MOD` | Montées de version impossibles à maîtriser | Ticket, marqueur, inscription au registre `docs/tech/ENGINE_MODS.md` |
| I-18 | Code ou plugin tiers sans entrée dans `docs/legal/LICENCES.md` | Risque juridique pour la vente | Liste blanche (`ARCHITECTURE.md` §6.3) et licence consignée |
| I-19 | `GEngine->AddOnScreenDebugMessage`, commandes de triche ou outils de débogage hors de `#if !UE_BUILD_SHIPPING` | Fuite de fonctions de débogage dans le jeu livré | Garde de compilation, catégories de log |
| I-20 | Effets de bord dans `check()`, `ensure()` ou `verify()` mal choisi | `check()` est retiré en Shipping : le code disparaît | Effets de bord hors de l'assertion ; `verify()` si l'expression doit toujours s'exécuter |

---

## 6. Blueprints

| Règle | Détail |
|---|---|
| Rôle | Contenu, réglages, scénarisation, partie cosmétique, mise en page de l'UI (`ARCHITECTURE.md` §5) |
| Tick | Interdit sans dérogation (I-01) |
| Taille des graphes | Une fonction ou un événement tient sur un écran ; au-delà, découper en fonctions. Commentaires de section obligatoires |
| Boucles | Pas de boucle de plus de 100 itérations ; au-delà, le code passe en C++ |
| Références | Références souples pour les assets lourds (I-04) ; budget de références dures vérifié par validateur [CI] |
| Compilation | Aucun avertissement ni erreur de compilation Blueprint [CI] |
| Variables | Privées par défaut ; catégorie et info-bulle sur toute variable éditable |
| Migration vers le C++ | Prototype de plus de deux sprints, coût de plus de 0,1 ms par frame, réutilisation par plus de trois assets, ou état persistant (`ARCHITECTURE.md` §5) |
| Animation Blueprints | Mise à jour thread-safe (`BlueprintThreadSafeUpdateAnimation`) et accès aux propriétés (Property Access) ; pas de logique de gameplay dans le graphe d'animation |
| Widgets | Aucune logique métier ; lecture de l'état par ViewModels ou par des fonctions C++ ; pas de bindings de propriétés évalués à chaque frame |

---

## 7. Performance et mémoire

- **Respecter les budgets de `BUDGETS.md`.** Une pull request qui fait dépasser un budget mesuré en CI est
  refusée, sauf réallocation acceptée par le TD.
- **Instrumentation** : tout système non trivial a des marqueurs de profilage (`TRACE_CPUPROFILER_EVENT_SCOPE`,
  `CSV_SCOPED_TIMING_STAT`) et un tag mémoire LLM (`LLM_SCOPE_BYTAG`) correspondant à sa ligne du tableau
  de `BUDGETS.md` §6.
- **Mesurer avant d'optimiser** : toute optimisation présentée en revue est accompagnée d'une mesure avant et
  après (Unreal Insights, `stat unit`, CSV Profiler), avec la plateforme et le parcours utilisés.
- **Objets nombreux** : mis à jour par un sous-système en une boucle compacte ; données contiguës ; pas un
  acteur par élément si un composant d'instances ou Mass suffit.
- **Réutilisation** : pools pour les objets créés et détruits fréquemment (projectiles, effets, widgets de liste).
- **Ramasse-miettes** : éviter de créer des `UObject` temporaires ; préférer des structures (`USTRUCT`).
- **Valeurs par plateforme** : jamais de `if` sur la plateforme dans le code ; réglages par Device Profiles et
  variables de console de scalabilité.

---

## 8. Multithread

- Les `UObject` ne sont manipulés que sur le game thread, sauf API explicitement documentée comme sûre.
- Les tâches parallèles utilisent `UE::Tasks` ou le Task Graph ; pas de création de threads bruts sans accord
  du TD.
- Aucun verrou tenu plus de quelques microsecondes sur le game thread ; préférer les files sans verrou et
  les échanges de messages.
- Toute donnée partagée entre threads est documentée en commentaire : qui écrit, qui lit, quelle
  synchronisation.

---

## 9. Réseau (seulement si le concept est multijoueur)

- Le serveur fait autorité. Toute RPC venant d'un client est validée.
- La réplication est pensée dès la conception de la classe : propriétés répliquées avec conditions,
  `GetLifetimeReplicatedProps`, fréquence de mise à jour adaptée.
- Le Gameplay Ability System est utilisé en mode répliqué adapté (minimal pour les PNJ, mixte pour les joueurs).
- Budgets de bande passante fixés par `online-engineer` (T-018) et vérifiés par des tests avec latence et
  perte de paquets simulées.

---

## 10. Journalisation, assertions et diagnostics

| Outil | Usage |
|---|---|
| `UE_LOG` avec une catégorie du projet | Verbosité adaptée : `Error` pour un état anormal, `Warning` pour un état récupérable, `Log` pour les étapes importantes, `Verbose` pour le détail. Pas de log à chaque frame en dehors de `Verbose` |
| `check()` | Erreur de programmation qui ne doit jamais arriver ; retiré en Shipping |
| `ensure()` | Situation anormale mais récupérable : le jeu continue, un rapport est produit une fois |
| `verify()` | Comme `check()`, mais l'expression s'exécute toujours |
| Contexte de crash | Le module `PrjOnline` ajoute le contexte de jeu (niveau, quête, version du build) au rapport de crash, sans donnée personnelle |
| Symboles | Archivés pour chaque build distribué (`build-engineer`, T-011) |

---

## 11. Tests

### 11.1 Types de tests

| Type | Outil | Ce qui est testé | Quand |
|---|---|---|---|
| Tests unitaires de logique | Automation Spec (`BEGIN_DEFINE_SPEC`) ou Low Level Tests | Règles d'un système : calculs, transitions d'état, sérialisation | À chaque pull request [CI] |
| Tests fonctionnels | `AFunctionalTest` dans des cartes de test (`Content/Tests/`) | Comportement en jeu : capacité qui inflige les bons dégâts, interaction, sauvegarde et rechargement | À chaque pull request pour les tests rapides, chaque nuit pour les autres [CI] |
| Tests de démarrage et de fumée | Gauntlet | Le build packagé démarre, charge chaque carte, atteint le jeu | Chaque nuit, chaque plateforme disponible [CI] |
| Tests de performance | Gauntlet et parcours de référence | Budgets de `BUDGETS.md` | Chaque nuit [CI] |
| Tests d'endurance | Gauntlet | Stabilité et croissance mémoire (`BUDGETS.md` §10) | Chaque nuit à partir de l'Alpha |
| Tests de migration de sauvegarde | Automation | Chargement des sauvegardes de chaque version publiée | À chaque pull request touchant la sauvegarde [CI] |
| Validation des données | Data Validation, import des CSV | Budgets de contenu, cohérence des données | À chaque pull request [CI] |

La stratégie de test complète (playtests, régression, pré-certification) est définie par `qa-lead` (T-013).

### 11.2 Règles

- **Chaque système de gameplay a des tests** sur ses règles avant d'être considéré comme terminé.
- **Chaque bug corrigé** reçoit un test de non-régression quand c'est techniquement possible.
- Les tests sont déterministes : pas de dépendance à l'heure, à l'aléatoire non initialisé ou à l'ordre
  d'exécution.
- Les tests portent le nom du système : `Prj.<Module>.<Système>.<Cas>` (par exemple
  `Prj.Gameplay.Stamina.DrainsWhileSprinting`).
- Un test instable est corrigé ou désactivé dans la journée, avec un ticket ; jamais ignoré en silence.

---

## 12. Revue de code

### 12.1 Circuit

1. Toute modification passe par une **pull request** ; la branche principale est protégée.
2. La **CI doit être verte** : compilation de toutes les configurations (Development, Test, Shipping) pour
   Win64, et pour Linux et les consoles quand elles existent, tests, validation des données, analyse
   statique (`-StaticAnalyzer` d'UnrealBuildTool) [CI].
3. **Revue de pôle par le TD**, ligne à ligne, avant la Boss (rôle du TD, `studio/WORKFLOW.md` étape 3). Le
   résultat figure dans le rapport de remise : « **Revue TD : OK** » ou une **liste numérotée de corrections
   exigées**.
4. Deux approbations pour les modules `PrjCore`, `PrjPlatform`, `PrjOnline`, pour la sauvegarde et pour
   toute modification du moteur : le TD et un autre programmeur.

### 12.2 Taille et contenu d'une pull request

- Petite et ciblée : idéalement moins de 400 lignes modifiées ; une pull request de refactorisation ne
  change pas de comportement.
- Description en français : ID de la tâche (`T-XXX`), ce qui change, comment c'est testé, **ce qui a été
  compilé et exécuté, et sur quelle machine**.

### 12.3 Code produit par un agent IA

Les agents IA travaillent dans un environnement sans Unreal Engine. Leur code suit **exactement les mêmes
règles**, avec trois obligations de plus :
1. la remise indique explicitement « **compilé et testé** » ou « **écrit, non compilé** » ;
2. **aucune « Revue TD : OK » n'est donnée à du code non compilé** : la revue reste alors « en attente de
   compilation », même si le code paraît correct à la lecture ;
3. aucune API du moteur n'est utilisée sans avoir été vérifiée dans les sources ou la documentation de la
   version du moteur retenue.

### 12.4 Grille de relecture du TD

| Point | Question |
|---|---|
| Architecture | Le code est-il dans le bon module ? Les dépendances sont-elles autorisées ? |
| Interdits | Un des interdits du §5 est-il présent ? |
| Performance | Coût par frame ? Tick, allocations, recherches, chargements ? Mesure fournie si le code est critique ? |
| Mémoire | Références dures, tags LLM, objets temporaires ? |
| Robustesse | Pointeurs vérifiés, cas limites, comportement en cas d'échec (réseau, sauvegarde, asset absent) ? |
| Plateformes | Rien de propre à une plateforme hors de `PrjPlatform` ? Suspension et reprise, changement d'utilisateur gérés si concernés ? |
| Données | Valeurs d'équilibrage dans les données ? Textes en `FText` ? |
| Tests | Tests présents, pertinents, déterministes ? |
| Lisibilité | Nommage, commentaires sur le pourquoi, taille des fonctions ? |
| Exposition | Blueprint : le minimum nécessaire, catégories, info-bulles ? |

---

## 13. Flux de travail Git

| Règle | Détail |
|---|---|
| Modèle de branches | Développement sur le tronc (`main`) avec des branches de fonctionnalité courtes (quelques jours au plus) ; branches de release à partir de l'Alpha |
| Nommage des branches | `<type>/T-XXX-description-courte` : `feature/`, `fix/`, `tech/` |
| Messages de commit | En français, préfixés par l'ID de la tâche : `T-042 : ajoute la régénération d'endurance` |
| Binaires | **Verrou Git LFS avant toute modification** d'un `.uasset` ou d'un `.umap`, libéré après la fusion (`ARCHITECTURE.md` §8.2) |
| Interdits | Pousser directement sur `main` ; réécrire l'historique partagé (`push --force`) ; commiter des binaires hors LFS, des secrets, des fichiers générés (`Binaries/`, `Intermediate/`, `Saved/`, `DerivedDataCache/`) [CI] |
| Code sous NDA | Seulement dans le dépôt plateformes à accès restreint (`ARCHITECTURE.md` §8.4) |
| Tags | Un tag par jalon et par build distribué |

---

## 14. Documentation

- Chaque module a un `README.md` en français : rôle, dépendances, points d'entrée, comment le tester.
- Les API publiques ont un commentaire de documentation : ce que fait la fonction, ses paramètres, ses
  conditions d'appel (thread, phase du jeu).
- Les commentaires expliquent **pourquoi**, pas ce que le code fait déjà lisiblement.
- Toute décision d'architecture nouvelle ou modifiée fait l'objet d'une entrée `ADR-XX` dans
  `ARCHITECTURE.md` §1, avec sa justification.

---

## 15. Dérogations

Une règle de ce document peut être levée ponctuellement :
1. la demande est écrite dans la pull request : règle concernée, raison, mesure à l'appui, durée ;
2. le TD accepte ou refuse par écrit dans la revue ;
3. le code concerné porte un commentaire `// PRJ_EXCEPTION(<règle>, <tâche>) : <raison>` ;
4. les dérogations sont relues à chaque jalon ; celles qui n'ont plus de raison d'être sont supprimées.

Les dérogations aux budgets suivent la procédure de `BUDGETS.md` §13.4.
