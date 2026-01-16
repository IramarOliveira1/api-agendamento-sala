import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

router.post('/login', authController.login);
router.get('/me', authMiddleware.handle, authController.me);

export default router;
