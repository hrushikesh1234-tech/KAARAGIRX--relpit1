import { bookings, type Booking } from "../../shared/schema";
import { db } from "../config/database";
import { eq, and, desc } from "drizzle-orm";

export class BookingService {
  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookingsByMerchantId(merchantId: number): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.merchantId, merchantId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBookingsByEquipmentId(equipmentId: number): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.equipmentId, equipmentId))
      .orderBy(desc(bookings.createdAt));
  }

  async createBooking(data: typeof bookings.$inferInsert): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(data).returning();
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [updated] = await db.update(bookings)
      .set({ 
        status: status as any,
        updatedAt: new Date() 
      })
      .where(eq(bookings.id, id))
      .returning();
    return updated || undefined;
  }

  async updateBooking(id: string, data: Partial<typeof bookings.$inferInsert>): Promise<Booking | undefined> {
    const [updated] = await db.update(bookings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteBooking(id: string): Promise<boolean> {
    await db.delete(bookings).where(eq(bookings.id, id));
    return true;
  }
}

export const bookingService = new BookingService();
