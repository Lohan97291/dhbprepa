import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Check, Search, Trash2, UserCheck, UserX, X } from "lucide-react";

import { GlassCard } from "@/components/draveil/glass-card";
import {
  sbDeleteJoueur,
  sbListJoueurs,
  sbSaveJoueur,
  type Joueur,
} from "@/lib/supabase";
import { sendPushNotification } from "@/lib/push";
import {
  formatDate,
  getGroupe,
  getNiveau,
  vmaFromPalier,
} from "@/lib/draveil/core";
import { toast } from "sonner";

export const Route = createFileRoute("/coach/joueurs")({
  component: JoueursPage,
});

function JoueursPage() {
  const [joueurs, setJoueurs] = useState<Joueur[] | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "attente" | "actif">("all");
  const [open, setOpen] = useState<Joueur | null>(null);

  useEffect(() => {
    sbListJoueurs().then(setJoueurs);
  }, []);

  const filtered = useMemo(() => {
    if (!joueurs) return [];
    const ql = q.trim().toLowerCase();
    return joueurs
      .filter((j) => {
        if (filter === "attente" && j.statut_compte !== "attente") return false;
        if (filter === "actif" && j.statut_compte === "attente") return false;
        if (!ql) return true;
        return `${j.prenom} ${j.nom} ${j.code} ${j.poste}`
          .toLowerCase()
          .includes(ql);
      })
      .sort((a, b) =>
        (a.prenom ?? "").localeCompare(b.prenom ?? "", "fr"),
      );
  }, [joueurs, q, filter]);

  async function refresh() {
    setJoueurs(await sbListJoueurs());
  }

  return (
    <div className="px-5 py-8">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex items-end justify-between"
      >
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Effectif
          </div>
          <h1 className="mt-1 font-display text-2xl font-black tracking-tight">
            Joueurs
          </h1>
        </div>
        <div className="text-xs text-muted-foreground">
          {filtered.length} joueur{filtered.length > 1 ? "s" : ""}
        </div>
      </motion.header>

      <div className="mb-4 flex gap-2">
        <div className="glass flex flex-1 items-center gap-2 rounded-full px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher…"
            className="w-full bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <div className="glass flex rounded-full p-1">
          {(
            [
              { k: "all", label: "Tous" },
              { k: "attente", label: "Attente" },
              { k: "actif", label: "Actifs" },
            ] as const
          ).map((t) => (
            <button
              key={t.k}
              onClick={() => setFilter(t.k)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                filter === t.k
                  ? "gradient-brand text-white shadow-brand"
                  : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {joueurs === null ? (
        <GlassCard className="p-10 text-center text-sm text-muted-foreground">
          Chargement…
        </GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-10 text-center text-sm text-muted-foreground">
          Aucun joueur.
        </GlassCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((j) => (
            <button
              key={j.code}
              onClick={() => setOpen(j)}
              className="text-left transition hover:brightness-110"
            >
              <GlassCard className="flex items-center gap-3 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-brand text-sm font-black text-white shadow-brand">
                  {(j.prenom?.[0] ?? "") + (j.nom?.[0] ?? "")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-foreground">
                    {j.prenom} {j.nom}
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {j.poste ?? "—"} · VMA {j.vma ?? "—"}
                  </div>
                </div>
                {j.statut_compte === "attente" ? (
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                    Attente
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {j.vma ? getGroupe(j.vma) : ""}
                  </span>
                )}
              </GlassCard>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <JoueurDrawer
            joueur={open}
            onClose={() => setOpen(null)}
            onSaved={async () => {
              await refresh();
              setOpen(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function JoueurDrawer({
  joueur,
  onClose,
  onSaved,
}: {
  joueur: Joueur;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [vma, setVma] = useState<number>(joueur.vma ?? 13);
  const [palier, setPalier] = useState<number>(0);
  const [statut, setStatut] = useState<Joueur["statut_compte"]>(
    joueur.statut_compte ?? "actif",
  );
  const [statutPhys, setStatutPhys] = useState<NonNullable<Joueur["statut"]>>(
    joueur.statut ?? "actif",
  );
  const [note, setNote] = useState<string>(joueur.note_coach ?? "");
  const [message, setMessage] = useState<string>(joueur.message_coach ?? "");
  const [manWeek, setManWeek] = useState(0);
  const [manSess, setManSess] = useState(0);
  const [manRpe, setManRpe] = useState(5);
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const validated = (joueur.seances_validees ?? []).filter((s) => !s.missed);
  const missed = (joueur.seances_validees ?? []).filter((s) => s.missed);
  const avgRpe = validated.length
    ? validated.reduce((a, s) => a + (s.rpe ?? 0), 0) / validated.length
    : 0;

  async function save() {
    setSaving(true);
    await sbSaveJoueur({
      ...joueur,
      vma,
      statut_compte: statut,
      statut: statutPhys,
      note_coach: note || null,
      message_coach: message || null,
    });
    setSaving(false);
    toast.success("Fiche enregistrée");
    onSaved();
  }

  async function del() {
    setSaving(true);
    await sbDeleteJoueur(joueur.code);
    setSaving(false);
    toast.success(`${joueur.prenom ?? "Joueur"} supprimé`);
    onSaved();
  }

  async function validateManual() {
    setSaving(true);
    const list = joueur.seances_validees ?? [];
    const entry = {
      date: new Date().toISOString().split("T")[0],
      weekIdx: manWeek,
      sessionIdx: manSess,
      rpe: manRpe,
      missed: false,
      ts: Date.now(),
      byCoach: true,
    };
    await sbSaveJoueur({
      ...joueur,
      seances_validees: [
        ...list.filter(
          (s) => !(s.weekIdx === manWeek && s.sessionIdx === manSess),
        ),
        entry,
      ],
    });
    setSaving(false);
    toast.success("Séance validée par le coach ✅");
    onSaved();
  }

  function applyPalier() {
    if (!palier) return;
    setVma(vmaFromPalier(palier));
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 300 }}
        className="fixed right-0 top-0 z-50 h-dvh w-full max-w-md overflow-y-auto border-l border-white/10 bg-[color:var(--background)]/98 backdrop-blur-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[color:var(--background)]/90 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-brand text-sm font-black text-white shadow-brand">
              {(joueur.prenom?.[0] ?? "") + (joueur.nom?.[0] ?? "")}
            </div>
            <div>
              <div className="font-display text-lg font-black leading-tight">
                {joueur.prenom} {joueur.nom}
              </div>
              <div className="text-xs text-muted-foreground">
                {joueur.poste} · Code {joueur.code}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {/* Statut */}
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Statut du compte
            </div>
            <div className="glass flex rounded-full p-1">
              {(
                [
                  { k: "actif", label: "Actif", icon: UserCheck },
                  { k: "attente", label: "Attente", icon: UserX },
                  { k: "inactif", label: "Inactif", icon: UserX },
                ] as const
              ).map((t) => (
                <button
                  key={t.k}
                  onClick={() => setStatut(t.k)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition ${
                    statut === t.k
                      ? "gradient-brand text-white shadow-brand"
                      : "text-muted-foreground"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* VMA */}
          <GlassCard className="p-5">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              VMA
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                value={vma}
                onChange={(e) => setVma(Number(e.target.value))}
                className="w-24 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-center font-display text-lg font-black text-foreground focus:border-[color:var(--draveil)] focus:outline-none"
              />
              <span className="text-sm text-muted-foreground">km/h</span>
              <span className="ml-auto rounded-full bg-white/[0.05] px-3 py-1 text-xs font-bold">
                {getNiveau(vma)}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                value={palier || ""}
                onChange={(e) => setPalier(Number(e.target.value))}
                placeholder="Palier Luc Léger"
                className="flex-1 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[color:var(--draveil)] focus:outline-none"
              />
              <button
                onClick={applyPalier}
                className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs font-bold text-foreground transition hover:border-[color:var(--draveil)]"
              >
                Convertir
              </button>
            </div>
          </GlassCard>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <MiniStat label="Validées" value={validated.length} />
            <MiniStat label="Manquées" value={missed.length} />
            <MiniStat
              label="RPE moy."
              value={avgRpe ? avgRpe.toFixed(1) : "—"}
            />
          </div>

          {/* Historique */}
          {(joueur.seances_validees ?? []).length > 0 && (
            <div>
              <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Historique
              </div>
              <GlassCard className="divide-y divide-white/5 p-0">
                {(joueur.seances_validees ?? [])
                  .slice()
                  .sort((a, b) => b.ts - a.ts)
                  .slice(0, 10)
                  .map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <span>{formatDate(s.date)}</span>
                      {s.missed ? (
                        <span className="text-xs font-semibold text-red-400">
                          Manquée
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs font-bold">
                          RPE {s.rpe}
                          {s.byCoach ? " · 👑" : ""}
                        </span>
                      )}
                    </div>
                  ))}
              </GlassCard>
            </div>
          )}

          {/* Statut physique */}
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Statut physique
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { k: "actif", label: "Actif", emoji: "✅" },
                  { k: "blesse", label: "Blessé", emoji: "🤕" },
                  { k: "vacances", label: "Vacances", emoji: "🏖️" },
                  { k: "suspendu", label: "Suspendu", emoji: "⛔" },
                ] as const
              ).map((o) => {
                const active = statutPhys === o.k;
                return (
                  <button
                    key={o.k}
                    onClick={() => setStatutPhys(o.k)}
                    className={`rounded-2xl border py-3 text-center transition ${
                      active
                        ? "border-[color:var(--draveil)]/60 bg-[color:var(--draveil)]/[0.14]"
                        : "border-white/8 bg-white/[0.03]"
                    }`}
                  >
                    <div className="text-lg">{o.emoji}</div>
                    <div className="mt-0.5 text-[10px] font-semibold">
                      {o.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note privée coach */}
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              📝 Note privée (coach uniquement)
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Observations, blessures, remarques…"
              className="w-full resize-none rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[color:var(--draveil)] focus:outline-none"
            />
          </div>

          {/* Message coach → joueur */}
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              💬 Message pour le joueur (visible côté joueur)
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="Bien joué cette semaine !"
              className="w-full resize-none rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[color:var(--draveil)] focus:outline-none"
            />
          </div>

          {/* Validation manuelle */}
          <GlassCard className="p-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              ✅ Valider une séance manuellement
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={manWeek}
                onChange={(e) => setManWeek(Number(e.target.value))}
                className="rounded-xl border border-white/8 bg-white/[0.04] px-2 py-2 text-sm text-foreground"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <option key={i} value={i}>
                    S{i + 1}
                  </option>
                ))}
              </select>
              <select
                value={manSess}
                onChange={(e) => setManSess(Number(e.target.value))}
                className="rounded-xl border border-white/8 bg-white/[0.04] px-2 py-2 text-sm text-foreground"
              >
                {[0, 1, 2].map((i) => (
                  <option key={i} value={i}>
                    Séance {i + 1}
                  </option>
                ))}
              </select>
              <select
                value={manRpe}
                onChange={(e) => setManRpe(Number(e.target.value))}
                className="rounded-xl border border-white/8 bg-white/[0.04] px-2 py-2 text-sm text-foreground"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    RPE {n}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={validateManual}
              disabled={saving}
              className="mt-3 w-full rounded-xl border border-[color:var(--draveil)]/40 bg-[color:var(--draveil)]/[0.08] py-2.5 text-xs font-bold text-foreground disabled:opacity-40"
            >
              Valider cette séance
            </button>
          </GlassCard>

          <button
            onClick={save}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-3.5 text-sm font-bold text-white shadow-brand transition hover:brightness-110 disabled:opacity-40"
          >
            {saving ? (
              "Enregistrement…"
            ) : (
              <>
                <Check className="h-4 w-4" />
                Enregistrer
              </>
            )}
          </button>

          {!confirmDel ? (
            <button
              onClick={() => setConfirmDel(true)}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/[0.06] py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/[0.12] disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer ce joueur
            </button>
          ) : (
            <GlassCard className="space-y-3 border-red-500/30 p-4">
              <div className="text-sm font-bold text-red-400">
                Supprimer {joueur.prenom} {joueur.nom} ?
              </div>
              <div className="text-xs text-muted-foreground">
                Cette action est définitive. Toutes les données du joueur
                (VMA, séances validées, historique) seront perdues.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDel(false)}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs font-bold text-foreground"
                >
                  Annuler
                </button>
                <button
                  onClick={del}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white transition hover:bg-red-600 disabled:opacity-40"
                >
                  {saving ? "Suppression…" : "Confirmer"}
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      </motion.div>
    </>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <GlassCard className="p-3 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-black tracking-tight">
        {value}
      </div>
    </GlassCard>
  );
}
