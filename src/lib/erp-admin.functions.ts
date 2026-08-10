import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Panel de monitoreo del ERP: métricas, bitácora, cola y alertas. Solo equipo KG. */
export const erpMonitorSnapshot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        incluirPruebas: z.boolean().default(false),
        traceId: z.string().trim().max(60).optional(),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { assertStaff, getMonitorSnapshot } = await import("./erp-admin.server");
    await assertStaff(context.supabase as never, context.userId);
    return getMonitorSnapshot({ incluirPruebas: data.incluirPruebas, traceId: data.traceId });
  });

/** Reintento manual inmediato de un elemento de la cola. */
export const erpRetryOutbox = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { assertStaff, retryOutboxItem } = await import("./erp-admin.server");
    await assertStaff(context.supabase as never, context.userId);
    return retryOutboxItem(data.id);
  });

/** Corre la reconciliación completa de la cola bajo demanda. */
export const erpRunReconcile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertStaff, runReconcile } = await import("./erp-admin.server");
    await assertStaff(context.supabase as never, context.userId);
    return runReconcile(20);
  });

export const erpResolveAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { assertStaff, resolveAlert } = await import("./erp-admin.server");
    await assertStaff(context.supabase as never, context.userId);
    return resolveAlert(data.id);
  });

/** Pruebas end-to-end en staging: no genera registros reales en Noil. */
export const erpRunE2E = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertStaff, runE2ETests } = await import("./erp-admin.server");
    await assertStaff(context.supabase as never, context.userId);
    return runE2ETests();
  });

/** Verificación de conexión real con el ERP (login + lecturas reales, sin simulación). */
export const erpHealthcheck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertStaff } = await import("./erp-admin.server");
    await assertStaff(context.supabase as never, context.userId);
    const { checkErpHealth } = await import("./erp-health.server");
    return checkErpHealth();
  });

/** Resumen en lenguaje claro del estado del ERP, generado con IA. */
export const erpAiSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ incluirPruebas: z.boolean().default(false) }).parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { assertStaff, getMonitorSnapshot } = await import("./erp-admin.server");
    await assertStaff(context.supabase as never, context.userId);
    const [snap, health] = await Promise.all([
      getMonitorSnapshot({ incluirPruebas: data.incluirPruebas }),
      import("./erp-health.server").then((m) => m.checkErpHealth()),
    ]);
    const { summarizeForOwner } = await import("./ai-summary.server");
    return summarizeForOwner({
      titulo:
        "Explica en lenguaje de negocio el estado de la integración con el ERP Noil: si está conectado, qué falló, qué quedó en cola y qué debe hacer el equipo.",
      contexto: {
        conexionEnVivo: health,
        modo: snap.modo,
        metricas: snap.metricas,
        alertasAbiertas: snap.alertas.filter((a) => !a.resuelta).slice(0, 10),
        cola: snap.cola.slice(0, 10),
        ultimosErrores: snap.logs.filter((l) => !l.ok).slice(0, 12),
        totalRegistrosBitacora: snap.logs.length,
        incluyePruebas: data.incluirPruebas,
      },
    });
  });

/** Borra la bitácora, cola y alertas marcadas como prueba para dejar solo datos reales. */
export const erpPurgeTestData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertStaff } = await import("./erp-admin.server");
    await assertStaff(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const borrados: Record<string, number> = {};
    for (const tabla of ["erp_logs", "erp_outbox", "erp_alerts", "lead_events", "leads"] as const) {
      if (tabla === "lead_events") {
        const { data: pruebas } = await supabaseAdmin.from("leads").select("id").eq("es_prueba", true);
        const ids = (pruebas ?? []).map((l) => l.id);
        if (ids.length) {
          const { data } = await supabaseAdmin
            .from("lead_events")
            .delete()
            .in("lead_id", ids)
            .select("id");
          borrados[tabla] = data?.length ?? 0;
        } else borrados[tabla] = 0;
        continue;
      }
      const { data } = await supabaseAdmin.from(tabla).delete().eq("es_prueba", true).select("id");
      borrados[tabla] = data?.length ?? 0;
    }
    return { ok: true, borrados };
  });

/** Auditoría unificada de llamadas a ERP y facturación. Solo equipo KG. */
export const erpAuditTrail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        sistema: z.enum(["todos", "erp", "facturacion"]).default("todos"),
        soloErrores: z.boolean().default(false),
        incluirPruebas: z.boolean().default(false),
        traceId: z.string().trim().max(60).optional(),
        busqueda: z.string().trim().max(120).optional(),
        limite: z.number().int().min(20).max(300).default(150),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { assertStaff, getAuditTrail } = await import("./erp-admin.server");
    await assertStaff(context.supabase as never, context.userId);
    return getAuditTrail(data);
  });
