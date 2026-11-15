import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import SectionHeader from '../ui/SectionHeader';
import RevealOnScroll from '../motion/RevealOnScroll';
import ParallaxLayer from '../motion/ParallaxLayer';
import SmartImage from '../ui/SmartImage';

import { useSiteImages } from '../../hooks/useSiteImages';

export default function AboutSection() {
  const { t } = useTranslation();
  const { images, loading: imagesLoading } = useSiteImages();

  return (
    <section id="about" className="section-padding bg-sand-50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <RevealOnScroll className="lg:col-span-5 order-2 lg:order-1 lg:sticky lg:top-28" delay={0} y={32}>
            <SectionHeader
              label={t('navigation.about')}
              title={t('about.sectionTitle')}
              description={t('about.intro')}
            />

            <blockquote className="mb-10">
              <p className="font-display text-2xl md:text-[1.75rem] text-ocean-700 leading-[1.25] italic text-balance">
                {t('about.distinction')}
              </p>
            </blockquote>

            <div className="space-y-5">
              <RevealOnScroll delay={100} y={12}>
                <div className="flex gap-4 items-start py-4 border-t border-sand-200">
                  <div>
                    <h3 className="font-medium text-ink mb-1">{t('about.mission.title')}</h3>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {t('about.mission.description')}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={160} y={12}>
                <div className="flex gap-4 items-start py-4 border-t border-sand-200">
                  <div>
                    <h3 className="font-medium text-ink mb-1">{t('about.experience.title')}</h3>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {t('about.experience.description')}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="lg:col-span-7 order-1 lg:order-2" delay={80} y={40} scale={0.98}>
            <div className="grid grid-cols-12 gap-3 md:gap-4">
              <ParallaxLayer
                className="col-span-8 row-span-2 overflow-hidden rounded-xl"
                speed={0.15}
                maxOffset={32}
              >
                <SmartImage
                  src={images.about_image_main}
                  pending={imagesLoading}
                  alt={t('about.imageAlt.main')}
                  className="w-full h-full min-h-[260px] md:min-h-[440px] object-cover"
                />
              </ParallaxLayer>
              <ParallaxLayer
                className="col-span-4 overflow-hidden rounded-xl"
                speed={-0.1}
                maxOffset={24}
              >
                <SmartImage
                  src={images.about_image_secondary}
                  pending={imagesLoading}
                  alt={t('about.imageAlt.secondary')}
                  className="w-full h-full min-h-[120px] md:min-h-[200px] object-cover"
                />
              </ParallaxLayer>
              <RevealOnScroll delay={140} y={12} className="col-span-4">
                <div className="bg-ocean-700 rounded-xl p-5 flex flex-col justify-end min-h-[120px] md:min-h-[200px] h-full">
                  <p className="font-display text-4xl font-semibold text-sand-50 leading-none">
                    2015
                  </p>
                  <p className="text-ocean-100 text-sm mt-2">{t('about.since')}</p>
                </div>
              </RevealOnScroll>
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
}
