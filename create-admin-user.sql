-- Script pour créer un utilisateur admin et son profil
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- 1. Créer un utilisateur admin (remplacez l'email par le vôtre)
-- Note: Vous devez d'abord créer cet utilisateur via l'interface Supabase Authentication > Users
-- Puis exécuter cette requête pour lui donner le rôle admin

-- 2. Mettre à jour le profil pour donner le rôle admin
-- Remplacez 'admin@madabooking.com' par l'email de votre compte admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@madabooking.com';

-- 3. Si le profil n'existe pas, le créer manuellement
-- Remplacez l'ID et l'email par ceux de votre utilisateur
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '6748ca54-5bb8-4bd9-8e2a-4a3bb64c8bb2', -- Remplacez par l'ID de votre utilisateur
  'admin@madabooking.com', -- Remplacez par votre email
  'Administrateur',
  'admin'
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Administrateur';

-- 4. Vérifier que le profil a été créé/mis à jour
SELECT * FROM public.profiles WHERE email = 'admin@madabooking.com';
