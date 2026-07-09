import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { usePortalSession } from "@/hooks/use-portal-session";
import {
  SYSTEMS, PLANTS, PROJECTS, plantBySlug, fmtDate,
} from "@/data/portal";
import { PageHeader, Panel, StatusBadge, ActionBtn, StatCard } from "@/components/portal/PortalUI";
import { Download, ExternalLink, Copy } from "lucide-react";

export const Route = createFileRoute("/portal/sistemas")({
  component: SistemasPage,
});

function SistemasPage() {
  const { session } = usePortalSession();

  const { plants, systems, projects } = useMemo(() => {
    if (!session) return { plants: [], systems: [], projects: [] };
    if (session.role === "cliente-corp" && session.clientSlug) {
      const pl = PLANTS.filter((p) => p.clientSlug === session.clientSlug);
      const slugs = pl.map((p) => p.slug);
      return {
        plants: pl,
        systems: SYSTEMS.filter((s) => slugs.includes(s.plantSlug)),
        projects: PROJECTS.filter((p) => slugs.includes(p.plantSlug)),
      };
    }
    if (session.role === "cliente-planta" && session.plantSlug) {
      return {
        plants: PLANTS.filter((p) => p.slug === session.plantSlug),
        systems: SYSTEMS.filter((s) => s.plantSlug === session.plantSlug),
        projects: PROJECTS.filter((p) => p.plantSlug === session.plantSlug),
      };
    }
    return { plants: PLANTS, systems: SYSTEMS, projects: PROJECTS };
  }, [session]);

  const totalMetros = systems.reduce((a, s) => a + (s.metros ?? 0), 0);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Infraestructura instalada"
        title="Mis sistemas y servicios"
        subtitle="Sistemas de seguridad en altura instalados por KG Safety y servicios técnicos asociados."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Sistemas instalados" value={systems.length} />
        <StatCard label="Metros lineales" value={totalMetros.toLocaleString("es-MX")} hint="LV horizontales + verticales" />
        <StatCard label="Plantas cubiertas" value={plants.length} />
        <StatCard label="Servicios registrados" value={projects.length} />
      </div>

      <Panel title="Sistemas instalados">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
              <tr>
                <th className="text-left px-4 py-2 font-bold">Sistema</th>
                <th className="text-left px-4 py-2 font-bold">Planta</th>
                <th className="text-left px-4 py-2 font-bold">Ubicación</th>
                <th className="text-left px-4 py-2 font-bold">Metros</th>
                <th className="text-left px-4 py-2 font-bold">Norma</th>
                <th className="text-right px-4 py-2 font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {systems.map((s) => (
                <tr key={s.id} className="hover:bg-[color:var(--muted)]/20">
                  <td className="px-4 py-2.5 font-bold">{s.type}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{plantBySlug(s.plantSlug)?.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{s.ubicacion}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{s.metros ?? "—"}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{s.norma}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex gap-1.5">
                      <ActionBtn><ExternalLink size={11} /> Ver</ActionBtn>
                      <ActionBtn><Download size={11} /> Ficha</ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-4">
        <Panel title="Servicios técnicos ejecutados">
          <ul className="divide-y divide-[color:var(--border)]">
            {projects.slice(0, 12).map((p) => (
              <li key={p.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <Link to="/portal/proyectos/$id" params={{ id: p.id }} className="min-w-0 group">
                  <p className="text-xs font-bold group-hover:text-brand-blue truncate">{p.name}</p>
                  <p className="text-[11px] text-[color:var(--muted-fg)]">{fmtDate(p.fecha)} · {p.responsable}</p>
                </Link>
                <div className="flex items-center gap-2">
                  <StatusBadge state={p.status} label={p.status} />
                  <ActionBtn><Copy size={11} /> Copiar enlace</ActionBtn>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
