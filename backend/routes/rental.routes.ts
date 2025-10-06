import { Router } from "express";
import { rentalController } from "../controllers/rental.controller";

const router = Router();

router.get('/', rentalController.getAllRentalEquipment.bind(rentalController));
router.get('/search', rentalController.searchRentalEquipment.bind(rentalController));
router.get('/merchant/:merchantId', rentalController.getRentalEquipmentByMerchant.bind(rentalController));
router.get('/:id', rentalController.getRentalEquipment.bind(rentalController));
router.post('/', rentalController.createRentalEquipment.bind(rentalController));
router.put('/:id', rentalController.updateRentalEquipment.bind(rentalController));
router.delete('/:id', rentalController.deleteRentalEquipment.bind(rentalController));

export default router;
