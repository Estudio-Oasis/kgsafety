/**
 * Cliente del ERP KG Safety (api-erpnoil.dsaix.com.mx).
 * Solo servidor: usa credenciales de servicio guardadas como secretos.
 */

import { maskRfc, normalizeRfc, validateRfc } from "./rfc";
import { currentMode, logErpCall, newTraceId, withRetry } from "./erp-monitor.server";

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

/** Respuesta simulada en modo staging: no toca el ERP real. */
function stagingResponse(path: string, method: string) {
  const seq = 900000 + Math.floor(Math.random() * 99999);
  if (path.startsWith("/api/clientesSspa") && method === "POST") {
    return { status: 201, ok: true, json: { IdCliente: seq } as unknown, text: "" };
  }
  if (path.startsWith("/api/cotizacionSolicitudesSspa") && method === "POST") {
    return {
      status: 201,
      ok: true,
      json: { IdCotizacionSolicitud: seq, SCodigoSolicitud: `STG-${seq}` } as unknown,
      text: "",
    };
  }
  if (path.startsWith("/api/calendarioCursosSolicitud") && method === "POST") {
    return { status: 200, ok: true, json: { Mensaje: "OK staging" } as unknown, text: "" };
  }
  return { status: 200, ok: true, json: null as unknown, text: "" };
}

