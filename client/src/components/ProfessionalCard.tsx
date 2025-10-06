import { Link } from "react-router-dom";
import { Professional } from "@/lib/types";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
// Import Lucide icons using require
import { Star } from 'lucide-react';

interface ProfessionalCardProps {
  professional: Professional;
  featured?: boolean;
}

const ProfessionalCard = ({ professional, featured = false }: ProfessionalCardProps) => {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await apiRequest('POST', `/api/professionals/${professional.id}/bookmark`, {
        bookmarked: !isBookmarked
      });
      
      setIsBookmarked(!isBookmarked);
      toast({
        title: !isBookmarked ? "Professional bookmarked" : "Professional removed from bookmarks",
        description: !isBookmarked 
          ? `${professional.fullName || professional.companyName} has been added to your bookmarks`
          : `${professional.fullName || professional.companyName} has been removed from your bookmarks`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "You need to be logged in to bookmark professionals",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex text-[#f97316]">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="fill-current" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="stroke-current fill-transparent" />
        ))}
      </div>
    );
  };

  if (featured) {
    return (
      <Link to={`/professionals/${professional.id}`} className="block">
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <div className="relative h-48">
          <img 
            src={professional.profileImage || "https://via.placeholder.com/300"} 
            alt={professional.fullName || professional.companyName || ""} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-4 right-4 bg-white p-1.5 rounded-full">
            <button 
              onClick={toggleBookmark} 
              aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
              className="focus:outline-none"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill={isBookmarked ? "#3b82f6" : "none"} 
                stroke={isBookmarked ? "#3b82f6" : "currentColor"} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2">{professional.fullName || professional.companyName}</h3>
          <p className="text-gray-600 mb-3">{professional.profession === 'contractor' ? 'Contractor' : 'Architect'}</p>
          <div className="flex items-center mb-3">
            {renderStars(professional.rating)}
            <span className="ml-2 text-gray-600">{professional.rating.toFixed(1)} ({professional.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{professional.location}</span>
          </div>
          <Link to={`/professionals/${professional.id}`} className="block">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md font-medium transition-colors duration-200">
              View Profile
            </button>
          </Link>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/professionals/${professional.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 duration-200 cursor-pointer">
        <div className="p-6 md:flex">
        <div className="md:w-1/4 mb-4 md:mb-0 md:mr-6">
          <div className="rounded-lg overflow-hidden h-48 md:h-full">
            <img 
              src={professional.profileImage || "https://via.placeholder.com/300"} 
              alt={professional.fullName || professional.companyName || ""} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        <div className="md:w-3/4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{professional.fullName || professional.companyName}</h2>
              <p className="text-gray-600 mb-3">{professional.profession === 'contractor' ? 'Contractor' : 'Architect'}</p>
            </div>
            <button 
              onClick={toggleBookmark}
              className={`focus:outline-none ${isBookmarked ? "text-[#3b82f6]" : "text-gray-400 hover:text-[#3b82f6]"}`}
              aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill={isBookmarked ? "#3b82f6" : "none"} 
                stroke={isBookmarked ? "#3b82f6" : "currentColor"} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-xl"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
          
          <div className="flex items-center mb-3">
            {renderStars(professional.rating)}
            <span className="ml-2 text-gray-600">{professional.rating.toFixed(1)} ({professional.reviewCount} reviews)</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {professional.specializations && professional.specializations.map((spec, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800">
                {spec}
              </span>
            ))}
          </div>
          
          <div className="flex items-center text-gray-600 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{professional.location}</span>
          </div>
          
          <p className="text-gray-600 mb-4">
            {professional.about || `Professional with ${professional.experience} years of experience`}
          </p>
          
          <div className="flex gap-3">
            <Link to={`/professionals/${professional.id}`} className="block">
              <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 transform hover:scale-105">
                View Profile
              </button>
            </Link>
            <Link to={`/professionals/${professional.id}?contact=true`} className="block">
              <button className="bg-white border border-[#3b82f6] text-[#3b82f6] hover:bg-[#eff6ff] px-6 py-2 rounded-md font-medium transition-colors duration-200">
                Contact
              </button>
            </Link>
          </div>
        </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfessionalCard;
