/**
 * Cliente del ERP KG Safety (api-erpnoil.dsaix.com.mx).
 * Solo servidor: usa credenciales de servicio guardadas como secretos.
 */

const BASE = "https://api-erpnoil.dsaix.com.mx";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function login(): Promise<string> {
  const email = process.env.ERP_API_EMAIL;
  const password = process.env.ERP_API_PASSWORD;
  if (!email || !password) throw new Error("ERP: credenciales no configuradas");

  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`ERP login falló [${res.status}]: ${await res.text()}`);
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("ERP login: respuesta sin token");
  cachedToken = {
    value: data.access_token,
    // margen de 60s antes del vencimiento real
    expiresAt: Date.now() + Math.max(60, (data.expires_in ?? 3600) - 60) * 1000,
  };
  return data.access_token;
}

async function token(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  return login();
}

export type ErpStage =
  | "auth"
  | "validacion"
  | "buscar_cliente"
  | "crear_cliente"
  | "crear_cotizacion"
  | "verificar_cotizacion"
  | "agendar_fecha";

export class ErpError extends Error {
  stage: ErpStage;
  code: string;
  status?: number;
  retryable: boolean;
  constructor(stage: ErpStage, code: string, message: string, opts?: { status?: number; retryable?: boolean }) {
    super(message);
    this.stage = stage;
    this.code = code;
    this.status = opts?.status;
    this.retryable = opts?.retryable ?? false;
  }
}

