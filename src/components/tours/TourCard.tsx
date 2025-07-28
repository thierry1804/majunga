import { useState } from 'react';
import { Clock, MapPin, TrendingUp } from 'lucide-react';
import { Tour } from '../../types';
import Button from '../ui/Button';

interface TourCardProps {
  tour: Tour;
  onClick: (tour: Tour) => void;
}

export default function TourCard({ tour, onClick }: TourCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === tour.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? tour.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl">
      {/* Image gallery */}
      <div className="relative h-64">
        <img 
          src={tour.images[currentImageIndex]} 
          alt={tour.title} 
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* Image navigation */}
        {tour.images.length > 1 && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            
            {/* Image indicators */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
              {tour.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`View image ${index + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
        
        <p className="text-gray-600 mb-4">{tour.shortDescription}</p>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center text-gray-700">
            <Clock size={16} className="mr-1" />
            <span className="text-sm">{tour.duration}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">Région de Majunga</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <TrendingUp size={16} className="mr-1" />
            <span className="text-sm">{tour.highlights.length} points forts</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-blue-800">
              {tour.price} {tour.currency}
            </span>
            <span className="text-gray-500 text-sm ml-1">/ personne</span>
          </div>
          
          <Button onClick={() => onClick(tour)}>Voir les Détails</Button>
        </div>
      </div>
    </div>
  );
}