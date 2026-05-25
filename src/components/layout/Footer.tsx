import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Button from '../ui/Button';

const WHATSAPP_URL = 'https://wa.me/261326478291';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '#home', label: t('navigation.home') },
    { href: '#about', label: t('navigation.about') },
    { href: '#tours', label: t('tours.title') },
    { href: '#shuttle', label: t('shuttle.title') },
    { href: '#booking', label: t('booking.title') },
  ];

  return (
    <footer className="bg-ocean-900 text-sand-100">
      <div className="border-b border-ocean-800">
        <Container className="py-12 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-display text-xl md:text-2xl font-semibold text-sand-50 mb-2">
                {t('footer.ctaTitle')}
              </p>
              <p className="text-sand-200/75 text-sm max-w-md">{t('footer.ctaDescription')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button
                variant="secondary"
                onClick={() =>
                  document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                {t('footer.ctaButton')}
              </Button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm px-5 py-2.5 border border-sand-50/25 text-sand-50 hover:bg-sand-50/10 transition-colors"
              >
                <MessageCircle size={16} />
                {t('footer.whatsapp')}
              </a>
            </div>
          </div>
        </Container>
      </div>

      <Container className="pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">
          <div className="lg:col-span-5">
            <p className="font-display text-2xl font-semibold text-sand-50 mb-1">
              Mada<span className="text-terracotta-400">Booking</span>
            </p>
            <p className="text-sand-200/75 leading-relaxed max-w-sm text-sm mt-3">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-ocean-200 mb-4">
              {t('footer.quickLinks')}
            </p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-sand-200/75 hover:text-sand-50 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-ocean-200 mb-4">
              {t('footer.contact')}
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-terracotta-400 mt-0.5 shrink-0" />
                <span className="text-sand-200/75">{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-terracotta-400 shrink-0" />
                <a
                  href="tel:+261326478291"
                  className="text-sand-200/75 hover:text-sand-50 transition-colors"
                >
                  +261 32 64 782 91
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-terracotta-400 shrink-0" />
                <a
                  href="mailto:info@madabooking.mg"
                  className="text-sand-200/75 hover:text-sand-50 transition-colors"
                >
                  info@madabooking.mg
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle size={16} className="text-terracotta-400 shrink-0" />
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sand-200/75 hover:text-sand-50 transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ocean-800 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-sand-300/55 text-xs">
            {t('footer.copyright', { year: currentYear })}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" className="text-xs text-sand-300/55 hover:text-sand-100 transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#" className="text-xs text-sand-300/55 hover:text-sand-100 transition-colors">
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
