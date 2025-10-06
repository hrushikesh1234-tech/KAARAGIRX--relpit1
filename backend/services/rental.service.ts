import { rentalEquipment, type RentalEquipment } from "../../shared/schema";
import { db } from "../config/database";
import { eq, and, like, desc } from "drizzle-orm";

export class RentalService {
  async getRentalEquipment(id: number): Promise<RentalEquipment | undefined> {
    const [equipment] = await db.select().from(rentalEquipment).where(eq(rentalEquipment.id, id));
    return equipment || undefined;
  }

  async getRentalEquipmentByMerchantId(merchantId: number): Promise<RentalEquipment[]> {
    return await db.select().from(rentalEquipment)
      .where(eq(rentalEquipment.merchantId, merchantId))
      .orderBy(desc(rentalEquipment.createdAt));
  }

  async getAllRentalEquipment(): Promise<RentalEquipment[]> {
    return await db.select().from(rentalEquipment).orderBy(desc(rentalEquipment.createdAt));
  }

  async searchRentalEquipment(filters: {
    category?: string;
    merchantId?: number;
    minRate?: number;
    maxRate?: number;
    condition?: string;
    search?: string;
  }): Promise<RentalEquipment[]> {
    const conditions: any[] = [];

    if (filters.category) {
      conditions.push(eq(rentalEquipment.category, filters.category));
    }

    if (filters.merchantId) {
      conditions.push(eq(rentalEquipment.merchantId, filters.merchantId));
    }

    if (filters.condition) {
      conditions.push(eq(rentalEquipment.condition, filters.condition as any));
    }

    if (filters.search) {
      conditions.push(like(rentalEquipment.name, `%${filters.search}%`));
    }

    const query = conditions.length > 0
      ? db.select().from(rentalEquipment).where(and(...conditions))
      : db.select().from(rentalEquipment);

    return await query.orderBy(desc(rentalEquipment.createdAt));
  }

  async createRentalEquipment(data: typeof rentalEquipment.$inferInsert): Promise<RentalEquipment> {
    const [equipment] = await db.insert(rentalEquipment).values(data).returning();
    return equipment;
  }

  async updateRentalEquipment(id: number, data: Partial<typeof rentalEquipment.$inferInsert>): Promise<RentalEquipment | undefined> {
    const [updated] = await db.update(rentalEquipment)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(rentalEquipment.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteRentalEquipment(id: number): Promise<boolean> {
    await db.delete(rentalEquipment).where(eq(rentalEquipment.id, id));
    return true;
  }
}

export const rentalService = new RentalService();
