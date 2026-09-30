/**
 * Aritmética de cotizaciones (lógica pura, sin dependencias).
 *
 * ESPEJO EXACTO del cálculo que hace la base de datos en
 * _recompute_line_amounts / _recompute_quote_totals (ver la migración
 * 20260930180000_quote_editor.sql). Se usa para:
 *   - Cálculo optimista en la UI del editor (sin ida y vuelta al servidor).
 *   - Pruebas automáticas que fijan la fórmula.
 *
 * Regla: precio efectivo = precio con descuento si existe, si no, unitario.
 * Redondeo a 2 decimales por partida (igual que round(...,2) en SQL).
 */

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export type LineInput = {
  quantity: number;
  unitPrice: number;
  discountedUnitPrice?: number | null;
  taxRate: number;
};

export type LineAmounts = {
  subtotal: number;
  tax: number;
  total: number;
};

/** Importes de una partida: subtotal, IVA y total. */
export function computeLineAmounts(line: LineInput): LineAmounts {
  const effective =
    line.discountedUnitPrice !== null && line.discountedUnitPrice !== undefined
      ? line.discountedUnitPrice
      : line.unitPrice;
  const subtotal = round2(line.quantity * effective);
  const tax = round2(line.quantity * effective * line.taxRate);
  return { subtotal, tax, total: round2(subtotal + tax) };
}

export type QuoteTotals = {
  subtotal: number;
  taxTotal: number;
  total: number;
};

/** Totales de la cotización: suma de las partidas. */
export function computeQuoteTotals(lines: LineInput[]): QuoteTotals {
  let subtotal = 0;
  let taxTotal = 0;
  for (const line of lines) {
    const a = computeLineAmounts(line);
    subtotal = round2(subtotal + a.subtotal);
    taxTotal = round2(taxTotal + a.tax);
  }
  return { subtotal, taxTotal, total: round2(subtotal + taxTotal) };
}
