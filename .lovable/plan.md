# Empresa de facturación dinámica (IdEmpresaFacturacion)

## Evidencia (lectura real, sin escritura)

`GET /api/proyecto/contrato/KGSAFETY` → HTTP 200, **objeto raíz** (no arreglo, no `[datos, statusCode]`):

```json
{"sContrato":"KGSAFETY","sMascara":"KGSAFETY","sCodigo":"KGSAFETY","sTipoObra":"ORDEN_TRABAJO",
 "mDescripcion":"CORPORATIVO EMPRESARIAL KAEE","lStatus":"Activo",
 "IdEmpresa":6,"IdEmpresaFacturacion":69,"IdMsConfDSAI17":null,"idOrganizacion":6,
 "dFechaAplicacion":null}
```

Campo literal: **`IdEmpresaFacturacion`** = `69`. También trae `IdEmpresa` = 6 (no confundirlos).
La lectura respondió 200 **sin** cabecera de autenticación.

## Qué se construye

1. **Lector del contrato** en `src/lib/facturacion.server.ts`:
   `getEmpresaFacturacion(contrato = "KGSAFETY")` que llama a `/proyecto/contrato/{contrato}`
   usando el mismo `call()` (queda auditado en la bitácora) y extrae el id de forma tolerante:
   objeto raíz, arreglo `[{...}]`, patrón `[datos, statusCode]` y variantes anidadas — la misma
   lección de `createClient`. Devuelve `{ idEmpresaFacturacion, idEmpresa, contrato, descripcion }`
   o `null` si no se puede resolver.

2. **Caché en memoria** con TTL corto (~10 min) para no consultar el contrato en cada búsqueda.

3. **Búsqueda de facturas**: `findInvoice` deja de recibir el literal `"KGSAFETY"` como parámetro
   fijo. Resuelve el contrato primero y usa lo que Noil devuelva; si no se resuelve, cae al
   literal actual para no romper el flujo hoy y registra una advertencia en la bitácora.

4. **Emisión (`/facturar/emitir`)**: hoy el payload no lleva empresa de facturación y el 422 de
   Noil menciona "No se encontró la empresa de facturación configurada para el contrato".
   Se añade la resolución previa del contrato y se **registra** el `IdEmpresaFacturacion` en la
   auditoría de la llamada. **No** se agrega el campo al cuerpo del POST todavía: el contrato de
   entrada documentado en Swagger solo acepta `IdProveedorCliente`, `NoCotizacion`, `UsoCFDI`,
   `Referencia`. Queda como pregunta abierta a Noil si esperan un campo extra.

5. **Diagnóstico**: el healthcheck de `/portal/erp` suma una sonda "empresa de facturación"
   que muestra el contrato y el id resuelto, para ver de un golpe si el problema es de
   configuración del contrato o del timbrado.

6. **Cliente fiscal**: al resolver `IdProveedorCliente` se contempla también el anidado
   `master_cliente.IdClienteProveedor`, no solo la raíz (mismo riesgo detectado antes).

## Fuera de alcance

PDF de factura ya timbrada: no hay endpoint documentado; espera confirmación de Noil.

## Sobre `FACT_API_TOKEN`

El código usa un ternario: `...(process.env.FACT_API_TOKEN ? { Authorization: \`Bearer ...\` } : {})`
en las dos llamadas (`call()` y `previewInvoicePdf`). Como la variable **no está configurada**,
hoy la cabecera `Authorization` **no se envía en absoluto** — no se manda `Bearer undefined` ni
`Bearer ` vacío. Las llamadas de facturación salen sin autenticación, y la lectura del contrato
confirma que al menos los GET públicos responden 200 así.
