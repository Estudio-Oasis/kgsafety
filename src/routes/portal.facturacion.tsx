import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Download } from "lucide-react";
import { usePortalSession } from "@/hooks/use-portal-session";
import { INVOICES, projectById, plantBySlug, fmtDate, fmtMoney } from "@/data/portal";
import { PageHeader, Panel, StatCard, StatusBadge, ActionBtn } from "@/components/portal/PortalUI";

export const Route = createFileRoute("/portal/facturacion")({
  component: FacturacionPortal,
});

function FacturacionPortal() {
  const { session } = usePortalSession();

  const visible = useMemo(() => {
    if (!session) return [];
    if (session.role === "cliente-corp") return INVOICES.filter((i) => i.clientSlug === session.clientSlug);
    if (session.role === "cliente-planta") {
      return INVOICES.filter((i) => projectById(i.projectId)?.plantSlug === session.plantSlug);
    }
    return INVOICES;
  }, [session]);

  const total = visible.reduce((s, i) => s + i.monto, 0);
  const pendiente = visible.filter((i) => i.status === "pendiente").reduce((s, i) => s + i.monto, 0);
  const vencida = visible.filter((i) => i.status === "vencida").reduce((s, i) => s + i.monto, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader eyebrow="Estado de cuenta" title="Facturación" subtitle="Facturas emitidas, pendientes y vencidas. PDF/XML simulados para prototipo." />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard label="Total facturado" value={fmtMoney(total)} />
        <StatCard label="Pendiente de pago" value={fmtMoney(pendiente)} tone={pendiente > 0 ? "warn" : "ok"} />
        <StatCard label="Vencido" value={fmtMoney(vencida)} tone={vencida > 0 ? "danger" : "ok"} />
      </div>

      <Panel title="Facturas">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
            <tr>
              <th className="text-left px-4 py-2 font-bold">Folio</th>
              <th className="text-left px-4 py-2 font-bold">Fecha</th>
              <th className="text-left px-4 py-2 font-bold">Proyecto</th>
              <th className="text-left px-4 py-2 font-bold">Planta</th>
              <th className="text-right px-4 py-2 font-bold">Monto</th>
              <th className="text-left px-4 py-2 font-bold">Estado</th>
              <th className="text-right px-4 py-2 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border)]">
            {visible.map((inv) => {
              const proj = projectById(inv.projectId);
              const plant = plantBySlug(proj?.plantSlug ?? "");
              return (
                <tr key={inv.folio} className="hover:bg-[color:var(--muted)]/20">
                  <td className="px-4 py-2.5 font-mono text-xs font-bold">{inv.folio}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(inv.fecha)}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)] truncate max-w-[260px]">{proj?.name}</td>
                  <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{plant?.name}</td>
                  <td className="px-4 py-2.5 text-right font-bold">{fmtMoney(inv.monto)}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge
                      state={inv.status === "pagada" ? "completado" : inv.status === "vencida" ? "vencido" : "pendiente"}
                      label={inv.status}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex gap-1.5">
                      <ActionBtn><Download size={11} /> PDF</ActionBtn>
                      <ActionBtn><Download size={11} /> XML</ActionBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
