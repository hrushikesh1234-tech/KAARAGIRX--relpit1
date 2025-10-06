import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface RentalCardProps {
  rental: {
    id: number;
    name: string;
    category: string;
    image: string;
    rate: string;
    rating: number;
    reviewCount: number;
    location: string;
    owner: string;
    features: string[];
  };
  isActive?: boolean;
  className?: string;
}

export function RentalCard({ rental, isActive = false, className = '' }: RentalCardProps) {
  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden h-full flex flex-col border border-gray-700 hover:border-green-500 transition-colors ${className} ${
      isActive ? 'border-green-500' : ''
    }`}>
      <div className="relative h-40 bg-gray-800 overflow-hidden">
        <img 
          src={rental.image} 
          alt={rental.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
          {rental.rate}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-white">{rental.name}</h3>
            <p className="text-green-400 text-sm">{rental.category}</p>
          </div>
          <div className="flex items-center bg-black/70 text-yellow-400 text-xs px-2 py-1 rounded">
            <span>★</span>
            <span className="ml-1">{rental.rating}</span>
            <span className="mx-1">•</span>
            <span>{rental.reviewCount}</span>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-gray-400 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {rental.location}
          </p>
          <p className="text-gray-400 text-sm mt-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {rental.owner}
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-800">
          <div className="flex flex-wrap gap-2">
            {rental.features.map((feature, i) => (
              <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                {feature}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-800 flex justify-end">
          <Link 
            to={`/rentals/${rental.id}`} 
            className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
          >
            View Profile
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
