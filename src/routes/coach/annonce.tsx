import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/draveil/glass-card";
import { sbGetMeta, sbSaveMeta } from "@/lib/supabase";

export const Route = createFileRoute("/coach/annonce")({
  component: AnnoncePage,
});

type Annonce = { text: string; date: string } | null;

function AnnoncePage() {
  const [annonce, setAnnonce] = useState<Annonce>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    sbGetMeta<Annonce>("annonce", null).then(setAnnonce);
  }, []);

  async function publish() {
    if (!text.trim()) return;
    const a = { text: text.trim(), date: new Date().toISOString() };
    await sbSaveMeta("annonce", a);
    setAnnonce(a);
    setText("");
    toast.success("Annonce publiée 📢");
  }
  async function del() {
    await sbSaveMeta("annonce", null);
    setAnnonce(null);
    toast("Annonce supprimée");
  }

  return (
    <div className="px-5 py-8">
      <h1 className="mb-6 font-display text-2xl font-black tracking-tight">📢 Annonce équipe</h1>
      {annonce ? (
        <GlassCard className="mb-4 p-5">
          <p className="whitespace-pre-wrap text-sm">{annonce.text}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">{new Date(annonce.date).toLocaleString("fr-FR")}</span>
            <button onClick={del} className="rounded-full border border-red-500/30 bg-red-500/[0.06] px-3 py-1 text-xs font-bold text-red-400">Supprimer</button>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="mb-4 p-8 text-center text-sm text-muted-foreground">Aucune annonce</GlassCard>
      )}
      <GlassCard className="p-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Ton message pour l'équipe…" className="w-full resize-none rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-2.5 text-sm focus:border-[color:var(--draveil)] focus:outline-none" />
        <button onClick={publish} disabled={!text.trim()} className="mt-3 w-full rounded-2xl gradient-brand py-3 text-sm font-bold text-white shadow-brand disabled:opacity-40">Publier</button>
      </GlassCard>
    </div>
  );
}