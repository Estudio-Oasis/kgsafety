# Plan de corrección post-auditoría (NO-GO → GO)

Se atiende la auditoría en el orden recomendado. Nada de esto toca el ERP ni genera actividad externa.

## Fase 1 — Bloqueadores de publicación

1. **Portal fuera del aire (público)**
   - Ocultar el acceso al portal en el menú, footer y cualquier CTA público.
   - `/portal/*` deja de ser navegable en producción: se muestra una pantalla "Portal en construcción" salvo que se habilite explícitamente para demos internas.
   - Se mantiene `noindex, nofollow` y se retira del sitemap.
   - La autenticación real (login, roles por empresa/planta, protección de rutas) queda como fase aparte con Lovable Cloud; se propondrá cuando se apruebe.
2. **Selector EN oculto**
   - Se retira el botón EN de header y menú móvil hasta completar la traducción. El diccionario se conserva; no se agrega hreflang mientras no exista versión real.

## Fase 2 — Rutas profundas y SEO (32 páginas)

Causa confirmada: `capacitacion.tsx`, `servicios.tsx`, `equipos.tsx` e `ingenieria.tsx` funcionan como ruta padre sin `Outlet`, así que las rutas hijas renderizan la página general y se emiten dos canonicals.

- Se convierten los cuatro archivos padre en páginas índice (`*.index.tsx`), de modo que cada ruta hija renderice únicamente su propio contenido.
- Cada página profunda queda con **una sola** canonical (a sí misma), su propio H1, título, descripción y contenido específico (curso, categoría de equipo, servicio de ingeniería, servicio).
- El sitemap se revisa para que solo liste rutas con contenido propio.

## Fase 3 — Móvil, overlays y formulario

- 320 px: botón de menú completamente visible; panel móvil con scroll interno y altura `dvh` para que las últimas acciones sean alcanzables; `Esc` cierra el menú.
- Overlays (WhatsApp, "FX ON", mini-juego, barra inferior): se reducen, reposicionan y se ocultan sobre formularios para que no cubran campos ni CTAs.
- Formulario de cotización:
  - `label` asociado a los 8 campos y 3 selectores; estado anunciado con ARIA.
  - "Local/Foráneo" y "Cerrado/Abierto" con indicador no basado solo en color (texto/ícono + `aria-pressed`).
  - Validación de RFC real (12–13 caracteres, patrón SAT) — "X" deja de ser válido.
  - Deduplicar catálogo: un solo "CFE", un solo "Otro".
  - El botón de envío permanece deshabilitado mientras el formulario sea inválido, incluido el caso "Otro" con razón social.
- Consulta de factura vacía: mensaje de error visible y foco al campo.

## Fase 4 — Rendimiento de imágenes y JS

- Convertir las imágenes pesadas de la portada a WebP/AVIF con `srcset`/`sizes` y tamaños acordes al render real (el archivo de 7360×4912 baja a la escala en que se muestra).
- `loading="lazy"` y `decoding="async"` fuera del hero; el hero mantiene `preload`.
- Reducir TBT: carga diferida de los bloques no críticos (mini-juego, feed de Instagram, catálogos ERP, slider de cursos).

## Fase 5 — Detalles y endurecimiento

- Añadir `public/favicon.png` (deriva del logo) y referenciarlo en el head: se elimina el 404 de `/favicon.ico`.
- Banner de cookies con "Rechazar" y "Configurar", además de "Aceptar".
- Encabezados: `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `Permissions-Policy`.
- Normalizar mayúsculas y barra final (`/Servicios`, `/servicios/`) con redirección permanente.
- Footer: año dinámico (© 2026).
- Verificar el teléfono de facturación (`+52 1 722 799 0719`) frente al de WhatsApp (`+52 722 253 2753`) — requiere confirmación del cliente antes de cambiarlo.

## Notas técnicas

- Los cambios son de frontend, rutas y configuración de servidor; no se modifican las funciones de ERP ni de facturación.
- No se creará ninguna cotización ni CFDI real durante las pruebas; la validación es visual y de estados previos al envío.
- Los encabezados de seguridad se aplican en la capa de servidor de la app (respuesta del servidor TanStack Start).

## Pendiente de decisión

El punto del teléfono de facturación y la eventual autenticación real del portal (Lovable Cloud) requieren tu confirmación; el resto se ejecuta tal cual.
