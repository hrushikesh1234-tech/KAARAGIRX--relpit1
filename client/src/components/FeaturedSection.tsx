import { Link } from "react-router-dom";
import ProfessionalCard from "./ProfessionalCard";
import { Professional } from "@/lib/types";

interface FeaturedSectionProps {
  title: string;
  professionals: Professional[];
  viewAllLink: string;
  className?: string;
}

const FeaturedSection = ({ title, professionals, viewAllLink, className = '' }: FeaturedSectionProps) => {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-16 ${className}`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 font-inter">{title}</h2>
        <Link to={viewAllLink} className="text-[#3b82f6] hover:text-[#2563eb] font-medium">
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((professional) => (
          <ProfessionalCard 
            key={professional.id} 
            professional={professional} 
            featured={true} 
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;
