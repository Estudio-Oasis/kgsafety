-- 1. Bitácora automática
CREATE OR REPLACE FUNCTION public.audit_row_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org uuid;
  v_id text;
  v_old jsonb;
  v_new jsonb;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_old := to_jsonb(OLD);
    v_org := NULLIF(v_old ->> 'organization_id', '')::uuid;
    v_id := v_old ->> 'id';
  ELSE
    v_new := to_jsonb(NEW);
    v_org := NULLIF(v_new ->> 'organization_id', '')::uuid;
    v_id := v_new ->> 'id';
    IF TG_OP = 'UPDATE' THEN
      v_old := to_jsonb(OLD);
    END IF;
  END IF;

  INSERT INTO public.audit_log (organization_id, table_name, record_id, action, actor_id, old_data, new_data)
  VALUES (v_org, TG_TABLE_NAME, v_id, TG_OP, auth.uid(), v_old, v_new);

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'clients','quote_requests','quotes','quote_lines','service_orders','course_sessions',
    'participants','enrollments','assessments','dc3_certificates','per_diems','instructors',
    'courses','suppliers','contractors','invoices','client_fiscal_profiles'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I', 'audit_' || t, t);
    EXECUTE format(
      'CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.audit_row_change()',
      'audit_' || t, t
    );
  END LOOP;
END;
$$;

-- 2. Reporte de excepciones históricas (solo equipo KG)
CREATE OR REPLACE FUNCTION public.erp_exception_report()
RETURNS TABLE (
  categoria text,
  severidad text,
  entidad text,
  registro_id text,
  folio text,
  detalle text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_kg_staff(auth.uid()) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  RETURN QUERY
  -- Folios de cotización duplicados
  SELECT 'folio_duplicado', 'alta', 'quotes', min(q.id)::text, q.code,
         'El folio de cotización se repite ' || count(*) || ' veces'
  FROM public.quotes q
  WHERE q.code IS NOT NULL AND q.code <> ''
  GROUP BY q.code
  HAVING count(*) > 1

  UNION ALL
  -- Solicitudes sin cliente
  SELECT 'solicitud_sin_cliente', 'alta', 'quote_requests', r.id::text, r.code,
         'La solicitud no está ligada a ningún cliente'
  FROM public.quote_requests r
  WHERE r.client_id IS NULL

  UNION ALL
  -- Cotizaciones sin partidas
  SELECT 'cotizacion_sin_partidas', 'alta', 'quotes', q.id::text, q.code,
         'La cotización no tiene partidas registradas'
  FROM public.quotes q
  WHERE NOT EXISTS (SELECT 1 FROM public.quote_lines l WHERE l.quote_id = q.id)

  UNION ALL
  -- Cotizaciones sin solicitud de origen
  SELECT 'cotizacion_sin_solicitud', 'media', 'quotes', q.id::text, q.code,
         'La cotización no tiene solicitud de origen'
  FROM public.quotes q
  WHERE q.request_id IS NULL

  UNION ALL
  -- Cotizaciones en cero
  SELECT 'cotizacion_en_cero', 'media', 'quotes', q.id::text, q.code,
         'El total de la cotización es cero o negativo'
  FROM public.quotes q
  WHERE COALESCE(q.total, 0) <= 0

  UNION ALL
  -- Partidas con cantidad o precio inválido
  SELECT 'partida_invalida', 'media', 'quote_lines', l.id::text, q.code,
         'Partida con cantidad ' || COALESCE(l.quantity, 0) || ' y precio unitario ' || COALESCE(l.unit_price, 0)
  FROM public.quote_lines l
  LEFT JOIN public.quotes q ON q.id = l.quote_id
  WHERE COALESCE(l.quantity, 0) <= 0 OR COALESCE(l.unit_price, 0) < 0

  UNION ALL
  -- Clientes sin RFC
  SELECT 'cliente_sin_rfc', 'media', 'clients', c.id::text, c.code,
         'El cliente ' || c.commercial_name || ' no tiene RFC registrado'
  FROM public.clients c
  WHERE c.tax_id IS NULL OR btrim(c.tax_id) = ''

  UNION ALL
  -- Clientes sin correo ni teléfono
  SELECT 'cliente_sin_contacto', 'baja', 'clients', c.id::text, c.code,
         'El cliente ' || c.commercial_name || ' no tiene correo ni teléfono'
  FROM public.clients c
  WHERE (c.email IS NULL OR btrim(c.email) = '') AND (c.phone IS NULL OR btrim(c.phone) = '')

  UNION ALL
  -- Participantes duplicados por CURP
  SELECT 'participante_duplicado', 'alta', 'participants', min(p.id)::text, p.curp,
         'La CURP aparece en ' || count(*) || ' registros de participante'
  FROM public.participants p
  WHERE p.curp IS NOT NULL AND btrim(p.curp) <> ''
  GROUP BY p.curp
  HAVING count(*) > 1

  UNION ALL
  -- Participantes sin CURP
  SELECT 'participante_sin_curp', 'media', 'participants', p.id::text, NULL,
         'El participante ' || p.given_names || ' ' || COALESCE(p.paternal_surname, '') || ' no tiene CURP (requerida para DC-3)'
  FROM public.participants p
  WHERE p.curp IS NULL OR btrim(p.curp) = ''

  UNION ALL
  -- Sesiones sin instructor
  SELECT 'sesion_sin_instructor', 'media', 'course_sessions', s.id::text, s.course_number,
         'La sesión del ' || s.session_date || ' no tiene instructor asignado'
  FROM public.course_sessions s
  WHERE s.instructor_id IS NULL

  UNION ALL
  -- Sesiones sin curso del catálogo
  SELECT 'sesion_sin_curso', 'media', 'course_sessions', s.id::text, s.course_number,
         'La sesión del ' || s.session_date || ' no está ligada a un curso del catálogo'
  FROM public.course_sessions s
  WHERE s.course_id IS NULL

  UNION ALL
  -- Inscripciones sin evaluación
  SELECT 'inscripcion_sin_evaluacion', 'media', 'enrollments', e.id::text, NULL,
         'La inscripción no tiene registro de asistencia ni evaluación'
  FROM public.enrollments e
  WHERE NOT EXISTS (SELECT 1 FROM public.assessments a WHERE a.enrollment_id = e.id)

  UNION ALL
  -- DC-3 pendientes de generar
  SELECT 'dc3_pendiente', 'alta', 'dc3_certificates', d.id::text, d.folio,
         'La constancia DC-3 existe en el registro pero no está generada'
  FROM public.dc3_certificates d
  WHERE d.generated IS NOT TRUE

  UNION ALL
  -- Órdenes de servicio sin cotización de origen
  SELECT 'orden_sin_cotizacion', 'media', 'service_orders', o.id::text, o.code,
         'La orden de servicio no está ligada a una cotización'
  FROM public.service_orders o
  WHERE o.quote_id IS NULL

  UNION ALL
  -- Viáticos sin instructor
  SELECT 'viatico_sin_instructor', 'baja', 'per_diems', v.id::text, NULL,
         'El viático no tiene instructor asignado'
  FROM public.per_diems v
  WHERE v.instructor_id IS NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.erp_exception_report() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.erp_exception_report() TO authenticated;
GRANT EXECUTE ON FUNCTION public.erp_exception_report() TO service_role;