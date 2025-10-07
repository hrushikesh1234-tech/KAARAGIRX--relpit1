import { rentalEquipment, professionals, type RentalEquipment } from "../../shared/schema";
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
    subcategory?: string;
  }): Promise<any[]> {
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

    if (filters.subcategory) {
      conditions.push(eq(rentalEquipment.subcategory, filters.subcategory));
    }

    const query = conditions.length > 0
      ? db.select({
          id: rentalEquipment.id,
          merchantId: rentalEquipment.merchantId,
          name: rentalEquipment.name,
          category: rentalEquipment.category,
          subcategory: rentalEquipment.subcategory,
          description: rentalEquipment.description,
          dailyRate: rentalEquipment.dailyRate,
          weeklyRate: rentalEquipment.weeklyRate,
          monthlyRate: rentalEquipment.monthlyRate,
          securityDeposit: rentalEquipment.securityDeposit,
          quantity: rentalEquipment.quantity,
          available: rentalEquipment.available,
          image: rentalEquipment.image,
          images: rentalEquipment.images,
          specifications: rentalEquipment.specifications,
          condition: rentalEquipment.condition,
          minRentalPeriod: rentalEquipment.minRentalPeriod,
          createdAt: rentalEquipment.createdAt,
          merchantName: professionals.companyName,
          merchantLocation: professionals.location,
          merchantRating: professionals.rating,
          merchantReviewCount: professionals.reviewCount,
        })
        .from(rentalEquipment)
        .leftJoin(professionals, eq(rentalEquipment.merchantId, professionals.id))
        .where(and(...conditions))
      : db.select({
          id: rentalEquipment.id,
          merchantId: rentalEquipment.merchantId,
          name: rentalEquipment.name,
          category: rentalEquipment.category,
          subcategory: rentalEquipment.subcategory,
          description: rentalEquipment.description,
          dailyRate: rentalEquipment.dailyRate,
          weeklyRate: rentalEquipment.weeklyRate,
          monthlyRate: rentalEquipment.monthlyRate,
          securityDeposit: rentalEquipment.securityDeposit,
          quantity: rentalEquipment.quantity,
          available: rentalEquipment.available,
          image: rentalEquipment.image,
          images: rentalEquipment.images,
          specifications: rentalEquipment.specifications,
          condition: rentalEquipment.condition,
          minRentalPeriod: rentalEquipment.minRentalPeriod,
          createdAt: rentalEquipment.createdAt,
          merchantName: professionals.companyName,
          merchantLocation: professionals.location,
          merchantRating: professionals.rating,
          merchantReviewCount: professionals.reviewCount,
        })
        .from(rentalEquipment)
        .leftJoin(professionals, eq(rentalEquipment.merchantId, professionals.id));

    const result = await query.orderBy(desc(rentalEquipment.createdAt));
    
    return result.map((item: any) => ({
      ...item,
      supplier: item.merchantName || 'Unknown',
      location: item.merchantLocation || 'Unknown',
      price: `₹${Number(item.dailyRate || 0).toLocaleString('en-IN')}`,
      period: 'day',
      rating: Number(item.merchantRating || 0),
      reviews: item.merchantReviewCount || 0,
      availability: (item.available && item.available > 0) ? 'Available' : 'Rented',
      features: item.specifications ? Object.entries(item.specifications).map(([key, value]) => `${key}: ${value}`) : []
    }));
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
