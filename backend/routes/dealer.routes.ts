import { Router } from "express";
import { dealerController } from "../controllers/dealer.controller";

const router = Router();

router.get('/', dealerController.getAllDealers.bind(dealerController));
router.get('/search', dealerController.searchDealers.bind(dealerController));
router.get('/category/:category', dealerController.getDealersByCategory.bind(dealerController));
router.get('/:id', dealerController.getDealer.bind(dealerController));
router.post('/', dealerController.createDealer.bind(dealerController));
router.put('/:id', dealerController.updateDealer.bind(dealerController));
router.delete('/:id', dealerController.deleteDealer.bind(dealerController));

export default router;
