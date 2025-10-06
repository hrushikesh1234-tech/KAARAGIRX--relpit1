
import React, { useState } from 'react';
import { Eye, Play, Layers } from 'lucide-react';

interface Reel {
  id: number;
  title: string;
  views: string;
  thumbnail: string;
  mediaCount?: number;
}

interface ReelCardProps {
  reel: Reel;
  onClick?: () => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="relative w-full pb-[177.78%] bg-gray-900 overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="absolute inset-0">
        {/* Thumbnail */}
        <img
          src={reel.thumbnail}
          alt={reel.title}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
        )}
      </div>

      {/* Media count indicator */}
      {reel.mediaCount && reel.mediaCount > 1 && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-1 backdrop-blur-sm">
          <Layers size={12} className="text-white" />
          <span className="text-white text-xs font-medium">{reel.mediaCount}</span>
        </div>
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

      {/* Play button (visible on hover) */}
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play size={20} className="text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <h3 className="text-white text-xs font-bold mb-1 drop-shadow-lg">
          {reel.title}
        </h3>
        
        {/* View count */}
        <div className="flex items-center gap-1">
          <Eye size={12} className="text-white" />
          <span className="text-white text-xs font-medium">{reel.views}</span>
        </div>
      </div>

      {/* Hover effect border */}
      <div className={`absolute inset-0 border-2 border-white/20 rounded-md transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
};

export default ReelCard;
