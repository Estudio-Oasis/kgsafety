
# Sprint 5 — Profundidad, precisión y credibilidad

No se cambia la dirección visual. Se completa producto siguiendo la auditoría del 2026-05-27.

## 1. Corregir microcopy "pegado" en todo el sitio

Causa raíz: en varios JSX, dos `{t("…")}` o `<br/>` adyacentes se renderizan sin espacio. Auditar y corregir:

- `index.tsx`: "Comparta su necesidad, le respondemos hoy." (añadir espacio entre fragmentos).
- `index.tsx`: "Equipos certificados. Trazables. Garantizados." y "DC-3 y certificado oficial STPS · OSHA · NSC."
- `capacitacion.tsx`: "Cursos disponibles."
- `industrias.tsx`: H1 → "Cada industria tiene un riesgo crítico. Nosotros lo hacemos auditable."
- `ingenieria.tsx`: H1 → "Sistemas de anclaje diseñados desde el riesgo real."
- `contratistas.tsx`: "Programa Nacional de Profesionalización a Contratistas." y "Operación bajo control total."
- `contacto.tsx`: "Cuéntenos su proyecto. Respondemos hoy." (o variante fuerte "Comparta su riesgo. Lo convertimos en un plan técnico.").

QA: buscar regex `[a-záéíóúñ][A-ZÁÉÍÓÚÑ]` y comas/puntos sin espacio en strings de rutas.

## 2. Páginas individuales de servicios (eliminar 404)

Crear ruta dinámica `src/routes/servicios.$servicio.tsx` + data en `src/data/kaee.ts` (`SERVICE_DETAILS`), con slugs:

```text
consultoria, asesoria, soluciones-personalizadas, supervision,
certificacion, instalacion, renta, analisis-de-riesgo,
plan-de-rescate, inspeccion-certificacion-anual
```

Cada página: H1, problema que resuelve, qué incluye, entregables, normas relacionadas, cuándo contratarlo, CTA "Solicitar diagnóstico". Linkear desde `/servicios` y `/ingenieria` donde aplique. `head()` propio (title, description, canonical, og:*).

## 3. Contenido único por curso

Enriquecer `COURSE_DETAILS` en `src/data/kaee.ts` con campos: riesgos específicos, temario por nivel (Autorizado / Monitor / Competente / Profesional), duración, perfil, práctica, entregables, normas, aplicaciones industriales. Actualizar `capacitacion.$curso.tsx` para renderizar todos esos bloques (no solo los 3 actuales). Cubrir mínimo: alturas, confinados, herramientas, incendios, plataformas, primeros-auxilios, izaje, rescate, bloqueo-etiquetado, electricidad.

## 4. Contenido único por categoría de equipos

Enriquecer `EQUIPMENT_DETAILS` en `kaee.ts` con: subcategorías/tipos, aplicaciones, criterios de selección, materiales/sistemas, marcas, normas, entregables documentales, CTA específico. Actualizar `equipos.$categoria.tsx` para 10 categorías (epp, anclajes, lineas-de-vida, barandales, domos, andamios, plataformas, pasos, escalas, conexión).

Ejemplo líneas de vida: horizontales/verticales/temporales/Over Head/Roof Top/Man Safe/inclinadas/pared; cable/riel/cinta; criterios usuarios, superficie, frecuencia, ruta, rescate, certificación, inspección anual.

## 5. Alinear `/servicios` con la home (5 divisiones)

Reemplazar "Cuatro pilares. Una sola responsabilidad…" por:

```text
H1: Un sistema completo contra el riesgo.
Sub: Cinco frentes operativos. Un solo estándar de seguridad.
```

Listar W@H, MS&S, WoLL, S@H y SoNs como divisiones (no como 4 pilares). Mantener el grid existente con un quinto bloque (P.N.P.C. queda dentro de SoNs / referenciado aparte).

## 6. Expandir FAQ

Reescribir `faq.tsx` con preguntas reales agrupadas:

- Documentos y auditoría (DC-3, ficha técnica, certificados, bitácoras).
- Capacitación (en planta, niveles, validez, instructores).
- Inspección y mantenimiento de líneas de vida (anual, otras marcas).
- Normas aplicables (NOM-009, NOM-033, ANSI Z359, OSHA).
- Plan de rescate, auditorías urgentes, cotización, tiempos.

Mínimo 18 preguntas. Añadir JSON-LD `FAQPage`.

## 7. Clientes nuevos

Agregar a `CLIENTS_FULL` en `kaee.ts`: Pirelli, General Motors, Pfizer, Cargill, Johnson & Johnson, Conoco Phillips, Vestas, PepsiCo. Reflejados en home (ClientLogosBand) e `industrias.tsx`.

## 8. Pulir CTA / copy clave de home y cumplimiento

- Home CTA final → "Comparta su riesgo. Le respondemos con un plan técnico." + subcopy técnico (planta, tipo de trabajo, usuarios, fecha crítica).
- `cumplimiento.tsx` H1 → "La evidencia que su auditor pide, emitida por un equipo técnico."

## Fuera de alcance

- `/portal` de clientes (se difiere; auditoría lo marca como no bloqueante).
- Cambios de dirección creativa / paleta / tipografía.

## Detalle técnico

- Rutas TanStack file-based: nueva `servicios.$servicio.tsx` y, si se requiere, splits dentro de `equipos.$categoria.tsx` siguen siendo dinámicas (no nuevos archivos por slug).
- `kaee.ts` crecerá con `SERVICE_DETAILS`, ampliación de `COURSE_DETAILS` y `EQUIPMENT_DETAILS` (estructuras tipadas, helpers `serviceDetail(slug)`).
- `head()` en cada ruta nueva con `title`, `description`, canonical absoluto (`https://kgsafety.lovable.app/...`), `og:title`, `og:description`, `og:url`.
- FAQ: añadir `scripts: [{ type: "application/ld+json", children: JSON.stringify({@type: "FAQPage", mainEntity: [...] }) }]`.
- Microcopy fix: revisar JSX que une fragmentos `{t("…")}{t("…")}` o `<br/>` sin espacio; introducir espacio explícito o consolidar strings.
- Sin cambios de schema, sin nuevos paquetes.

## Orden de ejecución

1. Fix microcopy (rápido, alto impacto).
2. `kaee.ts`: ampliar datos (services, courses, equipment, clientes).
3. Crear `servicios.$servicio.tsx` + enlaces.
4. Actualizar `capacitacion.$curso.tsx` y `equipos.$categoria.tsx` para renderizar datos enriquecidos.
5. Reescribir `/servicios` (5 frentes).
6. Reescribir `/faq` + JSON-LD.
7. Pulir CTAs (home, cumplimiento, contacto).
