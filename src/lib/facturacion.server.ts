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
