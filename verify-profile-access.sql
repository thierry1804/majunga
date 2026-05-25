-- Script de vérification pour l'accès aux profils
-- Exécuter ce script dans l'éditeur SQL de Supabase pour diagnostiquer le problème

-- 1. Vérifier que le profil existe pour l'utilisateur
SELECT 
  p.id,
  p.email,
  p.role,
  p.full_name,
  p.created_at,
  u.id as auth_user_id,
  u.email as auth_email
FROM public.profiles p
FULL OUTER JOIN auth.users u ON p.id = u.id
WHERE u.email = 'thierry1804@gmail.com' OR p.email = 'thierry1804@gmail.com';

-- 2. Vérifier les politiques RLS actuelles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- 3. Tester l'accès en tant qu'utilisateur authentifié (remplacer l'ID)
-- Note: Cette requête doit être exécutée avec les permissions de l'utilisateur
-- SELECT * FROM public.profiles WHERE id = '6748ca54-5bb8-4bd9-8e2a-4a3bb64c8bb2';

-- 4. Vérifier si RLS est activé
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 5. Si le profil n'existe pas, le créer manuellement
-- ATTENTION: Remplacez l'ID et l'email par les valeurs correctes
/*
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '6748ca54-5bb8-4bd9-8e2a-4a3bb64c8bb2',
  'thierry1804@gmail.com',
  NULL,
  'user'
) ON CONFLICT (id) DO NOTHING;
*/

