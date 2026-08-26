/**
 * Generación propia del PDF de un CFDI 4.0 ya timbrado.
 *
 * Reglas duras:
 *  - TODO dato impreso sale del XML timbrado del registro consultado.
 *    No hay valores por defecto, de ejemplo ni reconstruidos.
 *  - El código QR se toma ÚNICAMENTE del base64 que venga en la respuesta.
 *    Si no viene, se imprime la leyenda "Código QR no disponible".
 *  - No se llama a ningún endpoint externo de PDF.
 */

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { XMLParser } from "fast-xml-parser";

// ---------- utilidades ----------

/** Helvetica/Courier estándar sólo codifican WinAnsi: se limpian los caracteres fuera de rango. */
function winAnsi(s: string): string {
  return s
    .replace(/\u2014|\u2013/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u00a0/g, " ")
    .replace(/[^\x20-\x7E\u00A1-\u00FF]/g, "");
}

const money = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const UNIDADES = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
const DIEZ_A_VEINTE = [
  "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTE",
];
const DECENAS = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
const CENTENAS = [
  "", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS",
  "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS",
];

function centenasALetra(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "CIEN";
  const c = Math.floor(n / 100);
  const r = n % 100;
  const partes: string[] = [];
  if (c > 0) partes.push(CENTENAS[c]!);
  if (r > 0) {
    if (r <= 9) partes.push(UNIDADES[r]!);
    else if (r <= 20) partes.push(DIEZ_A_VEINTE[r - 10]!);
    else {
      const d = Math.floor(r / 10);
      const u = r % 10;
      partes.push(u > 0 ? `${DECENAS[d]} Y ${UNIDADES[u]}` : DECENAS[d]!);
    }
  }
  return partes.join(" ");
}

function enteroALetra(n: number): string {
  if (n === 0) return "CERO";
  const millones = Math.floor(n / 1_000_000);
  const miles = Math.floor((n % 1_000_000) / 1000);
  const resto = n % 1000;
  const partes: string[] = [];
  if (millones > 0) partes.push(millones === 1 ? "UN MILLON" : `${centenasALetra(millones)} MILLONES`);
  if (miles > 0) partes.push(miles === 1 ? "MIL" : `${centenasALetra(miles)} MIL`);
  if (resto > 0) partes.push(centenasALetra(resto));
  return partes.join(" ").replace(/\bUN CIENTO\b/g, "CIENTO").trim();
}

/** "11600.00" -> "ONCE MIL SEISCIENTOS PESOS 00/100 M.N." (moneda tomada del XML) */
export function importeConLetra(total: number, moneda: string): string {
  const entero = Math.floor(Math.abs(total));
  const centavos = Math.round((Math.abs(total) - entero) * 100);
  const nombre = moneda === "MXN" ? "PESOS" : moneda === "USD" ? "DOLARES" : moneda;
  const sufijo = moneda === "MXN" ? " M.N." : moneda === "USD" ? " U.S.D." : "";
  const cents = String(centavos).padStart(2, "0");
  return `${enteroALetra(entero)} ${nombre} ${cents}/100${sufijo}`.replace(/\s+/g, " ").trim();
}

// ---------- lectura del XML timbrado ----------

type Nodo = Record<string, unknown>;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
  removeNSPrefix: true,
  parseAttributeValue: false,
  trimValues: true,
});

const asArray = (v: unknown): Nodo[] =>
  v === undefined || v === null ? [] : Array.isArray(v) ? (v as Nodo[]) : [v as Nodo];

const attr = (n: Nodo | undefined, name: string): string => {
  const v = n?.[`@${name}`];
  return v === undefined || v === null ? "" : String(v);
};

const num = (n: Nodo | undefined, name: string): number | null => {
  const raw = attr(n, name);
  if (!raw) return null;
  const v = Number(raw);
  return Number.isFinite(v) ? v : null;
};

/** Busca en profundidad el primer nodo con el nombre dado. */
function buscarNodo(root: unknown, nombre: string): Nodo | undefined {
  if (!root || typeof root !== "object") return undefined;
  const obj = root as Nodo;
  if (obj[nombre] !== undefined) return asArray(obj[nombre])[0];
  for (const value of Object.values(obj)) {
    for (const hijo of asArray(value)) {
      const hit = buscarNodo(hijo, nombre);
      if (hit) return hit;
    }
  }
  return undefined;
}

export type CfdiParsed = {
  comprobante: Nodo;
  emisor: Nodo | undefined;
  receptor: Nodo | undefined;
  conceptos: Nodo[];
  timbre: Nodo | undefined;
};

