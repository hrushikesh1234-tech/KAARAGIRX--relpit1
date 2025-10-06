
import React, { useMemo } from 'react';
import { ChatListItem } from './ChatListItemME';
import { Search } from 'lucide-react';

const sampleChats = [
  {
    id: '1',
    name: 'Hrushi More',
    badge: 'Customer',
    message: 'Okay perfect',
    timestamp: '12:09 PM',
    unreadCount: 0,
    avatar: '/Profile pics 15 message/1.jpg',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    badge: 'Contractor',
    message: 'Okay saheb',
    timestamp: '1:09 AM',
    unreadCount: 2,
    avatar: '/Profile pics 15 message/2.png',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Teju Patil',
    badge: 'Architect',
    message: 'Ho, email kar',
    timestamp: '12:43 AM',
    unreadCount: 5,
    avatar: '/Profile pics 15 message/3.jpg',
    isOnline: true,
  },
  {
    id: '4',
    name: 'Amit Sharma',
    badge: 'Cement Dealer',
    message: 'Okay saheb',
    timestamp: 'Yesterday',
    unreadCount: 0,
    avatar: '/Profile pics 15 message/4.png',
    isOnline: false,
  },
  {
    id: '5',
    name: 'Priya Singh',
    badge: 'Rental',
    message: 'Thanks',
    avatar: '/Profile pics 15 message/5.png',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '6',
    name: 'Vikram Joshi',
    badge: 'Sand Dealer',
    message: 'Quality sand available',
    timestamp: 'Yesterday',
    unreadCount: 3,
    avatar: '/Profile pics 15 message/6.png',
    isOnline: true,
  },
  {
    id: '7',
    name: 'Amit Joshi',
    badge: 'Bricks Dealer',
    message: 'New stock arrived',
    timestamp: 'Yesterday',
    unreadCount: 0,
    avatar: '/Profile pics 15 message/7.png',
    isOnline: false,
  },
  {
    id: '8',
    name: 'Suresh Yadav',
    badge: 'Steel Dealer',
    message: 'Rate updated today',
    timestamp: 'Monday',
    unreadCount: 1,
    avatar: '/Profile pics 15 message/8.png',
    isOnline: false,
  },
  {
    id: '9',
    name: 'Prakash More',
    badge: 'JCB Rental',
    message: 'JCB available tomorrow',
    timestamp: 'Monday',
    unreadCount: 0,
    avatar: '/Profile pics 15 message/9.png',
    isOnline: true,
  },
  {
    id: '10',
    name: 'Ganesh Patil',
    badge: 'Crane Rental',
    message: 'Crane booking confirmed',
    timestamp: 'Sunday',
    unreadCount: 2,
    avatar: '/Profile pics 15 message/10.png',
    isOnline: false,
  },
  {
    id: '11',
    name: 'Mahesh Singh',
    badge: 'Aggregate Dealer',
    message: 'Fresh aggregate ready',
    timestamp: 'Sunday',
    unreadCount: 0,
    avatar: '/Profile pics 15 message/11.png',
    isOnline: false,
  },
  {
    id: '12',
    name: 'Ravi Sharma',
    badge: 'Customer',
    message: 'When can you start work?',
    timestamp: 'Saturday',
    unreadCount: 5,
    avatar: '/Profile pics 15 message/12.png',
    isOnline: false,
  },
  {
    id: '13',
    name: 'Deepak Kale',
    badge: 'Architect',
    message: 'Design ready for review',
    timestamp: 'Saturday',
    unreadCount: 0,
    avatar: '/Profile pics 15 message/13.png',
    isOnline: true,
  },
  {
    id: '14',
    name: 'Santosh Jadhav',
    badge: 'Contractor',
    message: 'Work completed successfully',
    timestamp: 'Friday',
    unreadCount: 0,
    avatar: '/Profile pics 15 message/14.png',
    isOnline: false,
  },
  {
    id: '15',
    name: 'Kiran Desai',
    badge: 'Rental',
    message: 'Property visit scheduled',
    timestamp: 'Friday',
    unreadCount: 0,
    avatar: '/Profile pics 15 message/15.png',
    isOnline: false,
  },
];

export interface ChatItem {
  id: string;
  name: string;
  badge?: string;
  message?: string;
  timestamp?: string;
  unreadCount?: number;
  avatar: string;
  isOnline?: boolean;
  lastSeen?: string;
  status?: string;
}

interface ChatListProps {
  chats: ChatItem[];
  onChatSelect: (chatId: string) => void;
  searchQuery?: string;
  selectedChatId?: string | null;
}

export const ChatListME = ({ 
  chats = [], 
  onChatSelect, 
  searchQuery = '',
  selectedChatId
}: ChatListProps) => {
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter(chat => 
      chat.name.toLowerCase().includes(query) || 
      chat.message?.toLowerCase().includes(query)
    );
  }, [chats, searchQuery]);

  if (filteredChats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
        <div className="text-center">
          <div className="bg-[#1F2C34] p-4 rounded-full mb-3 inline-flex">
            <Search className="h-6 w-6 text-[#A0A0A0]" />
          </div>
          <h3 className="text-white text-lg font-medium mb-1">No results found</h3>
          <p className="text-[#A0A0A0] text-sm">
            {searchQuery ? `No chats match "${searchQuery}"` : 'No chats available'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="min-h-full">
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={{
              id: chat.id,
              name: chat.name || 'Unknown',
              badge: chat.badge || '',
              message: chat.message || '',
              timestamp: chat.timestamp || chat.lastSeen || '',
              unreadCount: chat.unreadCount || 0,
              avatar: chat.avatar || '',
              isOnline: chat.isOnline || false,
              status: chat.status || 'offline'
            }}
            onClick={() => onChatSelect(chat.id)}
            isSelected={selectedChatId === chat.id}
          />
        ))}
      </div>
    </div>
  );
};
