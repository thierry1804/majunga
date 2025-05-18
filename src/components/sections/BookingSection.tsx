import { useEffect, useState } from 'react';
import Container from '../ui/Container';
import BookingForm from '../booking/BookingForm';

export default function BookingSection() {
  const [offset, setOffset] = useState(0);
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="booking" 
      className="py-20 bg-gray-50 relative overflow-hidden"
    >
      {/* Background decorative elements with parallax */}
      <div 
        className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-blue-500/5 z-0"
        style={{
          transform: `translateY(${offset * 0.1}px)`,
        }}
      ></div>
      <div 
        className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-orange-500/5 z-0"
        style={{
          transform: `translateY(${offset * -0.1}px)`,
        }}
      ></div>
      
      <Container className="relative z-10">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-medium">Reserve Your Experience</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Book Your Adventure
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Secure your spot on one of our popular tours or book a convenient airport shuttle service with our simple online booking system
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <BookingForm />
        </div>
      </Container>
    </section>
  );
}