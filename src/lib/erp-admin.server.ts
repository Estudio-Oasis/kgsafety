/**
 * Panel de operación del ERP (solo servidor): bitácora, cola y pruebas E2E.
 */

import { normalizeRfc } from "./rfc";
import {
  erpCtx,
  globalErpMode,
  newTraceId,
  processOutbox,
  type ReconcileResult,
} from "./erp-monitor.server";
import { submitQuote } from "./erp-submit.server";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function assertStaff(supabase: {
  rpc: (fn: "is_kg_staff", args: { _user_id: string }) => Promise<{ data: unknown }>;
}, userId: string) {
  const { data } = await supabase.rpc("is_kg_staff", { _user_id: userId });
  if (data !== true) throw new Error("Forbidden");
}

export type ErpMonitorSnapshot = {
  modo: string;
  metricas: {
    llamadas24h: number;
    errores24h: number;
    tasaError: number;
    latenciaPromedio: number;
    reintentos24h: number;
    colaPendiente: number;
    colaFallida: number;
    alertasAbiertas: number;
    estado: "operativo" | "degradado" | "caido";
  };
  logs: Array<{
    id: string;
    created_at: string;
    trace_id: string;
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
  }>;
  cola: Array<{
    id: string;
    created_at: string;
    lead_id: string | null;
    tipo: string;
    estado: string;
    intentos: number;
    max_intentos: number;
    next_attempt_at: string;
    last_error: string;
    trace_id: string;
    modo: string;
    es_prueba: boolean;
  }>;
  alertas: Array<{
    id: string;
    created_at: string;
    tipo: string;
    severidad: string;
    titulo: string;
    mensaje: string;
    trace_id: string;
    resuelta: boolean;
  }>;
};

