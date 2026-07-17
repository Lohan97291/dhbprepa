import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Activity, Dumbbell, ShieldCheck, Smartphone, X } from "lucide-react";

interface Slide {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: React.ReactNode;
}

function buildSlides(prenom?: string): Slide[] {
  return [
    {
      icon: <Activity className="h-7 w-7" />,
      eyebrow: "Bienvenue",
      title: prenom ? `Salut ${prenom} 👊` : "Bienvenue sur DHB Prépa",
      body: (
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Ton programme de préparation physique personnalisé est prêt. Voici
            <span className="text-foreground font-semibold"> 3 choses </span>
            à savoir avant de commencer.
          </p>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--draveil-glow)]">
              Ce que tu vas faire
            </div>
            <ul className="space-y-1.5 text-[13px] text-foreground/90">
              <li>📅 <b>2 séances obligatoires</b> par semaine</li>
              <li>🧘 <b>1 séance récup</b> facultative</li>
              <li>📊 <b>Valider</b> chaque séance après l'effort</li>
              <li>🏆 Arriver en forme le <b>25 août</b></li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      icon: <Dumbbell className="h-7 w-7" />,
      eyebrow: "Sur mesure",
      title: "Ton programme est fait pour toi",
      body: (
        <div className="space-y-3">
          {[
            {
              t: "Allures personnalisées",
              d: "Basées sur ta VMA — ni trop facile, ni trop dur",
              e: "🏃",
            },
            {
              t: "Circuit renfo adapté",
              d: "Doses ajustées selon ton âge et ton profil",
              e: "💪",
            },
            {
              t: "Prévention intégrée",
              d: "PPP à chaque séance, même en version allégée",
              e: "🛡️",
            },
          ].map((it) => (
            <div
              key={it.t}
              className="flex gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5"
            >
              <span className="text-2xl">{it.e}</span>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {it.t}
                </div>
                <div className="text-xs text-muted-foreground">{it.d}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <ShieldCheck className="h-7 w-7" />,
      eyebrow: "Important",
      title: "Commence doucement. Vraiment.",
      body: (
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-foreground/90">
            La première semaine doit te paraître <b>facile</b>. Le risque n°1
            en reprise, c'est de se cramer dans les 10 premiers jours.
          </div>
          <ul className="space-y-2">
            <li>🌙 <b className="text-foreground">Sommeil</b> — 8h min.</li>
            <li>💧 <b className="text-foreground">Hydratation</b> — 1,5 L min. / jour.</li>
            <li>🥗 <b className="text-foreground">Nutrition</b> — glucides + protéines dans les 30 min post-effort.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <Smartphone className="h-7 w-7" />,
      eyebrow: "Au quotidien",
      title: "Comment ça marche",
      body: (
        <div className="space-y-3 text-sm">
          {[
            ["Avant", "Dis comment tu te sens → la séance s'adapte"],
            ["Pendant", "Mode guidé étape par étape · chrono intégré"],
            ["Après", "Valide et donne ton RPE (1 → 10)"],
          ].map(([label, desc], i) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-brand text-xs font-black text-white">
                {i + 1}
              </span>
              <div>
                <div className="font-semibold text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-[color:var(--draveil)]/25 bg-[color:var(--draveil)]/10 p-4 text-center">
            <div className="text-2xl">💪</div>
            <div className="mt-1 font-semibold text-foreground">C'est parti !</div>
            <div className="mt-1 text-xs text-muted-foreground">
              La prépa individuelle démarre le{" "}
              <b className="text-[color:var(--draveil-glow)]">20 juillet</b>.
            </div>
          </div>
        </div>
      ),
    },
  ];
}

export function WelcomeSlides({
  prenom,
  onClose,
}: {
  prenom?: string;
  onClose: () => void;
}) {
  const slides = buildSlides(prenom);
  const [i, setI] = useState(0);
  const isLast = i === slides.length - 1;
  const slide = slides[i];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-6"
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        className="glass-strong w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] overflow-hidden flex flex-col max-h-[92dvh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <motion.div
                key={idx}
                animate={{
                  width: idx === i ? 22 : 8,
                  backgroundColor:
                    idx === i
                      ? "var(--draveil)"
                      : "oklch(1 0 0 / 0.15)",
                }}
                transition={{ duration: 0.3 }}
                className="h-1.5 rounded-full"
              />
            ))}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scroll-slim px-6 pb-4 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-5 flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand text-white shadow-brand">
                  {slide.icon}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--draveil-glow)]">
                  {slide.eyebrow}
                </div>
                <h2 className="mt-1 font-display text-2xl font-black tracking-tight text-foreground">
                  {slide.title}
                </h2>
              </div>
              {slide.body}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 p-5">
          <button
            onClick={() => (isLast ? onClose() : setI(i + 1))}
            className="w-full rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white shadow-brand transition active:scale-[0.98]"
          >
            {isLast ? "🚀 C'est parti !" : "Suivant →"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}