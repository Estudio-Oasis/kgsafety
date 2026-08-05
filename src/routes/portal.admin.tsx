import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit, Upload, UserPlus } from "lucide-react";
import { CLIENTS, PLANTS, PROJECTS, DOCUMENTS, CERTIFICATIONS, certState, fmtDate, plantBySlug, systemById } from "@/data/portal";
import { PageHeader, Panel, StatCard, StatusBadge, ActionBtn, simAction } from "@/components/portal/PortalUI";
import { usePortalSession } from "@/hooks/use-portal-session";
import { useState } from "react";

export const Route = createFileRoute("/portal/admin")({
  component: AdminPanel,
});

const TABS = ["Clientes", "Plantas", "Usuarios", "Proyectos", "Vencimientos", "Alertas globales"] as const;
type Tab = (typeof TABS)[number];

function AdminPanel() {
  const { session } = usePortalSession();
  const [tab, setTab] = useState<Tab>("Clientes");

  if (session && session.role !== "admin-kg") {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-xs uppercase tracking-widest text-red-500 mb-2">Acceso restringido</p>
        <h1 className="font-display text-2xl uppercase">Panel admin</h1>
        <p className="mt-3 text-sm text-[color:var(--muted-fg)]">Solo accesible para administradores de KG Safety.</p>
      </div>
    );
  }

  const vencidas = CERTIFICATIONS.filter((c) => certState(c) === "vencido");
  const porVencer = CERTIFICATIONS.filter((c) => ["por-vencer-30", "por-vencer-60"].includes(certState(c)));
  const proyectosAbiertos = PROJECTS.filter((p) => p.status !== "completado");

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Administración KG Safety"
        title="Panel admin"
        subtitle="Visibilidad total. Acciones simuladas en este prototipo."
        action={<ActionBtn variant="primary" onClick={() => simAction("Acción admin simulada")}><Plus size={11} /> Crear</ActionBtn>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Clientes" value={CLIENTS.length} />
        <StatCard label="Plantas" value={PLANTS.length} />
        <StatCard label="Cert. vencidas" value={vencidas.length} tone={vencidas.length ? "danger" : "ok"} />
        <StatCard label="Proyectos abiertos" value={proyectosAbiertos.length} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4 border-b border-[color:var(--border)]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-colors ${
              tab === t ? "border-signal text-brand-blue" : "border-transparent text-[color:var(--muted-fg)] hover:text-brand-blue"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Clientes" && (
        <Panel title="Clientes registrados" action={<ActionBtn onClick={() => simAction("Nuevo cliente (simulado)")}><Plus size={11} /> Nuevo</ActionBtn>}>
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]"><tr>
              <th className="text-left px-4 py-2 font-bold">Cliente</th>
              <th className="text-left px-4 py-2 font-bold">Industria</th>
              <th className="text-left px-4 py-2 font-bold">Plantas</th>
              <th className="text-right px-4 py-2 font-bold">Acciones</th>
            </tr></thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {CLIENTS.map((c) => (
                <tr key={c.slug}>
                  <td className="px-4 py-2.5 font-bold">{c.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{c.industry}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{PLANTS.filter((p) => p.clientSlug === c.slug).length}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex gap-1.5">
                      <ActionBtn><Edit size={11} /></ActionBtn>
                      <ActionBtn><UserPlus size={11} /></ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {tab === "Plantas" && (
        <Panel title="Plantas">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]"><tr>
              <th className="text-left px-4 py-2 font-bold">Planta</th>
              <th className="text-left px-4 py-2 font-bold">Cliente</th>
              <th className="text-left px-4 py-2 font-bold">Ubicación</th>
              <th className="text-left px-4 py-2 font-bold">Responsable</th>
              <th className="text-right px-4 py-2 font-bold">Acciones</th>
            </tr></thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {PLANTS.map((p) => (
                <tr key={p.slug}>
                  <td className="px-4 py-2.5 font-bold">{p.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{CLIENTS.find((c) => c.slug === p.clientSlug)?.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{p.location}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{p.responsable}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex gap-1.5">
                      <ActionBtn><Edit size={11} /></ActionBtn>
                      <ActionBtn><Upload size={11} /> Doc</ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {tab === "Usuarios" && <AdminUsers />}


      {tab === "Proyectos" && (
        <Panel title="Todos los proyectos">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]"><tr>
              <th className="text-left px-4 py-2 font-bold">Proyecto</th>
              <th className="text-left px-4 py-2 font-bold">Tipo</th>
              <th className="text-left px-4 py-2 font-bold">Fecha</th>
              <th className="text-left px-4 py-2 font-bold">Estado</th>
            </tr></thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {PROJECTS.slice(0, 30).map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2.5 font-bold">{p.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{p.type}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(p.fecha)}</td>
                  <td className="px-4 py-2.5"><StatusBadge state={p.status} label={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {tab === "Vencimientos" && (
        <Panel title={`Por vencer + vencidas · ${vencidas.length + porVencer.length}`}>
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]"><tr>
              <th className="text-left px-4 py-2 font-bold">Sistema</th>
              <th className="text-left px-4 py-2 font-bold">Planta</th>
              <th className="text-left px-4 py-2 font-bold">Vencimiento</th>
              <th className="text-left px-4 py-2 font-bold">Estado</th>
            </tr></thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {[...vencidas, ...porVencer].map((c) => {
                const sys = systemById(c.systemId);
                return (
                  <tr key={c.id}>
                    <td className="px-4 py-2.5 font-bold">{sys?.type}</td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{plantBySlug(c.plantSlug)?.name}</td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(c.vencimiento)}</td>
                    <td className="px-4 py-2.5"><StatusBadge state={certState(c)} label={certState(c)} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      )}

      {tab === "Alertas globales" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Panel title="Certificaciones vencidas">
            <p className="px-4 py-3 text-sm"><span className="font-display text-3xl text-red-500">{vencidas.length}</span> <span className="text-[color:var(--muted-fg)] ml-2">sistemas requieren recertificación inmediata.</span></p>
          </Panel>
          <Panel title="Proyectos abiertos">
            <p className="px-4 py-3 text-sm"><span className="font-display text-3xl">{proyectosAbiertos.length}</span> <span className="text-[color:var(--muted-fg)] ml-2">proyectos en curso, pendientes o en revisión.</span></p>
          </Panel>
          <Panel title="Documentos en sistema">
            <p className="px-4 py-3 text-sm"><span className="font-display text-3xl">{DOCUMENTS.length}</span> <span className="text-[color:var(--muted-fg)] ml-2">archivos asociados a proyectos.</span></p>
          </Panel>
          <Panel title="Cobertura">
            <p className="px-4 py-3 text-sm"><span className="font-display text-3xl">{CLIENTS.length}</span> clientes · <span className="font-display text-3xl">{PLANTS.length}</span> plantas activas.</p>
          </Panel>
        </div>
      )}
    </div>
  );
}
