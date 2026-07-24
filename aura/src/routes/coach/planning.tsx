import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/draveil/glass-card";
import { sbGetMeta, sbSaveMeta } from "@/lib/supabase";
import { formatDate } from "@/lib/draveil/core";

export const Route = createFileRoute("/coach/planning")({ component: PlanningPage });

interface Evt { id: string; date: string; titre: string; type: string; lieu?: string; objectif?: string; }

function PlanningPage() {
  const [events, setEvents] = useState<Evt[]>([]);
  const [editing, setEditing] = useState<Evt | null>(null);
  useEffect(() => { sbGetMeta<Evt[]>("planning_collectif", []).then(setEvents); }, []);
  async function save(e: Evt) {
    const list = events.filter((x) => x.id !== e.id).concat(e).sort((a, b) => a.date.localeCompare(b.date));
    setEvents(list); await sbSaveMeta("planning_collectif", list); toast.success("Enregistré"); setEditing(null);
  }
  async function del(id: string) {
    const list = events.filter((x) => x.id !== id);
    setEvents(list); await sbSaveMeta("planning_collectif", list); setEditing(null);
  }
  return (
    <div className="px-5 py-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-display text-2xl font-black tracking-tight">📅 Planning</h1>
        <button onClick={() => setEditing({ id: crypto.randomUUID(), date: new Date().toISOString().split("T")[0], titre: "", type: "collective" })} className="flex items-center gap-1 rounded-full gradient-brand px-4 py-2 text-xs font-bold text-white shadow-brand"><Plus className="h-3.5 w-3.5" />Ajouter</button>
      </div>
      {events.length === 0 ? (
        <GlassCard className="p-8 text-center text-sm text-muted-foreground">Aucun événement</GlassCard>
      ) : (
        <div className="space-y-2">{events.map((e) => (
          <GlassCard key={e.id} className="flex items-center justify-between p-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{formatDate(e.date)} · {e.type}</div>
              <div className="mt-1 font-display text-base font-black">{e.titre}</div>
              {(e.lieu || e.objectif) && <div className="mt-1 text-xs text-muted-foreground">{e.lieu ?? ""} {e.objectif ? "· " + e.objectif : ""}</div>}
            </div>
            <button onClick={() => setEditing(e)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs">✏️</button>
          </GlassCard>
        ))}</div>
      )}
      {editing && <Editor evt={editing} onCancel={() => setEditing(null)} onSave={save} onDelete={() => del(editing.id)} />}
    </div>
  );
}

function Editor({ evt, onCancel, onSave, onDelete }: { evt: Evt; onCancel: () => void; onSave: (e: Evt) => void; onDelete: () => void }) {
  const [e, setE] = useState<Evt>(evt);
  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md space-y-3 rounded-t-3xl border-t border-white/10 bg-[color:var(--background)]/98 p-6 backdrop-blur-2xl">
        <h3 className="font-display text-lg font-black">Événement</h3>
        <input type="date" value={e.date} onChange={(x) => setE({ ...e, date: x.target.value })} className="w-full rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3" />
        <input placeholder="Titre" value={e.titre} onChange={(x) => setE({ ...e, titre: x.target.value })} className="w-full rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3" />
        <select value={e.type} onChange={(x) => setE({ ...e, type: x.target.value })} className="w-full rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
          {["collective", "exterieur", "match", "stage", "cohesion", "repos"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input placeholder="Lieu" value={e.lieu ?? ""} onChange={(x) => setE({ ...e, lieu: x.target.value })} className="w-full rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3" />
        <input placeholder="Objectif" value={e.objectif ?? ""} onChange={(x) => setE({ ...e, objectif: x.target.value })} className="w-full rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3" />
        <div className="flex gap-2">
          <button onClick={onDelete} className="rounded-2xl border border-red-500/30 bg-red-500/[0.06] px-4 text-red-400"><Trash2 className="h-4 w-4" /></button>
          <button onClick={onCancel} className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-sm">Annuler</button>
          <button onClick={() => e.titre.trim() && onSave(e)} className="flex-[2] rounded-2xl gradient-brand py-3 text-sm font-bold text-white shadow-brand">Sauvegarder</button>
        </div>
      </div>
    </>
  );
}