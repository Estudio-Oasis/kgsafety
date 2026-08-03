/**
 * Cliente del sistema de facturación / timbrado CFDI (api-fact.noilmx.com).
 * Solo servidor: el sitio nunca llama a esta API directamente desde el navegador.
 */

const BASE = process.env.FACT_API_BASE || "https://api-fact.noilmx.com/api";

async function call<T>(path: string, init?: RequestInit): Promise<{ status: number; body: T }> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(process.env.FACT_API_TOKEN ? { Authorization: `Bearer ${process.env.FACT_API_TOKEN}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: unknown = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = { error: text.slice(0, 300) };
  }
  if (!res.ok) console.error(`FACT ${path} [${res.status}]: ${text.slice(0, 400)}`);
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
  if (status !== 200 || rows.length === 0) {
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
