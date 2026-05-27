import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download, Eye, Copy } from "lucide-react";
import {
  projectById,
  plantBySlug,
  clientBySlug,
  docsByProject,
  fmtDate,
  labelDoc,
} from "@/data/portal";
import { PageHeader, Panel, StatusBadge, ActionBtn, simAction } from "@/components/portal/PortalUI";

export const Route = createFileRoute("/portal/proyectos/$id")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { id } = Route.useParams();
  const project = projectById(id);
  if (!project) throw notFound();
  const plant = plantBySlug(project.plantSlug);
  const client = clientBySlug(project.clientSlug);
  const docs = docsByProject(project.id);

  return (
    <div className="max-w-7xl mx-auto">
      <Link to="/portal/proyectos" className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] hover:text-brand-blue">← Proyectos</Link>
      <PageHeader eyebrow={project.type} title={project.name} subtitle={project.descripcion} action={<StatusBadge state={project.status} label={project.status} />} />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 text-sm">
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] p-4">
          <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1">Cliente</p>
          <p className="font-bold">{client?.name}</p>
        </div>
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] p-4">
          <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1">Planta</p>
          <Link to="/portal/plantas/$slug" params={{ slug: plant?.slug ?? "" }} className="font-bold hover:text-brand-blue">{plant?.name}</Link>
        </div>
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] p-4">
          <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1">Fecha</p>
          <p className="font-bold">{fmtDate(project.fecha)}</p>
        </div>
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] p-4">
          <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-1">Responsable KG</p>
          <p className="font-bold">{project.responsable}</p>
        </div>
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
                  <div className="inline-flex gap-1.5">
                    <ActionBtn onClick={() => simAction("Vista previa simulada")}><Eye size={11} /> Ver</ActionBtn>
                    <ActionBtn><Download size={11} /> PDF</ActionBtn>
                    <ActionBtn onClick={() => simAction("Enlace copiado (simulado)")}><Copy size={11} /></ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="mt-4">
        <Panel title="Historial de cambios">
          <ul className="divide-y divide-[color:var(--border)]">
            <li className="px-4 py-3 text-xs"><span className="text-[color:var(--muted-fg)]">{fmtDate(project.fecha)}</span> · Proyecto creado por {project.responsable}</li>
            <li className="px-4 py-3 text-xs"><span className="text-[color:var(--muted-fg)]">{fmtDate(project.fecha)}</span> · Cotización emitida</li>
            <li className="px-4 py-3 text-xs"><span className="text-[color:var(--muted-fg)]">{fmtDate(project.fecha)}</span> · Orden de compra recibida</li>
            <li className="px-4 py-3 text-xs"><span className="text-[color:var(--muted-fg)]">{fmtDate(project.fecha)}</span> · Estado: {project.status}</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
