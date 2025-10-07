import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./utils/vite";
import { sessionConfig } from "./config/session";
import passport from "./config/passport";
import path from 'path';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5174', 'https://kaaragirx.shop'];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  log(`Error: ${message}`, "error");
  res.status(status).json({ message });
  
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = process.env.NODE_ENV === "production" ? 3001 : (process.env.PORT || 3001);
    server.listen(Number(port), "0.0.0.0", () => {
      log(`Server running on http://0.0.0.0:${port}`);
      log(`Vite dev server running on http://localhost:5174`);
    });
  } catch (error) {
    log(`Failed to start server: ${error}`, "error");
  }
})();
