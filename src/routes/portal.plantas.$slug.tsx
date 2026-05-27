import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  plantBySlug,
  clientBySlug,
  systemsByPlant,
  certsByPlant,
  projectsByPlant,
  DOCUMENTS,
  certState,
  daysLeft,
  fmtDate,
  labelDoc,
  systemById,
} from "@/data/portal";
import { PageHeader, Panel, StatCard, StatusBadge, ActionBtn } from "@/components/portal/PortalUI";
import { Download } from "lucide-react";

export const Route = createFileRoute("/portal/plantas/$slug")({
  component: PlantaDetail,
});

function PlantaDetail() {
  const { slug } = Route.useParams();
  const plant = plantBySlug(slug);
  if (!plant) throw notFound();
  const client = clientBySlug(plant.clientSlug);
  const systems = systemsByPlant(slug);
  const certs = certsByPlant(slug);
  const projects = projectsByPlant(slug);
  const docs = DOCUMENTS.filter((d) => d.plantSlug === slug);

  return (
    <div className="max-w-7xl mx-auto">
      {client && (
        <Link to="/portal/clientes/$slug" params={{ slug: client.slug }} className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] hover:text-brand-blue">
          ← {client.name}
        </Link>
      )}
      <PageHeader eyebrow={plant.industry} title={plant.name} subtitle={`${plant.location} · Responsable: ${plant.responsable} · ${plant.email}`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Sistemas instalados" value={systems.length} />
        <StatCard label="Proyectos" value={projects.length} />
        <StatCard label="Documentos" value={docs.length} />
        <StatCard
          label="Cert. vencidas"
          value={certs.filter((c) => certState(c) === "vencido").length}
          tone={certs.some((c) => certState(c) === "vencido") ? "danger" : "ok"}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Sistemas instalados">
          <ul className="divide-y divide-[color:var(--border)]">
            {systems.map((s) => (
              <li key={s.id} className="px-4 py-3">
                <p className="text-xs font-bold">{s.type}</p>
                <p className="text-[11px] text-[color:var(--muted-fg)]">{s.ubicacion} · {s.metros} m · {s.norma}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Certificaciones">
          <ul className="divide-y divide-[color:var(--border)]">
            {certs.map((c) => {
              const sys = systemById(c.systemId);
              const state = certState(c);
              const dl = daysLeft(c);
              return (
                <li key={c.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{sys?.type}</p>
                    <p className="text-[11px] text-[color:var(--muted-fg)]">Vence {fmtDate(c.vencimiento)}</p>
                  </div>
                  <StatusBadge state={state} label={dl < 0 ? `${Math.abs(dl)}d vencido` : `${dl}d`} />
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel title="Proyectos históricos">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
              <tr>
                <th className="text-left px-4 py-2 font-bold">Proyecto</th>
                <th className="text-left px-4 py-2 font-bold">Tipo</th>
                <th className="text-left px-4 py-2 font-bold">Fecha</th>
                <th className="text-left px-4 py-2 font-bold">Responsable</th>
                <th className="text-left px-4 py-2 font-bold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-[color:var(--muted)]/20">
                  <td className="px-4 py-2.5">
                    <Link to="/portal/proyectos/$id" params={{ id: p.id }} className="font-bold hover:text-brand-blue">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{p.type}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(p.fecha)}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{p.responsable}</td>
                  <td className="px-4 py-2.5"><StatusBadge state={p.status} label={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel title="Documentos asociados">
          <ul className="divide-y divide-[color:var(--border)]">
            {docs.slice(0, 12).map((d) => (
              <li key={d.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{d.name}</p>
                  <p className="text-[11px] text-[color:var(--muted-fg)]">{labelDoc(d.type)} · {d.size} · {fmtDate(d.fecha)}</p>
                </div>
                <ActionBtn><Download size={11} /> Descargar</ActionBtn>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
