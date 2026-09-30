# Auditoría de la dependencia de Noil

_Revisado y actualizado: 2026-09-30 (reconstrucción). Auditoría original: 2026-09-21._

## Resumen

El proyecto está **mucho más avanzado** de lo que sugerían los reportes viejos.
El ERP propio ya existe (45 tablas, migraciones disciplinadas, UUID + `legacy_id`,
RLS, auditoría). Las cotizaciones y clientes ya eran independientes en gran parte.
Lo que quedaba era: (1) cerrar el alta pública de solicitudes en Supabase, y
(2) desacoplar el timbrado de facturas de Noil.

## Dónde vivía la dependencia de Noil

Toda la comunicación con Noil está concentrada en pocos archivos:

- `src/lib/erp.server.ts` — creación de cotizaciones en el ERP (`createQuote`),
  catálogos (`listCourses`, etc.). **Camino de cotización.**
- `src/lib/facturacion.server.ts` — **timbrado CFDI** contra `api-fact.noilmx.com`:
  `findFiscalClient`, `issueInvoice`, `checkQuoteForInvoice`, `validatePayment`,
  `updateFiscalClient`, `findInvoice`, `previewInvoicePdf`, `buildStampedInvoicePdf`.
  **Camino de facturación (cuello de botella real).**

## Estado por área

| Área | Antes | Ahora |
|---|---|---|
| ERP propio (clientes, cotizaciones, catálogos) | ✅ Ya existía | ✅ Se mantiene |
| Independencia de Noil en cotizaciones | ⚠️ Parcial | ✅ Cerrada (`create_web_quote` + editor `qe_*`) |
| Tablas fiscales (`invoices`, etc.) | ✅ Diseñadas | ✅ Se mantienen |
| Generación local de PDF (CFDI) | ✅ `cfdi-pdf.server.ts` | ✅ Se mantiene |
| Timbrado (emisión CFDI) | ❌ 100% Noil | 🔌 Detrás de `BillingProvider` (Noil hoy, PAC listo) |

## El único cuello de botella que queda

El **timbrado** (convertir una cotización en un CFDI válido ante el SAT) requiere
un **PAC** (Proveedor Autorizado de Certificación). Hoy Noil actúa como ese
intermediario. Para independizarse hay que:

1. Elegir un PAC (p. ej. Facturama).
2. Dar de alta el **CSD** (Certificado de Sello Digital) de KG Safety.
3. Implementar `src/lib/billing/pac.server.ts` (el stub ya está, con la interfaz fijada).
4. Cambiar `BILLING_PROVIDER=pac`.

Mientras tanto, `BILLING_PROVIDER=noil` conserva el comportamiento actual sin
ningún cambio para el usuario.

## Recomendación

- **Prioridad 1 (hecho):** cotizador propio funcionando → el cliente ya no
  depende de Noil para cotizar.
- **Prioridad 2 (decisión comercial):** elegir PAC y desacoplar el timbrado.
- No apagar Noil en facturación hasta tener el PAC probado en staging.
