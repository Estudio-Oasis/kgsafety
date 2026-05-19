# Pivote a diseño Bento Box + imágenes reales

## Objetivo

Rediseñar la home y las páginas índice (capacitación, equipos, ingeniería, soluciones) con un sistema **bento-box** moderno — mosaico de tiles de distinto tamaño, jerarquía asimétrica, alta densidad de información sin sentirse cargado — y reemplazar las imágenes generadas por IA con **fotos reales** extraídas del sitio viejo (kg-safety.com) complementadas con generadas donde falte cobertura.

Páginas de detalle (`/capacitacion/$curso`, `/equipos/$categoria`, `/ingenieria/$servicio`, contacto, FAQ, nosotros, blog) conservan el layout actual pero heredan los tokens visuales (color, tipografía, sombras de los tiles) para coherencia.

---

## Fase 1 — Extracción de imágenes reales del sitio viejo

1. Script Node en `/tmp` que recorre las 80 carpetas de `site-capture/` en Google Drive vía gateway.
2. Para cada carpeta: descarga el `.html`, parsea con `cheerio` y extrae `<img src>`, `<source srcset>`, `background-image:` y atributos `data-src`.
3. Resuelve URLs relativas contra `https://kg-safety.com/` y descarga las imágenes únicas (deduplicación por hash).
4. Clasifica por nombre/ruta en buckets:
   - `equipos/` (arneses, líneas de vida, anclajes, andamios, plataformas, montacargas, EPP)
   - `cursos/` (alturas, espacios confinados, LOTO, incendios, calor, eléctrica, plataformas, andamios, montacargas, herramientas)
   - `ingenieria/` (lv, anclajes, domos, barandales, escalas, pasos, instalación, supervisión)
   - `industrias/` (plantas, refinerías, fotos de obra)
   - `equipo-humano/` (instructores, oficina, certificados)
   - `marcas/` (logos Petzl, 3M, MSA, etc.)
5. Guarda en `src/assets/real/<bucket>/<slug>.jpg`. Optimiza con `sharp` (max 1600px ancho, JPEG q80) si está disponible — si no, las deja tal cual.
6. Genera `src/data/real-assets.ts` con un mapa `{ bucket: string[] }` para que los componentes elijan imágenes por categoría sin hardcodear paths.

**Si falta cobertura** (ej. no hay foto clara de "espacios confinados"), genero 1–2 imágenes con `imagegen` que respeten la paleta del sitio (acero, signal, anchor) y las mezclo en el mismo bucket.

## Fase 2 — Sistema de diseño Bento

Tokens nuevos en `src/styles.css`:

- `--bento-radius: 1.25rem` — esquinas suaves uniformes.
- `--bento-border: 1px solid color-mix(in oklab, var(--on-surface) 12%, transparent)`.
- `--bento-shadow: 0 1px 0 0 color-mix(...) inset, 0 24px 48px -24px var(--anchor)/40%`.
- `--bento-bg-1`, `--bento-bg-2`, `--bento-bg-accent` — tres "tonos" de tile (neutro claro, neutro medio, accent signal/navy).
- `--bento-gap: 12px md:16px`.

Componente reutilizable `src/components/bento/BentoTile.tsx`:

```tsx
<BentoTile span="col-span-2 row-span-2" variant="accent" image={img} eyebrow="..." title="..." cta="...">
  {children}
</BentoTile>
```

Variantes: `neutral | dark | accent | image | stat | list`. Maneja:
- imagen de fondo con overlay/grain,
- número grande (KPIs: "30M+ horas-hombre"),
- lista compacta (chips),
- CTA "→" en esquina inferior.

Grilla maestra `BentoGrid` con CSS Grid `grid-cols-6 auto-rows-[clamp(120px,14vw,180px)]`, gap por token. Soporta hijo con `span` arbitrario.

## Fase 3 — Rediseño home (`src/routes/index.tsx`)

