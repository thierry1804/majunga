import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';

export default function AboutSection() {
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
                src="https://www.primemadaguide.com/images/northern/baobomby%201.jpg" 
                alt="Pirogue traditionnelle malgache" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div 
              className="absolute -bottom-10 -right-10 lg:w-80 lg:h-80 rounded-lg overflow-hidden shadow-lg hidden md:block"
              style={{
                transform: `translateY(${Math.min(offset * 0.35, 20)}px)`,
                willChange: 'transform',
                transition: 'transform 0.1s linear',
              }}
            >
              <img 
                src="https://tourisme-majunga.com/wp-content/uploads/2024/04/Capture-e1614608651409-1.jpg" 
                alt="Fruits locaux de Madagascar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="mb-6">
              <span className="text-orange-500 font-medium">{t('navigation.about')}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                {t('about.sectionTitle')}
              </h2>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              {t('about.intro')}
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              {t('about.distinction')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">{t('about.mission.title')}</h3>
                <p className="text-gray-700">{t('about.mission.description')}</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-bold text-orange-800 mb-2">{t('about.experience.title')}</h3>
                <p className="text-gray-700">{t('about.experience.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}