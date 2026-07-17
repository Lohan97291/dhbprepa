import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Copy, Hourglass, Info } from "lucide-react";
import { toast } from "sonner";

import { GlassCard } from "@/components/draveil/glass-card";
import { DhbMark } from "@/components/draveil/logo";
import { sbGetJoueur } from "@/lib/supabase";
import { session } from "@/lib/draveil/session";

export const Route = createFileRoute("/attente")({
  head: () => ({
    meta: [
      { title: "Inscription envoyée — Draveil HB" },
      {
        name: "description",
        content:
          "Ton profil Draveil Handball est en attente de validation par le coach.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    code: typeof s.code === "string" ? s.code : "",
  }),
  component: WaitingPage,
});

function WaitingPage() {
  const navigate = useNavigate();
  const { code } = Route.useSearch();

  function copy() {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    toast.success("Code copié");
  }

  async function tryEnter() {
    if (!code) return;
    const j = await sbGetJoueur(code);
    if (!j) {
      toast.error("Code introuvable");
      return;
    }
    if (j.statut_compte === "attente") {
      toast("Toujours en attente de validation coach", { icon: "⏳" });
      return;
    }
    session.setJoueur(j);
    navigate({ to: "/joueur" });
  }

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, color-mix(in oklab, var(--draveil) 30%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 py-10 text-center">
        <button
          onClick={() => navigate({ to: "/" })}
          className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-muted-foreground hover:text-foreground"
          aria-label="Retour"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <DhbMark size={44} />

        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 14, stiffness: 200 }}
          className="mt-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-300/15 text-amber-200 shadow-[0_10px_40px_-10px_rgba(251,191,36,0.4)] ring-1 ring-amber-300/30"
        >
          <Hourglass className="h-9 w-9" strokeWidth={2.2} />
        </motion.div>

        <h1 className="mt-5 font-display text-3xl font-black uppercase tracking-tight text-gradient-brand">
          Inscription envoyée !
        </h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          Ton profil est en attente de validation par le coach. Tu recevras un
          message dès que tu seras accepté.
        </p>

        <GlassCard className="mt-8 w-full p-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Ton code de connexion
          </div>
          <div className="mt-3 font-display text-4xl font-black tracking-[0.35em] text-foreground">
            {code || "—"}
          </div>
          <button
            onClick={copy}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
            Copier le code
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            Note-le précieusement — il te sert à te reconnecter.
          </p>
        </GlassCard>

        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3 text-left text-[12px] leading-relaxed text-amber-100">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Reviens dans quelques heures avec ton code. Si le coach a validé, tu
            accéderas à ton programme.
          </span>
        </div>

        <button
          onClick={tryEnter}
          className="mt-6 w-full rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white shadow-brand"
        >
          Vérifier & entrer
        </button>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-3 text-xs text-muted-foreground hover:text-foreground"
        >
          Retour à l'accueil
        </button>
      </div>
    </main>
  );
}