Layout en 4 bloques bento, todos con CSS Grid 6×N:

**Bloque 1 — Hero bento (6×4)**
- Tile grande 4×3: titular "We never fall." + sub + CTA primario, fondo con foto real (trabajador en altura).
- Tile 2×2: KPI "30M+" horas-hombre sin accidentes.
- Tile 2×1: certificación STPS / DC-3.
- Tile 2×1: WhatsApp directo / tel.
- Tile 6×1 (banda inferior): logos de clientes (Cemex, Bimbo, etc., scroll-marquee).

**Bloque 2 — Servicios bento (6×3)**
4 tiles asimétricos: Capacitación (3×2 con foto curso), Equipos (3×1), Ingeniería (2×2), Contratistas (4×1). Cada uno linkea a su índice.

**Bloque 3 — Cursos top (6×2)**
Mosaico de 6 tiles iguales con los cursos más buscados (Alturas, Confinados, LOTO, Plataformas, Andamios, Incendios), thumbnail + nombre + horas.

**Bloque 4 — Prueba social bento (6×3)**
Tile testimonio grande 3×2 + tile "industrias servidas" (chips) 3×1 + tile "30 años" 3×1 + CTA contacto 3×2.

Animación de entrada por tile (stagger con `motion/react` ya disponible si está, si no CSS `@starting-style` o `IntersectionObserver`).

## Fase 4 — Rediseño páginas índice

Mismo lenguaje bento:

- **`/capacitacion`** — Hero bento + grilla bento de 10 cursos (tile cada uno con foto, niveles disponibles como pills).
- **`/equipos`** — Hero + grilla de 8 categorías + tile "marcas" con logos reales.
- **`/ingenieria`** — Hero + grilla de 6 servicios (lv, anclajes, domos, barandales, escalas, pasos) con foto.
- **`/soluciones`** — Bento de industrias con foto real por sector.

Header/footer no cambian (ya están bien).

## Fase 5 — Sustitución de imágenes generadas

Reemplazar usos de `src/assets/*.jpg` (generadas) por las reales de `src/assets/real/`. Borrar las generadas que ya no se usan.

## Fase 6 — QA

- Revisar en viewport actual (946×774) que la grilla colapse a 2 col en mobile, 4 en tablet, 6 en desktop.
- Verificar contraste de texto sobre imágenes (overlay obligatorio).
- Build + ver `routeTree.gen.ts` se regenere.
- Snapshot rápido de la home y una página índice.

---

## Detalles técnicos

- **Dependencias**: agregar `cheerio` solo en `/tmp` (no entra al bundle); `sharp` opcional vía `nix` si está; si no, omito optimización.
- **Drive download**: stream binario vía `GET .../files/{id}?alt=media` con los mismos headers `Authorization: Bearer LOVABLE_API_KEY` + `X-Connection-Api-Key: GOOGLE_DRIVE_API_KEY`. No usar Node en server runtime — todo se ejecuta en `/dev-server` durante build/dev time.
- **Bundle**: las ~80 capturas pesan; **solo las imágenes reales extraídas** (no los screenshots de sección ni los HTML) entran a `src/assets/real/`. Estimo 40–80 imágenes finales, ~5–10 MB total.
- **Compatibilidad**: bento usa CSS Grid nativo + Tailwind v4 utilities, sin libs extra.
- **Riesgos**:
  - Si las imágenes del sitio viejo ya no están online (404), me apoyo más en generadas — te aviso en el resumen final.
  - Algunas imágenes pueden tener marca de agua o ser stock con licencia ambigua: descarto y reemplazo con generadas.

## Lo que NO toco

- Páginas de detalle (`*.$param.tsx`) — solo heredan tokens, no se rediseñan.
- Header, footer, WhatsApp float, i18n, theme.
- Datos en `src/data/kaee.ts` (estructura de cursos/equipos).
- Rutas / SEO existentes.
