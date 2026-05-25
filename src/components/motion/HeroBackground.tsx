import KenBurnsLayer from './KenBurnsLayer';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/** Côte de Mahajanga — tons chauds, bon contraste pour le scrim */
export const HERO_POSTER =
  'https://images.unsplash.com/photo-1589394815804-964ed0a2a21e?w=1920&q=85&auto=format&fit=crop';

export default function HeroBackground() {
  const reduced = usePrefersReducedMotion();

  return (
    <KenBurnsLayer speed={0.35} maxOffset={80} kenBurns={!reduced}>
      <img
        src={HERO_POSTER}
        alt=""
        className="w-full h-full min-h-[100dvh] object-cover object-center"
        loading="eager"
        fetchPriority="high"
      />
    </KenBurnsLayer>
  );
}
