// @ts-nocheck
/**
 * DRAVEIL — Cœur métier porté verbatim du fichier HTML original.
 * Toute la logique de génération de séances, VMA, phases, ateliers PPP, etc.
 * est ici — SANS modification de l'algorithme.
 *
 * ⚠️ NE PAS RÉÉCRIRE : ce fichier est la source de vérité fonctionnelle,
 * il doit rester conforme au HTML de référence.
 *
 * Les fonctions Supabase, DOM (timer/welcome/install) sont exclues :
 * elles ont leurs équivalents React dans les composants dédiés.
 */
/* eslint-disable */


// ══════════════════════════════════════════════════
// CONSTANTES
// ══════════════════════════════════════════════════

// ══════════════════════════════════════════════════
// CATALOGUE ATELIERS COLLECTIFS (Prévention blessures (PPP) + Handball)
// ══════════════════════════════════════════════════
export const ATELIERS = {
  cohesion_de_renfo: [
    {titre:'Course d\'orientation en binômes', detail:'Parcourir un circuit pour trouver des lettres dispersées sur une carte. Course ensemble obligatoire.', note:'Ambiance ludique — remise en route progressive'},
    {titre:'Dé Renfo (en binôme)', detail:'À chaque retour au point central, lancer le dé → exercice obligatoire avant de repartir.<br>🎲 1 = 10 pompes · 2 = 15 squats · 3 = 30s gainage planche · 4 = 10 fentes/jambe · 5 = 10 burpees · 6 = 20 montées genoux + 10 sauts groupés', note:'Nombre de balises + durée du circuit calés sur place'},
  ],
  vitesse_appuis: [
    {titre:'Échauffement Prévention blessures', detail:'9-12 min · 3 phases : mise en train → activation → dynamique (anti-valgus)', ppp:'echauffement'},
    {titre:'Travail de pied — Débordements', detail:'3 × 10 débordements · pleine vitesse · progression vers l\'avant 5m', note:'Focus sur la qualité des appuis et la réactivité'},
    {titre:'Appuis en 8', detail:'4-8 × 2-4 "huit" · pleine vitesse autour de 2 marques au sol'},
    {titre:'Fentes explosives — 6 axes', detail:'3-6 enchaînements · fentes basses et hautes explosives dans tous les axes', ppp:'pied_athletique'},
    {titre:'Changements de direction', detail:'4 × 15m aller-retour · carioca + slalom + départs arrêtés'},
    {titre:'Pied athlétique', detail:'3-6 × 3-6 sauts · genoux verrouillés et tendus · travail tendineux', note:'Rebonds depuis les pieds — amplitude minimale'},
    {titre:'Pont fessier ⭐', detail:'3 × 12 rép. · monter le bassin, serrer les fessiers, 2s en haut', ppp:'pont_fessier'},
  ],
  ppp_pliometrie: [
    {titre:'Échauffement Prévention blessures', detail:'9-12 min · 3 phases progressives', ppp:'echauffement'},
    {titre:'Pliométrie basse — Sauts latéraux alternés', detail:'3-4 × 20s · sauts explosifs alternés de part et d\'autre de 2 marques espacées de 1m', ppp:'pliometrie_basse'},
    {titre:'Stabilisation après saut latéral', detail:'3-6 × 6 mouvements/côté · saut latéral explosif → stabilisation 2s genou fléchi', note:'Prévention entorse et LCA — exercice clé'},
    {titre:'Pied athlétique', detail:'3-6 × 3-6 sauts · genoux verrouillés', ppp:'pied_athletique'},
    {titre:'Sauts groupés', detail:'3 × 4-6 sauts · genoux-poitrine et genoux tendus alternés'},
    {titre:'Explosivité légère — Accélérations', detail:'4-6 × 20m à 85-90% · départs variés (arrêté, décalé, dos)'},
    {titre:'Pont fessier ⭐', detail:'3 × 12 rép. · bassin haut, fessiers serrés, 2s', ppp:'pont_fessier'},
    {titre:'Étirements globaux', detail:'10 min · retour au calme', ppp:'etirements'},
  ],
  force_ppp2: [
    {titre:'Échauffement Prévention niveau 2', detail:'12 min · activation + excentrique + anti-valgus', ppp:'echauffement'},
    {titre:'Circuit Force — 3 passages', detail:'12 squats · 10 fentes/jambe · 12 pompes · 10 hip bridges unilatéraux/jambe · 30s gainage frontal · 20s chaise murale<br>Récup 2 min entre chaque circuit'},
    {titre:'Rotateurs externes épaule ⭐', detail:'3 × 6-8 / bras · excentrique dos au partenaire · freiner 3 secondes', ppp:'rotateurs_epaule'},
    {titre:'Gainage latéral bras en armer', detail:'3 × 40s / côté · montées-descentes lentes du bassin', ppp:'gainage_lateral'},
    {titre:'Pont fessier ⭐', detail:'3 × 12 rép. · bassin haut, fessiers serrés, 2s', ppp:'pont_fessier'},
    {titre:'Proprioception genou anti-valgus', detail:'2 × 30s / jambe · unipodal + sauts stabilisés', ppp:'proprio_genou'},
    {titre:'Handball intégré', detail:'Situation de jeu en fin de séance — 20-25 min'},
    {titre:'Étirements globaux', detail:'10 min', ppp:'etirements'},
  ],
  rsa_intervalles: [
    {titre:'Échauffement Prévention blessures', detail:'9-12 min · 3 phases progressives', ppp:'echauffement'},
    {titre:'RSA — Repeated Sprint Ability', detail:'3-4 séries × 6 sprints 30m · récup 20s entre sprints · 3 min entre séries', note:'Reproduit l\'intermittence du match de handball'},
    {titre:'Intervalles Zone 4', detail:'4 × 4 min à 85-90% FC max · récup 3 min active · allure soutenue'},
    {titre:'Travail appuis défensifs', detail:'3 × 15m · déplacements latéraux + carioca + change de direction sur signal'},
    {titre:'Fixateurs omoplates ⭐', detail:'2-3 × 6-8 mouvements avec élastique · rotation externe + rétropulsion', ppp:'fixateurs_omoplate'},
    {titre:'Pont fessier ⭐', detail:'3 × 12 rép. · bassin haut, fessiers serrés, 2s', ppp:'pont_fessier'},
    {titre:'Étirements globaux', detail:'10 min', ppp:'etirements'},
  ],
  explosivite_transitions: [
    {titre:'Échauffement dynamique spécifique', detail:'12 min · trot progressif + éducatifs + 4 × 20m accélérations'},
    {titre:'Pliométrie contre-haut', detail:'4-6 × 4-6 sauts bipodaux explosifs sur banc ou marche · atterrissage souple et réactif', note:'Introduction pliométrie de haute intensité'},
    {titre:'Sauts en contrebas explosifs', detail:'3-6 × 3-6 sauts avant/arrière à partir d\'un banc · rebond explosif au sol'},
    {titre:'Pliométrie intégrée tir — 8 et tir', detail:'5 × 4 "huit" autour de marques + tir en suspension · enchaînement immédiat', ppp:'pliometrie_basse'},
    {titre:'Transitions défense/attaque', detail:'3 × 5 min · situations de transition rapide à haute intensité'},
    {titre:'Handball complet', detail:'Match à thème 25-30 min · application des principes'},
    {titre:'Pont fessier ⭐', detail:'3 × 12 rép.', ppp:'pont_fessier'},
    {titre:'Étirements globaux', detail:'10 min', ppp:'etirements'},
  ],
  puissance_tir: [
    {titre:'Échauffement Prévention blessures', detail:'12 min · activation + pliométrie légère', ppp:'echauffement'},
    {titre:'Travail combiné pieds-cuisses', detail:'3-6 × fentes explosives + sauts pliométriques · enchaînement immédiat'},
    {titre:'Pliométrie intégrée au tir — 8 et tir (v1)', detail:'5 × 4 "huit" + 1 tir en suspension · trajectoire plat/piqué', ppp:'pliometrie_basse'},
    {titre:'Pliométrie intégrée au tir — 8 et tir (v2)', detail:'5 × 4 "huit" + 1 tir en suspension · angle et position d\'armer variés'},
    {titre:'Lattes sautées et tir en suspension', detail:'5 × 6 sauts stabilisés + 1 tir · maintenir qualité du tir malgré fatigue'},
    {titre:'Gainage + pliométrie + tir (à deux)', detail:'4-6 enchaînements · gainage debout soutenu → sauts arrière → tir'},
    {titre:'Rotateurs externes épaule ⭐', detail:'3 × 6-8 / bras · récupération après effort de tir', ppp:'rotateurs_epaule'},
    {titre:'Pont fessier ⭐', detail:'3 × 12 rép. · bassin haut, fessiers serrés, 2s', ppp:'pont_fessier'},
    {titre:'Étirements globaux', detail:'10 min · insister sur épaules et ischiojambiers', ppp:'etirements'},
  ],
  activation_pre_match: [
    {titre:'Échauffement PPP court', detail:'8 min · mobilisation étagée + activation légère'},
    {titre:'Activation neuromusculaire', detail:'3 × 6 sauts latéraux stabilisés · 3 × 5 fentes sautées · 3 × 10 montées genoux rapides', note:'Réveiller le système nerveux sans créer de fatigue'},
    {titre:'Sprints courts d\'activation', detail:'4-6 × 15m à 80-85% · départs variés · récup complète'},
    {titre:'Proprioception cheville rapide', detail:'2 × 20s / jambe · unipodal', ppp:'proprio_cheville'},
    {titre:'Rotateurs épaule courts ⭐', detail:'2 × 6 / bras · activation pré-match'},
    {titre:'Échauffement handball type match', detail:'Situations de jeu à intensité progressive · finir avec de l\'énergie'},
    {titre:'Étirements actifs', detail:'5 min · chaînes post., épaules · pas de statique prolongé'},
  ],
};

// Map event themes to ateliers
export const THEME_ATELIERS = {
  cohesion:'cohesion_de_renfo',
  vitesse:'vitesse_appuis',
  plio:'ppp_pliometrie',
  force:'force_ppp2',
  rsa:'rsa_intervalles',
  explosivite:'explosivite_transitions',
  puissance:'puissance_tir',
  activation:'activation_pre_match',
};

export const PHASES_DATES = {
  p1: { debut:'2026-07-01', fin:'2026-07-19', nom:'Coupure',            icon:'🏖️', couleur:'var(--blue)'   },
  p2: { debut:'2026-07-20', fin:'2026-08-23', nom:'Prépa Individuelle', icon:'🏃', couleur:'var(--red)'    },
  p3: { debut:'2026-08-25', fin:'2026-09-20', nom:'Reprise Collective', icon:'🤝', couleur:'#00897b'      },
  p4: { debut:'2026-09-19', fin:'2026-09-21', nom:'Championnat',        icon:'🏆', couleur:'var(--green)'  },
  p5: { debut:'2099-01-03', fin:'2099-01-04', nom:'—',                  icon:'',   couleur:'#a855f7'       },
};
export const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
export const JOURS_LONG = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
export const POSTES = ['Gardien','Ailier G','Ailier D','Arrière G','Arrière D','Demi-centre','Pivot'];
export const COULEURS_AV = ['#11984c','#D97706','#2563EB','#16A34A','#7C3AED','#DB2777','#0891B2'];

// Phase 3 collective schedule — Draveil HB · Reprise collective 2026
export const PHASE3_SCHEDULE = [
  // ── S1 ─────────────────────────────────────────
  {date:'2026-08-25', weekIdx:0, sessIdx:0, type:'cohesion',
   titre:'🧭 Cohésion & Reprise', theme:'Reprise & Cohésion',
   duree:'75-90 min', lieu:'À définir par le coach',
   objectif:'Première séance — remise en route progressive, cohésion d\'équipe'},
  {date:'2026-08-27', weekIdx:0, sessIdx:1, type:'renfo',
   titre:'💪 Renforcement + Handball', theme:'Renfo + Handball',
   duree:'75 min', lieu:'Gymnase',
   objectif:'Circuit renforcement + jeu collectif'},
  // ── Journée handball dimanche ───────────────────
  {date:'2026-08-30', weekIdx:0, sessIdx:-1, type:'cohesion',
   titre:'🤝 Journée Handball — Draveil', theme:'Journée Handball',
   duree:'Journée', lieu:'Gymnase (journée)',
   objectif:'Reprise collective ensemble : handball, jeu, cohésion',
   note:'Présence obligatoire — journée complète'},
  // ── S2 ─────────────────────────────────────────
  {date:'2026-09-01', weekIdx:1, sessIdx:0, type:'cardio',
   titre:'🏃 Cardio + Handball', theme:'Cardio + Handball',
   duree:'75 min', lieu:'Gymnase / Extérieur',
   objectif:'Travail cardio collectif + transitions défense/attaque'},
  {date:'2026-09-03', weekIdx:1, sessIdx:1, type:'renfo',
   titre:'💪 Force + Handball', theme:'Force + Handball',
   duree:'75 min', lieu:'Gymnase',
   objectif:'Circuit force intensifié + système offensif'},
  // ── S3 ─────────────────────────────────────────
  {date:'2026-09-08', weekIdx:2, sessIdx:0, type:'vitesse',
   titre:'⚡ Intensité + Vitesse', theme:'Intensité + Vitesse',
   duree:'75 min', lieu:'Gymnase / Extérieur',
   objectif:'Travail vitesse, appuis, changements de direction + handball intensité match'},
  {date:'2026-09-10', weekIdx:2, sessIdx:1, type:'explosivite',
   titre:'🔥 Explosivité + Handball', theme:'Explosivité + Handball',
   duree:'75 min', lieu:'Gymnase',
   objectif:'Pliométrie + appuis + oppositions complètes'},
  // ── S4 affûtage ─────────────────────────────────
  {date:'2026-09-15', weekIdx:3, sessIdx:0, type:'affutage',
   titre:'🎯 Affûtage', theme:'Affûtage',
   duree:'60 min', lieu:'Gymnase',
   objectif:'Activation légère, PPP court, jeu libre — on arrive frais'},
  {date:'2026-09-17', weekIdx:3, sessIdx:1, type:'activation',
   titre:'✅ Activation pré-championnat', theme:'Activation',
   duree:'60 min', lieu:'Gymnase',
   objectif:'Échauffement type match, handball complet — dernière séance avant J1'},
  // ── Championnat ─────────────────────────────────
  {date:'2026-09-20', weekIdx:-1, sessIdx:-1, type:'match',
   titre:'🏆 J1 Championnat D2', theme:'Championnat',
   duree:'—', lieu:'À confirmer',
   objectif:'ENTRÉE EN COMPÉTITION',
   note:'Date exacte à confirmer par le comité'},
];

// ══════════════════════════════════════════════════
// PRÉVENTION BLESSURES — EXERCICES CLÉS
// ══════════════════════════════════════════════════

