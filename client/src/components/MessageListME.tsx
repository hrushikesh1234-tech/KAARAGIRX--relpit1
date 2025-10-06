
import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubbleME';
import { Image, FileText, Download, Video } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  fileInfo?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
}



interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-container flex-1 overflow-y-auto h-full bg-[#0B141A]">
      <div className="min-h-full flex flex-col justify-end">
        <div className="space-y-2 py-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} mb-4 px-2`}
            >
              <div
                className={`max-w-[90%] rounded-lg overflow-hidden ${
                  message.sender === 'me' ? 'bg-[#8B6914]' : 'bg-[#202C33]'
                }`}
              >
                {message.fileInfo ? (
                  <div className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      {message.fileInfo.type.startsWith('image/') ? (
                        <Image className="w-5 h-5 text-white" />
                      ) : message.fileInfo.type.startsWith('video/') ? (
                        <Video className="w-5 h-5 text-white" />
                      ) : (
                        <FileText className="w-5 h-5 text-white" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {message.fileInfo.name}
                        </p>
                        <p className="text-xs text-gray-300">
                          {(message.fileInfo.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <a
                        href={message.fileInfo.url}
                        download={message.fileInfo.name}
                        className="p-1 rounded-full hover:bg-[#00000033]"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </a>
                    </div>
                    {message.fileInfo.type.startsWith('image/') && (
                      <div className="mt-2 rounded overflow-hidden">
                        <img
                          src={message.fileInfo.url}
                          alt={message.fileInfo.name}
                          className="max-w-full h-auto rounded"
                          style={{ maxHeight: '200px' }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-2">
                    <p className="text-white">{message.text}</p>
                  </div>
                )}
                <div className="flex justify-end items-center px-3 py-1">
                  <span className="text-xs text-gray-400 mr-1">
                    {message.timestamp}
                    {message.sender === 'me' && (
                      <span className="ml-1">
                        {message.status === 'sent' && '✓'}
                        {message.status === 'delivered' && '✓✓'}
                        {message.status === 'read' && '✓✓'}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>
    </div>
  );
};
