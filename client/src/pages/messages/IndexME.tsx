
import React, { useState, useMemo } from 'react';
import { ChatListME as ChatList } from '../../components/ChatListME';
import { ChatWindowME as ChatWindow } from '../../components/ChatWindowME';
import { Search, X } from 'lucide-react';
import { TabBar } from '../../components/TabBarME';
import { SearchBar } from '../../components/SearchBarME';
import { CallsList } from '../../components/CallsListME';
import type { ChatContact } from '../../components/ChatHeaderME';

// Define chat contacts with their details and badges
const chatContacts: Record<string, ChatContact & { badge?: string }> = {
  '1': { id: '1', name: 'Hrushi More', lastSeen: 'last seen today at 10:30 AM', avatar: '/Profile pics 15 message/1.jpg', status: 'online', isOnline: true, badge: 'Customer' },
  '2': { id: '2', name: 'Rajesh Kumar', lastSeen: 'last seen yesterday', avatar: '/Profile pics 15 message/2.png', isOnline: false, badge: 'Contractor' },
  '3': { id: '3', name: 'Teju Shinde', lastSeen: 'last seen 2h ago', avatar: '/Profile pics 15 message/3.jpg', isOnline: false, badge: 'Architect' },
  '4': { id: '4', name: 'Amit Sharma', lastSeen: 'last seen 5h ago', avatar: '/Profile pics 15 message/4.png', isOnline: false, badge: 'Cement Dealer' },
  '5': { id: '5', name: 'Priya Singh', lastSeen: 'last seen yesterday', avatar: '/Profile pics 15 message/5.png', isOnline: false, badge: 'Rental' },
  '6': { id: '6', name: 'Vikram Joshi', lastSeen: 'last seen 1d ago', avatar: '/Profile pics 15 message/6.png', isOnline: false, badge: 'Contractor' },
  '7': { id: '7', name: 'Neha Gupta', lastSeen: 'last seen 1d ago', avatar: '/Profile pics 15 message/7.png', isOnline: false, badge: 'Architect' },
  '8': { id: '8', name: 'Rahul Mehta', lastSeen: 'last seen 2d ago', avatar: '/Profile pics 15 message/8.png', isOnline: false, badge: 'Cement Dealer' },
  '9': { id: '9', name: 'Sneha Reddy', lastSeen: 'last seen 2d ago', avatar: '/Profile pics 15 message/9.png', isOnline: false, badge: 'Rental' },
  '10': { id: '10', name: 'Ganesh Patil', lastSeen: 'last seen 2d ago', avatar: '/Profile pics 15 message/10.png', isOnline: false, badge: 'Contractor' },
  '11': { id: '11', name: 'Mahesh Singh', lastSeen: 'last seen 2d ago', avatar: '/Profile pics 15 message/11.png', isOnline: false, badge: 'Architect' },
  '12': { id: '12', name: 'Ravi Sharma', lastSeen: 'last seen 3d ago', avatar: '/Profile pics 15 message/12.png', isOnline: false, badge: 'Cement Dealer' },
  '13': { id: '13', name: 'Deepak Kale', lastSeen: 'Online', avatar: '/Profile pics 15 message/13.png', status: 'online', isOnline: true, badge: 'Rental' },
  '14': { id: '14', name: 'Santosh Jadhav', lastSeen: 'Last seen 4d ago', avatar: '/Profile pics 15 message/14.png', isOnline: false, badge: 'Contractor' },
  '15': { id: '15', name: 'Kiran Desai', lastSeen: 'Last seen 4d ago', avatar: '/Profile pics 15 message/15.png', isOnline: false, badge: 'Architect' },
  'helpline': { id: 'helpline', name: 'KARAGIRX Team Helpline', lastSeen: 'Available', avatar: '/Profile pics 15 message/helpline-avatar.png', status: 'online', isOnline: true, badge: 'Support' },
  'aichatbot': { id: 'aichatbot', name: 'AI ChatBot', lastSeen: 'Online', avatar: '/Profile pics 15 message/ai-avatar.png', status: 'online', isOnline: true, badge: 'AI Assistant' }
};

// Sample chat messages for search results
const sampleMessages: Record<string, string> = {
  '1': 'Okay perfect',
  '2': 'Okay saheb',
  '3': 'Ho, email kar',
  '4': 'Okay saheb',
  '5': 'Thanks for the update',
  '6': 'Call me when you get a chance',
  '7': 'I\'ll be there in 10 minutes',
  '8': 'Can we reschedule?',
  '9': 'Please find the attached files',
  '10': 'Let me check and get back to you',
  '11': 'Meeting at 3 PM',
  '12': 'Did you see my last message?',
  '13': 'Online',
  '14': 'Call me when you\'re free',
  '15': 'Thanks for your help!',
  'helpline': 'How can we help you today?',
  'aichatbot': 'Hello! How can I assist you?'
};

