# Sprint 7 — QA y refinamiento del Portal

Solo retoques de prototipo. No se toca el sitio público ni se agregan pantallas nuevas.

## 1. Login fiable (`/portal/login` → `/portal`)

**Causa raíz**: `usePortalSession` mantiene su estado en cada componente. Al hacer `login()` en la página de login, se escribe `localStorage`, pero el listener del layout (`portal.tsx`) solo reacciona al evento `storage` — que **no se dispara en la misma pestaña**. Resultado: a veces el layout aún ve `session === null` cuando llega a `/portal` y rebota a `/portal/login`.

**Fix en `src/hooks/use-portal-session.ts`**:
- Compartir estado entre instancias con un pequeño pub/sub en módulo (Set de setters) o `window.dispatchEvent(new Event("kg-portal-session"))` después de `login`/`logout`.
- Suscribirse a ambos eventos (`storage` + `kg-portal-session`) en el `useEffect`.
- En `login()` y `logout()`, además de `setSession`, notificar a los demás suscriptores para que el layout vea la nueva sesión de inmediato.

Con eso, el `navigate({ to: "/portal" })` en `portal.login.tsx` siempre encuentra `session` ya hidratada y no rebota.

## 2. Microcopy del login

`src/routes/portal.login.tsx` línea 63:
- Antes: `Su historial técnico,<br />` (sin espacio tras la coma).
- Después: `Su historial técnico,{" "}<br />` para que el extracto siempre lea `Su historial técnico, en un solo lugar.`

Pasada rápida a títulos cercanos por si hay otros casos `,<br />` pegados en `portal.*`.

## 3. Lógica de vencimientos en certificaciones

En `src/routes/portal.certificaciones.tsx` (línea 72) cambiar el label del `StatusBadge`:

```ts
const label =
  dl < 0
    ? `Vencida hace ${Math.abs(dl)} días`
    : dl === 0
      ? "Vence hoy"
      : `Vence en ${dl} días`;
```

Mantener colores ya existentes (`danger`/`warn`/`ok`) en `StatusBadge`. Verificar el mismo patrón en el dashboard (`portal.index.tsx`) y en `portal.plantas.$slug.tsx` si reusan la misma lógica.

## 4. Restricciones por rol (auditoría)

Pasada de revisión por cada ruta `/portal/*`:

| Ruta | cliente-corp | cliente-planta | equipo-kg | admin-kg |
|---|---|---|---|---|
| `/portal` dashboard | KPIs de su empresa | KPIs de su planta | KPIs operativos KG | global |
| `/portal/clientes` | ❌ (oculto en sidebar) | ❌ | ❌ | ✅ |
| `/portal/clientes/$slug` | solo si coincide con su `clientSlug` | ❌ | ❌ | ✅ |
| `/portal/plantas/$slug` | solo plantas de su empresa | solo su planta | ✅ | ✅ |
| `/portal/proyectos` | filtrado por `clientSlug` | filtrado por `plantSlug` | asignados a KG | global |
| `/portal/certificaciones` | filtrado por empresa | filtrado por planta | (no en sidebar) | global |
| `/portal/documentos` | filtrado por empresa | filtrado por planta | (no en sidebar) | global |
| `/portal/facturacion` | filtrado por empresa | filtrado por empresa de su planta | ❌ | global |
| `/portal/biblioteca` | ❌ | ❌ | ✅ | ✅ |
| `/portal/admin` | ❌ | ❌ | ❌ | ✅ |

Acciones:
- Ajustar el array `NAV` en `src/routes/portal.tsx` para reflejar la tabla (quitar Documentos/Certificaciones del menú de `equipo-kg`, etc.).
- En cada ruta detalle (`portal.clientes.$slug.tsx`, `portal.plantas.$slug.tsx`, `portal.proyectos.$id.tsx`), si la sesión no debería ver ese recurso, mostrar un panel "Sin acceso" en lugar de los datos.
- Reusar los filtros ya existentes (`session.clientSlug`, `session.plantSlug`) y centralizar el helper en `src/data/portal.ts` (`canSeeClient`, `canSeePlant`, `canSeeProject`).

