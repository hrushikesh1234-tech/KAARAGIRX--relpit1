import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, PhoneOff, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ringtone = '/sounds/Simple mobile phone caller tune [HQ] (Foley Sound) - Sound Effect - Free to Use #shorts.mp3';

interface Call {
  id: string;
  contactId: string;
  type: 'voice' | 'video';
  timestamp: string;
  duration: number;
  status: 'missed' | 'incoming' | 'outgoing' | 'accepted' | 'rejected';
}

interface CallScreenProps {
  contact: {
    id: string;
    name: string;
    avatar: string;
  };
  type: 'voice' | 'video';
  onEndCall: (duration: number) => void;
  incoming?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onAddToCallHistory: (call: Omit<Call, 'id'>) => void;
}

export const CallScreen: React.FC<CallScreenProps> = ({
  contact,
  type,
  onEndCall,
  incoming = false,
  onAccept,
  onReject,
  onAddToCallHistory,
}) => {
  const navigate = useNavigate();
  const [callStatus, setCallStatus] = useState<'calling' | 'ringing' | 'in-call' | 'ended'>(
    incoming ? 'ringing' : 'calling'
  );
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(type === 'video');
  const [isOnHold, setIsOnHold] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Play ringtone for incoming calls
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (incoming && callStatus === 'ringing') {
      // Force reload the audio to ensure it plays
      audio.pause();
      audio.currentTime = 0;
      audio.loop = true;
      
      const playAudio = () => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing ringtone:', error);
          });
        }
      };
      
      // Try to play immediately
      playAudio();
      
      // Try again after a short delay if needed (some browsers require user interaction first)
      const timeoutId = setTimeout(playAudio, 1000);
      
      return () => {
        clearTimeout(timeoutId);
        audio.pause();
        audio.currentTime = 0;
      };
    }
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [incoming, callStatus]);

  // Handle call timer
  useEffect(() => {
    if (callStatus === 'in-call' && !callStartTime) {
      setCallStartTime(new Date());
    }
  }, [callStatus, callStartTime]);

  // Start call timer when call is answered
  useEffect(() => {
    if (callStatus === 'in-call') {
      // Stop ringtone when call is answered
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Start call timer
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callStatus]);

  // Initialize video stream for video calls
  useEffect(() => {
    if (type === 'video' && localVideoRef.current && callStatus === 'in-call') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          // In a real app, you would connect this stream to a WebRTC peer connection
        })
        .catch(err => {
          console.error('Error accessing camera/microphone:', err);
          // Fallback to audio only if video fails
          setIsVideoOn(false);
        });
    }
  }, [type, callStatus]);

  const handleAcceptCall = () => {
    setCallStatus('in-call');
    setCallStartTime(new Date());
    if (onAccept) onAccept();
  };

  const handleRejectCall = () => {
    setCallStatus('ended');
    
    // Add to call history as rejected
    onAddToCallHistory({
      contactId: contact.id,
      type,
      timestamp: new Date().toISOString(),
      duration: 0,
      status: 'rejected' as const
    });
    
    if (onReject) onReject();
    onEndCall(0);
    navigate('/calls');
  };
  
  const toggleHold = () => {
    setIsOnHold(!isOnHold);
    // In a real app, you would pause the media stream here
  };
  
  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real app, you would toggle the audio output device here
  };

  const handleEndCall = () => {
    const endTime = new Date();
    const duration = callStartTime ? Math.floor((endTime.getTime() - callStartTime.getTime()) / 1000) : 0;
    setCallStatus('ended');
    
    // Add to call history
    onAddToCallHistory({
      contactId: contact.id,
      type,
      timestamp: new Date().toISOString(),
      duration,
      status: duration > 0 ? 'accepted' : 'rejected'
    });
    
    // Stop any ongoing timers
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Notify parent component first
    onEndCall(duration);
    
    // Show call ended message
    const callEndedMessage = document.createElement('div');
    callEndedMessage.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-50';
    callEndedMessage.textContent = 'Call ended';
    document.body.appendChild(callEndedMessage);
    
    // Remove the message after 2 seconds
    setTimeout(() => {
      callEndedMessage.remove();
    }, 2000);
    
    // Navigate to calls tab after a short delay
    // This will be handled by the parent component's onEndCall
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-[#0B141A] z-50 flex flex-col items-center justify-center p-4">
      {/* Hidden audio element for ringtone */}
      <audio 
        ref={audioRef} 
        src={ringtone} 
        loop 
        preload="auto"
        className="hidden"
      />
      
      {/* Caller info */}
      <div className="text-center mb-8">
        <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#D4AF37]">
          <img 
            src={contact.avatar} 
            alt={contact.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=4F46E5&color=fff`;
            }}
          />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-1">{contact.name}</h2>
        <p className="text-gray-300">
          {callStatus === 'calling' && 'Calling...'}
          {callStatus === 'ringing' && 'Incoming Call'}
          {callStatus === 'in-call' && formatDuration(callDuration)}
        </p>
      </div>
      
      {/* Video feeds */}
      <div className="relative w-full max-w-4xl h-96 mb-8 rounded-lg overflow-hidden bg-black">
        {/* Remote video or profile picture */}
        {callStatus === 'in-call' && isVideoOn ? (
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <img 
                src={contact.avatar} 
                alt={contact.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        {/* Local video */}
        {callStatus === 'in-call' && isVideoOn && type === 'video' && (
          <div className="absolute bottom-4 right-4 w-32 h-48 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      {/* Call controls */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center gap-6 mb-4">
          {callStatus === 'ringing' && incoming ? (
            <>
              <button 
                onClick={handleRejectCall}
                className="flex flex-col items-center p-4 bg-red-600 rounded-full text-white hover:bg-red-700 transition-all transform hover:scale-105"
                aria-label="Reject call"
              >
                <PhoneOff className="w-8 h-8" />
                <span className="text-xs mt-1">Decline</span>
              </button>
              <button 
                onClick={handleAcceptCall}
                className="flex flex-col items-center p-4 bg-green-600 rounded-full text-white hover:bg-green-700 transition-all transform hover:scale-105"
                aria-label="Accept call"
              >
                <Phone className="w-8 h-8" />
                <span className="text-xs mt-1">Accept</span>
              </button>
            </>
          ) : callStatus === 'in-call' ? (
            <>
              {/* Mute Button */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-700/80'} text-white hover:bg-opacity-90 transition-all`}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <span className="text-xs text-gray-300 mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
              </div>
              
              {/* Hold Button */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={toggleHold}
                  className={`p-4 rounded-full ${isOnHold ? 'bg-yellow-600' : 'bg-gray-700/80'} text-white hover:bg-opacity-90 transition-all`}
                  aria-label={isOnHold ? 'Resume' : 'Hold'}
                >
                  {isOnHold ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                </button>
                <span className="text-xs text-gray-300 mt-1">{isOnHold ? 'Resume' : 'Hold'}</span>
              </div>
              
              {/* End Call Button */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={handleEndCall}
                  className="p-4 bg-red-600 rounded-full text-white hover:bg-red-700 transition-all transform hover:scale-110"
                  aria-label="End call"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
                <span className="text-xs text-gray-300 mt-1">End</span>
              </div>
            </>
          ) : (
            <button 
              onClick={handleEndCall}
              className="p-4 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors transform hover:scale-110"
              aria-label="End call"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
