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
  idContratista: z.number().int().min(0).default(0),
  nombreContratista: z.string().trim().max(160).default(""),
  folioCurso: z.string().trim().max(40).default(""),
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
    const { submitQuote } = await import("./erp-submit.server");
    return submitQuote(data);
  });



export const erpListInsumos = createServerFn({ method: "GET" })
  .inputValidator((data: { tipo: "EQUIPO" | "SERVICIO" }) =>
    z.object({ tipo: z.enum(["EQUIPO", "SERVICIO"]) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { listInsumos } = await import("./erp.server");
    try {
      return { ok: true as const, items: await listInsumos(data.tipo) };
    } catch (e) {
      console.error(e);
      return { ok: false as const, items: [] };
    }
  });

export const erpListOpenCourses = createServerFn({ method: "GET" }).handler(async () => {
  const { listOpenCourses } = await import("./erp.server");
  try {
    return { ok: true as const, courses: await listOpenCourses() };
  } catch (e) {
    console.error(e);
    return { ok: false as const, courses: [] };
  }
});

export const erpListContractors = createServerFn({ method: "GET" }).handler(async () => {
  const { listContractors } = await import("./erp.server");
  try {
    return { ok: true as const, contractors: await listContractors() };
  } catch (e) {
    console.error(e);
    return { ok: false as const, contractors: [] };
  }
});
