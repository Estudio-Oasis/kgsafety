/**
 * Enmascarado de cuerpos de request/response para la bitácora `erp_logs`.
 *
 * Se aplica ANTES de escribir en la base (dentro de logErpCall), nunca al leer:
 * los datos personales no deben quedar en claro en la tabla.
 */

import { maskRfc, normalizeRfc } from "./rfc";

const MAX_STRING = 200;
const MAX_JSON = 1200;

/** Coincidencia exacta o por prefijo (nunca por subcadena). */
function matches(key: string, names: string[], prefixes: string[] = []) {
  const k = key.toLowerCase();
  return names.includes(k) || prefixes.some((p) => k.startsWith(p));
}

/** Credenciales reales. `xml`, `sello` y `cadena` NO son secretos: son el CFDI timbrado. */
const SECRET_KEYS = [
  "token",
  "access_token",
  "refresh_token",
  "password",
  "contrasena",
  "contraseña",
  "secret",
  "authorization",
  "apikey",
  "api_key",
  "bearer",
  "clientsecret",
  "client_secret",
];
const SECRET_PREFIXES = ["token", "password", "contrasen", "secret", "authorization", "apikey", "api_key", "bearer"];

const RFC_KEYS = ["rfc", "rfcreceptor", "rfcemisor", "srfc"];
const RFC_PREFIXES = ["rfc", "srfc"];

const EMAIL_KEYS = ["correo", "email", "mail", "scorreo", "correoelectronico", "e_mail"];
const EMAIL_PREFIXES = ["correo", "email", "smail", "scorreo"];

const PHONE_KEYS = ["telefono", "tel", "celular", "movil", "stelefono", "telefono1", "whatsapp"];
const PHONE_PREFIXES = ["telefono", "stelefono", "celular", "movil", "tel_"];

const NAME_KEYS = [
  "nombre",
  "nombres",
  "apellidos",
  "contacto",
  "razonsocial",
  "nombrecliente",
  "nombrecontacto",
  "snombre",
  "scontacto",
  "nombrecompleto",
];
const NAME_PREFIXES = ["nombre", "snombre", "apellido", "contacto", "scontacto", "razonsocial"];

const ADDRESS_KEYS = ["direccion", "sdireccion", "calle", "cp", "codigopostal", "numexterior", "numinterior"];
const ADDRESS_PREFIXES = ["direccion", "sdireccion", "calle", "codigopostal", "numexterior", "numinterior"];

const RFC_PATTERN = /\b[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}\b/g;
const EMAIL_PATTERN = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g;

export function maskEmail(value: string): string {
  const [user = "", domain = ""] = value.split("@");
  if (!domain) return "[correo]";
  const [host = "", ...rest] = domain.split(".");
  return `${user.slice(0, 2)}****@${host.slice(0, 1)}****${rest.length ? `.${rest.join(".")}` : ""}`;
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `${"*".repeat(Math.max(2, digits.length - 4))}${digits.slice(-4)}`;
}

export function maskName(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .map((w) => (w.length <= 2 ? w : `${w[0]}${"*".repeat(Math.min(4, w.length - 1))}`))
    .join(" ");
}

function truncate(v: string) {
  return v.length > MAX_STRING ? `${v.slice(0, MAX_STRING)}… (${v.length} chars)` : v;
}

/** Enmascara RFC y correos que aparezcan dentro de cualquier texto libre. */
function scrubText(v: string) {
  return truncate(
    v.replace(RFC_PATTERN, (m) => maskRfc(m)).replace(EMAIL_PATTERN, (m) => maskEmail(m)),
  );
}

function maskByKey(key: string, value: unknown): unknown | undefined {
  if (matches(key, SECRET_KEYS, SECRET_PREFIXES)) return "[omitido]";
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const s = String(value);
  if (!s) return s;
  if (matches(key, RFC_KEYS, RFC_PREFIXES)) return maskRfc(normalizeRfc(s));
  if (matches(key, EMAIL_KEYS, EMAIL_PREFIXES)) return maskEmail(s);
  if (matches(key, PHONE_KEYS, PHONE_PREFIXES)) return maskPhone(s);
  if (matches(key, NAME_KEYS, NAME_PREFIXES)) return maskName(s);
  if (matches(key, ADDRESS_KEYS, ADDRESS_PREFIXES)) return "[omitido]";
  return undefined;
}

/**
 * Resumen seguro y acotado: strings a 200 chars, listas a `{_tipo,total,muestra}`,
 * profundidad máxima 3, 25 llaves por objeto, JSON final a 1200 chars.
 * Los IDs técnicos (IdCliente, folios, status…) se conservan íntegros.
 */
export function sanitizeBody(value: unknown, max = MAX_JSON): unknown {
  const visto = new WeakSet<object>();
  const walk = (v: unknown, depth: number): unknown => {
    if (v === null || v === undefined) return null;
    if (typeof v === "string") return scrubText(v);
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
        const masked = maskByKey(k, val);
        out[k] = masked !== undefined ? masked : walk(val, depth + 1);
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

/** Enmascara el objeto `detalle` completo; si algo falla, no rompe el flujo. */
export function sanitizeDetalle(detalle: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!detalle) return {};
  try {
    const out = sanitizeBody(detalle);
    return out && typeof out === "object" ? (out as Record<string, unknown>) : { contenido: out };
  } catch {
    return { _error_sanitizado: true };
  }
}

/** Enmascara texto de mensajes de error (RFC/correo embebidos). */
export function sanitizeMessage(value: string): string {
  try {
    return value.replace(RFC_PATTERN, (m) => maskRfc(m)).replace(EMAIL_PATTERN, (m) => maskEmail(m));
  } catch {
    return value;
  }
}
