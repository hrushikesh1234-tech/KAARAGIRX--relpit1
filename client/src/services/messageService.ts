import { apiRequest } from '@/lib/queryClient';

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  text: string;
  status: 'sent' | 'delivered' | 'read';
  fileInfo?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
  createdAt: Date;
}

export interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  lastMessageAt: Date;
}

export const messageService = {
  async getMessages(currentUserId: number, otherUserId: number): Promise<{ conversationId: number; messages: Message[] }> {
    const res = await apiRequest('GET', `/api/messages/${otherUserId}?userId=${currentUserId}`);
    return res.json();
  },

  async sendMessage(currentUserId: number, otherUserId: number, text: string, fileInfo?: Message['fileInfo']): Promise<Message> {
    const res = await apiRequest('POST', '/api/messages', {
      userId: currentUserId,
      otherUserId,
      text,
      fileInfo,
    });
    return res.json();
  },

  async updateMessageStatus(messageId: number, status: 'sent' | 'delivered' | 'read'): Promise<Message> {
    const res = await apiRequest('PATCH', `/api/messages/${messageId}/status`, { status });
    return res.json();
  },
};