// ══════════════════════════════════════════════════
// DÉTAILS EXERCICES + VIDÉOS DE DÉMONSTRATION
// ══════════════════════════════════════════════════
export const EXO_VIDEOS = {
  cheville:'https://www.youtube.com/watch?v=b9hIDxXukbY',
  nordic:'https://www.youtube.com/watch?v=kNfR1jycNmA',
  epaule:'https://www.youtube.com/watch?v=LFYAczR6XKY',
  gainage:'https://www.youtube.com/watch?v=hoPwUu8vvvw',
};
export const EXO_DETAILS = [
  { match:['équilibre sur une jambe','équilibre unipod','proprioception cheville'], video:EXO_VIDEOS.cheville,
    position:"Debout sur une jambe, genou légèrement fléchi (jamais verrouillé), regard sur un point fixe devant toi.",
    execution:"Tiens la position en restant stable. Progression : 1) yeux ouverts, 2) yeux fermés, 3) sur surface instable (coussin).",
    respiration:"Calme et continue.", tempo:"Maintien statique sur la durée.",
    erreurs:["Genou complètement verrouillé","Regard qui se balade","Poser le pied trop souvent"],
    conseil:"Profite du brossage de dents : 30s sur chaque pied, yeux fermés." },
  { match:['proprioception genou','anti-valgus','proprio genou'], video:EXO_VIDEOS.cheville,
    position:"Sur une jambe, genou fléchi ~20°, tronc droit. Jambe libre légèrement levée.",
    execution:"Petits balanciers de la jambe libre en gardant le genou d'appui aligné avec le pied. Le genou ne rentre jamais vers l'intérieur.",
    respiration:"Continue.", tempo:"Lent et contrôlé.",
    erreurs:["⚠️ Genou qui rentre (valgus = risque LCA)","Tronc qui penche","Aller trop vite"],
    conseil:"Imagine un laser partant de ton genou : il pointe toujours vers ton 2e orteil." },
  { match:['nordic curl','nordic'], video:EXO_VIDEOS.nordic,
    position:"À genoux, buste droit aligné aux cuisses, pieds bloqués (meuble lourd ou partenaire).",
    execution:"Penche-toi lentement vers l'avant, corps droit, en freinant avec l'arrière des cuisses. Pose les mains au sol pour amortir puis pousse pour revenir.",
    respiration:"Inspire avant, expire à la descente.", tempo:"⭐ Descente très lente : 4 à 5 secondes.",
    erreurs:["Descendre trop vite","Casser au niveau des hanches","Pieds mal bloqués"],
    conseil:"Sans partenaire : talons sous un canapé. Vise 3×5 au début, la qualité prime.",
    variante:"Avec élastique en hauteur derrière toi pour t'aider à freiner." },
  { match:['rotation externe','rotateur','rotateurs','épaule'], video:EXO_VIDEOS.epaule,
    position:"Debout, coude collé au corps et plié à 90°. Élastique ancré sur le côté. Serviette roulée entre coude et corps.",
    execution:"Tourne l'avant-bras vers l'extérieur en gardant le coude collé, comme pour ouvrir une porte. Reviens lentement.",
    respiration:"Expire en tirant, inspire au retour.", tempo:"Lent et contrôlé, surtout au retour.",
    erreurs:["⚠️ Décoller le coude du corps","Élastique trop résistant","Mouvement trop rapide"],
    conseil:"3×15 par bras, élastique léger. À faire avant chaque séance avec les épaules.",
    variante:"Pas d'élastique ? Petite bouteille d'eau ou mouvement lent à vide en contractant." },
  { match:['gainage ventral','gainage frontal','gainage en coordination'], video:EXO_VIDEOS.gainage,
    position:"Sur les avant-bras et pointes de pieds, coudes sous les épaules, corps en ligne droite.",
    execution:"Maintiens immobile en serrant abdos et fessiers. Version dynamique : lève alternativement un bras ou une jambe sans bouger le bassin.",
    respiration:"Normale et continue — ne bloque pas.", tempo:"Statique sur la durée.",
    erreurs:["Fesses trop hautes ou affaissées","Cambrer le bas du dos","Bloquer la respiration"],
    conseil:"Mieux vaut 30s parfaitement gainé que 1 min le dos creux." },
  { match:['gainage latéral'], video:EXO_VIDEOS.gainage,
    position:"Sur un avant-bras, coude sous l'épaule, corps sur le côté, jambes empilées.",
    execution:"Soulève le bassin pour former une ligne droite. Maintiens. Version dynamique : monte/descends le bassin lentement.",
    respiration:"Normale et continue.", tempo:"Statique ou lent.",
    erreurs:["Bassin qui s'affaisse","Rotation du buste","Épaule collée à l'oreille"],
    conseil:"Trop dur ? Pose le genou du dessous au sol pour réduire le levier." },
  { match:['squat'], video:null,
    position:"Pieds largeur d'épaules, pointes légèrement vers l'extérieur, poitrine ouverte.",
    execution:"Pousse les fesses vers l'arrière comme pour t'asseoir, descends cuisses parallèles au sol, remonte en poussant dans les talons.",
    respiration:"Inspire en descendant, expire en remontant.", tempo:"3s descente, remontée dynamique.",
    erreurs:["⚠️ Genoux qui rentrent","Talons qui décollent","Dos qui s'arrondit"],
    conseil:"Imagine que tu t'assois sur une chaise basse derrière toi." },
  { match:['fente'], video:null,
    position:"Debout, pieds joints, mains sur les hanches.",
    execution:"Grand pas en avant, descends jusqu'à genou avant à 90° et genou arrière près du sol. Pousse sur la jambe avant.",
    respiration:"Inspire en descendant, expire en remontant.", tempo:"Contrôlé, descente lente.",
    erreurs:["Pas trop petit (genou dépasse le pied)","Buste penché","Genou avant qui part vers l'intérieur"],
    conseil:"Fais-les en avançant dans un couloir : 10 pas par jambe." },
  { match:['hip bridge','pont fessier'], video:null,
    position:"Allongé sur le dos, genoux fléchis, pieds à plat. Unilatéral : une jambe tendue en l'air.",
    execution:"Monte le bassin en serrant les fessiers jusqu'à aligner épaules-hanches-genou. Tiens 2s, redescends lentement.",
    respiration:"Expire en montant.", tempo:"Montée contrôlée, 2s en haut.",
    erreurs:["Cambrer le dos au lieu de serrer les fessiers","Monter trop vite","Bassin qui bascule"],
    conseil:"Version 1 jambe : 3×10 par côté, excellent pour ischios et fessiers." },
  { match:['pompe'], video:null,
    position:"Mains au sol un peu plus larges que les épaules, corps gainé en ligne droite.",
    execution:"Descends en pliant les coudes jusqu'à frôler le sol, pousse pour remonter.",
    respiration:"Inspire en descendant, expire en poussant.", tempo:"2s descente, montée dynamique.",
    erreurs:["Fesses qui montent ou creusent","Coudes trop écartés","Demi-amplitude"],
    conseil:"Trop dur ? Genoux au sol ou pompes inclinées contre un mur/table.",
    variante:"Sur les genoux ou inclinées contre un support pour débuter." },
  { match:['chaise au mur','chaise mur'], video:null,
    position:"Dos plaqué au mur, glisse jusqu'à cuisses parallèles au sol (genoux à 90°).",
    execution:"Maintiens immobile sur la durée.",
    respiration:"Normale.", tempo:"Statique.",
    erreurs:["Genoux qui dépassent les pieds","Position trop haute","Bloquer la respiration"],
    conseil:"Mains sur les cuisses sans appui — tout le travail dans les jambes." },
  { match:['sauts sur une jambe','sauts genou-poitrine','sauts unipod','réception','stabilis'], video:EXO_VIDEOS.cheville,
    position:"Sur une jambe ou deux, genoux souples.",
    execution:"Saute puis réceptionne en douceur en pliant les genoux. Stabilise 2-3s à chaque réception.",
    respiration:"Souffle sur le saut.", tempo:"Explosif à la montée, réception douce.",
    erreurs:["⚠️ Réception jambes tendues","Genou qui rentre à l'atterrissage","Réception raide"],
    conseil:"L'important n'est pas de sauter haut mais de te réceptionner parfaitement stable." },
  { match:['appuis','changements de direction','débordement','parcours'], video:null,
    position:"Position athlétique : genoux fléchis, bassin bas, sur l'avant des pieds.",
    execution:"Enchaîne les déplacements (latéraux, changements de direction) en restant bas et réactif. Plante le pied extérieur pour relancer.",
    respiration:"Régulière.", tempo:"Rapide mais contrôlé.",
    erreurs:["Se redresser dans les changements de direction","Appuis lents","Regarder ses pieds"],
    conseil:"Pose 4 plots et chronomètre-toi pour suivre ta progression." },
  { match:['course fractionnée','fractionn','réveil cardio','footing','intervalles','activation — 15'], video:null,
    position:"Terrain plat ou piste. Prépare ton chrono ou le minuteur de l'app.",
    execution:"Alterne 2 min d'effort soutenu (à l'allure affichée) puis 1 min de récup en trot lent. Répète le nombre de fois indiqué. Allure régulière, ne pars pas trop vite.",
    respiration:"Profonde et rythmée à l'effort, calme sur la récup.", tempo:"2 min effort / 1 min récup.",
    erreurs:["Partir trop vite et exploser à la fin","Récup trop rapide","Sauter l'échauffement"],
    conseil:"Respecte l'allure en km/h : c'est elle qui rend la séance efficace. Utilise le minuteur 2'/1'." },
  { match:['circuit'], video:null,
    position:"Espace dégagé, bouteille d'eau à portée.",
    execution:"Enchaîne tous les exercices du circuit sans grosse pause. Une fois le tour fini, récupère 2 min, puis recommence le nombre de tours indiqué.",
    respiration:"Souffle sur l'effort.", tempo:"Fluide dans un tour, récup entre les tours.",
    erreurs:["Bâcler la technique avec la fatigue","Ne pas récupérer entre les tours","Vitesse au détriment de la qualité"],
    conseil:"Un tour propre vaut mieux qu'un tour rapide mal fait. La technique avant la vitesse." },
  { match:['vélo, natation','footing léger','récupération active','au choix'], video:null,
    position:"Choisis : vélo, natation, ou footing très tranquille.",
    execution:"30 à 40 min à intensité TRÈS légère (tu peux parler sans être essoufflé). But : faire circuler le sang, aider à récupérer.",
    respiration:"Facile.", tempo:"Lent et confortable.",
    erreurs:["Transformer la récup en séance intense","Forcer alors qu'il faut récupérer"],
    conseil:"Séance facultative mais précieuse : elle accélère la récupération." },
  { match:['mobilité','souplesse'], video:null,
    position:"Debout puis au sol, espace dégagé.",
    execution:"Mobilise en douceur hanches, épaules, chevilles, dos. Mouvements amples et progressifs, sans forcer.",
    respiration:"Lente et profonde.", tempo:"Lent et contrôlé.",
    erreurs:["Mouvements brusques","Forcer une amplitude douloureuse"],
    conseil:"Parfait en récup pour relâcher les tensions de la semaine." },
  { match:['étirement','stretching','retour au calme'], video:null,
    position:"Au calme, au sol ou debout, après l'effort.",
    execution:"Étire chaque grand groupe (ischios, quadriceps, mollets, adducteurs, épaules), 20-30s par étirement, sans à-coups.",
    respiration:"Lente, expire en allongeant.", tempo:"Maintien 20-30s.",
    erreurs:["Étirer à froid avant l'effort","Forcer jusqu'à la douleur","Faire des rebonds"],
    conseil:"Sensation de tension = OK. Douleur = trop loin, relâche." },
  { match:['échauffement'], video:null,
    position:"Tenue de sport, espace dégagé.",
    execution:"Monte progressivement : trot léger, mobilité articulaire, puis gammes dynamiques et quelques accélérations.",
    respiration:"Progressive.", tempo:"Intensité croissante.",
    erreurs:["⚠️ Sauter l'échauffement","Étirements statiques longs avant l'effort","Démarrer trop fort"],
    conseil:"10 min minimum. Tu dois avoir chaud et le cœur qui monte avant d'attaquer." },
];
export function getExoDetail(nom){
  const t=(nom||'').toLowerCase();
  for(const d of EXO_DETAILS){ if(d.match.some(m=>t.includes(m.toLowerCase()))) return d; }
  return null;
}
export let _exoDetOpen={};
export function toggleExoDet(key){
  const el=g('exodet-'+key); if(!el) return;
  el.style.display = el.style.display==='none' ? 'block' : 'none';
}
export function renderExoDetailHTML(nom, key){
  const d=getExoDetail(nom); if(!d) return '';
  let inner=`<div id="exodet-${key}" style="display:none;margin-top:8px;background:var(--s3);border-radius:8px;padding:12px;font-size:12px;line-height:1.6">`;
  inner+=`<div style="margin-bottom:8px"><span style="color:var(--red);font-weight:700;text-transform:uppercase;font-size:10px;letter-spacing:1px">📍 Position</span><br>${d.position}</div>`;
  inner+=`<div style="margin-bottom:8px"><span style="color:var(--red);font-weight:700;text-transform:uppercase;font-size:10px;letter-spacing:1px">▶️ Exécution</span><br>${d.execution}</div>`;
  inner+=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">`;
  inner+=`<div style="background:var(--s2);border-radius:6px;padding:8px"><span style="color:var(--gray);font-size:10px;text-transform:uppercase">🫁 Respiration</span><br>${d.respiration}</div>`;
  inner+=`<div style="background:var(--s2);border-radius:6px;padding:8px"><span style="color:var(--gray);font-size:10px;text-transform:uppercase">⏱ Tempo</span><br>${d.tempo}</div>`;
  inner+=`</div>`;
  inner+=`<div style="margin-bottom:8px"><span style="color:var(--red);font-weight:700;text-transform:uppercase;font-size:10px;letter-spacing:1px">⚠️ Erreurs à éviter</span><ul style="margin:4px 0 0 16px;padding:0">${d.erreurs.map(e=>`<li>${e}</li>`).join('')}</ul></div>`;
  if(d.conseil) inner+=`<div style="background:rgba(34,197,94,.1);border-radius:6px;padding:8px;margin-bottom:${d.variante?'8px':'0'}"><span style="color:var(--green);font-size:10px;text-transform:uppercase;font-weight:700">💡 Conseil</span><br>${d.conseil}</div>`;
  if(d.variante) inner+=`<div style="background:rgba(59,130,246,.1);border-radius:6px;padding:8px"><span style="color:#60a5fa;font-size:10px;text-transform:uppercase;font-weight:700">🔄 Adaptation matériel</span><br>${d.variante}</div>`;
  if(d.video) inner+=`<a href="${d.video}" target="_blank" style="display:block;background:var(--red);color:#fff;text-align:center;padding:10px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;margin-top:8px">▶️ Voir la vidéo de démonstration</a>`;
  inner+=`<div style="font-size:10px;color:var(--gray);text-align:center;margin-top:8px">⚕️ En cas de douleur anormale, arrête et signale-le.</div>`;
  inner+=`</div>`;
  return `<button onclick="toggleExoDet('${key}')" style="background:none;border:none;color:var(--red);font-size:11px;font-weight:600;cursor:pointer;padding:4px 0;margin-top:4px">📖 Détails & vidéo ▾</button>${inner}`;
}

export const PPP = {
  echauffement: {
    nom:'Échauffement Prévention blessures', icon:'🔥',
    dosage:'9–12 min — 3 phases progressives',
    exec:`<p><strong>Phase 1 — Mise en train (3-4 min):</strong> Mobilisation étagée faible intensité. Articulations de bas en haut.</p>
    <p><strong>Phase 2 — Activation (3-4 min):</strong> Séquences vitesse/rythme augmentés + sollicitation excentrique légère.</p>
    <p><strong>Phase 3 — Dynamique (3-4 min):</strong> Vitesse maximale, séquences courtes à rythme élevé avec contrôle des réceptions anti-valgus.</p>`,
    note:'Proprioception statique chevilles et genoux intégrée à chaque phase'
  },
  pont_fessier: {
    nom:'Pont fessier — Ischiojambiers & fessiers', icon:'⭐',
    dosage:'3 × 12 rép. — 2s en haut',
    exec:`<p>Allongé sur le dos, genoux fléchis, pieds à plat. Monter le bassin en <strong>serrant les fessiers</strong> jusqu'à aligner épaules-hanches-genoux. Tenir 2s, redescendre lentement. Version avancée : une jambe tendue en l'air.</p>`,
    note:'Exercice n°1 prévention handball — réduit jusqu\'à 50% les lésions ischios. À faire 2×/semaine minimum.'
  },
  proprio_cheville: {
    nom:'Proprioception Cheville', icon:'🦵',
    dosage:'2 × 30s / jambe',
    exec:`<p><strong>Niveau 1:</strong> Station unipodale yeux ouverts — tenir l\'équilibre sur 1 jambe genou légèrement fléchi.</p>
    <p><strong>Progression:</strong> Yeux fermés / surface instable (coussin) / ballon sur mains.</p>`,
    note:'À chaque séance — intégrable dans l\'échauffement'
  },
  proprio_genou: {
    nom:'Proprioception Genou Anti-Valgus', icon:'🦵',
    dosage:'2 × 30s / jambe',
    exec:`<p>Équilibre unipodal genou fléchi + mouvements de balancier de l\'autre jambe. Résister au valgus dynamique (genou vers l\'intérieur).</p>
    <p><strong>Évolution:</strong> Sauts latéraux stabilisés + maintien 2s en réception genou fléchi.</p>`,
    note:'Prévention LCA — clé pour les ailiers et pivots'
  },
  rotateurs_epaule: {
    nom:'Rotateurs Ext. Épaule (excentrique)', icon:'⭐',
    dosage:'3 × 6-8 mouvements / bras',
    exec:`<p>En position d\'armer coude haut, maintenu par le partenaire. Freiner la rotation interne imposée pendant <strong>3 secondes</strong>.</p>
    <p>Alternative avec élastique : rotation externe coude au corps, freiner le retour lentement.</p>`,
    note:'Exercice majeur prévention tendinite de l\'épaule. À intégrer en fin d\'échauffement ou force.'
  },
  fixateurs_omoplate: {
    nom:'Fixateurs d\'Omoplates', icon:'💪',
    dosage:'2-3 × 6-8 mouvements',
    exec:`<p>Avec élastique : alterner mouvements de rotation externe et rétropulsion horizontale depuis les appuis.</p>
    <p>Sans matériel : pompes bras tendus — descente/montée en mobilisant les omoplates.</p>`,
    note:'À intégrer dans la séquence d\'échauffement — essentiel pour tous les joueurs qui tirent'
  },
  gainage_lateral: {
    nom:'Gainage Latéral Bras en Armer', icon:'🏋️',
    dosage:'3 × 40-45s / côté',
    exec:`<p>En gainage latéral, bras relâché en position d\'armer avec ballon. Mouvements lents de montées-descentes du bassin.</p>
    <p><strong>Évolution:</strong> Charge (5-10kg) sur hanche + plot en équilibre sur bassin.</p>`,
    note:'Associe gainage tronc et position handball spécifique'
  },
  gainage_plank: {
    nom:'Gainage Face Sol — Chaînes Croisées', icon:'🏋️',
    dosage:'3 × 3-6 mouvements / diagonale',
    exec:`<p>En diagonale sur deux appuis face au sol, extension simultanée de la jambe et du bras opposés. Maintenir le bassin horizontal.</p>
    <p><strong>Accélération:</strong> Même exercice à vitesse rapide pour travailler la coordination neuromusculaire.</p>`,
    note:'Chaînes croisées postérieures — fondamental pour les tirs en suspension'
  },
  pliometrie_basse: {
    nom:'Pliométrie Basse — Sauts Latéraux', icon:'⚡',
    dosage:'3-6 × 20-30s',
    exec:`<p>Séries de sauts latéraux alternés explosifs au-dessus de 2 marques espacées de 1m.</p>
    <p><strong>Stabilisés:</strong> Saut latéral explosif puis stabilisation 2 secondes genou fléchi sur la jambe opposée.</p>`,
    note:'Travail de pied spécifique handball — développe l\'explosivité et la qualité des appuis'
  },
  pied_athletique: {
    nom:'Pied Athlétique', icon:'⚡',
    dosage:'3-6 × 3-6 sauts',
    exec:`<p>Sauts maximaux avec genoux verrouillés et tendus. Travail principalement tendineux — rebonds depuis les pieds.</p>
    <p>Variation : sauts groupés (genou-poitrine) pour associer force et travail tendineux.</p>`,
    note:'Renforce les tendons d\'Achille et la stiffness musculo-tendineuse'
  },
  etirements: {
    nom:'Étirements Globaux Handball', icon:'🧘',
    dosage:'8-10 min — 30-45s / groupe',
    exec:`<p>Zones à couvrir : chaînes postérieures, fléchisseurs/extenseurs poignet, grand dorsal, triceps, deltoïde, rachis, fessiers, psoas, ischiojambiers, quadriceps, adducteurs.</p>`,
    note:'À réaliser systématiquement en fin de séance'
  }
};

