import React from 'react';
import { Professional } from '@/lib/types';
import { motion } from 'framer-motion';
import { MapPin, Star, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Extend the Professional interface to include additional properties used in the card
interface ExtendedProfessional extends Professional {
  isVerified?: boolean;
  availability?: 'Available' | 'Busy' | 'Away';
  completedProjects?: number;
  responseTime?: string;
}

interface ProfessionalCardProps {
  professional: ExtendedProfessional;
  portfolioImages?: string[];
  priceRange?: string;
  className?: string;
  isActive?: boolean;
}

export function ProfessionalCard({
  professional,
  portfolioImages = [],
  priceRange = 'Contact for pricing',
  className = '',
  isActive = false,
}: ProfessionalCardProps) {
  const rating = professional.rating != null ? Number(professional.rating) : 0;
  const completedProjects = professional.completedProjects || 0;
  const responseTime = professional.responseTime || '<24h';

  const hasPortfolio = portfolioImages.length > 0;
  const displayImages: (string | null)[] = portfolioImages.slice(0, 4);
  
  // Fill remaining slots with nulls to maintain 4-grid layout
  while (displayImages.length < 4) {
    displayImages.push(null);
  }

  return (
    <motion.div 
      className={`group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden border border-gray-800 h-full flex flex-col ${className} ${
        isActive ? 'ring-2 ring-blue-500' : ''
      }`}
      whileHover={{ 
        y: -6,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Portfolio Images Grid with Profile Picture Overlay */}
      <div className="relative h-48">
        {hasPortfolio ? (
          <div className="grid grid-cols-2 gap-1 h-full">
            {displayImages.map((img, index) => (
              <div key={index} className="relative overflow-hidden bg-gray-800 flex items-center justify-center">
                {img ? (
                  <img 
                    src={img} 
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <p className="text-gray-500 text-sm font-medium text-center px-4">
              No Portfolio Yet
            </p>
          </div>
        )}
        
        {/* Profile Picture Overlay - Top Left */}
        <div className="absolute top-3 left-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-gray-900 overflow-hidden bg-gray-800">
              <img
                src={professional.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.fullName}`}
                alt={professional.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            {/* Verified Badge on Profile Picture */}
            {professional.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-white line-clamp-1 mb-1">
              {professional.fullName}
            </h3>
            <p className="text-sm text-gray-400">
              {professional.specializations?.[0] || 'General Contractor'}
            </p>
          </div>
          
          {/* Rating */}
          <div className="flex items-center bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-2.5 py-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-sm font-semibold text-yellow-400">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center text-sm text-gray-300 mb-3">
          <MapPin className="w-4 h-4 mr-1.5 text-gray-500" />
          <span className="truncate">
            {professional.location || 'Location not specified'}
          </span>
        </div>
        
        {/* About */}
        {professional.about && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow">
            {professional.about}
          </p>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center mb-4 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
          <div>
            <div className="text-base font-bold text-white">{completedProjects}+</div>
            <div className="text-xs text-gray-400">Projects</div>
          </div>
          <div className="border-x border-gray-700">
            <div className="text-base font-bold text-white">
              {professional.reviewCount || 0}
            </div>
            <div className="text-xs text-gray-400">Reviews</div>
          </div>
          <div>
            <div className="text-base font-bold text-white">
              {responseTime}
            </div>
            <div className="text-xs text-gray-400">Response</div>
          </div>
        </div>
        
        {/* Price and CTA */}
        <div className="mt-auto pt-3 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">Starting from</span>
              <div className="text-base font-bold text-white">
                {priceRange}
              </div>
            </div>
            <Link 
              to={`/professionals/${professional.id}`}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfessionalCard;
