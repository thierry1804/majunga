import KenBurnsLayer from './KenBurnsLayer';
import BaobabScene from './BaobabScene';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useSiteImages } from '../../hooks/useSiteImages';

/**
 * Fond du hero. La photo vient du back-office (Paramètres > Photos du site).
 * Sans photo, on affiche l'illustration de la marque.
 */
export default function HeroBackground() {
  const reduced = usePrefersReducedMotion();
  const { images, loading } = useSiteImages();

  // Pendant le chargement : aplat de marque, pour éviter un flash entre illustration et photo.
  if (loading) {
    return <div className="absolute inset-0 bg-ocean-900" aria-hidden="true" />;
  }

  if (images.hero_image) {
    return (
      <>
        <KenBurnsLayer speed={0.35} maxOffset={80} kenBurns={!reduced}>
          <img
            src={images.hero_image}
            alt=""
            className="w-full h-full min-h-[100dvh] object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
        </KenBurnsLayer>
        {/* Voile pour garder le texte lisible sur n'importe quelle photo */}
        <div className="absolute inset-0 bg-ocean-900/45" aria-hidden="true" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to right, rgba(6,38,38,0.7) 0%, rgba(6,38,38,0.3) 55%, rgba(6,38,38,0) 100%)',
          }}
        />
      </>
    );
  }

  return (
    <KenBurnsLayer speed={0.25} maxOffset={60} kenBurns={!reduced}>
      <BaobabScene className="w-full h-full min-h-[100dvh]" />
    </KenBurnsLayer>
  );
}
