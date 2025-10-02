-- Schéma de base de données pour MadaBooking avec Supabase
-- Exécuter ces requêtes dans l'éditeur SQL de Supabase

-- 1. Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Créer la table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'editor', 'user')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table des tours
CREATE TABLE IF NOT EXISTS public.tours (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT NOT NULL,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table des réservations
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  booking_date DATE NOT NULL,
  participants INTEGER NOT NULL CHECK (participants > 0),
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Créer la table des horaires de navette
CREATE TABLE IF NOT EXISTS public.shuttle_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  route TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON public.tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shuttle_schedules_updated_at BEFORE UPDATE ON public.shuttle_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Fonction pour créer un profil utilisateur automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Trigger pour créer un profil lors de l'inscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Politiques RLS (Row Level Security)

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shuttle_schedules ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Les admins peuvent voir tous les profils" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour tours
CREATE POLICY "Tout le monde peut voir les tours actifs" ON public.tours
  FOR SELECT USING (is_active = true);

CREATE POLICY "Les admins et éditeurs peuvent gérer les tours" ON public.tours
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Politiques pour bookings
CREATE POLICY "Les utilisateurs peuvent voir leurs propres réservations" ON public.bookings
  FOR SELECT USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Les utilisateurs peuvent créer des réservations" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Les admins peuvent gérer toutes les réservations" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour shuttle_schedules
CREATE POLICY "Tout le monde peut voir les horaires actifs" ON public.shuttle_schedules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Les admins et éditeurs peuvent gérer les horaires" ON public.shuttle_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- 11. Insérer des données de test

-- Insérer des tours de démonstration
INSERT INTO public.tours (title, description, price, duration, highlights, is_active) VALUES
('Tour de la Baie de Baly', 'Découvrez la magnifique baie de Baly avec ses paysages époustouflants', 150.00, '1 jour', ARRAY['Observation des baleines', 'Plage paradisiaque', 'Déjeuner traditionnel'], true),
('Excursion Ankarafantsika', 'Explorez le parc national d''Ankarafantsika et sa faune unique', 200.00, '2 jours', ARRAY['Observation des lémuriens', 'Randonnée dans la forêt', 'Camping sous les étoiles'], true),
('Tour culturel de Majunga', 'Immersion dans la culture et l''histoire de Majunga', 80.00, 'Demi-journée', ARRAY['Visite du marché local', 'Découverte de l''architecture coloniale', 'Dégustation de spécialités'], true);

-- Insérer des horaires de navette de démonstration
INSERT INTO public.shuttle_schedules (departure_time, arrival_time, route, price, is_active) VALUES
('08:00', '10:30', 'Majunga - Antananarivo', 45.00, true),
('14:00', '16:30', 'Majunga - Antananarivo', 45.00, true),
('09:00', '11:00', 'Majunga - Mahajanga', 25.00, true),
('15:00', '17:00', 'Majunga - Mahajanga', 25.00, true);

-- 12. Créer un utilisateur admin par défaut (à exécuter après avoir créé un compte)
-- Remplacer 'admin@madabooking.com' par l'email de votre compte admin
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@madabooking.com';
