/**
 * Catálogo compartido de Uso de CFDI (CFDI 4.0) para KG Safety.
 *
 * Base: selector del sitio anterior (kg-safety.com/facturar/proceso), depurado:
 * - P01 "Por definir": inválido en CFDI 4.0.
 * - CP01: uso de complemento de pago, no aplica a CFDI de ingresos.
 * - CN01: uso de nómina, no aplica a CFDI de ingresos.
 *
 * Sin filtro por régimen fiscal en esta versión.
 */
export type UsoCfdiOption = { c: string; l: string };

export const USOS_CFDI: UsoCfdiOption[] = [
  { c: "G01", l: "G01 · Adquisición de mercancías" },
  { c: "G02", l: "G02 · Devoluciones, descuentos o bonificaciones" },
  { c: "G03", l: "G03 · Gastos en general" },
  { c: "I01", l: "I01 · Construcciones" },
  { c: "I02", l: "I02 · Mobiliario y equipo de oficina por inversiones" },
  { c: "I03", l: "I03 · Equipo de transporte" },
  { c: "I04", l: "I04 · Equipo de cómputo y accesorios" },
  { c: "I05", l: "I05 · Dados, troqueles, moldes, matrices y herramental" },
  { c: "I06", l: "I06 · Comunicaciones telefónicas" },
  { c: "I07", l: "I07 · Comunicaciones satelitales" },
  { c: "I08", l: "I08 · Otra maquinaria y equipo" },
  { c: "S01", l: "S01 · Sin efectos fiscales" },
];

/** Uso predeterminado: 100% de las facturas históricas timbradas usan G03. */
export const DEFAULT_USO_CFDI = "G03";
