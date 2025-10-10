import { Router } from "express";
import { professionalController } from "../controllers/professional.controller";

const router = Router();

router.get('/', professionalController.getAllProfessionals.bind(professionalController));
router.get('/search', professionalController.searchProfessionals.bind(professionalController));
router.get('/type/:type', professionalController.getProfessionalsByType.bind(professionalController));
router.get('/user/:userId', professionalController.getProfessionalByUserId.bind(professionalController));
router.get('/reviews/user/:userId', professionalController.getReviewsByUserId.bind(professionalController));
router.get('/:id/reviews', professionalController.getReviewsByProfessionalId.bind(professionalController));
router.post('/:id/reviews', professionalController.createReview.bind(professionalController));
router.get('/:id/follow-status', professionalController.checkFollowStatus.bind(professionalController));
router.post('/:id/follow', professionalController.followProfessional.bind(professionalController));
router.delete('/:id/follow', professionalController.unfollowProfessional.bind(professionalController));
router.get('/:id', professionalController.getProfessional.bind(professionalController));
router.post('/', professionalController.createProfessional.bind(professionalController));
router.put('/:id', professionalController.updateProfessional.bind(professionalController));

export default router;
