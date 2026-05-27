
# Portal KG Safety — Prototipo funcional (Etapa 1 + 2)

Implementar el portal privado B2B como prototipo navegable con datos ficticios y roles simulados (sin backend, sin login real). Cubre los 5 prompts del brief en un solo sprint dividido en bloques.

## Alcance

- Prototipo visual completo (Etapa 1 del brief)
- Roles simulados con switcher (Etapa 2)
- Sin Lovable Cloud, sin auth real, sin uploads reales (Etapas 3-6 quedan fuera)

## Estructura de rutas

```text
/portal/login           → login simulado con selector de rol
/portal                 → layout con sidebar + dashboard
/portal/clientes        → lista de clientes
/portal/clientes/$slug  → vista empresa (plantas asociadas)
/portal/plantas/$slug   → vista planta (sistemas, certificaciones, proyectos)
/portal/proyectos       → historial con filtros
/portal/proyectos/$id   → detalle de proyecto + documentos
/portal/certificaciones → vencimientos agrupados por urgencia
/portal/documentos      → biblioteca descargable con filtros
/portal/facturacion     → facturas ficticias
/portal/biblioteca      → biblioteca interna KG (solo admin/equipo)
/portal/admin           → panel admin (solo admin)
```

Convención TanStack: layout pathless `_portal.tsx` con sidebar + `<Outlet/>`, hijos como `_portal.portal.tsx`, etc. O bien usar `portal.tsx` como layout con `<Outlet/>` y archivos `portal.clientes.tsx`. Se usará la segunda (más simple, sin underscore).

## Datos ficticios (`src/data/portal.ts`)

Un solo módulo con tipos + arrays mock:

- `CLIENTS` (16): FEMSA, Holcim, Merck, Coca-Cola, PetStar, Pirelli, Pfizer, Cargill, J&J, Owens Illinois, Unilever, Tupperware, Vestas, Gamesa, PepsiCo, GM, Conoco
- `PLANTS` (12+): cada una con cliente, ubicación, industria, responsable
- `SYSTEMS`: línea de vida horizontal/vertical, anclajes, barandales, escalas marinas
- `PROJECTS` (~25): tipo, planta, fecha, responsable KG, estatus, documentos asociados
- `CERTIFICATIONS`: sistema, planta, fecha emisión, vencimiento, estado calculado (vigente/por-vencer-30/por-vencer-60/vencido)
- `DOCUMENTS`: tipo (factura/cotización/OC/certificado/ficha/reporte/evidencia), proyecto, fecha, url ficticia
- `INVOICES`: folio, fecha, proyecto, monto, estado
- `LIBRARY`: documentos internos por categoría (presentaciones, fichas, formatos, manuales, normas)
- `ALERTS`: críticas, derivadas de certificaciones vencidas/por vencer

## Roles (simulados en localStorage)

```ts
type Role = 'cliente-corp' | 'cliente-planta' | 'admin-kg' | 'equipo-kg'
type Session = { role: Role; clientSlug?: string; plantSlug?: string; name: string }
```

Hook `usePortalSession()` lee/escribe `localStorage['kg-portal-session']`. Layout redirige a `/portal/login` si no hay sesión. Filtros aplicados en cada vista según rol:

- `cliente-corp` → solo su empresa y plantas
- `cliente-planta` → solo su planta
- `admin-kg` → todo + `/portal/admin`
- `equipo-kg` → biblioteca interna, sin clientes

## Componentes nuevos (`src/components/portal/`)

- `PortalSidebar.tsx` — nav lateral con secciones según rol
- `PortalHeader.tsx` — breadcrumb, rol activo, botón "cambiar rol" (logout simulado)
- `StatusBadge.tsx` — chips: vigente/verde, por-vencer/amarillo, vencido/rojo, pendiente/gris, revisión/morado
- `StatCard.tsx` — tarjetas resumen del dashboard
- `DataTable.tsx` — tabla genérica con filtros (usa shadcn `table` + `input` + `select`)
- `DocumentRow.tsx` — fila con acciones: Ver, Descargar, Copiar enlace (toast simulado)
- `ExpiryGroup.tsx` — agrupador de certificaciones por urgencia

## Pantallas

1. **Login** (`/portal/login`): card centrada, 4 botones de rol (Cliente corp / Cliente planta / Admin / Equipo). Selector de cliente para roles cliente. Guarda sesión y redirige a `/portal`.
2. **Dashboard** (`/portal`): 4 StatCards (certificaciones por vencer, sistemas, proyectos activos, alertas críticas) + 3 paneles (próximos vencimientos, últimos proyectos, documentos recientes).
3. **Clientes** (`/portal/clientes`): grid de cards con logo placeholder + nº plantas + nº certificaciones vigentes.
4. **Empresa** (`/portal/clientes/$slug`): tabs plantas / proyectos / documentos. KPIs arriba.
5. **Planta** (`/portal/plantas/$slug`): header con datos planta, sistemas instalados, certificaciones con estado, proyectos históricos, documentos.
6. **Proyectos** (`/portal/proyectos`): DataTable con filtros tipo/cliente/planta/estatus.
7. **Detalle proyecto** (`/portal/proyectos/$id`): metadatos + lista de documentos clasificados + historial.
8. **Certificaciones** (`/portal/certificaciones`): 4 ExpiryGroups (vencidas → vigentes).
9. **Documentos** (`/portal/documentos`): filtros por tipo + tabla.
10. **Facturación** (`/portal/facturacion`): tabla con PDF/XML simulados.
11. **Biblioteca KG** (`/portal/biblioteca`): solo admin/equipo. Cards por categoría → lista de archivos.
12. **Admin** (`/portal/admin`): solo admin. Tabs clientes/plantas/usuarios/proyectos/vencimientos con botones simulados (toast "Acción simulada").

## SEO y nav

- Todas las rutas `/portal/*` con `<meta name="robots" content="noindex">` en `head()` — es área privada.
- Agregar enlace "Portal" en header público (link discreto a `/portal/login`).

## Diseño

Mantiene tokens existentes (oklch en `src/styles.css`). Estética dashboard densa, no landing: tablas, sidebars, badges. Reusar shadcn `card`, `table`, `tabs`, `badge`, `button`, `input`, `select`, `dialog`. Tipografía heredada del sitio.

## Acciones simuladas

Todos los botones (Descargar, Ver PDF, Crear, Editar, Asignar usuario) muestran toast "Acción simulada — prototipo". No descargas reales.

## Orden de implementación

1. `src/data/portal.ts` + tipos + datos ficticios
2. `src/hooks/use-portal-session.ts` + `src/components/portal/*`
3. Layout `portal.tsx` + login
4. Dashboard + clientes + planta + empresa
5. Proyectos + detalle + certificaciones + documentos + facturación
6. Biblioteca + admin
7. Link discreto en header público + verificación visual por rol

## Fuera de alcance

- Lovable Cloud / Supabase / auth real
- Uploads reales / generación de PDFs
- Notificaciones por email
- Integración con facturación real

Esto se aborda en sprints posteriores (Etapas 3-6 del brief).
