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
