import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Pause, Play, RotateCcw, Timer as TimerIcon } from "lucide-react";

import { beep, haptic, successPing } from "@/lib/draveil/haptic";

interface Props {
  reps?: number;
  effortSec?: number;
  recupSec?: number;
  label?: string;
}

/**
 * Timer intervalles inline (effort/récup × reps) avec bips de countdown 3-2-1
 * et bip long en fin de phase. Vibration à chaque transition.
 */
export function InlineTimer({
  reps = 1,
  effortSec = 120,
  recupSec = 60,
  label,
}: Props) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"effort" | "recup" | "done">("effort");
  const [rep, setRep] = useState(1);
  const [sec, setSec] = useState(effortSec);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
    setPhase("effort");
    setRep(1);
    setSec(effortSec);
  }

  function toggle() {
    if (phase === "done") {
      reset();
      return;
    }
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setRunning(false);
      return;
    }
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSec((s) => {
        // countdown beeps
        if (s === 4) beep(660, 80);
        else if (s === 3) beep(660, 80);
        else if (s === 2) beep(660, 80);
        if (s > 1) return s - 1;

        // phase transition
        setPhase((p) => {
          if (p === "effort") {
            if (recupSec > 0) {
              beep(440, 220);
              haptic(30);
              setSec(recupSec);
              return "recup";
            }
            // no recup
            setRep((r) => {
              if (r >= reps) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = null;
                setRunning(false);
                successPing();
                setPhase("done");
                setSec(0);
                return r;
              }
              setSec(effortSec);
              return r + 1;
            });
            return "effort";
          }
          // recup → next effort or done
          setRep((r) => {
            if (r >= reps) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              intervalRef.current = null;
              setRunning(false);
              successPing();
              setPhase("done");
              setSec(0);
              return r;
            }
            beep(880, 220);
            haptic(30);
            setSec(effortSec);
            return r + 1;
          });
          return "effort";
        });
        return 0;
      });
    }, 1000);
  }

  const mm = String(Math.floor(sec / 60)).padStart(1, "0");
  const ss = String(sec % 60).padStart(2, "0");
  const isEffort = phase === "effort";
  const isDone = phase === "done";

  return (
    <div
      className="rounded-2xl border p-4 transition-colors"
      style={{
        borderColor: isDone
          ? "color-mix(in oklab, var(--draveil) 40%, transparent)"
          : isEffort
            ? "rgba(239,68,68,0.28)"
            : "rgba(59,130,246,0.28)",
        background: isDone
          ? "color-mix(in oklab, var(--draveil) 12%, transparent)"
          : isEffort
            ? "rgba(239,68,68,0.06)"
            : "rgba(59,130,246,0.06)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <TimerIcon className="h-3.5 w-3.5" />
          {label ?? "Chrono intervalles"}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Rép {rep}/{reps}
        </div>
      </div>

      <div className="mt-2 text-center">
        <div
          className="text-[11px] font-bold uppercase tracking-[0.28em]"
          style={{
            color: isDone
              ? "var(--draveil)"
              : isEffort
                ? "rgb(248,113,113)"
                : "rgb(96,165,250)",
          }}
        >
          {isDone ? "Terminé 🎉" : isEffort ? "Effort" : "Récupération"}
        </div>
        <motion.div
          key={`${phase}-${rep}`}
          initial={{ scale: 0.94, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
          className="font-display text-5xl font-black tabular-nums text-foreground"
        >
          {mm}:{ss}
        </motion.div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={reset}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-muted-foreground transition hover:text-foreground"
          aria-label="Réinitialiser"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={toggle}
          className="flex-1 rounded-xl gradient-brand py-3 text-sm font-bold text-white shadow-brand transition active:scale-[0.98]"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {running ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />{" "}
                {isDone ? "Recommencer" : sec === effortSec && rep === 1 ? "Démarrer" : "Reprendre"}
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}