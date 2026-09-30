import { describe, expect, test } from "bun:test";
import { computeLineAmounts, computeQuoteTotals, round2 } from "../src/lib/quote-math";

describe("cálculo de totales de cotización", () => {
  test("una partida simple: 22 x 1000 @16%", () => {
    const a = computeLineAmounts({ quantity: 22, unitPrice: 1000, taxRate: 0.16 });
    expect(a.subtotal).toBe(22000);
    expect(a.tax).toBe(3520);
    expect(a.total).toBe(25520);
  });

  test("partida con descuento usa el precio con descuento", () => {
    const a = computeLineAmounts({
      quantity: 1,
      unitPrice: 5000,
      discountedUnitPrice: 4500,
      taxRate: 0.16,
    });
    expect(a.subtotal).toBe(4500);
    expect(a.tax).toBe(720);
    expect(a.total).toBe(5220);
  });

  test("totales de la cotización = suma de partidas (espejo del SQL)", () => {
    const totals = computeQuoteTotals([
      { quantity: 22, unitPrice: 1000, taxRate: 0.16 },
      { quantity: 1, unitPrice: 5000, discountedUnitPrice: 4500, taxRate: 0.16 },
    ]);
    // Mismo resultado que se validó contra PostgreSQL real.
    expect(totals.subtotal).toBe(26500);
    expect(totals.taxTotal).toBe(4240);
    expect(totals.total).toBe(30740);
  });

  test("cotización vacía suma cero", () => {
    const totals = computeQuoteTotals([]);
    expect(totals).toEqual({ subtotal: 0, taxTotal: 0, total: 0 });
  });

  test("redondeo a 2 decimales estable", () => {
    // 3 x 33.33 = 99.99 ; IVA 16% = 15.9984 -> 16.00
    const a = computeLineAmounts({ quantity: 3, unitPrice: 33.33, taxRate: 0.16 });
    expect(a.subtotal).toBe(99.99);
    expect(a.tax).toBe(16.0);
    expect(round2(0.1 + 0.2)).toBe(0.3);
  });

  test("tasa de IVA 0 (exento) no agrega impuesto", () => {
    const a = computeLineAmounts({ quantity: 10, unitPrice: 100, taxRate: 0 });
    expect(a.subtotal).toBe(1000);
    expect(a.tax).toBe(0);
    expect(a.total).toBe(1000);
  });
});
