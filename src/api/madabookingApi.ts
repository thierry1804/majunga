/**
 * Service API pour l'API Madabooking (Hydra)
 * Documentation: https://api.madabooking.mg/api/docs
 * 
 * URLs:
 * - Dev: https://127.0.0.1:8000/api/
 * - Prod: https://api.madabooking.mg/api
 */

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_MADABOOKING_API_URL || 
  (import.meta.env.DEV 
    ? 'https://127.0.0.1:8000/api' 
    : 'https://api.madabooking.mg/api');

// Types pour l'API Hydra
export interface HydraCollection<T> {
  '@context': string;
  '@id': string;
  '@type': 'hydra:Collection';
  'hydra:member': T[];
  'hydra:totalItems': number;
  'hydra:view'?: {
    '@id': string;
    '@type': 'hydra:PartialCollectionView';
    'hydra:first'?: string;
    'hydra:last'?: string;
    'hydra:next'?: string;
    'hydra:previous'?: string;
  };
}

export interface HydraError {
  '@context': string;
  '@type': 'hydra:Error';
  'hydra:title': string;
  'hydra:description': string;
  'violations'?: Array<{
    propertyPath: string;
    message: string;
  }>;
}

// Types pour les ressources de l'API
export interface ApiTour {
  '@id'?: string;
  '@type'?: string;
  id?: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  highlights: string[];
  imageUrl?: string | string[]; // Pour compatibilité (ancien format)
  imageUrls?: string[]; // Tableau de filenames (nouveau format)
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiBooking {
  '@id'?: string;
  '@type'?: string;
  id?: string;
  serviceType?: 'tour' | 'shuttle';
  tour?: string;
  shuttleSchedule?: string;
  userEmail: string;
  userName: string;
  phone?: string;
  specialRequests?: string;
  bookingDate: string;
  participants: number;
  totalPrice: string;
  status?: string;
  paymentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiShuttleSchedule {
  '@id'?: string;
  '@type'?: string;
  id?: string;
  departureTime: string;
  arrivalTime: string;
  route: string;
  from?: string;
  to?: string;
  price: string;
  direction?: 'airport-to-city' | 'city-to-airport';
  availableSeats?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiUser {
  '@id'?: string;
  '@type'?: string;
  id?: string;
  email: string;
  password?: string; // Seulement pour la création
  roles?: string[]; // Rôles de l'utilisateur (ROLE_ADMIN, ROLE_USER, ROLE_EDITOR)
}

export interface ApiSiteSetting {
  '@id'?: string;
  '@type'?: string;
  id?: string;
  key: string;
  value: string | null;
  valueType: string; // "boolean", "string", "number", "json"
  description?: string | null;
  category?: string;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiEntrypoint {
  '@context': string;
  '@id': string;
  '@type': 'Entrypoint';
  booking: string;
  shuttleSchedule: string;
  tour: string;
  user: string;
  siteSetting?: string;
}

// Fonction helper pour gérer les erreurs
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Si le token a expiré (401), déconnecter l'utilisateur
    if (response.status === 401) {
      const errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
      
      // Nettoyer le token et l'utilisateur stocké
      clearAuthToken();
      
      // Déclencher un événement personnalisé pour notifier l'application
      window.dispatchEvent(new CustomEvent('auth:token-expired', { 
        detail: { message: errorMessage } 
      }));
      
      const error = new Error(errorMessage);
      (error as any).status = 401;
      (error as any).isTokenExpired = true;
      throw error;
    }
    
    let errorData: HydraError | { message: string };
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    
    const error = new Error(
      (errorData as HydraError)['hydra:description'] || 
      (errorData as { message: string }).message || 
      'Une erreur est survenue'
    );
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  // Si la réponse est vide (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Gestion du token d'authentification
const AUTH_TOKEN_KEY = 'madabooking_auth_token';
const AUTH_USER_KEY = 'madabooking_auth_user';

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredUser(): any | null {
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function setStoredUser(user: any): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

// Fonction helper pour construire les headers
function getHeaders(includeAuth = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/ld+json',
  };

  // Ajouter le token d'authentification si nécessaire
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

function getPublicHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

/**
 * API PUBLIQUE (sans authentification)
 */

export async function getPublicTours(): Promise<ApiTour[]> {
  const response = await fetch(`${API_BASE_URL}/public/tours`, {
    method: 'GET',
    headers: getPublicHeaders(),
  });

  return handleResponse<ApiTour[]>(response);
}

export async function getPublicShuttleSchedules(direction?: string): Promise<ApiShuttleSchedule[]> {
  const url = direction
    ? `${API_BASE_URL}/public/shuttle_schedules?direction=${encodeURIComponent(direction)}`
    : `${API_BASE_URL}/public/shuttle_schedules`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getPublicHeaders(),
  });

  return handleResponse<ApiShuttleSchedule[]>(response);
}

export async function createPublicBooking(
  booking: Omit<ApiBooking, 'id' | '@id' | '@type' | 'createdAt' | 'updatedAt'>
): Promise<ApiBooking> {
  const response = await fetch(`${API_BASE_URL}/public/bookings`, {
    method: 'POST',
    headers: getPublicHeaders(),
    body: JSON.stringify(booking),
  });

  return handleResponse<ApiBooking>(response);
}

export async function createPayPalOrder(bookingId: string, amount: number, currency: string): Promise<{ orderId: string; status: string }> {
  const response = await fetch(`${API_BASE_URL}/public/paypal/create-order`, {
    method: 'POST',
    headers: getPublicHeaders(),
    body: JSON.stringify({ bookingId, amount, currency }),
  });

  return handleResponse(response);
}

export async function capturePayPalOrder(orderId: string, bookingId: string): Promise<{ capture: { captureId: string; status: string }; booking: ApiBooking }> {
  const response = await fetch(`${API_BASE_URL}/public/paypal/capture-order`, {
    method: 'POST',
    headers: getPublicHeaders(),
    body: JSON.stringify({ orderId, bookingId }),
  });

  return handleResponse(response);
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/public/password/request-reset`, {
    method: 'POST',
    headers: getPublicHeaders(),
    body: JSON.stringify({ email }),
  });

  return handleResponse(response);
}

export async function resetPasswordWithToken(token: string, password: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/public/password/reset`, {
    method: 'POST',
    headers: getPublicHeaders(),
    body: JSON.stringify({ token, password }),
  });

  return handleResponse(response);
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/password/change`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  return handleResponse(response);
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });

  await handleResponse(response);
}

export async function promoteUser(id: string, role: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}/promote`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ role }),
  });

  await handleResponse(response);
}

