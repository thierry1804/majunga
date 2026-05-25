import { useEffect, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface HeroEntranceProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function HeroEntrance({ children, className = '', delay = 0 }: HeroEntranceProps) {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  return (
    <div
      className={className}
      style={
        reduced
          ? undefined
          : {
              opacity: ready ? 1 : 0,
              transform: ready ? 'translate3d(0, 0, 0)' : 'translate3d(0, 40px, 0)',
              filter: ready ? 'blur(0)' : 'blur(10px)',
              transition: `opacity 1s var(--ease-out-expo) ${delay}ms, transform 1s var(--ease-out-expo) ${delay}ms, filter 0.85s var(--ease-out-expo) ${delay}ms`,
            }
      }
    >
      {children}
    </div>
  );
}
