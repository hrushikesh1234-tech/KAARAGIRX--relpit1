import type { Request, Response } from "express";
import { rentalService } from "../services/rental.service";

export class RentalController {
  async getAllRentalEquipment(req: Request, res: Response) {
    try {
      const equipment = await rentalService.getAllRentalEquipment();
      res.json(equipment);
    } catch (error) {
      console.error('Error fetching rental equipment:', error);
      res.status(500).json({ error: 'Failed to fetch rental equipment' });
    }
  }

  async getRentalEquipment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const equipment = await rentalService.getRentalEquipment(id);
      
      if (!equipment) {
        return res.status(404).json({ error: 'Rental equipment not found' });
      }
      
      res.json(equipment);
    } catch (error) {
      console.error('Error fetching rental equipment:', error);
      res.status(500).json({ error: 'Failed to fetch rental equipment' });
    }
  }

  async getRentalEquipmentByMerchant(req: Request, res: Response) {
    try {
      const merchantId = parseInt(req.params.merchantId);
      const equipment = await rentalService.getRentalEquipmentByMerchantId(merchantId);
      res.json(equipment);
    } catch (error) {
      console.error('Error fetching merchant equipment:', error);
      res.status(500).json({ error: 'Failed to fetch merchant equipment' });
    }
  }

  async searchRentalEquipment(req: Request, res: Response) {
    try {
      const filters = {
        category: req.query.category as string,
        merchantId: req.query.merchantId ? parseInt(req.query.merchantId as string) : undefined,
        minRate: req.query.minRate ? parseFloat(req.query.minRate as string) : undefined,
        maxRate: req.query.maxRate ? parseFloat(req.query.maxRate as string) : undefined,
        condition: req.query.condition as string,
        search: req.query.search as string,
        subcategory: req.query.subcategory as string,
      };

      const equipment = await rentalService.searchRentalEquipment(filters);
      res.json(equipment);
    } catch (error) {
      console.error('Error searching rental equipment:', error);
      res.status(500).json({ error: 'Failed to search rental equipment' });
    }
  }

  async createRentalEquipment(req: Request, res: Response) {
    try {
      const equipment = await rentalService.createRentalEquipment(req.body);
      res.status(201).json(equipment);
    } catch (error) {
      console.error('Error creating rental equipment:', error);
      res.status(500).json({ error: 'Failed to create rental equipment' });
    }
  }

  async updateRentalEquipment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const equipment = await rentalService.updateRentalEquipment(id, req.body);
      
      if (!equipment) {
        return res.status(404).json({ error: 'Rental equipment not found' });
      }
      
      res.json(equipment);
    } catch (error) {
      console.error('Error updating rental equipment:', error);
      res.status(500).json({ error: 'Failed to update rental equipment' });
    }
  }

  async deleteRentalEquipment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await rentalService.deleteRentalEquipment(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting rental equipment:', error);
      res.status(500).json({ error: 'Failed to delete rental equipment' });
    }
  }
}

export const rentalController = new RentalController();
