import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  plantBySlug,
  clientBySlug,
  systemsByPlant,
  certsByPlant,
  projectsByPlant,
  DOCUMENTS,
  certState,
  expiryLabel,
  fmtDate,
  labelDoc,
  systemById,
  responsableKGForPlant,
  ultimaActualizacionPlant,
  nextExpiryForPlant,
} from "@/data/portal";
import {
  PageHeader,
  Panel,
  StatCard,
  StatusBadge,
  ActionBtn,
  MetaCard,
  NoAccess,
} from "@/components/portal/PortalUI";
import { Download, Eye, Copy } from "lucide-react";
import { usePortalSession } from "@/hooks/use-portal-session";
import { simAction } from "@/components/portal/PortalUI";

export const Route = createFileRoute("/portal/plantas/$slug")({
  component: PlantaDetail,
});

function PlantaDetail() {
  const { slug } = Route.useParams();
  const { session } = usePortalSession();
  const plant = plantBySlug(slug);
  if (!plant) throw notFound();

  // Guard de acceso
  if (session) {
    if (session.role === "cliente-corp" && plant.clientSlug !== session.clientSlug) {
      return <NoAccess message="Esta planta pertenece a otra empresa." />;
    }
    if (session.role === "cliente-planta" && plant.slug !== session.plantSlug) {
      return <NoAccess message="Solo tiene acceso a su planta asignada." />;
    }
  }

  const client = clientBySlug(plant.clientSlug);
  const systems = systemsByPlant(slug);
  const certs = certsByPlant(slug);
  const projects = projectsByPlant(slug);
  const docs = DOCUMENTS.filter((d) => d.plantSlug === slug);
  const respKG = responsableKGForPlant(slug);
  const ultima = ultimaActualizacionPlant(slug);
  const proxVenc = nextExpiryForPlant(slug);

  return (
    <div className="max-w-7xl mx-auto">
      {client && (
        <Link to="/portal/clientes/$slug" params={{ slug: client.slug }} className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] hover:text-brand-blue">
          ← {client.name}
        </Link>
      )}
      <PageHeader eyebrow={plant.industry} title={plant.name} subtitle={`${plant.location} · ${plant.email}`} />

      {/* Metadatos clave */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetaCard label="Responsable del cliente" value={plant.responsable} hint={plant.email} />
        <MetaCard label="Responsable KG Safety" value={respKG} hint="Líder técnico asignado" />
        <MetaCard label="Última actualización" value={fmtDate(ultima)} hint="Basado en proyectos registrados" />
        <MetaCard
          label="Próximo vencimiento"
          value={proxVenc ? proxVenc.label : "—"}
          hint={proxVenc ? `${fmtDate(proxVenc.fecha)} · ${proxVenc.state === "vencido" ? "vencido" : proxVenc.state.replace("por-vencer-", "≤") + "d"}` : "Sin certificaciones registradas"}
        />
      </div>

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
              return (
                <li key={c.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{sys?.type}</p>
                    <p className="text-[11px] text-[color:var(--muted-fg)]">Vence {fmtDate(c.vencimiento)}</p>
                  </div>
                  <StatusBadge state={state} label={expiryLabel(c)} />
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
                <div className="inline-flex gap-1.5 flex-wrap justify-end shrink-0">
                  <ActionBtn onClick={() => simAction("Vista previa simulada")} title="Ver"><Eye size={11} /> Ver</ActionBtn>
                  <ActionBtn title="Descargar"><Download size={11} /> Descargar</ActionBtn>
                  <ActionBtn onClick={() => simAction("Enlace copiado (simulado)")} title="Copiar enlace"><Copy size={11} /> Copiar enlace</ActionBtn>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
