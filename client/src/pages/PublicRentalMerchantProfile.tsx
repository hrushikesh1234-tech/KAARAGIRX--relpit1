import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import ProfileHeader from '@/components/Profile-Dashboard/ProfileHeader';
import TabNavigation from '@/components/Profile-Dashboard/TabNavigation';
import ReelsGrid from '@/components/Profile-Dashboard/ReelsGrid';
import StarRating from '@/components/Profile-Dashboard/StarRating';
import ImageSlider from '@/components/ui/ImageSlider';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface PortfolioItem {
  id: string;
  title: string;
  thumbnail: string;
  images?: string[];
  category?: string;
  subcategory?: string;
  dailyRate?: string;
  weeklyRate?: string;
  monthlyRate?: string;
  description?: string;
  specifications?: Record<string, string>;
}

interface Review {
  id: number;
  merchantId: number;
  customerId: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface RentalMerchant {
  id: number;
  companyName?: string;
  fullName?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  location?: string;
  verified?: boolean;
  profileImage?: string;
  coverImage?: string;
  about?: string;
  experience?: number;
  specializations?: string[];
}

const PublicRentalMerchantProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [selectedReel, setSelectedReel] = useState<PortfolioItem | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [merchant, setMerchant] = useState<RentalMerchant | null>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchMerchantData();
      fetchEquipment();
      fetchReviews();
    }
  }, [id]);

  const fetchMerchantData = async () => {
    try {
      const response = await fetch(`/api/professionals/${id}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setMerchant(data);
      }
    } catch (error) {
      console.error('Error fetching merchant:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`/api/rental-equipment/merchant/${id}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setEquipment(data);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const fetchReviews = async () => {
    setReviews([]);
  };

  useEffect(() => {
    setReviewCount(reviews.length);
  }, [reviews]);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (!merchant) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Merchant not found</div>;
  }

  const portfolioItems: PortfolioItem[] = equipment.map(e => ({
    id: String(e.id),
    title: e.name,
    thumbnail: e.image || e.images?.[0] || '/placeholder-equipment.jpg',
    images: e.images || (e.image ? [e.image] : []),
    category: e.category,
    subcategory: e.subcategory,
    dailyRate: e.dailyRate,
    weeklyRate: e.weeklyRate,
    monthlyRate: e.monthlyRate,
    description: e.description,
    specifications: e.specifications
  }));

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length
    : 0;

  const profileData = {
    username: merchant?.companyName || merchant?.fullName || 'Rental Merchant',
    displayName: merchant?.companyName || merchant?.fullName || 'Rental Merchant',
    bio: merchant?.about || '',
    occupation: 'Rental Merchant',
    additionalInfo: merchant?.location || '',
    stats: {
      posts: portfolioItems.length,
      followers: followerCount,
      following: 0
    },
    profileImage: merchant?.profileImage || '/lovable-uploads/1c8904bf-5b78-4e55-88ea-dc5028083eef.png',
    isLive: false
  };

  const renderPortfolioTab = () => {
    if (portfolioItems.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400">
          <p>No equipment available yet</p>
        </div>
      );
    }

    const reels = portfolioItems.map((item) => ({
      id: parseInt(item.id),
      title: item.title,
      views: '0',
      thumbnail: item.thumbnail,
      mediaCount: item.images?.length || 0
    }));

    return <ReelsGrid reels={reels} onReelClick={(reel) => {
      const fullItem = portfolioItems.find(p => p.id === reel.id.toString());
      if (fullItem) setSelectedReel(fullItem);
    }} />;
  };

  const handleFollowClick = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to follow merchants",
        variant: "destructive",
      });
      return;
    }

    setIsFollowing(!isFollowing);
    setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
    
    toast({
      title: "Success",
      description: isFollowing ? "Unfollowed successfully" : "Followed successfully",
    });
  };

  const handleAddReview = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to submit a review",
        variant: "destructive",
      });
      return;
    }

    const newReviewData: Review = {
      id: Date.now(),
      merchantId: Number(id),
      customerId: user.id,
      customerName: user.fullName || 'Anonymous',
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newReviewData, ...prev]);
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '' });
    
    toast({
      title: "Success",
      description: "Review submitted successfully",
    });
  };

  const renderReviewsTab = () => {
    return (
      <div className="px-4 pb-20 space-y-4">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-4">
          <div className="flex items-center justify-center gap-4 mb-2">
            <StarRating rating={averageRating} maxRating={5} size={24} />
            <span className="text-white font-semibold text-xl">{averageRating.toFixed(1)} out of 5</span>
          </div>
          <p className="text-gray-400 text-sm text-center">Based on {reviewCount} reviews</p>
        </div>

        {user && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-6 py-3 text-base font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              ⭐ Give Your Review
            </Button>
          </div>
        )}

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

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No reviews yet</p>
          </div>
        ) : (
          reviews.map((review: Review) => (
            <div key={review.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                    {review.customerName?.[0] || 'A'}
                  </div>
                  <span className="font-medium text-white">{review.customerName || 'Anonymous'}</span>
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
              <span className="text-gray-400 text-sm">Company Name:</span>
              <p className="text-white">{merchant.companyName || merchant.fullName}</p>
            </div>
            {merchant.contactPerson && (
              <div>
                <span className="text-gray-400 text-sm">Contact Person:</span>
                <p className="text-white">{merchant.contactPerson}</p>
              </div>
            )}
            {merchant.experience && (
              <div>
                <span className="text-gray-400 text-sm">Experience:</span>
                <p className="text-white">{merchant.experience} years</p>
              </div>
            )}
            {merchant.specializations && merchant.specializations.length > 0 && (
              <div>
                <span className="text-gray-400 text-sm">Specializations:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {merchant.specializations.map((spec, index) => (
                    <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className="text-gray-400 text-sm">Location:</span>
              <p className="text-white">{merchant.location || 'Not specified'}</p>
            </div>
            {merchant.phone && (
              <div>
                <span className="text-gray-400 text-sm">Contact:</span>
                <p className="text-white">{merchant.phone}</p>
              </div>
            )}
            {merchant.email && (
              <div>
                <span className="text-gray-400 text-sm">Email:</span>
                <p className="text-white">{merchant.email}</p>
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
        isOwnProfile={false}
        professionalId={id}
        isFollowing={isFollowing}
        onFollowClick={handleFollowClick}
      />

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'portfolio' && renderPortfolioTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
        {activeTab === 'about' && renderAboutTab()}
      </div>

      {selectedReel && (
        <div
          className="fixed inset-0 bg-black/95 z-50 overflow-y-auto"
          onClick={() => setSelectedReel(null)}
        >
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-black max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                className="sticky top-4 float-right p-2 rounded-full bg-gray-800 hover:bg-gray-700 z-10 mr-4"
                onClick={() => setSelectedReel(null)}
              >
                <X size={24} />
              </button>

              <div className="px-4 pt-1 pb-2 md:px-8">
                <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-center mb-4">
                  {selectedReel.title}
                </h1>
                {selectedReel.images && selectedReel.images.length > 0 && (
                  <ImageSlider 
                    images={selectedReel.images}
                    title={selectedReel.title}
                  />
                )}
              </div>
              
              <div className="space-y-8 p-4 md:p-8">
                {selectedReel.description && (
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-4">
                      Equipment Details
                    </h2>
                    <p className="text-gray-300 text-base md:text-lg">
                      {selectedReel.description}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedReel.category && (
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                      <h3 className="text-sm font-medium text-gray-400">Category</h3>
                      <p className="text-lg font-medium text-white">{selectedReel.category}</p>
                    </div>
                  )}
                  {selectedReel.subcategory && (
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                      <h3 className="text-sm font-medium text-gray-400">Subcategory</h3>
                      <p className="text-lg font-medium text-white">{selectedReel.subcategory}</p>
                    </div>
                  )}
                  {selectedReel.dailyRate && (
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                      <h3 className="text-sm font-medium text-gray-400">Daily Rate</h3>
                      <p className="text-lg font-medium text-white">₹{selectedReel.dailyRate}</p>
                    </div>
                  )}
                  {selectedReel.weeklyRate && (
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                      <h3 className="text-sm font-medium text-gray-400">Weekly Rate</h3>
                      <p className="text-lg font-medium text-white">₹{selectedReel.weeklyRate}</p>
                    </div>
                  )}
                </div>

                {selectedReel.specifications && Object.keys(selectedReel.specifications).length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-4">
                      Specifications
                    </h2>
                    <ul className="space-y-2">
                      {Object.entries(selectedReel.specifications).map(([key, value], index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-400 mr-2">✓</span>
                          <span className="text-gray-300">{key}: {value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicRentalMerchantProfile;
