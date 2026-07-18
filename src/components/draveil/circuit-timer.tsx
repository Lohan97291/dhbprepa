import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pause, Play, SkipForward, X, ChevronRight } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CircuitExo {
  titre: string;
  icone?: string;
  detail?: string;
  note?: string;
  videoUrl?: string;
  variante?: string;
}

interface Props {
  titre: string;
  exercices: CircuitExo[];
  effortSec: number;    // 30
  recupSec: number;     // 30
  recupPassageSec: number; // 90
  passages: number;
  onClose: () => void;
  onComplete?: () => void;
}

type Phase = "preview" | "effort" | "recup" | "recup_passage" | "done";

// ── Sons ──────────────────────────────────────────────────────────────────────
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

function haptic(ms: number) {
  try { navigator.vibrate?.(ms); } catch {}
}

function successSound() {
  beep(523, 100); setTimeout(() => beep(659, 100), 120);
  setTimeout(() => beep(784, 200), 250);
}

// ── Composant principal ───────────────────────────────────────────────────────
export function CircuitTimer({
  titre, exercices, effortSec, recupSec, recupPassageSec,
  passages, onClose, onComplete
}: Props) {
  const [phase, setPhase] = useState<Phase>("preview");
  const [exoIdx, setExoIdx] = useState(0);
  const [passageIdx, setPassageIdx] = useState(0);
  const [sec, setSec] = useState(effortSec);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const exo = exercices[exoIdx];
  const nextExo = exercices[exoIdx + 1] ?? (passageIdx + 1 < passages ? exercices[0] : null);
  const totalExos = exercices.length;

  // ── Tick ──────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    setSec(prev => {
      // Beeps de compte à rebours
      if (prev === 4) beep(660, 80);
      if (prev === 3) beep(660, 80);
      if (prev === 2) beep(660, 80);

      if (prev > 1) return prev - 1;

      // Transition automatique
      setPhase(currentPhase => {
        if (currentPhase === "effort") {
          const lastExo = exoIdx === totalExos - 1;
          if (lastExo) {
            // Fin du passage
            const lastPassage = passageIdx + 1 >= passages;
            if (lastPassage) {
              // Fin du circuit !
              if (intervalRef.current) clearInterval(intervalRef.current);
              intervalRef.current = null;
              successSound(); haptic(300);
              onComplete?.();
              return "done";
            }
            // Récup inter-passage
            beep(440, 400); haptic(100);
            setSec(recupPassageSec);
            return "recup_passage";
          }
          // Récup inter-exercice
          beep(440, 200); haptic(50);
          setSec(recupSec);
          return "recup";
        }

        if (currentPhase === "recup") {
          // Passe à l'exercice suivant
          beep(880, 150); haptic(80);
          setExoIdx(i => i + 1);
          setSec(effortSec);
          return "effort";
        }

        if (currentPhase === "recup_passage") {
          // Nouveau passage
          beep(880, 200); haptic(100);
          setPassageIdx(p => p + 1);
          setExoIdx(0);
          setSec(effortSec);
          return "effort";
        }

        return currentPhase;
      });
      return 0;
    });
  }, [exoIdx, passageIdx, passages, totalExos, effortSec, recupSec, recupPassageSec, onComplete]);

  // ── Start / Stop ──────────────────────────────────────────────────────────
  function start() {
    beep(880, 150); haptic(80);
    setPhase("effort");
    setSec(effortSec);
  }

  useEffect(() => {
    if (phase === "preview" || phase === "done" || paused) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [phase, paused, tick]);

  function skip() {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setSec(1); tick();
  }

  // ── Couleurs selon phase ──────────────────────────────────────────────────
  const isEffort = phase === "effort";
  const isRecup  = phase === "recup" || phase === "recup_passage";
  const bgColor  = isEffort ? "rgba(239,68,68,0.12)" : isRecup ? "rgba(16,185,129,0.12)" : "transparent";
  const ringColor= isEffort ? "#EF4444" : isRecup ? "#10B981" : "var(--draveil)";
  const totalSec = isEffort ? effortSec : phase === "recup" ? recupSec : recupPassageSec;
  const progress = totalSec > 0 ? (totalSec - sec) / totalSec : 0;

  const mm = String(Math.floor(sec / 60)).padStart(1, "0");
  const ss = String(sec % 60).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col bg-[color:var(--background)]"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/8">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--draveil-glow)]">
            {phase === "preview" ? "Aperçu du circuit" :
             phase === "done"    ? "Circuit terminé !" :
             isEffort            ? `Passage ${passageIdx + 1}/${passages} · Exercice ${exoIdx + 1}/${totalExos}` :
             phase === "recup"   ? "Récupération" :
             `Récup entre passages — ${passageIdx + 1}/${passages} terminé`}
          </div>
          <div className="text-sm font-bold text-foreground truncate">{titre}</div>
        </div>
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 text-muted-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Corps */}
      <div className="flex-1 overflow-y-auto">

        {/* ── PREVIEW ─────────────────────────────────────────────────────── */}
        {phase === "preview" && (
          <div className="px-5 py-6">
            <div className="mb-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                {passages} passage{passages > 1 ? "s" : ""} · {totalExos} exercices · {effortSec}s/{recupSec}s
              </div>
              <div className="space-y-2">
                {exercices.map((e, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--draveil)]/20 text-[11px] font-black text-[color:var(--draveil-glow)]">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {e.icone && `${e.icone} `}{e.titre.replace(/\[A\] |\[B\] /g, "")}
                      </div>
                    </div>
                    {e.videoUrl && (
                      <a href={e.videoUrl} target="_blank" rel="noopener noreferrer"
                        className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">
                        ▶
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 mb-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Comment ça marche</div>
              <div className="space-y-1.5 text-sm text-foreground/80">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-400 shrink-0"/><span><strong>{effortSec}s travail</strong> — donne tout</span></div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0"/><span><strong>{recupSec}s récup</strong> — souffles, prépare l'exercice suivant</span></div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-400 shrink-0"/><span><strong>{recupPassageSec}s récup</strong> entre chaque passage</span></div>
                <div className="flex items-center gap-2"><span className="text-[color:var(--draveil-glow)]">→</span><span>Les transitions sont <strong>automatiques</strong></span></div>
              </div>
            </div>

            <button onClick={start}
              className="w-full rounded-2xl gradient-brand py-4 text-base font-black text-white shadow-brand transition active:scale-[0.98]">
              ▶ Lancer le circuit
            </button>
          </div>
        )}

        {/* ── EFFORT / RECUP ───────────────────────────────────────────────── */}
        {(phase === "effort" || phase === "recup" || phase === "recup_passage") && (
          <div className="flex flex-col items-center px-5 py-6" style={{ background: bgColor, minHeight: "calc(100vh - 120px)" }}>

            {/* Label phase */}
            <div className={`text-xs font-black uppercase tracking-[0.25em] mb-4 ${isEffort ? "text-red-400" : "text-emerald-400"}`}>
              {isEffort ? "💪 TRAVAIL" : phase === "recup_passage" ? "😮‍💨 RÉCUP PASSAGE" : "😮‍💨 RÉCUP"}
            </div>

            {/* Timer circulaire */}
            <div className="relative flex items-center justify-center mb-6">
              <svg width="200" height="200" className="-rotate-90">
                <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
                <circle cx="100" cy="100" r="88" fill="none"
                  stroke={ringColor} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress)}`}
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}/>
              </svg>
              <div className="absolute flex flex-col items-center">
                <div className="font-display text-5xl font-black tabular-nums" style={{ color: ringColor }}>
                  {mm}:{ss}
                </div>
                <div className="text-[11px] font-semibold text-muted-foreground mt-1">
                  {isEffort ? "effort" : "récup"}
                </div>
              </div>
            </div>

            {/* Exercice actuel */}
            <AnimatePresence mode="wait">
              {isEffort && exo && (
                <motion.div key={`${passageIdx}-${exoIdx}`}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  className="w-full max-w-sm">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 mb-3">
                    <div className="text-2xl mb-1">{exo.icone ?? "💪"}</div>
                    <div className="font-display text-xl font-black text-foreground">
                      {exo.titre.replace(/\[A\] |\[B\] /g, "")}
                    </div>
                    {exo.detail && (
                      <div className="mt-2 text-xs leading-relaxed text-foreground/70"
                        dangerouslySetInnerHTML={{ __html: exo.detail.replace(/<strong>/g, '<b>').replace(/<\/strong>/g, '</b>').split('<br>')[0] }}/>
                    )}
                    {exo.note && (
                      <div className="mt-2 text-[11px] text-[color:var(--draveil-glow)] italic">{exo.note}</div>
                    )}
                    {exo.variante && (
                      <div className="mt-2 text-[11px] text-yellow-400/80">💡 {exo.variante}</div>
                    )}
                  </div>
                </motion.div>
              )}

              {isRecup && (
                <motion.div key="recup" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="w-full max-w-sm text-center">
                  {phase === "recup_passage" ? (
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08] p-4 mb-3">
                      <div className="text-3xl mb-2">💪</div>
                      <div className="font-display text-lg font-black text-emerald-400">
                        Passage {passageIdx + 1}/{passages} terminé !
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {passages - passageIdx - 1} passage{passages - passageIdx - 1 > 1 ? "s" : ""} restant{passages - passageIdx - 1 > 1 ? "s" : ""}
                      </div>
                    </div>
                  ) : null}
                  {nextExo && (
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Prochain exercice
                      </div>
                      <div className="font-semibold text-foreground">
                        {nextExo.icone && `${nextExo.icone} `}{nextExo.titre.replace(/\[A\] |\[B\] /g, "")}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Barre de progression globale */}
            <div className="mt-auto pt-6 w-full max-w-sm">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: passages }).map((_, pi) =>
                  Array.from({ length: totalExos }).map((_, ei) => {
                    const done = pi < passageIdx || (pi === passageIdx && ei < exoIdx);
                    const current = pi === passageIdx && ei === exoIdx && isEffort;
                    return (
                      <div key={`${pi}-${ei}`}
                        className={`h-1.5 flex-1 rounded-full transition-all ${done ? "bg-[color:var(--draveil)]" : current ? "bg-red-400" : "bg-white/10"}`}/>
                    );
                  })
                )}
              </div>
              <div className="text-center text-[11px] text-muted-foreground">
                Exercice {exoIdx + 1}/{totalExos} · Passage {passageIdx + 1}/{passages}
              </div>
            </div>
          </div>
        )}

        {/* ── DONE ─────────────────────────────────────────────────────────── */}
        {phase === "done" && (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}>
              <div className="text-7xl mb-4">🏆</div>
            </motion.div>
            <div className="font-display text-3xl font-black text-gradient-brand">Circuit terminé !</div>
            <p className="mt-2 text-sm text-muted-foreground">
              {passages} passage{passages > 1 ? "s" : ""} · {totalExos} exercices · Tu assures 💪
            </p>
            <button onClick={onClose}
              className="mt-8 w-full max-w-xs rounded-2xl gradient-brand py-4 text-sm font-bold text-white shadow-brand">
              Continuer la séance
            </button>
          </div>
        )}
      </div>

      {/* Contrôles flottants */}
      {phase !== "preview" && phase !== "done" && (
        <div className="border-t border-white/8 px-5 py-4 flex items-center gap-3">
          <button onClick={() => setPaused(p => !p)}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/[0.04]">
            {paused ? <Play className="h-6 w-6 text-foreground"/> : <Pause className="h-6 w-6 text-foreground"/>}
          </button>
          <button onClick={skip}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] py-3.5 text-sm font-semibold text-muted-foreground">
            <SkipForward className="h-4 w-4"/>
            Passer
          </button>
        </div>
      )}
    </motion.div>
  );
}
