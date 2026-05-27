import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { usePortalSession } from "@/hooks/use-portal-session";
import {
  PROJECTS,
  PLANTS,
  CLIENTS,
  fmtDate,
  type ProjectType,
  type ProjectStatus,
} from "@/data/portal";
import { PageHeader, Panel, StatusBadge } from "@/components/portal/PortalUI";

export const Route = createFileRoute("/portal/proyectos/")({
  component: ProjectsIndex,
});

const TYPES: ProjectType[] = [
  "Línea de vida", "Certificación", "Capacitación", "Supervisión", "Instalación",
  "Inspección", "Consultoría", "Análisis de riesgo", "Plan de rescate", "Asesoría",
];

function ProjectsIndex() {
  const { session } = usePortalSession();
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [plant, setPlant] = useState<string>("");
  const [q, setQ] = useState("");

  const all = useMemo(() => {
    if (!session) return [];
    if (session.role === "cliente-corp") return PROJECTS.filter((p) => p.clientSlug === session.clientSlug);
    if (session.role === "cliente-planta") return PROJECTS.filter((p) => p.plantSlug === session.plantSlug);
    return PROJECTS;
  }, [session]);

  const visible = all.filter((p) => {
    if (type && p.type !== type) return false;
    if (status && p.status !== status) return false;
    if (plant && p.plantSlug !== plant) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader eyebrow="Historial técnico" title="Proyectos" subtitle={`${visible.length} de ${all.length} proyectos`} />

      <Panel title="Filtros">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar proyecto…" className="border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none focus:border-brand-blue" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none">
            <option value="">Todos los tipos</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none">
            <option value="">Todos los estados</option>
            {(["completado", "en-curso", "pendiente", "revision"] as ProjectStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={plant} onChange={(e) => setPlant(e.target.value)} className="border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none">
            <option value="">Todas las plantas</option>
            {PLANTS.filter((p) => session?.role === "admin-kg" || all.some((x) => x.plantSlug === p.slug)).map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        </div>
      </Panel>

      <div className="mt-4">
        <Panel title="Resultados">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
              <tr>
                <th className="text-left px-4 py-2 font-bold">Proyecto</th>
                <th className="text-left px-4 py-2 font-bold">Tipo</th>
                <th className="text-left px-4 py-2 font-bold">Cliente</th>
                <th className="text-left px-4 py-2 font-bold">Planta</th>
                <th className="text-left px-4 py-2 font-bold">Fecha</th>
                <th className="text-left px-4 py-2 font-bold">Responsable</th>
                <th className="text-left px-4 py-2 font-bold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {visible.map((p) => {
                const cli = CLIENTS.find((c) => c.slug === p.clientSlug);
                const pl = PLANTS.find((x) => x.slug === p.plantSlug);
                return (
                  <tr key={p.id} className="hover:bg-[color:var(--muted)]/20">
                    <td className="px-4 py-2.5">
                      <Link to="/portal/proyectos/$id" params={{ id: p.id }} className="font-bold hover:text-brand-blue">{p.name}</Link>
                    </td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{p.type}</td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{cli?.name}</td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{pl?.name}</td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(p.fecha)}</td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{p.responsable}</td>
                    <td className="px-4 py-2.5"><StatusBadge state={p.status} label={p.status} /></td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-xs text-[color:var(--muted-fg)]">Sin resultados con los filtros actuales.</td></tr>
              )}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
