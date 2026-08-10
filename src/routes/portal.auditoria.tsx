import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { CheckCircle2, RefreshCw, Search, XCircle } from "lucide-react";
import { erpAuditTrail } from "@/lib/erp-admin.functions";
import { usePortalSession } from "@/hooks/use-portal-session";
import { NoAccess } from "@/components/portal/PortalUI";

export const Route = createFileRoute("/portal/auditoria")({
  component: AuditoriaPage,
  head: () => ({
    meta: [
      { title: "Auditoría de integraciones · Portal KG Safety" },
      { name: "robots", content: "noindex,nofollow" },
      {
        name: "description",
        content: "Cada llamada a ERP y facturación con endpoint, status, latencia y correlación.",
      },
    ],
  }),
});

type Row = {
  id: string;
  created_at: string;
  trace_id: string;
  sistema: "erp" | "facturacion";
  operacion: string;
  stage: string;
  metodo: string;
  path: string;
  status_code: number | null;
  ok: boolean;
  duracion_ms: number;
  intento: number;
  error_code: string;
  error_message: string;
  modo: string;
  es_prueba: boolean;
  request: string | null;
  response: string | null;
};

type Resumen = { llamadas: number; errores: number; latencia: number };
type Trail = { total: number; resumen: { erp: Resumen; facturacion: Resumen }; filas: Row[] };

function json(v: string | null) {
  return v ?? "—";
}


function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div>
      <div className="font-display text-2xl text-white mt-1">{value}</div>
      {hint && <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{hint}</div>}
    </div>
  );
}

function RowDetail({ row }: { row: Row }) {
  return (
    <tr className="bg-black/40">
      <td colSpan={7} className="px-4 py-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Request (resumen)</div>
            <pre className="text-[11px] text-white/70 whitespace-pre-wrap break-all border border-white/10 p-3 max-h-64 overflow-auto">
              {json(row.request)}
            </pre>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Response (resumen)</div>
            <pre className="text-[11px] text-white/70 whitespace-pre-wrap break-all border border-white/10 p-3 max-h-64 overflow-auto">
              {json(row.response)}
            </pre>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-white/50 space-y-1">
          <p>
            Correlación: <span className="font-mono text-white/80">{row.trace_id || "—"}</span> · operación{" "}
            {row.operacion || "—"} · etapa {row.stage || "—"} · intento {row.intento} · modo {row.modo}
            {row.es_prueba ? " · registro de prueba" : ""}
          </p>
          {row.error_message && (
            <p className="text-red-300">
              {row.error_code}: {row.error_message}
            </p>
          )}
        </div>
      </td>
    </tr>
  );
}

