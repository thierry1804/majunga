-- Script pour corriger l'accès en lecture aux profils
-- Exécuter ce script dans l'éditeur SQL de Supabase
-- Ce script garantit que les utilisateurs peuvent lire leur propre profil

-- 1. Vérifier les politiques existantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- 2. Supprimer les anciennes politiques pour profiles si elles existent
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les admins peuvent voir tous les profils" ON public.profiles;

-- 3. Créer les nouvelles politiques pour profiles (sans récursion)

-- Les utilisateurs peuvent voir leur propre profil (CRITIQUE pour la récupération)
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Les utilisateurs peuvent créer leur propre profil
CREATE POLICY "Les utilisateurs peuvent créer leur propre profil" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- NOTE: La politique pour les admins est supprimée pour éviter la récursion
-- Les admins peuvent toujours voir leur propre profil via la première politique
-- Pour voir tous les profils, les admins devront utiliser une fonction SECURITY DEFINER

-- 4. Créer une fonction SECURITY DEFINER pour récupérer le profil (contournement RLS si nécessaire)
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile public.profiles;
BEGIN
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN user_profile;
END;
$$;

-- Donner les permissions d'exécution aux utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION public.get_user_profile(UUID) TO authenticated;

-- 5. Vérifier que les politiques sont correctement appliquées
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- 6. Tester l'accès pour un utilisateur spécifique (remplacer l'email)
-- SELECT * FROM public.profiles WHERE email = 'thierry1804@gmail.com';

