import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./glass-card";

export function PagePlaceholder({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto w-full max-w-md px-5 pb-8 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Draveil HB
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight">
          {title}
        </h1>
      </motion.div>
      <GlassCard className="flex flex-col items-center gap-3 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand text-white shadow-brand">
          <Icon className="h-6 w-6" />
        </div>
        <div className="font-display text-lg font-bold">Bientôt disponible</div>
        <p className="max-w-[280px] text-sm text-muted-foreground">{subtitle}</p>
      </GlassCard>
    </div>
  );
}