import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GlassCard } from "@/components/draveil/glass-card";
import { sbListJoueurs, type Joueur } from "@/lib/supabase";

export const Route = createFileRoute("/coach/stats")({
  component: CoachStatsPage,
});

function assiduite(j: Joueur) {
  const done = (j.seances_validees ?? []).filter((s) => !s.missed).length;
  // 5 semaines × 3 séances = 15 séances possibles
  return Math.round((done / 15) * 100);
}

function CoachStatsPage() {
  const [joueurs, setJoueurs] = useState<Joueur[] | null>(null);
  useEffect(() => {
    sbListJoueurs().then(setJoueurs);
  }, []);

  const data = useMemo(() => {
    if (!joueurs) return null;
    const actifs = joueurs.filter((j) => j.statut_compte !== "attente");
    const totalSeances = joueurs.reduce(
      (a, j) => a + (j.seances_validees ?? []).filter((s) => !s.missed).length,
      0,
    );
    const ass = actifs.map(assiduite);
    const moy = ass.length
      ? Math.round(ass.reduce((a, b) => a + b, 0) / ass.length)
      : 0;

    const byWeek = [0, 1, 2, 3, 4].map((w) => {
      const done = joueurs.flatMap((j) =>
        (j.seances_validees ?? []).filter(
          (s) => s.weekIdx === w && !s.missed,
        ),
      ).length;
      const possible = actifs.length * 3;
      return {
        semaine: `S${w + 1}`,
        assiduite: possible ? Math.round((done / possible) * 100) : 0,
      };
    });

    const ranked = actifs
      .map((j) => ({ j, a: assiduite(j) }))
      .sort((x, y) => y.a - x.a);
    const top3 = ranked.slice(0, 3);
    const traine = ranked.filter(
      (r) => r.a < 50 && (r.j.seances_validees ?? []).length > 0,
    );

    return {
      total: actifs.length,
      totalSeances,
      moy,
      byWeek,
      top3,
      traine,
      ranked,
    };
  }, [joueurs]);

  return (
    <div className="px-5 py-8">
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Équipe
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight">
          Stats globales
        </h1>
      </div>

      {!data ? (
        <GlassCard className="p-10 text-center text-sm text-muted-foreground">
          Chargement…
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <KPI label="Joueurs actifs" value={data.total} />
            <KPI label="Séances totales" value={data.totalSeances} />
            <KPI label="Assiduité moy." value={data.moy + "%"} />
          </div>

          <GlassCard className="mt-6 p-5">
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Assiduité par semaine (%)
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byWeek}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="semaine" stroke="#888" fontSize={11} />
                  <YAxis stroke="#888" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15,20,25,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="assiduite" fill="#11984c" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {data.top3.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                🏆 Top 3
              </div>
              <div className="grid gap-2">
                {data.top3.map((r, i) => (
                  <PodiumRow
                    key={r.j.code}
                    rank={["🥇", "🥈", "🥉"][i]}
                    j={r.j}
                    a={r.a}
                    color="text-emerald-400"
                  />
                ))}
              </div>
            </div>
          )}

          {data.traine.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                ⚠️ À la traîne (&lt;50%)
              </div>
              <div className="grid gap-2">
                {data.traine.map((r) => (
                  <PodiumRow
                    key={r.j.code}
                    rank="⚠️"
                    j={r.j}
                    a={r.a}
                    color="text-red-400"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Classement complet
            </div>
            <GlassCard className="divide-y divide-white/5 p-0">
              {data.ranked.map((r, i) => (
                <div
                  key={r.j.code}
                  className="flex items-center gap-3 px-5 py-3 text-sm"
                >
                  <span className="w-6 text-right text-xs font-bold text-muted-foreground">
                    #{i + 1}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand text-[11px] font-black text-white">
                    {(r.j.prenom?.[0] ?? "") + (r.j.nom?.[0] ?? "")}
                  </div>
                  <span className="flex-1 truncate font-semibold">
                    {r.j.prenom} {r.j.nom}
                  </span>
                  <span className="text-xs font-bold">{r.a}%</span>
                </div>
              ))}
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string | number }) {
  return (
    <GlassCard className="p-4 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-black tracking-tight">
        {value}
      </div>
    </GlassCard>
  );
}

function PodiumRow({
  rank,
  j,
  a,
  color,
}: {
  rank: string;
  j: Joueur;
  a: number;
  color: string;
}) {
  return (
    <GlassCard className="flex items-center gap-3 p-3">
      <span className="text-2xl">{rank}</span>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-xs font-black text-white">
        {(j.prenom?.[0] ?? "") + (j.nom?.[0] ?? "")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold">
          {j.prenom} {j.nom}
        </div>
        <div className="text-[11px] text-muted-foreground">{j.poste ?? "—"}</div>
      </div>
      <span className={`text-sm font-black ${color}`}>{a}%</span>
    </GlassCard>
  );
}