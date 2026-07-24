## Objectif

Reproduire à l'identique la **logique métier et l'architecture** du fichier `indexdraveil.html` (5 233 lignes, ~50 fonctions, 5 écrans, générateurs de séances, Supabase, timer, VMA, PPP…) dans l'app React actuelle, en habillant le tout avec le nouveau design premium (glassmorphism vert Draveil, cartes arrondies, Framer Motion, nav flottante).

Zéro fonctionnalité perdue, zéro logique réinventée : je transpose le JS vanilla ligne pour ligne, seule la couche de présentation change.

## Architecture cible (miroir du HTML)

```text
HTML original                 →  Route React
────────────────────────────────────────────────
screen-landing                →  /                    (déjà fait ✓)
screen-onboarding (7 slides)  →  /inscription         (à compléter — actuellement 1 seule étape)
screen-waiting                →  /attente
screen-joueur (5 onglets)     →  /joueur/*            (structure ✓, contenu à porter)
screen-coach  (7 onglets)     →  /coach/*             (structure ✓, contenu à porter)
```

## Modules de logique métier à extraire (fichiers purs, testables)

```text
src/lib/draveil/
├── vma.ts            → LUC_LEGER, vmaFromPalier, getAllures, kmhToMinKm,
│                       getGroupe, getNiveau, getIMC, getProfilAdapt
├── phases.ts         → getPhaseActuelle, getPhase2Week, getPhase3Week,
│                       _sessionDatesFrom, getSessionDatesIndiv/Collectif
├── sessions.ts       → genIndivCardio, genIndivRenfo, genIndivRecup,
│                       genPhase2IndivSessions, genSessionA/B/C,
│                       genPhase2Sessions, genPhase3Sessions, getSeanceDuJour
├── ppp.ts            → getPPP_niveaux, getPPP_niveauxIndiv, renderPPPDetail
├── exos.ts           → EXOS[], getExoDetail, catalogue de ~50 exercices
├── stats.ts          → getStats(joueur), calculs de progression
└── supabase.ts       → sbGetJoueurs, sbGetJoueur, sbSaveJoueur,
                        sbGetMeta, sbSaveMeta  (déjà partiellement fait)
```

Ces fichiers reprennent le code JS **verbatim** (converti en TS), sans refonte.

## Composants UI premium (habillage)

```text
src/components/draveil/
├── glass-card.tsx           ✓
├── logo.tsx                 ✓
├── bottom-nav.tsx           → nav flottante 5 onglets (joueur) / 7 (coach)
├── session-card.tsx         → carte séance avec bloc échauffement/corps/retour
├── timer-modal.tsx          → port de openTimerModal + startInlineTimer + beep
├── ppp-block.tsx            → renderBloc, renderTags, togglePPP
├── stat-ring.tsx            → anneau de progression (Framer Motion)
├── welcome-slides.tsx       ✓ (à brancher sur checkShowWelcome)
└── install-prompt.tsx       → setupInstallPrompt PWA
```

## Livraison par phases (validation entre chaque)

- **Phase A — Fondations logique (0 UI)** : extraire `vma.ts`, `phases.ts`, `exos.ts`, `sessions.ts`, `ppp.ts`, `stats.ts`, `supabase.ts` complet. Vérifier avec quelques tests console que `genPhase2IndivSessions(0, joueur)` produit le même JSON qu'en HTML.
- **Phase B — Onboarding complet** : les 7 slides du HTML (`screen-onboarding`) portés dans `/inscription` avec Framer Motion. Écran `/attente` pour statut `attente`.
- **Phase C — Espace joueur** : les 5 onglets (Accueil, Programme, Séance du jour, Stats, Profil) avec vraies séances générées, timer, validation, allures VMA.
- **Phase D — Espace coach** : les 7 onglets (Dashboard, Semaine, Planning, Séances, Programme, Biblio, Message) avec listes joueurs, validation, saisie VMA/palier, envoi messages.
- **Phase E — Polish** : PWA install prompt, welcome popup, sons du timer, animations d'entrée, empty states, transitions inter-pages.

## Détails techniques

- **Framer Motion** déjà installé (`motion/react`) — utilisé pour transitions d'écrans, apparition des cartes, popup timer, slides d'onboarding.
- **Supabase** : projet existant `ylukjecryawgktojufxt`. Les tables sont déjà utilisées par le HTML (`joueurs`, `meta`). On garde les mêmes noms et schéma pour compat 100 % (un utilisateur du HTML peut se logger sur le React et vice-versa).
- **Design tokens** : palette `--draveil: #11984c`, `--draveil-dark: #003b28`, glass tokens déjà dans `src/styles.css`. On étend seulement si besoin.
- **Aucune modif du HTML original** — il reste intact comme référence.

## Ordre de traitement proposé

Je lance **Phase A** maintenant (fichiers logique métier, invisible côté UI mais indispensable), tu valides que le build passe, puis j'enchaîne Phase B, etc.

Ça te va ?
