
import { Bell, AlertCircle, Zap, Gift, Megaphone, ExternalLink } from 'lucide-react';
import { Notification } from '@/types/notification';
import { Badge } from '@/components/ui/badge';

const iconMap = {
  system: <AlertCircle className="text-red-400" />,
  subscription: <Bell className="text-blue-400" />,
  feature: <Zap className="text-green-400" />,
  promotion: <Gift className="text-purple-400" />,
  announcement: <Megaphone className="text-amber-400" />,
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

interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  return (
    <div 
      className={`
        relative p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
        ${!notification.isRead 
          ? `${bgColorMap[notification.type]} border-l-4` 
          : 'bg-gray-900/30 border-gray-800 hover:bg-gray-900/50'
        }
      `}
      onClick={onClick}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute top-4 right-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="mt-1 p-2 rounded-lg bg-gray-800/50 shrink-0">
          {iconMap[notification.type] || <Bell className="text-gray-400" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className={`font-semibold flex-1 ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                {notification.title}
              </h3>
              <Badge 
                variant="outline" 
                className={`text-xs shrink-0 ${priorityBadgeMap[notification.priority]}`}
              >
                {notification.priority}
              </Badge>
            </div>
          </div>

          <p className={`text-sm line-clamp-2 mb-3 ${!notification.isRead ? 'text-gray-300' : 'text-gray-400'}`}>
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 capitalize">
              {notification.type.replace('_', ' ')} notification
            </span>
            
            <div className="flex items-center text-blue-400 text-sm">
              <span className="mr-1">View details</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
