import { type ReactNode, type CSSProperties } from 'react';
import { useParallax } from '../../hooks/useParallax';

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  maxOffset?: number;
  style?: CSSProperties;
}

export default function ParallaxLayer({
  children,
  className = '',
  speed = 0.35,
  maxOffset = 160,
  style: extraStyle,
}: ParallaxLayerProps) {
  const { ref, style, reduced } = useParallax({ speed, maxOffset });

  return (
    <div ref={ref as never} className={className} style={reduced ? extraStyle : { ...extraStyle, ...style }}>
      {children}
    </div>
  );
}
