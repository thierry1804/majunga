import { useState } from 'react';
import BaobabScene from '../motion/BaobabScene';

interface SmartImageProps {
  src?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  /** Les URLs ne sont pas encore connues : on affiche un aplat neutre plutôt que le repli. */
  pending?: boolean;
}

/**
 * Image avec repli : si la photo manque ou ne charge pas, on affiche
 * l'illustration de la marque plutôt qu'un rectangle vide ou une icône brisée.
 */
export default function SmartImage({ src, alt, className = '', loading = 'lazy', pending = false }: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (pending) {
    return <div className={`bg-sand-100 ${className}`} aria-hidden="true" />;
  }

  if (!src || failed) {
    return <BaobabScene label={alt} className={`bg-ocean-900 ${className}`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}
