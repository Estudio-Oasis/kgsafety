import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const factLookupClient = createServerFn({ method: "POST" })
  .inputValidator((data: { codigo: string }) =>
    z.object({ codigo: z.string().trim().min(2).max(40) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { findFiscalClient, withFactTrace } = await import("./facturacion.server");
    try {
      const client = await withFactTrace("facturacion_buscar_cliente", () => findFiscalClient(data.codigo));
      if (!client) return { ok: false as const, client: null };
      return {
        ok: true as const,
        client: {
          IdProveedorCliente: client.IdProveedorCliente,
          NombreEmpresa: client.NombreEmpresa,
          RFC: client.RFC,
          Codigo: client.Codigo,
          CP: client.CP ?? null,
          RegimenFiscal: client.RegimenFiscal ?? null,
          Email: client.Email ?? null,
        },
      };
    } catch (e) {
      console.error(e);
      return { ok: false as const, client: null };
    }
  });

export const factIssueInvoice = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        idProveedorCliente: z.number().int().positive(),
        noCotizacion: z.string().trim().min(2).max(60),
        usoCFDI: z.string().trim().min(2).max(6),
        referencia: z.string().trim().max(60).default(""),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { issueInvoice, withFactTrace } = await import("./facturacion.server");
    try {
      return await withFactTrace("facturacion_emitir", () =>
        issueInvoice({
          IdProveedorCliente: data.idProveedorCliente,
          NoCotizacion: data.noCotizacion,
          UsoCFDI: data.usoCFDI,
          ...(data.referencia ? { Referencia: data.referencia } : {}),
        }),
      );
    } catch (e) {
      console.error(e);
      return { ok: false as const, error: "El servicio de facturación no respondió. Intente más tarde." };
    }
  });

export const factCheckQuote = createServerFn({ method: "POST" })
  .inputValidator((data: { cotizacion: string; referencia?: string }) =>
    z
      .object({ cotizacion: z.string().trim().min(1).max(60), referencia: z.string().trim().max(60).default("") })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { checkQuoteForInvoice, validatePayment, findFiscalClient, withFactTrace } = await import("./facturacion.server");
    try {
      return await withFactTrace("facturacion_validar_cotizacion", async () => {
      const check = await checkQuoteForInvoice(data.cotizacion);
      if (!check.ok || !check.info) return { ok: false as const, error: check.error, code: check.code, client: null };

      if (check.info.tipoCliente === "Normal") {
        if (!data.referencia) {
          return {
            ok: false as const,
            code: "falta_referencia",
            error: 'Para clientes de tipo "Normal", es necesario ingresar la referencia de pago.',
            client: null,
          };
        }
        const pay = await validatePayment(data.cotizacion, data.referencia, check.info.monto);
        if (!pay.ok) return { ok: false as const, code: "pago_no_valido", error: pay.error, client: null };
      }

      const fiscal = await findFiscalClient(check.info.codigoCliente);
      if (!fiscal) {
        return {
          ok: false as const,
          code: "sin_datos_fiscales",
          error: "No se encontraron datos fiscales dados de alta. Por favor consulte a Administración.",
          client: null,
        };
      }

      return {
        ok: true as const,
        code: "ok",
        error: null,
        client: {
          IdProveedorCliente: fiscal.IdProveedorCliente,
          NombreEmpresa: fiscal.NombreEmpresa,
          RFC: fiscal.RFC,
          Codigo: fiscal.Codigo,
          Email: fiscal.Email ?? "",
          RegimenFiscal: fiscal.RegimenFiscal ?? "",
          Calle: fiscal.Calle ?? "",
          No: fiscal.No ?? "",
          NoInt: fiscal.NoInt ?? "",
          Colonia: fiscal.Colonia ?? "",
          CP: fiscal.CP ?? "",
          TelEmpresa: fiscal.TelEmpresa ?? "",
        },
      };
      });
    } catch (e) {
      console.error(e);
      return { ok: false as const, code: "servicio", error: "El servicio de facturación no respondió. Intente más tarde.", client: null };
    }
  });

export const factUpdateAndIssue = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        idProveedorCliente: z.number().int().positive(),
        noCotizacion: z.string().trim().min(1).max(60),
        referencia: z.string().trim().max(60).default(""),
        usoCFDI: z.string().trim().min(2).max(6),
        calle: z.string().trim().min(1).max(160),
        numero: z.string().trim().min(1).max(20),
        numeroInt: z.string().trim().max(20).default(""),
        colonia: z.string().trim().min(1).max(160),
        cp: z.string().trim().regex(/^\d{5}$/),
        telefono: z.string().trim().max(30).default(""),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { updateFiscalClient, issueInvoice, withFactTrace } = await import("./facturacion.server");
    try {
      return await withFactTrace("facturacion_actualizar_y_emitir", async () => {
      const updated = await updateFiscalClient(data.idProveedorCliente, {
        Calle: data.calle,
        No: data.numero,
        NoInt: data.numeroInt,
        Colonia: data.colonia,
        CP: data.cp,
        TelEmpresa: data.telefono,
      });
      if (!updated) {
        return { ok: false as const, uuid: null, error: "No fue posible actualizar los datos fiscales." };
      }
      const res = await issueInvoice({
        IdProveedorCliente: data.idProveedorCliente,
        NoCotizacion: data.noCotizacion,
        UsoCFDI: data.usoCFDI,
        ...(data.referencia ? { Referencia: data.referencia } : {}),
      });
      if (!res.ok) return { ok: false as const, uuid: null, error: res.error };
      return { ok: true as const, uuid: res.uuid, error: null };
      });
    } catch (e) {
      console.error(e);
      return { ok: false as const, uuid: null, error: "Ocurrió un error al emitir la factura. Intente más tarde." };
    }
  });

export const factFindInvoice = createServerFn({ method: "POST" })
  .inputValidator((data: { criterio: string }) =>
    z.object({ criterio: z.string().trim().min(1).max(80) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { findInvoice, withFactTrace } = await import("./facturacion.server");
    try {
      return await withFactTrace("facturacion_consultar", () => findInvoice(data.criterio));
    } catch (e) {
      console.error(e);
      return { ok: false as const, invoice: null, error: "Error de conexión con el servicio de facturación." };
    }
  });

/** Vista previa del PDF del CFDI antes de timbrar. */
export const factPreviewPdf = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        idProveedorCliente: z.number().int().positive(),
        noCotizacion: z.string().trim().min(1).max(60),
        usoCFDI: z.string().trim().min(2).max(6),
        referencia: z.string().trim().max(60).default(""),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { previewInvoicePdf, withFactTrace } = await import("./facturacion.server");
    try {
      return await withFactTrace("facturacion_preview", () =>
        previewInvoicePdf({
          IdProveedorCliente: data.idProveedorCliente,
          NoCotizacion: data.noCotizacion,
          UsoCFDI: data.usoCFDI,
          ...(data.referencia ? { Referencia: data.referencia } : {}),
        }),
      );
    } catch (e) {
      console.error(e);
      return {
        ok: false as const,
        pdfBase64: null,
        bytes: 0,
        error: "El servicio de facturación no respondió. Intente más tarde.",
      };
    }
  });
