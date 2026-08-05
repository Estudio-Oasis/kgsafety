CREATE OR REPLACE FUNCTION public.grant_kg_admin_for_verified_domain()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(split_part(NEW.email, '@', 2)) = 'kg-safety.com' THEN
    UPDATE public.profiles SET status = 'approved' WHERE id = NEW.id;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin_kg')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

REVOKE EXECUTE ON FUNCTION public.grant_kg_admin_for_verified_domain() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created_grant_kg_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_kg_admin_for_verified_domain();

CREATE TRIGGER on_auth_user_confirmed_grant_kg_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_kg_admin_for_verified_domain();