import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  blur?: number;
  scale?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'header';
}

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  y = 36,
  duration = 900,
  blur = 10,
  scale = 0.97,
  as: Tag = 'div',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  const style: CSSProperties = reduced
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translate3d(0, 0, 0) scale(1)'
          : `translate3d(0, ${y}px, 0) scale(${scale})`,
        filter: visible ? 'blur(0)' : `blur(${blur}px)`,
        transition: `opacity ${duration}ms var(--ease-out-expo) ${delay}ms, transform ${duration}ms var(--ease-out-expo) ${delay}ms, filter ${Math.round(duration * 0.85)}ms var(--ease-out-expo) ${delay}ms`,
      };

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
