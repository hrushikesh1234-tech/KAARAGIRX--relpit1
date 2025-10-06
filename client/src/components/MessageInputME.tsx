import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Camera, Mic } from 'lucide-react';
import { AttachmentMenu } from './AttachmentMenuME';

export interface FileMessage {
  type: 'file';
  content: string;
  fileInfo: {
    name: string;
    type: string;
    size: number;
    timestamp: string;
  };
}

export interface TextMessage {
  type: 'text';
  content: string;
}

type MessageType = TextMessage | FileMessage;

interface MessageInputProps {
  onSendMessage: (message: MessageType) => void;
  onSendFile?: (file: File) => void;
  onStartVoiceCall?: () => void;
  onStartVideoCall?: () => void;
}

export const MessageInput = ({ 
  onSendMessage, 
  onSendFile, 
  onStartVoiceCall, 
  onStartVideoCall 
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachmentButtonRef = useRef<HTMLButtonElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const maxRows = 5;
  
  // Calculate icon size and padding based on message length
  const messageText = message || '';
  const leftIconSize = messageText.length > 0 ? 'w-4 h-4' : 'w-5 h-5';
  const leftButtonPadding = messageText.length > 0 ? 'p-1.5' : 'p-2';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage({
        type: 'text',
        content: message.trim()
      });
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);
    
    // Reset height to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate the number of rows needed
    const currentRows = Math.floor(textarea.scrollHeight / 24); // 24px is the line height
    
    if (currentRows >= maxRows) {
      textarea.style.overflowY = 'auto';
      textarea.style.height = `${24 * maxRows}px`; // 24px per line * maxRows
    } else {
      textarea.style.overflowY = 'hidden';
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        attachmentMenuRef.current && 
        !attachmentMenuRef.current.contains(event.target as Node) &&
        attachmentButtonRef.current &&
        !attachmentButtonRef.current.contains(event.target as Node)
      ) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAttachmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAttachmentMenu(prev => !prev);
  };

  const handleCameraClick = () => {
    // For now, we'll use the same file input as attachments
    // In a real app, this could open the device camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };
    input.click();
  };

  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file);
    
    // Check file type and size
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const validDocTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-works'
    ];

    const maxSize = 25 * 1024 * 1024; // 25MB
    
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 25MB.');
      return;
    }

    if (
      !validImageTypes.includes(file.type) &&
      !validVideoTypes.includes(file.type) &&
      !validDocTypes.some(type => file.type.includes(type.split('/')[1] || ''))
    ) {
      alert('Unsupported file type. Please select an image, video, or document.');
      return;
    }

    if (onSendFile) {
      // If onSendFile is provided, use it
      onSendFile(file);
    } else {
      // Otherwise, fall back to the default behavior
      const fileMessage: FileMessage = {
        type: 'file',
        content: URL.createObjectURL(file),
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size,
          timestamp: new Date().toISOString()
        }
      };
      onSendMessage(fileMessage);
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Create a file from the blob
        const audioFile = new File([audioBlob], 'voice-message.wav', { 
          type: 'audio/wav',
          lastModified: Date.now()
        });
        
        // Handle the recorded audio file
        handleFileSelect(audioFile);
        
        // Clean up
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Stop recording after 1 minute (or any other limit you prefer)
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 60000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  // Scroll to bottom when message list updates
  const scrollToBottom = () => {
    const messageContainer = document.querySelector('.message-container');
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Handle focus to ensure smooth scrolling on mobile
  const handleFocus = () => {
    // Small timeout to ensure the keyboard is shown before scrolling
    setTimeout(() => {
      scrollToBottom();
      // Scroll the window to show the input
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <div className="w-full p-3 pb-4">
      <form onSubmit={handleSubmit} className="flex items-end w-full space-x-2 pb-1">
        <div className="flex items-center space-x-1">
          {onStartVoiceCall && (
          <button 
            type="button"
            className="p-2 hover:bg-[#333333] rounded-full transition-all duration-200"
            onClick={onStartVoiceCall}
            aria-label="Start voice call"
          >
            <Mic className="w-5 h-5 text-[#A0A0A0]" />
          </button>
        )}
        {onStartVideoCall && (
          <button 
            type="button"
            className="p-2 hover:bg-[#333333] rounded-full transition-all duration-200"
            onClick={onStartVideoCall}
            aria-label="Start video call"
          >
            <Camera className="w-5 h-5 text-[#A0A0A0]" />
          </button>
        )}
        <div className="relative">
          <button
            ref={attachmentButtonRef}
            type="button"
            onClick={handleAttachmentClick}
            className={`${leftButtonPadding} hover:bg-[#333333] rounded-full transition-all duration-200 flex items-center justify-center`}
            style={{ minWidth: '2rem', minHeight: '2rem' }}
            aria-label="Attach file"
          >
            <Paperclip className={`${leftIconSize} text-[#A0A0A0] transition-all duration-200`} />
          </button>
          {showAttachmentMenu && (
            <div 
              ref={attachmentMenuRef}
              className="absolute bottom-full left-0 z-50 mb-2"
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                zIndex: 1000
              }}
            >
              <AttachmentMenu
                onClose={() => setShowAttachmentMenu(false)}
                onFileSelect={(file) => {
                  handleFileSelect(file);
                  setShowAttachmentMenu(false);
                }}
                anchorElement={attachmentButtonRef.current}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 relative min-w-0">
        <div className="bg-[#2A2A2A] rounded-2xl overflow-hidden min-h-[40px] flex items-center w-full border border-[#D4AF37]" style={{ maxWidth: '100%' }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onFocus={handleFocus}
            onClick={handleFocus}
            placeholder="Type a message..."
            className="w-full bg-transparent border-none px-4 py-2 text-white placeholder-[#A0A0A0] focus:outline-none focus:ring-0 resize-none overflow-y-auto max-h-[120px] leading-6 text-base min-h-[40px] flex-grow break-words whitespace-pre-wrap"
            style={{ 
              lineHeight: '24px',
              minHeight: '40px',
              maxHeight: '120px',
              paddingTop: '8px',
              paddingBottom: '8px',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="button" 
            onClick={handleCameraClick}
            className={`${leftButtonPadding} hover:bg-[#333333] rounded-full transition-all duration-200`}
            style={{ minWidth: '2rem' }}
          >
            <Camera className={`${leftIconSize} text-[#A0A0A0] transition-all duration-200`} />
          </button>
        </div>
      </div>
      <div className="flex items-center ml-2">
        {!message.trim() ? (
          <button
            type="button"
            onClick={handleMicClick}
            className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-600 animate-pulse' : 'hover:bg-[#333333]'}`}
            aria-label={isRecording ? 'Stop recording' : 'Record voice message'}
          >
            {isRecording ? (
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            ) : (
              <Mic className="w-5 h-5 text-[#A0A0A0]" />
            )}
          </button>
        ) : (
          <button
            type="submit"
            className="p-2 bg-[#D4AF37] text-white rounded-full hover:bg-[#FFD700] transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  </div>
);
};
