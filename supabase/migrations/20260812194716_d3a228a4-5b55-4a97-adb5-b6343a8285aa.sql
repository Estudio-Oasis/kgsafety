UPDATE public.profiles
SET status = 'approved', full_name = 'Miguel Ángel Díaz Álvarez'
WHERE id = 'e44ca8fe-569c-4b56-9de8-ca1a7e508ef8';

DELETE FROM public.user_roles WHERE user_id = 'e44ca8fe-569c-4b56-9de8-ca1a7e508ef8';

INSERT INTO public.user_roles (user_id, role)
VALUES ('e44ca8fe-569c-4b56-9de8-ca1a7e508ef8', 'equipo_kg')
ON CONFLICT (user_id, role) DO NOTHING;