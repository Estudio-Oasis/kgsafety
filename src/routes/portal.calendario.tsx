import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { usePortalSession } from "@/hooks/use-portal-session";
import { PLANTS, plantBySlug, complianceEventsForPlants, fmtDate } from "@/data/portal";
import { PageHeader, Panel, StatCard } from "@/components/portal/PortalUI";
import { AlertTriangle, CalendarClock, Wrench, GraduationCap, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/portal/calendario")({
  component: CalendarioPage,
});

const TIPO_ICON = {
  recertificacion: ShieldCheck,
  inspeccion: Wrench,
  capacitacion: GraduationCap,
  auditoria: CalendarClock,
} as const;
const TIPO_LABEL = {
  recertificacion: "Recertificación",
  inspeccion: "Inspección",
  capacitacion: "Capacitación / DC-3",
  auditoria: "Auditoría",
};

function CalendarioPage() {
  const { session } = usePortalSession();

  const plantSlugs = useMemo(() => {
    if (!session) return [];
    if (session.role === "cliente-corp" && session.clientSlug) {
      return PLANTS.filter((p) => p.clientSlug === session.clientSlug).map((p) => p.slug);
    }
    if (session.role === "cliente-planta" && session.plantSlug) return [session.plantSlug];
    return PLANTS.map((p) => p.slug);
  }, [session]);

  const events = useMemo(() => complianceEventsForPlants(plantSlugs), [plantSlugs]);
  const now = Date.now();
  const vencidos = events.filter((e) => new Date(e.fecha).getTime() < now);
  const prox30 = events.filter((e) => {
    const t = new Date(e.fecha).getTime();
    return t >= now && t - now <= 30 * 86400000;
  });
  const prox90 = events.filter((e) => {
    const t = new Date(e.fecha).getTime();
    return t - now > 30 * 86400000 && t - now <= 90 * 86400000;
  });

  // Agrupar por mes
  const grouped = events.reduce<Record<string, typeof events>>((acc, e) => {
    const key = e.fecha.slice(0, 7);
    (acc[key] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Cumplimiento programado"
        title="Calendario de cumplimiento"
        subtitle="Vencimientos, recertificaciones, capacitaciones e inspecciones programadas."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Eventos vencidos" value={vencidos.length} tone={vencidos.length ? "danger" : "ok"} />
        <StatCard label="Próximos 30 días" value={prox30.length} tone={prox30.length ? "warn" : "neutral"} />
        <StatCard label="Próximos 90 días" value={prox90.length} />
        <StatCard label="Total programados" value={events.length} />
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([month, evs]) => {
          const d = new Date(`${month}-01`);
          const label = d.toLocaleDateString("es-MX", { year: "numeric", month: "long" });
          return (
            <Panel key={month} title={label.toUpperCase()}>
              <ul className="divide-y divide-[color:var(--border)]">
                {evs.map((e) => {
                  const Icon = TIPO_ICON[e.tipo];
                  const past = new Date(e.fecha).getTime() < now;
                  return (
                    <li key={e.id} className="px-4 py-3 flex items-center gap-4">
                      <div className={`w-10 h-10 grid place-items-center border ${past ? "border-red-500/50 text-red-500" : "border-[color:var(--border)] text-[color:var(--muted-fg)]"}`}>
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate">{e.titulo}</p>
                        <p className="text-[11px] text-[color:var(--muted-fg)]">
                          {TIPO_LABEL[e.tipo]} · {plantBySlug(e.plantSlug)?.name} · {e.responsable}
                        </p>
                      </div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${past ? "text-red-500" : "text-[color:var(--muted-fg)]"}`}>
                        {past && <AlertTriangle size={11} className="inline mr-1" />}
                        {fmtDate(e.fecha)}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
