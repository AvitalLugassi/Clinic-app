import api from './api';

/**
 * שליפת הפרופיל האישי של המטופל הנוכחי (מתוך ה-SQL)
 * @param {number} id - מזהה המטופל
 */
export const getMyDashboard = async () => {
  const response = await api.get('/patients/me/dashboard');
  return response.data;
};

export const getPatientById = async (id) => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

/**
 * עדכון פרטים אישיים של המטופל (טלפון, כתובת וכו')
 * @param {number} id 
 * @param {Object} profileData 
 */
export const updatePatientProfile = async (id, profileData) => {
  const response = await api.put(`/patients/${id}`, profileData);
  return response.data;
};

/**
 * שליפת רשימת כל המטופלים במערכת (עבור אנשי צוות / אדמין בלבד)
 * כולל אפשרות לסינון וחיפוש יעיל למניעת עומס רשת
 * @param {Object} filters - מכיל למשל: search (ת"ז או שם), page, limit
 */
export const getAllPatients = async (filters = {}) => {
  const response = await api.get('/patients', { params: filters });
  return response.data;
};

/**
 * שליפת התיק הרפואי המלא של המטופל (מתוך ה-MongoDB)
 * כולל היסטוריית אבחנות, ביקורים ומרשמים
 * @param {number} patientId 
 */
export const getMedicalRecord = async (patientId) => {
  const response = await api.get(`/patients/${patientId}/medical-record`);
  return response.data;
};

/**
 * הוספת רשומה רפואית חדשה לתיק (אבחנה, טיפול, הערות רופא) - מיועד לרופאים
 * @param {number} patientId 
 * @param {Object} recordData 
 */
export const addMedicalRecordEntry = async (patientId, recordData) => {
  const response = await api.post(`/patients/${patientId}/medical-record`, recordData);
  return response.data;
};
