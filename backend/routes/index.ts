import type { Express } from "express";
import { Server } from "http";
import { createServer } from "http";
import authRoutes from "./auth.routes";
import professionalRoutes from "./professional.routes";
import projectRoutes from "./project.routes";
import dealerRoutes from "./dealer.routes";
import orderRoutes from "./order.routes";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use('/api/auth', authRoutes);
  app.use('/api/professionals', professionalRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/dealers', dealerRoutes);
  app.use('/api/orders', orderRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
