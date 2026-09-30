-- =====================================================================
-- Cotizador independiente (Fase 3 de 3): paquetes de precios.
--
-- Tabla public.price_packages con los precios OFICIALES verificados 2026
-- (fuente: catálogo STPS del sitio, src/data/kaee.ts). Sirve para sugerir
-- precios al armar una cotización, sin consultar a Noil.
--
-- Cada paquete apunta a un curso por su legacy_id (aquí, el slug del sitio).
-- resolve_price_package_courses() enlaza course_id DESPUÉS de importar los
-- cursos al catálogo (public.courses), porque el course_id (uuid) sólo existe
-- una vez importado.
--
-- Tipos de paquete:
--   individual_local   : precio por persona, curso local.
--   individual_foraneo : precio por persona, curso foráneo (local + recargo).
--   grupal             : precio por grupo cerrado (rango de participantes).
-- =====================================================================

create table if not exists public.price_packages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  code text not null,
  name text not null,
  package_type text not null check (package_type in ('individual_local','individual_foraneo','grupal')),
  course_legacy_id text,
  course_id uuid references public.courses(id) on delete set null,
  min_participants integer,
  max_participants integer,
  unit_price numeric(14,2) not null default 0 check (unit_price >= 0),
  currency char(3) not null default 'MXN',
  tax_rate numeric(7,4) not null default 0.16 check (tax_rate >= 0),
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create index if not exists price_packages_course_idx on public.price_packages (organization_id, course_legacy_id);

grant select on public.price_packages to authenticated;
grant all on public.price_packages to service_role;
alter table public.price_packages enable row level security;
create policy price_packages_select on public.price_packages
  for select to authenticated using (public.is_org_member(organization_id));
create policy price_packages_write on public.price_packages
  for all to authenticated
  using (public.has_org_role(organization_id, array['owner','admin','sales']))
  with check (public.has_org_role(organization_id, array['owner','admin','sales']));

create trigger price_packages_set_updated_at
  before update on public.price_packages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Resolver course_id por legacy_id (correr DESPUÉS de importar cursos).
-- ---------------------------------------------------------------------
create or replace function public.resolve_price_package_courses(p_org_code text default 'KGSAFETY')
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_count integer;
begin
  select id into v_org from public.organizations where code = p_org_code limit 1;
  if v_org is null then
    raise exception 'Organización % no encontrada', p_org_code;
  end if;

  update public.price_packages p
     set course_id = c.id, updated_at = now()
    from public.courses c
   where p.organization_id = v_org
     and c.organization_id = v_org
     and p.course_legacy_id is not null
     and c.legacy_id = p.course_legacy_id
     and (p.course_id is distinct from c.id);

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.resolve_price_package_courses(text) from public, anon;
grant execute on function public.resolve_price_package_courses(text) to authenticated, service_role;

-- ---------------------------------------------------------------------
-- Semilla: precios oficiales verificados 2026 (por curso: local / foráneo / grupal).
-- ---------------------------------------------------------------------
do $$
declare
  v_org uuid;
  r record;
  cursos jsonb := '[
    {"slug":"alturas-autorizado","name":"Trabajos en Alturas — Autorizado","local":1355.00,"foraneo_extra":792.00,"grupal":19800.00,"min":20,"max":25},
    {"slug":"alturas-competente","name":"Trabajos en Alturas — Competente","local":7000.00,"foraneo_extra":3323.00,"grupal":88000.00,"min":10,"max":15},
    {"slug":"alturas-monitor","name":"Trabajos en Alturas — Monitor Supervisor","local":9000.00,"foraneo_extra":5505.00,"grupal":123200.00,"min":20,"max":25},
    {"slug":"andamios","name":"Armado y Desarmado de Andamios","local":1452.00,"foraneo_extra":792.00,"grupal":19800.00,"min":20,"max":25},
    {"slug":"izajes","name":"Formación Técnica en Izajes","local":2710.00,"foraneo_extra":792.00,"grupal":38500.00,"min":20,"max":25},
    {"slug":"plataformas-elevacion","name":"Operación de Plataformas de Elevación","local":1452.00,"foraneo_extra":792.00,"grupal":19800.00,"min":20,"max":25},
    {"slug":"alturas-horizontales","name":"Trabajos en Alturas sobre Superficies Horizontales","local":1355.00,"foraneo_extra":792.00,"grupal":19800.00,"min":20,"max":25}
  ]'::jsonb;
begin
  select id into v_org from public.organizations where code = 'KGSAFETY' limit 1;
  if v_org is null then
    raise notice 'Organización KGSAFETY no encontrada; se omite semilla de price_packages.';
    return;
  end if;

  for r in select * from jsonb_to_recordset(cursos) as x(
    slug text, name text, local numeric, foraneo_extra numeric, grupal numeric, min int, max int
  )
  loop
    -- Individual local (por persona)
    insert into public.price_packages
      (organization_id, code, name, package_type, course_legacy_id, min_participants, max_participants, unit_price, notes)
    values
      (v_org, r.slug || '-local', r.name || ' · Local (por persona)', 'individual_local', r.slug, r.min, r.max, r.local,
       'Precio por persona, curso local. Fuente: catálogo STPS 2026.')
    on conflict (organization_id, code) do update
      set name = excluded.name, unit_price = excluded.unit_price,
          min_participants = excluded.min_participants, max_participants = excluded.max_participants,
          notes = excluded.notes, updated_at = now();

    -- Individual foráneo (por persona = local + recargo)
    insert into public.price_packages
      (organization_id, code, name, package_type, course_legacy_id, min_participants, max_participants, unit_price, notes)
    values
      (v_org, r.slug || '-foraneo', r.name || ' · Foráneo (por persona)', 'individual_foraneo', r.slug, r.min, r.max,
       r.local + r.foraneo_extra,
       format('Precio por persona, curso foráneo (local %s + recargo %s). Fuente: catálogo STPS 2026.', r.local, r.foraneo_extra))
    on conflict (organization_id, code) do update
      set name = excluded.name, unit_price = excluded.unit_price,
          min_participants = excluded.min_participants, max_participants = excluded.max_participants,
          notes = excluded.notes, updated_at = now();

    -- Grupal (por grupo cerrado)
    insert into public.price_packages
      (organization_id, code, name, package_type, course_legacy_id, min_participants, max_participants, unit_price, notes)
    values
      (v_org, r.slug || '-grupal', r.name || ' · Paquete grupal', 'grupal', r.slug, r.min, r.max, r.grupal,
       format('Precio por grupo cerrado (%s a %s personas). Fuente: catálogo STPS 2026.', r.min, r.max))
    on conflict (organization_id, code) do update
      set name = excluded.name, unit_price = excluded.unit_price,
          min_participants = excluded.min_participants, max_participants = excluded.max_participants,
          notes = excluded.notes, updated_at = now();
  end loop;
end $$;
