// Types pour l'interface publique (compatibilité avec l'existant)
export interface Tour {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  price: number;
  currency: string;
  images: string[];
  highlights: string[];
}

// Types Supabase pour l'interface admin
export interface SupabaseTour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  highlights: string[];
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShuttleSchedule {
  id: number;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  price: number;
  currency: string;
  availableSeats: number;
}

// Types Supabase pour les navettes
export interface SupabaseShuttleSchedule {
  id: string;
  departure_time: string;
  arrival_time: string;
  route: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  service: 'tour' | 'shuttle';
  serviceId: number;
  date: string;
  numberOfPeople: number;
  specialRequests?: string;
}