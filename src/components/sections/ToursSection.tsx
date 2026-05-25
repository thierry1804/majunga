import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getToursFromSupabase } from '../../api/supabaseService';
import { Tour } from '../../types';
import Container from '../ui/Container';
import SectionHeader from '../ui/SectionHeader';
import TourCard from '../tours/TourCard';
import TourDetailsModal from '../tours/TourDetailsModal';
import Button from '../ui/Button';
import { TourCardSkeleton } from '../ui/Skeleton';
import RevealOnScroll from '../motion/RevealOnScroll';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export default function ToursSection() {
  const { t } = useTranslation();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  useBodyScrollLock(!!selectedTour);

  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true);
        const toursData = await getToursFromSupabase();
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
  };

  const handleCloseModal = () => {
    setSelectedTour(null);
  };

  const handleBookNow = () => {
    setSelectedTour(null);
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const [featured, ...rest] = tours;

  return (
    <section id="tours" className="section-padding bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 md:mb-16">
          <RevealOnScroll className="lg:col-span-5">
            <SectionHeader
              label={t('tours.sectionSubtitle')}
              title={t('tours.sectionTitle')}
              description={t('tours.sectionDescription')}
            />
          </RevealOnScroll>
          <RevealOnScroll className="lg:col-span-7 lg:flex lg:items-end lg:justify-end" delay={80}>
            <p className="text-sm text-ink-muted max-w-md lg:text-right leading-relaxed">
              {t('about.distinction')}
            </p>
          </RevealOnScroll>
        </div>

        {loading ? (
          <div className="space-y-8">
            <TourCardSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2].map((i) => (
                <TourCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-terracotta-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>{t('tours.retry')}</Button>
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-sand-300 rounded-xl">
            <p className="text-ink-muted">{t('tours.empty')}</p>
          </div>
        ) : (
          <div className="space-y-10 md:space-y-12">
            {featured && (
              <RevealOnScroll y={36} duration={900}>
                <TourCard tour={featured} onClick={handleTourClick} featured />
              </RevealOnScroll>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {rest.map((tour, index) => (
                  <RevealOnScroll key={tour.id} delay={index * 100} y={32} duration={800}>
                    <TourCard tour={tour} onClick={handleTourClick} />
                  </RevealOnScroll>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedTour && (
          <TourDetailsModal
            tour={selectedTour}
            onClose={handleCloseModal}
            onBookNow={handleBookNow}
          />
        )}
      </Container>
    </section>
  );
}
