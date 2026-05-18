# Rediseño KG Safety — enfoque conversión

Sitio nuevo orientado 100% a **convertir y vender**. Los logos de clientes, certificaciones y stats funcionan como prueba social al servicio de la conversión, no como protagonistas. Estética premium e industrial moderna para que clientes enterprise (Coca-Cola FEMSA, Holcim, Unilever) lo tomen en serio.

## Principios de diseño

- **CTA omnipresente:** "Cotizar ahora" + WhatsApp flotante en todas las rutas
- **Hero que vende:** propuesta de valor clara + CTA primario + prueba social inmediata (logos + stat clave)
- **Cada sección termina en conversión:** servicio → beneficio → CTA contextual
- **Prueba social distribuida:** logos, stats y testimonios intercalados, no apilados en una sola franja
- **Estética actual:** dark mode industrial, tipografía display fuerte (Netron-style), micro-interacciones, motion sutil — nivel Linear/Vercel aplicado a industria pesada

## Identidad (del brandbook oficial)

- Paleta: Anchor Black · Steel Grey · Signal Yellow · Lift Orange (en oklch)
- Tipografía: Arial body · display tipo Netron para impacto
- Tagline: "We never fall."
- Método K.A.E.E. como diferenciador

## Arquitectura de rutas

```
/                Landing de conversión
/equipos         Catálogo + cotizar
/capacitacion    Niveles + inscribir
/ingenieria      Servicios + agendar diagnóstico
/contratistas    P.N.P.C. + registrar empresa
/nosotros        Trust builder (método, equipo, certificaciones)
/contacto        Cotización + WhatsApp + datos
```

Blog se omite en esta fase (no convierte directo). Cada ruta con SEO propio y CTA dedicado al final.

## Estructura de la landing (/)

1. **Hero** — Headline de valor + CTA "Cotizar" + stat ancla (30M+ horas-hombre supervisadas sin accidentes)
2. **Logos de clientes** (franja sobria, justo bajo hero = prueba social inmediata)
3. **Servicios** (5 cards con CTA individual a su página)
4. **Por qué KG** — método K.A.E.E. visualizado + diferenciador vs competencia
5. **Stats hero** (4 números grandes: 23,578 trabajadores · 6,254 contratistas · 1,560 cursos · 980+ clientes)
6. **Caso/testimonio** (Grupo IOCISA u otro)
7. **Certificaciones y normativas** (STPS, OSHA, ANSI, NOM-009) — sello de seriedad
8. **CTA final** — formulario corto + WhatsApp

## Proceso

1. Capturo el preview actual.
2. Genero **3 direcciones de diseño** rendereadas, todas con la paleta del brandbook bloqueada, variando composición y registro (ej: dense editorial, hero cinematográfico, modular industrial).
3. Eliges una, construyo el sitio completo: tokens en `src/styles.css`, 7 rutas con `head()` único, navegación + footer + WhatsApp flotante, formulario que abre WhatsApp prellenado, imágenes industriales generadas con `imagegen`.

## Datos reales que se integran (del catálogo y sitio actual)

- Stats, clientes, contacto, niveles de capacitación (8h/16h/24h con DC-3), 12 áreas de cursos, normativas, método K.A.E.E., P.N.P.C., servicios de ingeniería (anclajes, LVV, LVH, hand rails, plataformas), mantenimiento residencial/industrial

## Fuera de alcance (fase 1)

- Backend del formulario y catálogo con DB → requiere Lovable Cloud (lo activamos después si lo pides)
- Portal de contratistas con login
- Blog/CMS

¿Apruebas y arranco generando las 3 direcciones?