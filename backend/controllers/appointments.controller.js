const appointmentsService = require('../services/appointments.service');
const { CLINIC_START_TIME, CLINIC_END_TIME, SLOT_DURATION_MINUTES } = require('../config/clinic.config');
const { v4: uuidv4 } = require('uuid');

// 1. יצירת תור
const createAppointment = async (req, res) => {
    try {
        const { patient_id, doctor_id, scheduled_at } = req.body;

        if (!patient_id || !doctor_id || !scheduled_at) {
            return res.status(400).json({ message: "כל שדות החובה חייבים להיות מלאים" });
        }

        const appointment_uuid = uuidv4();
        const status = 'pending';
        const insertId = await appointmentsService.createAppointment(
            appointment_uuid, patient_id, doctor_id, scheduled_at, status
        );

        return res.status(201).json({
            message: "התור נוצר בהצלחה",
            appointmentId: insertId
        });
    } catch (error) {
        console.error("Error in createAppointment:", error);
        return res.status(500).json({ message: "שגיאה פנימית בשרת בעת יצירת התור" });
    }
};

// 2. שליפת שעות פנויות (כולל יצירת מערך השעות בצורה דינמית)
const getDoctorAvailability = async (req, res) => {
    try {
        const { doctor_id, date } = req.query;

        if (!doctor_id || !date) {
            return res.status(400).json({ message: "מזהה רופא ותאריך הם שדות חובה" });
        }

        const bookedSlots = await appointmentsService.getAvailableSlots(doctor_id, date);

        const allSlots = [];
        let current = CLINIC_START_TIME;
        const end = CLINIC_END_TIME;

        while (current < end) {
            allSlots.push(current);

            let [hours, minutes] = current.split(':').map(Number);
            minutes += SLOT_DURATION_MINUTES;

            if (minutes >= 60) {
                hours += Math.floor(minutes / 60);
                minutes = minutes % 60;
            }

            current = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }

        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        return res.status(200).json(availableSlots);

    } catch (error) {
        console.error("Error in getDoctorAvailability:", error);
        return res.status(500).json({ message: "שגיאה בשליפת השעות הפנויות" });
  }
};

// 3. עדכון סטטוס תור (חדש - תואם ל-Router)
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "סטטוס הוא שדה חובה" });
        }

        const success = await appointmentsService.updateAppointmentStatus(id, status);
        
        if (!success) {
            return res.status(404).json({ message: "התור לא נמצא" });
        }

        return res.status(200).json({ message: "סטטוס התור עודכן בהצלחה" });
    } catch (error) {
        console.error("Error in updateAppointmentStatus:", error);
        return res.status(500).json({ message: "שגיאה בעדכון סטטוס התור" });
    }
};

// 4. שליפת תורים של מטופל (חדש - תואם ל-Router)
const getPatientAppointments = async (req, res) => {
    try {
        // הערה: בשלב מתקדם ה-patient_id יגיע מה-Token (req.user.id), כרגע נביא אותו משרשור ה-Query לצורך בדיקה
        const { patient_id } = req.query; 

        if (!patient_id) {
            return res.status(400).json({ message: "מזהה מטופל הוא שדה חובה" });
        }

        const appointments = await appointmentsService.getPatientAppointments(patient_id);
        return res.status(200).json(appointments);
    } catch (error) {
        console.error("Error in getPatientAppointments:", error);
        return res.status(500).json({ message: "שגיאה בשליפת תורי המטופל" });
    }
};

module.exports = {
    createAppointment,
    getDoctorAvailability,
    updateAppointmentStatus,
    getPatientAppointments
};