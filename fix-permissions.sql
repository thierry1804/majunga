-- Script pour corriger les permissions et permettre l'accès aux données
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- 1. Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Tout le monde peut voir les tours actifs" ON public.tours;
DROP POLICY IF EXISTS "Authenticated users can manage tours" ON public.tours;
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leurs propres réservations" ON public.bookings;
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer des réservations" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can manage bookings" ON public.bookings;
DROP POLICY IF EXISTS "Tout le monde peut voir les horaires actifs" ON public.shuttle_schedules;
DROP POLICY IF EXISTS "Authenticated users can manage shuttle schedules" ON public.shuttle_schedules;

-- 2. Créer des politiques plus permissives pour l'admin

-- Politiques pour profiles
CREATE POLICY "Profiles access for authenticated users" ON public.profiles
  FOR ALL USING (auth.role() = 'authenticated');

-- Politiques pour tours
CREATE POLICY "Tours public read access" ON public.tours
  FOR SELECT USING (true);

CREATE POLICY "Tours management for authenticated users" ON public.tours
  FOR ALL USING (auth.role() = 'authenticated');

-- Politiques pour bookings
CREATE POLICY "Bookings public read access" ON public.bookings
  FOR SELECT USING (true);

CREATE POLICY "Bookings management for authenticated users" ON public.bookings
  FOR ALL USING (auth.role() = 'authenticated');

-- Politiques pour shuttle_schedules
CREATE POLICY "Shuttle schedules public read access" ON public.shuttle_schedules
  FOR SELECT USING (true);

CREATE POLICY "Shuttle schedules management for authenticated users" ON public.shuttle_schedules
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Vérifier que les politiques sont appliquées
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
