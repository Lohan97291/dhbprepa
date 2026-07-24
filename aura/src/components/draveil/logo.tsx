import { cn } from "@/lib/utils";
import logoAsset from "@/assets/draveil-logo.png.asset.json";

export const DRAVEIL_LOGO_URL = logoAsset.url;

/**
 * Logo officiel Draveil Handball (badge circulaire, vert Draveil).
 */
export function DhbMark({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={logoAsset.url}
      alt="Draveil Handball"
      width={size}
      height={size}
      draggable={false}
      className={cn("inline-block select-none drop-shadow-[0_6px_18px_rgba(17,152,76,0.35)]", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function DhbWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <DhbMark size={40} />
      <div className="leading-none">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Draveil Handball
        </div>
        <div className="mt-1 font-display text-lg font-black tracking-tight text-gradient-brand">
          Prépa 25/26
        </div>
      </div>
    </div>
  );
}