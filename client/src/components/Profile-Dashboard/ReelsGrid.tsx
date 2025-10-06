
import React from 'react';
import ReelCard from './ReelCard';

interface Reel {
  id: number;
  title: string;
  views: string;
  thumbnail: string;
  mediaCount?: number;
}

interface ReelsGridProps {
  reels: Reel[];
  onReelClick: (reel: Reel) => void;
}

const ReelsGrid: React.FC<ReelsGridProps> = ({ reels, onReelClick }) => {
  return (
    <div className="w-full grid grid-cols-3 gap-0.5 pb-20 -mx-0.5">
      {reels.map((reel) => (
        <ReelCard 
          key={reel.id} 
          reel={reel} 
          onClick={() => onReelClick(reel)}
        />
      ))}
    </div>
  );
};

export default ReelsGrid;
