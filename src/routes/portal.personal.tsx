import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { usePortalSession } from "@/hooks/use-portal-session";
import {
  WORKERS, PLANTS, plantBySlug, dc3State, fmtDate,
  type Worker, type CertState,
} from "@/data/portal";
import { PageHeader, Panel, StatCard, StatusBadge, ActionBtn } from "@/components/portal/PortalUI";
import { Download, Copy } from "lucide-react";

export const Route = createFileRoute("/portal/personal")({
  component: PersonalPage,
});

const STATE_LABEL: Record<CertState, string> = {
  vigente: "DC-3 vigente",
  "por-vencer-60": "DC-3 por vencer (60 d)",
  "por-vencer-30": "DC-3 por vencer (30 d)",
  vencido: "DC-3 vencido",
};

function daysLeft(w: Worker) {
  return Math.floor((new Date(w.vencimiento).getTime() - Date.now()) / 86400000);
}

function PersonalPage() {
  const { session } = usePortalSession();

  const workers = useMemo(() => {
    if (!session) return [];
    if (session.role === "cliente-corp" && session.clientSlug) {
      const slugs = PLANTS.filter((p) => p.clientSlug === session.clientSlug).map((p) => p.slug);
      return WORKERS.filter((w) => slugs.includes(w.plantSlug));
    }
    if (session.role === "cliente-planta" && session.plantSlug) {
      return WORKERS.filter((w) => w.plantSlug === session.plantSlug);
    }
    return WORKERS;
  }, [session]);

  const vigentes = workers.filter((w) => dc3State(w) === "vigente").length;
  const porVencer = workers.filter((w) => ["por-vencer-30", "por-vencer-60"].includes(dc3State(w))).length;
  const vencidos = workers.filter((w) => dc3State(w) === "vencido").length;

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Cumplimiento humano"
        title="Personal capacitado y DC-3"
        subtitle="Trabajadores certificados en trabajo seguro en alturas conforme NOM-009-STPS y vigencia de DC-3."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Personal capacitado" value={workers.length} />
        <StatCard label="DC-3 vigentes" value={vigentes} tone="ok" />
        <StatCard label="Por vencer" value={porVencer} tone="warn" />
        <StatCard label="DC-3 vencidos" value={vencidos} tone={vencidos ? "danger" : "neutral"} />
      </div>

      <Panel title="Trabajadores certificados">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="bg-[color:var(--muted)]/30 text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)]">
              <tr>
                <th className="text-left px-4 py-2 font-bold">Trabajador</th>
                <th className="text-left px-4 py-2 font-bold">Puesto</th>
                <th className="text-left px-4 py-2 font-bold">Planta</th>
                <th className="text-left px-4 py-2 font-bold">Curso</th>
                <th className="text-left px-4 py-2 font-bold">DC-3</th>
                <th className="text-left px-4 py-2 font-bold">Vigencia</th>
                <th className="text-left px-4 py-2 font-bold">Estado</th>
                <th className="text-right px-4 py-2 font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {workers.map((w) => {
                const st = dc3State(w);
                const dl = daysLeft(w);
                const hint = dl < 0 ? `Vencido hace ${Math.abs(dl)} d` : `${dl} días restantes`;
                return (
                  <tr key={w.id} className="hover:bg-[color:var(--muted)]/20">
                    <td className="px-4 py-2.5 font-bold">{w.nombre}</td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{w.puesto}</td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{plantBySlug(w.plantSlug)?.name}</td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">{w.curso}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{w.dc3}</td>
                    <td className="px-4 py-2.5 text-[color:var(--muted-fg)]">
                      {fmtDate(w.vencimiento)}<br />
                      <span className="text-[10px]">{hint}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge state={st} label={STATE_LABEL[st]} />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <ActionBtn variant={st === "vencido" ? "primary" : "ghost"}>
                        {st === "vencido" || st === "por-vencer-30" ? "Solicitar recap." : <><Download size={11} /> DC-3</>}
                      </ActionBtn>
                    </td>
                  </tr>
                );
              })}
              {workers.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-6 text-center text-xs text-[color:var(--muted-fg)]">Sin personal registrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
