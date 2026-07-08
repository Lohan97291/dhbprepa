import { useSyncExternalStore } from "react";
import type { Joueur } from "@/lib/supabase";

// Zustand-lite without the dep — tiny hand-rolled store.
// (avoids adding zustand for a single 30-line store)

type Listener = () => void;

interface State {
  joueur: Joueur | null;
  coach: { id: string; nom: string; role: string; emoji: string } | null;
}

let state: State = { joueur: null, coach: null };
const listeners = new Set<Listener>();

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export interface CoachSession {
  id: string;
  nom: string;
  role: string;
  emoji: string;
}

export const session = {
  get: () => state,
  setJoueur(j: Joueur | null) {
    set({ joueur: j });
    if (typeof window !== "undefined") {
      if (j?.code) localStorage.setItem("dhb_joueur_code", j.code);
      else localStorage.removeItem("dhb_joueur_code");
    }
  },
  setCoach(c: CoachSession | null) {
    set({ coach: c });
  },
  logoutJoueur() {
    set({ joueur: null });
    if (typeof window !== "undefined")
      localStorage.removeItem("dhb_joueur_code");
  },
  logoutCoach() {
    set({ coach: null });
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useSession() {
  return useSyncExternalStore(
    (l) => session.subscribe(l),
    () => state,
    () => state,
  );
}