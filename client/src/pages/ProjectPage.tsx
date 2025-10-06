import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Emoji-based icon components
interface IconProps {
  className?: string;
  size?: number;
}

const ChevronLeftIcon: React.FC<IconProps> = ({ className = '', size }) => (
  <span className={`${className} ${size ? `h-${size} w-${size}` : ''}`}>⬅️</span>
);
const MessageCircleIcon: React.FC<IconProps> = ({ className = '', size }) => (
  <span className={`${className} ${size ? `h-${size} w-${size}` : ''}`}>💬</span>
);
const PhoneIcon: React.FC<IconProps> = ({ className = '', size }) => (
  <span className={`${className} ${size ? `h-${size} w-${size}` : ''}`}>📞</span>
);

import ProjectDetails from "../components/projects/ProjectDetails";
import ZoomableImageGallery from "../components/projects/ZoomableImageGallery";
import { useProject } from "../hooks/useProjects";
import { useProfessional } from "../hooks/useProfessionals";
import { useAuth } from "../contexts/AuthContext";

const ProjectPage = () => {
  const { id = '', professionalId = '' } = useParams<{ id: string; professionalId: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading: loadingProject } = useProject(id);
  const { data: professional, isLoading: loadingProfessional } = useProfessional(professionalId);
  const [activeTab, setActiveTab] = useState<'details' | 'photos'>('details');

  if (loadingProject || loadingProfessional) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 w-1/4 mb-4 rounded"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 w-1/3 mb-4 rounded"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project || !professional) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/professionals" className="text-blue-600 font-medium">
            Browse All Professionals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section with Main Project Image */}
      <div className="relative h-[400px] mb-8">
        <img 
          src={typeof project.images?.[0] === 'string' 
            ? project.images[0] 
            : (project.images?.[0] as any)?.imageUrl || "https://via.placeholder.com/1200x400?text=No+Image"} 
          alt={project.name || project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <Link to={`/professionals/${professionalId}`}>
              <button className="flex items-center text-white mb-4 hover:underline">
                <span className="mr-1">
                  <ChevronLeftIcon size={20} />
                </span>
                Back to Professional
              </button>
            </Link>
            <h1 className="text-4xl font-bold mb-2">{project.name || project.title}</h1>
            <p className="text-xl opacity-90">{project.type} in {project.location}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="md:w-2/3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex border-b">
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-3 text-lg font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                >
                  Project Details
                </button>
                <button 
                  onClick={() => setActiveTab('photos')}
                  className={`px-6 py-3 text-lg font-medium ${activeTab === 'photos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                >
                  Photos
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' ? (
              <ProjectDetails project={project} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
                <ZoomableImageGallery 
                  images={project.images || []} 
                  projectName={project.name || project.title} 
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:w-1/3">
            {/* Professional Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-4">
                <img 
                  src={professional.profileImage || "https://via.placeholder.com/100"} 
                  alt={professional.companyName || professional.fullName} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold text-lg">{professional.companyName || professional.fullName}</h3>
                  <p className="text-gray-600">{professional.profession}</p>
                </div>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <div className="flex items-center mb-2">
                  <span className="text-gray-600 w-24">Experience:</span>
                  <span className="font-medium">{professional.experience} Years</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-gray-600 w-24">Projects:</span>
                  <span className="font-medium">{professional.reviewCount || 0} Completed</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Location:</span>
                  <span className="font-medium">{professional.location}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="mr-2">
                    <MessageCircleIcon size={18} />
                  </span>
                  Message
                </button>
                <a 
                  href={`tel:${professional?.phone || ''}`} 
                  className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                >
                  <span className="mr-2">
                    <PhoneIcon size={18} />
                  </span>
                  Call
                </a>
              </div>
            </div>
            
            {/* Similar Projects */}
            {professional.projects && professional.projects.length > 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg mb-4">More Projects by {professional.companyName || professional.fullName}</h3>
                <div className="space-y-4">
                  {professional.projects
                    .filter(p => p.id !== project.id)
                    .slice(0, 3)
                    .map((p) => (
                      <Link 
                        key={p.id} 
                        to={`/projects/${p.id}/${professionalId}`}
                        className="block"
                      >
                        <div className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                          <img 
                            src={typeof p.images?.[0] === 'string' 
                              ? p.images[0] 
                              : '/placeholder-project.jpg'} 
                            alt={p.name || p.title}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <h4 className="font-medium">{p.name || p.title}</h4>
                            <p className="text-sm text-gray-500">{p.type}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  
                  <button 
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6"
                  >
                    <span className="h-5 w-5 mr-1">
                      <ChevronLeftIcon />
                    </span>
                    Back to Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
