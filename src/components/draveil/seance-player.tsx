import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { ChevronLeft, Pause, Play, SkipForward, SkipBack, Check, X, CheckCircle2 } from "lucide-react";

import type { Joueur } from "@/lib/supabase";
import { sbSaveJoueur } from "@/lib/supabase";
import { session } from "@/lib/draveil/session";
import { beep, haptic, successPing } from "@/lib/draveil/haptic";
import type { SeanceLike } from "./seance-detail";
import { toast } from "sonner";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { PPP_ILLUSTRATIONS } from "@/components/draveil/ppp-illustrations";
import { getSuggestionSuivante } from "@/lib/draveil/core";

/* ------------------------------------------------------------------ */
/* Flatten a séance into a linear sequence of "steps" for the player.  */
/* ------------------------------------------------------------------ */

type Step =
  | {
      kind: "timer";
      title: string;
      icone?: string;
      detail?: string;
      note?: string;
      seconds: number;
      blockLabel?: string;
    }
  | {
      kind: "info";
      title: string;
      icone?: string;
      detail?: string;
      note?: string;
      blockLabel?: string;
    }
  | {
      kind: "ppp";
      title: string;
      icone?: string;
      exos: Array<{ nom: string; detail?: string; exec?: string[]; erreur?: string; note?: string; illustration?: string }>;
      note?: string;
      blockLabel?: string;
    };

