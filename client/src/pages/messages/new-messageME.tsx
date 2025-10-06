import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, UserPlus } from 'lucide-react';

type User = {
  id: string;
  name: string;
  avatar: string;
  role: string;
};

export default function NewMessageME() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - replace with actual data from your API
  const users: User[] = [
    { id: '1', name: 'John Doe', avatar: '', role: 'Contractor' },
    { id: '2', name: 'Jane Smith', avatar: '', role: 'Architect' },
    { id: '3', name: 'Bob Johnson', avatar: '', role: 'Homeowner' },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b p-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => navigate('/messages')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-medium">New Message</h2>
        </div>
      </div>
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search people..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className="flex w-full items-center justify-between p-3"
              onClick={() => navigate(`/messages/${user.id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="text-left">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </Button>
          ))}
          {filteredUsers.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
