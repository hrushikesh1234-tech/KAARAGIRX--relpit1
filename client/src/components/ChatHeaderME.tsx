import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Video as VideoIcon, Phone, MoreVertical, X, User, Share2, Trash2 } from 'lucide-react';
import { ProfilePictureModal } from './ProfilePictureModalME';
import { CallScreen } from './CallScreenME';

// Define the ChatContact interface
export interface ChatContact {
  id: string;
  name: string;
  lastSeen: string;
  avatar: string;
  status?: string;
  badge?: string;
  message?: string;
  timestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ChatHeaderProps {
  chatId: string;
  onBack: () => void;
  chatContact: ChatContact;
  isInCall: boolean;
  onCallStateChange: (inCall: boolean, callType: 'voice' | 'video' | null) => void;
  onTabChange?: (tab: 'Chats' | 'Calls' | 'Help') => void;
}

export const ChatHeader = ({ chatId, onBack, chatContact, isInCall, onCallStateChange, onTabChange }: ChatHeaderProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<{ type: 'voice' | 'video'; incoming: boolean } | null>(null);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const callTimeoutRef = useRef<NodeJS.Timeout>();
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  // Toggle menu when clicking the button
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(prev => !prev);
  };

  // Handle hover state with timeout for better UX
  const handleHoverStart = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  // Close menu and clear hover states on various interactions
  useEffect(() => {
    const closeAll = () => {
      setShowMenu(false);
      setIsHovered(false);
    };

    // Close on click outside
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };

    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAll();
      }
    };

    // Close on scroll
    const handleScroll = () => {
      closeAll();
    };

    // Close on touch move (for mobile)
    const handleTouchMove = () => {
      closeAll();
    };

    // Close on window resize
    const handleResize = () => {
      closeAll();
    };

    // Close on mouse leave window
    const handleMouseLeave = () => {
      closeAll();
    };

    // Close on context menu (right click)
    const handleContextMenu = () => {
      closeAll();
    };

    if (showMenu || isHovered) {
      // Add all event listeners
      document.addEventListener('click', handleClick, true);
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('contextmenu', handleContextMenu);
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('resize', handleResize);
      window.addEventListener('mouseleave', handleMouseLeave);
      
      if (showMenu) {
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }

      // Cleanup function
      return () => {
        document.removeEventListener('click', handleClick, true);
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('contextmenu', handleContextMenu);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mouseleave', handleMouseLeave);
        document.body.style.overflow = ''; // Re-enable scrolling
        
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
      };
    }
  }, [showMenu, isHovered]);

  const handleCall = (type: 'voice' | 'video') => {
    setActiveCall({ type, incoming: false });
    onCallStateChange(true, type);
    // Simulate call ringing
    callTimeoutRef.current = setTimeout(() => {
      // In a real app, this would be handled by WebRTC events
      if (activeCall) {
        // Call would be answered by the other party
      }
    }, 3000);
  };

  const handleEndCall = useCallback((duration: number) => {
    if (activeCall) {
      // Add to call history in localStorage
      const callHistory = JSON.parse(localStorage.getItem('callHistory') || '[]');
      const newCall = {
        id: uuidv4(),
        name: chatContact.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: activeCall.type,
        status: duration > 0 ? 'accepted' : 'missed',
        duration: duration > 0 ? formatDuration(duration) : undefined,
        avatar: chatContact.avatar
      };
      
      callHistory.unshift(newCall);
      localStorage.setItem('callHistory', JSON.stringify(callHistory));
      
      setActiveCall(null);
      onCallStateChange(false, null);
      
      // Navigate to calls tab after a short delay
      setTimeout(() => {
        if (onTabChange) {
          onTabChange('Calls');
        }
      }, 1000);
    }
  }, [activeCall, chatContact, onCallStateChange, onTabChange]);
  
  const handleAcceptCall = () => {
    // In a real app, this would accept the WebRTC connection
    console.log('Call accepted');
    setCallStartTime(Date.now());
  };

  const handleRejectCall = () => {
    handleEndCall(0);
  };

  // Format duration in MM:SS format
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
    setShowMenu(false);
  };

  const handleShareChat = () => {
    // In a real app, this would open a share dialog or copy a link to the clipboard
    console.log('Sharing chat:', chatId);
    setShowMenu(false);
    // Show a success message or notification
    alert('Chat link copied to clipboard!');
  };

  const handleDeleteChat = () => {
    // In a real app, this would delete the chat after confirmation
    if (window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      console.log('Deleting chat:', chatId);
      // Here you would typically call a function to delete the chat
      // deleteChat(chatId);
      alert('Chat deleted successfully!');
    }
    setShowMenu(false);
  };

  return (
    <div className="bg-[#1F2C34] h-14 flex items-center px-4 border-b border-[#D4AF37] relative z-50">
      <button
        onClick={onBack}
        className="p-2 hover:bg-[#374045] rounded-full transition-colors mr-2"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>
      
      <div className="flex items-center flex-1">
        <div className="relative">
          <div 
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-2xl cursor-pointer overflow-hidden"
            onClick={handleProfileClick}
          >
            {chatContact.avatar.startsWith('/') ? (
              <img 
                src={chatContact.avatar} 
                alt={chatContact.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initial if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chatContact.name)}&background=4F46E5&color=fff`;
                }}
              />
            ) : (
              <span>{chatContact.avatar}</span>
            )}
          </div>
          {chatContact.status === 'online' && (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
          )}
        </div>
        <div className="ml-3">
          <h2 className="text-[#D4AF37] font-medium text-sm">{chatContact.name}</h2>
          <p className="text-[#A0A0A0] text-xs">
            {chatContact.status || chatContact.lastSeen}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 ml-auto">
        <button 
          onClick={() => handleCall('video')}
          className={`p-2 rounded-full transition-colors group ${isInCall ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#374045]'}`}
          disabled={isInCall}
          title="Video call"
        >
          <VideoIcon className="w-5 h-5 text-[#D4AF37] group-hover:text-pink-500 transition-colors" />
        </button>
        <button 
          onClick={() => handleCall('voice')}
          className={`p-2 rounded-full transition-colors group ${isInCall ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#374045]'}`}
          disabled={isInCall}
          title="Voice call"
        >
          <Phone className="w-5 h-5 text-[#D4AF37] group-hover:text-pink-500 transition-colors" />
        </button>
        <div className="relative">
          <button 
            ref={menuButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu(e);
            }}
            className={`p-2 rounded-full transition-colors relative ${
              showMenu ? 'bg-[#374045]' : (isHovered ? 'bg-[#374045]' : '')
            }`}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            title="More options"
            aria-haspopup="true"
            aria-expanded={showMenu}
          >
            <MoreVertical className={`w-5 h-5 transition-colors ${
              showMenu || isHovered ? 'text-pink-500' : 'text-[#D4AF37]'
            }`} />
          </button>
          
          {showMenu && (
            <div 
              ref={menuRef}
              className="absolute right-0 mt-2 w-56 bg-[#233138] rounded-md shadow-lg py-1 z-50 border border-[#374045]"
              role="menu"
              aria-orientation="vertical"
            >
              <button
                onClick={handleProfileClick}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#1E2D34]"
                role="menuitem"
              >
                <User className="w-4 h-4 mr-3 text-[#D4AF37]" />
                <span>Visit Profile</span>
              </button>
              <button
                onClick={handleShareChat}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#1E2D34]"
                role="menuitem"
              >
                <Share2 className="w-4 h-4 mr-3 text-[#D4AF37]" />
                <span>Share Chat</span>
              </button>
              <div className="border-t border-[#374045] my-1"></div>
              <button
                onClick={handleDeleteChat}
                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-[#1E2D34]"
                role="menuitem"
              >
                <Trash2 className="w-4 h-4 mr-3" />
                <span>Delete Chat</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {activeCall && (
        <CallScreen
          contact={{
            id: chatContact.id,
            name: chatContact.name,
            avatar: chatContact.avatar
          }}
          type={activeCall.type}
          onEndCall={handleEndCall}
          incoming={activeCall.incoming}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          onAddToCallHistory={(call) => {
            // In a real app, you would save this to your state management
            console.log('Call added to history:', call);
          }}
        />
      )}
      
      {isProfileModalOpen && (
        <ProfilePictureModal
          imageUrl={chatContact.avatar}
          name={chatContact.name}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
};
