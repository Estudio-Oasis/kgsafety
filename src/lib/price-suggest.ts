/**
 * Sugerencia de precio a partir de los paquetes (price_packages). Lógica pura.
 *
 * Dada la modalidad (local/foráneo) y el número de participantes, recomienda:
 *   - el precio individual por persona (según modalidad), y
 *   - el paquete grupal como alternativa, marcando si aplica al rango y si
 *     conviene (sale igual o más barato que el individual por el total).
 *
 * Se usa tanto en el serverFn qeSuggestPrice como en las pruebas automáticas.
 */

export type Modality = "Local" | "Foraneo";

export type PricePackageRow = {
  code: string;
  package_type: string; // 'individual_local' | 'individual_foraneo' | 'grupal'
  unit_price: number;
  min_participants: number | null;
  max_participants: number | null;
  tax_rate: number;
};

export type PriceSuggestion = {
  recommended: "individual" | "grupal";
  individual: {
    code: string;
    unitPrice: number;
    taxRate: number;
    total: number;
  } | null;
  grupal: {
    code: string;
    unitPrice: number;
    taxRate: number;
    minParticipants: number | null;
    maxParticipants: number | null;
    aplica: boolean;
  } | null;
};

export function suggestPrice(
  packages: PricePackageRow[],
  modality: Modality,
  participants: number,
): PriceSuggestion | null {
  if (!packages || packages.length === 0) return null;

  const individualType = modality === "Foraneo" ? "individual_foraneo" : "individual_local";
  const individual = packages.find((p) => p.package_type === individualType) ?? null;
  const grupal = packages.find((p) => p.package_type === "grupal") ?? null;

  const perPerson = individual ? Number(individual.unit_price) : null;
  const individualTotal = perPerson !== null ? perPerson * participants : null;
  const grupalTotal = grupal ? Number(grupal.unit_price) : null;

  const grupalAplica = Boolean(
    grupal &&
    (grupal.min_participants == null || participants >= grupal.min_participants) &&
    (grupal.max_participants == null || participants <= grupal.max_participants),
  );

  let recommended: "individual" | "grupal" = "individual";
  if (
    grupalAplica &&
    grupalTotal !== null &&
    individualTotal !== null &&
    grupalTotal <= individualTotal
  ) {
    recommended = "grupal";
  } else if (grupalAplica && individualTotal === null) {
    recommended = "grupal";
  }

  return {
    recommended,
    individual: individual
      ? {
          code: individual.code,
          unitPrice: perPerson as number,
          taxRate: Number(individual.tax_rate),
          total: individualTotal as number,
        }
      : null,
    grupal: grupal
      ? {
          code: grupal.code,
          unitPrice: grupalTotal as number,
          taxRate: Number(grupal.tax_rate),
          minParticipants: grupal.min_participants,
          maxParticipants: grupal.max_participants,
          aplica: grupalAplica,
        }
      : null,
  };
}
