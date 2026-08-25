/**
 * Cliente del sistema de facturación / timbrado CFDI (api-fact.noilmx.com).
 * Solo servidor: el sitio nunca llama a esta API directamente desde el navegador.
 *
 * Cada llamada queda auditada (endpoint, status, latencia, trace y resumen de
 * request/response) en la misma bitácora que el ERP, para revisión en el portal.
 */

import { erpCtx, logErpCall, newTraceId } from "./erp-monitor.server";
import { sanitizeBody } from "./erp-sanitize";

const BASE = process.env.FACT_API_BASE || "https://api-fact.noilmx.com/api";



/** true cuando la API rechazó la llamada por autenticación (falta o es inválido el token). */
export function esNoAutenticado(status: number | null): boolean {
  return status === 401 || status === 403;
}

export const MSG_NO_AUTENTICADO =
  "El servicio de facturación rechazó la conexión por falta de autenticación (problema de configuración de nuestro sistema, no de la cotización). Ya lo estamos revisando; contacte a Administración.";

/** true cuando ni siquiera hay token configurado para el servicio de facturación. */
export function faltaTokenFacturacion(): boolean {
  return !process.env["FACT_API_TOKEN"];
}

/** Resumen seguro y acotado de un cuerpo de request/response para auditoría. */
export function resumirCuerpo(value: unknown, max = 1200): unknown {
  return sanitizeBody(value, max);
}


/** Agrupa varias llamadas de facturación bajo una misma referencia de auditoría. */
export async function withFactTrace<T>(operacion: string, fn: () => Promise<T>): Promise<T> {
  if (erpCtx.getStore()) return fn();
  return erpCtx.run(
    { traceId: newTraceId(), leadId: null, operacion, modo: "live", esPrueba: false, intento: 1 },
    fn,
  );
}

