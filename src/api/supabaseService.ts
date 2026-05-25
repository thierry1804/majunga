/**
 * Service pour récupérer les données depuis l'API Madabooking
 * Remplace l'ancien service Supabase
 */
import {
  getTours as getToursFromApi,
  getShuttleSchedules as getShuttleSchedulesFromApi,
  createBooking as createBookingInApi,
  ApiTour,
  ApiShuttleSchedule,
  ApiBooking,
  getImageUrl
} from './madabookingApi'
import { Tour, ShuttleSchedule } from '../types'

// Fonction helper pour extraire l'ID depuis un IRI
function extractIdFromIri(iri?: string): string | null {
  if (!iri) return null
  const parts = iri.split('/')
  return parts[parts.length - 1] || null
}

// Convertir ApiTour vers Tour
function convertApiTourToTour(apiTour: ApiTour, index: number): Tour {
  const tourId = apiTour.id || extractIdFromIri(apiTour['@id']) || String(index + 1)

  // Construire les URLs des images en utilisant l'endpoint GET /api/images/{filename}
  let images: string[] = []
  if (apiTour.imageUrl) {
    // Si l'URL contient déjà /api/images/, utiliser directement
    if (apiTour.imageUrl.includes('/api/images/')) {
      images = [apiTour.imageUrl]
    } else {
      // Extraire le filename de l'URL et construire l'URL complète
      const urlParts = apiTour.imageUrl.split('/')
      let filename = urlParts[urlParts.length - 1] || ''
      // Enlever les paramètres de query si présents
      filename = filename.split('?')[0]

      if (filename) {
        // Utiliser l'endpoint GET /api/images/{filename} pour récupérer l'image
        images = [getImageUrl(filename)]
      } else {
        // Si on ne peut pas extraire le filename, utiliser l'URL telle quelle
        images = [apiTour.imageUrl]
      }
    }
  }

  return {
    id: index + 1, // ID numérique pour la compatibilité avec l'interface
    supabaseId: tourId, // ID original de l'API pour les réservations
    title: apiTour.title,
    shortDescription: apiTour.description.length > 150
      ? apiTour.description.substring(0, 150) + '...'
      : apiTour.description,
    fullDescription: apiTour.description,
    duration: apiTour.duration,
    price: parseFloat(apiTour.price) || 0,
    currency: 'EUR',
    images: images,
    highlights: apiTour.highlights || []
  }
}

// Convertir ApiShuttleSchedule vers ShuttleSchedule
function convertApiShuttleToShuttle(apiSchedule: ApiShuttleSchedule, index: number): ShuttleSchedule {
// Parser l'itinéraire pour extraire from/to
  const routeParts = apiSchedule.route.split(' - ')
  const from = routeParts[0] || 'Majunga'
  const to = routeParts[1] || 'Antananarivo'

  return {
    id: index + 1, // ID numérique pour la compatibilité
    departureTime: apiSchedule.departureTime,
    arrivalTime: apiSchedule.arrivalTime,
    from,
    to,
    price: parseFloat(apiSchedule.price) || 0,
    currency: 'EUR',
    availableSeats: 20 // Valeur par défaut
  }
}

// Service pour récupérer les tours depuis l'API Madabooking
export async function getToursFromSupabase(): Promise<Tour[]> {
  try {
    const apiTours = await getToursFromApi()

    // Filtrer uniquement les tours actifs
    const activeTours = apiTours.filter(tour => tour.isActive !== false)

    // Convertir et retourner
    return activeTours.map((tour, index) => convertApiTourToTour(tour, index))
  } catch (error) {
    console.error('Erreur lors de la récupération des tours:', error)
    return []
  }
}

// Service pour récupérer les horaires de navette depuis l'API Madabooking
export async function getShuttleSchedulesFromSupabase(): Promise<ShuttleSchedule[]> {
  try {
    const apiSchedules = await getShuttleSchedulesFromApi()

    // Filtrer uniquement les horaires actifs
    const activeSchedules = apiSchedules.filter(schedule => schedule.isActive !== false)

    // Trier par heure de départ
    activeSchedules.sort((a, b) => a.departureTime.localeCompare(b.departureTime))

    // Convertir et retourner
    return activeSchedules.map((schedule, index) => convertApiShuttleToShuttle(schedule, index))
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
    console.log('Tentative de création de réservation dans l\'API Madabooking:', bookingData)

    // Construire l'IRI du tour si tour_id est fourni
    const tourIri = bookingData.tour_id
      ? `/api/tours/${bookingData.tour_id}`
      : undefined

    const apiBooking = await createBookingInApi({
      tour: tourIri,
      userEmail: bookingData.user_email,
      userName: bookingData.user_name,
      bookingDate: bookingData.booking_date,
      participants: bookingData.participants,
      totalPrice: String(bookingData.total_price),
      status: 'pending',
      paymentId: bookingData.payment_id
    })

    console.log('Réservation créée avec succès dans l\'API Madabooking:', apiBooking)

    // Retourner dans le format attendu (tableau pour compatibilité)
    return [{
      id: apiBooking.id || extractIdFromIri(apiBooking['@id']) || '',
      ...apiBooking
    }]
  } catch (error: any) {
    console.error('Erreur lors de la création de la réservation:', error)
    throw error
  }
}
