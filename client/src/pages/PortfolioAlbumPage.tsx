import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
// Import Lucide icons using require
import { ArrowLeft } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { Project } from "@/lib/types";

interface ProjectImage {
  id?: number;
  projectId?: number;
  imageUrl: string;
  sortOrder?: number;
}

interface ProjectGalleryProps {
  images: string[] | ProjectImage[];
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ images }) => {
  // Helper function to get the image URL regardless of the type
  const getImageUrl = (image: string | ProjectImage): string => {
    return typeof image === 'string' ? image : image.imageUrl;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="aspect-w-16 aspect-h-9">
          <img 
            src={getImageUrl(image)} 
            alt={`Project image ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};

const PortfolioAlbumPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("photos");
  
  const { data: project, isLoading, isError } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-4 bg-gray-100 rounded">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    navigate("/404");
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/professionals" className="text-primary font-medium">
            Browse Professionals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Link to={`/professionals/${project.professionalId}`} className="inline-flex items-center text-primary mb-4">
          <ArrowLeft className="mr-1" /> Back to Profile
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-600 mb-6">{project.description || `A ${project.propertyType.toLowerCase()} project in ${project.location || "Kamshet"}`}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Property Type</p>
            <p className="font-medium">{project.propertyType}</p>
          </div>
          
          {project.budget && (
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Budget</p>
              <p className="font-medium">{project.budget}</p>
            </div>
          )}
          
          {project.completionYear && (
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="font-medium">{project.completionYear}</p>
            </div>
          )}
          
          {project.area && (
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Area</p>
              <p className="font-medium">{project.area}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Project Gallery */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex mb-6">
          <button 
            className={`px-4 py-2 ${
              activeTab === "photos" 
                ? "text-primary border-b-2 border-primary" 
                : "text-gray-600 border-b-2 border-transparent"
            } font-medium`}
            onClick={() => setActiveTab("photos")}
          >
            Photos
          </button>
          <button 
            className={`px-4 py-2 ${
              activeTab === "plans" 
                ? "text-primary border-b-2 border-primary" 
                : "text-gray-600 border-b-2 border-transparent"
            } font-medium`}
            onClick={() => setActiveTab("plans")}
          >
            Architectural Plans
          </button>
        </div>
        
        {activeTab === "photos" && project.images && (
          <ProjectGallery images={project.images} />
        )}
        
        {activeTab === "plans" && (
          <div className="text-center py-8">
            <p className="text-gray-500">No architectural plans available for this project.</p>
          </div>
        )}
      </div>
      
      {/* Project Description */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Project Description</h2>
        {project.description ? (
          <>
            <p className="text-gray-600 mb-4">{project.description}</p>
            {project.propertyType === "Residential" && (
              <>
                <p className="text-gray-600 mb-4">
                  Key features include:
                </p>
                <ul className="list-disc pl-5 text-gray-600 mb-4 space-y-2">
                  <li>Modern design with open floor plans</li>
                  <li>Large windows for natural lighting</li>
                  <li>Energy-efficient construction materials</li>
                  <li>Spacious outdoor areas</li>
                  <li>Quality finishes throughout</li>
                </ul>
              </>
            )}
          </>
        ) : (
          <p className="text-gray-600">
            This {project.propertyType.toLowerCase()} project showcases the expertise and craftsmanship of the professional. 
            {project.budget && ` Completed with a budget of ${project.budget},`} 
            {project.area && ` spanning ${project.area},`} 
            this project demonstrates high-quality construction and attention to detail.
          </p>
        )}
      </div>
    </div>
  );
};

export default PortfolioAlbumPage;