async function call<T>(path: string, init?: RequestInit): Promise<{ status: number; body: T }> {
  const metodo = (init?.method ?? "GET").toUpperCase();
  const t0 = Date.now();
  let requestBody: unknown = null;
  if (typeof init?.body === "string") {
    try {
      requestBody = JSON.parse(init.body);
    } catch {
      requestBody = init.body.slice(0, 200);
    }
  }

  const registrar = (status: number | null, ok: boolean, respuesta: unknown, errorMessage = "") =>
    logErpCall({
      operacion: erpCtx.getStore()?.operacion ?? "facturacion",
      stage: `facturacion:${path.split("/").filter(Boolean)[0] ?? "api"}`,
      metodo,
      path: `${BASE}${path}`,
      status_code: status,
      ok,
      duracion_ms: Date.now() - t0,
      error_code: ok ? "" : `fact_${status ?? "red"}`,
      error_message: errorMessage,
      detalle: {
        sistema: "facturacion",
        request: resumirCuerpo(requestBody),
        response: resumirCuerpo(respuesta),
      },
    });

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(process.env.FACT_API_TOKEN ? { Authorization: `Bearer ${process.env.FACT_API_TOKEN}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch (e) {
    await registrar(null, false, null, e instanceof Error ? e.message : "error de red");
    throw e;
  }

  const text = await res.text();
  let body: unknown = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = { error: text.slice(0, 300) };
  }
  if (!res.ok) console.error(`FACT ${path} [${res.status}]: ${text.slice(0, 400)}`);
  await registrar(res.status, res.ok, body, res.ok ? "" : text.slice(0, 300));
  return { status: res.status, body: body as T };
}


// ---------- Empresa de facturación del contrato ----------

/** Aplana la respuesta de Noil: objeto raíz, arreglo, o patrón [datos, statusCode]. */
function filas(payload: unknown): Record<string, unknown>[] {
  if (payload === null || typeof payload !== "object") return [];
  if (Array.isArray(payload)) {
    const out: Record<string, unknown>[] = [];
    for (const item of payload) {
      if (item && typeof item === "object" && !Array.isArray(item)) out.push(item as Record<string, unknown>);
      else if (Array.isArray(item)) out.push(...filas(item));
    }
    return out;
  }
  const obj = payload as Record<string, unknown>;
  const out: Record<string, unknown>[] = [obj];
  for (const key of ["data", "datos", "result", "resultado", "items"]) {
    if (obj[key] !== undefined) out.push(...filas(obj[key]));
  }
  return out;
}

function numeroPositivo(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export type EmpresaFacturacion = {
  contrato: string;
  idEmpresaFacturacion: number;
  idEmpresa: number | null;
  descripcion: string;
};

const CONTRATO_DEFAULT = process.env["FACT_CONTRATO"] || "KGSAFETY";
const TTL_MS = 10 * 60 * 1000;
const cacheEmpresa = new Map<string, { at: number; valor: EmpresaFacturacion }>();

export const MSG_SIN_EMPRESA_FACTURACION =
  "No se pudo determinar la empresa de facturación configurada para el contrato. Es un problema de configuración de nuestro sistema; contacte a Administración.";

/**
 * Obtiene el IdEmpresaFacturacion real del contrato desde Noil.
 * Devuelve null si no se puede resolver: nunca se sustituye por el texto del contrato.
 */
export async function getEmpresaFacturacion(
  contrato: string = CONTRATO_DEFAULT,
): Promise<EmpresaFacturacion | null> {
  const clave = contrato.trim().toUpperCase();
  const hit = cacheEmpresa.get(clave);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.valor;

  const { status, body } = await call<unknown>(`/proyecto/contrato/${encodeURIComponent(contrato.trim())}`);
  if (status !== 200) return null;

  for (const fila of filas(body)) {
    const id =
      numeroPositivo(fila["IdEmpresaFacturacion"]) ??
      numeroPositivo(fila["idEmpresaFacturacion"]) ??
      numeroPositivo((fila["proyecto"] as Record<string, unknown> | undefined)?.["IdEmpresaFacturacion"]);
    if (id === null) continue;
    const valor: EmpresaFacturacion = {
      contrato: String(fila["sContrato"] ?? fila["sCodigo"] ?? contrato),
      idEmpresaFacturacion: id,
      idEmpresa: numeroPositivo(fila["IdEmpresa"]),
      descripcion: String(fila["mDescripcion"] ?? ""),
    };
    cacheEmpresa.set(clave, { at: Date.now(), valor });
    return valor;
  }
  return null;
}

export type FiscalClient = {
  IdProveedorCliente: number;
  NombreEmpresa: string;
  RFC: string;
  Codigo: string;
  Calle?: string | null;
  No?: string | null;
  NoInt?: string | null;
  Colonia?: string | null;
  CP?: string | null;
  TelEmpresa?: string | null;
  Email?: string | null;
  RegimenFiscal?: string | null;
};

export async function findFiscalClient(codigo: string) {
  const { status, body } = await call<unknown>(
    `/proveedorcliente/buscar/${encodeURIComponent(codigo.trim())}`,
  );
  if (status !== 200) return null;

  for (const fila of filas(body)) {
    const anidado = fila["master_cliente"] as Record<string, unknown> | undefined;
    const id =
      numeroPositivo(fila["IdProveedorCliente"]) ??
      numeroPositivo(fila["IdClienteProveedor"]) ??
      numeroPositivo(anidado?.["IdProveedorCliente"]) ??
      numeroPositivo(anidado?.["IdClienteProveedor"]);
    if (id === null) continue;
    const base = (anidado && typeof anidado === "object" ? { ...anidado, ...fila } : fila) as Record<
      string,
      unknown
    >;
    return { ...(base as unknown as FiscalClient), IdProveedorCliente: id };
  }
  return null;
}

export async function issueInvoice(input: {
  IdProveedorCliente: number;
  NoCotizacion: string;
  UsoCFDI: string;
  Referencia?: string;
}) {
  // El 422 de Noil ("No se encontró la empresa de facturación configurada para el
  // contrato") indica que el timbrado depende del contrato. Resolvemos y dejamos
  // constancia en la bitácora; el cuerpo del POST se mantiene según el contrato
  // documentado en Swagger (sin campo de empresa) hasta confirmarlo con Noil.
  const empresa = await getEmpresaFacturacion();
  if (!empresa) {
    return { ok: false as const, error: MSG_SIN_EMPRESA_FACTURACION };
  }
  await logErpCall({
    operacion: erpCtx.getStore()?.operacion ?? "facturacion_emitir",
    stage: "facturacion:empresa-facturacion",
    metodo: "GET",
    path: `${BASE}/proyecto/contrato/${empresa.contrato}`,
    status_code: 200,
    ok: true,
    duracion_ms: 0,
    error_code: "",
    error_message: "",
    detalle: {
      sistema: "facturacion",
      request: { contrato: empresa.contrato, cotizacion: input.NoCotizacion },
      response: { IdEmpresaFacturacion: empresa.idEmpresaFacturacion, IdEmpresa: empresa.idEmpresa },
    },
  });

  const { status, body } = await call<{
    success?: boolean;
    uuid?: string;
    mensaje?: string;
    error?: string;
    tipo_error?: string;
  }>("/facturar/emitir", { method: "POST", body: JSON.stringify(input) });

  if (status === 200 && body?.success) {
    return { ok: true as const, uuid: body.uuid ?? null, mensaje: body.mensaje ?? "Factura timbrada." };
  }
  return {
    ok: false as const,
    error:
      body?.error ??
      (status === 404
        ? "No encontramos esa cotización en el sistema."
        : "No fue posible emitir la factura. Contacte al área de facturación."),
  };
}

// ---------- CU006: validación administrativa de la cotización ----------

const ESTATUS_VALIDOS = ["pendiente", "validada", "validado", "autorizada", "autorizado"];

export type QuoteAdminInfo = {
  estatus: string;
  tipoCliente: "Normal" | "Frecuente";
  codigoCliente: string;
  monto: number;
  noCotizacion: string;
};

export async function checkQuoteForInvoice(cotizacion: string) {
  const { status, body } = await call<
    Array<{
      EEstatus?: string;
      DMonto?: number | string;
      IdClienteProveedor?: string | number;
      SCodigoCotizacion?: string;
      master_cliente?: { ETipoCliente?: string; Codigo?: string };
    }>
  >(`/adminclientesfacturas/buscar/${encodeURIComponent(cotizacion.trim())}`);

  const rows = Array.isArray(body) ? body : [];
  if (esNoAutenticado(status)) {
    return {
      ok: false as const,
      code: "servicio_no_autenticado",
      error: MSG_NO_AUTENTICADO,
      info: null,
    };
  }
  if (status !== 200) {
    return {
      ok: false as const,
      code: "servicio",
      error: "El servicio de facturación no respondió correctamente. Intente más tarde.",
      info: null,
    };
  }
  if (rows.length === 0) {
    return {
      ok: false as const,
      code: "no_encontrada",
      error:
        "La factura podrá obtenerse al día siguiente de la operación. Si ya pasó ese plazo, verifique el número de cotización.",
      info: null,
    };
  }


  const row = rows[0]!;
  const estatus = (row.EEstatus ?? "").trim();
  const low = estatus.toLowerCase();

  if (low === "facturado" || low === "facturada") {
    return {
      ok: false as const,
      code: "ya_facturada",
      error: `La cotización con No. ${cotizacion} ya se encuentra facturada.`,
      info: null,
    };
  }
  if (!ESTATUS_VALIDOS.includes(low)) {
    return {
      ok: false as const,
      code: "estatus_no_permitido",
      error: `La cotización tiene un estatus de "${estatus}" que no permite facturación directa.`,
      info: null,
    };
  }

  const info: QuoteAdminInfo = {
    estatus,
    tipoCliente: (row.master_cliente?.ETipoCliente ?? "Normal") === "Frecuente" ? "Frecuente" : "Normal",
    codigoCliente: String(row.IdClienteProveedor ?? row.master_cliente?.Codigo ?? "").trim(),
    monto: Number(row.DMonto ?? 0) || 0,
    noCotizacion: row.SCodigoCotizacion ?? cotizacion,
  };
  return { ok: true as const, code: "ok", error: null, info };
}

export async function validatePayment(cotizacion: string, referencia: string, monto: number) {
  const { status, body } = await call<Array<{ DMontoDeposito?: number | string }>>(
    `/masteringresosegresos/buscar/${encodeURIComponent(cotizacion.trim())}/${encodeURIComponent(referencia.trim())}`,
  );
  const rows = Array.isArray(body) ? body : [];
  if (status !== 200 || rows.length === 0) {
    return { ok: false as const, error: "No encontramos un pago con esa referencia. Verifique con el administrador." };
  }
  const suma = rows.reduce((acc, r) => acc + (Number(r.DMontoDeposito ?? 0) || 0), 0);
  if (suma.toFixed(2) !== monto.toFixed(2)) {
    return { ok: false as const, error: "El monto a facturar no coincide, verifique con el administrador." };
  }
  return { ok: true as const, error: null };
}

export async function updateFiscalClient(
  id: number,
  data: { Calle: string; No: string; NoInt: string; Colonia: string; CP: string; TelEmpresa: string },
) {
  const { status } = await call(`/proveedorcliente/${id}`, { method: "PUT", body: JSON.stringify(data) });
  return status >= 200 && status < 300;
}

// ---------- CU007: consulta de factura timbrada ----------

export type InvoiceRecord = {
  Folio?: string | number;
  FolioFiscal?: string;
  SCodigoCotizacion?: string;
  NoCotizacion?: string;
  FechaHoraCreacion?: string;
  TotalFactura?: number | string;
  XML?: string;
};

export async function findInvoice(criterio: string, contrato: string = CONTRATO_DEFAULT) {
  const empresa = await getEmpresaFacturacion(contrato);
  if (!empresa) {
    await logErpCall({
      operacion: erpCtx.getStore()?.operacion ?? "facturacion_consultar",
      stage: "facturacion:empresa-facturacion",
      metodo: "GET",
      path: `${BASE}/proyecto/contrato/${contrato}`,
      status_code: null,
      ok: false,
      duracion_ms: 0,
      error_code: "fact_sin_empresa",
      error_message: `No se resolvió IdEmpresaFacturacion para el contrato ${contrato}; se aborta la búsqueda para no devolver resultados vacíos engañosos.`,
      detalle: { sistema: "facturacion", request: { contrato }, response: null },
    });
    return { ok: false as const, invoice: null, error: MSG_SIN_EMPRESA_FACTURACION };
  }

  const { status, body } = await call<InvoiceRecord[]>(
    `/facturafactura/buscar/${encodeURIComponent(criterio.trim())}/${encodeURIComponent(
      String(empresa.idEmpresaFacturacion),
    )}`,
  );
  const rows = Array.isArray(body) ? body : [];
  if (esNoAutenticado(status)) return { ok: false as const, invoice: null, error: MSG_NO_AUTENTICADO };
  if (status !== 200) return { ok: false as const, invoice: null, error: "Servicio de búsqueda no disponible." };
  const hit = rows[0];
  if (!hit) return { ok: false as const, invoice: null, error: "No se encontró ninguna factura con los datos proporcionados." };
  return {
    ok: true as const,
    error: null,
    invoice: {
      folio: String(hit.Folio ?? ""),
      uuid: hit.FolioFiscal ?? "",
      cotizacion: hit.SCodigoCotizacion ?? hit.NoCotizacion ?? "",
      fecha: (hit.FechaHoraCreacion ?? "").slice(0, 10),
      total: Number(hit.TotalFactura ?? 0) || 0,
      xml: hit.XML ?? null,
    },
  };
}

// ---------- Vista previa del PDF antes de timbrar ----------

export type InvoicePreview =
  | { ok: true; pdfBase64: string; bytes: number; error: null }
  | { ok: false; pdfBase64: null; bytes: 0; error: string };

/**
 * Genera la vista previa del CFDI (PDF) sin timbrar.
 * Devuelve el PDF en base64 para mostrarlo en el portal.
 */
export async function previewInvoicePdf(input: {
  IdProveedorCliente: number;
  NoCotizacion: string;
  UsoCFDI: string;
  Referencia?: string;
}): Promise<InvoicePreview> {
  const metodo = "POST";
  const path = "/facturar/preview-pdf";
  const t0 = Date.now();

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: metodo,
      headers: {
        Accept: "application/pdf, application/json",
        "Content-Type": "application/json",
        ...(process.env.FACT_API_TOKEN ? { Authorization: `Bearer ${process.env.FACT_API_TOKEN}` } : {}),
      },
      body: JSON.stringify(input),
    });
  } catch (e) {
    await logErpCall({
      operacion: "facturacion_preview",
      stage: "facturacion:preview-pdf",
      metodo,
      path: `${BASE}${path}`,
      status_code: null,
      ok: false,
      duracion_ms: Date.now() - t0,
      error_code: "fact_red",
      error_message: e instanceof Error ? e.message : "error de red",
      detalle: { sistema: "facturacion", request: resumirCuerpo(input), response: null },
    });
    return { ok: false, pdfBase64: null, bytes: 0, error: "No se pudo contactar el servicio de facturación." };
  }

  const tipo = res.headers.get("content-type") ?? "";
  const esPdf = res.ok && tipo.includes("pdf");
  let pdfBase64: string | null = null;
  let bytes = 0;
  let mensaje = "";

  if (esPdf) {
    const buf = new Uint8Array(await res.arrayBuffer());
    bytes = buf.byteLength;
    let bin = "";
    for (const b of buf) bin += String.fromCharCode(b);
    pdfBase64 = btoa(bin);
  } else {
    const texto = await res.text();
    try {
      const j = JSON.parse(texto) as { error?: string; mensaje?: string; pdf?: string };
      if (j.pdf) {
        pdfBase64 = j.pdf.replace(/^data:application\/pdf;base64,/, "");
        bytes = Math.round((pdfBase64.length * 3) / 4);
      }
      mensaje = j.error ?? j.mensaje ?? "";
    } catch {
      mensaje = texto.slice(0, 300);
    }
  }

  await logErpCall({
    operacion: "facturacion_preview",
    stage: "facturacion:preview-pdf",
    metodo,
    path: `${BASE}${path}`,
    status_code: res.status,
    ok: Boolean(pdfBase64),
    duracion_ms: Date.now() - t0,
    error_code: pdfBase64 ? "" : `fact_${res.status}`,
    error_message: pdfBase64 ? "" : mensaje,
    detalle: {
      sistema: "facturacion",
      request: resumirCuerpo(input),
      response: pdfBase64 ? { contentType: tipo || "application/pdf", bytes } : resumirCuerpo(mensaje),
    },
  });

  if (!pdfBase64) {
    if (esNoAutenticado(res.status)) {
      return { ok: false, pdfBase64: null, bytes: 0, error: MSG_NO_AUTENTICADO };
    }
    return {
      ok: false,
      pdfBase64: null,
      bytes: 0,
      error:
        mensaje ||
        (res.status === 404
          ? "No encontramos esa cotización para generar la vista previa."
          : "No fue posible generar la vista previa del PDF."),
    };
  }
  return { ok: true, pdfBase64, bytes, error: null };
}

// ---------- PDF propio de una factura YA TIMBRADA ----------

/**
 * Genera el PDF de un CFDI timbrado con nuestra propia librería, a partir del
 * registro completo de GET /facturafactura/buscar/{criterio}/{idEmpresa}.
 * No llama a ningún endpoint de PDF externo. El QR se toma únicamente del
 * base64 que venga en la respuesta; si no viene, queda la leyenda y se registra.
 */
export async function buildStampedInvoicePdf(criterio: string, contrato: string = CONTRATO_DEFAULT) {
  const vacio = { ok: false as const, pdfBase64: null, bytes: 0, folio: "", uuid: "", qr: false };

  const empresa = await getEmpresaFacturacion(contrato);
  if (!empresa) return { ...vacio, error: MSG_SIN_EMPRESA_FACTURACION };

  const { status, body } = await call<unknown>(
    `/facturafactura/buscar/${encodeURIComponent(criterio.trim())}/${encodeURIComponent(
      String(empresa.idEmpresaFacturacion),
    )}`,
  );
  if (esNoAutenticado(status)) return { ...vacio, error: MSG_NO_AUTENTICADO };
  if (status !== 200) return { ...vacio, error: "Servicio de búsqueda no disponible." };

  const hit = filas(body)[0];
  if (!hit) return { ...vacio, error: "No se encontró ninguna factura con los datos proporcionados." };

  const t0 = Date.now();
  const { construirPdfCfdi } = await import("./cfdi-pdf.server");
  const res = await construirPdfCfdi(hit);

  const folio = String(hit["Folio"] ?? "");
  const uuid = String(hit["FolioFiscal"] ?? "");

  await logErpCall({
    operacion: erpCtx.getStore()?.operacion ?? "facturacion_pdf_propio",
    stage: "facturacion:pdf-propio",
    metodo: "LOCAL",
    path: "lovable:construirPdfCfdi",
    status_code: null,
    ok: res.ok,
    duracion_ms: Date.now() - t0,
    error_code: res.ok ? (res.qr ? "" : "fact_pdf_sin_qr") : "fact_pdf_local",
    error_message: res.ok
      ? res.qr
        ? ""
        : "La respuesta de /facturafactura/buscar no incluyó código QR en base64; el PDF se generó con la leyenda \"Código QR no disponible\"."
      : res.error,
    detalle: {
      sistema: "facturacion",
      request: resumirCuerpo({ criterio: criterio.trim(), idEmpresaFacturacion: empresa.idEmpresaFacturacion }),
      response: resumirCuerpo({
        folio,
        uuid,
        bytes: res.ok ? res.bytes : 0,
        qrIncrustado: res.ok ? res.qr : false,
        qrCampo: res.ok ? res.qrCampo : null,
      }),
    },
  });

  if (!res.ok) return { ...vacio, folio, uuid, error: res.error };
  return {
    ok: true as const,
    pdfBase64: res.pdfBase64,
    bytes: res.bytes,
    folio,
    uuid,
    qr: res.qr,
    error: null,
  };
}
