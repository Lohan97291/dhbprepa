import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

import { GlassCard } from "@/components/draveil/glass-card";
import {
  SeanceDetailSheet,
  type SeanceLike,
} from "@/components/draveil/seance-detail";
import {
  formatDate,
  genPhase2IndivSessions,
  genPhase3Sessions,
  getPhase2WeemLabel,
  getPhase3WeemLabel,
  getSessionDatesCollectif,
  getSessionDatesIndiv,
} from "@/lib/draveil/core";

export const Route = createFileRoute("/coach/programmes")({
  component: ProgrammesPage,
});

// Joueur type mirror (avoids importing supabase types for a preview joueur)
const DEMO_JOUEUR = {
  code: "DEMO",
  prenom: "Type",
  nom: "moyen",
  vma: 14,
  poste: "Arrière D",
  jours_seance: [2, 4],
  materiel: ["Élastiques"],
};

type Row = {
  date: string;
  weekIdx: number;
  sessIdx: number;
  seance: SeanceLike;
};

function ProgrammesPage() {
  const [tab, setTab] = useState<"p2" | "p3">("p2");
  const [open, setOpen] = useState<Row | null>(null);

  const rows: Row[] = useMemo(() => {
    if (tab === "p2") {
      return getSessionDatesIndiv(DEMO_JOUEUR).map((d) => {
        const sessions = genPhase2IndivSessions(d.weekIdx, DEMO_JOUEUR);
        return {
          date: d.date,
          weekIdx: d.weekIdx,
          sessIdx: d.sessIdx,
          seance: sessions[d.sessIdx] as SeanceLike,
        };
      });
    }
    return getSessionDatesCollectif(DEMO_JOUEUR).map((d) => {
      const sessions = genPhase3Sessions(d.weekIdx);
      return {
        date: d.date,
        weekIdx: d.weekIdx,
        sessIdx: d.sessIdx,
        seance: (sessions[d.sessIdx] ?? sessions[0]) as SeanceLike,
      };
    });
  }, [tab]);

  const grouped = rows.reduce<Record<number, Row[]>>((acc, r) => {
    acc[r.weekIdx] = acc[r.weekIdx] ?? [];
    acc[r.weekIdx].push(r);
    return acc;
  }, {});

  return (
    <div className="px-5 py-8">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Piloter les séances
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight">
          Programmes
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Contenu généré à partir de la logique du programme (joueur-type VMA
          14). Chaque joueur reçoit une version adaptée à sa VMA et son
          matériel.
        </p>
      </motion.header>

      <div className="glass mb-5 flex rounded-full p-1">
        {(
          [
            { k: "p2", label: "Prépa individuelle" },
            { k: "p3", label: "Reprise collective" },
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

      <div className="grid gap-5 md:grid-cols-2">
        {Object.entries(grouped).map(([wIdxStr, wRows]) => {
          const wIdx = Number(wIdxStr);
          const meta =
            tab === "p2" ? getPhase2WeemLabel(wIdx) : getPhase3WeemLabel(wIdx);
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
                {wRows.map((r) => (
                  <button
                    key={`${r.weekIdx}-${r.sessIdx}`}
                    onClick={() => setOpen(r)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-white/[0.03]"
                  >
                    <div className="text-xl">{r.seance.typeIcon}</div>
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
                        background: r.seance.typeColor ?? "var(--draveil)",
                      }}
                    >
                      {r.seance.type}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {open && (
        <SeanceDetailSheet
          seance={open.seance}
          weekIdx={open.weekIdx}
          sessionIdx={open.sessIdx}
          date={open.date}
          readOnly
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
