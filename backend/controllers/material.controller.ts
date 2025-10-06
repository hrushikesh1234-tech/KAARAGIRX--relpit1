import type { Request, Response } from "express";
import { materialService } from "../services/material.service";

export class MaterialController {
  async getAllMaterials(req: Request, res: Response) {
    try {
      const materials = await materialService.getAllMaterials();
      res.json(materials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      res.status(500).json({ error: 'Failed to fetch materials' });
    }
  }

  async getMaterial(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const material = await materialService.getMaterial(id);
      
      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }
      
      res.json(material);
    } catch (error) {
      console.error('Error fetching material:', error);
      res.status(500).json({ error: 'Failed to fetch material' });
    }
  }

  async getMaterialsByDealer(req: Request, res: Response) {
    try {
      const dealerId = parseInt(req.params.dealerId);
      const materials = await materialService.getMaterialsByDealerId(dealerId);
      res.json(materials);
    } catch (error) {
      console.error('Error fetching materials by dealer:', error);
      res.status(500).json({ error: 'Failed to fetch materials' });
    }
  }

  async searchMaterials(req: Request, res: Response) {
    try {
      const filters = {
        dealerId: req.query.dealerId ? parseInt(req.query.dealerId as string) : undefined,
        category: req.query.category as string,
        subcategory: req.query.subcategory as string,
        search: req.query.search as string,
        inStock: req.query.inStock === 'true' ? true : req.query.inStock === 'false' ? false : undefined,
      };

      const materials = await materialService.searchMaterials(filters);
      res.json(materials);
    } catch (error) {
      console.error('Error searching materials:', error);
      res.status(500).json({ error: 'Failed to search materials' });
    }
  }

  async createMaterial(req: Request, res: Response) {
    try {
      const material = await materialService.createMaterial(req.body);
      res.status(201).json(material);
    } catch (error) {
      console.error('Error creating material:', error);
      res.status(500).json({ error: 'Failed to create material' });
    }
  }

  async updateMaterial(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const material = await materialService.updateMaterial(id, req.body);
      
      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }
      
      res.json(material);
    } catch (error) {
      console.error('Error updating material:', error);
      res.status(500).json({ error: 'Failed to update material' });
    }
  }

  async deleteMaterial(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await materialService.deleteMaterial(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting material:', error);
      res.status(500).json({ error: 'Failed to delete material' });
    }
  }
}

export const materialController = new MaterialController();
