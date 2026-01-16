import { Router } from 'express';
import { clientController } from '../controllers/ClientController';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { isAdminMiddleware } from '../middleware/IsAdminMiddleware';

const router = Router();

router.post('/clients/store', clientController.store);
router.get('/clients/list', authMiddleware.handle, isAdminMiddleware.handle, clientController.all);
router.get('/clients/:id', authMiddleware.handle, clientController.show);
router.put('/clients/:id', authMiddleware.handle, clientController.update);
router.put('/clients/status/:id', authMiddleware.handle, clientController.updateStatus);

export default router;