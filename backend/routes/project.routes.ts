import { Router } from "express";
import { projectController } from "../controllers/project.controller";

const router = Router();

router.get('/', projectController.getAllProjects.bind(projectController));
router.get('/professional/:professionalId', projectController.getProjectsByProfessional.bind(projectController));
router.get('/:id', projectController.getProject.bind(projectController));
router.post('/', projectController.createProject.bind(projectController));
router.put('/:id', projectController.updateProject.bind(projectController));
router.delete('/:id', projectController.deleteProject.bind(projectController));

export default router;
