import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { motion } from "motion/react";
import { KeyRound, Lock, LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DhbMark } from "@/components/draveil/logo";
import { PinInput } from "@/components/draveil/pin-input";
import { session, useSession } from "@/lib/draveil/session";
import { initOneSignal } from "@/lib/onesignal";
import { PageTransition } from "@/components/draveil/page-transition";
import { COACHES } from "@/lib/draveil/coaches";
import { sbGetMeta, sbSaveMeta } from "@/lib/supabase";
import { GlassCard } from "@/components/draveil/glass-card";

export const Route = createFileRoute("/coach")({
  component: CoachLayout,
});

type CTab = {
  to:
    | "/coach"
    | "/coach/joueurs"
    | "/coach/semaine"
    | "/coach/stats"
    | "/coach/planning"
    | "/coach/seances"
    | "/coach/biblio"
    | "/coach/annonce"
    | "/coach/programmes";
  label: string;
  exact?: boolean;
};
const TABS: CTab[] = [
  { to: "/coach", label: "Tableau de bord", exact: true },
  { to: "/coach/joueurs", label: "Joueurs" },
  { to: "/coach/semaine", label: "Semaine" },
  { to: "/coach/stats", label: "Stats" },
  { to: "/coach/planning", label: "Planning" },
  { to: "/coach/seances", label: "Séances" },
  { to: "/coach/biblio", label: "Biblio PPP" },
  { to: "/coach/annonce", label: "Annonce" },
  { to: "/coach/programmes", label: "Programmes" },
];

function CoachLayout() {
  const navigate = useNavigate();
  const { coach } = useSession();
  const [restoring, setRestoring] = useState(true);

  // Restore coach session from localStorage
  useEffect(() => {
    if (coach) {
      setRestoring(false);
      return;
    }
    const saved = localStorage.getItem("dhb_coach");
    if (saved) {
      try {
        session.setCoach(JSON.parse(saved));
      } catch {
        localStorage.removeItem("dhb_coach");
      }
    }
    setRestoring(false);
  }, [coach]);

  // Init OneSignal push notifications
  useEffect(() => {
    if (!coach?.id) return;
    initOneSignal(coach.id, "coach").catch(() => {});
  }, [coach?.id]);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [pwdOpen, setPwdOpen] = useState(false);

  if (restoring) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--draveil)] border-t-transparent" />
      </div>
    );
  }

  if (!coach) return <CoachLogin />;

  function logout() {
    session.logoutCoach();
    navigate({ to: "/" });
  }

  return (
    <div className="relative min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <DhbMark size={36} />
            <div className="leading-tight">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Coach · Draveil HB
              </div>
              <div className="font-display text-sm font-black tracking-tight">
                {coach.emoji} {coach.nom}
                <span className="ml-2 text-xs font-medium text-muted-foreground">
                  {coach.role}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPwdOpen(true)}
              title="Changer mon mot de passe"
              className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-white/15 hover:text-foreground"
            >
              <KeyRound className="h-3.5 w-3.5" />
              🔑
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-white/15 hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="scroll-slim mx-auto max-w-6xl overflow-x-auto px-3 pb-2">
          <div className="flex gap-1">
            {TABS.map((t) => {
              const active = t.exact
                ? pathname === t.to
                : pathname === t.to || pathname.startsWith(t.to + "/");
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className="relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                >
                  {active && (
                    <motion.div
                      layoutId="coach-tab-pill"
                      transition={{
                        type: "spring",
                        damping: 28,
                        stiffness: 300,
                      }}
                      className="absolute inset-0 rounded-full gradient-brand shadow-brand"
                    />
                  )}
                  <span
                    className={`relative ${active ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      {pwdOpen && (
        <ChangePwdSheet coachId={coach.id} onClose={() => setPwdOpen(false)} />
      )}
    </div>
  );
}

function ChangePwdSheet({
  coachId,
  onClose,
}: {
  coachId: string;
  onClose: () => void;
}) {
  const [oldP, setOldP] = useState("");
  const [newP, setNewP] = useState("");
  const [conf, setConf] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    const current = await resolvePin(coachId);
    if (oldP.trim() !== current) {
      setSaving(false);
      toast.error("Ancien code incorrect");
      setOldP("");
      return;
    }
    if (!/^\d{4}$/.test(newP)) {
      setSaving(false);
      toast.error("Le code doit faire 4 chiffres");
      return;
    }
    if (newP !== conf) {
      setSaving(false);
      toast.error("Les codes ne correspondent pas");
      return;
    }
    await sbSaveMeta("coach_pwd_" + coachId, newP);
    setSaving(false);
    toast.success("Code PIN modifié ✅");
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
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl border-t border-white/10 bg-[color:var(--background)]/98 p-6 backdrop-blur-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Sécurité
            </div>
            <h3 className="mt-1 font-display text-xl font-black tracking-tight">
              🔑 Changer le code PIN
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Code actuel
            </div>
            <PinInput value={oldP} onChange={setOldP} />
          </div>
          <div>
            <div className="mb-2 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Nouveau code
            </div>
            <PinInput value={newP} onChange={setNewP} />
          </div>
          <div>
            <div className="mb-2 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Confirmer
            </div>
            <PinInput value={conf} onChange={setConf} />
          </div>
          <button
            onClick={submit}
            disabled={saving}
            className="w-full rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white shadow-brand disabled:opacity-40"
          >
            {saving ? "Sauvegarde…" : "Enregistrer"}
          </button>
        </div>
      </motion.div>
    </>
  );
}

/** Retourne le PIN valide : le PIN enregistre s'il fait 4 chiffres, sinon celui par defaut. */
async function resolvePin(coachId: string): Promise<string> {
  const stored = await sbGetMeta<string | null>("coach_pwd_" + coachId, null);
  if (stored && /^\d{4}$/.test(String(stored))) return String(stored);
  return COACHES[coachId]?.defPwd || "1972";
}

function CoachLogin() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const coach = COACHES.lohan;

  async function submit(code?: string) {
    const entered = (code ?? pwd).trim();
    if (entered.length < 4) return;
    setLoading(true);
    const valid = await resolvePin(coach.id);
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
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, color-mix(in oklab, var(--draveil) 30%, transparent) 0%, transparent 60%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <DhbMark size={56} />
          <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Accès restreint · Coach
          </div>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-gradient-brand">
            Espace Coach
          </h1>
        </div>
        <GlassCard className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-brand text-white shadow-brand">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-base font-black tracking-tight">
                {coach.emoji} {coach.nom}
              </div>
              <div className="text-xs text-muted-foreground">{coach.role}</div>
            </div>
          </div>
          <label className="mb-3 block text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Code PIN
          </label>
          <PinInput
            autoFocus
            value={pwd}
            onChange={setPwd}
            onComplete={(v) => submit(v)}
          />
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigate({ to: "/" })}
              className="flex-1 rounded-2xl border border-white/8 bg-white/[0.03] py-3 text-sm font-medium text-foreground hover:bg-white/[0.06]"
            >
              Annuler
            </button>
            <button
              onClick={() => submit()}
              disabled={loading || pwd.length < 4}
              className="flex-[2] rounded-2xl gradient-brand py-3 text-sm font-bold text-white shadow-brand disabled:opacity-40"
            >
              {loading ? "Vérification…" : "Connexion →"}
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </main>
  );
}