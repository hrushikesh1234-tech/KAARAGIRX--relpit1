
import React from 'react';
import { Search, Camera } from 'lucide-react';

export const TopBar = () => {
  return (
    <div className="bg-[#111111] h-14 flex items-center justify-between px-4 border-b border-[#333333]">
      <h1 className="text-xl font-semibold text-[#FFD700]">KARAGIRX</h1>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-[#333333] rounded-full transition-colors">
          <Search className="w-5 h-5 text-[#A0A0A0]" />
        </button>
        <button className="p-2 hover:bg-[#333333] rounded-full transition-colors">
          <Camera className="w-5 h-5 text-[#A0A0A0]" />
        </button>
      </div>
    </div>
  );
};
