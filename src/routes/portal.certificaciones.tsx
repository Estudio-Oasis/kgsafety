import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { usePortalSession } from "@/hooks/use-portal-session";
import {
  CERTIFICATIONS,
  plantBySlug,
  systemById,
  certState,
  daysLeft,
  fmtDate,
  type CertState,
} from "@/data/portal";
import { PageHeader, Panel, StatusBadge, ActionBtn } from "@/components/portal/PortalUI";
import { Download } from "lucide-react";

export const Route = createFileRoute("/portal/certificaciones")({
  component: CertsPage,
});

const GROUPS: { key: CertState; label: string; tone: "danger" | "warn" | "ok" | "neutral" }[] = [
  { key: "vencido", label: "Vencidas — acción inmediata", tone: "danger" },
  { key: "por-vencer-30", label: "Por vencer en 30 días", tone: "warn" },
  { key: "por-vencer-60", label: "Por vencer en 60 días", tone: "warn" },
  { key: "vigente", label: "Vigentes", tone: "ok" },
];

function CertsPage() {
  const { session } = usePortalSession();

  const visible = useMemo(() => {
    if (!session) return [];
    if (session.role === "cliente-corp") {
      return CERTIFICATIONS.filter((c) => plantBySlug(c.plantSlug)?.clientSlug === session.clientSlug);
    }
    if (session.role === "cliente-planta") return CERTIFICATIONS.filter((c) => c.plantSlug === session.plantSlug);
    return CERTIFICATIONS;
  }, [session]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader eyebrow="Cumplimiento" title="Certificaciones y vencimientos" subtitle="Estado de cumplimiento por sistema instalado, ordenado por urgencia." />

      <div className="space-y-4">
        {GROUPS.map((g) => {
          const items = visible.filter((c) => certState(c) === g.key);
          if (items.length === 0) return null;
          return (
            <Panel key={g.key} title={`${g.label} · ${items.length}`}>
              <table className="w-full text-sm">
                <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
                  <tr>
                    <th className="text-left px-4 py-2 font-bold">Sistema</th>
                    <th className="text-left px-4 py-2 font-bold">Planta</th>
                    <th className="text-left px-4 py-2 font-bold">Última cert.</th>
                    <th className="text-left px-4 py-2 font-bold">Vencimiento</th>
                    <th className="text-left px-4 py-2 font-bold">Estado</th>
                    <th className="text-right px-4 py-2 font-bold">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--border)]">
                  {items.map((c) => {
                    const sys = systemById(c.systemId);
                    const plant = plantBySlug(c.plantSlug);
                    const dl = daysLeft(c);
                    return (
                      <tr key={c.id} className="hover:bg-[color:var(--muted)]/20">
                        <td className="px-4 py-2.5 font-bold">{sys?.type}</td>
                        <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{plant?.name}</td>
                        <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(c.ultima)}</td>
                        <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{fmtDate(c.vencimiento)}</td>
                        <td className="px-4 py-2.5">
                          <StatusBadge state={g.key} label={dl < 0 ? `${Math.abs(dl)}d vencido` : `${dl}d restantes`} />
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <ActionBtn variant={g.tone === "danger" ? "primary" : "ghost"}>
                            {g.key === "vencido" || g.key === "por-vencer-30" ? "Solicitar recert." : <><Download size={11} /> Certificado</>}
                          </ActionBtn>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
