import { Router } from "express";
import { wishlistController } from "../controllers/wishlist.controller";

const router = Router();

router.get('/:userId', wishlistController.getWishlistByUserId.bind(wishlistController));
router.post('/', wishlistController.addToWishlist.bind(wishlistController));
router.delete('/:id', wishlistController.removeFromWishlist.bind(wishlistController));

export default router;
