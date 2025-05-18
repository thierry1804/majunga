import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ToursSection from './components/sections/ToursSection';
import ShuttleSection from './components/sections/ShuttleSection';
import BookingSection from './components/sections/BookingSection';
import Footer from './components/layout/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
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