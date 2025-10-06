import type { Request, Response } from "express";
import { bookingService } from "../services/booking.service";

export class BookingController {
  async getBooking(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const booking = await bookingService.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  }

  async getBookingsByMerchant(req: Request, res: Response) {
    try {
      const merchantId = parseInt(req.params.merchantId);
      const bookings = await bookingService.getBookingsByMerchantId(merchantId);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching merchant bookings:', error);
      res.status(500).json({ error: 'Failed to fetch merchant bookings' });
    }
  }

  async getBookingsByUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const bookings = await bookingService.getBookingsByUserId(userId);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({ error: 'Failed to fetch user bookings' });
    }
  }

  async getBookingsByEquipment(req: Request, res: Response) {
    try {
      const equipmentId = parseInt(req.params.equipmentId);
      const bookings = await bookingService.getBookingsByEquipmentId(equipmentId);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching equipment bookings:', error);
      res.status(500).json({ error: 'Failed to fetch equipment bookings' });
    }
  }

  async createBooking(req: Request, res: Response) {
    try {
      const booking = await bookingService.createBooking(req.body);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  async updateBookingStatus(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const booking = await bookingService.updateBookingStatus(id, status);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ error: 'Failed to update booking status' });
    }
  }

  async updateBooking(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const booking = await bookingService.updateBooking(id, req.body);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ error: 'Failed to update booking' });
    }
  }

  async deleteBooking(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await bookingService.deleteBooking(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ error: 'Failed to delete booking' });
    }
  }
}

export const bookingController = new BookingController();
