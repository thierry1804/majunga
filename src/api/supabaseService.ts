import { supabase } from '../lib/supabase'
import { Tour, ShuttleSchedule } from '../types'

// Service pour récupérer les tours depuis Supabase
export async function getToursFromSupabase(): Promise<Tour[]> {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des tours:', error)
      return []
    }

    // Convertir les données Supabase vers le format attendu par l'interface publique
    return data.map((tour, index) => ({
      id: index + 1, // ID numérique pour la compatibilité
      title: tour.title,
      shortDescription: tour.description.substring(0, 150) + '...',
      fullDescription: tour.description,
      duration: tour.duration,
      price: tour.price,
      currency: 'EUR',
      images: tour.image_url ? [tour.image_url] : [],
      highlights: tour.highlights
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des tours:', error)
    return []
  }
}

// Service pour récupérer les horaires de navette depuis Supabase
export async function getShuttleSchedulesFromSupabase(): Promise<ShuttleSchedule[]> {
  try {
    const { data, error } = await supabase
      .from('shuttle_schedules')
      .select('*')
      .eq('is_active', true)
      .order('departure_time', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des horaires:', error)
      return []
    }

    // Convertir les données Supabase vers le format attendu par l'interface publique
    return data.map((schedule, index) => {
      // Parser l'itinéraire pour extraire from/to
      const routeParts = schedule.route.split(' - ')
      const from = routeParts[0] || 'Majunga'
      const to = routeParts[1] || 'Antananarivo'

      return {
        id: index + 1, // ID numérique pour la compatibilité
        departureTime: schedule.departure_time,
        arrivalTime: schedule.arrival_time,
        from,
        to,
        price: schedule.price,
        currency: 'EUR',
        availableSeats: 20 // Valeur par défaut
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des horaires:', error)
    return []
  }
}

// Service pour créer une réservation
export async function createBooking(bookingData: {
  tour_id?: string
  user_email: string
  user_name: string
  booking_date: string
  participants: number
  total_price: number
  payment_id?: string
}) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        status: 'pending'
      }])
      .select()

    if (error) {
      console.error('Erreur lors de la création de la réservation:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error)
    throw error
  }
}
