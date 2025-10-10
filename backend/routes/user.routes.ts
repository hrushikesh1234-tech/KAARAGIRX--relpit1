import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUser.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));

export default router;
