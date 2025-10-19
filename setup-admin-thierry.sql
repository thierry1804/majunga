-- Script pour créer l'utilisateur admin thierry1804@gmail.com
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- IMPORTANT: Vous devez d'abord créer l'utilisateur via Supabase Dashboard
-- 1. Aller dans Authentication > Users
-- 2. Cliquer sur "Add user"
-- 3. Email: thierry1804@gmail.com
-- 4. Password: 184BrianNeptunia
-- 5. Cocher "Auto Confirm User"
-- 6. Cliquer sur "Create user"

-- Après avoir créé l'utilisateur, récupérez son ID dans la liste des utilisateurs
-- puis exécutez cette requête en remplaçant 'USER_ID' par l'ID réel:

-- Créer ou mettre à jour le profil avec le rôle admin
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  'USER_ID', -- REMPLACER PAR L'ID DE L'UTILISATEUR CRÉÉ
  'thierry1804@gmail.com',
  'Thierry Randriantiana',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Thierry Randriantiana',
  updated_at = NOW();

-- Vérifier que le profil a été créé/mis à jour
SELECT * FROM public.profiles WHERE email = 'thierry1804@gmail.com';

-- Vérifier les permissions de l'utilisateur
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at
FROM public.profiles p
WHERE p.email = 'thierry1804@gmail.com';

