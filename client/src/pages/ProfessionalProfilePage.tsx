import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
// Emoji-based icon components
interface IconProps {
  className?: string;
}

const MapPinIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>📍</span>;
const MessageCircleIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>💬</span>;
const PhoneIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>📞</span>;
const StarIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>⭐</span>;
const BookmarkIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>🔖</span>;
const CalendarIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>📅</span>;
const CheckCircleIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>✅</span>;
const GridIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>◼️</span>;
const InfoIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>ℹ️</span>;
const MessageSquareIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>💬</span>;
const AwardIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>🏆</span>;
const ClockIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>⏰</span>;
const UsersIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>👥</span>;
const BriefcaseIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>💼</span>;
const Share2Icon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>↗️</span>;
const ChevronDownIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>🔽</span>;
const ImageIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>🖼️</span>;
const ThumbsUpIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>👍</span>;
const MailIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>✉️</span>;
const FilterIcon: React.FC<IconProps> = ({ className = '' }) => <span className={className}>🔍</span>;
import ProjectCardSlider from "../components/projects/ProjectCardSlider";
import { useProfessional, useProfessionalReviews } from "../hooks/useProfessionals";
import { useCreateBookmark, useDeleteBookmark, useBookmarks } from "../hooks/useBookmarks";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, Professional } from "@/lib/types";

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

interface ReviewType {
  id: number;
  rating: number;
  comment: string;
  createdAt?: string | Date;
  projectName?: string;
  user?: {
    name?: string;
    profileImage?: string;
  };
}

// Using the imported Bookmark type from @/lib/types
// No need for a separate BookmarkType interface

const mockProjects: ProjectType[] = [
  {
    id: 1,
    name: 'Modern Villa Design',
    type: 'Residential',
    budget: 5000000,
    location: 'Mumbai',
    completionDate: '2023-05-15',
    area: 3500,
    bhk: 4,
    style: 'Contemporary',
    description: 'A beautiful modern villa with open spaces and luxury amenities',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ]
  },
  {
    id: 2,
    name: 'Office Space Renovation',
    type: 'Commercial',
    budget: 2500000,
    location: 'Pune',
    completionDate: '2023-08-22',
    area: 5000,
    style: 'Modern',
    description: 'Complete renovation of corporate office space with modern design elements',
    images: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    ]
  },
  {
    id: 3,
    name: 'Luxury Apartment Interior',
    type: 'Interior',
    budget: 3500000,
    location: 'Bangalore',
    completionDate: '2023-10-10',
    area: 2800,
    bhk: 3,
    style: 'Luxury',
    description: 'High-end interior design for a luxury apartment with premium finishes',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ]
  }
];


