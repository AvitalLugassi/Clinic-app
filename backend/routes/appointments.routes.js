import express from 'express';
import appointmentsController from '../controllers/appointments.controller.js';
import { protect } from '../middleware/auth.middleware.js'; // הוספנו את ה-Middleware של האימות 

const router = express.Router();

router.post('/', appointmentsController.createAppointment);

router.patch('/:id/status', appointmentsController.updateAppointmentStatus);

router.get('/available-slots', appointmentsController.getDoctorAvailability);

router.get('/patient-appointments', appointmentsController.getPatientAppointments);

router.get('/doctor/:doctor_id', appointmentsController.getDoctorAppointments);

export default router;