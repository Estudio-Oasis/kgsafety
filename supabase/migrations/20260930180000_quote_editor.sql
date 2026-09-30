-- =====================================================================
-- Cotizador independiente (Fase 2 de 3): editor de cotizaciones.
--
-- RPCs qe_* para que el equipo de KG trabaje una cotización propia:
--   - qe_create_quote_from_request : convierte una solicitud en cotización.
--   - qe_add_line / qe_update_line / qe_delete_line : partidas de la cotización.
--   - qe_set_quote_status : cambia el estatus de la cotización.
--   - _recompute_quote_totals : recalcula subtotal/IVA/total desde las partidas.
--
-- Seguridad: solo personal de KG (is_kg_staff) o el servidor de confianza
-- (service_role, sin JWT de usuario). Un usuario autenticado que NO sea staff
-- es rechazado. anon no tiene permiso de ejecución.
--
-- Cada cambio queda en public.audit_log.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Guarda de autorización compartida por los RPC del editor.
-- ---------------------------------------------------------------------
create or replace function public._qe_assert_staff()
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  -- auth.uid() null => llamada del servidor de confianza (service_role).
  -- auth.uid() presente => debe ser staff de KG.
  if auth.uid() is not null and not public.is_kg_staff(auth.uid()) then
    raise exception 'No autorizado' using errcode = '42501';
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- Recalcular totales de una cotización a partir de sus partidas.
-- Fuente única de verdad para subtotal, IVA y total.
-- ---------------------------------------------------------------------
create or replace function public._recompute_quote_totals(p_quote_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_subtotal numeric(14,2) := 0;
  v_tax      numeric(14,2) := 0;
  v_total    numeric(14,2) := 0;
begin
  -- Precio efectivo = precio con descuento si existe, si no, precio unitario.
  select
    coalesce(sum(round(l.quantity * coalesce(l.discounted_unit_price, l.unit_price), 2)), 0),
    coalesce(sum(round(l.quantity * coalesce(l.discounted_unit_price, l.unit_price) * l.tax_rate, 2)), 0)
  into v_subtotal, v_tax
  from public.quote_lines l
  where l.quote_id = p_quote_id;

  v_total := v_subtotal + v_tax;

  update public.quotes
     set subtotal = v_subtotal,
         tax_total = v_tax,
         total = v_total,
         updated_at = now()
   where id = p_quote_id;
end;
$$;

-- ---------------------------------------------------------------------
-- Recalcular los importes de una partida (subtotal/total de la línea).
-- ---------------------------------------------------------------------
create or replace function public._recompute_line_amounts(p_line_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.quote_lines l
     set subtotal = round(l.quantity * coalesce(l.discounted_unit_price, l.unit_price), 2),
         total    = round(l.quantity * coalesce(l.discounted_unit_price, l.unit_price), 2)
                  + round(l.quantity * coalesce(l.discounted_unit_price, l.unit_price) * l.tax_rate, 2),
         updated_at = now()
   where l.id = p_line_id;
end;
$$;

-- ---------------------------------------------------------------------
-- Auditoría interna sencilla.
-- ---------------------------------------------------------------------
create or replace function public._qe_audit(
  p_org uuid, p_table text, p_record text, p_action text, p_new jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (organization_id, table_name, record_id, action, actor_id, new_data)
  values (p_org, p_table, p_record, p_action, auth.uid(), p_new);
end;
$$;

-- ---------------------------------------------------------------------
-- Convertir una SOLICITUD en una COTIZACIÓN.
-- ---------------------------------------------------------------------
create or replace function public.qe_create_quote_from_request(p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_req  public.quote_requests%rowtype;
  v_quote_id uuid;
  v_code text;
  v_existing uuid;
begin
  perform public._qe_assert_staff();

  select * into v_req from public.quote_requests where id = p_request_id;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'Solicitud no encontrada');
  end if;

  -- Idempotencia suave: si ya hay una cotización para esta solicitud, la regresamos.
  select id into v_existing from public.quotes where request_id = p_request_id order by created_at asc limit 1;
  if found then
    select code into v_code from public.quotes where id = v_existing;
    return jsonb_build_object('ok', true, 'status', 'exists', 'quote_id', v_existing, 'code', v_code);
  end if;

  v_code := 'COT-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.quotes (
    organization_id, code, request_id, client_id, service_id,
    quote_date, valid_until, origin, delivery_type, travel_mode, location,
    currency, subtotal, tax_total, total, status, created_by
  ) values (
    v_req.organization_id, v_code, v_req.id, v_req.client_id, v_req.service_id,
    current_date, current_date + interval '15 days', 'web',
    v_req.delivery_type, v_req.travel_mode, v_req.location,
    'MXN', 0, 0, 0, 'Pendiente', auth.uid()
  )
  returning id into v_quote_id;

  -- Si la solicitud trae un curso, sembramos una partida inicial con su precio de catálogo.
  if v_req.course_id is not null then
    insert into public.quote_lines (
      organization_id, quote_id, course_id, quantity, unit_price, tax_rate, description
    )
    select
      v_req.organization_id, v_quote_id, c.id,
      coalesce(v_req.participant_count, 1),
      case when lower(coalesce(v_req.travel_mode, '')) like 'for%'  -- 'Foráneo'
             then coalesce(c.travel_unit_price, c.local_unit_price, 0)
           else coalesce(c.local_unit_price, c.travel_unit_price, 0) end,
      0.16,
      c.name
    from public.courses c
    where c.id = v_req.course_id;
  end if;

  -- Actualizar estatus de la solicitud y recalcular.
  update public.quote_requests set status = 'Cotizada', updated_at = now() where id = p_request_id;
  perform public._recompute_quote_totals(v_quote_id);

  perform public._qe_audit(v_req.organization_id, 'quotes', v_quote_id::text, 'INSERT',
    jsonb_build_object('code', v_code, 'from_request', p_request_id));

  return jsonb_build_object('ok', true, 'status', 'created', 'quote_id', v_quote_id, 'code', v_code);
end;
$$;

-- ---------------------------------------------------------------------
-- Agregar una partida.
-- ---------------------------------------------------------------------
create or replace function public.qe_add_line(
  p_quote_id uuid,
  p_description text,
  p_quantity numeric default 1,
  p_unit_price numeric default 0,
  p_tax_rate numeric default 0.16,
  p_course_id uuid default null,
  p_discounted_unit_price numeric default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_line_id uuid;
begin
  perform public._qe_assert_staff();

  select organization_id into v_org from public.quotes where id = p_quote_id;
  if v_org is null then
    return jsonb_build_object('ok', false, 'error', 'Cotización no encontrada');
  end if;

  insert into public.quote_lines (
    organization_id, quote_id, course_id, description,
    quantity, unit_price, discounted_unit_price, tax_rate
  ) values (
    v_org, p_quote_id, p_course_id, nullif(trim(coalesce(p_description, '')), ''),
    greatest(coalesce(p_quantity, 1), 0),
    greatest(coalesce(p_unit_price, 0), 0),
    case when p_discounted_unit_price is null then null else greatest(p_discounted_unit_price, 0) end,
    greatest(coalesce(p_tax_rate, 0.16), 0)
  )
  returning id into v_line_id;

  perform public._recompute_line_amounts(v_line_id);
  perform public._recompute_quote_totals(p_quote_id);
  perform public._qe_audit(v_org, 'quote_lines', v_line_id::text, 'INSERT',
    jsonb_build_object('quote_id', p_quote_id, 'description', p_description));

  return jsonb_build_object('ok', true, 'line_id', v_line_id);
end;
$$;

-- ---------------------------------------------------------------------
-- Actualizar una partida (solo los campos que llegan no nulos).
-- ---------------------------------------------------------------------
create or replace function public.qe_update_line(
  p_line_id uuid,
  p_description text default null,
  p_quantity numeric default null,
  p_unit_price numeric default null,
  p_tax_rate numeric default null,
  p_discounted_unit_price numeric default null,
  p_clear_discount boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_quote_id uuid;
begin
  perform public._qe_assert_staff();

  select organization_id, quote_id into v_org, v_quote_id
  from public.quote_lines where id = p_line_id;
  if v_quote_id is null then
    return jsonb_build_object('ok', false, 'error', 'Partida no encontrada');
  end if;

  update public.quote_lines
     set description = coalesce(nullif(trim(coalesce(p_description, '')), ''), description),
         quantity    = coalesce(greatest(p_quantity, 0), quantity),
         unit_price  = coalesce(greatest(p_unit_price, 0), unit_price),
         tax_rate    = coalesce(greatest(p_tax_rate, 0), tax_rate),
         discounted_unit_price = case
           when p_clear_discount then null
           when p_discounted_unit_price is not null then greatest(p_discounted_unit_price, 0)
           else discounted_unit_price end
   where id = p_line_id;

  perform public._recompute_line_amounts(p_line_id);
  perform public._recompute_quote_totals(v_quote_id);
  perform public._qe_audit(v_org, 'quote_lines', p_line_id::text, 'UPDATE',
    jsonb_build_object('quote_id', v_quote_id));

  return jsonb_build_object('ok', true, 'line_id', p_line_id);
end;
$$;

-- ---------------------------------------------------------------------
-- Borrar una partida.
-- ---------------------------------------------------------------------
create or replace function public.qe_delete_line(p_line_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_quote_id uuid;
begin
  perform public._qe_assert_staff();

  select organization_id, quote_id into v_org, v_quote_id
  from public.quote_lines where id = p_line_id;
  if v_quote_id is null then
    return jsonb_build_object('ok', false, 'error', 'Partida no encontrada');
  end if;

  delete from public.quote_lines where id = p_line_id;
  perform public._recompute_quote_totals(v_quote_id);
  perform public._qe_audit(v_org, 'quote_lines', p_line_id::text, 'DELETE',
    jsonb_build_object('quote_id', v_quote_id));

  return jsonb_build_object('ok', true, 'quote_id', v_quote_id);
end;
$$;

-- ---------------------------------------------------------------------
-- Cambiar el estatus de una cotización.
-- ---------------------------------------------------------------------
create or replace function public.qe_set_quote_status(p_quote_id uuid, p_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_status text := nullif(trim(coalesce(p_status, '')), '');
  c_allowed text[] := array['Pendiente','Enviada','Aceptada','Rechazada','Cancelada','Facturada'];
begin
  perform public._qe_assert_staff();

  if v_status is null or not (v_status = any(c_allowed)) then
    return jsonb_build_object('ok', false, 'error',
      'Estatus no permitido. Use: ' || array_to_string(c_allowed, ', '));
  end if;

  select organization_id into v_org from public.quotes where id = p_quote_id;
  if v_org is null then
    return jsonb_build_object('ok', false, 'error', 'Cotización no encontrada');
  end if;

  update public.quotes set status = v_status, updated_at = now() where id = p_quote_id;
  perform public._qe_audit(v_org, 'quotes', p_quote_id::text, 'UPDATE',
    jsonb_build_object('status', v_status));

  return jsonb_build_object('ok', true, 'quote_id', p_quote_id, 'status', v_status);
end;
$$;

-- ---------------------------------------------------------------------
-- Permisos: solo staff autenticado o el servidor de confianza.
-- ---------------------------------------------------------------------
do $$
declare fn text;
declare sigs text[] := array[
  'public.qe_create_quote_from_request(uuid)',
  'public.qe_add_line(uuid, text, numeric, numeric, numeric, uuid, numeric)',
  'public.qe_update_line(uuid, text, numeric, numeric, numeric, numeric, boolean)',
  'public.qe_delete_line(uuid)',
  'public.qe_set_quote_status(uuid, text)'
];
begin
  foreach fn in array sigs loop
    execute format('revoke all on function %s from public, anon', fn);
    execute format('grant execute on function %s to authenticated, service_role', fn);
  end loop;
end $$;

revoke all on function public._qe_assert_staff() from public, anon, authenticated;
revoke all on function public._recompute_quote_totals(uuid) from public, anon, authenticated;
revoke all on function public._recompute_line_amounts(uuid) from public, anon, authenticated;
revoke all on function public._qe_audit(uuid, text, text, text, jsonb) from public, anon, authenticated;
