import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileHeader from '@/components/Profile-Dashboard/ProfileHeader';
import TabNavigation from '@/components/Profile-Dashboard/TabNavigation';
import ReelsGrid from '@/components/Profile-Dashboard/ReelsGrid';
import StarRating from '@/components/Profile-Dashboard/StarRating';
import ImageSlider from '@/components/ui/ImageSlider';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessional, useProfessionalReviews, useCreateReview } from '@/hooks/useProfessionals';
import { useProfessionalProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [selectedReel, setSelectedReel] = useState<PortfolioItem | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // Fetch professional data
  const { data: professional, isLoading: loadingProfessional } = useProfessional(id);
  const { data: professionalReviews = [], isLoading: loadingReviews } = useProfessionalReviews(id);
  const { data: projects = [], isLoading: loadingProjects } = useProfessionalProjects(id);
  
  // Create review mutation
  const createReviewMutation = useCreateReview();

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

  const handleAddReview = async () => {
    if (!id || !user) return;

    try {
      await createReviewMutation.mutateAsync({
        professionalId: Number(id),
        data: {
          rating: newReview.rating,
          comment: newReview.comment
        }
      });

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  const renderReviewsTab = () => {
    return (
      <div className="px-4 pb-20 space-y-4">
        {/* Star Rating Summary */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-4">
          <div className="flex items-center justify-center gap-4 mb-2">
            <StarRating rating={averageRating} maxRating={5} size={24} />
            <span className="text-white font-semibold text-xl">{averageRating.toFixed(1)} out of 5</span>
          </div>
          <p className="text-gray-400 text-sm text-center">Based on {reviewCount} reviews</p>
        </div>

        {/* Give Review Button - only for logged-in users who are not viewing their own profile */}
        {user && !isOwnProfile && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-6 py-3 text-base font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              ⭐ Give Your Review
            </Button>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Write a Review</h3>
                <button 
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
                <StarRating 
                  rating={newReview.rating} 
                  maxRating={5} 
                  size={28} 
                  onRatingChange={(rating: number) => setNewReview({...newReview, rating})}
                  clickable
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Review</label>
                <textarea 
                  className="w-full bg-gray-700 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddReview}
                  disabled={!newReview.comment.trim()}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                    newReview.comment.trim() 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-400 cursor-not-allowed'
                  }`}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {professionalReviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No reviews yet</p>
          </div>
        ) : (
          professionalReviews.map((review: any) => (
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
          ))
        )}
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
