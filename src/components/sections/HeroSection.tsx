import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Container from '../ui/Container';
import Button from '../ui/Button';

export default function HeroSection() {
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
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/3342739/pexels-photo-3342739.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${offset * 0.5}px)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-900/70"></div>
      </div>
      
      <Container className="relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Découvrez la Magie de{' '} 
            <span className="text-orange-400">Majunga</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8">
            Vivez des plages à couper le souffle, une culture vibrante et des aventures inoubliables avec nos circuits premium et notre service de navette aéroport
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Button 
              size="lg" 
              variant="primary"
              onClick={() => {
                document.querySelector('#tours')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Découvrir nos Circuits
            </Button>
            
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => {
                document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Réserver la Navette
            </Button>
          </div>
        </div>
      </Container>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <button 
          aria-label="Défiler vers le bas"
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