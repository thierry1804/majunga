import { useState, useEffect } from 'react';
import Container from '../ui/Container';

export default function AboutSection() {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      <div 
        className="absolute -right-40 top-0 w-96 h-96 rounded-full bg-blue-500/10 z-0"
        style={{
          transform: `translateY(${offset * 0.1}px)`,
        }}
      ></div>
      
      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 relative">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.pexels.com/photos/2901212/pexels-photo-2901212.jpeg" 
                alt="Pirogue traditionnelle malgache" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div 
              className="absolute -bottom-6 -right-6 w-48 h-48 rounded-lg overflow-hidden shadow-lg hidden md:block"
              style={{
                transform: `translateY(${offset * 0.2}px)`,
              }}
            >
              <img 
                src="https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg" 
                alt="Fruits locaux de Madagascar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="mb-6">
              <span className="text-orange-500 font-medium">À Propos</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Bienvenue chez Majunga Explorer
              </h2>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Depuis 2015, nous nous consacrons à partager la beauté naturelle et la riche culture de Majunga, Madagascar avec des voyageurs du monde entier. Notre passion est de créer des expériences authentiques qui connectent les visiteurs avec le véritable Madagascar.
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Ce qui nous distingue, c'est notre profonde connaissance locale et notre engagement envers le tourisme durable. Tous nos guides sont natifs de Majunga avec une connaissance approfondie de l'histoire, de la culture et des trésors cachés de la région.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">Notre Mission</h3>
                <p className="text-gray-700">Mettre en valeur la beauté de Majunga tout en soutenant les communautés locales et en préservant les environnements naturels.</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-bold text-orange-800 mb-2">Expérience Locale</h3>
                <p className="text-gray-700">Tous nos circuits sont conçus et guidés par des guides locaux qui partagent des perspectives et des histoires authentiques.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}