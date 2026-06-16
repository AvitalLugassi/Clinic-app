const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointments.controller');
// כאן בהמשך תוכלי לשלב את ה-Middleware של ה-Auth כדי להגן על הנתיבים
const { protect } = require('../middlewares/auth.middleware'); 

router.post('/', appointmentsController.createAppointment);

router.patch('/:id/status', appointmentsController.updateAppointmentStatus);

router.get('/available-slots', appointmentsController.getDoctorAvailability);

router.get('/patient-appointments', appointmentsController.getPatientAppointments);

module.exports = router;