import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, ChevronLeft, ChevronRight, Plus, Pencil } from 'lucide-react';
import ProfileHeader from '@/components/Profile-Dashboard/ProfileHeader';
import TabNavigation from '@/components/Profile-Dashboard/TabNavigation';
import ReelsGrid from '@/components/Profile-Dashboard/ReelsGrid';
import EditProfile from './EditProfile';
import StarRating from '@/components/Profile-Dashboard/StarRating';
import Carousel, { Card as CardComponent } from '@/components/ui/apple-cards-carousel';
import ImageSlider from '@/components/ui/ImageSlider';
import type { CardProps } from '@/components/ui/apple-cards-carousel';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';

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

interface ProfileData {
  profileImage: string;
  bio: string;
  occupation: string;
  additionalInfo: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  isLive: boolean;
  portfolios: Array<{
    id: number;
    title: string;
    views: string;
    thumbnail: string;
    mediaCount: number;
    description: string;
    category: string;
  }>;
  aboutInfo: {
    profession: string;
    experience: string;
    skills: string[];
    location: string;
    contact: string;
  };
}

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedReel, setSelectedReel] = useState<PortfolioItem | null>(null);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', author: 'You' });
  const [loading, setLoading] = useState(true);
  const [professionalData, setProfessionalData] = useState<any>(null);
  const [openAddPortfolioForm, setOpenAddPortfolioForm] = useState(false);
  
  // For now, assume this is always the user's own profile
  // In the future, compare route params with user.id
  const isOwnProfile = true;
  
  // Reviews data - fetched from database
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Calculate average rating
  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;
    // Round to 1 decimal place
    return Math.round(average * 10) / 10;
  };

  // Use useMemo to only recalculate when reviews change
  const averageRating = useMemo(() => calculateAverageRating(reviews), [reviews]);
  
  const handleAddReview = () => {
    // In a real app, you would add the review to your backend here
    const newReviewObj = {
      id: reviews.length + 1,
      author: 'You',
      rating: newReview.rating,
      comment: newReview.comment
    };
    
    setReviews(prev => [newReviewObj, ...prev]);
    setReviewCount(prev => prev + 1);
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '', author: 'You' });
  };
  
  // Enhanced profile data with editable fields
  // Function to update media counts based on images array length
  const updateMediaCounts = (data: any) => {
    return {
      ...data,
      portfolios: data.portfolios.map((portfolio: any) => ({
        ...portfolio,
        mediaCount: portfolio.images ? portfolio.images.length : 0
      }))
    };
  };

  const [profileData, setProfileData] = useState(() => updateMediaCounts({
    username: user?.username || '',
    displayName: user?.fullName || '',
    bio: '',
    occupation: '',
    additionalInfo: '',
    stats: {
      posts: 0,
      followers: 0,
      following: 0
    },
    profileImage: '/api/placeholder/100/100',
    isLive: false,
    portfolios: [],
    aboutInfo: {
      profession: '',
      experience: '',
      skills: [],
      location: '',
      contact: ''
    }
  }));

  // Fetch professional data and reviews from database
  useEffect(() => {
    const fetchProfessionalData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Fetch professional profile
        const professionalResponse = await apiRequest('GET', `/api/professionals/user/${user.id}`);
        const professional = await professionalResponse.json();
        
        // Fetch projects (portfolio)
        const projectsResponse = await apiRequest('GET', `/api/projects/professional/${professional.id}`);
        const projects = await projectsResponse.json() || [];

        // Fetch reviews for this professional
        const reviewsResponse = await apiRequest('GET', `/api/professionals/${professional.id}/reviews`);
        const fetchedReviews = await reviewsResponse.json() || [];

        // Fetch follow status for this professional
        const followStatusResponse = await apiRequest('GET', `/api/professionals/${professional.id}/follow-status`);
        const followStatus = await followStatusResponse.json() || { followerCount: 0, followingCount: 0 };

        // Transform projects data to portfolio format
        const portfolios = projects.map((project: any) => ({
          id: project.id.toString(),
          title: project.title || project.name,
          views: '0',
          thumbnail: project.coverImage || (project.images?.[0]) || '/api/placeholder/400/300',
          mediaCount: project.images?.length || 0,
          images: project.images || [],
          description: project.description || '',
          category: project.propertyType || project.type || '',
          bhk: project.bhk ? `${project.bhk} BHK` : '',
          buildDate: project.completionDate || project.completionYear || '',
          budget: project.budget || '',
          specifications: []
        }));

        // Transform reviews data
        const transformedReviews = fetchedReviews.map((review: any) => ({
          id: review.id,
          author: review.userFullName || 'Anonymous',
          rating: review.rating,
          comment: review.content || ''
        }));

        // Save professional data for later use
        setProfessionalData(professional);

        // Update profile data
        setProfileData(updateMediaCounts({
          username: user.username || '',
          displayName: user.fullName || '',
          bio: professional.about || '',
          occupation: professional.profession || '',
          additionalInfo: `Experience: ${professional.experience || 0} years`,
          stats: {
            posts: projects.length,
            followers: followStatus.followerCount || 0,
            following: followStatus.followingCount || 0
          },
          profileImage: professional.profileImage || '/api/placeholder/100/100',
          isLive: professional.availability === 'Available',
          portfolios: portfolios,
          aboutInfo: {
            profession: professional.profession || '',
            experience: professional.experience ? `${professional.experience} years` : '',
            skills: professional.specializations || [],
            location: professional.location || '',
            contact: professional.phone || user.email || ''
          }
        }));

        setReviews(transformedReviews);
        setReviewCount(transformedReviews.length);
      } catch (error) {
        console.error('Error fetching professional data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionalData();
  }, [user?.id]);

  // Handle scroll to make tabs sticky
  useEffect(() => {
    const handleScroll = () => {
      const profileHeader = document.getElementById('profile-header');
      if (profileHeader) {
        const profileBottom = profileHeader.offsetTop + profileHeader.offsetHeight;
        const scrollPosition = window.scrollY + 64;
        setIsTabsSticky(scrollPosition >= profileBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEditProfile = () => {
    setOpenAddPortfolioForm(false);
    setShowEditProfile(true);
  };

  const handleAddPortfolio = () => {
    setOpenAddPortfolioForm(true);
    setShowEditProfile(true);
    
    setTimeout(() => {
      const portfolioSection = document.getElementById('portfolio-management-section');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleBackFromEdit = () => {
    setShowEditProfile(false);
    setOpenAddPortfolioForm(false);
  };

  const handleSaveProfile = async (updatedData: Partial<ProfileData>) => {
    // Store original data for potential rollback
    const originalData = profileData;
    
    try {
      // Update local state first for immediate UI feedback
      setProfileData((prev: ProfileData) => updateMediaCounts({
        ...prev,
        ...updatedData,
        stats: prev.stats // Keep existing stats
      }));

      // Save to backend if we have a professional ID
      if (professionalData?.id) {
        const dataToSave: any = {};
        
        // Map profile data fields to backend fields
        if (updatedData.profileImage) dataToSave.profileImage = updatedData.profileImage;
        if (updatedData.bio) dataToSave.about = updatedData.bio;
        if (updatedData.occupation) dataToSave.profession = updatedData.occupation;
        if (updatedData.aboutInfo?.location) dataToSave.location = updatedData.aboutInfo.location;
        if (updatedData.aboutInfo?.contact) dataToSave.phone = updatedData.aboutInfo.contact;
        if (updatedData.aboutInfo?.skills) dataToSave.specializations = updatedData.aboutInfo.skills;
        if (updatedData.aboutInfo?.experience) {
          const expMatch = updatedData.aboutInfo.experience.match(/(\d+)/);
          if (expMatch) dataToSave.experience = parseInt(expMatch[1]);
        }

        const response = await apiRequest('PUT', `/api/professionals/${professionalData.id}`, dataToSave);
        
        if (!response.ok) {
          throw new Error('Failed to save profile');
        }

        console.log('Profile saved successfully to backend');
        
        // Update professionalData with the saved data
        setProfessionalData((prev: any) => ({ ...prev, ...dataToSave }));
        
        // Show success toast
        toast.success('Profile updated successfully');
      }

      setShowEditProfile(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      
      // Revert to original data if save failed
      setProfileData(originalData);
      
      // Show error toast
      toast.error('Failed to save profile. Please try again.');
    }
  };

  // Update media counts when portfolios change
  useEffect(() => {
    setProfileData((prev: ProfileData) => updateMediaCounts(prev));
  }, [profileData.portfolios.length]);

  const handleReelClick = (reel: any, imageIndex: number = 0) => {
    console.log('Reel clicked:', reel, 'Image index:', imageIndex);
    setSelectedImageIndex(imageIndex);
    setSelectedReel(reel);
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const createCarouselData = (reel: PortfolioItem, clickedIndex: number = 0): CardProps[] => {
    // Use the images array if available, otherwise fall back to thumbnail
    const images = reel.images || [reel.thumbnail];
    
    return images.map((image: string, index: number) => ({
      category: reel.category || 'Project',
      title: reel.title,
      src: image,
      content: (
        <div className="bg-black">
          {/* Image Slider */}
          <div className="px-4 pt-1 pb-2 md:px-8">
            <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-center mb-4">
              {reel.title}
            </h1>
            <ImageSlider 
              images={images}
              title={reel.title}
              initialSlide={clickedIndex}
            />
          </div>
          
          {/* Project Details */}
          <div className="space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Project Overview
              </h2>
              <p className="text-gray-300 text-base md:text-lg">
                {reel.description || 'No description available.'}
              </p>
            </div>
            
            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Category</h3>
                <p className="text-lg font-medium text-white">{reel.category || 'N/A'}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">BHK</h3>
                <p className="text-lg font-medium text-white">{reel.bhk || 'N/A'}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Build Date</h3>
                <p className="text-lg font-medium text-white">{reel.buildDate || 'N/A'}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Budget</h3>
                <p className="text-lg font-medium text-white">{reel.budget || 'N/A'}</p>
              </div>
            </div>
            
            {/* Specifications */}
            {reel.specifications && reel.specifications.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Specifications
                </h2>
                <ul className="space-y-3">
                  {reel.specifications.map((spec: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )
    }));
  };

  if (showEditProfile) {
    return (
      <EditProfile 
        onBack={handleBackFromEdit} 
        onSave={handleSaveProfile}
        initialData={{
          profileImage: profileData.profileImage,
          bio: profileData.bio,
          occupation: profileData.occupation,
          additionalInfo: profileData.additionalInfo,
          portfolios: profileData.portfolios,
          aboutInfo: profileData.aboutInfo
        }}
        openAddPortfolioForm={openAddPortfolioForm}
      />
    );
  }

  if (selectedReel) {
    const carouselData = createCarouselData(selectedReel);
    const cards = carouselData.map((card, index) => (
      <CardComponent key={card.src + index} card={card} index={index} />
    ));

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="fixed inset-0 bg-black flex flex-col">
          {/* Blank black header space */}
          <div className="h-16 w-full bg-black flex-shrink-0"></div>
          
          {/* Main content area */}
          <div className="flex-1 relative flex flex-col">
            {/* White X icon for back - right aligned */}
            <button
              onClick={() => setSelectedReel(null)}
              className="fixed top-20 right-4 z-[100] p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:scale-110"
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X className="w-4 h-4 text-black" strokeWidth={2.5} />
            </button>
            
            {/* Carousel container with top padding to push it down */}
            <div className="w-full h-full pt-16">
              <Carousel 
                items={cards} 
                onClose={() => setSelectedReel(null)} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <main className="max-w-7xl mx-auto px-4 relative">
        <div id="profile-header" className="border-t border-gray-800 pt-1">
          <ProfileHeader 
            profileData={profileData} 
            onEditProfile={handleEditProfile}
            averageRating={averageRating}
            reviewCount={reviewCount}
            isOwnProfile={isOwnProfile}
          />
        </div>
        
        <div className={`${isTabsSticky ? 'fixed top-16 left-1/2 transform -translate-x-1/2 max-w-md w-full z-40' : 'relative z-40'}`}>
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Action bar below tabs - only show for own profile */}
        {isOwnProfile && (
          <div className="border-b border-gray-800 bg-black">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Left side - My Portfolio text + Edit button */}
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-white">My Portfolio</h2>
                  <button 
                    onClick={handleEditProfile}
                    className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-150 transform hover:scale-105"
                    title="Edit profile"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Right side - Add portfolio button (only visible on Portfolio tab) */}
                {activeTab === 'portfolio' && (
                  <button 
                    onClick={handleAddPortfolio}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-sm font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    Add Portfolio
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className={`px-1 ${isTabsSticky ? 'pt-12' : ''} min-h-screen bg-black`}>
          {activeTab === 'portfolio' && (
            <ReelsGrid reels={profileData.portfolios} onReelClick={handleReelClick} />
          )}
          {activeTab === 'about' && (
            <div className="p-6 text-center min-h-screen">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <div className="space-y-4 text-left">
                <p className="text-gray-300">{profileData.aboutInfo.profession}</p>
                <p className="text-gray-300">{profileData.aboutInfo.location}</p>
                <div className="pt-4">
                  <h4 className="text-white font-semibold mb-2">Experience</h4>
                  <p className="text-gray-400 text-sm">{profileData.aboutInfo.experience}</p>
                </div>
                <div className="pt-4">
                  <h4 className="text-white font-semibold mb-2">Contact</h4>
                  <p className="text-gray-400 text-sm">{profileData.aboutInfo.contact}</p>
                </div>
                <div className="pt-4">
                  <h4 className="text-white font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.aboutInfo.skills.map((skill: string, index: number) => (
                      <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="p-6 text-center min-h-screen">
              <h3 className="text-lg font-semibold mb-4">Reviews</h3>
              
              {/* Star Rating */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <StarRating rating={averageRating} maxRating={5} size={24} />
                  <span className="text-white font-semibold">{averageRating.toFixed(1)} out of 5</span>
                </div>
                <p className="text-gray-400 text-sm">Based on {reviewCount} reviews</p>
              </div>
              
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
              
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-800 p-4 rounded-lg text-left">
                    <div className="flex items-center mb-2">
                      <StarRating rating={review.rating} maxRating={5} size={16} />
                      <span className="text-gray-400 ml-2 text-sm">{review.author}</span>
                    </div>
                    <p className="text-gray-300 text-sm">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
