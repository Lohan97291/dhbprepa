import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { BarChart3, Calendar, Home, User } from "lucide-react";

import { session, useSession } from "@/lib/draveil/session";
import { initOneSignal } from "@/lib/onesignal";
import { sbGetJoueur } from "@/lib/supabase";
import { WelcomeSlides } from "@/components/draveil/welcome-slides";
import { PageTransition } from "@/components/draveil/page-transition";

export const Route = createFileRoute("/joueur")({
  component: JoueurLayout,
});

type JTab = {
  to: "/joueur" | "/joueur/programme" | "/joueur/stats" | "/joueur/profil";
  label: string;
  icon: typeof Home;
  exact?: boolean;
};
const TABS: JTab[] = [
  { to: "/joueur", label: "Accueil", icon: Home, exact: true },
  { to: "/joueur/programme", label: "Programme", icon: Calendar },
  { to: "/joueur/stats", label: "Stats", icon: BarChart3 },
  { to: "/joueur/profil", label: "Profil", icon: User },
];

function JoueurLayout() {
  const navigate = useNavigate();
  const { joueur } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [showWelcome, setShowWelcome] = useState(false);

  // Restore session from localStorage on refresh
  useEffect(() => {
    if (joueur) return;
    const code = localStorage.getItem("dhb_joueur_code");
    if (!code) {
      navigate({ to: "/" });
      return;
    }
    sbGetJoueur(code).then((j) => {
      if (j) session.setJoueur(j);
      else navigate({ to: "/" });
    });
  }, [joueur, navigate]);

  // Init OneSignal push notifications
  useEffect(() => {
    if (!joueur?.code) return;
    initOneSignal(joueur.code, "joueur").catch(() => {});
  }, [joueur?.code]);

  // Welcome check (once per joueur)
  useEffect(() => {
    if (!joueur?.code) return;
    const done = localStorage.getItem("dhb_welcome_done_" + joueur.code);
    if (!done) setTimeout(() => setShowWelcome(true), 500);
  }, [joueur?.code]);

  function closeWelcome() {
    if (joueur?.code)
      localStorage.setItem("dhb_welcome_done_" + joueur.code, "1");
    setShowWelcome(false);
  }

  if (!joueur) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[color:var(--draveil)]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh pb-28">
      <PageTransition>
        <Outlet />
      </PageTransition>

      {/* Floating bottom nav */}
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", damping: 24 }}
        className="fixed bottom-4 left-1/2 z-40 w-[min(92vw,420px)] -translate-x-1/2"
      >
        <div className="glass-strong flex items-center gap-1 rounded-full p-1.5">
          {TABS.map((t) => {
            const active = t.exact
              ? pathname === t.to
              : pathname === t.to || pathname.startsWith(t.to + "/");
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-full py-2.5 text-[10px] font-semibold transition-colors"
              >
                {active && (
                  <motion.div
                    layoutId="joueur-tab-pill"
                    transition={{ type: "spring", damping: 28, stiffness: 300 }}
                    className="absolute inset-0 rounded-full gradient-brand shadow-brand"
                  />
                )}
                <Icon
                  className={`relative h-5 w-5 ${active ? "text-white" : "text-muted-foreground"}`}
                />
                <span
                  className={`relative ${active ? "text-white" : "text-muted-foreground"}`}
                >
                  {t.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {showWelcome && (
        <WelcomeSlides prenom={joueur.prenom} onClose={closeWelcome} />
      )}
    </div>
  );
}