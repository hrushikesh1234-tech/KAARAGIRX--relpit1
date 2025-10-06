import type { Express } from "express";
import { Server } from "http";
import { createServer } from "http";
import authRoutes from "./auth.routes";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use('/api/auth', authRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
