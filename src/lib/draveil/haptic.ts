/**
 * Tiny haptic + beep helpers for timer / validation.
 * No-op when unsupported (SSR, iOS Safari without user gesture, etc.).
 */
export function haptic(pattern: number | number[] = 12) {
  if (typeof navigator === "undefined") return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}

let _ctx: AudioContext | null = null;
function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!_ctx) _ctx = new AC();
  return _ctx;
}

export function beep(freq = 880, ms = 120, volume = 0.15) {
  const ac = ctx();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.value = volume;
    osc.connect(gain).connect(ac.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + ms / 1000);
    osc.stop(ac.currentTime + ms / 1000);
  } catch {
    /* ignore */
  }
}

export function successPing() {
  haptic([15, 40, 15]);
  beep(660, 90);
  setTimeout(() => beep(990, 140), 100);
}