export function parseCfdi(xml: string): CfdiParsed | null {
  let doc: unknown;
  try {
    doc = parser.parse(xml);
  } catch {
    return null;
  }
  const comprobante = buscarNodo(doc, "Comprobante");
  if (!comprobante) return null;
  const nodoConceptos = buscarNodo(comprobante, "Conceptos");
  return {
    comprobante,
    emisor: buscarNodo(comprobante, "Emisor"),
    receptor: buscarNodo(comprobante, "Receptor"),
    conceptos: nodoConceptos ? asArray(nodoConceptos["Concepto"]) : [],
    timbre: buscarNodo(comprobante, "TimbreFiscalDigital"),
  };
}

// ---------- domicilio del emisor (viene del registro de Noil, no del XML) ----------

/**
 * El CFDI 4.0 no incluye el domicilio del emisor en el XML (sólo LugarExpedicion),
 * por lo que se toma de los campos del registro devuelto por /facturafactura/buscar.
 * Si el registro no lo trae, no se imprime nada: nunca se escribe un valor fijo.
 */
export function domicilioEmisor(record: unknown): string[] {
  if (!record || typeof record !== "object") return [];
  const r = record as Nodo;
  const str = (k: string) => {
    const v = r[k];
    const s = v === undefined || v === null ? "" : String(v).trim();
    return s === "*" || s.toUpperCase() === "N/A" ? "" : s;
  };
  const calle = str("Calle");
  const noExt = str("NoExt");
  const noInt = str("NoInt");
  const colonia = str("Colonia");
  const cp = str("Cp");
  const ciudad = str("Ciudad");
  const estado = str("Estado");
  const pais = str("Pais");

  const numero = [noExt, noInt].filter(Boolean).join("-");
  const linea1 = [calle, numero].filter(Boolean).join(" ");
  const linea2 = [
    colonia ? `Col. ${colonia}` : "",
    cp ? `C.P. ${cp}` : "",
    ciudad,
    estado,
    pais,
  ]
    .filter(Boolean)
    .join(", ");

  return [linea1, linea2].filter(Boolean);
}

// ---------- QR: sólo el base64 de la respuesta ----------


const PNG_B64 = "iVBORw0KGgo";
const JPG_B64 = "/9j/";

/** Extrae el QR en base64 tal como viene en el registro. Nunca lo genera. */
export function extraerQrBase64(record: unknown): { base64: string; campo: string } | null {
  const visitados = new Set<unknown>();
  const stack: Array<{ value: unknown; path: string }> = [{ value: record, path: "$" }];
  const candidatos: Array<{ base64: string; campo: string; conNombreQr: boolean }> = [];

  while (stack.length) {
    const { value, path } = stack.pop()!;
    if (typeof value === "string") {
      const limpio = value.trim().replace(/^data:image\/[a-z+]+;base64,/i, "");
      if (limpio.length > 200 && (limpio.startsWith(PNG_B64) || limpio.startsWith(JPG_B64))) {
        candidatos.push({ base64: limpio, campo: path, conNombreQr: /qr/i.test(path) });
      }
      continue;
    }
    if (!value || typeof value !== "object" || visitados.has(value)) continue;
    visitados.add(value);
    for (const [k, v] of Object.entries(value as Nodo)) {
      stack.push({ value: v, path: `${path}.${k}` });
    }
  }

  if (candidatos.length === 0) return null;
  const preferido = candidatos.find((c) => c.conNombreQr) ?? candidatos[0]!;
  return { base64: preferido.base64, campo: preferido.campo };
}

// ---------- dibujo ----------

const AZUL = rgb(0.05, 0.29, 0.55);
const GRIS = rgb(0.42, 0.45, 0.5);
const NEGRO = rgb(0.1, 0.11, 0.13);
const LINEA = rgb(0.78, 0.8, 0.83);
const FONDO = rgb(0.95, 0.96, 0.97);

const PAGE_W = 612;
const PAGE_H = 792;
const M = 36;
const CONTENT_W = PAGE_W - M * 2;

type Ctx = {
  pdf: PDFDocument;
  font: PDFFont;
  bold: PDFFont;
  mono: PDFFont;
  page: PDFPage;
  y: number;
  paginas: PDFPage[];
};

function texto(ctx: Ctx, s: string, x: number, y: number, size: number, font: PDFFont, color = NEGRO) {
  ctx.page.drawText(winAnsi(s), { x, y, size, font, color });
}

