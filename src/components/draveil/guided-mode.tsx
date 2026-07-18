import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Lightbulb, TriangleAlert, X } from "lucide-react";
import { InlineTimer } from "./inline-timer";

/** Etape normalisee, quelle que soit sa source (exo PPP ou exercice de circuit). */
export interface GuidedStep {
  titre: string;
  icone?: string;
  /** Bloc d'origine (Echauffement, Circuit, Prevention...) affiche au-dessus du titre. */
  groupe?: string;
  dosage?: string;
  detailHtml?: string;
  exec?: string[];
  note?: string;
  erreur?: string;
  series?: number;
  duree?: number;
  reps?: number;
  recup?: number;
  cote?: boolean;
}

/** Convertit un exercice PPP (cles n/d/exec...) en etape guidee. */
export function exoToStep(e: {
  nom?: string; n?: string;
  detail?: string; d?: string;
  note?: string; erreur?: string; exec?: string[];
  series?: number; duree?: number; reps?: number; recup?: number; cote?: boolean;
}, groupe?: string): GuidedStep {
  return {
    groupe,
    titre: e.nom ?? e.n ?? "",
    dosage: e.detail ?? e.d,
    exec: e.exec,
    note: e.note,
    erreur: e.erreur,
    series: e.series,
    duree: e.duree,
    reps: e.reps,
    recup: e.recup,
    cote: e.cote,
  };
}

/** Convertit un exercice de circuit (titre/detail HTML) en etape guidee. */
export function blocToStep(b: {
  titre: string; icone?: string; detail?: string; note?: string; duree?: number;
}, groupe?: string): GuidedStep {
  return {
    groupe,
    titre: b.titre,
    icone: b.icone,
    detailHtml: b.detail,
    note: b.note,
    duree: b.duree,
    series: b.duree ? 1 : undefined,
  };
}

interface BlocLike {
  titre: string;
  detail?: string;
  note?: string;
  icone?: string;
  duree?: number;
  isPPP?: boolean;
  pppExos?: Array<Record<string, unknown>>;
  sousBlocs?: Array<{
    titre: string;
    icone?: string;
    detail?: string;
    note?: string;
    duree?: number;
  }>;
}

/**
 * Transforme une seance complete en une liste d'etapes,
 * dans l'ordre : echauffement -> circuit -> prevention -> etirements.
 */
export function seanceToSteps(blocs: BlocLike[] | undefined): GuidedStep[] {
  const out: GuidedStep[] = [];

  for (const b of blocs ?? []) {
    const aDesExos =
      (b.sousBlocs && b.sousBlocs.length > 0) ||
      (b.isPPP && b.pppExos && b.pppExos.length > 0);

    // Bloc simple (echauffement, etirements, nordic...) : une seule etape.
    if (!aDesExos) {
      out.push(blocToStep(b));
      continue;
    }

    // Consigne du bloc (nombre de passages, recup...) avant ses exercices.
    if (b.detail && b.detail.trim()) {
      out.push({
        titre: b.titre,
        icone: b.icone,
        detailHtml: b.detail,
        note: b.note,
      });
    }

    if (b.sousBlocs?.length) {
      for (const sb of b.sousBlocs) out.push(blocToStep(sb, b.titre));
    }
    if (b.isPPP && b.pppExos?.length) {
      for (const e of b.pppExos) out.push(exoToStep(e as never, b.titre));
    }
  }

  return out;
}

/**
 * Mode guide : affiche un seul exercice a la fois,
 * avec son chrono quand l'exercice se mesure en temps.
 */
