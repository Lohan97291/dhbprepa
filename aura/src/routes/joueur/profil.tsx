import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Pencil, Smartphone, User } from "lucide-react";

import { GlassCard } from "@/components/draveil/glass-card";
import { session, useSession } from "@/lib/draveil/session";
import { JOURS_LONG } from "@/lib/draveil/core";
import { usePwaInstall } from "@/hooks/use-pwa-install";

export const Route = createFileRoute("/joueur/profil")({
  component: ProfilPage,
});

function ProfilPage() {
  const navigate = useNavigate();
  const { joueur } = useSession();
  const { canInstall, install } = usePwaInstall();
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
        <Row
          label="Jours de séance"
          value={joursLabels || "—"}
        />
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

      {canInstall && (
        <button
          onClick={install}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-[color:var(--draveil)]/40 bg-[color:var(--draveil)]/[0.08] py-3.5 text-sm font-bold text-foreground transition hover:bg-[color:var(--draveil)]/[0.14]"
        >
          <Smartphone className="h-4 w-4" />
          📲 Installer DHB Prépa
        </button>
      )}

      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] py-3.5 text-sm font-medium text-foreground/80 transition hover:border-red-500/30 hover:bg-red-500/[0.06] hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
        Se déconnecter
      </button>
    </div>
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