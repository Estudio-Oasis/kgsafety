CREATE OR REPLACE FUNCTION public.grant_kg_admin_for_verified_domain()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND (
       lower(split_part(NEW.email, '@', 2)) = 'kg-safety.com'
       OR lower(NEW.email) = 'joserogelioteran@gmail.com'
     ) THEN
    UPDATE public.profiles SET status = 'approved' WHERE id = NEW.id;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin_kg')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $function$;