/**
 * Récupère le point d'entrée de l'API
 */
export async function getEntrypoint(): Promise<ApiEntrypoint> {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  return handleResponse<ApiEntrypoint>(response);
}

/**
 * TOURS
 */

/**
 * Récupère la collection de tours
 */
export async function getTours(): Promise<ApiTour[]> {
  const response = await fetch(`${API_BASE_URL}/tours`, {
    method: 'GET',
    headers: getHeaders(true),
  });

  const collection = await handleResponse<any>(response);
  // L'API peut retourner 'hydra:member' (format Hydra standard) ou 'member' (format simplifié)
  return collection['hydra:member'] || collection['member'] || [];
}

/**
 * Récupère un tour par son ID
 */
export async function getTour(id: string): Promise<ApiTour> {
  const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
    method: 'GET',
    headers: getHeaders(true),
  });

  return handleResponse<ApiTour>(response);
}

/**
 * Crée un nouveau tour
 */
export async function createTour(tour: Omit<ApiTour, 'id' | '@id' | '@type' | 'createdAt' | 'updatedAt'>): Promise<ApiTour> {
  // Créer un objet avec tous les champs
  // Utiliser 'any' pour éviter que TypeScript ne filtre les propriétés
  const tourData: any = {
    title: tour.title,
    description: tour.description,
    price: tour.price,
    duration: tour.duration,
    highlights: tour.highlights,
    isActive: tour.isActive,
  };
  
  // Gérer les images : extraire les filenames
  let imageFilenames: string[] = [];
  
  if (tour.imageUrls !== undefined && Array.isArray(tour.imageUrls)) {
    imageFilenames = tour.imageUrls;
  } else if (tour.imageUrls !== undefined) {
    imageFilenames = [tour.imageUrls as any];
  } else if (tour.imageUrl !== undefined) {
    imageFilenames = Array.isArray(tour.imageUrl) ? tour.imageUrl : [tour.imageUrl];
  }
  
  // IMPORTANT: L'API backend attend probablement imageUrls (pluriel) comme tableau
  // Mais si elle n'accepte que imageUrl (singulier), on envoie les deux formats
  // On envoie imageUrls comme tableau (format correct pour plusieurs images)
  tourData.imageUrls = imageFilenames;
  
  // Si l'API n'accepte que imageUrl (singulier), elle peut accepter un tableau
  // On envoie aussi imageUrl au cas où l'API ne reconnaît pas imageUrls
  if (imageFilenames.length > 0) {
    // Essayer d'envoyer imageUrl comme tableau (l'API peut l'accepter même si la doc dit string)
    tourData.imageUrl = imageFilenames;
  }
  
  console.log('=== DEBUG createTour ===');
  console.log('imageFilenames extraits:', imageFilenames);
  console.log('Body complet à envoyer:', JSON.stringify(tourData, null, 2));
  console.log('imageUrls (pluriel):', tourData.imageUrls);
  console.log('imageUrl (singulier):', tourData.imageUrl);
  console.log('Type de imageUrls:', typeof tourData.imageUrls, Array.isArray(tourData.imageUrls));
  console.log('Type de imageUrl:', typeof tourData.imageUrl, Array.isArray(tourData.imageUrl));
  
  const response = await fetch(`${API_BASE_URL}/tours`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(tourData),
  });

  return handleResponse<ApiTour>(response);
}

