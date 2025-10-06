import React, { useState } from 'react';
import { Link } from "react-router-dom";
// Icons replaced with text for compatibility

interface ProjectType {
  id: number;
  name: string;
  type: string;
  budget: number;
  location: string;
  completionDate: string;
  area: number;
  bhk?: number;
  style?: string;
  description?: string;
  images: string[];
}

interface ProjectCardSliderProps {
  project: ProjectType;
  professionalId?: string | number;
}

const ProjectCardSlider = ({ project, professionalId }: ProjectCardSliderProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <Link to={`/projects/${project.id}${professionalId ? `/${professionalId}` : ''}`} className="block">
      <div 
        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Carousel */}
        <div className="relative h-64 bg-gray-200">
          <img 
            src={project.images[currentImageIndex]} 
            alt={project.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {/* Navigation Arrows - Only visible on hover or mobile */}
          {project.images.length > 1 && (isHovered || window.innerWidth < 768) && (
            <>
              <button 
                onClick={prevImage} 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                aria-label="Previous image"
              >
                &lt;
              </button>
              <button 
                onClick={nextImage} 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                aria-label="Next image"
              >
                &gt;
              </button>
            </>
          )}
          
          {/* Image Counter */}
          {project.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
              {currentImageIndex + 1}/{project.images.length}
            </div>
          )}
          
          {/* Save Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add save functionality here
            }} 
            className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Save project"
          >
            ❤️
          </button>
          
          {/* Project Type Badge */}
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md">
            {project.type}
          </div>
        </div>
        
        {/* Project Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{project.name}</h3>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            📍
            <span className="line-clamp-1">{project.location}</span>
            <span className="mx-2 text-gray-400">•</span>
            📅
            <span>{project.completionDate}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {project.description || `A ${project.type} project with a budget of ₹${(project.budget/100000).toFixed(1)} lakh.`}
          </p>
          
          <div className="flex justify-between items-center border-t pt-3 mt-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">₹{(project.budget/100000).toFixed(1)} lakh</span>
              {project.area && <span className="ml-2">{project.area} sq.ft</span>}
            </div>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              View Details ↗
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCardSlider;
