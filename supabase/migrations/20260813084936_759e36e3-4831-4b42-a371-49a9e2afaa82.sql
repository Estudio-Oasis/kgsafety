delete from public.legacy_reference_records where entity in ('probe','probe2');
delete from public.clients where legacy_id = 'probe';
alter table public.legacy_reference_records rename column entity to record_type;
alter table public.legacy_reference_records rename column legacy_id to legacy_key;
alter table public.legacy_reference_records rename column payload to source_payload;
alter table public.legacy_reference_records alter column legacy_key set not null;
create unique index legacy_reference_records_unique_idx on public.legacy_reference_records (organization_id, record_type, legacy_key);