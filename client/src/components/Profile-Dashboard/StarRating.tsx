
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  onRatingChange?: (rating: number) => void;
  clickable?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  size = 20, 
  className = "",
  onRatingChange,
  clickable = false
}) => {
  // Calculate the fill percentage for the last star
  const fullStars = Math.floor(rating);
  const partialStarFill = (rating % 1) * 100;
  const hasPartialStar = partialStarFill > 0;
  const emptyStars = maxRating - fullStars - (hasPartialStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star
          key={`full-${index}`}
          size={size}
          className={`text-yellow-400 fill-yellow-400 transition-colors ${
            clickable ? 'cursor-pointer hover:scale-110' : ''
          }`}
          onClick={() => clickable && onRatingChange?.(index + 1)}
        />
      ))}

      {/* Partial star */}
      {hasPartialStar && (
        <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
          <Star
            size={size}
            className="text-gray-400 absolute top-0 left-0"
          />
          <div 
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${partialStarFill}%` }}
          >
            <Star
              size={size}
              className="text-yellow-400 fill-yellow-400"
            />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star
          key={`empty-${index}`}
          size={size}
          className={`text-gray-400 transition-colors ${
            clickable ? 'cursor-pointer hover:scale-110' : ''
          }`}
          onClick={() => clickable && onRatingChange?.(fullStars + (hasPartialStar ? 1 : 0) + index + 1)}
        />
      ))}
    </div>
  );
};

export default StarRating;
