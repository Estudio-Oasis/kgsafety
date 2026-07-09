import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { usePortalSession } from "@/hooks/use-portal-session";
import { DOCUMENTS, PLANTS, labelDoc, fmtDate, plantBySlug, type DocType } from "@/data/portal";
import { PageHeader, Panel, ActionBtn } from "@/components/portal/PortalUI";
import { Download, ExternalLink, Copy, Filter } from "lucide-react";

export const Route = createFileRoute("/portal/constancias")({
  component: ConstanciasPage,
});

const RELEVANT: DocType[] = ["certificado", "ficha-tecnica", "acta", "reporte", "bitacora", "evidencia"];

function ConstanciasPage() {
  const { session } = usePortalSession();
  const [filter, setFilter] = useState<DocType | "todos">("todos");

  const docs = useMemo(() => {
    if (!session) return [];
    let base = DOCUMENTS.filter((d) => RELEVANT.includes(d.type));
    if (session.role === "cliente-corp" && session.clientSlug) {
      const slugs = PLANTS.filter((p) => p.clientSlug === session.clientSlug).map((p) => p.slug);
      base = base.filter((d) => slugs.includes(d.plantSlug));
    } else if (session.role === "cliente-planta" && session.plantSlug) {
      base = base.filter((d) => d.plantSlug === session.plantSlug);
    }
    if (filter !== "todos") base = base.filter((d) => d.type === filter);
    return base.sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [session, filter]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Documentación auditable"
        title="Constancias y fichas técnicas"
        subtitle="Certificados, fichas técnicas, actas de entrega, bitácoras y evidencia fotográfica."
      />

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter size={14} className="text-[color:var(--muted-fg)]" />
        <span className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">Filtrar:</span>
        {(["todos", ...RELEVANT] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t as DocType | "todos")}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
              filter === t
                ? "border-signal bg-brand-blue/10 text-brand-blue"
                : "border-[color:var(--border)] text-[color:var(--muted-fg)] hover:border-brand-blue"
            }`}
          >
            {t === "todos" ? "Todos" : labelDoc(t as DocType)}
          </button>
        ))}
      </div>

      <Panel title={`${docs.length} documento(s)`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
              <tr>
                <th className="text-left px-4 py-2 font-bold">Documento</th>
                <th className="text-left px-4 py-2 font-bold">Tipo</th>
                <th className="text-left px-4 py-2 font-bold">Planta</th>
                <th className="text-left px-4 py-2 font-bold">Fecha</th>
                <th className="text-left px-4 py-2 font-bold">Tamaño</th>
                <th className="text-right px-4 py-2 font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {docs.map((d) => (
                <tr key={d.id} className="hover:bg-[color:var(--muted)]/20">
                  <td className="px-4 py-2.5 font-bold">{d.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{labelDoc(d.type)}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{plantBySlug(d.plantSlug)?.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(d.fecha)}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{d.size}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex gap-1.5">
                      <ActionBtn><ExternalLink size={11} /> Ver</ActionBtn>
                      <ActionBtn><Download size={11} /> PDF</ActionBtn>
                      <ActionBtn><Copy size={11} /> Enlace</ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
              {docs.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-xs text-[color:var(--muted-fg)]">Sin documentos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
