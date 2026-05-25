import { useEffect, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'p' | 'span' | 'div';
}

export default function TextReveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'span',
}: TextRevealProps) {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={`${className} inline-block overflow-hidden`}
      style={{
        clipPath: ready ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
        transition: `clip-path 1.1s var(--ease-out-expo) ${delay}ms`,
      }}
    >
      <span
        className="inline-block"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? 'translate3d(0, 0, 0)' : 'translate3d(0, 110%, 0)',
          filter: ready ? 'blur(0)' : 'blur(8px)',
          transition: `opacity 1s var(--ease-out-expo) ${delay}ms, transform 1s var(--ease-out-expo) ${delay}ms, filter 0.9s var(--ease-out-expo) ${delay}ms`,
        }}
      >
        {children}
      </span>
    </Tag>
  );
}
