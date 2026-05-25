import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
];

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

export default function LanguageSwitcher({ variant = 'light' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  const triggerClass =
    variant === 'dark'
      ? 'text-sand-50 border-sand-50/30 hover:bg-sand-50/10'
      : 'text-ink border-sand-300 hover:bg-sand-100';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border rounded-md transition-colors ${triggerClass}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {current.label}
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute top-full right-0 mt-1 bg-sand-50 border border-sand-200 rounded-lg shadow-card z-50 overflow-hidden min-w-[56px]"
        >
          {languages.map((lang) => (
            <li key={lang.code} role="option" aria-selected={i18n.language === lang.code}>
              <button
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs font-semibold text-left transition-colors ${
                  i18n.language === lang.code
                    ? 'bg-ocean-50 text-ocean-700'
                    : 'text-ink hover:bg-sand-100'
                }`}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
