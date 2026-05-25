import { useState } from 'react';
import { Clock, MapPin, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tour } from '../../types';
import Button from '../ui/Button';

interface TourCardProps {
  tour: Tour;
  onClick: (tour: Tour) => void;
  featured?: boolean;
}

const PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e8dcc8"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%238a8078" font-size="14"%3EImage%3C/text%3E%3C/svg%3E';

export default function TourCard({ tour, onClick, featured = false }: TourCardProps) {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const displayImages =
    tour.images && tour.images.length > 0 ? tour.images : [PLACEHOLDER];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  if (featured) {
    return (
      <article
        className="group grid grid-cols-1 md:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-sand-200 bg-sand-50"
      >
        <button
          type="button"
          className="relative overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[320px] w-full text-left"
          onClick={() => onClick(tour)}
        >
          <img
            src={displayImages[currentImageIndex]}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER;
            }}
            loading="lazy"
          />
          <div className="absolute top-4 left-4 bg-ocean-700 text-sand-50 text-xs font-medium px-3 py-1 rounded-md">
            {t('tours.featured')}
          </div>
        </button>

        <div className="p-6 md:p-8 flex flex-col justify-center">
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-ink-light">
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {tour.duration}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {t('tours.region')}
            </span>
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-3 leading-snug">
            {tour.title}
          </h3>
          <p className="text-sm text-ink-muted mb-6 line-clamp-3 leading-relaxed">
            {tour.shortDescription}
          </p>
          <div className="flex items-end justify-between mt-auto pt-4 border-t border-sand-200">
            <div>
              <span className="font-display text-2xl font-semibold text-ocean-700">
                {tour.price} {tour.currency}
              </span>
              <span className="text-ink-light text-xs ml-1">{t('tours.perPerson')}</span>
            </div>
            <Button
              size="sm"
              variant="primary"
              rightIcon={<ArrowUpRight size={15} />}
              onClick={() => onClick(tour)}
            >
              {t('tours.viewDetails')}
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col h-full">
      <div className="relative overflow-hidden rounded-xl bg-sand-200 aspect-[4/3] w-full">
        <button
          type="button"
          className="block w-full h-full text-left"
          onClick={() => onClick(tour)}
        >
          <img
            src={displayImages[currentImageIndex]}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER;
            }}
            loading="lazy"
          />
        </button>

        <div className="absolute top-3 right-3 bg-sand-50 rounded-lg px-2.5 py-1 pointer-events-none">
          <span className="font-display text-sm font-semibold text-ocean-700">
            {tour.price} {tour.currency}
          </span>
        </div>

        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-ocean-900/50 hover:bg-ocean-900/70 text-sand-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label={t('tours.previousImage')}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-ocean-900/50 hover:bg-ocean-900/70 text-sand-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label={t('tours.nextImage')}
            >
              <ChevronRight size={14} />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col flex-1 pt-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 text-xs text-ink-light">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {tour.duration}
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold text-ink mb-2 leading-snug group-hover:text-ocean-700 transition-colors">
          {tour.title}
        </h3>
        <p className="text-sm text-ink-muted mb-4 line-clamp-2 flex-1 leading-relaxed">
          {tour.shortDescription}
        </p>

        <div className="flex justify-between items-center mt-auto pt-3 border-t border-sand-200">
          <span className="text-xs text-ink-light">{t('tours.perPerson')}</span>
          <button
            type="button"
            onClick={() => onClick(tour)}
            className="text-sm font-medium text-ocean-600 hover:text-ocean-800 flex items-center gap-1 transition-colors"
          >
            {t('tours.viewDetails')}
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
