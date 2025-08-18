import { useState, useEffect } from 'react';
import { Clock, ExternalLink, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchShuttleSchedules } from '../../api/mockApi';
import { ShuttleSchedule } from '../../types';
import Container from '../ui/Container';
import Button from '../ui/Button';
import FlightSchedule from '../FlightSchedule';

export default function ShuttleSection() {
  const { t } = useTranslation();
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
        setError(t('shuttle.loadingError'));
        console.error('Error fetching schedules:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSchedules();
  }, [t]);
  
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
          <span className="text-orange-500 font-medium">{t('shuttle.sectionSubtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            {t('shuttle.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            {t('shuttle.sectionDescription')}
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
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
              {t('shuttle.direction.airportToCity')}
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium ${
                direction === 'city-to-airport'
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setDirection('city-to-airport')}
            >
              {t('shuttle.direction.cityToAirport')}
            </button>
          </div>
          
          {/* Service highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-blue-700" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t('shuttle.highlights.reliableSchedule.title')}</h3>
              <p className="text-gray-600">{t('shuttle.highlights.reliableSchedule.description')}</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="text-blue-700" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t('shuttle.highlights.convenientStops.title')}</h3>
              <p className="text-gray-600">{t('shuttle.highlights.convenientStops.description')}</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="text-blue-700" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t('shuttle.highlights.easyBooking.title')}</h3>
              <p className="text-gray-600">{t('shuttle.highlights.easyBooking.description')}</p>
            </div>
          </div>
          
          {/* Planning des vols */}
          <div className="mb-8">
            <FlightSchedule />
          </div>
          
          {/* Additional info */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">{t('shuttle.importantInfo.title')}</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {(t('shuttle.importantInfo.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}