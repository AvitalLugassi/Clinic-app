import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getMyDashboard, getAllDoctors } from '../controllers/doctors.controller.js';

const router = Router();

router.get('/me/dashboard', verifyToken, requireRole('doctor'), getMyDashboard);
router.get('/', verifyToken, getAllDoctors);

export default router;
