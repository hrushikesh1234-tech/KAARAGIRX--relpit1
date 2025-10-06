import { Router } from "express";
import { materialController } from "../controllers/material.controller";

const router = Router();

router.get('/', materialController.getAllMaterials.bind(materialController));
router.get('/search', materialController.searchMaterials.bind(materialController));
router.get('/dealer/:dealerId', materialController.getMaterialsByDealer.bind(materialController));
router.get('/:id', materialController.getMaterial.bind(materialController));
router.post('/', materialController.createMaterial.bind(materialController));
router.put('/:id', materialController.updateMaterial.bind(materialController));
router.delete('/:id', materialController.deleteMaterial.bind(materialController));

export default router;
