import { Router } from 'express';
import {
  patientPreRegister,
  patientCompleteRegister,
  staffRegister,
  adminRegisterPatient,
  patientLogin,
  staffLogin,
  logout,
  getMe,
  refreshToken,
} from '../controllers/auth.controller.js';
import { requestOtp, verifyOtp } from '../controllers/otp.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// התחברות
router.post('/patient-login', patientLogin);
router.post('/staff-login', staffLogin);
router.post('/logout', verifyToken, logout);
router.post('/refresh', refreshToken);
router.get('/me', verifyToken, getMe);

// רישום פציינט (דו-שלבי, ציבורי)
router.post('/patient-pre-register', patientPreRegister);
router.post('/patient-complete-register', patientCompleteRegister);

// רישום צוות + פציינט ע"י אדמין בלבד
router.post('/staff-register', verifyToken, requireRole('admin'), staffRegister);
router.post('/admin-register-patient', verifyToken, requireRole('admin'), adminRegisterPatient);

// OTP
router.post('/otp/request', verifyToken, requestOtp);
router.post('/otp/verify', verifyToken, verifyOtp);

export default router;