function cortar(s: string, font: PDFFont, size: number, ancho: number): string {
  let out = winAnsi(s);
  if (font.widthOfTextAtSize(out, size) <= ancho) return out;
  while (out.length > 1 && font.widthOfTextAtSize(`${out}...`, size) > ancho) out = out.slice(0, -1);
  return `${out}...`;
}

function envolver(s: string, font: PDFFont, size: number, ancho: number): string[] {
  const palabras = winAnsi(s).split(/\s+/).filter(Boolean);
  const lineas: string[] = [];
  let actual = "";
  for (const w of palabras) {
    const test = actual ? `${actual} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) <= ancho) actual = test;
    else {
      if (actual) lineas.push(actual);
      actual = w;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

/** Corta una cadena continua (sellos base64) en líneas del ancho dado. */
function trocear(s: string, font: PDFFont, size: number, ancho: number): string[] {
  const limpio = winAnsi(s);
  const porLinea = Math.max(10, Math.floor(ancho / font.widthOfTextAtSize("0", size)));
  const out: string[] = [];
  for (let i = 0; i < limpio.length; i += porLinea) out.push(limpio.slice(i, i + porLinea));
  return out;
}

function nuevaPagina(ctx: Ctx) {
  ctx.page = ctx.pdf.addPage([PAGE_W, PAGE_H]);
  ctx.paginas.push(ctx.page);
  ctx.y = PAGE_H - M;
}

function asegurar(ctx: Ctx, alto: number) {
  if (ctx.y - alto < M + 24) nuevaPagina(ctx);
}

function seccion(ctx: Ctx, titulo: string) {
  asegurar(ctx, 26);
  ctx.page.drawRectangle({ x: M, y: ctx.y - 15, width: CONTENT_W, height: 15, color: AZUL });
  texto(ctx, titulo, M + 6, ctx.y - 11, 7.5, ctx.bold, rgb(1, 1, 1));
  ctx.y -= 21;
}

function par(ctx: Ctx, etiqueta: string, valor: string, x: number, ancho: number) {
  texto(ctx, etiqueta.toUpperCase(), x, ctx.y, 6, ctx.bold, GRIS);
  texto(ctx, cortar(valor || "-", ctx.font, 8, ancho), x, ctx.y - 9.5, 8, ctx.font);
}

// ---------- documento ----------

export type PdfResultado =
  | { ok: true; pdfBase64: string; bytes: number; qr: boolean; qrCampo: string | null; error: null }
  | { ok: false; pdfBase64: null; bytes: 0; qr: false; qrCampo: null; error: string };

/**
 * Construye el PDF de un CFDI timbrado a partir del registro devuelto por
 * /facturafactura/buscar (XML + QR base64). Sin llamadas externas.
 */
export async function construirPdfCfdi(record: unknown): Promise<PdfResultado> {
  const xml =
    typeof record === "object" && record !== null
      ? String((record as Nodo)["XML"] ?? (record as Nodo)["xml"] ?? "")
      : "";
  if (!xml.trim()) {
    return { ok: false, pdfBase64: null, bytes: 0, qr: false, qrCampo: null, error: "El registro de la factura no incluye el XML timbrado; no es posible generar el PDF." };
  }

  const cfdi = parseCfdi(xml);
  if (!cfdi) {
    return { ok: false, pdfBase64: null, bytes: 0, qr: false, qrCampo: null, error: "El XML timbrado no pudo interpretarse como un CFDI válido." };
  }

  const c = cfdi.comprobante;
  const emisor = cfdi.emisor;
  const receptor = cfdi.receptor;
  const timbre = cfdi.timbre;

  const pdf = await PDFDocument.create();
  const ctx: Ctx = {
    pdf,
    font: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    mono: await pdf.embedFont(StandardFonts.Courier),
    page: pdf.addPage([PAGE_W, PAGE_H]),
    y: PAGE_H - M,
    paginas: [],
  };
  ctx.paginas.push(ctx.page);

  pdf.setTitle(`CFDI ${attr(c, "Serie")}${attr(c, "Folio")} ${attr(timbre, "UUID")}`.trim());
  pdf.setProducer("KG Safety");
  pdf.setCreator("KG Safety");

  // --- encabezado: emisor | identificación fiscal ---
  const colDer = M + CONTENT_W * 0.52;
  const anchoIzq = CONTENT_W * 0.5 - 6;
  const anchoDer = M + CONTENT_W - colDer;

  texto(ctx, attr(emisor, "Nombre"), M, ctx.y - 12, 12, ctx.bold, AZUL);
  let yIzq = ctx.y - 26;
  for (const linea of [
    `RFC: ${attr(emisor, "Rfc")}`,
    ...domicilioEmisor(record),
    `Régimen fiscal: ${attr(emisor, "RegimenFiscal")}`,
    `Lugar de expedición: ${attr(c, "LugarExpedicion")}`,
    attr(emisor, "FacAtrAdquirente") ? `Fac. atr. adquirente: ${attr(emisor, "FacAtrAdquirente")}` : "",
  ]) {
    if (!linea) continue;
    texto(ctx, cortar(linea, ctx.font, 8, anchoIzq), M, yIzq, 8, ctx.font);
    yIzq -= 11;
  }

  texto(ctx, `CFDI ${attr(c, "Version")} - ${attr(c, "TipoDeComprobante")}`, colDer, ctx.y - 12, 10, ctx.bold);
  let yDer = ctx.y - 26;
  const serieFolio = [attr(c, "Serie"), attr(c, "Folio")].filter(Boolean).join(" ");
  for (const [k, v] of [
    ["Serie-Folio", serieFolio],
    ["Folio fiscal (UUID)", attr(timbre, "UUID")],
    ["Fecha de emisión", attr(c, "Fecha").replace("T", " ")],
    ["Fecha de timbrado", attr(timbre, "FechaTimbrado").replace("T", " ")],
    ["No. certificado CSD", attr(c, "NoCertificado")],
    ["No. certificado SAT", attr(timbre, "NoCertificadoSAT")],
    ["Exportación", attr(c, "Exportacion")],
  ] as const) {
    if (!v) continue;
    texto(ctx, `${k}:`, colDer, yDer, 6.5, ctx.bold, GRIS);
    texto(ctx, cortar(v, ctx.mono, 7.5, anchoDer - 96), colDer + 96, yDer, 7.5, ctx.mono);
    yDer -= 10.5;
  }

  ctx.y = Math.min(yIzq, yDer) - 6;
  ctx.page.drawLine({ start: { x: M, y: ctx.y }, end: { x: M + CONTENT_W, y: ctx.y }, thickness: 1, color: AZUL });
  ctx.y -= 14;

  // --- receptor ---
  seccion(ctx, "RECEPTOR");
  const mitad = CONTENT_W / 2 - 8;
  par(ctx, "Razón social", attr(receptor, "Nombre"), M, mitad);
  par(ctx, "RFC", attr(receptor, "Rfc"), M + CONTENT_W / 2, mitad);
  ctx.y -= 23;
  par(ctx, "Régimen fiscal", attr(receptor, "RegimenFiscalReceptor"), M, mitad);
  par(ctx, "Uso del CFDI", attr(receptor, "UsoCFDI"), M + CONTENT_W / 2, mitad);
  ctx.y -= 23;
  par(ctx, "Domicilio fiscal (CP)", attr(receptor, "DomicilioFiscalReceptor"), M, mitad);
  par(ctx, "Residencia / Núm. reg. trib.", [attr(receptor, "ResidenciaFiscal"), attr(receptor, "NumRegIdTrib")].filter(Boolean).join(" / "), M + CONTENT_W / 2, mitad);
  ctx.y -= 26;

  // --- conceptos ---
  seccion(ctx, "CONCEPTOS");
  const cols = [
    { t: "CANT", x: M + 4, w: 30, align: "left" as const },
    { t: "UNIDAD", x: M + 36, w: 42, align: "left" as const },
    { t: "CLAVE", x: M + 80, w: 46, align: "left" as const },
    { t: "DESCRIPCIÓN", x: M + 128, w: 240, align: "left" as const },
    { t: "V. UNITARIO", x: M + 372, w: 78, align: "right" as const },
    { t: "IMPORTE", x: M + 452, w: 84, align: "right" as const },
  ];

  const encabezadoTabla = () => {
    ctx.page.drawRectangle({ x: M, y: ctx.y - 13, width: CONTENT_W, height: 13, color: FONDO });
    for (const col of cols) {
      const w = ctx.bold.widthOfTextAtSize(winAnsi(col.t), 6.5);
      const x = col.align === "right" ? col.x + col.w - w : col.x;
      texto(ctx, col.t, x, ctx.y - 9.5, 6.5, ctx.bold, GRIS);
    }
    ctx.y -= 16;
  };
  encabezadoTabla();

  for (const concepto of cfdi.conceptos) {
    const descripcion = envolver(attr(concepto, "Descripcion"), ctx.font, 7.5, cols[3]!.w);
    const alto = Math.max(14, descripcion.length * 9 + 5);
    if (ctx.y - alto < M + 24) {
      nuevaPagina(ctx);
      encabezadoTabla();
    }
    const valores: Array<[number, string]> = [
      [0, attr(concepto, "Cantidad")],
      [1, attr(concepto, "Unidad") || attr(concepto, "ClaveUnidad")],
      [2, attr(concepto, "ClaveProdServ")],
      [4, money(num(concepto, "ValorUnitario") ?? 0)],
      [5, money(num(concepto, "Importe") ?? 0)],
    ];
    for (const [i, v] of valores) {
      const col = cols[i]!;
      const s = cortar(v, ctx.font, 7.5, col.w);
      const w = ctx.font.widthOfTextAtSize(s, 7.5);
      texto(ctx, s, col.align === "right" ? col.x + col.w - w : col.x, ctx.y - 8, 7.5, ctx.font);
    }
    descripcion.forEach((linea, i) => texto(ctx, linea, cols[3]!.x, ctx.y - 8 - i * 9, 7.5, ctx.font));
    ctx.y -= alto;
    ctx.page.drawLine({
      start: { x: M, y: ctx.y },
      end: { x: M + CONTENT_W, y: ctx.y },
      thickness: 0.4,
      color: LINEA,
    });
  }
  ctx.y -= 12;

  // --- pago + totales ---
  const impuestos = buscarNodo(c, "Impuestos");
  const traslados = impuestos ? asArray(buscarNodo(impuestos, "Traslados")?.["Traslado"]) : [];
  const retenciones = impuestos ? asArray(buscarNodo(impuestos, "Retenciones")?.["Retencion"]) : [];
  const subtotal = num(c, "SubTotal") ?? 0;
  const descuento = num(c, "Descuento");
  const total = num(c, "Total") ?? 0;
  const moneda = attr(c, "Moneda");

  const filasTotales: Array<[string, string]> = [["Subtotal", money(subtotal)]];
  if (descuento !== null && descuento > 0) filasTotales.push(["Descuento", `-${money(descuento)}`]);
  for (const tr of traslados) {
    const tasa = num(tr, "TasaOCuota");
    const pct = tasa !== null ? ` ${(tasa * 100).toFixed(2).replace(/\.00$/, "")}%` : "";
    filasTotales.push([`Traslado ${attr(tr, "Impuesto")}${pct}`, money(num(tr, "Importe") ?? 0)]);
  }
  for (const re of retenciones) {
    filasTotales.push([`Retención ${attr(re, "Impuesto")}`, `-${money(num(re, "Importe") ?? 0)}`]);
  }
  filasTotales.push([`TOTAL ${moneda}`, money(total)]);

  const altoPago = Math.max(filasTotales.length * 12 + 34, 84);
  asegurar(ctx, altoPago);
  const yBloque = ctx.y;
  const datosPago: Array<[string, string]> = [
    ["Método de pago", attr(c, "MetodoPago")],
    ["Forma de pago", attr(c, "FormaPago")],
    ["Moneda", moneda],
    ["Tipo de cambio", attr(c, "TipoCambio")],
    ["Condiciones de pago", attr(c, "CondicionesDePago")],
  ];
  let yPago = yBloque - 4;
  texto(ctx, "DATOS DE PAGO", M, yPago, 6.5, ctx.bold, GRIS);
  yPago -= 12;
  for (const [k, v] of datosPago) {
    if (!v) continue;
    texto(ctx, `${k}:`, M, yPago, 7.5, ctx.bold);
    texto(ctx, cortar(v, ctx.font, 7.5, 150), M + 96, yPago, 7.5, ctx.font);
    yPago -= 11;
  }

  const xTot = M + CONTENT_W - 200;
  let yTot = yBloque - 4;
  for (const [k, v] of filasTotales) {
    const esTotal = k.startsWith("TOTAL");
    const font = esTotal ? ctx.bold : ctx.font;
    const size = esTotal ? 9.5 : 8;
    if (esTotal) {
      ctx.page.drawRectangle({ x: xTot - 6, y: yTot - 4, width: 206, height: 15, color: FONDO });
    }
    texto(ctx, k, xTot, yTot, size, font, esTotal ? AZUL : NEGRO);
    const w = font.widthOfTextAtSize(winAnsi(v), size);
    texto(ctx, v, M + CONTENT_W - w, yTot, size, font, esTotal ? AZUL : NEGRO);
    yTot -= esTotal ? 16 : 12;
  }

  ctx.y = Math.min(yPago, yTot) - 6;
  asegurar(ctx, 26);
  texto(ctx, "IMPORTE CON LETRA", M, ctx.y, 6.5, ctx.bold, GRIS);
  for (const linea of envolver(importeConLetra(total, moneda), ctx.bold, 8, CONTENT_W)) {
    ctx.y -= 11;
    texto(ctx, linea, M, ctx.y, 8, ctx.bold);
  }
  ctx.y -= 16;

  // --- QR + sellos ---
  seccion(ctx, "CERTIFICACIÓN DIGITAL DEL SAT");

  const qr = extraerQrBase64(record);
  const qrLado = 96;
  asegurar(ctx, qrLado + 12);
  const yQr = ctx.y - qrLado;
  let qrIncrustado = false;
  if (qr) {
    try {
      const bytes = Uint8Array.from(atob(qr.base64), (ch) => ch.charCodeAt(0));
      const img = qr.base64.startsWith(PNG_B64) ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
      ctx.page.drawImage(img, { x: M, y: yQr, width: qrLado, height: qrLado });
      qrIncrustado = true;
    } catch {
      qrIncrustado = false;
    }
  }
  if (!qrIncrustado) {
    ctx.page.drawRectangle({
      x: M, y: yQr, width: qrLado, height: qrLado,
      borderColor: LINEA, borderWidth: 0.6, borderDashArray: [3, 2],
    });
    for (const [i, linea] of ["Código QR", "no disponible"].entries()) {
      const w = ctx.font.widthOfTextAtSize(winAnsi(linea), 7.5);
      texto(ctx, linea, M + (qrLado - w) / 2, yQr + qrLado / 2 + 4 - i * 10, 7.5, ctx.font, GRIS);
    }
  }

  const xSello = M + qrLado + 12;
  const anchoSello = M + CONTENT_W - xSello;
  let ySello = ctx.y - 2;
  const bloquesSello: Array<[string, string]> = [
    ["Sello digital del CFDI", attr(c, "Sello")],
    ["Sello digital del SAT", attr(timbre, "SelloSAT")],
    ["Cadena original del complemento de certificación digital del SAT",
      attr(timbre, "UUID")
        ? `||${attr(timbre, "Version")}|${attr(timbre, "UUID")}|${attr(timbre, "FechaTimbrado")}|${attr(timbre, "RfcProvCertif")}|${attr(timbre, "SelloCFD")}|${attr(timbre, "NoCertificadoSAT")}||`
        : ""],
  ];
  for (const [titulo, valor] of bloquesSello) {
    if (!valor) continue;
    if (ySello - 30 < M + 24) {
      nuevaPagina(ctx);
      ySello = ctx.y - 2;
    }
    ctx.page.drawText(winAnsi(titulo.toUpperCase()), { x: xSello, y: ySello, size: 6, font: ctx.bold, color: GRIS });
    ySello -= 8;
    for (const linea of trocear(valor, ctx.mono, 5.4, anchoSello).slice(0, 14)) {
      ctx.page.drawText(linea, { x: xSello, y: ySello, size: 5.4, font: ctx.mono, color: NEGRO });
      ySello -= 6.2;
    }
    ySello -= 5;
  }
  ctx.y = Math.min(yQr, ySello) - 14;

  // --- pie en todas las páginas ---
  const leyenda = "Este documento es una representación impresa de un CFDI";
  ctx.paginas.forEach((page, i) => {
    page.drawLine({
      start: { x: M, y: M + 16 },
      end: { x: M + CONTENT_W, y: M + 16 },
      thickness: 0.5,
      color: LINEA,
    });
    page.drawText(winAnsi(leyenda), { x: M, y: M + 6, size: 7, font: ctx.bold, color: GRIS });
    const p = `Página ${i + 1} de ${ctx.paginas.length}`;
    const w = ctx.font.widthOfTextAtSize(winAnsi(p), 7);
    page.drawText(winAnsi(p), { x: M + CONTENT_W - w, y: M + 6, size: 7, font: ctx.font, color: GRIS });
  });

  const bytes = await pdf.save();
  let binario = "";
  for (const b of bytes) binario += String.fromCharCode(b);
  return {
    ok: true,
    pdfBase64: btoa(binario),
    bytes: bytes.length,
    qr: qrIncrustado,
    qrCampo: qrIncrustado ? (qr?.campo ?? null) : null,
    error: null,
  };
}
