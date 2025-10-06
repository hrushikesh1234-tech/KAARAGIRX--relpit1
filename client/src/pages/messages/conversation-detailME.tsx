import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, MoreVertical, Smile } from 'lucide-react';
import { format } from 'date-fns';

type Message = {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: Date;
};

type Participant = {
  id: string;
  name: string;
  avatar: string;
};

export default function ConversationDetailME() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Mock data - replace with actual data from your API
  const participant: Participant = {
    id: '1',
    name: 'John Doe',
    avatar: '',
  };

  const messages: Message[] = [
    {
      id: '1',
      text: 'Hey there!',
      sender: 'them',
      timestamp: new Date(Date.now() - 3600000 * 2),
    },
    {
      id: '2',
      text: 'Hi! How are you?',
      sender: 'me',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      text: 'I\'m doing great, thanks for asking! How about you?',
      sender: 'them',
      timestamp: new Date(),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => navigate('/messages')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={participant.avatar} alt={participant.name} />
            <AvatarFallback>
              {participant.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{participant.name}</h2>
            <p className="text-xs text-muted-foreground">
              {messages.length} messages
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'me'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p>{message.text}</p>
              <p
                className={`mt-1 text-xs ${
                  message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}
              >
                {format(message.timestamp, 'h:mm a')}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="relative">
          <Input
            placeholder="Type a message..."
            className="pr-12"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                // Handle send message
                e.currentTarget.value = '';
              }
            }}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
