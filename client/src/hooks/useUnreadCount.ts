import { useQuery } from '@tanstack/react-query';
import { Notification } from '@/types/notification';

// This hook fetches the count of unread notifications
export function useUnreadCount() {
  return useQuery<number>({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      try {
        // In a real app, this would be an API call to your backend
        // For now, we'll return a mock count
        return 0;
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
        return 0;
      }
    },
    // Refetch every 30 seconds
    refetchInterval: 30000,
  });
}

// This hook fetches all notifications
export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        // In a real app, this would be an API call to your backend
        // For now, we'll return mock data
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'system',
            title: 'Welcome to KaragirX',
            message: 'Thank you for signing up! Start exploring our platform now.',
            isRead: false,
            createdAt: new Date().toISOString(),
            priority: 'medium',
          },
          {
            id: '2',
            type: 'announcement',
            title: 'New Features Available',
            message: 'Check out our latest updates and new features.',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
            priority: 'high',
            actionUrl: '/features'
          },
        ];
        return mockNotifications;
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        return [];
      }
    },
  });
}
