import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/draveil/glass-card";
import { sbGetMeta, sbSaveMeta } from "@/lib/supabase";

export const Route = createFileRoute("/coach/seances")({ component: SeancesPage });

interface Seance { id: string; nom: string; type: string; duree: number; blocs: { titre: string; detail?: string }[]; }

function SeancesPage() {
  const [list, setList] = useState<Seance[]>([]);
  const [editing, setEditing] = useState<Seance | null>(null);
  useEffect(() => { sbGetMeta<Seance[]>("custom_seances", []).then(setList); }, []);
  async function save(s: Seance) {
    const next = list.filter((x) => x.id !== s.id).concat(s);
    setList(next); await sbSaveMeta("custom_seances", next); setEditing(null); toast.success("Séance enregistrée");
  }
  async function del(id: string) {
    const next = list.filter((x) => x.id !== id);
    setList(next); await sbSaveMeta("custom_seances", next);
  }
  return (
    <div className="px-5 py-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-display text-2xl font-black tracking-tight">🏗️ Séances custom</h1>
        <button onClick={() => setEditing({ id: crypto.randomUUID(), nom: "", type: "collective", duree: 60, blocs: [] })} className="flex items-center gap-1 rounded-full gradient-brand px-4 py-2 text-xs font-bold text-white shadow-brand"><Plus className="h-3.5 w-3.5" />Nouvelle</button>
      </div>
      {list.length === 0 ? (
        <GlassCard className="p-8 text-center text-sm text-muted-foreground">Aucune séance</GlassCard>
      ) : (
        <div className="space-y-2">{list.map((s) => (
          <GlassCard key={s.id} className="flex items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <div className="font-display text-base font-black">{s.nom}</div>
              <div className="text-[11px] text-muted-foreground">{s.blocs.length} exos · {s.duree} min · {s.type}</div>
            </div>
            <button onClick={() => setEditing(s)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs">✏️</button>
            <button onClick={() => del(s.id)} className="rounded-full border border-red-500/30 bg-red-500/[0.06] p-2 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
          </GlassCard>
        ))}</div>
      )}
      {editing && <Editor s={editing} onCancel={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function Editor({ s, onCancel, onSave }: { s: Seance; onCancel: () => void; onSave: (s: Seance) => void }) {
  const [e, setE] = useState<Seance>(s);
  const [bt, setBt] = useState(""); const [bd, setBd] = useState("");
  function addBloc() { if (!bt.trim()) return; setE({ ...e, blocs: [...e.blocs, { titre: bt.trim(), detail: bd.trim() }] }); setBt(""); setBd(""); }
  function rmBloc(i: number) { setE({ ...e, blocs: e.blocs.filter((_, k) => k !== i) }); }
  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[92dvh] max-w-md space-y-3 overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[color:var(--background)]/98 p-6 backdrop-blur-2xl">
        <h3 className="font-display text-lg font-black">Constructeur</h3>
        <input placeholder="Nom" value={e.nom} onChange={(x) => setE({ ...e, nom: x.target.value })} className="w-full rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3" />
        <div className="flex gap-2">
          <select value={e.type} onChange={(x) => setE({ ...e, type: x.target.value })} className="flex-1 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-3">
            {["collective", "force", "vitesse", "plio", "echauffement", "retour"].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" value={e.duree} onChange={(x) => setE({ ...e, duree: Number(x.target.value) })} className="w-24 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-3 text-center" />
        </div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Blocs ({e.blocs.length})</div>
        {e.blocs.map((b, i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm">
            <div className="min-w-0 flex-1"><div className="font-semibold">{b.titre}</div>{b.detail && <div className="text-xs text-muted-foreground">{b.detail}</div>}</div>
            <button onClick={() => rmBloc(i)} className="text-red-400">✕</button>
          </div>
        ))}
        <div className="flex gap-2">
          <input placeholder="Titre" value={bt} onChange={(x) => setBt(x.target.value)} className="flex-1 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-sm" />
          <input placeholder="Détail" value={bd} onChange={(x) => setBd(x.target.value)} className="flex-1 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-sm" />
          <button onClick={addBloc} className="rounded-xl gradient-brand px-3 text-white">+</button>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={onCancel} className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-sm">Annuler</button>
          <button onClick={() => e.nom.trim() && onSave(e)} className="flex-[2] rounded-2xl gradient-brand py-3 text-sm font-bold text-white shadow-brand">Sauvegarder</button>
        </div>
      </div>
    </>
  );
}