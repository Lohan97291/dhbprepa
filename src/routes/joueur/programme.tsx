import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, Circle } from "lucide-react";

import { GlassCard } from "@/components/draveil/glass-card";
import {
  SeanceDetailSheet,
  type SeanceLike,
} from "@/components/draveil/seance-detail";
import { useSession } from "@/lib/draveil/session";
import {
  formatDate,
  genPhase2IndivSessions,
  genPhase3Sessions,
  getPhase2WeemLabel,
  getPhase3WeemLabel,
  getSessionDatesCollectif,
  getSessionDatesIndiv,
} from "@/lib/draveil/core";

export const Route = createFileRoute("/joueur/programme")({
  component: ProgrammePage,
});

type Row = {
  date: string;
  weekIdx: number;
  sessIdx: number;
  seance: SeanceLike;
  phaseKey: "p2" | "p3";
};

function ProgrammePage() {
  const { joueur } = useSession();
  const [tab, setTab] = useState<"p2" | "p3">("p2");
  const [open, setOpen] = useState<Row | null>(null);

  const rows: Row[] = useMemo(() => {
    if (!joueur) return [];
    if (tab === "p2") {
      return getSessionDatesIndiv(joueur).map((d) => {
        const sessions = genPhase2IndivSessions(d.weekIdx, joueur);
        return {
          date: d.date,
          weekIdx: d.weekIdx,
          sessIdx: d.sessIdx,
          seance: sessions[d.sessIdx] as SeanceLike,
          phaseKey: "p2",
        };
      });
    }
    return getSessionDatesCollectif(joueur).map((d) => {
      const sessions = genPhase3Sessions(d.weekIdx);
      return {
        date: d.date,
        weekIdx: d.weekIdx,
        sessIdx: d.sessIdx,
        seance: (sessions[d.sessIdx] ?? sessions[0]) as SeanceLike,
        phaseKey: "p3",
      };
    });
  }, [joueur, tab]);

  if (!joueur) return null;

  const validated = joueur.seances_validees ?? [];
  const isValidated = (r: Row) =>
    validated.some((s) => s.weekIdx === r.weekIdx && s.sessionIdx === r.sessIdx);

  // Group by week
  const grouped = rows.reduce<Record<number, Row[]>>((acc, r) => {
    acc[r.weekIdx] = acc[r.weekIdx] ?? [];
    acc[r.weekIdx].push(r);
    return acc;
  }, {});

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
          Programme
        </h1>
      </motion.header>

      <div className="glass mb-5 flex rounded-full p-1">
        {(
          [
            { k: "p2", label: "Prépa indiv." },
            { k: "p3", label: "Collective" },
          ] as const
        ).map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition ${
              tab === t.k
                ? "gradient-brand text-white shadow-brand"
                : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {Object.entries(grouped).map(([wIdxStr, wRows]) => {
          const wIdx = Number(wIdxStr);
          const meta =
            tab === "p2"
              ? getPhase2WeemLabel(wIdx)
              : getPhase3WeemLabel(wIdx);
          return (
            <motion.div
              key={wIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wIdx * 0.04 }}
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {meta.label}
                </div>
                <div className="text-[11px] font-semibold text-[color:var(--draveil-glow)]">
                  {meta.phase}
                </div>
              </div>
              <GlassCard className="divide-y divide-white/5 p-0">
                {wRows.map((r) => {
                  const done = isValidated(r);
                  return (
                    <button
                      key={`${r.weekIdx}-${r.sessIdx}`}
                      onClick={() => setOpen(r)}
                      className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-white/[0.03]"
                    >
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-foreground">
                          {r.seance.titre}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {formatDate(r.date)} · {r.seance.duree}
                        </div>
                      </div>
                      <div
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                        style={{
                          background:
                            r.seance.typeColor ?? "var(--draveil)",
                        }}
                      >
                        {r.seance.type}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </GlassCard>
            </motion.div>
          );
        })}

        {rows.length === 0 && (
          <GlassCard className="p-8 text-center text-sm text-muted-foreground">
            Aucune séance planifiée sur cette phase.
          </GlassCard>
        )}
      </div>

      {open && (
        <SeanceDetailSheet
          seance={open.seance}
          joueur={joueur}
          weekIdx={open.weekIdx}
          sessionIdx={open.sessIdx}
          date={open.date}
          alreadyValidated={isValidated(open)}
          regenerator={
            open.phaseKey === "p2"
              ? (ressenti, mat) => {
                  const sessions = genPhase2IndivSessions(
                    open.weekIdx,
                    joueur,
                    ressenti,
                    mat,
                  );
                  return sessions[open.sessIdx] as SeanceLike;
                }
              : undefined
          }
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}