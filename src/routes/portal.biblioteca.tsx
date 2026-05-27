import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Eye, Copy, Search } from "lucide-react";
import { LIBRARY, LIB_CATEGORIES_LIST, fmtDate } from "@/data/portal";
import { PageHeader, Panel, ActionBtn, simAction } from "@/components/portal/PortalUI";
import { usePortalSession } from "@/hooks/use-portal-session";

export const Route = createFileRoute("/portal/biblioteca")({
  component: BibliotecaPage,
});

function BibliotecaPage() {
  const { session } = usePortalSession();
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");

  if (session && session.role !== "admin-kg" && session.role !== "equipo-kg") {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-xs uppercase tracking-widest text-red-500 mb-2">Acceso restringido</p>
        <h1 className="font-display text-2xl uppercase">Biblioteca interna KG Safety</h1>
        <p className="mt-3 text-sm text-[color:var(--muted-fg)]">Esta sección está reservada al equipo y administración de KG Safety.</p>
      </div>
    );
  }

  const visible = LIBRARY.filter((d) => {
    if (cat && d.category !== cat) return false;
    if (q && !d.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader eyebrow="Uso interno KG Safety" title="Biblioteca KG" subtitle="Presentaciones, fichas, formatos, manuales y normas para uso del equipo técnico, operativo y comercial." />

      <Panel title="Filtros">
        <div className="grid sm:grid-cols-2 gap-3 p-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-fg)]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar documento…" className="w-full border border-[color:var(--border)] bg-[color:var(--surface)] pl-9 pr-3 py-2 text-sm outline-none focus:border-brand-blue" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none">
            <option value="">Todas las categorías</option>
            {LIB_CATEGORIES_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </Panel>

      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        {LIB_CATEGORIES_LIST.filter((c) => !cat || c === cat).map((c) => {
          const items = visible.filter((d) => d.category === c);
          if (items.length === 0) return null;
          return (
            <Panel key={c} title={`${c} · ${items.length}`}>
              <ul className="divide-y divide-[color:var(--border)]">
                {items.map((d) => (
                  <li key={d.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{d.name}</p>
                      <p className="text-[11px] text-[color:var(--muted-fg)]">{fmtDate(d.fecha)} · {d.size}</p>
                    </div>
                    <div className="inline-flex gap-1.5 shrink-0">
                      <ActionBtn onClick={() => simAction("Vista previa simulada")}><Eye size={11} /></ActionBtn>
                      <ActionBtn><Download size={11} /></ActionBtn>
                      <ActionBtn onClick={() => simAction("Enlace interno copiado")}><Copy size={11} /></ActionBtn>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