export function GuidedMode({
  titre,
  steps,
  onClose,
}: {
  titre: string;
  steps: GuidedStep[];
  onClose: () => void;
}) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const step = steps[i];
  const last = i === steps.length - 1;

  if (!step) return null;

  function go(delta: number) {
    setDir(delta);
    setI((v) => Math.min(steps.length - 1, Math.max(0, v + delta)));
  }

  const series = step.series ?? 1;
  const hasTimer = !!step.duree;
  // Un exo "par cote" se chronometre en doublant les series (gauche puis droite).
  const timerReps = step.cote ? series * 2 : series;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col bg-[color:var(--background)]"
    >
      {/* En-tete + progression */}
      <div className="shrink-0 border-b border-white/8 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="mb-3 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--draveil-glow)]">
              Mode guidé
            </div>
            <div className="truncate text-sm font-semibold text-foreground">
              {titre}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {steps.map((_, k) => (
            <div
              key={k}
              className={`h-1.5 flex-1 rounded-full transition ${
                k < i
                  ? "bg-[color:var(--draveil)]/50"
                  : k === i
                    ? "bg-[color:var(--draveil)]"
                    : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <div className="mt-2 text-[11px] font-semibold text-muted-foreground">
          Étape {i + 1} sur {steps.length}
        </div>
      </div>

      {/* Contenu de l'etape */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={i}
            initial={{ opacity: 0, x: dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -24 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--draveil)]/15 text-lg font-black text-[color:var(--draveil-glow)]">
                {step.icone ?? i + 1}
              </div>
              <div className="min-w-0 flex-1">
                {step.groupe && (
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[color:var(--draveil-glow)]">
                    {step.groupe}
                  </div>
                )}
                <h2 className="font-display text-xl font-black leading-tight tracking-tight text-foreground">
                  {step.titre}
                </h2>
                {step.dosage && (
                  <div className="mt-1.5 inline-block rounded-full bg-[color:var(--draveil)]/12 px-3 py-1 text-xs font-bold text-[color:var(--draveil-glow)]">
                    {step.dosage}
                  </div>
                )}
              </div>
            </div>

            {/* Chrono de l'exercice */}
            {hasTimer && (
              <div className="mt-5">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Chrono {timerReps} × {step.duree}s
                  {step.cote ? " (gauche puis droite)" : ""}
                </div>
                <InlineTimer
                  reps={timerReps}
                  effortSec={step.duree}
                  recupSec={step.recup ?? 30}
                  label={step.titre}
                />
              </div>
            )}

            {/* Etapes d'execution */}
            {step.exec && step.exec.length > 0 && (
              <div className="mt-6">
                <div className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Comment faire
                </div>
                <div className="space-y-2">
                  {step.exec.map((line, k) => (
                    <div
                      key={k}
                      className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] p-3"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-[10px] font-black text-foreground/70">
                        {k + 1}
                      </div>
                      <div className="text-[13px] leading-relaxed text-foreground/85">
                        {line}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detail HTML (exercices de circuit) */}
            {step.detailHtml && (
              <div className="mt-6">
                <div className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Comment faire
                </div>
                <div
                  className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-[13px] leading-relaxed text-foreground/85 [&_strong]:font-semibold [&_strong]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: step.detailHtml }}
                />
              </div>
            )}

            {/* Conseil */}
            {step.note && (
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[color:var(--draveil)]/25 bg-[color:var(--draveil)]/[0.07] p-3.5">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--draveil-glow)]" />
                <div className="text-[13px] leading-relaxed text-foreground/90">
                  {step.note}
                </div>
              </div>
            )}

            {/* Erreur classique */}
            {step.erreur && (
              <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] p-3.5">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <div className="text-[13px] leading-relaxed text-foreground/90">
                  <span className="font-semibold text-amber-400">
                    Erreur classique :{" "}
                  </span>
                  {step.erreur}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="shrink-0 border-t border-white/8 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
        <div className="flex gap-2">
          <button
            onClick={() => go(-1)}
            disabled={i === 0}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-foreground disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          {last ? (
            <button
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white shadow-brand"
            >
              <Check className="h-4 w-4" />
              Terminé
            </button>
          ) : (
            <button
              onClick={() => go(1)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white shadow-brand"
            >
              Exercice suivant
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
