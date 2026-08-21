/**
 * Orquestación de una solicitud de cotización (solo servidor).
 *
 * Garantías:
 * 1. La solicitud SIEMPRE queda registrada en nuestra base (leads) antes de tocar el ERP.
 * 2. Si el ERP falla de forma reintentable, la solicitud entra a la cola (erp_outbox)
 *    y se sincroniza automáticamente cuando Noil vuelva. El usuario recibe confirmación.
 * 3. Cada interacción con el ERP queda en la bitácora con su trace ID.
 */

import type { QuoteInput } from "./erp.server";
import { ErpError, createQuote } from "./erp.server";
import {
  enqueueOutbox,
  erpCtx,
  globalErpMode,
  logErpCall,
  newTraceId,
  raiseAlert,
  type ErpMode,
} from "./erp-monitor.server";
import { attachErpOutcome, recordLead } from "./leads.server";

export type SubmitQuoteResponse = {
  ok: boolean;
  stage: string;
  code: string;
  message: string;
  traceId: string | null;
  retryable: boolean;
  idCotizacionSolicitud: number | null;
  folio: string | null;
  fechaAgendada: boolean;
  enCola?: boolean;
  leadId?: string | null;
};

export function looksLikeTest(input: { empresa: string; correo: string }) {
  return (
    /prueba|staging|\btest\b/i.test(input.empresa) || /kg-safety\.com$/i.test(input.correo)
  );
}

export async function submitQuote(
  data: QuoteInput,
  opts?: { modo?: ErpMode; origen?: string; esPrueba?: boolean },
): Promise<SubmitQuoteResponse> {
  const modo = opts?.modo ?? globalErpMode();
  const esPrueba = opts?.esPrueba ?? looksLikeTest(data) ?? false;
  const traceId = newTraceId();

  // 1) Registro propio: nuestra base es el registro maestro.
  const leadId = await recordLead({
    origen: opts?.origen ?? "cotizacion-web",
    empresa: data.empresa,
    rfc: data.rfc,
    contacto_nombre: data.nombre,
    contacto_correo: data.correo,
    contacto_telefono: data.telefono,
    curso_id: data.idCurso,
    servicio_id: data.idServicio || null,
    participantes: data.participantes,
    modalidad: data.lugarCurso,
    tipo_curso: data.tipoCursoCliente,
    lugar_servicio: data.lugarServicio,
    fecha_deseada: data.fechaDeseada ?? null,
    contratista_id: data.idContratista || null,
    contratista_nombre: data.nombreContratista,
    comentarios: data.comentarios,
    es_prueba: esPrueba,
    modo,
  });

  return erpCtx.run(
    { traceId, leadId, operacion: "cotizacion", modo, esPrueba, intento: 1 },
    async (): Promise<SubmitQuoteResponse> => {
      try {
        const result = await createQuote(data, { traceId });
        await attachErpOutcome(leadId, {
          erp_status: result.status === "creada" ? "creada" : "pendiente_verificacion",
          erp_folio: result.folio?.trim() || "",
          erp_solicitud_id: result.idSolicitud ? String(result.idSolicitud) : "",
          erp_trace_id: traceId,
        });
        return {
          ok: true,
          stage: "completado",
          code: result.status,
          message:
            result.status === "creada"
              ? "Su solicitud quedó registrada en nuestro sistema."
              : "Su solicitud fue recibida y está pendiente de verificación. No la envíe de nuevo.",
          traceId,
          retryable: false,
          idCotizacionSolicitud: result.idSolicitud,
          folio: result.folio,
          fechaAgendada: result.fechaAgendada,
          leadId,
        };
      } catch (e) {
        const erpErr = e instanceof ErpError ? e : null;
        const stage = erpErr?.stage ?? "desconocido";
        const code = erpErr?.code ?? "error_inesperado";
        const mensaje = erpErr?.message ?? "Ocurrió un error inesperado al procesar la solicitud.";

        // Falla de configuración (secretos faltantes): reintentar no la arregla.
        const esConfiguracion =
          code === "credenciales_no_configuradas" ||
          /credenciales no configuradas|no configurad|ERP_API_EMAIL|ERP_API_PASSWORD/i.test(
            e instanceof Error ? e.message : "",
          );
        const reintentable = esConfiguracion ? false : erpErr ? erpErr.retryable : true;

        await logErpCall({
          stage,
          ok: false,
          error_code: esConfiguracion ? "configuracion_faltante" : code,
          error_message: mensaje,
        });

        // 2) Datos válidos + ERP caído -> cola de sincronización. La solicitud se procesa igual.
        if (reintentable && stage !== "validacion") {
          await enqueueOutbox({
            leadId,
            payload: data as unknown as Record<string, unknown>,
            traceId,
            error: `${stage}/${code}: ${mensaje}`,
            modo,
            esPrueba,
          });
          await attachErpOutcome(leadId, {
            erp_status: "pendiente",
            erp_trace_id: traceId,
            erp_error: `${stage}/${code}`,
          });
          return {
            ok: true,
            stage: "en_cola",
            code: "recibida_en_cola",
            message:
              "Recibimos su solicitud, pero por un problema temporal de conexión no pudimos confirmarla en nuestro sistema. No la envíe de nuevo: confírmela por teléfono al +52 722 879 5076 o por WhatsApp y un asesor la atenderá de inmediato.",
            traceId,
            retryable: false,
            idCotizacionSolicitud: null,
            folio: null,
            fechaAgendada: false,
            enCola: true,
            leadId,
          };
        }

        // 3) Rechazo definitivo (RFC inválido, datos rechazados) o falta de configuración.
        await attachErpOutcome(leadId, {
          erp_status: "error",
          erp_trace_id: traceId,
          erp_error: esConfiguracion ? "configuracion/credenciales_no_configuradas" : `${stage}/${code}`,
        });
        await raiseAlert({
          tipo: "erp_error",
          severidad: esConfiguracion ? "alta" : stage === "validacion" ? "baja" : "alta",
          titulo: esConfiguracion
            ? "Configuración faltante en KG Safety: credenciales del ERP no configuradas"
            : `Solicitud no aceptada (${stage})`,
          mensaje: esConfiguracion
            ? `Problema de configuración del lado de KG Safety (no de Noil): faltan las credenciales de servicio del ERP, por lo que la solicitud NO se envió a Noil. Detalle: ${mensaje}`
            : mensaje,
          leadId,
        });
        return {
          ok: false,
          stage: esConfiguracion ? "configuracion" : stage,
          code: esConfiguracion ? "configuracion_faltante" : code,
          message: esConfiguracion
            ? "No pudimos enviar su solicitud por una falla de configuración de nuestro sistema. Su información quedó registrada; por favor contáctenos por teléfono o WhatsApp para confirmarla."
            : mensaje,
          traceId,
          retryable: false,
          idCotizacionSolicitud: null,
          folio: null,
          fechaAgendada: false,
          leadId,
        };
      }
    },
  );
}
