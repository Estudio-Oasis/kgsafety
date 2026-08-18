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

export type CalendarDiag = {
  consultado: boolean;
  ok: boolean;
  filas: number;
  vacio: boolean;
  causa: "sin_datos_noil" | "error_conexion" | "sin_credenciales" | "con_datos";
  titulo: string;
  explicacion: string;
};

export type ErpHealth = {
  conectado: boolean;
  credenciales: boolean;
  host: string;
  verificadoAt: string;
  latenciaMs: number;
  pruebas: ErpProbe[];
  calendario: CalendarDiag;
};

const CAL_SIN_CREDENCIALES: CalendarDiag = {
  consultado: false,
  ok: false,
  filas: 0,
  vacio: true,
  causa: "sin_credenciales",
  titulo: "Calendario no consultado",
  explicacion:
    "No hay credenciales de servicio configuradas, así que no pudimos consultar el calendario. Es un problema de configuración de nuestro lado, no de datos de Noil.",
};


/** Verifica la configuración del servicio de facturación (no expone el token). */
function facturacionProbe(): ErpProbe {
  const token = process.env["FACT_API_TOKEN"];
  return {
    nombre: "Servicio de facturación (token)",
    path: "-",
    ok: Boolean(token),
    status: null,
    ms: 0,
    detalle: token
      ? "token de facturación configurado"
      : "Falta el secreto FACT_API_TOKEN: las llamadas de facturación se envían sin autenticación y la API responderá 401/403. Es configuración de nuestro lado.",
  };
}

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
        facturacionProbe(),
      ],
      calendario: CAL_SIN_CREDENCIALES,
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

  let calendario: CalendarDiag = {
    consultado: false,
    ok: false,
    filas: 0,
    vacio: true,
    causa: "error_conexion",
    titulo: "Calendario no disponible",
    explicacion:
      "No se pudo autenticar contra Noil, por lo que no fue posible leer el calendario. Es un problema de conexión, no de datos.",
  };

  if (auth.probe.ok && token) {
    pruebas[0] = { ...auth.probe, detalle: "token emitido" };
    const authHeader = { Authorization: `Bearer ${token}` };
    const calPath = `/api/calendarioCursosInformacion/-1/${new Date().toISOString().slice(0, 10)}`;
    const reads = await Promise.all([
      timed("Catálogo de cursos", "/api/cursos/-1/-1/-1/-1/-1", { method: "GET", headers: authHeader }),
      timed("Calendario de cursos", calPath, { method: "GET", headers: authHeader }),
      timed("Insumos (equipos)", "/api/AlmacenInsumos/-1/-1/-1/-1/EQUIPO", {
        method: "GET",
        headers: authHeader,
      }),
    ]);

    for (const r of reads) pruebas.push(r.probe);

    const cal = reads[1]!;
    const filas = Array.isArray(cal.body) ? cal.body.length : 0;
    if (!cal.probe.ok) {
      calendario = {
        consultado: true,
        ok: false,
        filas: 0,
        vacio: true,
        causa: "error_conexion",
        titulo: "El calendario respondió con error",
        explicacion: `Noil devolvió ${cal.probe.status ?? "sin respuesta"} en ${calPath}. La lista de cursos abiertos se verá vacía por una falla técnica del ERP, no por falta de convocatorias.`,
      };
    } else if (filas === 0) {
      calendario = {
        consultado: true,
        ok: true,
        filas: 0,
        vacio: true,
        causa: "sin_datos_noil",
        titulo: "Sin convocatorias cargadas en Noil",
        explicacion:
          "La conexión y el endpoint funcionan correctamente (HTTP 200), pero Noil no tiene fechas de cursos abiertos capturadas a partir de hoy. Es un tema de datos del ERP: en cuanto el área operativa cargue el calendario, aparecerá automáticamente en el sitio. No requiere cambios de configuración.",
      };
    } else {
      calendario = {
        consultado: true,
        ok: true,
        filas,
        vacio: false,
        causa: "con_datos",
        titulo: "Calendario con convocatorias activas",
        explicacion: `Noil devolvió ${filas} fechas de cursos abiertos, visibles en el sitio público.`,
      };
    }
  }

  pruebas.push(facturacionProbe());
  const conectado = pruebas.every((p) => p.ok) && Boolean(token);
  const latencias = pruebas.filter((p) => p.ms > 0);
  const latenciaMs =
    latencias.length > 0
      ? Math.round(latencias.reduce((a, p) => a + p.ms, 0) / latencias.length)
      : 0;

  return { conectado, credenciales: true, host: BASE, verificadoAt, latenciaMs, pruebas, calendario };

}
