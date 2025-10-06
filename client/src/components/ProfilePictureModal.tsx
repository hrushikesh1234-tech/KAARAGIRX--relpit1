import React, { useState, useEffect } from 'react';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  altText: string;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({ 
  isOpen, 
  onClose, 
  imageSrc, 
  altText 
}) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div className="relative max-w-3xl max-h-screen p-2">
        <img 
          src={imageSrc} 
          alt={altText} 
          className="max-h-[90vh] max-w-full rounded-lg shadow-xl" 
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
        />
      </div>
    </div>
  );
};

export default ProfilePictureModal;
