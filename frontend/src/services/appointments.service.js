import api from './api';

/**
 * יצירת תור חדש במערכת
 * @param {Object} appointmentData - מכיל: patient_id, doctor_id, scheduled_at
 */
export const createAppointment = async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
};

/**
 * שליפת כל התורים של פציינט ספציפי
 * @param {number} patientId 
 */
export const getPatientAppointments = async (patientId) => {
  const response = await api.get(`/appointments/patient/${patientId}`);
  return response.data;
};

/**
 * שליפת כל התורים של רופא ספציפי
 * @param {number} doctorId 
 */
export const getAppointmentsByDoctor = async (doctorId) => {
  const response = await api.get(`/appointments/doctor/${doctorId}`);
  return response.data;
};

/**
 * עדכון סטטוס של תור (למשל: 'confirmed', 'cancelled', 'completed')
 * @param {number} id - מפתח ראשי של התור
 * @param {string} status 
 */
export const updateAppointmentStatus = async (id, status) => {
  const response = await api.patch(`/appointments/${id}/status`, { status });
  return response.data;
};

/**
 * שליפת שעות פנויות של רופא ביום מסוים (מניעת כפילויות וקריאות סרק)
 * @param {number} doctorId 
 * @param {string} date - פורמט YYYY-MM-DD
 */
export const getDoctorAvailability = async (doctorId, date) => {
  const response = await api.get('/appointments/available-slots', {
    params: { doctorId, date }
  });
  return response.data;
};

/**
 * מחיקת/ביטול תור מהמערכת
 * @param {number} id 
 */
export const deleteAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};