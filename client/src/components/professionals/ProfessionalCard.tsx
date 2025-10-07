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

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 h-full flex flex-col ${className} ${
        isActive ? 'ring-2 ring-blue-500' : ''
      }`}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Portfolio Image */}
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        {portfolioImages.length > 0 ? (
          <img 
            src={portfolioImages[0]} 
            alt={professional.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-gray-400 text-xs">No images available</div>
          </div>
        )}
        
        {/* Verified Badge */}
        {professional.isVerified && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
            <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
          </div>
        )}
      </div>
      
      {/* Profile Info */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {professional.fullName}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {professional.specializations?.[0] || 'General Contractor'}
            </p>
          </div>
          
          {/* Rating */}
          <div className="flex items-center bg-blue-50 rounded-full px-2 py-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-0.5" />
            <span className="text-xs font-medium text-blue-700">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center text-xs text-gray-500 mt-1 mb-3">
          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
          <span className="truncate">
            {professional.location || 'Location not specified'}
          </span>
        </div>
        
        {/* About */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-grow">
          {professional.about || 'Experienced professional with a proven track record of quality work.'}
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center mb-3 bg-gray-50 p-2 rounded-lg">
          <div>
            <div className="text-sm font-semibold text-gray-900">{completedProjects}+</div>
            <div className="text-[10px] text-gray-500">Projects</div>
          </div>
          <div className="border-x border-gray-200">
            <div className="text-sm font-semibold text-gray-900">
              {professional.reviewCount || '24'}
            </div>
            <div className="text-[10px] text-gray-500">Reviews</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {responseTime}
            </div>
            <div className="text-[10px] text-gray-500">Response</div>
          </div>
        </div>
        
        {/* Price and CTA */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">Starting from</span>
              <div className="text-sm font-semibold text-gray-900">
                {priceRange}
              </div>
            </div>
            <Link 
              to={`/professionals/${professional.id}`}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl"></div>
    </motion.div>
  );
}

export default ProfessionalCard;
