import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface ParallaxOptions {
  speed?: number;
  maxOffset?: number;
}

export function useParallax({ speed = 0.35, maxOffset = 160 }: ParallaxOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let raf = 0;

    const update = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = (viewport - rect.top) / (viewport + rect.height);
      const clamped = Math.min(Math.max(progress, 0), 1);
      const y = (clamped - 0.5) * speed * rect.height;
      setOffset(Math.max(Math.min(y, maxOffset), -maxOffset));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed, maxOffset, reduced]);

  const style = reduced
    ? undefined
    : {
        transform: `translate3d(0, ${offset}px, 0)`,
        willChange: 'transform' as const,
      };

  return { ref, style, offset, reduced };
}
