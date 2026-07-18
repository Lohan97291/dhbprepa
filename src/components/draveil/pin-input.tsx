import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PinInputProps {
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  autoFocus?: boolean;
  length?: number;
  className?: string;
}

/**
 * Saisie d'un code PIN (4 chiffres par défaut).
 * Ouvre le clavier numérique sur mobile et affiche des cases séparées.
 */
export function PinInput({
  value,
  onChange,
  onComplete,
  autoFocus = false,
  length = 4,
  className,
}: PinInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (value.length === length && !firedRef.current) {
      firedRef.current = true;
      onComplete?.(value);
    }
    if (value.length < length) firedRef.current = false;
  }, [value, length, onComplete]);

  function handleChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, length);
    onChange(digits);
  }

  return (
    <div
      className={cn("relative", className)}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Champ réel, invisible mais focusable */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={length}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />

      {/* Cases visuelles */}
      <div className="pointer-events-none flex justify-center gap-3">
        {Array.from({ length }).map((_, i) => {
          const filled = i < value.length;
          const active = i === value.length;
          return (
            <div
              key={i}
              className={cn(
                "flex h-16 w-14 items-center justify-center rounded-2xl border bg-white/[0.04] transition",
                filled
                  ? "border-[color:var(--draveil)]/60 bg-[color:var(--draveil)]/[0.10]"
                  : active
                    ? "border-[color:var(--draveil)]/40"
                    : "border-white/8",
              )}
            >
              {filled && (
                <div className="h-3.5 w-3.5 rounded-full bg-[color:var(--draveil)] shadow-[0_0_12px_var(--draveil-glow)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
