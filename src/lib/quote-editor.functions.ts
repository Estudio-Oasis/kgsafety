/**
 * Editor de cotizaciones (personal de KG).
 * Envuelve los RPC qe_* de Supabase, que aplican el guard de staff y el
 * recálculo de totales del lado de la base. Aquí solo validamos entradas y
 * exponemos funciones de servidor tipadas para la UI (la construye Lovable).
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const uuid = z.string().uuid();

type RpcResult = {
  ok: boolean;
  error?: string;
  status?: string;
  quote_id?: string;
  quote_request_id?: string;
  line_id?: string;
  code?: string | null;
};

async function callRpc(
  supabase: unknown,
  fn: string,
  args: Record<string, unknown>,
): Promise<RpcResult> {
  const { data, error } = await (supabase as any).rpc(fn, args);
  if (error) return { ok: false, error: error.message ?? "Error en la operación." };
  const r = (data ?? { ok: false, error: "Sin respuesta del servidor." }) as Partial<RpcResult>;
  return {
    ok: Boolean(r.ok),
    error: r.error,
    status: r.status,
    quote_id: r.quote_id,
    quote_request_id: r.quote_request_id,
    line_id: r.line_id,
    code: r.code ?? null,
  };
}

/** Convierte una solicitud en cotización. */
export const qeCreateQuoteFromRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { requestId: string }) => z.object({ requestId: uuid }).parse(data))
  .handler(async ({ context, data }) => {
    return callRpc(context.supabase, "qe_create_quote_from_request", {
      p_request_id: data.requestId,
    });
  });

/** Agrega una partida a la cotización. */
export const qeAddLine = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        quoteId: uuid,
        description: z.string().trim().max(400).default(""),
        quantity: z.number().min(0).max(100000).default(1),
        unitPrice: z.number().min(0).max(100000000).default(0),
        taxRate: z.number().min(0).max(1).default(0.16),
        courseId: uuid.nullable().optional(),
        discountedUnitPrice: z.number().min(0).max(100000000).nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    return callRpc(context.supabase, "qe_add_line", {
      p_quote_id: data.quoteId,
      p_description: data.description,
      p_quantity: data.quantity,
      p_unit_price: data.unitPrice,
      p_tax_rate: data.taxRate,
      p_course_id: data.courseId ?? null,
      p_discounted_unit_price: data.discountedUnitPrice ?? null,
    });
  });

/** Actualiza una partida (campos opcionales). */
export const qeUpdateLine = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        lineId: uuid,
        description: z.string().trim().max(400).optional(),
        quantity: z.number().min(0).max(100000).optional(),
        unitPrice: z.number().min(0).max(100000000).optional(),
        taxRate: z.number().min(0).max(1).optional(),
        discountedUnitPrice: z.number().min(0).max(100000000).optional(),
        clearDiscount: z.boolean().default(false),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    return callRpc(context.supabase, "qe_update_line", {
      p_line_id: data.lineId,
      p_description: data.description ?? null,
      p_quantity: data.quantity ?? null,
      p_unit_price: data.unitPrice ?? null,
      p_tax_rate: data.taxRate ?? null,
      p_discounted_unit_price: data.discountedUnitPrice ?? null,
      p_clear_discount: data.clearDiscount,
    });
  });

/** Borra una partida. */
export const qeDeleteLine = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { lineId: string }) => z.object({ lineId: uuid }).parse(data))
  .handler(async ({ context, data }) => {
    return callRpc(context.supabase, "qe_delete_line", { p_line_id: data.lineId });
  });

/** Cambia el estatus de la cotización. */
export const qeSetQuoteStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { quoteId: string; status: string }) =>
    z.object({ quoteId: uuid, status: z.string().trim().min(1).max(40) }).parse(data),
  )
  .handler(async ({ context, data }) => {
    return callRpc(context.supabase, "qe_set_quote_status", {
      p_quote_id: data.quoteId,
      p_status: data.status,
    });
  });

