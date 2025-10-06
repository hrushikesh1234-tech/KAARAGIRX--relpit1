import React, { useState, useEffect } from 'react';
import { Phone, PhoneMissed, PhoneIncoming, PhoneOutgoing, Video, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type CallType = 'voice' | 'video';
export type CallStatus = 'missed' | 'incoming' | 'outgoing' | 'accepted' | 'rejected';

export interface Call {
  id: string;
  name: string;
  time: string;
  type: CallType;
  status: CallStatus;
  duration?: string;
  avatar: string;
}

const defaultCalls: Call[] = [
  {
    id: '1',
    name: 'Hrushi more',
    time: '10:30 AM',
    type: 'voice',
    status: 'missed',
    avatar: '/Profile pics 15/1- Hrushi more.jpg',
  },
  {
    id: '2',
    name: 'Subhas patil',
    time: 'Yesterday',
    type: 'video',
    status: 'incoming',
    duration: '12:45',
    avatar: '/Profile pics 15/2.png',
  },
  {
    id: '3',
    name: 'Teju shinde',
    time: 'Yesterday',
    type: 'voice',
    status: 'outgoing',
    duration: '5:22',
    avatar: '/Profile pics 15/3- Teju shinde.jpg',
  },
  {
    id: '4',
    name: 'Channa ram',
    time: 'Monday',
    type: 'video',
    status: 'accepted',
    duration: '24:18',
    avatar: '/Profile pics 15/4- Channa ram.jpg',
  },
  {
    id: '5',
    name: 'Rahul kumar',
    time: 'Monday',
    type: 'voice',
    status: 'rejected',
    avatar: '/Profile pics 15/5- Rahul kumar.jpg',
  },
];

// Initialize localStorage with default calls if empty
const initializeCalls = (): Call[] => {
  const savedCalls = localStorage.getItem('callHistory');
  if (!savedCalls) {
    localStorage.setItem('callHistory', JSON.stringify(defaultCalls));
    return defaultCalls;
  }
  return JSON.parse(savedCalls);
};

const getStatusIcon = (type: CallType, status: CallStatus) => {
  if (status === 'missed') return <PhoneMissed className="w-4 h-4 text-red-500" />;
  if (status === 'incoming') return <PhoneIncoming className="w-4 h-4 text-green-500" />;
  if (status === 'outgoing') return <PhoneOutgoing className="w-4 h-4 text-green-500" />;
  return type === 'video' ? 
    <Video className="w-4 h-4 text-green-500" /> : 
    <Phone className="w-4 h-4 text-green-500" />;
};

const getStatusText = (status: CallStatus) => {
  switch (status) {
    case 'missed': return 'Missed';
    case 'incoming': return 'Incoming';
    case 'outgoing': return 'Outgoing';
    case 'accepted': return 'Accepted';
    case 'rejected': return 'Rejected';
    default: return '';
  }
};

export const CallsList = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const navigate = useNavigate();

  const handleCallAction = (e: React.MouseEvent, call: Call) => {
    e.stopPropagation();
    // Here you would typically initiate a new call
    console.log(`Initiating ${call.type} call to ${call.name}`);
  };

  const handleCallItemClick = (call: Call) => {
    // Navigate to the chat with this contact
    navigate(`/chat/${call.id}`);
  };

  useEffect(() => {
    // Load calls from localStorage
    const savedCalls = initializeCalls();
    setCalls(savedCalls);
    
    // Listen for storage events to update calls when they change in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'callHistory') {
        const updatedCalls = e.newValue ? JSON.parse(e.newValue) : [];
        setCalls(updatedCalls);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#D4AF37] font-medium">Recent</h2>
          <button className="text-[#A0A0A0] text-sm flex items-center">
            <ChevronDown className="w-4 h-4 mr-1" />
            Sort
          </button>
        </div>
        
        <div className="space-y-4">
          {calls.map((call) => (
            <div 
              key={call.id} 
              className="flex items-center p-2 hover:bg-[#1F2C34] rounded-lg cursor-pointer transition-colors"
              onClick={() => handleCallItemClick(call)}
            >
              <div className="relative mr-3">
                <img 
                  src={call.avatar} 
                  alt={call.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(call.name)}&background=random`;
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-[#0B141A] p-1 rounded-full">
                  {call.type === 'video' ? (
                    <Video className="w-3 h-3 text-green-500" />
                  ) : (
                    <Phone className="w-3 h-3 text-green-500" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium text-sm truncate">{call.name}</h3>
                  <span className="text-[#A0A0A0] text-xs whitespace-nowrap ml-2">{call.time}</span>
                </div>
                <div className="flex items-center mt-1">
                  {getStatusIcon(call.type, call.status)}
                  <span className={`text-xs ml-1 ${call.status === 'missed' ? 'text-red-500' : 'text-[#A0A0A0]'}`}>
                    {getStatusText(call.status)}
                    {call.duration && ` • ${call.duration}`}
                  </span>
                </div>
              </div>
              
              <button 
                className="ml-2 p-2 text-[#D4AF37] hover:bg-[#2A3B45] rounded-full transition-colors"
                onClick={(e) => handleCallAction(e, call)}
              >
                {call.type === 'video' ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <Phone className="w-5 h-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