## 5. Acciones explícitas en documentos y facturación

`src/components/portal/PortalUI.tsx`: añadir un `RowActions` con botones consistentes (ícono + label).

En `src/routes/portal.documentos.tsx` cada fila debe mostrar:
- **Ver** (Eye)
- **Descargar** (Download)
- **Copiar enlace** (Link)

En `src/routes/portal.facturacion.tsx` cada fila:
- **Ver**
- **PDF** (FileText)
- **XML** (Code)
- **Copiar enlace**

Todos disparan el toast `"Acción simulada — prototipo"` (no descargas reales).

## 6. Historial del proyecto

En `src/routes/portal.proyectos.$id.tsx`, debajo de la cabecera, agregar bloque "Historial del proyecto" generado a partir del `id` (determinístico, no aleatorio en render) con eventos:
- Cotización enviada
- Orden de compra recibida
- Servicio ejecutado
- Certificado emitido
- Documentos cargados

Render como timeline vertical (punto + fecha + título + descripción corta). Datos viven en `src/data/portal.ts` como helper `buildProjectTimeline(projectId)`.

## 7. Metadatos en plantas y proyectos

Añadir en `Plant` y `Project` (en `src/data/portal.ts`):
- `responsableCliente: string`
- `responsableKG: string`
- `ultimaActualizacion: string` (ISO)
- `proximoVencimiento?: { label: string; fecha: string }` derivado de certificaciones de esa planta/proyecto

Mostrar esos cuatro datos como tarjetas resumen en:
- `portal.plantas.$slug.tsx`
- `portal.proyectos.$id.tsx`

## 8. Conoco Phillips → "Energía / Infraestructura"

En `src/data/portal.ts`:
- `{ slug: "conoco", name: "Conoco Phillips", industry: "Energía / Infraestructura", plants: 1 }`
- Revisar `PLANTS` y filtros de `industrias.tsx` por si "Petrolera" sigue apareciendo.

## 9. `noindex` en `/portal/*`

Verificar que TODAS las rutas portal tengan `head().meta` con `{ name: "robots", content: "noindex, nofollow" }`:
- `portal.tsx` ✅
- `portal.login.tsx` ✅
- Falta auditar: `portal.index.tsx`, `portal.clientes.index.tsx`, `portal.clientes.$slug.tsx`, `portal.plantas.$slug.tsx`, `portal.proyectos.index.tsx`, `portal.proyectos.$id.tsx`, `portal.certificaciones.tsx`, `portal.documentos.tsx`, `portal.facturacion.tsx`, `portal.biblioteca.tsx`, `portal.admin.tsx`. Añadir `head()` con `noindex` donde falte.

También excluir `/portal*` del `src/routes/sitemap[.]xml.ts` si está listado.

## 10. Sin navbar ni footer público en rutas internas

Ya está implementado en `src/routes/__root.tsx` con guard por `pathname.startsWith("/portal")`. Verificación rápida: revisar también que no aparezcan widgets globales (cookie banner, WhatsApp flotante) sobre el portal; si aparecen, aplicar el mismo guard.

## Detalles técnicos

- Cambios solo en frontend (`src/routes/portal.*`, `src/hooks/use-portal-session.ts`, `src/data/portal.ts`, `src/components/portal/PortalUI.tsx`, `src/routes/__root.tsx`).
- Sin backend, sin Lovable Cloud — sigue siendo prototipo con datos ficticios y `localStorage`.
- Sin nuevas dependencias.
- Tipos: ampliar `Plant` y `Project` con campos opcionales para no romper datos existentes; rellenar en el seed.

## Orden de ejecución

1. Fix de `usePortalSession` (desbloquea pruebas de los demás puntos).
2. Microcopy + Conoco + `noindex` (cambios pequeños).
3. Lógica de vencimientos (texto y dashboard).
4. Permisos por rol (NAV + guards en rutas detalle).
5. Acciones explícitas en documentos/facturación.
6. Metadatos de planta/proyecto + historial de proyecto.
7. Verificación final navegando los 4 roles.
