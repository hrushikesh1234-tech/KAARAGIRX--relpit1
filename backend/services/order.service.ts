import { orders, orderItems, type Order, type OrderItem } from "../../shared/schema";
import { db } from "../config/database";
import { eq, desc, and, or } from "drizzle-orm";

export class OrderService {
  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async createOrder(data: typeof orders.$inferInsert): Promise<Order> {
    const [order] = await db.insert(orders).values(data).returning();
    return order;
  }

  async updateOrder(id: string, data: Partial<typeof orders.$inferInsert>): Promise<Order | undefined> {
    const [updated] = await db.update(orders)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updated || undefined;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async addOrderItem(data: typeof orderItems.$inferInsert): Promise<OrderItem> {
    const [item] = await db.insert(orderItems).values(data).returning();
    return item;
  }

  async deleteOrder(id: string): Promise<boolean> {
    await db.delete(orders).where(eq(orders.id, id));
    return true;
  }

  async getOrdersByDealerId(dealerId: number): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.dealerId, dealerId))
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order | undefined> {
    const [updated] = await db.update(orders)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();
    return updated || undefined;
  }

  async confirmFromDealer(orderId: string): Promise<Order | undefined> {
    const order = await this.getOrder(orderId);
    if (!order) return undefined;

    const updateData: any = { dealerConfirmed: true, updatedAt: new Date() };
    
    if (order.customerConfirmed) {
      updateData.status = 'verified';
    }

    const [updated] = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning();
    return updated || undefined;
  }

  async confirmFromCustomer(orderId: string): Promise<Order | undefined> {
    const order = await this.getOrder(orderId);
    if (!order) return undefined;

    const updateData: any = { customerConfirmed: true, updatedAt: new Date() };
    
    if (order.dealerConfirmed) {
      updateData.status = 'verified';
    }

    const [updated] = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning();
    return updated || undefined;
  }

  async getPendingOrders(): Promise<Order[]> {
    return await db.select().from(orders)
      .where(
        and(
          eq(orders.status, 'pending'),
          or(
            eq(orders.dealerConfirmed, false),
            eq(orders.customerConfirmed, false)
          )
        )
      )
      .orderBy(desc(orders.createdAt));
  }

  async getConfirmedOrders(): Promise<Order[]> {
    return await db.select().from(orders)
      .where(
        and(
          eq(orders.dealerConfirmed, true),
          eq(orders.customerConfirmed, true)
        )
      )
      .orderBy(desc(orders.createdAt));
  }
}

export const orderService = new OrderService();