/** Respuesta cruda del ERP: cualquier 2xx es transporte exitoso, con o sin cuerpo JSON. */
async function raw(
  path: string,
  init?: RequestInit,
  retry = true,
): Promise<{ status: number; ok: boolean; json: unknown | null; text: string }> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${await token()}`,
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 401 && retry) {
    cachedToken = null;
    return raw(path, init, false);
  }

  const text = (await res.text()).trim();
  let json: unknown | null = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }
  return { status: res.status, ok: res.ok, json, text };
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await raw(path, init);
  if (!res.ok) {
    console.error(`ERP ${path} [${res.status}]`);
    throw new Error(`ERP respondió ${res.status}`);
  }
  return (res.json ?? null) as T;
}


/** Varios GET del ERP devuelven [datos, statusCode]. */
function unwrap<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    const first = payload[0];
    if (Array.isArray(first)) return first as T[];
    return payload as T[];
  }
  return [];
}

// ---------- Tipos ----------

export type ErpCourse = {
  IdCurso: number;
  IdServicio: number;
  nombre: string;
  duracion: number;
  precio: number;
  precioForaneo: number;
};

export type ErpCalendarDate = {
  IdCalendario: number;
  fecha: string; // YYYY-MM-DD
  fechaTexto: string;
  IdCurso: number;
  curso: string;
  tipo: string; // Local | Foraneo
  tipoCliente: string; // Cerrado | Abierto
};

export type ErpClient = {
  IdCliente: number;
  RFC: string;
  Nombre: string;
};

type RawCourse = {
  IdCurso: number;
  IdServicio: number;
  Curso: string;
  Material: string;
  Duracion: number;
  dPrecioUnitario: string;
  dPrecioUnitarioExt: string;
  Activo: string;
  eEvisibleWeb: string;
};

type RawCalendar = {
  IdCalendario: number;
  dFechaCurso: string;
  fdFechaCurso: string;
  IdCurso: number;
  Curso: string;
  ETipoCurso: string;
  ETipoCursoCliente: string;
};

type RawClient = { IdCliente: number; RFC?: string; Nombre?: string; sRazonSocial?: string };

// ---------- Operaciones ----------

export async function listCourses(): Promise<ErpCourse[]> {
  const raw = unwrap<RawCourse>(await call("/api/cursos/-1/-1/-1/-1/-1"));
  const byName = new Map<string, ErpCourse>();
  for (const c of raw) {
    if (c.Activo !== "Si" || c.eEvisibleWeb !== "Si") continue;
    const nombre = (c.Material || c.Curso || "").trim();
    if (!nombre || nombre === "CURSO") continue;
    const existing = byName.get(nombre);
    if (existing && existing.IdCurso <= c.IdCurso) continue;
    byName.set(nombre, {
      IdCurso: c.IdCurso,
      IdServicio: c.IdServicio ?? 0,
      nombre,
      duracion: Number(c.Duracion) || 0,
      precio: Number(c.dPrecioUnitario) || 0,
      precioForaneo: Number(c.dPrecioUnitarioExt) || 0,
    });
  }
  return [...byName.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export async function listCalendar(idCurso?: number): Promise<ErpCalendarDate[]> {
  const curso = idCurso && idCurso > 0 ? idCurso : -1;
  const path = `/api/calendarioCursos/-1/-1/-1/-1/-1/${curso}/-1/-1/-1/-1/-1/-1/-1/-1`;
  const raw = unwrap<RawCalendar>(await call(path));
  const hoy = new Date().toISOString().slice(0, 10);
  return raw
    .filter((d) => (d.dFechaCurso ?? "").slice(0, 10) >= hoy)
    .map((d) => ({
      IdCalendario: d.IdCalendario,
      fecha: d.dFechaCurso.slice(0, 10),
      fechaTexto: d.fdFechaCurso,
      IdCurso: d.IdCurso,
      curso: d.Curso,
      tipo: d.ETipoCurso,
      tipoCliente: d.ETipoCursoCliente,
    }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export async function findClientByRfc(rfc: string): Promise<ErpClient | null> {
  const clean = rfc.trim().toUpperCase();
  if (clean.length < 12) return null;
  const raw = unwrap<RawClient>(await call(`/api/clientes/-1/${encodeURIComponent(clean)}`));
  const hit = raw[0];
  if (!hit) return null;
  return {
    IdCliente: hit.IdCliente,
    RFC: hit.RFC ?? clean,
    Nombre: hit.Nombre ?? hit.sRazonSocial ?? "",
  };
}

export async function createClient(input: {
  rfc: string;
  nombre: string;
  correo: string;
  telefono: string;
}): Promise<number> {
  const res = await call<{ IdCliente?: number; Mensaje?: string }>("/api/clientes", {
    method: "POST",
    body: JSON.stringify({
      RFC: input.rfc.trim().toUpperCase(),
      Nombre: input.nombre.trim(),
      Correo: input.correo.trim(),
      Telefono_fijo: input.telefono.trim(),
    }),
  });
  if (!res?.IdCliente) throw new Error("ERP: no se pudo registrar el cliente");
  return res.IdCliente;
}

export type QuoteInput = {
  rfc: string;
  empresa: string;
  nombre: string;
  correo: string;
  telefono: string;
  idCurso: number;
  idServicio: number;
  participantes: number;
  lugarCurso: "Local" | "Foraneo";
  tipoCursoCliente: "Cerrado" | "Abierto";
  lugarServicio: string;
  comentarios: string;
  fechaDeseada?: string;
};

export async function createQuote(input: QuoteInput) {
  const existing = await findClientByRfc(input.rfc);
  const idCliente =
    existing?.IdCliente ??
    (await createClient({
      rfc: input.rfc,
      nombre: input.empresa || input.nombre,
      correo: input.correo,
      telefono: input.telefono,
    }));

  const res = await call<{ IdCotizacionSolicitud?: number; SCodigoSolicitud?: string; mensaje?: string }>(
    "/api/cotizacionSolicitudes",
    {
      method: "POST",
      body: JSON.stringify({
        DFechaCotizacion: new Date().toISOString().slice(0, 10),
        IdCliente: idCliente,
        IdServicio: input.idServicio || 0,
        IdCurso: input.idCurso,
        ICantidad: input.participantes,
        ELugarCurso: input.lugarCurso,
        ETipoCursoCliente: input.tipoCursoCliente,
        sLugarServicio: input.lugarServicio || input.lugarCurso,
        SCorreoContacto: input.correo,
        STelefonoContacto: input.telefono,
        Comentarios: [`Contacto: ${input.nombre}`, `Empresa: ${input.empresa}`, input.comentarios]
          .filter(Boolean)
          .join(" · ")
          .slice(0, 900),
        Estatus: "Pendiente",
      }),
    },
  );

  const idSolicitud = res?.IdCotizacionSolicitud;

  if (idSolicitud && input.fechaDeseada) {
    try {
      await call("/api/calendarioCursosSolicitud", {
        method: "POST",
        body: JSON.stringify({
          dFechaCurso: input.fechaDeseada,
          IdCurso: input.idCurso,
          ETipoCurso: input.lugarCurso,
          IdCotizacionSolicitud: idSolicitud,
        }),
      });
    } catch (e) {
      // La cotización ya quedó registrada; la fecha se agenda manualmente.
      console.error("ERP: no se pudo agendar la fecha", e);
    }
  }

  return {
    idSolicitud: idSolicitud ?? null,
    folio: res?.SCodigoSolicitud ?? null,
    idCliente,
    clienteExistente: Boolean(existing),
  };
}
