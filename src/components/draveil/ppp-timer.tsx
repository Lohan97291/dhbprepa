import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Pause, Play, SkipForward, X } from "lucide-react";
import { useWakeLock } from "@/hooks/use-wake-lock";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface PppExo {
  /** Nom affiché (champ "nom" ou "n" des exos PPP) */
  titre: string;
  /** Durée d'une série en secondes (ex: 30) */
  duree: number;
  /** Nombre de séries (ex: 3) */
  series?: number;
  /** Temps de récup entre séries en secondes (ex: 30) */
  recup?: number;
  /** Si true : l'exo se fait gauche PUIS droite (double les reps) */
  cote?: boolean;
  /** Instructions courtes */
  exec?: string[];
  /** Conseil coaching */
  note?: string;
  /** URL vidéo YouTube */
  videoUrl?: string;
}

interface Props {
  titre: string;
  exercices: PppExo[];
  onClose: () => void;
  onComplete?: () => void;
}

type Phase = "preview" | "effort" | "recup" | "done";

// ── Audio & haptic ─────────────────────────────────────────────────────────────
function beep(freq: number, dur: number, vol = 0.3) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur / 1000);
    o.start(); o.stop(ctx.currentTime + dur / 1000);
  } catch {}
}
function haptic(ms: number) { try { navigator.vibrate?.(ms); } catch {} }
function successSound() {
  beep(523, 100); setTimeout(() => beep(659, 100), 120);
  setTimeout(() => beep(784, 200), 250);
}

