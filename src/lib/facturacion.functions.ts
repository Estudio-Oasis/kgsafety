import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const factLookupClient = createServerFn({ method: "POST" })
  .inputValidator((data: { codigo: string }) =>
    z.object({ codigo: z.string().trim().min(2).max(40) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { findFiscalClient } = await import("./facturacion.server");
    try {
      const client = await findFiscalClient(data.codigo);
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
    const { issueInvoice } = await import("./facturacion.server");
    try {
      return await issueInvoice({
        IdProveedorCliente: data.idProveedorCliente,
        NoCotizacion: data.noCotizacion,
        UsoCFDI: data.usoCFDI,
        ...(data.referencia ? { Referencia: data.referencia } : {}),
      });
    } catch (e) {
      console.error(e);
      return { ok: false as const, error: "El servicio de facturación no respondió. Intente más tarde." };
    }
  });
