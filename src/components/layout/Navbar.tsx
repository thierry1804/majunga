import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, profile, canAccessAdmin, signOut } = useAuth();
  const [, setLang] = useState(i18n.language);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onLangChanged = () => setLang(i18n.language);
    i18n.on('languageChanged', onLangChanged);
    return () => i18n.off('languageChanged', onLangChanged);
  }, [i18n]);

  const navLinks = [
    { href: '#home', id: 'home', label: t('navigation.home') },
    { href: '#about', id: 'about', label: t('navigation.about') },
    { href: '#tours', id: 'tours', label: t('tours.title') },
    { href: '#shuttle', id: 'shuttle', label: t('shuttle.title') },
    { href: '#booking', id: 'booking', label: t('booking.title') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['home', 'about', 'tours', 'shuttle', 'booking'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor?.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const hash = anchor.getAttribute('href') as string;
        const element = document.querySelector(hash);
        if (element) {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth',
          });
          setIsOpen(false);
          window.history.pushState(null, '', hash);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) return;
      window.location.reload();
    } catch {
      /* silent */
    }
  };

  const navTextClass = isScrolled ? 'text-ink' : 'text-sand-50';
  const navHoverClass = isScrolled ? 'hover:text-ocean-600' : 'hover:text-sand-100';

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-sand-50/95 backdrop-blur-md border-b border-sand-200 py-3 shadow-soft'
          : 'bg-ocean-900/40 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="#home" className="flex items-baseline gap-0.5 group">
            <span
              className={`font-display text-xl font-semibold tracking-tight transition-colors ${
                isScrolled ? 'text-ocean-700' : 'text-sand-50'
              }`}
            >
              Mada
            </span>
            <span className="font-sans text-xl font-medium text-terracotta-400 group-hover:text-terracotta-500 transition-colors">
              Booking
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${navTextClass} ${navHoverClass} ${
                  activeSection === link.id
                    ? isScrolled
                      ? 'text-ocean-600'
                      : 'text-sand-50 underline underline-offset-4 decoration-terracotta-400'
                    : ''
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {canAccessAdmin() && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${navTextClass} ${navHoverClass}`}
              >
                <Settings size={15} />
                {t('navigation.admin')}
              </Link>
            )}
            {user && (
              <button
                onClick={handleSignOut}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${navTextClass} ${navHoverClass}`}
                title={profile?.email || t('navigation.signOut')}
              >
                <LogOut size={15} />
              </button>
            )}
            <LanguageSwitcher variant={isScrolled ? 'light' : 'dark'} />
            <Button
              size="sm"
              variant={isScrolled ? 'primary' : 'secondary'}
              onClick={() => document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('booking.title')}
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors ${navTextClass}`}
            aria-label={isOpen ? t('navigation.closeMenu') : t('navigation.openMenu')}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-sand-200/30 bg-sand-50 rounded-xl shadow-card">
            <div className="flex flex-col gap-1 px-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === link.id
                      ? 'bg-ocean-50 text-ocean-700'
                      : 'text-ink hover:bg-sand-100'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              {canAccessAdmin() && (
                <Link
                  to="/admin"
                  className="px-4 py-3 text-sm font-medium text-ink hover:bg-sand-100 rounded-lg"
                >
                  {t('navigation.admin')}
                </Link>
              )}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="px-4 py-3 text-sm font-medium text-ink hover:bg-sand-100 rounded-lg text-left"
                >
                  {t('navigation.signOut')}
                </button>
              )}
              <div className="px-4 pt-3 flex items-center justify-between border-t border-sand-200 mt-2">
                <LanguageSwitcher variant="light" />
                <Button
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('booking.title')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
