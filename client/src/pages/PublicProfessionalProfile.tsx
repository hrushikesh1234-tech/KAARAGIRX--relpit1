import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileHeader from '@/components/Profile-Dashboard/ProfileHeader';
import TabNavigation from '@/components/Profile-Dashboard/TabNavigation';
import ReelsGrid from '@/components/Profile-Dashboard/ReelsGrid';
import StarRating from '@/components/Profile-Dashboard/StarRating';
import ImageSlider from '@/components/ui/ImageSlider';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessional, useProfessionalReviews } from '@/hooks/useProfessionals';
import { useProfessionalProjects } from '@/hooks/useProjects';

interface PortfolioItem {
  id: string;
  title: string;
  thumbnail: string;
  images?: string[];
  category?: string;
  bhk?: string;
  buildDate?: string;
  budget?: string;
  description?: string;
  specifications?: string[];
}

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

const PublicProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [selectedReel, setSelectedReel] = useState<PortfolioItem | null>(null);
  const [reviewCount, setReviewCount] = useState(0);

  // Fetch professional data
  const { data: professional, isLoading: loadingProfessional } = useProfessional(id);
  const { data: professionalReviews = [], isLoading: loadingReviews } = useProfessionalReviews(id);
  const { data: projects = [], isLoading: loadingProjects } = useProfessionalProjects(id);

  // Determine if this is the user's own profile
  const isOwnProfile = user?.id === professional?.userId;

  useEffect(() => {
    if (professionalReviews) {
      setReviewCount(professionalReviews.length);
    }
  }, [professionalReviews]);

  // Convert projects to portfolio items
  const portfolioItems: PortfolioItem[] = projects.map(p => ({
    id: String(p.id),
    title: p.title,
    thumbnail: p.coverImage || '',
    images: Array.isArray(p.images) ? p.images.map((img: any) => typeof img === 'string' ? img : img.imageUrl) : [],
    category: p.type,
    bhk: p.bhk?.toString(),
    buildDate: p.completionDate,
    budget: typeof p.budget === 'number' ? p.budget.toString() : p.budget,
    description: p.description,
    specifications: []
  }));

  // Calculate average rating
  const averageRating = professionalReviews.length > 0
    ? professionalReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / professionalReviews.length
    : 0;

  // Prepare profile data
  const profileData = {
    username: professional?.fullName || professional?.companyName || 'Professional',
    displayName: professional?.fullName || professional?.companyName || 'Professional',
    bio: professional?.about || '',
    occupation: professional?.profession === 'contractor' ? 'Contractor' : 'Architect',
    additionalInfo: professional?.location || '',
    stats: {
      posts: portfolioItems.length,
      followers: 0,
      following: 0
    },
    profileImage: professional?.profileImage || '/lovable-uploads/1c8904bf-5b78-4e55-88ea-dc5028083eef.png',
    isLive: false
  };

  if (loadingProfessional || loadingProjects || loadingReviews) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (!professional) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Professional not found</div>;
  }

  const renderPortfolioTab = () => {
    if (portfolioItems.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400">
          <p>No portfolio items yet</p>
        </div>
      );
    }

    return (
      <div className="px-4 pb-20 space-y-6">
        {portfolioItems.map((item) => (
          <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            {item.thumbnail && (
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-64 object-cover cursor-pointer"
                onClick={() => setSelectedReel(item)}
              />
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                {item.category && (
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                    {item.category}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-gray-400 text-sm mb-3">{item.description}</p>
              )}
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {item.bhk && <span>• {item.bhk} BHK</span>}
                {item.buildDate && <span>• {item.buildDate}</span>}
                {item.budget && <span>• ₹{item.budget}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReviewsTab = () => {
    if (professionalReviews.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400">
          <p>No reviews yet</p>
        </div>
      );
    }

    return (
      <div className="px-4 pb-20 space-y-4">
        {professionalReviews.map((review: any) => (
          <div key={review.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                  {review.userFullName?.[0] || 'A'}
                </div>
                <span className="font-medium text-white">{review.userFullName || 'Anonymous'}</span>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-gray-300 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderAboutTab = () => {
    return (
      <div className="px-4 pb-20">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-white">About</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 text-sm">Profession:</span>
              <p className="text-white">{professional.profession === 'contractor' ? 'Contractor' : 'Architect'}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Experience:</span>
              <p className="text-white">{professional.experience || 0} years</p>
            </div>
            {professional.specializations && professional.specializations.length > 0 && (
              <div>
                <span className="text-gray-400 text-sm">Specializations:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {professional.specializations.map((skill, index) => (
                    <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className="text-gray-400 text-sm">Location:</span>
              <p className="text-white">{professional.location || 'Not specified'}</p>
            </div>
            {professional.phone && (
              <div>
                <span className="text-gray-400 text-sm">Contact:</span>
                <p className="text-white">{professional.phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <ProfileHeader
        profileData={profileData}
        onEditProfile={() => {}}
        averageRating={averageRating}
        reviewCount={reviewCount}
      />

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'portfolio' && renderPortfolioTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
        {activeTab === 'about' && renderAboutTab()}
      </div>

      {selectedReel && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setSelectedReel(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            onClick={() => setSelectedReel(null)}
          >
            <X size={24} />
          </button>

          {selectedReel.images && selectedReel.images.length > 0 ? (
            <div className="max-w-4xl w-full px-4">
              <ImageSlider images={selectedReel.images} title={selectedReel.title} />
            </div>
          ) : selectedReel.thumbnail ? (
            <img
              src={selectedReel.thumbnail}
              alt={selectedReel.title}
              className="max-w-4xl max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="text-gray-400">No image available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicProfessionalProfile;
