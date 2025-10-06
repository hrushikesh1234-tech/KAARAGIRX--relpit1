
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/types/notification';

// Mock data for demonstration
const mockNotifications: Notification[] = [
  // Today
  {
    id: '1',
    type: 'subscription',
    title: 'Subscription Ending Soon',
    message: 'Your premium subscription will expire in 3 days. Renew now to continue enjoying all features.',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    priority: 'high',
    actionUrl: '/billing'
  },
  {
    id: '2',
    type: 'feature',
    title: 'New Dashboard Released!',
    message: 'We\'ve completely redesigned your dashboard with new analytics and better performance.',
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    priority: 'medium'
  },
  {
    id: '3',
    type: 'system',
    title: 'Scheduled Maintenance',
    message: 'We\'ll be performing scheduled maintenance tonight from 2:00 AM to 4:00 AM EST.',
    isRead: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    priority: 'medium'
  },
  
  // Yesterday
  {
    id: '4',
    type: 'promotion',
    title: 'Limited Time Offer: 50% Off',
    message: 'Upgrade to our premium plan and save 50% for the first 6 months. Offer expires soon!',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    priority: 'low'
  },
  {
    id: '5',
    type: 'announcement',
    title: 'Company Update: Series B Funding',
    message: 'We\'re excited to announce our $50M Series B funding round to accelerate product development.',
    isRead: true,
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), // 26 hours ago
    priority: 'low'
  },
  
  // This Week
  {
    id: '6',
    type: 'feature',
    title: 'New Feature: Dark Mode',
    message: 'Dark mode is now available in your account settings. Try it out!',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    priority: 'medium'
  },
  {
    id: '7',
    type: 'system',
    title: 'Security Alert',
    message: 'A new device signed in to your account. If this wasn\'t you, please secure your account.',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    priority: 'high'
  },
  
  // Last Week
  {
    id: '8',
    type: 'announcement',
    title: 'Weekly Digest: Latest Updates',
    message: 'Check out what\'s new in this week\'s product update.',
    isRead: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    priority: 'low'
  },
  {
    id: '9',
    type: 'announcement',
    title: 'Webinar Invitation',
    message: 'Join our live webinar about advanced features this Friday at 2 PM EST.',
    isRead: true,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
    priority: 'medium'
  },
  
  // Older Notifications
  ...Array.from({ length: 10 }, (_, i) => {
    const types: Notification['type'][] = ['system', 'subscription', 'feature', 'promotion', 'announcement'];
    const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    
    return {
      id: `10${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      title: `Older Notification ${i + 1}`,
      message: `This is an older notification from ${i + 10} days ago.`,
      isRead: true,
      createdAt: new Date(Date.now() - (i + 10) * 24 * 60 * 60 * 1000).toISOString(),
      priority: priorities[Math.floor(Math.random() * priorities.length)]
    };
  })
];

const fetchNotifications = async (): Promise<Notification[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockNotifications;
};

const fetchUnreadCount = async (): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockNotifications.filter(n => !n.isRead).length;
};

const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`Marked notification ${id} as read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('Marked all notifications as read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  });

  return { 
    notifications: notifications || [], 
    isLoading, 
    error,
    markAsRead,
    markAllAsRead
  };
};

export { useNotifications };

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: fetchUnreadCount,
  });
};
