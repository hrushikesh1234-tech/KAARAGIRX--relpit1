import type { Express } from "express";
import { Server } from "http";
import { createServer } from "http";
import authRoutes from "./auth.routes";
import professionalRoutes from "./professional.routes";
import projectRoutes from "./project.routes";
import dealerRoutes from "./dealer.routes";
import orderRoutes from "./order.routes";
import messageRoutes from "./message.routes";
import materialRoutes from "./material.routes";
import rentalRoutes from "./rental.routes";
import bookingRoutes from "./booking.routes";
import wishlistRoutes from "./wishlist.routes";
import notificationRoutes from "./notification.routes";
import userRoutes from "./user.routes";
import uploadRoutes from "./upload.routes";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use('/api/auth', authRoutes);
  app.use('/api/professionals', professionalRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/dealers', dealerRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/materials', materialRoutes);
  app.use('/api/rental-equipment', rentalRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/bookmarks', wishlistRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/upload', uploadRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
