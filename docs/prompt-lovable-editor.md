# Prompt para Lovable — Pantalla del editor de cotizaciones

> Pega este prompt en Lovable para construir **solo la interfaz** del editor.
> El backend (funciones de servidor y base de datos) ya está hecho y probado;
> Lovable no debe crear lógica de negocio, migraciones ni tocar la base directamente.

---

## Contexto para Lovable

Construye una pantalla de **editor de cotizaciones** para el portal interno de KG
Safety (solo personal/staff). El backend ya expone funciones de servidor en
`src/lib/quote-editor.functions.ts`. Úsalas tal cual; **no** reimplementes
cálculos ni consultas a la base.

Consulta el contrato completo en `docs/contrato-ui-editor-cotizaciones.md`.

## Pantalla y comportamiento

1. **Encabezado de la cotización**: código, estatus (selector con los valores
   permitidos), fecha y vigencia, cliente/ubicación. El estatus se cambia con
   `qeSetQuoteStatus`.

2. **Tabla de partidas** (`lines` de `qeGetQuote`): columnas
   Descripción · Cantidad · Precio unitario · Descuento · IVA · Subtotal · Total,
   con acciones editar y borrar por fila.
   - Editar fila → `qeUpdateLine`.
   - Borrar fila → `qeDeleteLine` (con confirmación).
   - Agregar fila → formulario que llama `qeAddLine`.

3. **Totales** (parte inferior): Subtotal, IVA, Total. Muéstralos desde la
   respuesta del servidor (`quote.subtotal`, `quote.tax_total`, `quote.total`).
   Para respuesta inmediata mientras se escribe, puedes previsualizar con
   `src/lib/quote-math.ts`, pero el valor definitivo es el del servidor tras cada
   operación.

4. **Sugerir precio**: al agregar una partida ligada a un curso, ofrece un botón
   "Sugerir precio" que llama `qeSuggestPrice({ courseLegacyId, modality, participants })`
   y precarga el precio (individual o grupal según `recommended`). El asesor puede
   ajustarlo antes de guardar.

5. **Convertir solicitud → cotización**: desde la lista de solicitudes, un botón
   "Crear cotización" que llama `qeCreateQuoteFromRequest({ requestId })` y navega
   al editor con el `quote_id` devuelto.

## Requisitos de UX

- Diseño limpio, responsivo, en español (mismo estilo que el portal actual).
- Estados de carga y error visibles; si una función devuelve `{ ok:false, error }`,
  muestra el `error`.
- Solo accesible para staff (el portal ya maneja la sesión; el backend rechaza a
  no-staff con `No autorizado`).
- Formatea importes como MXN con 2 decimales.

## Lo que NO debe hacer Lovable

- No crear migraciones ni tablas.
- No calcular ni guardar totales por su cuenta como fuente de verdad.
- No llamar a Noil ni a ningún PAC.
- No tocar `main` mientras Claude Code trabaja en backend (coordinar).
