create extension if not exists pgcrypto;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  legal_name text,
  tax_id text,
  active boolean not null default true,
  legacy_company_id text,
  legacy_client_assignment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('owner','admin','sales','operations','instructor','billing','viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.import_batches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_system text not null,
  source_manifest_sha256 text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'running',
  counts jsonb not null default '{}'::jsonb,
  errors jsonb not null default '[]'::jsonb,
  created_by uuid
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  code text,
  commercial_name text not null,
  legal_name text,
  tax_id text,
  email text,
  phone text,
  street text,
  exterior_number text,
  interior_number text,
  neighborhood text,
  postal_code text,
  city text,
  state text,
  country_code char(2) not null default 'MX',
  active boolean not null default true,
  source_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  code text,
  name text not null,
  tax_id text,
  contact_name text,
  email text,
  phone text,
  city text,
  state text,
  active boolean not null default true,
  source_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.contractors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  code text,
  name text not null,
  email text,
  phone text,
  active boolean not null default true,
  source_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.course_classifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  code text,
  name text not null,
  description text,
  color text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.course_groups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  classification_id uuid references public.course_classifications(id),
  legacy_id text,
  code text,
  name text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.training_agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  code text,
  name text not null,
  tax_id text,
  specialty text,
  agent_type text,
  color text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  group_id uuid references public.course_groups(id),
  classification_id uuid references public.course_classifications(id),
  training_agent_id uuid references public.training_agents(id),
  legacy_id text,
  code text,
  name text not null,
  description text,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  duration_text_legacy text,
  cost numeric(14,2) check (cost is null or cost >= 0),
  local_unit_price numeric(14,2) check (local_unit_price is null or local_unit_price >= 0),
  travel_unit_price numeric(14,2) check (travel_unit_price is null or travel_unit_price >= 0),
  visible_on_web boolean not null default false,
  required_equipment text,
  supply_name_legacy text,
  active boolean not null default true,
  source_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  code text,
  name text not null,
  description text,
  service_type text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.instructors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  code text,
  name text not null,
  tax_id text,
  email text,
  specialty text,
  color text,
  work_status text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.instructor_courses (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  instructor_id uuid not null references public.instructors(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  training_agent_id uuid references public.training_agents(id),
  legacy_id text,
  active boolean not null default true,
  primary key (instructor_id, course_id)
);

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  code text,
  request_date date not null,
  client_id uuid references public.clients(id),
  contractor_id uuid references public.contractors(id),
  course_id uuid references public.courses(id),
  service_id uuid references public.services(id),
  alternate_contractor_name text,
  participant_count integer check (participant_count is null or participant_count > 0),
  travel_mode text,
  delivery_type text,
  location text,
  contact_email text,
  contact_phone text,
  comments text,
  status text not null default 'Pendiente',
  source_payload jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  code text,
  request_id uuid references public.quote_requests(id),
  client_id uuid references public.clients(id),
  service_id uuid references public.services(id),
  quote_date date not null,
  valid_until date,
  origin text,
  delivery_type text,
  travel_mode text,
  location text,
  requires_payment boolean not null default false,
  purchase_order text,
  comments text,
  department_legacy_id text,
  report_template_legacy_id text,
  revision integer not null default 0 check (revision >= 0),
  currency char(3) not null default 'MXN',
  subtotal numeric(14,2) not null default 0,
  tax_total numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  status text not null default 'Pendiente',
  source_payload jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.quote_lines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  quote_id uuid not null references public.quotes(id) on delete cascade,
  legacy_id text,
  legacy_sequence integer,
  course_id uuid references public.courses(id),
  request_code_legacy text,
  scheduled_date date,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(14,2) not null default 0 check (unit_price >= 0),
  discounted_unit_price numeric(14,2) check (discounted_unit_price is null or discounted_unit_price >= 0),
  subtotal numeric(14,2) not null default 0,
  tax_rate numeric(7,4) not null default 0.16 check (tax_rate >= 0),
  total numeric(14,2) not null default 0,
  description text,
  source_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.service_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  code text,
  quote_id uuid references public.quotes(id),
  quote_line_id uuid references public.quote_lines(id),
  client_id uuid references public.clients(id),
  service_id uuid references public.services(id),
  service_date date not null,
  location text,
  report_template_legacy_id text,
  signature_template_legacy_id text,
  status text not null default 'Pendiente',
  source_payload jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.course_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  service_order_id uuid not null references public.service_orders(id),
  course_id uuid references public.courses(id),
  instructor_id uuid references public.instructors(id),
  client_id uuid references public.clients(id),
  service_id uuid references public.services(id),
  legacy_id text,
  course_number text,
  session_date date not null,
  starts_at timestamptz,
  ends_at timestamptz,
  capacity integer check (capacity is null or capacity >= 0),
  travel_mode text,
  delivery_type text,
  location text,
  signature_template_legacy_id text,
  status text not null default 'Pendiente',
  source_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id),
  unique (organization_id, course_number)
);

