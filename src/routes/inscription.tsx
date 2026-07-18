import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { GlassCard } from "@/components/draveil/glass-card";
import { DhbMark } from "@/components/draveil/logo";
import {
  POSTES,
  JOURS_LONG,
  vmaFromPalier,
  getAllures,
  getNiveau,
} from "@/lib/draveil/core";
import { genCode } from "@/lib/draveil/postes";
import { sbGetJoueur, sbSaveJoueur, type Joueur } from "@/lib/supabase";
import { sendOneSignalNotif } from "@/lib/onesignal";

export const Route = createFileRoute("/inscription")({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: typeof search.edit === "string" ? search.edit : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Inscription — Draveil Handball" },
      {
        name: "description",
        content:
          "Crée ton compte joueur Draveil HB : profil, test physique, jours d'entraînement. Le coach valide ensuite ton accès.",
      },
    ],
  }),
  component: InscriptionPage,
});

type TestType = "palier" | "cooper" | "direct";
type MaterielOpt = "Élastiques" | "Salle de muscu" | "Aucun équipement";
const MATERIELS: MaterielOpt[] = ["Élastiques", "Salle de muscu", "Aucun équipement"];

interface OnbData {
  prenom: string;
  nom: string;
  poste: string;
  age: string;
  taille: string;
  poids: string;
  materiel: MaterielOpt[];
  testType: TestType;
  palier: string;
  cooper: string;
  vmaDirect: string;
  jours_seance: number[];
}

const initialData: OnbData = {
  prenom: "",
  nom: "",
  poste: "Ailier G",
  age: "",
  taille: "",
  poids: "",
  materiel: [],
  testType: "palier",
  palier: "",
  cooper: "",
  vmaDirect: "",
  jours_seance: [],
};

function cooperToVMA(dist: number): number {
  return Math.round((dist / 200) * 10) / 10;
}

function computeVma(d: OnbData): number {
  if (d.testType === "palier" && +d.palier) return vmaFromPalier(+d.palier);
  if (d.testType === "cooper" && +d.cooper) return cooperToVMA(+d.cooper);
  if (d.testType === "direct" && +d.vmaDirect >= 8) return +d.vmaDirect;
  return 0;
}

const STEPS = ["Profil", "Test physique", "Jours d'entraînement", "Récap"] as const;
const SUBS = [
  "Quelques infos pour ton programme personnalisé",
  "Pour calculer tes allures personnalisées",
  "Choisis tes jours de prépa (2 + 1 bonus)",
  "Ton profil et tes allures personnalisées",
];

