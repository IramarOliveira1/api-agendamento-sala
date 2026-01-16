import { Router } from 'express';
import { roomController } from '../controllers/RoomController';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { isAdminMiddleware } from '../middleware/IsAdminMiddleware';

const router = Router();

router.post('/room/store', authMiddleware.handle, isAdminMiddleware.handle, roomController.store);
router.get('/room/list', authMiddleware.handle, isAdminMiddleware.handle, roomController.all);
router.get('/room/availableRoom', authMiddleware.handle, roomController.getAvailableRooms);
router.get('/room/:id', authMiddleware.handle, isAdminMiddleware.handle, roomController.show);
router.put('/room/:id', authMiddleware.handle, isAdminMiddleware.handle, roomController.update);

export default router;