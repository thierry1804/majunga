import React from 'react';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ToursSection from './components/sections/ToursSection';
import ShuttleSection from './components/sections/ShuttleSection';
import BookingSection from './components/sections/BookingSection';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ToursSection />
      <ShuttleSection />
      <BookingSection />
      <Footer />
    </div>
  );
}

export default App;