/**
 * Met à jour un tour (PUT - remplace complètement)
 */
export async function updateTour(id: string, tour: Omit<ApiTour, 'id' | '@id' | '@type' | 'createdAt' | 'updatedAt'>): Promise<ApiTour> {
  // Créer un objet avec tous les champs
  // Utiliser 'any' pour éviter que TypeScript ne filtre les propriétés
  const tourData: any = {
    title: tour.title,
    description: tour.description,
    price: tour.price,
    duration: tour.duration,
    highlights: tour.highlights,
    isActive: tour.isActive,
  };
  
  // Gérer les images : extraire les filenames
  let imageFilenames: string[] = [];
  
  if (tour.imageUrls !== undefined && Array.isArray(tour.imageUrls)) {
    imageFilenames = tour.imageUrls;
  } else if (tour.imageUrls !== undefined) {
    imageFilenames = [tour.imageUrls as any];
  } else if (tour.imageUrl !== undefined) {
    imageFilenames = Array.isArray(tour.imageUrl) ? tour.imageUrl : [tour.imageUrl];
  }
  
  // L'API attend probablement imageUrl (singulier) selon la documentation
  // Mais elle peut accepter un tableau même si la doc dit string
  // On envoie les deux formats pour être sûr : imageUrl et imageUrls
  if (imageFilenames.length > 0) {
    // Envoyer imageUrl avec le tableau (l'API peut accepter un tableau même si la doc dit string)
    tourData.imageUrl = imageFilenames;
    // Aussi envoyer imageUrls au cas où l'API l'accepte
    tourData.imageUrls = imageFilenames;
  } else {
    // Même vide, envoyer les deux champs
    tourData.imageUrl = [];
    tourData.imageUrls = [];
  }
  
  console.log('Envoi de updateTour avec:', JSON.stringify(tourData, null, 2));
  console.log('imageUrl dans tourData:', tourData.imageUrl);
  console.log('imageUrls dans tourData:', tourData.imageUrls);
  
  const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(tourData),
  });

  return handleResponse<ApiTour>(response);
}

/**
 * Met à jour partiellement un tour (PATCH)
 */
export async function patchTour(id: string, tour: Partial<ApiTour>): Promise<ApiTour> {
  const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
    method: 'PATCH',
    headers: {
      ...getHeaders(true),
      'Content-Type': 'application/merge-patch+json',
    },
    body: JSON.stringify(tour),
  });

  return handleResponse<ApiTour>(response);
}

/**
 * Supprime un tour
 */
export async function deleteTour(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });

  await handleResponse(response);
}

/**
 * BOOKINGS
 */

/**
 * Récupère la collection de réservations
 */
export async function getBookings(): Promise<ApiBooking[]> {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'GET',
    headers: getHeaders(true),
  });

  const collection = await handleResponse<any>(response);
  // L'API peut retourner 'hydra:member' (format Hydra standard) ou 'member' (format simplifié)
  return collection['hydra:member'] || collection['member'] || [];
}

