import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download, Eye, Copy, CircleDot } from "lucide-react";
import {
  projectById,
  plantBySlug,
  clientBySlug,
  docsByProject,
  fmtDate,
  labelDoc,
  buildProjectTimeline,
  responsableKGForPlant,
  ultimaActualizacionProject,
  nextExpiryForPlant,
} from "@/data/portal";
import {
  PageHeader,
  Panel,
  StatusBadge,
  ActionBtn,
  MetaCard,
  NoAccess,
  simAction,
} from "@/components/portal/PortalUI";
import { usePortalSession } from "@/hooks/use-portal-session";

export const Route = createFileRoute("/portal/proyectos/$id")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { id } = Route.useParams();
  const { session } = usePortalSession();
  const project = projectById(id);
  if (!project) throw notFound();

  // Guard
  if (session) {
    if (session.role === "cliente-corp" && project.clientSlug !== session.clientSlug) {
      return <NoAccess message="Este proyecto pertenece a otra empresa." />;
    }
    if (session.role === "cliente-planta" && project.plantSlug !== session.plantSlug) {
      return <NoAccess message="Solo tiene acceso a proyectos de su planta." />;
    }
  }

  const plant = plantBySlug(project.plantSlug);
  const client = clientBySlug(project.clientSlug);
  const docs = docsByProject(project.id);
  const timeline = buildProjectTimeline(project);
  const respKG = project.responsable || responsableKGForPlant(project.plantSlug);
  const respCliente = plant?.responsable ?? "—";
  const ultima = ultimaActualizacionProject(project);
  const proxVenc = nextExpiryForPlant(project.plantSlug);

  return (
    <div className="max-w-7xl mx-auto">
      <Link to="/portal/proyectos" className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] hover:text-brand-blue">← Proyectos</Link>
      <PageHeader
        eyebrow={project.type}
        title={project.name}
        subtitle={project.descripcion}
        action={<StatusBadge state={project.status} label={project.status} />}
      />

      {/* Cliente / planta */}
      <div className="grid md:grid-cols-2 gap-3 mb-3 text-sm">
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] p-4">
          <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1">Cliente</p>
          <p className="font-bold">{client?.name}</p>
        </div>
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] p-4">
          <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1">Planta</p>
          <Link to="/portal/plantas/$slug" params={{ slug: plant?.slug ?? "" }} className="font-bold hover:text-brand-blue">{plant?.name}</Link>
        </div>
      </div>

      {/* Metadatos clave */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetaCard label="Responsable del cliente" value={respCliente} hint={plant?.email} />
        <MetaCard label="Responsable KG Safety" value={respKG} hint="Líder técnico del proyecto" />
        <MetaCard label="Última actualización" value={fmtDate(ultima)} hint="Cierre documental" />
        <MetaCard
          label="Próximo vencimiento relevante"
          value={proxVenc ? proxVenc.label : "—"}
          hint={proxVenc ? `${fmtDate(proxVenc.fecha)} · ${proxVenc.state === "vencido" ? "vencido" : "próximo"}` : "Sin vencimientos registrados"}
        />
      </div>

      {/* Historial del proyecto */}
      <div className="mb-4">
        <Panel title="Historial del proyecto">
          <ol className="relative px-4 py-4">
            <span className="absolute left-[22px] top-4 bottom-4 w-px bg-[color:var(--border)]" aria-hidden />
            {timeline.map((ev, i) => (
              <li key={i} className="relative pl-8 py-2.5">
                <span className="absolute left-[14px] top-3.5 grid place-items-center">
                  <CircleDot size={14} className="text-brand-blue bg-[color:var(--surface)]" />
                </span>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <p className="text-xs font-bold">{ev.label}</p>
                  <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">{fmtDate(ev.fecha)}</p>
                </div>
                <p className="text-[12px] text-[color:var(--muted-fg)] mt-0.5">{ev.desc}</p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <Panel title="Documentos asociados">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
            <tr>
              <th className="text-left px-4 py-2 font-bold">Documento</th>
              <th className="text-left px-4 py-2 font-bold">Tipo</th>
              <th className="text-left px-4 py-2 font-bold">Fecha</th>
              <th className="text-left px-4 py-2 font-bold">Tamaño</th>
              <th className="text-right px-4 py-2 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border)]">
            {docs.map((d) => (
              <tr key={d.id} className="hover:bg-[color:var(--muted)]/20">
                <td className="px-4 py-2.5 font-bold">{d.name}</td>
                <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{labelDoc(d.type)}</td>
                <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(d.fecha)}</td>
                <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{d.size}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="inline-flex gap-1.5 flex-wrap justify-end">
                    <ActionBtn onClick={() => simAction("Vista previa simulada")} title="Ver"><Eye size={11} /> Ver</ActionBtn>
                    <ActionBtn title="Descargar"><Download size={11} /> Descargar</ActionBtn>
                    <ActionBtn onClick={() => simAction("Enlace copiado (simulado)")} title="Copiar enlace"><Copy size={11} /> Copiar enlace</ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
