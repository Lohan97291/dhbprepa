import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, X, Share, Plus } from "lucide-react";
import { GlassCard } from "@/components/draveil/glass-card";

type Platform = "ios" | "android" | "desktop" | "unknown";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  if (typeof window !== "undefined" && window.innerWidth > 768) return "desktop";
  return "unknown";
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallBanner() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return; // Déjà installé
    if (localStorage.getItem("dhb_pwa_dismissed")) return;

    const p = detectPlatform();
    setPlatform(p);
    setShow(true);

    // Android / Desktop : intercepter le prompt natif
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem("dhb_pwa_dismissed", "1");
    setShow(false);
  }

  async function install() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
        setShow(false);
      }
    }
  }

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="mt-6 w-full"
      >
        <GlassCard className="relative overflow-hidden border-[color:var(--draveil)]/30 p-5">
          {/* Glow déco */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, var(--draveil-glow) 0%, transparent 70%)",
            }}
          />

          <button
            onClick={dismiss}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05] text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--draveil)]/15 ring-1 ring-[color:var(--draveil)]/30">
              <img
                src="/icon-512.png"
                alt="DHB Prépa"
                className="h-9 w-9 rounded-xl object-contain"
              />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--draveil-glow)]">
                Installer l'app
              </div>
              <div className="mt-0.5 font-display text-base font-black tracking-tight">
                DHB Prépa
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Installe l'application sur ton téléphone pour un accès rapide et une
            expérience optimale.
          </p>

          {/* Instructions selon plateforme */}
          {platform === "ios" && (
            <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Sur iPhone / iPad
              </div>
              <ol className="mt-2 space-y-2">
                {[
                  <>
                    Appuie sur{" "}
                    <Share className="inline h-3.5 w-3.5 align-middle" />{" "}
                    <strong>Partager</strong> en bas de Safari
                  </>,
                  <>
                    Sélectionne{" "}
                    <strong>
                      <Plus className="inline h-3 w-3 align-middle" /> Sur
                      l'écran d'accueil
                    </strong>
                  </>,
                  <>
                    Appuie sur <strong>Ajouter</strong>
                  </>,
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--draveil)]/20 text-[9px] font-bold text-[color:var(--draveil-glow)]">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {platform === "android" && deferredPrompt && (
            <button
              onClick={install}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-3 text-sm font-bold text-white shadow-brand"
            >
              <Download className="h-4 w-4" />
              Installer sur Android
            </button>
          )}

          {platform === "android" && !deferredPrompt && (
            <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Sur Android
              </div>
              <ol className="mt-2 space-y-2">
                {[
                  "Appuie sur les 3 points ⋮ en haut à droite de Chrome",
                  'Sélectionne "Ajouter à l\'écran d\'accueil"',
                  'Appuie sur "Ajouter"',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--draveil)]/20 text-[9px] font-bold text-[color:var(--draveil-glow)]">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {platform === "desktop" && deferredPrompt && (
            <button
              onClick={install}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-3 text-sm font-bold text-white shadow-brand"
            >
              <Download className="h-4 w-4" />
              Installer l'application
            </button>
          )}

          <button
            onClick={dismiss}
            className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            Plus tard
          </button>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}
