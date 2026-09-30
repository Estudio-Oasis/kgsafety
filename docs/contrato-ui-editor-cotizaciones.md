# Contrato de UI — Editor de cotizaciones

Este documento define **qué funciones de servidor** consume la pantalla del
editor (que construye Lovable) y **qué forma** tienen las respuestas. El backend
ya está implementado y probado; Lovable solo construye lo visual y llama a estas
funciones. **Lovable NO debe crear lógica de negocio ni tocar la base de datos
directamente.**

Todas las funciones viven en `src/lib/quote-editor.functions.ts` y requieren
sesión de **staff** (personal de KG). El guard de staff se aplica en la base de
datos: un usuario no autorizado recibe error `No autorizado`.

## Funciones disponibles

### `qeCreateQuoteFromRequest({ requestId })`
Convierte una solicitud (`quote_requests`) en cotización (`quotes`).
- **Entrada:** `{ requestId: uuid }`
- **Salida:** `{ ok, status: 'created'|'exists', quote_id, code }` o `{ ok:false, error }`

### `qeGetQuote({ quoteId })`
Lee la cotización con sus partidas (para pintar la pantalla).
- **Entrada:** `{ quoteId: uuid }`
- **Salida:**
  ```ts
  {
    ok: true,
    quote: { id, code, quote_date, valid_until, status, currency,
             subtotal, tax_total, total, location, delivery_type,
             travel_mode, request_id, client_id },
    lines: [{ id, course_id, description, quantity, unit_price,
              discounted_unit_price, tax_rate, subtotal, total, created_at }]
  }
  ```

### `qeAddLine({ quoteId, description, quantity, unitPrice, taxRate?, courseId?, discountedUnitPrice? })`
Agrega una partida. El servidor recalcula los totales.
- **Salida:** `{ ok, line_id }` o `{ ok:false, error }`

### `qeUpdateLine({ lineId, description?, quantity?, unitPrice?, taxRate?, discountedUnitPrice?, clearDiscount? })`
Actualiza una partida (solo los campos enviados). `clearDiscount: true` quita el
descuento. El servidor recalcula.
- **Salida:** `{ ok, line_id }` o `{ ok:false, error }`

### `qeDeleteLine({ lineId })`
Borra una partida. El servidor recalcula.
- **Salida:** `{ ok, quote_id }` o `{ ok:false, error }`

### `qeSetQuoteStatus({ quoteId, status })`
Cambia el estatus. Valores permitidos: `Pendiente`, `Enviada`, `Aceptada`,
`Rechazada`, `Cancelada`, `Facturada`.
- **Salida:** `{ ok, quote_id, status }` o `{ ok:false, error }`

### `qeSuggestPrice({ courseLegacyId, modality, participants })`
Sugiere precio desde `price_packages`. `modality` = `'Local'|'Foraneo'`.
- **Salida:**
  ```ts
  {
    ok: true,
    suggestion: {
      recommended: 'individual' | 'grupal',
      individual: { code, unitPrice, taxRate, total } | null,
      grupal: { code, unitPrice, taxRate, minParticipants, maxParticipants, aplica } | null
    } | null
  }
  ```

## Reglas para la UI

- **No calcular totales en el front como fuente de verdad.** El servidor los
  calcula. Para respuesta inmediata (optimista) se puede usar `src/lib/quote-math.ts`
  (`computeLineAmounts`, `computeQuoteTotals`), que es el **espejo exacto** del
  cálculo del servidor, pero el valor que se guarda y se muestra como definitivo
  es el que devuelve el servidor.
- Mostrar el precio sugerido con `qeSuggestPrice`, pero permitir que el asesor lo
  ajuste (precio o descuento) antes de guardar.
- Todos los importes son `numeric(14,2)` (2 decimales), moneda MXN, IVA 16% por defecto.
- Manejar `{ ok:false, error }` mostrando el mensaje al usuario.
