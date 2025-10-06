import { dealers, type Dealer } from "../../shared/schema";
import { db } from "../config/database";
import { eq, and, like, desc } from "drizzle-orm";

export class DealerService {
  async getDealer(id: number): Promise<Dealer | undefined> {
    const [dealer] = await db.select().from(dealers).where(eq(dealers.id, id));
    return dealer || undefined;
  }

  async getDealerByCode(dealerCode: string): Promise<Dealer | undefined> {
    const [dealer] = await db.select().from(dealers).where(eq(dealers.dealerCode, dealerCode));
    return dealer || undefined;
  }

  async getAllDealers(): Promise<Dealer[]> {
    return await db.select().from(dealers).orderBy(desc(dealers.rating));
  }

  async getDealersByCategory(category: string, subcategory?: string): Promise<Dealer[]> {
    const conditions: any[] = [eq(dealers.category, category)];
    
    if (subcategory) {
      conditions.push(eq(dealers.subcategory, subcategory));
    }

    return await db.select().from(dealers)
      .where(and(...conditions))
      .orderBy(desc(dealers.rating));
  }

  async searchDealers(filters: {
    category?: string;
    subcategory?: string;
    location?: string;
    search?: string;
  }): Promise<Dealer[]> {
    const conditions: any[] = [];

    if (filters.category) {
      conditions.push(eq(dealers.category, filters.category));
    }

    if (filters.subcategory) {
      conditions.push(eq(dealers.subcategory, filters.subcategory));
    }

    if (filters.location) {
      conditions.push(like(dealers.location, `%${filters.location}%`));
    }

    if (filters.search) {
      conditions.push(like(dealers.name, `%${filters.search}%`));
    }

    const query = conditions.length > 0
      ? db.select().from(dealers).where(and(...conditions))
      : db.select().from(dealers);

    return await query.orderBy(desc(dealers.rating));
  }

  async createDealer(data: typeof dealers.$inferInsert): Promise<Dealer> {
    const [dealer] = await db.insert(dealers).values(data).returning();
    return dealer;
  }

  async updateDealer(id: number, data: Partial<typeof dealers.$inferInsert>): Promise<Dealer | undefined> {
    const [updated] = await db.update(dealers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(dealers.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteDealer(id: number): Promise<boolean> {
    await db.delete(dealers).where(eq(dealers.id, id));
    return true;
  }
}

export const dealerService = new DealerService();
