import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const quoteSchema = z.object({
  rfc: z.string().trim().toUpperCase().min(12).max(13),
  empresa: z.string().trim().min(1).max(200),
  nombre: z.string().trim().min(1).max(120),
  correo: z.string().trim().email().max(160),
  telefono: z.string().trim().min(7).max(30),
  idCurso: z.number().int().positive(),
  idServicio: z.number().int().min(0).default(0),
  participantes: z.number().int().min(1).max(500),
  lugarCurso: z.enum(["Local", "Foraneo"]),
  tipoCursoCliente: z.enum(["Cerrado", "Abierto"]),
  lugarServicio: z.string().trim().max(200).default(""),
  comentarios: z.string().trim().max(800).default(""),
  fechaDeseada: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const erpListCourses = createServerFn({ method: "GET" }).handler(async () => {
  const { listCourses } = await import("./erp.server");
  try {
    return { ok: true as const, courses: await listCourses() };
  } catch (e) {
    console.error(e);
    return { ok: false as const, courses: [] };
  }
});

export const erpListCalendar = createServerFn({ method: "GET" })
  .inputValidator((data: { idCurso?: number }) =>
    z.object({ idCurso: z.number().int().positive().optional() }).parse(data ?? {}),
  )
  .handler(async ({ data }) => {
    const { listCalendar } = await import("./erp.server");
    try {
      return { ok: true as const, dates: await listCalendar(data.idCurso) };
    } catch (e) {
      console.error(e);
      return { ok: false as const, dates: [] };
    }
  });

export const erpLookupClient = createServerFn({ method: "POST" })
  .inputValidator((data: { rfc: string }) =>
    z.object({ rfc: z.string().trim().toUpperCase().min(12).max(13) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { validateRfc } = await import("./rfc");
    const check = validateRfc(data.rfc);
    if (!check.valid) {
      return { ok: true as const, estado: "rfc_invalido" as const, motivo: check.reason ?? "", client: null };
    }
    const { findClientByRfc } = await import("./erp.server");
    try {
      const client = await findClientByRfc(data.rfc);
      return {
        ok: true as const,
        estado: client ? ("cliente_existente" as const) : ("cliente_nuevo" as const),
        motivo: "",
        client,
      };
    } catch (e) {
      console.error(e);
      return { ok: false as const, estado: "erp_no_disponible" as const, motivo: "", client: null };
    }
  });


export const erpCreateQuote = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => quoteSchema.parse(data))
  .handler(async ({ data }) => {
    const { createQuote, ErpError } = await import("./erp.server");
    try {
      const result = await createQuote(data);
      return {
        ok: true as const,
        stage: "completado" as const,
        code: result.status,
        message:
          result.status === "creada"
            ? "Su solicitud quedó registrada en nuestro sistema."
            : "Su solicitud fue recibida y está pendiente de verificación. No la envíe de nuevo.",
        traceId: result.traceId,
        retryable: false,
        idCotizacionSolicitud: result.idSolicitud,
        folio: result.folio,
        fechaAgendada: result.fechaAgendada,
      };
    } catch (e) {
      if (e instanceof ErpError) {
        console.error(`[erp][${e.stage}][${e.code}] ${e.message}`);
        return {
          ok: false as const,
          stage: e.stage,
          code: e.code,
          message: e.message,
          traceId: null,
          retryable: e.retryable,
          idCotizacionSolicitud: null,
          folio: null,
          fechaAgendada: false,
        };
      }
      console.error(e);
      return {
        ok: false as const,
        stage: "desconocido" as const,
        code: "error_inesperado",
        message: "Ocurrió un error inesperado al procesar la solicitud.",
        traceId: null,
        retryable: true,
        idCotizacionSolicitud: null,
        folio: null,
        fechaAgendada: false,
      };
    }
  });

