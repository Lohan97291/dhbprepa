import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, CheckCircle2 } from "lucide-react";
import { GlassCard } from "./glass-card";
import { sendOneSignalNotif } from "@/lib/onesignal";
import { sbSaveJoueur } from "@/lib/supabase";
import { session } from "@/lib/draveil/session";

// ── Types ────────────────────────────────────────────────────────────────────
export interface RpeResult {
  rpe: number;          // 1-10 calculé automatiquement
  ressenti: string;     // label emoji pour l'affichage
  details: string[];    // ce qui était difficile
  douleur: string | null; // zone douloureuse si signalée
  charge: number;       // RPE × durée séance (UA)
}

interface Props {
  dureeMin: number;     // durée de la séance en minutes
  coachId?: string;     // pour envoyer les alertes
  onClose: (result: RpeResult) => void;
}

// ── Conversion ressenti → RPE ─────────────────────────────────────────────────
const RESSENTIS = [
  { emoji: '😴', label: 'Trop facile',  rpe: 2, color: '#3B82F6' },
  { emoji: '😐', label: 'Gérable',      rpe: 4, color: '#10B981' },
  { emoji: '😤', label: 'Difficile',    rpe: 6, color: '#F59E0B' },
  { emoji: '🥵', label: 'Très dur',     rpe: 8, color: '#EF4444' },
  { emoji: '💀', label: 'Épuisant',     rpe: 10, color: '#7C3AED' },
];

const DIFFICULTES = [
  { id: 'jambes',     label: '🦵 Jambes lourdes' },
  { id: 'souffle',    label: '💨 Manque de souffle' },
  { id: 'muscles',    label: '💪 Muscles qui brûlaient' },
  { id: 'douleur',    label: '🤕 Douleur quelque part' },
  { id: 'fatigue',    label: '😴 Fatigue générale' },
  { id: 'tete',       label: '🧠 Tête pas là / motivation' },
];

const ZONES_DOULEUR = [
  'Genou', 'Cheville', 'Cuisse / ischio', 'Dos', 'Épaule', 'Pied / orteil', 'Autre'
];

// ── Message selon RPE ─────────────────────────────────────────────────────────
function getMessageRPE(rpe: number, charge: number): { title: string; body: string; color: string } {
  if (rpe <= 3) return {
    title: '😴 Séance trop facile',
    body: `Charge ${charge} UA · Tu peux pousser davantage la prochaine fois.`,
    color: '#3B82F6'
  };
  if (rpe <= 5) return {
    title: '✅ Zone idéale',
    body: `Charge ${charge} UA · Parfait — c'est exactement la zone cible.`,
    color: '#10B981'
  };
  if (rpe <= 7) return {
    title: '💪 Bonne intensité',
    body: `Charge ${charge} UA · Bien joué — récupère bien ce soir.`,
    color: '#F59E0B'
  };
  if (rpe <= 9) return {
    title: '🔥 Séance intense',
    body: `Charge ${charge} UA · Beau effort — hydrate-toi et dors bien.`,
    color: '#EF4444'
  };
  return {
    title: '💀 Séance maximale',
    body: `Charge ${charge} UA · Récupération prioritaire — mange bien et dors.`,
    color: '#7C3AED'
  };
}