const IndexME: React.FC = () => {
  // Use effect to handle window resize and adjust height
  React.useEffect(() => {
    const updateHeight = () => {
      const header = document.querySelector('header') as HTMLElement;
      const footer = document.querySelector('.mobile-toolbar') as HTMLElement;
      const content = document.querySelector('.messages-container') as HTMLElement;
      
      if (header && content) {
        const headerHeight = header.offsetHeight;
        const footerHeight = footer?.offsetHeight || 0;
        const windowHeight = window.innerHeight;
        const contentHeight = windowHeight - headerHeight - footerHeight;
        
        (content as HTMLElement).style.height = `${contentHeight}px`;
      }
    };

    // Initial calculation
    updateHeight();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateHeight);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Chats' | 'Calls' | 'Help'>('Chats');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleSearchResultClick = (result: any) => {
    if (result.type === 'chat' || result.type === 'contact') {
      handleChatSelect(result.id);
    }
  };

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery) return [];
    
    const results: Array<{
      id: string; 
      name: string; 
      type: 'contact' | 'group';
      avatar: string; 
      lastMessage?: string; 
      timestamp?: string; 
      unreadCount: number;
      status?: string;
    }> = [];
    
    // Search in contacts
    Object.entries(chatContacts).forEach(([id, contact]) => {
      if (contact.name.toLowerCase().includes(searchQuery) || 
          (sampleMessages[id] && sampleMessages[id].toLowerCase().includes(searchQuery))) {
        results.push({
          id,
          name: contact.name,
          type: 'contact' as const,
          avatar: contact.avatar,
          lastMessage: sampleMessages[id],
          timestamp: contact.lastSeen,
          unreadCount: contact.unreadCount || 0,
          ...(contact.status && { status: contact.status })
        });
      }
    });
    
    return results;
  }, [searchQuery, chatContacts]);

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const renderContent = () => {
    if (selectedChat) {
      return (
        <ChatWindow
          chatId={selectedChat} 
          onBack={handleBackToList} 
          onTabChange={setActiveTab}
          chatContact={{
            ...chatContacts[selectedChat],
            id: selectedChat,
            name: chatContacts[selectedChat]?.name || 'Unknown',
            avatar: chatContacts[selectedChat]?.avatar || '👤',
            status: chatContacts[selectedChat]?.status || 'offline',
            isOnline: chatContacts[selectedChat]?.isOnline || false,
            lastSeen: chatContacts[selectedChat]?.lastSeen || new Date().toISOString(),
            unreadCount: 0,
            badge: undefined,
            message: undefined,
            timestamp: undefined
          } as ChatContact}
        />
      );
    }

    return (
      <div className="flex flex-col h-full bg-[#0B141A] text-white">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-[#0B141A] border-b border-gray-800">
          {/* Search Bar */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search or start new chat"
                className="w-full pl-10 pr-4 py-2.5 bg-[#1F2C34] text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    handleSearch('');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Tab Bar */}
          <div className="px-4">
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-96 border-r border-gray-800 flex flex-col h-full">
            <div 
              className="overflow-y-auto h-full pb-20" 
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                scrollPaddingBottom: '5rem' // For better mobile browser support
              }}
            >
              {/* Hide scrollbar for Chrome, Safari and Opera */}
              <style dangerouslySetInnerHTML={{ __html: `
                .overflow-y-auto::-webkit-scrollbar { display: none; }
              `}} />
              {/* Bottom padding for the content */}
              <style dangerouslySetInnerHTML={{ __html: `
                @supports (padding-bottom: env(safe-area-inset-bottom)) {
                  .pb-20 { padding-bottom: calc(5rem + env(safe-area-inset-bottom)); }
                }
              `}} />
              {activeTab === 'Chats' && (
                <ChatList 
                  chats={Object.values(chatContacts).map(contact => ({
                    id: contact.id,
                    name: contact.name,
                    badge: contact.badge || 'User', // Add default badge if not provided
                    message: sampleMessages[contact.id] || '',
                    timestamp: contact.lastSeen,
                    unreadCount: 0,
                    avatar: contact.avatar,
                    isOnline: contact.isOnline,
                    status: contact.status,
                    lastSeen: contact.lastSeen
                  }))}
                  onChatSelect={handleChatSelect}
                  selectedChatId={selectedChat}
                />
              )}
              {activeTab === 'Calls' && (
                <CallsList />
              )}
              {activeTab === 'Help' && (
                <div className="p-4">
                  <h2 className="text-[#D4AF37] text-lg font-medium mb-4 px-2">Get Help</h2>
                  
                  <div className="space-y-3">
                    {/* KARAGIRX Team Helpline */}
                    <div className="flex items-center p-3 bg-[#1F2C34] rounded-lg">
                      <div 
                        className="flex items-center flex-1 cursor-pointer"
                        onClick={() => handleChatSelect('helpline')}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center text-white mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">Chat with KARAGIRX Team Helpline</h3>
                          <p className="text-[#A0A0A0] text-sm">Get help from our support team</p>
                        </div>
                      </div>
                      <button 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-[#374045] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChatSelect('helpline');
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                    </div>

                    {/* AI ChatBot */}
                    <div className="flex items-center p-3 bg-[#1F2C34] rounded-lg">
                      <div 
                        className="flex items-center flex-1 cursor-pointer"
                        onClick={() => handleChatSelect('aichatbot')}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#4A90E2] flex items-center justify-center text-white font-bold text-xl mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 8V4H8"></path>
                            <rect x="4" y="8" width="16" height="12" rx="2"></rect>
                            <path d="M2 14h2"></path>
                            <path d="M20 14h2"></path>
                            <path d="M15 13v2"></path>
                            <path d="M9 13v2"></path>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">Chat with AI ChatBot</h3>
                          <p className="text-[#A0A0A0] text-sm">Get instant answers from our AI assistant</p>
                        </div>
                      </div>
                      <button 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#4A90E2] hover:bg-[#374045] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChatSelect('aichatbot');
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-[#1F2C34] rounded-lg">
                    <h3 className="text-white font-medium mb-2">Need more help?</h3>
                    <p className="text-[#A0A0A0] text-sm mb-3">You can also reach us through:</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-[#A0A0A0] text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        +1 (555) 123-4567
                      </div>
                      <div className="flex items-center text-[#A0A0A0] text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        support@karagirx.com
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-[#0B141A] text-white flex flex-col overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default IndexME;
