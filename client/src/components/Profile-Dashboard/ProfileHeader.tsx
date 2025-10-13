
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MessageSquare, X, Upload } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  occupation: string;
  additionalInfo: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  profileImage: string;
  isLive: boolean;
}

interface ProfileHeaderProps {
  profileData: ProfileData;
  onEditProfile: () => void;
  averageRating: number;
  reviewCount: number;
  isOwnProfile?: boolean;
  professionalId?: number | string;
  isFollowing?: boolean;
  onFollowClick?: () => void;
  isCustomer?: boolean;
  onProfileImageChange?: (imageUrl: string) => void;
  onFriendsClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profileData, 
  onEditProfile,
  averageRating,
  reviewCount,
  isOwnProfile = false,
  professionalId,
  isFollowing: externalIsFollowing = false,
  onFollowClick,
  isCustomer = false,
  onProfileImageChange,
  onFriendsClick
}) => {
  const [isFollowing, setIsFollowing] = useState(externalIsFollowing);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsFollowing(externalIsFollowing);
  }, [externalIsFollowing]);

  const handleFollowClick = () => {
    if (onFollowClick) {
      onFollowClick();
    } else {
      setIsFollowing(!isFollowing);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleProfileImageUpload = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onProfileImageChange) {
      const reader = new FileReader();
      reader.onload = () => {
        onProfileImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicClick = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      closeModal();
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isModalOpen]);

  const handleMessageClick = () => {
    console.log('Message clicked');
  };

  return (
    <div className="px-4">
      {/* Profile info section */}
      <div className="flex items-start gap-4 mb-4">
        {/* Profile picture */}
        <div className="relative">
          <div 
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5 cursor-pointer"
            onClick={handleProfilePicClick}
          >
            <img
              src={profileData.profileImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover bg-black"
            />
          </div>
          {isOwnProfile && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button 
                onClick={handleProfileImageUpload}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold hover:bg-blue-600 transition-colors"
              >
                +
              </button>
            </>
          )}
        </div>

        {/* Right side content */}
        <div className="flex-1">
          {/* Display name */}
          <h2 className="font-bold text-sm mb-4">{profileData.displayName}</h2>
          
          {/* Friends section - shown for customers next to profile (Instagram-style) */}
          {isCustomer && isOwnProfile && (
            <button 
              onClick={onFriendsClick}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            >
              <div className="text-center">
                <div className="text-base font-semibold text-gray-100">{profileData.stats.followers}</div>
                <div className="text-[11px] text-gray-400 font-medium">friends</div>
              </div>
            </button>
          )}
          
          {/* Action buttons - hide rating/follow/message for customers */}
          {!isCustomer && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
              <div className="flex w-full sm:w-auto items-center gap-8">
              {/* Only show friends for own profile */}
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div className="text-base font-semibold text-gray-100">{profileData.stats.followers}</div>
                  <div className="text-[11px] text-gray-400 font-medium">friends</div>
                </div>
                <div className="h-6 w-px bg-gray-700"></div>
                <div 
                  onClick={() => {
                    const reviewsTab = document.getElementById('reviews-tab');
                    if (reviewsTab) {
                      reviewsTab.scrollIntoView({ behavior: 'smooth' });
                      const tabButton = document.querySelector('[data-tab="reviews"]');
                      if (tabButton) {
                        (tabButton as HTMLElement).click();
                      }
                    }
                  }}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <span className="text-yellow-400 font-medium text-sm">{averageRating.toFixed(1)}</span>
                  <div className="flex -space-x-0.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const fillPercentage = Math.min(Math.max(averageRating - star + 1, 0), 1) * 100;
                      return (
                        <div key={star} className="relative w-2.5 h-2.5">
                          <svg className="absolute w-full h-full text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <div 
                            className="absolute top-0 left-0 h-full overflow-hidden"
                            style={{ width: `${fillPercentage}%` }}
                          >
                            <svg className="w-full h-full text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-gray-400 text-xs">({reviewCount})</span>
                </div>
              </div>
              </div>
              {/* Only show follow and message buttons if not own profile */}
              {!isOwnProfile && (
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleFollowClick}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap flex-1 sm:flex-none text-center ${
                      isFollowing
                        ? 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-gray-100 shadow-md'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg shadow-blue-500/30'
                    }`}
                  >
                    {isFollowing ? (
                      <span className="flex items-center justify-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Friends
                      </span>
                    ) : 'Follow'}
                  </button>
                  <button
                    onClick={handleMessageClick}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-100 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md flex-1 sm:flex-none"
                  >
                    <MessageSquare size={13} className="flex-shrink-0" />
                    <span>Message</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bio section */}
      <div className="space-y-1 mb-4">
        <p className="text-sm leading-relaxed">{profileData.bio}</p>
        <p className="text-sm text-gray-300">{profileData.occupation}</p>
        <p className="text-gray-300 text-sm">{profileData.additionalInfo}</p>
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={closeModal}
        >
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute -top-12 -right-2 text-white hover:text-gray-300 transition-colors z-10 bg-black/70 rounded-full p-2 hover:bg-black/80 shadow-lg"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <div 
              className="relative w-full max-w-full max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-full h-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
