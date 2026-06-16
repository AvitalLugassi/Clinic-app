import * as medicalRecordsService from '../services/medicalRecords.service.js';

export const createMedicalRecord = async (req, res) => {
    try {
        const { appointment_uuid, patient_id, doctor_id, visit_summary, diagnoses, prescriptions, referrals } = req.body;

        if (!appointment_uuid || !patient_id || !doctor_id || !visit_summary) {
            return res.status(400).json({ message: "שדות חובה חסרים ליצירת רשומה רפואיות" });
        }

        const savedRecord = await medicalRecordsService.createMedicalRecord({
            appointment_uuid,
            patient_id,
            doctor_id,
            visit_summary,
            diagnoses: diagnoses || [],
            prescriptions: prescriptions || [],
            referrals: referrals || []
        });

        return res.status(201).json({
            message: "הרשומה הרפואית נשמרה בהצלחה ב-MongoDB",
            recordId: savedRecord._id
        });
    } catch (error) {
        console.error("Error in createMedicalRecord:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "כבר קיימת רשומה רפואית עבור תור זה" });
        }
        return res.status(500).json({ message: "שגיאה בשמירת הרשומה הרפואית" });
    }
};

export const getPatientMedicalHistory = async (req, res) => {
    try {
        const { patient_id } = req.params;

        if (!patient_id) {
            return res.status(400).json({ message: "מזהה מטופל הוא שדה חובה" });
        }

        const history = await medicalRecordsService.getPatientMedicalHistory(patient_id);
        return res.status(200).json(history);
    } catch (error) {
        console.error("Error in getPatientMedicalHistory:", error);
        return res.status(500).json({ message: "שגיאה בשליפת ההיסטוריה הרפואית" });
    }
};