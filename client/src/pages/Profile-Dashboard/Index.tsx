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
  const [reviewCount, setReviewCount] = useState(30);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', author: 'You' });
  
  // For now, assume this is always the user's own profile
  // In the future, compare route params with user.id
  const isOwnProfile = true;
  
  // Sample reviews data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      comment: 'Amazing live performance! Energy was incredible.'
    },
    {
      id: 2,
      author: 'Mike R.',
      rating: 5,
      comment: 'Professional sound engineering. Highly recommended!'
    },
    {
      id: 3,
      author: 'Lisa K.',
      rating: 4,
      comment: 'Great music production quality. Will work with again!'
    },
    {
      id: 4,
      author: 'James D.',
      rating: 5,
      comment: 'Exceptional talent and professionalism. The studio session was perfectly managed.'
    },
    {
      id: 5,
      author: 'Alex T.',
      rating: 5,
      comment: 'Incredible musician with a unique sound. Loved every performance!'
    },
    {
      id: 6,
      author: 'Priya K.',
      rating: 5,
      comment: 'The energy in their live shows is unmatched. A must-see artist!'
    },
    {
      id: 7,
      author: 'Carlos M.',
      rating: 4,
      comment: 'Great stage presence and connection with the audience.'
    },
    {
      id: 8,
      author: 'Emma W.',
      rating: 5,
      comment: 'Their music speaks to the soul. Truly talented artist!'
    },
    {
      id: 9,
      author: 'David L.',
      rating: 5,
      comment: 'Professional and talented. The studio quality is top-notch.'
    },
    {
      id: 10,
      author: 'Nina P.',
      rating: 4,
      comment: 'Love the creativity in their compositions. Always fresh and exciting!'
    },
    {
      id: 11,
      author: 'Raj K.',
      rating: 5,
      comment: 'One of the best live performers I\'ve ever seen. The energy is electric!'
    },
    {
      id: 12,
      author: 'Sophia M.',
      rating: 5,
      comment: 'Their music has been the soundtrack to my life lately. Absolutely brilliant!'
    },
    {
      id: 13,
      author: 'Miguel R.',
      rating: 4,
      comment: 'Great technical skills and stage presence. A true professional.'
    },
    {
      id: 14,
      author: 'Aisha B.',
      rating: 5,
      comment: 'The way they connect with the audience is magical. Never disappoints!'
    },
    {
      id: 15,
      author: 'Ethan K.',
      rating: 5,
      comment: 'Incredible talent and versatility. Every track is a masterpiece!'
    },
    {
      id: 16,
      author: 'Lena M.',
      rating: 4,
      comment: 'Love their unique sound and style. Always pushing boundaries!'
    },
    {
      id: 17,
      author: 'Oliver T.',
      rating: 5,
      comment: 'The production quality is always top-notch. A true professional!'
    },
    {
      id: 18,
      author: 'Zoe W.',
      rating: 5,
      comment: 'Their music has a way of touching your soul. Absolutely beautiful!'
    },
    {
      id: 19,
      author: 'Daniel K.',
      rating: 4,
      comment: 'Great energy and stage presence. Always a pleasure to watch!'
    },
    {
      id: 20,
      author: 'Maya P.',
      rating: 5,
      comment: 'The way they blend different genres is simply amazing!'
    },
    {
      id: 21,
      author: 'Leo M.',
      rating: 5,
      comment: 'A true artist in every sense of the word. Always delivers!'
    },
    {
      id: 22,
      author: 'Ivy L.',
      rating: 4,
      comment: 'Love the creativity and passion in every performance.'
    },
    {
      id: 23,
      author: 'Max R.',
      rating: 5,
      comment: 'Their music has a way of making you feel things. Absolutely brilliant!'
    },
    {
      id: 24,
      author: 'Luna S.',
      rating: 5,
      comment: 'The energy they bring to the stage is contagious!'
    },
    {
      id: 25,
      author: 'Noah K.',
      rating: 4,
      comment: 'Great sound and stage presence. Always a pleasure to watch!'
    },
    {
      id: 26,
      author: 'Mia T.',
      rating: 5,
      comment: 'Their music speaks to my soul. Absolutely love it!'
    },
    {
      id: 27,
      author: 'Eli J.',
      rating: 5,
      comment: 'Incredible talent and professionalism. Always delivers!'
    },
    {
      id: 28,
      author: 'Ava M.',
      rating: 4,
      comment: 'Love the energy and passion in their performances!'
    },
    {
      id: 29,
      author: 'Liam C.',
      rating: 5,
      comment: 'One of the most talented artists I\'ve come across. Amazing!'
    },
    {
      id: 30,
      author: 'Isla R.',
      rating: 5,
      comment: 'Their music has been on repeat all week. Absolutely love it!'
    }
  ]);
  
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
    username: 'hrushikesh_mo...',
    displayName: 'hrushikesh0️⃣0️⃣2️⃣5️⃣',
    bio: '💫 ✨🎵✨ Hrushikesh More ✨🎵✨ 💫',
    occupation: '👨‍💻 Computer Engineer',
    additionalInfo: '🎧 Music in My Soul... more',
    stats: {
      posts: 69,
      followers: 431,
      following: 451
    },
    profileImage: '/profile-pic-/1.jpg',
    isLive: true,
    portfolios: [
      {
        id: 1,
        title: 'Modern Bungalow Design',
        views: '1,234',
        thumbnail: '/Portfolio-banglow-images/1-A.png',
        mediaCount: 0, // Will be calculated automatically
        images: [
          '/Portfolio-banglow-images/1-A.png',
          '/Portfolio-banglow-images/1-B.png',
          '/Portfolio-banglow-images/1-C.png',
          '/Portfolio-banglow-images/1-D.png',
          
        ],
        description: 'A stunning modern bungalow design featuring clean lines, large windows, and an open floor plan. This 4,500 sq.ft. residence includes 4 bedrooms, 5.5 bathrooms, a gourmet kitchen, infinity pool, and smart home automation throughout.',
        category: 'Modern Architecture',
        bhk: '4 BHK',
        buildDate: 'March 2023',
        budget: '₹4.5 Cr',
        specifications: [
          'Plot Area: 10,000 sq.ft',
          'Built-up Area: 4,500 sq.ft',
          '4 Bedrooms with Ensuite Bathrooms',
          'Home Theater & Gym',
          'Infinity Pool with Deck',
          'Smart Home Automation',
          'Solar Panel System',
          'Landscaped Garden',
          '3-Car Garage',
          'Rainwater Harvesting System'
        ]
      },
      {
        id: 2,
        title: 'Luxury Villa Project',
        views: '2,345',
        thumbnail: '/Portfolio-banglow-images/2-A.png',
        mediaCount: 0, // Will be calculated automatically
        images: [
          '/Portfolio-banglow-images/2-A.png',
          '/Portfolio-banglow-images/2-B.png',
          '/Portfolio-banglow-images/2-C.png',
          '/Portfolio-banglow-images/2-D.png',
          '/Portfolio-banglow-images/2-E.png',
        
        ],
        description: 'This elegant 8,000 sq.ft luxury villa showcases contemporary design elements with premium finishes throughout. The property features 5 spacious bedrooms, a private home theater, temperature-controlled wine cellar, and a stunning rooftop terrace with panoramic views.',
        category: 'Luxury Villa',
        bhk: '5 BHK',
        buildDate: 'November 2022',
        budget: '₹8.2 Cr',
        specifications: [
          'Plot Area: 15,000 sq.ft',
          'Built-up Area: 8,000 sq.ft',
          '5 Bedrooms with Walk-in Closets',
          'Private Home Theater',
          'Temperature-Controlled Wine Cellar',
          'Rooftop Terrace with Jacuzzi',
          'Smart Home System',
          'Landscaped Gardens with Water Features',
          '4-Car Garage',
          'Staff Quarters'
        ]
      },
      {
        id: 3,
        title: 'Beachfront Property',
        views: '3,456',
        thumbnail: '/Portfolio-banglow-images/3-A.png',
        mediaCount: 0, // Will be calculated automatically
        images: [
          '/Portfolio-banglow-images/3-A.png',
          '/Portfolio-banglow-images/3-B.png',
          '/Portfolio-banglow-images/3-C.png',
          '/Portfolio-banglow-images/3-D.png',
          '/Portfolio-banglow-images/3-E.png',
          '/Portfolio-banglow-images/3-F.png',
          
        ],
        description: 'Experience luxury coastal living in this 6,500 sq.ft beachfront property featuring panoramic ocean views, floor-to-ceiling windows, and seamless indoor-outdoor living spaces. The property includes 6 bedrooms, an infinity pool overlooking the sea, and direct beach access.',
        category: 'Beach House',
        bhk: '6 BHK',
        buildDate: 'August 2022',
        budget: '₹12.75 Cr',
        specifications: [
          'Beachfront Plot: 20,000 sq.ft',
          'Built-up Area: 6,500 sq.ft',
          '6 Bedrooms with Ocean Views',
          'Infinity Pool with Beach Access',
          'Outdoor Dining & Bar Area',
          'Storm-Proof Glass Windows',
          'Private Boat Dock',
          'Solar & Wind Power System',
          'Underground Parking for 6 Cars',
          'Private Beach Deck'
        ]
      },
      {
        id: 4,
        title: 'Mountain View Cabin',
        views: '1,890',
        thumbnail: '/Portfolio-banglow-images/4-A.png',
        mediaCount: 0, // Will be calculated automatically
        images: [
          '/Portfolio-banglow-images/4-A.png',
          '/Portfolio-banglow-images/4-B.png',
          '/Portfolio-banglow-images/4-C.png',
          '/Portfolio-banglow-images/4-D.png',
          
        ],
        description: 'Escape to this 3,200 sq.ft mountain retreat featuring a perfect blend of rustic charm and modern amenities. The cabin offers 3 bedrooms, floor-to-ceiling windows showcasing mountain vistas, a stone fireplace, and a wrap-around deck for ultimate relaxation.',
        category: 'Mountain Cabin',
        bhk: '3 BHK',
        buildDate: 'June 2023',
        budget: '₹3.8 Cr',
        specifications: [
          'Plot Area: 25,000 sq.ft',
          'Built-up Area: 3,200 sq.ft',
          '3 Bedrooms with Fireplace',
          'Great Room with Vaulted Ceiling',
          'Hot Tub on Deck',
          'Energy-Efficient Design',
          'Wood-Burning Fireplace',
          'Garage & Workshop',
          'Hiking Trails Access',
          'Solar Power System'
        ]
      },
      {
        id: 5,
        title: 'Urban Penthouse',
        views: '3,210',
        thumbnail: '/Portfolio-banglow-images/5-A.png',
        mediaCount: 0, // Will be calculated automatically
        images: [
          '/Portfolio-banglow-images/5-A.png',
          '/Portfolio-banglow-images/5-B.png',
          '/Portfolio-banglow-images/5-C.png',
          '/Portfolio-banglow-images/5-D.png',
          '/Portfolio-banglow-images/5-E.png',
          
        ],
        description: 'This 2,800 sq.ft urban penthouse offers luxurious city living with floor-to-ceiling windows, high-end finishes, and panoramic city views. The open-concept design features 2 bedrooms, a chef\'s kitchen, and a spacious terrace with an outdoor kitchen and hot tub.',
        category: 'Penthouse',
        bhk: '2 BHK',
        buildDate: 'January 2023',
        budget: '₹5.9 Cr',
        specifications: [
          'Total Area: 2,800 sq.ft',
          '2 Bedrooms with Ensuite Bathrooms',
          'Open-Concept Living Area',
          'Chef\'s Kitchen with Island',
          'Floor-to-Ceiling Windows',
          'Smart Home Technology',
          'Building Amenities Access',
          '24/7 Security & Concierge',
          'Underground Parking (2 Spaces)',
          'Private Balcony with City Views'
        ]
      },
      {
        id: 6,
        title: 'Countryside Estate',
        views: '2,100',
        thumbnail: '/Portfolio-banglow-images/6-A.png',
        mediaCount: 0, // Will be calculated automatically
        images: [
          '/Portfolio-banglow-images/6-A.png',
          '/Portfolio-banglow-images/6-B.png',
          '/Portfolio-banglow-images/6-C.png',
          '/Portfolio-banglow-images/6-D.png',
          '/Portfolio-banglow-images/6-E.png',
          '/Portfolio-banglow-images/6-F.png',
          '/Portfolio-banglow-images/6-G.png'
        ],
        description: 'This 7,500 sq.ft countryside estate combines traditional farmhouse aesthetics with modern luxury. The property features 5 bedrooms, a chef\'s kitchen, wraparound porch, and sits on 5 acres of landscaped gardens with a private lake and guest cottage.',
        category: 'Farmhouse',
        bhk: '5 BHK',
        buildDate: 'September 2022',
        budget: '₹9.8 Cr',
        specifications: [
          'Land Area: 5 Acres',
          'Main House: 7,500 sq.ft',
          'Guest Cottage: 1,200 sq.ft',
          '5 Bedrooms with Ensuite Baths',
          'Chef\'s Kitchen with Butlers Pantry',
          'Private Lake with Dock',
          'Wraparound Porch',
          'Heated Pool & Pool House',
          '6-Car Garage',
          'Orchard & Vegetable Garden'
        ]
      },
      {
        id: 7,
        title: 'Hilltop Retreat',
        views: '2,455',
        thumbnail: '/Portfolio-banglow-images/7-A.png',
        mediaCount: 0, // Will be calculated automatically
        images: [
          '/Portfolio-banglow-images/7-A.png',
          '/Portfolio-banglow-images/7-B.png',
          '/Portfolio-banglow-images/7-C.png',
          '/Portfolio-banglow-images/7-D.png',
          '/Portfolio-banglow-images/7-E.png'
        ],
        description: 'Perched on a private hilltop, this 6,800 sq.ft retreat offers 360-degree views of the surrounding landscape. The property features 4 en-suite bedrooms, a home theater, wine cellar, and an infinity pool that appears to merge with the horizon.',
        category: 'Luxury Villa',
        bhk: '4 BHK',
        buildDate: 'May 2023',
        budget: '₹11.2 Cr',
        specifications: [
          'Plot Area: 3 Acres',
          'Built-up Area: 6,800 sq.ft',
          '4 Bedroom Suites',
          'Infinity Pool with Glass Walls',
          'Home Theater & Game Room',
          'Temperature-Controlled Wine Cellar',
          'Panoramic Elevator',
          'Helipad Access',
          '4-Car Garage',
          'Smart Home System'
        ]
      },
      {
        id: 8,
        title: 'Minimalist Bungalow',
        views: '4,120',
        thumbnail: '/Portfolio-banglow-images/8-A.png',
        mediaCount: 0, // Will be calculated automatically
        images: [
          '/Portfolio-banglow-images/8-A.png',
          '/Portfolio-banglow-images/8-B.png',
          '/Portfolio-banglow-images/8-C.png',
          '/Portfolio-banglow-images/8-D.png',
          '/Portfolio-banglow-images/8-F.png',
          '/Portfolio-banglow-images/8-G.png',
          '/Portfolio-banglow-images/8-H.png',
        
        ],
        description: 'This 3,500 sq.ft minimalist bungalow is a study in clean lines, open spaces, and natural materials. The home features 3 bedrooms, an open-plan living area, floor-to-ceiling windows, and a seamless connection to the outdoor living spaces and koi pond.',
        category: 'Minimalist Design',
        bhk: '3 BHK',
        buildDate: 'February 2023',
        budget: '₹4.9 Cr',
        specifications: [
          'Plot Area: 8,000 sq.ft',
          'Built-up Area: 3,500 sq.ft',
          '3 Bedrooms with Built-in Storage',
          'Open-Plan Living Area',
          'Japanese-Inspired Garden',
          'Solar Panel System',
          'Underfloor Heating',
          '2-Car Carport',
          'Outdoor Shower',
          'Smart Lighting System'
        ]
      }
    ],
    aboutInfo: {
      profession: '🎵 Music Producer & Sound Engineer',
      experience: '5+ years in music production and live performances',
      skills: ['Music Production', 'Sound Engineering', 'Live Performance', 'Multi-instrumentalist'],
      location: '📍 Based in Mumbai, India',
      contact: 'hrushikesh.more@email.com'
    }
  }));

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
    setShowEditProfile(true);
  };

  const handleBackFromEdit = () => {
    setShowEditProfile(false);
  };

  const handleSaveProfile = (updatedData: Partial<ProfileData>) => {
    setProfileData((prev: ProfileData) => updateMediaCounts({
      ...prev,
      ...updatedData,
      stats: prev.stats // Keep existing stats
    }));
    setShowEditProfile(false);
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
        
        <div className={`px-1 ${isTabsSticky ? 'pt-12' : ''}`}>
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
                <p className="text-gray-400 text-sm mb-4">Based on {reviewCount} reviews</p>
                <button 
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 mx-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Give your review
                </button>
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
