import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Button from '../ui/Button';
import WeatherWidget from '../WeatherWidget';

export default function HeroSection() {
  const { t } = useTranslation();
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div 
        className="absolute inset-0 z-0 min-h-screen"
        style={{
          backgroundImage: 'url(https://images5.alphacoders.com/109/1094981.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform',
          transform: `translateY(${Math.min(offset * 0.3, 120)}px)`,
          transition: 'transform 0.1s linear',
          backgroundColor: '#1e293b',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-blue-900/80"></div>
      </div>
      
      <Container className="relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            {t('hero.title')}{' '} 
            <span className="text-orange-400">Majunga</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center mb-8">
            <Button 
              size="lg" 
              variant="primary"
              onClick={() => {
                document.querySelector('#tours')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('hero.discoverTours')}
            </Button>
            
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => {
                document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('hero.bookShuttle')}
            </Button>
          </div>
          
          {/* Widget météo en dessous des CTA */}
          <div className="flex justify-center">
            <WeatherWidget />
          </div>
        </div>
      </Container>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <button 
          aria-label={t('hero.scrollDown')}
          onClick={() => {
            document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
}