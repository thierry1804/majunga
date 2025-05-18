import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchTours } from '../../api/mockApi';
import { Tour } from '../../types';
import Container from '../ui/Container';
import TourCard from '../tours/TourCard';
import TourDetailsModal from '../tours/TourDetailsModal';
import Button from '../ui/Button';

export default function ToursSection() {
  const { t } = useTranslation();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showScrollToBooking, setShowScrollToBooking] = useState(false);
  
  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true);
        const toursData = await fetchTours();
        setTours(toursData);
        setError(null);
      } catch (err) {
        setError(t('tours.loadingError'));
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTours();
  }, [t]);
  
  const handleTourClick = (tour: Tour) => {
    setSelectedTour(tour);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };
  
  const handleCloseModal = () => {
    setSelectedTour(null);
    document.body.style.overflow = ''; // Restore scrolling
    setShowScrollToBooking(false);
  };
  
  const handleBookNow = () => {
    setSelectedTour(null);
    document.body.style.overflow = ''; // Restore scrolling
    setShowScrollToBooking(true);
    
    // Scroll to booking section
    setTimeout(() => {
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section id="tours" className="py-20 bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <span className="text-orange-500 font-medium">{t('tours.sectionSubtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            {t('tours.sectionTitle')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            {t('tours.sectionDescription')}
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            <p>{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
                {t('tours.retry')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map(tour => (
              <TourCard 
                key={tour.id} 
                tour={tour} 
                onClick={handleTourClick} 
              />
            ))}
          </div>
        )}
        
        {selectedTour && (
          <TourDetailsModal 
            tour={selectedTour} 
            onClose={handleCloseModal}
            onBookNow={handleBookNow}
          />
        )}
        
        {showScrollToBooking && (
          <div className="fixed bottom-6 right-6 z-40 animate-bounce">
            <Button
              onClick={() => {
                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                  bookingSection.scrollIntoView({ behavior: 'smooth' });
                }
                setShowScrollToBooking(false);
              }}
              variant="primary"
              className="shadow-lg"
            >
              {t('tours.bookTour')}
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}