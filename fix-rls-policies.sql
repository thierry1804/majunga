-- Script pour corriger les politiques RLS qui causent une récursion infinie
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- 1. Supprimer TOUTES les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les admins peuvent voir tous les profils" ON public.profiles;
DROP POLICY IF EXISTS "Tout le monde peut voir les tours actifs" ON public.tours;
DROP POLICY IF EXISTS "Les admins et éditeurs peuvent gérer les tours" ON public.tours;
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leurs propres réservations" ON public.bookings;
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer des réservations" ON public.bookings;
DROP POLICY IF EXISTS "Les admins peuvent gérer toutes les réservations" ON public.bookings;
DROP POLICY IF EXISTS "Tout le monde peut voir les horaires actifs" ON public.shuttle_schedules;
DROP POLICY IF EXISTS "Les admins et éditeurs peuvent gérer les horaires" ON public.shuttle_schedules;

-- 2. Créer des politiques RLS simplifiées sans récursion

-- Politiques pour profiles (sans récursion)
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politiques pour tours (accès public en lecture, admin en écriture)
CREATE POLICY "Tout le monde peut voir les tours actifs" ON public.tours
  FOR SELECT USING (is_active = true);

-- Politique temporaire pour permettre la gestion des tours (à restreindre plus tard)
CREATE POLICY "Authenticated users can manage tours" ON public.tours
  FOR ALL USING (auth.role() = 'authenticated');

-- Politiques pour bookings
CREATE POLICY "Les utilisateurs peuvent voir leurs propres réservations" ON public.bookings
  FOR SELECT USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Les utilisateurs peuvent créer des réservations" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Politique temporaire pour permettre la gestion des réservations
CREATE POLICY "Authenticated users can manage bookings" ON public.bookings
  FOR ALL USING (auth.role() = 'authenticated');

-- Politiques pour shuttle_schedules
CREATE POLICY "Tout le monde peut voir les horaires actifs" ON public.shuttle_schedules
  FOR SELECT USING (is_active = true);

-- Politique temporaire pour permettre la gestion des horaires
CREATE POLICY "Authenticated users can manage shuttle schedules" ON public.shuttle_schedules
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Vérifier que les politiques sont correctement appliquées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
