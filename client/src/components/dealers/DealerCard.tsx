import React from 'react';
import { Dealer } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCategory, formatPrice, safeDealerId } from '@/utils/dealerUtils';
// Import Lucide icons
import { Star, MapPin, Package, Truck, CheckCircle2, Heart, ShoppingCart } from 'lucide-react';

interface DealerCardProps {
  dealer: Dealer;
  onLike: (dealer: Dealer, e: React.MouseEvent) => void;
  onAddToCart: (dealer: Dealer, e: React.MouseEvent) => void;
  onViewDetails: (id: string | number) => void;
  isLiked: boolean;
  isInCart: boolean;
  isLoading: boolean;
}

export const DealerCard: React.FC<DealerCardProps> = ({
  dealer,
  onLike,
  onAddToCart,
  onViewDetails,
  isLiked,
  isInCart,
  isLoading
}) => {
  return (
    <div 
      className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onViewDetails(dealer.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetails(dealer.id)}
      aria-label={`View details for ${dealer.name}`}
    >
      {/* Left side - Image and rating */}
      <div className="flex-shrink-0 w-20">
        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden mb-1.5 flex items-center justify-center">
          <img 
            src={dealer.image} 
            alt={dealer.name}
            className="w-full h-full object-contain p-1"
            style={{ 
              maxWidth: '140%',
              maxHeight: '140%',
              transform: 'scale(1.4)'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder.jpg';
            }}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center bg-yellow-50 px-1.5 py-0.5 rounded text-center">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-0.5" />
            <span className="text-xs font-medium text-gray-900">
              {getRating(dealer.rating).toFixed(1)}
            </span>
          </div>
          {dealer.deliveryTime && (
            <div className="flex items-center justify-center text-2xs text-gray-500">
              <Truck className="w-3 h-3 mr-0.5 text-gray-400" />
              <span>{dealer.deliveryTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900">{dealer.name}</h3>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs font-mono bg-gray-100">
                ID: {safeDealerId(dealer.id).padStart(3, '0')}
              </Badge>
            </div>
            {dealer.category && (
              <div className="flex flex-wrap gap-1.5 mt-1 -mx-0.5">
                <div className="inline-flex items-center max-w-[100px] px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 overflow-hidden">
                  <span className="truncate">
                    {formatCategory(dealer.category)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(dealer, e);
            }}
            className="text-gray-300 hover:text-red-500 focus:outline-none p-1 -mr-1"
            aria-label={isLiked ? 'Remove from liked items' : 'Add to liked items'}
          >
            <Heart 
              className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} 
            />
          </button>
        </div>
        
        <div className="mt-1 flex items-center text-sm text-gray-600">
          <Package className="w-3.5 h-3.5 mr-1 text-gray-400" />
          {dealer.businessType || 'Supplier'}
          {dealer.location && (
            <>
              <span className="mx-1.5 text-gray-300">•</span>
              <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
              <span>{dealer.location}</span>
            </>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(dealer.price)}
            </span>
            {dealer.unit && (
              <span className="text-sm text-gray-500 ml-1">/{dealer.unit}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 px-3 flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(dealer.id);
              }}
            >
              View
            </Button>
            <Button 
              variant="default"
              size="sm" 
              className={`text-xs h-8 px-3 flex-1 transition-all ${
                isInCart 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(dealer, e);
              }}
              disabled={isLoading}
              aria-busy={isLoading}
              aria-label={isInCart ? 'Remove from cart' : 'Add to cart'}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isInCart ? 'Removing...' : 'Adding...'}
                </div>
              ) : isInCart ? (
                <div className="flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>In Cart</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                  <span>Add</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to safely get rating
function getRating(rating?: number): number {
  return rating || 0;
}