// ══════════════════════════════════════════════════
// VMA / ALLURES
// ══════════════════════════════════════════════════
export const LUC_LEGER = {1:8.5,2:9,3:9.5,4:10,5:10.5,6:11,7:11.5,8:12,9:12.5,10:13,11:13.5,12:14,13:14.5,14:15,15:15.5,16:16,17:16.5,18:17,19:17.5,20:18};

export function vmaFromPalier(p){return LUC_LEGER[Math.round(p)] || Math.round(8+p*0.5);}
export function getAllures(vma){
  const r=n=>Math.round(n*10)/10;
  return {fond:r(vma*.70),seuil:r(vma*.83),vma100:r(vma),puissance:r(vma*.93),recup:r(vma*.58)};
}
export function kmhToMinKm(v){if(!v)return '--';const t=60/v;const m=Math.floor(t);const s=Math.round((t-m)*60);return `${m}'${s<10?'0':''}${s}"`;}
export function getNiveau(vma){return 'Groupe '+getGroupe(vma);}
export function getNiveauNum(vma){const g=getGroupe(vma);return g==='A'?2:g==='B'?1:0;}

// Groupes A/B/C — calibrés niveau départemental (D2), VMA Cooper/Luc Léger
// C < 13 km/h · B 13-15 · A ≥ 15  (seuils adaptés à un effectif départemental aux âges variés)
export function getGroupe(vma){if(vma>=15)return 'A';if(vma>=13)return 'B';return 'C';}

// ══════════════════════════════════════════════════
// PROFIL D'ADAPTATION (âge / poids / taille)
// Détermine comment adapter intensité, impact et récupération
// ══════════════════════════════════════════════════
export function getIMC(joueur){
  const t=(joueur&&joueur.taille)?joueur.taille/100:0; // cm → m
  const p=(joueur&&joueur.poids)?joueur.poids:0;
  if(!t||!p) return 0;
  return Math.round((p/(t*t))*10)/10;
}
export function getProfilAdapt(joueur){
  const age=(joueur&&joueur.age)?joueur.age:30;
  const imc=getIMC(joueur);
  // Profil : 'jeune' | 'inter' | 'menager'
  let profil='inter', sansImpact=false, recupLongue=false;
  if(imc>=28) { sansImpact=true; } // surpoids marqué → activités sans impact
  if(age>=40 || imc>=30){ profil='menager'; recupLongue=true; sansImpact=true; }
  else if(age<=30 && imc<27){ profil='jeune'; }
  else { profil='inter'; if(age>=36) recupLongue=true; }
  return {profil, sansImpact, recupLongue, age, imc};
}
export function getProfilLabel(p){
  if(p.profil==='jeune') return {label:'En forme', col:'#7cb342', icon:'🟢'};
  if(p.profil==='menager') return {label:'À ménager', col:'#00897b', icon:'🔵'};
  return {label:'Intermédiaire', col:'#11984c', icon:'🟡'};
}
export function getGroupeLabel(vma){
  const g=getGroupe(vma);
  if(g==='A')return {g:'A',label:'Groupe A',col:'#11984c',bg:'rgba(17,152,76,.15)'};
  if(g==='B')return {g:'B',label:'Groupe B',col:'#F59E0B',bg:'rgba(245,158,11,.15)'};
  return        {g:'C',label:'Groupe C',col:'#3B82F6',bg:'rgba(59,130,246,.15)'};
}

// Protocole cardio IFT 2'/1' adapté au Luc Léger
export const CARDIO_PROTO = [
  {sem:'S1',reps:6,  pct:{C:.70,B:.75,A:.80}, vol:'Faible'},
  {sem:'S2',reps:8,  pct:{C:.72,B:.77,A:.82}, vol:'Modéré'},
  {sem:'S3',reps:10, pct:{C:.75,B:.80,A:.85}, vol:'Élevé'},
  {sem:'S4',reps:12, pct:{C:.75,B:.82,A:.87}, vol:'Élevé'},
  {sem:'S5',reps:8,  pct:{C:.65,B:.68,A:.70}, vol:'Décharge'},
];