// ── Composant ─────────────────────────────────────────────────────────────────
export function PppTimer({ titre, exercices, onClose, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("preview");
  const [exoIdx, setExoIdx] = useState(0);
  const [serieIdx, setSerieIdx] = useState(0); // 0-based
  const [coteIdx, setCoteIdx] = useState(0);   // 0 = gauche, 1 = droite (si cote)
  const [sec, setSec] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Empêcher l'écran de s'éteindre pendant le timer
  useWakeLock(phase !== "preview" && phase !== "done");

  const exo = exercices[exoIdx];
  const totalSeries = exo ? (exo.series ?? 1) * (exo.cote ? 2 : 1) : 1;
  const currentSerieAbsolute = exo?.cote
    ? serieIdx * 2 + coteIdx + 1
    : serieIdx + 1;
  const effortSec = exo?.duree ?? 30;
  const recupSec = exo?.recup ?? 30;

  const isEffort = phase === "effort";
  const isDone = phase === "done";
  const totalSec = isEffort ? effortSec : recupSec;
  const progress = totalSec > 0 ? (totalSec - sec) / totalSec : 0;
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  // Label de la série courante
  const serieLabel = () => {
    if (!exo) return "";
    if (exo.cote) {
      const legLabel = coteIdx === 0 ? "jambe gauche" : "jambe droite";
      return `Série ${serieIdx + 1} — ${legLabel}`;
    }
    return `Série ${serieIdx + 1} / ${exo.series ?? 1}`;
  };

  const stopInterval = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  // ── Avancer à l'exo suivant ────────────────────────────────────────────────
  const nextExo = useCallback(() => {
    stopInterval();
    const next = exoIdx + 1;
    if (next >= exercices.length) {
      successSound(); haptic(200);
      setPhase("done");
      setSec(0);
      onComplete?.();
    } else {
      haptic(60);
      setExoIdx(next);
      setSerieIdx(0);
      setCoteIdx(0);
      setSec(exercices[next].duree ?? 30);
      setPhase("effort");
      setPaused(false);
      startTick(exercices[next].duree ?? 30, exercices[next].recup ?? 30, 0, 0, exercices[next].series ?? 1, !!exercices[next].cote, next);
    }
  }, [exoIdx, exercices, stopInterval, onComplete]);

  // ── Avancer dans les séries ────────────────────────────────────────────────
  const advanceSerie = useCallback((
    curSerie: number, curCote: number, totalSer: number, isCote: boolean,
    effSec: number, recSec: number, eIdx: number
  ) => {
    // Passer côté suivant si cote
    if (isCote && curCote === 0) {
      setCoteIdx(1);
      if (recSec > 0) {
        beep(440, 200); haptic(30);
        setPhase("recup");
        setSec(recSec);
        startTick(effSec, recSec, curSerie, 1, totalSer, isCote, eIdx);
      } else {
        beep(880, 200); haptic(30);
        setPhase("effort");
        setSec(effSec);
        startTick(effSec, recSec, curSerie, 1, totalSer, isCote, eIdx);
      }
      return;
    }

    const nextSerie = curSerie + 1;
    if (nextSerie >= totalSer) {
      // Dernier exo — passer au suivant
      const nextEIdx = eIdx + 1;
      if (nextEIdx >= exercices.length) {
        successSound(); haptic(200);
        setPhase("done");
        setSec(0);
        onComplete?.();
      } else {
        haptic(100);
        setExoIdx(nextEIdx);
        setSerieIdx(0);
        setCoteIdx(0);
        const ne = exercices[nextEIdx];
        setSec(ne.duree ?? 30);
        setPhase("effort");
        startTick(ne.duree ?? 30, ne.recup ?? 30, 0, 0, ne.series ?? 1, !!ne.cote, nextEIdx);
      }
    } else {
      setSerieIdx(nextSerie);
      setCoteIdx(0);
      if (recSec > 0) {
        beep(440, 200); haptic(30);
        setPhase("recup");
        setSec(recSec);
        startTick(effSec, recSec, nextSerie, 0, totalSer, isCote, eIdx);
      } else {
        beep(880, 200); haptic(30);
        setPhase("effort");
        setSec(effSec);
        startTick(effSec, recSec, nextSerie, 0, totalSer, isCote, eIdx);
      }
    }
  }, [exercices, onComplete]);

  // ── Tick ──────────────────────────────────────────────────────────────────
  function startTick(
    effSec: number, recSec: number,
    serie: number, cote: number, totalSer: number, isCote: boolean, eIdx: number,
    currentPhase: Phase = "effort"
  ) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let ph = currentPhase;
    let s = ph === "effort" ? effSec : recSec;
    setSec(s);

    intervalRef.current = setInterval(() => {
      s--;
      if (s === 3) beep(660, 80);
      else if (s === 2) beep(660, 80);
      else if (s === 1) beep(660, 80);

      if (s <= 0) {
        if (ph === "effort") {
          // Effort terminé → récup ou série suivante
          advanceSerie(serie, cote, totalSer, isCote, effSec, recSec, eIdx);
          clearInterval(intervalRef.current!);
        } else {
          // Récup terminée → effort suivant
          ph = "effort";
          s = effSec;
          beep(880, 200); haptic(30);
          setPhase("effort");
          setSec(s);
        }
      } else {
        setSec(s);
      }
    }, 1000);
  }

  // ── Play/Pause ─────────────────────────────────────────────────────────────
  function togglePause() {
    if (phase === "preview") {
      // Démarrer
      const e = exercices[0];
      setPhase("effort");
      setSec(e.duree ?? 30);
      startTick(e.duree ?? 30, e.recup ?? 30, 0, 0, e.series ?? 1, !!e.cote, 0);
      return;
    }
    if (isDone) { onClose(); return; }
    if (paused) {
      setPaused(false);
      // Relancer le tick depuis l'état actuel
      // Simple : on redémarre avec sec restant
      startTick(effortSec, recupSec, serieIdx, coteIdx, exo?.series ?? 1, !!exo?.cote, exoIdx, phase);
    } else {
      stopInterval();
      setPaused(true);
    }
  }

  // ── Passer l'exo courant ───────────────────────────────────────────────────
  function skipExo() {
    stopInterval();
    nextExo();
  }

  useEffect(() => () => stopInterval(), [stopInterval]);

  // ── Couleurs de phase ──────────────────────────────────────────────────────
  const phaseColor = isDone ? "var(--draveil)" : isEffort ? "rgb(248,113,113)" : "rgb(96,165,250)";
  const phaseBg = isDone
    ? "color-mix(in oklab, var(--draveil) 15%, transparent)"
    : isEffort ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.12)";
  const phaseLabel = isDone ? "Terminé 🎉" : isEffort ? "Tiens !" : "Souffle";

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed inset-0 z-[80] flex flex-col bg-[color:var(--background)]"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))", paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        {/* ── En-tête ── */}
        <div className="shrink-0 border-b border-white/8 px-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--draveil-glow)]">
                Prévention guidée
              </div>
              <div className="truncate text-sm font-semibold text-foreground">{titre}</div>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Barre de progression exos */}
          <div className="flex items-center gap-1.5">
            {exercices.map((_, k) => (
              <div
                key={k}
                className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{
                  background: k < exoIdx
                    ? "color-mix(in oklab, var(--draveil) 55%, transparent)"
                    : k === exoIdx
                      ? "var(--draveil)"
                      : "rgba(255,255,255,0.08)",
                }}
              />
            ))}
          </div>
          <div className="mt-2 text-[11px] font-semibold text-muted-foreground">
            Exercice {Math.min(exoIdx + 1, exercices.length)} / {exercices.length}
          </div>
        </div>

        {/* ── Corps ── */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {phase === "preview" ? (
            <PreviewPanel exo={exercices[0]} titre={titre} exercices={exercices} />
          ) : isDone ? (
            <DonePanel exercices={exercices} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${exoIdx}-${phase}-${serieIdx}-${coteIdx}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                {/* Carte exercice */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    {serieLabel()}
                  </div>
                  <h2 className="font-display text-2xl font-black leading-tight text-foreground">
                    {exo?.titre}
                  </h2>
                  {exo?.note && (
                    <div className="mt-2 text-[12px] text-[color:var(--draveil-glow)]/80 italic">
                      💡 {exo.note}
                    </div>
                  )}
                  {exo?.exec && exo.exec.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {exo.exec.map((line, k) => (
                        <div key={k} className="flex gap-2 text-[12px] text-foreground/70">
                          <span className="shrink-0 font-bold text-[color:var(--draveil-glow)]">{k + 1}.</span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {exo?.videoUrl && (
                    <button
                      onClick={() => window.open(exo.videoUrl, "_blank", "noopener,noreferrer")}
                      className="mt-3 rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-bold text-red-400"
                    >
                      ▶ Voir la vidéo
                    </button>
                  )}
                </div>

                {/* Chronomètre */}
                <div
                  className="rounded-2xl p-5 text-center transition-colors duration-300"
                  style={{ background: phaseBg, border: `1px solid color-mix(in oklab, ${phaseColor} 35%, transparent)` }}
                >
                  <div
                    className="text-[11px] font-bold uppercase tracking-[0.28em] mb-1"
                    style={{ color: phaseColor }}
                  >
                    {phaseLabel}
                  </div>
                  <motion.div
                    key={`${phase}-${serieIdx}-${coteIdx}-${sec}`}
                    initial={{ scale: 0.92, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 260 }}
                    className="font-display text-7xl font-black tabular-nums"
                    style={{ color: phaseColor }}
                  >
                    {mm}:{ss}
                  </motion.div>

                  {/* Barre de progression série */}
                  <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: phaseColor }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* ── Contrôles ── */}
        <div className="shrink-0 border-t border-white/8 px-5 pt-4 flex gap-3">
          {!isDone && phase !== "preview" && (
            <button
              onClick={skipExo}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04] text-muted-foreground"
              title="Passer cet exercice"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={togglePause}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white shadow-brand transition active:scale-[0.98]"
          >
            {phase === "preview" ? (
              <><Play className="h-5 w-5" /> Commencer</>
            ) : isDone ? (
              <>✓ Fermer</>
            ) : paused ? (
              <><Play className="h-5 w-5" /> Reprendre</>
            ) : (
              <><Pause className="h-5 w-5" /> Pause</>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ── Panneau preview ────────────────────────────────────────────────────────────
function PreviewPanel({ exercices, titre }: { exo: PppExo; titre: string; exercices: PppExo[] }) {
  const totalMin = Math.round(
    exercices.reduce((acc, e) => {
      const reps = (e.series ?? 1) * (e.cote ? 2 : 1);
      return acc + reps * ((e.duree ?? 30) + (e.recup ?? 30));
    }, 0) / 60
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--draveil-glow)] mb-2">
          Au programme
        </div>
        <h2 className="font-display text-xl font-black text-foreground mb-1">{titre}</h2>
        <div className="text-[12px] text-muted-foreground">
          {exercices.length} exercices · ~{totalMin} min
        </div>
      </div>

      <div className="space-y-2">
        {exercices.map((e, k) => (
          <div key={k} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--draveil)]/20 text-[11px] font-black text-[color:var(--draveil-glow)]">
              {k + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground truncate">{e.titre}</div>
              <div className="text-[11px] text-muted-foreground">
                {e.series ?? 1} série{(e.series ?? 1) > 1 ? "s" : ""} × {e.duree}s
                {e.cote ? " / côté" : ""}
                {(e.recup ?? 0) > 0 ? ` · ${e.recup}s récup` : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panneau fin ────────────────────────────────────────────────────────────────
function DonePanel({ exercices }: { exercices: PppExo[] }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="text-6xl">🛡️</div>
      <div>
        <div className="font-display text-2xl font-black text-foreground">PPP terminée !</div>
        <div className="mt-1 text-sm text-muted-foreground">
          {exercices.length} exercices complétés — corps blindé 💪
        </div>
      </div>
    </div>
  );
}
