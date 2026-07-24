import { PwaInstallBanner } from "@/components/draveil/PwaInstallBanner";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { KeyRound, LogOut, Pencil, Smartphone, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/draveil/glass-card";
import { session, useSession } from "@/lib/draveil/session";
import { JOURS_LONG } from "@/lib/draveil/core";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { sbChangeCode } from "@/lib/supabase";
import { updateOneSignalCode } from "@/lib/onesignal";

export const Route = createFileRoute("/joueur/profil")({
  component: ProfilPage,
});

function ProfilPage() {
  const navigate = useNavigate();
  const { joueur } = useSession();
  const { canInstall, install } = usePwaInstall();
  const [codeOpen, setCodeOpen] = useState(false);

  if (!joueur) return null;

  function logout() {
    session.logoutJoueur();
    navigate({ to: "/" });
  }

  function editProfile() {
    navigate({ to: "/inscription", search: { edit: joueur!.code } });
  }

  const initials = (
    (joueur.prenom?.[0] ?? "") + (joueur.nom?.[0] ?? "")
  ).toUpperCase();

  const joursLabels = (joueur.jours_seance ?? [])
    .map((i) => JOURS_LONG[i])
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-8 pt-12">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand text-xl font-black text-white shadow-brand">
          {initials || <User className="h-6 w-6" />}
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Profil
          </div>
          <h1 className="font-display text-2xl font-black tracking-tight">
            {joueur.prenom} {joueur.nom}
          </h1>
          <div className="text-sm text-muted-foreground">{joueur.poste}</div>
        </div>
      </div>

      <GlassCard className="mb-4 divide-y divide-white/5 p-0">
        <Row label="Code" value={joueur.code} />
        <Row label="Poste" value={joueur.poste ?? "—"} />
        <Row label="VMA" value={joueur.vma ? `${joueur.vma} km/h` : "—"} />
        <Row label="Jours de séance" value={joursLabels || "—"} />
        <Row
          label="Matériel"
          value={joueur.materiel?.length ? joueur.materiel.join(" · ") : "—"}
        />
      </GlassCard>

      <button
        onClick={editProfile}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white shadow-brand transition hover:brightness-110"
      >
        <Pencil className="h-4 w-4" />
        Modifier mon profil
      </button>

      <button
        onClick={() => setCodeOpen(true)}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] py-3.5 text-sm font-semibold text-foreground transition hover:border-[color:var(--draveil)]/40 hover:bg-[color:var(--draveil)]/[0.08]"
      >
        <KeyRound className="h-4 w-4" />
        Changer mon code de connexion
      </button>

      {canInstall && (
        <button
          onClick={install}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-[color:var(--draveil)]/40 bg-[color:var(--draveil)]/[0.08] py-3.5 text-sm font-bold text-foreground transition hover:bg-[color:var(--draveil)]/[0.14]"
        >
          <Smartphone className="h-4 w-4" />
          📲 Installer DHB Prépa
        </button>
      )}

      <PwaInstallBanner />

      <button
        onClick={logout}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] py-3.5 text-sm font-medium text-foreground/80 transition hover:border-red-500/30 hover:bg-red-500/[0.06] hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
        Se déconnecter
      </button>

      <AnimatePresence>
        {codeOpen && (
          <ChangeCodeSheet
            currentCode={joueur.code}
            onClose={() => setCodeOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ChangeCodeSheet({
  currentCode,
  onClose,
}: {
  currentCode: string;
  onClose: () => void;
}) {
  const [newCode, setNewCode] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    const target = newCode.trim().toUpperCase();
    if (target.length < 3) {
      toast.error("Minimum 3 caractères");
      return;
    }
    setSaving(true);
    const res = await sbChangeCode(currentCode, target);
    setSaving(false);

    if (!res.ok || !res.joueur) {
      toast.error(res.error ?? "Erreur, réessaie");
      return;
    }

    session.setJoueur(res.joueur);
    updateOneSignalCode(target);
    toast.success("Code modifié ✅", {
      description: `Ton nouveau code est ${target}`,
    });
    onClose();
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl border-t border-white/10 bg-[color:var(--background)]/98 p-6 backdrop-blur-2xl"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Connexion
            </div>
            <h3 className="mt-1 font-display text-xl font-black tracking-tight">
              🔑 Changer mon code
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Code actuel
          </div>
          <div className="mt-1 font-display text-lg font-black tracking-[0.2em]">
            {currentCode}
          </div>
        </div>

        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Nouveau code
        </label>
        <input
          autoFocus
          value={newCode}
          onChange={(e) =>
            setNewCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
          }
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="EX: LOHAN10"
          maxLength={12}
          className="w-full rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3.5 font-display text-lg font-bold tracking-[0.2em] text-foreground placeholder:text-muted-foreground/40 placeholder:font-normal placeholder:tracking-normal outline-none transition focus:border-[color:var(--draveil)]/60 focus:bg-white/[0.06]"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          3 à 12 caractères, lettres et chiffres uniquement. Note-le bien, c'est
          avec lui que tu te connecteras.
        </p>

        <button
          onClick={submit}
          disabled={saving || newCode.length < 3}
          className="mt-5 w-full rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white shadow-brand disabled:opacity-40"
        >
          {saving ? "Modification…" : "Enregistrer mon nouveau code"}
        </button>
      </motion.div>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
