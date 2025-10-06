import type { Request, Response } from "express";
import { professionalService } from "../services/professional.service";
import { z } from "zod";

const createProfessionalSchema = z.object({
  userId: z.number(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string().optional(),
  profession: z.enum(['contractor', 'architect']),
  experience: z.number().optional(),
  profileImage: z.string().optional(),
  about: z.string().optional(),
  location: z.string().optional(),
  specializations: z.array(z.string()).optional(),
  responseTime: z.string().optional(),
});

export class ProfessionalController {
  async getAllProfessionals(req: Request, res: Response) {
    try {
      const professionals = await professionalService.getAllProfessionals();
      res.json(professionals);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      res.status(500).json({ error: 'Failed to fetch professionals' });
    }
  }

  async getProfessional(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const professional = await professionalService.getProfessional(id);
      
      if (!professional) {
        return res.status(404).json({ error: 'Professional not found' });
      }

      const projects = await professionalService.getProfessionalProjects(id);
      const reviews = await professionalService.getProfessionalReviews(id);
      
      res.json({ ...professional, projects, reviews });
    } catch (error) {
      console.error('Error fetching professional:', error);
      res.status(500).json({ error: 'Failed to fetch professional' });
    }
  }

  async getProfessionalByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const professional = await professionalService.getProfessionalByUserId(userId);
      
      if (!professional) {
        return res.status(404).json({ error: 'Professional not found' });
      }
      
      res.json(professional);
    } catch (error) {
      console.error('Error fetching professional by user ID:', error);
      res.status(500).json({ error: 'Failed to fetch professional' });
    }
  }

  async getProfessionalsByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      if (type !== 'contractor' && type !== 'architect') {
        return res.status(400).json({ error: 'Invalid professional type' });
      }
      
      const professionals = await professionalService.getProfessionalsByType(type);
      res.json(professionals);
    } catch (error) {
      console.error('Error fetching professionals by type:', error);
      res.status(500).json({ error: 'Failed to fetch professionals' });
    }
  }

  async searchProfessionals(req: Request, res: Response) {
    try {
      const filters = {
        profession: req.query.profession as string,
        location: req.query.location as string,
        specialization: req.query.specialization as string,
        search: req.query.search as string,
      };

      const professionals = await professionalService.searchProfessionals(filters);
      res.json(professionals);
    } catch (error) {
      console.error('Error searching professionals:', error);
      res.status(500).json({ error: 'Failed to search professionals' });
    }
  }

  async createProfessional(req: Request, res: Response) {
    try {
      const validatedData = createProfessionalSchema.parse(req.body);
      const professional = await professionalService.createProfessional(validatedData);
      res.status(201).json(professional);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating professional:', error);
      res.status(500).json({ error: 'Failed to create professional' });
    }
  }

  async updateProfessional(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const professional = await professionalService.updateProfessional(id, req.body);
      
      if (!professional) {
        return res.status(404).json({ error: 'Professional not found' });
      }
      
      res.json(professional);
    } catch (error) {
      console.error('Error updating professional:', error);
      res.status(500).json({ error: 'Failed to update professional' });
    }
  }

  async getReviewsByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const reviews = await professionalService.getReviewsByUserId(userId);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews by user ID:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }
}

export const professionalController = new ProfessionalController();
