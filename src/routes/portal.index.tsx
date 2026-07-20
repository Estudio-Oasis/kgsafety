import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { ArrowRight, Download } from "lucide-react";
import { usePortalSession } from "@/hooks/use-portal-session";
import {
  CERTIFICATIONS,
  DOCUMENTS,
  PLANTS,
  PROJECTS,
  SYSTEMS,
  certState,
  expiryLabel,
  fmtDate,
  labelDoc,
  plantBySlug,
  systemById,
} from "@/data/portal";
import { StatCard, Panel, PageHeader, StatusBadge, ActionBtn } from "@/components/portal/PortalUI";


export const Route = createFileRoute("/portal/")({
  component: Dashboard,
});

function Dashboard() {
  const { session } = usePortalSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.role === "equipo-kg") navigate({ to: "/portal/biblioteca" });
  }, [session, navigate]);

  const scope = useMemo(() => {
    if (!session) return { plants: [], projects: [], certs: [], docs: [] };
    if (session.role === "cliente-corp" && session.clientSlug) {
      const plants = PLANTS.filter((p) => p.clientSlug === session.clientSlug);
      const plantSlugs = plants.map((p) => p.slug);
      return {
        plants,
        projects: PROJECTS.filter((p) => plantSlugs.includes(p.plantSlug)),
        certs: CERTIFICATIONS.filter((c) => plantSlugs.includes(c.plantSlug)),
        docs: DOCUMENTS.filter((d) => plantSlugs.includes(d.plantSlug)),
      };
    }
    if (session.role === "cliente-planta" && session.plantSlug) {
      const plants = PLANTS.filter((p) => p.slug === session.plantSlug);
      return {
        plants,
        projects: PROJECTS.filter((p) => p.plantSlug === session.plantSlug),
        certs: CERTIFICATIONS.filter((c) => c.plantSlug === session.plantSlug),
        docs: DOCUMENTS.filter((d) => d.plantSlug === session.plantSlug),
      };
    }
    return { plants: PLANTS, projects: PROJECTS, certs: CERTIFICATIONS, docs: DOCUMENTS };
  }, [session]);

  const expiringSoon = scope.certs.filter((c) => ["por-vencer-30", "por-vencer-60", "vencido"].includes(certState(c)));
  const expired = scope.certs.filter((c) => certState(c) === "vencido");
  const systems = SYSTEMS.filter((s) => scope.plants.some((p) => p.slug === s.plantSlug));
  const recentProjects = [...scope.projects].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6);
  const recentDocs = [...scope.docs].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6);

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Resumen general"
        title={`Bienvenido, ${session.name}`}
        subtitle="Estado actual de proyectos, certificaciones y documentación KG Safety."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Certificaciones por vencer" value={expiringSoon.length} hint="Próximos 60 días + vencidas" tone={expired.length ? "danger" : "warn"} />
        <StatCard label="Sistemas instalados" value={systems.length} hint={`${scope.plants.length} planta(s)`} />
        <StatCard label="Proyectos en curso" value={scope.projects.filter((p) => p.status === "en-curso").length} />
        <StatCard label="Alertas críticas" value={expired.length} hint="Certificaciones vencidas" tone={expired.length ? "danger" : "ok"} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Próximos vencimientos" action={<Link to="/portal/certificaciones" className="text-[10px] uppercase tracking-widest text-brand-blue hover:underline flex items-center gap-1">Ver todo <ArrowRight size={10} /></Link>}>
          <ul className="divide-y divide-[color:var(--border)]">
            {expiringSoon.slice(0, 6).map((c) => {
              const sys = systemById(c.systemId);
              const plant = plantBySlug(c.plantSlug);
              const state = certState(c);
              return (
                <li key={c.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{sys?.type}</p>
                    <p className="text-[11px] text-[color:var(--muted-fg)] truncate">{plant?.name}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge state={state} label={expiryLabel(c)} />
                  </div>
                </li>
              );
            })}
            {expiringSoon.length === 0 && <li className="px-4 py-6 text-xs text-[color:var(--muted-fg)] text-center">Sin certificaciones por vencer.</li>}
          </ul>
        </Panel>

        <Panel title="Últimos proyectos" action={<Link to="/portal/proyectos" className="text-[10px] uppercase tracking-widest text-brand-blue hover:underline flex items-center gap-1">Ver todo <ArrowRight size={10} /></Link>}>
          <ul className="divide-y divide-[color:var(--border)]">
            {recentProjects.map((p) => (
              <li key={p.id} className="px-4 py-3">
                <Link to="/portal/proyectos/$id" params={{ id: p.id }} className="flex items-center justify-between gap-3 group">
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate group-hover:text-brand-blue">{p.name}</p>
                    <p className="text-[11px] text-[color:var(--muted-fg)]">{fmtDate(p.fecha)} · {p.responsable}</p>
                  </div>
                  <StatusBadge state={p.status} label={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Documentos recientes" action={<Link to="/portal/documentos" className="text-[10px] uppercase tracking-widest text-brand-blue hover:underline flex items-center gap-1">Ver todo <ArrowRight size={10} /></Link>}>
          <ul className="divide-y divide-[color:var(--border)]">
            {recentDocs.map((d) => (
              <li key={d.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{d.name}</p>
                  <p className="text-[11px] text-[color:var(--muted-fg)]">{labelDoc(d.type)} · {d.size}</p>
                </div>
                <ActionBtn><Download size={11} /> PDF</ActionBtn>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Panel title="Servicios recientes" action={<Link to="/portal/facturacion" className="text-[10px] uppercase tracking-widest text-brand-blue hover:underline flex items-center gap-1">Ver todo <ArrowRight size={10} /></Link>}>
          <ul className="divide-y divide-[color:var(--border)]">
            {recentProjects.slice(0, 5).map((p) => (
              <li key={p.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{p.name}</p>
                  <p className="text-[11px] text-[color:var(--muted-fg)]">{fmtDate(p.fecha)} · {p.responsable}</p>
                </div>
                <StatusBadge state={p.status} label={p.status} />
              </li>
            ))}
            {recentProjects.length === 0 && <li className="px-4 py-6 text-xs text-[color:var(--muted-fg)] text-center">Sin servicios registrados.</li>}
          </ul>
        </Panel>

        <Panel title="Plantas">
          <ul className="divide-y divide-[color:var(--border)]">
            {scope.plants.slice(0, 8).map((p) => (
              <li key={p.slug} className="px-4 py-3">
                <Link to="/portal/plantas/$slug" params={{ slug: p.slug }} className="flex items-center justify-between group">
                  <div>
                    <p className="text-xs font-bold group-hover:text-brand-blue">{p.name}</p>
                    <p className="text-[11px] text-[color:var(--muted-fg)]">{p.location} · {p.responsable}</p>
                  </div>
                  <ArrowRight size={14} className="text-[color:var(--muted-fg)] group-hover:text-brand-blue" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
