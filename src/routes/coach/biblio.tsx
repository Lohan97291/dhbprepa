import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { GlassCard } from "@/components/draveil/glass-card";
import { ATELIERS } from "@/lib/draveil/core";

export const Route = createFileRoute("/coach/biblio")({ component: BiblioPage });

function BiblioPage() {
  const cats = Object.keys(ATELIERS);
  const [cat, setCat] = useState<string>(cats[0]);
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const list = (ATELIERS as Record<string, Array<{ titre: string; detail?: string; note?: string }>>)[cat] ?? [];
    const ql = q.trim().toLowerCase();
    return ql ? list.filter((x) => x.titre.toLowerCase().includes(ql) || (x.detail ?? "").toLowerCase().includes(ql)) : list;
  }, [cat, q]);
  return (
    <div className="px-5 py-8">
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Christophe Guégan · FFHandball · CMN</div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight">📚 Bibliothèque PPP</h1>
      </div>
      <div className="glass mb-3 flex items-center gap-2 rounded-full px-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className="w-full bg-transparent py-2.5 text-sm focus:outline-none" />
      </div>
      <div className="scroll-slim mb-4 flex gap-2 overflow-x-auto pb-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${cat === c ? "gradient-brand text-white shadow-brand" : "border border-white/10 bg-white/[0.03] text-muted-foreground"}`}>{c.replace(/_/g, " ")}</button>
        ))}
      </div>
      <div className="space-y-2">{items.map((x, i) => (
        <GlassCard key={i} className="p-4">
          <div className="font-semibold">{x.titre}</div>
          {x.detail && <div className="mt-1 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: x.detail }} />}
          {x.note && <div className="mt-1 text-xs italic text-muted-foreground">{x.note}</div>}
        </GlassCard>
      ))}</div>
    </div>
  );
}