function AuditoriaPage() {
  const { session } = usePortalSession();
  const staff = session?.role === "admin-kg" || session?.role === "equipo-kg";

  const [trail, setTrail] = useState<Trail | null>(null);
  const [sistema, setSistema] = useState<"todos" | "erp" | "facturacion">("todos");
  const [soloErrores, setSoloErrores] = useState(false);
  const [incluirPruebas, setIncluirPruebas] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [trace, setTrace] = useState("");
  const [abierto, setAbierto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const load = useCallback(async () => {
    setCargando(true);
    try {
      const data = await erpAuditTrail({
        data: {
          sistema,
          soloErrores,
          incluirPruebas,
          limite: 150,
          ...(trace.trim() ? { traceId: trace.trim() } : {}),
          ...(busqueda.trim() ? { busqueda: busqueda.trim() } : {}),
        },
      });
      setTrail(data as Trail);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar la auditoría");
    } finally {
      setCargando(false);
    }
  }, [sistema, soloErrores, incluirPruebas, trace, busqueda]);

  useEffect(() => {
    if (!staff) return;
    void load();
    const id = setInterval(() => void load(), 20_000);
    return () => clearInterval(id);
  }, [staff, load]);

  if (!staff) return <NoAccess message="Esta sección está reservada para el equipo KG Safety." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl uppercase text-white">Auditoría de integraciones</h1>
        <p className="text-sm text-white/60 mt-2 max-w-2xl">
          Cada llamada al ERP Noil y al servicio de facturación con su endpoint, código de respuesta,
          latencia, referencia de correlación y un resumen del request/response.
        </p>
      </div>

      {trail && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Metric label="ERP · llamadas" value={String(trail.resumen.erp.llamadas)} hint={`${trail.resumen.erp.errores} con error`} />
          <Metric label="ERP · latencia" value={`${trail.resumen.erp.latencia} ms`} hint="promedio de la muestra" />
          <Metric
            label="Facturación · llamadas"
            value={String(trail.resumen.facturacion.llamadas)}
            hint={`${trail.resumen.facturacion.errores} con error`}
          />
          <Metric label="Facturación · latencia" value={`${trail.resumen.facturacion.latencia} ms`} hint="promedio de la muestra" />
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 border border-white/10 bg-white/[0.03] p-4">
        <div>
          <label htmlFor="a-sistema" className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
            Sistema
          </label>
          <select
            id="a-sistema"
            value={sistema}
            onChange={(e) => setSistema(e.target.value as typeof sistema)}
            className="bg-black/40 border border-white/15 text-sm text-white px-3 py-2"
          >
            <option value="todos">Todos</option>
            <option value="erp">ERP Noil</option>
            <option value="facturacion">Facturación CFDI</option>
          </select>
        </div>
        <div>
          <label htmlFor="a-busqueda" className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
            Endpoint contiene
          </label>
          <input
            id="a-busqueda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="/api/facturar"
            className="bg-black/40 border border-white/15 text-sm text-white px-3 py-2 font-mono"
          />
        </div>
        <div>
          <label htmlFor="a-trace" className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
            Referencia (trace)
          </label>
          <input
            id="a-trace"
            value={trace}
            onChange={(e) => setTrace(e.target.value)}
            placeholder="kgq_…"
            className="bg-black/40 border border-white/15 text-sm text-white px-3 py-2 font-mono"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-white/70">
          <input type="checkbox" checked={soloErrores} onChange={(e) => setSoloErrores(e.target.checked)} />
          Solo errores
        </label>
        <label className="flex items-center gap-2 text-xs text-white/70">
          <input type="checkbox" checked={incluirPruebas} onChange={(e) => setIncluirPruebas(e.target.checked)} />
          Incluir pruebas
        </label>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-[11px] uppercase tracking-widest text-white hover:border-white/50"
        >
          {cargando ? <RefreshCw size={12} className="animate-spin" /> : <Search size={12} />} Actualizar
        </button>
      </div>

      {error && <p className="border border-red-500/40 bg-red-500/10 text-sm text-red-200 p-3">{error}</p>}

      <div className="border border-white/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-white/[0.04] text-[10px] uppercase tracking-widest text-white/50">
            <tr>
              <th className="text-left px-4 py-2">Fecha</th>
              <th className="text-left px-4 py-2">Sistema</th>
              <th className="text-left px-4 py-2">Endpoint</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Latencia</th>
              <th className="text-left px-4 py-2">Correlación</th>
              <th className="text-right px-4 py-2">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {(trail?.filas ?? []).map((r) => (
              <Fragment key={r.id}>
                <tr className="hover:bg-white/[0.03] align-top">
                  <td className="px-4 py-2.5 text-white/60 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString("es-MX")}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                        r.sistema === "facturacion"
                          ? "border-sky-400/40 text-sky-300 bg-sky-400/10"
                          : "border-white/20 text-white/70"
                      }`}
                    >
                      {r.sistema === "facturacion" ? "Facturación" : "ERP"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-white/80 break-all max-w-[320px]">
                    <span className="text-white/50">{r.metodo}</span> {r.path || "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 text-xs ${r.ok ? "text-emerald-300" : "text-red-300"}`}>
                      {r.ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {r.status_code ?? "sin respuesta"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-white/70">{r.duracion_ms} ms</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-white/60 break-all">{r.trace_id || "—"}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => setAbierto(abierto === r.id ? null : r.id)}
                      className="text-[10px] uppercase tracking-widest text-white/70 hover:text-white underline"
                    >
                      {abierto === r.id ? "Ocultar" : "Ver"}
                    </button>
                  </td>
                </tr>
                {abierto === r.id && <RowDetail row={r} />}
              </Fragment>
            ))}
            {trail && trail.filas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-xs text-white/50">
                  Sin llamadas registradas con estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