// ══════════════════════════════════════════════════
// PHASE HELPERS
// ══════════════════════════════════════════════════
export function getPhaseActuelle(date=new Date()){
  const d=date.toISOString().split('T')[0];
  for(const key of ['p1','p2','p3','p4','p5']){
    const p=PHASES_DATES[key];
    if(d>=p.debut&&d<=p.fin) return key;
  }
  if(d<PHASES_DATES.p1.debut) return 'avant';
  return 'apres';
}
export function getPhase2Week(date=new Date()){
  const d2=new Date(PHASES_DATES.p2.debut);
  const diff=Math.floor((date-d2)/(7*86400000));
  return Math.max(0,Math.min(4,diff)); // 0-4 → semaines 1-5 (prépa individuelle)
}
export function getPhase2WeemLabel(w){
  const labels=['S1 · 20-26 Juil','S2 · 27 Juil-2 Août','S3 · 3-9 Août','S4 · 10-16 Août','S5 · 17-23 Août'];
  const phases=['Reprise','Construction','Montée','Charge','Décharge'];
  return {label:labels[w]||`S${w+1}`,phase:phases[w]||'Phase'};
}
export function getPhase3Week(date=new Date()){
  const d3=new Date(PHASES_DATES.p3.debut);
  const diff=Math.floor((date-d3)/(7*86400000));
  return Math.max(0,Math.min(3,diff)); // 0-3 → semaines 1-4 (reprise collective)
}
export function getPhase3WeemLabel(w){
  const labels=['S1 · 25-27 Août','S2 · 1-3 Sept','S3 · 8-10 Sept','S4 · 15-17 Sept'];
  const phases=['Reprise','Volume','Intensité','Affûtage'];
  return {label:labels[w]||`S${w+1}`,phase:phases[w]||'Phase'};
}
export function formatDate(d){return new Date(d).toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'});}

// Calcule la date réelle de chaque séance (mardi/jeudi/bonus) à partir du 24 août 2026
// jours_seance du joueur : index 0=Dim..6=Sam. Par défaut mardi(2)+jeudi(4).
export function _sessionDatesFrom(debutStr, nbWeeks, joueur){
  const debut = new Date(debutStr); // lundi de la S1
  const js = (joueur&&joueur.jours_seance&&joueur.jours_seance.length>=2)
    ? joueur.jours_seance.slice().sort((a,b)=>a-b)
    : [2,4]; // mardi, jeudi par défaut
  const out=[];
  for(let w=0; w<nbWeeks; w++){
    js.forEach((jourIdx, sIdx)=>{
      const d = new Date(debut);
      const offset = ((jourIdx===0?7:jourIdx) - 1) + w*7;
      d.setDate(d.getDate()+offset);
      out.push({weekIdx:w, sessIdx:sIdx, date:d.toISOString().split('T')[0], jourIdx});
    });
  }
  out.sort((a,b)=>a.date.localeCompare(b.date));
  return out;
}
export function getSessionDatesIndiv(joueur){ return _sessionDatesFrom('2026-07-20', 5, joueur); }   // prépa individuelle (5 sem.)
export function getSessionDatesCollectif(joueur){ return _sessionDatesFrom('2026-08-25', 4, joueur); } // reprise collective (4 sem.) — démarre mardi 25 août
export function getSessionDates(joueur){ return getSessionDatesCollectif(joueur); } // compat

// ══════════════════════════════════════════════════
// SESSION GENERATORS — PHASE 2
// ══════════════════════════════════════════════════
// ══════════════════════════════════════════════════
// TIMER 2'/1'
// ══════════════════════════════════════════════════
export let _timerInterval=null, _timerSec=0, _timerRep=0, _timerTotalReps=0, _timerPhase='effort', _timerRunning=false;
export let _timerEffortSec=120, _timerRecupSec=60;
export const _timerCtx: any = (typeof window !== 'undefined' && (window as any).AudioContext) ? new (window as any).AudioContext() : null;
export let _installPrompt=null, _installButtonVisible=false;
export function _beep(freq=880, dur=0.15){
  if(!_timerCtx) return;
  try{const o=_timerCtx.createOscillator(),g=_timerCtx.createGain();o.connect(g);g.connect(_timerCtx.destination);o.frequency.value=freq;g.gain.setValueAtTime(.3,_timerCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,_timerCtx.currentTime+dur);o.start();o.stop(_timerCtx.currentTime+dur);}catch(e){}
}
// ══════════════════════════════════════════════════
// POPUP BIENVENUE — premier accès uniquement
// ══════════════════════════════════════════════════
export const WELCOME_SLIDES = [
  {
    icon:'👋',
    titre:'Bienvenue sur DHB Prépa !',
    contenu:`
      <p style="font-size:15px;color:var(--light);line-height:1.7;margin-bottom:16px">
        Ton programme de préparation physique personnalisé est prêt.<br>
        Voici <strong style="color:var(--white)">3 choses importantes</strong> à savoir avant de commencer.
      </p>
      <div style="background:rgba(17,152,76,.08);border:1px solid rgba(17,152,76,.2);border-radius:12px;padding:14px">
        <div style="font-size:13px;color:var(--green);font-weight:700;margin-bottom:8px">Ce que tu vas faire :</div>
        <div style="font-size:13px;color:var(--light);line-height:1.8">
          📅 <strong>2 séances obligatoires</strong> par semaine<br>
          🧘 <strong>1 séance récup facultative</strong> pour aller plus loin<br>
          📊 <strong>Valider tes séances</strong> après chaque effort<br>
          🏆 <strong>Arriver en forme</strong> à la reprise collective le 25 août
        </div>
      </div>`
  },
  {
    icon:'📊',
    titre:'Ton programme est fait pour toi',
    contenu:`
      <p style="font-size:14px;color:var(--light);line-height:1.7;margin-bottom:14px">
        Tout est calculé automatiquement selon ton profil :
      </p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
        <div style="background:var(--s2);border-radius:10px;padding:12px;display:flex;gap:12px;align-items:flex-start">
          <span style="font-size:22px">🏃</span>
          <div><div style="font-weight:700;font-size:13px;color:var(--white);margin-bottom:2px">Allures de course personnalisées</div>
          <div style="font-size:12px;color:var(--gray)">Basées sur ta VMA — ni trop facile, ni trop dur</div></div>
        </div>
        <div style="background:var(--s2);border-radius:10px;padding:12px;display:flex;gap:12px;align-items:flex-start">
          <span style="font-size:22px">💪</span>
          <div><div style="font-weight:700;font-size:13px;color:var(--white);margin-bottom:2px">Circuit renfo adapté</div>
          <div style="font-size:12px;color:var(--gray)">Doses ajustées selon ton âge et ton profil</div></div>
        </div>
        <div style="background:var(--s2);border-radius:10px;padding:12px;display:flex;gap:12px;align-items:flex-start">
          <span style="font-size:22px">🛡️</span>
          <div><div style="font-weight:700;font-size:13px;color:var(--white);margin-bottom:2px">Prévention intégrée</div>
          <div style="font-size:12px;color:var(--gray)">PPP à chaque séance — jamais supprimé, même en version allégée</div></div>
        </div>
      </div>
      <div style="background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);border-radius:10px;padding:12px;font-size:12px;color:var(--yellow);line-height:1.6">
        💡 Si tes allures te semblent trop faciles au début — c\'est <strong>voulu</strong>. Ton corps se souvient vite, la progression est là semaine après semaine.
      </div>`
  },
  {
    icon:'⚠️',
    titre:'Le conseil le plus important',
    contenu:`
      <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:12px;padding:16px;margin-bottom:16px">
        <div style="font-size:15px;font-weight:900;color:var(--white);margin-bottom:10px">Commence doucement. Vraiment.</div>
        <div style="font-size:13px;color:var(--light);line-height:1.8">
          ✅ La première semaine doit te paraître <strong>facile</strong> — c\'est voulu<br>
          ❌ Le risque n°1 en reprise : se cramer dans les 10 premiers jours<br>
          🎯 Mieux vaut arriver <strong>entier</strong> à la reprise collective que blessé dès la S1
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="background:var(--s2);border-radius:10px;padding:12px;font-size:13px;color:var(--light);line-height:1.6">
          🌙 <strong style="color:var(--white)">Sommeil</strong> — 8h minimum pendant la prépa. C\'est là que le corps récupère et progressse.
        </div>
        <div style="background:var(--s2);border-radius:10px;padding:12px;font-size:13px;color:var(--light);line-height:1.6">
          💧 <strong style="color:var(--white)">Hydratation</strong> — Bois avant d\'avoir soif. 1,5L minimum par jour, plus les jours de séance.
        </div>
        <div style="background:var(--s2);border-radius:10px;padding:12px;font-size:13px;color:var(--light);line-height:1.6">
          🥗 <strong style="color:var(--white)">Nutrition</strong> — Mange dans les 30 min après l\'effort. Glucides + protéines = récupération optimale.
        </div>
      </div>`
  },
  {
    icon:'📱',
    titre:'Comment ça marche au quotidien',
    contenu:`
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
        <div style="background:var(--s2);border-radius:12px;padding:14px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="background:var(--red);color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0">1</span>
            <div style="font-weight:700;font-size:14px;color:var(--white)">Avant chaque séance</div>
          </div>
          <div style="font-size:13px;color:var(--light);line-height:1.6">Dis comment tu te sens (😴 Fatigué · 😐 Normal · 🔥 En forme)<br>→ ta séance s\'adapte automatiquement</div>
        </div>
        <div style="background:var(--s2);border-radius:12px;padding:14px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="background:var(--red);color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0">2</span>
            <div style="font-weight:700;font-size:14px;color:var(--white)">Pendant la séance</div>
          </div>
          <div style="font-size:13px;color:var(--light);line-height:1.6">Mode guidé étape par étape · Chrono intégré · Détails PPP avec vidéos</div>
        </div>
        <div style="background:var(--s2);border-radius:12px;padding:14px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="background:var(--red);color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0">3</span>
            <div style="font-weight:700;font-size:14px;color:var(--white)">Après la séance</div>
          </div>
          <div style="font-size:13px;color:var(--light);line-height:1.6">Valide et donne ton RPE (1 = très facile / 10 = épuisant)<br>→ le coach voit ta progression en temps réel</div>
        </div>
      </div>
      <div style="background:linear-gradient(135deg,rgba(17,152,76,.15),rgba(17,152,76,.05));border:1px solid rgba(17,152,76,.3);border-radius:12px;padding:14px;text-align:center">
        <div style="font-size:24px;margin-bottom:6px">💪</div>
        <div style="font-weight:700;font-size:15px;color:var(--white);margin-bottom:4px">C\'est parti !</div>
        <div style="font-size:12px;color:var(--gray)">La prépa individuelle commence le <strong style="color:var(--green)">20 juillet</strong>.<br>En attendant, explore ton programme.</div>
      </div>
      <div id="welcome-install-zone" style="margin-top:12px"></div>`
  }
];

export let _welcomeStep=0;

export function renderWelcomeInstallZone(){
  const z=document.getElementById('welcome-install-zone');
  if(!z) return;
  if(_installPrompt){
    z.innerHTML=`
      <button onclick="triggerInstallFromWelcome()" style="width:100%;padding:14px;background:linear-gradient(135deg,var(--green),#15c55a);border:none;border-radius:12px;color:white;font-weight:700;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px">
        <span style="font-size:20px">📲</span> Installer DHB Prépa sur mon téléphone
      </button>
      <div style="font-size:11px;color:var(--gray);text-align:center;margin-top:6px">Accès direct depuis ton écran d\'accueil — sans passer par le navigateur</div>`;
  } else {
    z.innerHTML=`
      <div style="background:var(--s2);border-radius:12px;padding:12px;text-align:center">
        <div style="font-size:13px;font-weight:700;color:var(--white);margin-bottom:6px">📲 Installer l\'app sur ton écran d\'accueil</div>
        <div style="font-size:12px;color:var(--gray);line-height:1.7">
          <strong style="color:var(--light)">iPhone :</strong> appuie sur <strong>⬆️ Partager</strong> → "Sur l\'écran d\'accueil"<br>
          <strong style="color:var(--light)">Android :</strong> menu <strong>⋮</strong> → "Ajouter à l\'écran d\'accueil"
        </div>
      </div>`;
  }
}

export async function triggerInstallFromWelcome(){
  await triggerInstall();
  const z=document.getElementById('welcome-install-zone');
  if(z) z.innerHTML=`<div style="text-align:center;padding:10px;color:var(--green);font-weight:700;font-size:14px">✅ App installée — à tout de suite sur l\'écran d\'accueil !</div>`;
}

export function showWelcomePopup(prenom){
  _welcomeStep=0;
  renderWelcomeSlide(prenom);
  document.getElementById('modal-welcome').style.display='flex';
}

export function renderWelcomeSlide(prenom){
  const slide=WELCOME_SLIDES[_welcomeStep];
  const total=WELCOME_SLIDES.length;
  const isLast=_welcomeStep===total-1;

  // Dots
  g('welcome-dots').innerHTML=WELCOME_SLIDES.map((_,i)=>
    `<div style="width:${i===_welcomeStep?'20px':'8px'};height:8px;border-radius:999px;background:${i===_welcomeStep?'var(--green)':'var(--s3)'};transition:all .3s"></div>`
  ).join('');

  // Content
  g('welcome-content').innerHTML=`
    <div style="padding-top:16px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:52px;margin-bottom:12px">${slide.icon}</div>
        <div style="font-family:var(--fnt-head);font-size:22px;font-weight:900;color:var(--white);line-height:1.2;margin-bottom:4px">${slide.titre}</div>
        ${_welcomeStep===0&&prenom?`<div style="font-size:14px;color:var(--green);font-weight:700">${prenom} 👊</div>`:''}
      </div>
      ${slide.contenu}
    </div>`;

  // Button
  g('welcome-next-btn').textContent=isLast?'🚀 C\'est parti !':'Suivant →';
  g('welcome-content').scrollTop=0;
  if(isLast) setTimeout(renderWelcomeInstallZone, 50);
}

export function welcomeNext(){
  const total=WELCOME_SLIDES.length;
  if(_welcomeStep<total-1){
    _welcomeStep++;
    const prenom=currentJoueur?.prenom||'';
    renderWelcomeSlide(prenom);
  } else {
    skipWelcome();
  }
}

export function skipWelcome(){
  document.getElementById('modal-welcome').style.display='none';
  try{localStorage.setItem('dhb_welcome_done_'+( currentJoueur?.code||'x'),'1');}catch(e){}
}

export function checkShowWelcome(){
  if(!currentJoueur) return;
  try{
    const done=localStorage.getItem('dhb_welcome_done_'+(currentJoueur.code||'x'));
    if(!done) setTimeout(()=>showWelcomePopup(currentJoueur.prenom||''),600);
  }catch(e){}
}

// Ping Supabase au chargement pour éviter la mise en pause (plan gratuit = pause après 7j sans activité)
export async function pingSupabase(){
  try{ if(sb) await sb.from('meta').select('key').limit(1); }
  catch(e){}
}

export function setupInstallPrompt(){
  window.addEventListener('beforeinstallprompt',(e)=>{
    e.preventDefault();
    _installPrompt=e;
    _installButtonVisible=true;
    updateInstallButton();
  });
  window.addEventListener('appinstalled',()=>{
    _installPrompt=null;
    _installButtonVisible=false;
    updateInstallButton();
  });
}
export function updateInstallButton(){
  const btn=document.getElementById('install-app-btn');
  if(btn){
    btn.style.display=_installButtonVisible?'block':'none';
  }
}
export async function triggerInstall(){
  if(!_installPrompt) return;
  _installPrompt.prompt();
  const {outcome}=await _installPrompt.userChoice;
  _installPrompt=null;
  _installButtonVisible=false;
  updateInstallButton();
}

export function openTimerModal(reps, speed_kmh){
  _timerTotalReps=reps; _timerRep=1; _timerPhase='effort'; _timerSec=120; _timerRunning=false;
  window._timerSpeed=speed_kmh;
  updateTimerDisplay();
  g('timer-start-btn').textContent='▶️ Démarrer';
  openModal('modal-timer');
}
export function toggleTimer(){
  if(_timerRunning){_timerRunning=false;clearInterval(_timerInterval);if(g('timer-start-btn'))g('timer-start-btn').textContent='▶️ Reprendre';}
  else{_timerRunning=true;if(g('timer-start-btn'))g('timer-start-btn').textContent='⏸ Pause';_timerInterval=setInterval(timerTick,1000);}
  updateTimerDisplay();
}
export function startInlineTimer(reps=1, speed_kmh=0, effortSec=120, recupSec=60){
  clearInterval(_timerInterval);
  _timerTotalReps=Math.max(1,Number(reps)||1);
  _timerEffortSec=Math.max(1,Number(effortSec)||120);
  _timerRecupSec=Math.max(0,Number(recupSec)||0);
  _timerRep=1; _timerPhase='effort'; _timerSec=_timerEffortSec; _timerRunning=true;
  window._timerSpeed=Number(speed_kmh)||0;
  updateTimerDisplay();
  _timerInterval=setInterval(timerTick,1000);
}
export function stopTimer(){
  clearInterval(_timerInterval);_timerRunning=false;
  _timerRep=1;_timerPhase='effort';_timerSec=_timerEffortSec||120;
  updateTimerDisplay();
}
export function timerTick(){
  _timerSec--;
  if(_timerSec<=0){
    if(_timerPhase==='effort'){
      _beep(660,.1);_beep(660,.1);
      _timerPhase='recup';_timerSec=_timerRecupSec||60;
    } else {
      if(_timerRep>=_timerTotalReps){
        _beep(880,.2);_beep(1100,.3);
        clearInterval(_timerInterval);_timerRunning=false;
        if(g('timer-phase-label'))g('timer-phase-label').textContent='TERMINÉ ! 🎉';
        if(g('timer-display'))g('timer-display').textContent='0:00';
        if(g('timer-start-btn'))g('timer-start-btn').textContent='✅ Fini';
        if(g('inline-timer-label'))g('inline-timer-label').textContent='TERMINÉ ! 🎉';
        if(g('inline-timer-display'))g('inline-timer-display').textContent='0:00';
        if(g('inline-timer-start'))g('inline-timer-start').textContent='✅ Fini';
        return;
      }
      _beep(440,.15);
      _timerRep++;_timerPhase='effort';_timerSec=_timerEffortSec;
    }
  }
  updateTimerDisplay();
}
export function updateTimerDisplay(){
  const m=Math.floor(_timerSec/60), s=_timerSec%60;
  const timeStr=m+':'+(s<10?'0':'')+s;
  const isEffort=_timerPhase==='effort';
  const label=isEffort?(_timerTotalReps>1?`EFFORT${window._timerSpeed?' — '+window._timerSpeed+' km/h':''}`: 'EN COURS'):'RÉCUPÉRATION';
  const total=isEffort?_timerEffortSec:_timerRecupSec;
  const pct=total>0?Math.round((1-_timerSec/total)*100):0;
  // Modal timer
  if(g('timer-display')) g('timer-display').textContent=timeStr;
  if(g('timer-phase-label')){ g('timer-phase-label').textContent=isEffort?`EFFORT — ${window._timerSpeed||'—'} km/h`:'RÉCUPÉRATION'; g('timer-phase-label').className=isEffort?'timer-effort':'timer-recup'; }
  if(g('timer-rep-label')) g('timer-rep-label').textContent=`Bloc ${_timerRep} / ${_timerTotalReps}`;
  if(g('timer-progress')){ g('timer-progress').style.width=pct+'%'; g('timer-progress').style.background=isEffort?'var(--red)':'var(--green)'; }
  // Inline timer (mode guidé)
  if(g('inline-timer-display')) g('inline-timer-display').textContent=timeStr;
  if(g('inline-timer-label')) g('inline-timer-label').textContent=label;
  if(g('inline-timer-rep')) g('inline-timer-rep').textContent=_timerTotalReps>1?`Bloc ${_timerRep} / ${_timerTotalReps}`:'Chrono simple';
  if(g('inline-timer-fill')){ g('inline-timer-fill').style.width=pct+'%'; g('inline-timer-fill').style.background=isEffort?'var(--red)':'var(--green)'; }
  if(g('inline-timer-start')) g('inline-timer-start').textContent=_timerRunning?'⏸ Pause':'▶ Reprendre';
}


// Prévention blessures (PPP) — 3 niveaux progressifs (source: fichier de référence)
export function getPPP_niveaux(weekIdx){
  // weekIdx 0-1 = niveau 1, 2-3 = niveau 2, 4 = niveau 3
  // Chaque exo : n=nom, d=dosage, note=conseil cle, exec=etapes d'execution,
  // erreur=erreur classique, series/duree/reps = donnees pour le chrono guide.
  const niv = weekIdx<=1?1:weekIdx<=3?2:3;
  const ppps = {
    1:[
      {n:'Équilibre sur une jambe', d:'3×30s/pied — yeux ouverts puis fermés',
       note:'Genou légèrement fléchi, bassin stable',
       series:3, duree:30, cote:true,
       exec:[
         'Tiens-toi sur une jambe, genou légèrement fléchi (jamais verrouillé)',
         'Bassin bien horizontal, regard fixé sur un point devant toi',
         'Tiens 30 secondes, puis recommence les yeux fermés',
         'Change de pied et répète'
       ],
       erreur:'Genou tendu et bloqué — il doit rester souple pour absorber les déséquilibres'},

      {n:'Gainage ventral', d:'3×40s',
       note:'Dos plat, bassin neutre, respiration continue',
       series:3, duree:40, recup:30,
       exec:[
         'En appui sur les avant-bras et la pointe des pieds',
         'Coudes à l\'aplomb des épaules, corps aligné de la tête aux talons',
         'Serre les abdos et les fessiers, respire normalement',
         'Tiens 40 secondes, récupère 30 secondes entre les séries'
       ],
       erreur:'Bassin qui s\'affaisse ou fesses trop hautes — garde le dos parfaitement plat'},

      {n:'Gainage latéral', d:'3×30s/côté',
       note:'Corps aligné, hanche haute',
       series:3, duree:30, cote:true, recup:30,
       exec:[
         'Allongé sur le côté, en appui sur l\'avant-bras, coude sous l\'épaule',
         'Décolle le bassin : le corps forme une ligne droite',
         'Garde la hanche haute pendant toute la série',
         'Tiens 30 secondes de chaque côté'
       ],
       erreur:'Bassin qui redescend en cours de série — mieux vaut arrêter net que tenir mal'},

      {n:'Proprioception genou', d:'2×30s/jambe — balancier de la jambe libre',
       note:'Le genou d\'appui reste aligné avec le pied',
       series:2, duree:30, cote:true,
       exec:[
         'En équilibre sur une jambe, genou d\'appui légèrement fléchi',
         'Balance lentement la jambe libre d\'avant en arrière',
         'Le genou d\'appui reste aligné avec la pointe du pied',
         '30 secondes par jambe'
       ],
       erreur:'Genou qui part vers l\'intérieur — c\'est exactement le mouvement à éviter'},

      {n:'Rotation externe épaule ⭐', d:'3×15/bras avec élastique léger (ou partenaire)',
       note:'Protège l\'épaule du lanceur',
       series:3, reps:15, cote:true,
       exec:[
         'Coude collé au corps et plié à 90°, élastique dans la main',
         'Tourne l\'avant-bras vers l\'extérieur, coude toujours collé',
         'Reviens lentement en 3 secondes, en contrôlant',
         '15 répétitions par bras'
       ],
       erreur:'Coude qui décolle du corps — cale une serviette roulée sous le bras pour le sentir'},
    ],
    2:[
      {n:'Équilibre sur une jambe (dynamique)', d:'3×45s/pied — bouge les bras pour te déstabiliser',
       note:'Fixe un point au mur pour garder l\'équilibre',
       series:3, duree:45, cote:true,
       exec:[
         'En équilibre sur une jambe, genou souple',
         'Bouge les bras dans tous les sens pour te déstabiliser volontairement',
         'Résiste et reviens toujours à la position stable',
         '45 secondes par pied'
       ],
       erreur:'Poser le pied dès que ça vacille — c\'est justement le rattrapage qui fait progresser'},

      {n:'Gainage ventral dynamique', d:'3×45s avec élévations alternées bras/jambe',
       note:'Dos plat absolu — la qualité prime sur la durée',
       series:3, duree:45, recup:30,
       exec:[
         'Position de gainage ventral classique',
         'Décolle un bras 2 secondes, repose, puis la jambe opposée 2 secondes',
         'Alterne sans jamais laisser le bassin tourner',
         '45 secondes par série'
       ],
       erreur:'Bassin qui bascule à chaque élévation — ralentis et réduis l\'amplitude'},

      {n:'Gainage latéral dynamique', d:'3×40s/côté — monte/descends le bassin lentement',
       note:'Bassin stable, corps aligné',
       series:3, duree:40, cote:true, recup:30,
       exec:[
         'Position de gainage latéral, coude sous l\'épaule',
         'Descends le bassin lentement vers le sol sans jamais le poser',
         'Remonte en poussant sur l\'appui, corps toujours aligné',
         '40 secondes par côté'
       ],
       erreur:'Aller trop vite — le mouvement doit être lent et contrôlé'},

      {n:'Sauts sur une jambe ⭐', d:'3×6 sauts/jambe — stabilise 2s à la réception',
       note:'Contrôle le genou à la réception',
       series:3, reps:6, cote:true,
       exec:[
         'Sur une jambe, saute vers l\'avant',
         'À la réception, stabilise 2 secondes avant le saut suivant',
         'Genou fléchi et aligné avec la pointe du pied',
         '6 sauts puis change de jambe'
       ],
       erreur:'Réception jambe tendue ou genou rentrant — c\'est le mécanisme n°1 de l\'entorse'},

      {n:'Rotation externe épaule (freinage)', d:'3×12/bras — descente lente 4 secondes',
       note:'Descente lente — prévient la tendinite',
       series:3, reps:12, cote:true,
       exec:[
         'Coude collé au corps et plié à 90°, élastique tendu',
         'Tourne l\'avant-bras vers l\'extérieur à vitesse normale',
         'Reviens très lentement en 4 secondes, en freinant l\'élastique',
         '12 répétitions par bras'
       ],
       erreur:'Laisser l\'élastique te ramener vite — tout le bénéfice est dans le freinage'},
    ],
    3:[
      {n:'Proprioception cheville', d:'2×45s/pied sur surface instable (coussin)',
       note:'Reste stable malgré le déséquilibre',
       series:2, duree:45, cote:true,
       exec:[
         'Monte sur un coussin, un tapis plié ou une serviette roulée',
         'Tiens-toi sur une jambe, genou souple',
         'Cherche la stabilité en acceptant les micro-corrections',
         '45 secondes puis change de pied'
       ],
       erreur:'Vouloir ne plus bouger du tout — les micro-ajustements sont justement le travail'},

      {n:'Gainage en coordination', d:'3×50s — enchaîne ventral/latéral/dos, progressif',
       note:'Garde le contrôle en accélérant',
       series:3, duree:50, recup:45,
       exec:[
         'Enchaîne sans pause : ventral 15s, latéral droit 12s, latéral gauche 12s, dos 11s',
         'Passe d\'une position à l\'autre en gardant le corps gainé',
         'Récupère 45 secondes entre les séries'
       ],
       erreur:'Se relâcher pendant les transitions — c\'est là que le gainage doit tenir'},

      {n:'Sauts genou-poitrine stabilisés ⭐', d:'3×8 sauts — réception sur un pied',
       note:'Le genou reste aligné à l\'atterrissage',
       series:3, reps:8,
       exec:[
         'Saut vertical, genoux remontés vers la poitrine',
         'Réception sur un seul pied, stabilise 2 secondes',
         'Alterne le pied de réception à chaque saut',
         '8 sauts par série'
       ],
       erreur:'Réception bruyante et raide — amortis en fléchissant genou et hanche'},

      {n:'Appuis et changements de direction', d:'3×10 — déplacements rapides avec relances',
       note:'Reste bas, genou aligné, gainé',
       series:3, reps:10,
       exec:[
         'Déplacements latéraux rapides sur 3 à 4 mètres',
         'Touche le sol de la main à chaque extrémité',
         'Reste bas, genoux fléchis, appuis actifs',
         '10 allers-retours par série, récup 1 minute'
       ],
       erreur:'Se redresser entre les changements — reste en position basse tout du long'},

      {n:'Rotation externe en position d\'armer', d:'3×15/bras élastique — coude haut',
       note:'Reproduit le geste de tir',
       series:3, reps:15, cote:true,
       exec:[
         'Bras à l\'horizontale, coude haut plié à 90° (position d\'armé du tir)',
         'Élastique en main, tourne l\'avant-bras vers l\'arrière',
         'Reviens lentement en contrôlant la tension',
         '15 répétitions par bras'
       ],
       erreur:'Coude qui descend sous la ligne de l\'épaule — garde-le haut'},
    ]
  };
  return {niveau:niv, exos:ppps[niv]};
}
// ══ HELPERS MATÉRIEL ══
export function hasMat(j,t){const m=j.materiel||[];if(t==='salle')return m.includes('Salle de muscu');if(t==='elast')return m.includes('Élastiques')||m.includes('Salle de muscu');return true;}
export function mTag(t){
  if(t==='salle')return ' <span style="font-size:9px;background:rgba(59,130,246,.15);color:#60a5fa;padding:1px 5px;border-radius:8px;font-weight:600">🏋️ SALLE</span>';
  if(t==='elast')return ' <span style="font-size:9px;background:rgba(245,158,11,.12);color:#fbbf24;padding:1px 5px;border-radius:8px;font-weight:600">🟡 ÉLASTIQUE</span>';
  return ' <span style="font-size:9px;background:rgba(34,197,94,.1);color:#4ade80;padding:1px 5px;border-radius:8px;font-weight:600">✅ SANS MATÉRIEL</span>';
}

// ══════════════════════════════════════════════════
// PHASE INDIVIDUELLE (5 semaines) — séances adaptées au profil
// ══════════════════════════════════════════════════
export function getPPP_niveauxIndiv(weekIdx){
  // 5 semaines : S1-S2 niv1, S3-S4 niv2, S5 niv1 (décharge)
  const niv = weekIdx<=1?1:weekIdx<=3?2:1;
  return getPPP_niveaux(niv===1?0:niv===2?2:0);
}

// ══════════════════════════════════════════════════════════════════════════════
// NOUVEAU PROGRAMME PHASE 2 — 5 semaines — Draveil HB D2
// Lohan Boulard, Directeur Sportif
//
// Philosophie :
//   S1 (Mardi) = Renfo + Cardio intégré — puissance & intensité
//   S2 (Jeudi) = Cardio dominant + Renfo léger — endurance & volume
//   S3 (Facultative) = Récupération active
//
// Progression :
//   Sem 1 : reprise sérieuse, corpo réveille
//   Sem 2 : première vraie claque — sortir épuisé
//   Sem 3-4 : intensification franche — fractionné court, renfo lourd
//   Sem 5 : affûtage — intensité haute, volume réduit
//
// Individualisation :
//   VMA  → allures personnalisées (fond/seuil/puissance/récup)
//   Groupe A/B/C → % VMA adaptés
//   Profil adapt → âge/IMC → modifie impact, récup, charge
//   Ressenti → ajuste volume et intensité
//   Matériel → descriptions adaptées (aucun/élastiques/salle)
// ══════════════════════════════════════════════════════════════════════════════

// ── Helpers de mise en forme ─────────────────────────────────────────────────
function v(vma, pct){ return Math.round(vma*pct*10)/10; }
function pace(vma, pct){ return kmhToMinKm(v(vma,pct)); }

// ── Blocs communs réutilisables ───────────────────────────────────────────────
function blocEchauffementCourse(specifique=''){
  return {
    titre:'Échauffement', duree:600, icone:'🔥',
    detail:
      '<strong>10 min — ne zappe pas cette partie :</strong><br>'+
      '① <strong>3 min</strong> footing très lent (allure conversation)<br>'+
      '② <strong>2 min mobilité articulaire :</strong> cercles bras (10×) · rotations hanches (10×/sens) · cercles chevilles (10×/pied)<br>'+
      '③ <strong>3 min gammes :</strong> montées de genoux 20m · talons-fesses 20m · pas chassés latéraux 20m · foulées bondissantes 20m<br>'+
      (specifique ? '④ '+specifique : '④ <strong>2 × 30m</strong> accélérations progressives (finir à 80-85%)')
  };
}

function blocEchauffementRenfo(){
  return {
    titre:'Échauffement dynamique', duree:480, icone:'🔥',
    detail:
      '<strong>8 min — activation neuromusculaire :</strong><br>'+
      '① <strong>3 min</strong> footing léger<br>'+
      '② <strong>Mobilité :</strong> cercles bras (10×) · rotations hanches (10×/sens) · squats profonds lents 10×<br>'+
      '③ <strong>Activation :</strong> jumping jacks 30s · fentes alternées 10× · pompes 5× lentes<br>'+
      '④ <strong>2 × 20m</strong> montées de genoux rapides'
  };
}

function blocRetourCalme(long=false){
  if(long) return {
    titre:'Retour au calme', duree:480, icone:'🧘',
    detail:
      '<strong>8 min — prends ton temps :</strong><br>'+
      '① <strong>2 min</strong> marche tranquille<br>'+
      '② Ischios : assis jambes tendues, penche le buste · <strong>45s/jambe</strong><br>'+
      '③ Quadriceps : debout, talon aux fesses · <strong>45s/jambe</strong><br>'+
      '④ Mollets : pied contre mur, jambe tendue · <strong>30s/jambe</strong><br>'+
      '⑤ Fessiers : allongé, genou sur la poitrine · <strong>30s/jambe</strong><br>'+
      '⑥ Épaules : bras croisé devant · <strong>30s/côté</strong><br>'+
      '⑦ Dos : chat-vache 10× · torsion assise 30s/côté',
    note:'Corps fatigué → étirements prolongés = meilleure récupération'
  };
  return {
    titre:'Retour au calme', duree:300, icone:'🧘',
    detail:
      '<strong>5 min :</strong><br>'+
      '① <strong>2 min</strong> marche tranquille<br>'+
      '② Ischios : assis jambes tendues · <strong>30s/jambe</strong><br>'+
      '③ Quadriceps : debout, talon aux fesses · <strong>30s/jambe</strong><br>'+
      '④ Mollets : pied contre mur · <strong>20s/jambe</strong><br>'+
      '⑤ Épaules : bras croisé devant · <strong>20s/côté</strong>'
  };
}

function blocPPP(weekIdx){
  const ppp=getPPP_niveauxIndiv(weekIdx);
  return {
    titre:`🛡️ Prévention blessures — Niveau ${ppp.niveau}/3`,
    icone:'🛡️', isPPP:true, pppExos:ppp.exos,
    note:`Semaine ${weekIdx+1} — ne zappe pas, c'est ce qui évite les blessures`
  };
}

// ════════════════════════════════════════════════════════════════════════════
// SÉANCE 1 (MARDI) — Renfo + Cardio intégré
// Puissance & intensité — les mecs sortent les jambes chargées
// ════════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════════
// PROGRAMME PHASE 2 v2 — 5 semaines — Draveil HB D2
// Séances UNIQUES chaque semaine — exercices qui varient
// Vidéos YouTube pour les exercices techniques
// Appuis handball adaptés domicile/vacances
// ══════════════════════════════════════════════════════════════════════════════

// ── Vidéos YouTube (courtes, techniques, en français quand possible) ──────────
const VIDEOS = {
  rdl_unilateral:    'https://www.youtube.com/watch?v=sZ8LIkA5J_A',
  bird_dog:          'https://www.youtube.com/watch?v=ZmW47SX0lts',
  dead_bug:          'https://www.youtube.com/watch?v=4y54_ndGrdw',
  pallof_press:      'https://www.youtube.com/watch?v=I4SKLCM9lyo',
  drop_jump:         'https://www.youtube.com/watch?v=Go8tLWqB83k',
  squat_1j:          'https://www.youtube.com/watch?v=vq5-vdgJc0I',
  nordic_curl:      'https://www.youtube.com/watch?v=EC8eS5Pbns4',
  hip_thrust:       'https://www.youtube.com/watch?v=MI3sJbT_F_Y',
  squat_bulgare:    'https://www.youtube.com/watch?v=eCJxHKDXBqk',
  carioca:          'https://www.youtube.com/watch?v=R3__Q_SulyM',
  pompes_explosives:'https://www.youtube.com/watch?v=q81G2BauO18',
  burpees:          'https://www.youtube.com/watch?v=TU8QYVW0gDU',
  fente_sautee:     'https://www.youtube.com/watch?v=Bf5JQ5jgRoo',
  squat_saute:      'https://www.youtube.com/watch?v=A-cFYWvaHr0',
  superman:         'https://www.youtube.com/watch?v=cc6UVRS7PW4',
  shuffle_lateral:  'https://www.youtube.com/watch?v=TS3tHxUzpTk',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function vit(vma, pct){ return Math.round(vma*pct*10)/10; }
function allure(vma, pct){ return kmhToMinKm(vit(vma,pct)); }
function fv(base, ressenti){ return ressenti==='fatigue'?Math.round(base*0.75):ressenti==='enforme'?Math.round(base*1.15):base; }

// ── Bloc échauffement course ──────────────────────────────────────────────────
function echauffCourse(extra=''){
  return {titre:'Échauffement', duree:600, icone:'🔥',
    detail:'<strong>10 min :</strong><br>'+
      '① <strong>3 min</strong> footing très lent<br>'+
      '② <strong>2 min mobilité :</strong> cercles bras · rotations hanches · cercles chevilles<br>'+
      '③ <strong>3 min gammes :</strong> montées de genoux 20m · talons-fesses 20m · pas chassés 20m · foulées bondissantes 20m<br>'+
      (extra||'④ <strong>2×30m</strong> accélérations progressives')};
}

// ── Bloc échauffement renfo ───────────────────────────────────────────────────
function echauffRenfo(){
  return {titre:'Échauffement dynamique', duree:480, icone:'🔥',
    detail:'<strong>8 min :</strong><br>'+
      '① <strong>3 min</strong> footing léger<br>'+
      '② Mobilité : cercles bras · rotations hanches · squats profonds lents 10×<br>'+
      '③ Activation : jumping jacks 30s · fentes 10× · pompes 5× lentes<br>'+
      '④ <strong>2×20m</strong> montées de genoux rapides'};
}

// ── Retour au calme ───────────────────────────────────────────────────────────
function retourCalme(long=false){
  if(long) return {titre:'Retour au calme', duree:480, icone:'🧘',
    detail:'<strong>8 min :</strong><br>'+
      '① 2 min marche tranquille<br>'+
      '② Ischios : assis jambes tendues · <strong>45s/jambe</strong><br>'+
      '③ Quadriceps : talon aux fesses · <strong>45s/jambe</strong><br>'+
      '④ Fessiers : genou sur la poitrine · <strong>30s/jambe</strong><br>'+
      '⑤ Mollets : pied contre mur · <strong>30s/jambe</strong><br>'+
      '⑥ Adducteurs : papillon assis · <strong>1 min</strong><br>'+
      '⑦ Dos : chat-vache 10× · torsion assise 30s/côté',
    note:'Corps fatigué → étirements longs = meilleure récupération'};
  return {titre:'Retour au calme', duree:300, icone:'🧘',
    detail:'<strong>5 min :</strong><br>'+
      '① 2 min marche<br>'+
      '② Ischios : <strong>30s/jambe</strong><br>'+
      '③ Quadriceps : <strong>30s/jambe</strong><br>'+
      '④ Mollets : <strong>20s/jambe</strong><br>'+
      '⑤ Épaules : bras croisé · <strong>20s/côté</strong>'};
}

// ── PPP ───────────────────────────────────────────────────────────────────────
function ppp(weekIdx){
  const p=getPPP_niveauxIndiv(weekIdx);
  return {titre:`🛡️ Prévention blessures — Niveau ${p.niveau}/3`, icone:'🛡️',
    isPPP:true, pppExos:p.exos,
    note:`Semaine ${weekIdx+1} — ne zappe pas, c'est ce qui t\\'évite les blessures`};
}

// ── Exo helper ────────────────────────────────────────────────────────────────
function exo(titre, icone, detail, note, videoKey=null, variante=null){
  return {titre, icone, detail, note, ...(videoKey?{videoUrl:VIDEOS[videoKey]}:{}), ...(variante?{variante}:{})};
}

// ════════════════════════════════════════════════════════════════════════════════
// SÉANCE 1 (MARDI) — Renfo + Cardio intégré
// ════════════════════════════════════════════════════════════════════════════════
export function genIndivCardio(weekIdx, joueur, ressenti='normal'){
  const vma   = joueur.vma||13;
  const adapt  = getProfilAdapt(joueur);
  const gr    = getGroupe(vma);
  const si    = adapt.sansImpact;
  const menager = adapt.profil==='menager';
  const noteImpact = si?'🔵 Articulations : adapte les sauts en version sans impact (squat lent plutôt que sauté, fentes lentes). Le renfo reste identique.':null;

  // Allures selon groupe
  const pctS  = gr==='A'?0.85:gr==='B'?0.82:0.78;
  const pctV  = gr==='A'?0.93:gr==='B'?0.89:0.85;
  const pctM  = gr==='A'?0.97:gr==='B'?0.93:0.90;

  // ── SEMAINE 1 : Réveil — body weight qualité + endurance ─────────────────
  if(weekIdx===0){
    const nT = fv(menager?2:3, ressenti);
    const renfo = {
      titre:`Circuit Réveil — ${nT} passages`, icone:'💪',
      detail:`<strong>${nT} passages · 30s effort · 30s récup · 90s récup entre passages</strong><br>Sur chaque exercice : 30 secondes à fond, 30 secondes de récup, puis exercice suivant. Quand tous les exercices sont faits : 90s récup et tu recommences.`,
      sousBlocs:[
        exo('Squat poids du corps','🦵',
          '<strong>40s — max de reps :</strong><br>① Pieds largeur épaules, pointes vers l\'extérieur<br>② Descente lente <strong>3s</strong> cuisses parallèles, genoux dans l\'axe<br>③ Remontée explosive en poussant dans les talons<br>④ Dos droit, regard devant',
          'Genoux dans l\'axe — ne les laisse jamais rentrer vers l\'intérieur'),
        exo('Pompes','💪',
          '<strong>40s — max de reps :</strong><br>① Mains légèrement + larges que les épaules<br>② Descente lente <strong>2s</strong>, poitrine près du sol<br>③ Remontée explosive · Sur les genoux si besoin mais amplitude complète<br>④ Corps gainage de la tête aux pieds',
          'Qualité > quantité — 8 pompes propres > 20 bancales'),
        exo('Fentes alternées','🦵',
          '<strong>40s — alterne G/D :</strong><br>① Grand pas en avant, genou avant à 90°, genou arrière près du sol<br>② Descente <strong>2s</strong>, genou avant dans l\'axe du pied<br>③ Remontée en poussant sur le talon avant',
          'Genou avant ne dépasse pas la pointe du pied'),
        exo('Gainage ventral','🔷',
          '<strong>40s :</strong><br>① Appui avant-bras et pointes de pieds, coudes sous les épaules<br>② Corps aligné tête-talons, serre abdos ET fessiers<br>③ Respire normalement — pas en apnée',
          'Fesses ni trop hautes ni qui s\'affaissent'),
        exo('Bird Dog','🔷',
          '<strong>10 reps/côté :</strong><br>① À quatre pattes, dos plat, regard vers le sol<br>② Tends simultanément bras droit + jambe gauche<br>③ Tiens <strong>3 secondes</strong>, bassin horizontal<br>④ Reviens lentement puis côté opposé',
          'Ne laisse pas le dos se creuser — sens la contraction profonde', 'bird_dog'),
        exo('Romanian Deadlift unilatéral','🦵',
          '<strong>8 reps/jambe :</strong><br>① Debout sur une jambe, l\'autre tendue vers l\'arrière<br>② Penche le buste en avant dos plat, jambe arrière qui monte<br>③ Descends jusqu\'à sentir l\'étirement dans l\'ischio<br>④ Remonte en contractant le fessier · Tiens-toi au mur si besoin',
          'Le handball est asymétrique — travail unilatéral dès S1. Dos plat obligatoire.', 'rdl_unilateral'),
        exo('Squat une jambe assisté','🦵',
          '<strong>6 reps/jambe :</strong><br>① Face à un mur, bout des doigts pour l\'équilibre<br>② Lève une jambe, descends sur l\'autre le plus bas possible<br>③ Remonte en poussant dans le talon · Enlève progressivement l\'appui des mains',
          'Variante : assis sur chaise, relève-toi sur une seule jambe sans les bras', 'squat_1j'),
        exo('Burpees','🔥',
          '<strong>30s — finisseur :</strong><br>① Debout → accroupi → planche → retour → saut bras levés<br>② Rythme régulier · Variante sans saut si articulations inconfortables',
          'Rythme constant', 'burpees'),
      ]
    };
    const nC = fv(2, ressenti);
    const cardio = {titre:`Cardio soutenu — ${nC}×8 min`, icone:'🏃', duree:480,
      detail:`<strong>${nC} × 8 minutes</strong> à <strong>${vit(vma,pctS)} km/h (${allure(vma,pctS)}/km)</strong><br><strong>3 min récup active</strong> (marche) entre les blocs.<br>Effort soutenu — tu sens l'effort mais tu tiens les 8 min.`,
      note:`Groupe ${gr} · ${Math.round(pctS*100)}% VMA · Reveil cardio-vasculaire`};
    return _build(weekIdx,'S1 — Réveil musculaire + Endurance','50-55 min',ressenti,noteImpact,[echauffRenfo(),renfo,cardio,ppp(weekIdx),retourCalme(ressenti==='fatigue')]);
  }

  // ── SEMAINE 2 : Explosivité + Fractionné moyen ────────────────────────────
  if(weekIdx===1){
    const nT = fv(menager?3:4, ressenti);
    const renfo = {
      titre:`Circuit Explosivité — ${nT} passages`, icone:'⚡',
      detail:`<strong>${nT} passages · 35s effort · 25s récup · 90s récup entre passages</strong><br>On passe à la vitesse supérieure — les mecs sortent fatigués.`,
      sousBlocs:[
        exo('Squat sauté','🦵',
          '<strong>45s — explosivité :</strong><br>① Squat complet descente <strong>3s</strong><br>② Remontée explosive avec saut, bras dans le dos<br>③ Réception souple genoux fléchis — jamais verrouillés<br>④ Enchaîne immédiatement',
          'Réception souple — genou dans l\'axe', 'squat_saute',
          'Sans saut : squat lent 4s descente, remontée rapide'),
        exo('Fente sautée','🦵',
          '<strong>45s — alternance en saut :</strong><br>① Fente basse<br>② Saut pour changer de jambe en l\'air<br>③ Réception souple en fente de l\'autre côté',
          'Si genoux tirent : fentes alternées sans saut', 'fente_sautee'),
        exo('Pompes déclinées','💪',
          '<strong>45s :</strong><br>① Pieds sur chaise ou mur, mains au sol<br>② Descente lente <strong>3s</strong>, front vers le sol<br>③ Remontée explosive<br>④ Variante : pompes normales si pas de support',
          'Corps droit — hanches qui ne s\'affaissent pas'),
        exo('Bird Dog dynamique','🔷',
          '<strong>10 reps/côté :</strong><br>① À quatre pattes · Tends bras droit + jambe gauche simultanément<br>② Tiens 2s, reviens et enchaîne sans poser par terre<br>③ Bassin parfaitement horizontal tout le long',
          'Version dynamique — plus intense que le statique', 'bird_dog'),
        exo('Saut vertical + réception contrôlée','⚡',
          '<strong>8 reps :</strong><br>① Squat rapide puis saut le plus haut possible<br>② Réception deux pieds, genoux fléchis 90°, pieds à plat<br>③ Tiens la réception <strong>2 secondes</strong> — bassin stable, genoux dans l\'axe',
          'La qualité de l\'atterrissage compte autant que la hauteur — prévention LCA'),
        exo('Nordic Curl','🦵',
          '<strong>Max reps :</strong><br>① Pieds coincés sous un meuble lourd ou tenus par quelqu\'un<br>② Corps droit, chute lente <strong>4-5 secondes</strong> en freinant avec les ischios<br>③ Mains pour se rattraper, remontée avec les bras<br>④ Même 3 reps propres = excellent',
          'L\'exercice anti-blessure ischios n°1 — indispensable pour les handballeurs', 'nordic_curl'),
        exo('Burpees enchaînés','🔥',
          '<strong>45s — finisseur total :</strong><br>① Planche + pompe + retour + saut bras levés<br>② Rythme le plus rapide possible en gardant la qualité',
          'Vide les réservoirs — donne tout', 'burpees'),
      ]
    };
    const nR = fv(6, ressenti);
    const cardio = {titre:`Fractionné — ${nR}×3 min`, icone:'⚡', duree:180,
      detail:`<strong>${nR} × 3 minutes</strong> à <strong>${vit(vma,pctV)} km/h (${allure(vma,pctV)}/km)</strong><br><strong>2 min récup active</strong> entre chaque.<br>Effort intense — phrases courtes possibles seulement.`,
      note:`Groupe ${gr} · ${Math.round(pctV*100)}% VMA · Après le renfo = simulation match`};
    return _build(weekIdx,'S2 — Explosivité + Fractionné','55-60 min',ressenti,noteImpact,[echauffRenfo(),renfo,cardio,ppp(weekIdx),retourCalme(ressenti==='fatigue')]);
  }

  // ── SEMAINE 3 : Force lourde + Fractionné court ───────────────────────────
  if(weekIdx===2){
    const nTF = fv(menager?3:4, ressenti);
    const nTP = fv(menager?2:3, ressenti);
    const renfo = {
      titre:'Double circuit — Force puis Puissance', icone:'💪',
      detail:`<strong>Circuit A (Force) — ${nTF} passages · 40s effort · 20s récup</strong><br><strong>Circuit B (Puissance) — ${nTP} passages · 30s effort · 30s récup</strong><br>Circuit A : force lourde 40s/20s. Circuit B : puissance explosive 30s/30s.`,
      sousBlocs:[
        exo('[A] Squat Bulgare','🦵',
          '<strong>8 reps/jambe :</strong><br>① Pied arrière posé sur chaise ou canapé, pied avant loin devant<br>② Descente très lente <strong>4s</strong>, genou arrière vers le sol<br>③ Remontée en poussant dans le talon avant<br>④ 8 reps d\'un côté, puis de l\'autre',
          'L\'exercice le plus efficace pour ischios et fessiers — plus dur qu\'il n\'y paraît', 'squat_bulgare'),
        exo('[A] Hip Thrust','🍑',
          '<strong>12 reps :</strong><br>① Épaules sur chaise ou canapé, pieds à plat, genoux à 90°<br>② Monte les hanches en serrant fort les fessiers<br>③ Tiens <strong>2s</strong> en haut, descends lentement <strong>3s</strong><br>④ Sac à dos lesté si trop facile',
          'Pousse dans les talons, serre les fessiers fort en haut', 'hip_thrust'),
        exo('[A] Nordic Curl — série longue','🦵',
          '<strong>6-8 reps :</strong><br>① Chute lente <strong>5s</strong>, freine avec tes ischios<br>② 2 min récup entre passages — c\'est intense',
          'Si moins de 4 reps : chute 3s, c\'est déjà très bien', 'nordic_curl'),
        exo('[A] Superman','🔷',
          '<strong>12 reps :</strong><br>① Allongé face au sol, bras tendus devant<br>② Décolle simultanément bras et jambes, <strong>2s en haut</strong><br>③ Descends lentement <strong>3s</strong><br>④ Chaîne postérieure complète',
          'Dos, fessiers, ischios — tout en même temps', 'superman'),
        exo('[B] Squat sauté max','⚡',
          '<strong>30s — saut le plus haut possible :</strong><br>① Squat profond puis saut explosif<br>② Réception souple · Enchaîne immédiatement',
          'C\'est là que tu vois qui a travaillé cet été'),
        exo('[B] Pompes explosives','💪',
          '<strong>30s :</strong><br>① Remontée explosive, essaie de décoller les mains<br>② Claque des mains si tu y arrives',
          'Explosivité pectoraux', 'pompes_explosives'),
        exo('[B] Fente sautée max','⚡',
          '<strong>30s — rythme maximum :</strong><br>① Saut en changeant de jambe à chaque répétition<br>② Rythme maximal · 45s récup entre passages',
          'Finisseur — vide les réservoirs', 'fente_sautee'),
        exo('[B] Drop Jump + rebond','⚡',
          '<strong>6 reps :</strong><br>① Monte sur une marche ou step (20-30 cm) · Descends en tombant sur 2 pieds<br>② Dès que les pieds touchent le sol, resaute immédiatement<br>③ Contact au sol le plus court possible · Genoux dans l\'axe<br>④ Sans step : squat bas puis remonter le plus vite possible',
          'Pliométrie — le temps de contact au sol doit être minimal', 'drop_jump'),
      ]
    };
    const nR = fv(8, ressenti);
    const cardio = {titre:`Fractionné court — ${nR}×1 min`, icone:'⚡', duree:60,
      detail:`<strong>${nR} × 1 minute</strong> à <strong>${vit(vma,pctM)} km/h (${allure(vma,pctM)}/km)</strong><br><strong>1 min 30 récup</strong> · Effort maximal — simulation sprint handball.`,
      note:`Groupe ${gr} · ${Math.round(pctM*100)}% VMA · Après le renfo lourd = fin de match`};
    return _build(weekIdx,'S3 — Force + Puissance + Sprint','55-60 min',ressenti,noteImpact,[echauffRenfo(),renfo,cardio,ppp(weekIdx),retourCalme(ressenti==='fatigue')]);
  }

  // ── SEMAINE 4 : Peak volume — la plus dure 🔥🔥 ──────────────────────────
  if(weekIdx===3){
    const nTA = fv(menager?3:5, ressenti);
    const nTB = fv(menager?2:3, ressenti);
    const renfo = {
      titre:`Circuit Peak — Force ${nTA} passages + Puissance ${nTB} passages`, icone:'🔥',
      detail:`<strong>Circuit A — ${nTA} passages · 45s effort · 15s récup</strong><br><strong>Circuit B — ${nTB} passages · 30s effort · 30s récup</strong><br>La séance la plus dure du cycle — 45s à fond sur chaque exercice, 15s pour passer au suivant.`,
      sousBlocs:[
        exo('[A] Squat bulgare leste','🦵',
          '<strong>10 reps/jambe :</strong><br>① Pied arrière sur chaise, sac à dos lesté ou haltères si dispo<br>② Descente <strong>3s</strong>, genou arrière au sol<br>③ Remontée explosive — pousse dans le talon',
          'Charge max du cycle — si douleur au genou, passe en poids de corps', 'squat_bulgare'),
        exo('[A] Hip Thrust unilatéral','🍑',
          '<strong>10 reps/jambe :</strong><br>① Épaules sur chaise, UN pied au sol, l\'autre jambe levée<br>② Monte les hanches sur une seule jambe<br>③ Tiens <strong>2s</strong> en haut · Descends <strong>3s</strong>',
          'Encore plus dur que le bilatéral — renforce la stabilité', 'hip_thrust'),
        exo('[A] Dead Bug','🔷',
          '<strong>10 reps/côté :</strong><br>① Allongé dos, bras tendus vers plafond, hanches et genoux à 90°<br>② Expire lentement en descendant bras droit + jambe gauche vers le sol<br>③ Dos collé au sol tout le long — c\'est le gainage qui tient<br>④ Remonte lentement · Côté opposé',
          'Expire à l\'effort — un dos qui se décolle = réajuste immédiatement', 'dead_bug'),
        exo('[A] Pallof Press','🔷',
          '<strong>12 reps/côté :</strong><br>① Fixe un élastique à hauteur poitrine (porte, arbre)<br>② Debout de côté · Tiens l\'élastique plié à la poitrine<br>③ Tends les bras lentement devant toi — résiste à la rotation<br>④ Reviens à la poitrine · Sans élastique : gainage latéral avec rotation contrôlée',
          'Anti-rotation — protège le dos et les hanches des handballeurs', 'pallof_press'),
        exo('[A] Nordic Curl — série complète','🦵',
          '<strong>8-10 reps :</strong><br>① Chute la plus lente possible · 5s objectif<br>② 2 min récup — ischios à bloc',
          'Volume maximum du cycle sur les ischios', 'nordic_curl'),
        exo('[A] Pistol Squat aidé','🦵',
          '<strong>6 reps/jambe :</strong><br>① Debout sur une jambe, l\'autre tendue devant<br>② Descends sur la jambe d\'appui en tenant le mur ou une chaise d\'une main<br>③ Remonte lentement<br>④ Variante : assis sur chaise, relève-toi sur une jambe sans les bras',
          'L\'exercice unilatéral ultime — simule les appuis de handball'),
        exo('[B] Saut en longueur + réception 1 jambe','⚡',
          '<strong>6 reps/jambe :</strong><br>① Saute vers l\'avant le plus loin possible<br>② Réception sur une seule jambe · Genou fléchi · Bassin stable<br>③ Tiens <strong>3 secondes</strong> sans perdre l\'équilibre<br>④ Alterne jambe droite et gauche',
          'Simule les réceptions en jeu — genou dans l\'axe à l\'atterrissage'),
        exo('[B] Squat sauté enchaîné','⚡',
          '<strong>40s — sauts continus :</strong><br>① Squat profond + saut le plus haut · Réception souple · Enchaîne sans pause · 15s récup',
          'Le plus de répétitions possibles — qualité des atterrissages'),
        exo('[B] Pompes + fente sautée enchaînées','💪',
          '<strong>40s :</strong><br>① 5 pompes explosives puis immédiatement 5 fentes sautées<br>② Recommence pendant 40s · 15s récup',
          'Enchaînement upper + lower body — ça fait mal'),
        exo('[B] Burpees lestés ou normaux','🔥',
          '<strong>40s — finisseur absolu :</strong><br>① Burpee complet avec pompe et saut · Rythme maximum · 15s récup<br>② Sac à dos léger si tu veux surcharger',
          'Dernier bloc du pic de charge — vide complètement les réservoirs', 'burpees'),
      ]
    };
    const nB = fv(4, ressenti);
    const nF = fv(5, ressenti);
    const cardio = {titre:`Fractionné long + Finisseur`, icone:'⚡', duree:300,
      detail:`<strong>Phase 1 : ${nB}×5 min</strong> à <strong>${vit(vma,pctS)} km/h (${allure(vma,pctS)}/km)</strong> · 3 min récup<br><strong>Phase 2 : ${nF}×30s</strong> à <strong>${vit(vma,pctM)} km/h (${allure(vma,pctM)}/km)</strong> · 30s récup<br>Phase 2 = finisseur maximal après les blocs longs.`,
      note:`${Math.round(pctS*100)}% puis ${Math.round(pctM*100)}% VMA · C\'est supposé faire très mal`};
    return _build(weekIdx,'S4 — Peak charge 🔥🔥','60-65 min',ressenti,noteImpact,[echauffRenfo(),renfo,cardio,ppp(weekIdx),retourCalme(ressenti==='fatigue')]);
  }

  // ── SEMAINE 5 : Affûtage explosif ⚡ ──────────────────────────────────────
  const nT = fv(menager?2:3, ressenti);
  const renfo = {
    titre:`Circuit Affûtage — ${nT} passages`, icone:'⚡',
    detail:`<strong>${nT} passages · 30s effort · 30s récup — explosivité et fraîcheur</strong><br>30 secondes à fond, 30 secondes de récup. Objectif : rester explosif et frais pour le collectif.`,
    sousBlocs:[
      exo('Squat sauté explosif','⚡','<strong>30s — saut maximum :</strong><br>Squat + saut le plus haut · Réception souple','Qualité des sauts — pas de volume', 'squat_saute'),
      exo('Pompes explosives','💪','<strong>30s — puissance pectoraux :</strong><br>Remontée explosive, mains qui décollent si possible','Explosivité pure', 'pompes_explosives'),
      exo('Fente sautée','⚡','<strong>30s — jambes explosives :</strong><br>Saut en changeant de jambe · Rythme maximum','Reste rapide et léger', 'fente_sautee'),
      exo('Nordic Curl entretien','🦵','<strong>5 reps :</strong><br>Chute 5s · On ne relâche pas la prévention<br>Volume réduit mais maintenu','Maintenir les gains ischios avant le collectif', 'nordic_curl'),
      exo('Saut en longueur + réception contrôlée','⚡',
        '<strong>5 reps/jambe :</strong><br>① Saute vers l\'avant · Réception sur une jambe · Tiens 3s<br>② Léger et explosif — activation pré-collectif<br>③ Genoux dans l\'axe à chaque atterrissage',
        'Activation des réceptions avant la reprise collective'),
      exo('Gainage 360°','🔷','<strong>30s ventral + 30s latéral D + 30s latéral G :</strong><br>Enchaîne sans pause · Activation du gainage','Activation complète en une seule mini-série'),
    ]
  };
  const nR = fv(8, ressenti);
  const cardio = {titre:`Fractionné affûtage — ${nR}×45s`, icone:'⚡', duree:45,
    detail:`<strong>${nR} × 45 secondes</strong> à <strong>${vit(vma,pctM)} km/h (${allure(vma,pctM)}/km)</strong><br><strong>1 min 15 récup</strong> · Intensité max, volume réduit.`,
    note:`Groupe ${gr} · ${Math.round(pctM*100)}% VMA · Presque là — encore un effort`};
  return _build(weekIdx,'S5 — Affûtage explosif ⚡','50 min',ressenti,noteImpact,[echauffRenfo(),renfo,cardio,ppp(weekIdx),retourCalme(false)]);
}

// ════════════════════════════════════════════════════════════════════════════════
// SÉANCE 2 (JEUDI) — Cardio dominant + Appuis handball + Renfo léger
// ════════════════════════════════════════════════════════════════════════════════
export function genIndivRenfo(weekIdx, joueur, ressenti='normal', mat='aucun'){
  const vma   = joueur.vma||13;
  const adapt  = getProfilAdapt(joueur);
  const gr    = getGroupe(vma);
  const si    = adapt.sansImpact;
  const menager = adapt.profil==='menager';
  const matF  = (() => { const m=joueur.materiel||[]; return m.includes('Salle de muscu')?'salle':m.includes('Élastiques')?'elast':'aucun'; })();
  const noteImpact = si?'🔵 Articulations : marche rapide ou vélo à la place de la course. Exercices de renfo identiques.':null;

  const pctF = gr==='A'?0.72:gr==='B'?0.70:0.68;
  const pctS = gr==='A'?0.83:gr==='B'?0.80:0.76;
  const pctV = gr==='A'?0.90:gr==='B'?0.86:0.82;

  // ── Blocs appuis handball (faisables partout) ─────────────────────────────
  const appuisS1 = {
    titre:'Appuis handball — Initiation', icone:'🤾', duree:600,
    detail:'<strong>10 min — faisable n\'importe où :</strong><br>'+
      '① <strong>Shuffle latéral 20m :</strong> déplacements latéraux défense · 3×20m/sens · 30s récup<br>'+
      '② <strong>Changements de direction simples :</strong> pose 3 objets (chaussures) espacés de 1m · slalom aller-retour · 4×<br>'+
      '③ <strong>Carioca 20m :</strong> croisé avant/arrière · 3×20m/sens<br>'+
      '④ <strong>5 démarrages explosifs :</strong> position défense basse → sprint 5m → frein → retour',
    note:'Simulation des déplacements défensifs handball — travail des appuis latéraux', videoUrl:VIDEOS.shuffle_lateral};

  const appuisS2 = {
    titre:'Appuis handball — Accélérations + Changements direction', icone:'🤾', duree:720,
    detail:'<strong>12 min :</strong><br>'+
      '① <strong>T-drill maison :</strong> 4 objets en T espacés de 2m · Touche chaque objet en changeant de direction · 6× · 45s récup<br>'+
      '② <strong>5-10-5 :</strong> Sprint 5m à D · Retour 10m à G · Sprint 5m retour centre · 6× · 30s récup<br>'+
      '③ <strong>Carioca accélérée :</strong> 4×20m à vitesse max · 30s récup<br>'+
      '④ <strong>Arrêts-relances :</strong> sprint 10m · stop net · repartir immédiatement · 8×',
    note:'Format de jeu : les sprints court-stop-relance sont le cœur de l\'effort handball', videoUrl:VIDEOS.carioca};

  const appuisS3 = {
    titre:'Appuis handball — Format match 30/30', icone:'🤾', duree:600,
    detail:'<strong>10 min :</strong><br>'+
      '① <strong>10×30s/30s appuis mixtes :</strong> Alterne à chaque répétition entre :<br>'+
      '   • Shuffles latéraux max<br>   • Sprint + arrêt net + changement de direction<br>   • Carioca max<br>   • 5-10-5<br>'+
      '② Récup 30s complète entre chaque répétition',
    note:'Format exact 30/30 = simulation des efforts en match', videoUrl:VIDEOS.carioca};

  const appuisS4 = {
    titre:'Appuis handball — Intensité maximale', icone:'🤾', duree:600,
    detail:'<strong>10 min :</strong><br>'+
      '① <strong>8×30s appuis maximum :</strong> Choisis parmi shuffle, T-drill, 5-10-5 · Intensité absolue · 30s récup<br>'+
      '② <strong>4×5 démarrages explosifs :</strong> Position défense basse → sprint 5m → arrêt net · 15s entre chaque · 45s entre séries<br>'+
      '③ 2 min récup puis enchaîne directement sur le renfo',
    note:'Peak de volume sur les appuis — simulation de fin de match tendu'};

  const appuisS5 = {
    titre:'Activation appuis pré-collectif', icone:'🤾', duree:480,
    detail:'<strong>8 min — activation légère :</strong><br>'+
      '① <strong>Shuffles latéraux :</strong> 4×20m à 80% · 30s récup<br>'+
      '② <strong>Carioca :</strong> 4×20m à 80% · 30s récup<br>'+
      '③ <strong>6 démarrages explosifs :</strong> 5m · Stop net · Retour<br>'+
      '④ Objectif : activer les appuis sans se fatiguer avant le collectif',
    note:'Légère et vive — arriver frais et réactif au collectif'};

  // ── SEMAINE 1 : Base aérobie + Gainage ───────────────────────────────────
  if(weekIdx===0){
    const dureeC = fv(20, ressenti);
    const cardio = {titre:`Endurance continue — ${dureeC} min`, icone:'🏃', duree:dureeC*60,
      detail:`<strong>${dureeC} minutes</strong> à <strong>${vit(vma,pctF)} km/h (${allure(vma,pctF)}/km)</strong><br>`+
        (si?'Marche rapide ou vélo si course inconfortable.':'Allure conversation — tu dois pouvoir parler facilement tout du long.'),
      note:`Groupe ${gr} · ${Math.round(pctF*100)}% VMA · Construction base aérobie`};
    const nT = fv(menager?2:3, ressenti);
    const renfoL = {
      titre:`Gainage et stabilité — ${nT} passages`, icone:'🔷',
      detail:`<strong>${nT} passages · 30s effort · 30s récup</strong>`,
      sousBlocs:[
        exo('Gainage ventral','🔷','<strong>40s :</strong> Avant-bras, corps aligné · Serre abdos + fessiers · Respire','Dos plat — ni trop haut ni qui s\'affaisse'),
        exo('Gainage latéral','🔷','<strong>40s/côté :</strong> Avant-bras, bassin décollé · Corps aligné','Hanche haute pendant toute la durée'),
        exo('Pont fessier bilatéral','🍑','<strong>40s reps :</strong> Monte les hanches fort · Descente lente 3s','Serre les fessiers — pas le bas du dos'),
        exo('Équilibre unipodal','🦶','<strong>30s/pied :</strong> Genou souple · Ferme les yeux si trop facile','Genou jamais verrouillé'),
        exo('Romanian Deadlift unilatéral','🦵',
          '<strong>8 reps/jambe :</strong><br>① Debout sur une jambe, l\'autre vers l\'arrière<br>② Penche le buste en avant dos plat · Descends jusqu\'à l\'étirement ischio<br>③ Remonte en contractant le fessier · Mur si besoin pour l\'équilibre',
          'Dès S1 — le handball est asymétrique'),
        exo('Bird Dog','🔷',
          '<strong>10 reps/côté :</strong><br>① À quatre pattes · Tends bras droit + jambe gauche<br>② Tiens 3s, bassin horizontal · Reviens lentement<br>③ Alterne les côtés',
          'Stabilité lombaire fondamentale — sens la contraction profonde'),
      ]
    };
    return _build(weekIdx,'S1 — Base aérobie + Stabilité','50 min',ressenti,noteImpact,[echauffCourse(),cardio,appuisS1,renfoL,ppp(weekIdx),retourCalme(ressenti==='fatigue')]);
  }

  // ── SEMAINE 2 : Seuil + Appuis + Gainage dynamique ───────────────────────
  if(weekIdx===1){
    const nB = fv(4, ressenti);
    const cardio = {titre:`Fractionné seuil — ${nB}×5 min`, icone:'🏃', duree:300,
      detail:`<strong>${nB} × 5 minutes</strong> à <strong>${vit(vma,pctS)} km/h (${allure(vma,pctS)}/km)</strong><br><strong>2 min 30 récup active</strong> · Effort soutenu.`,
      note:`Groupe ${gr} · ${Math.round(pctS*100)}% VMA · Seuil anaérobie — caisse qui se construit`};
    const nT = fv(menager?2:3, ressenti);
    const renfoL = {
      titre:`Gainage dynamique + Ischios — ${nT} passages`, icone:'🔷',
      detail:`<strong>${nT} passages · 35s effort · 25s récup</strong>`,
      sousBlocs:[
        exo('Mountain climbers','🔷','<strong>45s :</strong> Position planche · Genoux alternativement vers la poitrine · Rythme soutenu · Bassin stable','Bassin fixe — pas de rotation'),
        exo('Pont fessier unilatéral','🍑','<strong>45s/jambe :</strong> Un pied au sol, l\'autre levé · Monte les hanches · Plus difficile que le bilatéral','Renforce aussi la stabilité du bassin'),
        exo('Superman dynamique','🔷','<strong>45s :</strong> Allongé face au sol · Décolle bras + jambes · 2s en haut · Descente lente','Chaîne postérieure complète', 'superman'),
        exo('Rotation externe épaule','💪','<strong>15 reps/bras :</strong> Coude collé 90° · Rotation vers l\'extérieur avec élastique léger ou partenaire','Protection épaule du lanceur — indispensable'),
        exo('Pallof Press','🔷',
          '<strong>12 reps/côté :</strong><br>① Élastique fixé à hauteur poitrine (porte, arbre)<br>② Debout de côté · Tiens l\'élastique à la poitrine<br>③ Tends les bras lentement — résiste à la rotation<br>④ Sans élastique : gainage latéral avec rotation contrôlée du buste',
          'Anti-rotation — protège le dos et les hanches', 'pallof_press'),
        exo('Dead Bug','🔷',
          '<strong>10 reps/côté :</strong><br>① Allongé dos · Bras vers plafond · Hanches et genoux 90°<br>② Expire en descendant bras droit + jambe gauche<br>③ Dos collé au sol · Remonte lentement · Côté opposé',
          'Expire à l\'effort — qualité absolue sur cet exercice', 'dead_bug'),
      ]
    };
    return _build(weekIdx,'S2 — Seuil + Appuis + Gainage','55 min',ressenti,noteImpact,[echauffCourse(),cardio,appuisS2,renfoL,ppp(weekIdx),retourCalme(ressenti==='fatigue')]);
  }

  // ── SEMAINE 3 : Format handball 30/30 + Ischios ───────────────────────────
  if(weekIdx===2){
    const nL = fv(3, ressenti);
    const cardio1 = {titre:`Fractionné moyen — ${nL}×6 min`, icone:'🏃', duree:360,
      detail:`<strong>${nL} × 6 minutes</strong> à <strong>${vit(vma,pctS)} km/h (${allure(vma,pctS)}/km)</strong><br><strong>3 min récup</strong> · Seuil anaérobie.`,
      note:`${Math.round(pctS*100)}% VMA · Construction endurance`};
    const nC = fv(10, ressenti);
    const cardio2 = {titre:`Fractionné handball — ${nC}×30s/30s`, icone:'⚡', duree:30,
      detail:`<strong>${nC} × 30 secondes</strong> à <strong>${vit(vma,pctV)} km/h (${allure(vma,pctV)}/km)</strong><br><strong>30s récup</strong> · Format exact des efforts handball.`,
      note:`${Math.round(pctV*100)}% VMA · Après le long = simulation vraie d\'un match`};
    const nT = fv(menager?2:3, ressenti);
    const renfoL = {
      titre:`Circuit ischios + genou — ${nT} passages`, icone:'🦵',
      detail:`<strong>${nT} passages · 40s effort · 20s récup</strong>`,
      sousBlocs:[
        exo('Nordic Curl','🦵','<strong>Max reps :</strong> Pieds coincés · Chute 5s · Mains pour revenir','Anti-blessure ischios n°1', 'nordic_curl'),
        exo('Squat pistol aidé','🦵','<strong>6 reps/jambe :</strong> Sur une jambe · Autre jambe tendue devant · Aide-toi du mur ou chaise · Descends le plus bas possible','Renforce le genou en unilatéral — simulation appuis handball'),
        exo('Gainage latéral dynamique','🔷','<strong>40s/côté :</strong> Gainage latéral · Monte et descends le bassin lentement · Contrôle parfait','Lent et contrôlé — qualité absolue'),
      ]
    };
    return _build(weekIdx,'S3 — Format handball + Ischios','55-60 min',ressenti,noteImpact,[echauffCourse('④ 4×20m carioca pour activer les appuis'),cardio1,appuisS3,cardio2,renfoL,ppp(weekIdx),retourCalme(ressenti==='fatigue')]);
  }

  // ── SEMAINE 4 : Volume max cardio + Circuit complet ───────────────────────
  if(weekIdx===3){
    const nB = fv(4, ressenti);
    const cardio1 = {titre:`Fractionné long — ${nB}×8 min`, icone:'🏃', duree:480,
      detail:`<strong>${nB} × 8 minutes</strong> à <strong>${vit(vma,pctS)} km/h (${allure(vma,pctS)}/km)</strong><br><strong>3 min récup</strong> · Le bloc cardio le plus long du cycle.`,
      note:`${Math.round(pctS*100)}% VMA · Volume max — les réservoirs doivent être vides`};
    const nF = fv(6, ressenti);
    const cardio2 = {titre:`Finisseur — ${nF}×30s`, icone:'⚡', duree:30,
      detail:`<strong>${nF} × 30 secondes</strong> à <strong>${vit(vma,pctV)} km/h (${allure(vma,pctV)}/km)</strong><br><strong>30s récup</strong> · Après les longs blocs, vide les réservoirs.`,
      note:`${Math.round(pctV*100)}% VMA · Finisseur — simulation fin de match`};
    const nT = fv(menager?2:3, ressenti);
    const renfoL = {
      titre:`Circuit complet — ${nT} passages`, icone:'💪',
      detail:`<strong>${nT} passages · 45s effort · 15s récup — après le gros cardio</strong>`,
      sousBlocs:[
        exo('Squat sauté','⚡','<strong>40s :</strong> Les jambes sont fatiguées — c\'est voulu · Saut explosif · Réception souple','Peak de fatigue musculaire — qualité des atterrissages', 'squat_saute'),
        exo('Pompes','💪','<strong>40s :</strong> Max de reps · Sur les genoux si besoin mais amplitude complète',''),
        exo('Nordic Curl','🦵','<strong>6-8 reps :</strong> Chute 5s · Maintenu même en fatigue','Ischios incontournables', 'nordic_curl'),
        exo('Gainage 360°','🔷','<strong>30s ventral + 30s latéral D + 30s latéral G :</strong> Enchaîne sans pause','Gainage complet — on finit fort'),
      ]
    };
    return _build(weekIdx,'S4 — Volume max cardio + Circuit','60-65 min',ressenti,noteImpact,[echauffCourse(),cardio1,appuisS4,cardio2,renfoL,ppp(weekIdx),retourCalme(ressenti==='fatigue')]);
  }

  // ── SEMAINE 5 : Affûtage cardio + Activation ─────────────────────────────
  const nR = fv(6, ressenti);
  const cardio1 = {titre:`Affûtage — ${nR}×4 min`, icone:'🏃', duree:240,
    detail:`<strong>${nR} × 4 minutes</strong> à <strong>${vit(vma,pctS)} km/h (${allure(vma,pctS)}/km)</strong><br><strong>3 min récup</strong> · Volume réduit, intensité maintenue.`,
    note:`${Math.round(pctS*100)}% VMA · Moins de volume, même qualité`};
  const nC = fv(6, ressenti);
  const cardio2 = {titre:`Finisseur explosif — ${nC}×30s`, icone:'⚡', duree:30,
    detail:`<strong>${nC} × 30 secondes</strong> à <strong>${vit(vma,pctV)} km/h (${allure(vma,pctV)}/km)</strong><br><strong>1 min 30 récup</strong> · Maintient l\'explosivité.`,
    note:'Dernier fractionné avant la reprise — reste vif'};
  const renfoL = {
    titre:'Activation pré-collectif — 2 passages', icone:'⚡',
    detail:'<strong>2 passages · 30s effort · 30s récup — léger et vif</strong>',
    sousBlocs:[
      exo('Squat sauté','⚡','<strong>30s — léger et explosif</strong>','Activation sans fatigue', 'squat_saute'),
      exo('Pompes explosives','💪','<strong>30s :</strong> Puissance maintenue','', 'pompes_explosives'),
      exo('Nordic Curl','🦵','<strong>5 reps :</strong> Entretien — ne lâche pas','Maintien jusqu\'au bout', 'nordic_curl'),
    ]
  };
  return _build(weekIdx,'S5 — Affûtage + Activation pré-collectif','45-50 min',ressenti,noteImpact,[echauffCourse(),cardio1,appuisS5,cardio2,renfoL,ppp(weekIdx),retourCalme(false)]);
}

// ════════════════════════════════════════════════════════════════════════════════
// SÉANCE 3 (FACULTATIVE) — Unique chaque semaine
// ════════════════════════════════════════════════════════════════════════════════
export function genIndivRecup(weekIdx, joueur, ressenti='normal'){
  const vma   = joueur.vma||13;
  const adapt  = getProfilAdapt(joueur);
  const gr    = getGroupe(vma);
  const si    = adapt.sansImpact;
  const p     = getPPP_niveauxIndiv(weekIdx);
  const pppA  = {titre:'🛡️ Prévention essentielle', icone:'🛡️', isPPP:true,
    pppExos:p.exos?p.exos.slice(0,3):[],
    note:'Version allégée — les 3 exercices de base'};

  const etirLong = {titre:'Étirements longs', icone:'🧘', duree:720,
    detail:'<strong>12 min — prends le temps :</strong><br>'+
      '① Ischios : assis jambes tendues · <strong>1 min/jambe</strong><br>'+
      '② Quadriceps : allongé côté · <strong>1 min/jambe</strong><br>'+
      '③ Fessiers : genou sur la poitrine · <strong>1 min/jambe</strong><br>'+
      '④ Mollets : pied contre mur · <strong>45s/jambe</strong><br>'+
      '⑤ Adducteurs : papillon assis · <strong>1 min 30</strong><br>'+
      '⑥ Dos : chat-vache 10× · torsion 30s/côté',
    note:'Séance récup = étirements longs = meilleure récupération musculaire'};

  // S1 : Mobilité articulaire complète
  if(weekIdx===0){
    const mobilite = {titre:'Mobilité articulaire — corps complet', icone:'🤸', duree:900,
      detail:'<strong>15 min — travail mobilité :</strong><br>'+
        '① <strong>Chevilles :</strong> cercles 20×/sens · dorsiflexion contre mur 30s/pied · 3×<br>'+
        '② <strong>Hanches :</strong> rotations externes 15× · fente basse maintenue 45s/côté · 3×<br>'+
        '③ <strong>Colonne :</strong> chat-vache 15× · torsion thoracique assise 30s/côté · 3×<br>'+
        '④ <strong>Épaules :</strong> cercles bras 20× · étirement pectoral contre mur 30s/côté<br>'+
        '⑤ <strong>Genoux :</strong> cercles 15×/sens · squats lents profonds 10×',
      note:'La mobilité articulaire c\'est souvent ce qui manque — investis ce temps'};
    return _buildRecup(weekIdx,'S1 Facultative — Mobilité complète','35 min',[mobilite,pppA,etirLong]);
  }

  // S2 : Footing récup + PPP complète
  if(weekIdx===1){
    const vRecup = Math.round(vma*0.58*10)/10;
    const footing = {titre:'Footing récupération — 20 min', icone:'🚶', duree:1200,
      detail:`<strong>20 minutes</strong> à <strong>${vRecup} km/h</strong> — allure très légère.<br>`+
        (si?'Marche rapide si course inconfortable.':'Tu dois pouvoir chanter en courant. C\'est une séance de récupération.'),
      note:`${Math.round(0.58*100)}% VMA · Circulation du sang, pas d\'effort`};
    const pppFull = {titre:'🛡️ PPP complète', icone:'🛡️', isPPP:true,
      pppExos:p.exos, note:'Toute la PPP — tu as le temps ce jour-là'};
    return _buildRecup(weekIdx,'S2 Facultative — Footing récup + PPP','40 min',[footing,pppFull,etirLong]);
  }

  // S3 : Fractionné léger + Mobilité
  if(weekIdx===2){
    const vFrac = Math.round(vma*0.70*10)/10;
    const frac = {titre:'Fractionné léger — 15×30s/30s', icone:'🏃', duree:30,
      detail:`<strong>15 × 30 secondes</strong> à <strong>${vFrac} km/h</strong><br><strong>30s récup</strong> · Allure modérée — pas d\'effort maximal.<br>Maintenir les adaptations cardiovasculaires sans se fatiguer.`,
      note:'70% VMA · Léger et régulier — pas de sprint'};
    const mobilite = {titre:'Mobilité ciblée jambes', icone:'🤸', duree:600,
      detail:'<strong>10 min :</strong><br>'+
        '① Fente basse maintenue <strong>1 min/côté</strong> × 2<br>'+
        '② Papillon assis · penche le buste en avant · <strong>1 min 30</strong><br>'+
        '③ Pigeon au sol · <strong>1 min/côté</strong> × 2<br>'+
        '④ Rotation externe de hanche debout · 10×/sens',
      note:'Les hanches sont souvent le maillon faible — travaille-les'};
    return _buildRecup(weekIdx,'S3 Facultative — Fractionné léger + Mobilité','35 min',[echauffCourse(),frac,mobilite,pppA,etirLong]);
  }

  // S4 : Récupération active pure
  if(weekIdx===3){
    const vRecup = Math.round(vma*0.58*10)/10;
    const footing = {titre:'Récupération active — 25 min', icone:'🚶', duree:1500,
      detail:`<strong>25 minutes</strong> à <strong>${vRecup} km/h</strong> — allure très légère.<br>`+
        (si?'Marche rapide ou vélo.':'Footing très tranquille — allure conversation fluide.'),
      note:'Après le pic de charge S4 — le corps a besoin de cette récupération'};
    return _buildRecup(weekIdx,'S4 Facultative — Récupération active','45 min',[footing,pppA,etirLong]);
  }

  // S5 : Activation pré-collectif
  const activation = {titre:'Activation pré-collectif — 15 min', icone:'⚡', duree:900,
    detail:'<strong>15 min — léger et vif :</strong><br>'+
      '① <strong>5 min footing</strong> très léger<br>'+
      '② <strong>Gammes :</strong> montées genoux · talons-fesses · pas chassés · foulées bondissantes · 2×20m<br>'+
      '③ <strong>6 démarrages explosifs</strong> 5m · stop net · retour<br>'+
      '④ <strong>4×20m shuffles latéraux</strong> · 30s récup<br>'+
      '⑤ <strong>4×20m carioca</strong> · 30s récup',
    note:'Activation légère — arriver frais, réactif et confiant au collectif'};
  return _buildRecup(weekIdx,'S5 Facultative — Activation pré-collectif','30 min',[activation,pppA,etirLong]);
}

// ── Helper assemblage ─────────────────────────────────────────────────────────
function _build(weekIdx, titre, duree, ressenti, notePoste, blocs){
  return {titre, type:'Séance 1 — Renfo + Cardio', typeIcon:'💪⚡',
    obligatoire:true, tags:['renfo','cardio','ppp'],
    semaine:weekIdx+1, duree, ressenti, notePoste,
    blocs:blocs.filter(Boolean)};
}
function _buildRecup(weekIdx, titre, duree, blocs){
  return {titre, type:'Séance 3 — Récupération', typeIcon:'🚶',
    obligatoire:false, tags:['recup','ppp'],
    semaine:weekIdx+1, duree,
    blocs:blocs.filter(Boolean)};
}


export function genPhase2IndivSessions(weekIdx, joueur, ressenti='normal', materiel='auto'){
  // Résoudre le matériel : 'auto' = utiliser le profil joueur
  let mat=materiel;
  if(mat==='auto'){
    const m=joueur.materiel||['Aucun équipement'];
    mat=m.includes('Salle de muscu')?'salle':m.includes('Élastiques')?'elast':'aucun';
  }
  return [
    genIndivCardio(weekIdx, joueur, ressenti),
    genIndivRenfo(weekIdx, joueur, ressenti, mat),
    genIndivRecup(weekIdx, joueur, ressenti)
  ];
}


export function genSessionA(weekIdx, joueur){
  const vma=joueur.vma||13;
  const vFooting = Math.round(vma*0.65*10)/10;   // footing tranquille
  const vSoutenu = Math.round(vma*0.78*10)/10;   // allure soutenue
  const vRecup   = Math.round(vma*0.55*10)/10;   // recup
  const phases=['Réveil','Montée','Pic','Affûtage'];
  const ph=phases[weekIdx]||'Réveil';
  const ppp=getPPP_niveaux(weekIdx);

  let cardioBloc;
  if(weekIdx===0){
    cardioBloc={titre:'Réveil cardio — 2 × 8 min footing',
      detail:`2 fois 8 minutes de footing tranquille à <strong>${vFooting} km/h</strong> (${kmhToMinKm(vFooting)}/km),<br>avec 3 min de marche entre les deux blocs.`,
      note:'On réveille le corps en douceur — tu dois pouvoir parler en courant.', duree:8*60, icone:'🏃'};
  } else if(weekIdx===1){
    cardioBloc={titre:'Footing continu — 20 min',
      detail:`20 minutes de footing en continu à <strong>${vFooting} km/h</strong> (${kmhToMinKm(vFooting)}/km).<br>Tu peux accélérer légèrement vers <strong>${vSoutenu} km/h</strong> sur les 5 dernières minutes si tu te sens bien.`,
      note:'Allure régulière, sans forcer. Le but est de tenir la durée.', duree:20*60, icone:'🏃'};
  } else if(weekIdx===2){
    cardioBloc={titre:'Intervalles — 6 × (2 min soutenu / 1 min 30 footing)',
      detail:`6 fois : 2 min soutenu à <strong>${vSoutenu} km/h</strong> (${kmhToMinKm(vSoutenu)}/km),<br>puis 1 min 30 de footing lent à <strong>${vRecup} km/h</strong> pour récupérer.`,
      note:'La séance la plus exigeante du programme. Garde une allure régulière sur chaque bloc.',
      duree:6*210, icone:'🏃', hasTimer:true, timerReps:6, timerSpeed:vSoutenu};
  } else {
    cardioBloc={titre:'Activation — 15 min footing + accélérations',
      detail:`15 min de footing tranquille à <strong>${vFooting} km/h</strong>,<br>puis 3-4 accélérations courtes (20-30m) en restant relâché.`,
      note:'Semaine du championnat — on réveille les jambes sans les fatiguer.', duree:15*60, icone:'🏃'};
  }

  return {
    titre:`Cardio + Prévention`,
    type:'Cardio', typeColor:'var(--red)', typeIcon:'🏃',
    obligatoire:true, tags:['cardio','ppp'],
    phase:ph, semaine:weekIdx+1,
    duree:'40-45 min',
    notePoste:null,
    blocs:[
      {titre:'Échauffement', detail:'<strong>10 min :</strong><br>① 4 min footing très lent (tu peux tenir une conversation sans effort)<br>② 2 min mobilité : cercles d\'épaules (10×/sens) · rotations de hanches (10×) · cercles de chevilles (10×/pied)<br>③ 2 min gammes douces : montées de genoux × 15m · talons-fesses × 15m<br>④ 2 min : 2 × 30m allongement de foulée progressif', duree:600, icone:'🔥'},
      cardioBloc,
      {titre:`Prévention blessures — Niveau ${ppp.niveau}/3`, detail:'', icone:'🛡️', isPPP:true, pppExos:ppp.exos,
       note:`Semaine ${weekIdx+1} — intégrée à la séance`},
      {titre:'Retour au calme', detail:'<strong>5 min :</strong><br>① 2 min marche tranquille pour faire descendre le rythme cardiaque<br>② Ischios : assis jambes tendues, penche le buste en avant · 30s/jambe<br>③ Quadriceps : debout, ramène le talon aux fesses · 30s/jambe<br>④ Mollets : pied contre un mur, jambe tendue · 20s/jambe<br>⑤ Épaules : bras croisé devant la poitrine · 20s/côté', duree:300, icone:'🧘'},
    ]
  };
}

export function genSessionB(weekIdx, joueur){
  const vma=joueur.vma||13, nn=getNiveauNum(vma);
  const phases=['Réveil','Montée','Pic','Affûtage'];
  const ph=phases[weekIdx]||'Réveil';
  const ppp=getPPP_niveaux(weekIdx);
  const nbCircuits = weekIdx<=1 ? 2 : (weekIdx===2 ? 3 : 2); // S4 allégé

  // Doses qui montent puis s'allègent en S4 (affûtage)
  const isAffutage = weekIdx===3;
  const nSquat = isAffutage?10:12;
  const nFente = 8;
  const nPompe = nn===0?8:10;
  const nPont  = 12;
  const gainage = isAffutage?20:30;

  const circuitDetail=`<strong>${nbCircuits} passages</strong> du circuit — récup 2 min entre chaque :<br>
    • Squats (poids du corps) : <strong>${nSquat} rép</strong> · descente 3s · genoux dans l'axe du pied<br>
    • Fentes : <strong>${nFente}/jambe</strong> · descente lente, genou aligné<br>
    • Pompes (sur genoux si besoin) : <strong>${nPompe} rép</strong> · corps gainé<br>
    • Pont fessier : <strong>${nPont} rép</strong> · serrer les fessiers, 2s en haut<br>
    • Gainage ventral : <strong>${gainage}s</strong> · dos plat, abdos serrés<br>
    • Gainage latéral : <strong>20s/côté</strong>`;

  const noteAffutage = isAffutage
    ? 'Semaine du championnat — circuit allégé, on garde du jus pour le match.'
    : 'Qualité du mouvement avant la vitesse — genoux dans l\'axe à chaque squat et fente.';

  return {
    titre:'Renforcement + Prévention',
    type:'Force', typeColor:'#11984c', typeIcon:'💪',
    obligatoire:true, tags:['force','ppp'],
    phase:ph, semaine:weekIdx+1,
    duree:'40-45 min',
    notePoste:null,
    blocs:[
      {titre:'Échauffement', detail:'<strong>10 min :</strong><br>① 3 min footing léger<br>② 2 min mobilité articulaire : épaules, hanches, chevilles (10 cercles chacun)<br>③ 3 min gammes : montées de genoux × 20m · talons-fesses × 20m · pas chassés × 20m<br>④ 2 min : 3 × 20m accélérations à 60-70%', duree:600, icone:'🔥'},
      {titre:`Circuit de renforcement — ${nbCircuits} passages`, detail:circuitDetail, icone:'💪', note:noteAffutage},
      {titre:`Prévention blessures — Niveau ${ppp.niveau}/3`, detail:'', icone:'🛡️', isPPP:true, pppExos:ppp.exos,
       note:`Semaine ${weekIdx+1} — intégrée à la séance`},
      {titre:'Étirements', detail:'<strong>8 min — 20 à 30s par étirement, sans à-coups :</strong><br>① Ischios : assis jambes tendues, buste vers l\'avant · 30s/jambe<br>② Quadriceps : debout, talon aux fesses · 30s/jambe<br>③ Adducteurs : assis en papillon, pousse doucement les genoux vers le sol · 30s<br>④ Épaules/triceps : bras plié derrière la tête · 20s/côté<br>⑤ Mollets : jambe arrière tendue, talon au sol · 20s/jambe', duree:480, icone:'🧘'},
    ]
  };
}

export function genSessionC(weekIdx, joueur){
  const vma=joueur.vma||13, a=getAllures(vma);
  const poste=joueur.poste||'';
  const isGardien=poste==='Gardien';
  const phases=['Réveil','Montée','Pic','Affûtage'];
  const ph=phases[weekIdx]||'Réveil';

  const blocs=[
    {titre:'Au choix : vélo, natation ou footing léger', icone:'🚴',
     detail:`30 à 40 min à allure très tranquille (60-70% de ton max).<br>Footing : vise environ <strong>${a.recup} km/h</strong> (${kmhToMinKm(a.recup)}/km).`,
     note:'Tu dois finir frais, pas fatigué — c\'est de la récupération active'},
    {titre:'Mobilité & souplesse', icone:'🤸', duree:600,
     detail:'<strong>10 min — mouvements lents, sans forcer :</strong><br>① Hanches : cercles larges debout (10×/sens) · balancés de jambe avant-arrière (10×/jambe)<br>② Épaules : grands cercles de bras (10×/sens) · étirement bras croisé (20s/côté)<br>③ Chevilles : cercles (10×/pied) · flexion-extension debout (10×)<br>④ Dos : chat-vache au sol (10×) · torsion assise (20s/côté)',
     note:'Idéal pour relâcher les tensions de la semaine'},
    {titre:'Étirements', icone:'🧘', duree:600,
     detail:'<strong>10 min — 30s par étirement, respiration lente :</strong><br>① Ischios : allongé, jambe tendue vers le plafond · 30s/jambe<br>② Quadriceps : allongé sur le côté, talon aux fesses · 30s/jambe<br>③ Mollets : debout, pied contre mur · 30s/jambe<br>④ Adducteurs : en papillon, pousse doucement les genoux · 30s<br>⑤ Épaules : bras croisé sur la poitrine · 20s/côté',
     note:'Sans à-coups, sensation de tension seulement'},
  ];

  if(isGardien) blocs.splice(2,0,{
    titre:'Spécial Gardien — Épaules & Hanches', icone:'🧤',
    detail:'Rotateurs d\'épaule à l\'élastique 3×15/bras + fentes latérales lentes 3×8/côté',
    note:'Tes articulations encaissent le plus — entretiens-les même en récup'
  });

  return {
    titre:'Récupération Active',
    type:'Récup', typeColor:'#22C55E', typeIcon:'🧘',
    obligatoire:false, tags:['recup'],
    phase:ph, semaine:weekIdx+1,
    duree:'30-40 min',
    notePoste:isGardien?'🧤 Séance spécialement adaptée pour les gardiens':null,
    blocs
  };
}

export function genPhase2Sessions(weekIdx, joueur){
  return [genSessionA(weekIdx,joueur), genSessionB(weekIdx,joueur), genSessionC(weekIdx,joueur)];
}

// ══════════════════════════════════════════════════
// SESSION GENERATOR — PHASE 3 (REPRISE COLLECTIVE)
// Séances collectives : titre + thème + durée uniquement
// Le coach anime, pas de blocs d'exercices détaillés
// ══════════════════════════════════════════════════
export function genPhase3Sessions(weekIdx){
  const typeColors={cohesion:'var(--green)',renfo:'var(--red)',cardio:'var(--red)',vitesse:'#f59e0b',explosivite:'#f59e0b',affutage:'var(--green)',activation:'var(--green)'};
  const typeIcons={cohesion:'🤝',renfo:'💪',cardio:'🏃',vitesse:'⚡',explosivite:'🔥',affutage:'🎯',activation:'✅'};
  const sessions=PHASE3_SCHEDULE.filter(e=>e.weekIdx===weekIdx&&e.sessIdx>=0);
  return sessions.map((e,i)=>({
    titre:e.titre,
    type:e.theme,
    typeIcon:typeIcons[e.type]||'🏃',
    typeColor:typeColors[e.type]||'var(--green)',
    duree:e.duree,
    obligatoire:true,
    isCollective:true,
    objectif:e.objectif,
    lieu:e.lieu||'Gymnase',
    blocs:[{
      titre:'Contenu défini par le coach',
      icone:'📋',
      detail:e.objectif,
      note:'Le coach Lohan définit le contenu sur place. Présence obligatoire.',
    }],
    tags:[{label:e.theme,color:typeColors[e.type]||'var(--green)'}],
  }));
}



export function getSeanceDuJour(joueur, date=new Date()){
  const phase=getPhaseActuelle(date);
  if(phase!=='p2' && phase!=='p3') return null;
  const weekIdx=(phase==='p3')?getPhase3Week(date):getPhase2Week(date);
  const dayOfWeek=date.getDay(); // 0=dim, 1=lun ...
  const jours=joueur.jours_seance||[];
  const idx=jours.indexOf(dayOfWeek);
  if(idx<0) return null;
  const sessions=(phase==='p3')?genPhase3Sessions(weekIdx):genPhase2IndivSessions(weekIdx,joueur);
  if(!sessions[idx]) return null;
  return {session:sessions[idx], idx, weekIdx, phase};
}

// ══════════════════════════════════════════════════
// SUPABASE
// ══════════════════════════════════════════════════
// NOTE: La connexion Supabase se fait désormais dans src/lib/supabase.ts
// Ce bloc legacy est neutralise pour eviter un warning console.
export let sb: any = null;

export async function sbGetJoueurs(){
  try{if(!sb)return [];const{data}=await sb.from('joueurs').select('code,data,updated_at');return data?.map(r=>({...r.data,code:r.code}))||[];}
  catch(e){console.warn('sbGetJoueurs',e);return [];}
}
export async function sbGetJoueur(code){
  try{if(!sb)return null;const{data}=await sb.from('joueurs').select('code,data').eq('code',code).maybeSingle();return data?{...data.data,code:data.code}:null;}
  catch(e){return null;}
}
export async function sbSaveJoueur(j){
  if(!sb){showToast('Erreur: Supabase non connecté','error');return false;}
  const {error}=await sb.from('joueurs').upsert({code:j.code,data:j,updated_at:new Date().toISOString()},{onConflict:'code'});
  if(error){showToast('Erreur Supabase: '+error.message,'error');console.error(error);return false;}
  return true;
}
export async function sbGetMeta(key,def=null){
  try{if(!sb)return def;const{data}=await sb.from('meta').select('value').eq('key',key).maybeSingle();return data?.value??def;}
  catch(e){return def;}
}
export async function sbSaveMeta(key,value){
  try{if(!sb)return;await sb.from('meta').upsert({key,value,updated_at:new Date().toISOString()},{onConflict:'key'});}
  catch(e){console.warn('sbSaveMeta',e);}
}

// ══════════════════════════════════════════════════
// APP STATE
// ══════════════════════════════════════════════════
export let currentJoueur = null;
export let obStep = 0;
export let obData = {};
export let selectedRPE = 0;
export let pendingValidation = null;
export let coachPwd = null;
export let currentCoach = null; // {id, nom, role, emoji}
export let selectedCoachId = 'lohan'; // default

// ══════════════════════════════════════════════════
// UI HELPERS
// ══════════════════════════════════════════════════
