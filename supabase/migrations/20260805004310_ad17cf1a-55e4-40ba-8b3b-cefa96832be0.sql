CREATE TEMP TABLE p_ord AS
SELECT pl.slug, pl.name, pl.responsable, (t.ord - 1)::int AS i
FROM unnest(ARRAY['holcim-queretaro','merck-toluca','femsa-toluca','femsa-apizaco','petstar-toluca','pirelli-silao','pfizer-toluca','cargill-atitalaquia','unilever-tultitlan','vestas-norte','gm-silao','jnj-juarez','pepsico-mexicali','conoco-altamira']) WITH ORDINALITY AS t(slug, ord)
JOIN public.plants pl ON pl.slug = t.slug;

INSERT INTO public.projects (id, name, type, company_slug, plant_slug, fecha, responsable, status, descripcion)
SELECT
  'prj-' || p.slug || '-' || (k + 1),
  ty || ' — ' || p.name,
  ty,
  pl.company_slug,
  p.slug,
  make_date(2024 + ((p.i + k) % 2), 1 + ((p.i * 3 + k * 5) % 12), 5 + ((p.i + k * 7) % 22)),
  (ARRAY['Ing. Karim Gómez','Ing. Alejandro Rivera','Ing. Mónica Trejo','Ing. Pablo Estrada','Ing. Diana Vega'])[((p.i + k) % 5) + 1],
  (ARRAY['completado','completado','completado','en-curso','pendiente','revision'])[((p.i + k) % 6) + 1],
  'Intervención técnica KG Safety: ' || lower(ty) || ' aplicada al sistema de seguridad en altura de ' || p.name || '. Incluye diagnóstico, ejecución y entrega documental.'
FROM p_ord p
JOIN public.plants pl ON pl.slug = p.slug,
  generate_series(0, 3) AS k,
  LATERAL (SELECT (ARRAY['Línea de vida','Certificación','Capacitación','Supervisión','Instalación','Inspección','Consultoría','Análisis de riesgo','Plan de rescate','Asesoría'])[((p.i + k) % 10) + 1] AS ty) tt
WHERE k < 2 + (p.i % 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.workers (id, nombre, puesto, plant_slug, curso, dc3, emision, vencimiento, instructor)
SELECT
  'wrk-' || p.slug || '-' || (k + 1),
  (ARRAY['Juan Pérez Ramírez','María López Sandoval','Carlos Hernández Ruiz','Ana Martínez Vega','Luis Torres Mendoza','Sofía Ramírez Ortega','Miguel Ángel Cruz','Laura Domínguez','Roberto Salinas Vera','Patricia Rojas Núñez','Fernando Aguilar','Gabriela Islas','Héctor Villanueva','Andrea Chávez','Ricardo Molina','Verónica Guzmán','Jorge Palacios','Diana Fuentes','Alejandro Ríos','Karen Meza'])[(((p.i * 5) + k) % 20) + 1],
  (ARRAY['Técnico mantenimiento','Supervisor HSE','Trabajador de altura','Jefe de planta','Coordinador seguridad','Operador'])[((p.i + k) % 6) + 1],
  p.slug,
  (ARRAY['Trabajo seguro en alturas — Autorizado','Trabajo seguro en alturas — Supervisor','Rescate técnico en altura','Inspector de EPP','Espacios confinados'])[((p.i + k) % 5) + 1],
  'DC3-' || (2024 + ((p.i + k) % 2)) || '-' || lpad((1000 + p.i * 10 + k)::text, 5, '0'),
  CURRENT_DATE + ((ARRAY[-30,40,120,400])[((p.i + k) % 4) + 1] - 730),
  CURRENT_DATE + (ARRAY[-30,40,120,400])[((p.i + k) % 4) + 1],
  (ARRAY['Ing. Karim Gómez','Ing. Alejandro Rivera','Ing. Mónica Trejo','Ing. Pablo Estrada','Ing. Diana Vega'])[((p.i + k) % 5) + 1]
FROM p_ord p, generate_series(0, 5) AS k
WHERE k < 3 + (p.i % 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.library_docs (id, category, name, fecha, size_label)
SELECT 'lib-' || c.i || '-' || k, c.cat, c.cat || ' · documento ' || (k + 1),
  make_date(2025, 1 + ((c.i + k) % 12), 15),
  (200 + (((c.i + k) * 91) % 4000)) || ' KB'
FROM (
  SELECT t.cat, (t.ord - 1)::int AS i
  FROM unnest(ARRAY['Presentaciones comerciales','Fichas técnicas','Formatos de inspección','Formatos de capacitación','Reportes modelo','Manuales de marca','Certificaciones de marcas','Normas','Procedimientos','Material de entrenamiento']) WITH ORDINALITY AS t(cat, ord)
) c, generate_series(0, 4) AS k
WHERE k < 3 + (c.i % 3)
ON CONFLICT (id) DO NOTHING;

DELETE FROM public.documents;

INSERT INTO public.documents (id, type, name, project_id, plant_slug, fecha, size_label)
SELECT
  'doc-' || pr.id || '-' || d.dt,
  d.dt,
  d.label || ' — ' || pr.name,
  pr.id,
  pr.plant_slug,
  pr.fecha,
  (100 + (((pr.n + d.k) * 37) % 1800)) || ' KB'
FROM (
  SELECT prj.*, (row_number() OVER (ORDER BY p.i, prj.id) - 1)::int AS n
  FROM public.projects prj JOIN p_ord p ON p.slug = prj.plant_slug
) pr
JOIN LATERAL (
  SELECT t.dt, l.label, (t.ord - 1)::int AS k
  FROM unnest(ARRAY['factura','cotizacion','orden-compra','certificado','ficha-tecnica','reporte','evidencia','acta','bitacora']) WITH ORDINALITY AS t(dt, ord)
  JOIN LATERAL (SELECT (ARRAY['Factura','Cotización','Orden de compra','Certificado','Ficha técnica','Reporte técnico','Evidencia fotográfica','Acta de entrega','Bitácora de inspección'])[t.ord] AS label) l ON TRUE
) d ON d.k < 4 + (pr.n % 5);

DROP TABLE p_ord;