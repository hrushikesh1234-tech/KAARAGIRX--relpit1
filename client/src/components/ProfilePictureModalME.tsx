import React, { useEffect } from 'react';

interface ProfilePictureModalProps {
  imageUrl: string;
  name: string;
  onClose: () => void;
}

export const ProfilePictureModal = ({ imageUrl, name, onClose }: ProfilePictureModalProps) => {
  // Close modal when clicking outside the image
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('profile-modal-overlay')) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return false;
      }
    };

    // Close on Escape key press
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return false;
      }
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Use capture phase to catch events early
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('keydown', handleEscape, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscape, true);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  
  const handleModalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 profile-modal-overlay"
      onClick={handleModalClick}
    >
      <div className="relative max-w-4xl w-full max-h-[90vh] flex justify-center">
        <img
          src={imageUrl}
          alt={`${name}'s profile`}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl cursor-default select-none"
          onClick={handleModalClick}
          onContextMenu={e => e.preventDefault()}
          draggable={false}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
            return false;
          }}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors focus:outline-none"
          aria-label="Close"
          onMouseDown={e => e.stopPropagation()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
