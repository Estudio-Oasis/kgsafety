/**
 * Resúmenes con IA para el portal (solo servidor).
 * Usa Lovable AI Gateway; la llave nunca sale del servidor.
 */

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

export type AiSummary = {
  resumen: string;
  generadoAt: string;
};

const SYSTEM = `Eres analista de operaciones de KG Safety, empresa mexicana de seguridad industrial y trabajos en altura.
Traduces datos técnicos a lenguaje claro para dirección general.
Reglas:
- Español de México, directo, sin tecnicismos innecesarios.
- Máximo 6 viñetas cortas, cada una con una idea accionable.
- Empieza con una línea de veredicto en negritas (**Todo en orden** / **Atención** / **Riesgo**).
- Nunca inventes cifras: usa solo los datos entregados.
- Si algo está marcado como prueba, acláralo.
- No uses encabezados ni tablas, solo la línea de veredicto y viñetas.`;

/** Genera un resumen en lenguaje natural a partir de un contexto estructurado. */
export async function summarizeForOwner(input: {
  titulo: string;
  contexto: unknown;
}): Promise<AiSummary> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("IA no configurada");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `${input.titulo}\n\nDatos (JSON):\n${JSON.stringify(input.contexto).slice(0, 12000)}`,
        },
      ],
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (res.status === 429) throw new Error("Límite de uso de IA alcanzado. Intenta en unos minutos.");
  if (res.status === 402) throw new Error("Créditos de IA agotados en el espacio de trabajo.");
  if (!res.ok) throw new Error(`IA no disponible (${res.status})`);

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const resumen = data.choices?.[0]?.message?.content?.trim();
  if (!resumen) throw new Error("La IA no devolvió contenido");

  return { resumen, generadoAt: new Date().toISOString() };
}
