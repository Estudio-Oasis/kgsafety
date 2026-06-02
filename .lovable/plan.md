
# Rediseño de Header + Hero (home)

Objetivo: que la sección tope del sitio venda — header legible y jerárquico, imagen del hero protagonista (no tapada por texto), headline más impactante y menos denso, KPIs (30M+ / Registro oficial / 5 países) con más peso comercial. Mantener la paleta y tipografía actuales.

## 1. Header (`SiteHeader.tsx`)

Problema actual: 9 links uniformes apretados + 4 botones (tema, idioma, portal, CTA) compitiendo a la misma jerarquía → ruidoso y el CTA "Solicitar diagnóstico" se corta en pantallas medianas.

Cambios:
- **Two-row layout en desktop (≥xl)**:
  - Fila 1 (utility bar, fondo navy delgado): idioma · tema · "Portal clientes" alineados a la derecha, tipografía 10px.
  - Fila 2 (main bar, fondo surface): logo a la izquierda, nav central, CTA "Solicitar diagnóstico" a la derecha (no se corta).
- **Agrupar nav** en 6 ítems visibles + dropdown "Más" para reducir densidad: `Servicios · Capacitación · Ingeniería · Equipos · Industrias · Nosotros` + dropdown con `P.N.P.C. · Facturación · Contacto · Cumplimiento · FAQ`.
- **Estado activo** subrayado con `--signal` (2px) en vez de cambio de color sutil.
- **CTA**: fondo `signal`, texto navy, sin doble borde grueso — limpio con sombra `shadow-[2px_2px_0_var(--anchor-fixed)]` y hover lift.
- Mantener mobile menu actual (funciona bien).

## 2. Hero — imagen visible (`index.tsx`, hero tile)

Problema: imagen detrás del headline blanco + amarillo invade el texto y se pierde.

Cambios estructurales del tile principal:
- Cambiar de "imagen full con texto encima" a **layout split dentro del mismo tile** en desktop:
  - Izquierda (~58%): bloque navy sólido con pill + headline + sub + CTAs (todo legible, sin imagen detrás).
  - Derecha (~42%): la imagen del hero recortada limpia con un gradiente vertical sutil navy→transparente solo en el borde izquierdo para fundirse.
- En móvil: imagen arriba como banda de ~180px, texto debajo en bloque navy (la imagen se ve completa, no se pelea con el texto).
- Quitar el overlay oscuro global sobre la imagen.

## 3. Pill "tech" con luz oscilante

Reemplazar el eyebrow `<span>` actual por un componente pill:
```
[●] INTEGRADOR DE SEGURIDAD EN ALTURA · WE NEVER FALL
```
- Pill con borde 1px `signal/40`, fondo `signal/10`, texto `signal`, padding compacto.
- Punto LED (`●`) a la izquierda con animación CSS `kg-led-pulse` (opacity + box-shadow signal): 1.6s ease-in-out infinite, brillo de 100% → 40% → 100%. Respeta `prefers-reduced-motion`.
- Definir el keyframe en `src/styles.css` junto a los existentes.

## 4. Headline más corto y con jerarquía

Actual: "Ingeniería aplicada a la **eliminación total de riesgos de caída**." → 8 palabras pesadas antes del punto fuerte.

Propuesta:
- Línea 1 (display, blanco, tamaño grande): **CERO CAÍDAS.**
- Línea 2 (display, signal, medio): **Ingeniería que las elimina.**
- Sub (gris claro): "Diagnóstico, sistemas certificados y capacitación DC-3 para industria pesada." → frase movida a sub para no perderla y darle más peso visual (sin bajar opacity).
- Sub usa `text-white` puro (no 88%) sobre fondo navy sólido — se lee perfecto.

## 5. KPIs más comerciales (tiles derecha)

Problema: 30M+ minimalista, "Registro oficial" + "5 países" se ven vacíos y aislados.

Cambios:
- **Tile 30M+ (amarillo)**: añadir mini-trend bar debajo del número (4 barras navy ascendentes) + badge "SIN ACCIDENTES" en negro arriba a la derecha. Footer "12 años · 200+ clientes" con icono ✓.
- **Tile Registro/Países (navy)**: convertir en 2 mini-cards internas con icono (escudo para STPS, globo para países), border `signal` 2px abajo en cada una. En móvil ocupa ancho completo (ya lo hace) pero **eliminar el espacio vacío a la derecha** forzando `grid-cols-2` siempre (no `sm:`) — ambas mitades juntas con divisor central.
- En móvil, el bento KPI inferior pasa de `col-span-2` con contenido apretado a la izquierda a layout 50/50 que rellena todo el ancho como el de 30M+.

## 6. Detalles de implementación

Archivos a tocar:
- `src/components/site/SiteHeader.tsx` — refactor a 2 filas + dropdown "Más".
- `src/routes/index.tsx` — rehacer los 3 tiles del hero bento (split layout, pill, headline nuevo, KPIs reforzados).
- `src/styles.css` — añadir keyframe `kg-led-pulse` y clase `.kg-pill-tech`.
- Sin cambios a `Bento.tsx` (los tiles aceptan children arbitrarios; el split se hace dentro del child).

No se toca: tipografía global, paleta, footer, secciones posteriores.

## Resultado esperado

- Header escaneable en una pasada, sin links que se corten.
- Imagen del hero visible al 100%, texto sobre fondo sólido legible.
- Pill con LED que comunica "tech / monitoreo en vivo".
- Headline corto y memorable ("CERO CAÍDAS") con la promesa técnica como segunda línea.
- KPIs que se sienten como prueba comercial, no como adorno minimalista.
- Móvil sin huecos: ambos bentos llenan el ancho completo.
