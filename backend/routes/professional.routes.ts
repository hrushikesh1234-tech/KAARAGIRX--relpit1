import { Router } from "express";
import { professionalController } from "../controllers/professional.controller";

const router = Router();

router.get('/', professionalController.getAllProfessionals.bind(professionalController));
router.get('/search', professionalController.searchProfessionals.bind(professionalController));
router.get('/type/:type', professionalController.getProfessionalsByType.bind(professionalController));
router.get('/:id', professionalController.getProfessional.bind(professionalController));
router.post('/', professionalController.createProfessional.bind(professionalController));
router.put('/:id', professionalController.updateProfessional.bind(professionalController));

export default router;
