import type { Request, Response } from "express";
import { orderService } from "../services/order.service";

export class OrderController {
  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const items = await orderService.getOrderItems(id);
      res.json({ ...order, items });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  async getOrdersByUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await orderService.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const { items, ...orderData } = req.body;
      
      const order = await orderService.createOrder(orderData);

      if (items && Array.isArray(items)) {
        for (const item of items) {
          await orderService.addOrderItem({
            ...item,
            orderId: order.id,
          });
        }
      }

      const orderItems = await orderService.getOrderItems(order.id);
      res.status(201).json({ ...order, items: orderItems });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderService.updateOrder(id, req.body);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: 'Failed to update order' });
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await orderService.deleteOrder(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ error: 'Failed to delete order' });
    }
  }
}

export const orderController = new OrderController();
