import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tour } from '../../types';
import Button from '../ui/Button';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface TourDetailsModalProps {
  tour: Tour | null;
  onClose: () => void;
  onBookNow: (tour: Tour) => void;
}

export default function TourDetailsModal({ tour, onClose, onBookNow }: TourDetailsModalProps) {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reduced);

  useEffect(() => {
    if (!tour) return;
    if (reduced) {
      setVisible(true);
      return;
    }
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [tour, reduced]);

  useEffect(() => {
    if (!tour) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tour, onClose]);

  if (!tour) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-ocean-900/50 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-modal-title"
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-sand-50 shadow-elevated flex flex-col transition-transform duration-500"
        style={{
          transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      >
        <div className="flex justify-between items-start gap-4 p-5 border-b border-sand-200 shrink-0">
          <h2 id="tour-modal-title" className="font-display text-xl font-semibold text-ink">
            {tour.title}
          </h2>
          <button
            onClick={onClose}
            className="text-ink-light hover:text-ink transition-colors p-1"
            aria-label={t('tours.closeDetails')}
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          <div className="space-y-3 mb-6">
            {tour.images.map((image, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden ${index === 0 ? 'aspect-[16/9]' : 'aspect-[3/2]'}`}
              >
                <img
                  src={image}
                  alt={`${tour.title} — ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-ink mb-2">{t('tours.aboutTour')}</h3>
            <p className="text-sm text-ink-muted leading-relaxed">{tour.fullDescription}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white border border-sand-200 rounded-lg p-3">
              <span className="block text-xs text-ink-light mb-0.5">{t('tours.duration')}</span>
              <span className="text-sm font-medium text-ink">{tour.duration}</span>
            </div>
            <div className="bg-white border border-sand-200 rounded-lg p-3">
              <span className="block text-xs text-ink-light mb-0.5">{t('tours.priceLabel')}</span>
              <span className="text-sm font-medium text-ink">
                {tour.price} {tour.currency} {t('tours.perPerson')}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-ink mb-3">{t('tours.highlights')}</h3>
            <ul className="space-y-2">
              {tour.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-ink-muted">
                  <span className="text-ocean-600 mt-0.5 shrink-0">—</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-sand-200 p-5 flex gap-3 shrink-0 bg-white">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            {t('tours.closeDetails')}
          </Button>
          <Button variant="primary" onClick={() => onBookNow(tour)} className="flex-1">
            {t('tours.bookNow')}
          </Button>
        </div>
      </div>
    </>
  );
}
