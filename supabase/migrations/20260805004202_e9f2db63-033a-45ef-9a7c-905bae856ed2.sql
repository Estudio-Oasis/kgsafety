-- Restringir funciones internas a usuarios autenticados
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_kg_staff(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.current_company(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_read_company(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_read_plant(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_kg_staff(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_company(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_read_company(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_read_plant(text) TO authenticated;

INSERT INTO public.companies (slug, name, industry) VALUES
('femsa','Coca-Cola FEMSA','Bebidas'),
('holcim','Holcim','Cemento'),
('unilever','Unilever','Consumo'),
('merck','Merck','Farmacéutica'),
('petstar','PetStar','Reciclaje PET'),
('santa-clara','Santa Clara','Lácteos'),
('bimbo','Grupo Bimbo','Alimentos'),
('nestle','Nestlé','Alimentos'),
('cemex','Cemex','Cemento'),
('heineken','Heineken','Bebidas'),
('grupo-modelo','Grupo Modelo','Bebidas'),
('pemex','Pemex','Energía / Infraestructura'),
('volkswagen','Volkswagen','Automotriz'),
('ford','Ford','Automotriz'),
('nissan','Nissan','Automotriz'),
('bayer','Bayer','Farmacéutica'),
('danone','Danone','Lácteos'),
('pyg','Procter & Gamble','Consumo'),
('loreal','L''Oréal','Cuidado personal'),
('kimberly','Kimberly-Clark','Consumo'),
('arca','Arca Continental','Bebidas'),
('pirelli','Pirelli','Llantas'),
('gm','General Motors','Automotriz'),
('pfizer','Pfizer','Farmacéutica'),
('cargill','Cargill','Agroindustria'),
('jnj','Johnson & Johnson','Cuidado personal'),
('conoco','Conoco Phillips','Energía / Infraestructura'),
('vestas','Vestas','Energía eólica'),
('pepsico','PepsiCo','Alimentos y bebidas');

INSERT INTO public.plants (slug, company_slug, name, location, industry, responsable, email) VALUES
('holcim-queretaro','holcim','Holcim Querétaro','Querétaro, Qro.','Cemento','Ing. Marco Salazar','msalazar@holcim.com'),
('merck-toluca','merck','Merck Toluca','Toluca, Edo. Méx.','Farmacéutica','Ing. Lucía Hernández','lhernandez@merck.com'),
('femsa-toluca','femsa','Coca-Cola FEMSA Toluca','Toluca, Edo. Méx.','Bebidas','Ing. Roberto Cárdenas','rcardenas@kof.com'),
('femsa-apizaco','femsa','Coca-Cola FEMSA Apizaco','Apizaco, Tlax.','Bebidas','Ing. Sandra Morales','smorales@kof.com'),
('petstar-toluca','petstar','PetStar Toluca','Toluca, Edo. Méx.','Reciclaje','Ing. Eduardo Ramos','eramos@petstar.mx'),
('pirelli-silao','pirelli','Pirelli Silao','Silao, Gto.','Llantas','Ing. Carla Vázquez','cvazquez@pirelli.com'),
('pfizer-toluca','pfizer','Pfizer Toluca','Toluca, Edo. Méx.','Farmacéutica','Ing. Jorge Domínguez','jdominguez@pfizer.com'),
('cargill-atitalaquia','cargill','Cargill Atitalaquia','Atitalaquia, Hgo.','Agroindustria','Ing. Patricia Núñez','pnunez@cargill.com'),
('unilever-tultitlan','unilever','Unilever Tultitlán','Tultitlán, Edo. Méx.','Consumo','Ing. Mario Reyes','mreyes@unilever.com'),
('vestas-norte','vestas','Vestas Parque Norte','Reynosa, Tamps.','Eólica','Ing. Hugo Pérez','hperez@vestas.com'),
('gm-silao','gm','General Motors Silao','Silao, Gto.','Automotriz','Ing. Verónica Luna','vluna@gm.com'),
('jnj-juarez','jnj','Johnson & Johnson Juárez','Cd. Juárez, Chih.','Cuidado personal','Ing. Alfredo Mejía','amejia@jnj.com'),
('pepsico-mexicali','pepsico','PepsiCo Mexicali','Mexicali, B.C.','Alimentos','Ing. Andrés Téllez','atellez@pepsico.com'),
('conoco-altamira','conoco','Conoco Phillips Altamira','Altamira, Tamps.','Energía / Infraestructura','Ing. Fernanda Ruiz','fruiz@conocophillips.com');

-- Orden determinista de plantas (i = índice base 0)
CREATE TEMP TABLE p_ord AS
SELECT pl.slug, pl.name, pl.responsable, (t.ord - 1)::int AS i
FROM unnest(ARRAY['holcim-queretaro','merck-toluca','femsa-toluca','femsa-apizaco','petstar-toluca','pirelli-silao','pfizer-toluca','cargill-atitalaquia','unilever-tultitlan','vestas-norte','gm-silao','jnj-juarez','pepsico-mexicali','conoco-altamira']) WITH ORDINALITY AS t(slug, ord)
JOIN public.plants pl ON pl.slug = t.slug;

-- SISTEMAS
INSERT INTO public.systems (id, plant_slug, type, ubicacion, metros, norma)
SELECT
  'sys-' || p.slug || '-' || (k + 1),
  p.slug,
  (ARRAY['Línea de vida horizontal flexible','Línea de vida vertical rígida','Puntos de anclaje certificados','Barandales autoportantes','Escala marina con riel','Plataforma de mantenimiento'])[((p.i + k) % 6) + 1],
  (ARRAY['Nave A','Nave B','Techumbre','Silos','Patio de tanques'])[((p.i + k) % 5) + 1],
  30 + (((p.i + k) * 12) % 180),
  (ARRAY['NOM-009-STPS','ANSI Z359.1','OSHA 1910.140','EN-795'])[((p.i + k) % 4) + 1]
FROM p_ord p, generate_series(0, 2) AS k
WHERE k < 1 + (p.i % 3);

-- PROYECTOS
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
  generate_series(0, 2) AS k,
  LATERAL (SELECT (ARRAY['Línea de vida','Certificación','Capacitación','Supervisión','Instalación','Inspección','Consultoría','Análisis de riesgo','Plan de rescate','Asesoría'])[((p.i + k) % 10) + 1] AS ty) tt
WHERE k < 2 + (p.i % 3);

-- CERTIFICACIONES (25% vencida, 25% <30d, 25% <60d, 25% vigente)
INSERT INTO public.certifications (id, system_id, plant_slug, ultima, vencimiento)
SELECT 'cert-' || s.id, s.id, s.plant_slug,
  CURRENT_DATE + ((ARRAY[-40,15,45,180])[(s.n % 4) + 1] - 365),
  CURRENT_DATE + (ARRAY[-40,15,45,180])[(s.n % 4) + 1]
FROM (
  SELECT sy.id, sy.plant_slug, (row_number() OVER (ORDER BY p.i, sy.id) - 1)::int AS n
  FROM public.systems sy JOIN p_ord p ON p.slug = sy.plant_slug
) s;

-- DOCUMENTOS
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

-- PERSONAL / DC-3
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
FROM p_ord p, generate_series(0, 3) AS k
WHERE k < 3 + (p.i % 4);

-- BIBLIOTECA INTERNA
INSERT INTO public.library_docs (id, category, name, fecha, size_label)
SELECT 'lib-' || c.i || '-' || k, c.cat, c.cat || ' · documento ' || (k + 1),
  make_date(2025, 1 + ((c.i + k) % 12), 15),
  (200 + (((c.i + k) * 91) % 4000)) || ' KB'
FROM (
  SELECT t.cat, (t.ord - 1)::int AS i
  FROM unnest(ARRAY['Presentaciones comerciales','Fichas técnicas','Formatos de inspección','Formatos de capacitación','Reportes modelo','Manuales de marca','Certificaciones de marcas','Normas','Procedimientos','Material de entrenamiento']) WITH ORDINALITY AS t(cat, ord)
) c, generate_series(0, 2) AS k
WHERE k < 3 + (c.i % 3);

-- SOLICITUDES DE SERVICIO
INSERT INTO public.service_requests (id, fecha, plant_slug, tipo, descripcion, status, solicitante)
SELECT 'req-' || p.slug || '-' || k,
  CURRENT_DATE - (p.i * 7 + k * 3),
  p.slug,
  (ARRAY['Inspección','Recertificación','Instalación nueva','Capacitación','Rescate técnico'])[((p.i + k) % 5) + 1],
  'Solicitud generada por el equipo HSE de ' || p.name || '.',
  (ARRAY['recibida','en-revision','cotizada','programada','cerrada'])[((p.i + k) % 5) + 1],
  p.responsable
FROM p_ord p, generate_series(1, 2) AS k
WHERE p.i < 10;

DROP TABLE p_ord;