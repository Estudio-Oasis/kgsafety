/**
 * Verificación de conexión en vivo con el ERP Noil (solo servidor).
 * No usa datos simulados: cada prueba es una llamada real de lectura.
 */

const BASE = "https://api-erpnoil.dsaix.com.mx";

export type ErpProbe = {
  nombre: string;
  path: string;
  ok: boolean;
  status: number | null;
  ms: number;
  detalle: string;
};

export type ErpHealth = {
  conectado: boolean;
  credenciales: boolean;
  host: string;
  verificadoAt: string;
  latenciaMs: number;
  pruebas: ErpProbe[];
};

async function timed(
  nombre: string,
  path: string,
  init: RequestInit,
): Promise<{ probe: ErpProbe; body: unknown }> {
  const t0 = Date.now();
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { Accept: "application/json", ...(init.headers ?? {}) },
      signal: AbortSignal.timeout(15_000),
    });
    const raw = await res.text();
    let body: unknown = null;
    try {
      body = raw ? JSON.parse(raw) : null;
    } catch {
      body = null;
    }
    const count = Array.isArray(body)
      ? `${body.length} registros`
      : res.ok
        ? "respuesta válida"
        : raw.slice(0, 120) || `HTTP ${res.status}`;
    return {
      probe: {
        nombre,
        path,
        ok: res.ok,
        status: res.status,
        ms: Date.now() - t0,
        detalle: count,
      },
      body,
    };
  } catch (e) {
    return {
      probe: {
        nombre,
        path,
        ok: false,
        status: null,
        ms: Date.now() - t0,
        detalle: e instanceof Error ? e.message : "error de red",
      },
      body: null,
    };
  }
}

/** Ejecuta login real + lecturas reales contra el ERP y devuelve el diagnóstico. */
export async function checkErpHealth(): Promise<ErpHealth> {
  const email = process.env["ERP_API_EMAIL"];
  const password = process.env["ERP_API_PASSWORD"];
  const verificadoAt = new Date().toISOString();

  if (!email || !password) {
    return {
      conectado: false,
      credenciales: false,
      host: BASE,
      verificadoAt,
      latenciaMs: 0,
      pruebas: [
        {
          nombre: "Credenciales de servicio",
          path: "-",
          ok: false,
          status: null,
          ms: 0,
          detalle: "No hay credenciales configuradas para el ERP",
        },
      ],
    };
  }

  const auth = await timed("Autenticación", "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const pruebas: ErpProbe[] = [auth.probe];
  const token =
    auth.body && typeof auth.body === "object"
      ? ((auth.body as { access_token?: string }).access_token ?? null)
      : null;

  if (auth.probe.ok && token) {
    pruebas[0] = { ...auth.probe, detalle: "token emitido" };
    const authHeader = { Authorization: `Bearer ${token}` };
    const reads = await Promise.all([
      timed("Catálogo de cursos", "/api/cursos", { method: "GET", headers: authHeader }),
      timed("Calendario de cursos", "/api/calendarioCursos", { method: "GET", headers: authHeader }),
      timed("Insumos (equipos)", "/api/insumos?tipo=EQUIPO", { method: "GET", headers: authHeader }),
    ]);
    for (const r of reads) pruebas.push(r.probe);
  }

  const conectado = pruebas.every((p) => p.ok) && Boolean(token);
  const latenciaMs = Math.round(pruebas.reduce((a, p) => a + p.ms, 0) / pruebas.length);

  return { conectado, credenciales: true, host: BASE, verificadoAt, latenciaMs, pruebas };
}
