import { lazy, Suspense } from 'react';
import { BellOff } from 'lucide-react';
import { Notification } from '@/types/notification';
import { TimelineNotificationCard } from '@/components/TimelineNotificationCardNT';
import { TimelineEntry } from './notifications-nt';

// Lazy load the Timeline component
const Timeline = lazy(() => import('@/components/ui/timeline'));

interface NotificationsClientProps {
  filteredNotifications: Notification[];
  searchQuery: string;
  handleNotificationClick: (notification: Notification) => void;
  groupNotificationsByDate: (
    notifications: Notification[], 
    onNotificationClick?: (notification: Notification) => void
  ) => TimelineEntry[];
}

export function NotificationsClient({
  filteredNotifications,
  searchQuery,
  handleNotificationClick,
  groupNotificationsByDate,
}: NotificationsClientProps) {
  return (
    <div className="w-full bg-black text-white">
      <div className="w-full pb-20">
        {filteredNotifications.length > 0 ? (
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-gray-500">Loading notifications...</div>
            </div>
          }>
            <Timeline data={groupNotificationsByDate(filteredNotifications, handleNotificationClick)} />
          </Suspense>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-800/50">
              <BellOff className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">
              {searchQuery ? "No matching notifications" : "No notifications yet"}
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              {searchQuery 
                ? "Try adjusting your search terms"
                : "When you receive notifications, they'll appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
