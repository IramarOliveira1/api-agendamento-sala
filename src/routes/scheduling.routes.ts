import { Router } from 'express';
import { schedulingController } from '../controllers/SchedulingController';
import { authMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

router.post('/scheduling/store', authMiddleware.handle, schedulingController.store);
router.get('/scheduling/list', authMiddleware.handle, schedulingController.all);
router.put('/scheduling/status/:id', authMiddleware.handle, schedulingController.updateStatus);

export default router;