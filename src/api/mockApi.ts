import { Tour, ShuttleSchedule } from '../types';

// Données des circuits touristiques
const tours: Tour[] = [
  {
    id: 1,
    title: "Escapade à la Plage d'Antsanitia",
    shortDescription: "Découvrez les plages immaculées d'Antsanitia",
    fullDescription: "Évadez-vous vers les magnifiques plages d'Antsanitia, où les eaux cristallines rencontrent le sable blanc. Cette excursion d'une journée comprend la plongée avec masque et tuba, des activités de plage et un déjeuner traditionnel malgache avec des fruits de mer frais.",
    duration: "Journée complète (8 heures)",
    price: 75,
    currency: "EUR",
    images: [
      "https://www.linfo.re/IMG/jpg/majunga-6.jpg",
      "https://media-cdn.tripadvisor.com/media/photo-s/06/06/2d/5a/antsanitia-resort.jpg",
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg"
    ],
    highlights: [
      "Baignade dans des eaux cristallines",
      "Déjeuner de fruits de mer traditionnels",
      "Plongée parmi les poissons de récif colorés",
      "Détente sur une plage de sable blanc immaculée"
    ]
  },
  {
    id: 2,
    title: "Lac Sacré & Villages Locaux",
    shortDescription: "Découvrez la culture locale et le lac sacré",
    fullDescription: "Visitez le lac bleu sacré de Mangatsa et découvrez la vie authentique des villages. Rencontrez des artisans locaux, apprenez l'artisanat traditionnel et comprenez l'importance culturelle du lac pour le peuple malgache.",
    duration: "Demi-journée (4 heures)",
    price: 45,
    currency: "EUR",
    images: [
      "https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg",
      "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
      "https://images.pexels.com/photos/5117913/pexels-photo-5117913.jpeg"
    ],
    highlights: [
      "Visite du lac bleu sacré",
      "Échange culturel avec les villageois",
      "Démonstrations d'artisanat traditionnel",
      "Dégustation de fruits et spécialités locales"
    ]
  },
  {
    id: 3,
    title: "Expédition sur le Fleuve Betsiboka",
    shortDescription: "Naviguez sur les eaux rouges du Betsiboka",
    fullDescription: "Voyagez le long des eaux rouges emblématiques du fleuve Betsiboka en pirogue traditionnelle. Observez des écosystèmes uniques, repérez des oiseaux endémiques et admirez les paysages spectaculaires formés par des décennies d'érosion.",
    duration: "Journée complète (9 heures)",
    price: 95,
    currency: "EUR",
    images: [
      "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg",
      "https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg",
      "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg"
    ],
    highlights: [
      "Balade en pirogue traditionnelle",
      "Observation d'oiseaux",
      "Falaises rouges et paysages spectaculaires",
      "Pique-nique sur un banc de sable"
    ]
  },
  {
    id: 4,
    title: "Cirque Rouge & Grottes",
    shortDescription: "Explorez les merveilles géologiques de Majunga",
    fullDescription: "Découvrez les impressionnantes formations rocheuses rouges du Cirque Rouge et explorez des grottes anciennes aux caractéristiques géologiques uniques. Apprenez l'histoire riche de la région et les forces naturelles qui ont façonné ce paysage spectaculaire.",
    duration: "Journée complète (7 heures)",
    price: 85,
    currency: "EUR",
    images: [
      "https://images.pexels.com/photos/2876098/pexels-photo-2876098.jpeg",
      "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg",
      "https://images.pexels.com/photos/15286/pexels-photo.jpg"
    ],
    highlights: [
      "Formations rocheuses rouges spectaculaires",
      "Exploration de grottes anciennes",
      "Vues panoramiques sur la côte",
      "Explications sur l'histoire géologique"
    ]
  }
];

// Horaires des navettes
const shuttleSchedules: ShuttleSchedule[] = [
  {
    id: 1,
    departureTime: "08:00",
    arrivalTime: "08:45",
    from: "Aéroport",
    to: "Ville de Majunga",
    price: 15,
    currency: "EUR",
    availableSeats: 8
  },
  {
    id: 2,
    departureTime: "10:30",
    arrivalTime: "11:15",
    from: "Aéroport",
    to: "Ville de Majunga",
    price: 15,
    currency: "EUR",
    availableSeats: 12
  },
  {
    id: 3,
    departureTime: "14:00",
    arrivalTime: "14:45",
    from: "Aéroport",
    to: "Ville de Majunga",
    price: 15,
    currency: "EUR",
    availableSeats: 10
  },
  {
    id: 4,
    departureTime: "18:30",
    arrivalTime: "19:15",
    from: "Aéroport",
    to: "Ville de Majunga",
    price: 15,
    currency: "EUR",
    availableSeats: 6
  },
  {
    id: 5,
    departureTime: "07:00",
    arrivalTime: "07:45",
    from: "Ville de Majunga",
    to: "Aéroport",
    price: 15,
    currency: "EUR",
    availableSeats: 8
  },
  {
    id: 6,
    departureTime: "09:30",
    arrivalTime: "10:15",
    from: "Ville de Majunga",
    to: "Aéroport",
    price: 15,
    currency: "EUR",
    availableSeats: 12
  },
  {
    id: 7,
    departureTime: "13:00",
    arrivalTime: "13:45",
    from: "Ville de Majunga",
    to: "Aéroport",
    price: 15,
    currency: "EUR",
    availableSeats: 10
  },
  {
    id: 8,
    departureTime: "17:30",
    arrivalTime: "18:15",
    from: "Ville de Majunga",
    to: "Aéroport",
    price: 15,
    currency: "EUR",
    availableSeats: 6
  }
];

// Délai artificiel pour simuler des appels API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTours = async (): Promise<Tour[]> => {
  await delay(800);
  return [...tours];
};

export const fetchTourById = async (id: number): Promise<Tour | undefined> => {
  await delay(500);
  return tours.find(tour => tour.id === id);
};

export const fetchShuttleSchedules = async (): Promise<ShuttleSchedule[]> => {
  await delay(800);
  return [...shuttleSchedules];
};

// Fonction de réservation simulée
export const submitBooking = async (bookingData: BookingFormData): Promise<{ success: boolean, bookingId?: string, error?: string }> => {
  await delay(1500);
  
  // Simulation de réservation réussie 90% du temps
  if (Math.random() > 0.1) {
    return {
      success: true,
      bookingId: `BK${Date.now().toString().substring(5)}`
    };
  }
  
  return {
    success: false,
    error: "Impossible de traiter la réservation. Veuillez réessayer plus tard."
  };
};