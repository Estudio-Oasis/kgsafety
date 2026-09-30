# Documentación KG Safety

Índice de documentos del proyecto (cotizador propio + facturación).

## Empieza aquí
- **[resumen-ejecutivo-kg-safety.md](./resumen-ejecutivo-kg-safety.md)** — visión
  general en lenguaje simple: qué quedó listo, qué falta y quién lo hace.

## Cotizador independiente
- [mapa-cotizacion-noil-vs-propio.md](./mapa-cotizacion-noil-vs-propio.md) — cómo
  fluye una cotización con Noil vs. con el cotizador propio, y los interruptores.
- [verificacion-cotizacion-independiente.md](./verificacion-cotizacion-independiente.md)
  — cómo probarlo en staging y la secuencia a producción.

## Editor de cotizaciones (UI que hace Lovable)
- [contrato-ui-editor-cotizaciones.md](./contrato-ui-editor-cotizaciones.md) — las
  funciones de servidor que consume la pantalla y sus respuestas.
- [prompt-lovable-editor.md](./prompt-lovable-editor.md) — prompt listo para pegar
  en Lovable y construir la pantalla.

## Facturación
- [auditoria-noil-2026-09-21.md](./auditoria-noil-2026-09-21.md) — dónde vive la
  dependencia de Noil y el plan para el PAC (adaptador `BillingProvider`).

## Futuro (solo especificación)
- [spec-kg-verify.md](./spec-kg-verify.md) — validación pública de constancias
  DC-3. NO implementado; es una propuesta.

---

### Interruptores de configuración (variables de entorno)

| Variable | Valores | Para qué |
|---|---|---|
| `QUOTE_SOURCE_OF_TRUTH` | `noil` / `supabase` | Fuente de verdad de la cotización |
| `NOIL_SYNC` | `on` / `off` | Sincronizar o no con Noil |
| `BILLING_PROVIDER` | `noil` / `pac` | Proveedor de timbrado de facturas |

### Reglas de oro
- Lovable = solo UI. Claude Code = backend/base/lógica. No tocar `main` a la vez.
- Secretos (CSD/PAC) solo en variables de entorno del servidor.
- Nada a producción sin validar en staging.
