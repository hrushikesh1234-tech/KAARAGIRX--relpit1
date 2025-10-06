import type { Request, Response } from "express";
import { wishlistService } from "../services/wishlist.service";

export class WishlistController {
  async getWishlistByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const wishlist = await wishlistService.getWishlistByUserId(userId);
      res.json(wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
  }

  async addToWishlist(req: Request, res: Response) {
    try {
      const { userId, materialId, equipmentId } = req.body;
      
      if (!userId || (!materialId && !equipmentId)) {
        return res.status(400).json({ 
          error: 'userId and either materialId or equipmentId are required' 
        });
      }

      const wishlistItem = await wishlistService.addToWishlist(
        userId,
        materialId,
        equipmentId
      );
      
      res.status(201).json(wishlistItem);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ error: 'Failed to add to wishlist' });
    }
  }

  async removeFromWishlist(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await wishlistService.removeFromWishlist(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
  }
}

export const wishlistController = new WishlistController();
