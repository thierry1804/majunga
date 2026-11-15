import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Fix pour les icônes par défaut de Leaflet (uniquement côté client)
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Coordonnées de Majunga, Madagascar
const MAJUNGA_CENTER: [number, number] = [-15.7167, 46.3167];

// Tarif par kilomètre par défaut (sera remplacé par la valeur de la base de données)
const DEFAULT_PRICE_PER_KM = 0.5; // 0.50 EUR par kilomètre

// Interface pour les informations de route
interface RouteInfo {
  distance: number; // en mètres
  duration: number; // en secondes
  coordinates: [number, number][];
  estimatedCost?: number; // coût estimé en EUR
}

interface MapSelectorProps {
  onFromSelect: (location: { lat: number; lng: number; address: string }) => void;
  onToSelect: (location: { lat: number; lng: number; address: string }) => void;
  fromLocation?: { lat: number; lng: number; address: string } | null;
  toLocation?: { lat: number; lng: number; address: string } | null;
  mode: 'from' | 'to';
  onRouteCalculated?: (cost: number) => void; // Callback pour transmettre le coût estimé
  pricePerKm?: number; // Tarif au km (paramètre du site `price_per_km`)
}

// Composant pour gérer les clics sur la carte
function MapClickHandler({ 
  onLocationSelect
}: { 
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}) {
  const reverseGeocode = true;

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      
      // Récupérer l'adresse via reverse geocoding (utilisant Nominatim d'OpenStreetMap)
      let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
      if (reverseGeocode) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'MadaBooking/1.0'
              }
            }
          );
          const data = await response.json();
          
          if (data.address) {
            // Construire une adresse lisible
            const parts = [];
            if (data.address.road) parts.push(data.address.road);
            if (data.address.house_number) parts.push(data.address.house_number);
            if (data.address.suburb || data.address.neighbourhood) {
              parts.push(data.address.suburb || data.address.neighbourhood);
            }
            if (data.address.city || data.address.town || data.address.village) {
              parts.push(data.address.city || data.address.town || data.address.village);
            }
            
            address = parts.length > 0 
              ? parts.join(', ') 
              : data.display_name || address;
          }
        } catch (error) {
          console.error('Erreur lors du reverse geocoding:', error);
        }
      }
      
      onLocationSelect({ lat, lng, address });
    },
  });

  return null;
}

