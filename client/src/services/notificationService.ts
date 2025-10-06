import { Notification } from '@/types/notification';

// Mock data for notifications
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

export const fetchNotifications = async (): Promise<Notification[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockNotifications]);
    }, 500);
  });
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.isRead = true;
      }
      resolve();
    }, 300);
  });
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      mockNotifications.forEach(n => n.isRead = true);
      resolve();
    }, 300);
  });
};
