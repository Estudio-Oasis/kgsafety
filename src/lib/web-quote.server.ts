/**
 * Alta de solicitudes de cotización en Supabase (cotizador propio).
 * Solo servidor: usa el cliente con service role para llamar al RPC
 * public.create_web_quote, que es idempotente y con rate-limit.
 *
 * Este es el camino INDEPENDIENTE de Noil: la solicitud queda registrada
 * en nuestra propia base (quote_requests de la org KGSAFETY) y aparece en
 * el portal (portal.erp-kg) sin pasar por el ERP externo.
 */

import { createHash } from "node:crypto";
import type { QuoteInput } from "./erp.server";

/** Fuente de verdad de las cotizaciones: 'supabase' (propio) o 'noil' (ERP externo). */
export function quoteSourceOfTruth(): "supabase" | "noil" {
  return (process.env["QUOTE_SOURCE_OF_TRUTH"] || "noil").toLowerCase() === "supabase"
    ? "supabase"
    : "noil";
}

/** ¿Debe seguir sincronizándose con Noil? 'off' apaga el ERP externo. */
export function noilSyncEnabled(): boolean {
  return (process.env["NOIL_SYNC"] || "on").toLowerCase() !== "off";
}

/**
 * Clave de idempotencia estable a partir del contenido de la solicitud.
 * Dos envíos idénticos (mismo cliente, curso y datos) en el mismo día no
 * crean dos solicitudes. Si el front envía un submissionId propio, se usa ese.
 */
export function deriveSubmissionId(data: QuoteInput, explicit?: string | null): string {
  const provided = (explicit ?? "").trim();
  if (provided) return provided.slice(0, 120);
  const dia = new Date().toISOString().slice(0, 10);
  const base = [
    dia,
    (data.rfc ?? "").toUpperCase(),
    (data.correo ?? "").toLowerCase(),
    String(data.idCurso ?? ""),
    String(data.idServicio ?? ""),
    String(data.participantes ?? ""),
    data.fechaDeseada ?? "",
  ].join("|");
  return "auto-" + createHash("sha256").update(base).digest("hex").slice(0, 24);
}

export type WebQuoteResult =
  | { ok: true; status: "created" | "duplicate"; quoteRequestId: string; code: string | null }
  | { ok: false; status: "rate_limited" | "invalid" | "error"; error: string };

/**
 * Construye el payload y llama al RPC create_web_quote (service role).
 * Nunca lanza: devuelve un resultado tipado para que el flujo de /contacto
 * pueda decidir el mensaje al usuario.
 */
export async function submitWebQuote(
  data: QuoteInput,
  opts?: { submissionId?: string | null; sourceIp?: string | null },
): Promise<WebQuoteResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const submissionId = deriveSubmissionId(data, opts?.submissionId ?? null);
  const payload = {
    contacto_correo: data.correo ?? "",
    contacto_telefono: data.telefono ?? "",
    empresa: data.empresa ?? "",
    rfc: (data.rfc ?? "").toUpperCase(),
    contacto_nombre: data.nombre ?? "",
    // Enlace por legacy_id; si el catálogo de Supabase se importó desde Noil
    // (legacy numérico) enlaza el curso; si no, la info queda en source_payload.
    course_legacy_id: data.idCurso ? String(data.idCurso) : "",
    service_legacy_id: data.idServicio ? String(data.idServicio) : "",
    contractor_legacy_id: data.idContratista ? String(data.idContratista) : "",
    contractor_name: data.nombreContratista ?? "",
    participant_count: data.participantes ? String(data.participantes) : "",
    travel_mode: data.lugarCurso ?? "",
    delivery_type: data.tipoCursoCliente ?? "",
    location: data.lugarServicio ?? "",
    comentarios: data.comentarios ?? "",
    folio_curso: data.folioCurso ?? "",
    source: "cotizacion-web",
  };

  try {
    const { data: res, error } = await (supabaseAdmin as any).rpc("create_web_quote", {
      p_submission_id: submissionId,
      p_payload: payload,
      p_source_ip: opts?.sourceIp ?? null,
    });
    if (error) {
      console.error("[web-quote] RPC error", error);
      return {
        ok: false,
        status: "error",
        error: error.message ?? "Error al registrar la solicitud.",
      };
    }
    const r = (res ?? {}) as {
      ok?: boolean;
      status?: string;
      quote_request_id?: string;
      code?: string | null;
      error?: string;
    };
    if (r.ok && (r.status === "created" || r.status === "duplicate") && r.quote_request_id) {
      return {
        ok: true,
        status: r.status,
        quoteRequestId: r.quote_request_id,
        code: r.code ?? null,
      };
    }
    if (r.status === "rate_limited") {
      return {
        ok: false,
        status: "rate_limited",
        error: r.error ?? "Demasiadas solicitudes. Intente más tarde.",
      };
    }
    return {
      ok: false,
      status: "invalid",
      error: r.error ?? "No fue posible registrar la solicitud.",
    };
  } catch (e) {
    console.error("[web-quote] excepción", e);
    return { ok: false, status: "error", error: "No fue posible registrar la solicitud." };
  }
}
