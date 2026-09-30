/**
 * Interfaz agnóstica de facturación (BillingProvider).
 *
 * Envuelve CUALQUIER proveedor de timbrado CFDI detrás de una sola interfaz:
 *   - Hoy: Noil (ERP externo) — implementación en ./noil.server.ts.
 *   - Mañana: un PAC directo (Facturama, etc.) — stub en ./pac.server.ts.
 *
 * facturacion.functions.ts enruta por proveedor (env BILLING_PROVIDER) sin que
 * los consumidores (portal, UI) sepan quién timbra por debajo.
 *
 * Este archivo es SOLO TIPOS: usa `import type` para no arrastrar código de
 * servidor al bundle del cliente. Las firmas se derivan de facturacion.server
 * para garantizar CERO cambio de comportamiento en la implementación Noil.
 */

import type * as Noil from "../facturacion.server";

export type IssueInvoiceInput = {
  IdProveedorCliente: number;
  NoCotizacion: string;
  UsoCFDI: string;
  Referencia?: string;
};

export type UpdateClientInput = {
  Calle: string;
  No: string;
  NoInt: string;
  Colonia: string;
  CP: string;
  TelEmpresa: string;
};

/** Contrato común a todos los proveedores de facturación. */
export interface BillingProvider {
  /** Identificador legible del proveedor activo (para bitácora/telemetría). */
  readonly name: string;

  /** Busca los datos fiscales de un cliente por su código. */
  findClient(codigo: string): ReturnType<typeof Noil.findFiscalClient>;

  /** Emite (timbra) una factura a partir de la cotización. */
  issueInvoice(input: IssueInvoiceInput): ReturnType<typeof Noil.issueInvoice>;

  /** Valida administrativamente que la cotización sea facturable. */
  checkQuote(cotizacion: string): ReturnType<typeof Noil.checkQuoteForInvoice>;

  /** Valida el pago (referencia + monto) para clientes tipo "Normal". */
  validatePayment(
    cotizacion: string,
    referencia: string,
    monto: number,
  ): ReturnType<typeof Noil.validatePayment>;

  /** Actualiza los datos fiscales del cliente. */
  updateClient(id: number, data: UpdateClientInput): ReturnType<typeof Noil.updateFiscalClient>;

  /** Consulta una factura ya timbrada. */
  findInvoice(criterio: string): ReturnType<typeof Noil.findInvoice>;

  /** Vista previa del PDF del CFDI antes de timbrar. */
  previewPdf(input: IssueInvoiceInput): ReturnType<typeof Noil.previewInvoicePdf>;

  /** PDF propio de una factura ya timbrada. */
  stampedPdf(criterio: string): ReturnType<typeof Noil.buildStampedInvoicePdf>;

  /**
   * Cancelación de una factura timbrada.
   * Opcional: los proveedores que aún no la soportan lanzan un error claro.
   */
  cancelInvoice?(uuid: string, motivo: string): Promise<{ ok: boolean; error?: string }>;

  /**
   * Sustitución de una factura (cancela y reemite).
   * Opcional: los proveedores que aún no la soportan lanzan un error claro.
   */
  substituteInvoice?(
    uuidPrevio: string,
    input: IssueInvoiceInput,
  ): Promise<{ ok: boolean; uuid?: string | null; error?: string }>;
}