/**
 * Récupère une réservation par son ID
 */
export async function getBooking(id: string): Promise<ApiBooking> {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: 'GET',
    headers: getHeaders(true),
  });

  return handleResponse<ApiBooking>(response);
}

/**
 * Crée une nouvelle réservation
 */
export async function createBooking(booking: Omit<ApiBooking, 'id' | '@id' | '@type' | 'createdAt' | 'updatedAt'>): Promise<ApiBooking> {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(booking),
  });

  return handleResponse<ApiBooking>(response);
}

/**
 * Met à jour une réservation (PUT)
 */
export async function updateBooking(id: string, booking: Omit<ApiBooking, 'id' | '@id' | '@type' | 'createdAt' | 'updatedAt'>): Promise<ApiBooking> {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(booking),
  });

  return handleResponse<ApiBooking>(response);
}

/**
 * Met à jour partiellement une réservation (PATCH)
 */
export async function patchBooking(id: string, booking: Partial<ApiBooking>): Promise<ApiBooking> {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: 'PATCH',
    headers: {
      ...getHeaders(true),
      'Content-Type': 'application/merge-patch+json',
    },
    body: JSON.stringify(booking),
  });

  return handleResponse<ApiBooking>(response);
}

/**
 * Supprime une réservation
 */
export async function deleteBooking(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });

  await handleResponse(response);
}

/**
 * SHUTTLE SCHEDULES
 */

/**
 * Récupère la collection d'horaires de navette
 */
export async function getShuttleSchedules(): Promise<ApiShuttleSchedule[]> {
  const response = await fetch(`${API_BASE_URL}/shuttle_schedules`, {
    method: 'GET',
    headers: getHeaders(true),
  });

  const collection = await handleResponse<any>(response);
  // L'API peut retourner 'hydra:member' (format Hydra standard) ou 'member' (format simplifié)
  return collection['hydra:member'] || collection['member'] || [];
}

/**
 * Récupère un horaire de navette par son ID
 */
export async function getShuttleSchedule(id: string): Promise<ApiShuttleSchedule> {
  const response = await fetch(`${API_BASE_URL}/shuttle_schedules/${id}`, {
    method: 'GET',
    headers: getHeaders(true),
  });

  return handleResponse<ApiShuttleSchedule>(response);
}

/**
 * Crée un nouvel horaire de navette
 */
export async function createShuttleSchedule(schedule: Omit<ApiShuttleSchedule, 'id' | '@id' | '@type' | 'createdAt' | 'updatedAt'>): Promise<ApiShuttleSchedule> {
  const response = await fetch(`${API_BASE_URL}/shuttle_schedules`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(schedule),
  });

  return handleResponse<ApiShuttleSchedule>(response);
}

/**
 * Met à jour un horaire de navette (PUT)
 */
