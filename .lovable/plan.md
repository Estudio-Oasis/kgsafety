
# Plan completo KG Safety — 4 sprints

Trabajo grande. Lo divido en 4 entregas dentro de este mismo plan. Cada sprint deja el sitio funcionando y desplegable; tú decides si seguimos al siguiente o pausamos.

## Sprint 1 — Base comercial y confianza

**Objetivo:** que el sitio deje de verse incompleto.

1. **Auditoría y corrección de copy** en todas las rutas (`index`, `capacitacion`, `equipos`, `ingenieria`, `soluciones`, `contratistas`, `facturacion`, `contacto`, `blog`, `faq`, `nosotros`, header/footer, `dictionary.ts`).
   - Reparar frases pegadas tipo *"Comparta su necesidadrespondemos hoy"*, *"DC-3 y certificadooficial"*.
   - Acentos faltantes, mayúsculas/minúsculas inconsistentes.
   - Mantener `WE NEVER FALL` solo como slogan visual, no como estructura.

2. **Hero home nuevo** (`src/routes/index.tsx`):
   - H1: *Seguridad en altura lista para auditoría.*
   - Sub: *Ingeniería, capacitación DC-3, sistemas certificados y evidencia documental para operaciones industriales de alto estándar.*
   - CTAs: *Solicitar diagnóstico* / *Ver soluciones*.
   - Conservar look industrial premium (Michroma + paleta navy/signal).

3. **Bloque diferenciador** (componente nuevo `DifferentiatorBlock`), insertado en home después de la barra de métricas:
   - *"No somos solo capacitadores. No somos solo distribuidores de EPP. No somos solo instaladores de líneas de vida."*
   - Texto integrador (diagnóstico → ingeniería → instalación → certificación → capacitación → documentación).
   - Reemplaza la sección *"Cuatro frentes contra la gravedad"* por *"Un sistema completo contra el riesgo"* con las 5 divisiones: **W@H, MS&S, WoLL, S@H, SoNs**.

4. **Navegación reestructurada** (`SiteHeader.tsx` + footer):
   - Desktop: Inicio · Servicios · Capacitación · Ingeniería · Equipos · P.N.P.C. · Industrias · Nosotros · Facturación · Contacto.
   - Mobile: agrupar bajo *Soluciones* (Servicios + Industrias + Ingeniería + Equipos).
   - Rótulo `P.N.P.C.` apunta a `/contratistas` (Programa Nacional de Profesionalización a Contratistas) con subtítulo aclaratorio en la página.

5. **Facturación con enlaces reales** (`src/routes/facturacion.tsx`):
   - 3 acciones: *Obtener factura* → `kg-safety.com/facturar/proceso`, *Ingresar a administración* → `admin-factura-cliente.noilmx.com`, *Contactar facturación* → `mailto:vianey-contadora@kg-safety.com`.
   - Tel `+52 1 722 799 0719` y WhatsApp `527222532753` visibles.

6. **Banda de clientes/logos** como grilla sobria de nombres en texto (Michroma, sin fondos): FEMSA, Coca-Cola, Holcim, Unilever, ALPLA, Canacintra, Envases, APM Terminals, Gamesa, PetStar, Sigma Alimentos, Tupperware, Owens-Illinois, Merck, Santa Clara. Va en home y `/nosotros`. Título: *Experiencia con operaciones industriales de alto estándar.*

## Sprint 2 — Arquitectura principal

**Crear rutas:**

- `src/routes/servicios.tsx` — índice con 8 servicios (Entrenamiento, Consultoría, Asesoría, Soluciones personalizadas, Supervisión, Certificación, Instalación, Renta). H1: *Servicios especializados para controlar trabajos de alto riesgo de principio a fin.* Cada tarjeta: descripción breve + entregables + CTA *Solicitar diagnóstico*.
- `src/routes/industrias.tsx` — 10 industrias con riesgos típicos por sector.
- `src/routes/cumplimiento.tsx` — H1: *Certeza jurídica para trabajos de alto riesgo.* Secciones: NOM-009-STPS-2011, STPS/DC-3, OSHA/ANSI Z359/EN, análisis de riesgo, plan de rescate, permisos de trabajo, evidencia documental, auditorías internas, inspección anual. Cross-link a `/contratistas` (P.N.P.C.).

**Rehacer:**

- `src/routes/nosotros.tsx` — H1: *De KAEE a KG Safety: conocimiento, análisis, ingeniería y eliminación de riesgos.* Secciones: historia, metodología K.A.E.E. (Knowledge / Analysis / Engineering / Elimination), 5 divisiones (W@H, MS&S, WoLL, S@H, SoNs), clientes y normas.
- `src/routes/faq.tsx` — 12 preguntas reales del documento (DC-3, inspección de líneas de vida, instalación de otras marcas, multisede, auditorías urgentes, plan de rescate, etc.).

