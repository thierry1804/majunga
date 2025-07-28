import { X } from 'lucide-react';
import { Tour } from '../../types';
import Button from '../ui/Button';

interface TourDetailsModalProps {
  tour: Tour | null;
  onClose: () => void;
  onBookNow: (tour: Tour) => void;
}

export default function TourDetailsModal({ tour, onClose, onBookNow }: TourDetailsModalProps) {
  if (!tour) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{tour.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fermer les détails"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-grow p-4">
          {/* Image gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {tour.images.map((image, index) => (
              <div 
                key={index} 
                className={`rounded-lg overflow-hidden ${index === 0 ? 'md:col-span-2 h-64 md:h-80' : 'h-48'}`}
              >
                <img 
                  src={image} 
                  alt={`${tour.title} - vue ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* Tour details */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">À Propos de ce Tour</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              {tour.fullDescription}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded">
                <span className="block text-sm text-gray-500">Durée</span>
                <span className="font-medium">{tour.duration}</span>
              </div>
              
              <div className="bg-blue-50 p-3 rounded">
                <span className="block text-sm text-gray-500">Prix</span>
                <span className="font-medium">{tour.price} {tour.currency} par personne</span>
              </div>
            </div>
          </div>
          
          {/* Highlights */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Points Forts du Tour</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {tour.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <svg className="text-green-500 w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="border-t p-4 bg-gray-50 flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button 
            variant="primary"
            onClick={() => onBookNow(tour)}
          >
            Réserver ce Tour
          </Button>
        </div>
      </div>
    </div>
  );
}