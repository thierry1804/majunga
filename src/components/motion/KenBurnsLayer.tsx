import { type ReactNode } from 'react';
import ParallaxLayer from './ParallaxLayer';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface KenBurnsLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  maxOffset?: number;
  kenBurns?: boolean;
}

export default function KenBurnsLayer({
  children,
  className = '',
  speed = 0.45,
  maxOffset = 140,
  kenBurns = true,
}: KenBurnsLayerProps) {
  const reduced = usePrefersReducedMotion();
  const animateKenBurns = kenBurns && !reduced;

  return (
    <ParallaxLayer className={`absolute inset-0 ${className}`} speed={speed} maxOffset={maxOffset}>
      <div
        className={`w-full h-full ${animateKenBurns ? 'motion-safe:animate-ken-burns' : ''}`}
        style={{ transformOrigin: 'center 30%' }}
      >
        {children}
      </div>
    </ParallaxLayer>
  );
}
