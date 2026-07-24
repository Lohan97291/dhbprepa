/**
 * Illustrations SVG pour les exercices PPP
 * Inline, pas de dépendance externe, fonctionne offline
 */

// ── Couleurs communes ─────────────────────────────────────────────────────────
const C = {
  skin: '#F5C5A3',
  hair: '#3B2314',
  shirt: '#1e8c4a',
  short: '#145c30',
  shoe: '#222',
  bottle: '#94D2F7',
  bottleCap: '#2563EB',
  line: '#1e8c4a',
  bg: 'transparent',
};

// ── Composant de base ──────────────────────────────────────────────────────────
function Svg({ w = 160, h = 160, children }: { w?: number; h?: number; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

// ── 1. Bouteille Épaule — position de départ ──────────────────────────────────
// Bras tendu hauteur épaule, coude plié vers le bas, bouteille en main
export function IlluBouteilleDepart() {
  return (
    <Svg w={140} h={160}>
      {/* Corps */}
      <ellipse cx="70" cy="55" rx="14" ry="16" fill={C.skin} /> {/* tête */}
      <rect x="56" y="70" width="28" height="38" rx="6" fill={C.shirt} /> {/* torse */}
      <rect x="48" y="108" width="13" height="32" rx="5" fill={C.short} /> {/* jambe G */}
      <rect x="69" y="108" width="13" height="32" rx="5" fill={C.short} /> {/* jambe D */}
      <rect x="46" y="136" width="16" height="8" rx="3" fill={C.shoe} />
      <rect x="68" y="136" width="16" height="8" rx="3" fill={C.shoe} />
      {/* Bras gauche — tendu horizontal, coude plié vers bas */}
      <line x1="56" y1="80" x2="20" y2="80" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      <line x1="20" y1="80" x2="20" y2="105" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      {/* Bouteille gauche */}
      <rect x="12" y="103" width="16" height="28" rx="4" fill={C.bottle} opacity="0.85" />
      <rect x="14" y="99" width="12" height="6" rx="2" fill={C.bottleCap} />
      {/* Bras droit — tendu horizontal, coude plié vers bas */}
      <line x1="84" y1="80" x2="120" y2="80" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      <line x1="120" y1="80" x2="120" y2="105" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      {/* Bouteille droite */}
      <rect x="112" y="103" width="16" height="28" rx="4" fill={C.bottle} opacity="0.85" />
      <rect x="114" y="99" width="12" height="6" rx="2" fill={C.bottleCap} />
      {/* Flèche haut → derrière tête */}
      <path d="M28 76 Q28 55 55 50" stroke={C.line} strokeWidth="2" fill="none" strokeDasharray="4 3" markerEnd="url(#arr)" />
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.line} />
        </marker>
      </defs>
      {/* Label */}
      <text x="70" y="155" textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="sans-serif">Position départ</text>
    </Svg>
  );
}

// ── 2. Bouteille Épaule — position haute (bouteille derrière tête) ─────────────
export function IlluBouteilleHaut() {
  return (
    <Svg w={140} h={160}>
      {/* Corps */}
      <ellipse cx="70" cy="50" rx="14" ry="16" fill={C.skin} />
      <rect x="56" y="65" width="28" height="38" rx="6" fill={C.shirt} />
      <rect x="48" y="103" width="13" height="32" rx="5" fill={C.short} />
      <rect x="69" y="103" width="13" height="32" rx="5" fill={C.short} />
      <rect x="46" y="131" width="16" height="8" rx="3" fill={C.shoe} />
      <rect x="68" y="131" width="16" height="8" rx="3" fill={C.shoe} />
      {/* Bras gauche — coude plié, bouteille derrière tête */}
      <line x1="56" y1="75" x2="30" y2="60" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      <line x1="30" y1="60" x2="55" y2="35" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      {/* Bouteille derrière tête gauche */}
      <rect x="47" y="18" width="13" height="24" rx="4" fill={C.bottle} opacity="0.85" transform="rotate(-30 53 30)" />
      {/* Bras droit — coude plié, bouteille derrière tête */}
      <line x1="84" y1="75" x2="110" y2="60" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      <line x1="110" y1="60" x2="85" y2="35" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      {/* Bouteille droite */}
      <rect x="82" y="18" width="13" height="24" rx="4" fill={C.bottle} opacity="0.85" transform="rotate(30 88 30)" />
      {/* Label */}
      <text x="70" y="155" textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="sans-serif">Position haute</text>
    </Svg>
  );
}

// ── 3. Armé de tir — position départ (bras le long du corps) ─────────────────
export function IlluArmeDepart() {
  return (
    <Svg w={140} h={160}>
      {/* Corps */}
      <ellipse cx="70" cy="50" rx="14" ry="16" fill={C.skin} />
      <rect x="56" y="65" width="28" height="40" rx="6" fill={C.shirt} />
      <rect x="48" y="105" width="13" height="30" rx="5" fill={C.short} />
      <rect x="69" y="105" width="13" height="30" rx="5" fill={C.short} />
      <rect x="46" y="131" width="16" height="8" rx="3" fill={C.shoe} />
      <rect x="68" y="131" width="16" height="8" rx="3" fill={C.shoe} />
      {/* Bras gauche — le long du corps, coude légèrement fléchi */}
      <line x1="56" y1="72" x2="42" y2="105" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      {/* Bouteille gauche en bas */}
      <rect x="34" y="102" width="13" height="25" rx="4" fill={C.bottle} opacity="0.85" />
      <rect x="36" y="98" width="9" height="6" rx="2" fill={C.bottleCap} />
      {/* Bras droit */}
      <line x1="84" y1="72" x2="98" y2="105" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      {/* Bouteille droite */}
      <rect x="93" y="102" width="13" height="25" rx="4" fill={C.bottle} opacity="0.85" />
      <rect x="95" y="98" width="9" height="6" rx="2" fill={C.bottleCap} />
      {/* Flèche rotation vers haut */}
      <path d="M40 100 Q25 80 35 62" stroke={C.line} strokeWidth="2" fill="none" strokeDasharray="4 3" markerEnd="url(#arr2)" />
      <defs>
        <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.line} />
        </marker>
      </defs>
      <text x="70" y="155" textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="sans-serif">Position départ</text>
    </Svg>
  );
}

