
import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isMe = message.sender === 'me';
  
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check className="w-3 h-3 text-orange-500" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
          isMe
            ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black rounded-br-none'
            : 'bg-[#2A2A2A] text-[#EDEDED] rounded-bl-none border border-[#444444]'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <div className={`flex items-center mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-xs mr-1 ${isMe ? 'text-black opacity-70' : 'text-[#A0A0A0]'}`}>
            {message.timestamp}
          </span>
          {isMe && (
            <span className="inline-flex">
              {getStatusIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
