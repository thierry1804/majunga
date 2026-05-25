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
    <header className={`mb-10 md:mb-14 max-w-2xl flex flex-col ${alignClass} ${className}`}>
      {label && (
        <div className={`flex items-center gap-3 mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
          {align === 'left' && (
            <span className="hidden sm:block w-8 h-px bg-ocean-300 shrink-0" aria-hidden="true" />
          )}
          <p className="section-label">{label}</p>
        </div>
      )}
      <h2 className="heading-display text-3xl md:text-4xl lg:text-[2.75rem] font-semibold leading-[1.08] text-balance">
        {title}
      </h2>
      {description && (
        <p className="prose-body mt-4 text-base md:text-lg">{description}</p>
      )}
    </header>
  );
}
