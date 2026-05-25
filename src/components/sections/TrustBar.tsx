import { Calendar, Globe, MapPin, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import RevealOnScroll from '../motion/RevealOnScroll';

export default function TrustBar() {
  const { t } = useTranslation();

  const items = [
    { icon: Calendar, label: t('trust.since2015'), detail: t('trust.since2015Detail') },
    { icon: MapPin, label: t('trust.localGuides'), detail: t('trust.localGuidesDetail') },
    { icon: Shield, label: t('trust.reliableShuttle'), detail: t('trust.reliableShuttleDetail') },
    { icon: Globe, label: t('trust.languages'), detail: t('trust.languagesDetail') },
  ];

  return (
    <section aria-label={t('trust.ariaLabel')} className="bg-sand-50 border-b border-sand-200">
      <Container className="py-8 md:py-10">
        <RevealOnScroll y={20}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {items.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex gap-3 md:gap-4">
                <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-ocean-50 border border-sand-200 flex items-center justify-center">
                  <Icon size={17} className="text-ocean-600" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-ink text-sm leading-snug">{label}</p>
                  <p className="text-xs text-ink-muted mt-0.5 leading-relaxed hidden sm:block">
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
