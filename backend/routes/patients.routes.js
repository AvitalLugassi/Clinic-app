import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getMyDashboard } from '../controllers/patients.controller.js';

const router = Router();

router.get('/me/dashboard', verifyToken, requireRole('patient'), getMyDashboard);

export default router;
