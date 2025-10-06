import type { Request, Response } from "express";
import { dealerService } from "../services/dealer.service";

export class DealerController {
  async getAllDealers(req: Request, res: Response) {
    try {
      const dealers = await dealerService.getAllDealers();
      res.json(dealers);
    } catch (error) {
      console.error('Error fetching dealers:', error);
      res.status(500).json({ error: 'Failed to fetch dealers' });
    }
  }

  async getDealer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const dealer = await dealerService.getDealer(id);
      
      if (!dealer) {
        return res.status(404).json({ error: 'Dealer not found' });
      }
      
      res.json(dealer);
    } catch (error) {
      console.error('Error fetching dealer:', error);
      res.status(500).json({ error: 'Failed to fetch dealer' });
    }
  }

  async getDealerByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const dealer = await dealerService.getDealerByUserId(userId);
      
      if (!dealer) {
        return res.status(404).json({ error: 'Dealer not found' });
      }
      
      res.json(dealer);
    } catch (error) {
      console.error('Error fetching dealer by user ID:', error);
      res.status(500).json({ error: 'Failed to fetch dealer' });
    }
  }

  async getDealersByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const { subcategory } = req.query;
      
      const dealers = await dealerService.getDealersByCategory(
        category,
        subcategory as string | undefined
      );
      
      res.json(dealers);
    } catch (error) {
      console.error('Error fetching dealers by category:', error);
      res.status(500).json({ error: 'Failed to fetch dealers' });
    }
  }

  async searchDealers(req: Request, res: Response) {
    try {
      const filters = {
        category: req.query.category as string,
        subcategory: req.query.subcategory as string,
        location: req.query.location as string,
        search: req.query.search as string,
      };

      const dealers = await dealerService.searchDealers(filters);
      res.json(dealers);
    } catch (error) {
      console.error('Error searching dealers:', error);
      res.status(500).json({ error: 'Failed to search dealers' });
    }
  }

  async createDealer(req: Request, res: Response) {
    try {
      const dealer = await dealerService.createDealer(req.body);
      res.status(201).json(dealer);
    } catch (error) {
      console.error('Error creating dealer:', error);
      res.status(500).json({ error: 'Failed to create dealer' });
    }
  }

  async updateDealer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const dealer = await dealerService.updateDealer(id, req.body);
      
      if (!dealer) {
        return res.status(404).json({ error: 'Dealer not found' });
      }
      
      res.json(dealer);
    } catch (error) {
      console.error('Error updating dealer:', error);
      res.status(500).json({ error: 'Failed to update dealer' });
    }
  }

  async deleteDealer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dealerService.deleteDealer(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting dealer:', error);
      res.status(500).json({ error: 'Failed to delete dealer' });
    }
  }
}

export const dealerController = new DealerController();
