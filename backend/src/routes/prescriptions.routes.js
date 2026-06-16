import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getMyPrescriptions } from '../controllers/prescriptions.controller.js';

const router = Router();

router.get('/my', verifyToken, requireRole('patient'), getMyPrescriptions);

export default router;
