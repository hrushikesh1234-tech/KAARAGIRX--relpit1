import { Request, Response } from 'express';
import { messageService } from '../services/message.service';
import { z } from 'zod';

const createMessageSchema = z.object({
  otherUserId: z.number(),
  text: z.string().min(1),
  fileInfo: z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    url: z.string(),
  }).optional(),
});

class MessageController {
  async getConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const conversations = await messageService.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const otherUserId = parseInt(req.params.otherUserId);
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (isNaN(otherUserId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const conversation = await messageService.getOrCreateConversation(userId, otherUserId);
      const messages = await messageService.getConversationMessages(conversation.id);

      res.json({
        conversationId: conversation.id,
        messages,
      });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { otherUserId, text, fileInfo } = createMessageSchema.parse(req.body);

      const conversation = await messageService.getOrCreateConversation(userId, otherUserId);

      const message = await messageService.createMessage({
        conversationId: conversation.id,
        senderId: userId,
        text,
        fileInfo,
        status: 'sent',
      });

      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }

  async updateMessageStatus(req: Request, res: Response) {
    try {
      const messageId = parseInt(req.params.messageId);
      const { status } = req.body;

      if (isNaN(messageId)) {
        return res.status(400).json({ error: 'Invalid message ID' });
      }

      if (!['sent', 'delivered', 'read'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const message = await messageService.updateMessageStatus(messageId, status);
      res.json(message);
    } catch (error) {
      console.error('Update message status error:', error);
      res.status(500).json({ error: 'Failed to update message status' });
    }
  }
}

export const messageController = new MessageController();
