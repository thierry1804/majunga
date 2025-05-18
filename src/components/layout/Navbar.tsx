import { useState, useEffect } from 'react';
import { Menu, X, Plane, MapPin, Calendar, Info } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [_, setLang] = useState(i18n.language);

  useEffect(() => {
    const onLangChanged = () => setLang(i18n.language);
    i18n.on('languageChanged', onLangChanged);
    return () => i18n.off('languageChanged', onLangChanged);
  }, [i18n]);

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { href: '#home', label: t('navigation.home'), icon: <MapPin size={16} /> },
    { href: '#about', label: t('navigation.about'), icon: <Info size={16} /> },
    { href: '#tours', label: t('tours.title'), icon: <MapPin size={16} /> },
    { href: '#shuttle', label: t('shuttle.title'), icon: <Plane size={16} /> },
    { href: '#booking', label: t('booking.title'), icon: <Calendar size={16} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const hash = target.getAttribute('href') as string;
        const element = document.querySelector(hash);
        
        if (element) {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
          
          setIsOpen(false);
          window.history.pushState(null, '', hash);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <a 
            href="#home" 
            className="text-2xl font-bold flex items-center"
          >
            <span className={`transition-colors duration-300 ${isScrolled ? 'text-blue-800' : 'text-white'}`}>
              Majunga
            </span>
            <span className={`ml-1 text-orange-500 font-light`}>Explorer</span>
          </a>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1 transition-colors duration-300 hover:text-orange-500 ${
                  isScrolled ? 'text-gray-800' : 'text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
            <LanguageSwitcher />
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden transition-colors duration-300 ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-800 hover:text-orange-500 transition-colors duration-300"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ))}
              <div className="mt-2"><LanguageSwitcher /></div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}