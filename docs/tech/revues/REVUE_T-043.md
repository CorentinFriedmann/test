# Revue de pôle T-043 : code de `game/` (technical-director)

> Date : 2026-11-27. Revue ciblée (mode économe), avant la Boss. Sources : `git diff` / `git status` (61 fichiers), `docs/design/P2_CORRECTIONS.md`,
> `docs/tech/revues/REMISE_T-043.md`, `production/DECISIONS.md`. Je ne rends pas de verdict de validation : c'est le rôle de la Boss.

## Avis final : FAVORABLE AVEC RÉSERVES

Aucun point bloquant. Les réserves ci-dessous sont à consigner ; aucune n'empêche de soumettre la tâche à la Boss.

## Vérifications faites

| Contrôle | Résultat |
|---|---|
| `git diff -- game/src/sim` | vide (confirmé) ; seules les valeurs CSV changent |
| `cd game && npm run all` (exécuté par moi, code de sortie 0) | **vert** : Node unitaires 113/113, `tests/p2` 19/19, e2e p2 / run / render / audio / guidance tous sans échec (181 lignes PASS, aucune ligne FAIL ; guidage : « ALL 58 GUIDANCE E2E CHECKS PASSED »), ESLint sans erreur |
| Poids de `game/dist/estran-p2.html` | **687 299 octets (671 Kio, 0,66 Mio)**, seuil 1,5 Mio : tenu (large marge) |
| `playwright install` | non lancé |
| Tests désactivés (`skip`, `.only`, `todo`) dans le diff | aucun |

## 1. Pureté et séparation : conforme

- `game/src/ui/guidance.js` : seul import `param` (données). Aucun `document`, `window`, `Date`, `performance`, `Math.random` (grep). Aucune référence à `state.threat` ni à la Laisse dans les entrées ou les sorties de `guidance()` ; la seule mention est le texte de fin « Quelque chose vous a saisi… », qui ne nomme pas la créature. Le `memo` (`lastReadT`) est tenu par l'appelant (`main.js`), donc la fonction reste pure. `createTips` a un état interne mais aucun accès au temps réel : il suit `state.t` et se réinitialise si `t` recule.
- `game/src/render/threat-cues.js` : pur (nombres en entrée, nombres en sortie, objet de sortie réutilisé : pas d'allocation par frame). Les noms de modes (`roam`, `inquire`, `hunt`, `flee`, `bank_wait`, `dormant`) correspondent à `MODES` de `src/sim/threat.js`.
- Rendu en lecture seule : `view.project`, `addThreatRing`, `setThreatVignette`, `threatCueInfo`, `probeVignette` ne lisent que `st` et n'écrivent que dans des objets de rendu (anneaux, uniform). Les anneaux de la Laisse ont leur propre réserve (indices 8 à 11), donc ils ne volent pas un anneau de pas. Pas de matériau ni de lumière créé en cours de partie ; la vignette est un uniform du passe plein écran existant (pas de recompilation). Le test de parité e2e (`render.cjs`) reste vert.
- La Laisse ne fuit pas dans le guidage : la cible du repère est toujours une échelle ou le phare. Le calcul de la cible n'utilise que `state.stations`, `state.t`, `state.readCount` et `world`.

## 2. Démarrage audio : conforme

- `intro.addEventListener('click', () => { audio.start(); resume(); … })` : l'`AudioContext` est créé et repris dans le gestionnaire de clic (`src/main.js` ligne 102, `src/audio/index.js` `start()`), avec `tryResume()` immédiat puis le son de test (440 puis 330 Hz, crête 0,25 = −12 dBFS, passe par le bus, le plafond et le volume).
- Bandeau d'erreur : `verify()` (`index.js` ligne 48) reprend à 0,5 s et 1 s, déclare l'échec à 1,5 s si le contexte n'est pas `running`, ignoré pendant une pause volontaire (`intentional`), invalidé par un jeton si un nouvel appel à `verify()` survient. Perte de contexte hors pause couverte par `statechange`. Cas « pas d'`AudioContext` » et « constructeur qui lève » couverts (`unsupported`).
- Nœuds : les oscillateurs du carillon se déconnectent à `onended` ; pas de fuite de nœuds constatée. Les minuteries de `verify()` sont à durée de vie bornée (1,5 s) et sont neutralisées par le jeton.

## 3. Tests : intention conservée

- `threat`, `render`, `run` : « 0 saisie » devient « jamais deux saisies, victoire » (`grabs <= 1` avec victoire). L'intention (le prudent gagne) est conservée ; on perd la propriété « zéro saisie sur la graine 2026 », dont la perte est cohérente avec la mesure déclarée (9 saisies de `prudent` sur 20 parties, lot 101-120). Le test `noisy` passe de « exactement deux saisies » à « les deux dernières saisies à moins de 45 s, sans compter les saisies isolées antérieures » : même intention (la deuxième saisie en moins de 45 s est la défaite).
- Recalage à 300 s (`tide`, `sim`, `island`, `threat`, `discrimination`) : les valeurs suivent la formule de contrôle et les nouvelles fenêtres ; les seuils restent exigeants (`prudent` ≥ 90 %, `noisy` ≥ 90 %, durée 240-360 s, fenêtre de peur 100 s, approche de `prudent` ≥ 14/20). Le seuil `win` / `heedless` passe de « ≤ 50 % » à « ≤ 16/20 » : c'est un assouplissement réel, déclaré et justifié (voir réserve R2).
- `audio-engine.test.js` : les 39 lignes retirées sont le faux contexte audio, déplacé tel quel dans `tests/unit/fake-audio.js` (contrôle fait par différence) ; aucun test vidé.
- Ajouts : `guidance.test.js`, `threat-cues.test.js`, `audio-start.test.js`, `slow-start.test.js`, `e2e/guidance.cjs` : 132 tests Node contre 99 avant, e2e en hausse. Les critères d'acceptation e2e (objectif et invite près d'une échelle, contexte `running` après un vrai clic, indicateur qui suit M, sous-titres actifs par défaut, écran de fin avec sa raison) sont présents.

