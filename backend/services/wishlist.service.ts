import { wishlists, materials, rentalEquipment, type Wishlist } from "../../shared/schema";
import { db } from "../config/database";
import { eq, and, desc } from "drizzle-orm";

export class WishlistService {
  async getWishlistByUserId(userId: number): Promise<any[]> {
    const wishlistItems = await db
      .select({
        id: wishlists.id,
        userId: wishlists.userId,
        materialId: wishlists.materialId,
        equipmentId: wishlists.equipmentId,
        createdAt: wishlists.createdAt,
        material: materials,
        equipment: rentalEquipment,
      })
      .from(wishlists)
      .leftJoin(materials, eq(wishlists.materialId, materials.id))
      .leftJoin(rentalEquipment, eq(wishlists.equipmentId, rentalEquipment.id))
      .where(eq(wishlists.userId, userId))
      .orderBy(desc(wishlists.createdAt));

    return wishlistItems;
  }

  async addToWishlist(
    userId: number,
    materialId?: number,
    equipmentId?: number
  ): Promise<Wishlist> {
    const existing = await this.isInWishlist(userId, materialId, equipmentId);
    
    if (existing) {
      return existing;
    }

    const [wishlistItem] = await db
      .insert(wishlists)
      .values({
        userId,
        materialId: materialId || null,
        equipmentId: equipmentId || null,
      })
      .returning();
    
    return wishlistItem;
  }

  async removeFromWishlist(id: number): Promise<boolean> {
    await db.delete(wishlists).where(eq(wishlists.id, id));
    return true;
  }

  async isInWishlist(
    userId: number,
    materialId?: number,
    equipmentId?: number
  ): Promise<Wishlist | undefined> {
    const conditions: any[] = [eq(wishlists.userId, userId)];

    if (materialId) {
      conditions.push(eq(wishlists.materialId, materialId));
    }

    if (equipmentId) {
      conditions.push(eq(wishlists.equipmentId, equipmentId));
    }

    const [item] = await db
      .select()
      .from(wishlists)
      .where(and(...conditions));
    
    return item || undefined;
  }
}

export const wishlistService = new WishlistService();
