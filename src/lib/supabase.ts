import { createClient } from "@supabase/supabase-js";

// Projet Draveil HB existant — mêmes données que l'ancienne app HTML.
export const SUPABASE_URL = "https://ylukjecryawgktojufxt.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsdWtqZWNyeWF3Z2t0b2p1Znh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzA0NDksImV4cCI6MjA5Njc0NjQ0OX0.CR2EFIEkW4FC5NZOw9fWRq3j0yTvC_pizidY4OGHdbk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// ── Domain helpers (mirroring the old vanilla API) ──────────────

export interface Joueur {
  code: string;
  prenom?: string;
  nom?: string;
  poste?: string;
  vma?: number;
  jours_seance?: number[];
  materiel?: string[];
  statut_compte?: "actif" | "attente" | "inactif";
  statut?: "actif" | "blesse" | "vacances" | "suspendu";
  note_coach?: string | null;
  message_coach?: string | null;
  seances_validees?: Array<{
    date: string;
    weekIdx: number;
    sessionIdx: number;
    rpe: number;
    missed?: boolean;
    ts: number;
    ressenti?: string;
    byCoach?: boolean;
  }>;
  badges?: string[];
  [k: string]: unknown;
}

export async function sbGetJoueur(code: string): Promise<Joueur | null> {
  const { data, error } = await supabase
    .from("joueurs")
    .select("code,data")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  if (error || !data) return null;
  return { ...(data.data as object), code: data.code } as Joueur;
}

export async function sbListJoueurs(): Promise<Joueur[]> {
  const { data, error } = await supabase
    .from("joueurs")
    .select("code,data,updated_at");
  if (error || !data) return [];
  return data.map((r) => ({ ...(r.data as object), code: r.code }) as Joueur);
}

export async function sbSaveJoueur(j: Joueur): Promise<void> {
  await supabase.from("joueurs").upsert(
    { code: j.code, data: j, updated_at: new Date().toISOString() },
    { onConflict: "code" },
  );
}

/**
 * Change le code de connexion d'un joueur.
 * Le code etant la cle primaire, on recree la ligne puis on supprime l'ancienne.
 */
export async function sbChangeCode(
  oldCode: string,
  newCode: string,
): Promise<{ ok: boolean; error?: string; joueur?: Joueur }> {
  const from = oldCode.trim().toUpperCase();
  const to = newCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{3,12}$/.test(to)) {
    return { ok: false, error: "Le code doit faire 3 a 12 caracteres (lettres et chiffres)." };
  }
  if (from === to) {
    return { ok: false, error: "C'est deja ton code actuel." };
  }

  const taken = await sbGetJoueur(to);
  if (taken) {
    return { ok: false, error: "Ce code est deja utilise, choisis-en un autre." };
  }

  const current = await sbGetJoueur(from);
  if (!current) {
    return { ok: false, error: "Compte introuvable." };
  }

  const updated: Joueur = { ...current, code: to };
  await sbSaveJoueur(updated);

  const check = await sbGetJoueur(to);
  if (!check) {
    return { ok: false, error: "Erreur lors de la creation du nouveau code." };
  }

  await sbDeleteJoueur(from);
  return { ok: true, joueur: updated };
}

export async function sbDeleteJoueur(code: string): Promise<void> {
  await supabase.from("joueurs").delete().eq("code", code.toUpperCase());
}

export async function sbGetMeta<T = unknown>(
  key: string,
  fallback: T,
): Promise<T> {
  const { data } = await supabase
    .from("meta")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return (data?.value as T) ?? fallback;
}

export async function sbSaveMeta(key: string, value: unknown): Promise<void> {
  try {
    await supabase.from("meta").upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );
  } catch (e) {
    console.warn("sbSaveMeta", e);
  }
}

export async function sbPing(): Promise<boolean> {
  try {
    const { error } = await supabase.from("joueurs").select("code").limit(1);
    return !error;
  } catch {
    return false;
  }
}