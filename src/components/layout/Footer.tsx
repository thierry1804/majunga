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
              Votre porte d'entrée vers des expériences authentiques dans la belle région de Majunga à Madagascar, proposant des circuits et des services de navette aéroport fiables.
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
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-blue-200 hover:text-white transition-colors">Accueil</a>
              </li>
              <li>
                <a href="#about" className="text-blue-200 hover:text-white transition-colors">À Propos</a>
              </li>
              <li>
                <a href="#tours" className="text-blue-200 hover:text-white transition-colors">Nos Circuits</a>
              </li>
              <li>
                <a href="#shuttle" className="text-blue-200 hover:text-white transition-colors">Navette Aéroport</a>
              </li>
              <li>
                <a href="#booking" className="text-blue-200 hover:text-white transition-colors">Réserver</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contactez-nous</h3>
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
            <h3 className="text-lg font-semibold mb-4">Heures d'Ouverture</h3>
            <ul className="space-y-2 text-blue-100">
              <li className="flex justify-between">
                <span>Lundi - Vendredi :</span>
                <span>8h00 - 18h00</span>
              </li>
              <li className="flex justify-between">
                <span>Samedi :</span>
                <span>9h00 - 17h00</span>
              </li>
              <li className="flex justify-between">
                <span>Dimanche :</span>
                <span>10h00 - 14h00</span>
              </li>
              <li className="mt-4 text-orange-300">
                Contact d'Urgence Disponible 24/7
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Majunga Explorer. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                Politique de Confidentialité
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                Conditions d'Utilisation
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                Politique des Cookies
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}