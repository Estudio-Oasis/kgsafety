import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const LEAD_STAGES = [
  "nuevo",
  "contactado",
  "cotizacion",
  "negociacion",
  "ganado",
  "perdido",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export type LeadRow = {
  id: string;
  created_at: string;
  updated_at: string;
  origen: string;
  empresa: string;
  rfc: string;
  contacto_nombre: string;
  contacto_correo: string;
  contacto_telefono: string;
  curso_nombre: string;
  participantes: number | null;
  modalidad: string;
  tipo_curso: string;
  lugar_servicio: string;
  fecha_deseada: string | null;
  contratista_nombre: string;
  comentarios: string;
  etapa: string;
  valor_estimado: number | null;
  responsable: string;
  erp_status: string;
  erp_folio: string;
  erp_trace_id: string;
  erp_error: string;
  es_prueba: boolean;
};

export type LeadEventRow = {
  id: string;
  created_at: string;
  tipo: string;
  detalle: string;
  autor_nombre: string;
};

const SELECT =
  "id,created_at,updated_at,origen,empresa,rfc,contacto_nombre,contacto_correo,contacto_telefono,curso_nombre,participantes,modalidad,tipo_curso,lugar_servicio,fecha_deseada,contratista_nombre,comentarios,etapa,valor_estimado,responsable,erp_status,erp_folio,erp_trace_id,erp_error,es_prueba";

const filtersSchema = z.object({
  etapa: z.string().trim().max(30).optional(),
  origen: z.string().trim().max(40).optional(),
  buscar: z.string().trim().max(120).optional(),
  incluirPruebas: z.boolean().optional(),
  desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const listLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => filtersSchema.parse(data ?? {}))
  .handler(async ({ data, context }) => {
    let q = context.supabase.from("leads").select(SELECT).order("created_at", { ascending: false }).limit(500);
    if (data.etapa) q = q.eq("etapa", data.etapa);
    if (data.origen) q = q.eq("origen", data.origen);
    if (data.desde) q = q.gte("created_at", data.desde);
    if (!data.incluirPruebas) q = q.eq("es_prueba", false);
    if (data.buscar) {
      const t = `%${data.buscar}%`;
      q = q.or(
        `empresa.ilike.${t},rfc.ilike.${t},contacto_nombre.ilike.${t},contacto_correo.ilike.${t},curso_nombre.ilike.${t},erp_folio.ilike.${t}`,
      );
    }
    const { data: rows, error } = await q;
    if (error) {
      console.error("[leads] listLeads", error.message);
      return { ok: false as const, leads: [] as LeadRow[] };
    }
    return { ok: true as const, leads: (rows ?? []) as LeadRow[] };
  });

export const getLeadEvents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { leadId: string }) => z.object({ leadId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("lead_events")
      .select("id,created_at,tipo,detalle,autor_nombre")
      .eq("lead_id", data.leadId)
      .order("created_at", { ascending: false });
    if (error) return { ok: false as const, events: [] as LeadEventRow[] };
    return { ok: true as const, events: (rows ?? []) as LeadEventRow[] };
  });

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        leadId: z.string().uuid(),
        etapa: z.enum(LEAD_STAGES).optional(),
        responsable: z.string().trim().max(120).optional(),
        valorEstimado: z.number().min(0).max(100000000).nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const patch: Record<string, unknown> = {};
    if (data.etapa) patch['etapa'] = data.etapa;
    if (data.responsable !== undefined) patch['responsable'] = data.responsable;
    if (data.valorEstimado !== undefined) patch['valor_estimado'] = data.valorEstimado;
    if (Object.keys(patch).length === 0) return { ok: false as const, message: "Sin cambios" };

    const { error } = await context.supabase.from("leads").update(patch).eq("id", data.leadId);
    if (error) {
      console.error("[leads] updateLead", error.message);
      return { ok: false as const, message: "No se pudo actualizar el lead" };
    }
    const detalles = [
      data.etapa ? `etapa → ${data.etapa}` : null,
      data.responsable !== undefined ? `responsable → ${data.responsable || "sin asignar"}` : null,
      data.valorEstimado !== undefined ? `valor estimado → ${data.valorEstimado ?? "sin valor"}` : null,
    ].filter(Boolean);
    await context.supabase.from("lead_events").insert({
      lead_id: data.leadId,
      tipo: "cambio",
      detalle: detalles.join(" · "),
      autor_id: context.userId,
      autor_nombre: (context.claims?.['email'] as string) ?? "",
    });
    return { ok: true as const, message: "Lead actualizado" };
  });

export const addLeadNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ leadId: z.string().uuid(), nota: z.string().trim().min(1).max(1000) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("lead_events").insert({
      lead_id: data.leadId,
      tipo: "nota",
      detalle: data.nota,
      autor_id: context.userId,
      autor_nombre: (context.claims?.['email'] as string) ?? "",
    });
    if (error) {
      console.error("[leads] addLeadNote", error.message);
      return { ok: false as const, message: "No se pudo guardar la nota" };
    }
    return { ok: true as const, message: "Nota guardada" };
  });
