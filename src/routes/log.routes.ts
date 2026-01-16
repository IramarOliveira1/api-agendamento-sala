import { Router } from 'express';
import { logController } from '../controllers/LogController';
import { authMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

router.get('/log/index', authMiddleware.handle, logController.index);

export default router;