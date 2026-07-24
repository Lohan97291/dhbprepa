import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Activity, Calendar, Flame, PlayCircle, Sparkles, X } from "lucide-react";

import { GlassCard } from "@/components/draveil/glass-card";
import { DhbMark } from "@/components/draveil/logo";
import {
  SeanceDetailSheet,
  type SeanceLike,
} from "@/components/draveil/seance-detail";
import { WelcomeSlides } from "@/components/draveil/welcome-slides";
import { useSession } from "@/lib/draveil/session";
import { sbSaveJoueur, sbGetMeta } from "@/lib/supabase";
import { session } from "@/lib/draveil/session";
import {
  getPhaseActuelle,
  getSeanceDuJour,
  PHASES_DATES,
  formatDate,
  getSessionDatesIndiv,
  genPhase2IndivSessions,
} from "@/lib/draveil/core";

export const Route = createFileRoute("/joueur/")({
  component: JoueurHome,
});

function JoueurHome() {
  const { joueur } = useSession();
  const [openSeance, setOpenSeance] = useState<{
    seance: SeanceLike;
    weekIdx: number;
    sessionIdx: number;
    date: string;
  } | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [suggestionNext, setSuggestionNext] = useState<{ message: string; conseil: string } | null>(null);
  const CHANGELOG_VERSION = "v1.5";
  const CHANGELOG_NOTES = [
    "▶️ Séance guidée étape par étape avec timer plein écran",
    "🔆 L'écran reste allumé pendant les timers",
    "🏋️ Nouveau programme renfo/cardio alterné — 45-50 min",
    "🛡️ Exercices bouteilles Thomas dans toutes les séances",
  ];
  const [annonce, setAnnonce] = useState<{ text: string; date: string } | null>(
    null,
  );

  useEffect(() => {
    sbGetMeta<{ text: string; date: string } | null>("annonce", null).then(
      setAnnonce,
    );
  }, []);

  async function dismissCoachMessage() {
    if (!joueur) return;
    const next = { ...joueur, message_coach: null };
    await sbSaveJoueur(next);
    session.setJoueur(next);
  }

  useEffect(() => {
    if (!joueur?.code || typeof window === "undefined") return;
    const key = "dhb_welcome_done_" + joueur.code;
    if (!localStorage.getItem(key)) setShowWelcome(true);
    const clKey = "dhb_changelog_v1.5_" + joueur.code;
    if (!localStorage.getItem(clKey)) setShowChangelog(true);
  }, [joueur?.code]);

  function closeWelcome() {
    if (joueur?.code && typeof window !== "undefined") {
      localStorage.setItem("dhb_welcome_done_" + joueur.code, "1");
    }
    setShowWelcome(false);
  }

  function closeChangelog() {
    if (joueur?.code && typeof window !== "undefined") {
      localStorage.setItem("dhb_changelog_v1.5_" + joueur.code, "1");
    }
    setShowChangelog(false);
  }

  const today = useMemo(() => new Date(), []);
  const phase = useMemo(() => getPhaseActuelle(today), [today]);
  const seanceDuJour = useMemo(
    () => (joueur ? getSeanceDuJour(joueur, today) : null),
    [joueur, today],
  );

  // Next scheduled session (Phase 2 indiv) when no session today.
  const nextIndiv = useMemo(() => {
    if (!joueur) return null;
    const dates = getSessionDatesIndiv(joueur);
    const iso = today.toISOString().split("T")[0];
    const next = dates.find((d) => d.date >= iso);
    if (!next) return null;
    const sessions = genPhase2IndivSessions(next.weekIdx, joueur);
    return { ...next, seance: sessions[next.sessIdx] as SeanceLike };
  }, [joueur, today]);

  if (!joueur) return null;
  const nbSeances = joueur.seances_validees?.length ?? 0;
  const validated = joueur.seances_validees ?? [];

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-8 pt-12">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Draveil HB
          </div>
          <h1 className="mt-1 font-display text-2xl font-black tracking-tight">
            Salut {joueur.prenom} 👋
          </h1>
        </div>
        <DhbMark size={44} />
      </motion.header>

      {joueur.message_coach && (
        <GlassCard className="mb-4 border-[color:var(--draveil)]/30 bg-[color:var(--draveil)]/[0.08] p-4">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--draveil-glow)]">
            💬 Message de ton coach
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
            {joueur.message_coach}
          </p>
          <button
            onClick={dismissCoachMessage}
            className="mt-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-foreground/80 hover:text-foreground"
          >
            Lu ✓
          </button>
        </GlassCard>
      )}

      {annonce?.text && (
        <GlassCard className="mb-4 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            📢 Annonce équipe
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
            {annonce.text}
          </p>
        </GlassCard>
      )}

      {/* Séance du jour OU prochaine séance */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        {seanceDuJour ? (
          <SeanceHero
            label="Séance du jour"
            seance={seanceDuJour.session as SeanceLike}
            dateLabel={formatDate(today)}
            onOpen={() =>
              setOpenSeance({
                seance: seanceDuJour.session as SeanceLike,
                weekIdx: seanceDuJour.weekIdx,
                sessionIdx: seanceDuJour.idx,
                date: today.toISOString().split("T")[0],
              })
            }
          />
        ) : nextIndiv ? (
          <SeanceHero
            label="Prochaine séance"
            seance={nextIndiv.seance}
            dateLabel={formatDate(nextIndiv.date)}
            onOpen={() =>
              setOpenSeance({
                seance: nextIndiv.seance,
                weekIdx: nextIndiv.weekIdx,
                sessionIdx: nextIndiv.sessIdx,
                date: nextIndiv.date,
              })
            }
          />
        ) : (
          <GlassCard className="relative overflow-hidden p-6">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--draveil-glow)]">
              {phase === "avant" || phase === "p1"
                ? "En attente"
                : "Programme terminé"}
            </div>
            <div className="mt-2 font-display text-2xl font-black tracking-tight">
              {phase === "avant" || phase === "p1"
                ? "Prépa individuelle"
                : "Bien joué"}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Démarre le {formatDate(PHASES_DATES.p2.debut)}
            </div>
          </GlassCard>
        )}
      </motion.div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 grid grid-cols-3 gap-3"
      >
        <StatTile
          icon={Activity}
          label="VMA"
          value={joueur.vma ?? "—"}
          unit="km/h"
        />
        <StatTile icon={Flame} label="Séances" value={nbSeances} />
        <StatTile
          icon={Sparkles}
          label="Poste"
          value={joueur.poste ?? "—"}
          small
        />
      </motion.div>

      {/* Dernières séances validées */}
      {validated.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4"
        >
          <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Récentes
          </div>
          <GlassCard className="divide-y divide-white/5 p-0">
            {validated
              .slice()
              .sort((a, b) => b.ts - a.ts)
              .slice(0, 4)
              .map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3.5 text-sm"
                >
                  <span className="text-foreground/90">
                    {formatDate(s.date)}
                  </span>
                  {s.missed ? (
                    <span className="text-xs font-semibold text-red-400">
                      Manquée
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs font-bold text-foreground">
                      RPE {s.rpe}
                    </span>
                  )}
                </div>
              ))}
          </GlassCard>
        </motion.div>
      )}

      {openSeance && (
        <SeanceDetailSheet
          seance={openSeance.seance}
          joueur={joueur}
          weekIdx={openSeance.weekIdx}
          sessionIdx={openSeance.sessionIdx}
          date={openSeance.date}
          alreadyValidated={validated.some(
            (s) =>
              s.weekIdx === openSeance.weekIdx &&
              s.sessionIdx === openSeance.sessionIdx,
          )}
          regenerator={
            openSeance.seance.isCollective
              ? undefined
              : (ressenti, mat) => {
                  const sessions = genPhase2IndivSessions(
                    openSeance.weekIdx,
                    joueur,
                    ressenti,
                    mat,
                  );
                  return sessions[openSeance.sessionIdx] as SeanceLike;
                }
          }
          onClose={() => setOpenSeance(null)}
        />
      )}

      {showWelcome && (
        <WelcomeSlides prenom={joueur.prenom} onClose={closeWelcome} />
      )}

      {/* Changelog mise à jour */}
      {showChangelog && !showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[150] flex flex-col items-end justify-end bg-black/70 backdrop-blur-sm pb-safe"
          onClick={closeChangelog}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="w-full max-w-md rounded-t-3xl border-t border-white/10 bg-[color:var(--background)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[color:var(--draveil-glow)]">
              Mise à jour {CHANGELOG_VERSION}
            </div>
            <h3 className="mb-4 font-display text-xl font-black tracking-tight">
              Nouveautés 🛠️
            </h3>
            <ul className="space-y-3 mb-6">
              {CHANGELOG_NOTES.map((note, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[color:var(--draveil)]" />
                  {note}
                </li>
              ))}
            </ul>
            <button
              onClick={closeChangelog}
              className="w-full rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white"
            >
              C'est parti 💪
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Suggestion séance suivante */}
      {suggestionNext && (
        <GlassCard className="mx-4 mb-4 border-emerald-500/20 bg-emerald-500/[0.06] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">
                💡 Pour ta prochaine séance
              </div>
              <p className="text-sm font-semibold text-foreground">{suggestionNext.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{suggestionNext.conseil}</p>
            </div>
            <button onClick={() => setSuggestionNext(null)} className="text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function SeanceHero({
  label,
  seance,
  dateLabel,
  onOpen,
}: {
  label: string;
  seance: SeanceLike;
  dateLabel: string;
  onOpen: () => void;
}) {
  return (
    <GlassCard className="relative overflow-hidden p-6">
      <div
        aria-hidden
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, var(--draveil-glow) 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--draveil-glow)]">
          {label}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xl">{seance.typeIcon}</span>
          <h2 className="font-display text-2xl font-black tracking-tight">
            {seance.titre}
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {dateLabel}
          {seance.duree && <span>· {seance.duree}</span>}
        </div>
        <button
          onClick={onOpen}
          className="mt-5 inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-bold text-white shadow-brand transition hover:brightness-110"
        >
          <PlayCircle className="h-4 w-4" />
          Voir la séance
        </button>
      </div>
    </GlassCard>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  unit,
  small,
}: {
  icon: typeof Activity;
  label: string;
  value: string | number;
  unit?: string;
  small?: boolean;
}) {
  return (
    <GlassCard className="p-3.5">
      <Icon className="h-4 w-4 text-[color:var(--draveil-glow)]" />
      <div className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 font-display font-black tracking-tight text-foreground ${small ? "text-sm" : "text-xl"}`}
      >
        {typeof value === "number" ? value : value}
        {unit && (
          <span className="ml-1 text-[10px] font-semibold text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </GlassCard>
  );
}