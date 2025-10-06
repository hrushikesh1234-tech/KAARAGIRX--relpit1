import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, Plus } from 'lucide-react';

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
};

export default function ConversationsListME() {
  const navigate = useNavigate();
  
  // Mock data - replace with actual data from your API
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you doing?',
      time: '10:30 AM',
      unread: 2,
      avatar: '',
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'Can we schedule a meeting?',
      time: 'Yesterday',
      unread: 0,
      avatar: '',
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            to={`/messages/${conversation.id}`}
            className="flex items-center gap-3 border-b p-4 hover:bg-muted/50"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback>
                {conversation.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="truncate font-medium">{conversation.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {conversation.time}
                </span>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {conversation.unread}
              </span>
            )}
          </Link>
        ))}
      </div>
      <div className="border-t p-4">
        <Button className="w-full" onClick={() => navigate('/messages/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>
    </div>
  );
}