// ── 4. Armé de tir — position haute (coude plié, avant-bras vers le haut) ────
export function IlluArmeHaut() {
  return (
    <Svg w={140} h={160}>
      {/* Corps */}
      <ellipse cx="70" cy="50" rx="14" ry="16" fill={C.skin} />
      <rect x="56" y="65" width="28" height="40" rx="6" fill={C.shirt} />
      <rect x="48" y="105" width="13" height="30" rx="5" fill={C.short} />
      <rect x="69" y="105" width="13" height="30" rx="5" fill={C.short} />
      <rect x="46" y="131" width="16" height="8" rx="3" fill={C.shoe} />
      <rect x="68" y="131" width="16" height="8" rx="3" fill={C.shoe} />
      {/* Bras gauche armé — bras le long, avant-bras plié vers l'avant/haut */}
      <line x1="56" y1="72" x2="38" y2="90" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      <line x1="38" y1="90" x2="22" y2="65" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      {/* Bouteille gauche en haut */}
      <rect x="14" y="45" width="13" height="25" rx="4" fill={C.bottle} opacity="0.85" />
      <rect x="16" y="41" width="9" height="6" rx="2" fill={C.bottleCap} />
      {/* Bras droit armé */}
      <line x1="84" y1="72" x2="102" y2="90" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      <line x1="102" y1="90" x2="118" y2="65" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      {/* Bouteille droite */}
      <rect x="113" y="45" width="13" height="25" rx="4" fill={C.bottle} opacity="0.85" />
      <rect x="115" y="41" width="9" height="6" rx="2" fill={C.bottleCap} />
      <text x="70" y="155" textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="sans-serif">Position armé</text>
    </Svg>
  );
}

// ── 5. Équilibre une jambe ────────────────────────────────────────────────────
export function IlluEquilibre() {
  return (
    <Svg w={120} h={160}>
      {/* Tête */}
      <ellipse cx="60" cy="30" rx="14" ry="16" fill={C.skin} />
      {/* Corps */}
      <rect x="47" y="45" width="26" height="38" rx="6" fill={C.shirt} />
      {/* Bras légèrement écartés pour l'équilibre */}
      <line x1="47" y1="55" x2="22" y2="70" stroke={C.skin} strokeWidth="8" strokeLinecap="round" />
      <line x1="73" y1="55" x2="98" y2="70" stroke={C.skin} strokeWidth="8" strokeLinecap="round" />
      {/* Jambe d'appui */}
      <rect x="50" y="83" width="14" height="45" rx="5" fill={C.short} />
      <rect x="48" y="124" width="18" height="9" rx="3" fill={C.shoe} />
      {/* Jambe levée */}
      <line x1="63" y1="90" x2="88" y2="108" stroke={C.short} strokeWidth="13" strokeLinecap="round" />
      <line x1="88" y1="108" x2="88" y2="126" stroke={C.short} strokeWidth="11" strokeLinecap="round" />
      {/* Flèche balance */}
      <path d="M20 68 Q15 78 20 88" stroke={C.line} strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
      <text x="60" y="155" textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="sans-serif">Équilibre 1 jambe</text>
    </Svg>
  );
}

