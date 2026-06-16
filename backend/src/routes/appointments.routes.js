import express from 'express';
import appointmentsController from '../controllers/appointments.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, appointmentsController.createAppointment);

router.patch('/:id/status', verifyToken, appointmentsController.updateAppointmentStatus);

router.get('/available-slots', verifyToken, appointmentsController.getDoctorAvailability);

router.get('/patient-appointments', verifyToken, appointmentsController.getPatientAppointments);

router.get('/doctor/:doctor_id', verifyToken, appointmentsController.getDoctorAppointments);

export default router;