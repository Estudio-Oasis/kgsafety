/**
 * Implementación Noil del BillingProvider.
 * Reenvía cada operación a facturacion.server.ts SIN cambiar el comportamiento:
 * es exactamente lo que hoy ya usa el portal, solo que detrás de la interfaz.
 */

import type { BillingProvider, IssueInvoiceInput, UpdateClientInput } from "./provider";
import {
  buildStampedInvoicePdf,
  checkQuoteForInvoice,
  findFiscalClient,
  findInvoice,
  issueInvoice,
  previewInvoicePdf,
  updateFiscalClient,
  validatePayment,
} from "../facturacion.server";

export const noilBillingProvider: BillingProvider = {
  name: "noil",
  findClient: (codigo) => findFiscalClient(codigo),
  issueInvoice: (input: IssueInvoiceInput) => issueInvoice(input),
  checkQuote: (cotizacion) => checkQuoteForInvoice(cotizacion),
  validatePayment: (cotizacion, referencia, monto) =>
    validatePayment(cotizacion, referencia, monto),
  updateClient: (id: number, data: UpdateClientInput) => updateFiscalClient(id, data),
  findInvoice: (criterio) => findInvoice(criterio),
  previewPdf: (input: IssueInvoiceInput) => previewInvoicePdf(input),
  stampedPdf: (criterio) => buildStampedInvoicePdf(criterio),
  // Noil no expone cancelación/sustitución en esta integración; se dejan sin
  // implementar a propósito (la interfaz las marca como opcionales).
};