// ── 6. Gainage ventral ────────────────────────────────────────────────────────
export function IlluGainage() {
  return (
    <Svg w={180} h={100}>
      {/* Corps horizontal — planche */}
      {/* Tête */}
      <ellipse cx="158" cy="42" rx="13" ry="14" fill={C.skin} />
      {/* Corps */}
      <rect x="60" y="38" width="90" height="20" rx="6" fill={C.shirt} />
      {/* Jambes */}
      <rect x="22" y="40" width="40" height="16" rx="5" fill={C.short} />
      {/* Avant-bras appui gauche */}
      <rect x="120" y="55" width="12" height="22" rx="4" fill={C.skin} />
      <rect x="44" y="55" width="12" height="22" rx="4" fill={C.skin} />
      {/* Pieds */}
      <ellipse cx="28" cy="57" rx="9" ry="6" fill={C.shoe} />
      {/* Ligne droite corps */}
      <line x1="28" y1="50" x2="158" y2="50" stroke={C.line} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />
      <text x="90" y="92" textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="sans-serif">Corps aligné tête-talons</text>
    </Svg>
  );
}

// ── 7. Nordic Curl ────────────────────────────────────────────────────────────
export function IlluNordic() {
  return (
    <Svg w={180} h={130}>
      {/* Meuble/sol */}
      <rect x="10" y="90" width="50" height="10" rx="3" fill="#444" />
      {/* Pieds coincés */}
      <rect x="20" y="78" width="30" height="14" rx="3" fill={C.shoe} />
      {/* Jambes */}
      <rect x="25" y="50" width="20" height="32" rx="5" fill={C.short} />
      {/* Corps en chute vers l'avant — incliné */}
      <rect x="42" y="28" width="70" height="24" rx="6" fill={C.shirt} transform="rotate(35 42 52)" />
      {/* Tête */}
      <ellipse cx="115" cy="30" rx="13" ry="14" fill={C.skin} />
      {/* Bras tendus pour se rattraper */}
      <line x1="105" y1="42" x2="140" y2="65" stroke={C.skin} strokeWidth="8" strokeLinecap="round" />
      <line x1="85" y1="50" x2="120" y2="70" stroke={C.skin} strokeWidth="8" strokeLinecap="round" />
      {/* Flèche descente lente */}
      <path d="M120 25 Q140 45 145 68" stroke={C.line} strokeWidth="2" fill="none" strokeDasharray="4 3" markerEnd="url(#arrN)" />
      <text x="148" y="50" fontSize="9" fill={C.line} fontFamily="sans-serif">lent !</text>
      <defs>
        <marker id="arrN" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.line} />
        </marker>
      </defs>
      <text x="90" y="122" textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="sans-serif">Chute lente, mains pour rattraper</text>
    </Svg>
  );
}

// ── 8. Sauts stabilisés — réception ──────────────────────────────────────────
export function IlluSautStab() {
  return (
    <Svg w={140} h={160}>
      {/* Corps en réception — genoux fléchis */}
      <ellipse cx="70" cy="42" rx="14" ry="15" fill={C.skin} />
      <rect x="57" y="56" width="26" height="32" rx="6" fill={C.shirt} />
      {/* Bras légèrement écartés */}
      <line x1="57" y1="66" x2="30" y2="72" stroke={C.skin} strokeWidth="8" strokeLinecap="round" />
      <line x1="83" y1="66" x2="110" y2="72" stroke={C.skin} strokeWidth="8" strokeLinecap="round" />
      {/* Cuisses fléchies */}
      <line x1="62" y1="88" x2="52" y2="115" stroke={C.short} strokeWidth="13" strokeLinecap="round" />
      <line x1="78" y1="88" x2="88" y2="115" stroke={C.short} strokeWidth="13" strokeLinecap="round" />
      {/* Jambes bas */}
      <line x1="52" y1="115" x2="52" y2="140" stroke={C.short} strokeWidth="11" strokeLinecap="round" />
      <line x1="88" y1="115" x2="88" y2="140" stroke={C.short} strokeWidth="11" strokeLinecap="round" />
      {/* Pieds */}
      <rect x="40" y="136" width="24" height="9" rx="3" fill={C.shoe} />
      <rect x="76" y="136" width="24" height="9" rx="3" fill={C.shoe} />
      {/* Flèches genoux dans l'axe */}
      <line x1="52" y1="118" x2="52" y2="140" stroke={C.line} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
      <line x1="88" y1="118" x2="88" y2="140" stroke={C.line} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
      {/* 2s */}
      <text x="70" y="102" textAnchor="middle" fontSize="11" fontWeight="bold" fill={C.line} fontFamily="sans-serif">⏱ 2s</text>
      <text x="70" y="155" textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="sans-serif">Réception stabilisée</text>
    </Svg>
  );
}

// ── Export groupé par exercice ──────────────────────────────────────────────
export const PPP_ILLUSTRATIONS: Record<string, React.ReactNode[]> = {
  'bouteille-epaule': [<IlluBouteilleDepart key="d" />, <IlluBouteilleHaut key="h" />],
  'bouteille-arme':   [<IlluArmeDepart key="d" />, <IlluArmeHaut key="h" />],
  'equilibre':        [<IlluEquilibre key="e" />],
  'gainage':          [<IlluGainage key="g" />],
  'nordic':           [<IlluNordic key="n" />],
  'saut-stab':        [<IlluSautStab key="s" />],
};
