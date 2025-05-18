import { useState, useEffect } from 'react';
import { Clock, ExternalLink, Map } from 'lucide-react';
import { fetchShuttleSchedules } from '../../api/mockApi';
import { ShuttleSchedule } from '../../types';
import Container from '../ui/Container';
import Button from '../ui/Button';

export default function ShuttleSection() {
  const [schedules, setSchedules] = useState<ShuttleSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<'airport-to-city' | 'city-to-airport'>('airport-to-city');
  
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        const schedulesData = await fetchShuttleSchedules();
        setSchedules(schedulesData);
        setError(null);
      } catch (err) {
        setError('Unable to load shuttle schedules. Please try again later.');
        console.error('Error fetching schedules:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSchedules();
  }, []);
  
  const filteredSchedules = schedules.filter(schedule => 
    direction === 'airport-to-city' 
      ? schedule.from === 'Airport' && schedule.to === 'Majunga City'
      : schedule.from === 'Majunga City' && schedule.to === 'Airport'
  );

  return (
    <section 
      id="shuttle" 
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute -left-40 -bottom-40 w-96 h-96 rounded-full bg-blue-500/10 z-0"></div>
      <div className="absolute right-0 top-0 w-1/3 h-screen opacity-10 z-0">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/163792/model-planes-airplanes-miniatur-wunderland-hamburg-163792.jpeg)',
          backgroundSize: 'cover'
        }}></div>
      </div>
      
      <Container className="relative z-10">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-medium">Transport Pratique</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Service de Navette Aéroport
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Notre service de navette confortable et fiable relie l'aéroport de Majunga au centre-ville quotidiennement, rendant votre arrivée et votre départ sans stress
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Direction selector */}
          <div className="flex rounded-lg overflow-hidden mb-8 shadow-sm border">
            <button
              className={`flex-1 py-3 px-4 font-medium ${
                direction === 'airport-to-city'
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setDirection('airport-to-city')}
            >
              Aéroport vers Ville
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium ${
                direction === 'city-to-airport'
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setDirection('city-to-airport')}
            >
              Ville vers Aéroport
            </button>
          </div>
          
          {/* Service highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-blue-700" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Horaires Fiables</h3>
              <p className="text-gray-600">Départs quotidiens multiples pour s'adapter à vos plans de voyage</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="text-blue-700" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Arrêts Pratiques</h3>
              <p className="text-gray-600">Service direct entre l'aéroport et les principaux sites de la ville</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="text-blue-700" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Réservation Facile</h3>
              <p className="text-gray-600">Réservez votre place en ligne ou appelez-nous pour assistance</p>
            </div>
          </div>
          
          {/* Schedule table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="font-bold text-lg text-gray-900">
                {direction === 'airport-to-city' ? 'Horaires Aéroport vers Ville' : 'Horaires Ville vers Aéroport'}
              </h3>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-700"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">
                <p>{error}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                    Réessayer
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                          <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Départ</th>
                          <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Arrivée</th>
                          <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Prix</th>
                          <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Places Disponibles</th>
                      <th className="py-3 px-6 text-right text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSchedules.length > 0 ? (
                      filteredSchedules.map(schedule => (
                        <tr key={schedule.id} className="hover:bg-gray-50">
                          <td className="py-3 px-6 text-sm text-gray-900">{schedule.departureTime}</td>
                          <td className="py-3 px-6 text-sm text-gray-900">{schedule.arrivalTime}</td>
                          <td className="py-3 px-6 text-sm text-gray-900">
                            {schedule.price} {schedule.currency}
                          </td>
                          <td className="py-3 px-6 text-sm text-gray-900">
                            {schedule.availableSeats > 0 ? schedule.availableSeats : 'Complet'}
                          </td>
                          <td className="py-3 px-6 text-right">
                            <Button
                              size="sm"
                              disabled={schedule.availableSeats <= 0}
                              onClick={() => {
                                const bookingSection = document.getElementById('booking');
                                if (bookingSection) {
                                  bookingSection.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                            >
                              Réserver
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-500">
                                Aucun horaire disponible pour cette direction.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Additional info */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">Informations Importantes</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Veuillez arriver 15 minutes avant l'heure de départ prévue</li>
              <li>Chaque passager est autorisé à emporter une valise et un bagage à main</li>
              <li>Notre service de navette fonctionne 7 jours sur 7, y compris les jours fériés</li>
              <li>Pour une assistance spéciale ou des réservations de groupe, veuillez nous contacter directement</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}