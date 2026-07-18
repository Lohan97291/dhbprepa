import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo } from "react";
import { Activity, Flame, Target, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GlassCard } from "@/components/draveil/glass-card";
import { useSession } from "@/lib/draveil/session";
import { formatDate, getAllures } from "@/lib/draveil/core";

export const Route = createFileRoute("/joueur/stats")({
  component: StatsPage,
});

function StatsPage() {
  const { joueur } = useSession();

  const stats = useMemo(() => {
    const list = joueur?.seances_validees ?? [];
    const done = list.filter((s) => !s.missed);
    const missed = list.filter((s) => s.missed).length;
    const avgRpe = done.length
      ? done.reduce((a, s) => a + (s.rpe ?? 0), 0) / done.length
      : 0;
    const timeline = done
      .slice()
      .sort((a, b) => a.ts - b.ts)
      .map((s, i) => ({
        idx: i + 1,
        rpe: s.rpe,
        date: new Date(s.date).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        }),
      }));

    // Weekly progression: average RPE grouped by weekIdx
    const byWeek = new Map<number, { sum: number; n: number }>();
    for (const s of done) {
      const w = (s.weekIdx as number) ?? 0;
      const cur = byWeek.get(w) ?? { sum: 0, n: 0 };
      cur.sum += s.rpe ?? 0;
      cur.n += 1;
      byWeek.set(w, cur);
    }
    const weekly = Array.from(byWeek.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([w, v]) => ({
        label: `S${w + 1}`,
        rpe: Math.round((v.sum / v.n) * 10) / 10,
        n: v.n,
      }));

    // Ressenti distribution (fatigue/normal/enforme)
    const rMap: Record<string, number> = { fatigue: 0, normal: 0, enforme: 0 };
    for (const s of done) {
      const r = (s as { ressenti?: string }).ressenti;
      if (r && r in rMap) rMap[r] += 1;
    }
    const rTotal = rMap.fatigue + rMap.normal + rMap.enforme;
    const ressenti = rTotal
      ? {
          fatigue: Math.round((rMap.fatigue / rTotal) * 100),
          normal: Math.round((rMap.normal / rTotal) * 100),
          enforme: Math.round((rMap.enforme / rTotal) * 100),
          total: rTotal,
        }
      : null;

    return {
      total: list.length,
      done: done.length,
      missed,
      avgRpe,
      timeline,
      weekly,
      ressenti,
    };
  }, [joueur]);

  if (!joueur) return null;
  const allures = getAllures(joueur.vma ?? 13);

  const rpeColor = (rpe: number) =>
    rpe <= 4 ? "#22c55e" : rpe <= 7 ? "#eab308" : "#ef4444";

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-8 pt-12">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Draveil HB
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight">
          Statistiques
        </h1>
      </motion.header>

      <div className="grid grid-cols-2 gap-3">
        <MetricTile
          icon={Flame}
          label="Séances"
          value={stats.done}
          hint={
            stats.missed
              ? `${stats.missed} manquée${stats.missed > 1 ? "s" : ""}`
              : "Toutes tenues"
          }
        />
        <MetricTile
          icon={TrendingUp}
          label="RPE moyen"
          value={stats.avgRpe ? stats.avgRpe.toFixed(1) : "—"}
          hint="Sur 10"
        />
        <MetricTile
          icon={Activity}
          label="VMA"
          value={joueur.vma ?? "—"}
          hint="km/h"
        />
        <MetricTile
          icon={Target}
          label="Régularité"
          value={
            stats.total
              ? `${Math.round((stats.done / stats.total) * 100)}%`
              : "—"
          }
          hint={`${stats.done}/${stats.total}`}
        />
      </div>

      {stats.timeline.length > 0 && (
        <GlassCard className="mt-4 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Timeline RPE
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Dot color="#22c55e" /> Facile
              <Dot color="#eab308" /> Moyen
              <Dot color="#ef4444" /> Dur
            </div>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer>
              <BarChart data={stats.timeline} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 9, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{
                    background: "rgba(15,15,20,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="rpe" radius={[6, 6, 0, 0]}>
                  {stats.timeline.map((s, i) => (
                    <Cell key={i} fill={rpeColor(s.rpe)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {stats.weekly.length > 1 && (
        <GlassCard className="mt-4 p-5">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Progression hebdomadaire
          </div>
          <div className="h-36 w-full">
            <ResponsiveContainer>
              <LineChart data={stats.weekly} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,15,20,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rpe"
                  stroke="var(--draveil-glow)"
                  strokeWidth={2.5}
                  dot={{ fill: "var(--draveil)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {stats.ressenti && (
        <GlassCard className="mt-4 p-5">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Ton ressenti avant séance
          </div>
          <div className="grid grid-cols-3 gap-3">
            <RessentiCell emoji="😴" label="Fatigué" pct={stats.ressenti.fatigue} color="#ef4444" />
            <RessentiCell emoji="😐" label="Normal" pct={stats.ressenti.normal} color="#eab308" />
            <RessentiCell emoji="🔥" label="En forme" pct={stats.ressenti.enforme} color="#22c55e" />
          </div>
          <div className="mt-3 text-center text-[10px] text-muted-foreground">
            Basé sur {stats.ressenti.total} séance{stats.ressenti.total > 1 ? "s" : ""}
          </div>
        </GlassCard>
      )}

      <div className="mt-4">
        <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Tes allures
        </div>
        <GlassCard className="divide-y divide-white/5 p-0">
          <Allure label="Récupération" value={`${allures.recup} km/h`} />
          <Allure label="Fond" value={`${allures.fond} km/h`} />
          <Allure label="Seuil" value={`${allures.seuil} km/h`} />
          <Allure label="VMA 100%" value={`${allures.vma100} km/h`} />
          <Allure label="Puissance" value={`${allures.puissance} km/h`} />
        </GlassCard>
      </div>

      {stats.total > 0 && (
        <div className="mt-4">
          <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Historique
          </div>
          <GlassCard className="divide-y divide-white/5 p-0">
            {(joueur.seances_validees ?? [])
              .slice()
              .sort((a, b) => b.ts - a.ts)
              .map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3 text-sm"
                >
                  <span className="text-foreground/90">
                    {formatDate(s.date)}
                  </span>
                  {s.missed ? (
                    <span className="text-xs font-semibold text-red-400">
                      Manquée
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs font-bold">
                      RPE {s.rpe}
                    </span>
                  )}
                </div>
              ))}
          </GlassCard>
        </div>
      )}

      {stats.total === 0 && (
        <GlassCard className="mt-4 p-8 text-center text-sm text-muted-foreground">
          Valide ta première séance depuis l'accueil pour voir tes stats.
        </GlassCard>
      )}
    </div>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Activity;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <GlassCard className="p-4">
      <Icon className="h-4 w-4 text-[color:var(--draveil-glow)]" />
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

function Allure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-bold text-foreground">
        {value}
      </span>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{ background: color }}
    />
  );
}

function RessentiCell({
  emoji,
  label,
  pct,
  color,
}: {
  emoji: string;
  label: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-3 text-center">
      <div className="text-2xl">{emoji}</div>
      <div className="mt-1 font-display text-xl font-black" style={{ color }}>
        {pct}%
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}