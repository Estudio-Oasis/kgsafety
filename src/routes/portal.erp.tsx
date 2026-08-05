import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  PlugZap,
  RefreshCw,
  RotateCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  erpAiSummary,
  erpHealthcheck,
  erpMonitorSnapshot,
  erpPurgeTestData,
  erpResolveAlert,
  erpRetryOutbox,
  erpRunE2E,
  erpRunReconcile,
} from "@/lib/erp-admin.functions";
import { AiSummaryPanel } from "@/components/portal/AiSummaryPanel";

import { usePortalSession } from "@/hooks/use-portal-session";
import { NoAccess } from "@/components/portal/PortalUI";

export const Route = createFileRoute("/portal/erp")({
  component: ErpMonitorPage,
  head: () => ({
    meta: [
      { title: "Monitoreo ERP · Portal KG Safety" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "description", content: "Bitácora, reintentos y alertas de la integración con el ERP." },
    ],
  }),
});

type Snapshot = Awaited<ReturnType<typeof erpMonitorSnapshot>>;
type E2EReport = Awaited<ReturnType<typeof erpRunE2E>>;
type Health = Awaited<ReturnType<typeof erpHealthcheck>>;


const estadoStyles: Record<string, string> = {
  operativo: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  degradado: "bg-signal/15 text-signal border-signal/40",
  caido: "bg-red-500/15 text-red-300 border-red-500/40",
};

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div>
      <div className="font-display text-2xl text-white mt-1">{value}</div>
      {hint && <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{hint}</div>}
    </div>
  );
}

