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

  const pillars = [
    { title: t('about.mission.title'), description: t('about.mission.description') },
    { title: t('about.experience.title'), description: t('about.experience.description') },
  ];

  return (
    <section id="about" className="section-padding bg-sand-50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <RevealOnScroll className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-between" delay={0} y={32}>
            <SectionHeader
              label={t('navigation.about')}
              title={t('about.sectionTitle')}
              description={t('about.intro')}
            />

            <blockquote>
              <p className="font-display text-2xl md:text-[1.9rem] text-ocean-700 leading-[1.22] italic text-balance">
                {t('about.distinction')}
              </p>
            </blockquote>
          </RevealOnScroll>

          <RevealOnScroll className="lg:col-span-7 order-1 lg:order-2" delay={80} y={40} scale={0.98}>
            <div className="grid grid-cols-12 gap-3 md:gap-4">
              <ParallaxLayer
                className="col-span-8 row-span-2 overflow-hidden rounded-xl"
                speed={0.12}
                maxOffset={24}
              >
                <SmartImage
                  src={images.about_image_main}
                  pending={imagesLoading}
                  alt={t('about.imageAlt.main')}
                  className="w-full h-full min-h-[300px] md:min-h-[520px] object-cover"
                />
              </ParallaxLayer>
              <ParallaxLayer
                className="col-span-4 overflow-hidden rounded-xl"
                speed={-0.08}
                maxOffset={18}
              >
                <SmartImage
                  src={images.about_image_secondary}
                  pending={imagesLoading}
                  alt={t('about.imageAlt.secondary')}
                  className="w-full h-full min-h-[140px] md:min-h-[250px] object-cover"
                />
              </ParallaxLayer>
              <RevealOnScroll delay={140} y={12} className="col-span-4">
                <div className="bg-ocean-700 rounded-xl p-5 md:p-6 flex flex-col justify-end min-h-[140px] md:min-h-[250px] h-full">
                  <p className="font-display text-5xl md:text-6xl font-semibold text-sand-50 leading-none tracking-[-0.02em]">
                    2015
                  </p>
                  <p className="text-ocean-100 text-sm mt-3">{t('about.since')}</p>
                </div>
              </RevealOnScroll>
            </div>
          </RevealOnScroll>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-8 border-t border-sand-300 pt-8 md:pt-10">
          {pillars.map((pillar, index) => (
            <RevealOnScroll key={pillar.title} delay={100 + index * 60} y={14}>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-2">{pillar.title}</h3>
              <p className="prose-body">{pillar.description}</p>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
