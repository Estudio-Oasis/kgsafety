/**
 * Registro comercial propio de KG Safety.
 * Cada solicitud del sitio se guarda aquí ANTES y DESPUÉS de hablar con el ERP,
 * de modo que la empresa acumule su propia data y no dependa de Noil.
 * Solo servidor: usa el cliente con service role.
 */

export type LeadInput = {
  origen?: string;
  empresa?: string;
  rfc?: string;
  contacto_nombre?: string;
  contacto_correo?: string;
  contacto_telefono?: string;
  curso_id?: number | null;
  curso_nombre?: string;
  servicio_id?: number | null;
  participantes?: number | null;
  modalidad?: string;
  tipo_curso?: string;
  lugar_servicio?: string;
  fecha_deseada?: string | null;
  contratista_id?: number | null;
  contratista_nombre?: string;
  comentarios?: string;
  es_prueba?: boolean;
  modo?: string;
};

export type LeadErpOutcome = {
  erp_status: "creada" | "pendiente_verificacion" | "error" | "pendiente";
  erp_folio?: string;
  erp_solicitud_id?: string;
  erp_trace_id?: string;
  erp_error?: string;
};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** Crea el lead propio. Nunca lanza: el registro interno no debe romper el flujo del usuario. */
export async function recordLead(input: LeadInput): Promise<string | null> {
  try {
    const db = await admin();
    const { data, error } = await db
      .from("leads")
      .insert({
        origen: input.origen ?? "sitio",
        empresa: input.empresa ?? "",
        rfc: (input.rfc ?? "").toUpperCase(),
        contacto_nombre: input.contacto_nombre ?? "",
        contacto_correo: input.contacto_correo ?? "",
        contacto_telefono: input.contacto_telefono ?? "",
        curso_id: input.curso_id ?? null,
        curso_nombre: input.curso_nombre ?? "",
        servicio_id: input.servicio_id ?? null,
        participantes: input.participantes ?? null,
        modalidad: input.modalidad ?? "",
        tipo_curso: input.tipo_curso ?? "",
        lugar_servicio: input.lugar_servicio ?? "",
        fecha_deseada: input.fecha_deseada ?? null,
        contratista_id: input.contratista_id ?? null,
        contratista_nombre: input.contratista_nombre ?? "",
        comentarios: input.comentarios ?? "",
        es_prueba: input.es_prueba ?? false,
        modo: input.modo ?? "live",
        etapa: "nuevo",
        erp_status: "pendiente",
      })
      .select("id")
      .single();
    if (error) throw error;
    await logLeadEvent(data.id, "creado", "Solicitud recibida desde el sitio web.");
    return data.id;
  } catch (e) {
    console.error("[leads] no se pudo registrar el lead", e);
    return null;
  }
}

/** Guarda el resultado del ERP sobre el lead ya creado. */
export async function attachErpOutcome(leadId: string | null, outcome: LeadErpOutcome) {
  if (!leadId) return;
  try {
    const db = await admin();
    await db
      .from("leads")
      .update({
        erp_status: outcome.erp_status,
        erp_folio: outcome.erp_folio ?? "",
        erp_solicitud_id: outcome.erp_solicitud_id ?? "",
        erp_trace_id: outcome.erp_trace_id ?? "",
        erp_error: outcome.erp_error ?? "",
        erp_last_attempt_at: new Date().toISOString(),
        etapa: outcome.erp_status === "error" || outcome.erp_status === "pendiente" ? "nuevo" : "cotizacion",
      })
      .eq("id", leadId);
    await logLeadEvent(
      leadId,
      "erp",
      outcome.erp_status === "error"
        ? `ERP no completó la solicitud: ${outcome.erp_error ?? "error desconocido"}`
        : `ERP registró la solicitud (${outcome.erp_status})${outcome.erp_folio ? ` · folio ${outcome.erp_folio}` : ""}`,
    );
  } catch (e) {
    console.error("[leads] no se pudo adjuntar resultado del ERP", e);
  }
}

export async function logLeadEvent(leadId: string, tipo: string, detalle: string) {
  try {
    const db = await admin();
    await db.from("lead_events").insert({ lead_id: leadId, tipo, detalle, autor_nombre: "Sistema" });
  } catch (e) {
    console.error("[leads] no se pudo registrar el evento", e);
  }
}