**Bloque reutilizable** `AuditableDeliverables.tsx` con los 12 entregables ("Entregables que sí puede defender ante una auditoría"), insertado en home, `/servicios` e `/ingenieria`.

## Sprint 3 — Páginas profundas

**Servicios individuales** — ruta dinámica `src/routes/servicios.$servicio.tsx` + datos en `src/data/kaee.ts` (`SERVICES_DETAIL`). Slugs: `consultoria, asesoria, soluciones-personalizadas, supervision, certificacion, instalacion, renta, analisis-de-riesgo, plan-de-rescate, inspeccion-certificacion-anual`. Plantilla: problema → qué resuelve → qué incluye → entregables → normas → cuándo contratarlo → CTA.

**Capacitación** — completar `src/routes/capacitacion.$curso.tsx` para los 10 cursos: `alturas, confinados, andamios, loto, electricidad, calor, herramientas, incendios, montacargas, plataformas`. Cada uno con niveles (Autorizado/Monitor/Competente/Profesional), duraciones, qué aprende, dirigido a, incluye (manual, DC-3, certificado), CTA *Inscribir grupo*. Ya existe estructura — completar contenido específico por curso en `COURSES`.

**Equipos** — convertir `src/routes/equipos.$categoria.tsx` en páginas únicas por categoría: `epp, conexion, anclajes, lineas-de-vida, barandales, domos, andamios, plataformas, pasos, escalas`. Plantilla: descripción técnica → subcategorías → aplicaciones → normas → criterios de selección → ficha técnica/trazabilidad → CTA *Cotizar equipos certificados*.

**Reforzar `/ingenieria` y `/contratistas`** con bloque de entregables auditables y CTAs específicos.

## Sprint 4 — Conversión, SEO y pulido

1. **SEO** en `head()` de cada ruta:
   - Home: *KG Safety · Seguridad en altura lista para auditoría*
   - Capacitación: *Capacitación DC-3 para trabajos en altura y alto riesgo · KG Safety*
   - Ingeniería, Equipos, Cumplimiento, Facturación según documento.
   - Meta descriptions con keywords: NOM-009-STPS, DC-3, líneas de vida, EPP certificado, auditoría STPS.

2. **CTAs globales** — barrido para reemplazar genéricos (*Saber más, Ver más, Enviar, Leer más*) por accionables (*Solicitar diagnóstico, Agendar visita técnica, Cotizar capacitación, Cotizar equipos, Preparar auditoría, Hablar con un especialista, Solicitar inspección anual, Inscribir grupo*).

3. **Validación mobile** — viewport 375–414px en todas las páginas nuevas, navegación colapsada, banda de logos scrollable.

4. **Validación de links** — verificar que no quedan `to="/blog"` o rutas eliminadas; cross-links coherentes.

5. **Consistencia visual** — todas las páginas nuevas heredan tokens bento (`--bento-radius`, `--bento-shadow`, `--bento-bg-*`) y tipografía Michroma/Archivo Black/Plus Jakarta Sans ya cargada.

---

## Detalles técnicos

- **Rutas nuevas creadas** (Sprints 2-3): `servicios.tsx`, `servicios.$servicio.tsx`, `industrias.tsx`, `cumplimiento.tsx`. No tocar `routeTree.gen.ts` — lo regenera el plugin de Vite.
- **Datos** en `src/data/kaee.ts`: extender con `SERVICES`, `SERVICES_DETAIL`, `INDUSTRIES`, `COMPLIANCE_TOPICS`, `AUDIT_DELIVERABLES`, `CLIENT_LOGOS`. Actualizar `COURSES` y `EQUIPMENT_CATEGORIES` con contenido completo por slug.
- **Componentes nuevos**: `DifferentiatorBlock`, `AuditableDeliverables`, `ClientLogosBand`, `DivisionsBlock` (W@H/MS&S/WoLL/S@H/SoNs) — todos en `src/components/site/`.
- **i18n**: `dictionary.ts` recibe nuevas claves para nav, CTAs globales y headings. Mantengo ES como default y replico EN.
- **Sin nuevas dependencias** ni cambios en backend, server functions o auth.
- **Header mobile**: agrupador *Soluciones* implementado con el componente `NavigationMenu` (shadcn) ya disponible.

## Lo que NO toco

- Sistema bento existente, paleta y tipografía cargadas.
- WhatsApp float, mini-juego de rappel, scroll rappellers, world clock bar.
- Theme dark/light, i18n context, router bootstrap, `src/server.ts`.
- Imágenes reales en `src/assets/real/` (las reutilizo donde aplique).

## Modo de entrega

Voy sprint por sprint. Al terminar cada uno te resumo qué cambió y espero luz verde antes de seguir, para que puedas validar contenido (especialmente fichas de cursos/servicios/equipos donde el texto técnico debe ser correcto).
