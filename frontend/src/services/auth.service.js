// frontend/src/services/auth.service.js
import api from './api';

// --- התחברות וניתוק ---
export const patientLogin = async (credentials) => {
  const response = await api.post('/auth/patient-login', credentials);
  return response.data;
};

export const staffLogin = async (credentials) => {
  const response = await api.post('/auth/staff-login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// --- רישום מטופל באופן ציבורי (דו-שלבי) ---
export const patientPreRegister = async (data) => {
  const response = await api.post('/auth/patient-pre-register', data);
  return response.data;
};

export const patientCompleteRegister = async (data) => {
  const response = await api.post('/auth/patient-complete-register', data);
  return response.data;
};

// --- הפעלת חשבון צוות (רופא/אדמין) ע"י OTP ---
export const doctorPreActivate = async (data) => {
  const response = await api.post('/auth/doctor-pre-activate', data);
  return response.data;
};

export const doctorCompleteActivate = async (data) => {
  const response = await api.post('/auth/doctor-complete-activate', data);
  return response.data;
};

// --- פעולות מנהל (Admin) בלבד ---
export const staffRegister = async (data) => {
  const response = await api.post('/auth/staff-register', data);
  return response.data;
};

export const adminRegisterPatient = async (data) => {
  const response = await api.post('/auth/admin-register-patient', data);
  return response.data;
};