/** Respuesta cruda del ERP: cualquier 2xx es transporte exitoso, con o sin cuerpo JSON. */
async function raw(
  path: string,
  init?: RequestInit,
  retry = true,
): Promise<{ status: number; ok: boolean; json: unknown | null; text: string }> {
  const method = (init?.method ?? "GET").toUpperCase();
  const t0 = Date.now();

  // Modo staging: las escrituras nunca llegan a Noil (no se generan registros reales).
  if (currentMode() === "staging" && method !== "GET") {
    const sim = stagingResponse(path, method);
    await logErpCall({
      stage: "staging",
      metodo: method,
      path,
      status_code: sim.status,
      ok: true,
      duracion_ms: Date.now() - t0,
      detalle: { simulado: true },
    });
    return sim;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${await token()}`,
        ...(init?.headers ?? {}),
      },
    });
  } catch (e) {
    await logErpCall({
      stage: "transporte",
      metodo: method,
      path,
      ok: false,
      duracion_ms: Date.now() - t0,
      error_code: "red_no_disponible",
      error_message: String(e),
    });
    throw e;
  }

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

  await logErpCall({
    stage: "http",
    metodo: method,
    path,
    status_code: res.status,
    ok: res.ok,
    duracion_ms: Date.now() - t0,
    error_message: res.ok ? "" : text.slice(0, 300),
  });

  return { status: res.status, ok: res.ok, json, text };
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const exec = async () => {
    const res = await raw(path, init);
    if (!res.ok) {
      const err = new Error(`ERP respondió ${res.status}`);
      // Solo los 5xx y errores de red se consideran reintentables.
      if (res.status >= 500) throw err;
      throw Object.assign(err, { noRetry: true });
    }
    return (res.json ?? null) as T;
  };

  // Las lecturas son idempotentes: se reintentan. Las escrituras nunca se duplican.
  if (method === "GET") {
    return withRetry(exec, { intentos: 3, stage: "lectura", operacion: path });
  }
  return exec();
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

type RawClient = { IdCliente: number; RFC?: string; Nombre?: string; RazonSocial?: string; sRazonSocial?: string };

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
  const clean = normalizeRfc(rfc);
  if (clean.length < 12) return null;
  const rows = unwrap<RawClient>(await call(`/api/clientesSspa/-1/${encodeURIComponent(clean)}`));
  const hit = rows.find((r) => normalizeRfc(r.RFC ?? "") === clean) ?? rows[0];
  if (!hit) return null;
  return {
    IdCliente: hit.IdCliente,
    RFC: hit.RFC ?? clean,
    Nombre: hit.Nombre ?? hit.RazonSocial ?? hit.sRazonSocial ?? "",
  };
}

export async function createClient(input: {
  rfc: string;
  nombre: string;
  correo: string;
  telefono: string;
}): Promise<number> {
  const res = await call<{ IdCliente?: number; Mensaje?: string }>("/api/clientesSspa", {
    method: "POST",
    body: JSON.stringify({
      RFC: normalizeRfc(input.rfc),
      Nombre: input.nombre.trim(),
      Correo: input.correo.trim(),
      Telefono_fijo: input.telefono.trim(),
    }),
  });
  if (!res?.IdCliente) throw new Error("ERP: no se pudo registrar el cliente");
  return res.IdCliente;
}

// ---------- CU001 / CU002: catálogo de insumos (equipos y servicios) ----------

export type ErpInsumo = {
  IdInsumo: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  familia: string;
  subfamilia: string;
  imagen: string | null;
  ficha: string | null;
  medida: string;
};

type RawInsumo = {
  IdInsumo: number;
  IdFamilia: number | null;
  IdSubFamilia: number | null;
  NombreFamilia: string | null;
  NombreSubFamilia: string | null;
  eVisibleWebSubFamilia?: string | null;
  Codigo: string;
  Material: string;
  Description: string | null;
  Medida?: string | null;
  URL_AWS_documento: string | null;
  URL_AWS_imagen: string | null;
};

export async function listInsumos(tipo: "EQUIPO" | "SERVICIO"): Promise<ErpInsumo[]> {
  const rows = unwrap<RawInsumo>(await call(`/api/AlmacenInsumos/-1/-1/-1/-1/${tipo}`));
  return rows
    .filter((r) => (r.Material ?? "").trim().length > 0)
    .map((r) => ({
      IdInsumo: r.IdInsumo,
      codigo: r.Codigo ?? "",
      nombre: (r.Material ?? "").trim(),
      descripcion: (r.Description ?? "").trim(),
      familia: (r.NombreFamilia ?? "").trim() || "Otros",
      subfamilia: (r.NombreSubFamilia ?? "").trim(),
      imagen: r.URL_AWS_imagen || null,
      ficha: r.URL_AWS_documento || null,
      medida: (r.Medida ?? "").trim(),
    }))
    .sort((a, b) => a.familia.localeCompare(b.familia, "es") || a.nombre.localeCompare(b.nombre, "es"));
}

// ---------- CU003: cursos abiertos del calendario vigente ----------

export type ErpOpenCourse = {
  IdCalendario: number;
  IdCurso: number;
  folioCurso: string;
  curso: string;
  ubicacion: string;
  direccion: string;
  cupoMaximo: number;
  cupoReservado: number;
  disponibles: number;
  tipo: string;
  tipoCliente: string;
  imagen: string | null;
  fechas: string[];
};

type RawOpenCourse = {
  IdCalendario: number;
  IdCurso: number;
  sFolioCurso: string;
  Curso: string;
  SUbicacion: string;
  SDireccion: string;
  URL_Imagen: string;
  dCupoMaximo: number;
  dCupoReservado: number;
  ETipoCurso: string;
  ETipoCursoCliente: string;
};

export async function listOpenCourses(): Promise<ErpOpenCourse[]> {
  const hoy = new Date().toISOString().slice(0, 10);
  const rows = unwrap<RawOpenCourse>(await call(`/api/calendarioCursosInformacion/-1/${hoy}`));
  const out: ErpOpenCourse[] = [];
  for (const r of rows) {
    let fechas: string[] = [];
    try {
      fechas = (await listCalendar(r.IdCurso)).map((d) => d.fecha);
    } catch {
      fechas = [];
    }
    out.push({
      IdCalendario: r.IdCalendario,
      IdCurso: r.IdCurso,
      folioCurso: r.sFolioCurso ?? "",
      curso: (r.Curso ?? "").trim(),
      ubicacion: (r.SUbicacion ?? "").trim(),
      direccion: (r.SDireccion ?? "").trim(),
      cupoMaximo: Number(r.dCupoMaximo) || 0,
      cupoReservado: Number(r.dCupoReservado) || 0,
      disponibles: Math.max(0, (Number(r.dCupoMaximo) || 0) - (Number(r.dCupoReservado) || 0)),
      tipo: r.ETipoCurso ?? "Local",
      tipoCliente: r.ETipoCursoCliente ?? "Abierto",
      imagen: r.URL_Imagen || null,
      fechas,
    });
  }
  return out;
}

// ---------- CU005: contratistas SSPA ----------

export type ErpContractor = { IdContratista: number; nombre: string };

export async function listContractors(): Promise<ErpContractor[]> {
  const rows = unwrap<{ IdContratista: number; Nombre: string; Activo?: string }>(
    await call("/api/contratistasSspa/-1/Si"),
  );
  return rows
    .filter((r) => (r.Nombre ?? "").trim().length > 0)
    .map((r) => ({ IdContratista: r.IdContratista, nombre: r.Nombre.trim() }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
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
  idContratista?: number;
  nombreContratista?: string;
  folioCurso?: string;
};

export type QuoteResult = {
  status: "creada" | "recibida_pendiente_verificacion";
  idSolicitud: number | null;
  folio: string | null;
  idCliente: number;
  clienteExistente: boolean;
  fechaAgendada: boolean;
  traceId: string;
};

type RawQuote = {
  IdCotizacionSolicitud?: number;
  SCodigoSolicitud?: string;
  DFechaCotizacion?: string;
  IdCliente?: number;
  IdCurso?: number;
};

function log(traceId: string, stage: ErpStage, detail: Record<string, unknown>) {
  // Bitácora técnica: nunca contraseña, JWT ni RFC completo.
  console.log(`[erp][${traceId}][${stage}] ${JSON.stringify(detail)}`);
  void logErpCall({
    stage,
    operacion: "cotizacion",
    ok: !("error" in detail),
    error_message: typeof detail.error === "string" ? detail.error : "",
    detalle: detail,
  });
}

/** Consulta cotizaciones ya almacenadas. -1 desactiva cada filtro. */
async function findQuotes(filters: {
  fecha: string;
  idCliente: number;
  idServicio: number;
  idCurso: number;
  tipoCursoCliente: string;
}): Promise<RawQuote[]> {
  const path =
    `/api/cotizacionSolicitudes/-1/-1/${filters.fecha}/${filters.idCliente}/` +
    `${filters.idServicio}/${filters.idCurso}/${encodeURIComponent(filters.tipoCursoCliente)}`;
  try {
    return unwrap<RawQuote>(await call(path));
  } catch {
    return [];
  }
}

export async function createQuote(
  input: QuoteInput,
  opts?: { traceId?: string },
): Promise<QuoteResult> {
  const traceId = opts?.traceId ?? newTraceId();
  const rfc = normalizeRfc(input.rfc);

  // 1. Validación real de RFC (formato + fecha).
  const check = validateRfc(rfc);
  if (!check.valid) {
    log(traceId, "validacion", { rfc: maskRfc(rfc), ok: false });
    throw new ErpError("validacion", "rfc_invalido", check.reason ?? "El RFC no es válido.");
  }

  // 2. Buscar cliente por RFC.
  let existing: ErpClient | null = null;
  try {
    existing = await findClientByRfc(rfc);
  } catch (e) {
    log(traceId, "buscar_cliente", { error: String(e) });
    throw new ErpError("buscar_cliente", "erp_no_disponible", "No pudimos consultar el cliente en el sistema.", {
      retryable: true,
    });
  }
  log(traceId, "buscar_cliente", { rfc: maskRfc(rfc), encontrado: Boolean(existing) });

  // 3. Alta única del cliente si no existe.
  let idCliente = existing?.IdCliente ?? 0;
  if (!idCliente) {
    try {
      idCliente = await createClient({
        rfc,
        nombre: input.empresa || input.nombre,
        correo: input.correo,
        telefono: input.telefono,
      });
    } catch (e) {
      log(traceId, "crear_cliente", { error: String(e) });
      throw new ErpError("crear_cliente", "alta_cliente_fallida", "No pudimos dar de alta el cliente en el sistema.", {
        retryable: false,
      });
    }
    log(traceId, "crear_cliente", { idCliente });
  }

  // 4. Crear cotización con los doce campos obligatorios.
  const fecha = new Date().toISOString().slice(0, 10);
  const idServicio = input.idServicio || 0;
  const comentarios =
    [`Contacto: ${input.nombre}`, `Empresa: ${input.empresa}`, input.comentarios]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 900) || "Solicitud web";

  const post = await raw("/api/cotizacionSolicitudesSspa", {
    method: "POST",
    body: JSON.stringify({
      DFechaCotizacion: fecha,
      IdCliente: idCliente,
      IdContratista: input.idContratista ?? 0,
      SNombreContratista: (input.nombreContratista ?? "").trim(),
      SFolioCurso: (input.folioCurso ?? "").trim(),
      IdServicio: idServicio,
      IdCurso: input.idCurso,
      ICantidad: input.participantes,
      ELugarCurso: input.lugarCurso,
      ETipoCursoCliente: input.tipoCursoCliente,
      sLugarServicio: input.lugarServicio || input.lugarCurso,
      SCorreoContacto: input.correo,
      STelefonoContacto: input.telefono,
      Comentarios: comentarios,
      Estatus: "Pendiente",
    }),
  });

  log(traceId, "crear_cotizacion", { status: post.status, conCuerpo: post.json !== null });

  // Cualquier 2xx es transporte exitoso, con o sin cuerpo JSON. No se reintenta el POST.
  if (!post.ok) {
    throw new ErpError(
      "crear_cotizacion",
      post.status >= 500 ? "erp_error_interno" : "cotizacion_rechazada",
      post.status >= 500
        ? "El sistema del ERP no respondió correctamente."
        : "El sistema rechazó los datos de la solicitud.",
      { status: post.status, retryable: false },
    );
  }

  const body = (post.json ?? {}) as RawQuote;
  let idSolicitud = body.IdCotizacionSolicitud ?? null;
  let folio = body.SCodigoSolicitud ?? null;

  // 5. Verificación posterior mediante GET filtrado (el 201 puede venir vacío).
  if (!idSolicitud) {
    const found = await findQuotes({
      fecha,
      idCliente,
      idServicio,
      idCurso: input.idCurso,
      tipoCursoCliente: input.tipoCursoCliente,
    });
    const last = found[found.length - 1];
    if (last?.IdCotizacionSolicitud) {
      idSolicitud = last.IdCotizacionSolicitud;
      folio = last.SCodigoSolicitud ?? folio;
    }
    log(traceId, "verificar_cotizacion", { encontrados: found.length, idSolicitud });
  }

  // 6. Fecha del calendario (opcional, no invalida la cotización).
  let fechaAgendada = false;
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
      fechaAgendada = true;
    } catch (e) {
      log(traceId, "agendar_fecha", { error: String(e) });
    }
  }

  return {
    status: idSolicitud ? "creada" : "recibida_pendiente_verificacion",
    idSolicitud,
    folio,
    idCliente,
    clienteExistente: Boolean(existing),
    fechaAgendada,
    traceId,
  };
}

