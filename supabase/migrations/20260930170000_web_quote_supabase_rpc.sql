-- =====================================================================
-- Cotizador independiente (Fase 1 de 3): alta pública de solicitudes.
--
-- Objetivo: que el sitio (/contacto) registre una SOLICITUD DE COTIZACIÓN
-- directamente en Supabase, sin depender de Noil.
--
-- Garantías de esta migración:
--   1. Idempotencia: dos envíos con el mismo submission_id NO crean dos
--      solicitudes; el segundo devuelve la que ya existe.
--   2. Anti-abuso: se limita el número de solicitudes por correo/IP dentro
--      de una ventana de tiempo.
--   3. Seguridad: SOLO el rol de servicio (service_role) puede ejecutar el
--      RPC. El público (anon/authenticated) no tiene acceso: el sitio llama
--      a este RPC desde el servidor con la llave de servicio.
--
-- No toca ninguna tabla de Noil. La solicitud queda en public.quote_requests
-- de la organización KGSAFETY, lista para verse en el portal (portal.erp-kg).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Bitácora de envíos web para idempotencia y rate-limit.
-- ---------------------------------------------------------------------
create table if not exists public.web_quote_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  submission_id text not null,
  quote_request_id uuid references public.quote_requests(id) on delete set null,
  contact_email text,
  source_ip text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, submission_id)
);

create index if not exists web_quote_submissions_email_idx
  on public.web_quote_submissions (organization_id, contact_email, created_at desc);
create index if not exists web_quote_submissions_ip_idx
  on public.web_quote_submissions (organization_id, source_ip, created_at desc);

-- Nadie que no sea service_role toca esta tabla directamente.
grant all on public.web_quote_submissions to service_role;
alter table public.web_quote_submissions enable row level security;
-- (Sin políticas para authenticated/anon => acceso denegado salvo service_role,
--  que siempre omite RLS.)

-- ---------------------------------------------------------------------
-- RPC público-de-servidor: create_web_quote
-- ---------------------------------------------------------------------
create or replace function public.create_web_quote(
  p_submission_id text,
  p_payload jsonb,
  p_source_ip text default null,
  p_org_code text default 'KGSAFETY'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org        public.organizations%rowtype;
  v_email      text := nullif(trim(coalesce(p_payload->>'contacto_correo', p_payload->>'email', '')), '');
  v_submission text := nullif(trim(coalesce(p_submission_id, '')), '');
  v_existing   uuid;
  v_course_id     uuid;
  v_service_id    uuid;
  v_contractor_id uuid;
  v_participants  integer;
  v_request_id uuid;
  v_code       text;
  v_recent_email int;
  v_recent_ip    int;
  -- Ventana y topes de rate-limit (ajustables sin cambiar código de app).
  c_window   interval := interval '10 minutes';
  c_max_email int := 5;
  c_max_ip    int := 20;
begin
  if v_submission is null then
    return jsonb_build_object('ok', false, 'status', 'invalid',
      'error', 'submission_id es obligatorio');
  end if;

  select * into v_org from public.organizations where code = p_org_code limit 1;
  if not found then
    return jsonb_build_object('ok', false, 'status', 'invalid',
      'error', format('Organización %s no encontrada', p_org_code));
  end if;

  -- 1) IDEMPOTENCIA: ¿ya procesamos este submission_id?
  select quote_request_id into v_existing
  from public.web_quote_submissions
  where organization_id = v_org.id and submission_id = v_submission
  limit 1;

  if found and v_existing is not null then
    select code into v_code from public.quote_requests where id = v_existing;
    return jsonb_build_object('ok', true, 'status', 'duplicate',
      'quote_request_id', v_existing, 'code', v_code);
  end if;

  -- 2) RATE-LIMIT por correo y por IP dentro de la ventana.
  if v_email is not null then
    select count(*) into v_recent_email
    from public.web_quote_submissions
    where organization_id = v_org.id
      and contact_email = v_email
      and created_at > now() - c_window;
    if v_recent_email >= c_max_email then
      return jsonb_build_object('ok', false, 'status', 'rate_limited',
        'error', 'Demasiadas solicitudes recientes con este correo. Intente más tarde.');
    end if;
  end if;

  if p_source_ip is not null then
    select count(*) into v_recent_ip
    from public.web_quote_submissions
    where organization_id = v_org.id
      and source_ip = p_source_ip
      and created_at > now() - c_window;
    if v_recent_ip >= c_max_ip then
      return jsonb_build_object('ok', false, 'status', 'rate_limited',
        'error', 'Demasiadas solicitudes recientes. Intente más tarde.');
    end if;
  end if;

  -- 3) Resolver catálogos por legacy_id (si viene) dentro de la org.
  if nullif(p_payload->>'course_legacy_id', '') is not null then
    select id into v_course_id from public.courses
    where organization_id = v_org.id and legacy_id = p_payload->>'course_legacy_id' limit 1;
  end if;
  if nullif(p_payload->>'service_legacy_id', '') is not null then
    select id into v_service_id from public.services
    where organization_id = v_org.id and legacy_id = p_payload->>'service_legacy_id' limit 1;
  end if;
  if nullif(p_payload->>'contractor_legacy_id', '') is not null then
    select id into v_contractor_id from public.contractors
    where organization_id = v_org.id and legacy_id = p_payload->>'contractor_legacy_id' limit 1;
  end if;

  v_participants := nullif(p_payload->>'participant_count', '')::int;
  if v_participants is not null and v_participants <= 0 then
    v_participants := null;
  end if;

  v_code := 'WEB-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(v_submission, '-', ''), 1, 8));

  -- 4) Alta de la solicitud. status 'Pendiente' (lo mismo que el ERP).
  insert into public.quote_requests (
    organization_id, code, request_date,
    contractor_id, course_id, service_id,
    alternate_contractor_name, participant_count,
    travel_mode, delivery_type, location,
    contact_email, contact_phone, comments,
    status, source_payload
  ) values (
    v_org.id, v_code, current_date,
    v_contractor_id, v_course_id, v_service_id,
    nullif(p_payload->>'contractor_name', ''),
    v_participants,
    nullif(p_payload->>'travel_mode', ''),
    nullif(p_payload->>'delivery_type', ''),
    nullif(p_payload->>'location', ''),
    v_email,
    nullif(p_payload->>'contacto_telefono', ''),
    nullif(p_payload->>'comentarios', ''),
    'Pendiente',
    p_payload || jsonb_build_object('source', coalesce(p_payload->>'source', 'cotizacion-web'))
  )
  returning id into v_request_id;

  -- 5) Registrar el envío (cierra la idempotencia).
  insert into public.web_quote_submissions (
    organization_id, submission_id, quote_request_id, contact_email, source_ip, payload
  ) values (
    v_org.id, v_submission, v_request_id, v_email, p_source_ip, p_payload
  );

  return jsonb_build_object('ok', true, 'status', 'created',
    'quote_request_id', v_request_id, 'code', v_code);

exception
  when unique_violation then
    -- Carrera: otro proceso insertó el mismo submission_id en paralelo.
    select quote_request_id into v_existing
    from public.web_quote_submissions
    where organization_id = v_org.id and submission_id = v_submission
    limit 1;
    select code into v_code from public.quote_requests where id = v_existing;
    return jsonb_build_object('ok', true, 'status', 'duplicate',
      'quote_request_id', v_existing, 'code', v_code);
end;
$$;

-- Solo el servidor (service_role) puede ejecutar el RPC.
revoke all on function public.create_web_quote(text, jsonb, text, text) from public, anon, authenticated;
grant execute on function public.create_web_quote(text, jsonb, text, text) to service_role;
