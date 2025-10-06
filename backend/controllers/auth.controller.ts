import type { Request, Response } from "express";
import { z } from "zod";
import { userService } from "../services/user.service";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email(),
  fullName: z.string().min(2),
  userType: z.enum(['customer', 'contractor', 'architect']),
  companyName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string().optional(),
  experience: z.string().optional(),
});

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      console.log('Registration request body:', { ...req.body, password: '***' });
      
      if (!['customer', 'contractor', 'architect'].includes(req.body.userType)) {
        console.log('Invalid userType:', req.body.userType);
        req.body.userType = 'customer';
        console.log('Defaulting to userType: customer');
      }
      
      if (req.body.userType === 'contractor' || req.body.userType === 'architect') {
        console.log('Professional registration detected:', req.body.userType);
        if (!req.body.companyName) req.body.companyName = '';
        if (!req.body.experience) req.body.experience = '1-3';
      }
      
      const validatedData = registerSchema.parse(req.body);
      
      const existingUser = await userService.getUserByUsername(validatedData.username);
      if (existingUser) {
        console.log('Username already exists:', validatedData.username);
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      const existingEmail = await userService.getUserByEmail(validatedData.email);
      if (existingEmail) {
        console.log('Email already exists:', validatedData.email);
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      console.log('Registering user with type:', validatedData.userType);
      const newUser = await userService.createUser(validatedData);
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
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      console.log('Login request body:', { ...req.body, password: req.body.password ? '***' : undefined });
      
      const { email, password } = loginSchema.parse(req.body);
      console.log(`Login attempt for email: ${email}`);
      
      const allUsers = await userService.getAllUsers();
      console.log(`Total registered users: ${allUsers.length}`);
      console.log('All registered users:', allUsers.map(u => ({ 
        id: u.id,
        email: u.email, 
        username: u.username, 
        userType: u.userType 
      })));
      
      const user = await userService.getUserByEmail(email);
      
      if (!user) {
        console.log(`Login failed for email: ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      console.log(`Found user: ${user.username}, userType: ${user.userType}`);
      
      if (user.password !== password) {
        console.log(`Password mismatch for user: ${user.username}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      console.log(`Login successful for user: ${user.username}, userType: ${user.userType}`);
      
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
  }

  async me(req: Request, res: Response) {
    res.status(401).json({ error: 'Not authenticated' });
  }

  async logout(req: Request, res: Response) {
    res.json({ success: true });
  }
}

export const authController = new AuthController();
