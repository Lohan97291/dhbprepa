export const POSTES = [
  "Gardien",
  "Ailier G",
  "Ailier D",
  "Arrière G",
  "Arrière D",
  "Demi-centre",
  "Pivot",
] as const;

export type Poste = (typeof POSTES)[number];

export function genCode(prenom = "", nom = ""): string {
  const initials = ((prenom[0] || "") + (nom[0] || "")).toUpperCase() || "BH";
  const n = Math.floor(10 + Math.random() * 90);
  return initials + n;
}