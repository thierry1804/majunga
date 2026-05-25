import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Button from '../ui/Button';
import WeatherWidget from '../WeatherWidget';
import HeroBackground from '../motion/HeroBackground';
import HeroEntrance from '../motion/HeroEntrance';
import { useHeroScrollFade } from '../../hooks/useHeroScrollFade';

export default function HeroSection() {
  const { t } = useTranslation();
  const { style: contentFadeStyle } = useHeroScrollFade(0.7);

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden"
    >
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <HeroBackground />

        {/* Scrim uniforme — lisibilité garantie sur toute la surface */}
        <div className="absolute inset-0 bg-ocean-900/50" aria-hidden="true" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to top, rgba(6,38,38,0.97) 0%, rgba(6,38,38,0.82) 38%, rgba(6,38,38,0.55) 68%, rgba(6,38,38,0.72) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to right, rgba(6,38,38,0.75) 0%, rgba(6,38,38,0.35) 55%, rgba(6,38,38,0.15) 100%)',
          }}
        />
      </div>

      <Container className="relative z-10 w-full pt-28 pb-16 md:pb-20 md:pt-32">
        <div style={contentFadeStyle} className="max-w-2xl">
          <HeroEntrance delay={0}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6">
              <p className="section-label text-ocean-200 tracking-[0.16em]">
                Mahajanga · Madagascar
              </p>
              <span className="hidden sm:inline text-sand-100/30" aria-hidden="true">
                ·
              </span>
              <WeatherWidget variant="compact" />
            </div>
          </HeroEntrance>

          <HeroEntrance delay={80}>
            <h1 className="heading-display text-sand-50 text-[2.75rem] sm:text-5xl lg:text-[3.25rem] font-semibold leading-[1.04] mb-5">
              {t('hero.title')}{' '}
              <span className="italic text-terracotta-400">{t('hero.city')}</span>
            </h1>
          </HeroEntrance>

          <HeroEntrance delay={180}>
            <p className="text-sand-100 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
              {t('hero.subtitle')}
            </p>
          </HeroEntrance>

          <HeroEntrance delay={280}>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                size="lg"
                variant="secondary"
                onClick={() =>
                  document.querySelector('#tours')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                {t('hero.discoverTours')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-sand-50/50 text-sand-50 hover:bg-sand-50/10 hover:border-sand-50/70 bg-ocean-900/20"
                onClick={() =>
                  document.querySelector('#shuttle')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                {t('hero.bookShuttle')}
              </Button>
            </div>
          </HeroEntrance>

          <HeroEntrance delay={360}>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-sand-100/70">
              <span>{t('trust.since2015')}</span>
              <span className="text-sand-100/25" aria-hidden="true">
                ·
              </span>
              <span>{t('trust.localGuides')}</span>
              <span className="text-sand-100/25" aria-hidden="true">
                ·
              </span>
              <span>{t('trust.languages')}</span>
            </div>
          </HeroEntrance>
        </div>
      </Container>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.18em] text-sand-100/40">
          {t('hero.scrollDown')}
        </span>
        <button
          aria-label={t('hero.scrollDown')}
          onClick={() =>
            document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="text-sand-100/50 hover:text-sand-50 transition-colors p-1.5 motion-safe:scroll-hint"
        >
          <ArrowDown size={16} />
        </button>
      </div>
    </section>
  );
}
