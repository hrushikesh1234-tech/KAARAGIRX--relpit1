import { format } from "date-fns";
import Rating from "../ui/Rating";
import { Review } from "@/lib/types";

interface ReviewItemProps {
  review: Review;
  className?: string;
}

const ReviewItem = ({ review, className = "" }: ReviewItemProps) => {
  // Format date (assuming createdAt is a string or Date)
  const formattedDate = review.createdAt instanceof Date
    ? format(review.createdAt, 'MMM d, yyyy')
    : format(new Date(review.createdAt), 'MMM d, yyyy');
  
  // Get initials for avatar
  const initials = review.userFullName 
    ? review.userFullName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)
    : 'UN';
  
  return (
    <div className={`border-b pb-6 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{initials}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h4 className="font-bold">{review.userFullName || "Anonymous User"}</h4>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-600 text-sm">{formattedDate}</span>
          </div>
          <Rating value={review.rating} showCount={false} className="mb-2" />
          {review.content && (
            <p className="text-gray-600">{review.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
