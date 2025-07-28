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