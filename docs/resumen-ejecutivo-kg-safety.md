# KG Safety — Resumen ejecutivo (cotizador propio + facturación)

_Última actualización: 2026-09-30 · Rama: `reconstruccion/cotizador-independiente-y-fiscal`_

## En una frase

KG Safety ya tiene su **propio cotizador** (independiente del ERP Noil) y la
facturación quedó **preparada** para cambiar de proveedor de timbrado el día que
se decida, sin volver a tocar el sitio.

## ¿Por qué importa?

Antes, cada cotización y cada factura pasaban por **Noil** (un ERP externo). Eso
ata al negocio a un proveedor y a un costo mensual. El objetivo del cliente es
**usar su propio cotizador** y, más adelante, timbrar sus facturas sin depender
de Noil.

## ¿Qué quedó listo en esta etapa?

| Pieza | Estado | Qué hace |
|---|---|---|
| Alta de solicitudes propias | ✅ Listo y probado | Cuando alguien llena `/contacto`, la solicitud se guarda en **nuestra** base (Supabase), sin duplicados y sin depender de Noil. |
| Editor de cotizaciones | ✅ Backend listo y probado | El equipo puede convertir una solicitud en cotización, agregar/editar partidas y el sistema **calcula los totales solo** (subtotal, IVA, total). |
| Precios sugeridos | ✅ Listo y probado | 21 paquetes con precios oficiales STPS 2026 cargados; el sistema sugiere el precio (individual o grupal). |
| Importador de catálogos | ✅ Listo | Sube los cursos y servicios reales del sitio a la base propia. |
| Facturación (adaptador) | ✅ Preparado | La facturación quedó "enchufable": hoy sigue con Noil (igual que siempre), mañana se cambia a un PAC directo con solo cambiar una configuración. |

## ¿Qué falta y quién lo hace?

- **La pantalla del editor** (lo visual) — la construye **Lovable** siguiendo
  `docs/prompt-lovable-editor.md`. El "motor" (backend) ya está hecho aquí.
- **Elegir el PAC** (proveedor de timbrado, p. ej. Facturama) y capturar sus
  credenciales — decisión comercial + un desarrollo acotado (el enchufe ya existe).
- **Encender el cotizador propio en producción** — se hace con un interruptor
  (`QUOTE_SOURCE_OF_TRUTH=supabase`) después de validar en pruebas (staging).

## Reglas de trabajo (para no romper nada)

- **Lovable** solo toca lo visual (UI). **Claude Code** toca backend, base de
  datos y lógica. **Nunca los dos tocan `main` a la vez.**
- Los **secretos** (llaves del PAC, sellos digitales/CSD) van **solo** en
  variables de entorno del servidor, nunca en el código.
- Nada se activa en producción sin antes validarse en **staging**.

## Infraestructura (decisión)

- **Datos:** Supabase (se mantiene).
- **App:** Vercel o Cloudflare (ya configurado). **No** se necesita comprar un VPS.
- Confirmar qué es el hosting de ~$6,000 MXN del cliente (muy probablemente el
  sitio viejo en PHP, que se puede dar de baja al migrar).

## ¿Cómo sé que funciona? (probado de verdad)

Todo lo de esta etapa se validó contra una base PostgreSQL real y con pruebas
automáticas (`bun test`, 17 pruebas en verde). El detalle técnico está en
`docs/verificacion-cotizacion-independiente.md`.
