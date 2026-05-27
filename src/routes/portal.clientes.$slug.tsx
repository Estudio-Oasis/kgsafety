import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  clientBySlug,
  plantsByClient,
  projectsByClient,
  CERTIFICATIONS,
  certState,
  fmtDate,
} from "@/data/portal";
import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/portal/PortalUI";

export const Route = createFileRoute("/portal/clientes/$slug")({
  component: ClienteDetail,
});

function ClienteDetail() {
  const { slug } = Route.useParams();
  const client = clientBySlug(slug);
  if (!client) throw notFound();
  const plants = plantsByClient(slug);
  const plantSlugs = plants.map((p) => p.slug);
  const projects = projectsByClient(slug);
  const certs = CERTIFICATIONS.filter((c) => plantSlugs.includes(c.plantSlug));
  const vigentes = certs.filter((c) => certState(c) === "vigente").length;
  const porVencer = certs.filter((c) => ["por-vencer-30", "por-vencer-60"].includes(certState(c))).length;
  const vencidos = certs.filter((c) => certState(c) === "vencido").length;

  return (
    <div className="max-w-7xl mx-auto">
      <Link to="/portal/clientes" className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] hover:text-brand-blue">← Clientes</Link>
      <PageHeader eyebrow={client.industry} title={client.name} subtitle={`${plants.length} planta(s) · ${projects.length} proyecto(s) registrados.`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Plantas" value={plants.length} />
        <StatCard label="Cert. vigentes" value={vigentes} tone="ok" />
        <StatCard label="Por vencer" value={porVencer} tone="warn" />
        <StatCard label="Vencidas" value={vencidos} tone={vencidos ? "danger" : "neutral"} />
      </div>

      <Panel title="Plantas asociadas">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
            <tr>
              <th className="text-left px-4 py-2 font-bold">Planta</th>
              <th className="text-left px-4 py-2 font-bold">Ubicación</th>
              <th className="text-left px-4 py-2 font-bold">Responsable</th>
              <th className="text-left px-4 py-2 font-bold">Industria</th>
              <th className="text-right px-4 py-2 font-bold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border)]">
            {plants.map((p) => (
              <tr key={p.slug} className="hover:bg-[color:var(--muted)]/20">
                <td className="px-4 py-2.5 font-bold">{p.name}</td>
                <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{p.location}</td>
                <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{p.responsable}</td>
                <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{p.industry}</td>
                <td className="px-4 py-2.5 text-right">
                  <Link to="/portal/plantas/$slug" params={{ slug: p.slug }} className="text-[10px] uppercase tracking-widest text-brand-blue hover:underline">
                    Ver planta →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="mt-4">
        <Panel title="Proyectos recientes">
          <ul className="divide-y divide-[color:var(--border)]">
            {projects.slice(0, 8).map((p) => (
              <li key={p.id} className="px-4 py-3 flex items-center justify-between">
                <Link to="/portal/proyectos/$id" params={{ id: p.id }} className="min-w-0">
                  <p className="text-xs font-bold hover:text-brand-blue truncate">{p.name}</p>
                  <p className="text-[11px] text-[color:var(--muted-fg)]">{fmtDate(p.fecha)} · {p.responsable}</p>
                </Link>
                <StatusBadge state={p.status} label={p.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
