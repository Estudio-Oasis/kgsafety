/**
 * Cliente del sistema de facturación / timbrado CFDI (api-fact.noilmx.com).
 * Solo servidor: el sitio nunca llama a esta API directamente desde el navegador.
 *
 * Cada llamada queda auditada (endpoint, status, latencia, trace y resumen de
 * request/response) en la misma bitácora que el ERP, para revisión en el portal.
 */

import { erpCtx, logErpCall, newTraceId } from "./erp-monitor.server";

const BASE = process.env.FACT_API_BASE || "https://api-fact.noilmx.com/api";

const CLAVES_SENSIBLES = /token|password|contrasen|secret|authorization|xml|cer|key/i;

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
export function resumirCuerpo(value: unknown, max = 900): unknown {
  const visto = new WeakSet<object>();
  const walk = (v: unknown, depth: number): unknown => {
    if (v === null || v === undefined) return v ?? null;
    if (typeof v === "string") return v.length > 200 ? `${v.slice(0, 200)}… (${v.length} chars)` : v;
    if (typeof v === "number" || typeof v === "boolean") return v;
    if (Array.isArray(v)) {
      if (depth > 2) return `[${v.length} elementos]`;
      return { _tipo: "lista", total: v.length, muestra: v.slice(0, 2).map((r) => walk(r, depth + 1)) };
    }
    if (typeof v === "object") {
      const obj = v as Record<string, unknown>;
      if (visto.has(obj)) return "[circular]";
      visto.add(obj);
      if (depth > 3) return "[objeto]";
      const out: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(obj).slice(0, 25)) {
        out[k] = CLAVES_SENSIBLES.test(k) ? "[omitido]" : walk(val, depth + 1);
      }
      return out;
    }
    return String(v);
  };
  const resumen = walk(value, 0);
  const json = JSON.stringify(resumen ?? null);
  if (json && json.length > max) return { _truncado: true, contenido: `${json.slice(0, max)}…` };
  return resumen;
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
  const { status, body } = await call<FiscalClient & { error?: string }>(
    `/proveedorcliente/buscar/${encodeURIComponent(codigo.trim())}`,
  );
  if (status === 200 && body?.IdProveedorCliente) return body;
  return null;
}

export async function issueInvoice(input: {
  IdProveedorCliente: number;
  NoCotizacion: string;
  UsoCFDI: string;
  Referencia?: string;
}) {
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

export async function findInvoice(criterio: string, empresa = "KGSAFETY") {
  const { status, body } = await call<InvoiceRecord[]>(
    `/facturafactura/buscar/${encodeURIComponent(criterio.trim())}/${encodeURIComponent(empresa)}`,
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
