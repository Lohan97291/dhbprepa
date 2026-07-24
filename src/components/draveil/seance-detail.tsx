import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Clock, MapPin, CheckCircle2, PlayCircle } from "lucide-react";

import type { Joueur } from "@/lib/supabase";
import { sbSaveJoueur } from "@/lib/supabase";
import { successPing, haptic } from "@/lib/draveil/haptic";
import { toast } from "sonner";
import { session } from "@/lib/draveil/session";
import { InlineTimer } from "./inline-timer";
import { SeancePlayer } from "./seance-player";

interface Bloc {
  titre: string;
  detail?: string;
  note?: string;
  icone?: string;
  duree?: number;
  isPPP?: boolean;
  pppExos?: Array<{ nom: string; detail?: string }>;
}

// Structural shape of a generated session (matches core.ts return values).
export interface SeanceLike {
  titre: string;
  type?: string;
  typeIcon?: string;
  typeColor?: string;
  duree?: string | number;
  obligatoire?: boolean;
  isCollective?: boolean;
  objectif?: string;
  lieu?: string;
  notePoste?: string | null;
  blocs?: Bloc[];
  phase?: string;
  semaine?: number;
}

type Ressenti = "fatigue" | "normal" | "enforme";
type MatKey = "aucun" | "elast" | "salle";

const MATS: { key: MatKey; label: string; emoji: string }[] = [
  { key: "aucun", label: "Aucun équipement", emoji: "🏃" },
  { key: "elast", label: "Élastiques", emoji: "🧵" },
  { key: "salle", label: "Salle de muscu", emoji: "🏋️" },
];

function defaultMatFromJoueur(j?: Joueur): MatKey {
  const m = j?.materiel ?? [];
  if (m.includes("Salle de muscu")) return "salle";
  if (m.includes("Élastiques")) return "elast";
  return "aucun";
}

interface Props {
  seance: SeanceLike;
  joueur?: Joueur;
  weekIdx: number;
  sessionIdx: number;
  date?: string;
  alreadyValidated?: boolean;
  readOnly?: boolean;
  /**
   * Optional. When provided (and not readOnly/alreadyValidated), the sheet
   * asks for ressenti + matériel first, then calls this to swap in a
   * regenerated séance adapted to the choice.
   */
  regenerator?: (ressenti: Ressenti, materiel: MatKey) => SeanceLike;
  onClose: () => void;
}

