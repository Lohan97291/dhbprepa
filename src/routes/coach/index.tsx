import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Flame,
  UserCheck,
  Users,
} from "lucide-react";

import { GlassCard } from "@/components/draveil/glass-card";
import { sbListJoueurs, type Joueur } from "@/lib/supabase";
import { formatDate, getPhaseActuelle, PHASES_DATES } from "@/lib/draveil/core";

export const Route = createFileRoute("/coach/")({
  component: CoachDashboard,
});

function CoachDashboard() {
  const [joueurs, setJoueurs] = useState<Joueur[] | null>(null);

  useEffect(() => {
    sbListJoueurs().then(setJoueurs);
  }, []);

  const stats = useMemo(() => {
    if (!joueurs) return null;
    const actifs = joueurs.filter((j) => j.statut_compte !== "attente");
    const attente = joueurs.filter((j) => j.statut_compte === "attente");
    const weekAgo = Date.now() - 7 * 86400000;
    const seances7j = joueurs.flatMap(
      (j) => (j.seances_validees ?? []).filter((s) => s.ts >= weekAgo),
    );
    const done = seances7j.filter((s) => !s.missed);
    const avgRpe = done.length
      ? done.reduce((a, s) => a + (s.rpe ?? 0), 0) / done.length
      : 0;
    const recent = joueurs
      .flatMap((j) =>
        (j.seances_validees ?? []).map((s) => ({
          j,
          s,
        })),
      )
      .sort((a, b) => b.s.ts - a.s.ts)
      .slice(0, 8);
    return {
      total: joueurs.length,
      actifs: actifs.length,
      attente: attente.length,
      seances7j: seances7j.length,
      missed7j: seances7j.length - done.length,
      avgRpe,
      recent,
    };
  }, [joueurs]);

  const phaseKey = getPhaseActuelle(new Date());
  const phaseMeta =
    phaseKey in PHASES_DATES
      ? PHASES_DATES[phaseKey as keyof typeof PHASES_DATES]
      : null;

  return (
    <div className="px-5 py-8">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Vue d'ensemble
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight">
          Tableau de bord
        </h1>
      </motion.header>

      {phaseMeta && (
        <GlassCard className="mb-4 flex items-center gap-4 p-5">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
            style={{ background: `${phaseMeta.couleur}22` }}
          >
            {phaseMeta.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Phase en cours
            </div>
            <div className="font-display text-lg font-black tracking-tight">
              {phaseMeta.nom}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(phaseMeta.debut)} → {formatDate(phaseMeta.fin)}
            </div>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPI
          icon={Users}
          label="Joueurs"
          value={stats?.total ?? "—"}
          hint={stats ? `${stats.actifs} actifs` : ""}
        />
        <KPI
          icon={UserCheck}
          label="En attente"
          value={stats?.attente ?? "—"}
          hint="À valider"
          highlight={!!stats && stats.attente > 0}
        />
        <KPI
          icon={Flame}
          label="Séances 7j"
          value={stats?.seances7j ?? "—"}
          hint={stats ? `${stats.missed7j} manquées` : ""}
        />
        <KPI
          icon={Activity}
          label="RPE moyen"
          value={stats?.avgRpe ? stats.avgRpe.toFixed(1) : "—"}
          hint="Sur 10"
        />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Activité récente
        </div>
        {!stats || stats.recent.length === 0 ? (
          <GlassCard className="p-8 text-center text-sm text-muted-foreground">
            {joueurs === null
              ? "Chargement…"
              : "Aucune séance validée pour le moment."}
          </GlassCard>
        ) : (
          <GlassCard className="divide-y divide-white/5 p-0">
            {stats.recent.map(({ j, s }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3.5 text-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-xs font-black text-white">
                  {(j.prenom?.[0] ?? "") + (j.nom?.[0] ?? "")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-foreground">
                    {j.prenom} {j.nom}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(s.date)} · Semaine {s.weekIdx + 1}
                  </div>
                </div>
                {s.missed ? (
                  <span className="text-xs font-semibold text-red-400">
                    Manquée
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-2.5 py-1 text-xs font-bold">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    RPE {s.rpe}
                  </span>
                )}
              </div>
            ))}
          </GlassCard>
        )}
      </div>
    </div>
  );
}

function KPI({
  icon: Icon,
  label,
  value,
  hint,
  highlight,
}: {
  icon: typeof Activity;
  label: string;
  value: string | number;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <GlassCard
      className={`p-4 ${highlight ? "ring-1 ring-[color:var(--draveil)]" : ""}`}
    >
      <Icon
        className={`h-4 w-4 ${highlight ? "text-[color:var(--draveil-glow)]" : "text-muted-foreground"}`}
      />
      <div className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-black tracking-tight text-foreground">
        {value}
      </div>
      {hint && (
        <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>
      )}
    </GlassCard>
  );
}