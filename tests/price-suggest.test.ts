import { describe, expect, test } from "bun:test";
import { suggestPrice, type PricePackageRow } from "../src/lib/price-suggest";

// Paquetes reales de "alturas-autorizado" (catálogo STPS 2026).
const packages: PricePackageRow[] = [
  {
    code: "alturas-autorizado-local",
    package_type: "individual_local",
    unit_price: 1355,
    min_participants: 20,
    max_participants: 25,
    tax_rate: 0.16,
  },
  {
    code: "alturas-autorizado-foraneo",
    package_type: "individual_foraneo",
    unit_price: 2147,
    min_participants: 20,
    max_participants: 25,
    tax_rate: 0.16,
  },
  {
    code: "alturas-autorizado-grupal",
    package_type: "grupal",
    unit_price: 19800,
    min_participants: 20,
    max_participants: 25,
    tax_rate: 0.16,
  },
];

describe("sugerencia de precio", () => {
  test("sin paquetes => null", () => {
    expect(suggestPrice([], "Local", 10)).toBeNull();
  });

  test("modalidad Local elige el precio individual local por persona", () => {
    const s = suggestPrice(packages, "Local", 1)!;
    expect(s.individual?.code).toBe("alturas-autorizado-local");
    expect(s.individual?.unitPrice).toBe(1355);
    expect(s.individual?.total).toBe(1355);
  });

  test("modalidad Foraneo elige el precio individual foráneo", () => {
    const s = suggestPrice(packages, "Foraneo", 2)!;
    expect(s.individual?.code).toBe("alturas-autorizado-foraneo");
    expect(s.individual?.unitPrice).toBe(2147);
    expect(s.individual?.total).toBe(4294);
  });

  test("pocos participantes: el grupal NO aplica => se recomienda individual", () => {
    const s = suggestPrice(packages, "Local", 5)!;
    expect(s.grupal?.aplica).toBe(false);
    expect(s.recommended).toBe("individual");
  });

  test("grupo dentro del rango y más barato => se recomienda grupal", () => {
    // 22 x 1355 = 29,810 individual vs 19,800 grupal.
    const s = suggestPrice(packages, "Local", 22)!;
    expect(s.grupal?.aplica).toBe(true);
    expect(s.recommended).toBe("grupal");
    expect(s.individual?.total).toBe(29810);
    expect(s.grupal?.unitPrice).toBe(19800);
  });

  test("foráneo con grupo: grupal sigue siendo la recomendación si es más barato", () => {
    // 22 x 2147 = 47,234 individual vs 19,800 grupal.
    const s = suggestPrice(packages, "Foraneo", 22)!;
    expect(s.recommended).toBe("grupal");
  });
});
