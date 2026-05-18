
# Auditoría de contenido + toggles de tema e idioma

## 1. Auditoría: qué falta vs catálogo y propuesta

Revisé los 3 PDFs (catálogo de servicios, brandbook, propuesta de revisión web) contra las 7 rutas actuales. La estructura está, pero falta info concreta:

**Páginas faltantes**
- `/blog` — sí estaba en la propuesta original, lo omití en fase 1. Lo agrego como índice de recursos (3-4 artículos placeholder con normativas NOM-009, OSHA, casos de caída) para SEO y autoridad.

**Contenido faltante por página existente**
- **Capacitación**: faltan los **temarios OSHA Subpartes** (guion básico mencionado en pp.19-20 del catálogo), la mención de **Instituto Nacional de Capacitación en Seguridad Laboral KG**, programas de **recertificación anual**, y **rotación de personal**.
- **Contratistas (P.N.P.C.)**: faltan los **antecedentes** (10 años de implementación, reducción a cero accidentes, 100% auditable, cumplimiento REPSE), las **3 áreas de capacitación + 2 de entrenamiento** específicas, y el detalle de **renta de anclajes** para baja frecuencia.
- **Ingeniería**: faltan los **departamento de obra civil**, el detalle de **anclajes móviles/portátiles/temporales/individuales/colectivos** (compra y renta), y las variantes **LVH Rigid Rail / Overhead Structural / Cable base**.
- **Equipos**: falta mención de **30 marcas representadas**, categorías específicas (**descensores de emergencia, rescatadores de espacios confinados, sistemas removibles, malacates manuales/eléctricos, cuerdas, ganchos/poleas/grilletes, abrazaderas y troles**), y la sección **Construcción y Mantenimiento** (residencial e industrial: limpieza, pintura, electricidad, impermeabilización, obra civil) con **programas a corto/mediano/largo plazo** (el programa a 3 años donde el cliente termina siendo dueño del equipo es un diferenciador fuerte).
- **Nosotros**: falta el bloque oficial del brandbook ("No solo diseñamos seguridad. Diseñamos tranquilidad."), las **problemáticas del mercado** (mercado negro de supervisores, falta de temarios homologados, etc.) que justifican el método K.A.E.E., y la sección de **comunicación efectiva en seguridad** (los 9 elementos).
- **Inicio**: agregar franja de **submarcas KAEE Group** (Working at Heights, WoLL – Working on Life Lines, Safety@Heights) para reforzar portafolio.

**Datos de contacto a corregir**
- Catálogo y propuesta confirman teléfono **722 879 5076** y dirección **José María Pino Suárez 304-1, Col. 5 de Mayo, Toluca, EdoMex 50090** — ya está bien.

## 2. Toggle oscuro / claro

- `ThemeProvider` propio (sin dependencias nuevas) que persiste en `localStorage` y aplica `class="dark"` o `class="light"` al `<html>`.
- Definir paleta clara en `src/styles.css`: fondo **Paper White** (oklch ~0.98), texto **Anchor Black**, cards **Steel Grey 5%**, acentos **Signal Yellow** y **Lift Orange** se mantienen (son colores de marca). Bordes oscuros al 10%.
- Botón toggle (sol/luna de `lucide-react`) en `SiteHeader`, junto al selector de idioma.
- Auditar componentes: hoy uso clases hardcoded como `bg-anchor`, `text-white`, `border-white/10`. Migrar a tokens semánticos (`bg-background`, `text-foreground`, `border-border`) en `SiteHeader`, `SiteFooter`, `WhatsAppFloat`, `__root.tsx` y las 7 rutas. Es el cambio más grande de este plan.

## 3. Toggle español / inglés

- `i18n` propio, ligero, sin librerías: contexto React `LanguageProvider` con diccionario `{ es, en }` en `src/i18n/dictionary.ts`. Hook `useT()` devuelve strings. Persistencia en `localStorage` + `<html lang>` dinámico.
- Selector ES/EN en header (texto compacto "ES | EN").
- Traducir todos los strings visibles de las 8 rutas + header + footer + WhatsApp float + 404. Mantener nombres propios sin traducir (K.A.E.E., P.N.P.C., DC-3, NOM-009-STPS, "We never fall.").
- SEO: el `head()` de cada ruta lee idioma actual y emite `title`/`description` en el idioma activo, además de `<link rel="alternate" hreflang="...">`.

## 4. Orden de implementación

1. Tokens claros/oscuros en `styles.css` + `ThemeProvider`.
2. `LanguageProvider` + diccionario base.
3. Migrar `SiteHeader` / `SiteFooter` / `WhatsAppFloat` a tokens semánticos + agregar toggles.
4. Migrar las 7 rutas existentes a tokens + cablear strings al diccionario.
5. Crear `/blog` con 3 artículos.
6. Rellenar contenido faltante por página (sección por sección listado arriba).
7. QA visual en oscuro y claro, ES y EN, en mobile (946px) y desktop.

## Fuera de alcance

- Backend del formulario / portal de contratistas con login / blog con CMS (siguen requiriendo Lovable Cloud).
- Buscador y filtros funcionales del catálogo de equipos (sería con Cloud).
- Traducción del blog full (los artículos quedan en español; los títulos/menús sí se traducen).

¿Apruebo y arranco?
