import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import Container from '../ui/Container';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Majunga Explorer</h3>
            <p className="text-blue-100 mb-6">
              Your gateway to authentic experiences in Madagascar's beautiful Majunga region, offering tours and reliable airport shuttle services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-blue-200 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-blue-200 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#tours" className="text-blue-200 hover:text-white transition-colors">Our Tours</a>
              </li>
              <li>
                <a href="#shuttle" className="text-blue-200 hover:text-white transition-colors">Airport Shuttle</a>
              </li>
              <li>
                <a href="#booking" className="text-blue-200 hover:text-white transition-colors">Book Now</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-orange-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-blue-100">123 Main Street, Majunga, Madagascar</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-orange-400 mr-2 flex-shrink-0" />
                <a href="tel:+2611234567" className="text-blue-100 hover:text-white transition-colors">+261 12 345 67</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-orange-400 mr-2 flex-shrink-0" />
                <a href="mailto:info@majungaexplorer.com" className="text-blue-100 hover:text-white transition-colors">info@majungaexplorer.com</a>
              </li>
            </ul>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
            <ul className="space-y-2 text-blue-100">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>10:00 AM - 2:00 PM</span>
              </li>
              <li className="mt-4 text-orange-300">
                24/7 Emergency Contact Available
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Majunga Explorer. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}