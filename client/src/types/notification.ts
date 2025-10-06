
export type NotificationType = 
  | 'system'
  | 'subscription'
  | 'feature'
  | 'promotion'
  | 'announcement';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}
