import { describe, expect, test } from "bun:test";
import { deriveSubmissionId } from "../src/lib/web-quote.server";
import type { QuoteInput } from "../src/lib/erp.server";

function baseInput(over: Partial<QuoteInput> = {}): QuoteInput {
  return {
    rfc: "XAXX010101000",
    empresa: "Empresa Demo",
    nombre: "Juan Pérez",
    correo: "juan@empresa.com",
    telefono: "7223334444",
    idCurso: 12,
    idServicio: 0,
    participantes: 22,
    lugarCurso: "Local",
    tipoCursoCliente: "Cerrado",
    lugarServicio: "",
    comentarios: "",
    fechaDeseada: "2026-10-15",
    idContratista: 0,
    nombreContratista: "",
    folioCurso: "",
    ...over,
  } as QuoteInput;
}

describe("idempotencia de la solicitud de cotización", () => {
  test("misma solicitud => mismo submission_id (evita duplicados)", () => {
    const a = deriveSubmissionId(baseInput());
    const b = deriveSubmissionId(baseInput());
    expect(a).toBe(b);
    expect(a.startsWith("auto-")).toBe(true);
  });

  test("distinto correo => distinto submission_id", () => {
    const a = deriveSubmissionId(baseInput({ correo: "juan@empresa.com" }));
    const b = deriveSubmissionId(baseInput({ correo: "otro@empresa.com" }));
    expect(a).not.toBe(b);
  });

  test("distinto curso => distinto submission_id", () => {
    const a = deriveSubmissionId(baseInput({ idCurso: 12 }));
    const b = deriveSubmissionId(baseInput({ idCurso: 99 }));
    expect(a).not.toBe(b);
  });

  test("un submissionId explícito se respeta tal cual", () => {
    const id = deriveSubmissionId(baseInput(), "front-uuid-abc-123");
    expect(id).toBe("front-uuid-abc-123");
  });

  test("el correo se normaliza (mayúsculas/minúsculas no crean duplicado)", () => {
    const a = deriveSubmissionId(baseInput({ correo: "Juan@Empresa.com" }));
    const b = deriveSubmissionId(baseInput({ correo: "juan@empresa.com" }));
    expect(a).toBe(b);
  });
});
