
import React, { useState } from 'react';
import { ProfilePictureModal } from './ProfilePictureModalME';

interface Chat {
  id: string;
  name: string;
  badge: string;
  message: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
  status: string;
}

interface ChatListItemProps {
  chat: Chat;
  onClick: () => void;
  isSelected?: boolean;
}

export const ChatListItem = ({ chat, onClick }: ChatListItemProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsProfileModalOpen(true);
    return false;
  };
  return (
    <div
      onClick={onClick}
      className="flex items-center p-4 hover:bg-[#1F2C34] cursor-pointer border-b border-[#1F2C34] transition-colors relative"
    >
      <div className="relative">
        <div 
          className="w-11 h-11 bg-[#1F2C34] rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative z-10"
          onClick={handleProfileClick}
          onMouseDown={e => e.stopPropagation()}
        >
          <img 
            src={chat.avatar} 
            alt={chat.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to default avatar if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=random`;
              target.className = 'w-full h-full bg-gray-700 flex items-center justify-center text-white';
            }}
          />
        </div>
        {chat.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#FFD700] rounded-full border-2 border-[#121B22]"></div>
        )}
      </div>
      
      <div className="flex-1 ml-3 min-w-0 overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[#EDEDED] font-medium text-sm truncate">
                {chat.name}
              </h3>
              <span 
                className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0"
                style={{
                  background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundColor: '#333333'
                }}
              >
                {chat.badge}
              </span>
            </div>
          </div>
          <span className="text-[#A0A0A0] text-xs ml-2 whitespace-nowrap flex-shrink-0">
            {chat.timestamp.length > 15 ? chat.timestamp.split(' ').slice(0, 3).join(' ') : chat.timestamp}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-[#A0A0A0] text-xs truncate flex-1">
            {chat.message}
          </p>
          {chat.unreadCount > 0 && (
            <span className="bg-[#DAA520] text-white text-xs rounded-full px-2 py-1 ml-2 flex-shrink-0 min-w-[20px] text-center">
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </span>
          )}
        </div>
      </div>
      
      {isProfileModalOpen && (
        <ProfilePictureModal
          imageUrl={chat.avatar}
          name={chat.name}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
};