create table public.participants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  curp text,
  given_names text not null,
  paternal_surname text,
  maternal_surname text,
  gender text,
  birth_date date,
  occupation text,
  position text,
  employer_commercial_name text,
  employer_legal_name text,
  employer_tax_id text,
  legal_representative text,
  workers_representative text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  session_id uuid not null references public.course_sessions(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  legacy_service_order_id text,
  legacy_quote_line_id text,
  course_type text,
  height_training text,
  status text not null default 'Inscrito',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, participant_id)
);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  attended boolean,
  grade numeric(6,2) check (grade is null or grade between 0 and 100),
  evaluated_by uuid,
  evaluated_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id)
);

create table public.dc3_certificates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  folio text,
  generated boolean not null default false,
  generated_at timestamptz,
  generated_by uuid,
  storage_path text,
  source_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id)
);

create table public.per_diems (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  session_id uuid references public.course_sessions(id),
  instructor_id uuid references public.instructors(id),
  legacy_id text,
  legacy_quote_course_id text,
  record_date date,
  start_date date not null,
  end_date date not null,
  origin_city text,
  destination_city text,
  days numeric(8,2) check (days is null or days >= 0),
  amount numeric(14,2) not null default 0 check (amount >= 0),
  note text,
  status text not null default 'Pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  session_id uuid references public.course_sessions(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete cascade,
  service_order_id uuid references public.service_orders(id) on delete cascade,
  legacy_id text,
  event_type text not null,
  classification text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  title text not null,
  location text,
  color text,
  status text,
  source_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  category text not null,
  original_name text not null,
  storage_path text not null,
  content_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  sha256 text,
  legacy_url text,
  uploaded_by uuid,
  created_at timestamptz not null default now(),
  unique (organization_id, storage_path)
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  organization_id uuid,
  table_name text not null,
  record_id text,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  actor_id uuid,
  occurred_at timestamptz not null default now(),
  old_data jsonb,
  new_data jsonb,
  request_id text
);

create table public.legacy_reference_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity text not null,
  legacy_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.client_fiscal_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  rfc text not null,
  legal_name text not null,
  fiscal_regime text,
  postal_code text,
  email text,
  street text,
  exterior_number text,
  interior_number text,
  neighborhood text,
  city text,
  state text,
  sat_validation_status text,
  validated_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id),
  quote_id uuid references public.quotes(id),
  fiscal_profile_id uuid references public.client_fiscal_profiles(id),
  status text not null default 'draft',
  series text,
  folio text,
  uuid_fiscal text,
  issued_at timestamptz,
  canceled_at timestamptz,
  currency char(3) not null default 'MXN',
  exchange_rate numeric(14,6) not null default 1,
  subtotal numeric(14,2) not null default 0,
  discount numeric(14,2) not null default 0,
  tax_total numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  payment_form text,
  payment_method text,
  cfdi_use text,
  export_code text,
  payment_reference text,
  provider text,
  provider_external_id text,
  idempotency_key text not null,
  error_code text,
  error_message text,
  request_snapshot jsonb,
  response_snapshot_redacted jsonb,
  created_by uuid,
  canceled_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, idempotency_key)
);

create unique index invoices_org_uuid_unique_idx on public.invoices (organization_id, uuid_fiscal) where uuid_fiscal is not null;

create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  quote_line_id uuid references public.quote_lines(id),
  product_code text,
  unit_code text,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(14,2) not null default 0,
  discount numeric(14,2) not null default 0,
  subtotal numeric(14,2) not null default 0,
  tax_rate numeric(7,4) not null default 0.16,
  tax_amount numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.invoice_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  kind text not null check (kind in ('xml','pdf','acuse_cancelacion','xml_cancelacion','otro')),
  storage_path text not null,
  content_type text,
  size_bytes bigint,
  sha256 text,
  created_at timestamptz not null default now()
);

