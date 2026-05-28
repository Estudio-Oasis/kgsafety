
# Limpieza de home + ajustes de marca

Cambios solo de frontend (copy, layout, datos). Sin tocar backend ni rutas nuevas.

## 1. Hero (`src/routes/index.tsx`)

- Reemplazar headline "Seguridad en altura **lista para auditoría**" por algo más directo:
  `Ingeniería aplicada a la **eliminación total** de riesgos de caída.`
- Subcopy: quitar "para operaciones industriales de alto estándar" (ya queda implícito); dejar: `Capacitación DC-3, sistemas certificados e ingeniería para industria pesada.`
- CTA principal: "Solicitar diagnóstico" → **"Hablar con un especialista"** (más claro que "Dx").
- CTA secundario "Ver soluciones" se queda.
- Tile inferior: "3 países · MX · CO · CL" → **"5 países"** con `MX · CO · CL · US · CA`.
- Actualizar `<title>` y `og:title` a la nueva claim.
- CTA del bloque final ("Solicitar diagnóstico") también pasa a "Hablar con un especialista".

## 2. FAQ + cobertura (`src/data/kaee.ts`)

- FAQ "¿Tienen cobertura internacional?": actualizar a operación en **México, Colombia, Chile, Estados Unidos y Canadá**.

## 3. Depurar densidad de la home (`src/routes/index.tsx`)

El usuario quiere que se sienta menos saturada. Eliminar dos secciones de relleno:

- Quitar la sección **"Prueba social bento"** completa (testimonio + 2 PNPC stats + chips industrias + tile evidencia) — la prueba social ya queda en la banda de logos y los entregables.
- Quitar la sección **"Catálogo equipos"** de la home (vive en `/equipos`). Conservar solo cursos como catálogo destacado.
- Resultado: Hero → Diferenciador → Divisiones → Clientes → Servicios bento → Catálogo cursos → Entregables auditables → CTA final. Más respirable.

## 4. Divisiones sin marcas externas (`src/components/site/DivisionsBlock.tsx` + `src/data/kaee.ts`)

Las marcas Wall, SoNs Real State, etc. ya no operan como entidades separadas. Mantener los 5 íconos/áreas pero **sin el nombre de compañía**:

- `DIVISIONS` en `kaee.ts`: cambiar `tag` y `name` a descripciones funcionales en lugar de submarcas:
  - `Capacitación` — Cursos DC-3, OSHA y entrenamiento técnico.
  - `Servicios técnicos` — Consultoría, supervisión, certificación e instalación.
  - `Ingeniería` — Líneas de vida, anclajes, barandales, andamios.
  - `Equipo certificado` — EPP y equipo para trabajo en altura.
  - `Inmuebles especializados` — Mantenimiento y renta de espacios para altura.
- En `DivisionsBlock.tsx` quitar la columna grande con la sigla `W@H / MS&S / WoLL…`; dejar solo número `01–05` + nombre + descripción + link.

## 5. Clientes destacados con logos (`src/components/site/ClientLogosBand.tsx`)

- Renombrar el título a **"Clientes destacados"** (quitar "Experiencia con operaciones industriales de alto estándar").
- Reemplazar la grilla de nombres por imágenes reales: usar `realImagesIn("logos-clientes")` (10 PNGs ya disponibles en `src/data/real-assets.ts`).
- Render: grilla 2/3/5 columnas, cada celda con `<img>` centrada, `object-contain`, alto fijo (~64-80px), filtro `grayscale` + `opacity-70` con hover full color. Fondo claro.
- Mantener variante `light/dark`.

## 6. Normativa internacional (`src/routes/index.tsx` — tile servicios + bloque diferenciador)

- En el tile "Cursos DC-3 certificados": ya menciona `STPS, OSHA y ANSI Z359`, conservar.
- En el bloque **DifferentiatorBlock**: agregar un párrafo o badge breve indicando: `Cumplimos normativa nacional e internacional: STPS · OSHA · ANSI Z359.` para que sea explícito en la home.

## 7. P.N.P.C. con más peso (`src/routes/index.tsx`)

- Tile actual del bento de servicios: `04 · P.N.P.C.` con solo "Programa". Reforzar copy:
  - Title: `P.N.P.C.`
  - Description: `Programa que profesionaliza a sus contratistas externos y los filtra por competencias antes de operar en planta.`
  - CTA: `Conocer el programa`.

## 8. Justificación / wrap en móvil (`src/styles.css`)

El reporte del usuario: en móvil las palabras quedan recortadas con 1-2 letras en el segundo renglón.

- Revisar reglas globales `.kg-on-dark p, .font-display` — quitar cualquier `text-align: justify` residual.
- Asegurar `text-wrap: pretty` en párrafos largos (mejor que `balance` para >3 líneas).
- En headlines display móvil: bajar `letter-spacing` apretado y permitir `word-break: normal` + `hyphens: none` (ya está). Validar que el ancho del contenedor no fuerce roturas absurdas — revisar `max-w-xl` en hero subcopy a `max-w-md` en mobile.

## 9. Footer (`src/components/site/SiteFooter.tsx`)

- Cambiar línea "Toluca · Querétaro · CDMX" final del copyright a `Toluca · CDMX · Bogotá · Houston · Toronto` para reflejar los 5 países.

## Técnico (resumen rápido)

| Archivo | Cambio |
|---|---|
| `src/routes/index.tsx` | Hero copy, CTAs, tile países, quitar 2 secciones, refuerzo PNPC |
| `src/data/kaee.ts` | Reescribir `DIVISIONS` sin submarcas; FAQ cobertura 5 países |
| `src/components/site/DivisionsBlock.tsx` | Quitar sigla grande, usar número + nombre funcional |
| `src/components/site/ClientLogosBand.tsx` | Render con `<img>` desde `REAL_ASSETS["logos-clientes"]`, título "Clientes destacados" |
| `src/components/site/DifferentiatorBlock.tsx` | Línea de normativa internacional (STPS · OSHA · ANSI) |
| `src/components/site/SiteFooter.tsx` | Ciudades en 5 países |
| `src/styles.css` | Ajustes mobile wrap/justify en headlines y párrafos |

No se toca el portal, ni rutas internas, ni datos de cursos/equipos.
