import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, Clock, MapPin, CheckCircle2, Play } from "lucide-react";

import type { Joueur } from "@/lib/supabase";
import { sbSaveJoueur } from "@/lib/supabase";
import { sendOneSignalNotif } from "@/lib/onesignal";
import { successPing, haptic } from "@/lib/draveil/haptic";
import { toast } from "sonner";
import { session } from "@/lib/draveil/session";
import { InlineTimer } from "./inline-timer";
import { GuidedMode, exoToStep, blocToStep } from "./guided-mode";
import { RpeSurvey, type RpeResult } from "./rpe-survey";

/** Un exercice peut venir de core.ts (cles n/d/note) ou du format long (nom/detail/note). */
interface Exo {
  nom?: string;
  detail?: string;
  note?: string;
  n?: string;
  d?: string;
  /** Etapes d'execution detaillees. */
  exec?: string[];
  /** Erreur classique a eviter. */
  erreur?: string;
  series?: number;
  duree?: number;
  reps?: number;
  recup?: number;
  cote?: boolean;
}

const exoNom = (e: Exo) => e.nom ?? e.n ?? "";
const exoDetail = (e: Exo) => e.detail ?? e.d ?? "";

interface Bloc {
  titre: string;
  detail?: string;
  note?: string;
  icone?: string;
  duree?: number;
  isPPP?: boolean;
  pppExos?: Exo[];
  /** Exercices du circuit, affiches etape par etape. */
  sousBlocs?: Bloc[];
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
  onLaunchCircuit,
  onLaunchFrac,
}: Props) {
  const [rpe, setRpe] = useState<number>(0);
  const [ressentiText, setRessentiText] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!alreadyValidated);
  const [showRpe, setShowRpe] = useState(false);

  const showPre = !!regenerator && !readOnly && !alreadyValidated;
  const [prePhase, setPrePhase] = useState<boolean>(showPre);
  const [preRessenti, setPreRessenti] = useState<Ressenti>("normal");
  const [preMat, setPreMat] = useState<MatKey>(defaultMatFromJoueur(joueur));
  const [activeSeance, setActiveSeance] = useState<SeanceLike>(seance);

  function confirmPre() {
    if (regenerator) {
      const fresh = regenerator(preRessenti, preMat);
      if (fresh) setActiveSeance(fresh);
    }
    setPrePhase(false);
  }

  async function validate(missed = false, rpeOverride?: number, ressentiOverride?: string) {
    if (saving || !joueur) return;
    // Si le sondage fournit un RPE, on l'utilise
    if (rpeOverride !== undefined) setRpe(rpeOverride);
    if (ressentiOverride !== undefined) setRessentiText(ressentiOverride);
    setSaving(true);
    const finalRpe = rpeOverride ?? rpe;
    const finalRessenti = ressentiOverride ?? (showPre ? preRessenti : ressentiText || undefined);
    const list = joueur.seances_validees ?? [];
    const entry = {
      date: date ?? new Date().toISOString().split("T")[0],
      weekIdx,
      sessionIdx,
      rpe: missed ? 0 : finalRpe,
      missed,
      ts: Date.now(),
      ressenti: finalRessenti,
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
        description: `RPE ${finalRpe}/10 enregistré`,
      });
      // Notifier le coach
      sendOneSignalNotif({
        title: "✅ Séance validée",
        body: `${joueur.prenom ?? joueur.code} a fini sa séance (RPE ${finalRpe}/10)`,
        target: "coach",
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
              body: `Super boulot ! RPE ${finalRpe}/10`,
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

            {showRpe && (
              <RpeSurvey
                dureeMin={Math.round((activeSeance?.blocs?.reduce((acc,b)=>acc+(b.duree||0),0)||3000)/60)}
                onClose={(result) => {
                  setShowRpe(false);
                  validate(false, result.rpe, result.ressenti);
                }}
              />
            )}

            <div className="space-y-3">
              {(activeSeance.blocs ?? []).map((b, i) => (
                <BlocCard key={i} bloc={b} index={i} readOnly={readOnly}
                onLaunchCircuit={onLaunchCircuit}
                onLaunchFrac={onLaunchFrac}
              />
              ))}
            </div>

            {readOnly ? null : !saved ? (
              <div className="mt-6 space-y-3">
                {/* Bouton validation principal → ouvre le sondage RPE */}
                <button
                  onClick={() => setShowRpe(true)}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-4 text-sm font-bold text-white shadow-brand transition active:scale-[0.98] disabled:opacity-40"
                >
                  ✅ J'ai fait ma séance — Valider
                </button>
                <button
                  onClick={() => validate(true)}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] py-3 text-sm font-medium text-muted-foreground transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-40"
                >
                  ❌ Séance manquée
                </button>
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
/** Formate une duree en secondes vers "10 min" ou "45 s". */
function fmtDuree(sec: number): string {
  if (sec >= 60) {
    const m = Math.round(sec / 60);
    return `${m} min`;
  }
  return `${sec} s`;
}

/**
 * Carte d'un bloc de seance.
 * Affiche le detail, un chrono si le bloc a une duree,
 * puis les exercices etape par etape (circuit ou PPP).
 */
function BlocCard({
  bloc,
  index,
  readOnly,
  onLaunchCircuit,
  onLaunchFrac,
}: {
  bloc: Bloc;
  index: number;
  readOnly?: boolean;
  onLaunchCircuit?: (data: any) => void;
  onLaunchFrac?: (data: any) => void;
}) {
  const exos: Exo[] = bloc.isPPP && bloc.pppExos ? bloc.pppExos : [];
  const steps: Bloc[] = bloc.sousBlocs ?? [];
  const [expanded, setExpanded] = useState(false);
  const [showGuided, setShowGuided] = useState(false);

  // Parser passages
  const passagesMatch = bloc.titre?.match(/(\d+)\s*passage/i);
  const nbPassages = passagesMatch ? parseInt(passagesMatch[1]) : 3;

  // Parser fractionné
  const fracMatch = bloc.titre?.match(/(\d+)×(\d+)\s*(min|s)/i);
  const fracReps = fracMatch ? parseInt(fracMatch[1]) : 0;
  const fracDurNum = fracMatch ? parseInt(fracMatch[2]) : 0;
  const fracDurUnit = fracMatch?.[3]?.toLowerCase() === 'min' ? 60 : 1;
  const fracEffortSec = fracDurNum * fracDurUnit;
  const fracRecupMatch = bloc.detail?.match(/(\d+)\s*(min|s)\s*r[ée]cup/i);
  const fracRecupNum = fracRecupMatch ? parseInt(fracRecupMatch[1]) : 0;
  const fracRecupUnit = fracRecupMatch?.[2]?.toLowerCase() === 'min' ? 60 : 1;
  const fracRecupSec = fracRecupNum * fracRecupUnit || 90;
  const vitesseMatch = bloc.detail?.match(/([\d.]+)\s*km\/h/);
  const paceMatch = bloc.detail?.match(/\(([\d]+'[\d]+")\/km\)/);
  const pctMatch = bloc.detail?.match(/(\d+)%\s*VMA/);
  const vitesseStr = vitesseMatch ? `${vitesseMatch[1]} km/h${paceMatch ? ` (${paceMatch[1]}/km)` : ''}` : undefined;
  const pctStr = pctMatch ? `${pctMatch[1]}% VMA` : undefined;
  const isFractionne = fracReps > 0 && fracEffortSec > 0 && (bloc.icone === '🏃' || bloc.icone === '⚡');

  // Parser effort/recup pour circuit
  const effortMatch = bloc.detail?.match(/(\d+)s effort/);
  const recupMatch  = bloc.detail?.match(/(\d+)s récup/);
  const effortSec = effortMatch ? parseInt(effortMatch[1]) : 30;
  const recupSec  = recupMatch  ? parseInt(recupMatch[1])  : 30;

  // Steps pour mode guidé PPP
  const guidedSteps = exos.length > 0 ? exos.map(exoToStep) : [];

  const hasDetails = steps.length > 0 || exos.length > 0;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] overflow-hidden">

      {/* ── En-tête cliquable ───────────────────────────────────────── */}
      <button
        className="flex w-full items-start gap-3 p-4 text-left"
        onClick={() => hasDetails && setExpanded(e => !e)}
      >
        <div className="text-xl shrink-0 mt-0.5">{bloc.icone ?? "•"}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {bloc.duree ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {fmtDuree(bloc.duree)}
              </span>
            ) : null}
            {vitesseStr && (
              <span className="rounded-full bg-[color:var(--draveil)]/15 px-2 py-0.5 text-[10px] font-bold text-[color:var(--draveil-glow)]">
                {vitesseStr}
              </span>
            )}
            {steps.length > 0 && (
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {steps.length} exercices · {nbPassages} passages
              </span>
            )}
          </div>
          <div className="mt-0.5 font-semibold text-foreground leading-snug">
            {bloc.titre.replace(/\[A\] |\[B\] /g, '')}
          </div>
          {bloc.detail && !hasDetails && (
            <div
              className="mt-1.5 text-sm leading-relaxed text-foreground/75 [&_strong]:font-semibold [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: bloc.detail }}
            />
          )}
          {bloc.detail && hasDetails && !expanded && (
            <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {bloc.detail.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}
            </div>
          )}
        </div>
        {hasDetails && (
          <div className={`shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            ▾
          </div>
        )}
      </button>

      {/* ── Contenu expandable ──────────────────────────────────────── */}
      <AnimatePresence>
        {(expanded || !hasDetails) && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">

              {/* Description complète */}
              {bloc.detail && (
                <div
                  className="text-sm leading-relaxed text-foreground/75 [&_strong]:font-semibold [&_strong]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: bloc.detail }}
                />
              )}

              {/* Exercices du circuit */}
              {steps.length > 0 && (
                <div className="space-y-2">
                  {steps.map((s, k) => (
                    <div key={k} className="rounded-xl bg-white/[0.04] p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--draveil)]/20 text-[10px] font-black text-[color:var(--draveil-glow)]">
                          {k + 1}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {s.titre.replace(/\[A\] |\[B\] /g, '')}
                        </span>
                        {(s as Bloc).videoUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open((s as Bloc).videoUrl, '_blank', 'noopener,noreferrer');
                            }}
                            className="ml-auto shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400 active:bg-red-500/25"
                          >
                            ▶ vidéo
                          </button>
                        )}
                      </div>
                      {s.detail && (
                        <div
                          className="text-xs leading-relaxed text-foreground/65 [&_strong]:text-foreground/90 [&_strong]:font-semibold"
                          dangerouslySetInnerHTML={{ __html: s.detail }}
                        />
                      )}
                      {s.note && (
                        <div className="mt-1.5 text-[11px] text-[color:var(--draveil-glow)]/80 italic">
                          💡 {s.note}
                        </div>
                      )}
                      {(s as Bloc).variante && (
                        <div className="mt-1.5 text-[11px] text-yellow-400/70">
                          Variante : {(s as Bloc).variante}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Exercices PPP */}
              {exos.length > 0 && (
                <div className="space-y-2">
                  {exos.map((e, k) => (
                    <div key={k} className="rounded-xl bg-white/[0.04] p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--draveil)]/20 text-[10px] font-black text-[color:var(--draveil-glow)]">
                          {k + 1}
                        </span>
                        <span className="text-sm font-bold text-foreground">{exoNom(e)}</span>
                        {(e as any).videoUrl && (
                          <button
                            onClick={() => window.open((e as any).videoUrl, '_blank', 'noopener,noreferrer')}
                            className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400 active:bg-red-500/25"
                          >
                            ▶ vidéo
                          </button>
                        )}
                      </div>
                      {exoDetail(e) && (
                        <div className="text-xs text-foreground/65">{exoDetail(e)}</div>
                      )}
                      {e.exec && e.exec.length > 0 && (
                        <ol className="mt-1.5 space-y-0.5">
                          {e.exec.map((line, m) => (
                            <li key={m} className="flex gap-1.5 text-[11px] text-foreground/60">
                              <span className="font-bold text-[color:var(--draveil-glow)] shrink-0">{m+1}.</span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                      {e.note && <div className="mt-1.5 text-[11px] text-muted-foreground italic">💡 {e.note}</div>}
                      {e.erreur && <div className="mt-1 text-[11px] text-amber-400/80">⚠️ {e.erreur}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bouton d'action (timer) ─────────────────────────────────── */}
      {!readOnly && (steps.length > 0 || isFractionne || (!hasDetails && bloc.duree)) && (
        <div className="px-4 pb-4">
          {steps.length > 0 && (
            <button
              onClick={() => onLaunchCircuit?.({
                  titre: bloc.titre.replace(/\[A\] |\[B\] /g, ''),
                  exercices: steps,
                  effortSec,
                  recupSec,
                  passages: nbPassages,
                })}
              className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-3 text-sm font-bold text-white shadow-brand transition active:scale-[0.98]"
            >
              ▶ Lancer le circuit guidé · {nbPassages} passages
            </button>
          )}
          {isFractionne && (
            <button
              onClick={() => onLaunchFrac?.({
                  titre: bloc.titre,
                  reps: fracReps,
                  effortSec: fracEffortSec,
                  recupSec: fracRecupSec,
                  vitesse: vitesseStr,
                  pct: pctStr,
                })}
              className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-3 text-sm font-bold text-white shadow-brand transition active:scale-[0.98]"
            >
              ▶ Lancer le fractionné guidé · {fracReps} répétitions
            </button>
          )}
          {!hasDetails && bloc.duree && !isFractionne && (
            <div className="mt-1">
              <InlineTimer reps={1} effortSec={bloc.duree} recupSec={0} label={bloc.titre} />
            </div>
          )}
          {exos.length > 0 && (
            <button
              onClick={() => setShowGuided(true)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-[color:var(--draveil)]/30 bg-[color:var(--draveil)]/[0.08] py-3 text-sm font-semibold text-foreground transition active:scale-[0.98]"
            >
              ▶ Exercices guidés · {exos.length} exercices de prévention
            </button>
          )}
        </div>
      )}

      {/* Timers gérés au niveau root via onLaunchCircuit/onLaunchFrac */}
      <AnimatePresence>
        {showGuided && (
          <GuidedMode
            titre={bloc.titre}
            steps={guidedSteps}
            onClose={() => setShowGuided(false)}
          />
        )}
      </AnimatePresence>

      {bloc.note && !hasDetails && (
        <div className="px-4 pb-3 text-xs italic text-muted-foreground">{bloc.note}</div>
      )}
    </div>
  );
}