create table public.invoice_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  event_type text not null,
  detail jsonb not null default '{}'::jsonb,
  actor_id uuid,
  created_at timestamptz not null default now()
);

create index clients_org_name_idx on public.clients (organization_id, commercial_name);
create index courses_org_name_idx on public.courses (organization_id, name);
create index requests_org_date_idx on public.quote_requests (organization_id, request_date desc);
create index quotes_org_date_idx on public.quotes (organization_id, quote_date desc);
create index quote_lines_quote_idx on public.quote_lines (quote_id);
create index orders_org_date_idx on public.service_orders (organization_id, service_date desc);
create index sessions_org_date_idx on public.course_sessions (organization_id, session_date desc);
create index participants_org_name_idx on public.participants (organization_id, paternal_surname, given_names);
create unique index participants_org_curp_unique_idx on public.participants (organization_id, curp) where curp is not null;
create index events_org_start_idx on public.calendar_events (organization_id, starts_at);
create index attachments_entity_idx on public.attachments (organization_id, entity_type, entity_id);

create or replace function public.is_org_member(_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_kg_staff(auth.uid())
    or exists (
      select 1 from public.organization_members m
      where m.organization_id = _organization_id
        and m.user_id = auth.uid()
        and m.active
    );
$$;

create or replace function public.has_org_role(_organization_id uuid, _roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_kg_staff(auth.uid())
    or exists (
      select 1 from public.organization_members m
      where m.organization_id = _organization_id
        and m.user_id = auth.uid()
        and m.active
        and m.role = any(_roles)
    );
$$;

do $$
declare
  t text;
  tables text[] := array[
    'import_batches','clients','suppliers','contractors','course_classifications','course_groups',
    'training_agents','courses','services','instructors','instructor_courses','quote_requests',
    'quotes','quote_lines','service_orders','course_sessions','participants','enrollments',
    'assessments','dc3_certificates','per_diems','calendar_events','attachments',
    'legacy_reference_records','client_fiscal_profiles','invoices','invoice_items',
    'invoice_documents','invoice_events'
  ];
begin
  foreach t in array tables loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for select to authenticated using (public.is_org_member(organization_id))', t || '_select', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.has_org_role(organization_id, array[''owner'',''admin'',''sales'',''operations'',''billing'']))', t || '_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.has_org_role(organization_id, array[''owner'',''admin'',''sales'',''operations'',''billing''])) with check (public.has_org_role(organization_id, array[''owner'',''admin'',''sales'',''operations'',''billing'']))', t || '_update', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.has_org_role(organization_id, array[''owner'',''admin'']))', t || '_delete', t);
  end loop;

  foreach t in array array['organizations','organization_members','courses','clients','quotes','quote_lines','quote_requests','service_orders','course_sessions','participants','enrollments','assessments','dc3_certificates','per_diems','calendar_events','suppliers','contractors','course_classifications','course_groups','training_agents','services','instructors','client_fiscal_profiles','invoices'] loop
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_set_updated_at', t);
  end loop;
end $$;

grant select, insert, update, delete on public.organizations to authenticated;
grant all on public.organizations to service_role;
alter table public.organizations enable row level security;
create policy organizations_select on public.organizations for select to authenticated using (public.is_org_member(id));
create policy organizations_write on public.organizations for all to authenticated using (public.has_org_role(id, array['owner','admin'])) with check (public.has_org_role(id, array['owner','admin']));

grant select, insert, update, delete on public.organization_members to authenticated;
grant all on public.organization_members to service_role;
alter table public.organization_members enable row level security;
create policy organization_members_select on public.organization_members for select to authenticated using (public.is_org_member(organization_id));
create policy organization_members_write on public.organization_members for all to authenticated using (public.has_org_role(organization_id, array['owner','admin'])) with check (public.has_org_role(organization_id, array['owner','admin']));

grant select on public.audit_log to authenticated;
grant all on public.audit_log to service_role;
alter table public.audit_log enable row level security;
create policy audit_log_select on public.audit_log for select to authenticated using (public.is_kg_staff(auth.uid()));

insert into public.organizations (code, name, legal_name, legacy_company_id, legacy_client_assignment_id)
values ('KGSAFETY', 'KG SAFETY', 'KG SAFETY', '6', '70')
on conflict (code) do nothing;