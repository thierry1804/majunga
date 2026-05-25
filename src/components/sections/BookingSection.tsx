import { Check, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import SectionHeader from '../ui/SectionHeader';
import BookingForm from '../booking/BookingForm';
import RevealOnScroll from '../motion/RevealOnScroll';

const WHATSAPP_URL = 'https://wa.me/261326478291';

export default function BookingSection() {
  const { t } = useTranslation();
  const reassuranceItems = t('booking.reassurance.items', {
    returnObjects: true,
  }) as string[];

  return (
    <section id="booking" className="section-padding bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <RevealOnScroll className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start" y={32}>
            <SectionHeader
              label={t('booking.sectionLabel')}
              title={t('booking.sectionTitle')}
              description={t('booking.sectionDescription')}
            />

            <div className="mt-2">
              <h3 className="font-medium text-ink mb-4">{t('booking.reassurance.title')}</h3>
              <ul className="space-y-3 mb-8">
                {reassuranceItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-muted">
                    <Check size={16} className="text-ocean-600 shrink-0 mt-0.5" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="space-y-3 pt-6 border-t border-sand-200">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-medium text-ocean-700 hover:text-ocean-900 transition-colors"
                >
                  <MessageCircle size={18} className="shrink-0" />
                  {t('booking.reassurance.whatsapp')}
                </a>
                <a
                  href="tel:+261326478291"
                  className="flex items-center gap-3 text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  <Phone size={18} className="shrink-0" />
                  {t('booking.reassurance.phone')} · +261 32 64 782 91
                </a>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="lg:col-span-7" delay={120} y={36}>
            <div className="border border-sand-300 bg-sand-50 rounded-xl p-6 md:p-8 shadow-soft">
              <BookingForm />
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
}
