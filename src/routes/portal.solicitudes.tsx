import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { usePortalSession } from "@/hooks/use-portal-session";
import { PLANTS, SERVICE_REQUESTS, plantBySlug, fmtDate } from "@/data/portal";
import { PageHeader, Panel, StatCard, StatusBadge, ActionBtn } from "@/components/portal/PortalUI";
import { Plus, X } from "lucide-react";
import { createServiceRequest } from "@/lib/portal.functions";

export const Route = createFileRoute("/portal/solicitudes")({
  component: SolicitudesPage,
});

const TIPOS = ["Inspección", "Recertificación", "Instalación nueva", "Capacitación", "Rescate técnico", "Consultoría"];
const STATE_MAP: Record<string, "pendiente" | "en-curso" | "revision" | "completado"> = {
  recibida: "pendiente",
  "en-revision": "revision",
  cotizada: "revision",
  programada: "en-curso",
  cerrada: "completado",
};
const STATE_LABEL: Record<string, string> = {
  recibida: "Recibida",
  "en-revision": "En revisión",
  cotizada: "Cotizada",
  programada: "Programada",
  cerrada: "Cerrada",
};

function SolicitudesPage() {
  const { session, refresh } = usePortalSession();
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [descripcion, setDescripcion] = useState("");
  const [plantaLocal, setPlantaLocal] = useState<string>("");

  const availablePlants = useMemo(() => {
    if (!session) return PLANTS;
    if (session.role === "cliente-corp" && session.clientSlug) return PLANTS.filter((p) => p.clientSlug === session.clientSlug);
    if (session.role === "cliente-planta" && session.plantSlug) return PLANTS.filter((p) => p.slug === session.plantSlug);
    return PLANTS;
  }, [session]);

  const requests = useMemo(() => {
    if (!session) return SERVICE_REQUESTS;
    const slugs = availablePlants.map((p) => p.slug);
    return SERVICE_REQUESTS.filter((r) => slugs.includes(r.plantSlug));
  }, [session, availablePlants]);

  const abiertas = requests.filter((r) => r.status !== "cerrada").length;
  const enProceso = requests.filter((r) => ["cotizada", "programada"].includes(r.status)).length;
  const cerradas = requests.filter((r) => r.status === "cerrada").length;

  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createServiceRequest({ data: { plantSlug: plantaLocal, tipo, descripcion } });
      toast.success("Solicitud enviada", {
        description: "El equipo de KG Safety la revisará y le dará seguimiento.",
      });
      setDescripcion("");
      setOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo enviar la solicitud.");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Atención al cliente"
        title="Solicitudes de servicio"
        subtitle="Registre y dé seguimiento a solicitudes técnicas dirigidas a KG Safety."
        action={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-signal text-[color:var(--anchor-fixed)] border-2 border-[color:var(--anchor-fixed)] hover:bg-white transition-colors"
          >
            <Plus size={14} /> Nueva solicitud
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Solicitudes totales" value={requests.length} />
        <StatCard label="Abiertas" value={abiertas} tone={abiertas ? "warn" : "ok"} />
        <StatCard label="En proceso" value={enProceso} />
        <StatCard label="Cerradas" value={cerradas} tone="ok" />
      </div>

      <Panel title="Historial de solicitudes">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
              <tr>
                <th className="text-left px-4 py-2 font-bold">Folio</th>
                <th className="text-left px-4 py-2 font-bold">Tipo</th>
                <th className="text-left px-4 py-2 font-bold">Planta</th>
                <th className="text-left px-4 py-2 font-bold">Fecha</th>
                <th className="text-left px-4 py-2 font-bold">Solicitante</th>
                <th className="text-left px-4 py-2 font-bold">Estado</th>
                <th className="text-right px-4 py-2 font-bold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-[color:var(--muted)]/20">
                  <td className="px-4 py-2.5 font-mono text-xs">{r.id.toUpperCase()}</td>
                  <td className="px-4 py-2.5 font-bold">{r.tipo}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{plantBySlug(r.plantSlug)?.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(r.fecha)}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{r.solicitante}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge state={STATE_MAP[r.status] ?? "pendiente"} label={STATE_LABEL[r.status]} />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <ActionBtn>Ver detalle</ActionBtn>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-xs text-[color:var(--muted-fg)]">Sin solicitudes registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <form
            onSubmit={submit}
            className="relative bg-[color:var(--surface)] border border-[color:var(--border)] w-full max-w-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">Portal KG Safety</p>
                <h3 className="font-display text-xl uppercase">Nueva solicitud</h3>
              </div>
              <button type="button" onClick={() => setOpen(false)}><X size={18} /></button>
            </div>

            <label className="block mb-3">
              <span className="block text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1.5">Tipo de servicio</span>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] px-3 py-2 text-sm">
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>

            <label className="block mb-3">
              <span className="block text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1.5">Planta / Centro</span>
              <select value={plantaLocal} onChange={(e) => setPlantaLocal(e.target.value)} className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] px-3 py-2 text-sm" required>
                <option value="">— Seleccione —</option>
                {availablePlants.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
              </select>
            </label>

            <label className="block mb-5">
              <span className="block text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1.5">Descripción</span>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                rows={4}
                className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] px-3 py-2 text-sm"
                placeholder="Describa la necesidad, ubicación en planta, urgencia, etc."
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-signal text-[color:var(--anchor-fixed)] py-3 font-bold text-xs uppercase tracking-widest border-2 border-[color:var(--anchor-fixed)] hover:bg-white transition-colors"
            >
              {saving ? "Enviando…" : "Enviar solicitud"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
