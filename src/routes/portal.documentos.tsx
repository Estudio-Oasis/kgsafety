import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Eye, Copy } from "lucide-react";
import { usePortalSession } from "@/hooks/use-portal-session";
import { DOCUMENTS, plantBySlug, fmtDate, labelDoc, type DocType } from "@/data/portal";
import { PageHeader, Panel, ActionBtn, simAction } from "@/components/portal/PortalUI";

export const Route = createFileRoute("/portal/documentos")({
  component: DocsPage,
});

const TYPES: { value: DocType | ""; label: string }[] = [
  { value: "", label: "Todos los tipos" },
  { value: "factura", label: "Factura" },
  { value: "cotizacion", label: "Cotización" },
  { value: "orden-compra", label: "Orden de compra" },
  { value: "certificado", label: "Certificado" },
  { value: "ficha-tecnica", label: "Ficha técnica" },
  { value: "reporte", label: "Reporte técnico" },
  { value: "evidencia", label: "Evidencia fotográfica" },
  { value: "acta", label: "Acta de entrega" },
  { value: "bitacora", label: "Bitácora de inspección" },
];

function DocsPage() {
  const { session } = usePortalSession();
  const [type, setType] = useState<DocType | "">("");
  const [q, setQ] = useState("");

  const all = useMemo(() => {
    if (!session) return [];
    if (session.role === "cliente-corp") return DOCUMENTS.filter((d) => plantBySlug(d.plantSlug)?.clientSlug === session.clientSlug);
    if (session.role === "cliente-planta") return DOCUMENTS.filter((d) => d.plantSlug === session.plantSlug);
    return DOCUMENTS;
  }, [session]);

  const visible = all.filter((d) => {
    if (type && d.type !== type) return false;
    if (q && !d.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader eyebrow="Biblioteca documental" title="Documentos descargables" subtitle={`${visible.length} de ${all.length} documentos`} />

      <Panel title="Filtros">
        <div className="grid sm:grid-cols-2 gap-3 p-4">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar documento…" className="border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none focus:border-brand-blue" />
          <select value={type} onChange={(e) => setType(e.target.value as DocType | "")} className="border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none">
            {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </Panel>

      <div className="mt-4">
        <Panel title="Resultados">
          <table className="w-full text-sm">
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
              {visible.slice(0, 80).map((d) => (
                <tr key={d.id} className="hover:bg-[color:var(--muted)]/20">
                  <td className="px-4 py-2.5 font-bold">{d.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{labelDoc(d.type)}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{plantBySlug(d.plantSlug)?.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(d.fecha)}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{d.size}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex gap-1.5">
                      <ActionBtn onClick={() => simAction("Vista previa simulada")}><Eye size={11} /></ActionBtn>
                      <ActionBtn><Download size={11} /></ActionBtn>
                      <ActionBtn onClick={() => simAction("Enlace copiado (simulado)")}><Copy size={11} /></ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