export function SeanceDetailSheet({
  seance,
  joueur,
  weekIdx,
  sessionIdx,
  date,
  alreadyValidated,
  readOnly,
  regenerator,
  onClose,
}: Props) {
  const [rpe, setRpe] = useState<number>(0);
  const [ressentiText, setRessentiText] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!alreadyValidated);

  const showPre = !!regenerator && !readOnly && !alreadyValidated;
  const [prePhase, setPrePhase] = useState<boolean>(showPre);
  const [preRessenti, setPreRessenti] = useState<Ressenti>("normal");
  const [preMat, setPreMat] = useState<MatKey>(defaultMatFromJoueur(joueur));
  const [activeSeance, setActiveSeance] = useState<SeanceLike>(seance);
  const [playing, setPlaying] = useState(false);

  function confirmPre() {
    if (regenerator) {
      const fresh = regenerator(preRessenti, preMat);
      if (fresh) setActiveSeance(fresh);
    }
    setPrePhase(false);
  }

  if (playing && joueur) {
    return createPortal(
      <div className="fixed inset-0 z-[200] bg-[color:var(--background)]">
        <SeancePlayer
          seance={activeSeance}
          joueur={joueur}
          weekIdx={weekIdx}
          sessionIdx={sessionIdx}
          date={date ?? new Date().toISOString().split("T")[0]}
          onExit={() => {
            setPlaying(false);
            onClose();
          }}
        />
      </div>,
      document.body
    );
  }

  async function validate(missed = false) {
    if (saving || !joueur) return;
    setSaving(true);
    const list = joueur.seances_validees ?? [];
    const entry = {
      date: date ?? new Date().toISOString().split("T")[0],
      weekIdx,
      sessionIdx,
      rpe: missed ? 0 : rpe,
      missed,
      ts: Date.now(),
      ressenti: showPre ? preRessenti : ressentiText || undefined,
    };
    const next: Joueur = {
      ...joueur,
      seances_validees: [
        ...list.filter(
          (s) => !(s.weekIdx === weekIdx && s.sessionIdx === sessionIdx),
        ),
        entry,
      ],
    };
    await sbSaveJoueur(next);
    session.setJoueur(next);
    setSaved(true);
    setSaving(false);
    if (missed) {
      haptic(20);
      toast("Séance marquée comme manquée");
    } else {
      successPing();
      toast.success("Séance validée 💪", {
        description: `RPE ${rpe}/10 enregistré`,
      });
      try {
        if (
          typeof window !== "undefined" &&
          "Notification" in window
        ) {
          if (Notification.permission === "default") {
            await Notification.requestPermission();
          }
          if (Notification.permission === "granted") {
            new Notification("Séance validée 💪", {
              body: `Super boulot ! RPE ${rpe}/10`,
              icon: "/icon-512.png",
            });
          }
        }
      } catch {
        /* ignore */
      }
    }
    setTimeout(onClose, 800);
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        key="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[92dvh] max-w-md overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[color:var(--background)]/98 backdrop-blur-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[color:var(--background)]/90 px-5 py-3 backdrop-blur-xl">
          <div className="mx-auto h-1 w-10 rounded-full bg-white/15" />
          <button
            onClick={onClose}
            className="absolute right-3 top-2 rounded-full p-2 text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {prePhase ? (
          <div className="px-5 pb-8 pt-4">
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
              style={{ background: seance.typeColor ?? "var(--draveil)" }}
            >
              <span>{seance.typeIcon}</span>
              {seance.type ?? "Séance"}
            </div>
            <h2 className="mt-3 font-display text-2xl font-black tracking-tight">
              {seance.titre}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              On adapte la séance à ton état du jour et au matériel dispo.
            </p>

            <div className="mt-6">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Comment tu te sens ?
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { k: "fatigue", emoji: "😴", label: "Fatigué" },
                    { k: "normal", emoji: "😐", label: "Normal" },
                    { k: "enforme", emoji: "🔥", label: "En forme" },
                  ] as const
                ).map((o) => {
                  const active = preRessenti === o.k;
                  return (
                    <button
                      key={o.k}
                      onClick={() => setPreRessenti(o.k)}
                      className={`rounded-2xl border py-4 text-center transition ${
                        active
                          ? "border-[color:var(--draveil)]/60 bg-[color:var(--draveil)]/[0.14] shadow-brand"
                          : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="text-3xl">{o.emoji}</div>
                      <div className="mt-1 text-[11px] font-semibold text-foreground/80">
                        {o.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Matériel du jour
              </div>
              <div className="space-y-2">
                {MATS.map((m) => {
                  const active = preMat === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setPreMat(m.key)}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                        active
                          ? "border-[color:var(--draveil)]/60 bg-[color:var(--draveil)]/[0.10]"
                          : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className="flex-1 text-sm font-semibold text-foreground">
                        {m.label}
                      </span>
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${
                          active
                            ? "border-[color:var(--draveil)] bg-[color:var(--draveil)]"
                            : "border-white/20"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={confirmPre}
              className="mt-6 w-full rounded-2xl gradient-brand py-4 text-sm font-bold uppercase tracking-widest text-white shadow-brand transition hover:brightness-110"
            >
              Voir ma séance →
            </button>
          </div>
        ) : (
          <div className="px-5 pb-8 pt-4">
            <div className="mb-5">
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                style={{ background: activeSeance.typeColor ?? "var(--draveil)" }}
              >
                <span>{activeSeance.typeIcon}</span>
                {activeSeance.type ?? "Séance"}
              </div>
              <h2 className="mt-3 font-display text-2xl font-black tracking-tight">
                {activeSeance.titre}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {activeSeance.duree && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {activeSeance.duree}
                  </span>
                )}
                {activeSeance.lieu && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {activeSeance.lieu}
                  </span>
                )}
                {activeSeance.phase && <span>· {activeSeance.phase}</span>}
              </div>
              {activeSeance.notePoste && (
                <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-xs text-foreground/80">
                  {activeSeance.notePoste}
                </div>
              )}
            </div>

            {!readOnly && (
              <div className="mb-4">
                <button
                  onClick={() => setPlaying(true)}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl gradient-brand py-4 text-base font-bold uppercase tracking-widest text-white shadow-brand transition hover:brightness-110"
                >
                  <PlayCircle className="h-6 w-6" />
                  Démarrer la séance guidée
                </button>
                <div className="mt-3">
                  <InlineTimer reps={6} effortSec={120} recupSec={60} />
                </div>
              </div>
            )}

            <div className="space-y-3">
              {(activeSeance.blocs ?? []).map((b, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/8 bg-white/[0.025] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl">{b.icone ?? "•"}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground">
                        {b.titre}
                      </div>
                      {b.detail && (
                        <div
                          className="mt-2 text-sm leading-relaxed text-foreground/85 [&_strong]:font-semibold [&_strong]:text-foreground"
                          dangerouslySetInnerHTML={{ __html: b.detail }}
                        />
                      )}
                      {b.isPPP && b.pppExos && (
                        <ul className="mt-2 space-y-1 text-sm text-foreground/85">
                          {b.pppExos.map((e, k) => (
                            <li key={k}>
                              <span className="font-semibold text-foreground">
                                {e.nom}
                              </span>
                              {e.detail ? ` — ${e.detail}` : ""}
                            </li>
                          ))}
                        </ul>
                      )}
                      {b.note && (
                        <div className="mt-2 text-xs italic text-muted-foreground">
                          {b.note}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {readOnly ? null : !saved ? (
              <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Valider la séance
                </div>
                <div className="mb-3 text-xs text-muted-foreground">
                  Difficulté ressentie (RPE)
                </div>
                <div className="mb-4 flex items-center gap-1.5">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setRpe(n)}
                      className={`h-9 flex-1 rounded-lg text-xs font-bold transition ${
                        rpe >= n
                          ? "text-white shadow-brand"
                          : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]"
                      }`}
                      style={
                        rpe >= n
                          ? {
                              background: `linear-gradient(180deg, hsl(${140 - n * 12} 70% 45%), hsl(${140 - n * 12} 70% 38%))`,
                            }
                          : undefined
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <textarea
                  value={ressentiText}
                  onChange={(e) => setRessentiText(e.target.value)}
                  placeholder="Ressenti, sensations (optionnel)"
                  className="w-full resize-none rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[color:var(--draveil)] focus:outline-none"
                  rows={2}
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => validate(true)}
                    disabled={saving}
                    className="flex-1 rounded-xl border border-white/8 bg-white/[0.02] py-3 text-sm font-medium text-muted-foreground transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-40"
                  >
                    Séance manquée
                  </button>
                  <button
                    onClick={() => validate(false)}
                    disabled={saving || rpe === 0}
                    className="flex-[2] rounded-xl gradient-brand py-3 text-sm font-bold text-white shadow-brand transition hover:brightness-110 disabled:opacity-40"
                  >
                    {saving ? "Enregistrement…" : "Valider la séance"}
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-4 text-sm font-semibold text-emerald-400"
              >
                <CheckCircle2 className="h-5 w-5" />
                Séance enregistrée
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}