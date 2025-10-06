
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, Bell, AlertCircle, Zap, Gift, Megaphone, Clock, Tag, ExternalLink } from 'lucide-react';
import { Notification } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const iconMap = {
  system: <AlertCircle className="text-red-400 h-6 w-6" />,
  subscription: <Bell className="text-blue-400 h-6 w-6" />,
  feature: <Zap className="text-green-400 h-6 w-6" />,
  promotion: <Gift className="text-purple-400 h-6 w-6" />,
  announcement: <Megaphone className="text-amber-400 h-6 w-6" />,
};

const typeColorMap = {
  system: 'text-red-400 bg-red-500/10 border-red-500/20',
  subscription: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  feature: 'text-green-400 bg-green-500/10 border-green-500/20',
  promotion: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  announcement: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

const priorityBadgeMap = {
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  low: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

interface NotificationDetailProps {
  notification: Notification;
  onBack: () => void;
}

export function NotificationDetail({ notification, onBack }: NotificationDetailProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Compact Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-800 h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-bold">Notification Details</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Notification Header */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gray-800/50">
              {iconMap[notification.type] || <Bell className="text-gray-400 h-6 w-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-3 mb-3">
                <h1 className="text-2xl font-bold text-white leading-tight">
                  {notification.title}
                </h1>
                <Badge 
                  variant="outline" 
                  className={`text-sm self-start ${priorityBadgeMap[notification.priority]}`}
                >
                  {notification.priority} priority
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span className={`px-2 py-1 rounded-full border ${typeColorMap[notification.type]}`}>
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!notification.isRead && (
            <div className="flex items-center gap-2 text-blue-400 text-sm bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>Unread notification</span>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Message</h2>
          <p className="text-gray-300 leading-relaxed text-base">
            {notification.message}
          </p>
        </div>

        {/* Metadata Section */}
        <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Created</span>
              <span className="text-gray-300">
                {format(new Date(notification.createdAt), 'PPpp')}
              </span>
            </div>
            <Separator className="bg-gray-800" />
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Type</span>
              <span className="text-gray-300 capitalize">
                {notification.type.replace('_', ' ')} notification
              </span>
            </div>
            <Separator className="bg-gray-800" />
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Status</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                notification.isRead 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-blue-500/20 text-blue-300'
              }`}>
                {notification.isRead ? 'Read' : 'Unread'}
              </span>
            </div>
            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
              <>
                <Separator className="bg-gray-800" />
                <div className="py-2">
                  <span className="text-gray-400 block mb-2">Additional Info</span>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <pre className="text-xs text-gray-300 overflow-x-auto">
                      {JSON.stringify(notification.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        {notification.actionUrl && (
          <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">Action Required</h2>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                console.log(`Navigate to: ${notification.actionUrl}`);
                // In a real app, you'd use navigate from react-router-dom
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        )}
      </div>


    </div>
  );
}
