import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface WordRevealProps {
  text: string;
  className?: string;
  startDelay?: number;
  wordDelay?: number;
  as?: 'p' | 'span' | 'div';
}

export default function WordReveal({
  text,
  className = '',
  startDelay = 0,
  wordDelay = 52,
  as: Tag = 'p',
}: WordRevealProps) {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(reduced);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    if (reduced) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [reduced, text]);

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block"
            style={{
              opacity: ready ? 1 : 0,
              transform: ready ? 'translate3d(0, 0, 0)' : 'translate3d(0, 105%, 0)',
              filter: ready ? 'blur(0)' : 'blur(4px)',
              transition: `opacity 0.65s var(--ease-out-expo) ${startDelay + index * wordDelay}ms, transform 0.75s var(--ease-out-expo) ${startDelay + index * wordDelay}ms, filter 0.6s var(--ease-out-expo) ${startDelay + index * wordDelay}ms`,
            }}
          >
            {word}
          </span>
          {index < words.length - 1 ? '\u00A0' : null}
        </span>
      ))}
    </Tag>
  );
}
