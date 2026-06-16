import api from './api'; // ייבוא של אובייקט ה-axios המרכזי שלך

/**
 * יצירת רשומה רפואית חדשה (סיכום מפגש) בסיום ביקור על ידי הרופא
 * @param {Object} recordData - מכיל: appointment_uuid, patient_id, doctor_id, visit_summary, diagnoses, prescriptions, referrals
 */
export const createMedicalRecord = async (recordData) => {
  const response = await api.post('/medical-records', recordData);
  return response.data;
};

/**
 * שליפת כל ההיסטוריה הרפואית (התיק הרפואי המלא) של מטופל ספציפי מ-MongoDB
 * @param {number} patientId - מזהה המטופל מה-SQL שמקשר לרשומות במונגו
 */
export const getPatientMedicalHistory = async (patientId) => {
  const response = await api.get(`/medical-records/patient/${patientId}`);
  return response.data;
};