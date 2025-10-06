// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  currentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.currentId = 1;
    this.createUser({
      username: "demouser",
      password: "password123",
      email: "demo@example.com",
      fullName: "Demo User",
      userType: "customer"
    });
    this.createUser({
      username: "john.smith",
      password: "Customer@123",
      email: "john.smith@example.com",
      fullName: "John Smith",
      userType: "customer"
    });
    this.createUser({
      username: "sarah.johnson",
      password: "Customer@456",
      email: "sarah.johnson@example.com",
      fullName: "Sarah Johnson",
      userType: "customer"
    });
    this.createUser({
      username: "contractor1",
      password: "password123",
      email: "contractor@example.com",
      fullName: "Demo Contractor",
      userType: "contractor"
    });
    this.createUser({
      username: "architect1",
      password: "password123",
      email: "architect@example.com",
      fullName: "Demo Architect",
      userType: "architect"
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmail(email) {
    const normalizedEmail = email.toLowerCase();
    console.log(`Looking for user with email: ${normalizedEmail}`);
    const allEmails = Array.from(this.users.values()).map((u) => u.email);
    console.log(`Available emails: ${allEmails.join(", ")}`);
    const user = Array.from(this.users.values()).find(
      (user2) => user2.email.toLowerCase() === normalizedEmail
    );
    if (user) {
      console.log(`Found user: ${user.username} with email: ${user.email}`);
    } else {
      console.log(`No user found with email: ${normalizedEmail}`);
    }
    return user;
  }
  async getMockUserByEmail(email) {
    return this.getUserByEmail(email);
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  async createUser(insertUser) {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    console.log(`Created new user with ID ${id}:`, {
      ...user,
      password: "***"
      // Hide password in logs
    });
    console.log("All users after creation:", Array.from(this.users.values()).map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      userType: u.userType
    })));
    return user;
  }
};
var storage = new MemStorage();

// server/routes.ts
import { z } from "zod";
var loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
var registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email(),
  fullName: z.string().min(2),
  userType: z.enum(["customer", "contractor", "architect"]),
  // Make all other fields optional
  companyName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string().optional(),
  experience: z.string().optional()
});
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      console.log("Registration request body:", { ...req.body, password: "***" });
      if (!["customer", "contractor", "architect"].includes(req.body.userType)) {
        console.log("Invalid userType:", req.body.userType);
        req.body.userType = "customer";
        console.log("Defaulting to userType: customer");
      }
      if (req.body.userType === "contractor" || req.body.userType === "architect") {
        console.log("Professional registration detected:", req.body.userType);
        if (!req.body.companyName) req.body.companyName = "";
        if (!req.body.experience) req.body.experience = "1-3";
      }
      console.log("Schema to validate:", registerSchema);
      try {
        const validatedData2 = registerSchema.parse(req.body);
        console.log("Validation successful:", { ...validatedData2, password: "***" });
      } catch (validationError) {
        console.error("Validation error:", validationError);
        return res.status(400).json({ message: "Validation failed", error: validationError });
      }
      const validatedData = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        console.log("Username already exists:", validatedData.username);
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        console.log("Email already exists:", validatedData.email);
        return res.status(400).json({ message: "Email already exists" });
      }
      console.log("Registering user with type:", validatedData.userType);
      const newUser = await storage.createUser(validatedData);
      console.log("Created user:", { ...newUser, password: "***" });
      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        userType: newUser.userType
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      console.log("Login request body:", { ...req.body, password: req.body.password ? "***" : void 0 });
      const { email, password } = loginSchema.parse(req.body);
      console.log(`Login attempt for email: ${email}`);
      const allUsers = await storage.getAllUsers();
      console.log(`Total registered users: ${allUsers.length}`);
      console.log("All registered users:", allUsers.map((u) => ({
        id: u.id,
        email: u.email,
        username: u.username,
        userType: u.userType
      })));
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log(`Login failed for email: ${email}, password: ${password}`);
        console.log(`Available user: No user found`);
        return res.status(401).json({ error: "Invalid credentials" });
      }
      console.log(`Found user: ${user.username}, userType: ${user.userType}`);
      if (user.password !== password) {
        console.log(`Password mismatch for user: ${user.username}`);
        console.log(`Expected: ${user.password}, Received: ${password}`);
        return res.status(401).json({ error: "Invalid credentials" });
      }
      console.log(`Login successful for user: ${user.username}, userType: ${user.userType}`);
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(`Validation error: ${JSON.stringify(error.errors)}`);
        return res.status(400).json({ error: error.errors });
      }
      console.log(`Login error: ${error}`);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.get("/api/auth/me", (req, res) => {
    res.status(401).json({ error: "Not authenticated" });
  });
  app2.post("/api/auth/logout", (req, res) => {
    res.json({ success: true });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var __dirname = process.cwd();
var vite_config_default = defineConfig({
  plugins: [
    react()
    // Only include basic plugins for production compatibility
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    port: 5177,
    strictPort: false,
    hmr: {
      port: 5177,
      protocol: "ws"
    },
    watch: {
      usePolling: false,
      ignored: ["**/node_modules/**", "**/dist/**"]
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["@radix-ui/react-*"]
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/dashboard")) {
      try {
        const clientTemplate = path2.resolve(
          import.meta.dirname,
          "..",
          "client",
          "index.html"
        );
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`
        );
        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
      return;
    }
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    log(`Warning: Build directory not found at ${distPath}. Running in development mode.`, "warn");
    return;
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:5174", "https://kaaragirx.shop"];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});
app.use((err, req, res, next) => {
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
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
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
    const port = process.env.NODE_ENV === "production" ? 3001 : process.env.PORT || 3001;
    server.listen(Number(port), "0.0.0.0", () => {
      log(`Server running on http://0.0.0.0:${port}`);
      log(`Vite dev server running on http://localhost:5174`);
    });
  } catch (error) {
    log(`Failed to start server: ${error}`, "error");
    process.exit(1);
  }
})();
