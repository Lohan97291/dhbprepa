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
  const niv = weekIdx<=1?1:weekIdx<=3?2:3;
  const ppps = {
    1:[
      {n:'Équilibre sur une jambe',             d:'3×30s/pied — yeux ouverts puis fermés',          note:'Genou légèrement fléchi, bassin stable'},
      {n:'Gainage ventral',                      d:'3×40s',                                           note:'Dos plat, bassin neutre, respiration continue'},
      {n:'Gainage latéral',                      d:'3×30s/côté',                                      note:'Corps aligné, hanche haute'},
      {n:'Proprioception genou',                 d:'2×30s/jambe — balancier de la jambe libre',       note:'Le genou d\'appui reste aligné avec le pied'},
      {n:'Rotation externe épaule ⭐',            d:'3×15/bras avec élastique léger (ou partenaire)', note:'Protège l\'épaule du lanceur'},
    ],
    2:[
      {n:'Équilibre sur une jambe (dynamique)',  d:'3×45s/pied — bouge les bras pour te déstabiliser', note:'Fixe un point au mur pour garder l\'équilibre'},
      {n:'Gainage ventral dynamique',            d:'3×45s avec élévations alternées bras/jambe',       note:'Dos plat absolu — la qualité prime sur la durée'},
      {n:'Gainage latéral dynamique',            d:'3×40s/côté — monte/descends le bassin lentement',  note:'Bassin stable, corps aligné'},
      {n:'Sauts sur une jambe ⭐',               d:'3×6 sauts/jambe — stabilise 2s à la réception',   note:'Contrôle le genou à la réception'},
      {n:'Rotation externe épaule (freinage)',   d:'3×12/bras — descente lente 4 secondes',           note:'Descente lente — prévient la tendinite'},
    ],
    3:[
      {n:'Proprioception cheville',              d:'2×45s/pied sur surface instable (coussin)',         note:'Reste stable malgré le déséquilibre'},
      {n:'Gainage en coordination',              d:'3×50s — enchaîne ventral/latéral/dos, progressif',  note:'Garde le contrôle en accélérant'},
      {n:'Sauts genou-poitrine stabilisés ⭐',   d:'3×8 sauts — réception sur un pied',                note:'Le genou reste aligné à l\'atterrissage'},
      {n:'Appuis et changements de direction',   d:'3×10 — déplacements rapides avec relances',         note:'Reste bas, genou aligné, gainé'},
      {n:'Rotation externe en position d\'armer','d':'3×15/bras élastique — coude haut',              note:'Reproduit le geste de tir'},
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
export function getPPP_niveaux_v3_compat(weekIdx){
  return getPPP_niveauxIndiv(weekIdx);
}

// ══════════════════════════════════════════════════════════════════════════════
// PROGRAMME PHASE 2 v3 — 5 semaines — Draveil HB D2
// Lohan Boulard, Directeur Sportif
//
// Philosophie v3 :
//   S1 (Mardi)   = Renfo dominant (20-25 min renfo + 8-10 min cardio)
//   S2 (Jeudi)   = Cardio dominant (20 min cardio + 8-10 min renfo léger)
//   S3 (Samedi)  = Récupération active — FACULTATIVE
//
// Exercices simples uniquement : Squat, Pompes, Fentes, Gainage, Pont fessier,
//   Hip Thrust, Squat sauté, Fente sautée, Burpees, Nordic Curl, Superman
//
// Rythme effort/récup : joueur choisit 30/30 · 35/25 · 40/20
//   → suggéré automatiquement selon son dernier RPE
//
// Matériel : descriptions adaptées (bouteilles / élastiques / salle)
// RPE simplifié : emoji global + 1 question précision
// Suggestion séance suivante : visible sur l'accueil après validation RPE
// ══════════════════════════════════════════════════════════════════════════════

// ── Helpers ───────────────────────────────────────────────────────────────────
function vit(vma, pct){ return Math.round(vma*pct*10)/10; }
function allure(vma, pct){ return kmhToMinKm(vit(vma,pct)); }

// ── Rythme effort/récup selon RPE précédent ──────────────────────────────────
// RPE 1-3 (trop facile) → suggère 40/20
// RPE 4-6 (gérable)     → suggère 35/25
// RPE 7-10 (dur/épuisant) → suggère 30/30
export function getRhythmeSuggere(dernierRpe){
  if(!dernierRpe) return { effortSec:35, recupSec:25, label:'35s/25s', raison:'Rythme standard' };
  if(dernierRpe <= 3) return { effortSec:40, recupSec:20, label:'40s/20s', raison:'Tu t\'es senti à l\'aise — on monte d\'un cran 💪' };
  if(dernierRpe <= 6) return { effortSec:35, recupSec:25, label:'35s/25s', raison:'Bonne intensité la dernière fois — on garde le même rythme' };
  return { effortSec:30, recupSec:30, label:'30s/30s', raison:'La dernière séance était difficile — prends plus de récup, c\'est pas de la faiblesse' };
}

export const RYTHMES_DISPO = [
  { effortSec:30, recupSec:30, label:'30s / 30s', desc:'Plus de récup — j\'enchaîne à mon rythme' },
  { effortSec:35, recupSec:25, label:'35s / 25s', desc:'Rythme standard — intensité équilibrée' },
  { effortSec:40, recupSec:20, label:'40s / 20s', desc:'Moins de récup — je veux me dépasser' },
];

// ── Suggestion séance suivante selon RPE ─────────────────────────────────────
export function getSuggestionSuivante(rpe, typeSeanceActuelle){
  // typeSeanceActuelle : 'renfo' | 'cardio' | 'recup'
  if(rpe >= 9) return {
    message: '⚠️ Séance très dure — repose-toi bien. La prochaine fois, commence par 30s/30s et réduis les passages si besoin.',
    conseil: 'Dors bien, mange bien, hydrate-toi. Ton corps fait le travail pendant la récupération.',
    rythme: 30
  };
  if(rpe >= 7) return {
    message: '💪 Belle intensité. Prochaine séance : garde le même rythme ou monte légèrement si tu te sens bien.',
    conseil: 'Étire-toi bien ce soir, surtout les jambes.',
    rythme: 35
  };
  if(rpe <= 3) return {
    message: '😴 Tu pouvais encore donner plus. Prochaine fois : essaie un rythme 40s/20s.',
    conseil: 'C\'est bien de s\'écouter — mais si c\'est souvent trop facile, parle-en à Lohan.',
    rythme: 40
  };
  return {
    message: '✅ Bonne séance — tu es dans la zone cible.',
    conseil: 'Continue comme ça.',
    rythme: 35
  };
}

// ── PPP nouvelle version — 3 exos simples, 5 min, jamais en doublon ──────────
export function getPPP_niveauxIndiv(weekIdx, isRecup=false){
  // S1-S2 = niveau 1, S3-S4 = niveau 2, S5 = niveau 1 (décharge)
  // Séance récup (isRecup=true) = niveau doux (3)
  if(isRecup) return getPPP_niveaux_v3(3);
  const niv = weekIdx <= 1 ? 1 : weekIdx <= 3 ? 2 : 1;
  return getPPP_niveaux_v3(niv);
}

export function getPPP_niveaux_v3(niv){

  // ── Exercices bouteilles Thomas (présents dans toutes les séances) ─────────
  // Source : programme Val d'Orge / Thomas Merlin
  const bouteilleEpaule = {
    n:'Épaules — Montée bouteille (Thomas)',
    d:'3 × 20 reps par bras — bouteille pleine type Badoit 1,5L',
    note:'Prévention tendon du lanceur. Bras tendus hauteur épaule, descente lente 3s.',
    series:3, reps:20, cote:true,
    illustration:'bouteille-epaule',
    exec:[
      'Prends une bouteille pleine dans chaque main (type Badoit 1,5L — le manche long compte)',
      'Bras tendus à hauteur des épaules, paumes vers le bas',
      'Plie le coude : la bouteille descend devant les yeux puis remonte derrière la tête',
      'Reviens lentement en 3 secondes — ne laisse pas le bras tomber',
      '20 reps puis change de côté',
    ],
    erreur:'Bras qui retombe trop vite — tout le bénéfice est dans le freinage du retour',
  };

  const bouteilleArme = {
    n:'Épaules — Armé de tir (Thomas)',
    d:'3 × 20 reps par bras — bouteille pleine',
    note:'Renforce exactement le geste du tir en handball. Coude collé au corps.',
    series:3, reps:20, cote:true,
    illustration:'bouteille-arme',
    exec:[
      'Bouteille pleine dans une main, bras le long du corps',
      'Plie le coude vers l\'avant comme si tu armais pour tirer — l\'avant-bras monte',
      'Reviens lentement en 3 secondes en freinant',
      '20 reps puis change de bras',
    ],
    erreur:'Coude qui s\'écarte du corps — il doit rester collé au flanc pendant tout le mouvement',
  };

  // ── Niveau 1 : S1-S2 — Base prévention ──────────────────────────────────
  const niv1 = [
    bouteilleEpaule,
    bouteilleArme,
    {
      n:'Équilibre sur une jambe',
      d:'3 × 30s par pied — yeux ouverts puis yeux fermés',
      note:'Genou légèrement fléchi, jamais verrouillé. Fixe un point devant toi.',
      series:3, duree:30, cote:true,
      illustration:'equilibre',
      exec:[
        'Debout sur une jambe, genou souple (légèrement plié — pas verrouillé)',
        'Garde le bassin horizontal — ne laisse pas une hanche tomber',
        'Fixe un point devant toi pour t\'aider',
        'Après 30s : recommence les yeux fermés — nettement plus dur',
        'Change de pied',
      ],
      erreur:'Genou verrouillé et raide — il doit être souple pour absorber les micro-déséquilibres',
    },
    {
      n:'Gainage ventral',
      d:'3 × 35s — repos 25s entre les séries',
      note:'Dos plat, bassin neutre, respire normalement. Qualité avant durée.',
      series:3, duree:35, recup:25,
      illustration:'gainage',
      exec:[
        'En appui sur les avant-bras et les orteils, coudes sous les épaules',
        'Corps aligné de la tête aux talons — ni fesses en l\'air ni dos creux',
        'Serre abdos et fessiers, respire normalement',
        'Si tu trembles beaucoup : pose un genou — mieux que tenir mal',
      ],
      erreur:'Bassin qui remonte ou s\'affaisse — ton dos doit rester parfaitement plat',
    },
  ];

  // ── Niveau 2 : S3-S4 — Progression ──────────────────────────────────────
  const niv2 = [
    {
      ...bouteilleEpaule,
      n:'Épaules — Montée bouteille freinée',
      d:'3 × 20 reps par bras — descente en 4 secondes',
      note:'Même mouvement qu\'avant mais on ralentit encore la descente — 4 secondes.',
    },
    {
      ...bouteilleArme,
      n:'Épaules — Armé de tir freiné',
      d:'3 × 20 reps par bras — descente en 4 secondes',
      note:'Descente encore plus lente — c\'est là que la protection du tendon se construit.',
    },
    {
      n:'Équilibre dynamique',
      d:'3 × 45s par pied — bouge les bras pour te déstabiliser',
      note:'Les micro-corrections que tu fais SONT le travail — ne cherche pas à être immobile.',
      series:3, duree:45, cote:true,
      illustration:'equilibre',
      exec:[
        'En équilibre sur une jambe, genou souple',
        'Bouge les bras dans tous les sens pour te déstabiliser volontairement',
        'Résiste et reviens à l\'équilibre — ce mouvement renforce cheville et genou',
        '45s puis change de pied',
      ],
      erreur:'Poser le pied dès que ça vacille — le moment où tu te rattrappes, c\'est exactement ce qu\'on cherche',
    },
    {
      n:'Sauts stabilisés',
      d:'3 × 6 sauts — stabilise 2 secondes à la réception',
      note:'Prévention LCA — le genou doit rester dans l\'axe du pied à chaque réception.',
      series:3, reps:6,
      illustration:'saut-stab',
      exec:[
        'Debout, pieds légèrement écartés',
        'Saute vers l\'avant ou sur place',
        'Réception : deux pieds, genoux fléchis à 90°, genoux dans l\'axe des pieds',
        'Tiens la position 2 secondes sans bouger',
        'Enchaîne les 6 sauts',
      ],
      erreur:'Réception genoux tendus ou genoux qui rentrent en dedans — c\'est le mécanisme de blessure LCA à éviter absolument',
    },
  ];

  // ── Niveau doux : séance récup (S3 facultative) — version allégée ─────────
  const nivDoux = [
    bouteilleEpaule,
    bouteilleArme,
    {
      n:'Équilibre doux — yeux ouverts',
      d:'2 × 30s par pied — pas de yeux fermés aujourd\'hui',
      note:'On est en récup — reste dans le confort.',
      series:2, duree:30, cote:true,
      illustration:'equilibre',
      exec:[
        'Debout sur une jambe, genou souple',
        'Bras légèrement écartés pour l\'équilibre',
        '30s par pied — stop si tu forces',
      ],
      erreur:'Aucune erreur grave — c\'est la séance récup, tu restes dans le confort',
    },
    {
      n:'Gainage doux',
      d:'2 × 25s — arrête avant de trembler',
      note:'Version allégée — la qualité compte plus que la durée.',
      series:2, duree:25, recup:30,
      illustration:'gainage',
      exec:[
        'Planche sur avant-bras, corps aligné',
        '25s propres — si ça tremble tu t\'arrêtes, c\'est suffisant',
      ],
      erreur:'Tenir coûte que coûte — aujourd\'hui on récupère, pas on performe',
    },
  ];

  const ppps = { 1:niv1, 2:niv2, 3:nivDoux };
  const exos = ppps[niv] || ppps[1];
  return { niveau:niv, exos };
}


// Compatibilité avec l'ancienne signature (weekIdx)
export function getPPP_niveaux_compat(weekIdx){
  return getPPP_niveauxIndiv(weekIdx);
}

// ── Échauffement ──────────────────────────────────────────────────────────────
function echauff5min(){
  return {
    titre:'Échauffement', duree:300, icone:'🔥',
    detail:
      '<strong>5 min :</strong><br>'+
      '① <strong>2 min</strong> footing très léger (tu peux tenir une conversation)<br>'+
      '② <strong>Mobilité 1 min :</strong> cercles d\'épaules 10× · rotations de hanches 10× · cercles chevilles 10×/pied<br>'+
      '③ <strong>2 min :</strong> montées de genoux 20m · talons-fesses 20m · 2 × 20m accélérations légères (pas à fond)',
  };
}

// ── Retour au calme ───────────────────────────────────────────────────────────
function retourCalme5min(){
  return {
    titre:'Retour au calme', duree:300, icone:'🧘',
    detail:
      '<strong>5 min :</strong><br>'+
      '① <strong>1 min</strong> marche tranquille<br>'+
      '② Ischios : assis jambes tendues, buste vers l\'avant · <strong>30s/jambe</strong><br>'+
      '③ Quadriceps : debout, talon aux fesses · <strong>30s/jambe</strong><br>'+
      '④ Mollets : pied contre mur jambe tendue · <strong>20s/jambe</strong><br>'+
      '⑤ Épaules : bras croisé devant la poitrine · <strong>20s/côté</strong>',
  };
}

// ── Bloc PPP ──────────────────────────────────────────────────────────────────
function blocPPP_v3(weekIdx, isRecup=false){
  const p = getPPP_niveauxIndiv(weekIdx, isRecup);
  const label = isRecup ? 'Version douce' : `Niveau ${p.niveau}/2`;
  const note = isRecup
    ? '5 min · Exercices bouteilles Thomas + équilibre doux — même en récup on protège les épaules'
    : `5 min · Semaine ${weekIdx+1} — ne zappe pas, c'est ce qui évite les blessures`;
  return {
    titre:`🛡️ Prévention blessures — ${label}`,
    icone:'🛡️', isPPP:true, pppExos:p.exos,
    note, duree:300,
  };
}

// ── Exo helper ────────────────────────────────────────────────────────────────
function exo(titre, icone, detail, note, variante=null){
  return { titre, icone, detail, note, ...(variante ? {variante} : {}) };
}

// ── Descriptions adaptées au matériel ────────────────────────────────────────
function descBouteille(mat){
  if(mat==='elast') return 'élastique de résistance';
  if(mat==='salle') return 'haltère léger (2-5 kg)';
  return 'bouteille d\'eau pleine (type Badoit 1,5L)';
}

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE 1 — RENFO DOMINANT (Mardi)
// 20-25 min renfo + 8-10 min cardio + PPP + retour calme = 45-50 min
// ══════════════════════════════════════════════════════════════════════════════
export function genSeanceRenfo(weekIdx, joueur, effortSec=35, recupSec=25){
  const vma = joueur.vma || 13;
  const mat = (() => {
    const m = joueur.materiel || [];
    if(m.includes('Salle de muscu')) return 'salle';
    if(m.includes('Élastiques')) return 'elast';
    return 'aucun';
  })();

  const nPassages = weekIdx === 0 ? 2 : weekIdx === 4 ? 2 : weekIdx <= 2 ? 3 : 4;
  const label = `${effortSec}s effort / ${recupSec}s récup`;

  // ── SEMAINE 1 : Réveil musculaire ─────────────────────────────────────────
  if(weekIdx === 0){
    return _buildRenfo(weekIdx, 'S1 — Réveil musculaire + Cardio léger', '45-50 min', [
      echauff5min(),
      {
        titre:`Circuit Réveil — ${nPassages} passages · ${label}`,
        icone:'💪',
        detail:`<strong>${nPassages} passages · ${effortSec}s à fond · ${recupSec}s récup · 90s entre passages</strong><br>Enchaîne les exercices sans pause entre eux. Récupère 90s à la fin de chaque passage.`,
        sousBlocs:[
          exo('Squat poids du corps','🦵',
            `<strong>${effortSec}s — max de reps :</strong><br>① Pieds largeur d'épaules, pointes légèrement vers l'extérieur<br>② Descente lente <strong>3s</strong>, cuisses parallèles au sol, genoux dans l'axe des pieds<br>③ Remontée en poussant dans les talons<br>④ Dos droit, regard devant toi — pas vers le bas`,
            'Genoux dans l\'axe — ne les laisse jamais rentrer vers l\'intérieur'),
          exo('Pompes','💪',
            `<strong>${effortSec}s — max de reps :</strong><br>① Mains légèrement plus larges que les épaules<br>② Descente lente <strong>2s</strong>, poitrine proche du sol<br>③ Remontée explosive<br>④ Sur les genoux si besoin — amplitude complète obligatoire`,
            'Qualité avant quantité — 8 pompes propres valent mieux que 20 bâclées'),
          exo('Fentes alternées','🦵',
            `<strong>${effortSec}s — alterne gauche/droite :</strong><br>① Grand pas en avant, genou avant à 90°, genou arrière près du sol<br>② Descente <strong>2s</strong>, genou avant dans l'axe du pied<br>③ Remontée en poussant sur le talon avant`,
            'Le genou avant ne dépasse pas la pointe du pied'),
          exo('Gainage ventral','🔷',
            `<strong>${effortSec}s :</strong><br>① En appui sur les avant-bras et les orteils<br>② Corps aligné de la tête aux talons — ni les fesses en l'air, ni le dos qui creuse<br>③ Serre abdos et fessiers, respire normalement`,
            'Si tu trembles beaucoup : pose un genou — c\'est mieux que de tenir mal'),
          exo('Pont fessier','🍑',
            `<strong>${effortSec}s — max de reps :</strong><br>① Allongé sur le dos, pieds à plat, genoux à 90°<br>② Monte les hanches en serrant fort les fessiers<br>③ Tiens <strong>2s</strong> en haut, descends lentement<br>④ Pieds à plat, pas sur les orteils`,
            'Pousse dans les talons, serre les fessiers fort en haut'),
        ],
      },
      {
        titre:'Cardio fin de séance — 8 min footing',
        icone:'🏃', duree:480,
        detail:`<strong>8 min de footing continu</strong> à <strong>${vit(vma,0.65)} km/h (${allure(vma,0.65)}/km)</strong><br>Allure très tranquille — tu dois pouvoir parler. Le but c'est de finir la séance sans t'épuiser.`,
        note:`65% VMA — récupération active après le renfo`,
      },
      blocPPP_v3(weekIdx),
      retourCalme5min(),
    ]);
  }

  // ── SEMAINE 2 : Intensité ────────────────────────────────────────────────
  if(weekIdx === 1){
    return _buildRenfo(weekIdx, 'S2 — Intensité + Cardio progressif', '45-50 min', [
      echauff5min(),
      {
        titre:`Circuit Intensité — ${nPassages} passages · ${label}`,
        icone:'⚡',
        detail:`<strong>${nPassages} passages · ${effortSec}s à fond · ${recupSec}s récup · 90s entre passages</strong><br>On monte d'un cran — reste explosif sur chaque exercice.`,
        sousBlocs:[
          exo('Squat sauté','🦵',
            `<strong>${effortSec}s — explosivité :</strong><br>① Squat profond descente <strong>3s</strong><br>② Remontée explosive avec saut<br>③ Réception souple genoux fléchis — jamais les genoux verrouillés<br>④ Enchaîne immédiatement`,
            'Réception souple — genoux dans l\'axe',
            'Sans saut : squat lent 4s descente, remontée rapide'),
          exo('Fente sautée','🦵',
            `<strong>${effortSec}s — alternance en saut :</strong><br>① Fente basse<br>② Saut pour changer de jambe en l'air<br>③ Réception souple en fente de l'autre côté`,
            'Si les genoux tirent : fentes alternées sans saut',
            'Sans saut : fentes alternées normales'),
          exo('Pompes déclinées','💪',
            `<strong>${effortSec}s :</strong><br>① Pieds sur une chaise ou contre un mur, mains au sol<br>② Descente lente <strong>3s</strong><br>③ Remontée explosive<br>④ Variante : pompes classiques si pas de support`,
            'Corps aligné — les hanches ne s\'affaissent pas'),
          exo('Hip Thrust','🍑',
            `<strong>${effortSec}s — max de reps :</strong><br>① Épaules posées sur un canapé ou une chaise, pieds à plat, genoux à 90°<br>② Monte les hanches en serrant fort les fessiers<br>③ Tiens <strong>2s</strong> en haut, descends lentement <strong>3s</strong>`,
            'C\'est comme le pont fessier mais avec plus d\'amplitude — très efficace'),
          exo('Gainage latéral','🔷',
            `<strong>${effortSec}s par côté :</strong><br>① En appui sur l'avant-bras, coude sous l'épaule<br>② Décolle le bassin — corps aligné de la tête aux pieds<br>③ Hanche haute pendant toute la série`,
            'Mieux vaut arrêter proprement que tenir avec le bassin qui s\'affaisse'),
        ],
      },
      {
        titre:'Cardio fin — 10 min footing progressif',
        icone:'🏃', duree:600,
        detail:`<strong>10 min :</strong><br>① <strong>5 min</strong> à <strong>${vit(vma,0.65)} km/h (${allure(vma,0.65)}/km)</strong> — allure conversation<br>② <strong>5 min</strong> à <strong>${vit(vma,0.72)} km/h (${allure(vma,0.72)}/km)</strong> — allure soutenue`,
        note:`Tu accélères sur la deuxième partie — simulation fin de match`,
      },
      blocPPP_v3(weekIdx),
      retourCalme5min(),
    ]);
  }

  // ── SEMAINE 3 : Force ────────────────────────────────────────────────────
  if(weekIdx === 2){
    return _buildRenfo(weekIdx, 'S3 — Force + Fractionné', '45-50 min', [
      echauff5min(),
      {
        titre:`Circuit Force — ${nPassages} passages · ${label}`,
        icone:'💪',
        detail:`<strong>${nPassages} passages · ${effortSec}s à fond · ${recupSec}s récup · 2 min entre passages</strong><br>Descentes lentes, remontées explosives — le renfo commence vraiment ici.`,
        sousBlocs:[
          exo('Squat lent (4s descente)','🦵',
            `<strong>${effortSec}s :</strong><br>① Descente très lente en 4 secondes, cuisses parallèles<br>② Tiens <strong>1s</strong> en bas<br>③ Remontée explosive en poussant dans les talons<br>④ Genoux dans l'axe, dos droit`,
            'La descente lente double l\'efficacité par rapport au squat normal'),
          exo('Hip Thrust','🍑',
            `<strong>${effortSec}s :</strong><br>① Épaules sur canapé ou chaise, pieds à plat<br>② Monte les hanches, serre les fessiers fort<br>③ Tiens <strong>2s</strong> en haut, descends <strong>3s</strong>`,
            'Charge avec un sac à dos lesté si trop facile'),
          exo('Pompes déclinées','💪',
            `<strong>${effortSec}s :</strong><br>① Pieds sur chaise, mains au sol, corps aligné<br>② Descente <strong>3s</strong>, remontée explosive`,
            'Pompes normales si pas de chaise disponible'),
          exo('Superman','🔷',
            `<strong>12 reps :</strong><br>① Allongé face au sol, bras tendus devant toi<br>② Décolle simultanément les bras et les jambes<br>③ Tiens <strong>2s</strong> en haut, descends lentement <strong>3s</strong>`,
            'Dos, fessiers, ischios — tout en même temps'),
          exo('Nordic Curl','🦵',
            `<strong>4 à 6 reps :</strong><br>① Pieds coincés sous un meuble lourd ou tenus par quelqu'un<br>② Corps droit. Laisse-toi tomber vers l'avant le plus lentement possible<br>③ Les ischios freinent la chute — 4 à 5 secondes pour descendre<br>④ Mets les mains pour te rattraper, remonte avec les bras<br>⑤ Même 3 reps propres c'est excellent`,
            'L\'exercice anti-blessure ischios n°1 pour le handball. Difficile mais indispensable.'),
        ],
      },
      {
        titre:'Fractionné court — 6 × 1 min',
        icone:'⚡', duree:60,
        detail:`<strong>6 × 1 minute</strong> à <strong>${vit(vma,0.87)} km/h (${allure(vma,0.87)}/km)</strong><br><strong>1 min 30 de récup active</strong> (marche) entre chaque.<br>Effort intense — simulate les sprints de handball.`,
        note:`87% VMA · Après le renfo lourd, les jambes sont déjà chargées`,
      },
      blocPPP_v3(weekIdx),
      retourCalme5min(),
    ]);
  }

  // ── SEMAINE 4 : Peak ──────────────────────────────────────────────────────
  if(weekIdx === 3){
    return _buildRenfo(weekIdx, 'S4 — Peak 🔥 + Fractionné intense', '50 min', [
      echauff5min(),
      {
        titre:`Circuit Peak — ${nPassages} passages · ${label}`,
        icone:'🔥',
        detail:`<strong>${nPassages} passages · ${effortSec}s à fond · ${recupSec}s récup · 2 min entre passages</strong><br>La séance la plus dure du cycle — donne tout.`,
        sousBlocs:[
          exo('Squat sauté enchaîné','⚡',
            `<strong>${effortSec}s — sauts continus :</strong><br>① Squat profond + saut le plus haut possible<br>② Réception souple · Enchaîne sans pause`,
            'Le plus de répétitions possible — qualité des atterrissages obligatoire'),
          exo('Fente sautée max','⚡',
            `<strong>${effortSec}s — rythme maximum :</strong><br>① Saut en changeant de jambe à chaque répétition<br>② Reste bas, rythme le plus rapide possible`,
            'Finisseur — vide les réservoirs'),
          exo('Pompes explosives','💪',
            `<strong>${effortSec}s :</strong><br>① Remontée explosive, essaie de décoller les mains<br>② Claque des mains si tu y arrives · Corps gainé à chaque rep`,
            'Explosivité pectoraux et épaules'),
          exo('Hip Thrust unilatéral','🍑',
            `<strong>${effortSec}s par jambe :</strong><br>① Épaules sur canapé, UN pied au sol, l'autre jambe levée<br>② Monte les hanches sur une seule jambe, serre le fessier<br>③ Tiens <strong>2s</strong> en haut, descends <strong>3s</strong>`,
            'Bien plus dur que le bilatéral — renforce la stabilité du bassin'),
          exo('Nordic Curl — série complète','🦵',
            `<strong>5 à 8 reps :</strong><br>① Pieds coincés sous un meuble, corps droit<br>② Chute la plus lente possible — vise 5 secondes de descente<br>③ Mains pour se rattraper, remonte avec les bras<br>④ 2 min de récup entre passages`,
            'Volume maximum du cycle sur les ischios'),
          exo('Burpees','🔥',
            `<strong>${effortSec}s — finisseur absolu :</strong><br>① Debout → accroupi → planche → retour → saut bras levés<br>② Rythme le plus rapide en gardant la qualité`,
            'Dernier exercice du pic — vide complètement les réservoirs'),
        ],
      },
      {
        titre:'Fractionné — 8 × 1 min',
        icone:'⚡', duree:60,
        detail:`<strong>8 × 1 minute</strong> à <strong>${vit(vma,0.90)} km/h (${allure(vma,0.90)}/km)</strong><br><strong>1 min récup active</strong> entre chaque.<br>Effort maximal — c'est supposé faire mal.`,
        note:`90% VMA · Après le renfo peak = simulation fin de match 4e quart-temps`,
      },
      blocPPP_v3(weekIdx),
      retourCalme5min(),
    ]);
  }

  // ── SEMAINE 5 : Affûtage ──────────────────────────────────────────────────
  return _buildRenfo(weekIdx, 'S5 — Affûtage ⚡ + Cardio léger', '40-45 min', [
    echauff5min(),
    {
      titre:`Circuit Affûtage — ${nPassages} passages · ${label}`,
      icone:'⚡',
      detail:`<strong>${nPassages} passages · ${effortSec}s à fond · ${recupSec}s récup</strong><br>Volume réduit, intensité haute — on reste explosif et frais pour le collectif.`,
      sousBlocs:[
        exo('Squat sauté explosif','⚡',
          `<strong>${effortSec}s — saut maximum :</strong><br>① Squat + saut le plus haut · Réception souple`,
          'Qualité des sauts — pas de volume'),
        exo('Pompes explosives','💪',
          `<strong>${effortSec}s :</strong><br>① Remontée explosive, décoller les mains si possible`,
          'Explosivité pectoraux'),
        exo('Fente sautée','🦵',
          `<strong>${effortSec}s :</strong><br>① Échange de jambe en l'air à chaque rep`,
          'Réception souple'),
        exo('Gainage ventral','🔷',
          `<strong>${effortSec}s :</strong><br>① Corps aligné, abdos serrés, respire`,
          'Qualité obligatoire'),
        exo('Pont fessier','🍑',
          `<strong>${effortSec}s :</strong><br>① Monte les hanches, serre les fessiers, 2s en haut`,
          'Finir frais — on garde du jus pour le match'),
      ],
    },
    {
      titre:'Cardio léger — 8 min footing',
      icone:'🏃', duree:480,
      detail:`<strong>8 min</strong> de footing à <strong>${vit(vma,0.65)} km/h (${allure(vma,0.65)}/km)</strong><br>Allure très confortable — c'est de la récup active, pas du cardio.`,
      note:`Semaine du collectif — on conserve de l'énergie`,
    },
    blocPPP_v3(weekIdx),
    retourCalme5min(),
  ]);
}

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE 2 — CARDIO DOMINANT (Jeudi)
// 18-20 min cardio + 8-10 min renfo léger + PPP = 45-50 min
// ══════════════════════════════════════════════════════════════════════════════
export function genSeanceCardio(weekIdx, joueur, effortSec=35, recupSec=25){
  const vma = joueur.vma || 13;
  const gr = getGroupe(vma);
  const pctBase = gr==='A' ? 0.70 : gr==='B' ? 0.68 : 0.65;
  const pctSoutenu = gr==='A' ? 0.85 : gr==='B' ? 0.82 : 0.78;
  const pctMax = gr==='A' ? 0.92 : gr==='B' ? 0.88 : 0.84;

  // ── Renfo léger (fin de séance cardio) ────────────────────────────────────
  const renfoLeger = {
    titre:'Renfo léger — 2 passages',
    icone:'💪',
    detail:`<strong>2 passages · ${effortSec}s effort · ${recupSec}s récup · 1 min entre passages</strong><br>3 exercices seulement — on finit proprement sans s'épuiser.`,
    sousBlocs:[
      exo('Gainage ventral','🔷',
        `<strong>${effortSec}s :</strong><br>① Corps aligné, abdos serrés, respire normalement`,
        'Corps aligné de la tête aux talons'),
      exo('Pompes','💪',
        `<strong>${effortSec}s :</strong><br>① Descente lente 2s, remontée explosive · Sur les genoux si besoin`,
        'Qualité avant quantité'),
      exo('Pont fessier','🍑',
        `<strong>${effortSec}s :</strong><br>① Monte les hanches, serre les fessiers, 2s en haut`,
        'Pousse dans les talons'),
    ],
  };

  // ── S1 : Footing facile ───────────────────────────────────────────────────
  if(weekIdx === 0){
    return _buildCardio(weekIdx, 'S1 — Footing + Renfo léger', '45 min', [
      echauff5min(),
      {
        titre:'Footing continu — 18 min',
        icone:'🏃', duree:1080,
        detail:`<strong>18 min en continu</strong> à <strong>${vit(vma,pctBase)} km/h (${allure(vma,pctBase)}/km)</strong><br>Allure conversation — tu dois pouvoir parler. Si tu souffles trop : ralentis.`,
        note:`Groupe ${gr} · ${Math.round(pctBase*100)}% VMA · Réveiller le cardio sans le détruire`,
      },
      renfoLeger,
      blocPPP_v3(weekIdx),
      retourCalme5min(),
    ]);
  }

  // ── S2 : Footing progressif ────────────────────────────────────────────────
  if(weekIdx === 1){
    return _buildCardio(weekIdx, 'S2 — Footing progressif + Renfo léger', '45-50 min', [
      echauff5min(),
      {
        titre:'Footing progressif — 20 min',
        icone:'🏃', duree:1200,
        detail:
          `<strong>20 min :</strong><br>`+
          `① <strong>10 min</strong> à <strong>${vit(vma,pctBase)} km/h (${allure(vma,pctBase)}/km)</strong> — allure conversation<br>`+
          `② <strong>10 min</strong> à <strong>${vit(vma,pctBase+0.05)} km/h (${allure(vma,pctBase+0.05)}/km)</strong> — légèrement plus soutenu`,
        note:`Tu accélères à mi-parcours — reste régulier sur chaque moitié`,
      },
      renfoLeger,
      blocPPP_v3(weekIdx),
      retourCalme5min(),
    ]);
  }

  // ── S3 : Fractionné moyen ─────────────────────────────────────────────────
  if(weekIdx === 2){
    return _buildCardio(weekIdx, 'S3 — Fractionné + Renfo léger', '45-50 min', [
      echauff5min(),
      {
        titre:'Fractionné — 6 × 2 min',
        icone:'⚡', duree:120,
        detail:
          `<strong>6 fois : 2 min soutenu / 1 min 30 footing lent</strong><br>`+
          `Effort : <strong>${vit(vma,pctSoutenu)} km/h (${allure(vma,pctSoutenu)}/km)</strong><br>`+
          `Récup active : <strong>${vit(vma,0.55)} km/h (${allure(vma,0.55)}/km)</strong> — ne t'arrête pas complètement`,
        note:`Groupe ${gr} · ${Math.round(pctSoutenu*100)}% VMA · La séance cardio la plus dure du programme`,
      },
      renfoLeger,
      blocPPP_v3(weekIdx),
      retourCalme5min(),
    ]);
  }

  // ── S4 : Fractionné court intense ─────────────────────────────────────────
  if(weekIdx === 3){
    return _buildCardio(weekIdx, 'S4 — Fractionné court intense + Renfo', '45-50 min', [
      echauff5min(),
      {
        titre:'Fractionné court — 8 × 1 min',
        icone:'⚡', duree:60,
        detail:
          `<strong>8 fois : 1 min à fond / 1 min récup active</strong><br>`+
          `Effort : <strong>${vit(vma,pctMax)} km/h (${allure(vma,pctMax)}/km)</strong><br>`+
          `Récup : <strong>${vit(vma,0.55)} km/h</strong> — marche ou footing très lent`,
        note:`Groupe ${gr} · ${Math.round(pctMax*100)}% VMA · Simulation sprints répétés de handball`,
      },
      renfoLeger,
      blocPPP_v3(weekIdx),
      retourCalme5min(),
    ]);
  }

  // ── S5 : Footing affûtage ──────────────────────────────────────────────────
  return _buildCardio(weekIdx, 'S5 — Footing Affûtage + Renfo léger', '40 min', [
    echauff5min(),
    {
      titre:'Footing affûtage — 15 min',
      icone:'🏃', duree:900,
      detail:
        `<strong>15 min</strong> à <strong>${vit(vma,pctBase+0.05)} km/h (${allure(vma,pctBase+0.05)}/km)</strong><br>`+
        `Puis <strong>3 × 20m accélérations</strong> légères en fin de footing — reste relâché.`,
      note:`Semaine du collectif — on réveille les jambes sans les fatiguer`,
    },
    renfoLeger,
    blocPPP_v3(weekIdx),
    retourCalme5min(),
  ]);
}

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE 3 — RÉCUPÉRATION ACTIVE (Samedi — Facultative)
// ══════════════════════════════════════════════════════════════════════════════
export function genSeanceRecup(weekIdx, joueur){
  const vma = joueur.vma || 13;
  return {
    titre:'Récupération Active',
    type:'Récup', typeIcon:'🧘', typeColor:'#22C55E',
    obligatoire:false, tags:['recup'],
    semaine:weekIdx+1, duree:'30-40 min',
    notePoste:null,
    blocs:[
      {
        titre:'Au choix : vélo, natation ou footing léger',
        icone:'🚴', duree:1800,
        detail:`<strong>30 min très tranquilles</strong> à <strong>${vit(vma,0.60)} km/h max</strong> pour le footing.<br>Vélo ou natation si tu préfères — n'importe quoi qui bouge sans forcer.`,
        note:'Tu dois finir frais, pas fatigué — c\'est de la récupération, pas de l\'entraînement',
      },
      blocPPP_v3(weekIdx, true),
      {
        titre:'Mobilité & Étirements',
        icone:'🤸', duree:600,
        detail:
          '<strong>10 min — sans forcer :</strong><br>'+
          '① Hanches : grands cercles debout (10×/sens) · balancés de jambe avant-arrière (10×/jambe)<br>'+
          '② Épaules : grands cercles de bras (10×/sens) · étirement bras croisé devant (20s/côté)<br>'+
          '③ Ischios : assis jambes tendues, buste vers l\'avant · 30s/jambe<br>'+
          '④ Quadriceps : debout, talon aux fesses · 30s/jambe<br>'+
          '⑤ Dos : cat-cow à quatre pattes 10×',
        note:'Mouvements lents, amplitude confortable — tu relâches les tensions de la semaine',
      },
    ],
  };
}

// ── Builders internes ─────────────────────────────────────────────────────────
function _buildRenfo(weekIdx, titre, duree, blocs){
  return {
    titre, type:'Renfo dominant', typeIcon:'💪', typeColor:'var(--draveil)',
    obligatoire:true, tags:['renfo','cardio','ppp'],
    semaine:weekIdx+1, duree, notePoste:null,
    blocs:blocs.filter(Boolean),
  };
}
function _buildCardio(weekIdx, titre, duree, blocs){
  return {
    titre, type:'Cardio dominant', typeIcon:'🏃', typeColor:'var(--red)',
    obligatoire:true, tags:['cardio','renfo','ppp'],
    semaine:weekIdx+1, duree, notePoste:null,
    blocs:blocs.filter(Boolean),
  };
}
function _buildRecup(weekIdx, titre, duree, blocs){
  return {
    titre, type:'Récupération Active', typeIcon:'🧘', typeColor:'#22C55E',
    obligatoire:false, tags:['recup'],
    semaine:weekIdx+1, duree, notePoste:null,
    blocs:blocs.filter(Boolean),
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// ENTRÉE PRINCIPALE — génère les 3 séances de la semaine
// ══════════════════════════════════════════════════════════════════════════════
export function genPhase2IndivSessions(weekIdx, joueur, ressenti='normal', materiel='auto'){
  // Compatible avec l'appel Lovable (ressenti, materiel)
  // Le rythme est calculé automatiquement depuis le dernier RPE du joueur
  const dernierRpe = joueur?.seances_validees?.slice(-1)?.[0]?.rpe ?? null;
  const rythme = getRhythmeSuggere(dernierRpe);

  return [
    genSeanceRenfo(weekIdx, joueur, rythme.effortSec, rythme.recupSec),
    genSeanceCardio(weekIdx, joueur, rythme.effortSec, rythme.recupSec),
    genSeanceRecup(weekIdx, joueur),
  ];
}

// Compat avec ancien code qui appelle genPhase2Sessions
export function genPhase2Sessions(weekIdx, joueur){
  return genPhase2IndivSessions(weekIdx, joueur);
}

// Compat avec genSessionA/B/C (utilisés dans quelques endroits)
export function genSessionA(weekIdx, joueur){ return genSeanceCardio(weekIdx, joueur); }
export function genSessionB(weekIdx, joueur){ return genSeanceRenfo(weekIdx, joueur); }
export function genSessionC(weekIdx, joueur){ return genSeanceRecup(weekIdx, joueur); }

// Compat ancienne signature genIndivCardio/Renfo/Recup
export function genIndivCardio(weekIdx, joueur, ressenti='normal'){ return genSeanceCardio(weekIdx, joueur); }
export function genIndivRenfo(weekIdx, joueur, ressenti='normal', mat='aucun'){ return genSeanceRenfo(weekIdx, joueur); }
export function genIndivRecup(weekIdx, joueur, ressenti='normal'){ return genSeanceRecup(weekIdx, joueur); }



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
export let sb = null;
try {
  const {createClient} = window.supabase;
  sb = createClient(SUPABASE_URL, SUPABASE_KEY);
} catch(e){ console.warn('Supabase init failed',e); }

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
