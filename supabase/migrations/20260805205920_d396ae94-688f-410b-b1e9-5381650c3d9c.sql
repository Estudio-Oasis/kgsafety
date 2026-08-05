CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  origen text NOT NULL DEFAULT 'sitio',
  empresa text NOT NULL DEFAULT '',
  rfc text NOT NULL DEFAULT '',
  contacto_nombre text NOT NULL DEFAULT '',
  contacto_correo text NOT NULL DEFAULT '',
  contacto_telefono text NOT NULL DEFAULT '',
  curso_id integer,
  curso_nombre text NOT NULL DEFAULT '',
  servicio_id integer,
  participantes integer,
  modalidad text NOT NULL DEFAULT '',
  tipo_curso text NOT NULL DEFAULT '',
  lugar_servicio text NOT NULL DEFAULT '',
  fecha_deseada date,
  contratista_id integer,
  contratista_nombre text NOT NULL DEFAULT '',
  comentarios text NOT NULL DEFAULT '',
  etapa text NOT NULL DEFAULT 'nuevo',
  valor_estimado numeric(12,2),
  responsable text NOT NULL DEFAULT '',
  erp_status text NOT NULL DEFAULT 'pendiente',
  erp_folio text NOT NULL DEFAULT '',
  erp_solicitud_id text NOT NULL DEFAULT '',
  erp_trace_id text NOT NULL DEFAULT '',
  erp_error text NOT NULL DEFAULT '',
  es_prueba boolean NOT NULL DEFAULT false
);

GRANT SELECT, UPDATE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY leads_staff_read ON public.leads
  FOR SELECT TO authenticated USING (public.is_kg_staff(auth.uid()));
CREATE POLICY leads_staff_update ON public.leads
  FOR UPDATE TO authenticated USING (public.is_kg_staff(auth.uid())) WITH CHECK (public.is_kg_staff(auth.uid()));

CREATE TRIGGER leads_set_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX leads_etapa_idx ON public.leads (etapa);

CREATE TABLE public.lead_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  tipo text NOT NULL DEFAULT 'nota',
  detalle text NOT NULL DEFAULT '',
  autor_id uuid,
  autor_nombre text NOT NULL DEFAULT ''
);

GRANT SELECT, INSERT ON public.lead_events TO authenticated;
GRANT ALL ON public.lead_events TO service_role;
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY lead_events_staff_read ON public.lead_events
  FOR SELECT TO authenticated USING (public.is_kg_staff(auth.uid()));
CREATE POLICY lead_events_staff_insert ON public.lead_events
  FOR INSERT TO authenticated WITH CHECK (public.is_kg_staff(auth.uid()) AND autor_id = auth.uid());

CREATE INDEX lead_events_lead_idx ON public.lead_events (lead_id, created_at DESC);