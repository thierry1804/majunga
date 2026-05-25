/**
 * Service pour récupérer les données publiques depuis l'API Madabooking
 */
import {
  getPublicTours,
  getPublicShuttleSchedules,
  createPublicBooking,
  getPublicSiteSettingByKey,
  ApiTour,
  ApiShuttleSchedule,
  ApiBooking,
  getImageUrl,
} from './madabookingApi';
import { Tour, ShuttleSchedule } from '../types';

function extractIdFromIri(iri?: string): string | null {
  if (!iri) return null;
  const parts = iri.split('/');
  return parts[parts.length - 1] || null;
}

function resolveImageUrls(apiTour: ApiTour): string[] {
  const urls: string[] = [];

  if (apiTour.imageUrls?.length) {
    for (const entry of apiTour.imageUrls) {
      if (entry.includes('/api/images/') || entry.startsWith('http')) {
        urls.push(entry);
      } else {
        urls.push(getImageUrl(entry.replace(/^\/images\//, '')));
      }
    }
  } else if (apiTour.imageUrl) {
    const legacy = Array.isArray(apiTour.imageUrl) ? apiTour.imageUrl : [apiTour.imageUrl];
    for (const entry of legacy) {
      if (entry.includes('/api/images/') || entry.startsWith('http')) {
        urls.push(entry);
      } else {
        const filename = entry.split('/').pop()?.split('?')[0] || entry;
        urls.push(getImageUrl(filename));
      }
    }
  }

  return urls;
}

function convertApiTourToTour(apiTour: ApiTour, index: number, currency: string): Tour {
  const tourId = apiTour.id || extractIdFromIri(apiTour['@id']) || String(index + 1);

  return {
    id: index + 1,
    supabaseId: tourId,
    title: apiTour.title,
    shortDescription: apiTour.description.length > 150
      ? apiTour.description.substring(0, 150) + '...'
      : apiTour.description,
    fullDescription: apiTour.description,
    duration: apiTour.duration,
    price: parseFloat(apiTour.price) || 0,
    currency,
    images: resolveImageUrls(apiTour),
    highlights: apiTour.highlights || [],
  };
}

function convertApiShuttleToShuttle(apiSchedule: ApiShuttleSchedule, index: number, currency: string): ShuttleSchedule {
  const routeParts = apiSchedule.route.split(' - ');
  const from = apiSchedule.from || routeParts[0] || 'Majunga';
  const to = apiSchedule.to || routeParts[1] || 'Antananarivo';
  const apiId = apiSchedule.id || extractIdFromIri(apiSchedule['@id']) || String(index + 1);

  return {
    id: index + 1,
    apiId,
    departureTime: apiSchedule.departureTime.substring(0, 5),
    arrivalTime: apiSchedule.arrivalTime.substring(0, 5),
    from,
    to,
    direction: apiSchedule.direction,
    price: parseFloat(apiSchedule.price) || 0,
    currency,
    availableSeats: apiSchedule.availableSeats ?? 20,
  };
}

async function getCurrency(): Promise<string> {
  try {
    const setting = await getPublicSiteSettingByKey('currency');
    return setting?.value || 'EUR';
  } catch {
    return 'EUR';
  }
}

export async function getToursFromSupabase(): Promise<Tour[]> {
  try {
    const currency = await getCurrency();
    const apiTours = await getPublicTours();
    return apiTours.map((tour, index) => convertApiTourToTour(tour, index, currency));
  } catch (error) {
    console.error('Erreur lors de la récupération des tours:', error);
    return [];
  }
}

export async function getShuttleSchedulesFromSupabase(): Promise<ShuttleSchedule[]> {
  try {
    const currency = await getCurrency();
    const apiSchedules = await getPublicShuttleSchedules();
    apiSchedules.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    return apiSchedules.map((schedule, index) => convertApiShuttleToShuttle(schedule, index, currency));
  } catch (error) {
    console.error('Erreur lors de la récupération des horaires:', error);
    return [];
  }
}

export async function createBooking(bookingData: {
  tour_id?: string;
  shuttle_id?: string;
  service_type?: 'tour' | 'shuttle';
  user_email: string;
  user_name: string;
  phone?: string;
  special_requests?: string;
  booking_date: string;
  participants: number;
  total_price: number;
  payment_id?: string;
}) {
  const serviceType = bookingData.service_type ?? (bookingData.shuttle_id ? 'shuttle' : 'tour');

  const apiBooking = await createPublicBooking({
    serviceType,
    tour: bookingData.tour_id ? `/api/tours/${bookingData.tour_id}` : undefined,
    shuttleSchedule: bookingData.shuttle_id ? `/api/shuttle_schedules/${bookingData.shuttle_id}` : undefined,
    userEmail: bookingData.user_email,
    userName: bookingData.user_name,
    phone: bookingData.phone,
    specialRequests: bookingData.special_requests,
    bookingDate: bookingData.booking_date,
    participants: bookingData.participants,
    totalPrice: String(bookingData.total_price),
    status: 'pending',
    paymentId: bookingData.payment_id,
  });

  return [{
    id: apiBooking.id || extractIdFromIri(apiBooking['@id']) || '',
    ...apiBooking,
  }];
}

// Alias pour migration progressive
export const getTours = getToursFromSupabase;
export const getShuttleSchedules = getShuttleSchedulesFromSupabase;
