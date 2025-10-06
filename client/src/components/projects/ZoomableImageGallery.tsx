import React, { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ZoomableImageGalleryProps {
  images: (string | { imageUrl: string })[];
  projectName: string;
}

const ZoomableImageGallery: React.FC<ZoomableImageGalleryProps> = ({ images, projectName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const normalizedImages = images.map(img => 
    typeof img === 'string' ? img : img.imageUrl
  );

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle swipe gestures for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext({ stopPropagation: () => {} } as React.MouseEvent);
    }
    if (isRightSwipe) {
      handlePrevious({ stopPropagation: () => {} } as React.MouseEvent);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!normalizedImages || normalizedImages.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">No images available for this project.</p>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      {/* Fullscreen Close Button */}
      {isFullscreen && (
        <button 
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
          aria-label="Close fullscreen"
        >
          <span className="text-2xl">✕</span>
        </button>
      )}

      {/* Main Image with Zoom */}
      <div 
        className={`relative ${isFullscreen ? 'h-screen flex items-center justify-center' : 'aspect-[16/9] md:aspect-[21/9]'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Zoom>
          <img
            src={normalizedImages[currentIndex]}
            alt={`${projectName} - Image ${currentIndex + 1}`}
            className={`${isFullscreen ? 'max-h-screen max-w-full object-contain' : 'w-full h-full object-cover rounded-lg'}`}
          />
        </Zoom>

        {/* Navigation Arrows */}
        {normalizedImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
              aria-label="Previous image"
            >
              <span className="text-2xl">◀</span>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
              aria-label="Next image"
            >
              <span className="text-2xl">▶</span>
            </button>
          </>
        )}

        {/* Fullscreen Toggle */}
        {!isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
            aria-label="View fullscreen"
          >
            <span className="text-xl">⛶</span>
          </button>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full z-10">
          {currentIndex + 1} / {normalizedImages.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {normalizedImages.length > 1 && !isFullscreen && (
        <div className="mt-4 grid grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {normalizedImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                currentIndex === idx ? 'ring-2 ring-blue-600' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ZoomableImageGallery;
