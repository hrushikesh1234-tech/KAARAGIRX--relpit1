import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageSquare, Plus } from 'lucide-react';

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function SidebarME({ className }: SidebarProps) {
  const { pathname } = useLocation();

  return (
    <div className={cn('flex h-full w-64 flex-col border-r', className)}>
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/messages/new">
            <Plus className="h-4 w-4" />
            <span className="sr-only">New message</span>
          </Link>
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <Link
          to="/messages"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
            pathname === '/messages'
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <MessageSquare className="h-4 w-4" />
          All Conversations
        </Link>
      </nav>
    </div>
  );
}
