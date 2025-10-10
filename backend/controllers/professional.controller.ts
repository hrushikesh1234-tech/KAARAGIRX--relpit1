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
      const { profession, limit, featured } = req.query;
      
      if (profession || limit || featured) {
        const filters: any = {};
        if (profession) filters.profession = profession as string;
        if (limit) filters.limit = parseInt(limit as string);
        if (featured) filters.featured = featured === 'true';
        
        const professionals = await professionalService.searchProfessionals(filters);
        return res.json(professionals);
      }
      
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

  async getReviewsByProfessionalId(req: Request, res: Response) {
    try {
      const professionalId = parseInt(req.params.id);
      const reviews = await professionalService.getProfessionalReviews(professionalId);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews by professional ID:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  async createReview(req: Request, res: Response) {
    try {
      const professionalId = parseInt(req.params.id);
      const userId = (req.user as any)?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { rating, comment } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const review = await professionalService.createReview(professionalId, userId, rating, comment || '');
      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  }

  async followProfessional(req: Request, res: Response) {
    try {
      const professionalId = parseInt(req.params.id);
      const userId = (req.user as any)?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get the professional to find their userId
      const professional = await professionalService.getProfessional(professionalId);
      
      if (!professional) {
        return res.status(404).json({ error: 'Professional not found' });
      }

      // Don't allow following yourself
      if (userId === professional.userId) {
        return res.status(400).json({ error: 'Cannot follow yourself' });
      }

      // Check if already following
      const isFollowing = await professionalService.isFollowing(userId, professional.userId);
      if (isFollowing) {
        return res.status(400).json({ error: 'Already following this professional' });
      }

      const follow = await professionalService.followUser(userId, professional.userId);
      const followerCount = await professionalService.getFollowerCount(professional.userId);
      
      res.status(201).json({ 
        success: true, 
        follow,
        followerCount
      });
    } catch (error) {
      console.error('Error following professional:', error);
      res.status(500).json({ error: 'Failed to follow professional' });
    }
  }

  async unfollowProfessional(req: Request, res: Response) {
    try {
      const professionalId = parseInt(req.params.id);
      const userId = (req.user as any)?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get the professional to find their userId
      const professional = await professionalService.getProfessional(professionalId);
      
      if (!professional) {
        return res.status(404).json({ error: 'Professional not found' });
      }

      await professionalService.unfollowUser(userId, professional.userId);
      const followerCount = await professionalService.getFollowerCount(professional.userId);
      
      res.json({ 
        success: true,
        followerCount
      });
    } catch (error) {
      console.error('Error unfollowing professional:', error);
      res.status(500).json({ error: 'Failed to unfollow professional' });
    }
  }

  async checkFollowStatus(req: Request, res: Response) {
    try {
      const professionalId = parseInt(req.params.id);
      const userId = (req.user as any)?.id;
      
      if (!userId) {
        return res.json({ isFollowing: false, followerCount: 0 });
      }

      // Get the professional to find their userId
      const professional = await professionalService.getProfessional(professionalId);
      
      if (!professional) {
        return res.status(404).json({ error: 'Professional not found' });
      }

      const isFollowing = await professionalService.isFollowing(userId, professional.userId);
      const followerCount = await professionalService.getFollowerCount(professional.userId);
      
      res.json({ 
        isFollowing,
        followerCount
      });
    } catch (error) {
      console.error('Error checking follow status:', error);
      res.status(500).json({ error: 'Failed to check follow status' });
    }
  }
}

export const professionalController = new ProfessionalController();
