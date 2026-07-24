import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Pause, Play, SkipForward, X } from "lucide-react";
import { useWakeLock } from "@/hooks/use-wake-lock";

interface Props {
  titre: string;
  reps: number;        // nombre de répétitions
  effortSec: number;   // durée effort
  recupSec: number;    // durée récup
  vitesse?: string;    // "13.5 km/h (4'20"/km)"
  pct?: string;        // "88% VMA"
  onClose: () => void;
  onComplete?: () => void;
}

type Phase = "preview" | "effort" | "recup" | "done";

function beep(freq: number, dur: number) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur / 1000);
    o.start(); o.stop(ctx.currentTime + dur / 1000);
  } catch {}
}
function haptic(ms: number) { try { navigator.vibrate?.(ms); } catch {} }
function successSound() { beep(523,100); setTimeout(()=>beep(659,100),120); setTimeout(()=>beep(784,200),250); }

export function FractionneTimer({ titre, reps, effortSec, recupSec, vitesse, pct, onClose, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("preview");
  const [rep, setRep] = useState(1);
  const [sec, setSec] = useState(effortSec);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Empêcher l'écran de s'éteindre pendant le timer
  useWakeLock(phase !== "preview" && phase !== "done");

  const isEffort = phase === "effort";
  const totalSec = isEffort ? effortSec : recupSec;
  const progress = totalSec > 0 ? (totalSec - sec) / totalSec : 0;
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss2 = String(sec % 60).padStart(2, "0");

  const tick = useCallback(() => {
    setSec(prev => {
      if (prev === 4) beep(660, 80);
      if (prev === 3) beep(660, 80);
      if (prev === 2) beep(660, 80);
      if (prev > 1) return prev - 1;

      setPhase(cur => {
        if (cur === "effort") {
          if (rep >= reps) {
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
            successSound(); haptic(300);
            onComplete?.();
            return "done";
          }
          beep(440, 300); haptic(80);
          setSec(recupSec);
          return "recup";
        }
        if (cur === "recup") {
          beep(880, 150); haptic(80);
          setRep(r => r + 1);
          setSec(effortSec);
          return "effort";
        }
        return cur;
      });
      return 0;
    });
  }, [rep, reps, effortSec, recupSec, onComplete]);

  useEffect(() => {
    if (phase === "preview" || phase === "done" || paused) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [phase, paused, tick]);

  function start() { beep(880, 200); haptic(100); setPhase("effort"); setSec(effortSec); }
  function skip() { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } setSec(1); tick(); }

  const ringColor = isEffort ? "#EF4444" : "#10B981";
  const bgColor = isEffort ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)";

  const effortMin = Math.floor(effortSec / 60);
  const effortS = effortSec % 60;
  const recupMin = Math.floor(recupSec / 60);
  const recupS = recupSec % 60;
  const effortLabel = effortMin > 0 ? `${effortMin}min${effortS > 0 ? effortS + 's' : ''}` : `${effortSec}s`;
  const recupLabel = recupMin > 0 ? `${recupMin}min${recupS > 0 ? recupS + 's' : ''}` : `${recupSec}s`;

  const content = (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: "var(--background)", isolation: "isolate", paddingTop: "env(safe-area-inset-top)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/8">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--draveil-glow)]">
            {phase === "preview" ? "Fractionné" :
             phase === "done"    ? "Terminé !" :
             isEffort ? `Répétition ${rep}/${reps} — Effort` : `Répétition ${rep}/${reps} — Récup`}
          </div>
          <div className="text-sm font-bold text-foreground truncate max-w-[240px]">{titre}</div>
        </div>
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 text-muted-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col">

        {/* PREVIEW */}
        {phase === "preview" && (
          <div className="px-5 py-6 flex flex-col gap-4">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Programme</div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl font-black text-foreground">{reps}</div>
                  <div className="text-[11px] text-muted-foreground">répétitions</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-red-400">{effortLabel}</div>
                  <div className="text-[11px] text-muted-foreground">effort</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">{recupLabel}</div>
                  <div className="text-[11px] text-muted-foreground">récup</div>
                </div>
              </div>
              {vitesse && (
                <div className="mt-4 rounded-xl bg-[color:var(--draveil)]/10 px-4 py-3 text-center">
                  <div className="font-display text-xl font-black text-[color:var(--draveil-glow)]">{vitesse}</div>
                  {pct && <div className="text-xs text-muted-foreground">{pct}</div>}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Comment ça marche</div>
              <div className="space-y-1.5 text-sm text-foreground/80">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-400"/><strong>{effortLabel} à fond</strong> — à l'allure indiquée</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400"/><strong>{recupLabel} récup</strong> — marche ou trot lent</div>
                <div className="flex items-center gap-2"><span className="text-[color:var(--draveil-glow)]">→</span>Transitions <strong>automatiques</strong></div>
              </div>
            </div>
            <button onClick={start} className="w-full rounded-2xl gradient-brand py-4 text-base font-black text-white shadow-brand">
              ▶ Lancer le fractionné
            </button>
          </div>
        )}

        {/* EFFORT / RECUP */}
        {(phase === "effort" || phase === "recup") && (
          <div className="flex-1 flex flex-col items-center justify-center px-5 py-6" style={{ background: bgColor }}>
            <div className={`text-xs font-black uppercase tracking-[0.25em] mb-6 ${isEffort ? "text-red-400" : "text-emerald-400"}`}>
              {isEffort ? "🏃 À FOND" : "😮‍💨 RÉCUP — MARCHE"}
            </div>

            {/* Timer circulaire */}
            <div className="relative mb-6">
              <svg width="220" height="220" className="-rotate-90">
                <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12"/>
                <circle cx="110" cy="110" r="96" fill="none" stroke={ringColor} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 96}`}
                  strokeDashoffset={`${2 * Math.PI * 96 * (1 - progress)}`}
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-display text-6xl font-black tabular-nums" style={{ color: ringColor }}>
                  {mm}:{ss2}
                </div>
                <div className="text-xs font-semibold text-muted-foreground mt-1">
                  {isEffort ? "effort" : "récupération"}
                </div>
              </div>
            </div>

            {/* Allure */}
            {isEffort && vitesse && (
              <div className="rounded-2xl border border-[color:var(--draveil)]/30 bg-[color:var(--draveil)]/10 px-6 py-3 text-center mb-4">
                <div className="font-display text-2xl font-black text-[color:var(--draveil-glow)]">{vitesse}</div>
                {pct && <div className="text-xs text-muted-foreground">{pct}</div>}
              </div>
            )}
            {!isEffort && (
              <div className="text-sm text-muted-foreground text-center">
                Marche ou trot léger — souffles et prépare la prochaine répétition
              </div>
            )}

            {/* Progression */}
            <div className="mt-auto w-full max-w-sm">
              <div className="flex gap-1 mb-2">
                {Array.from({ length: reps }).map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full transition-all ${
                    i < rep - 1 ? "bg-[color:var(--draveil)]" :
                    i === rep - 1 && isEffort ? "bg-red-400" :
                    i === rep - 1 ? "bg-emerald-400" : "bg-white/10"}`}/>
                ))}
              </div>
              <div className="text-center text-[11px] text-muted-foreground">
                Répétition {rep} sur {reps}
              </div>
            </div>
          </div>
        )}

        {/* DONE */}
        {phase === "done" && (
          <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
              <div className="text-7xl mb-4">🔥</div>
            </motion.div>
            <div className="font-display text-3xl font-black text-gradient-brand">Fractionné terminé !</div>
            <p className="mt-2 text-sm text-muted-foreground">{reps} répétitions · Tu tiens la distance 💪</p>
            <button onClick={onClose} className="mt-8 w-full max-w-xs rounded-2xl gradient-brand py-4 text-sm font-bold text-white shadow-brand">
              Continuer la séance
            </button>
          </div>
        )}
      </div>

      {/* Contrôles */}
      {phase !== "preview" && phase !== "done" && (
        <div className="border-t border-white/8 px-5 py-4 flex gap-3">
          <button onClick={() => setPaused(p => !p)} className="flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/[0.04]">
            {paused ? <Play className="h-6 w-6"/> : <Pause className="h-6 w-6"/>}
          </button>
          <button onClick={skip} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] py-3.5 text-sm font-semibold text-muted-foreground">
            <SkipForward className="h-4 w-4"/>
            Passer cette répétition
          </button>
        </div>
      )}
    </motion.div>
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(content, document.body);
}