import React, { useEffect, useRef, useState } from 'react';
import { X, Phone, Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';
import { ChatContact } from './ChatHeaderME';

interface CallModalProps {
  contact: ChatContact;
  callType: 'audio' | 'video';
  onEndCall: () => void;
  onAcceptCall?: () => void;
  isIncoming?: boolean;
  isRinging?: boolean;
}

export const CallModal: React.FC<CallModalProps> = ({
  contact,
  callType,
  onEndCall,
  onAcceptCall,
  isIncoming = false,
  isRinging = false,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callStatus, setCallStatus] = useState(isIncoming ? 'incoming' : 'calling');
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Play ringing sound for incoming calls
  useEffect(() => {
    if (isRinging && audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.error('Error playing ringtone:', e));
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isRinging]);

  // Call timer
  useEffect(() => {
    if (callStatus === 'in-progress') {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [callStatus]);

  const handleAcceptCall = () => {
    if (onAcceptCall) onAcceptCall();
    setCallStatus('in-progress');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // In a real app, we would set up WebRTC connections here
  };

  const handleEndCall = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onEndCall();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
      {/* Hidden audio element for ringtone */}
      <audio ref={audioRef} src="/sounds/ringtone.mp3" />
      
      {/* Caller Info */}
      <div className="text-center mb-8">
        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4 overflow-hidden">
          {contact.avatar ? (
            <img 
              src={contact.avatar} 
              alt={contact.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}`;
              }}
            />
          ) : (
            <span className="text-4xl text-white">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-white">{contact.name}</h2>
        <p className="text-gray-300 capitalize">{contact.badge}</p>
        <p className="text-gray-400 mt-2">
          {callStatus === 'calling' && 'Calling...'}
          {callStatus === 'incoming' && 'Incoming Call'}
          {callStatus === 'in-progress' && formatTime(callDuration)}
        </p>
      </div>

      {/* Video Elements */}
      <div className="relative w-full max-w-2xl h-96 bg-gray-900 rounded-lg overflow-hidden mb-8">
        {callType === 'video' && (
          <>
            {/* Local Video */}
            <div className="absolute bottom-4 right-4 w-32 h-48 bg-black rounded-lg overflow-hidden z-10 border-2 border-gray-600">
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
              />
              {isVideoOff && (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>
            
            {/* Remote Video */}
            <div className="w-full h-full flex items-center justify-center">
              {isVideoOff ? (
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    {contact.avatar ? (
                      <img 
                        src={contact.avatar} 
                        alt={contact.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-white">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-white text-xl">{contact.name}</p>
                  <p className="text-gray-400">Video is turned off</p>
                </div>
              ) : (
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Call Controls */}
      <div className="flex items-center justify-center space-x-6">
        {callStatus === 'incoming' ? (
          <>
            <button
              onClick={handleAcceptCall}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 transition-all"
            >
              <Phone className="w-6 h-6" />
            </button>
            <button
              onClick={handleEndCall}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-all"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </>
        ) : callStatus === 'calling' ? (
          <button
            onClick={handleEndCall}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-all"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`rounded-full p-4 transition-all ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>
            {callType === 'video' && (
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-4 transition-all"
              >
                {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              </button>
            )}
            <button
              onClick={handleEndCall}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-all"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
