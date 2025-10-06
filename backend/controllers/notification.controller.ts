import type { Request, Response } from "express";
import { notificationService } from "../services/notification.service";

export class NotificationController {
  async getNotificationsByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const notifications = await notificationService.getNotificationsByUserId(userId);
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  async createNotification(req: Request, res: Response) {
    try {
      const notification = await notificationService.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ error: 'Failed to create notification' });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const notification = await notificationService.markAsRead(id);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      res.json(notification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      await notificationService.markAllAsRead(userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  }

  async deleteNotification(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await notificationService.deleteNotification(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  }
}

export const notificationController = new NotificationController();
