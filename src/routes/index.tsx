import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Download, Lock, ShieldCheck, Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { DhbMark } from "@/components/draveil/logo";
import { PinInput } from "@/components/draveil/pin-input";
import { GlassCard } from "@/components/draveil/glass-card";
import { COACHES } from "@/lib/draveil/coaches";
import { session } from "@/lib/draveil/session";
import { sbGetJoueur, sbGetMeta } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

function InstallBanner() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return;
    if (localStorage.getItem("dhb_install_dismissed")) return;
    setShow(true);
  }, []);

  function dismiss() {
    localStorage.setItem("dhb_install_dismissed", "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="mb-4 w-full"
      >
        <div
          className="relative flex items-center gap-3 rounded-2xl border border-[color:var(--draveil)]/40 bg-[color:var(--draveil)]/[0.12] px-4 py-3.5 cursor-pointer"
          onClick={() => navigate({ to: "/installer" })}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--draveil)]/20">
            <Download className="h-5 w-5 text-[color:var(--draveil-glow)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-foreground">
              📲 Installer l'application
            </div>
            <div className="text-xs text-muted-foreground">
              Accès rapide depuis ton écran d'accueil
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); dismiss(); }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);

  // Auto-reconnexion : si un code joueur est déjà enregistré, on redirige direct
  useEffect(() => {
    const saved = localStorage.getItem("dhb_joueur_code");
    if (saved) {
      sbGetJoueur(saved).then((j) => {
        if (j) {
          session.setJoueur(j);
          navigate({ to: "/joueur" });
        }
      });
    }
  }, [navigate]);

  async function handleLoginJoueur() {
    const c = code.trim().toUpperCase();
    if (!c) {
      toast.error("Entre ton code joueur");
      return;
    }
    setLoading(true);
    const j = await sbGetJoueur(c);
    setLoading(false);
    if (!j) {
      toast.error("Code invalide");
      return;
    }
    session.setJoueur(j);
    navigate({ to: "/joueur" });
  }

  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, color-mix(in oklab, var(--draveil) 30%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pb-10 pt-14">

        {/* Bannière install en haut */}
        <InstallBanner />

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <DhbMark size={72} />
          <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Draveil Handball · 1972
          </div>
          <h1 className="mt-2 font-display text-4xl font-black leading-[1.05] tracking-tight text-gradient-brand">
            Ta prépa.
            <br />
            Personnalisée.
          </h1>
          <p className="mt-3 max-w-[280px] text-sm text-muted-foreground">
            Programme sur mesure, suivi coach en temps réel et statistiques de
            progression.
          </p>
        </motion.div>

        {/* Joueur card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[color:var(--draveil)] shadow-[0_0_10px_var(--draveil-glow)]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Espace joueur
              </span>
            </div>
            <label className="text-sm font-medium text-foreground/90">
              Ton code personnel
            </label>
            <div className="mt-2 flex gap-2">
              <input
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleLoginJoueur()}
                placeholder="ABC12"
                className="flex-1 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3.5 font-display text-lg font-bold tracking-[0.3em] text-foreground placeholder:text-muted-foreground/40 placeholder:font-normal placeholder:tracking-normal outline-none focus:border-[color:var(--draveil)]/60 focus:bg-white/[0.06] transition"
                maxLength={12}
              />
              <button
                onClick={handleLoginJoueur}
                disabled={loading}
                className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl gradient-brand text-white shadow-brand transition active:scale-95 disabled:opacity-60"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Pas encore de code ? Demande-le à ton coach.
            </p>
          </GlassCard>
        </motion.div>

        {/* Séparateur + Inscription nouveau joueur */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6"
        >
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground/60">
            <div className="h-px flex-1 bg-white/8" />
            ou
            <div className="h-px flex-1 bg-white/8" />
          </div>
          <button
            onClick={() => navigate({ to: "/inscription", search: {} })}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[color:var(--draveil)]/30 bg-[color:var(--draveil)]/[0.08] px-4 py-3.5 text-sm font-semibold text-foreground transition hover:border-[color:var(--draveil)]/60 hover:bg-[color:var(--draveil)]/[0.14] active:scale-[0.99]"
          >
            <Sparkles className="h-4 w-4 text-[color:var(--draveil)]" />
            Je suis nouveau — Créer mon compte
          </button>
        </motion.div>

        <div className="flex-1" />

        {/* Coach discreet button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => setCoachOpen(true)}
          className="mx-auto mt-8 flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-white/15 hover:text-foreground"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Accès coach
        </motion.button>

        <div className="mt-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground/60">
          v1.0 · Draveil HB
        </div>
      </div>

      {coachOpen && (
        <CoachLoginSheet onClose={() => setCoachOpen(false)} />
      )}
    </main>
  );
}

function CoachLoginSheet({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const coach = COACHES.lohan;

  async function submit(code?: string) {
    const entered = (code ?? pwd).trim();
    if (entered.length < 4) return;
    setLoading(true);
    const stored = await sbGetMeta<string | null>(
      "coach_pwd_" + coach.id,
      null,
    );
    const valid =
      stored && /^\d{4}$/.test(String(stored))
        ? String(stored)
        : coach.defPwd;
    setLoading(false);
    if (entered !== valid) {
      toast.error("Code incorrect");
      setPwd("");
      return;
    }
    session.setCoach({
      id: coach.id,
      nom: coach.nom,
      role: coach.role,
      emoji: coach.emoji,
    });
    navigate({ to: "/coach" });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md sm:items-center"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        className="glass-strong w-full max-w-sm rounded-t-[28px] p-6 sm:rounded-[28px]"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-brand text-white">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-lg font-black tracking-tight">
              Accès Coach
            </div>
            <div className="text-xs text-muted-foreground">
              {coach.emoji} {coach.nom} · {coach.role}
            </div>
          </div>
        </div>
        <div className="mb-3 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Code PIN
        </div>
        <PinInput
          autoFocus
          value={pwd}
          onChange={setPwd}
          onComplete={(v) => submit(v)}
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/8 bg-white/[0.03] py-3 text-sm font-medium text-foreground hover:bg-white/[0.06]"
          >
            Annuler
          </button>
          <button
            onClick={() => submit()}
            disabled={loading || pwd.length < 4}
            className="flex-1 rounded-2xl gradient-brand py-3 text-sm font-bold text-white shadow-brand disabled:opacity-40"
          >
            Connexion →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
