/**
 * Monitoreo, reintentos y reconciliación del ERP (solo servidor).
 *
 * Principio: la solicitud SIEMPRE se guarda en nuestra base. El ERP Noil es un
 * destino de sincronización; si falla, la solicitud queda en la cola (outbox)
 * y se reintenta con backoff exponencial hasta que Noil vuelva.
 */

import { AsyncLocalStorage } from "node:async_hooks";

export type ErpMode = "live" | "staging";

export type ErpCtx = {
  traceId: string;
  leadId: string | null;
  operacion: string;
  modo: ErpMode;
  esPrueba: boolean;
  intento: number;
};

export const erpCtx = new AsyncLocalStorage<ErpCtx>();

export function newTraceId() {
  return `kgq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Modo global: `ERP_MODE=staging` evita cualquier escritura real en Noil. */
export function globalErpMode(): ErpMode {
  return process.env.ERP_MODE === "staging" ? "staging" : "live";
}

export function currentMode(): ErpMode {
  return erpCtx.getStore()?.modo ?? globalErpMode();
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export type ErpLogEntry = {
  operacion?: string;
  stage?: string;
  metodo?: string;
  path?: string;
  status_code?: number | null;
  ok?: boolean;
  duracion_ms?: number;
  intento?: number;
  error_code?: string;
  error_message?: string;
  detalle?: Record<string, unknown>;
};

/** Escribe una línea de bitácora. Nunca lanza: el monitoreo no rompe el flujo. */
export async function logErpCall(entry: ErpLogEntry) {
  const ctx = erpCtx.getStore();
  const row = {
    trace_id: ctx?.traceId ?? "",
    lead_id: ctx?.leadId ?? null,
    operacion: entry.operacion ?? ctx?.operacion ?? "",
    stage: entry.stage ?? "",
    metodo: entry.metodo ?? "GET",
    path: (entry.path ?? "").slice(0, 300),
    status_code: entry.status_code ?? null,
    ok: entry.ok ?? false,
    duracion_ms: Math.round(entry.duracion_ms ?? 0),
    intento: entry.intento ?? ctx?.intento ?? 1,
    error_code: (entry.error_code ?? "").slice(0, 120),
    error_message: (entry.error_message ?? "").slice(0, 500),
    modo: ctx?.modo ?? globalErpMode(),
    es_prueba: ctx?.esPrueba ?? false,
    detalle: entry.detalle ?? {},
  };
  console.log(
    `[erp][${row.trace_id}][${row.stage || row.operacion}] ${row.metodo} ${row.path} -> ${row.status_code ?? "-"} (${row.duracion_ms}ms, intento ${row.intento}, ${row.modo})`,
  );
  try {
    const db = await admin();
    await db.from("erp_logs").insert(row);
  } catch (e) {
    console.error("[erp-monitor] no se pudo escribir la bitácora", e);
  }
}

export async function raiseAlert(input: {
  tipo: "erp_error" | "erp_reintento" | "erp_cola" | "erp_recuperado";
  severidad?: "alta" | "media" | "baja";
  titulo: string;
  mensaje: string;
  leadId?: string | null;
}) {
  const ctx = erpCtx.getStore();
  try {
    const db = await admin();
    await db.from("erp_alerts").insert({
      tipo: input.tipo,
      severidad: input.severidad ?? (input.tipo === "erp_error" ? "alta" : "media"),
      titulo: input.titulo.slice(0, 160),
      mensaje: input.mensaje.slice(0, 600),
      trace_id: ctx?.traceId ?? "",
      lead_id: input.leadId ?? ctx?.leadId ?? null,
      es_prueba: ctx?.esPrueba ?? false,
    });
  } catch (e) {
    console.error("[erp-monitor] no se pudo registrar la alerta", e);
  }
}

/** Reintentos con backoff exponencial + jitter para operaciones idempotentes. */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: { intentos?: number; baseMs?: number; stage?: string; operacion?: string },
): Promise<T> {
  const intentos = opts.intentos ?? 3;
  let lastError: unknown;
  for (let i = 1; i <= intentos; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (i === intentos) break;
      const espera = (opts.baseMs ?? 400) * 2 ** (i - 1) + Math.floor(Math.random() * 200);
      await logErpCall({
        operacion: opts.operacion,
        stage: opts.stage ?? "reintento",
        ok: false,
        intento: i,
        error_code: "reintentable",
        error_message: String(e).slice(0, 300),
        detalle: { esperaMs: espera },
      });
      await raiseAlert({
        tipo: "erp_reintento",
        severidad: "media",
        titulo: `Reintento ${i}/${intentos} en ${opts.stage ?? "ERP"}`,
        mensaje: String(e).slice(0, 400),
      });
      await new Promise((r) => setTimeout(r, espera));
    }
  }
  throw lastError;
}

// ---------- Cola de sincronización (outbox) ----------

const BACKOFF_MIN = [1, 5, 15, 60, 180, 480];

export async function enqueueOutbox(input: {
  leadId: string | null;
  tipo?: string;
  payload: Record<string, unknown>;
  traceId: string;
  error: string;
  modo?: ErpMode;
  esPrueba?: boolean;
}) {
  try {
    const db = await admin();
    await db.from("erp_outbox").insert({
      lead_id: input.leadId,
      tipo: input.tipo ?? "cotizacion",
      payload: input.payload,
      estado: "pendiente",
      intentos: 1,
      next_attempt_at: new Date(Date.now() + BACKOFF_MIN[0]! * 60_000).toISOString(),
      last_error: input.error.slice(0, 400),
      trace_id: input.traceId,
      modo: input.modo ?? globalErpMode(),
      es_prueba: input.esPrueba ?? false,
    });
    await raiseAlert({
      tipo: "erp_cola",
      severidad: "alta",
      titulo: "Solicitud en cola de sincronización",
      mensaje: `La solicitud quedó guardada en nuestra base y se reintentará automáticamente. Motivo: ${input.error}`.slice(0, 500),
      leadId: input.leadId,
    });
  } catch (e) {
    console.error("[erp-monitor] no se pudo encolar la solicitud", e);
  }
}

export type ReconcileResult = {
  procesados: number;
  sincronizados: number;
  reprogramados: number;
  fallidos: number;
  detalle: Array<{ id: string; estado: string; mensaje: string }>;
};

/** Reprocesa la cola: cada elemento vuelve a intentar contra el ERP. */
export async function processOutbox(limit = 10): Promise<ReconcileResult> {
  const out: ReconcileResult = {
    procesados: 0,
    sincronizados: 0,
    reprogramados: 0,
    fallidos: 0,
    detalle: [],
  };
  const db = await admin();
  const { data: pendientes, error } = await db
    .from("erp_outbox")
    .select("*")
    .eq("estado", "pendiente")
    .lte("next_attempt_at", new Date().toISOString())
    .order("next_attempt_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[erp-monitor] no se pudo leer la cola", error);
    return out;
  }

  const { createQuote } = await import("./erp.server");
  const { attachErpOutcome, logLeadEvent } = await import("./leads.server");

  for (const item of pendientes ?? []) {
    out.procesados++;
    const intento = (item.intentos ?? 0) + 1;
    const traceId = newTraceId();
    try {
      const result = await erpCtx.run(
        {
          traceId,
          leadId: item.lead_id ?? null,
          operacion: "reconciliacion",
          modo: (item.modo as ErpMode) ?? globalErpMode(),
          esPrueba: Boolean(item.es_prueba),
          intento,
        },
        () => createQuote(item.payload as never, { traceId }),
      );

      await db
        .from("erp_outbox")
        .update({ estado: "completado", intentos: intento, last_error: "" })
        .eq("id", item.id);
      await attachErpOutcome(item.lead_id ?? null, {
        erp_status: result.status === "creada" ? "creada" : "pendiente_verificacion",
        erp_folio: result.folio ?? (result.idSolicitud ? String(result.idSolicitud) : ""),
        erp_solicitud_id: result.idSolicitud ? String(result.idSolicitud) : "",
        erp_trace_id: traceId,
      });
      if (item.lead_id) {
        await logLeadEvent(
          item.lead_id,
          "reconciliacion",
          `Sincronizada con el ERP en el intento ${intento}.`,
        );
      }
      await raiseAlert({
        tipo: "erp_recuperado",
        severidad: "baja",
        titulo: "Solicitud sincronizada con el ERP",
        mensaje: `La solicitud en cola se sincronizó correctamente (intento ${intento}).`,
        leadId: item.lead_id ?? null,
      });
      out.sincronizados++;
      out.detalle.push({ id: item.id, estado: "completado", mensaje: "Sincronizada" });
    } catch (e) {
      const mensaje = String(e instanceof Error ? e.message : e).slice(0, 400);
      const agotado = intento >= (item.max_intentos ?? 6);
      const esperaMin = BACKOFF_MIN[Math.min(intento, BACKOFF_MIN.length - 1)]!;
      await db
        .from("erp_outbox")
        .update({
          estado: agotado ? "fallido" : "pendiente",
          intentos: intento,
          last_error: mensaje,
          next_attempt_at: new Date(Date.now() + esperaMin * 60_000).toISOString(),
        })
        .eq("id", item.id);
      if (item.lead_id) {
        await logLeadEvent(
          item.lead_id,
          "reconciliacion",
          agotado
            ? `El ERP no aceptó la solicitud tras ${intento} intentos: ${mensaje}`
            : `Intento ${intento} fallido; se reintentará en ${esperaMin} min.`,
        );
      }
      await raiseAlert({
        tipo: agotado ? "erp_error" : "erp_reintento",
        severidad: agotado ? "alta" : "media",
        titulo: agotado
          ? "Solicitud sin sincronizar (atención manual)"
          : `Reintento ${intento} fallido`,
        mensaje: mensaje,
        leadId: item.lead_id ?? null,
      });
      if (agotado) out.fallidos++;
      else out.reprogramados++;
      out.detalle.push({
        id: item.id,
        estado: agotado ? "fallido" : "reprogramado",
        mensaje,
      });
    }
  }
  return out;
}
