import { useEffect, useRef } from "react";

/**
 * Empêche l'écran de s'éteindre tant que `active` est true.
 * Utilise la Screen Wake Lock API (Chrome/Android/Safari 16.4+).
 * Sur les navigateurs non supportés : silencieux, pas d'erreur.
 */
export function useWakeLock(active: boolean) {
  const lockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active) {
      lockRef.current?.release().catch(() => {});
      lockRef.current = null;
      return;
    }

    // Acquérir le lock
    async function acquire() {
      try {
        if ("wakeLock" in navigator) {
          lockRef.current = await (navigator as Navigator & {
            wakeLock: { request: (type: string) => Promise<WakeLockSentinel> };
          }).wakeLock.request("screen");

          // Si l'onglet repasse au premier plan, ré-acquérir
          lockRef.current.addEventListener("release", () => {
            if (active) acquire();
          });
        }
      } catch {
        // Navigateur non supporté ou refus — silencieux
      }
    }

    acquire();

    // Ré-acquérir quand l'onglet revient au premier plan
    function onVisibilityChange() {
      if (document.visibilityState === "visible" && active) {
        acquire();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      lockRef.current?.release().catch(() => {});
      lockRef.current = null;
    };
  }, [active]);
}
