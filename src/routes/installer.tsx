import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle, Share, Plus, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/draveil/glass-card";
import { DhbMark } from "@/components/draveil/logo";

export const Route = createFileRoute("/installer")({
  component: InstallerPage,
});

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
}

function isInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

function InstallerPage() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform>("other");
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInstalled(isInstalled());
  }, []);

  if (installed) {
    return (
      <main className="relative min-h-dvh overflow-hidden">
        <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 14 }}
            className="flex h-24 w-24 items-center justify-center rounded-3xl bg-green-500/15 text-green-400 ring-1 ring-green-500/30"
          >
            <CheckCircle className="h-12 w-12" />
          </motion.div>
          <h1 className="mt-6 font-display text-3xl font-black tracking-tight text-gradient-brand">
            Déjà installée !
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            L'application DHB Prépa est déjà sur ton écran d'accueil. 🎉
          </p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-8 rounded-2xl gradient-brand px-8 py-3.5 text-sm font-bold text-white shadow-brand"
          >
            Retour à l'accueil
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, color-mix(in oklab, var(--draveil) 25%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-md px-6 pb-10 pt-14">
        <button
          onClick={() => navigate({ to: "/" })}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <DhbMark size={56} />
          <div>
            <h1 className="font-display text-2xl font-black tracking-tight text-gradient-brand">
              Installer l'app
            </h1>
            <p className="text-sm text-muted-foreground">
              DHB Prépa — Draveil Handball
            </p>
          </div>
        </div>

        {/* Selector iOS / Android */}
        <div className="mb-6 flex gap-2 rounded-2xl border border-white/8 bg-white/[0.03] p-1">
          {(["ios", "android"] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
                platform === p
                  ? "gradient-brand text-white shadow-brand"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "ios" ? "🍎 iPhone / iPad" : "🤖 Android"}
            </button>
          ))}
        </div>

        {platform === "ios" && (
          <motion.div
            key="ios"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Instructions Safari (iPhone / iPad)
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: <Share className="h-5 w-5" />,
                    title: "Ouvre Safari et va sur dhbprepa.vercel.app",
                    desc: "L'installation fonctionne uniquement depuis Safari sur iOS.",
                  },
                  {
                    icon: <Share className="h-5 w-5" />,
                    title: 'Appuie sur "Partager"',
                    desc: 'L\'icône carrée avec une flèche vers le haut, en bas de l\'écran.',
                  },
                  {
                    icon: <Plus className="h-5 w-5" />,
                    title: '"Sur l\'écran d\'accueil"',
                    desc: "Fais défiler le menu et appuie sur cette option.",
                  },
                  {
                    icon: <CheckCircle className="h-5 w-5" />,
                    title: 'Appuie sur "Ajouter"',
                    desc: "L'icône DHB Prépa apparaît sur ton écran d'accueil ! 🎉",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--draveil)]/15 text-[color:var(--draveil-glow)]">
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">
                        {i + 1}. {step.title}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {platform === "android" && (
          <motion.div
            key="android"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Instructions Chrome (Android)
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: <MoreVertical className="h-5 w-5" />,
                    title: "Ouvre Chrome et va sur dhbprepa.vercel.app",
                    desc: "L'installation fonctionne via Chrome sur Android.",
                  },
                  {
                    icon: <MoreVertical className="h-5 w-5" />,
                    title: 'Appuie sur les 3 points "⋮"',
                    desc: "En haut à droite de Chrome.",
                  },
                  {
                    icon: <Plus className="h-5 w-5" />,
                    title: '"Ajouter à l\'écran d\'accueil"',
                    desc: "Ou \"Installer l'application\" si la bannière apparaît automatiquement.",
                  },
                  {
                    icon: <CheckCircle className="h-5 w-5" />,
                    title: 'Appuie sur "Ajouter"',
                    desc: "L'icône DHB Prépa apparaît sur ton écran d'accueil ! 🎉",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--draveil)]/15 text-[color:var(--draveil-glow)]">
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">
                        {i + 1}. {step.title}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-6 w-full rounded-2xl border border-white/8 bg-white/[0.03] py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Retour à l'accueil
        </button>
      </div>
    </main>
  );
}
