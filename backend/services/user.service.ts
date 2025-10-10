import { users, type User, type InsertUser } from "../../shared/schema";
import { db } from "../config/database";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export class UserService {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = email.toLowerCase();
    const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
        email: insertUser.email.toLowerCase(),
      })
      .returning();
    return user;
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateUser(id: number, data: Partial<typeof users.$inferInsert>): Promise<User | undefined> {
    const updateData = { ...data };
    delete updateData.password;
    
    const [updated] = await db.update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated || undefined;
  }
}

export const userService = new UserService();
