export interface Coach {
  id: string;
  nom: string;
  role: string;
  emoji: string;
  defPwd: string;
}

export const COACHES: Record<string, Coach> = {
  lohan: {
    id: "lohan",
    nom: "LOHAN",
    role: "Directeur sportif",
    emoji: "👑",
    defPwd: "1312",
  },
};