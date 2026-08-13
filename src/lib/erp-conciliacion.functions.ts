import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ExcepcionRow = {
  categoria: string;
  severidad: string;
  entidad: string;
  registro_id: string | null;
  folio: string | null;
  detalle: string;
};

export type BitacoraRow = {
  id: number;
  table_name: string;
  record_id: string | null;
  action: string;
  actor_id: string | null;
  occurred_at: string;
};

const bitacoraSchema = z.object({
  tabla: z.string().trim().max(60).optional(),
  limite: z.number().int().min(1).max(300).optional(),
});

async function assertStaff(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("admin_kg") && !roles.includes("equipo_kg")) {
    throw new Error("No autorizado");
  }
}

/** Excepciones históricas detectadas en los datos migrados desde el ERP anterior. */
export const listarExcepciones = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ExcepcionRow[]> => {
    await assertStaff(context.supabase, context.userId);
    const db = context.supabase as any;
    const { data, error } = await db.rpc("erp_exception_report");
    if (error) throw new Error(error.message);
    return (data ?? []) as ExcepcionRow[];
  });

/** Bitácora de cambios (audit_log) generada por los disparadores de la base. */
export const listarBitacora = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => bitacoraSchema.parse(data ?? {}))
  .handler(async ({ context, data }): Promise<BitacoraRow[]> => {
    await assertStaff(context.supabase, context.userId);
    const db = context.supabase as any;
    let query = db
      .from("audit_log")
      .select("id,table_name,record_id,action,actor_id,occurred_at")
      .order("occurred_at", { ascending: false })
      .limit(data.limite ?? 100);
    if (data.tabla) query = query.eq("table_name", data.tabla);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return (rows ?? []) as BitacoraRow[];
  });
