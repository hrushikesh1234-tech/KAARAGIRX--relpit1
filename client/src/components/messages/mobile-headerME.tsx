import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, MessageSquare, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MobileHeaderME() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">Messages</h2>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/messages/new">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New message</span>
                </Link>
              </Button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-2">
              <Link
                to="/messages"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <MessageSquare className="h-4 w-4" />
                All Conversations
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      <h1 className="text-lg font-semibold">Messages</h1>
      <Button variant="ghost" size="icon" asChild>
        <Link to="/messages/new">
          <Plus className="h-5 w-5" />
          <span className="sr-only">New message</span>
        </Link>
      </Button>
    </header>
  );
}
