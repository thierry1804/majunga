import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function useHeroScrollFade(threshold = 0.55) {
  const reduced = usePrefersReducedMotion();
  const [opacity, setOpacity] = useState(1);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (reduced) return;

    const update = () => {
      const vh = window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / (vh * threshold), 0), 1);
      setOpacity(1 - progress * 0.85);
      setTranslateY(progress * 48);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [reduced, threshold]);

  if (reduced) {
    return { style: undefined, progress: 0 };
  }

  return {
    progress: 1 - opacity,
    style: {
      opacity,
      transform: `translate3d(0, ${translateY}px, 0)`,
      willChange: 'opacity, transform' as const,
    },
  };
}