export async function updateShuttleSchedule(id: string, schedule: Omit<ApiShuttleSchedule, 'id' | '@id' | '@type' | 'createdAt' | 'updatedAt'>): Promise<ApiShuttleSchedule> {
  const response = await fetch(`${API_BASE_URL}/shuttle_schedules/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(schedule),
  });

  return handleResponse<ApiShuttleSchedule>(response);
}

/**
 * Met à jour partiellement un horaire de navette (PATCH)
 */
export async function patchShuttleSchedule(id: string, schedule: Partial<ApiShuttleSchedule>): Promise<ApiShuttleSchedule> {
  const response = await fetch(`${API_BASE_URL}/shuttle_schedules/${id}`, {
    method: 'PATCH',
    headers: {
      ...getHeaders(true),
      'Content-Type': 'application/merge-patch+json',
    },
    body: JSON.stringify(schedule),
  });

  return handleResponse<ApiShuttleSchedule>(response);
}

/**
 * Supprime un horaire de navette
 */
export async function deleteShuttleSchedule(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/shuttle_schedules/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });

  await handleResponse(response);
}

/**
 * USERS
 */

/**
 * Récupère la collection d'utilisateurs
 */
export async function getUsers(): Promise<ApiUser[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: getHeaders(true),
  });

  const collection = await handleResponse<HydraCollection<ApiUser>>(response);
  return collection['hydra:member'] || [];
}

/**
 * Récupère un utilisateur par son ID
 */
export async function getUser(id: string): Promise<ApiUser> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'GET',
    headers: getHeaders(true),
  });

  return handleResponse<ApiUser>(response);
}

/**
 * Crée un nouvel utilisateur
 */
export async function createUser(user: Omit<ApiUser, 'id' | '@id' | '@type'>): Promise<ApiUser> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(user),
  });

  return handleResponse<ApiUser>(response);
}

/**
 * AUTHENTIFICATION
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user: ApiUser;
}

/**
 * Authentifie un utilisateur avec email et mot de passe
 * Essaie plusieurs méthodes d'authentification selon l'API
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // L'API utilise /api/login avec username et password (selon la documentation)
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.email, // L'API utilise 'username' mais on passe l'email
        password: credentials.password,
      }),
    });

    if (loginResponse.ok) {
      const data = await loginResponse.json();
      const token = data.token;
      
      if (!token) {
        clearAuthToken();
        throw new Error('Token non reçu de l\'API');
      }

      console.log('[login] Authentification réussie via /api/login');
      
      // Récupérer les informations de l'utilisateur avec /api/me
      try {
        const meResponse = await fetch(`${API_BASE_URL}/me`, {
          method: 'GET',
          headers: {
            'Accept': 'application/ld+json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (meResponse.ok) {
          const meData = await meResponse.json();
          // La réponse de /me peut être {valid: true, user: {...}} ou directement l'utilisateur
          const user = meData.user || meData;
          setAuthToken(token);
          setStoredUser(user);
          return { token, user };
        }
      } catch (e) {
        console.log('[login] Impossible de récupérer l\'utilisateur via /api/me, essai avec /api/users');
        
        // Fallback: essayer de récupérer depuis /api/users
        try {
          const userResponse = await fetch(`${API_BASE_URL}/users`, {
            headers: {
              'Accept': 'application/ld+json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const collection = await userResponse.json();
            const users = collection['hydra:member'] || [];
            const user = users.find((u: ApiUser) => u.email === credentials.email);
            
            if (user) {
              setAuthToken(token);
              setStoredUser(user);
              return { token, user };
            }
          }
        } catch (e2) {
          // Ignorer cette erreur
        }
      }

      // Si on ne peut pas récupérer l'utilisateur, créer un objet basique
      const user = { email: credentials.email, id: '' };
      setAuthToken(token);
      setStoredUser(user);
      return { token, user };
    } else {
      // Gérer les erreurs
      let errorMessage = 'Email ou mot de passe incorrect';
      
      try {
        const errorData = await loginResponse.json();
        errorMessage = errorData.message || errorData['hydra:description'] || errorMessage;
      } catch (parseError) {
        // Utiliser le message par défaut
      }

      clearAuthToken();
      
      if (loginResponse.status === 401) {
        throw new Error(errorMessage);
      } else if (loginResponse.status === 400) {
        throw new Error('Requête invalide. Vérifiez vos identifiants.');
      } else {
        throw new Error(`Erreur de connexion (${loginResponse.status}): ${errorMessage}`);
      }
    }
  } catch (e: any) {
    clearAuthToken();
    // Si l'erreur est déjà formatée, la propager
    if (e.message) {
      throw e;
    }
    throw new Error('Erreur de connexion à l\'API');
  }

}

/**
 * Déconnecte l'utilisateur
 */
export function logout(): void {
  clearAuthToken();
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Récupère l'utilisateur actuellement authentifié
 */
export function getCurrentUser(): ApiUser | null {
  return getStoredUser();
}

/**
 * Récupère les informations de l'utilisateur actuellement authentifié depuis /me
 */
export async function getMe(): Promise<ApiUser> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Non authentifié');
  }

  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/ld+json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer les informations utilisateur');
  }

  const meData = await response.json();
  // La réponse de /me peut être {valid: true, user: {...}} ou directement l'utilisateur
  const user = meData.user || meData;
  
  // Mettre à jour l'utilisateur stocké
  setStoredUser(user);
  
  return user;
}

/**
 * IMAGES
 */

export interface ImageUploadResponse {
  filename: string;
  url: string;
}

/**
 * Construit l'URL pour récupérer une image via un chemin moins évident
 * Utilise un proxy Vite en développement et un chemin personnalisé en production
 */
export function getImageUrl(filename: string): string {
  // En développement, utiliser le proxy Vite : /img/{filename}
  // En production, utiliser directement l'API ou un chemin personnalisé
  if (import.meta.env.DEV) {
    // Proxy Vite configuré dans vite.config.ts : /img -> /api/images
    return `/img/${filename}`;
  } else {
    // En production, utiliser l'URL complète de l'API
    return `${API_BASE_URL}/images/${filename}`;
  }
}

/**
 * Upload une image et la convertit en WebP
 */
export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Non authentifié');
  }

  // Vérifier que le fichier est valide
  if (!file) {
    throw new Error('Aucun fichier fourni');
  }
  
  if (!(file instanceof File)) {
    throw new Error('Le fichier fourni n\'est pas un objet File valide');
  }
  
  if (file.size === 0) {
    throw new Error('Le fichier est vide');
  }

  const formData = new FormData();
  // L'API attend le champ "image" selon la documentation Swagger
  // Ajouter le fichier avec le nom de champ "image"
  formData.append('image', file);
  
  // Pour debug: vérifier que le fichier est bien dans le FormData
  // Note: FormData.entries() n'est pas toujours disponible, donc on ne peut pas vérifier facilement
  console.log('Upload du fichier:', file.name, file.size, file.type);

  const response = await fetch(`${API_BASE_URL}/images/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Ne pas définir Content-Type, le navigateur le fera automatiquement avec FormData
    },
    body: formData,
  });

  // Gérer les erreurs 401 (token expiré)
  if (response.status === 401) {
    const errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
    clearAuthToken();
    window.dispatchEvent(new CustomEvent('auth:token-expired', { 
      detail: { message: errorMessage } 
    }));
    const error = new Error(errorMessage);
    (error as any).status = 401;
    (error as any).isTokenExpired = true;
    throw error;
  }

  if (!response.ok) {
    let errorMessage = 'Erreur lors de l\'upload de l\'image';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData['hydra:description'] || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }

  const data = await response.json();
  console.log('=== DEBUG UPLOAD IMAGE ===');
  console.log('Réponse brute de l\'API upload:', data);
  console.log('Type de la réponse:', typeof data);
  
  // L'API peut retourner directement le filename ou un objet avec filename et url
  let filename = '';
  
  if (typeof data === 'string') {
    // Si c'est juste une string, c'est probablement le filename
    filename = data;
    console.log('Réponse est une string, filename:', filename);
  } else if (data && typeof data === 'object') {
    // Si c'est un objet, extraire le filename
    // L'API peut retourner { filename: "...", url: "..." } ou { message: "...", filename: "..." }
    console.log('Réponse est un objet, propriétés:', Object.keys(data));
    filename = data.filename || data.name || '';
    console.log('filename extrait de l\'objet:', filename);
    
    // Si pas de filename dans l'objet, essayer d'extraire de l'URL
    if (!filename && data.url) {
      const urlParts = data.url.split('/');
      filename = urlParts[urlParts.length - 1] || '';
      filename = filename.split('?')[0];
      console.log('filename extrait de l\'URL:', filename);
    }
  }
  
  if (!filename || filename === '') {
    console.error('❌ ERREUR: Impossible d\'extraire le filename de la réponse:', data);
    throw new Error(`Impossible d'extraire le filename de la réponse d'upload: ${JSON.stringify(data)}`);
  }
  
  // Construire l'URL en utilisant l'endpoint GET /api/images/{filename}
  // Cet endpoint est accessible publiquement et sert les images en WebP
  const url = filename ? `${API_BASE_URL}/images/${filename}` : '';
  
  console.log('✅ Filename final:', filename);
  console.log('✅ URL construite:', url);
  
  return {
    filename: filename,
    url: url,
  };
}