// Composant pour ajuster la vue de la carte aux marqueurs
function MapBounds({ fromLocation, toLocation }: { fromLocation?: { lat: number; lng: number; address: string } | null; toLocation?: { lat: number; lng: number; address: string } | null }) {
  const map = useMap();

  useEffect(() => {
    if (fromLocation && toLocation) {
      const bounds = L.latLngBounds(
        [fromLocation.lat, fromLocation.lng],
        [toLocation.lat, toLocation.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (fromLocation) {
      map.setView([fromLocation.lat, fromLocation.lng], 15);
    } else if (toLocation) {
      map.setView([toLocation.lat, toLocation.lng], 15);
    }
  }, [fromLocation, toLocation, map]);

  return null;
}

// Fonction pour obtenir l'itinéraire via OSRM
async function getRoute(from: { lat: number; lng: number }, to: { lat: number; lng: number }, pricePerKm: number): Promise<RouteInfo | null> {
  try {
    // Utiliser le service OSRM public (peut être limité, mais fonctionne pour la démo)
    // Format: lon,lat (OSRM utilise longitude en premier)
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      // Convertir les coordonnées GeoJSON [lng, lat] en [lat, lng] pour Leaflet
      const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
      
      // Calculer le coût estimé
      const distanceInKm = route.distance / 1000; // convertir en kilomètres
      const estimatedCost = distanceInKm * pricePerKm;
      
      return {
        distance: route.distance, // en mètres
        duration: route.duration, // en secondes
        coordinates: coordinates,
        estimatedCost: estimatedCost
      };
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'itinéraire:', error);
  }
  
  // Fallback: ligne droite si OSRM échoue
  // Calculer la distance à vol d'oiseau (formule de Haversine)
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = from.lat * Math.PI / 180;
  const φ2 = to.lat * Math.PI / 180;
  const Δφ = (to.lat - from.lat) * Math.PI / 180;
  const Δλ = (to.lng - from.lng) * Math.PI / 180;
  
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distanceInMeters = R * c;
  
  const distanceInKm = distanceInMeters / 1000;
  const estimatedCost = distanceInKm * pricePerKm;
  
  return {
    distance: distanceInMeters,
    duration: 0,
    coordinates: [[from.lat, from.lng], [to.lat, to.lng]],
    estimatedCost: estimatedCost
  };
}

export default function MapSelector({
  onFromSelect,
  onToSelect,
  fromLocation,
  toLocation,
  mode,
  onRouteCalculated,
  pricePerKm = DEFAULT_PRICE_PER_KM,
}: MapSelectorProps) {
  const { t } = useTranslation();
  const [mapReady, setMapReady] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  useEffect(() => {
    // S'assurer que nous sommes côté client
    if (typeof window !== 'undefined') {
      setMapReady(true);
    }
    
  }, []);

  // Charger l'itinéraire quand les deux points sont sélectionnés
  useEffect(() => {
    if (fromLocation && toLocation) {
      setLoadingRoute(true);
      getRoute(fromLocation, toLocation, pricePerKm)
        .then(route => {
          setRouteInfo(route);
          setLoadingRoute(false);
          // Transmettre le coût estimé au formulaire parent
          if (route && route.estimatedCost !== undefined && onRouteCalculated) {
            onRouteCalculated(route.estimatedCost);
          }
        })
        .catch(error => {
          console.error('Erreur lors du chargement de l\'itinéraire:', error);
          setLoadingRoute(false);
          // Fallback: ligne droite avec calcul de distance
          const R = 6371e3; // Rayon de la Terre en mètres
          const φ1 = fromLocation.lat * Math.PI / 180;
          const φ2 = toLocation.lat * Math.PI / 180;
          const Δφ = (toLocation.lat - fromLocation.lat) * Math.PI / 180;
          const Δλ = (toLocation.lng - fromLocation.lng) * Math.PI / 180;
          
          const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distanceInMeters = R * c;
          const distanceInKm = distanceInMeters / 1000;
          const estimatedCost = distanceInKm * pricePerKm;
          
          const fallbackRoute: RouteInfo = {
            distance: distanceInMeters,
            duration: 0,
            coordinates: [[fromLocation.lat, fromLocation.lng], [toLocation.lat, toLocation.lng]],
            estimatedCost: estimatedCost
          };
          setRouteInfo(fallbackRoute);
          if (onRouteCalculated) {
            onRouteCalculated(estimatedCost);
          }
        });
    } else {
      setRouteInfo(null);
      // Réinitialiser le coût si un point est supprimé
      if (onRouteCalculated) {
        onRouteCalculated(0);
      }
    }
  }, [fromLocation, toLocation, onRouteCalculated, pricePerKm]);

  if (typeof window === 'undefined' || !mapReady) {
    return (
      <div className="w-full h-96 bg-sand-100 rounded-xl flex items-center justify-center">
        <p className="text-ink-light text-sm">{t('booking.form.map.loading')}</p>
      </div>
    );
  }

  // Repères de départ (océan) et d'arrivée (terracotta), aux couleurs du système
  const pin = (color: string) =>
    L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid #faf7f2; box-shadow: 0 2px 8px rgba(42,37,32,0.3);"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  const fromIcon = pin('#145555');
  const toIcon = pin('#c45c3e');

  const formatDistance = (m: number) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(2)} km`);
  const formatDuration = (s: number) =>
    s < 3600 ? `${Math.max(1, Math.round(s / 60))} min` : `${Math.floor(s / 3600)} h ${Math.round((s % 3600) / 60)} min`;

  return (
    <div className="w-full">
      <p className="mb-3 text-sm text-ink-muted" aria-live="polite">
        {mode === 'from' ? t('booking.form.map.hintFrom') : t('booking.form.map.hintTo')}
      </p>

      <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden border border-sand-300">
        <MapContainer
          center={MAJUNGA_CENTER}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBounds fromLocation={fromLocation} toLocation={toLocation} />

          <MapClickHandler onLocationSelect={mode === 'from' ? onFromSelect : onToSelect} />

          {routeInfo && routeInfo.coordinates.length > 0 && (
            <Polyline positions={routeInfo.coordinates} color="#145555" weight={5} opacity={0.85} smoothFactor={1} />
          )}

          {fromLocation && (
            <Marker position={[fromLocation.lat, fromLocation.lng]} icon={fromIcon}>
              <Popup>
                <div className="font-medium text-ocean-700">{t('booking.form.map.from')}</div>
                <div className="text-sm text-ink-muted">{fromLocation.address}</div>
              </Popup>
            </Marker>
          )}

          {toLocation && (
            <Marker position={[toLocation.lat, toLocation.lng]} icon={toIcon}>
              <Popup>
                <div className="font-medium text-terracotta-600">{t('booking.form.map.to')}</div>
                <div className="text-sm text-ink-muted">{toLocation.address}</div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <dl className="mt-4 divide-y divide-sand-200 border-y border-sand-200 text-sm">
        <div className="flex items-start gap-3 py-3">
          <MapPin size={18} className="mt-0.5 shrink-0 text-ocean-600" aria-hidden="true" />
          <div>
            <dt className="font-medium text-ink">{t('booking.form.map.from')}</dt>
            <dd className="text-ink-muted">{fromLocation ? fromLocation.address : t('booking.form.map.notSet')}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3 py-3">
          <MapPin size={18} className="mt-0.5 shrink-0 text-terracotta-500" aria-hidden="true" />
          <div>
            <dt className="font-medium text-ink">{t('booking.form.map.to')}</dt>
            <dd className="text-ink-muted">{toLocation ? toLocation.address : t('booking.form.map.notSet')}</dd>
          </div>
        </div>

        {loadingRoute && (
          <div className="flex items-center gap-3 py-3 text-ink-muted" role="status">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-ocean-600 border-t-transparent" aria-hidden="true" />
            {t('booking.form.map.calculating')}
          </div>
        )}

        {routeInfo && !loadingRoute && fromLocation && toLocation && (
          <div className="flex items-start gap-3 py-3">
            <Navigation size={18} className="mt-0.5 shrink-0 text-ocean-600" aria-hidden="true" />
            <div className="flex-1">
              <dt className="font-medium text-ink">{t('booking.form.map.route')}</dt>
              <dd className="text-ink-muted">
                {routeInfo.distance > 0 ? (
                  <>
                    {formatDistance(routeInfo.distance)}
                    {routeInfo.duration > 0 && <> · {formatDuration(routeInfo.duration)}</>}
                  </>
                ) : (
                  t('booking.form.map.straightLine')
                )}
              </dd>
              {routeInfo.estimatedCost !== undefined && (
                <dd className="mt-1 text-ink">
                  <span className="font-display text-xl font-semibold">{routeInfo.estimatedCost.toFixed(2)} EUR</span>{' '}
                  <span className="text-xs text-ink-light">({pricePerKm.toFixed(2)} EUR/km)</span>
                </dd>
              )}
            </div>
          </div>
        )}
      </dl>
    </div>
  );
}
