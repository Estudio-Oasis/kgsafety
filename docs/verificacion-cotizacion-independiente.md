# Verificación del cotizador independiente (staging)

_Objetivo: comprobar que una solicitud de `/contacto` se registra en Supabase
(sin Noil) y aparece en el portal, ANTES de encenderlo en producción._

## 0. Qué se validó ya (en esta sesión, contra PostgreSQL real)

Se levantó un PostgreSQL local, se aplicaron **todas** las migraciones en orden
(incluidas las 3 nuevas) y se corrió un flujo completo:

- ✅ `create_web_quote`: primer envío = `created`; segundo envío con el mismo
  `submission_id` = `duplicate` con el **mismo** `quote_request_id`
  (una sola solicitud en la base). **Idempotencia probada.**
- ✅ Editor: convertir solicitud → cotización → agregar 2 partidas →
  **subtotal 26,500 · IVA 4,240 · total 30,740** (exacto). **Totales probados.**
- ✅ Borrar partida → totales recalculados solos. **Recalculo probado.**
- ✅ Un usuario que **no** es staff recibe `No autorizado`. **Seguridad probada.**
- ✅ `resolve_price_package_courses()` enlaza los paquetes al curso por
  `legacy_id` (0 antes de importar cursos, 3 después). **Resolver probado.**
- ✅ Pruebas automáticas `bun test`: 17 en verde.

## 1. Aplicar migraciones en STAGING (no en producción)

En el proyecto de Supabase de **staging**, aplicar en este orden:

1. `20260930170000_web_quote_supabase_rpc.sql`
2. `20260930180000_quote_editor.sql`
3. `20260930190000_price_packages.sql`

## 2. Importar catálogos y resolver paquetes

```bash
SUPABASE_URL=<staging_url> \
SUPABASE_SERVICE_ROLE_KEY=<staging_service_role> \
bun run import:catalogos
```

Esto sube cursos/servicios reales y ejecuta `resolve_price_package_courses()`.
> Importante: el resolver debe correr **después** de importar los cursos, porque
> el `course_id` se resuelve por `legacy_id`. El importador ya lo hace al final.

## 3. Variables de entorno (staging, Noil apagado)

```
QUOTE_SOURCE_OF_TRUTH=supabase
NOIL_SYNC=off
BILLING_PROVIDER=noil     # facturación sin cambios por ahora
```

## 4. Prueba clave (end-to-end)

1. Abrir el sitio de staging → `/contacto` → enviar una solicitud de prueba.
2. Verificar en Supabase (tabla `quote_requests`) que aparece una fila nueva con
   `code` tipo `WEB-YYYYMMDD-...` y `status = 'Pendiente'`.
3. Verificar que aparece en el portal (`portal.erp-kg`).
4. Reenviar la **misma** solicitud: **no** debe crear una segunda fila
   (idempotencia).
5. (Opcional) Como staff, convertir la solicitud en cotización y agregar
   partidas; confirmar que los totales cuadran.

## 5. Secuencia a producción

1. Validar en staging (pasos anteriores).
2. Merge de esta rama a `main` (Lovable construye sobre `main`).
3. Lovable arma la **UI del editor** (`docs/prompt-lovable-editor.md`).
4. Encender `QUOTE_SOURCE_OF_TRUTH=supabase` en producción.
5. Desplegar.

> **No** activar producción ni mezclar Facturama/PAC todavía. El adaptador de
> facturación permanece en `noil` hasta que se decida el PAC.