/**
 * Supprime une image du serveur
 */
export async function deleteImage(filename: string): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Non authentifié');
  }

  const response = await fetch(`${API_BASE_URL}/images/${filename}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // Gérer les erreurs 401 (token expiré)
  if (response.status === 401) {
    const errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
    clearAuthToken();
    window.dispatchEvent(new CustomEvent('auth:token-expired', { 
      detail: { message: errorMessage } 
    }));
    const error = new Error(errorMessage);
    (error as any).status = 401;
    (error as any).isTokenExpired = true;
    throw error;
  }

  if (!response.ok) {
    let errorMessage = 'Erreur lors de la suppression de l\'image';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData['hydra:description'] || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }
}

/**
 * SITE SETTINGS
 */

/**
 * Récupère la collection de tous les paramètres du site
 */
export async function getSiteSettings(): Promise<ApiSiteSetting[]> {
  const response = await fetch(`${API_BASE_URL}/site_settings`, {
    method: 'GET',
    headers: getHeaders(true),
  });

  const collection = await handleResponse<any>(response);
  return collection['hydra:member'] || collection['member'] || [];
}

/**
 * Récupère uniquement les paramètres publics
 */
export async function getPublicSiteSettings(): Promise<ApiSiteSetting[]> {
  const response = await fetch(`${API_BASE_URL}/site_settings?isPublic=true`, {
    method: 'GET',
    headers: getHeaders(false), // Pas besoin d'authentification pour les paramètres publics
  });

  const collection = await handleResponse<any>(response);
  return collection['hydra:member'] || collection['member'] || [];
}

export async function getPublicSiteSettingByKey(key: string): Promise<ApiSiteSetting | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/site-settings/public/${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: getPublicHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    return handleResponse<ApiSiteSetting>(response);
  } catch (error: unknown) {
    if ((error as { status?: number }).status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Récupère un paramètre par sa clé
 */
export async function getSiteSettingByKey(key: string): Promise<ApiSiteSetting | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/site_settings?key=${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: getPublicHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    const data = await handleResponse<any>(response);
    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    }
    return data;
  } catch (error: unknown) {
    if ((error as { status?: number }).status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Récupère un paramètre par son ID
 */
export async function getSiteSetting(id: string): Promise<ApiSiteSetting> {
  const response = await fetch(`${API_BASE_URL}/site_settings/${id}`, {
    method: 'GET',
    headers: getHeaders(true),
  });

  return handleResponse<ApiSiteSetting>(response);
}

/**
 * Crée un nouveau paramètre
 */
export async function createSiteSetting(setting: Omit<ApiSiteSetting, 'id' | '@id' | '@type' | 'createdAt' | 'updatedAt'>): Promise<ApiSiteSetting> {
  const response = await fetch(`${API_BASE_URL}/site_settings`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(setting),
  });

  return handleResponse<ApiSiteSetting>(response);
}

/**
 * Met à jour un paramètre (PUT)
 */
export async function updateSiteSetting(id: string, setting: Omit<ApiSiteSetting, 'id' | '@id' | '@type' | 'createdAt' | 'updatedAt'>): Promise<ApiSiteSetting> {
  const response = await fetch(`${API_BASE_URL}/site_settings/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(setting),
  });

  return handleResponse<ApiSiteSetting>(response);
}

