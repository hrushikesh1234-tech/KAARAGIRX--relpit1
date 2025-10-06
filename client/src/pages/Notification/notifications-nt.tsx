import { useState } from 'react';
import { ArrowLeft, BellOff, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications, useUnreadCount } from '@/hooks/useNotifications';
import { NotificationDetail } from '@/components/NotificationDetailNT';
import { TimelineNotificationCard } from '@/components/TimelineNotificationCardNT';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Notification } from '@/types/notification';
import { NotificationsClient } from './NotificationsClient';

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const groupNotificationsByDate = (
  notifications: Notification[],
  onNotificationClick?: (notification: Notification) => void
): TimelineEntry[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const groups = new Map<string, Notification[]>();
  
  notifications.forEach(notification => {
    const date = new Date(notification.createdAt);
    let dateKey: string;
    
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else if (date > lastWeek) {
      dateKey = 'This Week';
    } else {
      dateKey = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)?.push(notification);
  });
  
  return Array.from(groups.entries()).map(([dateKey, notifications]) => ({
    title: dateKey,
    content: (
      <div className="space-y-2">
        {notifications.map((notification) => (
          <TimelineNotificationCard
            key={notification.id}
            notification={notification}
            onClick={() => onNotificationClick?.(notification)}
          />
        ))}
      </div>
    )
  }));
};

const NotificationsNT = () => {
  const { 
    notifications, 
    isLoading, 
    markAsRead,
    markAllAsRead 
  } = useNotifications();
  
  const { data: unreadCount = 0 } = useUnreadCount();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  
  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    setSelectedNotification(notification);
  };
  
  // Sort notifications by date (newest first) and filter by search query
  const filteredNotifications = notifications
    .filter((notification: Notification) => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          notification.title.toLowerCase().includes(searchLower) ||
          notification.message.toLowerCase().includes(searchLower) ||
          notification.type.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a: Notification, b: Notification) => {
      // Sort by read status first (unread first), then by date
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });



  if (selectedNotification) {
    return (
      <NotificationDetail 
        notification={selectedNotification} 
        onBack={() => setSelectedNotification(null)} 
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800/50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Sticky Search Bar with Animated Gradient */}
      <div className="fixed top-16 left-0 right-0 z-40 w-full">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:300%_100%] animate-gradient shadow-md">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-1">
            <div className="flex items-center h-9">
              <div className="relative flex-1 h-full">
                <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white" />
                <Input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-7 pr-2 text-xs bg-white/10 backdrop-blur-sm border-0 text-white placeholder-white/90 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-0"
                  style={{ color: 'white' }}
                />
              </div>
              {filteredNotifications.length > 0 && (
                <div className="ml-1.5 h-7 flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleMarkAllAsRead}
                    className="whitespace-nowrap h-7 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white text-[11px] px-2.5 py-1.5 flex items-center"
                  >
                    Mark all read
                  </Button>
                </div>
              )}
            </div>
            
            {/* Title and Unread Count */}
            <div className="mt-1 flex items-center justify-between">
              <h1 className="text-sm font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[11px] font-medium text-blue-300">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add global styles for the animation */}
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            animation: gradient 15s ease infinite;
            background-size: 300% 300%;
          }
        `}
      </style>

      {/* Content area with padding for fixed header and search bar */}
      <div className="pt-12">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          
          {/* Notification List */}
          <div className="space-y-1">
            {filteredNotifications.length > 0 ? (
              <NotificationsClient 
                filteredNotifications={filteredNotifications} 
                searchQuery={searchQuery}
                handleNotificationClick={handleNotificationClick}
                groupNotificationsByDate={groupNotificationsByDate}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No notifications found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// TimelineEntry interface and groupNotificationsByDate function are already defined at the top of the file

export default NotificationsNT;