/** Lee una cotización con sus partidas (para la UI del editor). */
export const qeGetQuote = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { quoteId: string }) => z.object({ quoteId: uuid }).parse(data))
  .handler(async ({ context, data }) => {
    const db = context.supabase as any;
    const { data: quote, error: qErr } = await db
      .from("quotes")
      .select(
        "id,code,quote_date,valid_until,status,currency,subtotal,tax_total,total,location,delivery_type,travel_mode,request_id,client_id",
      )
      .eq("id", data.quoteId)
      .maybeSingle();
    if (qErr) return { ok: false as const, error: qErr.message, quote: null, lines: [] };
    if (!quote)
      return { ok: false as const, error: "Cotización no encontrada", quote: null, lines: [] };

    const { data: lines, error: lErr } = await db
      .from("quote_lines")
      .select(
        "id,course_id,description,quantity,unit_price,discounted_unit_price,tax_rate,subtotal,total,created_at",
      )
      .eq("quote_id", data.quoteId)
      .order("created_at", { ascending: true });
    if (lErr) return { ok: false as const, error: lErr.message, quote, lines: [] };

    return { ok: true as const, error: null, quote, lines: lines ?? [] };
  });

/**
 * Sugiere un precio a partir de los paquetes de precios (price_packages).
 * Devuelve el precio unitario recomendado según modalidad (local/foráneo) y
 * el paquete grupal como alternativa, sin consultar a Noil.
 */
export const qeSuggestPrice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        courseLegacyId: z.string().trim().min(1).max(120),
        modality: z.enum(["Local", "Foraneo"]).default("Local"),
        participants: z.number().int().min(1).max(1000).default(1),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const db = context.supabase as any;
    const { data: pkgs, error } = await db
      .from("price_packages")
      .select("code,name,package_type,unit_price,min_participants,max_participants,tax_rate")
      .eq("course_legacy_id", data.courseLegacyId)
      .eq("active", true);
    if (error) return { ok: false as const, error: error.message, suggestion: null };

    const rows = (pkgs ?? []) as Array<{
      code: string;
      name: string;
      package_type: string;
      unit_price: number;
      min_participants: number | null;
      max_participants: number | null;
      tax_rate: number;
    }>;
    if (rows.length === 0) {
      return { ok: true as const, error: null, suggestion: null };
    }

    const individualType = data.modality === "Foraneo" ? "individual_foraneo" : "individual_local";
    const individual = rows.find((r) => r.package_type === individualType) ?? null;
    const grupal = rows.find((r) => r.package_type === "grupal") ?? null;

    const perPerson = individual ? Number(individual.unit_price) : null;
    const individualTotal = perPerson !== null ? perPerson * data.participants : null;
    const grupalTotal = grupal ? Number(grupal.unit_price) : null;

    // Recomendación: si el paquete grupal aplica al rango y sale más barato, sugerirlo.
    const grupalAplica =
      grupal &&
      (grupal.min_participants == null || data.participants >= grupal.min_participants) &&
      (grupal.max_participants == null || data.participants <= grupal.max_participants);

    let recommended: "individual" | "grupal" = "individual";
    if (
      grupalAplica &&
      grupalTotal !== null &&
      individualTotal !== null &&
      grupalTotal <= individualTotal
    ) {
      recommended = "grupal";
    } else if (grupalAplica && individualTotal === null) {
      recommended = "grupal";
    }

    return {
      ok: true as const,
      error: null,
      suggestion: {
        recommended,
        individual: individual
          ? {
              code: individual.code,
              unitPrice: perPerson,
              taxRate: Number(individual.tax_rate),
              total: individualTotal,
            }
          : null,
        grupal: grupal
          ? {
              code: grupal.code,
              unitPrice: grupalTotal,
              taxRate: Number(grupal.tax_rate),
              minParticipants: grupal.min_participants,
              maxParticipants: grupal.max_participants,
              aplica: Boolean(grupalAplica),
            }
          : null,
      },
    };
  });
