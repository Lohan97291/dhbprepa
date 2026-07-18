import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { GlassCard } from "@/components/draveil/glass-card";
import { sbListJoueurs, sbSaveJoueur, type Joueur } from "@/lib/supabase";
import { getPhase2Week } from "@/lib/draveil/core";

export const Route = createFileRoute("/coach/semaine")({
  component: CoachSemainePage,
});

function CoachSemainePage() {
  const [joueurs, setJoueurs] = useState<Joueur[] | null>(null);
  const [modal, setModal] = useState<{ j: Joueur; sess: number } | null>(null);
  const [rpe, setRpe] = useState(5);
  const week = Math.max(0, Math.min(4, getPhase2Week(new Date())));

  useEffect(() => {
    sbListJoueurs().then(setJoueurs);
  }, []);

  async function refresh() {
    setJoueurs(await sbListJoueurs());
  }

  function status(j: Joueur, sess: number): "ok" | "miss" | "none" {
    const s = (j.seances_validees ?? []).find(
      (x) => x.weekIdx === week && x.sessionIdx === sess,
    );
    if (!s) return "none";
    return s.missed ? "miss" : "ok";
  }

  async function validate() {
    if (!modal) return;
    const j = modal.j;
    const list = j.seances_validees ?? [];
    const entry = {
      date: new Date().toISOString().split("T")[0],
      weekIdx: week,
      sessionIdx: modal.sess,
      rpe,
      missed: false,
      ts: Date.now(),
      byCoach: true,
    };
    await sbSaveJoueur({
      ...j,
      seances_validees: [
        ...list.filter(
          (s) => !(s.weekIdx === week && s.sessionIdx === modal.sess),
        ),
        entry,
      ],
    });
    toast.success("Validé ✅");
    setModal(null);
    refresh();
  }

  const inactifs = useMemo(() => {
    if (!joueurs) return [];
    const now = Date.now();
    return joueurs
      .map((j) => {
        const last = (j.seances_validees ?? [])
          .slice()
          .sort((a, b) => b.ts - a.ts)[0];
        const days = last ? Math.floor((now - last.ts) / 86400000) : 999;
        return { j, days };
      })
      .filter((x) => x.days > 10 && x.j.statut_compte !== "attente")
      .sort((a, b) => b.days - a.days);
  }, [joueurs]);

  const labels = ["🏃 Cardio", "💪 Renfo", "🧘 Récup"];

  return (
    <div className="px-5 py-8">
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Prépa individuelle
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight">
          Semaine S{week + 1}
        </h1>
      </div>

      {inactifs.length > 0 && (
        <GlassCard className="mb-4 border-amber-500/30 bg-amber-500/[0.06] p-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            ⚠️ Inactifs +10 jours
          </div>
          <div className="mt-2 space-y-1 text-sm">
            {inactifs.map((x) => (
              <div key={x.j.code} className="flex justify-between">
                <span className="font-semibold">
                  {x.j.prenom} {x.j.nom}
                </span>
                <span className="text-amber-400">
                  {x.days === 999 ? "jamais" : `${x.days} j`}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {!joueurs ? (
        <GlassCard className="p-8 text-center text-sm text-muted-foreground">
          Chargement…
        </GlassCard>
      ) : (
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Joueur</th>
                {labels.map((l) => (
                  <th key={l} className="px-3 py-3 text-center">
                    {l}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {joueurs
                .filter((j) => j.statut_compte !== "attente")
                .map((j) => (
                  <tr key={j.code} className="border-b border-white/5">
                    <td className="px-4 py-3 font-semibold">
                      {j.prenom} {j.nom}
                    </td>
                    {[0, 1, 2].map((s) => {
                      const st = status(j, s);
                      return (
                        <td key={s} className="px-3 py-3 text-center">
                          {st === "ok" ? (
                            <span className="text-emerald-400">✅</span>
                          ) : st === "miss" ? (
                            <span className="text-red-400">❌</span>
                          ) : (
                            <button
                              onClick={() => {
                                setModal({ j, sess: s });
                                setRpe(5);
                              }}
                              className="rounded-full border border-white/10 px-2 text-muted-foreground hover:text-foreground"
                            >
                              ＋
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {modal && (
        <>
          <div
            onClick={() => setModal(null)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <div className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-3xl border border-white/10 bg-[color:var(--background)]/98 p-6 backdrop-blur-2xl">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Validation manuelle
            </div>
            <h3 className="mt-1 font-display text-lg font-black">
              {modal.j.prenom} · {labels[modal.sess]}
            </h3>
            <div className="mt-4 text-xs text-muted-foreground">RPE</div>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setRpe(n)}
                  className={`h-9 flex-1 rounded-lg text-xs font-bold ${
                    rpe >= n
                      ? "gradient-brand text-white shadow-brand"
                      : "bg-white/[0.05] text-muted-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setModal(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-sm"
              >
                Annuler
              </button>
              <button
                onClick={validate}
                className="flex-[2] rounded-xl gradient-brand py-2.5 text-sm font-bold text-white shadow-brand"
              >
                Valider
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}