
import { Bell, AlertCircle, Zap, Gift, Megaphone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/notification';
import { Badge } from '@/components/ui/badge';

const iconMap = {
  system: <AlertCircle className="text-red-400 h-5 w-5" />,
  subscription: <Bell className="text-blue-400 h-5 w-5" />,
  feature: <Zap className="text-green-400 h-5 w-5" />,
  promotion: <Gift className="text-purple-400 h-5 w-5" />,
  announcement: <Megaphone className="text-amber-400 h-5 w-5" />,
};

const bgColorMap = {
  system: 'border-red-500/20 bg-red-500/5',
  subscription: 'border-blue-500/20 bg-blue-500/5',
  feature: 'border-green-500/20 bg-green-500/5',
  promotion: 'border-purple-500/20 bg-purple-500/5',
  announcement: 'border-amber-500/20 bg-amber-500/5',
};

const priorityBadgeMap = {
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  low: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

interface TimelineNotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}

function TimelineNotificationCard({ notification, onClick }: TimelineNotificationCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        relative p-4 sm:p-6 border rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 
        hover:shadow-lg mb-4 sm:mb-6 w-full max-w-full overflow-hidden
        ${!notification.isRead 
          ? `${bgColorMap[notification.type]} border-l-4` 
          : 'bg-gray-900/30 border-gray-800 hover:bg-gray-900/50'
        }
      `}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse" />
        </div>
      )}

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div className="mt-0.5 p-2 sm:p-3 rounded-lg bg-gray-800/50 shrink-0">
          {iconMap[notification.type] || <Bell className="text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <h3 className={`font-semibold text-sm sm:text-lg flex-1 line-clamp-2 ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                {notification.title}
              </h3>
              <div className="flex-shrink-0">
                <Badge 
                  variant="outline" 
                  className={`text-[10px] sm:text-xs whitespace-nowrap ${priorityBadgeMap[notification.priority]}`}
                >
                  {notification.priority}
                </Badge>
              </div>
            </div>
          </div>

          <p className={`text-xs sm:text-sm leading-snug sm:leading-relaxed mb-3 sm:mb-4 line-clamp-2 ${!notification.isRead ? 'text-gray-300' : 'text-gray-400'}`}>
            {notification.message}
          </p>

          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs sm:text-sm">
            <span className="text-gray-500 capitalize">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
            
            <span className="text-blue-400">
              {notification.type.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { TimelineNotificationCard };
