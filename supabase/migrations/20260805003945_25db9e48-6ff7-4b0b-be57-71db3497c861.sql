-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin_kg', 'equipo_kg', 'cliente_corp', 'cliente_planta');
CREATE TYPE public.profile_status AS ENUM ('pending', 'approved', 'rejected');

-- CATALOGOS
CREATE TABLE public.companies (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.plants (
  slug TEXT PRIMARY KEY,
  company_slug TEXT NOT NULL REFERENCES public.companies(slug) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  responsable TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.systems (
  id TEXT PRIMARY KEY,
  plant_slug TEXT NOT NULL REFERENCES public.plants(slug) ON DELETE CASCADE,
  type TEXT NOT NULL,
  ubicacion TEXT NOT NULL DEFAULT '',
  metros INTEGER,
  norma TEXT NOT NULL DEFAULT ''
);

CREATE TABLE public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  company_slug TEXT NOT NULL REFERENCES public.companies(slug) ON DELETE CASCADE,
  plant_slug TEXT NOT NULL REFERENCES public.plants(slug) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  responsable TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pendiente',
  descripcion TEXT NOT NULL DEFAULT ''
);

CREATE TABLE public.certifications (
  id TEXT PRIMARY KEY,
  system_id TEXT NOT NULL REFERENCES public.systems(id) ON DELETE CASCADE,
  plant_slug TEXT NOT NULL REFERENCES public.plants(slug) ON DELETE CASCADE,
  ultima DATE NOT NULL,
  vencimiento DATE NOT NULL
);

CREATE TABLE public.documents (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  plant_slug TEXT NOT NULL REFERENCES public.plants(slug) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  size_label TEXT NOT NULL DEFAULT ''
);

CREATE TABLE public.workers (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  puesto TEXT NOT NULL DEFAULT '',
  plant_slug TEXT NOT NULL REFERENCES public.plants(slug) ON DELETE CASCADE,
  curso TEXT NOT NULL DEFAULT '',
  dc3 TEXT NOT NULL DEFAULT '',
  emision DATE NOT NULL,
  vencimiento DATE NOT NULL,
  instructor TEXT NOT NULL DEFAULT ''
);

CREATE TABLE public.library_docs (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  fecha DATE NOT NULL,
  size_label TEXT NOT NULL DEFAULT ''
);

CREATE TABLE public.service_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  plant_slug TEXT NOT NULL REFERENCES public.plants(slug) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'recibida',
  solicitante TEXT NOT NULL DEFAULT '',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PERFILES Y ROLES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL DEFAULT '',
  full_name TEXT NOT NULL DEFAULT '',
  company_slug TEXT REFERENCES public.companies(slug) ON DELETE SET NULL,
  requested_company_slug TEXT,
  status public.profile_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- GRANTS
GRANT SELECT ON public.companies TO authenticated;
GRANT SELECT ON public.plants TO authenticated;
GRANT SELECT ON public.systems TO authenticated;
GRANT SELECT ON public.projects TO authenticated;
GRANT SELECT ON public.certifications TO authenticated;
GRANT SELECT ON public.documents TO authenticated;
GRANT SELECT ON public.workers TO authenticated;
GRANT SELECT ON public.library_docs TO authenticated;
GRANT SELECT, INSERT ON public.service_requests TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.companies, public.plants, public.systems, public.projects, public.certifications, public.documents, public.workers, public.library_docs, public.service_requests, public.profiles, public.user_roles TO service_role;

-- FUNCIONES DE SEGURIDAD
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_kg_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id = _user_id
      AND ur.role IN ('admin_kg', 'equipo_kg')
      AND p.status = 'approved'
  );
$$;

CREATE OR REPLACE FUNCTION public.current_company(_user_id UUID)
RETURNS TEXT LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT company_slug FROM public.profiles
  WHERE id = _user_id AND status = 'approved';
$$;

CREATE OR REPLACE FUNCTION public.can_read_company(_company_slug TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_kg_staff(auth.uid())
      OR _company_slug = public.current_company(auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.can_read_plant(_plant_slug TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_kg_staff(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.plants pl
        WHERE pl.slug = _plant_slug
          AND pl.company_slug = public.current_company(auth.uid())
      );
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Crea el perfil pendiente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, requested_company_slug)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'requested_company_slug', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "companies_read" ON public.companies FOR SELECT TO authenticated
USING (public.can_read_company(slug));

CREATE POLICY "plants_read" ON public.plants FOR SELECT TO authenticated
USING (public.can_read_company(company_slug));

CREATE POLICY "systems_read" ON public.systems FOR SELECT TO authenticated
USING (public.can_read_plant(plant_slug));

CREATE POLICY "projects_read" ON public.projects FOR SELECT TO authenticated
USING (public.can_read_company(company_slug));

CREATE POLICY "certifications_read" ON public.certifications FOR SELECT TO authenticated
USING (public.can_read_plant(plant_slug));

CREATE POLICY "documents_read" ON public.documents FOR SELECT TO authenticated
USING (public.can_read_plant(plant_slug));

CREATE POLICY "workers_read" ON public.workers FOR SELECT TO authenticated
USING (public.can_read_plant(plant_slug));

CREATE POLICY "library_staff_read" ON public.library_docs FOR SELECT TO authenticated
USING (public.is_kg_staff(auth.uid()));

CREATE POLICY "requests_read" ON public.service_requests FOR SELECT TO authenticated
USING (public.can_read_plant(plant_slug));

CREATE POLICY "requests_insert" ON public.service_requests FOR INSERT TO authenticated
WITH CHECK (public.can_read_plant(plant_slug) AND created_by = auth.uid());

CREATE POLICY "profiles_read_own" ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin_kg'));

CREATE POLICY "profiles_update_own_name" ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_admin_update" ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin_kg')) WITH CHECK (public.has_role(auth.uid(), 'admin_kg'));

CREATE POLICY "roles_read_own" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin_kg'));