const ProfessionalProfilePage = () => {
  // All hooks must be called at the top level, before any conditional returns
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'about' | 'services'>('portfolio');
  const [showAllSpecializations, setShowAllSpecializations] = useState(false);
  
  // Data fetching hooks
  const { data: professional, isLoading: loadingProfessional, error: professionalError } = useProfessional(id);
  const { data: reviews = [], isLoading: loadingReviews, error: reviewsError } = useProfessionalReviews(id);
  const { data: bookmarks = [] } = useBookmarks();
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();
  
  // Type guard to check if the professional data is loaded
  const isProfessionalLoaded = !loadingProfessional && professional && !professionalError;
  
  // Scroll to top when the component mounts or when ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  // Show loading state
  if (loadingProfessional || loadingReviews) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show error state
  if (professionalError || reviewsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md mx-auto bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Professional</h2>
          <p className="text-gray-600 mb-4">We couldn't load the professional's profile. Please try again later.</p>
          <Link to="/professionals" className="text-blue-600 hover:underline">
            ← Back to Professionals
          </Link>
        </div>
      </div>
    );
  }
  
  // If no professional data is found
  if (!professional) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Professional Not Found</h2>
          <p className="text-gray-600 mb-4">The professional you're looking for doesn't exist or has been removed.</p>
          <Link to="/professionals" className="text-blue-600 hover:underline">
            ← Back to Professionals
          </Link>
        </div>
      </div>
    );
  }
  
  // Mock projects data
  const mockProjects: ProjectType[] = [
    {
      id: 1,
      name: "BlueSky Bungalow",
      type: "Bungalow",
      budget: 3500000,
      location: "Lonavala, Maharashtra",
      completionDate: "2024",
      area: 1200,
      bhk: 4,
      style: "Modern Architecture",
      description: "A luxurious 4 BHK bungalow with modern design elements, spacious rooms, and a private pool.",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",
        "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=600",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600"
      ]
    },
    {
      id: 2,
      name: "Oasis Apartments",
      type: "Interior Renovation",
      budget: 2000000,
      location: "Pune, Maharashtra",
      completionDate: "2022",
      area: 950,
      description: "Complete interior renovation of a 3 BHK apartment with modern furnishings and smart home features.",
      images: [
        "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=600",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600"
      ]
    },
    {
      id: 3,
      name: "Hotel Summit View",
      type: "Hotel Renovation",
      budget: 40000000,
      location: "Mumbai, Maharashtra",
      completionDate: "2023",
      area: 4500,
      style: "Contemporary Luxury",
      description: "Complete renovation of a boutique hotel including 25 rooms, lobby, restaurant, and rooftop lounge.",
      images: [
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600",
        "https://images.unsplash.com/photo-1600566752229-250b0347e0cd?w=600",
        "https://images.unsplash.com/photo-1600566752354-c5a8c4c85ad6?w=600"
      ]
    }
  ];
  
  // Check if professional is bookmarked
  const bookmarkEntry = bookmarks?.find((bookmark: Bookmark) => 
    bookmark.professional?.id === Number(id)
  );
  const isBookmarked = !!bookmarkEntry;
  
  const handleBookmarkToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark professionals",
        variant: "destructive",
      });
      return;
    }

    if (isBookmarked && bookmarkEntry) {
      deleteBookmark.mutate(bookmarkEntry.bookmarkId);
    } else if (!isBookmarked && professional) {
      createBookmark.mutate(professional.id);
    }
  };

  if (loadingProfessional) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
          <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Professional Not Found</h2>
          <p className="text-gray-600 mb-6">The professional you're looking for doesn't exist or has been removed.</p>
          <Link to="/professionals" className="text-primary font-medium">
            Browse All Professionals
          </Link>
        </div>
      </div>
    );
  }

  // Determine if the professional is a contractor or architect for styling
  const isProfessionContractor = professional.profession === 'contractor';
  const professionColor = isProfessionContractor ? 'bg-[#51504f] text-white' : 'bg-[#bcbcbd] text-gray-800';
  const accentColor = isProfessionContractor ? 'from-orange-500 to-orange-600' : 'from-indigo-500 to-indigo-600';
  const buttonColor = isProfessionContractor ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-500 hover:bg-indigo-600';

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-80 bg-gradient-to-r from-gray-700 to-gray-900 overflow-hidden">
        {professional.profileImage ? (
          <div className="w-full h-full" style={{ 
            backgroundImage: `url(${professional.profileImage})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px) brightness(0.7)'
          }}></div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-75"></div>
        )}
        
        {/* Share button */}
        <button className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all">
          <Share2Icon className="w-5 h-5" />
        </button>
      </div>
      
      {/* Profile Section */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 mb-6 flex flex-col md:flex-row md:items-end">
          {/* Profile Image */}
          <div className="relative z-10 mx-auto md:mx-0 md:ml-8">
            <div className="relative">
              <img 
                src={professional.profileImage || "https://via.placeholder.com/150"} 
                alt={professional.companyName || professional.fullName || "Professional"} 
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-md"
              />
              <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-1">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {professional.companyName || professional.fullName}
                </h1>
                <div className="flex items-center justify-center md:justify-start mt-1 space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${professionColor}`}>
                    {professional.profession === 'contractor' ? 'Contractor' : 'Architect'}
                  </span>
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-gray-600">{professional.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons for Desktop */}
              <div className="hidden md:flex space-x-3 mt-4 md:mt-0">
                <button className={`px-5 py-2 ${buttonColor} text-white rounded-lg flex items-center justify-center transition-colors`}>
                  <span className="mr-2"><PhoneIcon /></span> Contact
                </button>
                <button className={`px-5 py-2 ${buttonColor} text-white rounded-lg flex items-center justify-center transition-colors`}>
                  <span className="mr-2"><MessageSquareIcon /></span> Message
                </button>
                <button 
                  onClick={handleBookmarkToggle}
                  className={`px-5 py-2 rounded-lg flex items-center justify-center transition-colors ${
                    isBookmarked 
                      ? buttonColor + ' text-white' 
                      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`mr-2 ${isBookmarked ? 'text-white' : ''}`}><BookmarkIcon /></span>
                  {isBookmarked ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="flex justify-center md:justify-start space-x-6 mt-4">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1"><StarIcon /></span>
                <span className="font-bold">{professional.rating}</span>
                <span className="text-sm ml-1 text-gray-600">({professional.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center">
                📁
                <span className="text-gray-600">{professional.experience} years exp.</span>
              </div>
              <div className="flex items-center">
                👥
                <span className="text-gray-600">{professional.reviewCount || 0} projects</span>
              </div>
            </div>
            
            {/* Specializations */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {(showAllSpecializations ? professional.specializations : professional.specializations?.slice(0, 3))?.map((spec) => (
                  <span key={spec} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    {spec}
                  </span>
                ))}
                {professional.specializations && professional.specializations.length > 3 && (
                  <button 
                    onClick={() => setShowAllSpecializations(!showAllSpecializations)}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-blue-600 hover:bg-gray-200 transition-colors"
                  >
                    {showAllSpecializations ? 'Show Less' : `+${professional.specializations.length - 3} more`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Action Buttons */}
        <div className="md:hidden flex justify-between px-4 py-3 bg-white rounded-lg shadow-sm mb-4">
          <button className="flex-1 flex flex-col items-center justify-center py-2 text-gray-700 hover:text-blue-600">
            <span className="text-xl mb-1"><PhoneIcon /></span>
            <span className="text-xs">Call</span>
          </button>
          <button className="flex-1 flex flex-col items-center justify-center py-2 text-gray-700 hover:text-blue-600">
            <span className="text-xl mb-1"><MessageSquareIcon /></span>
            <span className="text-xs">Message</span>
          </button>
          <button 
            onClick={handleBookmarkToggle}
            className="flex-1 flex flex-col items-center justify-center py-2 text-gray-700 hover:text-blue-600"
          >
            <span className={`text-xl mb-1 ${isBookmarked ? 'text-blue-600' : ''}`}><BookmarkIcon /></span>
            <span className="text-xs">{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
          <button className="flex-1 flex flex-col items-center justify-center py-2 text-gray-700 hover:text-blue-600">
            <span className="text-xl mb-1"><MailIcon /></span>
            <span className="text-xs">Email</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`flex-1 px-4 py-3 font-medium text-center ${
                activeTab === 'portfolio' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Portfolio
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`flex-1 px-4 py-3 font-medium text-center ${
                activeTab === 'services' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Services
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`flex-1 px-4 py-3 font-medium text-center ${
                activeTab === 'about' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-4 py-3 font-medium text-center ${
                activeTab === 'reviews' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                  Filter
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                  Sort by: Recent
                </button>
              </div>
            </div>
            
            {/* Filter Options */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm">
                All Projects
              </button>
              <button className="flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50">
                Residential
              </button>
              <button className="flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50">
                Commercial
              </button>
              <button className="flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50">
                Interior
              </button>
              <button className="flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50">
                <span className="mr-1.5"><FilterIcon /></span> More Filters
              </button>
            </div>
            
            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProjects.map((project) => (
                <ProjectCardSlider key={project.id} project={project} professionalId={id} />
              ))}
            </div>
          </div>
        )}
        
        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Services</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Interior Design</h3>
                <p className="text-gray-600">We offer interior design services for residential and commercial spaces.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Architecture</h3>
                <p className="text-gray-600">Our team of architects can help you design your dream home or office building.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Construction</h3>
                <p className="text-gray-600">We provide construction services for residential and commercial projects.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">About {professional.companyName || professional.fullName}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Experience</h3>
                <p className="text-3xl font-bold text-blue-600">{professional.experience}+</p>
                <p className="text-gray-600">Years</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Projects</h3>
                <p className="text-3xl font-bold text-blue-600">{professional.reviewCount || 25}+</p>
                <p className="text-gray-600">Completed</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Team Size</h3>
                <p className="text-3xl font-bold text-blue-600">15+</p>
                <p className="text-gray-600">Professionals</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-700">
                {professional.about || `${professional.companyName || professional.fullName} is a highly experienced ${professional.profession} based in ${professional.location}. With over ${professional.experience} years of experience in the industry, they specialize in ${professional.specializations?.join(', ') || 'various construction and design projects'}.`}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {professional.specializations?.map((spec) => (
                  <span key={spec} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="mr-2 text-gray-600"><PhoneIcon /></span>
                  <span>{professional.phone || '+91 9876543210'}</span>
                </p>
                <p className="flex items-center">
                  <span className="mr-2 text-gray-600"><MapPinIcon /></span>
                  <span>{professional.location}, Maharashtra, India</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">Client Reviews</h2>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`${i < Math.floor(professional.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <StarIcon />
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-lg">{professional.rating}</span>
                    <span className="text-gray-600 ml-1">({professional.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
                    <div className="col-span-5 md:col-span-1 text-sm text-gray-600">5 stars</div>
                    <div className="col-span-5 md:col-span-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="col-span-5 md:col-span-1 text-sm text-gray-600">75%</div>
                    
                    <div className="col-span-5 md:col-span-1 text-sm text-gray-600">4 stars</div>
                    <div className="col-span-5 md:col-span-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div className="col-span-5 md:col-span-1 text-sm text-gray-600">15%</div>
                    
                    <div className="col-span-5 md:col-span-1 text-sm text-gray-600">3 stars</div>
                    <div className="col-span-5 md:col-span-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: '5%' }}></div>
                      </div>
                    </div>
                    <div className="col-span-5 md:col-span-1 text-sm text-gray-600">5%</div>
                    
                    <div className="col-span-5 md:col-span-1 text-sm text-gray-600">2 stars</div>
                    <div className="col-span-5 md:col-span-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: '3%' }}></div>
                      </div>
                    </div>
                    <div className="col-span-5 md:col-span-1 text-sm text-gray-600">3%</div>
                    
                    <div className="col-span-5 md:col-span-1 text-sm text-gray-600">1 star</div>
                    <div className="col-span-5 md:col-span-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: '2%' }}></div>
                      </div>
                    </div>
                    <div className="col-span-5 md:col-span-1 text-sm text-gray-600">2%</div>
                  </div>
                </div>
                
                <div className="md:ml-6 mt-4 md:mt-0">
                  <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Write a Review
                  </button>
                </div>
              </div>
            </div>
            
            {/* Reviews List */}
            <div className="space-y-4">
              {loadingReviews ? (
                // Loading skeleton
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-5 animate-pulse">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/5 mb-4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews && reviews.length > 0 ? (
                (reviews as ReviewType[]).map((review: ReviewType) => (
                  <div key={review.id} className="bg-white rounded-lg shadow-md p-5">
                    <div className="flex items-start">
                      <img 
                        src={review.user?.profileImage || "https://via.placeholder.com/40"} 
                        alt={review.user?.name || "User"} 
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{review.user?.name || "Anonymous User"}</h4>
                            <div className="flex items-center mt-1">
                              <div className="flex mr-2">
                                {[...Array(5)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  >
                                    <StarIcon />
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{new Date(review.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {review.projectName && (
                            <div className="text-gray-500 text-sm">
                              {review.projectName}
                            </div>
                          )}
                        </div>
                        <p className="mt-3 text-gray-700">{review.comment}</p>
                        
                        {/* Review images would go here if available */}
                        
                        <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                          <button className="flex items-center text-gray-500 hover:text-blue-600 mr-4">
                            <span className="mr-1"><ThumbsUpIcon /></span>
                            <span className="text-sm">Helpful (0)</span>
                          </button>
                          <button className="text-gray-500 hover:text-blue-600 text-sm">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to review this professional</p>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Write a Review
                  </button>
                </div>
              )}
            </div>
            
            {reviews && reviews.length > 3 && (
              <div className="text-center mt-6">
                <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalProfilePage;
