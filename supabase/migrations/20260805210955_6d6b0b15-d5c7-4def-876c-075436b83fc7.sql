-- 1. Bitácora de interacciones con el ERP
CREATE TABLE public.erp_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  trace_id text NOT NULL DEFAULT '',
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  operacion text NOT NULL DEFAULT '',
  stage text NOT NULL DEFAULT '',
  metodo text NOT NULL DEFAULT 'GET',
  path text NOT NULL DEFAULT '',
  status_code integer,
  ok boolean NOT NULL DEFAULT false,
  duracion_ms integer NOT NULL DEFAULT 0,
  intento integer NOT NULL DEFAULT 1,
  error_code text NOT NULL DEFAULT '',
  error_message text NOT NULL DEFAULT '',
  modo text NOT NULL DEFAULT 'live',
  es_prueba boolean NOT NULL DEFAULT false,
  detalle jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX erp_logs_created_at_idx ON public.erp_logs (created_at DESC);
CREATE INDEX erp_logs_trace_idx ON public.erp_logs (trace_id);
GRANT SELECT ON public.erp_logs TO authenticated;
GRANT ALL ON public.erp_logs TO service_role;
ALTER TABLE public.erp_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY erp_logs_staff_read ON public.erp_logs
  FOR SELECT TO authenticated USING (public.is_kg_staff(auth.uid()));

-- 2. Cola de reintentos (outbox) para solicitudes que el ERP no pudo procesar
CREATE TABLE public.erp_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'cotizacion',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  estado text NOT NULL DEFAULT 'pendiente',
  intentos integer NOT NULL DEFAULT 0,
  max_intentos integer NOT NULL DEFAULT 6,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error text NOT NULL DEFAULT '',
  trace_id text NOT NULL DEFAULT '',
  modo text NOT NULL DEFAULT 'live',
  es_prueba boolean NOT NULL DEFAULT false
);
CREATE INDEX erp_outbox_pendientes_idx ON public.erp_outbox (estado, next_attempt_at);
GRANT SELECT ON public.erp_outbox TO authenticated;
GRANT ALL ON public.erp_outbox TO service_role;
ALTER TABLE public.erp_outbox ENABLE ROW LEVEL SECURITY;
CREATE POLICY erp_outbox_staff_read ON public.erp_outbox
  FOR SELECT TO authenticated USING (public.is_kg_staff(auth.uid()));
CREATE TRIGGER erp_outbox_set_updated_at BEFORE UPDATE ON public.erp_outbox
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Alertas operativas del ERP
CREATE TABLE public.erp_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  tipo text NOT NULL DEFAULT 'erp_error',
  severidad text NOT NULL DEFAULT 'alta',
  titulo text NOT NULL DEFAULT '',
  mensaje text NOT NULL DEFAULT '',
  trace_id text NOT NULL DEFAULT '',
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  resuelta boolean NOT NULL DEFAULT false,
  resuelta_at timestamptz,
  es_prueba boolean NOT NULL DEFAULT false
);
CREATE INDEX erp_alerts_abiertas_idx ON public.erp_alerts (resuelta, created_at DESC);
GRANT SELECT, UPDATE ON public.erp_alerts TO authenticated;
GRANT ALL ON public.erp_alerts TO service_role;
ALTER TABLE public.erp_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY erp_alerts_staff_read ON public.erp_alerts
  FOR SELECT TO authenticated USING (public.is_kg_staff(auth.uid()));
CREATE POLICY erp_alerts_staff_update ON public.erp_alerts
  FOR UPDATE TO authenticated USING (public.is_kg_staff(auth.uid())) WITH CHECK (public.is_kg_staff(auth.uid()));
CREATE TRIGGER erp_alerts_set_updated_at BEFORE UPDATE ON public.erp_alerts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Campos de sincronización en las solicitudes propias
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS modo text NOT NULL DEFAULT 'live',
  ADD COLUMN IF NOT EXISTS erp_last_attempt_at timestamptz,
  ADD COLUMN IF NOT EXISTS erp_intentos integer NOT NULL DEFAULT 0;