function InscriptionPage() {
  const navigate = useNavigate();
  const { edit } = Route.useSearch();
  const [step, setStep] = useState(0);
  const [d, setD] = useState<OnbData>(initialData);
  const [loading, setLoading] = useState(false);
  const [editCode, setEditCode] = useState<string | null>(null);

  // Prefill from existing joueur when ?edit=CODE
  useEffect(() => {
    if (!edit) return;
    sbGetJoueur(edit).then((j) => {
      if (!j) return;
      setEditCode(j.code);
      const mat = (j.materiel ?? []).filter((m): m is MaterielOpt =>
        (MATERIELS as string[]).includes(m),
      );
      setD({
        prenom: j.prenom ?? "",
        nom: j.nom ?? "",
        poste: j.poste ?? "Ailier G",
        age: j.age != null ? String(j.age) : "",
        taille: (j as { taille?: number }).taille != null ? String((j as { taille?: number }).taille) : "",
        poids: (j as { poids?: number }).poids != null ? String((j as { poids?: number }).poids) : "",
        materiel: mat,
        testType: ((j as { testType?: TestType }).testType as TestType) ?? "direct",
        palier: "",
        cooper: "",
        vmaDirect: j.vma != null ? String(j.vma) : "",
        jours_seance: j.jours_seance ?? [],
      });
    });
  }, [edit]);

  const vma = useMemo(() => computeVma(d), [d]);

  function update<K extends keyof OnbData>(k: K, v: OnbData[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
  }
  function toggleMat(m: MaterielOpt) {
    setD((p) => ({
      ...p,
      materiel: p.materiel.includes(m)
        ? p.materiel.filter((x) => x !== m)
        : [...p.materiel, m],
    }));
  }
  function toggleJour(i: number) {
    setD((p) => ({
      ...p,
      jours_seance: p.jours_seance.includes(i)
        ? p.jours_seance.filter((x) => x !== i)
        : [...p.jours_seance, i].sort((a, b) => a - b),
    }));
  }

  function validate(): boolean {
    if (step === 0) {
      if (!d.prenom.trim()) return toast.error("Entre ton prénom"), false;
      if (!d.age) return toast.error("Entre ton âge"), false;
      return true;
    }
    if (step === 1) {
      if (!vma || vma < 8) return toast.error("Renseigne ton test ou ta VMA"), false;
      return true;
    }
    if (step === 2) {
      if (d.jours_seance.length < 2)
        return toast.error("Choisis au moins 2 jours"), false;
      return true;
    }
    return true;
  }

  async function finish() {
    setLoading(true);
    let code = editCode;
    let existing: Joueur | null = null;
    if (!code) {
      code = genCode(d.prenom, d.nom);
      for (let i = 0; i < 5 && (await sbGetJoueur(code)); i++) {
        code = genCode(d.prenom, d.nom);
      }
    } else {
      existing = await sbGetJoueur(code);
    }
    const materiel = d.materiel.length ? d.materiel : ["Aucun équipement"];
    const joueur: Joueur = {
      ...(existing ?? {}),
      code,
      prenom: d.prenom.trim(),
      nom: d.nom.trim(),
      poste: d.poste,
      age: +d.age || undefined,
      taille: +d.taille || undefined,
      poids: +d.poids || undefined,
      poidsInitial:
        (existing as { poidsInitial?: number } | null)?.poidsInitial ??
        (+d.poids || undefined),
      vma,
      vmaInitiale:
        (existing as { vmaInitiale?: number } | null)?.vmaInitiale ?? vma,
      testType: d.testType,
      materiel,
      jours_seance: d.jours_seance,
      statut_compte: editCode
        ? (existing?.statut_compte ?? "actif")
        : "attente",
      seances_validees: existing?.seances_validees ?? [],
      created_at:
        (existing as { created_at?: string } | null)?.created_at ??
        new Date().toISOString(),
    };
    try {
      await sbSaveJoueur(joueur);
      if (editCode) {
        toast.success("Profil mis à jour ✅");
        navigate({ to: "/joueur/profil" });
      } else {
        toast.success("Inscription envoyée !");
        // Notifier le coach qu'un nouveau joueur attend validation
        sendOneSignalNotif({
          title: "🆕 Nouvelle inscription",
          body: `${joueur.prenom} ${joueur.nom} attend ta validation.`,
          target: "coach",
        });
        navigate({ to: "/attente", search: { code } });
      }
    } catch {
      toast.error("Erreur, réessaie");
    } finally {
      setLoading(false);
    }
  }

  async function onNext() {
    if (!validate()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else await finish();
  }

  return (
    <main className="relative min-h-dvh overflow-hidden pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, color-mix(in oklab, var(--draveil) 25%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-md flex-col px-6 pt-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (step === 0 ? navigate({ to: "/" }) : setStep(step - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-muted-foreground hover:text-foreground"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <DhbMark size={36} />
          <div className="ml-auto text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Étape {step + 1} / {STEPS.length}
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 flex-1 rounded-full"
              animate={{
                backgroundColor:
                  i < step
                    ? "rgba(17,152,76,0.9)"
                    : i === step
                      ? "rgba(17,152,76,1)"
                      : "rgba(255,255,255,0.08)",
                boxShadow:
                  i === step ? "0 0 12px rgba(17,152,76,0.55)" : "none",
              }}
            />
          ))}
        </div>

        <motion.div
          key={"h-" + step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--draveil)]">
            {STEPS[step]}
          </div>
          <h1 className="mt-2 font-display text-3xl font-black leading-[1.05] tracking-tight text-gradient-brand">
            {STEPS[step]}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{SUBS[step]}</p>
        </motion.div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <StepProfil d={d} update={update} toggleMat={toggleMat} />
              )}
              {step === 1 && <StepVMA d={d} update={update} vma={vma} />}
              {step === 2 && <StepJours d={d} toggleJour={toggleJour} />}
              {step === 3 && <StepRecap d={d} vma={vma} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-6 pb-6 pt-4">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/90 to-transparent" />
        <button
          onClick={onNext}
          disabled={loading}
          className="relative flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-4 text-sm font-bold uppercase tracking-widest text-white shadow-brand transition active:scale-[0.99] disabled:opacity-60"
        >
          {step === STEPS.length - 1 ? (
            <>
              <Rocket className="h-4 w-4" />
              {loading ? "Envoi…" : "Commencer la prépa"}
            </>
          ) : (
            <>
              Continuer
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </main>
  );
}

// ─── UI atoms ────────────────────────────────────────────
const INPUT =
  "w-full rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-[color:var(--draveil)]/60 focus:bg-white/[0.06] transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-xl border px-3 py-2.5 text-sm font-medium transition " +
        (active
          ? "border-[color:var(--draveil)]/60 bg-[color:var(--draveil)]/[0.15] text-foreground shadow-brand"
          : "border-white/8 bg-white/[0.03] text-muted-foreground hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function InfoBox({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  const cls =
    tone === "warn"
      ? "border-amber-400/25 bg-amber-400/[0.08] text-amber-100"
      : "border-[color:var(--draveil)]/25 bg-[color:var(--draveil)]/[0.06] text-foreground/85";
  return (
    <div className={`rounded-2xl border ${cls} px-4 py-3 text-xs leading-relaxed`}>
      {children}
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────
function StepProfil({
  d,
  update,
  toggleMat,
}: {
  d: OnbData;
  update: <K extends keyof OnbData>(k: K, v: OnbData[K]) => void;
  toggleMat: (m: MaterielOpt) => void;
}) {
  return (
    <GlassCard className="space-y-5 p-6">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom">
          <input
            className={INPUT}
            value={d.prenom}
            onChange={(e) => update("prenom", e.target.value)}
            placeholder="Thomas"
          />
        </Field>
        <Field label="Nom">
          <input
            className={INPUT}
            value={d.nom}
            onChange={(e) => update("nom", e.target.value)}
            placeholder="Dupont"
          />
        </Field>
      </div>
      <Field label="Poste">
        <div className="grid grid-cols-2 gap-2">
          {POSTES.map((p) => (
            <Chip key={p} active={d.poste === p} onClick={() => update("poste", p)}>
              {p}
            </Chip>
          ))}
        </div>
      </Field>
      <Field label="Âge">
        <input
          className={INPUT}
          type="number"
          value={d.age}
          onChange={(e) => update("age", e.target.value)}
          placeholder="24"
          min={15}
          max={45}
          inputMode="numeric"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Taille (cm)">
          <input
            className={INPUT}
            type="number"
            value={d.taille}
            onChange={(e) => update("taille", e.target.value)}
            placeholder="178"
            inputMode="numeric"
          />
        </Field>
        <Field label="Poids (kg)">
          <input
            className={INPUT}
            type="number"
            value={d.poids}
            onChange={(e) => update("poids", e.target.value)}
            placeholder="75"
            inputMode="numeric"
          />
        </Field>
      </div>
      <Field label="Matériel disponible">
        <div className="grid grid-cols-3 gap-2">
          {MATERIELS.map((m) => (
            <Chip key={m} active={d.materiel.includes(m)} onClick={() => toggleMat(m)}>
              {m}
            </Chip>
          ))}
        </div>
      </Field>
    </GlassCard>
  );
}

function StepVMA({
  d,
  update,
  vma,
}: {
  d: OnbData;
  update: <K extends keyof OnbData>(k: K, v: OnbData[K]) => void;
  vma: number;
}) {
  return (
    <GlassCard className="space-y-4 p-6">
      <InfoBox>
        🏃 Renseigne ton test pour obtenir des allures précises. Trois options selon
        ce que tu as fait.
      </InfoBox>
      <Field label="Quel test as-tu fait ?">
        <div className="grid grid-cols-3 gap-2">
          <Chip active={d.testType === "palier"} onClick={() => update("testType", "palier")}>
            <div>Luc Léger</div>
            <div className="mt-0.5 text-[9px] font-normal opacity-70">
              navette 20m
            </div>
          </Chip>
          <Chip active={d.testType === "cooper"} onClick={() => update("testType", "cooper")}>
            <div>Cooper</div>
            <div className="mt-0.5 text-[9px] font-normal opacity-70">12 min</div>
          </Chip>
          <Chip active={d.testType === "direct"} onClick={() => update("testType", "direct")}>
            <div>Je connais</div>
            <div className="mt-0.5 text-[9px] font-normal opacity-70">ma VMA</div>
          </Chip>
        </div>
      </Field>

      {d.testType === "palier" && (
        <Field label="Palier Luc Léger atteint">
          <input
            className={INPUT + " text-center font-display text-2xl font-black"}
            type="number"
            step={0.5}
            min={1}
            max={20}
            value={d.palier}
            onChange={(e) => update("palier", e.target.value)}
            placeholder="10"
          />
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Test navette 20m avec paliers sonores. Entre le dernier palier complété.
          </p>
        </Field>
      )}
      {d.testType === "cooper" && (
        <Field label="Distance parcourue (m) en 12 min">
          <input
            className={INPUT + " text-center font-display text-2xl font-black"}
            type="number"
            value={d.cooper}
            onChange={(e) => update("cooper", e.target.value)}
            placeholder="2600"
          />
        </Field>
      )}
      {d.testType === "direct" && (
        <Field label="Ta VMA (km/h)">
          <input
            className={INPUT + " text-center font-display text-2xl font-black"}
            type="number"
            step={0.5}
            value={d.vmaDirect}
            onChange={(e) => update("vmaDirect", e.target.value)}
            placeholder="14"
          />
        </Field>
      )}

      {vma > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-[color:var(--draveil)]/40 bg-[color:var(--draveil)]/[0.10] px-4 py-4 text-center"
        >
          <div className="font-display text-4xl font-black text-gradient-brand">
            {vma} <span className="text-lg text-muted-foreground">km/h</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{getNiveau(vma)}</div>
        </motion.div>
      )}

      <InfoBox tone="warn">
        Pas encore fait de test ? Choisis « Je connais ma VMA » et estime :
        11-12 tranquille · 13-14 correct · 15+ en forme.
      </InfoBox>
    </GlassCard>
  );
}

function StepJours({
  d,
  toggleJour,
}: {
  d: OnbData;
  toggleJour: (i: number) => void;
}) {
  return (
    <GlassCard className="space-y-4 p-6">
      <InfoBox>
        📌 La prépa Draveil, c'est <b>2 séances obligatoires</b> (mardi & jeudi) +
        1 séance <b>bonus facultative</b> (récup active).
      </InfoBox>
      <Field label="Tes jours de séance (2 minimum)">
        <div className="grid grid-cols-2 gap-2">
          {JOURS_LONG.map((j: string, i: number) => (
            <Chip
              key={j}
              active={d.jours_seance.includes(i)}
              onClick={() => toggleJour(i)}
            >
              {j}
            </Chip>
          ))}
        </div>
      </Field>
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-xs leading-relaxed text-muted-foreground">
        <b className="text-foreground">Les séances :</b>
        <div className="mt-2 space-y-1">
          <div>📍 Jour 1 (mardi) → Cardio + Prévention</div>
          <div>📍 Jour 2 (jeudi) → Renforcement + Prévention</div>
          <div>📍 Jour 3 (bonus) → Récupération active</div>
        </div>
      </div>
    </GlassCard>
  );
}

function StepRecap({ d, vma }: { d: OnbData; vma: number }) {
  const allures = getAllures(vma || 13);
  return (
    <div className="space-y-4">
      <GlassCard className="p-6 text-center">
        <div className="font-display text-3xl font-black uppercase tracking-tight text-gradient-brand">
          {d.prenom} {(d.nom || "").toUpperCase()}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          {d.poste} · {d.age} ans
        </div>
        <div className="mt-4 inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold text-amber-200">
          ⏳ En attente de validation coach
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Tes allures personnalisées · VMA {vma} km/h
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {Object.entries(allures).map(([label, val]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"
            >
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {label}
              </span>
              <span className="font-display font-bold text-foreground">
                {String(val)}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6 text-center">
        <div className="text-xs text-muted-foreground">Niveau</div>
        <div className="mt-1 font-display text-2xl font-black text-gradient-brand">
          {getNiveau(vma || 13)}
        </div>
      </GlassCard>
    </div>
  );
}