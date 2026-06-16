import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getMyPrescriptions, addPrescription } from '../controllers/prescriptions.controller.js';

const router = Router();

router.get('/my', verifyToken, requireRole('patient','staff','doctor','admin'), getMyPrescriptions);
router.post('/', verifyToken, requireRole('doctor','admin'), addPrescription);

export default router;
