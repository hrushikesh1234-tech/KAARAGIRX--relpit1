import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getMockUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Add a demo user for testing
    this.createUser({
      username: "demouser",
      password: "password123",
      email: "demo@example.com",
      fullName: "Demo User",
      userType: "customer"
    });
    
    // Add two customer accounts for real use
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
    
    // Add a contractor for testing
    this.createUser({
      username: "contractor1",
      password: "password123",
      email: "contractor@example.com",
      fullName: "Demo Contractor",
      userType: "contractor"
    });
    
    // Add an architect for testing
    this.createUser({
      username: "architect1",
      password: "password123",
      email: "architect@example.com",
      fullName: "Demo Architect",
      userType: "architect"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    // Convert email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();
    
    // Log the email being searched for
    console.log(`Looking for user with email: ${normalizedEmail}`);
    
    // Log all available emails for debugging
    const allEmails = Array.from(this.users.values()).map(u => u.email);
    console.log(`Available emails: ${allEmails.join(', ')}`);
    
    // Find user with case-insensitive email comparison
    const user = Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === normalizedEmail
    );
    
    if (user) {
      console.log(`Found user: ${user.username} with email: ${user.email}`);
    } else {
      console.log(`No user found with email: ${normalizedEmail}`);
    }
    
    return user;
  }

  async getMockUserByEmail(email: string): Promise<User | undefined> {
    // This is kept for backward compatibility
    return this.getUserByEmail(email);
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Log the newly created user for debugging
    console.log(`Created new user with ID ${id}:`, {
      ...user,
      password: '***' // Hide password in logs
    });
    
    // Log all users after creation for debugging
    console.log('All users after creation:', Array.from(this.users.values()).map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      userType: u.userType
    })));
    
    return user;
  }
}

export const storage = new MemStorage();
