import { materials, type Material } from "../../shared/schema";
import { db } from "../config/database";
import { eq, and, like, desc } from "drizzle-orm";

export class MaterialService {
  async getMaterial(id: number): Promise<Material | undefined> {
    const [material] = await db.select().from(materials).where(eq(materials.id, id));
    return material || undefined;
  }

  async getMaterialsByDealerId(dealerId: number): Promise<Material[]> {
    return await db.select().from(materials)
      .where(eq(materials.dealerId, dealerId))
      .orderBy(desc(materials.createdAt));
  }

  async getAllMaterials(): Promise<Material[]> {
    return await db.select().from(materials).orderBy(desc(materials.createdAt));
  }

  async searchMaterials(filters: {
    dealerId?: number;
    category?: string;
    subcategory?: string;
    search?: string;
    inStock?: boolean;
  }): Promise<Material[]> {
    const conditions: any[] = [];

    if (filters.dealerId) {
      conditions.push(eq(materials.dealerId, filters.dealerId));
    }

    if (filters.category) {
      conditions.push(eq(materials.category, filters.category));
    }

    if (filters.subcategory) {
      conditions.push(eq(materials.subcategory, filters.subcategory));
    }

    if (filters.search) {
      conditions.push(like(materials.name, `%${filters.search}%`));
    }

    if (filters.inStock !== undefined) {
      conditions.push(eq(materials.inStock, filters.inStock));
    }

    const query = conditions.length > 0
      ? db.select().from(materials).where(and(...conditions))
      : db.select().from(materials);

    return await query.orderBy(desc(materials.createdAt));
  }

  async createMaterial(data: typeof materials.$inferInsert): Promise<Material> {
    const [material] = await db.insert(materials).values(data).returning();
    return material;
  }

  async updateMaterial(id: number, data: Partial<typeof materials.$inferInsert>): Promise<Material | undefined> {
    const [updated] = await db.update(materials)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(materials.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMaterial(id: number): Promise<boolean> {
    await db.delete(materials).where(eq(materials.id, id));
    return true;
  }
}

export const materialService = new MaterialService();
