import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";

const router = Router();

router.get('/:userId', notificationController.getNotificationsByUserId.bind(notificationController));
router.post('/', notificationController.createNotification.bind(notificationController));
router.put('/:id/read', notificationController.markAsRead.bind(notificationController));
router.put('/user/:userId/read-all', notificationController.markAllAsRead.bind(notificationController));
router.delete('/:id', notificationController.deleteNotification.bind(notificationController));

export default router;
