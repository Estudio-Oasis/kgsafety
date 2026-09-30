/**
 * Stub de un PAC directo (Proveedor Autorizado de Certificación).
 *
 * NO timbra todavía: es el punto de extensión para independizarse de Noil.
 * Cuando se elija el PAC (p. ej. Facturama), aquí se implementan las llamadas
 * reales a su API — la interfaz ya está fijada, así que el resto del sistema
 * (portal, UI, facturacion.functions.ts) no necesita cambios.
 *
 * Reglas de seguridad para la futura implementación:
 *   - Los secretos (CSD, llaves del PAC) SOLO en variables de entorno de servidor.
 *   - Nunca exponer credenciales al bundle del cliente (este archivo es .server.ts).
 */

import type { BillingProvider, IssueInvoiceInput, UpdateClientInput } from "./provider";

const MSG_PAC_NO_CONFIGURADO =
  "El timbrado por PAC directo aún no está configurado. Actívelo eligiendo el proveedor y capturando sus credenciales en variables de entorno de servidor.";

export const pacBillingProvider: BillingProvider = {
  name: "pac",

  async findClient(_codigo: string) {
    // Sin PAC configurado no hay catálogo fiscal propio todavía.
    return null;
  },

  async issueInvoice(_input: IssueInvoiceInput) {
    return { ok: false as const, error: MSG_PAC_NO_CONFIGURADO };
  },

  async checkQuote(_cotizacion: string) {
    return {
      ok: false as const,
      code: "pac_no_configurado",
      error: MSG_PAC_NO_CONFIGURADO,
      info: null,
    };
  },

  async validatePayment(_cotizacion: string, _referencia: string, _monto: number) {
    return { ok: false as const, error: MSG_PAC_NO_CONFIGURADO };
  },

  async updateClient(_id: number, _data: UpdateClientInput) {
    return false;
  },

  async findInvoice(_criterio: string) {
    return { ok: false as const, invoice: null, error: MSG_PAC_NO_CONFIGURADO };
  },

  async previewPdf(_input: IssueInvoiceInput) {
    return {
      ok: false as const,
      pdfBase64: null,
      bytes: 0 as const,
      error: MSG_PAC_NO_CONFIGURADO,
    };
  },

  async stampedPdf(_criterio: string) {
    return {
      ok: false as const,
      pdfBase64: null,
      bytes: 0,
      folio: "",
      uuid: "",
      qr: false,
      error: MSG_PAC_NO_CONFIGURADO,
    };
  },

  async cancelInvoice(_uuid: string, _motivo: string) {
    return { ok: false, error: MSG_PAC_NO_CONFIGURADO };
  },

  async substituteInvoice(_uuidPrevio: string, _input: IssueInvoiceInput) {
    return { ok: false, uuid: null, error: MSG_PAC_NO_CONFIGURADO };
  },
};
