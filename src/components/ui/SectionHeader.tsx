interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  return (
    <header className={`mb-8 md:mb-10 max-w-3xl flex flex-col ${alignClass} ${className}`}>
      {label && (
        <div className={`flex items-center gap-3 mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
          {align === 'left' && (
            <span className="hidden sm:block w-8 h-px bg-ocean-200 shrink-0" aria-hidden="true" />
          )}
          <p className="section-label">{label}</p>
        </div>
      )}
      <h2 className="heading-display text-4xl md:text-5xl lg:text-[3.5rem] font-semibold leading-[1.04] tracking-[-0.02em] text-balance">
        {title}
      </h2>
      {description && (
        <p className="prose-body mt-4 text-base md:text-lg">{description}</p>
      )}
    </header>
  );
}