/**
 * Met à jour partiellement un paramètre (PATCH)
 */
export async function patchSiteSetting(id: string, setting: Partial<ApiSiteSetting>): Promise<ApiSiteSetting> {
  const response = await fetch(`${API_BASE_URL}/site_settings/${id}`, {
    method: 'PATCH',
    headers: {
      ...getHeaders(true),
      'Content-Type': 'application/merge-patch+json',
    },
    body: JSON.stringify(setting),
  });

  return handleResponse<ApiSiteSetting>(response);
}

/**
 * Supprime un paramètre
 */
export async function deleteSiteSetting(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/site_settings/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });

  await handleResponse(response);
}

/**
 * Récupère la valeur d'un paramètre par sa clé (helper)
 */
export async function getSiteSettingValue(key: string): Promise<string | null> {
  const setting = await getSiteSettingByKey(key);
  return setting?.value ?? null;
}

/**
 * Récupère la valeur d'un paramètre boolean par sa clé (helper)
 */
export async function getSiteSettingBoolean(key: string): Promise<boolean> {
  const value = await getSiteSettingValue(key);
  return value === 'true' || value === '1';
}

/**
 * Met à jour la valeur d'un paramètre par sa clé (helper)
 */
export async function updateSiteSettingByKey(key: string, value: string): Promise<ApiSiteSetting> {
  const existing = await getSiteSettingByKey(key);
  if (!existing || !existing.id) {
    throw new Error(`Le paramètre avec la clé "${key}" n'existe pas`);
  }
  return patchSiteSetting(existing.id, { value });
}