function buildSteps(seance: SeanceLike): Step[] {
  const out: Step[] = [];
  for (const b of seance.blocs ?? []) {
    const base = { title: b.titre, icone: b.icone, note: b.note, blockLabel: b.titre };
    if (b.isPPP && b.pppExos?.length) {
      out.push({
        kind: "ppp",
        exos: b.pppExos.map((e: any) => ({
          nom: e.nom ?? e.n ?? "",
          detail: e.detail ?? e.d ?? "",
          exec: e.exec,
          erreur: e.erreur,
          note: e.note,
          illustration: e.illustration,
        })),
        ...base,
      });
    } else if (typeof b.duree === "number" && b.duree > 0) {
      out.push({ kind: "timer", seconds: b.duree, detail: b.detail, ...base });
    } else {
      out.push({ kind: "info", detail: b.detail, ...base });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Player state                                                        */
/* ------------------------------------------------------------------ */

interface PState {
  idx: number;
  remaining: number; // seconds left on current timer
  paused: boolean;
  checked: Record<number, boolean[]>; // ppp check state per step
  finished: boolean;
}

type PAction =
  | { type: "tick" }
  | { type: "toggle-pause" }
  | { type: "next"; steps: Step[] }
  | { type: "prev"; steps: Step[] }
  | { type: "toggle-check"; stepIdx: number; exoIdx: number; exos: number }
  | { type: "resume-state"; state: PState }
  | { type: "finish" };

function initState(steps: Step[]): PState {
  return {
    idx: 0,
    remaining: steps[0]?.kind === "timer" ? steps[0].seconds : 0,
    paused: false,
    checked: {},
    finished: steps.length === 0,
  };
}

function reducer(state: PState, action: PAction): PState {
  switch (action.type) {
    case "tick":
      if (state.paused || state.remaining <= 0) return state;
      return { ...state, remaining: state.remaining - 1 };
    case "toggle-pause":
      return { ...state, paused: !state.paused };
    case "next": {
      const next = state.idx + 1;
      if (next >= action.steps.length) return { ...state, finished: true };
      const step = action.steps[next];
      return {
        ...state,
        idx: next,
        paused: false,
        remaining: step.kind === "timer" ? step.seconds : 0,
      };
    }
    case "prev": {
      const prev = Math.max(0, state.idx - 1);
      const step = action.steps[prev];
      return {
        ...state,
        idx: prev,
        paused: false,
        finished: false,
        remaining: step.kind === "timer" ? step.seconds : 0,
      };
    }
    case "toggle-check": {
      const arr = state.checked[action.stepIdx]?.slice() ?? Array(action.exos).fill(false);
      arr[action.exoIdx] = !arr[action.exoIdx];
      return { ...state, checked: { ...state.checked, [action.stepIdx]: arr } };
    }
    case "resume-state":
      return action.state;
    case "finish":
      return { ...state, finished: true };
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface Props {
  seance: SeanceLike;
  joueur: Joueur;
  weekIdx: number;
  sessionIdx: number;
  date: string;
  onExit: () => void;
}

const RESUME_KEY = "dhb_player_state";

export function SeancePlayer({ seance, joueur, weekIdx, sessionIdx, date, onExit }: Props) {
  const steps = useMemo(() => buildSteps(seance), [seance]);
  const [state, dispatch] = useReducer(reducer, steps, initState);
  const [askResume, setAskResume] = useState<PState | null>(null);
  const [rpeStep, setRpeStep] = useState<'ressenti' | 'precision' | 'done'>('ressenti');
  const [selectedRessenti, setSelectedRessenti] = useState<{ emoji: string; label: string; rpe: number } | null>(null);
  const [rpeFinal, setRpeFinal] = useState(0);
  const [ressenti, setRessenti] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [suggestion, setSuggestion] = useState<{ message: string; conseil: string } | null>(null);

  const step = steps[state.idx];

  // Empêcher l'écran de s'éteindre pendant la séance
  useWakeLock(!state.finished);

  /* Resume from sessionStorage on mount ---------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(RESUME_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { key: string; state: PState };
      const key = `${joueur.code}:${weekIdx}:${sessionIdx}:${date}`;
      if (saved.key === key && !saved.state.finished && saved.state.idx > 0) {
        setAskResume(saved.state);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Persist state ---------------------------------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `${joueur.code}:${weekIdx}:${sessionIdx}:${date}`;
    sessionStorage.setItem(RESUME_KEY, JSON.stringify({ key, state }));
  }, [state, joueur.code, weekIdx, sessionIdx, date]);

  /* Timer tick ------------------------------------------------------- */
  useEffect(() => {
    if (!step || step.kind !== "timer" || state.paused || state.finished) return;
    if (state.remaining <= 0) return;
    const id = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(id);
  }, [step, state.paused, state.remaining, state.finished]);

  /* Countdown beeps + auto-advance --------------------------------- */
  const prevRemaining = useRef(state.remaining);
  useEffect(() => {
    if (!step || step.kind !== "timer") return;
    const r = state.remaining;
    if (r !== prevRemaining.current) {
      if (r === 3 || r === 2 || r === 1) beep(660, 90);
      if (r === 0) {
        successPing();
        // small delay to let sound play before switching UI
        window.setTimeout(() => dispatch({ type: "next", steps }), 400);
      }
    }
    prevRemaining.current = r;
  }, [state.remaining, step, steps]);

  /* Swipe handling --------------------------------------------------- */
  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.x < -80) {
        haptic(10);
        dispatch({ type: "next", steps });
      } else if (info.offset.x > 80) {
        haptic(10);
        dispatch({ type: "prev", steps });
      }
    },
    [steps],
  );

  /* Validate séance -------------------------------------------------- */
  async function validate(missed = false) {
    if (saving) return;
    setSaving(true);
    const list = joueur.seances_validees ?? [];
    const typeSeance = seance.tags?.includes('cardio') ? 'cardio' : seance.tags?.includes('recup') ? 'recup' : 'renfo';
    const sugg = getSuggestionSuivante(rpeFinal, typeSeance);
    setSuggestion(sugg);
    const next: Joueur = {
      ...joueur,
      seances_validees: [
        ...list.filter((s) => !(s.weekIdx === weekIdx && s.sessionIdx === sessionIdx)),
        {
          date,
          weekIdx,
          sessionIdx,
          rpe: missed ? 0 : rpeFinal,
          missed,
          ts: Date.now(),
          ressenti: ressenti || selectedRessenti?.label || undefined,
        },
      ],
    };
    await sbSaveJoueur(next);
    session.setJoueur(next);
    if (missed) toast("Séance marquée comme manquée");
    else toast.success("Séance validée 💪", { description: `RPE ${rpeFinal}/10 enregistré` });
    try { sessionStorage.removeItem(RESUME_KEY); } catch { /* ignore */ }
    setSaving(false);
    onExit();
  }

  /* Ask resume overlay ---------------------------------------------- */
  if (askResume) {
    return (
      <div className="fixed inset-0 z-[60] flex items-end bg-black/80 backdrop-blur-md sm:items-center sm:justify-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md rounded-t-3xl border-t border-white/10 bg-[color:var(--background)] p-6 sm:rounded-3xl sm:border"
        >
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--draveil-glow)]">
            Séance en cours
          </div>
          <h2 className="mt-2 font-display text-2xl font-black">Reprendre où tu t'étais arrêté ?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tu étais à l'étape {askResume.idx + 1} / {steps.length}.
          </p>
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setAskResume(null)}
              className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-sm font-semibold text-muted-foreground"
            >
              Recommencer
            </button>
            <button
              onClick={() => {
                dispatch({ type: "resume-state", state: askResume });
                setAskResume(null);
              }}
              className="flex-[2] rounded-2xl gradient-brand py-3 text-sm font-bold text-white shadow-brand"
            >
              Reprendre
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* Finish screen --------------------------------------------------- */
  if (state.finished) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[color:var(--background)]">
        <FinishScreen
          seance={seance}
          rpeStep={rpeStep}
          setRpeStep={setRpeStep}
          selectedRessenti={selectedRessenti}
          setSelectedRessenti={setSelectedRessenti}
          rpeFinal={rpeFinal}
          setRpeFinal={setRpeFinal}
          ressenti={ressenti}
          setRessenti={setRessenti}
          saving={saving}
          suggestion={suggestion}
          onValidate={() => validate(false)}
          onMiss={() => validate(true)}
          onExit={onExit}
        />
      </div>
    );
  }

  if (!step) return null;
  const progress = ((state.idx + 1) / steps.length) * 100;
  const isTimer = step.kind === "timer";
  const isRest = /récup|calme|étirem|repos|mobilité/i.test(step.title);
  const accent = isTimer && isRest ? "var(--info, #3b82f6)" : "var(--draveil)";
  const glow = isTimer && isRest ? "#60a5fa" : "var(--draveil-glow)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[color:var(--background)]"
      style={{
        background: `radial-gradient(120% 60% at 50% 0%, ${accent}22 0%, transparent 60%), var(--background)`,
      }}
    >
      {/* Header */}
      <header className="relative flex items-center justify-between px-4 pt-6 pb-3">
        <button
          onClick={onExit}
          aria-label="Quitter"
          className="rounded-full p-2 text-foreground/70 hover:bg-white/5"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="text-center">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Étape {state.idx + 1} / {steps.length}
          </div>
          <div className="mt-1 text-xs font-semibold text-foreground/80 truncate max-w-[180px]">
            {seance.titre}
          </div>
        </div>
        <button
          onClick={() => {
            haptic(20);
            if (confirm("Quitter la séance ?")) onExit();
          }}
          aria-label="Fermer"
          className="rounded-full p-2 text-foreground/70 hover:bg-white/5"
        >
          <X className="h-6 w-6" />
        </button>
      </header>

      {/* Progress bar */}
      <div className="mx-4 h-1 rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${accent}, ${glow})` }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      {/* Main content — swipeable */}
      <motion.div
        key={state.idx}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragEnd={onDragEnd}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 flex flex-col overflow-y-auto px-6 pb-4 pt-6 touch-pan-y"
      >
        <div className="text-4xl">{step.icone}</div>
        <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight">
          {step.title}
        </h1>
        {step.note && (
          <p className="mt-2 text-sm italic text-muted-foreground">{step.note}</p>
        )}

        {step.kind === "timer" && (
          <div className="my-6 flex flex-1 flex-col items-center justify-center">
            <TimerRing
              total={step.seconds}
              remaining={state.remaining}
              paused={state.paused}
              accent={accent}
              glow={glow}
              onTap={() => {
                haptic(10);
                dispatch({ type: "toggle-pause" });
              }}
            />
            {step.detail && (
              <div
                className="mt-8 max-w-sm text-center text-base leading-relaxed text-foreground/85 [&_strong]:font-semibold [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: step.detail }}
              />
            )}
          </div>
        )}

        {step.kind === "info" && (
          <div className="mt-4 flex-1">
            {step.detail && (
              <div
                className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 text-base leading-relaxed text-foreground/90 [&_strong]:font-semibold [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: step.detail }}
              />
            )}
          </div>
        )}

        {step.kind === "ppp" && (
          <div className="mt-6 flex-1 space-y-3">
            {step.exos.map((exo, i) => {
              const checks = state.checked[state.idx] ?? [];
              const done = !!checks[i];
              return (
                <div key={i} className={`rounded-2xl border transition ${done ? "border-[color:var(--draveil)]/50 bg-[color:var(--draveil)]/[0.08]" : "border-white/8 bg-white/[0.03]"}`}>
                  <button
                    onClick={() => {
                      haptic(8);
                      dispatch({ type: "toggle-check", stepIdx: state.idx, exoIdx: i, exos: step.exos.length });
                    }}
                    className="flex w-full items-center gap-4 p-4 text-left"
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 transition ${done ? "border-[color:var(--draveil)] bg-[color:var(--draveil)] text-white" : "border-white/20"}`}>
                      {done && <Check className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-bold text-foreground">{exo.nom}</div>
                      {exo.detail && <div className="mt-0.5 text-sm text-muted-foreground">{exo.detail}</div>}
                    </div>
                  </button>
                  {/* Illustrations SVG */}
                  {exo.illustration && PPP_ILLUSTRATIONS[exo.illustration] && (
                    <div className="flex justify-center gap-4 px-4 pb-3">
                      {PPP_ILLUSTRATIONS[exo.illustration].map((illu, j) => (
                        <div key={j}>{illu}</div>
                      ))}
                    </div>
                  )}
                  {/* Étapes exec */}
                  {exo.exec && exo.exec.length > 0 && (
                    <ol className="space-y-1 px-4 pb-3">
                      {exo.exec.map((line, m) => (
                        <li key={m} className="flex gap-2 text-[11px] text-foreground/60">
                          <span className="font-bold text-[color:var(--draveil-glow)] shrink-0">{m+1}.</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                  {exo.erreur && (
                    <div className="px-4 pb-3 text-[11px] text-amber-400/80">⚠️ {exo.erreur}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Footer controls */}
      <footer className="border-t border-white/5 bg-black/30 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <button
            onClick={() => {
              haptic(10);
              dispatch({ type: "prev", steps });
            }}
            disabled={state.idx === 0}
            className="grid h-14 w-14 place-items-center rounded-2xl border border-white/8 bg-white/[0.03] text-foreground/80 disabled:opacity-30"
            aria-label="Précédent"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          {isTimer ? (
            <button
              onClick={() => {
                haptic(12);
                dispatch({ type: "toggle-pause" });
              }}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl gradient-brand text-base font-bold text-white shadow-brand"
              style={{ background: `linear-gradient(135deg, ${accent}, ${glow})` }}
            >
              {state.paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              {state.paused ? "Reprendre" : "Pause"}
            </button>
          ) : (
            <button
              onClick={() => {
                haptic(12);
                dispatch({ type: "next", steps });
              }}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl gradient-brand text-base font-bold text-white shadow-brand"
            >
              Terminé <Check className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={() => {
              haptic(10);
              dispatch({ type: "next", steps });
            }}
            className="grid h-14 w-14 place-items-center rounded-2xl border border-white/8 bg-white/[0.03] text-foreground/80"
            aria-label="Passer"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground/60">
          Swipe ← → pour naviguer
        </div>
      </footer>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Timer Ring — big circular countdown, tap-to-pause                  */
/* ------------------------------------------------------------------ */

function TimerRing({
  total,
  remaining,
  paused,
  accent,
  glow,
  onTap,
}: {
  total: number;
  remaining: number;
  paused: boolean;
  accent: string;
  glow: string;
  onTap: () => void;
}) {
  const size = 280;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? remaining / total : 0;
  const dash = circ * pct;

  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;

  return (
    <button
      onClick={onTap}
      className="relative grid place-items-center outline-none"
      aria-label={paused ? "Reprendre" : "Pause"}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 65%)` }}
      />
      <svg width={size} height={size} className="relative -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          stroke="rgba(255,255,255,0.06)"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          stroke={`url(#ring-grad)`}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 0.6, ease: "linear" }}
          style={{ filter: `drop-shadow(0 0 12px ${accent}88)` }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor={glow} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={paused ? "p" : "r"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="font-display text-[64px] font-black tabular-nums leading-none tracking-tight text-foreground"
          >
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </motion.div>
        </AnimatePresence>
        <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {paused ? "En pause · tap pour reprendre" : "Tap pour pause"}
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Finish screen — RPE simplifié emoji + suggestion                   */
/* ------------------------------------------------------------------ */

const RESSENTIS = [
  { emoji: '😴', label: 'Trop facile', rpe: 2 },
  { emoji: '😊', label: 'Gérable',     rpe: 4 },
  { emoji: '😤', label: 'Difficile',   rpe: 7 },
  { emoji: '💀', label: 'Épuisant',    rpe: 9 },
];

const PRECISIONS: Record<number, { question: string; options: { label: string; delta: number }[] }> = {
  2: { question: "J'aurais pu continuer ?", options: [{ label: "✅ Oui, encore longtemps", delta: 0 }, { label: "🟡 Oui, un peu encore", delta: 1 }] },
  4: { question: "Ce qui était le plus dur ?", options: [{ label: "💨 Le souffle", delta: 0 }, { label: "🦵 Les jambes", delta: 0 }, { label: "🧠 La motivation", delta: -1 }] },
  7: { question: "Tu as réussi à finir ?", options: [{ label: "✅ Oui, tout fini", delta: 0 }, { label: "🟡 J'ai adapté", delta: 1 }, { label: "❌ J'ai dû m'arrêter", delta: 2 }] },
  9: { question: "Comment tu te sens là ?", options: [{ label: "😮‍💨 Fatigué mais ça va", delta: 0 }, { label: "🪫 Complètement vidé", delta: 1 }] },
};

function FinishScreen({
  seance, rpeStep, setRpeStep, selectedRessenti, setSelectedRessenti,
  rpeFinal, setRpeFinal, ressenti, setRessenti, saving, suggestion, onValidate, onMiss, onExit,
}: {
  seance: SeanceLike;
  rpeStep: 'ressenti' | 'precision' | 'done';
  setRpeStep: (s: 'ressenti' | 'precision' | 'done') => void;
  selectedRessenti: { emoji: string; label: string; rpe: number } | null;
  setSelectedRessenti: (r: { emoji: string; label: string; rpe: number }) => void;
  rpeFinal: number; setRpeFinal: (n: number) => void;
  ressenti: string; setRessenti: (s: string) => void;
  saving: boolean;
  suggestion: { message: string; conseil: string } | null;
  onValidate: () => void; onMiss: () => void; onExit: () => void;
}) {
  const precData = selectedRessenti ? PRECISIONS[selectedRessenti.rpe] : null;

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col px-6 pb-8 pt-10">
      <button onClick={onExit} className="self-start rounded-full p-2 text-foreground/60 hover:bg-white/5">
        <X className="h-6 w-6" />
      </button>

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="mx-auto mt-6 grid h-28 w-28 place-items-center rounded-full gradient-brand shadow-brand"
      >
        <CheckCircle2 className="h-14 w-14 text-white" />
      </motion.div>

      <h1 className="mt-6 text-center font-display text-3xl font-black tracking-tight">
        Séance terminée 🎉
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">{seance.titre}</p>

      <div className="mt-8">
        {/* Suggestion si déjà validé */}
        {suggestion && (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
            <p className="text-sm font-semibold text-foreground">{suggestion.message}</p>
            <p className="mt-1 text-xs text-muted-foreground">{suggestion.conseil}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Étape 1 — Ressenti global */}
          {rpeStep === 'ressenti' && (
            <motion.div key="ressenti" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Comment tu t'es senti ?
              </div>
              <div className="grid grid-cols-4 gap-3">
                {RESSENTIS.map((r) => (
                  <button
                    key={r.rpe}
                    onClick={() => {
                      haptic(10);
                      setSelectedRessenti(r);
                      setRpeFinal(r.rpe);
                      setRpeStep('precision');
                    }}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] p-4 active:scale-95 transition"
                  >
                    <span className="text-4xl">{r.emoji}</span>
                    <span className="text-[10px] font-semibold text-center text-muted-foreground leading-tight">{r.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Sois honnête — ça aide à adapter la prochaine séance.
              </p>
              <div className="mt-6 flex gap-2">
                <button onClick={onMiss} disabled={saving} className="flex-1 rounded-2xl border border-white/8 bg-white/[0.02] py-4 text-sm font-semibold text-muted-foreground disabled:opacity-40">
                  Séance manquée
                </button>
              </div>
            </motion.div>
          )}

          {/* Étape 2 — Question précision */}
          {rpeStep === 'precision' && precData && selectedRessenti && (
            <motion.div key="precision" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{selectedRessenti.emoji}</span>
                <div className="text-sm font-bold text-foreground">{precData.question}</div>
              </div>
              <div className="space-y-2 mb-6">
                {precData.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      haptic(10);
                      setRpeFinal(Math.min(10, Math.max(1, selectedRessenti.rpe + opt.delta)));
                      setRpeStep('done');
                    }}
                    className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-muted-foreground text-left hover:border-[color:var(--draveil)]/40 active:scale-[0.98] transition"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Étape 3 — Validation */}
          {rpeStep === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-3 mb-6 rounded-2xl border border-[color:var(--draveil)]/30 bg-[color:var(--draveil)]/[0.08] p-4">
                <span className="text-3xl">{selectedRessenti?.emoji}</span>
                <div>
                  <div className="text-sm font-bold text-foreground">RPE {rpeFinal}/10</div>
                  <div className="text-xs text-muted-foreground">{selectedRessenti?.label}</div>
                </div>
              </div>
              <textarea
                value={ressenti}
                onChange={(e) => setRessenti(e.target.value)}
                placeholder="Sensations, remarques (optionnel)"
                className="w-full resize-none rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[color:var(--draveil)] focus:outline-none mb-6"
                rows={3}
              />
              <div className="flex gap-2">
                <button onClick={onMiss} disabled={saving} className="flex-1 rounded-2xl border border-white/8 bg-white/[0.02] py-4 text-sm font-semibold text-muted-foreground disabled:opacity-40">
                  Séance manquée
                </button>
                <button onClick={onValidate} disabled={saving} className="flex-[2] rounded-2xl gradient-brand py-4 text-sm font-bold text-white shadow-brand disabled:opacity-40">
                  {saving ? "Enregistrement…" : "Valider 💪"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}