## 4. Écarts à la spécification

- **S1 à 38-72 s et profondeur max 1,10 m** : acceptable techniquement. 1,10 m est exactement la borne haute de la bande `eau_profonde` de `maree_effets.csv` (pas de noyade avant 1,40 m), donc la lecture ne se fait jamais en submersion. Mesuré : 20/20 aux départs à 30 s et 45 s sur les deux lots, dernière lecture au pire à 70,6 s. Donnée seulement, aucun code de simulation. **À transmettre au designer** pour qu'il mette à jour `docs/design/P2_CORRECTIONS.md` (la spécification dit encore 38/68 et 1,00).
- **Ligne d'action à 26 % du bas** (spec : 22 %) : acceptable, purement présentation. Justifiée par le test de non-recouvrement à 1280×720 et 1920×1080 (vert). Sous-titres à 6 %, toast descendu à 150 px : cohérents.
- `guidance` dans `src/ui/guidance.js` plutôt que `hud-model.js` : meilleur découpage, acceptable.

## Points bloquants

Aucun.

## Réserves non bloquantes

- **R1 : écarts de seuil à ne pas laisser dériver (exigence (a))**. `win` et `heedless` sont **exactement au plafond (16/20)** sur le lot 101-120. Le seuil est tenu mais sans marge : toute retouche future de donnée peut le casser. La cause de la hausse de la victoire des automates « honnêtes » (6-9/20 avant, 12-16/20 maintenant) n'est pas isolée. Acceptable pour un essai, à garder en tête pour la suite (leviers de T-037 cités dans la spécification).
- **R2 : tests assouplis de la scène Laisse**. `threat.test.js` utilise une marée aplatie à 0,50 m entre 50 et 190 s (`FLAT`, ligne 35) pour les scénarios d'arène ; `e2e/run.cjs` (ligne 63) passe le scénario de noyade en `?threat=0` parce que, sur la marée de 300 s, la Laisse saisit le joueur qui patauge avant la noyade. Les deux sont déclarés et gardent l'intention du test (mécanique isolée), mais ils signifient que la partie réelle est plus dure au gué qu'avant ; à surveiller à l'essai.
- **R3 : nouvel essai de son sur chaque touche**. `src/main.js` ligne 103 : tant que `failure === 'context'`, chaque `keydown` (répétition de touche comprise) rappelle `audio.start()` et donc `verify()` (trois minuteries de ≤ 1,5 s chacune). Borné et invalidé par le jeton, sans fuite durable, mais inutilement bavard ; on pourrait limiter à une tentative par seconde. Sans effet sur le jeu.
- **R4 : commentaire périmé**. `src/ui/hud.js` ligne 11 mentionne `HIDE_NEAR_LH_M`, constante qui n'existe pas (le phare utilise `world.plateauRadius + 2`). Corriger le commentaire.
- **R5 : choix d'écriture**. `docs/tech/NORMES_CODE.md` demande de ne pas allouer dans la boucle de jeu : `guidance()` alloue un objet et trois tableaux à chaque tick de simulation (30 Hz) et `placeMarker` n'alloue pas ; c'est tolérable (DOM seulement, hors `sim/`), mesuré dans le budget de frame par les e2e, mais à surveiller sur matériel réel.
- **R6 : limites déjà déclarées par le programmeur, que je confirme** : le son n'est pas vérifié dans la page publiée sur claude.ai (iframe, politique de lecture automatique) : à vérifier à la publication ; l'audibilité réelle n'est pas mesurée (seulement les nœuds et le plan de lecture) ; rendu mesuré en SwiftShader seulement ; sous-titres des captures injectés dans le DOM (pas une vraie partie) ; densité du guidage et creux entre S2 et S3 à juger à l'essai. GDD §6.3 (anneaux à moins de 25 m) à mettre à jour par le designer après l'essai.

## Ce qui est vérifié et ce qui ne l'est pas

Vérifié : construction, tests unitaires et e2e (navigateur sans interface, rendu logiciel), poids, absence de modification de `src/sim`, lecture ligne à ligne de `guidance.js`, `threat-cues.js`, `audio/index.js`, `audio/engine.js` (carillon), `main.js`, `hud.js` (partie repère) et des diffs de tests. Non vérifié : son réel dans un navigateur avec haut-parleurs, page publiée, matériel réel, perception humaine de la menace et du guidage. Les captures de `game/captures/` n'ont pas été relues image par image dans cette revue (leur existence et le test de non-recouvrement automatique sont confirmés).
