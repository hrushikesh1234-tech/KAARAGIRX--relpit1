import React, { useState } from 'react';
// Icons replaced with emojis
import ProfilePictureModal from './ProfilePictureModal';

interface ProfilePictureProps {
  userType: 'customer1' | 'customer2' | 'contractor' | 'architect' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ 
  userType = 'default', 
  size = 'md',
  className = ''
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Map user types to profile images
  const profileImages = {
    customer1: '/images/profiles/sarah johnson.png',
    customer2: '/images/profiles/john smith.png',
    contractor: '/images/profiles/Contractor.png',
    architect: '/images/profiles/architect.png',
    default: ''
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const imageSrc = profileImages[userType];
  const sizeClass = sizeClasses[size];

  // If no image is available, show the default user icon
  if (!imageSrc) {
    return (
      <div className={`${sizeClass} rounded-full bg-gray-600 flex items-center justify-center overflow-hidden ${className}`}>
        <span className={size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}>👤</span>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`${sizeClass} rounded-full flex items-center justify-center overflow-hidden cursor-pointer ${className}`}
        onClick={() => setModalOpen(true)}
      >
        <img 
          src={imageSrc} 
          alt={`${userType} profile`} 
          className="w-full h-full object-cover"
        />
      </div>

      <ProfilePictureModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={imageSrc}
        altText={`${userType} profile`}
      />
    </>
  );
};

export default ProfilePicture;
