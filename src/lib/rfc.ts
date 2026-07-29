/** Validación de RFC mexicano (persona física y moral), incluyendo fecha real. */

const RFC_RE = /^([A-ZÑ&]{3,4})(\d{2})(\d{2})(\d{2})([A-Z\d]{2})([A\d])$/;

export type RfcCheck = { valid: boolean; tipo?: "fisica" | "moral"; reason?: string };

export function normalizeRfc(input: string): string {
  return input.trim().toUpperCase().replace(/[\s-]/g, "");
}

export function validateRfc(input: string): RfcCheck {
  const rfc = normalizeRfc(input);
  if (rfc.length !== 12 && rfc.length !== 13) {
    return { valid: false, reason: "El RFC debe tener 12 (moral) o 13 (física) caracteres." };
  }
  const m = RFC_RE.exec(rfc);
  if (!m) return { valid: false, reason: "El formato del RFC no es válido." };

  const [, letras, yy, mm, dd] = m;
  const month = Number(mm);
  const day = Number(dd);
  if (month < 1 || month > 12) return { valid: false, reason: "El mes de la fecha del RFC no es válido." };

  const year = 2000 + Number(yy);
  const candidates = [year, year - 100];
  const okDay = candidates.some((y) => {
    const daysInMonth = new Date(Date.UTC(y, month, 0)).getUTCDate();
    return day >= 1 && day <= daysInMonth;
  });
  if (!okDay) return { valid: false, reason: "El día de la fecha del RFC no es válido." };

  const tipo = letras.length === 4 ? "fisica" : "moral";
  if ((tipo === "fisica" && rfc.length !== 13) || (tipo === "moral" && rfc.length !== 12)) {
    return { valid: false, reason: "La longitud del RFC no corresponde al tipo de persona." };
  }
  return { valid: true, tipo };
}

/** Enmascara el RFC para bitácoras: ABCD******X9 -> ABCD*****9 */
export function maskRfc(input: string): string {
  const rfc = normalizeRfc(input);
  if (rfc.length < 5) return "***";
  return `${rfc.slice(0, 3)}${"*".repeat(rfc.length - 4)}${rfc.slice(-1)}`;
}
