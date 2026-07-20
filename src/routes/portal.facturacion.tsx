import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowRight, Wrench } from "lucide-react";
import { usePortalSession } from "@/hooks/use-portal-session";
import { PROJECTS, SYSTEMS, plantBySlug, fmtDate } from "@/data/portal";
import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/portal/PortalUI";

// Ruta legada. Se conserva la URL /portal/facturacion pero se reemplaza por
// "Servicios realizados" — sin ninguna cifra monetaria, por decisión del cliente.
export const Route = createFileRoute("/portal/facturacion")({
  component: ServiciosRealizados,
});

function ServiciosRealizados() {
  const { session } = usePortalSession();

  const projects = useMemo(() => {
    if (!session) return [];
    if (session.role === "cliente-corp") return PROJECTS.filter((p) => p.clientSlug === session.clientSlug);
    if (session.role === "cliente-planta") return PROJECTS.filter((p) => p.plantSlug === session.plantSlug);
    return PROJECTS;
  }, [session]);

  const systems = useMemo(() => {
    if (!session) return [];
    if (session.role === "cliente-planta") return SYSTEMS.filter((s) => s.plantSlug === session.plantSlug);
    return SYSTEMS;
  }, [session]);

  const enCurso = projects.filter((p) => p.status === "en-curso").length;
  const completados = projects.filter((p) => p.status === "completado").length;

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Historial operativo"
        title="Servicios realizados"
        subtitle="Trabajos ejecutados, sistemas instalados y entregables técnicos. Sin información comercial ni financiera."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard label="Servicios en curso" value={enCurso} />
        <StatCard label="Servicios completados" value={completados} tone="ok" />
        <StatCard label="Sistemas instalados" value={systems.length} hint="Líneas de vida, anclajes, etc." />
      </div>

      <Panel title="Historial de servicios">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
            <tr>
              <th className="text-left px-4 py-2 font-bold">Folio</th>
              <th className="text-left px-4 py-2 font-bold">Fecha</th>
              <th className="text-left px-4 py-2 font-bold">Servicio</th>
              <th className="text-left px-4 py-2 font-bold">Planta</th>
              <th className="text-left px-4 py-2 font-bold">Responsable</th>
              <th className="text-left px-4 py-2 font-bold">Estado</th>
              <th className="text-right px-4 py-2 font-bold">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border)]">
            {projects.map((p) => {
              const plant = plantBySlug(p.plantSlug);
              return (
                <tr key={p.id} className="hover:bg-[color:var(--muted)]/20">
                  <td className="px-4 py-2.5 font-mono text-xs font-bold">{p.id}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(p.fecha)}</td>
                  <td className="px-4 py-2.5 truncate max-w-[280px]">
                    <span className="inline-flex items-center gap-2 font-bold">
                      <Wrench size={12} className="text-brand-blue shrink-0" /> {p.name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{plant?.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{p.responsable}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge state={p.status} label={p.status} />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      to="/portal/proyectos/$id"
                      params={{ id: p.id }}
                      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-brand-blue hover:underline font-bold"
                    >
                      Ver <ArrowRight size={10} />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {projects.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-xs text-[color:var(--muted-fg)]">Sin servicios registrados.</td></tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
