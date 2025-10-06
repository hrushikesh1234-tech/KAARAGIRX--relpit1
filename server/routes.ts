import type { Express, Request, Response } from "express";
import { Server } from "http";
import { createServer } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, User } from "../shared/schema";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Create a more flexible registration schema that only requires the essential fields
const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email(),
  fullName: z.string().min(2),
  userType: z.enum(['customer', 'contractor', 'architect']),
  // Make all other fields optional
  companyName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string().optional(),
  experience: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      console.log('Registration request body:', { ...req.body, password: '***' });
      
      // Ensure userType is one of the allowed values
      if (!['customer', 'contractor', 'architect'].includes(req.body.userType)) {
        console.log('Invalid userType:', req.body.userType);
        req.body.userType = 'customer'; // Default to customer if invalid
        console.log('Defaulting to userType: customer');
      }
      
      // For professional registrations (contractor/architect), make sure we have all required fields
      if (req.body.userType === 'contractor' || req.body.userType === 'architect') {
        console.log('Professional registration detected:', req.body.userType);
        
        // Set default values for any missing fields to prevent validation errors
        if (!req.body.companyName) req.body.companyName = '';
        if (!req.body.experience) req.body.experience = '1-3';
      }
      
      // Log the schema before validation
      console.log('Schema to validate:', registerSchema);
      
      try {
        const validatedData = registerSchema.parse(req.body);
        console.log('Validation successful:', { ...validatedData, password: '***' });
      } catch (validationError) {
        console.error('Validation error:', validationError);
        return res.status(400).json({ message: 'Validation failed', error: validationError });
      }
      
      const validatedData = registerSchema.parse(req.body);
      
      // Check if username exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        console.log('Username already exists:', validatedData.username);
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Check if email exists
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        console.log('Email already exists:', validatedData.email);
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      // Log the user type being registered
      console.log('Registering user with type:', validatedData.userType);
      
      const newUser = await storage.createUser(validatedData);
      
      // Log the created user to verify user type
      console.log('Created user:', { ...newUser, password: '***' });
      
      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        userType: newUser.userType,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      console.log('Login request body:', { ...req.body, password: req.body.password ? '***' : undefined });
      
      const { email, password } = loginSchema.parse(req.body);
      
      console.log(`Login attempt for email: ${email}`);
      
      // Get all users and log them for debugging
      const allUsers = await storage.getAllUsers();
      console.log(`Total registered users: ${allUsers.length}`);
      console.log('All registered users:', allUsers.map((u: User) => ({ 
        id: u.id,
        email: u.email, 
        username: u.username, 
        userType: u.userType 
      })));
      
      // Find the user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        console.log(`Login failed for email: ${email}, password: ${password}`);
        console.log(`Available user: No user found`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      console.log(`Found user: ${user.username}, userType: ${user.userType}`);
      
      // Check password
      if (user.password !== password) {
        console.log(`Password mismatch for user: ${user.username}`);
        console.log(`Expected: ${user.password}, Received: ${password}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Login successful
      console.log(`Login successful for user: ${user.username}, userType: ${user.userType}`);
      
      // Ensure the correct user type is returned
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(`Validation error: ${JSON.stringify(error.errors)}`);
        return res.status(400).json({ error: error.errors });
      }
      console.log(`Login error: ${error}`);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    // In a real app, we'd check the session
    // For now, we'll just return unauthorized
    res.status(401).json({ error: 'Not authenticated' });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    // In a real app, we'd clear the session
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