export async function getMonitorSnapshot(opts: {
  incluirPruebas: boolean;
  traceId?: string;
}): Promise<ErpMonitorSnapshot> {
  const db = await admin();
  const desde = new Date(Date.now() - 24 * 3600_000).toISOString();

  let logsQuery = db
    .from("erp_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(120);
  if (!opts.incluirPruebas) logsQuery = logsQuery.eq("es_prueba", false);
  if (opts.traceId) logsQuery = logsQuery.eq("trace_id", opts.traceId);

  const [{ data: logs }, { data: ventana }, { data: cola }, { data: alertas }] = await Promise.all([
    logsQuery,
    db.from("erp_logs").select("ok,duracion_ms,intento,es_prueba").gte("created_at", desde),
    db.from("erp_outbox").select("*").order("next_attempt_at", { ascending: true }).limit(60),
    db.from("erp_alerts").select("*").order("created_at", { ascending: false }).limit(40),
  ]);

  const muestra = (ventana ?? []).filter((r) => opts.incluirPruebas || !r.es_prueba);
  const llamadas = muestra.length;
  const errores = muestra.filter((r) => !r.ok).length;
  const reintentos = muestra.filter((r) => (r.intento ?? 1) > 1).length;
  const latencia = llamadas
    ? Math.round(muestra.reduce((a, r) => a + (r.duracion_ms ?? 0), 0) / llamadas)
    : 0;
  const tasaError = llamadas ? Math.round((errores / llamadas) * 1000) / 10 : 0;
  const colaPendiente = (cola ?? []).filter((c) => c.estado === "pendiente").length;
  const colaFallida = (cola ?? []).filter((c) => c.estado === "fallido").length;
  const alertasAbiertas = (alertas ?? []).filter((a) => !a.resuelta).length;

  const estado: "operativo" | "degradado" | "caido" =
    tasaError >= 50 || colaFallida > 0 ? "caido" : tasaError > 5 || colaPendiente > 0 ? "degradado" : "operativo";

  return {
    modo: globalErpMode(),
    metricas: {
      llamadas24h: llamadas,
      errores24h: errores,
      tasaError,
      latenciaPromedio: latencia,
      reintentos24h: reintentos,
      colaPendiente,
      colaFallida,
      alertasAbiertas,
      estado,
    },
    logs: (logs ?? []) as ErpMonitorSnapshot["logs"],
    cola: (cola ?? []) as ErpMonitorSnapshot["cola"],
    alertas: (alertas ?? []) as ErpMonitorSnapshot["alertas"],
  };
}

/** Fuerza el reintento inmediato de un elemento de la cola. */
export async function retryOutboxItem(id: string): Promise<ReconcileResult> {
  const db = await admin();
  await db
    .from("erp_outbox")
    .update({ estado: "pendiente", next_attempt_at: new Date().toISOString() })
    .eq("id", id);
  return processOutbox(1);
}

export async function runReconcile(limit = 10) {
  return processOutbox(limit);
}

export async function resolveAlert(id: string) {
  const db = await admin();
  await db
    .from("erp_alerts")
    .update({ resuelta: true, resuelta_at: new Date().toISOString() })
    .eq("id", id);
  return { ok: true as const };
}

// ---------- Pruebas end-to-end (staging: nunca escribe en Noil) ----------

export type E2EStep = {
  paso: string;
  ok: boolean;
  detalle: string;
};

export type E2EReport = {
  modo: string;
  traceId: string;
  ok: boolean;
  pasos: E2EStep[];
};

/**
 * Corre el flujo completo (buscar/crear cliente -> cotización -> agendar fecha)
 * en modo staging y verifica que la escritura en NUESTRA base ocurra siempre.
 */
export async function runE2ETests(): Promise<E2EReport> {
  const traceId = newTraceId();
  const pasos: E2EStep[] = [];
  const db = await admin();

  // Lectura real contra Noil (no genera registros).
  try {
    const { listCourses } = await import("./erp.server");
    const cursos = await erpCtx.run(
      { traceId, leadId: null, operacion: "e2e_lectura", modo: "live", esPrueba: true, intento: 1 },
      () => listCourses(),
    );
    pasos.push({
      paso: "Lectura de catálogo en Noil (real)",
      ok: cursos.length > 0,
      detalle: `${cursos.length} cursos visibles`,
    });
  } catch (e) {
    pasos.push({ paso: "Lectura de catálogo en Noil (real)", ok: false, detalle: String(e).slice(0, 200) });
  }

  // Flujo de escritura simulado: crear cliente + cotización + agendar fecha.
  const fecha = new Date(Date.now() + 30 * 86400_000).toISOString().slice(0, 10);
  const resultado = await submitQuote(
    {
      rfc: normalizeRfc("XAXX010101000"),
      empresa: "PRUEBA E2E STAGING",
      nombre: "Prueba automatizada",
      correo: "qa@kg-safety.com",
      telefono: "7228795076",
      idCurso: 1,
      idServicio: 0,
      participantes: 1,
      lugarCurso: "Local",
      tipoCursoCliente: "Cerrado",
      lugarServicio: "Staging",
      comentarios: `Prueba E2E automatizada (${traceId}). No procesar.`,
      fechaDeseada: fecha,
      idContratista: 0,
      nombreContratista: "",
      folioCurso: "",
    },
    { modo: "staging", origen: "prueba-e2e", esPrueba: true },
  );

  pasos.push({
    paso: "Alta de cliente + cotización + agenda (staging)",
    ok: resultado.ok,
    detalle: `${resultado.code} · folio ${resultado.folio ?? "-"} · ${resultado.message}`.slice(0, 240),
  });

  // Verificación obligatoria: la solicitud existe en NUESTRA base.
  const { data: lead } = resultado.leadId
    ? await db.from("leads").select("id,erp_status,erp_folio,modo,es_prueba").eq("id", resultado.leadId).maybeSingle()
    : { data: null };
  pasos.push({
    paso: "Escritura en nuestra base (leads)",
    ok: Boolean(lead),
    detalle: lead
      ? `lead ${lead.id.slice(0, 8)} · estatus ${lead.erp_status} · modo ${lead.modo}`
      : "No se encontró el registro propio",
  });

  const { data: bitacora } = await db.from("erp_logs").select("id").eq("trace_id", traceId);
  pasos.push({
    paso: "Bitácora con trace ID",
    ok: (bitacora ?? []).length > 0,
    detalle: `${(bitacora ?? []).length} entradas para ${traceId}`,
  });

  return { modo: "staging", traceId, ok: pasos.every((p) => p.ok), pasos };
}