function ErpMonitorPage() {
  const { session } = usePortalSession();
  const role = session?.role;
  const staff = role === "admin-kg" || role === "equipo-kg";

  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [incluirPruebas, setIncluirPruebas] = useState(false);
  const [trace, setTrace] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [e2e, setE2e] = useState<E2EReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [healthBusy, setHealthBusy] = useState(false);

  const checkHealth = useCallback(async () => {
    setHealthBusy(true);
    try {
      setHealth(await erpHealthcheck({ data: undefined }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo verificar la conexión");
    } finally {
      setHealthBusy(false);
    }
  }, []);


  const load = useCallback(async () => {
    try {
      const data = await erpMonitorSnapshot({
        data: { incluirPruebas, ...(trace.trim() ? { traceId: trace.trim() } : {}) },
      });
      setSnap(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el monitoreo");
    }
  }, [incluirPruebas, trace]);

  useEffect(() => {
    if (!staff) return;
    void load();
    void checkHealth();
    const id = setInterval(() => void load(), 10_000);
    const hid = setInterval(() => void checkHealth(), 60_000);
    return () => {
      clearInterval(id);
      clearInterval(hid);
    };
  }, [staff, load, checkHealth]);


  if (!staff) {
    return (
      <NoAccess message="Esta sección está reservada para el equipo KG Safety." />
    );
  }

  async function act(key: string, fn: () => Promise<unknown>) {
    setBusy(key);
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operación fallida");
    } finally {
      setBusy(null);
    }
  }

  const m = snap?.metricas;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl uppercase text-white">Monitoreo ERP</h1>
          <p className="text-sm text-white/60 mt-2 max-w-2xl">
            Cada interacción con Noil queda registrada con su referencia técnica. Si el ERP falla, la
            solicitud se guarda en nuestra base y se sincroniza automáticamente al volver.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
              estadoStyles[m?.estado ?? "operativo"]
            }`}
          >
            {m?.estado ?? "—"}
          </span>
          <span className="border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/60">
            Modo {snap?.modo ?? "—"}
          </span>
          <button
            type="button"
            onClick={() => void load()}
            className="border border-white/20 p-2 text-white/70 hover:text-signal"
            aria-label="Actualizar"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {error && (
        <div className="border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
      )}

      <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-base uppercase text-white flex items-center gap-2">
              <PlugZap size={15} className="text-signal shrink-0" /> Conexión en vivo con Noil
            </h2>
            <p className="text-xs text-white/60 mt-1.5 max-w-xl">
              Prueba real contra el ERP: autenticación y lectura de catálogos. No usa datos simulados.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
                health === null
                  ? "border-white/15 text-white/50"
                  : health.conectado
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                    : "bg-red-500/15 text-red-300 border-red-500/40"
              }`}
            >
              {health === null ? "verificando…" : health.conectado ? "Conectado" : "Sin conexión"}
            </span>
            <button
              type="button"
              onClick={() => void checkHealth()}
              disabled={healthBusy}
              className="border border-white/20 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-signal disabled:opacity-50"
            >
              Probar ahora
            </button>
          </div>
        </div>

        {health && (
          <>
            <div className="mt-4 grid sm:grid-cols-2 gap-2">
              {health.pruebas.map((p) => (
                <div
                  key={p.nombre}
                  className="flex items-start gap-2.5 border border-white/10 bg-white/[0.03] px-3 py-2.5"
                >
                  {p.ok ? (
                    <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm text-white font-bold">{p.nombre}</div>
                    <div className="text-[11px] text-white/55 break-words">
                      {p.detalle} · {p.ms} ms{p.status ? ` · HTTP ${p.status}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-widest text-white/40">
              {health.host} · latencia media {health.latenciaMs} ms · verificado{" "}
              {new Date(health.verificadoAt).toLocaleTimeString("es-MX")}
            </p>
          </>
        )}
      </section>

      <AiSummaryPanel
        titulo="Resumen con IA del estado del ERP"
        descripcion="La IA lee la conexión en vivo, las métricas, la cola y los últimos errores, y te dice en lenguaje claro qué está pasando y qué hacer."
        run={() => erpAiSummary({ data: { incluirPruebas } })}
      />


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric label="Llamadas 24 h" value={String(m?.llamadas24h ?? 0)} />
        <Metric label="Errores 24 h" value={String(m?.errores24h ?? 0)} hint={`${m?.tasaError ?? 0}% del total`} />
        <Metric label="Latencia media" value={`${m?.latenciaPromedio ?? 0} ms`} />
        <Metric label="Reintentos 24 h" value={String(m?.reintentos24h ?? 0)} />
        <Metric label="En cola" value={String(m?.colaPendiente ?? 0)} hint="por sincronizar" />
        <Metric label="Cola fallida" value={String(m?.colaFallida ?? 0)} hint="requiere revisión" />
        <Metric label="Alertas abiertas" value={String(m?.alertasAbiertas ?? 0)} />
        <div className="border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-2">
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void act("reconcile", () => erpRunReconcile({ data: undefined }))}
            className="flex items-center justify-center gap-2 bg-signal text-[color:var(--anchor-fixed)] px-3 py-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
          >
            <RotateCw size={12} /> Reconciliar cola
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() =>
              void act("e2e", async () => {
                setE2e(await erpRunE2E({ data: undefined }));
              })
            }
            className="flex items-center justify-center gap-2 border border-white/20 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:text-signal disabled:opacity-50"
          >
            <FlaskConical size={12} /> Prueba E2E (staging)
          </button>
        </div>
      </div>

      {e2e && (
        <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-base uppercase text-white">
              Prueba end-to-end · {e2e.ok ? "OK" : "con hallazgos"}
            </h2>
            <span className="text-[10px] uppercase tracking-widest text-white/40">{e2e.traceId}</span>
          </div>
          <ul className="space-y-2">
            {e2e.pasos.map((p) => (
              <li key={p.paso} className="flex items-start gap-3 text-sm">
                {p.ok ? (
                  <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                )}
                <span className="text-white/80">
                  <span className="font-bold">{p.paso}</span>
                  <span className="text-white/50"> — {p.detalle}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] uppercase tracking-widest text-white/40">
            Modo staging: las escrituras se simulan y no generan registros en Noil.
          </p>
        </section>
      )}

      {(snap?.alertas.filter((a) => !a.resuelta).length ?? 0) > 0 && (
        <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <h2 className="font-display text-base uppercase text-white mb-4">Alertas abiertas</h2>
          <div className="space-y-2">
            {snap!.alertas
              .filter((a) => !a.resuelta)
              .map((a) => (
                <div
                  key={a.id}
                  className="border border-white/10 bg-white/[0.03] p-4 flex flex-wrap items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        size={14}
                        className={a.severidad === "alta" ? "text-red-400" : "text-signal"}
                      />
                      <span className="font-bold text-sm text-white">{a.titulo}</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/40">{a.tipo}</span>
                    </div>
                    <p className="text-xs text-white/60 mt-1 break-words">{a.mensaje}</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/35 mt-1">
                      {new Date(a.created_at).toLocaleString("es-MX")} · {a.trace_id || "sin trace"}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void act(`alert-${a.id}`, () => erpResolveAlert({ data: { id: a.id } }))}
                    className="border border-white/20 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-signal disabled:opacity-50"
                  >
                    Marcar resuelta
                  </button>
                </div>
              ))}
          </div>
        </section>
      )}

      <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <h2 className="font-display text-base uppercase text-white mb-4">Cola de sincronización</h2>
        {snap?.cola.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10">
                  <th className="text-left py-2 pr-4">Creada</th>
                  <th className="text-left py-2 pr-4">Estado</th>
                  <th className="text-left py-2 pr-4">Intentos</th>
                  <th className="text-left py-2 pr-4">Próximo intento</th>
                  <th className="text-left py-2 pr-4">Último error</th>
                  <th className="text-right py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {snap.cola.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 text-white/75">
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {new Date(c.created_at).toLocaleString("es-MX")}
                    </td>
                    <td className="py-2 pr-4 uppercase text-[11px] tracking-widest">
                      {c.estado}
                      {c.es_prueba && <span className="text-white/40"> · prueba</span>}
                    </td>
                    <td className="py-2 pr-4">
                      {c.intentos}/{c.max_intentos}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {new Date(c.next_attempt_at).toLocaleString("es-MX")}
                    </td>
                    <td className="py-2 pr-4 max-w-[280px] truncate" title={c.last_error}>
                      {c.last_error || "—"}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        type="button"
                        disabled={busy !== null || c.estado === "completado"}
                        onClick={() => void act(`retry-${c.id}`, () => erpRetryOutbox({ data: { id: c.id } }))}
                        className="border border-white/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-signal disabled:opacity-40"
                      >
                        Reintentar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-white/50">Sin solicitudes pendientes de sincronizar.</p>
        )}
      </section>

      <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-display text-base uppercase text-white flex items-center gap-2">
            <Activity size={16} className="text-signal" /> Bitácora de interacciones
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center border border-white/15 px-3">
              <Search size={12} className="text-white/40" />
              <input
                value={trace}
                onChange={(e) => setTrace(e.target.value)}
                placeholder="Buscar por referencia técnica"
                aria-label="Buscar por referencia técnica"
                className="bg-transparent px-2 py-2 text-xs text-white outline-none w-56"
              />
            </div>
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50">
              <input
                type="checkbox"
                checked={incluirPruebas}
                onChange={(e) => setIncluirPruebas(e.target.checked)}
              />
              Incluir pruebas
            </label>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => {
                if (!window.confirm("¿Borrar de forma definitiva todos los registros marcados como prueba?")) return;
                void act("purge", async () => {
                  await erpPurgeTestData({ data: undefined });
                  setIncluirPruebas(false);
                });
              }}
              className="flex items-center gap-1.5 border border-white/20 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-red-300 hover:border-red-400/50 disabled:opacity-50"
            >
              <Trash2 size={11} /> Borrar datos de prueba
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10">
                <th className="text-left py-2 pr-4">Hora</th>
                <th className="text-left py-2 pr-4">Etapa</th>
                <th className="text-left py-2 pr-4">Método / ruta</th>
                <th className="text-left py-2 pr-4">Estatus</th>
                <th className="text-left py-2 pr-4">ms</th>
                <th className="text-left py-2 pr-4">Intento</th>
                <th className="text-left py-2">Referencia técnica</th>
              </tr>
            </thead>
            <tbody>
              {(snap?.logs ?? []).map((l) => (
                <tr key={l.id} className="border-b border-white/5 text-white/75">
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {new Date(l.created_at).toLocaleTimeString("es-MX")}
                  </td>
                  <td className="py-2 pr-4 uppercase text-[11px] tracking-widest">
                    {l.stage || l.operacion}
                    {l.es_prueba && <span className="text-white/40"> · prueba</span>}
                  </td>
                  <td className="py-2 pr-4 max-w-[280px] truncate" title={`${l.metodo} ${l.path}`}>
                    <span className="text-white/50">{l.metodo}</span> {l.path || "—"}
                  </td>
                  <td className="py-2 pr-4">
                    <span className={l.ok ? "text-emerald-300" : "text-red-300"}>
                      {l.status_code ?? (l.ok ? "OK" : "ERR")}
                    </span>
                    {l.error_code && <span className="text-white/40"> · {l.error_code}</span>}
                  </td>
                  <td className="py-2 pr-4">{l.duracion_ms}</td>
                  <td className="py-2 pr-4">{l.intento}</td>
                  <td className="py-2 font-mono text-[11px] text-white/50">{l.trace_id || "—"}</td>
                </tr>
              ))}
              {!snap?.logs.length && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-sm text-white/40">
                    Sin registros para el filtro actual.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-widest text-white/35">
          Actualización automática cada 10 segundos.
        </p>
      </section>
    </div>
  );
}
