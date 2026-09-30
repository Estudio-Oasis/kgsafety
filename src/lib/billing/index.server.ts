/**
 * Selector de proveedor de facturación.
 * Elige la implementación según la variable de entorno BILLING_PROVIDER:
 *   - "noil" (por omisión): timbrado vía ERP Noil (comportamiento actual).
 *   - "pac": PAC directo (stub por ahora; ver ./pac.server.ts).
 *
 * Cambiar de proveedor NO requiere tocar el portal ni la UI: solo esta variable.
 */

import type { BillingProvider } from "./provider";

export type BillingProviderName = "noil" | "pac";

export function billingProviderName(): BillingProviderName {
  return (process.env["BILLING_PROVIDER"] || "noil").toLowerCase() === "pac" ? "pac" : "noil";
}

export async function getBillingProvider(): Promise<BillingProvider> {
  if (billingProviderName() === "pac") {
    const { pacBillingProvider } = await import("./pac.server");
    return pacBillingProvider;
  }
  const { noilBillingProvider } = await import("./noil.server");
  return noilBillingProvider;
}
