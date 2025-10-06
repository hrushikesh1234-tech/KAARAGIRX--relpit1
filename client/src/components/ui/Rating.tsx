// Import Lucide icons using require
import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  value: number;
  reviewCount?: number;
  showCount?: boolean;
  className?: string;
}

const Rating = ({ value, reviewCount, showCount = true, className = "" }: RatingProps) => {
  // Calculate full stars, half stars, and empty stars
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex text-accent">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="fill-current" />
        ))}
        
        {/* Half star if applicable */}
        {hasHalfStar && <StarHalf className="fill-current" />}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="text-gray-300" />
        ))}
      </div>
      
      {showCount && reviewCount !== undefined && (
        <span className="ml-2 text-gray-600">{value.toFixed(1)} ({reviewCount} reviews)</span>
      )}
    </div>
  );
};

export default Rating;