// ── Composant principal ───────────────────────────────────────────────────────
export function RpeSurvey({ dureeMin, onClose }: Props) {
  const [step, setStep] = useState<'ressenti' | 'difficulte' | 'douleur' | 'result'>('ressenti');
  const [selectedRessenti, setSelectedRessenti] = useState<typeof RESSENTIS[0] | null>(null);
  const [selectedDiffs, setSelectedDiffs] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const showDifficulte = selectedRessenti && selectedRessenti.rpe >= 6;
  const showDouleur = selectedDiffs.includes('douleur');

  function toggleDiff(id: string) {
    setSelectedDiffs(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  }

  async function finish() {
    if (!selectedRessenti) return;

    const rpe = selectedRessenti.rpe;
    const charge = Math.round(rpe * dureeMin);
    const result: RpeResult = {
      rpe,
      ressenti: `${selectedRessenti.emoji} ${selectedRessenti.label}`,
      details: selectedDiffs,
      douleur: showDouleur ? selectedZone : null,
      charge,
    };

    // Envoyer alerte coach si nécessaire
    const joueur = session.getJoueur();
    const prenom = joueur?.prenom || joueur?.code || 'Un joueur';

    if (rpe >= 9) {
      await sendOneSignalNotif({
        title: '⚠️ Surcharge détectée',
        body: `${prenom} — RPE ${rpe}/10 · Charge ${charge} UA · Surveille sa récupération.`,
        target: 'coach',
      });
    }
    if (showDouleur && selectedZone) {
      await sendOneSignalNotif({
        title: '🤕 Douleur signalée',
        body: `${prenom} signale une douleur : ${selectedZone}. À vérifier avant la prochaine séance.`,
        target: 'coach',
      });
    }
    if (rpe <= 3) {
      await sendOneSignalNotif({
        title: '😴 Séance trop facile',
        body: `${prenom} — RPE ${rpe}/10 · Tu peux augmenter la charge pour lui.`,
        target: 'coach',
      });
    }

    // Sauvegarder le RPE avec la séance
    setStep('result');
    setTimeout(() => onClose(result), 2500);
  }

  const msg = selectedRessenti ? getMessageRPE(selectedRessenti.rpe, Math.round(selectedRessenti.rpe * dureeMin)) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-end bg-black/80 backdrop-blur-sm pb-safe"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        className="w-full max-w-md rounded-t-3xl border-t border-white/10 bg-[color:var(--background)] p-6"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--draveil-glow)]">
              {step === 'ressenti' ? 'Ressenti' : step === 'difficulte' ? 'Précision' : step === 'douleur' ? 'Localisation' : 'Résultat'}
            </div>
            <h3 className="mt-0.5 font-display text-xl font-black tracking-tight">
              {step === 'ressenti' && 'Comment tu t\'es senti ?'}
              {step === 'difficulte' && 'Qu\'est-ce qui était difficile ?'}
              {step === 'douleur' && 'Où exactement ?'}
              {step === 'result' && 'Enregistré 💪'}
            </h3>
          </div>
          <button
            onClick={() => onClose({ rpe: 5, ressenti: '—', details: [], douleur: null, charge: 5 * dureeMin })}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">

          {/* ÉTAPE 1 — Ressenti général */}
          {step === 'ressenti' && (
            <motion.div key="ressenti" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="grid grid-cols-5 gap-2">
                {RESSENTIS.map((r) => (
                  <button
                    key={r.rpe}
                    onClick={() => {
                      setSelectedRessenti(r);
                      if (r.rpe >= 6) {
                        setStep('difficulte');
                      } else {
                        setStep('result');
                        // Auto-finish pour les ressentis faciles
                        setTimeout(() => {
                          const charge = Math.round(r.rpe * dureeMin);
                          const joueur = session.getJoueur();
                          const prenom = joueur?.prenom || joueur?.code || 'Un joueur';
                          if (r.rpe <= 3) {
                            sendOneSignalNotif({
                              title: '😴 Séance trop facile',
                              body: `${prenom} — RPE ${r.rpe}/10`,
                              target: 'coach',
                            });
                          }
                          onClose({ rpe: r.rpe, ressenti: `${r.emoji} ${r.label}`, details: [], douleur: null, charge });
                        }, 1500);
                      }
                    }}
                    className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/8 bg-white/[0.03] p-3 transition active:scale-95"
                    style={{ borderColor: selectedRessenti?.rpe === r.rpe ? r.color : undefined }}
                  >
                    <span className="text-3xl">{r.emoji}</span>
                    <span className="text-[10px] font-semibold leading-tight text-center text-muted-foreground">
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Sois honnête — ça m'aide à adapter ta charge d'entraînement.
              </p>
            </motion.div>
          )}

          {/* ÉTAPE 2 — Précision si difficile */}
          {step === 'difficulte' && (
            <motion.div key="diff" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="mb-3 text-sm text-muted-foreground">
                Sélectionne tout ce qui correspond :
              </p>
              <div className="space-y-2">
                {DIFFICULTES.map((d) => {
                  const selected = selectedDiffs.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleDiff(d.id)}
                      className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        selected
                          ? 'border-[color:var(--draveil)]/60 bg-[color:var(--draveil)]/[0.12] text-foreground'
                          : 'border-white/8 bg-white/[0.03] text-muted-foreground'
                      }`}
                    >
                      <div className={`h-4 w-4 shrink-0 rounded-full border-2 ${selected ? 'border-[color:var(--draveil)] bg-[color:var(--draveil)]' : 'border-white/20'}`} />
                      {d.label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => showDouleur ? setStep('douleur') : finish()}
                disabled={selectedDiffs.length === 0}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white disabled:opacity-40"
              >
                {showDouleur ? 'Suivant' : 'Valider'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* ÉTAPE 3 — Localisation douleur */}
          {step === 'douleur' && (
            <motion.div key="douleur" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="mb-3 text-sm text-muted-foreground">
                Où se situe la douleur ?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ZONES_DOULEUR.map((z) => (
                  <button
                    key={z}
                    onClick={() => setSelectedZone(z)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      selectedZone === z
                        ? 'border-red-500/60 bg-red-500/[0.12] text-red-400'
                        : 'border-white/8 bg-white/[0.03] text-muted-foreground'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
              <button
                onClick={finish}
                disabled={!selectedZone}
                className="mt-4 w-full rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white disabled:opacity-40"
              >
                Valider
              </button>
            </motion.div>
          )}

          {/* RÉSULTAT */}
          {step === 'result' && msg && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-4">
              <CheckCircle2 className="h-14 w-14 text-emerald-400 mb-3" />
              <div className="font-display text-xl font-black" style={{ color: msg.color }}>
                {msg.title}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{msg.body}</p>
              {selectedRessenti && (
                <div className="mt-4 flex items-center gap-2 rounded-full border border-white/8 px-4 py-2">
                  <span className="text-2xl">{selectedRessenti.emoji}</span>
                  <span className="text-sm font-semibold">RPE {selectedRessenti.rpe}/10</span>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
