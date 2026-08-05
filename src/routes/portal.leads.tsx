import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, RefreshCw, Search } from "lucide-react";
import { usePortalSession } from "@/hooks/use-portal-session";
import { StatCard } from "@/components/portal/PortalUI";
import { AiSummaryPanel } from "@/components/portal/AiSummaryPanel";
import {
  LEAD_STAGES,
  addLeadNote,
  getLeadEvents,
  leadsAiSummary,
  listLeads,
  updateLead,
  type LeadEventRow,
  type LeadRow,
} from "@/lib/leads.functions";


export const Route = createFileRoute("/portal/leads")({
  component: LeadsPage,
  head: () => ({
    meta: [
      { title: "Embudo comercial · Portal KG Safety" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const STAGE_LABEL: Record<string, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  cotizacion: "Cotización",
  negociacion: "Negociación",
  ganado: "Ganado",
  perdido: "Perdido",
};

const ERP_LABEL: Record<string, string> = {
  pendiente: "Sin enviar",
  creada: "En ERP",
  pendiente_verificacion: "Por verificar",
  error: "Falló ERP",
};

function fmtDate(v: string | null) {
  if (!v) return "—";
  return new Date(v).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" });
}

function csvEscape(v: unknown) {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

function LeadsPage() {
  const { session } = usePortalSession();
  const allowed = session?.role === "admin-kg" || session?.role === "equipo-kg";

  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [etapa, setEtapa] = useState("");
  const [buscar, setBuscar] = useState("");
  const [incluirPruebas, setIncluirPruebas] = useState(false);
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [events, setEvents] = useState<LeadEventRow[]>([]);
  const [nota, setNota] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await listLeads({ data: { etapa: etapa || undefined, buscar: buscar || undefined, incluirPruebas } });
    if (!res.ok) toast.error("No se pudieron cargar los leads");
    setLeads(res.leads);
    setLoading(false);
  }, [etapa, buscar, incluirPruebas]);

  useEffect(() => {
    if (allowed) void load();
  }, [allowed, load]);

  const openLead = async (lead: LeadRow) => {
    setSelected(lead);
    setNota("");
    const res = await getLeadEvents({ data: { leadId: lead.id } });
    setEvents(res.events);
  };

  const changeStage = async (lead: LeadRow, next: string) => {
    const res = await updateLead({ data: { leadId: lead.id, etapa: next as (typeof LEAD_STAGES)[number] } });
    if (!res.ok) return toast.error(res.message);
    toast.success(res.message);
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, etapa: next } : l)));
    if (selected?.id === lead.id) void openLead({ ...lead, etapa: next });
  };

  const saveNote = async () => {
    if (!selected || !nota.trim()) return;
    const res = await addLeadNote({ data: { leadId: selected.id, nota } });
    if (!res.ok) return toast.error(res.message);
    setNota("");
    toast.success(res.message);
    const refreshed = await getLeadEvents({ data: { leadId: selected.id } });
    setEvents(refreshed.events);
  };

  const exportCsv = () => {
    const cols: (keyof LeadRow)[] = [
      "created_at", "empresa", "rfc", "contacto_nombre", "contacto_correo", "contacto_telefono",
      "curso_nombre", "participantes", "modalidad", "tipo_curso", "fecha_deseada",
      "contratista_nombre", "etapa", "responsable", "valor_estimado", "erp_status", "erp_folio", "origen",
    ];
    const csv = [cols.join(","), ...leads.map((l) => cols.map((c) => csvEscape(l[c])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `kg-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const by = (s: string) => leads.filter((l) => l.etapa === s).length;
    const ganados = by("ganado");
    const cerrados = ganados + by("perdido");
    return {
      total: leads.length,
      abiertos: leads.length - cerrados,
      ganados,
      conversion: cerrados > 0 ? `${Math.round((ganados / cerrados) * 100)}%` : "—",
      erpError: leads.filter((l) => l.erp_status === "error").length,
    };
  }, [leads]);

  if (!allowed) {
    return (
      <div className="p-6">
        <p className="text-sm text-[color:var(--muted-fg)]">
          Esta sección es exclusiva del equipo KG Safety.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <header className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-2">Data propia KG Safety</p>
        <h1 className="font-display uppercase text-[color:var(--on-surface)] leading-tight text-[clamp(1.4rem,4vw,2rem)]">
          Embudo comercial
        </h1>
        <p className="mt-2 text-sm text-[color:var(--muted-fg)] max-w-2xl">
          Toda solicitud del sitio queda registrada aquí, con o sin ERP. Es el historial propio de la empresa:
          si el ERP falla o cambia, la información comercial permanece.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <StatCard label="Leads" value={stats.total} />
        <StatCard label="Abiertos" value={stats.abiertos} />
        <StatCard label="Ganados" value={stats.ganados} tone="ok" />
        <StatCard label="Conversión" value={stats.conversion} />
        <StatCard label="Fallas ERP" value={stats.erpError} tone={stats.erpError ? "danger" : "neutral"} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-fg)]" />
          <input
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder="Buscar empresa, RFC, correo, folio…"
            aria-label="Buscar leads"
            className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] pl-9 pr-3 py-2.5 text-sm"
          />
        </div>
        <select
          value={etapa}
          onChange={(e) => setEtapa(e.target.value)}
          aria-label="Filtrar por etapa"
          className="bg-[color:var(--surface)] border border-[color:var(--border)] px-3 py-2.5 text-sm"
        >
          <option value="">Todas las etapas</option>
          {LEAD_STAGES.map((s) => (
            <option key={s} value={s}>{STAGE_LABEL[s]}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[color:var(--muted-fg)]">
          <input type="checkbox" checked={incluirPruebas} onChange={(e) => setIncluirPruebas(e.target.checked)} />
          Incluir pruebas
        </label>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 border border-[color:var(--border)] px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider hover:border-brand-blue hover:text-brand-blue"
        >
          <RefreshCw size={13} /> Actualizar
        </button>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider"
        >
          <Download size={13} /> CSV
        </button>
      </div>

      <div className="border border-[color:var(--border)] overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="bg-[color:var(--muted)]/40 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
              <th className="text-left px-3 py-2.5">Fecha</th>
              <th className="text-left px-3 py-2.5">Empresa</th>
              <th className="text-left px-3 py-2.5">Contacto</th>
              <th className="text-left px-3 py-2.5">Solicitud</th>
              <th className="text-left px-3 py-2.5">ERP</th>
              <th className="text-left px-3 py-2.5">Etapa</th>
              <th className="text-left px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-[color:var(--muted-fg)] text-xs uppercase tracking-widest">Cargando…</td></tr>
            )}
            {!loading && leads.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-[color:var(--muted-fg)] text-sm">Aún no hay solicitudes registradas.</td></tr>
            )}
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-[color:var(--border)] align-top">
                <td className="px-3 py-3 whitespace-nowrap text-xs text-[color:var(--muted-fg)]">{fmtDate(l.created_at)}</td>
                <td className="px-3 py-3">
                  <div className="font-bold">{l.empresa || "—"}</div>
                  <div className="text-xs text-[color:var(--muted-fg)]">{l.rfc}</div>
                </td>
                <td className="px-3 py-3 text-xs">
                  <div>{l.contacto_nombre}</div>
                  <div className="text-[color:var(--muted-fg)] break-all">{l.contacto_correo}</div>
                  <div className="text-[color:var(--muted-fg)]">{l.contacto_telefono}</div>
                </td>
                <td className="px-3 py-3 text-xs">
                  <div>{l.curso_nombre || l.lugar_servicio || "—"}</div>
                  <div className="text-[color:var(--muted-fg)]">
                    {l.participantes ? `${l.participantes} part.` : ""} {l.modalidad} {l.tipo_curso}
                  </div>
                </td>
                <td className="px-3 py-3 text-xs">
                  <div>{ERP_LABEL[l.erp_status] ?? l.erp_status}</div>
                  {l.erp_folio && <div className="text-[color:var(--muted-fg)]">{l.erp_folio}</div>}
                </td>
                <td className="px-3 py-3">
                  <select
                    value={l.etapa}
                    onChange={(e) => void changeStage(l, e.target.value)}
                    aria-label={`Etapa de ${l.empresa}`}
                    className="bg-[color:var(--surface)] border border-[color:var(--border)] px-2 py-1.5 text-xs"
                  >
                    {LEAD_STAGES.map((s) => (
                      <option key={s} value={s}>{STAGE_LABEL[s]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => void openLead(l)}
                    className="text-[10px] font-bold uppercase tracking-wider text-brand-blue hover:underline"
                  >
                    Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setSelected(null)}>
          <aside
            className="w-full max-w-md h-full overflow-y-auto bg-[color:var(--surface)] border-l border-[color:var(--border)] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="font-display text-lg uppercase">{selected.empresa || "Lead"}</h2>
                <p className="text-xs text-[color:var(--muted-fg)]">{selected.rfc} · {selected.origen}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="text-xs uppercase tracking-wider">Cerrar</button>
            </div>

            <dl className="text-xs space-y-1.5 mb-5">
              {[
                ["Contacto", `${selected.contacto_nombre} · ${selected.contacto_correo} · ${selected.contacto_telefono}`],
                ["Solicitud", selected.curso_nombre || selected.lugar_servicio || "—"],
                ["Participantes", selected.participantes ? String(selected.participantes) : "—"],
                ["Fecha deseada", selected.fecha_deseada ?? "—"],
                ["Contratista", selected.contratista_nombre || "—"],
                ["ERP", `${ERP_LABEL[selected.erp_status] ?? selected.erp_status}${selected.erp_folio ? ` · ${selected.erp_folio}` : ""}${selected.erp_error ? ` · ${selected.erp_error}` : ""}`],
                ["Trace ID", selected.erp_trace_id || "—"],
                ["Comentarios", selected.comentarios || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="w-28 shrink-0 uppercase tracking-wider text-[color:var(--muted-fg)]">{k}</dt>
                  <dd className="min-w-0 break-words">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mb-5">
              <label htmlFor="lead-nota" className="block text-[10px] font-bold uppercase tracking-widest mb-2">Nueva nota</label>
              <textarea
                id="lead-nota"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={3}
                maxLength={1000}
                className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] p-3 text-sm"
                placeholder="Llamada, acuerdo, siguiente paso…"
              />
              <button
                type="button"
                onClick={() => void saveNote()}
                disabled={!nota.trim()}
                className="mt-2 bg-signal text-[color:var(--anchor-fixed)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider disabled:opacity-50"
              >
                Guardar nota
              </button>
            </div>

            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3">Historial</h3>
            <ol className="space-y-3 border-l border-[color:var(--border)] pl-4">
              {events.map((ev) => (
                <li key={ev.id} className="text-xs">
                  <div className="text-[color:var(--muted-fg)]">{fmtDate(ev.created_at)} · {ev.tipo}</div>
                  <div className="break-words">{ev.detalle}</div>
                  {ev.autor_nombre && <div className="text-[color:var(--muted-fg)]">{ev.autor_nombre}</div>}
                </li>
              ))}
              {events.length === 0 && <li className="text-xs text-[color:var(--muted-fg)]">Sin eventos.</li>}
            </ol>
          </aside>
        </div>
      )}
    </div>
  );
}
